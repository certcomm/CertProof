var AppDispatcher = require('../dispatcher/AppDispatcher');
var TaskConstants = require('../constants/TaskConstants');
// Define action methods
var WritersActions = {
	setWriters: function(writers) {
		AppDispatcher.handleAction({
		  actionType: TaskConstants.SET_WRITERS,
		  writers: writers
		})
	},
	setFavWriters: function(favWriters, writers) {
		AppDispatcher.handleAction({
		  actionType: TaskConstants.SET_FAV_WRITERS,
		  favWriters: favWriters,
		  writers: writers
		})
	},
	updateWritersStore: function(writers, favWriters, value) {
		AppDispatcher.handleAction({
		  actionType: TaskConstants.UPDATE_WRITERS,
		  writers: writers,
		  favWriters: favWriters,
		  value: value
		})
	},
	updateFavWritersStore: function(writers, value) {
		AppDispatcher.handleAction({
		  actionType: TaskConstants.UPDATE_FAV_WRITERS,
		  writers: writers,
		  value: value
		})
	}
};
module.exports = WritersActions;