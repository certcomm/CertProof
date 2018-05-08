var React = require('react');
var createReactClass = require('create-react-class');

//	create fieldSet
var FieldSet = createReactClass({
	render: function() {
		//	first field set always be hidden
		
		return <fieldset style={this.props.style} className={"r-fieldset " + ((this.props.clsName)?this.props.clsName:"")}>
					<legend style={(this.props.style)? {display: "none"}: {}}>{this.props.title}:</legend>
					<div className="sortable">
						{this.props.innerElements}
					</div>
				</fieldset>
		}
});

module.exports = FieldSet;