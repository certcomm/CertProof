var React = require('react');
var createReactClass = require('create-react-class');

//	create label field
var LabelArea = createReactClass({
	render: function() {
		return(
			<div className={"form-element-box "+this.props.elComponent.ctClsName} data-json={JSON.stringify(this.props.elComponent)}>
				<label style={this.props.elComponent.labelStyle} id={this.props.elComponent.id} className={"r-information-label "+ ((this.props.elComponent.clsName)? this.props.elComponent.clsName: "")}>
					<span>{this.props.elComponent.label}</span>
					<input type="hidden" name={this.props.elComponent.name} value={this.props.elComponent.label} />
				</label>
			</div>
		)
	}
});

module.exports = LabelArea;