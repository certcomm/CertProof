require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var Popover = require('react-awesome-popover');
var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');

var Global = require('./Global');
var CommonMixin = require('./CommonMixin');

//	action buttons
var ActionButton = createReactClass({
	mixins: [CommonMixin],
	getInitialState: function() {
		return {userInput: "", formModeVal: this.props.formModeVal};
	},
	componentDidMount: function() {
		var mainIdEl = document.getElementById( Global.mainCmpId );
		
		//	jQuery
		var elField = $(mainIdEl).find("[name='"+this.props.elComponent.name+"']");
		var selectedActionButton = "";
		for(var i=0; i < elField.length; i++){
			if(elField[i].checked) {
				selectedActionButton = $(elField[i]).parent("label").find("span").attr("name");
				break;
			}
		}
		if(selectedActionButton != ""){
				$(mainIdEl).find("[name='"+this.props.elComponent.name+"']").parent("label").parent("div").find("label").hide();
				$(mainIdEl).find("[name='"+selectedActionButton+"']").parent("label").show();
				
				}
		//	jQuery
		var obj = { elName: this.props.elComponent.name, elVal: ReactDOM.findDOMNode(this.refs[this.props.elComponent.name]).value, validator: this.props.elComponent.validator, type: "radio" };
		
		this.checkIfObjectExists(Global.allFormElObjects, this.props.elComponent.name, "", "");
		Global.allFormElObjects.push(obj);
	},
	render: function() {
		var me = this;
		var actionButtonName = this.props.elComponent.name;
		var frmMode = this.state.formModeVal;
		var fieldValue = "";
		if((this.props.elData) && typeof this.props.elData[this.props.elComponent.name] != "undefined"){
			fieldValue = this.props.elData[this.props.elComponent.name];
		}else{
			fieldValue = (this.props.elComponent.value)? this.props.elComponent.value : "";
		}
		
		var diffDataCls = diffDataIconCls = diffData = "";
		var isDiff = false;
		
		if((this.props.elDiffData) && typeof this.props.elDiffData[this.props.elComponent.name] != "undefined"){
			isDiff = true;
			diffDataIconCls = "modified-data-icon";
			
			//	split array to get new data value and class name
			var diffValClass = this.props.elDiffData[this.props.elComponent.name];
			var diffArr = diffValClass.split("~diff~");
			
			diffData = diffArr[0];
			diffDataCls = diffArr[1];
		}
		
		if(!me.props.elComponent.style){
			me.props.elComponent.style = {};
		}
		
		var editModeCheckedCls = inEditMode = ""
		var dStyle = me.props.elComponent.style;
		dStyle = jQuery.parseJSON(JSON.stringify(dStyle));
		//	default bg color
		var elDefaultColor = dStyle.backgroundColor;
		var actionButtonItems = this.props.elComponent.elements.map(function(val, index) {
			if(diffData == val.value) diffData = val.stateTitle;
			
			dStyle.backgroundColor = "";
			if( (val.stateColor != "") && (fieldValue == val.value) ){
				var undoBtnCls = "";
					var stateClrCls = "";
					dStyle.backgroundColor = val.stateColor;
					var stateTitleVal = val.stateTitle;
				}else{
				var stateClrCls = "action-button-span-default-clr";
				dStyle.backgroundColor = elDefaultColor;
				var stateTitleVal = val.label;
			}
			
			//	variable was updating so we are first stringify and parse json while printing
			nnewStyle = jQuery.parseJSON(JSON.stringify(dStyle));
			return React.createElement("label", {key: Math.random(), className: "r-form-action-button-label-box "+((val.clsName) ? val.clsName : "")}, 
				React.createElement("input", {
					key: Math.random(), 
					type: "radio", 
					className: "r-form-action-button "+ ((val.clsName) ? val.clsName : ""), 
					ref: actionButtonName, 
					rel: me.props.cmpId, 
					name: actionButtonName, 
					value: val.value, 
					onChange: me.onChange, 
					defaultChecked: (fieldValue == val.value) ? true : false}
				), 
				React.createElement("span", {style: nnewStyle, className: "r-form-action-button-span "+stateClrCls+" "+editModeCheckedCls, name: actionButtonName+"-"+index}, " "+stateTitleVal), 
				React.createElement("div", {key: Math.random(), className: "hidden", name: actionButtonName+"-"+index+"_stateTitle", value: val.stateTitle, title: val.label})
			)
		});
		
		var hoverTitle = diffData == '' ? "No Value" : diffData;
		
		//	label hidden if blank
		if(this.props.elComponent.label == ""){ var clsName="hidden"; }else{ var clsName=""; }
		
		this.props.elComponent.maxOptionNumber = (this.props.elComponent.maxOptionNumber) ? this.props.elComponent.maxOptionNumber : this.props.elComponent.elements.length;
		return(
			React.createElement("div", {className: diffDataCls+" form-element-box float-left "+this.props.elComponent.ctClsName, "data-json": JSON.stringify(this.props.elComponent)}, 
				React.createElement("div", {className: clsName+" float-left form-field-label"}, 
					React.createElement("label", {name: this.props.elComponent.name+"-label", className: "r-form-el-label " + ((this.props.clsName)?this.props.clsName:""), style: this.props.elComponent.labelStyle}, 
						React.createElement("span", null, this.props.elComponent.label), React.createElement("b", null, ":"), 
						React.createElement("span", {className: "required-sign"}, 
							(this.props.elComponent.validator)?((this.props.elComponent.validator.isRequired)? "*": ""):""
						)
					)
				), 
				React.createElement("div", {className: "float-left form-field"}, 
					actionButtonItems, 
					
					React.createElement("br", null), 
					React.createElement("div", {name: this.props.elComponent.name+"_errorMsg", className: this.props.elComponent.name+"_errorMsg error-message"})
				), 
				React.createElement("span", {className: diffDataIconCls, alt: diffData, title: diffData})
				
			)
		)
	}
});

module.exports = ActionButton;

},{"./CommonMixin":4,"./Global":10,"create-react-class":19,"react":"react","react-awesome-popover":27,"react-dom":"react-dom"}],2:[function(require,module,exports){
var Popover = require('react-awesome-popover');
var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');

var Global = require('./Global');
var CommonMixin = require('./CommonMixin');

//	create check-box
var CheckBox = createReactClass({
	mixins: [CommonMixin],
	getInitialState: function() {
		return {userInput: "", formModeVal: this.props.formModeVal};
	},
	componentDidMount: function() {
		var obj = { elName: this.props.elComponent.name, elVal: ReactDOM.findDOMNode(this.refs[this.props.elComponent.name]).value, validator: this.props.elComponent.validator, type: "checkbox" };
		
		this.checkIfObjectExists(Global.allFormElObjects, this.props.elComponent.name, "", "");
		Global.allFormElObjects.push(obj);
	},
	render: function() {
		var me = this;
		var checkBoxName = this.props.elComponent.name;
		var fieldValue = "";
		if((this.props.elData) && typeof this.props.elData[this.props.elComponent.name] != "undefined"){
			fieldValue = this.props.elData[this.props.elComponent.name];
		}else{
			fieldValue = (this.props.elComponent.value)? this.props.elComponent.value : "";
		}
		this.props.elComponent.value = fieldValue;
		
		var diffDataCls = diffDataIconCls = diffData = "";
		var isDiff = false;
		
		if((this.props.elDiffData) && typeof this.props.elDiffData[this.props.elComponent.name] != "undefined"){
			isDiff = true;
			diffDataIconCls = "modified-data-icon";
			
			//	split array to get new data value and class name
			var diffValClass = this.props.elDiffData[this.props.elComponent.name];
			var diffArr = diffValClass.split("~diff~");
			
			diffData = diffArr[0];
			diffDataCls = diffArr[1];
		}
		
		var newDataVal = "";
		var checkBoxItems = this.props.elComponent.elements.map(function(val, index) {
			var diffDataArr = diffData.split(",");
			if(diffDataArr.length > 0){
				diffDataArr.map(function(v, i) {
					if(v == val.value) newDataVal = newDataVal+","+val.label;
				});
			}else{
				if(diffData == val.value) diffData = val.label;
			}
			
			return React.createElement("label", {key: Math.random(), className: "r-form-check-box-label-box "+ ((val.clsName) ? val.clsName : "")}, 
				React.createElement("input", {
					type: "checkbox", 
					value: val.value, 
					key: Math.random(), 
					className: "r-form-check-box "+ ((val.clsName) ? val.clsName : ""), 
					ref: checkBoxName, 
					name: checkBoxName, 
					onChange: me.onChange, 
					defaultChecked: (fieldValue != "")? ( (typeof fieldValue != "string") ? ((fieldValue.indexOf(val.value) > -1)? true: false): (fieldValue == val.value) ? true : false): false}
				), 
				React.createElement("span", {name: checkBoxName+"-"+index}, " "+val.label)
			)
		});
		
		if(newDataVal != ""){
			if (newDataVal.indexOf(",", 1)) {
				diffData = newDataVal.substring(1, newDataVal.length);
			}else{
				diffData = newDataVal;
			}
			newDataVal = "";
		}
		
		var hoverTitle = diffData == '' ? "No Value" : diffData;
		
		//	label hidden if blank
		if(this.props.elComponent.label == ""){ var clsName="hidden"; }else{ var clsName=""; }
		
		this.props.elComponent.maxOptionNumber = (this.props.elComponent.maxOptionNumber) ? this.props.elComponent.maxOptionNumber : this.props.elComponent.elements.length;
		return(
			React.createElement("div", {className: diffDataCls+" form-element-box float-left "+this.props.elComponent.ctClsName, "data-json": JSON.stringify(this.props.elComponent), style: (this.props.elComponent.style) ? this.props.elComponent.style : {}}, 
				React.createElement("div", {className: clsName+" float-left form-field-label"}, 
					React.createElement("label", {name: this.props.elComponent.name+"-label", className: "r-form-el-label " + ((this.props.clsName)?this.props.clsName:""), style: this.props.elComponent.labelStyle}, 
						React.createElement("span", null, this.props.elComponent.label), React.createElement("b", null, ":"), 
						React.createElement("span", {className: "required-sign"}, 
							(this.props.elComponent.validator)?((this.props.elComponent.validator.isRequired)? "*": ""):""
						)
					)
				), 
				React.createElement("div", {className: "float-left form-field"}, 
					checkBoxItems, 
					React.createElement("br", null), 
					React.createElement("div", {name: this.props.elComponent.name+"_errorMsg", className: this.props.elComponent.name+"_errorMsg error-message"})
				), 
				React.createElement("span", {className: diffDataIconCls, alt: diffData, title: diffData})
				
			)
		)
	}
});

module.exports = CheckBox;

},{"./CommonMixin":4,"./Global":10,"create-react-class":19,"react":"react","react-awesome-popover":27,"react-dom":"react-dom"}],3:[function(require,module,exports){
var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');

var Global = require('./Global');
var CommonMixin = require('./CommonMixin');

//	create choice options
var ChoiceOption = createReactClass({
	mixins: [CommonMixin],
	getInitialState: function() {
		return {userInput: "", formModeVal: this.props.formModeVal};
	},
	componentDidMount: function() {
		//	fire on-change event on load 
		var mainIdEl = document.getElementById( Global.mainCmpId );
		
		//	for option name
		var obj = { elName: this.props.elComponent.name[0], elVal: ReactDOM.findDOMNode(this.refs[this.props.elComponent.name[0]]).value, validator: this.props.elComponent.validator };
		
		this.checkIfObjectExists(Global.allFormElObjects, this.props.elComponent.name[0], "", "");
		Global.allFormElObjects.push(obj);
		
		//	for option value
		var obj = { elName: this.props.elComponent.name[1], elVal: ReactDOM.findDOMNode(this.refs[this.props.elComponent.name[1]]).value, validator: this.props.elComponent.validator };
		
		this.checkIfObjectExists(Global.allFormElObjects, this.props.elComponent.name[1], "", "");
		Global.allFormElObjects.push(obj);
	},
	render: function() {
		var me = this;
		
		var choiceDefaultValue = choiceDefaultValueSelected = choiceDefaultCheckBoxValue = optionTitle = optionAddClass = optionDeleteClass = "";
		
		var flVal = "";
		if(this.props.elComponent.choiceDefaultValue){
			if(!this.props.elComponent.choiceDefaultCheckBoxValue){
				choiceDefaultValue = "choice-default-value";
				optionTitle = "Make this option default";
			}
			
			optionAddClass = "add-new-choice-icon";
			optionDeleteClass = "delete-new-choice-icon";
		}
		
		var optionChoiceItems = this.props.elComponent.name.map(function(val, index) {
			if(me.props.elComponent.label[index] == ""){ var clsName="hidden"; }else{ var clsName=""; }
			
			if(me.props.elComponent.choiceDefaultValue == me.props.elComponent.value[1]){
				choiceDefaultValueSelected = "choice-default-value-selected";
				optionTitle = "This option is default selected";
			}
			
			return React.createElement("div", {key: "c1"+index, className: "float-left margin-right "+(index == 1 ? me.props.elComponent.optionValClsName : "")}, 
				React.createElement("div", {key: "c2"+index, className: clsName+" float-left form-field-label"}, 
					React.createElement("label", {key: "c3"+index, name: me.props.elComponent.name[index]+"-label", className: "r-form-el-label " + ((me.props.clsName)?me.props.clsName:""), style: me.props.elComponent.labelStyle}, 
						me.props.elComponent.label, React.createElement("b", null, ":"), 
						React.createElement("span", {key: "c4"+index, className: "required-sign"}, 
							(me.props.elComponent.validator)?((me.props.elComponent.validator.isRequired)? "*": ""):""
						)
					)
				), 
				React.createElement("div", {key: "c5"+index, className: "float-left form-field"}, 
					React.createElement("input", {
						key: "c5"+index, 
						type: "text", 
						className: "r-form-text "+ ((me.props.elComponent.clsName)?me.props.elComponent.clsName:""), 
						style: (me.props.elComponent.style)?me.props.elComponent.style:{}, 
						ref: me.props.elComponent.name[index], 
						name: me.props.elComponent.name[index], 
						placeholder: me.props.elComponent.placeHolder, 
						defaultValue: me.props.elComponent.value[index], 
						onChange: me.onChange, 
						onBlur: me.onBlur, 
						onClick: me.onChange}
					)
				)
			)
		});
		
		return(
			React.createElement("div", {className: "form-element-box choice-wrapper float-left clear "+this.props.elComponent.ctClsName, "data-json": JSON.stringify(this.props.elComponent)}, 
				optionChoiceItems, 
				
				React.createElement("div", {name: me.props.elComponent.name[0]+"_errorMsg", className: me.props.elComponent.name[0]+"_errorMsg error-message"}), 
				React.createElement("div", {name: me.props.elComponent.name[1]+"_errorMsg", className: me.props.elComponent.name[1]+"_errorMsg error-message"})
			)
		)
	}
});

module.exports = ChoiceOption;
},{"./CommonMixin":4,"./Global":10,"create-react-class":19,"react":"react","react-dom":"react-dom"}],4:[function(require,module,exports){
var React = require('react');
var ReactDOM = require('react-dom');

var Global = require('./Global');

//	mixin to use common functions in each component according to requirement
var CommonMixin = {
	formMode: "read",
	applyValidations: true,
	initiallyStartup: false,
	init: function(){
		Global.isMobile = (this.isMobile.any() == null) ? false : true;
	},
	isMobile: {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (this.Android() || this.BlackBerry() || this.iOS() || this.Opera() || this.Windows());
		}
	},
	isInViewport: function(element){
		var rect = element.getBoundingClientRect();
		var html = document.documentElement;
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || html.clientHeight) &&
			rect.right <= (window.innerWidth || html.clientWidth)
		);
	},
	confirmBox: function(title, message, cb, config){
		var me = this;
		Global.callMe("open");
		var config = config ? config : {};
		config.id = config.id ? config.id : 't-confirm-msg';
		
		$("[name='common_alert_popup']").dialog({
			title: title,
			width: 500,
			height: 190,
			modal: true,
			resizable: false,
			buttons: [
				{
					text: config.yesButtonText ? config.okButtonText : 'Yes',
					"name": "popupBtnYes",
					click: function() {
						Global.callMe("close");
						cb('yes', this.text);
						$(this).dialog('destroy');
						$("[name='common_alert_popup']").html("");
					}
				},
				{
					text: config.yesButtonText ? config.okButtonText : 'No', 
					"name": "popupBtnNo",
					click: function() {
						Global.callMe("close");
						cb('no', this.text);
						$(this).dialog('destroy');
						$("[name='common_alert_popup']").html("");
					}
				}
			],
			close: function(ev, ui) {
				Global.callMe("close");
				$(this).dialog('destroy');
				$("[name='common_alert_popup']").html("");
			}
		});
		
		$("[name='common_alert_popup']").html("<p style='font-size: 12px;'><span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>"+message+"</p>");
	},
	alertBox: function(title, message, cb, config){ 
		Global.callMe("open");
		var config = config ? config : {};
		config.id = config.id ? config.id : 't-alert-msg';
		$("[name='common_alert_popup']").dialog({
			title: title,
			width: 500,
			height: 190,
			resizable: false,
			modal: true,
			buttons: [
				{
					text: config.yesButtonText ? config.okButtonText : 'Ok', 
					"name": "popupBtnOk",
					click: function() {
						Global.callMe("close");
						if(cb) cb('yes', this.text);
						$(this).dialog('destroy');
						$("[name='common_alert_popup']").html("");
					}
				}
			],
			close: function(ev, ui) {
				Global.callMe("close");
				$(this).dialog('destroy');
				$("[name='common_alert_popup']").html("");
			}
		});
		
		$("[name='common_alert_popup']").html("<p style='font-size: 12px;'><span class='ui-icon ui-icon-alert' style='float:left; margin:0 7px 20px 0;'></span>"+message+"</p>");
	},
	checkDefaultValValidations: function(validators, val) {
		if( (val != "") && (typeof validators != "undefined") ){
			if(validators.isAlpha){
				var letters = /^[A-Za-z ]+$/;
				if(!val.match(letters)){
					$("[name='valueToolBoxProp_errorMsg']").html("Alpha characters only, will revert to last valid value.");
					return true;
				}else{
					$("[name='charValidationToolBoxProp_errorMsg']").html("");
				}
			}
			if(validators.isNumeric){
				var letters = /^[0-9., ]+$/;
				if(!val.match(letters)){
					$("[name='valueToolBoxProp_errorMsg']").html("Numeric characters only, will revert to last valid value.");
					return true;
				}else{
					$("[name='charValidationToolBoxProp_errorMsg']").html("");
				}
			}
			if(validators.isAlphaNumeric){
				var letters = /^[0-9a-zA-Z ]+$/;
				if(!val.match(letters)){
					$("[name='valueToolBoxProp_errorMsg']").html("Alphanumeric characters only, will revert to last valid value.");
					return true;
				}else{
					$("[name='charValidationToolBoxProp_errorMsg']").html("");
				}
			}
			if(validators.minLength){
				if( val.length < validators.minLength ){
					$("[name='valueToolBoxProp_errorMsg']").html("should not less than "+validators.minLength+" characters, will revert to last valid value.");
					return true;
				}else{
					$("[name='minLengthToolBoxProp_errorMsg']").html("");
				}
			}
			if(validators.maxLength){
				if( val.length > validators.maxLength ){
					$("[name='valueToolBoxProp_errorMsg']").html("should not greater than "+validators.maxLength+" characters, will revert to last valid value.");
					return true;
				}else{
					$("[name='maxLengthToolBoxProp_errorMsg']").html("");
				}
			}
			if(validators.email){
				var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;
				if(!pattern.test(val)){
					$("[name='valueToolBoxProp_errorMsg']").html("Invalid email address, will revert to last valid value.");
					return true;
				}else{
					$("[name='validationToolBoxProp_errorMsg']").html("");
				}
			}
		}
		return false;
	},
	formRenderedAt: function(mCmpId){
		var mCCmpId = document.getElementById(mCmpId+"-renderedAt");
		var renderedAt = $(mCCmpId).html();
		var timeStamp = renderedAt;
		if(timeStamp != ""){
			var renderedAtArr = timeStamp.split("~");
			if(renderedAtArr[0] == mCmpId){
				return renderedAtArr[1];
			}else{
				return null;
			}
		}else{
			return null;
		}
	},
	removeDuplicateObjectInArr: function(mCmpId, myArr){
		//	remove duplicate entries
		var results = [];
		var idsSeen = {}, idSeenValue = {};
		for (var i = 0, len = myArr.length, id; i < len; ++i) {
			id = myArr[i].elName;
			if (idsSeen[id] !== idSeenValue) {
				var mCCmpId = document.getElementById(mCmpId);
				if($(mCCmpId).find("[name='"+myArr[i].elName+"']").parents(".formInfomation").attr("class")){
					results.push(myArr[i]);
					idsSeen[id] = idSeenValue;
				}
			}
		}
		return results;
		//	remove duplicate entries
	},
	setFormMode: function(id, json, mode, isShowErrMsg, cb){
		var me = this;
		this.formMode = mode;
		
		if(mode == "read")
			this.initiallyStartup = true;
		else
			this.initiallyStartup = false;
		
		if(json.formStructure){
			this.applyValidations = json.formStructure.applyValidations;
		}
		
		ReactDOM.render(
			React.createElement(FormPanel, {cmpId: id, formInfo: json, formMode: mode, isShowErrMsg: isShowErrMsg, callMe: cb}),
			document.getElementById(id)
		);
		
		if(this.formMode == "edit"){
			//	if edit mode create edit panel container
			if($("#form-section-container-edit-toolbox").length <= 0){
				var existEl = document.getElementById( id );
				var newEl = document.createElement( 'div' );
				newEl.id = "form-section-container-edit-toolbox";
				newEl.className = "main-react-form-container form-toolbox-container";
				
				existEl.appendChild(newEl);
				me.showEditPanel(id, json, this.formMode, 0);
			}
			
			setTimeout(function() {
				$("#form-toolbox-container").show();
			}, 100);
		}
		//	call validate function initially to show error message
		this.validateForm(mode, id, this.initiallyStartup, "");
	},
	getFormSectionData: function(mCmpId){
		var formData = {};
		
		//	call function to remove duplicate values
		Global.allFormElObjects = this.removeDuplicateObjectInArr(mCmpId, Global.allFormElObjects);
		
		var elmCmpId = document.getElementById(mCmpId);
		var validateRes = Global.allFormElObjects.map(function(val) {
			if($("[name='"+val.elName+"']").parents(".formInfomation").attr("name") == "TMFormSectionContainer"){
				if(val.type == "radio" || val.type == "checkbox" || val.type == "scheckbox"){
					var elField = $(elmCmpId).find("[name='"+val.elName+"']");
					var checkedVal = [];
					for(var i=0; i < elField.length; i++){
						if(elField[i].checked) {
							if(val.type == "radio"){
								var checkedVal = elField[i].value;
							}else{
								checkedVal.push(elField[i].value);
							}
						}
					}
					
					if(checkedVal.length > 0) formData[val.elName] = checkedVal;
				}else{
					var updatedFldVal = $(elmCmpId).find("[name='"+val.elName+"']").val();
					if(updatedFldVal != "") formData[val.elName] = updatedFldVal;
				}
			}
		});
		return JSON.stringify(formData);
	},
	getFormSectionJSON: function(mCmpId, formInfo, exportJson){
		var mainIdEl = document.getElementById( mCmpId );
		
		//	get all elements JSON and push them into main JSON
		formInfo.formStructure.elements = [];
		$(mainIdEl).find("[name='TMFormSectionContainer'] div[data-json]").each(function(index) {
			if( ($(this).attr("data-json") != "") && ( ($(this).parent('.handle-sortable:visible').length > 0) || ($(this).parent('.el-container:visible').length > 0)) ){
				formInfo.formStructure.elements.push(jQuery.parseJSON($(this).attr("data-json")));
			}
		});
		
		//	update form title, description, font-size and label width
		if($(mainIdEl).find("[name='TMFormSectionContainer']").attr("data-json")){
			var formProperties = jQuery.parseJSON($(mainIdEl).find("[name='TMFormSectionContainer']").attr("data-json"));
			formInfo.formStructure.maxFldNumber = formProperties.maxFldNumber;
			
			formInfo.formStructure.frmDescription = formProperties.frmDescription;
			formInfo.formStructure.frmDescFontWeight = formProperties.frmDescFontWeight;
			formInfo.formStructure.frmDescFontStyle = formProperties.frmDescFontStyle;
			formInfo.formStructure.frmDescFontDecoration = formProperties.frmDescFontDecoration;
			formInfo.formStructure.frmDescFontAlign = formProperties.frmDescFontAlign;
			formInfo.formStructure.frmTitle = formProperties.frmTitle;
			formInfo.formStructure.frmlabelWidth = formProperties.frmlabelWidth;
		
			if(formInfo.formStructure.style)
				formInfo.formStructure.style["fontSize"] = formProperties.style.fontSize;
		}
		
		if(exportJson == "structure-json"){
			var partialJSON = {formStructure: formInfo.formStructure};
			return JSON.stringify(partialJSON);
		}
		
		var jsonData = jQuery.parseJSON(this.getFormSectionData(mCmpId));
		formInfo.formData = jsonData;
		
		if(exportJson == "data-json"){
			var partialJSON = {formData: jsonData};
			return JSON.stringify(partialJSON);
		}
		
		formInfo = JSON.stringify(formInfo);
		
		//	set JSON into hidden field
		$("#formJsonData").val(formInfo);
		return formInfo;
	},
	
	getDiffJson: function(currentJson, diffJson){
		var diff = {};

		for (var k in currentJson) {
			if (!(k in diffJson)){
				if(currentJson[k] != ""){
					diff[k] = "No Value Set~diff~set-data-ui";  // property in both but has changed
				}else{
					diff[k] = undefined;  // property gone so explicitly set it undefined
				}
			}else if (currentJson[k] !== diffJson[k]){
				if( (currentJson[k] != "") || (diffJson[k] != "") ){
					var dVal = (diffJson[k] != "") ? diffJson[k] : "No Value Set";
					var nVal = currentJson[k];
					if(String(dVal).trim() != String(nVal).trim()){
						if( nVal == "")
							diff[k] = dVal+"~diff~unset-data-ui";  // property in both but has changed
						else if( dVal == "No Value Set")
							diff[k] = dVal+"~diff~set-data-ui";  // property in both but has changed
						else
							diff[k] = dVal+"~diff~modified-data-ui";  // property in both but has changed
					}
				}
			}
		}
		
		for (k in diffJson) {
			v = diffJson[k];
			if (!(k in currentJson)){
				if(v == "" && currentJson[k] == "undefined"){}else{
					diff[k] = diffJson[k]+"~diff~set-data-ui"; // property is new
				}
			}
		}
		return diff;
	},
	checkIfObjectExists: function(allFormObjects, name, type, value){
		for (var i in allFormObjects){
			//	check if this object is already existed in array
			if (allFormObjects[i].elName == name) {
				if(type == "validation"){
					allFormObjects[i].validator = value;
				/*}else if(type == "value"){
					allFormObjects[i].elVal = value;*/
				}else{
					//	remove existed object
					Global.allFormElObjects.splice(Global.allFormElObjects.indexOf(allFormObjects[i]), 1);
				}
				break; //Stop this loop, we found it!
			}
		}
	},
	err: "",		//		err should be blank by default
	hasStructureValidationIssues: function(mCmpId){
		/*
		*	checking field name, option value validation. Like: unique
		*	a. only be lower case, b. have no spaces, c. have a max length (30), d. only alphanumeric characters
		*	e. start with alpha, f. allow "-", but not trailing "-", g. unique
		*/
		var err = false;
		var fldNameArr = [];
		var mainIdEl = document.getElementById( mCmpId );
		
		jQuery(mainIdEl).find("[name='TMFormSectionContainer'] div[data-json]").each(function(index) {
			el = $(this);
			if($(this).attr("data-json")){
				var formElJSON = jQuery.parseJSON($(this).attr("data-json"));
				var formSubElJSON = (formElJSON.elements) ? formElJSON.elements : "";
				
				//	insert field name into array if does not exist
				if(fldNameArr.indexOf(formElJSON.name) > -1){
					err = true;
					return true;
				}else{
					fldNameArr.push(formElJSON.name);
				}
				
				if(formElJSON.name.length > 20){
					err = true;
					return true;
				}
				
				if(!(/^[a-z](?:-?[a-z0-9~]+)*$/i).test(formElJSON.name)){
					err = true;
					return true;
				}
				
				if(formSubElJSON != ""){
					optionNameArr = optionValueArr = [];
					
					jQuery(formSubElJSON).each(function(opts) {
						var optionLbl = formSubElJSON[opts].label;
						var optionVal = formSubElJSON[opts].value;
						
						//	check option name/value max length validation
						if( (optionLbl.length > 30) || (optionVal.length > 30) ){
							err = true;
							return true;
						}
						
						//	check option value validation
						if(!(/^[a-z](?:-?[a-z0-9]+)*$/i).test(optionVal)){
							err = true;
							return true;
						}
						
						//	check option name/value if already exist
						if( (optionNameArr.indexOf(optionLbl) > -1) || (optionValueArr.indexOf(optionVal) > -1) ){
							err = true;
							return true;
						}else{
							optionNameArr.push(optionLbl);
							optionValueArr.push(optionVal);
						}
					});
				}
			}
		});
		
		return err;
	},
	hasDataValidationIssues: function(mCmpId, showFormErr){
		var me = this;
		var elCpId = document.getElementById(mCmpId);
		
		//	call function to remove duplicate values
		Global.allFormElObjects = this.removeDuplicateObjectInArr(mCmpId, Global.allFormElObjects);
		var validateRes = Global.allFormElObjects.map(function(val, i) {
			if(me.applyValidations){
				return me.validateField(mCmpId+"~noerr", val.elName, val.elVal, val.validator, "protected", val.type, false);
			}
		});
		
		var err = false;
		if(this.applyValidations){
			for (var i=0; i < validateRes.length; i++){
				if(validateRes[i] != ""){
					err = true;
					break;
				}
			}
		}
		
		document.getElementById(mCmpId).getElementsByClassName("common_errorMsg")[0].className = "common_errorMsg no-error-message";
		document.getElementById(mCmpId).getElementsByClassName("common_errorMsg")[0].innerHTML = "";
		if(showFormErr){
			var isShowErrMsg = $(elCpId).find("#isShowErrMsg").val();
			if(err && (isShowErrMsg == "true") ){
				document.getElementById(mCmpId).getElementsByClassName("common_errorMsg")[0].className = "common_errorMsg error-message";
				document.getElementById(mCmpId).getElementsByClassName("common_errorMsg")[0].innerHTML = "The Form has Validation Errors";
			}
		}		
		return err;
	},
	validateForm: function(mode, cmpId, initiallyStartup, errFldClr){
		this.formMode = mode;
		var me = this;
		this.initiallyStartup = initiallyStartup
		
		Global.formErrFlds = [];
		var formData = {};
		
		//	call function to remove duplicate values
		Global.allFormElObjects = this.removeDuplicateObjectInArr(cmpId, Global.allFormElObjects);
		
		var elmCmpId = document.getElementById(cmpId);
		var validateRes = Global.allFormElObjects.map(function(val) {
			if($("[name='"+val.elName+"']").parents(".formInfomation").attr("name") == "TMFormSectionContainer"){
				if(val.type == "radio" || val.type == "checkbox" || val.type == "scheckbox"){
					var elField = $(elmCmpId).find("[name='"+val.elName+"']");
					var checkedVal = [];
					for(var i=0; i < elField.length; i++){
						if(elField[i].checked) {
							if(val.type == "radio"){
								var checkedVal = elField[i].value;
							}else{
								checkedVal.push(elField[i].value);
							}
						}
					}
					formData[val.elName] = checkedVal;
				}else{
					val.elVal = $(elmCmpId).find("[name='"+val.elName+"']").val();
					formData[val.elName] = val.elVal;
				}
			}
			
			if(me.applyValidations){
				var returnValidateFieldErr = "";
				if( typeof val.validator != 'undefined'){
					returnValidateFieldErr = me.validateField(cmpId, val.elName, val.elVal, val.validator, mode, val.type, false);
					if(returnValidateFieldErr != ""){
						Global.formErrFlds.push(val.elName);
						
						if(errFldClr == "show"){
							//document.getElementById(cmpId).getElementsByClassName(val.elName)[0].style.border = "solid 1px red";
						}else if(errFldClr == "hide"){
							document.getElementById(cmpId).getElementsByClassName(val.elName+"_errorMsg")[0].innerHTML = "";
							$(elmCmpId).find("[name='"+val.elName+"']").css({"border": ""});
						}
					}
				}
				return returnValidateFieldErr;
			}
		});
		
		var validationPass = true;
		
		if(this.applyValidations){
			for (var i=0; i < validateRes.length; i++){
				if(validateRes[i] != ""){
					validationPass = false;
					break;
				}
			}
		}
		
		if(!validationPass){
			var isShowErrMsg = $(elmCmpId).find("#isShowErrMsg").val();
			
			if(isShowErrMsg == "true"){
				if(this.formMode != "edit"){
					document.getElementById(cmpId).getElementsByClassName("common_errorMsg")[0].className = "common_errorMsg error-message";
					document.getElementById(cmpId).getElementsByClassName("common_errorMsg")[0].innerHTML = "The Form has Validation Errors";
				}
				if(this.formMode == "read")
					$(elmCmpId).find(".preview-error-field-link").show();
				else
					$(elmCmpId).find(".preview-error-field-link").hide();
			}else{
				$(elmCmpId).find(".preview-error-field-link").hide();
			}
		}else{
			$(elmCmpId).find(".preview-error-field-link").hide();
			if(this.applyValidations){
				document.getElementById(cmpId).getElementsByClassName("common_errorMsg")[0].className = "common_errorMsg no-error-message";
				document.getElementById(cmpId).getElementsByClassName("common_errorMsg")[0].innerHTML = "";
			}
		}
		
		if(this.formMode == "edit"){
			//	if form is in read mode then remove validation messages
			document.getElementById(cmpId).getElementsByClassName("common_errorMsg")[0].innerHTML = "";
		}
		
		return JSON.stringify(formData);
	},
	validateField: function(cmpId, name, value, vTypes, formModeVal, inputType, chkAllFld){
		var me = this;
		cmpIdArr = cmpId.split("~");
		cmpId = cmpIdArr[0];
		var noErr = (cmpIdArr[1]) ? false : true;
		
		//	remove extra spaces from both sides
		value = (typeof value != "undefined") ? value.trim() : "";
		
		me.err = "";
		var elmCmpId = document.getElementById(cmpId);
		
		//	check if validation types is an object
		if(typeof vTypes != "undefined"){
			//	loop on all validations
			Object.keys(vTypes).forEach(function(key) {
				switch(key){
					case "isRequired":
						if(vTypes[key]){
							var elField = $(elmCmpId).find("[name='"+name+"']");
							if(inputType == "radio" || inputType == "checkbox" || inputType == "scheckbox"){
								var c = -1;
								for(var i=0; i < elField.length; i++){
									if(elField[i].checked) {
										c = i;
									}
								}
								
								if(inputType == "radio"){
									var eMsg = "You must choose an action.";
								}else{
									var eMsg = "You must choose an option.";
								}
								if (c == -1) me.err = eMsg;
							}else{
								if(value == ""){
									if($("[name='"+name+"']").hasClass("hasDatepicker")){
										me.err = "You must select Date.";
									}else{
										me.err = "Field should not be empty.";
									}
								}
							}
						}
					break;
					
					case "minLength":
						if( (value != "") && (value.length < vTypes[key])){
							if(me.err == "") me.err = "Field should not have less than "+vTypes[key]+" characters";
						}
					break;
					
					case "maxLength":
						if( (value != "") && (value.length > vTypes[key])){
							if(me.err == "") me.err = "Field should not have greater than "+vTypes[key]+" characters";
						}
					break;
					
					case "email":
						if(value != ""){
							if(vTypes[key]){
								var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;
								if(!pattern.test(value)){
									if(me.err == "") me.err = "Invalid email address";
								}
							}
						}
					break;
					
					case "isNumeric":
						if(value != ""){
							if(vTypes[key]){
								var letters = /^[0-9., ]+$/;
								if(!value.match(letters)){
									if(me.err == "") me.err = "Numeric characters only";
								}
							}
						}
					break;
					
					case "isAlpha":
						if(value != ""){
							if(vTypes[key]){
								var letters = /^[A-Za-z ]+$/;
								if(!value.match(letters)){
									if(me.err == "") me.err = "Alpha characters only";
								}
							}
						}
					break;
					
					case "isAlphaNumeric":
						if(value != ""){
							if(vTypes[key]){
								var letters = /^[0-9a-zA-Z ]+$/;
								if(!value.match(letters)){
									if(me.err == "") me.err = "Alphanumeric characters only";
								}
							}
						}
					break;
				}
				
				if(!me.initiallyStartup){
					if( noErr && cmpId && (formModeVal != "edit") ){
						document.getElementById(cmpId).getElementsByClassName(name+"_errorMsg")[0].innerHTML = me.err;
						if(me.err){
							$(elmCmpId).find("[name='"+name+"']").css({"border": "solid 1px red"});
						}else{
							$(elmCmpId).find("[name='"+name+"']").css({"border": ""});
						}
					}
				}
			});
			
			if(me.err == ""){
				(Global.formErrFlds.indexOf(name) >= 0) ? Global.formErrFlds.splice(Global.formErrFlds.indexOf(name), 1) : "";
			}else{
				((chkAllFld === true) && Global.formErrFlds.indexOf(name) < 0) ?  Global.formErrFlds.push(name) : "";
			}
		}
		
		if( (Global.formErrFlds.length > 0) && (formModeVal == "protected") ){
			document.getElementById(cmpId).getElementsByClassName("common_errorMsg")[0].className = "common_errorMsg error-message";
			document.getElementById(cmpId).getElementsByClassName("common_errorMsg")[0].innerHTML = "The Form has Validation Errors";
		}else{
			document.getElementById(cmpId).getElementsByClassName("common_errorMsg")[0].className = "common_errorMsg no-error-message";
			document.getElementById(cmpId).getElementsByClassName("common_errorMsg")[0].innerHTML = "";
		}
		return me.err;
	}/*RemoveIf(production)*/,
	importChoiceClick: function(e){
		var me = this;
		Global.callMe("open");
			e.preventDefault();
			
			var fldName = $("#changeableFieldName").val();
			var ccD = document.getElementById(cmpId);
			dataJson = $(ccD).find("[name='"+fldName+"']").parents(".handle-sortable").find(".form-element-box").attr("data-json");
			var dataJson = (dataJson) ? jQuery.parseJSON(dataJson) : "";
			
			$("#import-dialog-popup").dialog({
				modal: true,
				width: 710,
				height: 470,
				title: "Manage Choice Dialog Box",
				buttons: [
					{
						text: "Validate",
						"name": "btnValidate",
						click: function() {
							var optionElObj = new Object();
							var optionElRecursiveObj = new Object();
							var existOptionElObj = new Object();
							var existOptionElRecursiveObj = new Object();
							
							var csvText = $("#option-csv-area").val();
							csvText = csvText.trim()
							if(csvText != ""){
								var optionArr = [];
								var lastOptionName = lastOptionVal = "";
								var prevOptLen = 0;
								optionArr = csvText.split(/\n/);
								
								dataJson.elements.map(function(optionChoice) {
									existOptionElObj[optionChoice.label] = optionChoice.value;
									existOptionElRecursiveObj[optionChoice.value] = optionChoice.label;
								});
								
								var hasChoiceError = tolOptLen = false;
								var seperatedErrLines = uniqueOptNamErrLines = uniqueOptValErrLines = lengthOptNamErrLines = lengthOptValErrLines = invalidOptValErrLines = systemGeneratedOptValErrLines = systemGeneratedOptNamErrLines = "";
								
								$(".lineno").removeClass("lineselect");
								
								var optionArrLen = optionArr.length;
								
								if(optionArrLen > 100){
									hasChoiceError = true;
									tolOptLen = true;
								}else{
									var elOptions = optionArr.map(function(val, index) {
										var addIndex = index+1;
										if( (val.indexOf(',') > -1) || (val.indexOf('\t') > -1)){
											$(".lineno-"+addIndex).removeClass("lineselect");
											
											if(val.indexOf(',') > -1){
												var option = val.split(",");
											}else if(val.indexOf('\t') > -1){
												var option = val.split("\t");
											}
											
											var optNam = option[0].trim();
											var optVal = option[1].trim();
											
											if(typeof optNam != "undefined" && typeof optVal != "undefined"){
												if(optNam.length > 30){
													lengthOptNamErrLines = lengthOptNamErrLines+","+addIndex;
													hasChoiceError = true;
													$(".lineno-"+addIndex).addClass("lineselect");
												}
												
												if(optVal.length > 30){
													lengthOptValErrLines = lengthOptValErrLines+","+addIndex;
													hasChoiceError = true;
													$(".lineno-"+addIndex).addClass("lineselect");
												}
												
												//	check option value validation
												if(!(/^[a-z](?:-?[a-z0-9]+)*$/i).test(optVal)){
													invalidOptValErrLines = invalidOptValErrLines+","+addIndex;
													hasChoiceError = true;
													$(".lineno-"+addIndex).addClass("lineselect");
												}
												
												if(typeof existOptionElObj[optNam] == "undefined"){
													if(/\boption\-/i.test(optNam)){
														systemGeneratedOptNamErrLines = systemGeneratedOptNamErrLines+","+addIndex;
														hasChoiceError = true;
														$(".lineno-"+addIndex).addClass("lineselect");
													}
												}
												
												if(typeof existOptionElRecursiveObj[optVal] == "undefined"){
													if(/\boption-value\-/i.test(optVal)){
														systemGeneratedOptValErrLines = systemGeneratedOptValErrLines+","+addIndex;
														hasChoiceError = true;
														$(".lineno-"+addIndex).addClass("lineselect");
													}
												}
												
												if(typeof optionElObj[optNam] == "undefined"){
													optionElObj[optNam] = optVal;
												}else{
													uniqueOptNamErrLines = uniqueOptNamErrLines+","+addIndex;
													hasChoiceError = true;
													$(".lineno-"+addIndex).addClass("lineselect");
												}
												
												if(typeof optionElRecursiveObj[optVal] == "undefined"){
													optionElRecursiveObj[optVal] = optNam;
												}else{
													uniqueOptValErrLines = uniqueOptValErrLines+","+addIndex;
													hasChoiceError = true;
													$(".lineno-"+addIndex).addClass("lineselect");
												}
											}
										}else{
											seperatedErrLines = seperatedErrLines+","+addIndex;
											hasChoiceError = true;
											$(".lineno-"+addIndex).addClass("lineselect");
										}
									});
								}
								if(hasChoiceError){
									$(".err-import-choice").removeClass("no-error-message");
									var shrErr = "<div>";
									if(seperatedErrLines != ""){
										seperatedErrLines = seperatedErrLines.substr(1);
										shrErr = shrErr+" separated by `,` or `tab` on line("+seperatedErrLines+").";
									}
									if(invalidOptValErrLines != ""){
										invalidOptValErrLines = invalidOptValErrLines.substr(1);
										shrErr = shrErr+"<br />Invalid option-value on line("+invalidOptValErrLines+").";
									}
									if(systemGeneratedOptNamErrLines != ""){
										systemGeneratedOptNamErrLines = systemGeneratedOptNamErrLines.substr(1);
										shrErr = shrErr+"<br />Only the system can create option names with the form of option-*, on line("+systemGeneratedOptNamErrLines+").";
									}
									if(systemGeneratedOptValErrLines != ""){
										systemGeneratedOptValErrLines = systemGeneratedOptValErrLines.substr(1);
										shrErr = shrErr+"<br />Only the system can create option value with the form of option-value-*, on line("+systemGeneratedOptValErrLines+").";
									}
									if(lengthOptNamErrLines != ""){
										lengthOptNamErrLines = lengthOptNamErrLines.substr(1);
										shrErr = shrErr+"<br />option-display-name length should not greater than 30 on line("+lengthOptNamErrLines+").";
									}
									if(lengthOptValErrLines != ""){
										lengthOptValErrLines = lengthOptValErrLines.substr(1);
										shrErr = shrErr+"<br />option-value length should not greater than 30 on line("+lengthOptValErrLines+").";
									}
									if(uniqueOptNamErrLines != ""){
										uniqueOptNamErrLines = uniqueOptNamErrLines.substr(1);
										shrErr = shrErr+"<br />Uniqueness on option-display-name on line("+uniqueOptNamErrLines+").";
									}
									if(uniqueOptValErrLines != ""){
										uniqueOptValErrLines = uniqueOptValErrLines.substr(1);
										shrErr = shrErr+"<br />Uniqueness on option-value on line("+uniqueOptValErrLines+").";
									}
									if(tolOptLen){
										shrErr = shrErr+"Only 100 options are supported";
									}
									shrErr = shrErr+"</div>";
									$(".err-import-choice").html(shrErr);
									
									if($("#import-dialog-popup").parent(".ui-dialog").height() < 460 ){
										var newDialogHeight = $("#import-dialog-popup").parent(".ui-dialog").height()+($(".err-import-choice").height()+10);
										$("#import-dialog-popup").dialog({ height: newDialogHeight });
									}
									
									//	disable Ok button if error
									$(".ui-dialog-buttonpane button:contains('Ok')").button('disable');
								}else{
									if($("#import-dialog-popup").parent(".ui-dialog").height() > 460 ){
										var newDialogHeight = $("#import-dialog-popup").parent(".ui-dialog").height()-($(".err-import-choice").height()-20);
										$("#import-dialog-popup").dialog({ height: newDialogHeight });
									}
									$(".err-import-choice").html("There is no validation error.");
									$(".err-import-choice").addClass("no-error-message");
									$(".ui-dialog-buttonpane button:contains('Ok')").button('enable');
								}
								
							}else{
								me.alertBox("Error", "Please insert choices in csv format.");
							}
						}
					},
					{
						text: "Ok",
						"name": "btnOk",
						click: function() {
							var _this = this;
							
							$(".ui-dialog-buttonpane button:contains('Ok')").button('disable');
							$('[name=btnOk]').find('span').html('loading...');
							setTimeout(function() {
								if($("#option-csv-area").val() != ""){
									var lastOptionName = lastOptionVal = "";
									var csvText = $("#option-csv-area").val();
									var optionArr = csvText.split(/\n/);
									
									var optionElObj = {};
									var optionElRecursiveObj = {};
									
									var maxId = 0;
									var incrementalUniqueNumber = dataJson.maxOptionNumber;
									
									dataJson.elements = [];
									
									var tolChoices = $("[name='"+dataJson.name+"']").find("option");
									if(tolChoices.length == 0){
										$(ccD).find("[name='"+dataJson.name+"']").parents(".form-field").find("label").hide();
										$(ccD).find("[name='"+dataJson.name+"']").parents(".form-field").find("label span").removeAttr("class value name");
										$(ccD).find("[name='"+dataJson.name+"']").parents(".form-field").find("label").removeAttr("class value name");
										$(ccD).find("[name='"+dataJson.name+"']").parents(".form-field").find("input").removeAttr("class value checked");
									}else{
										$(ccD).find("[name='"+dataJson.name+"']").find("option").remove();
									}
									
									var defaultValExist = false;
									var defaultValue = "";
									var elOptions = optionArr.map(function(val) {
										if( (val.indexOf(',') > -1) || (val.indexOf('\t') > -1)){
											if(val.indexOf(',') > -1){
												var option = val.split(",");
											}else if(val.indexOf('\t') > -1){
												var option = val.split("\t");
											}
											
											if(typeof option[0] != "undefined" && typeof option[1] != "undefined"){
												if((typeof optionElObj[option[0].trim()] == "undefined") && (typeof optionElRecursiveObj[option[1].trim()] == "undefined")){
													
													if(dataJson.value == option[1].trim()){
														defaultValExist = true;
													}
													if(defaultValue == ""){
														defaultValue = option[1].trim();
													}
													
													dataJson.elements.push({label: option[0].trim(), value: option[1].trim()});
													optionElObj[option[0].trim()] = option[1].trim();
													optionElRecursiveObj[option[1].trim()] = option[0].trim();
													me.setFormSectionJSON("OptionValueToolBoxPropAddElement", dataJson, "choice");
												}
											}
										}
									});
									
									if(dataJson.etype != "checkbox"){
										if(!defaultValExist) dataJson.value = defaultValue;
										
										if($("[name='"+dataJson.name+"']").parents(".form-field").find('label:visible').find("input[type='radio']:checked").length <= 0){
											if(dataJson.etype == "radio"){
												$("[name='"+dataJson.name+"-0']").parent("label").find("input").prop("checked", true);
											}
										}
									}
									
									maxId = parseInt(dataJson.elements.length) < parseInt(incrementalUniqueNumber) ? incrementalUniqueNumber : dataJson.elements.length;
									dataJson.maxOptionNumber = parseInt(maxId)+1;
									
									$(ccD).find("[name='"+dataJson.name+"']").parents(".handle-sortable").find(".form-element-box").attr("data-json", JSON.stringify(dataJson));
									
									// should unmount first before re-render
									//ReactDOM.unmountComponentAtNode(document.getElementById("tabs-content-panel-1"));
									
									ReactDOM.render(
										React.createElement(FieldAttributesElements, {fieldProp: true, cmpId: cmpId, dataJson: JSON.stringify(dataJson), formMode: "edit", formInfo: formInfo}), document.getElementById("tabs-content-panel-1")
									);
									$('[name=btnOk]').find('span').html('Ok');
									Global.callMe("close");
									$(_this).dialog('close');
								}else{
									$('[name=btnOk]').find('span').html('Ok');
									
									$(".ui-dialog-buttonpane button:contains('Ok')").button('enable');
									me.alertBox("Error", "Please insert choices in csv format.");
								}
							}, 100);
						}
					}
				],
				open: function() {
					$(".ui-dialog-buttonpane button:contains('Ok')").button('disable');
				},
				close: function(ev, ui) {
					Global.callMe("close");
					$(this).dialog('destroy'); 
					$("#import-dialog-popup").html("");
				}
			});
			
			var dialogHtml = "";
			dataJson.elements.map(function(optionChoice) {
				dialogHtml = dialogHtml+optionChoice.label+", "+optionChoice.value+"\n";
			});
			
			var previewDialogNote = "<div class='preview-note'><b>Note:</b> One can add tab-delimited or comma-delimited.</div><div class='choice-header-preview'>Ex. option-display-name, option-value</div><div class='clear'></div>";
			var errChoice = "<div class='err-import-choice'></div>";
			$("#import-dialog-popup").html(previewDialogNote+'<textarea class="lined" id="option-csv-area" name="option-csv-area" style="width:97%; height: 260px;">'+dialogHtml+'</textarea>'+errChoice);
			$("#import-dialog-popup").dialog("option", "position", "center");
			$("#option-csv-area").css({ "font-size": 14 });
			$("#option-csv-area").focus();
			
			$(".lined").linedtextarea();
	}
	//endRemoveIf(production)
};

