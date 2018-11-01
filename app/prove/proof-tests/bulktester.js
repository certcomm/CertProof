const fs = require('fs-extra');
const path = require('path');
const child_process = require('child_process')
const cwd = process.cwd();
const testParentLogDir = path.join(cwd,'dist','proof-tests-logs');
proveDirectory(__dirname , "fail", 1);
proveDirectory(__dirname , "success", 0);
async function proveDirectory(parentPath, zipsFolderName, expectedExitCode) {
    var testZipsDirPath = path.join(parentPath, zipsFolderName);
    var testLogDir = path.join(testParentLogDir, zipsFolderName);
    fs.ensureDirSync(testLogDir);
    fs.readdir(testZipsDirPath, function(err, items) {
        for (var i=0; i<items.length; i++) {
            var zipName = items[i];
            if(zipName.endsWith(".zip")) {
                var zipFilePath = path.join(testZipsDirPath, zipName);
                var outputLogPath = path.join(testLogDir, zipName)+ ".log";
                var cmd = 'npm run prove "' + zipFilePath + '">"' + outputLogPath + '"';
                console.log("Running " + cmd);
                try {
                    child_process.execSync(cmd);
                } catch(err) {
                    console.log("status=" + err.status);
                    if(err.status!=expectedExitCode) {
                        console.error("*************************** status code didnt matched, expected=" + expectedExitCode + ", actual=" + err.status)
                        process.exit(1);
                    }
                }
            }
        }
    });
}