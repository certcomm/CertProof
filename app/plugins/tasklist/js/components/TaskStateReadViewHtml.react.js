var React = require('react');
var createReactClass = require('create-react-class');
var TaskStateReadViewHtml = createReactClass({
	render: function() {
		var state = this.props.taskState;
		var html = '';
		switch(state){
			case 'Accepted':
				html = <span data-state="Accepted" className="state-actions taskState accepted readView">Accepted</span>;
			break;
			case 'Unstarted':
				html = <span data-state="Unstarted" className="state-actions taskState start btn btn-info readView" data-title='disabled-button'>Start</span>;
			break;
			case 'Started':
				html = <span data-state="Started" className="state-actions taskState start btn btn-info readView" data-title='disabled-button'>Finish</span>;
			break;
			case 'Finished':
				html = <span data-state="Finished" className="state-actions taskState delivered btn btn-info readView" data-title='disabled-button'>Deliver</span>;
			break;
			case 'Delivered':
				html = <span data-state="Delivered" className="state-actions"><span className="taskState delivered btn btn-success readView" data-title='disabled-button'>Accept</span><span className="taskState rejected btn btn-danger" data-title='disabled-button'>Reject</span></span>;
			break;
			case 'Rejected':
				html = <span data-state="Rejected" className="state-actions taskState rejected btn btn-info readView" data-title='disabled-button'>ReStart</span>;
			break;
			case 'NoLongerApplicable':
				html = <span data-state="NoLongerApplicable" className="state-actions taskState btn noLonger pull-right" title="No Longer Applicable">No Longer Appl.</span>;
			break;
			default:
			
			break;
		}		
		return (
			<div style={{position: "relative"}}>
				{html}
			</div>
		)
	}
});
module.exports = TaskStateReadViewHtml;