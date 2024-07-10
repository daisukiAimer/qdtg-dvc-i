const { open } = require("sqlite");
const sqlite3 = require("sqlite3").verbose();

//dbPath为你想存放数据库文件的目录路径
export const connectDb = (dbPath) => {
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
};
