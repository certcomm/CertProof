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
			
			return <div key={"c1"+index} className={"float-left margin-right "+(index == 1 ? me.props.elComponent.optionValClsName : "")}>
				<div key={"c2"+index} className={clsName+" float-left form-field-label"}>
					<label key={"c3"+index} name={me.props.elComponent.name[index]+"-label"} className={"r-form-el-label " + ((me.props.clsName)?me.props.clsName:"")} style={me.props.elComponent.labelStyle}>
						{me.props.elComponent.label}<b>:</b>
						<span key={"c4"+index} className="required-sign">
							{(me.props.elComponent.validator)?((me.props.elComponent.validator.isRequired)? "*": ""):""}
						</span>
					</label>
				</div>
				<div key={"c5"+index} className="float-left form-field">
					<input 
						key={"c5"+index}
						type="text"
						className={"r-form-text "+ ((me.props.elComponent.clsName)?me.props.elComponent.clsName:"")}
						style={(me.props.elComponent.style)?me.props.elComponent.style:{}}
						ref={me.props.elComponent.name[index]}
						name={me.props.elComponent.name[index]}
						placeholder={me.props.elComponent.placeHolder}
						defaultValue={me.props.elComponent.value[index]}
						onChange={me.onChange}
						onBlur={me.onBlur}
						onClick={me.onChange}
					/>
				</div>
			</div>
		});
		
		return(
			<div className={"form-element-box choice-wrapper float-left clear "+this.props.elComponent.ctClsName} data-json={JSON.stringify(this.props.elComponent)}>
				{optionChoiceItems}
				{}
				<div name={me.props.elComponent.name[0]+"_errorMsg"} className={me.props.elComponent.name[0]+"_errorMsg error-message"}></div>
				<div name={me.props.elComponent.name[1]+"_errorMsg"} className={me.props.elComponent.name[1]+"_errorMsg error-message"}></div>
			</div>
		)
	}
});

module.exports = ChoiceOption;

