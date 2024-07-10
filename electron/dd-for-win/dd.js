const path = require("path");
const childProcess = require("child_process");
const ddPath = path.join(process.cwd(), "/extraFiles/dd/dd.exe");

const getDiskPartSize = (diskPartitonName) => {
  return new Promise((resolve) => {
    const diskext64Path = path.join(
      process.cwd(),
      "/extraFiles/diskExt/diskext64.exe"
    );
    childProcess.exec(
      diskext64Path + " " + diskPartitonName.substring(0, 1),
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);

        const size = stdout.substring(
          stdout.indexOf("Length:") + 7,
          stdout.lastIndexOf("\r\n")
        );
        resolve(parseInt(size));
      }
    );
  });
};

export default async (diskPartition, outDir, stdout, stderr, close) => {
  const size = await getDiskPartSize(diskPartition);
  const bs = 1024 * 1024;
  const count = Math.ceil(size / bs);

  console.log("size", size);
  console.log("count", count);
  console.log("outDir", outDir);
  let ddChildProcess = childProcess.spawn(
    ddPath,
    // [ "if=\\\\.\\H:", "of=e:\\test1.img", "bs=1M", "--progress"]
    // [ "if=\\\\.\\H:", "of=e:\\test1.img", "bs=1M", "skip=7k", "--progress"]
    // [ "if=\\\\.\\H:", "of=e:\\test1.img", "bs=1M", "skip=7600c", "--progress"]
    // [ "if=\\\\.\\H:", "of=e:\\test1.img", "bs=1M", "--progress"]
    // [ "if=\\\\.\\H:", "of=e:\\test1.dd", "bs=1M", "--progress"]
    // [ "if=\\\\.\\H:", "of=e:\\test1.dd", "bs=1M", "count=7680", "--progress"]
    // [ "if=\\\\.\\H:", "of=e:\\test1.dd", "bs=1M", "count=7680", "skip=7600c", "--progress"]
    // [ "if=\\\\.\\" + diskPartition, "of=e:\\test1.dd", "bs=1M", "count=7680", "skip=7600c", "--progress"]
    // [ "if=\\\\.\\" + diskPartition, "of=" + outDir + '\\分区备份.img', "bs=1M", "count=7680", "skip=7600c", "--progress"]
    // [ "if=\\\\.\\" + diskPartition, "of=" + outDir + '\\分区备份.img', `bs=${bs}K`, `count=${count}`, "--progress"]
    // [ "if=\\\\.\\" + diskPartition, "of=" + outDir + '\\分区备份.img', 'bs=' + bs + 'k', 'count=' + count, "--progress"]
    [
      "if=\\\\.\\" + diskPartition,
      "of=" + outDir + "\\分区备份.img",
      "bs=1M",
      "count=" + count,
      "--progress",
    ]
  );

  let readable = ddChildProcess.stdout;
  readable.on("data", (data) => {
    stdout(data);
  });

  ddChildProcess.stderr.on("error", (data) => {
    stderr(data);
  });

  ddChildProcess.on("close", (code) => {
    close(code);
  });
};
