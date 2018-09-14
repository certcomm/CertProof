var React = require('react');
var ReactDOM = require('react-dom');
var TaskAPI = require('./utils/TaskAPI')
var TaskApp = require('./components/TaskApp.react');
var TaskActions = require('./actions/TaskActions');
var TaskStore = require('./stores/TaskStore');
// Load Mock API Call
// Render TMail Task List Controller View
var allStoreIds = {};
var App = {
	data: {},
	undeletedData: {},
	storeId: '0-0-0',
	getData: function(divId, undeleted) {
		var json = {};
		if(divId) {
			json = TaskStore.getStoreJson(allStoreIds[divId]);
		} else {
			json = JSON.parse(JSON.stringify(this.data));
		}
		this.undeletedData = JSON.parse(JSON.stringify(json));

		// if undeleted then should return data without any modification
		if(undeleted) return this.undeletedData;

		var arr = [];
		var emptyTasksKey = [];
		var me = this;
		
		json.taskables.map(function(val, key) {
			if(val.newItem) {
				delete val.newItem;
			}		
			if(val.assignees) { 
				arr = $.merge(arr, val.assignees);
			}
			if(val.requester) {
				arr.push(val.requester);
			}
			if(val.isTitleEmpty) {
				emptyTasksKey.push(key);
			}
			if(json.mode == "template") {
				val.requester = "";
			}
			if(typeof val.shouldUpdateHeader != "undefined") {
				delete val.shouldUpdateHeader;
			}
		});
		
		if(typeof json.sortData != "undefined") {
			var newData = [];
			json.sortData.map(function(val, key) {
				var fields = val.split(/sort_/);
				json.taskables[fields[1]].index = key;
				newData.push(json.taskables[fields[1]]);
			});
			json.taskables = newData;
			delete json.sortData;
		}
		if(typeof json.sortBy != "undefined") {
			delete json.sortBy;
		}
		if(typeof json.filterBy != "undefined") {
			delete json.filterBy;
		}
		if(typeof json.slideTask != "undefined") {
			delete json.slideTask;
		}
		if(typeof json.toggleTaskIndex != "undefined") {
			delete json.toggleTaskIndex;
		}
		if(typeof json.baseUrl != "undefined") {
			delete json.baseUrl;
		}
		if(typeof json.tmailNum != "undefined") {
			delete json.tmailNum;
		}
		if(typeof json.secNum != "undefined") {
			delete json.secNum;
		}
		if(typeof json.sectionTitle != "undefined") {
			delete json.sectionTitle;
		}
		if(typeof json.tmailSubject != "undefined") {
			delete json.tmailSubject;
		}
		if(typeof json.fwdtmailSubject != "undefined") {
			delete json.fwdtmailSubject;
		}
		if(typeof json.fwdtmailNum != "undefined") {
			delete json.fwdtmailNum;
		}
		if(typeof json.mailboxType != "undefined") {
			delete json.mailboxType;
		}
		if(typeof json.taskNum != "undefined") {
			delete json.taskNum;
		}
		if(typeof json.fwdtaskNum != "undefined") {
			delete json.fwdtaskNum;
		}
		if(typeof json.cnum != "undefined") {
			delete json.cnum;
		}
		if(typeof json.expandTask != "undefined") {
			delete json.expandTask;
		}
		
		if(emptyTasksKey.length > 0) {
			$.each(emptyTasksKey, function(i, k){
				json.taskables.splice(k, 1)
			});
			json.taskables.map(function(val, key) {
				json.taskables[key].index = key;
			});
		}
		
		/* for deleted tasks and divider */
		var newData = [];
		json.taskables.map(function(val, key) {
			if(typeof val.deleted == "undefined" || val.deleted == false) {
				val.index = newData.length;
				newData.push(val);
			}
			delete json.taskables[key].taskId;
		});
		json.taskables = newData;
		/* for deleted tasks and divider */
		var uniqueVals = [];
		$.each(arr, function(i, el){
			if($.inArray(el, uniqueVals) === -1) uniqueVals.push(el);
		});
		json.lastTaskNumber = -1;  // update last task number value for delete from json
		delete json.lastTaskNumber;	// delete last task number 
		if(typeof json.updateComponent != "undefined") {
			delete json.updateComponent; // used for progressbar component update 
		}
		json.additionalActors = uniqueVals;
		json.isValidationIssue ? delete json.isValidationIssue : '';
		if(typeof json.isChecklist != "undefined" && json.isChecklist == false) {
			delete json.isChecklist;
		}
		return (json);
	},
	setData: function(data) {
		this.data = JSON.parse(JSON.stringify(data));
		TaskAPI.setTaskData(this.data, this.storeId);
	},
	updateTaskNumData: function(taskNum) {
		TaskActions.updateTaskData("Null", 'taskNum', taskNum, this.storeId);
	},
	loadSection: function(obj){
		var data = obj.data;
		var divId = obj.divId;
		var filterBy = obj.filterBy;
		var sortBy = obj.sortBy;
		var hideHeader = obj.hideHeader;
		var expandTask = obj.expandTask;
		var addNewTask = obj.addNewTask;
		var writers = obj.writers;
		var favWriters = obj.favWriters;
		var taskNum = obj.taskNum;
		var tmailNum = obj.tmailNum ? obj.tmailNum : '0';
		var fwdtmailNum = obj.fwdtmailNum ? obj.fwdtmailNum : '0';
		var secNum = obj.secNum ? obj.secNum : '0';
		var changeNum = obj.changeNum ? obj.changeNum : '0';
		var isDiffMode = obj.isDiffMode ? obj.isDiffMode : (data.wereTasksReordered ? true : false);
		data.isChecklist = data.isChecklist && data.mode == "template" ? data.isChecklist : (obj.isChecklist ? obj.isChecklist : false);
		data.baseUrl = obj.baseUrl;
		data.tmailNum = obj.tmailNum;
		data.fwdtmailNum = fwdtmailNum;
		data.secNum = obj.secNum;
		data.mailboxType = obj.mailboxType;
		data.sectionTitle = obj.sectionTitle;
		data.tmailSubject = obj.tmailSubject;
		data.fwdtmailSubject = obj.fwdtmailSubject;
		data.cnum = obj.cnum;
		data.taskNum = obj.taskNum;
		this.currentUser = JSON.parse(JSON.stringify(obj.currentUser));
		this.storeId = tmailNum+'-'+secNum+'-'+changeNum;
		var diffVersion1 = obj.diffVersion1;
		var diffVersion2 = obj.diffVersion2;
		if(isDiffMode) {
			var obj = {accepted: [], delivered: [], finished: [], restart: [], started: [], unstarted: [], noLonger: [], newlyAdded: [], open: []};
			var newData = [];
			data.taskables.map(function(val, key) {
				val.index = key;
				if(val.diffOpType == "DELETED") {
					data.taskables[key].title = "";
					data.taskables[key].description = "";
					data.taskables[key].requester = "";
					data.taskables[key].taskState = "";
					data.taskables[key].taskPriority = "";
					data.taskables[key].assignees= [];
					data.taskables[key].taskType = "TASK_REQUEST";
					if(val.baseValue) {
						data.taskables[key].title =  val.baseValue.title ?  val.baseValue.title : "";
						data.taskables[key].description =  val.baseValue.description ?  val.baseValue.description : "";
						data.taskables[key].requester =  val.baseValue.requester ?  val.baseValue.requester : "";
						data.taskables[key].taskState =  val.baseValue.taskState ?  val.baseValue.taskState : "";
						data.taskables[key].taskPriority =  val.baseValue.taskPriority ?  val.baseValue.taskPriority : "";
						data.taskables[key].assignees =  val.baseValue.assignees ?  val.baseValue.assignees : [];
					}
				}
				
				if(!val.newItem) {
					if((val.state && val.state == 'Accepted') || (val.taskState && val.taskState == 'Accepted')) {
						obj['accepted'].push(val);
					} else if((val.state && val.state == 'Delivered') || (val.taskState && val.taskState == 'Delivered')) {	 
						obj['delivered'].push(val);
					} else if((val.state && val.state == 'Finished') || (val.taskState && val.taskState == 'Finished')) {	
						obj['finished'].push(val);
					} else if((val.state && val.state == 'Rejected') || (val.taskState && val.taskState == 'Rejected')) {
						obj['restart'].push(val);
					} else if((val.state && val.state == 'Started') || (val.taskState && val.taskState == 'Started')) {
						obj['started'].push(val);
					} else if((val.state && val.state == 'Unstarted') || (val.taskState && val.taskState == 'Unstarted')) {
						obj['unstarted'].push(val);
					} else if((val.state && val.state == 'NoLongerApplicable') || (val.taskState && val.taskState == 'NoLongerApplicable')) {
						obj['noLonger'].push(val);
					} else {
						obj['open'].push(val);
					}
				}
			});
			if(typeof obj.accepted != "undefined" && obj.accepted.length > 0) {
				$.merge(newData, obj.accepted);
			}
			if(typeof obj.delivered != "undefined" && obj.delivered.length > 0) {
				$.merge(newData, obj.delivered);
			}
			if(typeof obj.finished != "undefined" && obj.finished.length > 0) {
				$.merge(newData, obj.finished);
			}
			if(typeof obj.restart != "undefined" && obj.restart.length > 0) {
				$.merge(newData, obj.restart);
			}
			if(typeof obj.started != "undefined" && obj.started.length > 0) {
				$.merge(newData, obj.started);
			}
			if(typeof obj.unstarted != "undefined" && obj.unstarted.length > 0) {
				$.merge(newData, obj.unstarted);
			}
			if(typeof obj.noLonger != "undefined" && obj.noLonger.length > 0) {
				$.merge(newData, obj.noLonger);
			}
			data.taskables = newData;
			data.filterBy = "changedTasks"; 
		}
		
		// if getting from component then it should
		if(filterBy) data.filterBy = filterBy;
		if(sortBy) data.sortBy = sortBy;
		
		/*if(this.currentUser.prefix && this.currentUser.org_name) {
			this.currentUser.defaultAddress = this.currentUser.prefix + "$" + this.currentUser.org_name + ".tmail21.com";
		}*/
		allStoreIds[divId] = this.storeId; // for getting specific store data
		if(writers) {
			this.setWritersData(writers, favWriters, data);
		}
		if(favWriters) {
			this.setFavWritersData(favWriters, writers);
		}
		this.setData(data);
		ReactDOM.render(
		  <TaskApp mode={this.data.mode} hideHeader={hideHeader} expandTask={expandTask} isDiffMode={isDiffMode} currentUser={this.currentUser ? this.currentUser : ''} divId={divId} taskNum={taskNum} storeId={this.storeId} diffVersion1={diffVersion1} diffVersion2={diffVersion2} isChecklist={data.isChecklist} />,
		  document.getElementById(divId)
		);
		},
	setWritersData: function(writers, favWriters, data) {
		var duplicateValues = [];
		var taskData = data;
		var fullAdressWriters = {};
		writers.push(this.currentUser);
		writers.map(function(val, key) {
			if(val.prefix && val.org_name) {
				var fullAdress = val.prefix + "$" + val.org_name + "." + "tmail21.com";
				//val.defaultAddress = val.address;
				val.fullAdress = fullAdress;
				fullAdressWriters[fullAdress] = val;
			}
		});
		if(taskData.taskables.length > 0){
			taskData.taskables.map(function(task, key){
				if(task.requester && task.requester != ""){
					if(fullAdressWriters[task.requester]) {
						task.requester = fullAdressWriters[task.requester].address;
					}
				}
				if(task.assignees && task.assignees.length > 0) {
					task.assignees.map(function(assignee, keyAssignee) {
						if(fullAdressWriters[assignee]) {
							task.assignees[keyAssignee] = fullAdressWriters[assignee].address;
						}
					});
				}
			});
		}
		//this.setData(taskData);
		this.writers = JSON.parse(JSON.stringify(writers));
		TaskAPI.setWritersData(writers);
	},
	setFavWritersData: function(favWriters, writers) {
		var duplicateValues = [];
		if(typeof favWriters != 'undefined') {
			var obj = favWriters;
			Object.keys(obj).map(function (key) {
				writerAddress = obj[key][1];
				writerName = obj[key][0];
				if(writers) {
					writers.map(function(val, key) {
						if(val.address == writerAddress) {
							if(duplicateValues.indexOf(val.address) == -1) {
								duplicateValues.push(val.address);
							}
						}
					});
				}
			});
		}
		if(duplicateValues.length > 0){
			var data = [];
			var obj = favWriters;
			Object.keys(obj).map(function (key) {
				if(duplicateValues.indexOf(obj[key][1]) == -1) {
					data.push(obj[key]);
				}
			});
			favWriters = data;
		}
		this.favWriters = JSON.parse(JSON.stringify(favWriters));
		TaskAPI.setFavWritersData(favWriters, writers);
	},
	validationIssue: function() {
		var json = JSON.parse(JSON.stringify(this.data));
		var hasContent = false;
		var currentUserAddress = this.currentUser.address;
		var taskLength = json.taskables.length;
		json.taskables.map(function(val, key) {
			if((val.title == '') && (val.description != '' || val.requester != '' || val.assignees.length > 0) && (taskLength > 1 && !val.newItem)) {
				hasContent = true;
			}
		});
		if(json.isValidationIssue && hasContent) {
			return true;
		} else  {
			return false;
		}
	},
	destroyTasklistComponent: function(id) {
		ReactDOM.unmountComponentAtNode(document.getElementById(id));
	}
}
module.exports = App;