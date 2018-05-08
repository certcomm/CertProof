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
			return <label key={Math.random()} className={"r-form-action-button-label-box "+((val.clsName) ? val.clsName : "")}>
				<input 
					key={Math.random()} 
					type="radio" 
					className={"r-form-action-button "+ ((val.clsName) ? val.clsName : "")}
					ref={actionButtonName} 
					rel={me.props.cmpId} 
					name={actionButtonName} 
					value={val.value} 
					onChange={me.onChange} 
					defaultChecked={(fieldValue == val.value) ? true : false} 
				/>
				<span style={nnewStyle} className={"r-form-action-button-span "+stateClrCls+" "+editModeCheckedCls} name={actionButtonName+"-"+index}>{" "+stateTitleVal}</span>
				<div key={Math.random()} className="hidden" name={actionButtonName+"-"+index+"_stateTitle"} value={val.stateTitle} title={val.label}></div>
			</label>
		});
		
		var hoverTitle = diffData == '' ? "No Value" : diffData;
		
		//	label hidden if blank
		if(this.props.elComponent.label == ""){ var clsName="hidden"; }else{ var clsName=""; }
		
		this.props.elComponent.maxOptionNumber = (this.props.elComponent.maxOptionNumber) ? this.props.elComponent.maxOptionNumber : this.props.elComponent.elements.length;
		return(
			<div className={diffDataCls+" form-element-box float-left "+this.props.elComponent.ctClsName} data-json={JSON.stringify(this.props.elComponent)}>
				<div className={clsName+" float-left form-field-label"}>
					<label name={this.props.elComponent.name+"-label"} className={"r-form-el-label " + ((this.props.clsName)?this.props.clsName:"")} style={this.props.elComponent.labelStyle}>
						<span>{this.props.elComponent.label}</span><b>:</b>
						<span className="required-sign">
							{(this.props.elComponent.validator)?((this.props.elComponent.validator.isRequired)? "*": ""):""}
						</span>
					</label>
				</div>
				<div className={"float-left form-field"}>
					{actionButtonItems}
					{}
					<br />
					<div name={this.props.elComponent.name+"_errorMsg"} className={this.props.elComponent.name+"_errorMsg error-message"}></div>
				</div>
				<span className={diffDataIconCls} alt={diffData} title={diffData}></span>
				{}
			</div>
		)
	}
});

module.exports = ActionButton;