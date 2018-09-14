var React = require('react');
var createReactClass = require('create-react-class');
var TaskListsComp = require('./TaskListsComp.react');
var TaskStore = require('../stores/TaskStore');
var TaskActions = require('../actions/TaskActions');
var isMobile = function() {
	try{
		document.createEvent("TouchEvent"); return true;
	} catch(e){
		return false;
	}
}
var TaskLists = createReactClass({
	getInitialState: function() {
		return ({
			allWriters: this.props.allWriters,
			currentUser: this.props.currentUser,
			divId: this.props.divId,
			favWriters: this.props.favWriters,
			isChecklist: this.props.isChecklist,
			storeId: this.props.storeId,
			taskData: this.props.taskData,
			taskNum: this.props.taskNum,
			writers: this.props.writers
		});
	},
	componentDidMount: function() {
		/*open collapse*/
		var thiss = this;
		var storeId = this.state.storeId;
		var divId = this.state.divId;
		var arr = [];
		var isOpenInMobile = isMobile();
		var slideDivs = function(me, viewMode) {
			$(me).parent().parent().parent().parent().find('textarea.autoAdjust').each(function() {
				if(viewMode)
					$(this).prop('readonly', true);
				var this1 = this;
				setTimeout(function(){ adjustHeight(this1); }, 300);
			});
		}
		if(this.state.writers) {
			arr = $.merge(arr, this.state.writers);
		}
		if(this.state.favWriters) {
			arr = $.merge(arr, this.state.favWriters);
		}
		if(this.state.currentUser) {
			arr = $.merge(arr, this.state.currentUser);
		}
		var uniqueVals = [];
		$.each(arr, function(i, el){
			if($.inArray(el, uniqueVals) === -1) uniqueVals.push(el);
		});
		if(uniqueVals && uniqueVals.length > 0) {
			uniqueVals.map(function(val, key){
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
				var hoverHTML = '<img src="'+imgPath+'" class="hc-pic" />'
								+'<p class="hc-p">'+ (val.name != '' ? '<b>'+val.name+'</b><br>' : '') + val.address + '</p>';
				$("div[data-title-assignee='"+val.address+"'], span[data-title-assignee='"+val.address+"'], div[data-title-requester='"+val.address+"'], span[data-title-requester='"+val.address+"']").hovercard({
					detailsHTML: hoverHTML,
					width: '250',
				   openOnLeft: true
				});
			});
		}
		$('#'+divId+' a[data-toggle="collapse"]').on("click",function(e) {
				e.preventDefault();
				var me = $(this);
				slideDivs(me, true);
			});
		$("span[data-title='disabled-button']").unbind("click");
			$("span[data-title='disabled-button']").hovercard({
				detailsHTML: "The Task List needs to be in update mode in order to perform this action.",
				width: '250',
			   openOnLeft: true
			});
			$("span[data-title='disabled-button']").bind("click");
		$('#'+divId).on('keyup', "textarea.autoAdjust", function() {
			var this2 = this;
			setTimeout(function(){ adjustHeight(this2); }, 300);
		});
		function adjustHeight(el){
			var val = el.value.replace(/&/g, '&amp;')
									.replace(/</g, '&lt;')
									.replace(/>/g, '&gt;')
									.replace(/\n/g, '<br/>')
									.replace(/\s/g,'&nbsp;');
				
			$(el).parent().find('.hiddenDivTextarea')[0].innerHTML = val;
			if(thiss.state.taskData.mode == "edit" || thiss.state.taskData.mode == "template") {
				var outterDivHeight = $(el).parent().find('.hiddenDivTextarea').outerHeight() < 41 ? 40 : $(el).parent().find('.hiddenDivTextarea').outerHeight();
			} else {
				var outterDivHeight = $(el).parent().find('.hiddenDivTextarea').outerHeight() < 40 ? 39 : ($(el).parent().find('.hiddenDivTextarea').outerHeight());
			}
			el.style.height = outterDivHeight + 'px';
		}
		
		},	
	componentDidUpdate: function() {
		$("span[data-title='disabled-button']").unbind("click");
			$("span[data-title='disabled-button']").hovercard({
				detailsHTML: "The Task List needs to be in update mode in order to perform this action.",
				width: '250',
			   openOnLeft: true
			});
			$("span[data-title='disabled-button']").bind("click");
		$('textarea.autoAdjust').each(function() {
			var this1 = this;
			setTimeout(function(){ adjustHeight(this1); }, 300);
		});
		function adjustHeight(el){
			var val = el.value.replace(/&/g, '&amp;')
									.replace(/</g, '&lt;')
									.replace(/>/g, '&gt;')
									.replace(/\n/g, '<br/>')
									.replace(/\s/g,'&nbsp;');
				
			$(el).parent().find('.hiddenDivTextarea')[0].innerHTML = val;
			var outterDivHeight = $(el).parent().find('.hiddenDivTextarea').outerHeight() < 40 ? 39 : ($(el).parent().find('.hiddenDivTextarea').outerHeight());
			el.style.height = outterDivHeight + 'px';
		}
	},
	render: function() {
		var mode = this.state.taskData.mode;
		var data = this.props.taskData.taskables;
		var allWriters = this.state.allWriters;
		var writers = this.state.writers;
		var favWriters = this.state.favWriters;
		var currentUser = this.state.currentUser;
		var divId = this.state.divId;
		var taskNum = this.state.taskNum;
		var storeId = this.state.storeId;
		var sortBy = this.state.taskData.sortBy ? this.state.taskData.sortBy : 'priority';
		var isChecklist = this.state.isChecklist;
		var slideTask= (this.state.taskData.slideTask == undefined) ? this.props.taskData.slideTask : this.state.taskData.slideTask;
		var toggleTaskIndex= (this.state.taskData.toggleTaskIndex == undefined) ? this.props.taskData.toggleTaskIndex : this.state.taskData.toggleTaskIndex;
		if(sortBy == 'state') {
			var obj = {accepted: [], delivered: [], finished: [], restart: [], started: [], unstarted: [], noLonger: [], newlyAdded: [], open: [], newItems: []};
			var taskNumber = [];
			data.map(function(val) {
				if(val.type != 'DIVIDER') {
					val.state = val.state ? val.state : val.taskState;
					val.priority = val.priority ? val.priority : 'NoPrioritySet';
					if(val.newItem) {
						obj['newItems'].push(val);
					} else {
						var fields = val.taskNumber.toString().split(/_/);
						if(fields[1]) {
							obj['newlyAdded'].push(val);
						} else {
							if(val.state == 'Accepted') {
								obj['accepted'].push(val);
							} else if(val.state == 'Delivered') {	 
								obj['delivered'].push(val);
							} else if(val.state == 'Finished') {	
								obj['finished'].push(val);
							} else if(val.state == 'Rejected') {
								obj['restart'].push(val);
							} else if(val.state == 'Started') {
								obj['started'].push(val);
							} else if(val.state == 'Unstarted') {
								obj['unstarted'].push(val);
							} else if(val.state == 'NoLongerApplicable') {
								obj['noLonger'].push(val);
							} else {
								obj['open'].push(val);
							}
						}
					}
				}
			});
			data = [];
			if(typeof obj.accepted != "undefined" && obj.accepted.length > 0) {
				$.merge(data, obj.accepted);
			}
			if(typeof obj.delivered != "undefined" && obj.delivered.length > 0) {
				$.merge(data, obj.delivered);
			}
			if(typeof obj.finished != "undefined" && obj.finished.length > 0) {
				$.merge(data, obj.finished);
			}
			if(typeof obj.restart != "undefined" && obj.restart.length > 0) {
				$.merge(data, obj.restart);
			}
			if(typeof obj.started != "undefined" && obj.started.length > 0) {
				$.merge(data, obj.started);
			}
			if(typeof obj.unstarted != "undefined" && obj.unstarted.length > 0) {
				$.merge(data, obj.unstarted);
			}
			if(typeof obj.noLonger != "undefined" && obj.noLonger.length > 0) {
				$.merge(data, obj.noLonger);
			}
			if(typeof obj.newlyAdded != "undefined" && obj.newlyAdded.length > 0) {
				taskNumberOrder = [];
				obj.newlyAdded.map(function(val, key) {
					var fields = val.taskNumber.toString().split(/_/);
					taskNumberOrder.push(fields[1]);
				});
				taskNumberOrder.sort(function(a, b){return a-b});
				taskNumberOrder.map(function(taskNumber, taskNumberkey){
					obj.newlyAdded.map(function(val, key){
						if(("New_"+taskNumber) == val.taskNumber) {
							data.push(val);
						}
					});
				});
			}
			$.merge(data, obj.newItems);
		} else if(sortBy == 'priority') {
			var obj = {high: [], medium: [], low: [], noPriority: []};
			var taskNumber = [];
			data.map(function(val) {
				if(val.type != 'DIVIDER') {
					val.priority = val.priority ? val.priority : val.taskPriority;
					if(val.priority == 'High') {
						obj['high'].push(val);
					} else if(val.priority == 'Medium') {
						obj['medium'].push(val);
					} else if(val.priority == 'Low') {
						obj['low'].push(val);
					} else {
						obj['noPriority'].push(val);
					}
				}
			});
			data = [];
			if(typeof obj.high != "undefined" && obj.high.length > 0) {
				$.merge(data, obj.high);
			}
			if(typeof obj.medium != "undefined" && obj.medium.length > 0) {
				$.merge(data, obj.medium);
			}
			if(typeof obj.low != "undefined" && obj.low.length > 0) {
				$.merge(data, obj.low);
			}
			if(typeof obj.noPriority != "undefined" && obj.noPriority.length > 0) {
				$.merge(data, obj.noPriority);
			}
		} else if(sortBy == 'taskNumber') {
			var taskNumberOrder = [];
			var newlyAdded = [];
			var newItems = [];
			var newData = [];
			data.map(function(val, key) {
				if(val.type != 'DIVIDER') {
					val.state = val.state ? val.state : val.taskState;
					val.priority = val.priority ? val.priority : 'NoPrioritySet';
					
					if(!val.newItem) {
						var fields = val.taskNumber.toString().split(/_/);
						if(fields[0] && fields[0] != 'New') {
							taskNumberOrder.push(val.taskNumber);
						} else {
							newlyAdded.push(val);
						}
					} else {
						newItems.push(val);
					}
				}
			});
			taskNumberOrder.sort(function(a, b){return a-b});
			taskNumberOrder.map(function(taskNumber, taskNumberkey){
				data.map(function(val, key){
					if(taskNumber == val.taskNumber) {
						newData.push(val);
					}
				});
			});
			data = newData;
			if(newlyAdded.length > 0) {
				taskNumberOrder = [];
				newlyAdded.map(function(val, key) {
					var fields = val.taskNumber.toString().split(/_/);
					taskNumberOrder.push(fields[1]);
				});
				taskNumberOrder.sort(function(a, b){return a-b});
				taskNumberOrder.map(function(taskNumber, taskNumberkey){
					newlyAdded.map(function(val, key){
						if(("New_"+taskNumber) == val.taskNumber) {
							data.push(val);
						}
					});
				});
			}
			if(newItems.length > 0) {
				$.merge(data, newItems);
			}
		}
		if(this.state.taskData.filterBy) {
			if(this.state.taskData.filterBy == "changedTasks") {
				var obj = [];
				data.map(function(val) {
					if(val.diffOpType && (val.diffOpType == "MODIFIED" || val.diffOpType == "NEW" || val.diffOpType == "DELETED")) {
						obj.push(val);
					}
				});
				data = obj;
			} else if(this.state.taskData.filterBy == "openTasks") {
				var obj = [];
				data.map(function(val) {
					if((typeof val.state != "undefined" && val.state != "Accepted" && val.state != "NoLongerApplicable") || (typeof val.taskState != "undefined" && val.taskState != "Accepted" && val.taskState != "NoLongerApplicable")) {
						obj.push(val);
					} else if(sortBy == "manual" && mode == "read" && val.taskType && val.taskType == "DIVIDER") {
						obj.push(val);
					} 
				});
				data = obj;
			}
		}
		var tasksLength = 0;
		data.map(function(val, key) {
			if(val.type == 'TASK_REQUEST') {
				tasksLength++;
			}
		});
		var taskLength = data.length;
		var addLastTaskCls = false;
		return (
			<div className="accordion-state1 connectedSortable panel-group" id={"accordion-"+divId}>
				{
				
					data.map(function(val, key){
						if((taskLength-1) == key) {
							$('#sorting').hide();
							addLastTaskCls = true;
						}
						if(val.taskType) { val.type = val.taskType; }
						if(val.taskState) { val.state = val.taskState; }
						if(val.taskPriority) { val.priority = val.taskPriority; }
						
						if(val.priority == undefined) val.priority = 'NoPrioritySet';
						
						if(typeof val.index == 'undefined')  { val.index = key}
						if(val.type == 'DIVIDER') {
							return <TaskListsComp items={val} keyVal={val.index} key={val.index+val.type+"_"+val.taskId} propKey={val.index+val.type+"_"+val.taskId} mode={mode} tasksLength={tasksLength} writers={writers} favWriters={favWriters} currentUser={currentUser} divId={divId} storeId={storeId} addLastTaskCls={addLastTaskCls} slideTask={slideTask} toggleTaskIndex={toggleTaskIndex}/>
						} else {
							return <TaskListsComp items={val} keyVal={val.index} key={val.index+"_"+val.taskNumber+"_"+val.taskId} propKey={val.index+"_"+val.taskNumber+"_"+val.taskId} mode={mode} tasksLength={tasksLength} allWriters={allWriters} writers={writers} favWriters={favWriters} currentUser={currentUser} divId={divId} taskNum={taskNum} storeId={storeId} isChecklist={isChecklist} addLastTaskCls={addLastTaskCls} slideTask={slideTask} toggleTaskIndex={toggleTaskIndex}/>
						}
					})
				}
			</div>
		);
	},
});
module.exports = TaskLists;