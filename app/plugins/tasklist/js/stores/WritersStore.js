var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TaskConstants = require('../constants/TaskConstants');
var _ = require('underscore');
// Define initial data points
var _writers = {};
var _stateData, _changeViewData = {};
var addedTask = false;
function loadTaskData(data){
	_writers = data;
}
function updateWriters(writers, favWriters, value) {
	if(favWriters) {
		favWriters.map(function(val, key) {
			if(val.address == value) {
				writers.push(val);
			}
		});
	}
	_writers = writers;
}
var WritersStore = _.extend({}, EventEmitter.prototype, {
	// Return Product data
	getData: function() {
		return _writers;
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
		case TaskConstants.SET_WRITERS:
			loadTaskData(action.writers);
		break;
		case TaskConstants.UPDATE_WRITERS:
			updateWriters(action.writers, action.favWriters, action.value);
		break;
		default:
		  return true;
	}
	// If action was responded to, emit change event
	  WritersStore.emitChange();
	return true;
});
module.exports = WritersStore;