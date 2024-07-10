/* eslint-disable import/no-extraneous-dependencies */

import ElectronLog from "electron-log";

import { throttle } from "lodash";
import { app } from "electron";

const request = require("request");
const axios = require("axios");
const AdmZip = require("adm-zip");

/**
 * 版本号对比
 * @param {string} version1 - 新版本号
 * @param {string} version2 - 旧版本号
 * @returns {1 | 0 | -1}
 */
function compareVersion(version1, version2) {
  const arr1 = version1.split(".");
  const arr2 = version2.split(".");
  const length1 = arr1.length;
  const length2 = arr2.length;
  const minlength = Math.min(length1, length2);
  let i = 0;
  for (i; i < minlength; i++) {
    let a = parseInt(arr1[i]);
    let b = parseInt(arr2[i]);
    if (a > b) {
      return 1;
    } else if (a < b) {
      return -1;
    }
  }
  if (length1 > length2) {
    for (let j = i; j < length1; j++) {
      if (parseInt(arr1[j]) != 0) {
        return 1;
      }
    }
    return 0;
  } else if (length1 < length2) {
    for (let j = i; j < length2; j++) {
      if (parseInt(arr2[j]) != 0) {
        return -1;
      }
    }
    return 0;
  }
  return 0;
}

export function checkVersion() {
  return new Promise((resolve, reject) => {
    ElectronLog.info("版本检测");
    ElectronLog.info("当前版本号", app.getVersion());
    axios({
      baseURL: import.meta.env.VITE_HTTP_HOST,
      url: "/client/user/checkUpdate/24",
      method: "get",
    })
      .then((response) => {
        ElectronLog.info(response.data);
        if (response.data.code !== 0) {
          reject(new Error(response.data.msg));
          return;
        }

        const { downloadPath, version } = response.data.data;

        ElectronLog.info(
          "当前版本号",
          app.getVersion(),
          "最新版本号",
          version,
          "下载地址",
          downloadPath
        );

        if (compareVersion(version, app.getVersion()) > 0) {
          resolve(downloadPath);
        } else {
          resolve("same");
        }
      })
      .catch((reason) => {
        ElectronLog.error("获取版本号错误", reason.message);
        resolve("same");
      });
  });
}

export function upgrade(upgradeWin, uri) {
  return new Promise((resolve, reject) => {
    const appPath = app.getAppPath();

    let size = 0;
    let has = 0;

    const web = upgradeWin.webContents;
    const thr = throttle(() => {
      web.send("download-progress", `${has / size}`);
    }, 50);

    request({ uri, encoding: null }, (error, response, body) => {
      ElectronLog.info(`资源下载完成 ${body.length}`);
      const zip = new AdmZip(body);
      zip.extractAllToAsync(appPath, true, (exception) => {
        if (exception) {
          ElectronLog.error(`解压资源异常 ${exception.message}`);
          reject(exception);
        } else {
          resolve();
        }
      });
    })
      .on("error", reject)
      .on("response", ({ headers }) => {
        size = Number(headers["content-length"]);
        ElectronLog.info(`response ${size}`);
      })
      .on("data", (data) => {
        has += data.length;
        thr();
      });
  });
}
