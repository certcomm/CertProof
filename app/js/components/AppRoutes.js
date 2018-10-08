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

    addNetwork(fileName, json, type){
        FileSystem.exists(fileName, (exists) => {
            if(exists) {
                FileSystem.readFile(fileName, (err, content) => {
                    if(err){
                        console.log("Err while reading"+(type == "appDeafult" ? " app default" : "")+" data from "+Constants.default.networkJsonFileName, err);
                        return;
                    }
                    if(type == "appDeafult"){
                        FileSystem.writeFile(fileName, json, {spaces:4}, (err) => {
                            this.store.setAppDefaultNetworkJson(JSON.parse(json));
                        });
                    }else{
                        try{
                            var parseJson = JSON.parse(content);
                        }catch(e){
                            var parseJson = json;
                        }
                        
                        // should remove appdefault URls for user network json
                        var clonedNetworkJson = JSON.parse(JSON.stringify(parseJson)),
                            isAppDefaultUrlsExist = false;
                        parseJson.map((node, p1) => {
                            return node.networks.map((network, p2) => {
                                // network.value = [];
                                return network.value.map(function(e, p3) {
                                    // should delete all appdefault urls object
                                    if(e.appDefault){
                                        isAppDefaultUrlsExist = true;
                                        clonedNetworkJson[p1].networks[p2].value.splice(p3, 1);
                                    }
                                    return network;
                                });
                            })
                        });
                        if(isAppDefaultUrlsExist){
                            FileSystem.writeFile(fileName, JSON.stringify(clonedNetworkJson), {spaces:4}, (err) => {
                                if(err){
                                    console.log("Err while writing"+(type == "appDeafult" ? " app default" : "")+" data into "+Constants.default.networkJsonFileName, err);
                                    return;
                                }else{
                                    this.store.setNetworkJson(clonedNetworkJson);
                                }
                            });
                        }else{
                            this.store.setNetworkJson(parseJson);
                        }
                    }
                })
            } else {
                FileSystem.writeFile(fileName, json, {spaces:4}, (err) => {
                    if(err){
                        console.log("Err while writing"+(type == "appDeafult" ? " app default" : "")+" data into "+Constants.default.networkJsonFileName, err);
                        return;
                    }else{
                        var parseJson = JSON.parse(json);
                        if(type == "appDeafult"){
                            this.store.setAppDefaultNetworkJson(parseJson);
                        }else{
                            this.store.setNetworkJson(parseJson);
                        }
                    }
                });
            }
        });
    }

    componentWillMount(){
        var staticNetwork = Constants.default.blockChainAnchorsOn,
            json = JSON.stringify(staticNetwork),
            fileName = Constants.default.networkFileFolder+Constants.default.networkJsonFileName,
            fileAppDefaultName = Constants.default.networkAppDefaultFileFolder+Constants.default.networkJsonFileName;
        
        // create upload folder if not already created
        if (!FileSystem.existsSync(Constants.default.networkAppDefaultFileFolder)){
            FileSystem.mkdirSync(Constants.default.networkAppDefaultFileFolder);
        }

        // create upload folder if not already created
        if (!FileSystem.existsSync(Constants.default.networkFileFolder)){
            FileSystem.mkdirSync(Constants.default.networkFileFolder);
        }

        // should remove appdefault URls for user network json
        var parseJson = JSON.parse(json).map(node => {
            return node.networks.map(network => {
                network.value = [];
                return network;
            })
        })

        this.addNetwork(fileAppDefaultName, json, "appDeafult");
        this.addNetwork(fileName, JSON.stringify(parseJson), "userData");
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