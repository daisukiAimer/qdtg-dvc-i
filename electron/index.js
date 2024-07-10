// https://github.com/nodejs/node-gyp/issues/702#issuecomment-489286744
// import path from 'path'

import os from "os";

const path = require("path");

const si = require('systeminformation');

// const logger = require('./log');
// import logger from './log'

import { insertRecord } from "./db/table";

import * as db from "./db/table";

const {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  protocol,
  Menu,
  session,
} = require("electron");
const fs = require("fs");
const fsPromises = require("fs/promises");
const ffmpeg = require("fluent-ffmpeg");
const crypto = require("crypto");
const moment = require("moment");

import { getLogicaldisk } from "./logicaldisk";
import { checkVersion, upgrade } from "./upgrade";

import * as dd from "./dd-for-win/dd";
import packageInfo from "../package.json";
const { error, info, default: ElectronLog } = require("electron-log");

// const ffprobePath = path.join(__dirname, '../ffmpeg/ffprobe.exe')
// const ffprobePath = path.join(__dirname, '/ffmpeg/ffprobe.exe')
const ffprobePath = path.join(process.cwd(), "/extraFiles/ffmpeg/ffprobe.exe");

ffmpeg.setFfprobePath(ffprobePath);

ElectronLog.info(
  "VITE_HTTP_HOST=================",
  import.meta.env.VITE_HTTP_HOST
);

const createWindow = () => {
  const partition = "persist:example";
  const ses = session.fromPartition(partition);

  // protocol.registerFileProtocol('media', (request, callback) => {
  ses.protocol.registerFileProtocol(
    "media",
    (request, callback) => {
      // const url = request.url.substr(7)
      const url = request.url.substr(8);
      console.log("protocol.registerFileProtocol url ", url);
      callback(decodeURI(path.normalize(url)));
    },
    (error) => {
      if (error) console.error("Failed to register protocol", error);
    }
  );

  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    minHeight: 800,
    minWidth: 1000,
    icon: path.join(process.cwd(), "/extraFiles/img/app.png"), // 窗口的图标
    webPreferences: {
      //   preload: path.join(__dirname, "preload.js"),
      preload: path.join(app.getAppPath(), "electron/preload.js"),
      partition,
      devTools: false,
    },
    frame: false,
    maximizable: false
    // transparent : true,
  });



  // 监听窗口最大化和取消最大化事件
