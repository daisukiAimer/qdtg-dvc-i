const logger = require("electron-log");
const { app } = require("electron");

// console.log = logger.log;
console.log = logger.debug;
console.error = logger.error;

logger.transports.file.level = "debug";
logger.transports.file.maxSize = 1002430; // 文件最大不超过 10M
// 日期样式
logger.transports.file.format =
  "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}";
// logger.transports.file.resolvePathFn = () => path.join('C:\\Users\\fanjun\\Downloads\\test\\', 'logs/main.log');

let date = new Date();
date = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
console.log(
  'app.getPath("userData")app.getPath("userData")app.getPath("userData")app.getPath("userData")',
  app.getPath("userData")
);
logger.transports.file.resolvePath = () =>
  app.getPath("userData") + "\\logs\\" + date + ".log";
console.log(
  "logger.transports.file.resolvePath",
  logger.transports.file.resolvePath()
);

// 文件位置及命名方式
// 位置为：C:\Users\hp\AppData\Roaming\Electron\electron_log\
// 文件名为：年-月-日.log
// logger.transports.file.file = remote.app.getPath('userData') + '\\electron_log\\' + date + '.log'
// 可以再创建下一级目录
// 位置为：C:\Users\hp\AppData\Roaming\Electron\electron_log\app\
// logger.transports.file.file = remote.app.getPath('userData') + '\\electron_log\\app\\' + date + '.log'
// remote.app.getVersion(); // 可返回当前框架的版本号

// console.log('getLogicaldisk() ........', getLogicaldisk())

export default logger;
