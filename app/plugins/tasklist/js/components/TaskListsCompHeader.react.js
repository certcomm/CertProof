var React = require('react');
var createReactClass = require('create-react-class');
var ReactDOM = require('react-dom');
var Popover = require('react-awesome-popover');	
var ClipboardJS = require('clipboard/dist/clipboard.min');

var TaskStateReadViewHtml = require('./TaskStateReadViewHtml.react');
var TaskCollapseArrow = require('./TaskCollapseArrow.react');
var WritersStore = require('../stores/WritersStore');
var TaskStore = require('../stores/TaskStore');

function getWriters() {
	return WritersStore.getData();
}

var isMobile = function() {
	try{
		document.createEvent("TouchEvent"); return true;
	} catch(e){
		return false;
	}
}

var TaskRequester = createReactClass({
	getInitialState: function(){
		var allWriters = this.props.allWriters;
		return {
			keyVal: this.props.keyVal,
			storeId: this.props.storeId,
			mode: this.props.mode,
			allWriters: allWriters
		} 
	},
	componentDidUpdate: function(){
		var me = this,
			isOpenInMobile = isMobile();
		this.state.allWriters.map(function(val, key){
			var imgPath = '';
			if(val.type == 'role' && typeof val.profileImageUri == "undefined") {
				if(isOpenInMobile){
					imgPath = './role_human.jpg'; 
				}else {
					imgPath = '/main/images/role_human.jpg'; 
				}
			} else {
				if(val.profileImageUri && val.profileImageUri != '') {
					imgPath = val.profileImageUri;
				} else {
					if(isOpenInMobile) {
						imgPath = './no_image.jpg';
					} else {
						imgPath = '/main/images/no_image.jpg';
					}
				}
			}
			if(val.address == me.props.requester && val.initial) {
				var hoverHTML = '<img src="'+imgPath+'" class="hc-pic" />'
							+'<p class="hc-p">'+ (val.name != undefined ? '<b>'+val.name+'</b><br>' : '') + val.address + '</p>';
				$("div[data-title-requester='"+val.address+"'], span[data-title-requester='"+val.address+"']").unbind("click");
				$("div[data-title-requester='"+val.address+"'], span[data-title-requester='"+val.address+"']").hovercard({
					detailsHTML: hoverHTML,
					width: '250',
				   openOnLeft: true
				});
				$("div[data-title-requester='"+val.address+"'], span[data-title-requester='"+val.address+"']").bind("click");
			}
		});
	},
	shouldComponentUpdate: function(nextProps, nextState, nextContext) {
		return true;
	},
	render: function() {
		var me = this;
		var requester = this.props.requester;
		if(me.props.mode != 'template'){
			var name = "";
			var key = 0;
			if(typeof requester != "undefined" && requester != "") {
				me.state.allWriters.map(function(writer, key) {
					if(writer){
						if(writer.address == requester) {
							name = (writer.name != "") ? writer.name : (writer.type && writer.type == "role" ? writer.initial : writer.address);
							key = key;
						}
					}
				})
			}
			return (
				<div>
					{
						name == "" ? null : <div key={"div-req"+key+"-"+requester}><span className="header-requester requesters" data-title-requester={requester} key={"reqs"+key}><span>{name}</span></span></div>
					}
				</div>
			);
		} else {
			return null;
		}
	}
});
var TaskAssignees = createReactClass({
	getInitialState: function(){
		var currentUser = this.props.currentUser;
		return ({assignees: this.props.assignees, allWriters: this.props.allWriters, mode: this.props.mode})
	},
	componentDidMount: function(){
		if(ReactDOM.findDOMNode(this.refs["header-assignees"]) && ReactDOM.findDOMNode(this.refs["header-assignees"]) != null) {
			ReactDOM.findDOMNode(this.refs["header-assignees"]).setAttribute('assigneesCount', this.state.assignees.length);
		}
	},
	componentDidUpdate: function(){
		var me = this,
			isOpenInMobile = isMobile();
		this.state.allWriters.map(function(val, key){
			var imgPath = '';
			if(val.type == 'role' && typeof val.profileImageUri == "undefined") {
				if(isOpenInMobile)
					imgPath = './role_human.jpg'; 
				else	
					imgPath = '/main/images/role_human.jpg'; 
			} else {
				if(val.profileImageUri && val.profileImageUri != '') {
					imgPath = val.profileImageUri;
				} else {
					if(isOpenInMobile)
						imgPath = './no_image.jpg';
					else 
						imgPath = '/main/images/no_image.jpg';
				}
			}
			me.state.assignees.map(function(assigneeVal,assigneeKey) {
				if(val.address == assigneeVal && val.initial) {
					var hoverHTML = '<img src="'+imgPath+'" class="hc-pic" />'
								+'<p class="hc-p">'+ (val.name != undefined ? '<b>'+val.name+'</b><br>' : '') + val.address + '</p>';
					$("div[data-title-assignee='"+val.address+"'], span[data-title-assignee='"+val.address+"']").unbind("click");
					$("div[data-title-assignee='"+val.address+"'], span[data-title-assignee='"+val.address+"']").hovercard({
						detailsHTML: hoverHTML,
						width: '250',
					   openOnLeft: true
					});
					$("div[data-title-assignee='"+val.address+"'], span[data-title-assignee='"+val.address+"']").bind("click");
				}
			});
		});
	},
	shouldComponentUpdate: function(nextProps, nextState, nextContext) {
		if(this.state.mode == "template") {
			return false;
		}
		/*		Commented 02052018 (if user removed one writer and added newer then count should be same but it will not update)		*/
		/*
		if(ReactDOM.findDOMNode(this.refs["header-assignees"]).getAttribute('assigneesCount') == nextState.assignees.length) {
			return false;
		}
		*/
		/*		Commented 02052018		*/
		return true;
	},
	render: function() {
		var allWriters = this.state.allWriters;
		var noInitialCls = '';
		var assignees = this.state.assignees;
		if(this.props.mode == 'template') {
			return null;
		} else {
			return (
				<div> 
					<div className="assignee-outter header-assignees" title="" ref="header-assignees">
						{	
							assignees.map(function(val, key){
								var name = "";
								var type = "";
								singleAssigneeValue = "";
								if(Object.keys(allWriters).length > 0){
									allWriters.map(function(writer, key) {
										if(writer.address == val) {
											singleAssigneeValue = (writer.name == "" || writer.name == undefined) ? writer.address : writer.name;
											name = (writer.initial == "") ? writer.address : writer.initial;
											type = writer.type ? writer.type : "human";
										}
									})
								}
								if(name == "") {
									name = val;
									noInitialCls = 'noInitialCls';
								} else {
									noInitialCls = '';
								}
								name = assignees.length == 1 ? (type == "role" && singleAssigneeValue == "" ? name : singleAssigneeValue) : name; 
								return val == 'More' || name == '' ? null : <div key={"div"+key+"-"+val}><div className={"header-task-assignees chosen-single "+noInitialCls} key={key} data-title-assignee={val}><span>{name}</span></div></div>;
							})
						}
					</div>
				</div>
			);
		}
	}
});
var TaskStateHeader = createReactClass({
	render: function() {
		var state = this.props.state;
		var style = this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? 'none' : 'block';
		var className = this.props.items.newItem || (this.props.taskNum && this.props.items.taskNumber == this.props.taskNum) ? 'glyphicon glyphicon-chevron-down collapse-i' : 'glyphicon glyphicon-chevron-right collapse-i';
		var storeId = this.props.storeId;
		
		var taskStateBtnsHTML = <TaskStateReadViewHtml taskState={this.props.state}/>
		return (
			<div className="button-outter right-align" style={{display: style, float: "right"}}>
				{taskStateBtnsHTML}
			</div>
		);
	}
});
var TaskPriorityHeader = createReactClass({
	render: function() {
		var priority = this.props.priority;
		var style = this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? 'none' : 'block';
		var className = this.props.items.newItem || (this.props.taskNum && this.props.items.taskNumber == this.props.taskNum) ? 'glyphicon glyphicon-chevron-down collapse-i' : 'glyphicon glyphicon-chevron-right collapse-i';
		
		var storeId = this.props.storeId,
			html = <div style={{width: "27px", opacity: 0}}>.</div>;
		
		switch(priority){
			case 'High':
				html = <div data-value="High" title="High Priority" className="btn-info-high btn-info-selected"></div>;
			break;
			case 'Medium':
				html = <div data-value="Medium" title="Medium Priority" className="btn-info-medium btn-info-selected"></div>;
			break;
			case 'Low':
				html = <div data-value="Low" title="Low Priority" className="btn-info-low btn-info-selected"></div>;
			break;
			default:
			/*case 'NoPrioritySet':
				html = <div data-value="NoPrioritySet" title="No Priority Set" className="btn-info-low-no btn-info-selected"></div>;*/
			break;
		}
		
		var mrgnTop = "0px";
		if(this.props.mode == 'read' || this.props.mode == 'readSort' || this.props.mode == 'template' || this.props.state == "NoLongerApplicable"){
			mrgnTop = "4px";
		}
		
		if(html != null){
			return (
				<div className="button-outter right-align" style={{display: style, float: "right", marginTop: mrgnTop}}>
					{html}
				</div>
			);
		}else{
			return html;
		}
	}
});
var TaskListsCompHeader = createReactClass({
	getInitialState: function() {
		return ({open: false});
	},
	componentDidMount: function() {
		this.bindClipBoard(".copy-task-link-menu");
		this.bindClipBoard(".copy-task-link-mobile-menu");
	},
	bindClipBoard: function(el){
		var clipboard = new ClipboardJS(el);
		clipboard.on('success', function(e) {
			$(e.trigger).parent("div").find("span.copied-span").show();
			setTimeout(function(){
				$(e.trigger).parent("div").find("span.copied-span").hide();
			}, 2000);
			e.clearSelection();
		});
		
		clipboard.on('error', function(e) {
			console.error('Action:', e.action);
			console.error('Trigger:', e.trigger);
		});
	},
	shouldComponentUpdate: function(nextProps, nextState, nextContext) {
		var updateHeader = (this.props.items.shouldUpdateHeader || this.props.items.diffOpType) ? true : false;
		return updateHeader;
	},
	returnAditionalInfo: function(additionalInfo, changedValue){
		var isEnabled = (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? true : false;
		if(additionalInfo && !isEnabled) {
			var diffWritersObj = {};
			this.props.allWriters.map(function (val,key) {
				diffWritersObj[val.fullAdress] = val;
			});
			if(additionalInfo.titleChanged && changedValue == "titleChanged"){
				return <span className="diff-text"><span className="task-bullet"></span> <b>Title</b> was changed (open task to see) </span>;
			}

			if(additionalInfo.stateChange && changedValue == "stateChange") {
				if(additionalInfo.stateChange && additionalInfo.stateChange == "none") {
					return null;
				} else if(additionalInfo.stateChange && additionalInfo.stateChange == "expected") {
					return <span className="diff-text"><span className="task-bullet"></span> This Task was <b>{this.props.items.taskState ? this.props.items.taskState : this.props.items.state}</b> </span>;
				} else {
					return <span className="diff-text"><span className="task-bullet"></span> This Task was moved from <b>{this.props.items.baseValue.state}</b> to <b>{this.props.items.state}</b> </span>;
				}
			}

			if(additionalInfo.requesterChange && changedValue == "requesterChange") {
				var removedWriterName = additionalInfo.requesterChange.removed;
				var removedWriterAddress = additionalInfo.requesterChange.removed;
				var addedWriterName = additionalInfo.requesterChange.added;
				var addedWriterAddress = additionalInfo.requesterChange.added;
				if(diffWritersObj[additionalInfo.requesterChange.removed]){
					var writer = diffWritersObj[additionalInfo.requesterChange.removed];
					removedWriterName = writer.type == "role" && writer.name == "" ? writer.initial : writer.name;
					assigneeAddress = writer.type == "role" ? (writer.initial && writer.initial != "" ? writer.address : "") : writer.address;
				}
				if(diffWritersObj[additionalInfo.requesterChange.added]){
						var writer = diffWritersObj[additionalInfo.requesterChange.added];
						addedWriterName = writer.type == "role" && writer.name == "" ? writer.initial : writer.name;
						assigneeAddress = writer.type == "role" ? (writer.initial && writer.initial != "" ? writer.address : "") : writer.address;
				}
				if(additionalInfo.requesterChange.added && additionalInfo.requesterChange.added != "" && additionalInfo.requesterChange.removed && additionalInfo.requesterChange.removed != "") {
					return (<span className="diff-text"><span className="task-bullet"></span> Requester <b>{<span title={removedWriterAddress}>{removedWriterName}</span>}</b> was replaced by <b>{<span title={addedWriterAddress}>{addedWriterName}</span>}</b> </span>);
				} else if(additionalInfo.requesterChange.added && additionalInfo.requesterChange.added != "") {
					return <span className="diff-text"><span className="task-bullet"></span> Requester <b>{<span title={addedWriterAddress}>{addedWriterName}</span>}</b> was added </span>;
				} else if(additionalInfo.requesterChange.removed && additionalInfo.requesterChange.removed != "") {
					return <span className="diff-text"><span className="task-bullet"></span> Requester <b>{<span title={removedWriterAddress}>{removedWriterName}</span>}</b> was removed </span>;
				} else {
					return null;
				}
			}

			if(additionalInfo.assigneeChange && changedValue == "assigneeChange") {
				var assigneesAdded = "";
				var assigneesRemoved = "";
				var addedWriters = [];
				var removedWriters = [];
				
				if(additionalInfo.assigneeChange.added.length > 0) {
					additionalInfo.assigneeChange.added.map(function(val,key) {
						var assigneeName = val;
						var assigneeAddress = val;
						if(diffWritersObj[val]){
							if(additionalInfo.assigneeChange.added.length == 1) {
								var writer = diffWritersObj[val];
								assigneeName = writer.type == "role" && writer.name == "" ? writer.initial : writer.name;
								assigneeAddress = writer.type == "role" ? (writer.initial && writer.initial != "" ? writer.address : "") : writer.address;
							} else {
								var writer = diffWritersObj[val];
								assigneeName = writer.initial ? writer.initial : writer.address;
								assigneeAddress = writer.type == "role" ? (writer.initial && writer.initial != "" ? writer.address : "") : writer.address;
							}
						} else {
							assigneeAddress = "";
						}
						if(addedWriters.indexOf(val) == -1){
							addedWriters.push({
								writerName: assigneeName,
								writerAddress: assigneeAddress
							});
						}
					});
				}
				
				if(additionalInfo.assigneeChange.removed.length > 0) {
					additionalInfo.assigneeChange.removed.map(function(val,key) {
						var removedWriterName = val;
						var removedWriterAddress = val;
						
						if(diffWritersObj[val]){
							if(additionalInfo.assigneeChange.removed.length == 1) {
								var writer = diffWritersObj[val];
								removedWriterName = writer.type == "role" && writer.name == "" ? writer.initial : writer.name;
								removedWriterAddress = writer.type == "role" ? (writer.initial && writer.initial != "" ? writer.address : "") : writer.address;
							} else {
								var writer = diffWritersObj[val];
								removedWriterName = writer.type == "role" ? (writer.initial ? writer.initial : writer.address) : writer.name;
								removedWriterAddress = writer.type == "role" ? (writer.initial && writer.initial != "" ? writer.address : "") : writer.address;
							}
						}
						removedWriters.push({
							writerName: removedWriterName,
							writerAddress: removedWriterAddress
						});
						
					})
				}
				if(additionalInfo.assigneeChange.added.length > 0 && additionalInfo.assigneeChange.removed.length > 0) {
					return (<span className="diff-text"><span className="task-bullet"></span> Assignees <b>{
							addedWriters.map(function(val,key){
								return (<span title={val.writerAddress}>{val.writerName}{(addedWriters.length-1 == key) ? " " : ", "}</span>);
							})
						}</b> added and <b>{
							removedWriters.map(function(val,key){
								return (<span title={val.writerAddress}>{val.writerName}{(removedWriters.length-1 == key) ? " " : ", "}</span>);
							})
						}</b> removed </span>);
				} else if(additionalInfo.assigneeChange.added.length > 0) {
					return <span className="diff-text"><span className="task-bullet"></span> Assignee{additionalInfo.assigneeChange.added.length == 1 ? null : "s"} <b>{
							addedWriters.map(function(val,key){
								return (<span title={val.writerAddress}>{val.writerName}{(addedWriters.length-1 == key) ? " " : ", "}</span>);
							})
						}</b> added </span>;
				} else if(additionalInfo.assigneeChange.removed.length > 0) {
					return <span className="diff-text"><span className="task-bullet"></span> Assignee{additionalInfo.assigneeChange.removed.length == 1 ? null : "s"} <b>{
							removedWriters.map(function(val,key){
								return (<span title={val.writerAddress}>{val.writerName}{(removedWriters.length-1 == key) ? " " : ", "}</span>);
							})
						}</b> removed </span>;
				} else {
					return null;
				}
			}

			if(additionalInfo.descriptionChanged && changedValue == "descriptionChanged"){
				return <span className="diff-text"><span className="task-bullet"></span> <b>Description</b> was changed (open task to see) </span>;
			}
		}
	},
	render: function() {
		var style = this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask)  ? 'none' : 'block';
		(typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) 
		var className = this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask)  ? 'glyphicon glyphicon-chevron-down collapse-i' : 'glyphicon glyphicon-chevron-right collapse-i';
		var fields = this.props.items.taskNumber.toString().split(/_/);
		var newItem = false;
		var titleOutter = this.props.items.state != 'Delivered' && this.props.mode != 'read' && this.props.mode != 'readSort' && this.props.items.state != 'NoLongerApplicable' && this.props.items.state != 'Accepted' ? 'title-cls' : '';
		var storeId = this.props.storeId;
		var headerCls = "panel-heading";
		if(fields[0] == 'New') {
			var newItem = true;
		}
		var isDiffSection = this.props.items.diffOpType ? true : false;
		var diffIcon, taskDiffType = '';
		var additionalInfo = this.props.items.additionalInfo ? this.props.items.additionalInfo : "undefined";

		var diffHtml = null;
		if(isDiffSection) {
			headerCls = "panel-heading diff-section-heading";
			switch(this.props.items.diffOpType) {
				case "NEW":
					diffIcon = "diff-added-icon";
					taskDiffType = "This task was added.";
				break;
				case "DELETED":
					diffIcon = "diff-deleted-icon";
					taskDiffType = "This task was deleted.";
				break;
				case "MODIFIED":
					diffIcon = "diff-modified-icon";
					taskDiffType = "This task was modified.";
				break;
			}

			diffHtml = <span className={"diff-type-icon "+diffIcon} title={taskDiffType}></span>

			var isOpenInMobile = isMobile();
			var hoverTitle = taskDiffType == '' ? "No Value" : taskDiffType;
			
			}

		var jsonData = TaskStore.getData(this.props.storeId),
			tnum = this.props.items.taskNumber,
			ttitle = this.props.items.title.replace(/"/g, "'").replace(/[\[\]']+/g,'');

		var url = jsonData.baseUrl+'ttn/'+jsonData.tmailNum+'#task='+jsonData.secNum+':'+tnum,
			link = '[ TASK ' +tnum+ ' titled "'+ttitle+'" in "' +jsonData.sectionTitle+ '" in THREAD "' +jsonData.tmailSubject+ '", ' +url+ ' ]';
		
		if(jsonData.mailboxType == 'forward'){
			url = jsonData.baseUrl+'ttn/'+jsonData.tmailNum+"#forwarded-task="+jsonData.fwdtmailNum+":"+jsonData.secNum+":"+tnum;
			var isInComment = jsonData.cnum ? ' in FORWARDED COMMENT ' +jsonData.cnum : ' ';
			link = '[ FORWARDED TASK ' +tnum+ ' titled "'+ttitle+'" in "' +jsonData.sectionTitle+ '"' +isInComment+ ' in ' +jsonData.tmailNum+ ' in THREAD "' +jsonData.tmailSubject+ '", ' +url+' ]';
		}
		
		return (
			<div className={headerCls}>
				{this.props.items.newItem ? null : <TaskCollapseArrow items={this.props.items} keyVal={this.props.keyVal} mode={this.props.mode} divId={this.props.divId} taskNum={this.props.taskNum} storeId={storeId} slideTask={this.props.slideTask} toggleTaskIndex={this.props.toggleTaskIndex} />}
				<div className="request-icon-outter" style={{display: style}}>
					<i className={this.props.items.isFromChecklist ? "task-checklist-icon" : "task-r-icon"} name={"task-icon-"+this.props.keyVal}></i>
					<div className="taskId">
						<span name={"task-number-"+this.props.items.index} className={newItem ? 'newTask content-id header-task-number' : 'content-id header-task-number'}>#{newItem ? "New" : this.props.items.taskNumber}</span>
					</div>
					{
						!isMobile() && !newItem && jsonData.mailboxType != 'draft' ? (
							<div style={{left: '-34px', position: 'absolute', top: '1px'}}>
								<span className="copied-span hidden">Task Link Copied</span>
								<div name={"task-number-header-copy-"+this.props.items.index} className="copy-task-link-menu" title="Copy Task Link" data-clipboard-text={link}></div>
							</div>
						) : null
					}
					{diffHtml}
				</div>
				<div className={"title-outter " + titleOutter} style={{display: style}}>
					{
						isMobile() && !newItem && jsonData.mailboxType != 'draft' ? (
							<div style={{position: 'relative', cursor: 'pointer'}}>
								<span className="copied-mobile-span copied-span hidden">Task Link Copied</span>
								<h4 className="task-header-title panel-title copy-task-link-mobile-menu" data-clipboard-text={link}> {this.props.items.title} </h4>
							</div>
						) : <h4 className="task-header-title panel-title"> {this.props.items.title} </h4>
					}
				</div>
				{(isDiffSection && typeof this.props.items.diffOpType != 'undefined' && this.props.items.diffOpType == 'DELETED') || (typeof this.props.items.isFromChecklist != 'undefined' && this.props.items.isFromChecklist == true && this.props.isChecklist == true) ? null : 
					<TaskPriorityHeader priority={this.props.items.priority} mode={this.props.mode} keyVal={this.props.keyVal} items={this.props.items} taskNum={this.props.taskNum} storeId={storeId} slideTask={this.props.slideTask} toggleTaskIndex={this.props.toggleTaskIndex} />
				}
				{(isDiffSection && typeof this.props.items.diffOpType != 'undefined' && this.props.items.diffOpType == 'DELETED') || (typeof this.props.items.isFromChecklist != 'undefined' && this.props.items.isFromChecklist == true && this.props.isChecklist == true) ? null : 
					<TaskStateHeader state={this.props.items.state} mode={this.props.mode} keyVal={this.props.keyVal} items={this.props.items} taskNum={this.props.taskNum} storeId={storeId} slideTask={this.props.slideTask} toggleTaskIndex={this.props.toggleTaskIndex} />
				}
				<div className="row">
					<div className="col-md-12" style={{marginTop: "10px"}}>
						{(isDiffSection && typeof this.props.items.diffOpType != 'undefined' && this.props.items.diffOpType == 'DELETED' || this.props.mode == "template" )? null :
							<div className="col-md-5 header-requester-outter" style={{display: style, position: "relative", width: "auto"}}>
								<TaskRequester requester={this.props.items.requester} allWriters={this.props.allWriters}   storeId={storeId} mode={this.props.mode} slideTask={this.props.slideTask} toggleTaskIndex={this.props.toggleTaskIndex}/>
							</div>
						}
						{isDiffSection && typeof this.props.items.diffOpType != 'undefined' && this.props.items.diffOpType == 'DELETED' ? null :
							<div className="col-md-7" style={{display: style, position: "relative", width: "auto", float: "right"}}>
								<TaskAssignees assignees={this.props.items.assignees} allWriters={this.props.allWriters} writers={this.props.writers} favWriters={this.props.favWriters} currentUser={this.props.currentUser} storeId={storeId} mode={this.props.mode} slideTask={this.props.slideTask} toggleTaskIndex={this.props.toggleTaskIndex}/>
							</div>
						}
					</div>
				</div>
				<div className="row">
					<div className="col-md-12 taskDiffSentenceOutter">
						{this.returnAditionalInfo(additionalInfo, "titleChanged")}
						{this.returnAditionalInfo(additionalInfo, "stateChange")}
						{this.returnAditionalInfo(additionalInfo, "requesterChange")}
						{this.returnAditionalInfo(additionalInfo, "assigneeChange")}
						{this.returnAditionalInfo(additionalInfo, "descriptionChanged")}
					</div>
				</div>
			</div>
		);
	}
});
module.exports = TaskListsCompHeader;