const childProcess = require('child_process')

/*
childProcess.exec('D:\\application\\DiskExt\\diskext64.exe H', (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    // console.error(`stderr: ${stderr}`);
    const size = stdout.substring(stdout.indexOf('Length:') + 7, stdout.lastIndexOf('\r\n'))
    console.log(parseInt(size))

});*/


const getDiskPartSize = () => {
    return new Promise((resolve, reject) => {
        childProcess.exec('D:\\application\\DiskExt\\diskext64.exe H', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);

            const size = stdout.substring(stdout.indexOf('Length:') + 7, stdout.lastIndexOf('\r\n'))
            // resolve(parseInt(size))
            reject('eeee')
        })
    })
}

const aa = async () => {
    try {
        const size = await getDiskPartSize()
        console.log('sizesizesizesizesize', size)
    } catch (e) {
        console.log(e)
    }


}

// aa()

const a = 10
const b = 3
console.log(a / b)
console.log(Math.ceil(a / b))
