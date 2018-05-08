var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TaskConstants = require('../constants/TaskConstants');
var _ = require('underscore');
// Define initial data points
var _taskData = [];
var _stateData, _editViewData = [];
var addedTask = false;
function loadTaskData(data, storeId){
	_editViewData[storeId] = JSON.parse(JSON.stringify(data));
	_taskData[storeId] = data;
	addedTask = false;
	var count = 0;
	var value = 0;
	var arr = [];
	var uniqueVals = [];
	if(_taskData[storeId].taskables && _taskData[storeId].taskables.length > 0){
		_taskData[storeId].taskables.map(function(val, key){
			if(val.type == 'TASK_REQUEST'){
				var fields = val.taskNumber.toString().split(/_/);
				if(fields[1]) {
					if(value < parseInt(fields[1])) {
						value = parseInt(fields[1]);
					}
				} else {
					if(value < parseInt(val.taskNumber)) {
						value = parseInt(val.taskNumber);
					}
				}
				// add additionalActors to json
				if(val.assignees) {
					arr = $.merge(arr, val.assignees);
				}
				if(val.requester){
					arr.push(val.requester);
				}
				
				if(!val.priority){
					val.priority = 'NoPrioritySet';
				}
			}
			_taskData[storeId].taskables[key].taskId = "tid_"+key;
		});
	}
	_taskData[storeId].lastTaskNumber = value;	
	_taskData[storeId].additionalActors = [];
	
	$.each(arr, function(i, el){
		if($.inArray(el, uniqueVals) === -1) uniqueVals.push(el);
	});
	if(uniqueVals.length > 0) {
		_taskData[storeId].additionalActors = uniqueVals;
	}
}
function updateData(key, indexName, indexValue, storeId) {
	/*if(_taskData[storeId].taskables[key]["type"] == "DIVIDER"){
		addedTask = false;
	}*/
	_taskData[storeId].taskables[key][indexName] = indexValue;
	if(typeof _taskData[storeId].taskables[key].shouldUpdateHeader != "undefined") { // for header panel
		delete _taskData[storeId].taskables[key].shouldUpdateHeader;
	}
	if(typeof _taskData[storeId].updateComponent != "undefined") { // for progress bar
		delete _taskData[storeId].updateComponent;
	}
	if(indexName == "title") {
		if(_taskData[storeId].taskables[key]["title"] == ""){
			_taskData[storeId].taskables[key].isTitleEmpty = true;
			_taskData[storeId].isValidationIssue = true;
		} else {
			delete _taskData[storeId].taskables[key].isTitleEmpty;
			delete _taskData[storeId].isValidationIssue;
		}
	}
	if(indexName == "title" || indexName == "assignees" || indexName == "state" || indexName == "requester") {
		_taskData[storeId].taskables[key].shouldUpdateHeader = true;
	}
	if(indexName == "state") {
		_taskData[storeId].updateComponent = true;
	}
}
function getUpdatedJson(storeId){
	if(typeof _taskData[storeId].sortData != "undefined") {
		var newData = [];
		_taskData[storeId].sortData.map(function(val, key) {
			var fields = val.split(/sort_/);
			_taskData[storeId].taskables[fields[1]].index = key;
			newData.push(_taskData[storeId].taskables[fields[1]]);
			delete _taskData[storeId].taskables[key].shouldUpdateHeader;
		});
		_taskData[storeId].taskables = newData;
		delete _taskData[storeId].sortData;
	}
	var newData = [];
	_taskData[storeId].taskables.map(function(val, key) {
		if(typeof val.deleted == "undefined" || val.deleted == false) {
			val.index = newData.length;
			newData.push(val);
		}
		delete _taskData[storeId].taskables[key].taskId;
	});
	_taskData[storeId].taskables = newData;
	if(typeof _taskData[storeId].sortBy != "undefined") {
		delete _taskData[storeId].sortBy;
	}
	if(typeof _taskData[storeId].filterBy != "undefined") {
		delete _taskData[storeId].filterBy;
	}
	if(typeof _taskData[storeId].updateComponent != "undefined") {
		delete _taskData[storeId].updateComponent; // used for progressbar component update 
	}
	if(typeof _taskData[storeId].slideTask != "undefined") {
		delete _taskData[storeId].slideTask;
	}
	if(typeof _taskData[storeId].toggleTaskIndex != "undefined") {
		delete _taskData[storeId].toggleTaskIndex;
	}
	data = _taskData[storeId]; // get json for develpor mode
}
function changeViewMode(mode, storeId) {
	if(mode == 'template') {
		_taskData[storeId] = JSON.parse(JSON.stringify(_editViewData[storeId]));
		_taskData[storeId].taskables.map(function(val,key) {
			val.state = 'Unstarted';
			val.requester = '';
			val.assignees = [];
		});
	} else {
		_taskData[storeId] = JSON.parse(JSON.stringify(_editViewData[storeId]));
	}
	_taskData[storeId].mode = mode;
	addedTask = false;
}
function manualSortData(data, storeId){
	_taskData[storeId].sortData = data;
}
function tasksFilterBy(filterBy, storeId) {
	if(typeof _taskData[storeId].sortData != "undefined" && filterBy != "all") {
		var newData = [];
		_taskData[storeId].sortData.map(function(val, key) {
			var fields = val.split(/sort_/);
			_taskData[storeId].taskables[fields[1]].index = key;
			newData.push(_taskData[storeId].taskables[fields[1]]);
		});
		_taskData[storeId].taskables = newData;
		delete _taskData[storeId].sortData;
	}
	_taskData[storeId].filterBy = filterBy;
}
function slideTaskAndCheckTitle(slideId, arrowId) {
	/*Before slideDown toggle collapse panel*/
	if(!($(slideId).hasClass('in'))){
		//display none some content
		//$(me).parent().siblings().hide();
		$(slideId).parent().addClass('impBackgroundFFF');
		$(slideId).parent().children('.panel-heading').children('div').not('.arrow-icon-outter').css({
			'display': 'none'
		});
	} else  {
		$(slideId).parent().removeClass('impBackgroundFFF');
		$(slideId).parent().children('.panel-heading').children('div').not('.arrow-icon-outter').css({
			'display': 'block'
		});
	}
	/*slideDown toggle collapse panel*/
	$(slideId).slideToggle(500);				
	/*After slideDown toggle collapse panel*/
	$(slideId).toggleClass('in');
	if ($(arrowId).hasClass('glyphicon-chevron-right')) {
		$(arrowId).removeClass('glyphicon-chevron-right');
		$(arrowId).addClass('glyphicon-chevron-down');
	} else {
		$(arrowId).removeClass('glyphicon-chevron-down');
		$(arrowId).addClass('glyphicon-chevron-right');
	}
}

