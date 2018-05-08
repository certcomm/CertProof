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