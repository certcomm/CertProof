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
				
				return <div className={elContainerCls+" "+dvdrClass} key={Math.random()}>
							<div className={sortCls}></div>
							<RenderAllComponentsRecursion formModeVal={formMode} cmpId={cmpId} elStructure={val} elData={formData} elDiffData={formDiffData} />
							<div className={removeCls}></div>
						</div>
			});
			
			elHtml = <FieldSet style={{ border: "none" }} legStyle={{ display: "none"}} innerElements={elHtml} elMode={formMode} />
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
			
			mainHtml = <form 
							id={this.props.formInfo.formStructure.id}
							style={cloneFrmSttyle}
							name={this.props.formInfo.formStructure.name}
							data-mode={this.props.formInfo.infoToSubmit}
							className={"formInfomation "+this.props.formInfo.formStructure.clsName}
							data-json={JSON.stringify(this.props.formInfo.formStructure)} 
						>
							<h2 name="formTitleToolBoxProp-h2">{this.props.formInfo.formStructure.frmTitle}</h2>
							<p style={ frmDescStyle } name="formDescToolBoxProp-p">{this.props.formInfo.formStructure.frmDescription}</p>
							
							<input type="hidden" name="field-is-show-errrr-mssg" id="isShowErrMsg" defaultValue={isShowErrMsg} />
							<input type="hidden" name="field-0" id="formJsonData" defaultValue="" />
							<input type="hidden" name="no-field" id="changeableFieldName" defaultValue="" />
							<div name="common_alert_popup" className="common_alert_popup"></div>
							<div className="clear"></div>
							{elHtml}
						</form>
		}
		
		return <div style={{backgroundColor: "F3F3F3"}} className={editFormCls+" perfect-scrollbar"}>
			<div className="main-react-form-container"> 
				{}
				<div className="fr">
					<div name="common_errorMsg" className="common_errorMsg error-message"></div>
					<a name="show_error_fields" className={hideErrField+" preview-error-field-link"} rel="show"> - Show Error Fields</a>
				</div>
				<div className="clear"></div>
				{mainHtml}
			</div>
		</div>;
	}
});

module.exports = FormPanel;

var RenderAllComponentsRecursion = require('./RenderAllComponentsRecursion');
var FieldSet = require('./FieldSet');