module.exports = CommonMixin;

var FormPanel = require('./FormPanel');
},{"./FormPanel":9,"./Global":10,"react":"react","react-dom":"react-dom"}],5:[function(require,module,exports){
var Popover = require('react-awesome-popover');
var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');

var Global = require('./Global');
var CommonMixin = require('./CommonMixin');

//	create date picker
var DatePicker = createReactClass({
	mixins: [CommonMixin],
	getInitialState: function() {
		return {userInput: "", formModeVal: this.props.formModeVal};
	},
	componentDidMount: function() {
		var me = this;
		var mainIdEl = document.getElementById( this.props.cmpId );
		var elNam = this.props.elComponent.name;
		
		var obj = { elName: this.props.elComponent.name, elVal: ReactDOM.findDOMNode(this.refs[this.props.elComponent.name]).value, validator: this.props.elComponent.validator };
		
		this.checkIfObjectExists(Global.allFormElObjects, this.props.elComponent.name, "", "");
		Global.allFormElObjects.push(obj);
		
		var selectedDateFormat = this.props.elComponent.dateFormat;
		
		},
	render: function() {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!

		var yyyy = today.getFullYear();
		if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} var today = mm+'/'+dd+'/'+yyyy;
		this.props.elComponent.value = (this.props.elComponent.value)? this.props.elComponent.value : "";	//today;
		
		var fieldValue = "";
		if((this.props.elData) && typeof this.props.elData[this.props.elComponent.name] != "undefined"){
			fieldValue = this.props.elData[this.props.elComponent.name];
		}else{
			fieldValue = (this.props.elComponent.value)? this.props.elComponent.value : "";
		}
		
		var diffDataCls = diffDataIconCls = diffData = "";
		
		var isDiff = false;
		
		if((this.props.elDiffData) && typeof this.props.elDiffData[this.props.elComponent.name] != "undefined"){
			isDiff = true;
			diffDataIconCls = "modified-data-icon";
			
			//	split array to get new data value and class name
			var diffValClass = this.props.elDiffData[this.props.elComponent.name];
			var diffArr = diffValClass.split("~diff~");
			
			diffData = diffArr[0];
			diffDataCls = diffArr[1];
		}
		
		var hoverTitle = diffData == '' ? "No Value" : diffData;
		//	label hidden if blank
		if(this.props.elComponent.label == ""){ var clsName="hidden"; }else{ var clsName=""; }
		
		if((this.state.formModeVal) && ( (this.state.formModeVal == "edit") || (this.state.formModeVal == "read") ) && (this.props.elComponent.name != "valueToolBoxProp")  )
			var disabledSpanEl = React.createElement("span", {className: "disabled-span"});
		else
			var disabledSpanEl = React.createElement("span", {className: "disabled-span", style:  {width: '130px'} });
		
		return(
			React.createElement("div", {className: diffDataCls+" form-element-box float-left "+this.props.elComponent.ctClsName, "data-json": JSON.stringify(this.props.elComponent)}, 
				React.createElement("div", {className: clsName+" float-left form-field-label"}, 
					React.createElement("label", {name: this.props.elComponent.name+"-label", className: "r-form-el-label " + ((this.props.clsName)?this.props.clsName:""), style: this.props.elComponent.labelStyle}, 
						React.createElement("span", null, this.props.elComponent.label), React.createElement("b", null, ":"), 
						React.createElement("span", {className: "required-sign"}, 
							(this.props.elComponent.validator)?((this.props.elComponent.validator.isRequired)? "*": ""):""
						)
					)
				), 
				React.createElement("div", {className: "float-left form-field"}, 
					disabledSpanEl, 
					React.createElement("input", {
						id: this.props.elComponent.id, 
						type: "text", 
						className: "r-form-text "+ ((this.props.elComponent.clsName)?this.props.elComponent.clsName:""), 
						style: (this.props.elComponent.style)?this.props.elComponent.style:{}, 
						ref: this.props.elComponent.name, 
						name: this.props.elComponent.name, 
						placeholder: this.props.elComponent.placeHolder, 
						readOnly: true, 
						defaultValue: fieldValue, 
						onChange: this.onChange, 
						onBlur: this.onBlur, 
						onClick: this.onChange}
					), 
					React.createElement("br", null), 
					React.createElement("div", {name: this.props.elComponent.name+"_errorMsg", className: this.props.elComponent.name+"_errorMsg error-message"})
				), 
				React.createElement("span", {className: diffDataIconCls, alt: diffData, title: diffData})
				
			)
		)
	}
});

module.exports = DatePicker;

},{"./CommonMixin":4,"./Global":10,"create-react-class":19,"react":"react","react-awesome-popover":27,"react-dom":"react-dom"}],6:[function(require,module,exports){
var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');

var Global = require('./Global');
var CommonMixin = require('./CommonMixin');

//	create divider
var Divider = createReactClass({
	mixins: [CommonMixin],
	getInitialState: function() {
		return {userInput: "", formModeVal: this.props.formModeVal};
	},
	componentDidMount: function() {
		var me = this;
		var mainIdEl = document.getElementById( this.props.cmpId );
		var elNam = this.props.elComponent.name;
		
		var obj = { elName: this.props.elComponent.name, elVal: ReactDOM.findDOMNode(this.refs[this.props.elComponent.name]).value, validator: this.props.elComponent.validator };
		
		this.checkIfObjectExists(Global.allFormElObjects, this.props.elComponent.name, "", "");
		Global.allFormElObjects.push(obj);
		
		var selectedDateFormat = this.props.elComponent.dateFormat;
		
		},
	render: function() {
		var fieldValue = "";
		if((this.props.elData) && typeof this.props.elData[this.props.elComponent.name] != "undefined"){
			fieldValue = this.props.elData[this.props.elComponent.name];
		}else{
			fieldValue = (this.props.elComponent.value)? this.props.elComponent.value : "";
		}
		
		return(
			React.createElement("div", {className: "form-element-box float-left "+this.props.elComponent.ctClsName, "data-json": JSON.stringify(this.props.elComponent)}, 
				React.createElement("div", {className: "float-left form-field form-field-divider"}, 
					React.createElement("hr", {
						id: this.props.elComponent.id, 
						className: "r-form-divider "+ ((this.props.elComponent.clsName)?this.props.elComponent.clsName:""), 
						style: (this.props.elComponent.style)?this.props.elComponent.style:{}, 
						ref: this.props.elComponent.name, 
						name: this.props.elComponent.name}
					), 
					React.createElement("input", {type: "hidden", name: this.props.elComponent.name})
				)
			)
		)
	}
});

module.exports = Divider;

},{"./CommonMixin":4,"./Global":10,"create-react-class":19,"react":"react","react-dom":"react-dom"}],7:[function(require,module,exports){
var Popover = require('react-awesome-popover');
var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');

var Global = require('./Global');
var CommonMixin = require('./CommonMixin');

//	create drop down
var DropDown = createReactClass({
	mixins: [CommonMixin],
	getInitialState: function() {
		return {userInput: "", formModeVal: this.props.formModeVal};
	},
	componentDidMount: function() {
		var obj = { elName: this.props.elComponent.name, elVal: ReactDOM.findDOMNode(this.refs[this.props.elComponent.name]).value, validator: this.props.elComponent.validator };
		
		this.checkIfObjectExists(Global.allFormElObjects, this.props.elComponent.name, "", "");
		Global.allFormElObjects.push(obj);
	},
	render: function() {
		var me = this;
		var fieldValue = "";
		if((this.props.elData) && typeof this.props.elData[this.props.elComponent.name] != "undefined"){
			fieldValue = this.props.elData[this.props.elComponent.name];
		}else{
			fieldValue = (this.props.elComponent.value)? this.props.elComponent.value : "";
		}
		
		var diffDataCls = diffDataIconCls = diffData = "";
		var isDiff = false;
		
		if((this.props.elDiffData) && typeof this.props.elDiffData[this.props.elComponent.name] != "undefined"){
			isDiff = true;
			diffDataIconCls = "modified-data-icon";
			
			//	split array to get new data value and class name
			var diffValClass = this.props.elDiffData[this.props.elComponent.name];
			var diffArr = diffValClass.split("~diff~");
			
			diffData = diffArr[0];
			diffDataCls = diffArr[1];
		}
		
		if(this.state.userInput != "")
			fieldValue = this.state.userInput;
		
		var dropDownItems = this.props.elComponent.elements.map(function(val, index) {
			if(diffData == val.value) diffData = val.label;
			
			return React.createElement("option", {name: me.props.elComponent.name+"-"+index, key: Math.random(), value: val.value}, val.label)
		});
		
		var hoverTitle = diffData == '' ? "No Value" : diffData;
		//	label hidden if blank
		if(this.props.elComponent.label == ""){ var clsName="hidden"; }else{ var clsName=""; }
		
		this.props.elComponent.maxOptionNumber = (this.props.elComponent.maxOptionNumber) ? this.props.elComponent.maxOptionNumber : this.props.elComponent.elements.length;
		return(
			React.createElement("div", {className: diffDataCls+" form-element-box float-left "+this.props.elComponent.ctClsName, "data-json": JSON.stringify(this.props.elComponent)}, 
				React.createElement("div", {className: clsName+" float-left form-field-label"}, 
					React.createElement("label", {name: this.props.elComponent.name+"-label", className: "r-form-el-label " + ((this.props.clsName)?this.props.clsName:""), style: this.props.elComponent.labelStyle}, 
						React.createElement("span", null, this.props.elComponent.label), React.createElement("b", null, ":"), 
						React.createElement("span", {className: "required-sign"}, 
							(this.props.elComponent.validator)?((this.props.elComponent.validator.isRequired)? "*": ""):""
						)
					)
				), 
				React.createElement("div", {className: "float-left form-field"}, 
					React.createElement("select", {
						defaultValue: fieldValue, 
						id: this.props.elComponent.id, 
						type: "dropdown", 
						className: "r-form-drop-down "+ ((this.props.elComponent.clsName)?this.props.elComponent.clsName:""), 
						style: (this.props.elComponent.style)?this.props.elComponent.style:{}, 
						ref: this.props.elComponent.name, 
						name: this.props.elComponent.name, 
						onChange: this.onChange, 
						onBlur: this.onChange, 
						onClick: this.onChange
					}, 
					dropDownItems
					), 
					React.createElement("br", null), 
					React.createElement("div", {name: this.props.elComponent.name+"_errorMsg", className: this.props.elComponent.name+"_errorMsg error-message"})
				), 
				React.createElement("span", {className: diffDataIconCls, alt: diffData, title: diffData})
				
			)
		)
	}
});

module.exports = DropDown;

},{"./CommonMixin":4,"./Global":10,"create-react-class":19,"react":"react","react-awesome-popover":27,"react-dom":"react-dom"}],8:[function(require,module,exports){
var React = require('react');
var createReactClass = require('create-react-class');

//	create fieldSet
var FieldSet = createReactClass({
	render: function() {
		//	first field set always be hidden
		
		return React.createElement("fieldset", {style: this.props.style, className: "r-fieldset " + ((this.props.clsName)?this.props.clsName:"")}, 
					React.createElement("legend", {style: (this.props.style)? {display: "none"}: {}}, this.props.title, ":"), 
					React.createElement("div", {className: "sortable"}, 
						this.props.innerElements
					)
				)
		}
});

module.exports = FieldSet;

},{"create-react-class":19,"react":"react"}],9:[function(require,module,exports){
var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');

var PerfectScrollbar = require('perfect-scrollbar');

var Global = require('./Global');
var CommonMixin = require('./CommonMixin');

//	create form
var FormPanel = createReactClass({
	mixins: [CommonMixin],
	getInitialState: function() {
		Global.callMe = (Global.callMe != "") ? Global.callMe : this.props.callMe;
		return {activeTabId: 0, dataJson: {}};
	},
	bindEditFunctions: function(){
		var me = this;
		var fInfo = this.props.formInfo;
		var previousFormId = this.props.cmpId;
		var fFormMode = this.props.formMode;
		var $ = jQuery;
		
		var elmCmpId = document.getElementById(this.props.cmpId);
		var elmPrevCmpId = document.getElementById(previousFormId);
		
		// add common class to main comp id if not exist
		if(typeof $(".react-form-section-class").attr("id") == "undefined")
			$(elmCmpId).addClass("react-form-section-class");
		
		//	update label width and label font size
		var lblWdth = this.props.formInfo.formStructure.frmlabelWidth;
		$(elmPrevCmpId).find("[name='TMFormSectionContainer']").find("label.r-form-el-label").css({"width": lblWdth});
		
		//	prevent form submission
		$("[name='"+this.props.formInfo.formStructure.name+"']").submit(function (e) {
			e.preventDefault();
			return false;
		});
		
		var mainIdEl = document.getElementById( Global.mainCmpId );
		
		//	change bg color
		jQuery(mainIdEl).css('backgroundColor','#F3F3F3');
		
		jQuery(mainIdEl).find(".formInfomation .form-element-box").find(':text, textarea').css('color','#666666');
			jQuery(mainIdEl).find(".formInfomation .form-element-box").find(':text, textarea').attr('readonly','readonly');
			jQuery(mainIdEl).find(".formInfomation .form-element-box").find(':radio, :checkbox, button, select').attr('disabled','disabled');
			jQuery(mainIdEl).find(".formInfomation .form-element-box").find(":radio, :checkbox, button, select").parents(".form-field").prepend("<span class='disabled-span'></span>");
		$(mainIdEl).find("[name='show_error_fields']").unbind( "click" );
			$(mainIdEl).find("[name='show_error_fields']").click( function(e){
				e.preventDefault();
				
				var errFieldVisibility = $(mainIdEl).find(".preview-error-field-link").attr("rel");
				
				me.validateForm(fFormMode, previousFormId, false, errFieldVisibility);
				
				$(mainIdEl).find(".preview-error-field-link").attr("rel", (errFieldVisibility == "show") ? "hide" : "show");
				$(mainIdEl).find(".preview-error-field-link").html( ((errFieldVisibility == "hide") ? " - Show" : " - Hide")+ " Error Fields");
			});
		},
	componentWillMount: function(){
		if($("head style")[0].childNodes[0].textContent.indexOf("main-react-form-container") < 0){
			$("<style>")
			.prop("type", "text/css")
			.html('body{font-family:arial}.zeroPadding{padding:0!important}.form-element-box a{text-decoration:none}.main-react-form-container textarea{resize:none}#preview-mode-dialog{padding-right: 0!important}#preview-mode-dialog .perfect-scrollbar{}.float-left{float:left!important}.fr{float:right!important}.clear{clear:both}.hidden{display:none}.err-import-choice,.error-message{clear:both;color:red;margin-bottom:3px;float:left}.err-import-choice{font-size:12px;font-weight:700;margin-left:12px;margin-top:5px}.common_errorMsg{float:left}.no-error-message{color:#538135}.required-sign{color:red}.preview-error-field-link{float:left!important;margin-left:3px}.preview-error-field-link,.preview-mode-link{float:right;color:#488CC8;cursor:pointer;font-weight:700}.preview-error-field-link:hover,.preview-mode-link:hover{color:#000}.preview-note{color:red;font-size:12px;padding:5px 12px;float:left}.ui-widget-overlay{opacity:.5!important;filter:Alpha(Opacity=50)!important;background:#323232!important}.choice-header-preview{float:left;clear:both;margin:0 0 5px 12px;font-size:13px;font-weight:700}.ui-dialog #import-dialog-popup{padding:0;display:inline-block;width:700px!important}.main-react-form-container{color:#000;background:#F3F3F3;font-family:arial,tahoma,helvetica,sans-serif;font-size:12px;font-weight:400;display:inline-block;width:95%;height:auto;min-height:200px;}.main-react-form-container .formInfomation h2{padding-bottom:0;font-size:18px}.main-react-form-container .formInfomation p{font-size:12px}.main-react-form-container .el-container{float:left;padding:10px;margin-right:10px;display:inline-block;margin-bottom:10px;position:relative;width:96%}.handle-sortable{padding:10px;margin-right:10px;border:1px solid transparent;display:inline-block;margin-bottom:10px;width:96%;position:relative}.handle-sortable-hover{border:1px dashed #488CC8}.handle-sortable-selected{border:1px solid #488CC8;background-color:#EEE}.handle-area{background-image:url(/tm/common/react-tmail/form/img/arrow.png);background-repeat:no-repeat;cursor:move;width:5%;height:16px;float:left;margin:3px 10px 0 0}.remove-element{background-image:url(/tm/common/react-tmail/form/img/delete.png);background-repeat:no-repeat;cursor:pointer;width:16px;height:16px;float:left;position:absolute;right:15px;top:-7px;display:none}.main-react-form-container .r-information-label{color:#000;font-family:arial,tahoma,helvetica,sans-serif;font-size:12px;font-weight:400;display:inline-block;width:100%;white-space:pre-line;word-wrap:break-word;}.main-react-form-container .r-form-el-label{display:inline-block;float:left;padding:3px 3px 3px 0;position:relative;width:120px;word-wrap:break-word}.main-react-form-container .form-field-label{width:auto}.main-react-form-container .form-field{width:75%;position:relative}.main-react-form-container input.r-form-text{height:24px;width:100%;padding-left:5px}.main-react-form-container textarea.r-form-text-area{width:100%;padding-left:5px}.main-react-form-container select.r-form-drop-down{height:24px;width:100%}.main-react-form-container input.r-form-radio{margin-right:3px}.main-react-form-container .r-form-radio-label-box{margin-right:10px;display:inline-block}.main-react-form-container input.r-form-action-button{display:none;margin:10px}.main-react-form-container .r-form-action-button-label-box{display:block}.main-react-form-container input.r-form-action-button+.r-form-action-button-span{cursor:pointer;float:left;margin:-2px -2px 5px 2px;padding:4px 12px;border:1px solid #999;-webkit-box-shadow:1px 1px 1px 0 #000,0 2px 0 #000;-moz-box-shadow:1px 1px 1px 0 #000,0 2px 0 #000;box-shadow:1px 1px 1px 0 #000,0 2px 0 #000}.main-react-form-container input.r-form-action-button+.action-button-span-default-clr{background-color:#ADD8E6}.main-react-form-container input.r-form-action-button:checked+.r-form-action-button-span{cursor:auto;border:none;background-image:none;background-color:silver;color:#000;-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none}.main-react-form-container input.r-form-action-button:checked+.r-form-action-button-span-edit-mode{border:1px solid #999;-webkit-box-shadow:1px 1px 1px 0 #000,0 2px 0 #000;-moz-box-shadow:1px 1px 1px 0 #000,0 2px 0 #000;box-shadow:1px 1px 1px 0 #000,0 2px 0 #000}.main-react-form-container .undo-action-icon{background-image:url(/tm/common/react-tmail/form/img/arrow-undo.png);background-repeat:no-repeat;cursor:pointer;height:32px;width:32px;margin:-6px 0 0 10px;float:left}.main-react-form-container input.r-form-check-box{margin-right:3px;margin-top:5px}.main-react-form-container .r-form-check-box-label-box{margin-right:10px;display:inline-block}.main-react-form-container .r-fieldset{display: table-row;border:1px solid #CCC;padding:10px;margin-bottom:10px;width:95%;position:relative}.main-react-form-container .r-fieldset legend{color:#111;font:700 11px tahoma,arial,helvetica,sans-serif}.main-react-form-container .r-form-divider{color:#EEE}#import-choice,#reset-choice,#show-more-choice{color:#488CC8;cursor:pointer;padding-bottom:10px}#import-choice:hover,#reset-choice:hover,#show-more-choice:hover{color:#000}#form-section-container-edit-toolbox{}#form-toolbox-container{}.tab-content-area{width:100%;display:inline-block}.margin-bottom{margin-bottom:10px}.margin-right{margin-right:10px}.main-react-form-container .formInfomation .form-element-box{float:left;width:90%}.choice-fieldset .form-element-box.choice-wrapper{width: 100%}.choice-fieldset .form-element-box,.main-react-form-container .choice-fieldset .form-field{width:auto}.main-react-form-container .choice-fieldset .form-element-box{margin:0}.main-react-form-container .choice-fieldset{height:200px;overflow:scroll}.form-element-box{float:left;width:100%}.edit-form-container{border-right: 1px solid #CCCCCC;width:55%;float:left;padding:10px;box-sizing: border-box;}.form-toolbox-container{width:42%;float:right;height:auto;padding:10px 0 0;box-sizing:border-box;}.form-toolbox-container .form-field{width:65%}.form-toolbox-label{text-align:center;margin-bottom:8px;font-size:13px;font-weight:700}#element-buttons-form-section ul{padding:0 0 0 15px;margin:0}#element-buttons-form-section ul li{width:90%;float:left;margin:0 0 15px 0;padding:0 0 0 30px;background-repeat:no-repeat;cursor:pointer;font-size:13px;font-weight:700;list-style-type:none}#element-buttons-form-section ul li.labelarea{background-image:url(/tm/common/react-tmail/form/img/label-area.png)}#element-buttons-form-section ul li.textbox{background-image:url(/tm/common/react-tmail/form/img/single-line-text-bg.png)}#element-buttons-form-section ul li.textarea{background-image:url(/tm/common/react-tmail/form/img/paragraph-text-bg.png)}#element-buttons-form-section ul li.radio{background-image:url(/tm/common/react-tmail/form/img/multiplechoice-bg.png)}#element-buttons-form-section ul li.checkbox,#element-buttons-form-section ul li.scheckbox{background-image:url(/tm/common/react-tmail/form/img/checkbox-bg.png)}#element-buttons-form-section ul li.dropdown{background-image:url(/tm/common/react-tmail/form/img/dropdown-bg.png)}#element-buttons-form-section ul li.actionbutton{background-image:url(/tm/common/react-tmail/form/img/actionbutton.png)}#element-buttons-form-section ul li.datepicker{background-image:url(/tm/common/react-tmail/form/img/calendar.png)}#element-buttons-form-section ul li.divider{background-image:url(/tm/common/react-tmail/form/img/divider.png);background-position:left center}.main-react-form-container .form-field-divider{width:98%}.choice-default-value{background-image:url(/tm/common/react-tmail/form/img/tick-off.png);background-repeat:no-repeat;cursor:pointer;float:right;height:16px;margin-left:3px;padding:0 2px;width:16px}.choice-default-value:hover{background-image:url(/tm/common/react-tmail/form/img/tick-on.png)}.choice-default-value-selected{background-image:url(/tm/common/react-tmail/form/img/tick-on.png)}.add-new-choice-icon{background-image:url(/tm/common/react-tmail/form/img/add.png);background-repeat:no-repeat;cursor:pointer;float:right;height:16px;padding:0 2px;width:16px}.delete-new-choice-icon{background-image:url(/tm/common/react-tmail/form/img/delete.png);background-repeat:no-repeat;cursor:pointer;float:right;height:16px;margin-left:3px;padding:0 2px;width:16px}.tabs-content-panel{display:none}.tabs-content-panel-selected{padding: 20px 15px 0 0;display:block}.tab{cursor:pointer;margin-right:5px;margin-bottom:5px;padding:5px 7px;display:inline-block;text-decoration:none;background:#CCC;color:#000}.tab-selected{padding:5px 7px;display:inline-block;background:#488CC8;color:#FFF;text-decoration:none}#tabs-content-panel-1 h2{font-size:18px;margin:0}.divider-css{padding:0!important;cursor:auto!important}.modified-data-ui{background-color:#FFC;position:relative;padding:10px 10px 8px}.set-data-ui{background-color:#CFC;position:relative;padding:10px}.unset-data-ui{background-color:#FCC;position:relative;padding:10px}.modified-data-icon{margin-left:3px;position:absolute;right:12px;top:2px}.modified-data-ui .modified-data-icon:before{content:"*";color:#BABA05;font-size:50px}.set-data-ui .modified-data-icon:before{content:"+";color:green;font-size:35px}.unset-data-ui .modified-data-icon:before{content:"x";color:red;position:absolute;right:0;top:4px;font-size:25px}.disabled-span{position:absolute;top:0;left:0;height:100%;width:100%;opacity:.01;filter:Alpha(Opacity=0);background:#EEE}div.colorPicker-picker{float:left;margin-right:10px;height:16px;width:16px;padding:0!important;border:1px solid #ccc;background:url(https://laktek.github.io/really-simple-color-picker/arrow.gif) top right no-repeat;cursor:pointer;line-height:16px;font-size:.75em;font-weight:700;text-align:center}div.colorPicker-palette{width:110px;position:absolute;border:1px solid #598FEF;background-color:#EFEFEF;padding:2px;z-index:9999}div.colorPicker_hexWrap{width:100%;float:left}div.colorPicker_hexWrap label{font-size:95%;color:#2F2F2F;margin:5px 2px;width:25%}div.colorPicker_hexWrap input{margin:5px 2px;padding:0;font-size:95%;border:1px solid #000;width:65%}div.colorPicker-swatch{height:12px;width:12px;border:1px solid #000;margin:2px;float:left;cursor:pointer;line-height:12px}.ui-datepicker-trigger{margin-left:5px}#ui-datepicker-div{font-size:.9em!important;z-index:9999!important}.ui-datepicker-header{cursor:move}.ui-datepicker-next,.ui-datepicker-prev{cursor:pointer}.ui-datepicker-close{display:none}.ui-datepicker .ui-datepicker-buttonpane button.ui-datepicker-current{float:right}.mobile-modified-data-icon {width:100%;height:100%;left:0;top:0;position:absolute}.set-data-ui .mobile-modified-data-icon{color:green}.unset-data-ui .mobile-modified-data-icon{color:red}.modified-data-ui .mobile-modified-data-icon{color:#baba05}.custom-popover-content{background: none repeat scroll 0 0 #FFFFFF;border-radius: 5px;box-shadow: 0 0 0 1px rgba(16, 22, 26, 0.1), 0 2px 4px rgba(16, 22, 26, 0.2), 0 8px 24px rgba(16, 22, 26, 0.2);width: 150px !important;height: auto;min-height: 15px;padding: 10px;z-index: 9;}.perfect-scrollbar{position: relative; height: calc(100vh - 135px); overflow: auto;}.perfect-scrollbar-edit{position: relative; height: calc(100vh - 155px); overflow: auto;}.ps__rail-x,.ps__rail-y{display:none;opacity:0;position:absolute}.ps{overflow:hidden!important;overflow-anchor:none;-ms-overflow-style:none;touch-action:auto;-ms-touch-action:auto}.ps__rail-x{transition:background-color .2s linear,opacity .2s linear;-webkit-transition:background-color .2s linear,opacity .2s linear;height:15px;bottom:0}.ps__rail-y{transition:background-color .2s linear,opacity .2s linear;-webkit-transition:background-color .2s linear,opacity .2s linear;width:15px;right:0}.ps--active-x>.ps__rail-x,.ps--active-y>.ps__rail-y{display:block;background-color:transparent}.ps--focus>.ps__rail-x,.ps--focus>.ps__rail-y,.ps--scrolling-x>.ps__rail-x,.ps--scrolling-y>.ps__rail-y,.ps:hover>.ps__rail-x,.ps:hover>.ps__rail-y{opacity:.6}.ps__rail-x:focus,.ps__rail-x:hover,.ps__rail-y:focus,.ps__rail-y:hover{background-color:#eee;opacity:.9}.ps__thumb-x,.ps__thumb-y{background-color:#aaa;border-radius:6px;position:absolute}.ps__thumb-x{transition:background-color .2s linear,height .2s ease-in-out;-webkit-transition:background-color .2s linear,height .2s ease-in-out;height:6px;bottom:2px}.ps__thumb-y{transition:background-color .2s linear,width .2s ease-in-out;-webkit-transition:background-color .2s linear,width .2s ease-in-out;width:6px;right:2px}.ps__rail-x:focus>.ps__thumb-x,.ps__rail-x:hover>.ps__thumb-x{background-color:#999;height:11px}.ps__rail-y:focus>.ps__thumb-y,.ps__rail-y:hover>.ps__thumb-y{background-color:#999;width:11px}@supports (-ms-overflow-style:none){.ps{overflow:auto!important}}@media screen and (-ms-high-contrast:active),(-ms-high-contrast:none){.ps{overflow:auto!important}}').prependTo("head");
		}
	},
	componentDidMount: function(){
		var me = this;
		var mainIdEl = document.getElementById( Global.mainCmpId );
		
        var element =  document.getElementsByClassName('perfect-scrollbar');
        if (typeof(element) != 'undefined' && element != null && element.length > 0) {
            var ps = new PerfectScrollbar('.perfect-scrollbar');
            ps.update();
        }
		
		var d = new Date();
		Global.renderedAt = Global.mainCmpId+'~'+d.getFullYear() + d.getMonth() + d.getDay()+d.getHours()+d.getMinutes()+(d.getSeconds()+3)+d.getMilliseconds();
		
		var renderedAtEl = document.getElementById( mainIdEl+"-renderedAt" );
		if (typeof(renderedAtEl) != 'undefined' && renderedAtEl != null)
			$(renderedAtEl).html(Global.renderedAt);
		else
			$(mainIdEl).append( "<p class='hidden' id='"+Global.mainCmpId+"-renderedAt'>"+Global.renderedAt+"</p>" );
		
		//	show component in delay
		setTimeout(function() {
			$("#form-toolbox-container").show();
		}, 1000);
		
		var frmPropsCDM = me.props;
		
		//	initially bind components
		this.bindEditFunctions();
		
		$("[name='field-1']").parents(".handle-sortable").addClass('handle-sortable-selected');
		
		/*
		*	set true when function will call initially.
		*	validate all fields to show error message initially - on render components
		*/
		
		this.initiallyStartup = true;
		//	this function should be call if formInfo is exist in JSON
		if(this.props.formInfo.formStructure){
			this.applyValidations = this.props.formInfo.formStructure.applyValidations;
			this.validateForm(this.props.formMode, this.props.cmpId, this.initiallyStartup, "");
		}
	},
	render: function() {
		var me = this;
		
		var allFormElObjects = [];
		//	jQuery	-	preserver custom changed label width while inserting new element
		var mainIdEl = document.getElementById( Global.mainCmpId );
		if($(mainIdEl).find("[name='TMFormSectionContainer']").length > 0){
			var divFormInfo = jQuery.parseJSON($("[name='TMFormSectionContainer']").attr("data-json"));
			this.props.formInfo.formStructure.frmlabelWidth = divFormInfo.frmlabelWidth;
		}
		//	jQuery
		
		var mainHtml = editFormMode = editFormCls = editFormToolBoxCls = "";
		var hidePrevMode = "hidden";
		//	there should be form element.
		
		if (this.props.formInfo.formStructure.etype == "form") {
			var isShowErrMsg = (this.props.isShowErrMsg) ? this.props.isShowErrMsg : false;
			var formMode = this.props.formMode;
			
			//	set initially mode value to access from everywhere
			this.formMode = this.props.formMode;
			
			//	main component id
			cmpId = this.props.cmpId;
			
			Global.mainCmpId = this.props.cmpId;
			
			//	form data
			var formData = this.props.formInfo.formData;
			
			//	form diff data
			var formDiffData = (this.props.formInfo.formDiffData) ? this.props.formInfo.formDiffData : "";
			
			//	if mode = edit then change css of form panel
			var sortCls = removeCls = "";
			
			var elContainerCls = "el-container";
			var hideErrField = "hidden";
			
			var elHtml = this.props.formInfo.formStructure.elements.map(function(val) {
				if((val.labelStyle) && val.labelStyle.fontSize != 12){
				}else{
					if(val.etype != "labelarea"){
						if(val.labelStyle){
							val.labelStyle.fontSize = me.props.formInfo.formStructure.style.fontSize;
						}else{
							val.labelStyle = { fontSize: me.props.formInfo.formStructure.style.fontSize };
						}
					}
				}
				
				if(val.etype == "divider") var dvdrClass = "divider-un-clicked"; else var dvdrClass = "";
				
				return React.createElement("div", {className: elContainerCls+" "+dvdrClass, key: Math.random()}, 
							React.createElement("div", {className: sortCls}), 
							React.createElement(RenderAllComponentsRecursion, {formModeVal: formMode, cmpId: cmpId, elStructure: val, elData: formData, elDiffData: formDiffData}), 
							React.createElement("div", {className: removeCls})
						)
			});
			
			elHtml = React.createElement(FieldSet, {style: { border: "none"}, legStyle: { display: "none"}, innerElements: elHtml, elMode: formMode})
			//	form title and description
			var frmSttyle = (this.props.formInfo.formStructure.style)?this.props.formInfo.formStructure.style:{};
			
			var frmDescStyle = {};
			if(this.props.formInfo.formStructure.frmDescFontWeight){
				frmDescStyle.fontWeight = this.props.formInfo.formStructure.frmDescFontWeight;
			}
			if(this.props.formInfo.formStructure.frmDescFontStyle){
				frmDescStyle.fontStyle = this.props.formInfo.formStructure.frmDescFontStyle;
			}
			if(this.props.formInfo.formStructure.frmDescFontDecoration){
				frmDescStyle.textDecoration = this.props.formInfo.formStructure.frmDescFontDecoration;
			}
			if(this.props.formInfo.formStructure.frmDescFontAlign){
				frmDescStyle.textAlign = this.props.formInfo.formStructure.frmDescFontAlign;
			}
			
			var cloneFrmSttyle = JSON.parse(JSON.stringify(frmSttyle));
			(cloneFrmSttyle.fontSize) ? delete cloneFrmSttyle.fontSize : "";
			
			mainHtml = React.createElement("form", {
							id: this.props.formInfo.formStructure.id, 
							style: cloneFrmSttyle, 
							name: this.props.formInfo.formStructure.name, 
							"data-mode": this.props.formInfo.infoToSubmit, 
							className: "formInfomation "+this.props.formInfo.formStructure.clsName, 
							"data-json": JSON.stringify(this.props.formInfo.formStructure)
						}, 
							React.createElement("h2", {name: "formTitleToolBoxProp-h2"}, this.props.formInfo.formStructure.frmTitle), 
							React.createElement("p", {style:  frmDescStyle, name: "formDescToolBoxProp-p"}, this.props.formInfo.formStructure.frmDescription), 
							
							React.createElement("input", {type: "hidden", name: "field-is-show-errrr-mssg", id: "isShowErrMsg", defaultValue: isShowErrMsg}), 
							React.createElement("input", {type: "hidden", name: "field-0", id: "formJsonData", defaultValue: ""}), 
							React.createElement("input", {type: "hidden", name: "no-field", id: "changeableFieldName", defaultValue: ""}), 
							React.createElement("div", {name: "common_alert_popup", className: "common_alert_popup"}), 
							React.createElement("div", {className: "clear"}), 
							elHtml
						)
		}
		
		return React.createElement("div", {style: {backgroundColor: "F3F3F3"}, className: editFormCls+" perfect-scrollbar"}, 
			React.createElement("div", {className: "main-react-form-container"}, 
				
				React.createElement("div", {className: "fr"}, 
					React.createElement("div", {name: "common_errorMsg", className: "common_errorMsg error-message"}), 
					React.createElement("a", {name: "show_error_fields", className: hideErrField+" preview-error-field-link", rel: "show"}, " - Show Error Fields")
				), 
				React.createElement("div", {className: "clear"}), 
				mainHtml
			)
		);
	}
});

module.exports = FormPanel;

var RenderAllComponentsRecursion = require('./RenderAllComponentsRecursion');
var FieldSet = require('./FieldSet');

},{"./CommonMixin":4,"./FieldSet":8,"./Global":10,"./RenderAllComponentsRecursion":13,"create-react-class":19,"perfect-scrollbar":25,"react":"react","react-dom":"react-dom"}],10:[function(require,module,exports){
module.exports = {
	allFormElObjects: [],
	formErrFlds: [],
	mainCmpId: "",
	renderedAt: "",
	callMe: "",
	isMobile: false
};

},{}],11:[function(require,module,exports){
var React = require('react');
var createReactClass = require('create-react-class');

//	create label field
var LabelArea = createReactClass({
	render: function() {
		return(
			React.createElement("div", {className: "form-element-box "+this.props.elComponent.ctClsName, "data-json": JSON.stringify(this.props.elComponent)}, 
				React.createElement("label", {style: this.props.elComponent.labelStyle, id: this.props.elComponent.id, className: "r-information-label "+ ((this.props.elComponent.clsName)? this.props.elComponent.clsName: "")}, 
					React.createElement("span", null, this.props.elComponent.label), 
					React.createElement("input", {type: "hidden", name: this.props.elComponent.name, value: this.props.elComponent.label})
				)
			)
		)
	}
});

module.exports = LabelArea;

},{"create-react-class":19,"react":"react"}],12:[function(require,module,exports){
var Popover = require('react-awesome-popover');
var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');

var Global = require('./Global');
var CommonMixin = require('./CommonMixin');

//	create radio button
var RadioButton = createReactClass({
	mixins: [CommonMixin],
	getInitialState: function() {
		return {userInput: "", formModeVal: this.props.formModeVal};
	},
	componentDidMount: function() {
		var obj = { elName: this.props.elComponent.name, elVal: ReactDOM.findDOMNode(this.refs[this.props.elComponent.name]).value, validator: this.props.elComponent.validator, type: "radio" };
		
		this.checkIfObjectExists(Global.allFormElObjects, this.props.elComponent.name, "", "");
		Global.allFormElObjects.push(obj);
	},
	render: function() {
		var me = this;
		var radioName = this.props.elComponent.name;
		var fieldValue = "";
		if((this.props.elData) && typeof this.props.elData[this.props.elComponent.name] != "undefined"){
			fieldValue = this.props.elData[this.props.elComponent.name];
		}else{
			fieldValue = (this.props.elComponent.value)? this.props.elComponent.value : "";
		}
		
		var diffDataCls = diffDataIconCls = diffData = "";
		var isDiff = false;
		
		if((this.props.elDiffData) && typeof this.props.elDiffData[this.props.elComponent.name] != "undefined"){
			isDiff = true;
			diffDataIconCls = "modified-data-icon";
			
			//	split array to get new data value and class name
			var diffValClass = this.props.elDiffData[this.props.elComponent.name];
			var diffArr = diffValClass.split("~diff~");
			
			diffData = diffArr[0];
			diffDataCls = diffArr[1];
		}
		
		var radioButtonsItems = this.props.elComponent.elements.map(function(val, index) {
			if(diffData == val.value) diffData = val.label;
			
			return React.createElement("label", {key: Math.random(), className: "r-form-radio-label-box "+ ((val.clsName) ? val.clsName : "")}, 
				React.createElement("input", {
					key: Math.random(), 
					type: "radio", 
					className: "r-form-radio "+ ((val.clsName) ? val.clsName : ""), 
					ref: radioName, 
					name: radioName, 
					value: val.value, 
					onChange: me.onChange, 
					defaultChecked: (fieldValue == val.value) ? true : false}
				), 
				React.createElement("span", {name: radioName+"-"+index}, " "+val.label)
			)
		});
		
		var hoverTitle = diffData == '' ? "No Value" : diffData;
		//	label hidden if blank
		if(this.props.elComponent.label == ""){ var clsName="hidden"; }else{ var clsName=""; }
		
		this.props.elComponent.maxOptionNumber = (this.props.elComponent.maxOptionNumber) ? this.props.elComponent.maxOptionNumber : this.props.elComponent.elements.length;
		return(
			React.createElement("div", {className: diffDataCls+" form-element-box float-left "+this.props.elComponent.ctClsName, "data-json": JSON.stringify(this.props.elComponent)}, 
				React.createElement("div", {className: clsName+" float-left form-field-label"}, 
					React.createElement("label", {name: this.props.elComponent.name+"-label", className: "r-form-el-label " + ((this.props.clsName)?this.props.clsName:""), style: this.props.elComponent.labelStyle}, 
						React.createElement("span", null, this.props.elComponent.label), React.createElement("b", null, ":"), 
						React.createElement("span", {className: "required-sign"}, 
							(this.props.elComponent.validator)?((this.props.elComponent.validator.isRequired)? "*": ""):""
						)
					)
				), 
				React.createElement("div", {className: "float-left form-field"}, 
					radioButtonsItems, 
					React.createElement("br", null), 
					React.createElement("div", {name: this.props.elComponent.name+"_errorMsg", className: this.props.elComponent.name+"_errorMsg error-message"})
				), 
				React.createElement("span", {className: diffDataIconCls, alt: diffData, title: diffData})
				
			)
		)
	}
});

module.exports = RadioButton;

},{"./CommonMixin":4,"./Global":10,"create-react-class":19,"react":"react","react-awesome-popover":27,"react-dom":"react-dom"}],13:[function(require,module,exports){
var React = require('react');
var createReactClass = require('create-react-class');

//	render all components recursion loop
var RenderAllComponentsRecursion = createReactClass({
	render: function() {
		var me = this; 
		
		val = this.props.elStructure;
		formData = this.props.elData;
		formDiffData = this.props.elDiffData;
		cmpId = this.props.cmpId;
		
		if(val.etype == "fieldset"){
			var subElHtml = val.elements.map(function(val) {
				if(val.etype == "fieldset"){
					return React.createElement("div", {key: Math.random()}, React.createElement(RenderAllComponentsRecursion, {formModeVal: me.props.formModeVal, cmpId: cmpId, elStructure: val, elData: formData, elDiffData: formDiffData}))
				}else{
					return React.createElement("div", {key: Math.random()}, React.createElement(SwitchComponent, {formModeVal: me.props.formModeVal, cmpId: cmpId, elComponentArr: val, elData: formData, elDiffData: formDiffData}))
				}
			});
			
			return React.createElement(FieldSet, {clsName: val.clsName, style: val.style, title: val.title, innerElements: subElHtml})
		}else{
			return React.createElement(SwitchComponent, {formModeVal: this.props.formModeVal, cmpId: cmpId, elComponentArr: val, elData: formData, elDiffData: formDiffData})
		}
	}
});

module.exports = RenderAllComponentsRecursion;

var SwitchComponent = require('./SwitchComponent');
var FieldSet = require('./FieldSet');

},{"./FieldSet":8,"./SwitchComponent":15,"create-react-class":19,"react":"react"}],14:[function(require,module,exports){
var Popover = require('react-awesome-popover');
var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');

var Global = require('./Global');
var CommonMixin = require('./CommonMixin');

//	create single check-box
var ScheckBox = createReactClass({
	mixins: [CommonMixin],
	getInitialState: function() {
		return {userInput: "", formModeVal: this.props.formModeVal};
	},
	componentDidMount: function() {
		var obj = { elName: this.props.elComponent.name, elVal: ReactDOM.findDOMNode(this.refs[this.props.elComponent.name]).value, validator: this.props.elComponent.validator, type: "scheckbox" };
		
		this.checkIfObjectExists(Global.allFormElObjects, this.props.elComponent.name, "", "");
		Global.allFormElObjects.push(obj);
	},
	render: function() {
		var me = this;
		var checkBoxName = this.props.elComponent.name;
		var fieldValue = "";
		if((this.props.elData) && typeof this.props.elData[this.props.elComponent.name] != "undefined"){
			fieldValue = this.props.elData[this.props.elComponent.name];
		}else{
			fieldValue = (this.props.elComponent.value)? this.props.elComponent.value : "";
		}
		
		var diffDataCls = diffDataIconCls = diffData = "";
		var isDiff = false;
		
		if((this.props.elDiffData) && typeof this.props.elDiffData[this.props.elComponent.name] != "undefined"){
			isDiff = true;
			diffDataIconCls = "modified-data-icon";
			
			//	split array to get new data value and class name
			var diffValClass = this.props.elDiffData[this.props.elComponent.name];
			var diffArr = diffValClass.split("~diff~");
			
			diffData = diffArr[0];
			diffDataCls = diffArr[1];
		}
		
		var newDataVal = "";
		var checkBoxItems = this.props.elComponent.elements.map(function(val, index) {
			var diffDataArr = diffData.split(",");
			if(diffDataArr.length > 0){
				diffDataArr.map(function(v, i) {
					if(v == val.value) newDataVal = newDataVal+","+val.label;
				});
			}else{
				if(diffData == val.value) diffData = val.label;
			}
			
			return React.createElement("label", {key: Math.random(), className: "r-form-check-box-label-box "+ ((val.clsName) ? val.clsName : "")}, 
				React.createElement("input", {
					type: "checkbox", 
					value: val.value, 
					key: Math.random(), 
					className: "r-form-check-box "+ ((val.clsName) ? val.clsName : ""), 
					ref: checkBoxName, 
					name: checkBoxName, 
					disabled: (me.props.elComponent.disabled) ? me.props.elComponent.disabled : false, 
					onChange: me.onChange, 
					defaultChecked: (fieldValue != "")? ( (typeof fieldValue != "string") ? ((fieldValue.indexOf(val.value) > -1)? true: false): (fieldValue == val.value) ? true : false): false}
				), 
				React.createElement("input", {type: "hidden", className: checkBoxName+"-sc", name: checkBoxName+"-sc", value: " "+val.label})
			)
		});
		
		if(newDataVal != ""){
			if (newDataVal.indexOf(",", 1)) {
				diffData = newDataVal.substring(1, newDataVal.length);
			}else{
				diffData = newDataVal;
			}
			newDataVal = "";
		}
		
		diffData = (diffData == 'No Value Set' || diffData == '') ? "Unchecked" : "Checked";
		//	label hidden if blank
		if(this.props.elComponent.label == ""){ var clsName="hidden"; }else{ var clsName=""; }
		
		return(
			React.createElement("div", {className: diffDataCls+" form-element-box float-left "+this.props.elComponent.ctClsName, "data-json": JSON.stringify(this.props.elComponent), style: (this.props.elComponent.style) ? this.props.elComponent.style : {}}, 
				React.createElement("div", {className: clsName+" float-left form-field-label"}, 
					React.createElement("label", {name: this.props.elComponent.name+"-label", className: "r-form-el-label " + ((this.props.clsName)?this.props.clsName:""), style: this.props.elComponent.labelStyle}, 
						React.createElement("span", null, this.props.elComponent.label), React.createElement("b", null, ":"), 
						React.createElement("span", {className: "required-sign"}, 
							(this.props.elComponent.validator)?((this.props.elComponent.validator.isRequired)? "*": ""):""
						)
					)
				), 
				React.createElement("div", {className: "float-left form-field"}, 
					checkBoxItems, 
					React.createElement("br", null), 
					React.createElement("div", {name: this.props.elComponent.name+"_errorMsg", className: this.props.elComponent.name+"_errorMsg error-message"})
				), 
				React.createElement("span", {className: diffDataIconCls, alt: diffData, title: diffData})
				
			)
		)
	}
});

module.exports = ScheckBox;

},{"./CommonMixin":4,"./Global":10,"create-react-class":19,"react":"react","react-awesome-popover":27,"react-dom":"react-dom"}],15:[function(require,module,exports){
var React = require('react');
var createReactClass = require('create-react-class');

//	switch component class
var SwitchComponent = createReactClass({
	render: function() {
		val = this.props.elComponentArr;
		formData = this.props.elData;
		formDiffData = this.props.elDiffData;
		cmpId = this.props.cmpId;
		formModeVal = this.props.formModeVal;
		
		val.etype = (val.etype)? val.etype.toLowerCase(): "";
		switch(val.etype){
			case "labelarea":
				return React.createElement(LabelArea, {formModeVal: formModeVal, elComponent: val, elData: formData, elDiffData: formDiffData})
			break;
			case "textbox":
				return React.createElement(TextBox, {formModeVal: formModeVal, cmpId: cmpId, elComponent: val, elData: formData, elDiffData: formDiffData})
			break;
			case "textarea":
				return React.createElement(TextArea, {formModeVal: formModeVal, cmpId: cmpId, elComponent: val, elData: formData, elDiffData: formDiffData})
			break;
			case "dropdown":
				return React.createElement(DropDown, {formModeVal: formModeVal, cmpId: cmpId, elComponent: val, elData: formData, elDiffData: formDiffData})
			break;
			case "radio":
				return React.createElement(RadioButton, {formModeVal: formModeVal, cmpId: cmpId, elComponent: val, elData: formData, elDiffData: formDiffData})
			break;
			case "checkbox":
				return React.createElement(CheckBox, {formModeVal: formModeVal, cmpId: cmpId, elComponent: val, elData: formData, elDiffData: formDiffData})
			break;
			case "scheckbox":
				return React.createElement(ScheckBox, {formModeVal: formModeVal, cmpId: cmpId, elComponent: val, elData: formData, elDiffData: formDiffData})
			break;
			case "actionbutton":
				return React.createElement(ActionButton, {formModeVal: formModeVal, cmpId: cmpId, elComponent: val, elData: formData, elDiffData: formDiffData})
			break;
			case "datepicker":
				return React.createElement(DatePicker, {formModeVal: formModeVal, cmpId: cmpId, elComponent: val, elData: formData, elDiffData: formDiffData})
			break;
			case "divider":
				return React.createElement(Divider, {formModeVal: formModeVal, cmpId: cmpId, elComponent: val, elData: formData, elDiffData: formDiffData})
			break;
			case "optionchoice":
				return React.createElement(ChoiceOption, {formModeVal: formModeVal, cmpId: cmpId, elComponent: val, elData: formData, elDiffData: formDiffData})
			break;
			default:
				return React.createElement("div", null)
			break;
		}
	}
});

module.exports = SwitchComponent;

var LabelArea = require('./LabelArea');
var TextBox = require('./TextBox');
var TextArea = require('./TextArea');
var DropDown = require('./DropDown');
var RadioButton = require('./RadioButton');
var CheckBox = require('./CheckBox');
var ScheckBox = require('./ScheckBox');
var ActionButton = require('./ActionButton');
var DatePicker = require('./DatePicker');
var Divider = require('./Divider');
var ChoiceOption = require('./ChoiceOption');

},{"./ActionButton":1,"./CheckBox":2,"./ChoiceOption":3,"./DatePicker":5,"./Divider":6,"./DropDown":7,"./LabelArea":11,"./RadioButton":12,"./ScheckBox":14,"./TextArea":16,"./TextBox":17,"create-react-class":19,"react":"react"}],16:[function(require,module,exports){
var Popover = require('react-awesome-popover');
var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');

var Global = require('./Global');
var CommonMixin = require('./CommonMixin');

//	create textarea
var TextArea = createReactClass({
	mixins: [CommonMixin],
	getInitialState: function() {
		return {userInput: "", formModeVal: this.props.formModeVal};
	},
	componentDidMount: function() {
		this.limitRows();
		
		var obj = { elName: this.props.elComponent.name, elVal: ReactDOM.findDOMNode(this.refs[this.props.elComponent.name]).value, validator: this.props.elComponent.validator };
		
		this.checkIfObjectExists(Global.allFormElObjects, this.props.elComponent.name, "", "");
		Global.allFormElObjects.push(obj);
	},
	limitRows: function() {
		var mainIdEl = document.getElementById( this.props.cmpId );
		var ta = $(mainIdEl).find("[name='"+this.props.elComponent.name+"']");
		
		var keynum, lines = 1;
		var minRows = ta.attr("data-min-rows");
		var maxRows = ta.attr("data-max-rows")-1;
		
		var lh = ta[0].clientHeight / ta[0].rows;
		while (ta[0].scrollHeight > ta[0].clientHeight && !window.opera && parseInt(ta[0].rows) < parseInt(maxRows) ) {
			ta[0].style.overflow = 'hidden';
			ta[0].rows += 1;
		}
		if (ta[0].scrollHeight > ta[0].clientHeight) ta[0].style.overflow = 'auto';
	},
	render: function() {
		var fieldValue = "";
		if((this.props.elData) && typeof this.props.elData[this.props.elComponent.name] != "undefined"){
			fieldValue = this.props.elData[this.props.elComponent.name];
		}else{
			fieldValue = (this.props.elComponent.value)? this.props.elComponent.value : "";
		}
		
		var diffDataCls = diffDataIconCls = diffData = "";
		var isDiff = false;
		
		if((this.props.elDiffData) && typeof this.props.elDiffData[this.props.elComponent.name] != "undefined"){
			isDiff = true;
			diffDataIconCls = "modified-data-icon";
			
			//	split array to get new data value and class name
			var diffValClass = this.props.elDiffData[this.props.elComponent.name];
			var diffArr = diffValClass.split("~diff~");
			
			diffData = diffArr[0];
			diffDataCls = diffArr[1];
		}
		
		var actions = [ { title: ((diffData == '') ? "No Value" : diffData) } ];
		//	label hidden if blank
		if(this.props.elComponent.label == ""){ var clsName="hidden"; }else{ var clsName=""; }
		
		if(this.props.elComponent.disabled)
			var disabledSpanEl = React.createElement("span", {className: "disabled-span"});
		else
			var disabledSpanEl = "";
		
		return(
			React.createElement("div", {className: diffDataCls+" form-element-box float-left "+this.props.elComponent.ctClsName, "data-json": JSON.stringify(this.props.elComponent)}, 
				React.createElement("div", {className: clsName+" float-left form-field-label"}, 
					React.createElement("label", {name: this.props.elComponent.name+"-label", className: "r-form-el-label " + ((this.props.clsName)?this.props.clsName:""), style: this.props.elComponent.labelStyle}, 
						React.createElement("span", null, this.props.elComponent.label), React.createElement("b", null, ":"), 
						React.createElement("span", {className: "required-sign"}, 
							(this.props.elComponent.validator)?((this.props.elComponent.validator.isRequired)? "*": ""):""
						)
					)
				), 
				React.createElement("div", {className: "float-left form-field"}, 
					disabledSpanEl, 
					React.createElement("textarea", {
						id: this.props.elComponent.id, 
						type: "textarea", 
						className: "r-form-text-area "+ ((this.props.elComponent.clsName)?this.props.elComponent.clsName:""), 
						style: (this.props.elComponent.style)?this.props.elComponent.style:{}, 
						ref: this.props.elComponent.name, 
						name: this.props.elComponent.name, 
						placeholder: this.props.elComponent.placeHolder, 
						rows:  (this.props.elComponent.initialVisibleLinesVal) ? this.props.elComponent.initialVisibleLinesVal : 3, 
						"data-min-rows":  (this.props.elComponent.initialVisibleLinesVal) ? this.props.elComponent.initialVisibleLinesVal : 3, 
						"data-max-rows": this.props.elComponent.maxVisibleLinesVal, 
						disabled: (this.props.elComponent.disabled) ? this.props.elComponent.disabled : false, 
						defaultValue: fieldValue, 
						onChange: this.onChange, 
						onBlur: this.onChange, 
						onClick: this.onChange
					}), 
					React.createElement("br", null), 
					React.createElement("div", {name: this.props.elComponent.name+"_errorMsg", className: this.props.elComponent.name+"_errorMsg error-message"})
				), 
				React.createElement("span", {className: diffDataIconCls, alt: diffData, title: diffData})
				
			)
		)
	}
});

module.exports = TextArea;

},{"./CommonMixin":4,"./Global":10,"create-react-class":19,"react":"react","react-awesome-popover":27,"react-dom":"react-dom"}],17:[function(require,module,exports){
var Popover = require('react-awesome-popover');
var React = require('react');
var ReactDOM = require('react-dom');
var createReactClass = require('create-react-class');

var Global = require('./Global');
var CommonMixin = require('./CommonMixin');

//	create textbox
var TextBox = createReactClass({
	mixins: [CommonMixin],
	getInitialState: function() {
		return {userInput: "", formModeVal: this.props.formModeVal};
	},
	componentDidMount: function() {
		//	fire on-change event on load 
		var fllfName = this.props.elComponent.name;
		if (fllfName.indexOf('_') > -1) {
			var explodeName = fllfName.split("_");
			fllfName = explodeName[1];
		}
		
		//	change select, checkbox, radio's option name
		if( (fllfName == "OptionNameToolBoxProp") || (fllfName == "OptionValueToolBoxProp") ){
			var mainIdEl = document.getElementById( Global.mainCmpId );
			$(mainIdEl).find("[name='"+this.props.elComponent.name+"']").focus().blur();
		}
		
		var obj = { elName: this.props.elComponent.name, elVal: ReactDOM.findDOMNode(this.refs[this.props.elComponent.name]).value, validator: this.props.elComponent.validator };
		this.checkIfObjectExists(Global.allFormElObjects, this.props.elComponent.name, "", "");
		Global.allFormElObjects.push(obj);
	},
	render: function() {
		var fieldValue = "";
		if((this.props.elData) && typeof this.props.elData[this.props.elComponent.name] != "undefined"){
			fieldValue = this.props.elData[this.props.elComponent.name];
		}else{
			fieldValue = (this.props.elComponent.value)? this.props.elComponent.value : "";
		}
		
		var diffDataCls = diffDataIconCls = diffData = "";
		var isDiff = false;
		
		if((this.props.elDiffData) && typeof this.props.elDiffData[this.props.elComponent.name] != "undefined"){
			isDiff = true;
			diffDataIconCls = "modified-data-icon";
			
			//	split array to get new data value and class name
			var diffValClass = this.props.elDiffData[this.props.elComponent.name];
			var diffArr = diffValClass.split("~diff~");
			
			diffData = diffArr[0];
			diffDataCls = diffArr[1];
		}
		
		var actions = [ { title: ((diffData == '') ? "No Value" : diffData) } ];
		//	label hidden if blank
		if(this.props.elComponent.label == ""){ var clsName="hidden"; }else{ var clsName=""; }
		
		//	pending task
		var choiceDefaultValue = choiceDefaultValueSelected = choiceDefaultCheckBoxValue = optionTitle = optionAddClass = optionDeleteClass = "";
		
		var flVal = fieldValue;
		if(this.props.elComponent.choiceDefaultValue){
			if(!this.props.elComponent.choiceDefaultCheckBoxValue){
				choiceDefaultValue = "choice-default-value";
				optionTitle = "Make this option default";
				if(this.props.elComponent.actionButtonValue) flVal = this.props.elComponent.actionButtonValue;
				
				var dslctdVal = this.props.elComponent.choiceDefaultValue;
				
				if( dslctdVal.toLowerCase() == flVal.toLowerCase()){
					choiceDefaultValueSelected = "choice-default-value-selected";
					optionTitle = "This option is default selected";
				}
			}
			
			optionAddClass = "add-new-choice-icon";
			optionDeleteClass = "delete-new-choice-icon";
		}
		
		if(this.props.elComponent.disabled)
			var disabledSpanEl = React.createElement("span", {className: "disabled-span"});
		else
			var disabledSpanEl = "";
		
		return(
			React.createElement("div", {className: diffDataCls+" form-element-box float-left "+this.props.elComponent.ctClsName, "data-json": JSON.stringify(this.props.elComponent)}, 
				React.createElement("div", {className: clsName+" float-left form-field-label"}, 
					React.createElement("label", {name: this.props.elComponent.name+"-label", className: "r-form-el-label " + ((this.props.clsName)?this.props.clsName:""), style: this.props.elComponent.labelStyle}, 
						React.createElement("span", null, this.props.elComponent.label), React.createElement("b", null, ":"), 
						React.createElement("span", {className: "required-sign"}, 
							(this.props.elComponent.validator)?((this.props.elComponent.validator.isRequired)? "*": ""):""
						)
					)
				), 
				React.createElement("div", {className: "float-left form-field"}, 
					disabledSpanEl, 
					React.createElement("input", {
						id: this.props.elComponent.id, 
						type: "text", 
						maxLength: "80", 
						className: "r-form-text "+ ((this.props.elComponent.clsName)?this.props.elComponent.clsName:""), 
						style: (this.props.elComponent.style)?this.props.elComponent.style:{}, 
						ref: this.props.elComponent.name, 
						name: this.props.elComponent.name, 
						placeholder: this.props.elComponent.placeHolder, 
						disabled: (this.props.elComponent.disabled) ? this.props.elComponent.disabled : false, 
						defaultValue: fieldValue, 
						onChange: this.onChange, 
						onBlur: this.onBlur, 
						onClick: this.onChange}
					), 
					
					React.createElement("br", null), 
					React.createElement("div", {name: this.props.elComponent.name+"_errorMsg", className: this.props.elComponent.name+"_errorMsg error-message"})
				), 
				React.createElement("span", {className: diffDataIconCls, alt: diffData, title: diffData})
				
			)
		)
	}
});

module.exports = TextBox;
},{"./CommonMixin":4,"./Global":10,"create-react-class":19,"react":"react","react-awesome-popover":27,"react-dom":"react-dom"}],18:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var _assign = require('object-assign');

