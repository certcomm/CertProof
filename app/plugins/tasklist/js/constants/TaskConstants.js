var keyMirror = require('fbjs/lib/keyMirror');
// Define action constants
module.exports = keyMirror({
	RECIEVE_TASKDATA: null,
	UPDATE_TASKDATA: null,
	GET_UPDATED_JSON: null,
	DELETE_TASK: null,
	ADD_NEW_TASK: null,
	ADD_NEW_DIVIDER: null,
	CANCEL_NEW_TASK: null,
	SAVE_NEW_TASK: null,
	CHANGE_VIEW_MODE: null,
	MANUAL_SORT_DATA: null,
	SET_WRITERS: null,
	SET_FAV_WRITERS: null,
	UPDATE_WRITERS: null,
	UPDATE_FAV_WRITERS: null,
	CHECK_TASK_EMPTY_SLIDE: null,
	TASKS_SORT_BY: null,
	TASKS_FILTER_BY: null,
	TASK_SLIDE_TOGGLE: null
});
