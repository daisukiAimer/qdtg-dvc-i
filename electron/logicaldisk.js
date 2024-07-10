const { exec, execSync } = require("child_process");
const iconv = require("iconv-lite");
const util = require("util");
const execPromise = util.promisify(require("child_process").exec);

let encoding = "";

const getChcp = async () => {
  return new Promise((resolve, reject) => {
    if (!encoding) {
      exec("chcp", (error, stdout, stderr) => {
        const cp = stdout.toString().split(":")[1].trim();
        switch (cp) {
          case "65000": // UTF-7
            encoding = "UTF-7";
            break;
          case "65001": // UTF-8
            encoding = "UTF-8";
            break;
          default: // Other Encoding
            if (/^-?[\d.]+(?:e-?\d+)?$/.test(cp)) {
              encoding = "cp" + cp;
            } else {
              encoding = cp;
            }
        }

        resolve(encoding);
      });
    } else {
      resolve(encoding);
    }
  });
};

/*
wmic logicaldisk where "drivetype=3" get name,filesystem,freespace

wmic logicaldisk where “filesystem='fat32'” and “Description='可移动磁盘'” get name, FileSystem, Description, Caption /format:list
wmic logicaldisk where filesystem='fat32' get name, FileSystem, Description, Caption /format:list

wmic logicaldisk get name, FileSystem, Description, Caption /format:list


wmic logicaldisk where filesystem='fat32' and description='可移动磁盘' get name, FileSystem, Description, Caption /format:list
wmic logicaldisk where filesystem='fat32' and Caption='H:' get name, FileSystem, Description, Caption /format:list
wmic logicaldisk where "filesystem='fat32' and description='可移动磁盘'" get name, FileSystem, Description, Caption /format:list
 */

const getLogicaldisk = async () => {
  const encodingVal = await getChcp();
  // const encodingVal = 'cp936'
  console.log("encodingVal", encodingVal);
  // console.log('process.env.ComSpec', process.env.ComSpec)

  return new Promise((resolve, reject) => {
    // exec('wmic logicaldisk get name, FileSystem, Description, Caption /format:list', {
    // exec(`wmic logicaldisk where "filesystem='fat32' and description='可移动磁盘'" get name, FileSystem, Description, Caption, VolumeName /format:list`, {
    /*
        Get-WmiObject -Class Win32_LogicalDisk | select name, FileSystem, Description, Caption, VolumeName
         */
    // exec(`wmic logicaldisk where "(filesystem='fat32' or filesystem='exfat') and (description='可移动磁盘' or description='Removable Disk')" get name, FileSystem, Description, Caption, VolumeName /format:list`, {
    exec(
      `wmic logicaldisk where "DriveType=2 and (FileSystem='fat32' or FileSystem='exfat')" get Name, Caption, Description, FileSystem,VolumeName,DriveType /format:list`,
      {
        encoding: encodingVal,
      },
      (error, stdout, stderr) => {
        console.log("stdoutstdoutstdoutstdout .........");
        // buffer = iconv.decode(buffer, 'cp936')
        let buffer = iconv.decode(stdout, encodingVal);
        let lines = buffer.toString().split("\r\r\n");
        let obj = null;
        const arr = [];
        lines.forEach((value) => {
          if (value !== "") {
            if (!obj) {
              obj = {};
              arr.push(obj);
            }

            let tokens = value.split("=");
            let k = tokens[0];
            obj[k] = tokens[1];
          } else {
            obj = null;
          }
        });

        resolve(arr);

        /*resolve(arr.filter(item => {
                // return Object.values(item).filter(v => v.toLowerCase() === 'fat32' || v.toLowerCase() === 'exfat').length
                return Object.values(item).filter(v => {
                    return v.toLowerCase() === 'fat32' || v.toLowerCase() === 'exfat' || v.indexOf("可移动") !== -1
                }).length === 2
            }))*/
      }
    );
  });
};

/*const getLogicaldisk = async () => {
    const encodingVal = await getChcp()
    // const encodingVal = 'cp936'
    console.log('encodingVal', encodingVal)
    console.log('process.env.ComSpec', process.env.ComSpec)
    const { stdout, stderr } = await execPromise(`wmic logicaldisk where "filesystem='fat32' and description='可移动磁盘'" get name, FileSystem, Description, Caption /format:list`)
    console.log('stdoutstdoutstdoutstdout .........')
    // buffer = iconv.decode(buffer, 'cp936')
    let buffer = iconv.decode(stdout, encodingVal)
    let lines = buffer.toString().split('\r\r\n');
    let obj = null
    const arr = []
    lines.forEach(value => {
        if (value !== '') {
            if (!obj) {
                obj = {}
                arr.push(obj)
            }

            let tokens = value.split('=');
            let k = tokens[0]
            obj[k] = tokens[1]
        } else {
            obj = null
        }
    })

    return arr
}*/

const getChcpSync = () => {
  if (!encoding) {
    const cp = execSync("chcp").toString().split(":")[1].trim();
    switch (cp) {
      case "65000": // UTF-7
        encoding = "UTF-7";
        break;
      case "65001": // UTF-8
        encoding = "UTF-8";
        break;
      default: // Other Encoding
        if (/^-?[\d.]+(?:e-?\d+)?$/.test(cp)) {
          encoding = "cp" + cp;
        } else {
          encoding = cp;
        }
    }
  }
  return encoding;
};