var emptyObject = require('fbjs/lib/emptyObject');
var _invariant = require('fbjs/lib/invariant');

if (process.env.NODE_ENV !== 'production') {
  var warning = require('fbjs/lib/warning');
}

var MIXINS_KEY = 'mixins';

// Helper function to allow the creation of anonymous functions which do not
// have .name set to the name of the variable being assigned to.
function identity(fn) {
  return fn;
}

var ReactPropTypeLocationNames;
if (process.env.NODE_ENV !== 'production') {
  ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };
} else {
  ReactPropTypeLocationNames = {};
}

function factory(ReactComponent, isValidElement, ReactNoopUpdateQueue) {
  /**
   * Policies that describe methods in `ReactClassInterface`.
   */

  var injectedMixins = [];

  /**
   * Composite components are higher-level components that compose other composite
   * or host components.
   *
   * To create a new type of `ReactClass`, pass a specification of
   * your new class to `React.createClass`. The only requirement of your class
   * specification is that you implement a `render` method.
   *
   *   var MyComponent = React.createClass({
   *     render: function() {
   *       return <div>Hello World</div>;
   *     }
   *   });
   *
   * The class specification supports a specific protocol of methods that have
   * special meaning (e.g. `render`). See `ReactClassInterface` for
   * more the comprehensive protocol. Any other properties and methods in the
   * class specification will be available on the prototype.
   *
   * @interface ReactClassInterface
   * @internal
   */
  var ReactClassInterface = {
    /**
     * An array of Mixin objects to include when defining your component.
     *
     * @type {array}
     * @optional
     */
    mixins: 'DEFINE_MANY',

    /**
     * An object containing properties and methods that should be defined on
     * the component's constructor instead of its prototype (static methods).
     *
     * @type {object}
     * @optional
     */
    statics: 'DEFINE_MANY',

    /**
     * Definition of prop types for this component.
     *
     * @type {object}
     * @optional
     */
    propTypes: 'DEFINE_MANY',

    /**
     * Definition of context types for this component.
     *
     * @type {object}
     * @optional
     */
    contextTypes: 'DEFINE_MANY',

    /**
     * Definition of context types this component sets for its children.
     *
     * @type {object}
     * @optional
     */
    childContextTypes: 'DEFINE_MANY',

    // ==== Definition methods ====

    /**
     * Invoked when the component is mounted. Values in the mapping will be set on
     * `this.props` if that prop is not specified (i.e. using an `in` check).
     *
     * This method is invoked before `getInitialState` and therefore cannot rely
     * on `this.state` or use `this.setState`.
     *
     * @return {object}
     * @optional
     */
    getDefaultProps: 'DEFINE_MANY_MERGED',

    /**
     * Invoked once before the component is mounted. The return value will be used
     * as the initial value of `this.state`.
     *
     *   getInitialState: function() {
     *     return {
     *       isOn: false,
     *       fooBaz: new BazFoo()
     *     }
     *   }
     *
     * @return {object}
     * @optional
     */
    getInitialState: 'DEFINE_MANY_MERGED',

    /**
     * @return {object}
     * @optional
     */
    getChildContext: 'DEFINE_MANY_MERGED',

    /**
     * Uses props from `this.props` and state from `this.state` to render the
     * structure of the component.
     *
     * No guarantees are made about when or how often this method is invoked, so
     * it must not have side effects.
     *
     *   render: function() {
     *     var name = this.props.name;
     *     return <div>Hello, {name}!</div>;
     *   }
     *
     * @return {ReactComponent}
     * @required
     */
    render: 'DEFINE_ONCE',

    // ==== Delegate methods ====

    /**
     * Invoked when the component is initially created and about to be mounted.
     * This may have side effects, but any external subscriptions or data created
     * by this method must be cleaned up in `componentWillUnmount`.
     *
     * @optional
     */
    componentWillMount: 'DEFINE_MANY',

    /**
     * Invoked when the component has been mounted and has a DOM representation.
     * However, there is no guarantee that the DOM node is in the document.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been mounted (initialized and rendered) for the first time.
     *
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidMount: 'DEFINE_MANY',

    /**
     * Invoked before the component receives new props.
     *
     * Use this as an opportunity to react to a prop transition by updating the
     * state using `this.setState`. Current props are accessed via `this.props`.
     *
     *   componentWillReceiveProps: function(nextProps, nextContext) {
     *     this.setState({
     *       likesIncreasing: nextProps.likeCount > this.props.likeCount
     *     });
     *   }
     *
     * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
     * transition may cause a state change, but the opposite is not true. If you
     * need it, you are probably looking for `componentWillUpdate`.
     *
     * @param {object} nextProps
     * @optional
     */
    componentWillReceiveProps: 'DEFINE_MANY',

    /**
     * Invoked while deciding if the component should be updated as a result of
     * receiving new props, state and/or context.
     *
     * Use this as an opportunity to `return false` when you're certain that the
     * transition to the new props/state/context will not require a component
     * update.
     *
     *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
     *     return !equal(nextProps, this.props) ||
     *       !equal(nextState, this.state) ||
     *       !equal(nextContext, this.context);
     *   }
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @return {boolean} True if the component should update.
     * @optional
     */
    shouldComponentUpdate: 'DEFINE_ONCE',

    /**
     * Invoked when the component is about to update due to a transition from
     * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
     * and `nextContext`.
     *
     * Use this as an opportunity to perform preparation before an update occurs.
     *
     * NOTE: You **cannot** use `this.setState()` in this method.
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @param {ReactReconcileTransaction} transaction
     * @optional
     */
    componentWillUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component's DOM representation has been updated.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been updated.
     *
     * @param {object} prevProps
     * @param {?object} prevState
     * @param {?object} prevContext
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component is about to be removed from its parent and have
     * its DOM representation destroyed.
     *
     * Use this as an opportunity to deallocate any external resources.
     *
     * NOTE: There is no `componentDidUnmount` since your component will have been
     * destroyed by that point.
     *
     * @optional
     */
    componentWillUnmount: 'DEFINE_MANY',

    /**
     * Replacement for (deprecated) `componentWillMount`.
     *
     * @optional
     */
    UNSAFE_componentWillMount: 'DEFINE_MANY',

    /**
     * Replacement for (deprecated) `componentWillReceiveProps`.
     *
     * @optional
     */
    UNSAFE_componentWillReceiveProps: 'DEFINE_MANY',

    /**
     * Replacement for (deprecated) `componentWillUpdate`.
     *
     * @optional
     */
    UNSAFE_componentWillUpdate: 'DEFINE_MANY',

    // ==== Advanced methods ====

    /**
     * Updates the component's currently mounted DOM representation.
     *
     * By default, this implements React's rendering and reconciliation algorithm.
     * Sophisticated clients may wish to override this.
     *
     * @param {ReactReconcileTransaction} transaction
     * @internal
     * @overridable
     */
    updateComponent: 'OVERRIDE_BASE'
  };

  /**
   * Similar to ReactClassInterface but for static methods.
   */
  var ReactClassStaticInterface = {
    /**
     * This method is invoked after a component is instantiated and when it
     * receives new props. Return an object to update state in response to
     * prop changes. Return null to indicate no change to state.
     *
     * If an object is returned, its keys will be merged into the existing state.
     *
     * @return {object || null}
     * @optional
     */
    getDerivedStateFromProps: 'DEFINE_MANY_MERGED'
  };

  /**
   * Mapping from class specification keys to special processing functions.
   *
   * Although these are declared like instance properties in the specification
   * when defining classes using `React.createClass`, they are actually static
   * and are accessible on the constructor instead of the prototype. Despite
   * being static, they must be defined outside of the "statics" key under
   * which all other static methods are defined.
   */
  var RESERVED_SPEC_KEYS = {
    displayName: function(Constructor, displayName) {
      Constructor.displayName = displayName;
    },
    mixins: function(Constructor, mixins) {
      if (mixins) {
        for (var i = 0; i < mixins.length; i++) {
          mixSpecIntoComponent(Constructor, mixins[i]);
        }
      }
    },
    childContextTypes: function(Constructor, childContextTypes) {
      if (process.env.NODE_ENV !== 'production') {
        validateTypeDef(Constructor, childContextTypes, 'childContext');
      }
      Constructor.childContextTypes = _assign(
        {},
        Constructor.childContextTypes,
        childContextTypes
      );
    },
    contextTypes: function(Constructor, contextTypes) {
      if (process.env.NODE_ENV !== 'production') {
        validateTypeDef(Constructor, contextTypes, 'context');
      }
      Constructor.contextTypes = _assign(
        {},
        Constructor.contextTypes,
        contextTypes
      );
    },
    /**
     * Special case getDefaultProps which should move into statics but requires
     * automatic merging.
     */
    getDefaultProps: function(Constructor, getDefaultProps) {
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps = createMergedResultFunction(
          Constructor.getDefaultProps,
          getDefaultProps
        );
      } else {
        Constructor.getDefaultProps = getDefaultProps;
      }
    },
    propTypes: function(Constructor, propTypes) {
      if (process.env.NODE_ENV !== 'production') {
        validateTypeDef(Constructor, propTypes, 'prop');
      }
      Constructor.propTypes = _assign({}, Constructor.propTypes, propTypes);
    },
    statics: function(Constructor, statics) {
      mixStaticSpecIntoComponent(Constructor, statics);
    },
    autobind: function() {}
  };

  function validateTypeDef(Constructor, typeDef, location) {
    for (var propName in typeDef) {
      if (typeDef.hasOwnProperty(propName)) {
        // use a warning instead of an _invariant so components
        // don't show up in prod but only in __DEV__
        if (process.env.NODE_ENV !== 'production') {
          warning(
            typeof typeDef[propName] === 'function',
            '%s: %s type `%s` is invalid; it must be a function, usually from ' +
              'React.PropTypes.',
            Constructor.displayName || 'ReactClass',
            ReactPropTypeLocationNames[location],
            propName
          );
        }
      }
    }
  }

  function validateMethodOverride(isAlreadyDefined, name) {
    var specPolicy = ReactClassInterface.hasOwnProperty(name)
      ? ReactClassInterface[name]
      : null;

    // Disallow overriding of base class methods unless explicitly allowed.
    if (ReactClassMixin.hasOwnProperty(name)) {
      _invariant(
        specPolicy === 'OVERRIDE_BASE',
        'ReactClassInterface: You are attempting to override ' +
          '`%s` from your class specification. Ensure that your method names ' +
          'do not overlap with React methods.',
        name
      );
    }

    // Disallow defining methods more than once unless explicitly allowed.
    if (isAlreadyDefined) {
      _invariant(
        specPolicy === 'DEFINE_MANY' || specPolicy === 'DEFINE_MANY_MERGED',
        'ReactClassInterface: You are attempting to define ' +
          '`%s` on your component more than once. This conflict may be due ' +
          'to a mixin.',
        name
      );
    }
  }

  /**
   * Mixin helper which handles policy validation and reserved
   * specification keys when building React classes.
   */
  function mixSpecIntoComponent(Constructor, spec) {
    if (!spec) {
      if (process.env.NODE_ENV !== 'production') {
        var typeofSpec = typeof spec;
        var isMixinValid = typeofSpec === 'object' && spec !== null;

        if (process.env.NODE_ENV !== 'production') {
          warning(
            isMixinValid,
            "%s: You're attempting to include a mixin that is either null " +
              'or not an object. Check the mixins included by the component, ' +
              'as well as any mixins they include themselves. ' +
              'Expected object but got %s.',
            Constructor.displayName || 'ReactClass',
            spec === null ? null : typeofSpec
          );
        }
      }

      return;
    }

    _invariant(
      typeof spec !== 'function',
      "ReactClass: You're attempting to " +
        'use a component class or function as a mixin. Instead, just use a ' +
        'regular object.'
    );
    _invariant(
      !isValidElement(spec),
      "ReactClass: You're attempting to " +
        'use a component as a mixin. Instead, just use a regular object.'
    );

    var proto = Constructor.prototype;
    var autoBindPairs = proto.__reactAutoBindPairs;

    // By handling mixins before any other properties, we ensure the same
    // chaining order is applied to methods with DEFINE_MANY policy, whether
    // mixins are listed before or after these methods in the spec.
    if (spec.hasOwnProperty(MIXINS_KEY)) {
      RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
    }

    for (var name in spec) {
      if (!spec.hasOwnProperty(name)) {
        continue;
      }

      if (name === MIXINS_KEY) {
        // We have already handled mixins in a special case above.
        continue;
      }

      var property = spec[name];
      var isAlreadyDefined = proto.hasOwnProperty(name);
      validateMethodOverride(isAlreadyDefined, name);

      if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
        RESERVED_SPEC_KEYS[name](Constructor, property);
      } else {
        // Setup methods on prototype:
        // The following member methods should not be automatically bound:
        // 1. Expected ReactClass methods (in the "interface").
        // 2. Overridden methods (that were mixed in).
        var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
        var isFunction = typeof property === 'function';
        var shouldAutoBind =
          isFunction &&
          !isReactClassMethod &&
          !isAlreadyDefined &&
          spec.autobind !== false;

        if (shouldAutoBind) {
          autoBindPairs.push(name, property);
          proto[name] = property;
        } else {
          if (isAlreadyDefined) {
            var specPolicy = ReactClassInterface[name];

            // These cases should already be caught by validateMethodOverride.
            _invariant(
              isReactClassMethod &&
                (specPolicy === 'DEFINE_MANY_MERGED' ||
                  specPolicy === 'DEFINE_MANY'),
              'ReactClass: Unexpected spec policy %s for key %s ' +
                'when mixing in component specs.',
              specPolicy,
              name
            );

            // For methods which are defined more than once, call the existing
            // methods before calling the new property, merging if appropriate.
            if (specPolicy === 'DEFINE_MANY_MERGED') {
              proto[name] = createMergedResultFunction(proto[name], property);
            } else if (specPolicy === 'DEFINE_MANY') {
              proto[name] = createChainedFunction(proto[name], property);
            }
          } else {
            proto[name] = property;
            if (process.env.NODE_ENV !== 'production') {
              // Add verbose displayName to the function, which helps when looking
              // at profiling tools.
              if (typeof property === 'function' && spec.displayName) {
                proto[name].displayName = spec.displayName + '_' + name;
              }
            }
          }
        }
      }
    }
  }

  function mixStaticSpecIntoComponent(Constructor, statics) {
    if (!statics) {
      return;
    }

    for (var name in statics) {
      var property = statics[name];
      if (!statics.hasOwnProperty(name)) {
        continue;
      }

      var isReserved = name in RESERVED_SPEC_KEYS;
      _invariant(
        !isReserved,
        'ReactClass: You are attempting to define a reserved ' +
          'property, `%s`, that shouldn\'t be on the "statics" key. Define it ' +
          'as an instance property instead; it will still be accessible on the ' +
          'constructor.',
        name
      );

      var isAlreadyDefined = name in Constructor;
      if (isAlreadyDefined) {
        var specPolicy = ReactClassStaticInterface.hasOwnProperty(name)
          ? ReactClassStaticInterface[name]
          : null;

        _invariant(
          specPolicy === 'DEFINE_MANY_MERGED',
          'ReactClass: You are attempting to define ' +
            '`%s` on your component more than once. This conflict may be ' +
            'due to a mixin.',
          name
        );

        Constructor[name] = createMergedResultFunction(Constructor[name], property);

        return;
      }

      Constructor[name] = property;
    }
  }

  /**
   * Merge two objects, but throw if both contain the same key.
   *
   * @param {object} one The first object, which is mutated.
   * @param {object} two The second object
   * @return {object} one after it has been mutated to contain everything in two.
   */
  function mergeIntoWithNoDuplicateKeys(one, two) {
    _invariant(
      one && two && typeof one === 'object' && typeof two === 'object',
      'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.'
    );

    for (var key in two) {
      if (two.hasOwnProperty(key)) {
        _invariant(
          one[key] === undefined,
          'mergeIntoWithNoDuplicateKeys(): ' +
            'Tried to merge two objects with the same key: `%s`. This conflict ' +
            'may be due to a mixin; in particular, this may be caused by two ' +
            'getInitialState() or getDefaultProps() methods returning objects ' +
            'with clashing keys.',
          key
        );
        one[key] = two[key];
      }
    }
    return one;
  }

  /**
   * Creates a function that invokes two functions and merges their return values.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */
  function createMergedResultFunction(one, two) {
    return function mergedResult() {
      var a = one.apply(this, arguments);
      var b = two.apply(this, arguments);
      if (a == null) {
        return b;
      } else if (b == null) {
        return a;
      }
      var c = {};
      mergeIntoWithNoDuplicateKeys(c, a);
      mergeIntoWithNoDuplicateKeys(c, b);
      return c;
    };
  }

  /**
   * Creates a function that invokes two functions and ignores their return vales.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */
  function createChainedFunction(one, two) {
    return function chainedFunction() {
      one.apply(this, arguments);
      two.apply(this, arguments);
    };
  }

  /**
   * Binds a method to the component.
   *
   * @param {object} component Component whose method is going to be bound.
   * @param {function} method Method to be bound.
   * @return {function} The bound method.
   */
  function bindAutoBindMethod(component, method) {
    var boundMethod = method.bind(component);
    if (process.env.NODE_ENV !== 'production') {
      boundMethod.__reactBoundContext = component;
      boundMethod.__reactBoundMethod = method;
      boundMethod.__reactBoundArguments = null;
      var componentName = component.constructor.displayName;
      var _bind = boundMethod.bind;
      boundMethod.bind = function(newThis) {
        for (
          var _len = arguments.length,
            args = Array(_len > 1 ? _len - 1 : 0),
            _key = 1;
          _key < _len;
          _key++
        ) {
          args[_key - 1] = arguments[_key];
        }

        // User is trying to bind() an autobound method; we effectively will
        // ignore the value of "this" that the user is trying to use, so
        // let's warn.
        if (newThis !== component && newThis !== null) {
          if (process.env.NODE_ENV !== 'production') {
            warning(
              false,
              'bind(): React component methods may only be bound to the ' +
                'component instance. See %s',
              componentName
            );
          }
        } else if (!args.length) {
          if (process.env.NODE_ENV !== 'production') {
            warning(
              false,
              'bind(): You are binding a component method to the component. ' +
                'React does this for you automatically in a high-performance ' +
                'way, so you can safely remove this call. See %s',
              componentName
            );
          }
          return boundMethod;
        }
        var reboundMethod = _bind.apply(boundMethod, arguments);
        reboundMethod.__reactBoundContext = component;
        reboundMethod.__reactBoundMethod = method;
        reboundMethod.__reactBoundArguments = args;
        return reboundMethod;
      };
    }
    return boundMethod;
  }

  /**
   * Binds all auto-bound methods in a component.
   *
   * @param {object} component Component whose method is going to be bound.
   */
  function bindAutoBindMethods(component) {
    var pairs = component.__reactAutoBindPairs;
    for (var i = 0; i < pairs.length; i += 2) {
      var autoBindKey = pairs[i];
      var method = pairs[i + 1];
      component[autoBindKey] = bindAutoBindMethod(component, method);
    }
  }

  var IsMountedPreMixin = {
    componentDidMount: function() {
      this.__isMounted = true;
    }
  };

  var IsMountedPostMixin = {
    componentWillUnmount: function() {
      this.__isMounted = false;
    }
  };

  /**
   * Add more to the ReactClass base class. These are all legacy features and
   * therefore not already part of the modern ReactComponent.
   */
  var ReactClassMixin = {
    /**
     * TODO: This will be deprecated because state should always keep a consistent
     * type signature and the only use case for this, is to avoid that.
     */
    replaceState: function(newState, callback) {
      this.updater.enqueueReplaceState(this, newState, callback);
    },

    /**
     * Checks whether or not this composite component is mounted.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function() {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          this.__didWarnIsMounted,
          '%s: isMounted is deprecated. Instead, make sure to clean up ' +
            'subscriptions and pending requests in componentWillUnmount to ' +
            'prevent memory leaks.',
          (this.constructor && this.constructor.displayName) ||
            this.name ||
            'Component'
        );
        this.__didWarnIsMounted = true;
      }
      return !!this.__isMounted;
    }
  };

  var ReactClassComponent = function() {};
  _assign(
    ReactClassComponent.prototype,
    ReactComponent.prototype,
    ReactClassMixin
  );

  /**
   * Creates a composite component class given a class specification.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
   *
   * @param {object} spec Class specification (which must define `render`).
   * @return {function} Component constructor function.
   * @public
   */
  function createClass(spec) {
    // To keep our warnings more understandable, we'll use a little hack here to
    // ensure that Constructor.name !== 'Constructor'. This makes sure we don't
    // unnecessarily identify a class without displayName as 'Constructor'.
    var Constructor = identity(function(props, context, updater) {
      // This constructor gets overridden by mocks. The argument is used
      // by mocks to assert on what gets mounted.

      if (process.env.NODE_ENV !== 'production') {
        warning(
          this instanceof Constructor,
          'Something is calling a React component directly. Use a factory or ' +
            'JSX instead. See: https://fb.me/react-legacyfactory'
        );
      }

      // Wire up auto-binding
      if (this.__reactAutoBindPairs.length) {
        bindAutoBindMethods(this);
      }

      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;

      this.state = null;

      // ReactClasses doesn't have constructors. Instead, they use the
      // getInitialState and componentWillMount methods for initialization.

      var initialState = this.getInitialState ? this.getInitialState() : null;
      if (process.env.NODE_ENV !== 'production') {
        // We allow auto-mocks to proceed as if they're returning null.
        if (
          initialState === undefined &&
          this.getInitialState._isMockFunction
        ) {
          // This is probably bad practice. Consider warning here and
          // deprecating this convenience.
          initialState = null;
        }
      }
      _invariant(
        typeof initialState === 'object' && !Array.isArray(initialState),
        '%s.getInitialState(): must return an object or null',
        Constructor.displayName || 'ReactCompositeComponent'
      );

      this.state = initialState;
    });
    Constructor.prototype = new ReactClassComponent();
    Constructor.prototype.constructor = Constructor;
    Constructor.prototype.__reactAutoBindPairs = [];

    injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));

    mixSpecIntoComponent(Constructor, IsMountedPreMixin);
    mixSpecIntoComponent(Constructor, spec);
    mixSpecIntoComponent(Constructor, IsMountedPostMixin);

    // Initialize the defaultProps property after all mixins have been merged.
    if (Constructor.getDefaultProps) {
      Constructor.defaultProps = Constructor.getDefaultProps();
    }

    if (process.env.NODE_ENV !== 'production') {
      // This is a tag to indicate that the use of these method names is ok,
      // since it's used with createClass. If it's not, then it's likely a
      // mistake so we'll warn you to use the static property, property
      // initializer or constructor respectively.
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps.isReactClassApproved = {};
      }
      if (Constructor.prototype.getInitialState) {
        Constructor.prototype.getInitialState.isReactClassApproved = {};
      }
    }

    _invariant(
      Constructor.prototype.render,
      'createClass(...): Class specification must implement a `render` method.'
    );

    if (process.env.NODE_ENV !== 'production') {
      warning(
        !Constructor.prototype.componentShouldUpdate,
        '%s has a method called ' +
          'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' +
          'The name is phrased as a question because the function is ' +
          'expected to return a value.',
        spec.displayName || 'A component'
      );
      warning(
        !Constructor.prototype.componentWillRecieveProps,
        '%s has a method called ' +
          'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?',
        spec.displayName || 'A component'
      );
      warning(
        !Constructor.prototype.UNSAFE_componentWillRecieveProps,
        '%s has a method called UNSAFE_componentWillRecieveProps(). ' +
          'Did you mean UNSAFE_componentWillReceiveProps()?',
        spec.displayName || 'A component'
      );
    }

    // Reduce time spent doing lookups by setting these on the prototype.
    for (var methodName in ReactClassInterface) {
      if (!Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = null;
      }
    }

    return Constructor;
  }

  return createClass;
}

