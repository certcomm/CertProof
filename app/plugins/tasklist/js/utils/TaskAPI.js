var TaskActions = require('../actions/TaskActions');
var writersActions = require('../actions/WritersActions');
module.exports = {
	setTaskData: function(data, storeId) {
		TaskActions.recieveTaskData(data, storeId);
	},
	setWritersData: function(writers) {
		writersActions.setWriters(writers);
	},
	setFavWritersData: function(favWriters, writers) {
		writersActions.setFavWriters(favWriters, writers);
	}
};