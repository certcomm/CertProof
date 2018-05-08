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
				return <LabelArea formModeVal={formModeVal} elComponent={val} elData={formData} elDiffData={formDiffData} />
			break;
			case "textbox":
				return <TextBox formModeVal={formModeVal} cmpId={cmpId} elComponent={val} elData={formData} elDiffData={formDiffData} />
			break;
			case "textarea":
				return <TextArea formModeVal={formModeVal} cmpId={cmpId} elComponent={val} elData={formData} elDiffData={formDiffData} />
			break;
			case "dropdown":
				return <DropDown formModeVal={formModeVal} cmpId={cmpId} elComponent={val} elData={formData} elDiffData={formDiffData} />
			break;
			case "radio":
				return <RadioButton formModeVal={formModeVal} cmpId={cmpId} elComponent={val} elData={formData} elDiffData={formDiffData} />
			break;
			case "checkbox":
				return <CheckBox formModeVal={formModeVal} cmpId={cmpId} elComponent={val} elData={formData} elDiffData={formDiffData} />
			break;
			case "scheckbox":
				return <ScheckBox formModeVal={formModeVal} cmpId={cmpId} elComponent={val} elData={formData} elDiffData={formDiffData} />
			break;
			case "actionbutton":
				return <ActionButton formModeVal={formModeVal} cmpId={cmpId} elComponent={val} elData={formData} elDiffData={formDiffData} />
			break;
			case "datepicker":
				return <DatePicker formModeVal={formModeVal} cmpId={cmpId} elComponent={val} elData={formData} elDiffData={formDiffData} />
			break;
			case "divider":
				return <Divider formModeVal={formModeVal} cmpId={cmpId} elComponent={val} elData={formData} elDiffData={formDiffData} />
			break;
			case "optionchoice":
				return <ChoiceOption formModeVal={formModeVal} cmpId={cmpId} elComponent={val} elData={formData} elDiffData={formDiffData} />
			break;
			default:
				return <div />
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