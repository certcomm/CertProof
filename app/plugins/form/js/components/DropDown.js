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
			
			return <option name={me.props.elComponent.name+"-"+index} key={Math.random()} value={val.value}>{val.label}</option>
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
				<div className="float-left form-field">
					<select 
						defaultValue = {fieldValue}
						id={this.props.elComponent.id}
						type="dropdown"
						className={"r-form-drop-down "+ ((this.props.elComponent.clsName)?this.props.elComponent.clsName:"")}
						style={(this.props.elComponent.style)?this.props.elComponent.style:{}}
						ref={this.props.elComponent.name}
						name={this.props.elComponent.name}
						onChange={this.onChange}
						onBlur={this.onChange}
						onClick={this.onChange}
					>
					{dropDownItems}
					</select>
					<br />
					<div name={this.props.elComponent.name+"_errorMsg"} className={this.props.elComponent.name+"_errorMsg error-message"}></div>
				</div>
				<span className={diffDataIconCls} alt={diffData} title={diffData}></span>
				{}
			</div>
		)
	}
});

module.exports = DropDown;