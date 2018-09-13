const electron = require('electron');
const {shell, app, dialog, BrowserWindow} = electron;
const url = require('url');
const path = require('path');
const notifier = require('electron-notifications')
var FileSystem = require('fs');

const userDataPath = (electron.app || electron.remote.app).getPath('userData')+"/uploads/";
const downloadPath = (electron.app || electron.remote.app).getPath('downloads');

let win;
let getIncrementalFileName;

function createWindow() { 
    let screenSize = electron.screen.getPrimaryDisplay().size;
    win = new BrowserWindow({
        width: screenSize.width, height: screenSize.height,
        icon: __dirname + '/app/style/icons/png/64x64.png',
        title: "CertProof"
    }) 
    
    win.loadURL(url.format ({ 
        pathname: path.join(__dirname, 'app/index.html'), 
        protocol: 'file:', 
        slashes: true 
    }))

    getIncrementalFileName = function(filename){
        const filenameWithoutExt = filename.substring(0, filename.lastIndexOf('.')),
            filenameWithoutIncrement = filenameWithoutExt.substring(0, filenameWithoutExt.lastIndexOf(" (")),
            regExp = /(?:\.([^.]+))?$/,
            ext = regExp.exec(filename)[1];
        
        try {
            var files = FileSystem.readdirSync(downloadPath);
        } catch(e) {
            return;
        }

        var count = 0,
            lastIncrementedNumber = 0;
        if (files.length > 0)
            for (var i = 0; i < files.length; i++) {
                var x = files[i].substring(0, files[i].lastIndexOf('.')),
                    x1 = files[i].substring(0, files[i].lastIndexOf(" ("));
                
                if( (x1 != "" && filenameWithoutExt == x1) || filenameWithoutExt == x || (filenameWithoutIncrement != "" && filenameWithoutIncrement == x1) ){
                    var incrementalNumber = x.match(/\((.*)\)/) ? x.match(/\((.*)\)/)[1] : 0
                    lastIncrementedNumber = incrementalNumber > lastIncrementedNumber ? incrementalNumber : lastIncrementedNumber;

                    count++;
                }
            }
        
        if(count > 0){
            //  just to add this if already incremented file uploaded at any point
            if(lastIncrementedNumber >= count) count = Number(lastIncrementedNumber)+1;

            return (filenameWithoutIncrement != "" ? filenameWithoutIncrement : filenameWithoutExt)+" ("+count+")"+"."+ext;
        }else
            return filename;
    }

    win.webContents.session.on('will-download', (event, item, webContents) => {
        var incrementedFileName = getIncrementalFileName(item.getFilename());
        // dialog.showMessageBox({ message: incrementedFileName, buttons: ["OK"] });

        item.setSavePath(downloadPath+"/"+incrementedFileName);

        var savedPath = item.getSavePath();
        if (/^win/.test(process.platform)) {
            savedPath = "file:///"+savedPath;
        } else {
            // Do Nothing for mac or linux
        }

        item.once('done', (event, state) => {
            //  if already notification open then it should be closed first
            //if(notification && notification.close) notification.close();

            let notification = notifier.notify(incrementedFileName, {
                message: 'File downloaded successfully',
                icon: __dirname + '/app/style/icons/png/512x512.png',
                buttons: ['Show In Folder', 'Dismiss'],
                duration: 100000000
            })
            notification.on('buttonClicked', (text, buttonIndex, options) => {
                if (text === 'Show In Folder') {
                    // dialog.showMessageBox({ message: savedPath, buttons: ["OK"] });
                    // shell.openExternal(downloadPath);
                    // shell.openItem(downloadPath);
                    shell.showItemInFolder(savedPath);
                }
                
                notification.close()
            })
        })
    });

    win.webContents.on('did-finish-load', () => {
        win.setTitle("CertProof (Version "+process.env.npm_package_version+")");
    });
    
    // to open console in packaged mode for debugging
    // win.webContents.openDevTools();
}

var removeEvidence = (dirPath)=>{
    /*
    * should delete all files on app load or close
    * check if files exist in directory
    * then delete all files
    * */
    if(!dirPath) dirPath = userDataPath;
    
    try {
        var files = FileSystem.readdirSync(dirPath);
    }
    catch(e) {
        return;
    }

    if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
            var filePath = dirPath + files[i];
            if (FileSystem.statSync(filePath).isFile()){
                FileSystem.unlinkSync(filePath);
            }else{
                // to remove sub direcotries
                removeEvidence(filePath+"/");
            }
        }
}

// call function on app load
removeEvidence();

app.on('window-all-closed', app.quit);
app.on('before-quit', () => {
    // call function on app close
    removeEvidence();
    
    // win.removeAllListeners('close');
    // win.close();

    // notification can close on app kill
    // if(notification && notification.close) notification.close();
});

app.on('ready', createWindow);