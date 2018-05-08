var AppDispatcher = require('../dispatcher/AppDispatcher');
var TaskConstants = require('../constants/TaskConstants');
// Define action methods
var TaskActions = {
	recieveTaskData: function(data, storeId) {
		AppDispatcher.handleAction({
		  actionType: TaskConstants.RECIEVE_TASKDATA,
		  data: data,
		  storeId: storeId
		})
	},
	updateTaskData: function(keyIndex, indexName, val, storeId) {
		AppDispatcher.handleAction({
		  actionType: TaskConstants.UPDATE_TASKDATA,
		  key: keyIndex,
		  indexName: indexName,
		  value: val,
		  storeId: storeId
		})
	},
	getUpdatedJson: function(storeId) {
		AppDispatcher.handleAction({
		  actionType: TaskConstants.GET_UPDATED_JSON,
		  storeId: storeId
		})
	},
	changeViewMode: function(flag, storeId) {
		AppDispatcher.handleAction({
			actionType: TaskConstants.CHANGE_VIEW_MODE,
			flag: flag,
			storeId: storeId
		})
	},
	manualSortData: function(data, storeId) {
		AppDispatcher.handleAction({
			actionType: TaskConstants.MANUAL_SORT_DATA,
			data: data,
			storeId: storeId
		})
	},
	slideTaskAndCheckTitle: function(slideId, arrowId) {
		AppDispatcher.handleAction({
			actionType: TaskConstants.CHECK_TASK_EMPTY_SLIDE,
			slideId: slideId,
			arrowId: arrowId
		})
	},
	tasksSortBy: function(sortBy, storeId) {
		AppDispatcher.handleAction({
		  actionType: TaskConstants.TASKS_SORT_BY,
		  sortBy: sortBy,
		  storeId: storeId
		})
	},
	tasksFilterBy: function(filterBy, storeId) {
		AppDispatcher.handleAction({
		  actionType: TaskConstants.TASKS_FILTER_BY,
		  filterBy: filterBy,
		  storeId: storeId
		})
	},
	slideTaskToggle: function(key, storeId, view) {
		AppDispatcher.handleAction({
		  actionType: TaskConstants.TASK_SLIDE_TOGGLE,
		  key: key,
		  storeId: storeId,
		  view: view
		})
	}
};
module.exports = TaskActions;