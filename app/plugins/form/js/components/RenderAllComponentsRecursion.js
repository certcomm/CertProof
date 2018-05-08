var React = require('react');
var createReactClass = require('create-react-class');

//	render all components recursion loop
var RenderAllComponentsRecursion = createReactClass({
	render: function() {
		var me = this; 
		
		val = this.props.elStructure;
		formData = this.props.elData;
		formDiffData = this.props.elDiffData;
		cmpId = this.props.cmpId;
		
		if(val.etype == "fieldset"){
			var subElHtml = val.elements.map(function(val) {
				if(val.etype == "fieldset"){
					return <div key={Math.random()}><RenderAllComponentsRecursion formModeVal={me.props.formModeVal} cmpId={cmpId} elStructure={val} elData={formData} elDiffData={formDiffData} /></div>
				}else{
					return <div key={Math.random()}><SwitchComponent formModeVal={me.props.formModeVal} cmpId={cmpId} elComponentArr={val} elData={formData} elDiffData={formDiffData} /></div>
				}
			});
			
			return <FieldSet clsName={val.clsName} style={val.style} title={val.title} innerElements={subElHtml} />
		}else{
			return <SwitchComponent formModeVal={this.props.formModeVal} cmpId={cmpId} elComponentArr={val} elData={formData} elDiffData={formDiffData} />
		}
	}
});

module.exports = RenderAllComponentsRecursion;

var SwitchComponent = require('./SwitchComponent');
var FieldSet = require('./FieldSet');