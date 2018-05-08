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
			<div className={"form-element-box float-left "+this.props.elComponent.ctClsName} data-json={JSON.stringify(this.props.elComponent)}>
				<div className="float-left form-field form-field-divider">
					<hr 
						id={this.props.elComponent.id}
						className={"r-form-divider "+ ((this.props.elComponent.clsName)?this.props.elComponent.clsName:"")}
						style={(this.props.elComponent.style)?this.props.elComponent.style:{}}
						ref={this.props.elComponent.name}
						name={this.props.elComponent.name}
					/>
					<input type="hidden" name={this.props.elComponent.name} />
				</div>
			</div>
		)
	}
});

module.exports = Divider;