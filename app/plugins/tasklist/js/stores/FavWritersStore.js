var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var TaskConstants = require('../constants/TaskConstants');
var _ = require('underscore');
// Define initial data points
var _favWriters = {};
var _stateData, _changeViewData = {};
var addedTask = false;
function loadTaskData(favWriters, writers){
	var data = [];
	if(typeof favWriters != 'undefined') {
		var obj = favWriters;
		Object.keys(obj).map(function (key) {
			var arr = [];
			var addressExists = false;
			var writerAddress = '';
			arr = {name: obj[key][0], address: obj[key][1], type: obj[key][2], org_name: obj[key][3], initial: obj[key][4] ? obj[key][4] : ''}
			writerAddress = obj[key][1];
			if(writers) {
				writers.map(function(val, key) {
					if(val.defaultAddress == writerAddress) {
						addressExists = true;
					}
				});
			}
			if(!addressExists) {
				data.push(arr);
			}
		});
	}
	_favWriters = data;
}

function updateFavWriters(writers, value) {
	writers.map(function(val, key) {
		if(val.address == value) {
			writers.splice(key, 1);
		}
	});
	_favWriters = writers;
}

var FavWritersStore = _.extend({}, EventEmitter.prototype, {
	// Return Product data
	getData: function() {
		return _favWriters;
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
		case TaskConstants.SET_FAV_WRITERS:
		  loadTaskData(action.favWriters, action.writers);
		break;
		case TaskConstants.UPDATE_FAV_WRITERS:
			updateFavWriters(action.writers, action.value);
		break;
		default:
		  return true;
	}
	// If action was responded to, emit change event
	FavWritersStore.emitChange();
	return true;
});
module.exports = FavWritersStore;