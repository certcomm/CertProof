var React = require('react');
var ReactDOM = require('react-dom');

var CommonMixin = require('./components/CommonMixin');
var FormPanel = require('./components/FormPanel');

// initialize function to check if open in Mobile or PC or Mac
CommonMixin.init();

var Form = {
	getFormSection: function(cmpId, id, json, formMode, isShowErrMsg, cb){
		//	rendering form component
		ReactDOM.render(
			<FormPanel cmpId={cmpId} formInfo={json} formMode={formMode} isShowErrMsg={isShowErrMsg} callMe={cb} />, 
			document.getElementById(id)
		);
	},
	setFormMode: function(cmpId, json, val, isShowErrMsg, cb){
		CommonMixin.setFormMode(cmpId, json, val, isShowErrMsg, cb);
	},
	getFormSectionJSON: function(cmpId, json, exportJson){
		return CommonMixin.getFormSectionJSON(cmpId, json, exportJson);
	},
	getFormSectionData: function(cmpId){
		return CommonMixin.getFormSectionData(cmpId);
	},
	getDiffJson: function(currentJsonData, validJsonData){
		return CommonMixin.getDiffJson(currentJsonData, validJsonData);
	},
	getDiffJson: function(currentJsonData, validJsonData){
		return CommonMixin.getDiffJson(currentJsonData, validJsonData);
	},
	validateForm: function(formMode, cmpId, initiallyStartup, errFldClr){
		return CommonMixin.validateForm(formMode, cmpId, initiallyStartup, errFldClr);
	},
	hasDataValidationIssues: function(cmpId, showFormErr){
		return CommonMixin.hasDataValidationIssues(cmpId, showFormErr);
	},
	hasStructureValidationIssues: function(cmpId){
		return CommonMixin.hasStructureValidationIssues(cmpId);
	},
	formRenderedAt: function(cmpId){
		return CommonMixin.formRenderedAt(cmpId);
	}
}
module.exports = Form;