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
			var disabledSpanEl = <span className='disabled-span'></span>;
		else
			var disabledSpanEl = <span className='disabled-span' style={ {width: '130px'} }></span>;
		
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
						className={"r-form-text "+ ((this.props.elComponent.clsName)?this.props.elComponent.clsName:"")}
						style={(this.props.elComponent.style)?this.props.elComponent.style:{}}
						ref={this.props.elComponent.name}
						name={this.props.elComponent.name}
						placeholder={this.props.elComponent.placeHolder}
						readOnly={true}
						defaultValue={fieldValue}
						onChange={this.onChange}
						onBlur={this.onBlur}
						onClick={this.onChange}
					/>
					<br />
					<div name={this.props.elComponent.name+"_errorMsg"} className={this.props.elComponent.name+"_errorMsg error-message"}></div>
				</div>
				<span className={diffDataIconCls} alt={diffData} title={diffData}></span>
				{}
			</div>
		)
	}
});

module.exports = DatePicker;