module.exports = factory;

}).call(this,require('_process'))
},{"_process":26,"fbjs/lib/emptyObject":21,"fbjs/lib/invariant":22,"fbjs/lib/warning":23,"object-assign":24}],19:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var React = require('react');
var factory = require('./factory');

if (typeof React === 'undefined') {
  throw Error(
    'create-react-class could not find the React object. If you are using script tags, ' +
      'make sure that React is being loaded before create-react-class.'
  );
}

// Hack to grab NoopUpdateQueue from isomorphic React
var ReactNoopUpdateQueue = new React.Component().updater;

module.exports = factory(
  React.Component,
  React.isValidElement,
  ReactNoopUpdateQueue
);

},{"./factory":18,"react":"react"}],20:[function(require,module,exports){
"use strict";

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;
},{}],21:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var emptyObject = {};

if (process.env.NODE_ENV !== 'production') {
  Object.freeze(emptyObject);
}

module.exports = emptyObject;
}).call(this,require('_process'))
},{"_process":26}],22:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
}).call(this,require('_process'))
},{"_process":26}],23:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var emptyFunction = require('./emptyFunction');

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;
}).call(this,require('_process'))
},{"./emptyFunction":20,"_process":26}],24:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],25:[function(require,module,exports){
/*!
 * perfect-scrollbar v1.4.0
 * (c) 2018 Hyunje Jun
 * @license MIT
 */
'use strict';

function get(element) {
  return getComputedStyle(element);
}

function set(element, obj) {
  for (var key in obj) {
    var val = obj[key];
    if (typeof val === 'number') {
      val = val + "px";
    }
    element.style[key] = val;
  }
  return element;
}

function div(className) {
  var div = document.createElement('div');
  div.className = className;
  return div;
}

var elMatches =
  typeof Element !== 'undefined' &&
  (Element.prototype.matches ||
    Element.prototype.webkitMatchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector);

function matches(element, query) {
  if (!elMatches) {
    throw new Error('No element matching method supported');
  }

  return elMatches.call(element, query);
}

function remove(element) {
  if (element.remove) {
    element.remove();
  } else {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
}

function queryChildren(element, selector) {
  return Array.prototype.filter.call(element.children, function (child) { return matches(child, selector); }
  );
}

var cls = {
  main: 'ps',
  element: {
    thumb: function (x) { return ("ps__thumb-" + x); },
    rail: function (x) { return ("ps__rail-" + x); },
    consuming: 'ps__child--consume',
  },
  state: {
    focus: 'ps--focus',
    clicking: 'ps--clicking',
    active: function (x) { return ("ps--active-" + x); },
    scrolling: function (x) { return ("ps--scrolling-" + x); },
  },
};

/*
 * Helper methods
 */
var scrollingClassTimeout = { x: null, y: null };

function addScrollingClass(i, x) {
  var classList = i.element.classList;
  var className = cls.state.scrolling(x);

  if (classList.contains(className)) {
    clearTimeout(scrollingClassTimeout[x]);
  } else {
    classList.add(className);
  }
}

function removeScrollingClass(i, x) {
  scrollingClassTimeout[x] = setTimeout(
    function () { return i.isAlive && i.element.classList.remove(cls.state.scrolling(x)); },
    i.settings.scrollingThreshold
  );
}

function setScrollingClassInstantly(i, x) {
  addScrollingClass(i, x);
  removeScrollingClass(i, x);
}

var EventElement = function EventElement(element) {
  this.element = element;
  this.handlers = {};
};

var prototypeAccessors = { isEmpty: { configurable: true } };

EventElement.prototype.bind = function bind (eventName, handler) {
  if (typeof this.handlers[eventName] === 'undefined') {
    this.handlers[eventName] = [];
  }
  this.handlers[eventName].push(handler);
  this.element.addEventListener(eventName, handler, false);
};

EventElement.prototype.unbind = function unbind (eventName, target) {
    var this$1 = this;

  this.handlers[eventName] = this.handlers[eventName].filter(function (handler) {
    if (target && handler !== target) {
      return true;
    }
    this$1.element.removeEventListener(eventName, handler, false);
    return false;
  });
};

EventElement.prototype.unbindAll = function unbindAll () {
    var this$1 = this;

  for (var name in this$1.handlers) {
    this$1.unbind(name);
  }
};

prototypeAccessors.isEmpty.get = function () {
    var this$1 = this;

  return Object.keys(this.handlers).every(
    function (key) { return this$1.handlers[key].length === 0; }
  );
};

Object.defineProperties( EventElement.prototype, prototypeAccessors );

var EventManager = function EventManager() {
  this.eventElements = [];
};

EventManager.prototype.eventElement = function eventElement (element) {
  var ee = this.eventElements.filter(function (ee) { return ee.element === element; })[0];
  if (!ee) {
    ee = new EventElement(element);
    this.eventElements.push(ee);
  }
  return ee;
};

EventManager.prototype.bind = function bind (element, eventName, handler) {
  this.eventElement(element).bind(eventName, handler);
};

EventManager.prototype.unbind = function unbind (element, eventName, handler) {
  var ee = this.eventElement(element);
  ee.unbind(eventName, handler);

  if (ee.isEmpty) {
    // remove
    this.eventElements.splice(this.eventElements.indexOf(ee), 1);
  }
};

EventManager.prototype.unbindAll = function unbindAll () {
  this.eventElements.forEach(function (e) { return e.unbindAll(); });
  this.eventElements = [];
};

EventManager.prototype.once = function once (element, eventName, handler) {
  var ee = this.eventElement(element);
  var onceHandler = function (evt) {
    ee.unbind(eventName, onceHandler);
    handler(evt);
  };
  ee.bind(eventName, onceHandler);
};

function createEvent(name) {
  if (typeof window.CustomEvent === 'function') {
    return new CustomEvent(name);
  } else {
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(name, false, false, undefined);
    return evt;
  }
}

var processScrollDiff = function(
  i,
  axis,
  diff,
  useScrollingClass,
  forceFireReachEvent
) {
  if ( useScrollingClass === void 0 ) useScrollingClass = true;
  if ( forceFireReachEvent === void 0 ) forceFireReachEvent = false;

  var fields;
  if (axis === 'top') {
    fields = [
      'contentHeight',
      'containerHeight',
      'scrollTop',
      'y',
      'up',
      'down' ];
  } else if (axis === 'left') {
    fields = [
      'contentWidth',
      'containerWidth',
      'scrollLeft',
      'x',
      'left',
      'right' ];
  } else {
    throw new Error('A proper axis should be provided');
  }

  processScrollDiff$1(i, diff, fields, useScrollingClass, forceFireReachEvent);
};

function processScrollDiff$1(
  i,
  diff,
  ref,
  useScrollingClass,
  forceFireReachEvent
) {
  var contentHeight = ref[0];
  var containerHeight = ref[1];
  var scrollTop = ref[2];
  var y = ref[3];
  var up = ref[4];
  var down = ref[5];
  if ( useScrollingClass === void 0 ) useScrollingClass = true;
  if ( forceFireReachEvent === void 0 ) forceFireReachEvent = false;

  var element = i.element;

  // reset reach
  i.reach[y] = null;

  // 1 for subpixel rounding
  if (element[scrollTop] < 1) {
    i.reach[y] = 'start';
  }

  // 1 for subpixel rounding
  if (element[scrollTop] > i[contentHeight] - i[containerHeight] - 1) {
    i.reach[y] = 'end';
  }

  if (diff) {
    element.dispatchEvent(createEvent(("ps-scroll-" + y)));

    if (diff < 0) {
      element.dispatchEvent(createEvent(("ps-scroll-" + up)));
    } else if (diff > 0) {
      element.dispatchEvent(createEvent(("ps-scroll-" + down)));
    }

    if (useScrollingClass) {
      setScrollingClassInstantly(i, y);
    }
  }

  if (i.reach[y] && (diff || forceFireReachEvent)) {
    element.dispatchEvent(createEvent(("ps-" + y + "-reach-" + (i.reach[y]))));
  }
}

function toInt(x) {
  return parseInt(x, 10) || 0;
}

function isEditable(el) {
  return (
    matches(el, 'input,[contenteditable]') ||
    matches(el, 'select,[contenteditable]') ||
    matches(el, 'textarea,[contenteditable]') ||
    matches(el, 'button,[contenteditable]')
  );
}

function outerWidth(element) {
  var styles = get(element);
  return (
    toInt(styles.width) +
    toInt(styles.paddingLeft) +
    toInt(styles.paddingRight) +
    toInt(styles.borderLeftWidth) +
    toInt(styles.borderRightWidth)
  );
}

var env = {
  isWebKit:
    typeof document !== 'undefined' &&
    'WebkitAppearance' in document.documentElement.style,
  supportsTouch:
    typeof window !== 'undefined' &&
    ('ontouchstart' in window ||
      (window.DocumentTouch && document instanceof window.DocumentTouch)),
  supportsIePointer:
    typeof navigator !== 'undefined' && navigator.msMaxTouchPoints,
  isChrome:
    typeof navigator !== 'undefined' &&
    /Chrome/i.test(navigator && navigator.userAgent),
};

var updateGeometry = function(i) {
  var element = i.element;
  var roundedScrollTop = Math.floor(element.scrollTop);

  i.containerWidth = element.clientWidth;
  i.containerHeight = element.clientHeight;
  i.contentWidth = element.scrollWidth;
  i.contentHeight = element.scrollHeight;

  if (!element.contains(i.scrollbarXRail)) {
    // clean up and append
    queryChildren(element, cls.element.rail('x')).forEach(function (el) { return remove(el); }
    );
    element.appendChild(i.scrollbarXRail);
  }
  if (!element.contains(i.scrollbarYRail)) {
    // clean up and append
    queryChildren(element, cls.element.rail('y')).forEach(function (el) { return remove(el); }
    );
    element.appendChild(i.scrollbarYRail);
  }

  if (
    !i.settings.suppressScrollX &&
    i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth
  ) {
    i.scrollbarXActive = true;
    i.railXWidth = i.containerWidth - i.railXMarginWidth;
    i.railXRatio = i.containerWidth / i.railXWidth;
    i.scrollbarXWidth = getThumbSize(
      i,
      toInt(i.railXWidth * i.containerWidth / i.contentWidth)
    );
    i.scrollbarXLeft = toInt(
      (i.negativeScrollAdjustment + element.scrollLeft) *
        (i.railXWidth - i.scrollbarXWidth) /
        (i.contentWidth - i.containerWidth)
    );
  } else {
    i.scrollbarXActive = false;
  }

  if (
    !i.settings.suppressScrollY &&
    i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight
  ) {
    i.scrollbarYActive = true;
    i.railYHeight = i.containerHeight - i.railYMarginHeight;
    i.railYRatio = i.containerHeight / i.railYHeight;
    i.scrollbarYHeight = getThumbSize(
      i,
      toInt(i.railYHeight * i.containerHeight / i.contentHeight)
    );
    i.scrollbarYTop = toInt(
      roundedScrollTop *
        (i.railYHeight - i.scrollbarYHeight) /
        (i.contentHeight - i.containerHeight)
    );
  } else {
    i.scrollbarYActive = false;
  }

  if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
    i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
  }
  if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
    i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
  }

  updateCss(element, i);

  if (i.scrollbarXActive) {
    element.classList.add(cls.state.active('x'));
  } else {
    element.classList.remove(cls.state.active('x'));
    i.scrollbarXWidth = 0;
    i.scrollbarXLeft = 0;
    element.scrollLeft = 0;
  }
  if (i.scrollbarYActive) {
    element.classList.add(cls.state.active('y'));
  } else {
    element.classList.remove(cls.state.active('y'));
    i.scrollbarYHeight = 0;
    i.scrollbarYTop = 0;
    element.scrollTop = 0;
  }
};

function getThumbSize(i, thumbSize) {
  if (i.settings.minScrollbarLength) {
    thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
  }
  if (i.settings.maxScrollbarLength) {
    thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
  }
  return thumbSize;
}

function updateCss(element, i) {
  var xRailOffset = { width: i.railXWidth };
  var roundedScrollTop = Math.floor(element.scrollTop);

  if (i.isRtl) {
    xRailOffset.left =
      i.negativeScrollAdjustment +
      element.scrollLeft +
      i.containerWidth -
      i.contentWidth;
  } else {
    xRailOffset.left = element.scrollLeft;
  }
  if (i.isScrollbarXUsingBottom) {
    xRailOffset.bottom = i.scrollbarXBottom - roundedScrollTop;
  } else {
    xRailOffset.top = i.scrollbarXTop + roundedScrollTop;
  }
  set(i.scrollbarXRail, xRailOffset);

  var yRailOffset = { top: roundedScrollTop, height: i.railYHeight };
  if (i.isScrollbarYUsingRight) {
    if (i.isRtl) {
      yRailOffset.right =
        i.contentWidth -
        (i.negativeScrollAdjustment + element.scrollLeft) -
        i.scrollbarYRight -
        i.scrollbarYOuterWidth;
    } else {
      yRailOffset.right = i.scrollbarYRight - element.scrollLeft;
    }
  } else {
    if (i.isRtl) {
      yRailOffset.left =
        i.negativeScrollAdjustment +
        element.scrollLeft +
        i.containerWidth * 2 -
        i.contentWidth -
        i.scrollbarYLeft -
        i.scrollbarYOuterWidth;
    } else {
      yRailOffset.left = i.scrollbarYLeft + element.scrollLeft;
    }
  }
  set(i.scrollbarYRail, yRailOffset);

  set(i.scrollbarX, {
    left: i.scrollbarXLeft,
    width: i.scrollbarXWidth - i.railBorderXWidth,
  });
  set(i.scrollbarY, {
    top: i.scrollbarYTop,
    height: i.scrollbarYHeight - i.railBorderYWidth,
  });
}

var clickRail = function(i) {
  i.event.bind(i.scrollbarY, 'mousedown', function (e) { return e.stopPropagation(); });
  i.event.bind(i.scrollbarYRail, 'mousedown', function (e) {
    var positionTop =
      e.pageY -
      window.pageYOffset -
      i.scrollbarYRail.getBoundingClientRect().top;
    var direction = positionTop > i.scrollbarYTop ? 1 : -1;

    i.element.scrollTop += direction * i.containerHeight;
    updateGeometry(i);

    e.stopPropagation();
  });

  i.event.bind(i.scrollbarX, 'mousedown', function (e) { return e.stopPropagation(); });
  i.event.bind(i.scrollbarXRail, 'mousedown', function (e) {
    var positionLeft =
      e.pageX -
      window.pageXOffset -
      i.scrollbarXRail.getBoundingClientRect().left;
    var direction = positionLeft > i.scrollbarXLeft ? 1 : -1;

    i.element.scrollLeft += direction * i.containerWidth;
    updateGeometry(i);

    e.stopPropagation();
  });
};

var dragThumb = function(i) {
  bindMouseScrollHandler(i, [
    'containerWidth',
    'contentWidth',
    'pageX',
    'railXWidth',
    'scrollbarX',
    'scrollbarXWidth',
    'scrollLeft',
    'x',
    'scrollbarXRail' ]);
  bindMouseScrollHandler(i, [
    'containerHeight',
    'contentHeight',
    'pageY',
    'railYHeight',
    'scrollbarY',
    'scrollbarYHeight',
    'scrollTop',
    'y',
    'scrollbarYRail' ]);
};

function bindMouseScrollHandler(
  i,
  ref
) {
  var containerHeight = ref[0];
  var contentHeight = ref[1];
  var pageY = ref[2];
  var railYHeight = ref[3];
  var scrollbarY = ref[4];
  var scrollbarYHeight = ref[5];
  var scrollTop = ref[6];
  var y = ref[7];
  var scrollbarYRail = ref[8];

  var element = i.element;

  var startingScrollTop = null;
  var startingMousePageY = null;
  var scrollBy = null;

  function mouseMoveHandler(e) {
    element[scrollTop] =
      startingScrollTop + scrollBy * (e[pageY] - startingMousePageY);
    addScrollingClass(i, y);
    updateGeometry(i);

    e.stopPropagation();
    e.preventDefault();
  }

  function mouseUpHandler() {
    removeScrollingClass(i, y);
    i[scrollbarYRail].classList.remove(cls.state.clicking);
    i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
  }

  i.event.bind(i[scrollbarY], 'mousedown', function (e) {
    startingScrollTop = element[scrollTop];
    startingMousePageY = e[pageY];
    scrollBy =
      (i[contentHeight] - i[containerHeight]) /
      (i[railYHeight] - i[scrollbarYHeight]);

    i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
    i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

    i[scrollbarYRail].classList.add(cls.state.clicking);

    e.stopPropagation();
    e.preventDefault();
  });
}

var keyboard = function(i) {
  var element = i.element;

  var elementHovered = function () { return matches(element, ':hover'); };
  var scrollbarFocused = function () { return matches(i.scrollbarX, ':focus') || matches(i.scrollbarY, ':focus'); };

  function shouldPreventDefault(deltaX, deltaY) {
    var scrollTop = Math.floor(element.scrollTop);
    if (deltaX === 0) {
      if (!i.scrollbarYActive) {
        return false;
      }
      if (
        (scrollTop === 0 && deltaY > 0) ||
        (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)
      ) {
        return !i.settings.wheelPropagation;
      }
    }

    var scrollLeft = element.scrollLeft;
    if (deltaY === 0) {
      if (!i.scrollbarXActive) {
        return false;
      }
      if (
        (scrollLeft === 0 && deltaX < 0) ||
        (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)
      ) {
        return !i.settings.wheelPropagation;
      }
    }
    return true;
  }

  i.event.bind(i.ownerDocument, 'keydown', function (e) {
    if (
      (e.isDefaultPrevented && e.isDefaultPrevented()) ||
      e.defaultPrevented
    ) {
      return;
    }

    if (!elementHovered() && !scrollbarFocused()) {
      return;
    }

    var activeElement = document.activeElement
      ? document.activeElement
      : i.ownerDocument.activeElement;
    if (activeElement) {
      if (activeElement.tagName === 'IFRAME') {
        activeElement = activeElement.contentDocument.activeElement;
      } else {
        // go deeper if element is a webcomponent
        while (activeElement.shadowRoot) {
          activeElement = activeElement.shadowRoot.activeElement;
        }
      }
      if (isEditable(activeElement)) {
        return;
      }
    }

    var deltaX = 0;
    var deltaY = 0;

    switch (e.which) {
      case 37: // left
        if (e.metaKey) {
          deltaX = -i.contentWidth;
        } else if (e.altKey) {
          deltaX = -i.containerWidth;
        } else {
          deltaX = -30;
        }
        break;
      case 38: // up
        if (e.metaKey) {
          deltaY = i.contentHeight;
        } else if (e.altKey) {
          deltaY = i.containerHeight;
        } else {
          deltaY = 30;
        }
        break;
      case 39: // right
        if (e.metaKey) {
          deltaX = i.contentWidth;
        } else if (e.altKey) {
          deltaX = i.containerWidth;
        } else {
          deltaX = 30;
        }
        break;
      case 40: // down
        if (e.metaKey) {
          deltaY = -i.contentHeight;
        } else if (e.altKey) {
          deltaY = -i.containerHeight;
        } else {
          deltaY = -30;
        }
        break;
      case 32: // space bar
        if (e.shiftKey) {
          deltaY = i.containerHeight;
        } else {
          deltaY = -i.containerHeight;
        }
        break;
      case 33: // page up
        deltaY = i.containerHeight;
        break;
      case 34: // page down
        deltaY = -i.containerHeight;
        break;
      case 36: // home
        deltaY = i.contentHeight;
        break;
      case 35: // end
        deltaY = -i.contentHeight;
        break;
      default:
        return;
    }

    if (i.settings.suppressScrollX && deltaX !== 0) {
      return;
    }
    if (i.settings.suppressScrollY && deltaY !== 0) {
      return;
    }

    element.scrollTop -= deltaY;
    element.scrollLeft += deltaX;
    updateGeometry(i);

    if (shouldPreventDefault(deltaX, deltaY)) {
      e.preventDefault();
    }
  });
};

var wheel = function(i) {
  var element = i.element;

  function shouldPreventDefault(deltaX, deltaY) {
    var roundedScrollTop = Math.floor(element.scrollTop);
    var isTop = element.scrollTop === 0;
    var isBottom =
      roundedScrollTop + element.offsetHeight === element.scrollHeight;
    var isLeft = element.scrollLeft === 0;
    var isRight =
      element.scrollLeft + element.offsetWidth === element.scrollWidth;

    var hitsBound;

    // pick axis with primary direction
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      hitsBound = isTop || isBottom;
    } else {
      hitsBound = isLeft || isRight;
    }

    return hitsBound ? !i.settings.wheelPropagation : true;
  }

  function getDeltaFromEvent(e) {
    var deltaX = e.deltaX;
    var deltaY = -1 * e.deltaY;

    if (typeof deltaX === 'undefined' || typeof deltaY === 'undefined') {
      // OS X Safari
      deltaX = -1 * e.wheelDeltaX / 6;
      deltaY = e.wheelDeltaY / 6;
    }

    if (e.deltaMode && e.deltaMode === 1) {
      // Firefox in deltaMode 1: Line scrolling
      deltaX *= 10;
      deltaY *= 10;
    }

    if (deltaX !== deltaX && deltaY !== deltaY /* NaN checks */) {
      // IE in some mouse drivers
      deltaX = 0;
      deltaY = e.wheelDelta;
    }

    if (e.shiftKey) {
      // reverse axis with shift key
      return [-deltaY, -deltaX];
    }
    return [deltaX, deltaY];
  }

  function shouldBeConsumedByChild(target, deltaX, deltaY) {
    // FIXME: this is a workaround for <select> issue in FF and IE #571
    if (!env.isWebKit && element.querySelector('select:focus')) {
      return true;
    }

    if (!element.contains(target)) {
      return false;
    }

    var cursor = target;

    while (cursor && cursor !== element) {
      if (cursor.classList.contains(cls.element.consuming)) {
        return true;
      }

      var style = get(cursor);
      var overflow = [style.overflow, style.overflowX, style.overflowY].join(
        ''
      );

      // if scrollable
      if (overflow.match(/(scroll|auto)/)) {
        var maxScrollTop = cursor.scrollHeight - cursor.clientHeight;
        if (maxScrollTop > 0) {
          if (
            !(cursor.scrollTop === 0 && deltaY > 0) &&
            !(cursor.scrollTop === maxScrollTop && deltaY < 0)
          ) {
            return true;
          }
        }
        var maxScrollLeft = cursor.scrollWidth - cursor.clientWidth;
        if (maxScrollLeft > 0) {
          if (
            !(cursor.scrollLeft === 0 && deltaX < 0) &&
            !(cursor.scrollLeft === maxScrollLeft && deltaX > 0)
          ) {
            return true;
          }
        }
      }

      cursor = cursor.parentNode;
    }

    return false;
  }

  function mousewheelHandler(e) {
    var ref = getDeltaFromEvent(e);
    var deltaX = ref[0];
    var deltaY = ref[1];

    if (shouldBeConsumedByChild(e.target, deltaX, deltaY)) {
      return;
    }

    var shouldPrevent = false;
    if (!i.settings.useBothWheelAxes) {
      // deltaX will only be used for horizontal scrolling and deltaY will
      // only be used for vertical scrolling - this is the default
      element.scrollTop -= deltaY * i.settings.wheelSpeed;
      element.scrollLeft += deltaX * i.settings.wheelSpeed;
    } else if (i.scrollbarYActive && !i.scrollbarXActive) {
      // only vertical scrollbar is active and useBothWheelAxes option is
      // active, so let's scroll vertical bar using both mouse wheel axes
      if (deltaY) {
        element.scrollTop -= deltaY * i.settings.wheelSpeed;
      } else {
        element.scrollTop += deltaX * i.settings.wheelSpeed;
      }
      shouldPrevent = true;
    } else if (i.scrollbarXActive && !i.scrollbarYActive) {
      // useBothWheelAxes and only horizontal bar is active, so use both
      // wheel axes for horizontal bar
      if (deltaX) {
        element.scrollLeft += deltaX * i.settings.wheelSpeed;
      } else {
        element.scrollLeft -= deltaY * i.settings.wheelSpeed;
      }
      shouldPrevent = true;
    }

    updateGeometry(i);

    shouldPrevent = shouldPrevent || shouldPreventDefault(deltaX, deltaY);
    if (shouldPrevent && !e.ctrlKey) {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  if (typeof window.onwheel !== 'undefined') {
    i.event.bind(element, 'wheel', mousewheelHandler);
  } else if (typeof window.onmousewheel !== 'undefined') {
    i.event.bind(element, 'mousewheel', mousewheelHandler);
  }
};

var touch = function(i) {
  if (!env.supportsTouch && !env.supportsIePointer) {
    return;
  }

  var element = i.element;

  function shouldPrevent(deltaX, deltaY) {
    var scrollTop = Math.floor(element.scrollTop);
    var scrollLeft = element.scrollLeft;
    var magnitudeX = Math.abs(deltaX);
    var magnitudeY = Math.abs(deltaY);

    if (magnitudeY > magnitudeX) {
      // user is perhaps trying to swipe up/down the page

      if (
        (deltaY < 0 && scrollTop === i.contentHeight - i.containerHeight) ||
        (deltaY > 0 && scrollTop === 0)
      ) {
        // set prevent for mobile Chrome refresh
        return window.scrollY === 0 && deltaY > 0 && env.isChrome;
      }
    } else if (magnitudeX > magnitudeY) {
      // user is perhaps trying to swipe left/right across the page

      if (
        (deltaX < 0 && scrollLeft === i.contentWidth - i.containerWidth) ||
        (deltaX > 0 && scrollLeft === 0)
      ) {
        return true;
      }
    }

    return true;
  }

  function applyTouchMove(differenceX, differenceY) {
    element.scrollTop -= differenceY;
    element.scrollLeft -= differenceX;

    updateGeometry(i);
  }

  var startOffset = {};
  var startTime = 0;
  var speed = {};
  var easingLoop = null;

  function getTouch(e) {
    if (e.targetTouches) {
      return e.targetTouches[0];
    } else {
      // Maybe IE pointer
      return e;
    }
  }

  function shouldHandle(e) {
    if (e.pointerType && e.pointerType === 'pen' && e.buttons === 0) {
      return false;
    }
    if (e.targetTouches && e.targetTouches.length === 1) {
      return true;
    }
    if (
      e.pointerType &&
      e.pointerType !== 'mouse' &&
      e.pointerType !== e.MSPOINTER_TYPE_MOUSE
    ) {
      return true;
    }
    return false;
  }

  function touchStart(e) {
    if (!shouldHandle(e)) {
      return;
    }

    var touch = getTouch(e);

    startOffset.pageX = touch.pageX;
    startOffset.pageY = touch.pageY;

    startTime = new Date().getTime();

    if (easingLoop !== null) {
      clearInterval(easingLoop);
    }
  }

  function shouldBeConsumedByChild(target, deltaX, deltaY) {
    if (!element.contains(target)) {
      return false;
    }

    var cursor = target;

    while (cursor && cursor !== element) {
      if (cursor.classList.contains(cls.element.consuming)) {
        return true;
      }

      var style = get(cursor);
      var overflow = [style.overflow, style.overflowX, style.overflowY].join(
        ''
      );

      // if scrollable
      if (overflow.match(/(scroll|auto)/)) {
        var maxScrollTop = cursor.scrollHeight - cursor.clientHeight;
        if (maxScrollTop > 0) {
          if (
            !(cursor.scrollTop === 0 && deltaY > 0) &&
            !(cursor.scrollTop === maxScrollTop && deltaY < 0)
          ) {
            return true;
          }
        }
        var maxScrollLeft = cursor.scrollLeft - cursor.clientWidth;
        if (maxScrollLeft > 0) {
          if (
            !(cursor.scrollLeft === 0 && deltaX < 0) &&
            !(cursor.scrollLeft === maxScrollLeft && deltaX > 0)
          ) {
            return true;
          }
        }
      }

      cursor = cursor.parentNode;
    }

    return false;
  }

  function touchMove(e) {
    if (shouldHandle(e)) {
      var touch = getTouch(e);

      var currentOffset = { pageX: touch.pageX, pageY: touch.pageY };

      var differenceX = currentOffset.pageX - startOffset.pageX;
      var differenceY = currentOffset.pageY - startOffset.pageY;

      if (shouldBeConsumedByChild(e.target, differenceX, differenceY)) {
        return;
      }

      applyTouchMove(differenceX, differenceY);
      startOffset = currentOffset;

      var currentTime = new Date().getTime();

      var timeGap = currentTime - startTime;
      if (timeGap > 0) {
        speed.x = differenceX / timeGap;
        speed.y = differenceY / timeGap;
        startTime = currentTime;
      }

      if (shouldPrevent(differenceX, differenceY)) {
        e.preventDefault();
      }
    }
  }
  function touchEnd() {
    if (i.settings.swipeEasing) {
      clearInterval(easingLoop);
      easingLoop = setInterval(function() {
        if (i.isInitialized) {
          clearInterval(easingLoop);
          return;
        }

        if (!speed.x && !speed.y) {
          clearInterval(easingLoop);
          return;
        }

        if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
          clearInterval(easingLoop);
          return;
        }

        applyTouchMove(speed.x * 30, speed.y * 30);

        speed.x *= 0.8;
        speed.y *= 0.8;
      }, 10);
    }
  }

  if (env.supportsTouch) {
    i.event.bind(element, 'touchstart', touchStart);
    i.event.bind(element, 'touchmove', touchMove);
    i.event.bind(element, 'touchend', touchEnd);
  } else if (env.supportsIePointer) {
    if (window.PointerEvent) {
      i.event.bind(element, 'pointerdown', touchStart);
      i.event.bind(element, 'pointermove', touchMove);
      i.event.bind(element, 'pointerup', touchEnd);
    } else if (window.MSPointerEvent) {
      i.event.bind(element, 'MSPointerDown', touchStart);
      i.event.bind(element, 'MSPointerMove', touchMove);
      i.event.bind(element, 'MSPointerUp', touchEnd);
    }
  }
};

var defaultSettings = function () { return ({
  handlers: ['click-rail', 'drag-thumb', 'keyboard', 'wheel', 'touch'],
  maxScrollbarLength: null,
  minScrollbarLength: null,
  scrollingThreshold: 1000,
  scrollXMarginOffset: 0,
  scrollYMarginOffset: 0,
  suppressScrollX: false,
  suppressScrollY: false,
  swipeEasing: true,
  useBothWheelAxes: false,
  wheelPropagation: true,
  wheelSpeed: 1,
}); };

var handlers = {
  'click-rail': clickRail,
  'drag-thumb': dragThumb,
  keyboard: keyboard,
  wheel: wheel,
  touch: touch,
};

var PerfectScrollbar = function PerfectScrollbar(element, userSettings) {
  var this$1 = this;
  if ( userSettings === void 0 ) userSettings = {};

  if (typeof element === 'string') {
    element = document.querySelector(element);
  }

  if (!element || !element.nodeName) {
    throw new Error('no element is specified to initialize PerfectScrollbar');
  }

  this.element = element;

  element.classList.add(cls.main);

  this.settings = defaultSettings();
  for (var key in userSettings) {
    this$1.settings[key] = userSettings[key];
  }

  this.containerWidth = null;
  this.containerHeight = null;
  this.contentWidth = null;
  this.contentHeight = null;

  var focus = function () { return element.classList.add(cls.state.focus); };
  var blur = function () { return element.classList.remove(cls.state.focus); };

  this.isRtl = get(element).direction === 'rtl';
  this.isNegativeScroll = (function () {
    var originalScrollLeft = element.scrollLeft;
    var result = null;
    element.scrollLeft = -1;
    result = element.scrollLeft < 0;
    element.scrollLeft = originalScrollLeft;
    return result;
  })();
  this.negativeScrollAdjustment = this.isNegativeScroll
    ? element.scrollWidth - element.clientWidth
    : 0;
  this.event = new EventManager();
  this.ownerDocument = element.ownerDocument || document;

  this.scrollbarXRail = div(cls.element.rail('x'));
  element.appendChild(this.scrollbarXRail);
  this.scrollbarX = div(cls.element.thumb('x'));
  this.scrollbarXRail.appendChild(this.scrollbarX);
  this.scrollbarX.setAttribute('tabindex', 0);
  this.event.bind(this.scrollbarX, 'focus', focus);
  this.event.bind(this.scrollbarX, 'blur', blur);
  this.scrollbarXActive = null;
  this.scrollbarXWidth = null;
  this.scrollbarXLeft = null;
  var railXStyle = get(this.scrollbarXRail);
  this.scrollbarXBottom = parseInt(railXStyle.bottom, 10);
  if (isNaN(this.scrollbarXBottom)) {
    this.isScrollbarXUsingBottom = false;
    this.scrollbarXTop = toInt(railXStyle.top);
  } else {
    this.isScrollbarXUsingBottom = true;
  }
  this.railBorderXWidth =
    toInt(railXStyle.borderLeftWidth) + toInt(railXStyle.borderRightWidth);
  // Set rail to display:block to calculate margins
  set(this.scrollbarXRail, { display: 'block' });
  this.railXMarginWidth =
    toInt(railXStyle.marginLeft) + toInt(railXStyle.marginRight);
  set(this.scrollbarXRail, { display: '' });
  this.railXWidth = null;
  this.railXRatio = null;

  this.scrollbarYRail = div(cls.element.rail('y'));
  element.appendChild(this.scrollbarYRail);
  this.scrollbarY = div(cls.element.thumb('y'));
  this.scrollbarYRail.appendChild(this.scrollbarY);
  this.scrollbarY.setAttribute('tabindex', 0);
  this.event.bind(this.scrollbarY, 'focus', focus);
  this.event.bind(this.scrollbarY, 'blur', blur);
  this.scrollbarYActive = null;
  this.scrollbarYHeight = null;
  this.scrollbarYTop = null;
  var railYStyle = get(this.scrollbarYRail);
  this.scrollbarYRight = parseInt(railYStyle.right, 10);
  if (isNaN(this.scrollbarYRight)) {
    this.isScrollbarYUsingRight = false;
    this.scrollbarYLeft = toInt(railYStyle.left);
  } else {
    this.isScrollbarYUsingRight = true;
  }
  this.scrollbarYOuterWidth = this.isRtl ? outerWidth(this.scrollbarY) : null;
  this.railBorderYWidth =
    toInt(railYStyle.borderTopWidth) + toInt(railYStyle.borderBottomWidth);
  set(this.scrollbarYRail, { display: 'block' });
  this.railYMarginHeight =
    toInt(railYStyle.marginTop) + toInt(railYStyle.marginBottom);
  set(this.scrollbarYRail, { display: '' });
  this.railYHeight = null;
  this.railYRatio = null;

  this.reach = {
    x:
      element.scrollLeft <= 0
        ? 'start'
        : element.scrollLeft >= this.contentWidth - this.containerWidth
          ? 'end'
          : null,
    y:
      element.scrollTop <= 0
        ? 'start'
        : element.scrollTop >= this.contentHeight - this.containerHeight
          ? 'end'
          : null,
  };

  this.isAlive = true;

  this.settings.handlers.forEach(function (handlerName) { return handlers[handlerName](this$1); });

  this.lastScrollTop = Math.floor(element.scrollTop); // for onScroll only
  this.lastScrollLeft = element.scrollLeft; // for onScroll only
  this.event.bind(this.element, 'scroll', function (e) { return this$1.onScroll(e); });
  updateGeometry(this);
};

PerfectScrollbar.prototype.update = function update () {
  if (!this.isAlive) {
    return;
  }

  // Recalcuate negative scrollLeft adjustment
  this.negativeScrollAdjustment = this.isNegativeScroll
    ? this.element.scrollWidth - this.element.clientWidth
    : 0;

  // Recalculate rail margins
  set(this.scrollbarXRail, { display: 'block' });
  set(this.scrollbarYRail, { display: 'block' });
  this.railXMarginWidth =
    toInt(get(this.scrollbarXRail).marginLeft) +
    toInt(get(this.scrollbarXRail).marginRight);
  this.railYMarginHeight =
    toInt(get(this.scrollbarYRail).marginTop) +
    toInt(get(this.scrollbarYRail).marginBottom);

  // Hide scrollbars not to affect scrollWidth and scrollHeight
  set(this.scrollbarXRail, { display: 'none' });
  set(this.scrollbarYRail, { display: 'none' });

  updateGeometry(this);

  processScrollDiff(this, 'top', 0, false, true);
  processScrollDiff(this, 'left', 0, false, true);

  set(this.scrollbarXRail, { display: '' });
  set(this.scrollbarYRail, { display: '' });
};

PerfectScrollbar.prototype.onScroll = function onScroll (e) {
  if (!this.isAlive) {
    return;
  }

  updateGeometry(this);
  processScrollDiff(this, 'top', this.element.scrollTop - this.lastScrollTop);
  processScrollDiff(
    this,
    'left',
    this.element.scrollLeft - this.lastScrollLeft
  );

  this.lastScrollTop = Math.floor(this.element.scrollTop);
  this.lastScrollLeft = this.element.scrollLeft;
};

PerfectScrollbar.prototype.destroy = function destroy () {
  if (!this.isAlive) {
    return;
  }

  this.event.unbindAll();
  remove(this.scrollbarX);
  remove(this.scrollbarY);
  remove(this.scrollbarXRail);
  remove(this.scrollbarYRail);
  this.removePsClasses();

  // unset elements
  this.element = null;
  this.scrollbarX = null;
  this.scrollbarY = null;
  this.scrollbarXRail = null;
  this.scrollbarYRail = null;

  this.isAlive = false;
};

PerfectScrollbar.prototype.removePsClasses = function removePsClasses () {
  this.element.className = this.element.className
    .split(' ')
    .filter(function (name) { return !name.match(/^ps([-_].+|)$/); })
    .join(' ');
};

module.exports = PerfectScrollbar;

},{}],26:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],27:[function(require,module,exports){
(function (global){
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('react-dom')) :
	typeof define === 'function' && define.amd ? define(['react', 'react-dom'], factory) :
	(global.ReactAwesomePopover = factory(global.React,global.ReactDOM));
}(this, (function (React,ReactDOM) { 'use strict';

React = React && React.hasOwnProperty('default') ? React['default'] : React;
ReactDOM = ReactDOM && ReactDOM.hasOwnProperty('default') ? ReactDOM['default'] : ReactDOM;

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

"use strict";

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

var emptyFunction_1 = emptyFunction;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

function invariant(condition, format, a, b, c, d, e, f) {
  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

var invariant_1 = invariant;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';





var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      // It is still safe when called from React.
      return;
    }
    invariant_1(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  }
  shim.isRequired = shim;
  function getShim() {
    return shim;
  }
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction_1;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

{
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = factoryWithThrowingShims();
}
});

var Manager_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



var _react2 = _interopRequireDefault(React);



var _propTypes2 = _interopRequireDefault(propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Manager = function (_Component) {
  _inherits(Manager, _Component);

  function Manager() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Manager);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Manager.__proto__ || Object.getPrototypeOf(Manager)).call.apply(_ref, [this].concat(args))), _this), _this._setTargetNode = function (node) {
      _this._targetNode = node;
    }, _this._getTargetNode = function () {
      return _this._targetNode;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Manager, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        popperManager: {
          setTargetNode: this._setTargetNode,
          getTargetNode: this._getTargetNode
        }
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          tag = _props.tag,
          children = _props.children,
          restProps = _objectWithoutProperties(_props, ['tag', 'children']);

      if (tag !== false) {
        return (0, React.createElement)(tag, restProps, children);
      } else {
        return children;
      }
    }
  }]);

  return Manager;
}(React.Component);

