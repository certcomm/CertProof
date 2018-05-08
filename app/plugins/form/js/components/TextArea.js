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
					<textarea 
						id={this.props.elComponent.id}
						type="textarea"
						className={"r-form-text-area "+ ((this.props.elComponent.clsName)?this.props.elComponent.clsName:"")}
						style={(this.props.elComponent.style)?this.props.elComponent.style:{}}
						ref={this.props.elComponent.name}
						name={this.props.elComponent.name}
						placeholder={this.props.elComponent.placeHolder}
						rows={ (this.props.elComponent.initialVisibleLinesVal) ? this.props.elComponent.initialVisibleLinesVal : 3 }
						data-min-rows={ (this.props.elComponent.initialVisibleLinesVal) ? this.props.elComponent.initialVisibleLinesVal : 3 }
						data-max-rows={this.props.elComponent.maxVisibleLinesVal}
						disabled={(this.props.elComponent.disabled) ? this.props.elComponent.disabled : false} 
						defaultValue={fieldValue}
						onChange={this.onChange}
						onBlur={this.onChange}
						onClick={this.onChange}
					></textarea>
					<br />
					<div name={this.props.elComponent.name+"_errorMsg"} className={this.props.elComponent.name+"_errorMsg error-message"}></div>
				</div>
				<span className={diffDataIconCls} alt={diffData} title={diffData}></span>
				{}
			</div>
		)
	}
});

module.exports = TextArea;