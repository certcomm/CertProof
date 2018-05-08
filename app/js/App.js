import React from "react"
import ReactDom from "react-dom"

import AppRoutes from './components/AppRoutes';

import CertProofStore from "./stores/CertProofStore";

var CertProof = {
    data: {},
    parentComponent: '',
	containerId: '',
	certProofStore: '',
	setData: function(data){
		// update store data
        CertProofStore.setData(data);
	},
	loadComponent: function(data){
		this.data = data;
		this.containerId = data.containerId;
		
		var storeDate = data.data;
		this.setData(storeDate);

		this.certProofStore = CertProofStore;
		
		ReactDom.render(<AppRoutes certProofStore={this.certProofStore} mainComp={this} />, document.getElementById(data.containerId));
	},
	// destroy reactJs component
	destroyTaskRefsComponent: function(id) {
		ReactDom.unmountComponentAtNode(document.getElementById(id));
	}
}
module.exports = CertProof;