import React from 'react';
import { observer } from "mobx-react";

const remote = window.require('electron').remote;
const dialog = remote.dialog;
var FileSystem = window.require('fs');

var ConfigImages = require("./../../config/images.js");
var Constants = require("./../../config/constants.js");

function UploadEvidenceView(props){
    return (
        <div className="form-group">
            <input className="single-line" type="text" placeholder="Please select a file" id="actual-file" disabled="disabled"/>
            <input className="upload-button-radius btn btn-w-m" type="button" value="Upload Evidence" onClick={props.openDialog} />
        </div>
    );
}

function UploadedEvidenceView(props){
    return (
        <div>
            <div className="form-group">
                <input className="single-line" type="text" placeholder="Please select a file" value={props.filename} disabled="disabled" />
                <input className="upload-button btn btn-w-m" type="button" value="Change" onClick={props.openDialog} />
                <input className="upload-button-radius btn btn-w-m" type="button" value="Remove" onClick={props.removeEvidence} />
            </div>
            <div className="form-group">
                <input className="btn-success btn btn-w-m" type="button" value="Next" onClick={props.updateEvidenceProof} />
            </div>
        </div>
    );
}

@observer
export default class UploadEvidence extends React.Component {
	constructor(props) {
        super(props);

        this.store = props.certProofStore;
    }

    openDialog(){
        dialog.showOpenDialog(remote.getCurrentWindow(),
        {
            defaultPath: 'c:/',
            filters: [
                { name: 'All Files', extensions: ['zip'] }
              ],
            properties: ['openFile']
        }, (fileNames) => {
            if(fileNames === undefined){
                console.log("No file selected");
            }else{
                var filepath = fileNames[0];
                var filename = filepath.replace(/^.*[\\\/]/, '');

                this.store.setUploadEvidenceDetails(filename, filepath);
            }
        }); 
    }
    
    removeEvidence(){
        this.store.setUploadEvidenceDetails(null, null);
    }
    
    updateEvidenceProof(e, dirPath){
        /*
        * this is for in secure case - we have already removed files on app load and on app close
        * should delete all files when user will click on next button within upload directory
        * check if files exist in directory
        * then delete all files
        * */
        if(!dirPath) dirPath = Constants.default.evidenceFolder;
        
        try {
            var files = FileSystem.readdirSync(dirPath);
        }
        catch(e) {
            this.store.setUploadedEvidenceFlag(true);
            return;
        }

        if (files.length > 0)
            for (var i = 0; i < files.length; i++) {
                var filePath = dirPath + files[i];
                if (FileSystem.statSync(filePath).isFile()){
                    FileSystem.unlinkSync(filePath);

                    if(files.length-1 == i) this.store.setUploadedEvidenceFlag(true);
                }else{
                    // to remove sub direcotries
                    this.updateEvidenceProof(this, filePath+"/");
                }
            }
        else
            this.store.setUploadedEvidenceFlag(true);
    }
    
	render() {
        var uploadeEvidenveName = this.store.getFileName();
        return (
            <div className="text-center">
                <div className="header">
                    <img src={ConfigImages.default.appIcon} alt="certProof" title="certProof" />
                </div>
                {
                    uploadeEvidenveName == "" ? (
                        <UploadEvidenceView openDialog={this.openDialog.bind(this)} />
                    ) : <UploadedEvidenceView openDialog={this.openDialog.bind(this)} removeEvidence={this.removeEvidence.bind(this)} updateEvidenceProof={this.updateEvidenceProof.bind(this)} filename={uploadeEvidenveName} />
                }
            </div>
        );
	}
}