Manager.childContextTypes = {
  popperManager: _propTypes2.default.object.isRequired
};
Manager.propTypes = {
  tag: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.bool])
};
Manager.defaultProps = {
  tag: 'div'
};
exports.default = Manager;
});

unwrapExports(Manager_1);

var Target_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



var _react2 = _interopRequireDefault(React);



var _propTypes2 = _interopRequireDefault(propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Target = function Target(props, context) {
  var _props$component = props.component,
      component = _props$component === undefined ? 'div' : _props$component,
      innerRef = props.innerRef,
      children = props.children,
      restProps = _objectWithoutProperties(props, ['component', 'innerRef', 'children']);

  var popperManager = context.popperManager;

  var targetRef = function targetRef(node) {
    popperManager.setTargetNode(node);
    if (typeof innerRef === 'function') {
      innerRef(node);
    }
  };

  if (typeof children === 'function') {
    var targetProps = { ref: targetRef };
    return children({ targetProps: targetProps, restProps: restProps });
  }

  var componentProps = _extends({}, restProps);

  if (typeof component === 'string') {
    componentProps.ref = targetRef;
  } else {
    componentProps.innerRef = targetRef;
  }

  return (0, React.createElement)(component, componentProps, children);
};

Target.contextTypes = {
  popperManager: _propTypes2.default.object.isRequired
};

Target.propTypes = {
  component: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func]),
  innerRef: _propTypes2.default.func,
  children: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func])
};