const getLogicaldiskSync = () => {
  const encodingVal = getChcp();
  let buffer = execSync(
    "wmic logicaldisk get name, FileSystem, Description, Caption /format:list"
  );
  // buffer = iconv.decode(buffer, 'cp936')
  buffer = iconv.decode(buffer, encodingVal);
  let lines = buffer.toString().split("\r\r\n");
  let obj = null;
  const arr = [];
  lines.forEach((value) => {
    if (value !== "") {
      if (!obj) {
        obj = {};
        arr.push(obj);
      }

      let tokens = value.split("=");
      let k = tokens[0];
      obj[k] = tokens[1];
    } else {
      obj = null;
    }
  });
  return arr;
};

export { encoding, getLogicaldisk };

/*if (value !== '') {
            let tokens = value.split('=');
            let section = tokens[0];
            let data = tokens[1];
            switch (section) {
                case 'Caption':
                    caption = data;
                    newDiskIteration = true;
                    break;
                case 'Description':
                    description = data;
                    break;
                case 'FreeSpace':
                    freeSpace = isNaN(parseFloat(data)) ? 0 : +data;
                    break;
                case 'Size':
                    size = isNaN(parseFloat(data)) ? 0 : +data;
                    break;
            }
        } else {
            if (newDiskIteration) {
                var used = (size - freeSpace);
                var percent = '0%';
                if (size > 0) {
                    percent = Math.round((used / size) * 100) + '%';
                }
                var d = new drive_1.default(description, size, used, freeSpace, percent, caption);
                drives.push(d);
                newDiskIteration = false;
                caption = '';
                description = '';
                freeSpace = 0;
                size = 0;
            }
        }*/

/*const drivelist = require('drivelist');

drivelist.list().then(drives => {
    drives.forEach((drive) => {
        console.log('drivelistdrivelistdrivelistdrivelist..............', drive);
    })
})*/

/*const nodeDiskInfo = require('node-disk-info');
nodeDiskInfo.getDiskInfo()
    .then(disks => {
        printResults('ASYNC WAY', disks);
    })
    .catch(reason => {
        console.error(reason);
    });

// sync way
try {
    const disks = nodeDiskInfo.getDiskInfoSync();
    printResults('SYNC WAY', disks);
} catch (e) {
    console.error(e);
}

function printResults(title, disks) {

    console.log(`============ ${title} ==============\n`);

    for (const disk of disks) {
        console.log('disk:', disk);
        console.log('Filesystem:', disk.filesystem);
        console.log('Blocks:', disk.blocks);
        console.log('Used:', disk.used);
        console.log('Available:', disk.available);
        console.log('Capacity:', disk.capacity);
        console.log('Mounted:', disk.mounted, '\n');
    }

}*/

// npm config set python "D:\application\Python27\python.exe"  node_gyp=D:\application\nodejs\node-v18.12.1-win-x64\node_modules\node-gyp\bin\node-gyp.js"
// ; python=D:\application\Python27\python.exe

/*const d = require('diskinfo');
d.getDrives(function(err, aDrives) {
    console.log(aDrives)
    console.log('中文中文中文中文中文中文')
    console.log('中文中文中文中文中文中文')
    for (var i = 0; i < aDrives.length; i++) {
        console.log('Drive ' + aDrives[i].filesystem);
        console.log('blocks ' + aDrives[i].blocks);
        console.log('used ' + aDrives[i].used);
        console.log('available ' + aDrives[i].available);
        console.log('capacity ' + aDrives[i].capacity);
        console.log('mounted ' + aDrives[i].mounted);
        console.log('-----------------------------------------');
    }

});*/

/*

Access  Availability  BlockSize  Caption  Compressed  ConfigManagerErrorCode  ConfigManagerUserConfig
 CreationClassName  Description   DeviceID  DriveType  ErrorCleared  ErrorDescription  ErrorMethodology
   FileSystem  FreeSpace     InstallDate  LastErrorCode  MaximumComponentLength  MediaType  Name
   NumberOfBlocks  PNPDeviceID  PowerManagementCapabilities  PowerManagementSupported  ProviderName
          Purpose  QuotasDisabled  QuotasIncomplete  QuotasRebuilding  Size
            Status  StatusInfo  SupportsDiskQuotas  SupportsFileBasedCompression  SystemCreationClassName  SystemName
                VolumeDirty  VolumeName        VolumeSerialNumber
 */

/*var spawn = require('child_process').spawn,
    list  = spawn('cmd');
const iconv = require('iconv-lite')

list.stdout.on('data', function (data) {
    // console.log('stdout: ' + data);
    const aa = iconv.decode(data, 'cp936')
    console.log('stdout: ' + aa)
    console.log('aa.split: ' + aa.split('\r\n'))


    // fs.writeFile('C:\\Users\\fanjun\\Downloads\\test\\message.txt', new Uint8Array(Buffer.from(iconv.decode(data, 'cp936'))), (err) => {
    /!*fs.appendFile('C:\\Users\\fanjun\\Downloads\\test\\message.txt', aa, 'utf8', (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });*!/
});

list.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
});

list.on('exit', function (code) {
    console.log('child process exited with code ' + code);
});
list.stdin.write('wmic logicaldisk get name, FileSystem, Description \n');
// list.stdin.write('wmic logicaldisk \n');
list.stdin.end();*/

/*

wmic logicaldisk get name, FileSystem, Description /format:list
 */