/*  win.on('maximize', () => {
    // 在这里可以阻止窗口的最大化操作
    win.unmaximize()
  })

  win.on('unmaximize', () => {
    // 在这里可以阻止窗口取消最大化操作
  })*/

  if (process.env.NODE_ENV !== "development") {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  } else {
    win.loadURL(`${process.env["VITE_DEV_SERVER_URL"]}`);
    setTimeout(() => {
      win.webContents.openDevTools();
    }, 50);
  }

  const contents = win.webContents;

  ipcMain.handle("getLogicaldisk", (event) => {
    return getLogicaldisk();
  });

  ipcMain.handle("openFileDialog", (event, title) => {
    return dialog.showOpenDialog(win, {
      // defaultPath: 'C:\\Users\\fanjun\\Downloads\\test',
      defaultPath: "C:\\Users\\fanjun\\Downloads",
      properties: ["openDirectory"],
    });
  });

  const readDir = async (filePath, resArr, count) => {
    count++;
    const readdirRes = await fsPromises.readdir(filePath);
    console.log("filePath", readdirRes, count);
    for (const filename of readdirRes) {
      const filedir = path.join(filePath, filename);
      const stat = fs.statSync(filedir);
      if (stat.isFile()) {
        //获取文件的后缀名
        const extname = path.extname(filedir);
        if (extname.toLowerCase() === ".mp4") {
          const data = {
            filename: filename,
            extname: extname,
            playing: false,
          };

          data["stat"] = stat;
          const result = await new Promise((resolve, reject) => {
            /*ffmpeg.ffprobe(filedir, (err, metadata) => {
                            resolve(metadata)
                        })*/

            try {
              ffmpeg.ffprobe(filedir, (err, metadata) => {
                resolve(metadata);
              });
            } catch (e) {
              console.error("ffmpeg.ffprobe.......", e);
            }
          });

          if (result) {
            data["metadata"] = result;
            data["fileState"] = "常规";
          } else {
            data["fileState"] = "损坏";
          }

          resArr.push(data);
        }
      } else if (stat.isDirectory() && count < 3) {
        console.log(
          "stat.isDirectory() && count < 3",
          stat.isDirectory(),
          count
        );
        await readDir(filedir, resArr, count);
      }
    }
  };

  ipcMain.handle("getDirInfo", async (event, filePaths) => {
    const filePath = filePaths[0];
    const resArr = [];
    await readDir(filePath, resArr, 0);
    return resArr;
  });


  ipcMain.handle("openFileDialog1", (event, title) => {

    return new Promise((resolve, reject) => {
      dialog
        .showOpenDialog(win, {
          defaultPath: "C:\\Users\\fanjun\\Downloads",
          properties: ["openDirectory"],
        })
        .then((result) => {
          if (!result.canceled) {
            // result.filePaths[0] = 'E:\\幻灯片'
            fs.readdir(result.filePaths[0], (err, files) => {
              const resArr = [];
              files.forEach((filename) => {
                const filedir = path.join(result.filePaths[0], filename);
                const stats = fs.statSync(filedir);
                console.log(stats);
                // 是否是文件
                const isFile = stats.isFile();
                if (isFile) {
                  resArr.push(filedir);
                  console.log(resArr);
                }
              });
              // resolve(files)
              resolve(resArr);
            });
          }
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  });

  ipcMain.handle("winClose", (event) => {
    win.close();
  });

  ipcMain.handle("winMinimize", (event) => {
    win.minimize();
  });

  ipcMain.handle("exportFileV2", async (event, files) => {
    files = JSON.parse(files);
    const dirList = dialog.showOpenDialogSync(win, {
      defaultPath: app.getPath("downloads"),
      properties: ["openDirectory"],
    });

    if (!dirList) return Promise.reject(new Error("取消保存"));

    const promiseList = [];

    console.log("li", files, "li");
    const videoSize = files.reduce((a, b) => a + b.stat.size, 0);
    ElectronLog.info("所有视频总大小", videoSize);

    /** 已保存的视频总大小 */
    let writeSize = 0;

    files.forEach((item) => {
      const p = new Promise((resolve) => {
        const readStream = fs.createReadStream(item.metadata.format.filename);
        const writeStream = fs.createWriteStream(
          `${dirList[0]}\\${item.filename}`
        );
        readStream.pipe(writeStream);
        readStream
          .on("data", (chunk) => {
            writeSize += chunk.length;

            win.webContents.send(
              "exportV2-progress",
              ((writeSize / videoSize) * 100).toFixed(2)
            );
          })
          .on("end", () => {
            readStream.close();
          });
        writeStream.on("finish", resolve);
      });
      promiseList.push(p);
    });

    return await Promise.all(promiseList);
  });

  ipcMain.handle("exportFile", async (event, files) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      defaultPath: app.getPath("downloads"),
      properties: ["openDirectory", "createDirectory"],
    });

    if (!canceled) {
      for (const file of files) {
        await new Promise((resolve, reject) => {
          try {
            const readStream = fs.createReadStream(
              file.metadata.format.filename
            );
            const writeStream = fs.createWriteStream(
              `${filePaths}\\${file.filename}`
            );

            readStream.pipe(writeStream);
            writeStream.on("finish", () => {
              info("写入已完成====================");
              resolve();
            });

            console.log(
              `${file.metadata.format.filename} was copied to ${filePaths}\\${file.filename}`
            );
          } catch (e) {
            error("export video faild");
          }
        });
      }
    }

    return {
      canceled,
      filePaths,
    };
  });

  ipcMain.handle("insertRecord", (event, data) => {
    return insertRecord(event, data);
  });

  ipcMain.handle("selectById", (event, id) => {
    return db.selectById(id);
  });

  ipcMain.handle("selectRecordOperationTime", (event, page) => {
    return db.selectRecordOperationTime(page);
  });

  ipcMain.handle("selectRecordByOperationTime", (event, operationTime) => {
    return db.selectRecordByOperationTime(operationTime);
  });

  ipcMain.handle("insertBacktrackRecord", (event, data) => {
    return db.insertBacktrackRecord(data);
  });

  ipcMain.handle("selectBacktrackRecord", (event, page) => {
    return db.selectBacktrackRecord(page);
  });

  ipcMain.handle("getFileHash", async (event, file) => {
    const hash = crypto.createHash("SHA1");

    // const fd = await fsPromises.open('C:\\Users\\fanjun\\Downloads\\test\\cp\\【那些野田洋次郎为别人写的歌】 aimer 酸欠少女 Chara Adieu  上白石萌音 ハナレグ - 1.Aimer—蝶々結び(Av975423577,P1).mp4')
    const fd = await fsPromises.open(file);
    const stream = fd.createReadStream();

    stream.on("data", (chunk) => {
      hash.update(chunk, "utf8");
    });

    const sha1 = await new Promise((resolve, reject) => {
      stream.on("end", () => {
        const sha1 = hash.digest("hex");
        resolve(sha1);
      });
    });
    console.log("getFileHash sha1", sha1);
    return sha1;
  });

  // ipcMain.handle('exportPdf', async (_event, data) => {
  ipcMain.handle("exportPdf", async (_event, dataArr) => {
    ElectronLog.info(dataArr);
    let dir = dialog.showOpenDialogSync(win, {
      title: "请选择保存地址",
      defaultPath: app.getPath("videos"),
      properties: ["openDirectory"],
    });
    if (!dir) return Promise.reject(new Error("取消保存"));

    dir = dir.map((s) => s.trim());

    win.webContents.send("export-progress", "generating PDF...");

    for (const data of dataArr) {
      let path = dir[0] + "\\" + data.name.trim();

      path = path.replace(/\s+(?=\\)|(?<=\\)\s+/g, "");

      try {
        await fsPromises.mkdir(path);
      } catch (e) {}

      if (dir) {
        const getHtml = (arr) => {
          let html = ``;
          for (const item of arr) {
            // for (let i = 0; i < 150; i++) {
            //     const item = arr[0]
            html += `<tr style="border: 1px solid black;">
                        <td style="border: 1px solid black; padding-left: 10px; color: #2e75b5;">${
                          item.name
                        }</td>
                        <td style="border: 1px solid black; padding-left: 10px; color: #2e75b5;">${
                          item.duration
                        }</td>
                        <td style="border: 1px solid black; padding-left: 10px; color: #2e75b5;">${
                          item.size
                        }</td>
                        <td style="border: 1px solid black; padding-left: 10px; color: #2e75b5;">${
                          item.state === "常规" ? "convention" : "damage"
                        }</td>
                        <td style="border: 1px solid black; padding-left: 10px; color: #2e75b5;">${
                          item.hash
                        }</td>
                      </tr>`;
          }
          return html;
        };

        const date = new Date();
        const time =
          date.getFullYear() +
          "/" +
          (date.getMonth() + 1) +
          "/" +
          date.getDate() +
          " " +
          date.getHours() +
          ":" +
          date.getMinutes() +
          ":" +
          date.getSeconds();



        const osInfo = await si.osInfo()


        const html = `<div>
                            <div>
                            <div style="text-align: center; line-height: 30px; font-family: SourceHanSansSC; margin-top: 40px;
                              font-weight: 700;
                              font-size: 20px;">Moebius Technology(Singapore) PTE. LTD-S.T.O.R.M</div>
                            <div style="text-align: center; line-height: 30px; font-family: SourceHanSansSC; margin-top: 20px; 
                              font-weight: 700;
                              font-size: 20px;">MTM-Video  Forensics  For  Removable  Devices</div>
                            <div style="text-align: center;
                             line-height: 30px;
                             font-family: SourceHanSansSC;
                              font-weight: 400;
                              font-size: 16px;         
                              ">Report Generation Time：${time}</div>
                              </div>
                            
                            <div style="font-family: SourceHanSansSC;
                                font-weight: 700;
                                font-size: 20px;
                                font-style: normal;
                                letter-spacing: 0;
                                line-height: 40px;">
                              <div style="margin-bottom: 20px;">1.	Case Information</div>
                              <div style="margin-bottom: 40px;">
                                <table style="border: 1px solid black; border-collapse: collapse; width: 100%">
                                  <tr style="border: 1px solid black;">
                                    <td style="border: 1px solid black; width: 100px; text-align: center;">Name Of Evidence</td>
                                    <td style="border: 1px solid black; width: 100px; padding-left: 10px; color: #2e75b5;">${
                                      data.name
                                    }</td>
                                  </tr>
                                  <tr style="border: 1px solid black;">
                                    <td style="border: 1px solid black; width: 100px; text-align: center;">Authentication Time</td>
                                    <td style="border: 1px solid black; width: 100px; padding-left: 10px; color: #2e75b5;">${moment(
                                      data.time
                                    ).format("YYYY-MM-DD HH:mm:ss")}</td>
                                  </tr>
                                  
                                  <tr style="border: 1px solid black;">
                                    <td style="border: 1px solid black; width: 100px; text-align: center;">Certificator</td>
                                    <td style="border: 1px solid black; width: 100px; padding-left: 10px; color: #2e75b5;">${
                                      data.operator
                                    }</td>
                                  </tr>
                                  
                                  
                                  <tr style="border: 1px solid black;">
                                    <td style="border: 1px solid black; width: 100px; text-align: center;">Authentication Equipment</td>
                                    <td style="border: 1px solid black; width: 100px; padding-left: 10px; color: #2e75b5;">
                                    <div>Equipment Name: ${os.hostname()}</div>
                                    <div>Processer: ${os.cpus()[0].model}</div>
                                    <div>Belt RAM: ${Math.ceil(os.totalmem() / 1024 / 1024 / 1024)} GB</div>
                                    </td>
                                  </tr>
                                           
                                 <tr style="border: 1px solid black;">
                                    <td style="border: 1px solid black; width: 100px; text-align: center;">Operating System</td>
                                    <td style="border: 1px solid black; width: 100px; padding-left: 10px; color: #2e75b5;">
                                    ${osInfo.distro}
                                    </td>
                                  </tr>
                                                                    
                                                                    <tr style="border: 1px solid black;">
                                    <td style="border: 1px solid black; width: 100px; text-align: center;">Authentication Software Name</td>
                                    <td style="border: 1px solid black; width: 100px; padding-left: 10px; color: #2e75b5;">MTM-Video Forensics For Removable Devices</td>
                                  </tr>
                                  
                                  <tr style="border: 1px solid black;">
                                    <td style="border: 1px solid black; width: 100px; text-align: center;">Authentication Software Version</td>
                                    <td style="border: 1px solid black; width: 100px; padding-left: 10px; color: #2e75b5;">${packageInfo.version}</td>
                                  </tr>
                                  
                                  <tr style="border: 1px solid black;">
                                    <td style="border: 1px solid black; width: 100px; text-align: center;">Other Information</td>
                                    <td style="border: 1px solid black; width: 100px; padding-left: 10px; color: #2e75b5;">${
                                      data.otherInformation
                                    }</td>
                                  </tr>
                                </table>
                              </div>

                              <div style="margin-bottom: 20px;">2.	Evidence List</div>
                              <div>
                                <table style="border: 1px solid black; border-collapse: collapse; width: 100%">
                                  <tr style="border: 1px solid black;">
                                    <th style="border: 1px solid black; width: 100px; text-align: center;">Video Name</th>
                                    <th style="border: 1px solid black; width: 100px; text-align: center;">Duration</th>
                                    <th style="border: 1px solid black; width: 100px; text-align: center;">Video Size</th>
                                    <th style="border: 1px solid black; width: 100px; text-align: center;">State</th>
                                    <th style="border: 1px solid black; width: 100px; text-align: center;">Check Information</th>
                                  </tr>
                                  ${getHtml(data.videoList)}
                                </table>
                              </div>
                            </div>
                          </div>`;

        let pdfWindow = new BrowserWindow({
          webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            enableRemoteModule: true,
          },
          show: false, // 如果不想显示窗口可以改为false
          width: 800,
          height: 600,
          fullscreenable: true,
          minimizable: false,
          // frame: false,
          title: "导出固证报告",
        });

        // pdfWindow.loadURL(`data:text/html;charset=utf-8,${encodeURI(html)}`)
        pdfWindow.loadURL(
          `data:text/html;charset=utf-8,${encodeURIComponent(html)}`
        );
        await new Promise((resolve, reject) => {
          pdfWindow.webContents.on("did-finish-load", () => {
            pdfWindow.webContents
              .printToPDF({
                printBackground: true,
              })
              .then((fileData) => {
                win.webContents.send("export-progress", "saveing PDF...");
                fs.writeFile(
                  path + "\\" + data.name.trim() + ".pdf",
                  fileData,
                  (error) => {
                    if (error) throw error;
                    pdfWindow.close(); // 保存pdf过后关闭该窗口
                    pdfWindow = null;
                    resolve();
                  }
                );
              })
              .catch((error) => {});
          });
        });

        const videoSize = data.videoList.reduce((a, b) => a + b.size, 0);
        ElectronLog.info("所有视频总大小", videoSize);

        /** 已保存的视频总大小 */
        let writeSize = 0;

        for (const file of data.videoList) {
          await new Promise((resolve, reject) => {
            try {
              ElectronLog.info("开始写入", `${path}\\${file.name}`);
              const readStream = fs.createReadStream(file.path);
              const writeStream = fs.createWriteStream(`${path}\\${file.name}`);
              const total = fs.statSync(file.path).size;

              ElectronLog.info("文件大小", total);
              readStream.pipe(writeStream);
              readStream
                .on("data", (chunk) => {
                  writeSize += chunk.length;

                  win.webContents.send(
                    "export-progress",
                    ((writeSize / videoSize) * 100).toFixed(2) + "%"
                  );
                })
                .on("end", () => {
                  readStream.close();
                });

              writeStream.on("finish", () => {
                ElectronLog.info(`${file.name}写入已完成`);
                writeStream.close();
                resolve();
              });
            } catch (e) {
              ElectronLog.error(e.message);
            }
          });
        }
      }
    }
  });

  ipcMain.handle("dd", (event, diskPartition, outDir) => {
    return new Promise((resolve, reject) => {
      dd(
        diskPartition,
        outDir,
        (data) => {
          // contents.send('dd-stdout', data)
          event.sender.send("dd-stdout", data);
        },
        (err) => {
          event.sender.send("dd-stderr", err);
        },
        (code) => {
          event.sender.send("dd-close", code);
          resolve();
        }
      );
    });
  });

  ipcMain.handle("getDDOutDir", (event) => {
    return dialog.showOpenDialog(win, {
      properties: ["openDirectory"],
    });
  });

  ipcMain.handle("generateMachineId", (event) => {
    const networkInterfaces = os.networkInterfaces();
    const macAddresses = Object.values(networkInterfaces)
        .flat()
        .filter((iface) => iface.mac && iface.mac !== '00:00:00:00:00:00')
        .map((iface) => iface.mac)
        .join('');

    const hash = crypto.createHash('sha256');
    hash.update(macAddresses);
    return hash.digest('hex');
  });


  ipcMain.handle("getDeviceInfo", (event) => {
    let str = `Equipment Name: ${os.hostname()}, Processer: ${os.cpus()[0].model}, Belt RAM: ${Math.ceil(os.totalmem() / 1024 / 1024 / 1024)} GB`
    return str
  });

};