exports.default = Target;
});

unwrapExports(Target_1);

/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.12.7
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
var timeoutDuration = 0;
for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
  if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
    timeoutDuration = 1;
    break;
  }
}

function microtaskDebounce(fn) {
  var called = false;
  return function () {
    if (called) {
      return;
    }
    called = true;
    Promise.resolve().then(function () {
      called = false;
      fn();
    });
  };
}

function taskDebounce(fn) {
  var scheduled = false;
  return function () {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}

var supportsMicroTasks = isBrowser && window.Promise;

/**
* Create a debounced version of a method, that's asynchronously deferred
* but called in the minimum time possible.
*
* @method
* @memberof Popper.Utils
* @argument {Function} fn
* @returns {Function}
*/
var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

/**
 * Check if the given variable is a function
 * @method
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */
function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Eement} element
 * @argument {String} property
 */
function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  var css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
}

/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */
function getParentNode(element) {
  if (element.nodeName === 'HTML') {
    return element;
  }
  return element.parentNode || element.host;
}

/**
 * Returns the scrolling parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} scroll parent
 */
function getScrollParent(element) {
  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
  if (!element) {
    return window.document.body;
  }

  switch (element.nodeName) {
    case 'HTML':
    case 'BODY':
      return element.ownerDocument.body;
    case '#document':
      return element.body;
  }

  // Firefox want us to check `-x` and `-y` variations as well

  var _getStyleComputedProp = getStyleComputedProperty(element),
      overflow = _getStyleComputedProp.overflow,
      overflowX = _getStyleComputedProp.overflowX,
      overflowY = _getStyleComputedProp.overflowY;

  if (/(auto|scroll)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return getScrollParent(getParentNode(element));
}

/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */
function getOffsetParent(element) {
  // NOTE: 1 DOM access here
  var offsetParent = element && element.offsetParent;
  var nodeName = offsetParent && offsetParent.nodeName;

  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
    if (element) {
      return element.ownerDocument.documentElement;
    }

    return window.document.documentElement;
  }

  // .offsetParent will return the closest TD or TABLE in case
  // no offsetParent is present, I hate this job...
  if (['TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
    return getOffsetParent(offsetParent);
  }

  return offsetParent;
}

function isOffsetContainer(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY') {
    return false;
  }
  return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
}

