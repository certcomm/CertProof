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
			<FormPanel cmpId={id} formInfo={json} formMode={mode} isShowErrMsg={isShowErrMsg} callMe={cb} />,
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
										<FieldAttributesElements fieldProp={true} cmpId={cmpId} dataJson={JSON.stringify(dataJson)} formMode="edit" formInfo={formInfo} />, document.getElementById("tabs-content-panel-1")
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

