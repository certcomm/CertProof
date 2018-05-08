var React = require('react');
var createReactClass = require('create-react-class');
var ReactDOM = require('react-dom');
var Popover = require('react-awesome-popover');

var TaskListsCompHeader = require('./TaskListsCompHeader.react');
var TaskStateReadViewHtml = require('./TaskStateReadViewHtml.react');
var Chosen = require('./ReactChosen.react');
var TaskActions = require('../actions/TaskActions');
var WritersActions = require('../actions/WritersActions');
var TaskCollapseArrow = require('./TaskCollapseArrow.react');
var TaskStore = require('../stores/TaskStore');

var isMobile = function() {
	try{
		document.createEvent("TouchEvent"); return true;
	} catch(e){
		return false;
	}
}

var TaskTitle = createReactClass({
	titleUpdated: false,
	getInitialState: function() {
		return ({
			items: this.props.items,
			keyVal: this.props.keyVal,
			mode: this.props.mode,
			storeId: this.props.storeId,
			title: this.props.items.title
		});
	},
	render: function() {
		var state = this.state;
		var isDiffSection = false;
			var titleBaseValue = '';
			if(state.items.diffOpType && state.items.diffOpType == "MODIFIED") {
				if(state.items.baseValue) {
					if(state.items.baseValue.title) {
						isDiffSection = true;
						titleBaseValue = state.items.baseValue.title;
						modifyStateClass = "titleBarDiff";
					}
				}
			}
			
			var diffHtml = null;
			if(isDiffSection) {
				diffHtml = <span className={modifyStateClass} title={titleBaseValue}></span>
				
				}

			return (
				<div className="mb-10 titleBar-outter">
					<div className="hiddenDivTextarea title" style={{padding: "10px 0px"}}>{state.title}</div>
					<textarea defaultValue={state.title} className={state.items.newItem ? "autoAdjust readText titleBar hideIcon" : "autoAdjust readText titleBar"} readOnly></textarea>
					{diffHtml}
				</div>
			)
		}
});

