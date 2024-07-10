const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onExportProgress: (cb) => {
    ipcRenderer.on("export-progress", (e, v) => cb(v));
  },
  onExportV2Progress: (cb) => {
    ipcRenderer.on("exportV2-progress", (e, v) => cb(v));
  },
  onProgress: (cb) => {
    ipcRenderer.on("download-progress", (event, value) => {
      cb(value);
    });
  },
  getLogicaldisk: () => {
    return ipcRenderer.invoke("getLogicaldisk");
  },
  openFileDialog: () => {
    return ipcRenderer.invoke("openFileDialog");
  },
  getDirInfo: (filePaths) => {
    const test = ipcRenderer.invoke("getDirInfo", filePaths);
    console.log("getDirInfo...................", test);
    return test;
    // return ipcRenderer.invoke('getDirInfo', filePaths)
  },
  winClose: () => {
    return ipcRenderer.invoke("winClose");
  },
  winMinimize: () => {
    return ipcRenderer.invoke("winMinimize");
  },
  exportFile: (files) => {
    return ipcRenderer.invoke("exportFile", files);
  },
  exportFileV2: async (value) => {
    return await ipcRenderer.invoke("exportFileV2", value);
  },
  insertRecord: (data) => {
    return ipcRenderer.invoke("insertRecord", data);
  },
  getFileHash: (file) => {
    return ipcRenderer.invoke("getFileHash", file);
  },
  selectById: (id) => {
    return ipcRenderer.invoke("selectById", id);
  },
  selectRecordOperationTime: (page) => {
    return ipcRenderer.invoke("selectRecordOperationTime", page);
  },
  selectRecordByOperationTime: (operationTime) => {
    return ipcRenderer.invoke("selectRecordByOperationTime", operationTime);
  },
  insertBacktrackRecord: (data) => {
    return ipcRenderer.invoke("insertBacktrackRecord", data);
  },
  selectBacktrackRecord: (page) => {
    return ipcRenderer.invoke("selectBacktrackRecord", page);
  },
  exportPdf: (data) => {
    return ipcRenderer.invoke("exportPdf", data);
  },
  dd: (diskPartition, outDir, stdout, stderr, close) => {
    console.log(diskPartition);
    console.log(outDir);
    console.log(stdout);

    ipcRenderer.on("dd-stdout", (event, str) => {
      stdout(str);
    });

    ipcRenderer.on("dd-stderr", (event, err) => {
      console.log(err);
    });

    ipcRenderer.on("dd-close", (event, code) => {
      close(code);
    });

    let dd = ipcRenderer.invoke("dd", diskPartition, outDir);
    return dd;
  },
  getDDOutDir: () => {
    return ipcRenderer.invoke("getDDOutDir");
  },

  generateMachineId: () => {
    return ipcRenderer.invoke("generateMachineId");
  },

  getDeviceInfo: () => {
    return ipcRenderer.invoke("getDeviceInfo");
  },
});