/**
 * Finds the root node (document, shadowDOM root) of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} node
 * @returns {Element} root node
 */
function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }

  return node;
}

/**
 * Finds the offset parent common to the two provided nodes
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element1
 * @argument {Element} element2
 * @returns {Element} common offset parent
 */
function findCommonOffsetParent(element1, element2) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return window.document.documentElement;
  }

  // Here we make sure to give as "start" the element that comes first in the DOM
  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1;

  // Get common ancestor container
  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer;

  // Both nodes are inside #document

  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }

    return getOffsetParent(commonAncestorContainer);
  }

  // one of the nodes is inside shadowDOM, find which one
  var element1root = getRoot(element1);
  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}

/**
 * Gets the scroll value of the given element in the given side (top and left)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */
function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || html;
    return scrollingElement[upperSide];
  }

  return element[upperSide];
}

/*
 * Sum or subtract the element scroll values (left and top) from a given rect object
 * @method
 * @memberof Popper.Utils
 * @param {Object} rect - Rect object you want to change
 * @param {HTMLElement} element - The element from the function reads the scroll values
 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
 * @return {Object} rect - The modifier rect object
 */
function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var scrollTop = getScroll(element, 'top');
  var scrollLeft = getScroll(element, 'left');
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}

/*
 * Helper to detect borders of a given element
 * @method
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration} styles
 * Result of `getStyleComputedProperty` on the given element
 * @param {String} axis - `x` or `y`
 * @return {number} borders - The borders size of the given axis
 */

function getBordersSize(styles, axis) {
  var sideA = axis === 'x' ? 'Left' : 'Top';
  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

  return +styles['border' + sideA + 'Width'].split('px')[0] + +styles['border' + sideB + 'Width'].split('px')[0];
}

/**
 * Tells if you are running Internet Explorer 10
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean} isIE10
 */
var isIE10 = undefined;

var isIE10$1 = function () {
  if (isIE10 === undefined) {
    isIE10 = navigator.appVersion.indexOf('MSIE 10') !== -1;
  }
  return isIE10;
};

function getSize(axis, body, html, computedStyle) {
  return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE10$1() ? html['offset' + axis] + computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')] + computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')] : 0);
}

function getWindowSizes() {
  var body = window.document.body;
  var html = window.document.documentElement;
  var computedStyle = isIE10$1() && window.getComputedStyle(html);

  return {
    height: getSize('Height', body, html, computedStyle),
    width: getSize('Width', body, html, computedStyle)
  };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {Object} offsets
 * @returns {Object} ClientRect like output
 */
function getClientRect(offsets) {
  return _extends({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}

/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
function getBoundingClientRect(element) {
  var rect = {};

  // IE10 10 FIX: Please, don't ask, the element isn't
  // considered in DOM in some circumstances...
  // This isn't reproducible in IE10 compatibility mode of IE11
  if (isIE10$1()) {
    try {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, 'top');
      var scrollLeft = getScroll(element, 'left');
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } catch (err) {}
  } else {
    rect = element.getBoundingClientRect();
  }

  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };

  // subtract scrollbar size from sizes
  var sizes = element.nodeName === 'HTML' ? getWindowSizes() : {};
  var width = sizes.width || element.clientWidth || result.right - result.left;
  var height = sizes.height || element.clientHeight || result.bottom - result.top;

  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height;

  // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
  // we make this check conditional for performance reasons
  if (horizScrollbar || vertScrollbar) {
    var styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, 'x');
    vertScrollbar -= getBordersSize(styles, 'y');

    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }

  return getClientRect(result);
}

function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var isIE10 = isIE10$1();
  var isHTML = parent.nodeName === 'HTML';
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent = getScrollParent(children);

  var styles = getStyleComputedProperty(parent);
  var borderTopWidth = +styles.borderTopWidth.split('px')[0];
  var borderLeftWidth = +styles.borderLeftWidth.split('px')[0];

  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top - borderTopWidth,
    left: childrenRect.left - parentRect.left - borderLeftWidth,
    width: childrenRect.width,
    height: childrenRect.height
  });
  offsets.marginTop = 0;
  offsets.marginLeft = 0;

  // Subtract margins of documentElement in case it's being used as parent
  // we do this only on HTML because it's the only element that behaves
  // differently when margins are applied to it. The margins are included in
  // the box of the documentElement, in the other cases not.
  if (!isIE10 && isHTML) {
    var marginTop = +styles.marginTop.split('px')[0];
    var marginLeft = +styles.marginLeft.split('px')[0];

    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;

    // Attach marginTop and marginLeft because in some circumstances we may need them
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if (isIE10 ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
    offsets = includeScroll(offsets, parent);
  }

  return offsets;
}

function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);

  var scrollTop = getScroll(html);
  var scrollLeft = getScroll(html, 'left');

  var offset = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width: width,
    height: height
  };

  return getClientRect(offset);
}

/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */
function isFixed(element) {
  var nodeName = element.nodeName;
  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }
  if (getStyleComputedProperty(element, 'position') === 'fixed') {
    return true;
  }
  return isFixed(getParentNode(element));
}

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement} reference
 * @param {number} padding
 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
 * @returns {Object} Coordinates of the boundaries
 */
function getBoundaries(popper, reference, padding, boundariesElement) {
  // NOTE: 1 DOM access here
  var boundaries = { top: 0, left: 0 };
  var offsetParent = findCommonOffsetParent(popper, reference);

  // Handle viewport case
  if (boundariesElement === 'viewport') {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent);
  } else {
    // Handle other cases based on DOM element used as boundaries
    var boundariesNode = void 0;
    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(reference));
      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent);

    // In case of HTML, we need a different computation
    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(),
          height = _getWindowSizes.height,
          width = _getWindowSizes.width;

      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  }

  // Add paddings
  boundaries.left += padding;
  boundaries.top += padding;
  boundaries.right -= padding;
  boundaries.bottom -= padding;

  return boundaries;
}

function getArea(_ref) {
  var width = _ref.width,
      height = _ref.height;

  return width * height;
}

/**
 * Utility used to transform the `auto` placement to the placement with more
 * available space.
 * @method
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  if (placement.indexOf('auto') === -1) {
    return placement;
  }

  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };

  var sortedAreas = Object.keys(rects).map(function (key) {
    return _extends({
      key: key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function (a, b) {
    return b.area - a.area;
  });

  var filteredAreas = sortedAreas.filter(function (_ref2) {
    var width = _ref2.width,
        height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });

  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

  var variation = placement.split('-')[1];

  return computedPlacement + (variation ? '-' + variation : '');
}

/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
function getReferenceOffsets(state, popper, reference) {
  var commonOffsetParent = findCommonOffsetParent(popper, reference);
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent);
}

/**
 * Get the outer sizes of the given element (offset size + margins)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */
function getOuterSizes(element) {
  var styles = window.getComputedStyle(element);
  var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
  var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
  var result = {
    width: element.offsetWidth + y,
    height: element.offsetHeight + x
  };
  return result;
}

/**
 * Get the opposite placement of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement
 * @returns {String} flipped placement
 */
function getOppositePlacement(placement) {
  var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Object} position - CSS position the Popper will get applied
 * @param {HTMLElement} popper - the popper element
 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
 * @param {String} placement - one of the valid placement options
 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
 */
function getPopperOffsets(popper, referenceOffsets, placement) {
  placement = placement.split('-')[0];

  // Get popper node sizes
  var popperRect = getOuterSizes(popper);

  // Add position, width and height to our offsets object
  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  };

  // depending by the popper placement we have to compute its offsets slightly differently
  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
  var mainSide = isHoriz ? 'top' : 'left';
  var secondarySide = isHoriz ? 'left' : 'top';
  var measurement = isHoriz ? 'height' : 'width';
  var secondaryMeasurement = !isHoriz ? 'height' : 'width';

  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
  if (placement === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }

  return popperOffsets;
}

/**
 * Mimics the `find` method of Array
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function find(arr, check) {
  // use native find if supported
  if (Array.prototype.find) {
    return arr.find(check);
  }

  // use `filter` to obtain the same behavior of `find`
  return arr.filter(check)[0];
}

/**
 * Return the index of the matching object
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function findIndex(arr, prop, value) {
  // use native findIndex if supported
  if (Array.prototype.findIndex) {
    return arr.findIndex(function (cur) {
      return cur[prop] === value;
    });
  }

  // use `find` + `indexOf` if `findIndex` isn't supported
  var match = find(arr, function (obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}

/**
 * Loop trough the list of modifiers and run them in order,
 * each of them will then edit the data object.
 * @method
 * @memberof Popper.Utils
 * @param {dataObject} data
 * @param {Array} modifiers
 * @param {String} ends - Optional modifier name used as stopper
 * @returns {dataObject}
 */
function runModifiers(modifiers, data, ends) {
  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

  modifiersToRun.forEach(function (modifier) {
    if (modifier['function']) {
      // eslint-disable-line dot-notation
      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    }
    var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
    if (modifier.enabled && isFunction(fn)) {
      // Add properties to offsets to make them a complete clientRect object
      // we do this before each modifier to make sure the previous one doesn't
      // mess with these values
      data.offsets.popper = getClientRect(data.offsets.popper);
      data.offsets.reference = getClientRect(data.offsets.reference);

      data = fn(data, modifier);
    }
  });

  return data;
}

/**
 * Updates the position of the popper, computing the new offsets and applying
 * the new style.<br />
 * Prefer `scheduleUpdate` over `update` because of performance reasons.
 * @method
 * @memberof Popper
 */
function update() {
  // if popper is destroyed, don't perform any further update
  if (this.state.isDestroyed) {
    return;
  }

  var data = {
    instance: this,
    styles: {},
    arrowStyles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  };

  // compute reference element offsets
  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

  // store the computed placement inside `originalPlacement`
  data.originalPlacement = data.placement;

  // compute the popper offsets
  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);
  data.offsets.popper.position = 'absolute';

  // run the modifiers
  data = runModifiers(this.modifiers, data);

  // the first `update` will call `onCreate` callback
  // the other ones will call `onUpdate` callback
  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  } else {
    this.options.onUpdate(data);
  }
}

/**
 * Helper used to know if the given modifier is enabled.
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean}
 */
function isModifierEnabled(modifiers, modifierName) {
  return modifiers.some(function (_ref) {
    var name = _ref.name,
        enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}

/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
 */
function getSupportedPropertyName(property) {
  var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

  for (var i = 0; i < prefixes.length - 1; i++) {
    var prefix = prefixes[i];
    var toCheck = prefix ? '' + prefix + upperProp : property;
    if (typeof window.document.body.style[toCheck] !== 'undefined') {
      return toCheck;
    }
  }
  return null;
}

/**
 * Destroy the popper
 * @method
 * @memberof Popper
 */
function destroy() {
  this.state.isDestroyed = true;

  // touch DOM only if `applyStyle` modifier is enabled
  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
    this.popper.removeAttribute('x-placement');
    this.popper.style.left = '';
    this.popper.style.position = '';
    this.popper.style.top = '';
    this.popper.style[getSupportedPropertyName('transform')] = '';
  }

  this.disableEventListeners();

  // remove the popper if user explicity asked for the deletion on destroy
  // do not use `remove` because IE11 doesn't support it
  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }
  return this;
}

/**
 * Get the window associated with the element
 * @argument {Element} element
 * @returns {Window}
 */
function getWindow(element) {
  var ownerDocument = element.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}

function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  var isBody = scrollParent.nodeName === 'BODY';
  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  target.addEventListener(event, callback, { passive: true });

  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }
  scrollParents.push(target);
}

/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function setupEventListeners(reference, options, state, updateBound) {
  // Resize event listener on window
  state.updateBound = updateBound;
  getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

  // Scroll event listener on scroll parents
  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;

  return state;
}

/**
 * It will add resize/scroll events and start recalculating
 * position of the popper element when they are triggered.
 * @method
 * @memberof Popper
 */
function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}

/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function removeEventListeners(reference, state) {
  // Remove resize event listener on window
  getWindow(reference).removeEventListener('resize', state.updateBound);

  // Remove scroll event listener on scroll parents
  state.scrollParents.forEach(function (target) {
    target.removeEventListener('scroll', state.updateBound);
  });

  // Reset state
  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}

/**
 * It will remove resize/scroll events and won't recalculate popper position
 * when they are triggered. It also won't trigger onUpdate callback anymore,
 * unless you call `update` method manually.
 * @method
 * @memberof Popper
 */
function disableEventListeners() {
  if (this.state.eventsEnabled) {
    window.cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}

/**
 * Tells if a given input is a number
 * @method
 * @memberof Popper.Utils
 * @param {*} input to check
 * @return {Boolean}
 */
function isNumeric(n) {
  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Set the style to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the style to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setStyles(element, styles) {
  Object.keys(styles).forEach(function (prop) {
    var unit = '';
    // add unit if the value is numeric and is one of the following
    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
      unit = 'px';
    }
    element.style[prop] = styles[prop] + unit;
  });
}

/**
 * Set the attributes to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the attributes to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function (prop) {
    var value = attributes[prop];
    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} data.styles - List of style properties - values to apply to popper element
 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The same data object
 */
function applyStyle(data) {
  // any property present in `data.styles` will be applied to the popper,
  // in this way we can make the 3rd party modifiers add custom styles to it
  // Be aware, modifiers could override the properties defined in the previous
  // lines of this modifier!
  setStyles(data.instance.popper, data.styles);

  // any property present in `data.attributes` will be applied to the popper,
  // they will be set as HTML attributes of the element
  setAttributes(data.instance.popper, data.attributes);

  // if arrowElement is defined and arrowStyles has some properties
  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
    setStyles(data.arrowElement, data.arrowStyles);
  }

  return data;
}

/**
 * Set the x-placement attribute before everything else because it could be used
 * to add margins to the popper margins needs to be calculated to get the
 * correct popper offsets.
 * @method
 * @memberof Popper.modifiers
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper.
 * @param {Object} options - Popper.js options
 */
function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
  // compute reference element offsets
  var referenceOffsets = getReferenceOffsets(state, popper, reference);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

  popper.setAttribute('x-placement', placement);

  // Apply `position` to popper before anything else because
  // without the position applied we can't guarantee correct computations
  setStyles(popper, { position: 'absolute' });

  return options;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeStyle(data, options) {
  var x = options.x,
      y = options.y;
  var popper = data.offsets.popper;

  // Remove this legacy support in Popper.js v2

  var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'applyStyle';
  }).gpuAcceleration;
  if (legacyGpuAccelerationOption !== undefined) {
    console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
  }
  var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

  var offsetParent = getOffsetParent(data.instance.popper);
  var offsetParentRect = getBoundingClientRect(offsetParent);

  // Styles
  var styles = {
    position: popper.position
  };

  // floor sides to avoid blurry text
  var offsets = {
    left: Math.floor(popper.left),
    top: Math.floor(popper.top),
    bottom: Math.floor(popper.bottom),
    right: Math.floor(popper.right)
  };

  var sideA = x === 'bottom' ? 'top' : 'bottom';
  var sideB = y === 'right' ? 'left' : 'right';

  // if gpuAcceleration is set to `true` and transform is supported,
  //  we use `translate3d` to apply the position to the popper we
  // automatically use the supported prefixed version if needed
  var prefixedProperty = getSupportedPropertyName('transform');

  // now, let's make a step back and look at this code closely (wtf?)
  // If the content of the popper grows once it's been positioned, it
  // may happen that the popper gets misplaced because of the new content
  // overflowing its reference element
  // To avoid this problem, we provide two options (x and y), which allow
  // the consumer to define the offset origin.
  // If we position a popper on top of a reference element, we can set
  // `x` to `top` to make the popper grow towards its top instead of
  // its bottom.
  var left = void 0,
      top = void 0;
  if (sideA === 'bottom') {
    top = -offsetParentRect.height + offsets.bottom;
  } else {
    top = offsets.top;
  }
  if (sideB === 'right') {
    left = -offsetParentRect.width + offsets.right;
  } else {
    left = offsets.left;
  }
  if (gpuAcceleration && prefixedProperty) {
    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
    styles[sideA] = 0;
    styles[sideB] = 0;
    styles.willChange = 'transform';
  } else {
    // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
    var invertTop = sideA === 'bottom' ? -1 : 1;
    var invertLeft = sideB === 'right' ? -1 : 1;
    styles[sideA] = top * invertTop;
    styles[sideB] = left * invertLeft;
    styles.willChange = sideA + ', ' + sideB;
  }

  // Attributes
  var attributes = {
    'x-placement': data.placement
  };

  // Update `data` attributes, styles and arrowStyles
  data.attributes = _extends({}, attributes, data.attributes);
  data.styles = _extends({}, styles, data.styles);
  data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);

  return data;
}

/**
 * Helper used to know if the given modifier depends from another one.<br />
 * It checks if the needed modifier is listed and enabled.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers - list of modifiers
 * @param {String} requestingName - name of requesting modifier
 * @param {String} requestedName - name of requested modifier
 * @returns {Boolean}
 */
function isModifierRequired(modifiers, requestingName, requestedName) {
  var requesting = find(modifiers, function (_ref) {
    var name = _ref.name;
    return name === requestingName;
  });

  var isRequired = !!requesting && modifiers.some(function (modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });

  if (!isRequired) {
    var _requesting = '`' + requestingName + '`';
    var requested = '`' + requestedName + '`';
    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
  }
  return isRequired;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function arrow(data, options) {
  // arrow depends on keepTogether in order to work
  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
    return data;
  }

  var arrowElement = options.element;

  // if arrowElement is a string, suppose it's a CSS selector
  if (typeof arrowElement === 'string') {
    arrowElement = data.instance.popper.querySelector(arrowElement);

    // if arrowElement is not found, don't run the modifier
    if (!arrowElement) {
      return data;
    }
  } else {
    // if the arrowElement isn't a query selector we must check that the
    // provided DOM node is child of its popper node
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn('WARNING: `arrow.element` must be child of its popper element!');
      return data;
    }
  }

  var placement = data.placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isVertical = ['left', 'right'].indexOf(placement) !== -1;

  var len = isVertical ? 'height' : 'width';
  var sideCapitalized = isVertical ? 'Top' : 'Left';
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? 'left' : 'top';
  var opSide = isVertical ? 'bottom' : 'right';
  var arrowElementSize = getOuterSizes(arrowElement)[len];

  //
  // extends keepTogether behavior making sure the popper and its
  // reference have enough pixels in conjuction
  //

  // top/left side
  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  }
  // bottom/right side
  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }

  // compute center of the popper
  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

  // Compute the sideValue using the updated popper offsets
  // take popper margin in account because we don't have this info available
  var popperMarginSide = getStyleComputedProperty(data.instance.popper, 'margin' + sideCapitalized).replace('px', '');
  var sideValue = center - getClientRect(data.offsets.popper)[side] - popperMarginSide;

  // prevent arrowElement from being placed not contiguously to its popper
  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

  data.arrowElement = arrowElement;
  data.offsets.arrow = {};
  data.offsets.arrow[side] = Math.round(sideValue);
  data.offsets.arrow[altSide] = ''; // make sure to unset any eventual altSide value from the DOM node

  return data;
}

/**
 * Get the opposite placement variation of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement variation
 * @returns {String} flipped placement variation
 */
function getOppositeVariation(variation) {
  if (variation === 'end') {
    return 'start';
  } else if (variation === 'start') {
    return 'end';
  }
  return variation;
}

/**
 * List of accepted placements to use as values of the `placement` option.<br />
 * Valid placements are:
 * - `auto`
 * - `top`
 * - `right`
 * - `bottom`
 * - `left`
 *
 * Each placement can have a variation from this list:
 * - `-start`
 * - `-end`
 *
 * Variations are interpreted easily if you think of them as the left to right
 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
 * is right.<br />
 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
 *
 * Some valid examples are:
 * - `top-end` (on top of reference, right aligned)
 * - `right-start` (on right of reference, top aligned)
 * - `bottom` (on bottom, centered)
 * - `auto-right` (on the side with more space available, alignment depends by placement)
 *
 * @static
 * @type {Array}
 * @enum {String}
 * @readonly
 * @method placements
 * @memberof Popper
 */
var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

// Get rid of `auto` `auto-start` and `auto-end`
var validPlacements = placements.slice(3);

/**
 * Given an initial placement, returns all the subsequent placements
 * clockwise (or counter-clockwise).
 *
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement - A valid placement (it accepts variations)
 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
 * @returns {Array} placements including their variations
 */
function clockwise(placement) {
  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var index = validPlacements.indexOf(placement);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}

var BEHAVIORS = {
  FLIP: 'flip',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise'
};

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function flip(data, options) {
  // if `inner` modifier is enabled, we can't use the `flip` modifier
  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
    return data;
  }

  if (data.flipped && data.placement === data.originalPlacement) {
    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
    return data;
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement);

  var placement = data.placement.split('-')[0];
  var placementOpposite = getOppositePlacement(placement);
  var variation = data.placement.split('-')[1] || '';

  var flipOrder = [];

  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement, placementOpposite];
      break;
    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement);
      break;
    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement, true);
      break;
    default:
      flipOrder = options.behavior;
  }

  flipOrder.forEach(function (step, index) {
    if (placement !== step || flipOrder.length === index + 1) {
      return data;
    }

    placement = data.placement.split('-')[0];
    placementOpposite = getOppositePlacement(placement);

    var popperOffsets = data.offsets.popper;
    var refOffsets = data.offsets.reference;

    // using floor because the reference offsets may contain decimals we are not going to consider here
    var floor = Math.floor;
    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

    // flip the variation if required
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
    var flippedVariation = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      // this boolean to detect any flip loop
      data.flipped = true;

      if (overlapsRef || overflowsBoundaries) {
        placement = flipOrder[index + 1];
      }

      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }

      data.placement = placement + (variation ? '-' + variation : '');

      // this object contains `position`, we want to preserve it along with
      // any additional property we may add in the future
      data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

      data = runModifiers(data.instance.modifiers, data, 'flip');
    }
  });
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function keepTogether(data) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var placement = data.placement.split('-')[0];
  var floor = Math.floor;
  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
  var side = isVertical ? 'right' : 'bottom';
  var opSide = isVertical ? 'left' : 'top';
  var measurement = isVertical ? 'width' : 'height';

  if (popper[side] < floor(reference[opSide])) {
    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }
  if (popper[opSide] > floor(reference[side])) {
    data.offsets.popper[opSide] = floor(reference[side]);
  }

  return data;
}

/**
 * Converts a string containing value + unit into a px value number
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} str - Value + unit string
 * @argument {String} measurement - `height` or `width`
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @returns {Number|String}
 * Value in pixels, or original string if no values were extracted
 */
function toValue(str, measurement, popperOffsets, referenceOffsets) {
  // separate value from unit
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2];

  // If it's not a number it's an operator, I guess
  if (!value) {
    return str;
  }

  if (unit.indexOf('%') === 0) {
    var element = void 0;
    switch (unit) {
      case '%p':
        element = popperOffsets;
        break;
      case '%':
      case '%r':
      default:
        element = referenceOffsets;
    }

    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === 'vh' || unit === 'vw') {
    // if is a vh or vw, we calculate the size based on the viewport
    var size = void 0;
    if (unit === 'vh') {
      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    return size / 100 * value;
  } else {
    // if is an explicit pixel unit, we get rid of the unit and keep the value
    // if is an implicit unit, it's px, and we return just the value
    return value;
  }
}

/**
 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} offset
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @argument {String} basePlacement
 * @returns {Array} a two cells array with x and y offsets in numbers
 */
function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0];

  // Use height if placement is left or right and index is 0 otherwise use width
  // in this way the first offset will use an axis and the second one
  // will use the other one
  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

  // Split the offset string to obtain a list of values and operands
  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
    return frag.trim();
  });

  // Detect if the offset string contains a pair of values or a single one
  // they could be separated by comma or space
  var divider = fragments.indexOf(find(fragments, function (frag) {
    return frag.search(/,|\s/) !== -1;
  }));

  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
  }

  // If divider is found, we divide the list of values and operands to divide
  // them by ofset X and Y.
  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

  // Convert the values with units to absolute pixels to allow our computations
  ops = ops.map(function (op, index) {
    // Most of the units rely on the orientation of the popper
    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
    var mergeWithPrevious = false;
    return op
    // This aggregates any `+` or `-` sign that aren't considered operators
    // e.g.: 10 + +5 => [10, +, +5]
    .reduce(function (a, b) {
      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
        a[a.length - 1] = b;
        mergeWithPrevious = true;
        return a;
      } else if (mergeWithPrevious) {
        a[a.length - 1] += b;
        mergeWithPrevious = false;
        return a;
      } else {
        return a.concat(b);
      }
    }, [])
    // Here we convert the string values into number values (in px)
    .map(function (str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  });

  // Loop trough the offsets arrays and execute the operations
  ops.forEach(function (op, index) {
    op.forEach(function (frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
      }
    });
  });
  return offsets;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @argument {Number|String} options.offset=0
 * The offset value as described in the modifier description
 * @returns {Object} The data object, properly modified
 */