var TaskRequester = createReactClass({
	getInitialState: function(){
		var suggestions = [],
			allWriters = this.props.allWriters,
			currentUserExists = false,
			currentUser = this.props.currentUser,
			requester = this.props.items.requester;
		
		if(Object.keys(allWriters).length > 0){
			allWriters.map(function(val,key) {
				if(requester != val.address){
					if(val.name && val.name != ""){
						suggestions.push({value: val.address, label: val.name});
					}else{
						suggestions.push({value: val.address, label: val.address});
					}
				}
			});
		}
		
		return {
			keyVal: this.props.keyVal,
			storeId: this.props.storeId,
			mode: this.props.mode,
			items: this.props.items,
			requester: requester,
			writers: this.props.writers,
			allWriters: allWriters,
			favWriters: this.props.favWriters,
			suggestions: suggestions
		} 
	},
	componentDidMount: function(){
		//
		var me = this;
		this.state.allWriters.map(function(val, key){
			var imgPath = '';
			if(val.type == 'role' && typeof val.profileImageUri == "undefined") {
				imgPath = '/main/images/role_human.jpg'; 
			} else {
				if(val.profileImageUri && val.profileImageUri != '') {
					imgPath = val.profileImageUri;
				} else {
					imgPath = '/main/images/no_image.jpg';
				}
			}
			if(val.address == me.state.requester && val.initial) {
				var hoverHTML = '<img src="'+imgPath+'" class="hc-pic" />'
							+'<p class="hc-p">'+ (val.name != undefined ? '<b>'+val.name+'</b><br>' : '') + val.address + '</p>';
				$("div[data-title-colps-requester='"+val.address+"'], span[data-title-colps-requester='"+val.address+"']").unbind("click");
				$("div[data-title-colps-requester='"+val.address+"'], span[data-title-colps-requester='"+val.address+"']").hovercard({
					detailsHTML: hoverHTML,
					width: '250',
				   openOnLeft: true
				});
				$("div[data-title-colp-requester='"+val.address+"'], span[data-title-colp-requester='"+val.address+"']").bind("click");
			}
		});
	},
	render: function() {
		var me = this;
		var requester = this.state.requester,
			suggestions = this.state.suggestions,
			length = this.state.writers.length;
		
		if(me.props.mode == 'read' || me.props.mode == 'readSort'){
			var name = "";
			var key = 0;
			if(typeof requester != "undefined" && requester != "") {
				me.state.allWriters.map(function(writer, key) {
					if(writer){
						if(writer.address == requester) {
							name = (writer.name != "") ? writer.name : (writer.initial && writer.initial != "" ? writer.initial : writer.address);
							key = key;
						}
					}
				})
			}
			return (
				<div>
					{
						name == "" ? null : <span className="requesters" data-title-colps-requester={requester} data-title={requester} key={"reqs"+key}><span>{name}</span></span>
					}
				</div>
			);
		} else if(this.props.mode == 'template'){
			return (
					<div className="ReactTags__tags template">
						Cannot be assigned
					</div>);
		}
	}
});
var TaskAssignees = createReactClass({
	updateComponent: false,
	getInitialState: function() {
		var me = this,
			currentUserExists = false,
			suggestions = [],
			allWriters = this.props.allWriters;
			
		var currentUser = this.props.currentUser;
		var assignees = this.props.assignees;
		if(Object.keys(allWriters).length > 0){
			var currentUserExists = false;
			allWriters.map(function(val,key) {
				if(assignees.indexOf(val.address) == -1){
					if(val.name && val.name != ""){
						suggestions.push({value: val.address, label: val.name});
					}else{
						suggestions.push({value: val.address, label: val.address});
					}
				}
			});
		}
		return ({
			mode: this.props.mode,
			assignees: this.props.assignees,
			writers: this.props.writers,
			favWriters: this.props.favWriters,
			allWriters: allWriters,
			storeId: this.props.storeId,
			keyVal: this.props.keyVal,
            suggestions: suggestions
		})
	},
	componentDidMount: function(){
		//
		var me = this;
		this.state.allWriters.map(function(val, key){
			var imgPath = '';
			if(val.type == 'role' && typeof val.profileImageUri == "undefined") {
				imgPath = '/main/images/role_human.jpg'; 
			} else {
				if(val.profileImageUri && val.profileImageUri != '') {
					imgPath = val.profileImageUri;
				} else {
					imgPath = '/main/images/no_image.jpg';
				}
			}
			me.state.assignees.map(function(assigneeVal,assigneeKey) {
				if(val.address == assigneeVal && val.initial) {
					var hoverHTML = '<img src="'+imgPath+'" class="hc-pic" />'
								+'<p class="hc-p">'+ (val.name != undefined ? '<b>'+val.name+'</b><br>' : '') + val.address + '</p>';
					$("div[data-title-colps-assignee='"+val.address+"'], span[data-title-colps-assignee='"+val.address+"']").unbind("click");
					$("div[data-title-colps-assignee='"+val.address+"'], span[data-title-colps-assignee='"+val.address+"']").hovercard({
						detailsHTML: hoverHTML,
						width: '250',
					   openOnLeft: true
					});
					$("div[data-title-colps-assignee='"+val.address+"'], span[data-title-colps-assignee='"+val.address+"']").bind("click");
				}
			});
		});
	},
	
	render: function() {
		var me = this;
		var length = this.state.writers.length;
		var writers = this.state.writers;
		var assignees = this.state.assignees;
		var suggestions = this.state.suggestions;
		var initialCls = '';
		if(me.props.mode == 'read' || me.props.mode == 'readSort') {
			return (
				<div name={"assignee-container-"+me.state.keyVal}>
					{
						assignees.map(function(val, key) {
							var name = "";
							var type = "";
							singleAssigneeValue = "";
							me.state.allWriters.map(function(writer, writerKey) {
								if(writer.address == val) {
									singleAssigneeValue = (writer.name == "") ? writer.address : writer.name;
									name = (writer.initial == "") ? writer.address : writer.initial;
									type = writer.type ? writer.type : "human";
								}
							})
							name = assignees.length == 1 ? (type == "role" && singleAssigneeValue == "" ? name : singleAssigneeValue) : name; 
							return name == "" ? null : <span className="requesters" key={"asign"+key} data-title={val} data-title-colps-assignee={val}><span>{name}</span></span>
						})
					}
				</div>
			)
		} else if(this.props.mode == 'template'){
			return (
					<div className="ReactTags__tags template">
						Cannot be assigned
					</div>);
		}
	}
});
var TaskState = createReactClass({
	getInitialState: function() {
		return ({
			items: this.props.items,
			keyVal: this.props.keyVal,
			mode: this.props.mode,
			storeId: this.props.storeId,
			taskState: this.props.items.state
		});
		//return null;
	},
	
	componentDidMount: function() {
		this.setState({taskState: this.props.items.state});
	},
	
	render: function() {
		var taskState = this.state.taskState;
		var taskStateProp = this.props.items.state;
		var state = this.state;
		var html = "";
		
		switch(taskState){
				case 'Accepted':
					html = <span className="taskState accepted">{taskState}</span>;
				break;
				case 'Unstarted':
					html = <span className="taskState start btn btn-info">{taskState}</span>;
				break;
				case 'Started':
					html = <span className="taskState start btn btn-info">{taskState}</span>;
				break;
				case 'Finished':
					html = <span className="taskState delivered btn btn-info">{taskState}</span>;
				break;
				case 'Delivered':
					html = <span className="taskState rejected btn btn-danger">{taskState}</span>;
				break;
				case 'Rejected':
					html = <span className="taskState rejected btn btn-info">{taskState}</span>;
				break;
				case 'NoLongerApplicable':
					html = <span className="taskState start btn btn-default">No Longer Applicable</span>;
				break;
				default:
				
				break;
			}
		
		
			return <div>{html}</div>;
		}
});
var TaskPriority = createReactClass({
	getInitialState: function() {
		return ({
			items: this.props.items,
			keyVal: this.props.keyVal,
			mode: this.props.mode,
			storeId: this.props.storeId,
			taskPriority: this.props.items.priority
		});
	},
	
	componentDidMount: function() {
		this.setState({taskPriority: this.props.items.priority});
	},
	
	render: function() {
		var taskPriority = this.state.taskPriority;
		var taskPriorityProp = this.props.items.priority;
		var state = this.state;
		var html = "";
		
		switch(taskPriority){
				case 'High':
					html = <div title="High Priority" className="btn-info-high btn-info-selected"></div>;
				break;
				case 'Medium':
					html = <div title="Medium Priority" className="btn-info-medium btn-info-selected"></div>;
				break;
				case 'Low':
					html = <div title="Low Priority" className="btn-info-low btn-info-selected"></div>;
				break;
				default:
				case 'NoPrioritySet':
					html = <div title="No Priority Set" className="btn-info-low-no btn-info-selected"></div>;
				break;
			}
			return <div className="pull-right">{html}</div>;
		
		}
});
var TaskDescription = createReactClass({
	getInitialState: function() {
		return ({
			description: this.props.description,
			items: this.props.items,
			keyVal: this.props.keyVal,
			mode: this.props.mode,
			storeId: this.props.storeId,
			taskNum: this.props.taskNum
		});
	},
	
	componentDidMount: function() {
		if(this.state.taskNum && this.state.items.taskNumber ==  this.state.taskNum) {
			var parentId = ReactDOM.findDOMNode(this.refs.description).parentNode.id;
			var hiddenDivHeight = $('#'+parentId+' .hiddenDivTextarea').outerHeight() < 40 ? 40 : ($('#'+parentId+' .hiddenDivTextarea').outerHeight() + 110);
			$('#'+parentId+' textarea').height(hiddenDivHeight);
		 }
	},
	
	render: function() {
		var state = this.state;
		var description = state.description;
		
		var isDiffSection = false;
			var descBaseValue = '';
			if(state.items.diffOpType && state.items.diffOpType == "MODIFIED") {
				if(state.items.baseValue) {
					if(state.items.additionalInfo) {
						if(state.items.additionalInfo.descriptionChanged) {
							isDiffSection = true;
							descBaseValue = state.items.baseValue.description;
							modifyStateClass = "descDiff";
							if(state.items.baseValue.description == "" && state.items.description != "") {
								modifyStateClass = "descDiffAdd";
							} else if(state.items.baseValue.description != "" && state.items.description == "") {
								modifyStateClass = "descDiffDel";
							}
						}
					}
				}
			}

			var diffHtml = null;
			if(isDiffSection){
				diffHtml = <span className={modifyStateClass} title={descBaseValue}></span>

				var isOpenInMobile = isMobile();
				var hoverTitle = descBaseValue == '' ? "No Value" : descBaseValue;

				if(isOpenInMobile){
					diffHtml = <Popover className="custom-popover-content" placement="bottom" arrow={false}>
						<a href="##" className="mobile-modified-data-icon">{diffHtml}</a>
						{hoverTitle}
					</Popover>
				}
			}

			return (
				<div className="description" id={"description"+this.state.items.taskNumber}>
					<div className="hiddenDivTextarea desc" style={{padding: "10px 0px"}}>{description}</div>
					<textarea className="readText autoAdjust" ref="description" defaultValue={description} readOnly></textarea>
					{diffHtml}
				</div>
			)
		}
});

