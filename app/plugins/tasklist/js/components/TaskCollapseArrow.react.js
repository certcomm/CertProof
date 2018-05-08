var React = require('react');
var createReactClass = require('create-react-class');
var TaskActions = require('../actions/TaskActions');
var TaskStore = require('../stores/TaskStore');
var TaskCollapseArrow = createReactClass({
	getInitialState: function(){
		return ({items: this.props.items, store: this.props.storeId});
	},
	handleClick: function(event) {
		event.preventDefault();
		var me = this;
		var e = '#'+this.props.divId+'_collapse_'+this.props.mode+this.props.items.index;
		var arrowId = '#'+this.props.divId+'-arrow-'+this.props.mode+this.props.items.index;
		if(!($(e).hasClass('in'))){
			//TaskActions.slideTaskAndCheckTitle(e, arrowId);
			TaskActions.slideTaskToggle(this.props.items.index, this.props.storeId, true);
		}else{
			var jsonData = TaskStore.getData(this.props.storeId);
			if(jsonData.taskables[this.props.keyVal].isTitleEmpty) {
				$.alert.open({
					type: 'error',
					content: 'Please enter a task title.',
					callback: function() {
						$('#task-title-' + me.props.items.index).focus();
					}
				});
			}else{
				//TaskActions.slideTaskAndCheckTitle(e, arrowId);
				TaskActions.slideTaskToggle(this.props.items.index, this.props.storeId, false);
			}
		}
	},
	render: function() {
		var me = this;
		var iconClassName = this.props.items.newItem  || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? 'glyphicon glyphicon-chevron-down collapse-i' : 'glyphicon glyphicon-chevron-right collapse-i';
		return (<div className="arrow-icon-outter">
					<a data-toggle="collapse" data-parent="#accordion" href={"#"+this.props.divId+"_collapse_"+ this.props.mode + this.props.items.index} onClick={this.handleClick}>
						<i name={"toggle-tasks-"+this.props.items.index} className={iconClassName} id={this.props.divId+"-arrow-"+this.props.mode + this.props.items.index}></i> 
					</a>
				</div>)
	}
});
module.exports = TaskCollapseArrow;