function slideTaskToggle(key, storeId, view) {
		_taskData[storeId].toggleTaskIndex = !view ? -1 : key;
		_taskData[storeId].slideTask = view;
		_taskData[storeId].taskables[key].shouldUpdateHeader = true;
}

function tasksSortBy(sortBy, storeId) {
	if(typeof _taskData[storeId].sortData != "undefined" && (sortBy != "" || sortBy != "manual")) {
		var newData = [];
		_taskData[storeId].sortData.map(function(val, key) {
			var fields = val.split(/sort_/);
			_taskData[storeId].taskables[fields[1]].index = key;
			newData.push(_taskData[storeId].taskables[fields[1]]);
		});
		_taskData[storeId].taskables = newData;
		delete _taskData[storeId].sortData;
	}
	_taskData[storeId].sortBy = sortBy;
}
// Extend TaskStore with EventEmitter to add eventing capabilities
var TaskStore = _.extend({}, EventEmitter.prototype, {
	// Return Product data
	getData: function(storeId) {
		// if filterBy not set then it should be openTasks by default
		if(!_taskData[storeId].filterBy) _taskData[storeId].filterBy = "openTasks";
		
		return _taskData[storeId];
	},
	getStoreJson: function(storeId) {
		return _taskData[storeId]; // get json for specific store
	},
	// Emit Change event
	emitChange: function() {
		this.emit('change');
	},
	// Add change listener
	addChangeListener: function(callback) {
		this.on('change', callback);
	},
	// Remove change listener
	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	}
});
// Register callback with AppDispatcher
AppDispatcher.register(function(payload) {
	var action = payload.action;
	var text;
	switch(action.actionType) {
		case TaskConstants.RECIEVE_TASKDATA:
		  loadTaskData(action.data, action.storeId);
		 // TaskStore.emitChange();
		break;
		case TaskConstants.UPDATE_TASKDATA:
			updateData(action.key, action.indexName, action.value, action.storeId);
			TaskStore.emitChange();
		break;
		case TaskConstants.GET_UPDATED_JSON:
			getUpdatedJson(action.storeId);
			TaskStore.emitChange();
		break;
		case TaskConstants.CHANGE_VIEW_MODE:
			changeViewMode(action.flag, action.storeId);
			TaskStore.emitChange();
		break;
		case TaskConstants.MANUAL_SORT_DATA:
			manualSortData(action.data, action.storeId)
		break;
		case TaskConstants.CHECK_TASK_EMPTY_SLIDE:
			slideTaskAndCheckTitle(action.slideId, action.arrowId);
		break;
		case TaskConstants.TASK_SLIDE_TOGGLE: 
			slideTaskToggle(action.key, action.storeId, action.view);
			TaskStore.emitChange();
		break;
		case TaskConstants.TASKS_SORT_BY:
			tasksSortBy(action.sortBy, action.storeId);
			TaskStore.emitChange();
		break;
		case TaskConstants.TASKS_FILTER_BY:
			tasksFilterBy(action.filterBy, action.storeId);
			TaskStore.emitChange();
		break;
	}
	// If action was responded to, emit change event
	return true;
});
module.exports = TaskStore;