function offset(data, _ref) {
  var offset = _ref.offset;
  var placement = data.placement,
      _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var basePlacement = placement.split('-')[0];

  var offsets = void 0;
  if (isNumeric(+offset)) {
    offsets = [+offset, 0];
  } else {
    offsets = parseOffset(offset, popper, reference, basePlacement);
  }

  if (basePlacement === 'left') {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === 'right') {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === 'top') {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === 'bottom') {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }

  data.popper = popper;
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function preventOverflow(data, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

  // If offsetParent is the reference element, we really want to
  // go one step up and use the next offsetParent as reference to
  // avoid to make this modifier completely useless and look like broken
  if (data.instance.reference === boundariesElement) {
    boundariesElement = getOffsetParent(boundariesElement);
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement);
  options.boundaries = boundaries;

  var order = options.priority;
  var popper = data.offsets.popper;

  var check = {
    primary: function primary(placement) {
      var value = popper[placement];
      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        value = Math.max(popper[placement], boundaries[placement]);
      }
      return defineProperty({}, placement, value);
    },
    secondary: function secondary(placement) {
      var mainSide = placement === 'right' ? 'left' : 'top';
      var value = popper[mainSide];
      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
      }
      return defineProperty({}, mainSide, value);
    }
  };

  order.forEach(function (placement) {
    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
    popper = _extends({}, popper, check[side](placement));
  });

  data.offsets.popper = popper;

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function shift(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var shiftvariation = placement.split('-')[1];

  // if shift shiftvariation is specified, run the modifier
  if (shiftvariation) {
    var _data$offsets = data.offsets,
        reference = _data$offsets.reference,
        popper = _data$offsets.popper;

    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
    var side = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    var shiftOffsets = {
      start: defineProperty({}, side, reference[side]),
      end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
    };

    data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function hide(data) {
  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
    return data;
  }

  var refRect = data.offsets.reference;
  var bound = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'preventOverflow';
  }).boundaries;

  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === true) {
      return data;
    }

    data.hide = true;
    data.attributes['x-out-of-boundaries'] = '';
  } else {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === false) {
      return data;
    }

    data.hide = false;
    data.attributes['x-out-of-boundaries'] = false;
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function inner(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

  popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

  data.placement = getOppositePlacement(placement);
  data.offsets.popper = getClientRect(popper);

  return data;
}

/**
 * Modifier function, each modifier can have a function of this type assigned
 * to its `fn` property.<br />
 * These functions will be called on each update, this means that you must
 * make sure they are performant enough to avoid performance bottlenecks.
 *
 * @function ModifierFn
 * @argument {dataObject} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {dataObject} The data object, properly modified
 */

/**
 * Modifiers are plugins used to alter the behavior of your poppers.<br />
 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
 * needed by the library.
 *
 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
 * All the other properties are configurations that could be tweaked.
 * @namespace modifiers
 */
var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: shift
  },

  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unitless, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the height.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
   * > More on this [reading this issue](https://github.com/FezVrasta/popper.js/issues/373)
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: offset,
    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },

  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * An scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: preventOverflow,
    /**
     * @prop {Array} [priority=['left','right','top','bottom']]
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ['left', 'right', 'top', 'bottom'],
    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper this makes sure the popper has always a little padding
     * between the edges of its container
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier, can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: 'scrollParent'
  },

  /**
   * Modifier used to make sure the reference and its popper stay near eachothers
   * without leaving any gap between the two. Expecially useful when the arrow is
   * enabled and you want to assure it to point to its reference element.
   * It cares only about the first axis, you can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: keepTogether
  },

  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjuction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: arrow,
    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: '[x-arrow]'
  },

  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: flip,
    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations).
     */
    behavior: 'flip',
    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position,
     * the popper will never be placed outside of the defined boundaries
     * (except if keepTogether is enabled)
     */
    boundariesElement: 'viewport'
  },

  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,
    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,
    /** @prop {ModifierFn} */
    fn: inner
  },

  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: hide
  },

  /**
   * Computes the style that will be applied to the popper element to gets
   * properly positioned.
   *
   * Note that this modifier will not touch the DOM, it just prepares the styles
   * so that `applyStyle` modifier can apply it. This separation is useful
   * in case you need to replace `applyStyle` with a custom implementation.
   *
   * This modifier has `850` as `order` value to maintain backward compatibility
   * with previous versions of Popper.js. Expect the modifiers ordering method
   * to change in future major versions of the library.
   *
   * @memberof modifiers
   * @inner
   */
  computeStyle: {
    /** @prop {number} order=850 - Index used to define the order of execution */
    order: 850,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: computeStyle,
    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3d transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties.
     */
    gpuAcceleration: true,
    /**
     * @prop {string} [x='bottom']
     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
     * Change this if your popper should grow in a direction different from `bottom`
     */
    x: 'bottom',
    /**
     * @prop {string} [x='left']
     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
     * Change this if your popper should grow in a direction different from `right`
     */
    y: 'right'
  },

  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Note that if you disable this modifier, you must make sure the popper element
   * has its position set to `absolute` before Popper.js can do its work!
   *
   * Just disable this modifier and define you own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: applyStyle,
    /** @prop {Function} */
    onLoad: applyStyleOnLoad,
    /**
     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3d transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties.
     */
    gpuAcceleration: undefined
  }
};

/**
 * The `dataObject` is an object containing all the informations used by Popper.js
 * this object get passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
 * @name dataObject
 * @property {Object} data.instance The Popper.js instance
 * @property {String} data.placement Placement applied to popper
 * @property {String} data.originalPlacement Placement originally defined on init
 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper.
 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
 * @property {Object} data.styles Any CSS property defined here will be applied to the popper, it expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow, it expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.boundaries Offsets of the popper boundaries
 * @property {Object} data.offsets The measurements of popper, reference and arrow elements.
 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
 */

/**
 * Default options provided to Popper.js constructor.<br />
 * These can be overriden using the `options` argument of Popper.js.<br />
 * To override an option, simply pass as 3rd argument an object with the same
 * structure of this object, example:
 * ```
 * new Popper(ref, pop, {
 *   modifiers: {
 *     preventOverflow: { enabled: false }
 *   }
 * })
 * ```
 * @type {Object}
 * @static
 * @memberof Popper
 */
var Defaults = {
  /**
   * Popper's placement
   * @prop {Popper.placements} placement='bottom'
   */
  placement: 'bottom',

  /**
   * Whether events (resize, scroll) are initially enabled
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,

  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,

  /**
   * Callback called when the popper is created.<br />
   * By default, is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: function onCreate() {},

  /**
   * Callback called when the popper is updated, this callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: function onUpdate() {},

  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js
   * @prop {modifiers}
   */
  modifiers: modifiers
};

/**
 * @callback onCreate
 * @param {dataObject} data
 */

/**
 * @callback onUpdate
 * @param {dataObject} data
 */

// Utils
// Methods
var Popper$1 = function () {
  /**
   * Create a new Popper.js instance
   * @class Popper
   * @param {HTMLElement|referenceObject} reference - The reference element used to position the popper
   * @param {HTMLElement} popper - The HTML element used as popper.
   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
  function Popper(reference, popper) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Popper);

    this.scheduleUpdate = function () {
      return requestAnimationFrame(_this.update);
    };

    // make update() debounced, so that it only runs at most once-per-tick
    this.update = debounce(this.update.bind(this));

    // with {} we create a new object with the options inside it
    this.options = _extends({}, Popper.Defaults, options);

    // init state
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    };

    // get reference and popper elements (allow jQuery wrappers)
    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper;

    // Deep merge modifiers options
    this.options.modifiers = {};
    Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
      _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    });

    // Refactoring modifiers' list (Object => Array)
    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
      return _extends({
        name: name
      }, _this.options.modifiers[name]);
    })
    // sort the modifiers by order
    .sort(function (a, b) {
      return a.order - b.order;
    });

    // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
    this.modifiers.forEach(function (modifierOptions) {
      if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    });

    // fire the first update to position the popper in the right place
    this.update();

    var eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  }

  // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs


  createClass(Popper, [{
    key: 'update',
    value: function update$$1() {
      return update.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: 'enableEventListeners',
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: 'disableEventListeners',
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }

    /**
     * Schedule an update, it will run on the next UI update available
     * @method scheduleUpdate
     * @memberof Popper
     */


    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */

  }]);
  return Popper;
}();

/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */


Popper$1.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
Popper$1.placements = placements;
Popper$1.Defaults = Defaults;





var popper = Object.freeze({
	default: Popper$1
});

var _popper = ( popper && Popper$1 ) || popper;

var Popper_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



var _react2 = _interopRequireDefault(React);



var _propTypes2 = _interopRequireDefault(propTypes);



var _popper2 = _interopRequireDefault(_popper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Popper = function (_Component) {
  _inherits(Popper, _Component);

  function Popper() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Popper);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Popper.__proto__ || Object.getPrototypeOf(Popper)).call.apply(_ref, [this].concat(args))), _this), _this.state = {}, _this._setArrowNode = function (node) {
      _this._arrowNode = node;
    }, _this._getTargetNode = function () {
      return _this.context.popperManager.getTargetNode();
    }, _this._getOffsets = function (data) {
      return Object.keys(data.offsets).map(function (key) {
        return data.offsets[key];
      });
    }, _this._isDataDirty = function (data) {
      if (_this.state.data) {
        return JSON.stringify(_this._getOffsets(_this.state.data)) !== JSON.stringify(_this._getOffsets(data));
      } else {
        return true;
      }
    }, _this._updateStateModifier = {
      enabled: true,
      order: 900,
      fn: function fn(data) {
        if (_this._isDataDirty(data)) {
          _this.setState({ data: data });
        }
        return data;
      }
    }, _this._getPopperStyle = function () {
      var data = _this.state.data;

      // If Popper isn't instantiated, hide the popperElement
      // to avoid flash of unstyled content

      if (!_this._popper || !data) {
        return {
          position: 'absolute',
          pointerEvents: 'none',
          opacity: 0
        };
      }

      var _data$offsets$popper = data.offsets.popper,
          top = _data$offsets$popper.top,
          left = _data$offsets$popper.left,
          position = _data$offsets$popper.position;


      return _extends({
        position: position
      }, data.styles);
    }, _this._getPopperPlacement = function () {
      return !!_this.state.data ? _this.state.data.placement : undefined;
    }, _this._getPopperHide = function () {
      return !!_this.state.data && _this.state.data.hide ? '' : undefined;
    }, _this._getArrowStyle = function () {
      if (!_this.state.data || !_this.state.data.offsets.arrow) {
        return {};
      } else {
        var _this$state$data$offs = _this.state.data.offsets.arrow,
            top = _this$state$data$offs.top,
            left = _this$state$data$offs.left;

        return { top: top, left: left };
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Popper, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        popper: {
          setArrowNode: this._setArrowNode,
          getArrowStyle: this._getArrowStyle
        }
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._updatePopper();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(lastProps) {
      if (lastProps.placement !== this.props.placement || lastProps.eventsEnabled !== this.props.eventsEnabled) {
        this._updatePopper();
      }

      if (this._popper && lastProps.children !== this.props.children) {
        this._popper.scheduleUpdate();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._destroyPopper();
    }
  }, {
    key: '_updatePopper',
    value: function _updatePopper() {
      this._destroyPopper();
      if (this._node) {
        this._createPopper();
      }
    }
  }, {
    key: '_createPopper',
    value: function _createPopper() {
      var _props = this.props,
          placement = _props.placement,
          eventsEnabled = _props.eventsEnabled;

      var modifiers = _extends({}, this.props.modifiers, {
        applyStyle: { enabled: false },
        updateState: this._updateStateModifier
      });

      if (this._arrowNode) {
        modifiers.arrow = {
          element: this._arrowNode
        };
      }

      this._popper = new _popper2.default(this._getTargetNode(), this._node, {
        placement: placement,
        eventsEnabled: eventsEnabled,
        modifiers: modifiers
      });

      // schedule an update to make sure everything gets positioned correct
      // after being instantiated
      this._popper.scheduleUpdate();
    }
  }, {
    key: '_destroyPopper',
    value: function _destroyPopper() {
      if (this._popper) {
        this._popper.destroy();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          component = _props2.component,
          innerRef = _props2.innerRef,
          placement = _props2.placement,
          eventsEnabled = _props2.eventsEnabled,
          modifiers = _props2.modifiers,
          children = _props2.children,
          restProps = _objectWithoutProperties(_props2, ['component', 'innerRef', 'placement', 'eventsEnabled', 'modifiers', 'children']);

      var popperRef = function popperRef(node) {
        _this2._node = node;
        if (typeof innerRef === 'function') {
          innerRef(node);
        }
      };
      var popperStyle = this._getPopperStyle();
      var popperPlacement = this._getPopperPlacement();
      var popperHide = this._getPopperHide();

      if (typeof children === 'function') {
        var _popperProps;

        var popperProps = (_popperProps = {
          ref: popperRef,
          style: popperStyle
        }, _defineProperty(_popperProps, 'data-placement', popperPlacement), _defineProperty(_popperProps, 'data-x-out-of-boundaries', popperHide), _popperProps);
        return children({
          popperProps: popperProps,
          restProps: restProps,
          scheduleUpdate: this._popper && this._popper.scheduleUpdate
        });
      }

      var componentProps = _extends({}, restProps, {
        style: _extends({}, restProps.style, popperStyle),
        'data-placement': popperPlacement,
        'data-x-out-of-boundaries': popperHide
      });

      if (typeof component === 'string') {
        componentProps.ref = popperRef;
      } else {
        componentProps.innerRef = popperRef;
      }

      return (0, React.createElement)(component, componentProps, children);
    }
  }]);

  return Popper;
}(React.Component);

Popper.contextTypes = {
  popperManager: _propTypes2.default.object.isRequired
};
Popper.childContextTypes = {
  popper: _propTypes2.default.object.isRequired
};
Popper.propTypes = {
  component: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func]),
  innerRef: _propTypes2.default.func,
  placement: _propTypes2.default.oneOf(_popper2.default.placements),
  eventsEnabled: _propTypes2.default.bool,
  modifiers: _propTypes2.default.object,
  children: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func])
};
Popper.defaultProps = {
  component: 'div',
  placement: 'bottom',
  eventsEnabled: true,
  modifiers: {}
};
exports.default = Popper;
});

unwrapExports(Popper_1);

var Arrow_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



var _react2 = _interopRequireDefault(React);



var _propTypes2 = _interopRequireDefault(propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Arrow = function Arrow(props, context) {
  var _props$component = props.component,
      component = _props$component === undefined ? 'span' : _props$component,
      innerRef = props.innerRef,
      children = props.children,
      restProps = _objectWithoutProperties(props, ['component', 'innerRef', 'children']);

  var popper = context.popper;

  var arrowRef = function arrowRef(node) {
    popper.setArrowNode(node);
    if (typeof innerRef === 'function') {
      innerRef(node);
    }
  };
  var arrowStyle = popper.getArrowStyle();

  if (typeof children === 'function') {
    var arrowProps = {
      ref: arrowRef,
      style: arrowStyle
    };
    return children({ arrowProps: arrowProps, restProps: restProps });
  }

  var componentProps = _extends({}, restProps, {
    style: _extends({}, arrowStyle, restProps.style)
  });

  if (typeof component === 'string') {
    componentProps.ref = arrowRef;
  } else {
    componentProps.innerRef = arrowRef;
  }

  return (0, React.createElement)(component, componentProps, children);
};

Arrow.contextTypes = {
  popper: _propTypes2.default.object.isRequired
};

Arrow.propTypes = {
  component: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func]),
  innerRef: _propTypes2.default.func,
  children: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func])
};

exports.default = Arrow;
});

unwrapExports(Arrow_1);

var reactPopper = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Arrow = exports.Popper = exports.Target = exports.Manager = undefined;



var _Manager3 = _interopRequireDefault(Manager_1);



var _Target3 = _interopRequireDefault(Target_1);



var _Popper3 = _interopRequireDefault(Popper_1);



var _Arrow3 = _interopRequireDefault(Arrow_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Manager = _Manager3.default;
exports.Target = _Target3.default;
exports.Popper = _Popper3.default;
exports.Arrow = _Arrow3.default;
});

unwrapExports(reactPopper);
var reactPopper_1 = reactPopper.Arrow;
var reactPopper_2 = reactPopper.Popper;
var reactPopper_3 = reactPopper.Target;
var reactPopper_4 = reactPopper.Manager;

var randomID = createCommonjsModule(function (module) {
(function(){
	var randomID = function(len,pattern){
		var possibilities = ["abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ", "0123456789", "~!@#$%^&()_+-={}[];\',"];
		var chars = "";

		var pattern = pattern ? pattern : "aA0";
		pattern.split('').forEach(function(a){
			if(!isNaN(parseInt(a))){
				chars += possibilities[2];
			}else if(/[a-z]/.test(a)){
				chars += possibilities[0];
			}else if(/[A-Z]/.test(a)){
				chars += possibilities[1];
			}else{
				chars += possibilities[3];
			}
		});
		
		var len = len ? len : 30;

		var result = '';

		while(len--){ 
			result += chars.charAt(Math.floor(Math.random() * chars.length)); 
		}

		return result;
	};

	if('object' !== "undefined" && typeof commonjsRequire !== "undefined"){
		module.exports = randomID;
	} else {
		window["randomID"] = randomID;
	}

})();
});

var jsx = function () {
  var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7;
  return function createRawReactElement(type, props, key, children) {
    var defaultProps = type && type.defaultProps;
    var childrenLength = arguments.length - 3;

    if (!props && childrenLength !== 0) {
      props = {};
    }

    if (props && defaultProps) {
      for (var propName in defaultProps) {
        if (props[propName] === void 0) {
          props[propName] = defaultProps[propName];
        }
      }
    } else if (!props) {
      props = defaultProps || {};
    }

    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);

      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 3];
      }

      props.children = childArray;
    }

    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type: type,
      key: key === undefined ? null : '' + key,
      ref: null,
      props: props,
      _owner: null
    };
  };
}();



var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck$1 = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass$1 = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends$1 = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var _ref3 = jsx("feGaussianBlur", {
  "in": "SourceAlpha",
  stdDeviation: 3
});

var _ref4 = jsx("feOffset", {
  dx: 7,
  dy: 1,
  result: "offsetblur"
});

var _ref5 = jsx("feComponentTransfer", {}, void 0, jsx("feFuncA", {
  type: "linear",
  slope: "0.2"
}));

var _ref6 = jsx("feMerge", {}, void 0, jsx("feMergeNode", {}), jsx("feMergeNode", {
  "in": "SourceGraphic"
}));

var ArrowComponent = function (_React$Component) {
  inherits(ArrowComponent, _React$Component);

  function ArrowComponent() {
    classCallCheck$1(this, ArrowComponent);

    var _this = possibleConstructorReturn(this, (ArrowComponent.__proto__ || Object.getPrototypeOf(ArrowComponent)).call(this));

    _this.id = randomID(19, "a");
    return _this;
  }

  createClass$1(ArrowComponent, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          dataPlacement = _props.dataPlacement,
          customArrow = _props.customArrow;
      var id = this.id;

      var _ref2 = jsx("defs", {
        xmlns: "http://www.w3.org/2000/svg"
      }, void 0, jsx("filter", {
        id: id,
        height: "130%"
      }, void 0, _ref3, _ref4, _ref5, _ref6));

      return jsx(reactPopper_1, {}, void 0, function (_ref) {
        var arrowProps = _ref.arrowProps;

        arrowProps.style.position = "absolute";
        if (/right/gi.test(dataPlacement)) {
          arrowProps.style.transform = "rotate(-180deg)";
          arrowProps.style.left = "-19px";
        } else if (/bottom/gi.test(dataPlacement)) {
          arrowProps.style.transform = "rotate(-90deg)";
          arrowProps.style.top = "-20px";
        } else if (/top/gi.test(dataPlacement)) {
          arrowProps.style.transform = "rotate(90deg)";
          arrowProps.style.bottom = "-21px";
        } else if (/left/gi.test(dataPlacement)) {
          arrowProps.style.right = "-19px";
        }

        return customArrow ? React.createElement(
          "span",
          arrowProps,
          customArrow
        ) : React.createElement(
          "span",
          arrowProps,
          jsx("svg", {
            xmlnsXlink: "http://www.w3.org/1999/xlink",
            viewBox: "0 0 100 100",
            version: "1.1",
            x: "0px",
            y: "0px",
            width: 30,
            height: 30
          }, void 0, _ref2, jsx("polygon", {
            filter: "url(#" + id + ")",
            points: "36 23 64 55 36 80",
            fill: "#fff",
            fillRule: "evenodd"
          }))
        );
      });
    }
  }]);
  return ArrowComponent;
}(React.Component);

var PopoverComponent = function (_React$Component) {
  inherits(PopoverComponent, _React$Component);

  function PopoverComponent(props) {
    classCallCheck$1(this, PopoverComponent);

    var _this = possibleConstructorReturn(this, (PopoverComponent.__proto__ || Object.getPrototypeOf(PopoverComponent)).call(this, props));

    _this.click = _this.click.bind(_this);
    _this.onMouseOver = _this.onMouseOver.bind(_this);
    _this.closePopoverOnMouseLeave = _this.closePopoverOnMouseLeave.bind(_this);
    return _this;
  }

  createClass$1(PopoverComponent, [{
    key: "closePopoverOnMouseLeave",
    value: function closePopoverOnMouseLeave(e) {
      e.preventDefault();
      this.props.onClosePopover();
    }
  }, {
    key: "click",
    value: function click(e) {
      var thispopover = this.refs.popover._node;
      var close = e.target.closest(".popover-content");
      if (!close) {
        this.props.onClosePopover();
      } else {
        var child_popover = thispopover.querySelector(".popover-content");
        if (!child_popover) {
          if (close.getAttribute("data-id") != thispopover.getAttribute("data-id")) {
            this.props.onClosePopover();
          }
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _props = this.props,
          action = _props.action,
          onClose = _props.onClose;

      if (action === "click") {
        document.removeEventListener("click", this.click, false);
      } else if (action === "hover") {
        document.removeEventListener("mouseover", this.onMouseOver, false);
        this.refs.popover._node.removeEventListener("mouseleave", this.closePopoverOnMouseLeave, false);
      }

      if (onClose) onClose();
    }
  }, {
    key: "onMouseOver",
    value: function onMouseOver(e) {
      var popover = this.refs.popover._node;
      var child = popover.querySelector(".popover-content");
      if (!child) {
        popover.addEventListener("mouseleave", this.closePopoverOnMouseLeave, false);
      }
      if (!e.target.closest(".manager")) {
        this.props.onClosePopover();
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _props2 = this.props,
          action = _props2.action,
          onOpen = _props2.onOpen;

      if (action === "click") {
        document.addEventListener("click", this.click, false);
      } else if (action === "hover") {
        document.addEventListener("mouseover", this.onMouseOver, false);
      }

      if (onOpen) onOpen();
    }
  }, {
    key: "render",
    value: function render() {
      var _props3 = this.props,
          placement = _props3.placement,
          modifiers = _props3.modifiers,
          arrow = _props3.arrow,
          className = _props3.className,
          motion = _props3.motion,
          id = _props3.id,
          customArrow = _props3.customArrow,
          children = _props3.children;


      return React.createElement(
        reactPopper_2,
        { placement: placement, modifiers: modifiers, ref: "popover" },
        function (_ref) {
          var popperProps = _ref.popperProps;

          popperProps.className = "popover-content";
          if (arrow) {
            if (popperProps["data-placement"]) {
              popperProps.className = "popover-content rap-" + popperProps["data-placement"].split("-")[0];
            }
          }
          if (className) {
            popperProps.className += " " + className;
          }

          popperProps.style.width = '250px';

          if (motion) {
            var ArrowCallback = arrow ? jsx(ArrowComponent, {
              customArrow: customArrow,
              dataPlacement: popperProps["data-placement"]
            }) : null;
            return children[1]({ "data-id": id }, popperProps, ArrowCallback);
          } else {
            return React.createElement(
              "div",
              _extends$1({}, popperProps, { "data-id": id }),
              jsx("div", {}, void 0, children[1], arrow ? jsx(ArrowComponent, {
                customArrow: customArrow,
                dataPlacement: popperProps["data-placement"]
              }) : null)
            );
          }
        }
      );
    }
  }]);
  return PopoverComponent;
}(React.Component);

var TargetComponent = function (_React$Component) {
  inherits(TargetComponent, _React$Component);

  function TargetComponent(props) {
    classCallCheck$1(this, TargetComponent);

    var _this = possibleConstructorReturn(this, (TargetComponent.__proto__ || Object.getPrototypeOf(TargetComponent)).call(this, props));

    _this.click = _this.click.bind(_this);
    _this.onMouseEnter = _this.onMouseEnter.bind(_this);
    _this.onMouseLeave = _this.onMouseLeave.bind(_this);
    return _this;
  }

  createClass$1(TargetComponent, [{
    key: "onMouseLeave",
    value: function onMouseLeave(e) {
      var getElement = e.relatedTarget;
      if (getElement && getElement.nodeName) {
        var close = getElement.closest(".manager");
        if (close) {
          var hasDataId = close.hasAttribute("data-target-id");
          if (hasDataId) {
            var getDataId = close.getAttribute("data-target-id");
            if (getDataId) {
              if (getDataId != this.props.id) this.props.closePopover();
            }
          }
        }
      }
    }
  }, {
    key: "onMouseEnter",
    value: function onMouseEnter() {
      this.props.openPopover();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var action = this.props.action;

      var target = ReactDOM.findDOMNode(this);
      this.target = target;
      if (action === "click") {
        target.addEventListener("click", this.click, false);
      } else if (action === "hover") {
        target.addEventListener("mouseenter", this.onMouseEnter, false);
        target.addEventListener("mouseleave", this.onMouseLeave, false);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _props = this.props,
          action = _props.action;

      if (action === "click") {
        this.target.removeEventListener("click", this.click, false);
      } else if (action === "hover") {
        this.target.removeEventListener("mouseenter", this.onMouseEnter, false);
        this.target.removeEventListener("mouseleave", this.onMouseLeave, false);
      }
    }
  }, {
    key: "click",
    value: function click(e) {
      e.stopImmediatePropagation();
      if (!e.target.nextSibling) this.props.tooglePopover();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return jsx(reactPopper_3, {}, void 0, function (_ref) {
        var targetProps = _ref.targetProps;
        return React.createElement(
          "div",
          _extends$1({ className: "target-container" }, targetProps),
          _this2.props.children
        );
      });
    }
  }]);
  return TargetComponent;
}(React.Component);

function closestWebshim() {
  if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest = function (s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i,
          el = this;
      do {
        i = matches.length;
        while (--i >= 0 && matches.item(i) !== el) {}
      } while (i < 0 && (el = el.parentElement));
      return el;
    };
  }
}

var Popover$1 = function (_React$Component) {
  inherits(Popover, _React$Component);

  function Popover(props) {
    classCallCheck$1(this, Popover);

    var _this = possibleConstructorReturn(this, (Popover.__proto__ || Object.getPrototypeOf(Popover)).call(this, props));

    _this.closePopover = _this.closePopover.bind(_this);
    _this.tooglePopover = _this.tooglePopover.bind(_this);
    _this.openPopover = _this.openPopover.bind(_this);
    _this.state = { isOpen: props.defaultIsOpen, id: randomID(10, "a") };
    return _this;
  }

  createClass$1(Popover, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      closestWebshim();
    }
  }, {
    key: "openPopover",
    value: function openPopover() {
      this.setState({ isOpen: true });
    }
  }, {
    key: "tooglePopover",
    value: function tooglePopover() {
      this.setState({ isOpen: !this.state.isOpen });
    }
  }, {
    key: "closePopover",
    value: function closePopover() {
      this.setState({ isOpen: false });
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(_ref) {
      var open = _ref.open;

      this.setState({ isOpen: open });
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          className = _props.className,
          onClose = _props.onClose,
          onOpen = _props.onOpen,
          customArrow = _props.customArrow,
          arrow = _props.arrow,
          onClick = _props.onClick,
          placement = _props.placement,
          modifiers = _props.modifiers,
          render = _props.render,
          action = _props.action,
          motion = _props.motion,
          children = _props.children;


      return jsx(reactPopper_4, {
        className: "manager",
        style: { display: "inline" },
        "data-target-id": this.state.id
      }, void 0, jsx(TargetComponent, {
        id: this.state.id,
        closePopover: this.closePopover,
        openPopover: this.openPopover,
        tooglePopover: this.tooglePopover,
        action: action
      }, void 0, children[0]), this.state.isOpen ? React.createElement(PopoverComponent, _extends$1({
        key: Math.random(1),
        motion: motion,
        className: className,
        onClose: onClose,
        onOpen: onOpen,
        customArrow: customArrow,
        onClosePopover: this.closePopover,
        placement: placement,
        modifiers: modifiers
      }, this.props, {
        id: this.state.id
      })) : null);
    }
  }]);
  return Popover;
}(React.Component);

Popover$1.defaultProps = {
  arrow: true,
  placement: "auto",
  action: "click",
  modifiers: {},
  motion: false,
  className: undefined,
  defaultIsOpen: false,
  open: false
};

return Popover$1;

})));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"react":"react","react-dom":"react-dom"}],"Form":[function(require,module,exports){
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
			React.createElement(FormPanel, {cmpId: cmpId, formInfo: json, formMode: formMode, isShowErrMsg: isShowErrMsg, callMe: cb}), 
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

},{"./components/CommonMixin":4,"./components/FormPanel":9,"react":"react","react-dom":"react-dom"}]},{},[]);
