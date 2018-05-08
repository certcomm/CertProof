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
			var disabledSpanEl = <span className='disabled-span'></span>;
		else
			var disabledSpanEl = "";
		
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
				<div className="float-left form-field">
					{disabledSpanEl}
					<input 
						id={this.props.elComponent.id}
						type="text"
						maxLength="80"
						className={"r-form-text "+ ((this.props.elComponent.clsName)?this.props.elComponent.clsName:"")}
						style={(this.props.elComponent.style)?this.props.elComponent.style:{}}
						ref={this.props.elComponent.name}
						name={this.props.elComponent.name}
						placeholder={this.props.elComponent.placeHolder}
						disabled={(this.props.elComponent.disabled) ? this.props.elComponent.disabled : false} 
						defaultValue={fieldValue}
						onChange={this.onChange}
						onBlur={this.onBlur}
						onClick={this.onChange}
					/>
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

module.exports = TextBox;

