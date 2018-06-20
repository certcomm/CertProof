import React from 'react';
import { observer } from "mobx-react";

var FileSystem = window.require('fs');

import UploadEvidence from "./UploadEvidence";
import Dashboard from "./Dashboard";

var Constants = require("./../../config/constants.js");

@observer
export default class AppRoutes extends React.Component {
	constructor(props) {
        super(props);

        this.store = props.certProofStore;
    }

    componentWillMount(){
        var staticNetwork = Constants.default.blockChainAnchorsOn,
            json = JSON.stringify(staticNetwork),
            fileName = Constants.default.networkFileFolder+Constants.default.networkJsonFileName;
        
        // create upload folder if not already created
        if (!FileSystem.existsSync(Constants.default.networkFileFolder)){
            FileSystem.mkdirSync(Constants.default.networkFileFolder);
        }
        
        FileSystem.exists(fileName, (exists) => {
            if(exists) {
                FileSystem.readFile(fileName, (err, content) => {
                    if(err){
                        console.log("Err while reading data from "+Constants.default.networkJsonFileName, err);
                        return;
                    }
                    var parseJson = JSON.parse(content);
                    this.store.setNetworkJson(parseJson);
                    
                    parseJson.map(node => {
                        var recordExist = staticNetwork.map(function(e) { return e.name; }).indexOf(node.name);
                        if(recordExist >=0){
                            
                        }
                    })
                    // FileSystem.writeFile(fileName, JSON.stringify(parseJson), {spaces:4}, (err) => {
                    //     if(err){
                    //         console.log("Err while writing data into "+Constants.default.networkJsonFileName, err);
                    //         return;
                    //     }
                    // })
                })
            } else {
                FileSystem.writeFile(fileName, json, {spaces:4}, (err) => {
                    if(err){
                        console.log("Err while writing data into "+Constants.default.networkJsonFileName, err);
                        return;
                    }else{
                        var parseJson = JSON.parse(json);
                        this.store.setNetworkJson(parseJson);
                        console.log("File Created");
                    }
                });
            }
        });
    }
	
	render() {
        // check if evidence already uploaded or not
        var isUploadedEvidence = this.store.getUploadedEvidenceFlag();

        return (
            <div className="wrapper">
                {
                    !isUploadedEvidence ? (
                        <UploadEvidence certProofStore={this.store} mainComp={this.props.mainComp} />
                    ) : <Dashboard certProofStore={this.store} mainComp={this.props.mainComp} />
                }
            </div>
        );
	}
}