var TaskTypeRequest = createReactClass({
	getInitialState: function() {
		var writersObj = {};
		if(this.props.writers) {
			this.props.writers.map(function(val, key) {
				writersObj[val.fullAdress] = val;
			});
		}
		return ({writersObj: writersObj, allWriters: this.props.allWriters});
	},
	componentDidMount: function() {
	},
	render: function(){
		var me = this;
		var style = this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? 'block' : 'none';
		var className = this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? 'panel-collapse collapse in' : 'panel-collapse collapse';
		var fields = this.props.items.taskNumber.toString().split(/_/);
		var newItem = false;
		var storeId = this.props.storeId;
		var isEnabled = this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? true : false;
		if(fields[0] == 'New') {
			var newItem = true;
		}
		var requesterDiff, assigneesDiff, stateDiff, priorityDiff = false;
		var outterCls = this.props.items.diffOpType && this.props.items.diffOpType == "MODIFIED" ? "diffSection" : "";
		var isDiffSection = false;
		var assigneeBaseValue = '', requesterBaseValue = '', stateBaseValue = '', priorityBaseValue = '';
		var additionalInfo = this.props.items.additionalInfo ? this.props.items.additionalInfo : "undefined";
		if(this.props.items.diffOpType && this.props.items.diffOpType == "MODIFIED") {
			if(this.props.items.baseValue) {
				if(additionalInfo) {
					if(additionalInfo.requesterChange) {
						if(additionalInfo.requesterChange.added && additionalInfo.requesterChange.added != "" && additionalInfo.requesterChange.removed && additionalInfo.requesterChange.removed != "") {
							modifyReqStateClass = "table-style-diff";
							requesterDiff = true;
						} else if(additionalInfo.requesterChange.added && additionalInfo.requesterChange.added != "") {
							modifyReqStateClass = "table-style-diff-add";
							requesterDiff = true;
						} else if(additionalInfo.requesterChange.removed && additionalInfo.requesterChange.removed != "") {
							modifyReqStateClass = "table-style-diff-del";
							requesterDiff = true;
						} 
						var writerAddress = this.props.items.baseValue.requester;
						requesterBaseValue = writerAddress != "" ? (me.state.writersObj[writerAddress]["name"] != "" ? me.state.writersObj[writerAddress]["name"] + " (" + me.state.writersObj[writerAddress]["address"] + ")" : me.state.writersObj[writerAddress]["address"]) : "";
					}
					if(additionalInfo.assigneeChange) {
						var assigneesAdded = "";
						var assigneesRemoved = "";
						if(additionalInfo.assigneeChange.added.length > 0) {
							additionalInfo.assigneeChange.added.map(function(val,key) {
								assigneesAdded += (val + ((additionalInfo.assigneeChange.added.length-1) == key ? " " : ", "));
							})
							assigneesDiff = true;
						}
						if(additionalInfo.assigneeChange.removed.length > 0) {
							additionalInfo.assigneeChange.removed.map(function(val,key) {
								assigneesRemoved += (val + ((additionalInfo.assigneeChange.removed.length-1) == key ? " " : ", "));
							})
							assigneesDiff = true;
						}
						if(additionalInfo.assigneeChange.added.length > 0 && additionalInfo.assigneeChange.removed.length > 0) {
							modifyAssigStateClass = "table-style-diff";
							assigneesDiff = true;
						} else if(additionalInfo.assigneeChange.added.length > 0) {
							modifyAssigStateClass = "table-style-diff-add";
							assigneesDiff = true;
						} else if(additionalInfo.assigneeChange.removed.length > 0) {
							modifyAssigStateClass = "table-style-diff-del";
							assigneesDiff = true;
						}
					}
				}
				
				if(this.props.items.baseValue.assignees) {
					this.props.items.baseValue.assignees.map(function(val,key) {
						if(val) {
							if(typeof me.state.writersObj[val] != "undefined" && (me.state.writersObj[val]["address"] == val || me.state.writersObj[val]["fullAdress"] == val)) {
								assigneeBaseValue += me.state.writersObj[val]["name"] != "" ? me.state.writersObj[val]["name"] + " (" + me.state.writersObj[val]["address"] + ")" : me.state.writersObj[val]["address"];
							} else {
								assigneeBaseValue += val;
							}
							assigneeBaseValue += "\n";
						}
					});
				}
				if(this.props.items.baseValue.state) {
					modifyTaskStateClass = "table-style-diff";
					stateDiff = true;
					stateBaseValue = this.props.items.baseValue.state;
				}
				
				if(this.props.items.baseValue.priority) {
					modifyTaskPriorityClass = "table-style-diff";
					priorityDiff = true;
					priorityBaseValue = this.props.items.baseValue.priority;
				}
			}
		}
		
		var requesterDiffHtml, assigneesDiffHtml, stateDiffHtml, priorityDiffHtml = null;

		var isOpenInMobile = isMobile();
		if(requesterDiff){
			requesterDiffHtml = <span className={modifyReqStateClass} title={requesterBaseValue}></span>
			
			}

		if(assigneesDiff){
			assigneesDiffHtml = <span className={modifyAssigStateClass} title={assigneeBaseValue}></span>
			
			}

		if(stateDiff){
			stateDiffHtml = <span className={modifyTaskStateClass} title={stateBaseValue}></span>
			
			}

		if(priorityDiff){
			priorityDiffHtml = <span className={modifyTaskPriorityClass} title={priorityBaseValue}></span>
			
			}

		if(isEnabled) {
			return (
				<div className={(this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask)  ? 'impBackgroundFFF ' : ' ')+outterCls} key={this.props.propKey}>
					<TaskListsCompHeader items={this.props.items} mode={this.props.mode} keyVal={this.props.keyVal} allWriters={this.props.allWriters} writers={this.props.writers} currentUser={this.props.currentUser} divId={this.props.divId} taskNum={this.props.taskNum} storeId={storeId} favWriters={this.props.favWriters} isChecklist={this.props.isChecklist} slideTask={this.props.slideTask} toggleTaskIndex={this.props.toggleTaskIndex} />
					<div id={this.props.divId+'_collapse_' + this.props.mode + this.props.items.index} className={className} style={{display: style}}>
						<div className="panel-body">
							<TaskTitle items={this.props.items} mode={this.props.mode} keyVal={this.props.keyVal} storeId={storeId} />
							<div className={"mb-6 taskNumber"+this.props.mode == 'read' || this.props.mode == 'readSort' ? 'hiddenDelBtn' : ''} style={{float: 'left', clear: 'both'}}>
								<span className="content-id label-cls">Task Number</span>
								<span name={"task-number-"+this.props.items.index} className={newItem ? "taskId content-id newTask taskNumber" : "taskId content-id taskNumber"}>#{newItem ? "New" : this.props.items.taskNumber}</span>
								{}
							</div>
							{}
							<div className="content-block">
								<div className="col-md-4 table-style">
									<div className="col-md-3 label-cls">
										Requester 
									</div>
									<div className="col-md-9" style={{textAlign: "right"}}>
										<TaskRequester items={this.props.items} mode={this.props.mode} keyVal={this.props.keyVal} allWriters={this.state.allWriters} writers={this.props.writers} favWriters={this.props.favWriters} currentUser={this.props.currentUser} storeId={storeId} />
									</div>
									{requesterDiffHtml}
								</div>
								<div style={{clear:"both"}}></div>
								<div className="col-md-4 table-style">
									<div className="col-md-3 label-cls">
										Assignees
									</div>
									<div className="col-md-9" style={{textAlign: "right"}}>
										<TaskAssignees assignees={this.props.items.assignees} mode={this.props.mode} keyVal={this.props.keyVal} allWriters={this.state.allWriters} writers={this.props.writers} favWriters={this.props.favWriters} currentUser={this.props.currentUser} storeId={storeId} />
									</div>
									{assigneesDiffHtml}
								</div>
								<div style={{clear:"both"}}></div>
								<div className="col-md-4 table-style">
									<div className="col-md-3 label-cls">
										State
									</div>
									<div className="col-md-9" style={{textAlign: "right"}}>
										<TaskState items={this.props.items} mode={this.props.mode} keyVal={this.props.keyVal} propKey={this.props.propKey} storeId={storeId} />
									</div>
									{stateDiffHtml}
								</div>
								<div style={{clear:"both"}}></div>
								<div className="col-md-4 table-style table-last-row">
									<div className="col-md-3 label-cls">
										Priority
									</div>
									<div className="col-md-9" style={{textAlign: "right"}}>
										<TaskPriority items={this.props.items} mode={this.props.mode} keyVal={this.props.keyVal} propKey={this.props.propKey} storeId={storeId} />
									</div>
									{priorityDiffHtml}
								</div>
								<div style={{clear:"both"}}></div>
							</div>
							<div style={{clear:"both"}}></div>
							<TaskDescription items={this.props.items} description={this.props.items.description} keyVal={this.props.keyVal} mode={this.props.mode} storeId={storeId} taskNum={this.props.taskNum} />
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className={(this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask)  ? 'impBackgroundFFF ' : ' ')+outterCls} key={this.props.propKey}>
					<TaskListsCompHeader items={this.props.items} mode={this.props.mode} keyVal={this.props.keyVal} allWriters={this.props.allWriters} writers={this.props.writers} currentUser={this.props.currentUser} divId={this.props.divId} taskNum={this.props.taskNum} storeId={storeId} favWriters={this.props.favWriters} isChecklist={this.props.isChecklist} slideTask={this.props.slideTask} toggleTaskIndex={this.props.toggleTaskIndex} />
				</div>	
			);
		}
	}
});
var TaskTypeDivider = createReactClass({
	render: function(){
		var titleDisplay = this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? 'block' : 'none';
		var titleTopMargin =  this.props.items.newItem ? '-10px' : '-22px';
		var className = this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? 'panel-collapse collapse in' : 'panel-collapse collapse';
		var hideDivider = this.props.mode == 'readSort' ? 'none' : 'block';
		var storeId = this.props.storeId;
		var hideTitle = this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? 'none' : 'block';
		var isEnabled = this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? true : false;
		
		
		if(isEnabled) {
			return (
				<div className={this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? 'impBackgroundFFF' : ''} key={this.props.propKey} style={{display: hideDivider}}>
					<div className="panel-heading">
						{}
						<div className="title-outter" style={{display: hideTitle}}>
							<h4 className="panel-title">
								{this.props.items.title}
							</h4>
						</div>
					</div>
					<div id={this.props.divId+"_collapse_"+this.props.mode+this.props.items.index} className={className} style={{display: titleDisplay, marginTop: titleTopMargin}}>
						<div className="panel-body">
							<div className="mb-10">
								<TaskTitle items={this.props.items} keyVal={this.props.keyVal} mode={this.props.mode} storeId={storeId} />
								<div style={{float: "left", clear: 'both'}}>
									{}
								</div>
								{}
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className={this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? 'impBackgroundFFF' : ''} key={this.props.propKey} style={{display: hideDivider}}>
					<div className="panel-heading">
						{}
						<div className="title-outter" style={{display: hideTitle}}>
							<h4 className="panel-title">
								{this.props.items.title}
							</h4>
						</div>
					</div>
				</div>
			);
		}
	}
});
var TaskListsComp = createReactClass({
	getInitialState: function() {
		return ({
			allWriters: this.props.allWriters,
			currentUser: this.props.currentUser,
			divId: this.props.divId,
			favWriters: this.props.favWriters,
			isChecklist: this.props.isChecklist,
			items: this.props.items,
			key: this.props.propKey,
			keyVal: this.props.keyVal,
			mode: this.props.mode,
			storeId: this.props.storeId,
			taskNum: this.props.taskNum,
			tasksLength: this.props.tasksLength,
			writers: this.props.writers
		});
	},
	render: function() {
		var outterClass = 'panel panel-default ';
		var hideDivider = this.state.mode == 'readSort' ? 'none' : 'block';
		var storeId = this.state.storeId;
		var isDiffSection = this.state.items.diffOpType ? true : false;
		if(this.state.items.deleted) {
			hideDivider = 'none';
		}
		switch(this.state.items.state){
			case 'Accepted':
				outterClass += 'panel-accepted';
			break;
			case 'NoLongerApplicable':
				outterClass += 'panel-grey';
			break;
			case 'Finished':
			case 'Delivered':
			case 'Rejected':
			case 'Started':
				outterClass += 'panel-openTask';
			break;
			default:
				outterClass += 'panel-white';
			break;
		}
		if(this.state.items.type == 'DIVIDER'){
			outterClass = 'panel panel-default panel-blue panel-divider';
		}
		if(isDiffSection) {
			var outterClass = 'panel panel-default panel-white';
			switch(this.state.items.diffOpType) {
				case "NEW":
					outterClass += " panel-diff-added";
				break;
				case "DELETED":
					outterClass += " panel-diff-deleted";
				break;
				case "MODIFIED":
					outterClass += " panel-diff-modified";
				break;
			}
		}
		if(this.props.addLastTaskCls) {
			outterClass += " last-task"
		}
		switch(this.state.items.type) {
			case 'TASK_REQUEST':
				return (
					<div className={"el-container "+outterClass} name={'sort_' + this.state.keyVal} id={'sort_' + this.state.keyVal} style={{display: this.state.items.deleted ? "none" : "block"}}>
						<TaskTypeRequest items={this.state.items} mode={this.state.mode} keyVal={this.state.keyVal} propKey={this.state.key} tasksLength={this.state.tasksLength} allWriters={this.state.allWriters} writers={this.state.writers} favWriters={this.state.favWriters} currentUser={this.state.currentUser} divId={this.state.divId} taskNum={this.state.taskNum} storeId={storeId} isChecklist={this.state.isChecklist} slideTask={this.props.slideTask} toggleTaskIndex={this.props.toggleTaskIndex}/>
					</div>
				);
			break;
			case 'DIVIDER':
				return (this.state.mode == 'nonSort' ? null : (<div className={"el-container "+outterClass} style={{display: hideDivider}} name={'sort_' + this.state.keyVal} id={'sort_' + this.state.keyVal}><TaskTypeDivider items={this.state.items} mode={this.state.mode} keyVal={this.state.keyVal} propKey={this.state.key} tasksLength={this.state.tasksLength} divId={this.state.divId} storeId={storeId} toggleTaskIndex={this.props.toggleTaskIndex} slideTask={this.props.slideTask} /></div>));
			break;
		}
	},
});
module.exports = TaskListsComp;