function openUpgradeWindow(uri) {
  const upgradeWin = new BrowserWindow({
    frame: false,
    width: 600,
    show: false,
    height: 120,
    resizable: false,
    minimizable: false,
    maximizable: false,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(app.getAppPath(), "electron/preload.js"),
    },
  });

  upgradeWin.webContents.once("did-finish-load", () => {
    upgradeWin.show();
    upgrade(upgradeWin, uri)
      .then(() => {
        ElectronLog.info("更新完成，重启APP");
        app.relaunch();
        app.exit();
      })
      .catch((reason) => {
        ElectronLog.error(`软件更新失败, ${reason.message}`);
      });
  });

  if (process.env.NODE_ENV !== "development") {
    upgradeWin.loadURL(path.join(__dirname, "../dist/upgrade.html"));
  } else {
    upgradeWin.loadURL(`${process.env["VITE_DEV_SERVER_URL"]}/upgrade.html`);
  }
}


/*app.whenReady().then(() => {
  ElectronLog.info("在主进程中访问import.meta.env.MODE", import.meta.env.MODE);

  if (import.meta.env.MODE === "development") {
    createWindow();
    return;
  }

  checkVersion().then((value) => {
    if (value === "same") {
      createWindow();
    } else {
      const index = dialog.showMessageBoxSync({
        message: "haved new versions, confirm upgrade?",
        buttons: ["no", "yes"],
      });

      ElectronLog.info(index);

      if (index === 0) {
        //
        createWindow();
      }

      if (index === 1) {
        ElectronLog.info(value);
        openUpgradeWindow(`${import.meta.env.VITE_HTTP_HOST}${value}`);
      }
    }
  });
});*/


app.whenReady().then(() => {
  ElectronLog.info("在主进程中访问import.meta.env.MODE", import.meta.env.MODE);

  if (import.meta.env.MODE === "development") {
    createWindow();
    return;
  }

  checkVersion().then((value) => {
    if (value === "same") {
      createWindow();
    } else {
      const index = dialog.showMessageBoxSync({
        message: "haved new versions, confirm upgrade?",
        buttons: ["no", "yes"],
      });

      ElectronLog.info(index);

      if (index === 0) {
        //
        createWindow();
      }

      if (index === 1) {
        ElectronLog.info(value);
        openUpgradeWindow(`${import.meta.env.VITE_HTTP_HOST}${value}`);
      }
    }
  });
});