const path = require("path");
const { app } = require("electron");
const { info, default: ElectronLog } = require("electron-log");

const fs = require('fs');

import { connectDb } from "./dbConnect";

/*let recordDbPath = path.resolve(
  app.getPath('documents'),
  "dvc-i/dextraFiles/db/data",
  "record.db"
);*/
let recordDbPath = path.resolve(

    app.getAppPath(),
    "../extraFiles/db/data",
    "record.db"
);


if (process.env.NODE_ENV === "development") {
  recordDbPath = path.resolve(
    app.getAppPath(),
    "extraFiles/db/data",
    "record.db"
  );
}


ElectronLog.info(
  "process.env.NODE_ENV================================",
  process.env.NODE_ENV
);

// fs.chmodSync(recordDbPath, "755");

let recordDb = null;
/*(async () => {
    // open the database
    recordDb = await connectDb(recordDbPath)
})()*/

const initConnect = async () => {

  fs.mkdirSync(path.dirname(recordDbPath), { recursive: true }, (err) => {
    if (err) {
      console.error('无法创建文件夹:', err);
    } else {
      console.log('文件夹已创建或已存在');
    }
  });

  info("recordDbPath", recordDbPath);
  info("appPath", app.getAppPath());
  try {
    recordDb = await connectDb(recordDbPath);
    await createRecordTable();
    await createBacktrackRecordTable();
  } catch (e) {
    console.error("initConnect initConnect initConnect", e);
  }
};

initConnect().then((r) => {
  if (!recordDb) {
    throw "数据库连接失败";
  }
});

const createRecordTable = async () => {
  // console.log('createRecordTable .....', recordDb)
  try {
    //查询使用userInfoDb.get userInfoDb.all等 更多命令请查阅官方文档
    //  name varchar unique not null ,
    const runRes = await recordDb.run(`create table IF NOT EXISTS record (
        id integer primary key autoincrement ,
        name varchar not null ,
        type varchar not null ,
        operator varchar not null ,
        device varchar not null ,
        otherInformation varchar not null ,
        time datetime not null ,
        operationTime datetime not null ,
        videoList text not null 
        )`);
    console.log("createRecordTable runRes", runRes);
    return runRes;
  } catch (e) {
    console.error(e);
  }
};

// let day = 0

const insertRecord = async (event, data) => {
  // day++
  if (!recordDb) {
    throw "数据库连接失败";
  }
  // console.log('event, data', data)
  // console.log('recordDb .....', recordDb)
  try {
    const runRes1 = await recordDb.run(
      `insert into record (name, type, operator, device, otherinformation, time, videoList, operationTime) 
                values (?, ?, ?, ?, ?, ?, ?, ?)`,
      data.name,
      data.type,
      data.operator,
      data.device,
      data.otherInformation,
      data.time,
      JSON.stringify(data.videoList),
      new Date().getTime()
    );
    // data.name, data.type, data.operator, data.device, data.otherInformation, data.time, JSON.stringify(data.videoList), (new Date().getTime() + (1000 * 60 * 60 * 24 * day)))
    console.log("insertRecord", runRes1);
    return runRes1;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const selectById = async (id) => {
  if (!recordDb) {
    throw "数据库连接失败";
  }
  try {
    return await recordDb.get(`SELECT * FROM record WHERE id = ?`, id);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const selectRecordOperationTime = async (page) => {
  try {
    return await recordDb.all(`SELECT operationTime FROM record GROUP BY date(operationTime / 1000, 'unixepoch') 
ORDER BY operationTime DESC LIMIT ${page.position}, ${page.size}`);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const selectRecordByOperationTime = async (operationTime) => {
  try {
    return await recordDb.all(
      `SELECT * FROM record WHERE date(operationTime / 1000, 'unixepoch') = date(${operationTime} / 1000, 'unixepoch')`
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const createBacktrackRecordTable = async () => {
  try {
    const runRes = await recordDb.run(`create table IF NOT EXISTS backtrackRecord (
        id integer primary key autoincrement ,
        operationTime datetime not null ,
        fileInfoList text not null 
        )`);
    console.log("createBacktrackRecordTable runRes", runRes);
    return runRes;
  } catch (e) {
    console.error(e);
  }
};

const insertBacktrackRecord = async (data) => {
  try {
    const runRes1 = await recordDb.run(
      `insert into backtrackRecord (operationTime, fileInfoList) 
                values (?, ?)`,
      new Date().getTime(),
      JSON.stringify(data)
    );
    console.log("insertRecord", runRes1);
    return runRes1;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

const selectBacktrackRecord = async (page) => {
  try {
    return await recordDb.all(
      `SELECT * FROM backtrackRecord ORDER BY operationTime DESC LIMIT ${page.position}, ${page.size}`
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export {
  initConnect,
  createRecordTable,
  insertRecord,
  selectById,
  insertBacktrackRecord,
  selectBacktrackRecord,
  selectRecordOperationTime,
  selectRecordByOperationTime,
};
