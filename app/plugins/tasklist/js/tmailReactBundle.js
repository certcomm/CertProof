require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"../constants/TaskConstants":10,"../dispatcher/AppDispatcher":11}],2:[function(require,module,exports){
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

},{"../constants/TaskConstants":10,"../dispatcher/AppDispatcher":11}],3:[function(require,module,exports){
var React = require('react');
var createReactClass = require('create-react-class');
var ReactDOM = require('react-dom');
var Chosen = createReactClass({
	displayName: 'Chosen',
	chosenRenderd: false,
	componentDidUpdate: function() {
		// chosen doesn't refresh the options by itself, babysit it
		$(ReactDOM.findDOMNode(this.refs.select)).trigger('chosen:updated');
	},
	handleChange: function(a, b, c) {
		// force the update makes it so that we reset chosen to whatever
		// controlled value the parent dictated
		this.forceUpdate();
		this.props.onChange && this.props.onChange(a, b, c);
	},
	componentDidMount: function() {
		var props = this.props;
		var select = $(ReactDOM.findDOMNode(this.refs.select));
		$(select)
		.chosen({
		  allow_single_deselect: props.allowSingleDeselect,
		  disable_search: props.disableSearch,
		  disable_search_threshold: props.disableSearchThreshold,
		  enable_split_word_search: props.enableSplitWordSearch,
		  inherit_select_classes: props.inheritSelectClasses,
		  max_selected_options: props.maxSelectedOptions,
		  no_results_text: props.noResultsText,
		  placeholder_text_multiple: props.placeholderTextMultiple,
		  placeholder_text_single: props.placeholderTextSingle,
		  search_contains: props.searchContains,
		  single_backstroke_delete: props.singleBackstrokeDelete,
		  width: props.width,
		  display_disabled_options: props.displayDisabledOptions,
		  display_selected_options: props.displaySelectedOptions,
		  more_option_enabled: props.moreOption
		})
		.on('chosen:maxselected', this.props.onMaxSelected)
		.change(this.handleChange);
	},
	componentWillUnmount: function() {
		$(ReactDOM.findDOMNode(this.refs.select)).off('chosen:maxselected change');
	},
	render: function() {
		var selectProps = $.extend({}, this.props, {ref: "select"});
		delete selectProps.allowSingleDeselect;
		delete selectProps.disableSearch;
		delete selectProps.disableSearchThreshold;
		delete selectProps.enableSplitWordSearch;
		delete selectProps.inheritSelectClasses;
		delete selectProps.maxSelectedOptions;
		delete selectProps.noResultsText;
		delete selectProps.placeholderTextMultiple;
		delete selectProps.placeholderTextSingle;
		delete selectProps.searchContains;
		delete selectProps.singleBackstrokeDelete;
		delete selectProps.displayDisabledOptions;
		delete selectProps.displaySelectedOptions;
		delete selectProps.moreOption;
		delete selectProps.dataPlaceholder;
		
		return React.createElement("div", null,
			React.createElement("select", selectProps, this.props.children)
		);
	}
});
module.exports = Chosen;

},{"create-react-class":18,"react":"react","react-dom":"react-dom"}],4:[function(require,module,exports){
var React = require('react');
var createReactClass = require('create-react-class');
var ReactDOM = require('react-dom');
var TaskStore = require('../stores/TaskStore');
var TaskLists = require('./TaskLists.react');
var TaskAPI = require('../utils/TaskAPI');
var TaskActions = require('../actions/TaskActions');
var WritersStore = require('../stores/WritersStore');
var favWritersStore = require('../stores/favWritersStore');
var Chosen = require('./ReactChosen.react');
// Method to retrieve state from Stores

var isMobile = function() {
	try{
		document.createEvent("TouchEvent"); return true;
	} catch(e){
		return false;
	}
}

function getTasksState(storeId) {
  return TaskStore.getData(storeId);
}
function getWriters() {
	var writerss = WritersStore.getData();
	var uniqueWriters = [];
	var alreadyExists = false;
	if(writerss.map) {
		writerss.map(function(val) {
			alreadyExists = false;
			uniqueWriters.map(function(arrVal){
				if(arrVal.address == val.address) {
					alreadyExists = true;
				}
			});
			if(!alreadyExists) {
				uniqueWriters.push(val);
			}
		});
	}
	return uniqueWriters;
}
function getFavWriters() {
	return favWritersStore.getData();
}

var Progressbar = createReactClass({
	getInitialState: function() {
		return ({
			taskData: this.props.taskData
		});
	},
	shouldComponentUpdate: function(nextProps, nextState, nextContext) {
		return nextProps.taskData.updateComponent  || nextState.taskData.updateComponent?  true : false;
	},
	render: function() {
		var totalTasks = this.state.taskData.taskables.length;
		var count = 0;
		var progress = 0;
		var divider = 0;
		var NLA = 0;
		var items = this.state.taskData.taskables;
		items.map(function(val) {
			if(val.state == 'Accepted') {
				count++;
			}
			if(val.type == 'DIVIDER') {
				divider++;
			}
			if(val.state == 'NoLongerApplicable' || (val.taskState && val.taskState == 'NoLongerApplicable')){
				NLA++;
			}
		});
		totalTasks = totalTasks - divider - NLA;
		if(count == 0 && totalTasks == 0) {
			progress = 0;
		} else {
			progress = (count / totalTasks) * 100;
		}
		
		var progressBar = "";
		if(this.props.isDiffMode){
			var otherCount = this.state.taskData.otherStats.accepted;
			var otherTotal = this.state.taskData.otherStats.total;
			var otherProgress = (otherCount / otherTotal) * 100;
			var baseCount = this.state.taskData.baseStats.accepted;
			var baseTotal = this.state.taskData.baseStats.total;
			var baseProgress = (baseCount / baseTotal) * 100;
			if(otherCount == baseCount && otherTotal == baseTotal){
				progressBar = React.createElement("div", {className: "progressbar_block progressbar-grn"}, 
					React.createElement("div", {className: "progressbar ui-progressbar ui-widget ui-widget-content ui-corner-all"}, 
						React.createElement("div", {className: "ui-progressbar-value ui-widget-header ui-corner-left", style: {width: otherProgress + "%"}})
					), 
					React.createElement("p", {className: "progressbar_status"}, otherCount + ' / ' + otherTotal)
				);
			} else{
				progressBar = React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "progressbar_block progressbar-grn col-md-8", style: {marginLeft: "-5px", marginRight: "5px"}}, 
								React.createElement("div", {className: "progressbar ui-progressbar ui-widget ui-widget-content ui-corner-all"}, 
									React.createElement("div", {className: "ui-progressbar-value ui-widget-header ui-corner-left", style: {width: otherProgress + "%"}})
								), 
								React.createElement("p", {className: "progressbar_status"}, 
									this.props.diffVersion1 && this.props.diffVersion2 ? React.createElement("span", {className: "diffVersion"}, "V", this.props.diffVersion1, " "): null, 
									otherCount + ' / ' + otherTotal
								)
							), 
							React.createElement("div", {className: "progressbar_block progressbar-orange col-md-4"}, 
								React.createElement("div", {className: "progressbar ui-progressbar ui-widget ui-widget-content ui-corner-all"}, 
									React.createElement("div", {className: "ui-progressbar-value ui-widget-header ui-corner-left", style: {width: baseProgress + "%"}})
								), 
								React.createElement("p", {className: "progressbar_status"}, 
									this.props.diffVersion1 && this.props.diffVersion2 ? React.createElement("span", {className: "diffVersion", title: "('baseline' state was [" + baseCount + " of " + baseTotal + "])"}, "V", this.props.diffVersion2, " "): null, 
									baseCount + ' / ' + baseTotal
								)
							)
						);
			}			
		} else {
			progressBar = React.createElement("div", {className: "progressbar_block progressbar-grn"}, 
					React.createElement("div", {className: "progressbar ui-progressbar ui-widget ui-widget-content ui-corner-all"}, 
						React.createElement("div", {className: "ui-progressbar-value ui-widget-header ui-corner-left", style: {width: progress + "%"}})
					), 
					React.createElement("p", {className: "progressbar_status"}, count + ' / ' + totalTasks)
				);
		}
		
		return (
			React.createElement("div", null, 
				progressBar
			)
		);
	}
});

var SortTasks = createReactClass({
	delayHandleEvents: function(obj) {
		var sortBy = obj.targetValue;
		var divId = obj.divId;
		var storeId = obj.storeId;
		TaskActions.tasksSortBy(sortBy, storeId);
		if((sortBy != 'manual' && sortBy != '') || (this.props.filterBy != 'all')) {
			if ($('#accordion-'+divId).is('.ui-sortable')) {
				$('#accordion-'+divId).sortable('destroy');
				$('#add-task-panel').parent('div').addClass('hideTaskBtn');
			}
		} else {
			if (!$('#accordion-'+divId).is('.ui-sortable')) {
				$('#add-task-panel').parent('div').removeClass('hideTaskBtn');
				//$('.panel-blue').show();
				var firstList = $('#accordion-'+divId);
				firstList.sortable({
					 connectWith: ".connectedSortable",
					 cancel: 'div.impBackgroundFFF',
					 //delay: !isMobile() ? 300 : 0,
					 scroll: true,
						scrollSensitivity: 100,
						scrollSpeed: 30,
					 start: function( event, ui ) {
						 ui.placeholder.height(ui.helper[0].scrollHeight);
					 },
					 stop: function(event, ui) {
						TaskActions.manualSortData($('#accordion-'+divId).sortable("toArray"), storeId);
					 },
					 cursor: "move",
					 placeholder: 'ui-state-highlight'
				});
			}
		}
	},
	handleChange: function(event){
		var obj = {
			targetValue: event.target.value,
			divId: this.props.divId,
			storeId: this.props.storeId
		};
		setTimeout(this.delayHandleEvents.bind(this, obj), 500); 
		$('#sorting').show().focus();
	},
	handleClick: function(event) {
		if(this.props.sortBy && this.props.sortBy == event.target.value) {
			return;
		} else {
			var obj = {
				targetValue: event.target.value,
				divId: this.props.divId,
				storeId: this.props.storeId
			};
			setTimeout(this.delayHandleEvents.bind(this, obj), 500); 
			$('#sorting').show().focus();
		}
	},
	shouldComponentUpdate: function(nextProps, nextState, nextContext) {
		return (nextProps.sortBy != this.props.sortBy);
	},
	render: function() {
		if(this.props.isChecklist) {
			return (
				React.createElement("div", null, 
					React.createElement("span", {style: {marginRight: "10px", float: "left"}}, "Sort By"), 
					React.createElement(Chosen, {name: "custom-sort-by", className: "chosen-select chosen-select-custom", defaultValue: this.props.sortBy, onChange: this.handleChange, onClick: this.handleClick, key: "select-"+this.props.sortBy, disableSearch: true, inheritSelectClasses: true}, 
						React.createElement("option", {value: "manual"}, "Manual"), 
						React.createElement("option", {value: "taskNumber"}, "Task #"), 
						React.createElement("option", {value: "priority"}, "Priority")
					)
				)
			);
		}
	
		if(this.props.isDiffMode) {
			return (
				React.createElement("div", null, 
					React.createElement("span", {style: {marginRight: "10px", float: "left"}}, "Sort By"), 
					React.createElement(Chosen, {name: "custom-sort-by", className: "chosen-select chosen-select-custom", defaultValue: this.props.sortBy, onChange: this.handleChange, onClick: this.handleClick, key: "select-"+this.props.sortBy, disableSearch: true, inheritSelectClasses: true}, 
						React.createElement("option", {value: "state"}, "State"), 
						React.createElement("option", {value: "taskNumber"}, "Task #"), 
						React.createElement("option", {value: "priority"}, "Priority")
					)
				)
			);
		} else {
			return (
				React.createElement("div", null, 
					React.createElement("span", {style: {marginRight: "10px", float: "left"}}, "Sort By"), 
					React.createElement(Chosen, {name: "custom-sort-by", className: "chosen-select chosen-select-custom", defaultValue: this.props.sortBy, onChange: this.handleChange, onClick: this.handleClick, key: "select-"+this.props.sortBy, disableSearch: true, inheritSelectClasses: true}, 
						React.createElement("option", {value: "manual"}, "Manual"), 
						React.createElement("option", {value: "state"}, "State"), 
						React.createElement("option", {value: "taskNumber"}, "Task #"), 
						React.createElement("option", {value: "priority"}, "Priority")
					)
				)
			);
		}
	}
});

var ShowOpenTaskToggle = createReactClass({  // hide accepted and nla
	stateChange: false,
	handleChange: function(event) {
		var divId = this.props.divId;
		var storeId = this.props.storeId;
		var filterBy = "all";
		if(event.target.checked) {
			if ($('#accordion-'+divId).is('.ui-sortable')) {
				$('#accordion-'+divId).sortable('destroy');
				$('#add-task-panel').parent('div').addClass('hideTaskBtn');
			}
			filterBy = "openTasks";
		} else {
			if(this.props.sortBy == 'manual' && (this.props.mode == "edit" || this.props.mode == "template")) {
				$('#add-task-panel').parent('div').removeClass('hideTaskBtn');
				//$('.panel-blue').show();
				var firstList = $('#accordion-'+divId);
				firstList.sortable({
					 connectWith: ".connectedSortable",
					 cancel: 'div.impBackgroundFFF',
					 //delay: !isMobile() ? 300 : 0,
					 scroll: true,
						scrollSensitivity: 100,
						scrollSpeed: 30,
					 start: function( event, ui ) {
						 ui.placeholder.height(ui.helper[0].scrollHeight);
					 },
					 stop: function(event, ui) {
						TaskActions.manualSortData($('#accordion-'+divId).sortable("toArray"), storeId);
					 },
					 cursor: "move",
					 placeholder: 'ui-state-highlight'
				});
			}
			filterBy = "all";
		}
		TaskActions.tasksFilterBy(filterBy, storeId);
		this.stateChange = true;
	},
	componentDidMount: function() {
		var me = this;
		setTimeout(function(){
			if(me.props.filterBy == "openTasks"){
				$("#hide-tasks").trigger('click').prop('checked', true);
			}
		}, 1000);
	},
	shouldComponentUpdate: function(nextProps, nextState, nextContext) {
		if(this.props.items.length >  1 && ReactDOM.findDOMNode(this.refs.hideTasks).disabled) {
			return true;
		}
		if(this.stateChange) {
			return true;
		}
		return false;
	},
	render: function(){
		var disabled = false;
		var hasModifiedTasks = false;
		// if(this.props.items.length < 2) {
		// 	disabled = true;
		// }
		if(this.props.items.length <= 0) {
			return null;
		} else {
			return (
				React.createElement("div", {style: {width: "146px"}}, 
					React.createElement("input", {type: "checkbox", id: "hide-tasks", name: "hide-tasks", onChange: this.handleChange, disabled: disabled, ref: "hideTasks"}), " Show only open tasks"
				)
			);
		}
	}
});

// Define main Controller View
var TaskApp = createReactClass({
	// Get initial state from stores
	getInitialState: function() {
		var writers = getWriters();
		var favWriters = getFavWriters();
		var currentUser = this.props.currentUser;
		var allWriters = [];
		
		if(Object.keys(writers).length > 0){
			var currentUserExists = false;
			writers.map(function(val,key) {
				var deletetdIndex = allWriters.map(function(e) { return e.address; }).indexOf(val.address);
				if(deletetdIndex == -1 && val.address.indexOf('@') == -1){
					allWriters.push(val);
				}
				if(val.address == currentUser.address){
					currentUserExists = true;
				}
			});
		}
		if(!currentUserExists) {
			var deletetdIndex = allWriters.map(function(e) { return e.address; }).indexOf(currentUser.address);
			if(deletetdIndex == -1){
				allWriters.push(currentUser);
			}
		}
		if(Object.keys(favWriters).length > 0){
			favWriters.map(function(val,key) {
				if(val.address != currentUser.address && val.address.indexOf('@') == -1){
					var deletetdIndex = allWriters.map(function(e) { return e.address; }).indexOf(val.address);
					if(deletetdIndex == -1){
						allWriters.push(val);
					}
				}
			});
		}
		
		return ({
			allWriters: allWriters,
			currentUser: currentUser,
			divId: this.props.divId,
			hideHeader: this.props.hideHeader,
			expandTask: this.props.expandTask,
			favWriters: getFavWriters(),
			isChecklist: this.props.isChecklist,
			isDiffMode: this.props.isDiffMode,
			storeId: this.props.storeId,
			taskData: getTasksState(this.props.storeId), 
			taskNum: this.props.taskNum,
			writers: getWriters(), 
		});
	},
	// Add change listeners to stores
	componentDidMount: function() {
		var storeId = this.state.storeId;
		var divId = this.state.divId;
		var me = this;
		$("#"+divId).mouseup(function (e) {
			var container = $('.more-options-select.store'+storeId);
			if(container.length > 0) {
				if (!container.is(e.target) // if the target of the click isn't the container...
					&& container.has(e.target).length === 0) // ... nor a descendant of the container
				{
					container.hide();
				}
			}
		});
		if($('#'+divId).hasClass('.task-auto-scroll')) {
			$('#'+divId).removeClass('task-scroll');
		}
		
		$('#'+divId).addClass("tasklist-outter-box");
		$('#'+divId).addClass("task-scroll");
		if(me.state.taskNum) {
			var indexNumber = -1;
			me.state.taskData.taskables.map(function(val,key){
				if(val.taskNumber == me.state.taskNum) {
					indexNumber = val.index ? val.index : key;
					return;
				}
			});
			var myContainer = $('#'+me.props.divId);
			var scrollTo = $('#sort_'+indexNumber);
			if(myContainer && myContainer.length > 0 && scrollTo.offset()) {
				myContainer.animate({
					scrollTop: ((scrollTo.offset().top - myContainer.offset().top + myContainer.scrollTop()))
				}, 600);
			}
			//auto height for textarea
			var el = $("#sort_"+indexNumber+ " textarea.autoAdjust");
			var val = "";
			var outterDivHeight = 0;
			el.map(function(val,key){
				val = $(this).val().replace(/&/g, '&amp;')
									.replace(/</g, '&lt;')
									.replace(/>/g, '&gt;')
									.replace(/\n/g, '<br/>')
									.replace(/\s/g,'&nbsp;');
				$(this).parent().find('.hiddenDivTextarea')[0].innerHTML = val;
				outterDivHeight = $(this).parent().find('.hiddenDivTextarea').outerHeight() < 40 ? 39 : ($(this).parent().find('.hiddenDivTextarea').outerHeight());
				$(this)[0].style.height = outterDivHeight + 'px';
			});
		}
		TaskStore.addChangeListener(this._onChange);
	},
	// Remove change listeners from stores
	componentWillUnmount: function() {
		$("#"+this.state.divId).unbind("mouseup");
		$(document).unbind("mouseup");
		if ($('#accordion-'+this.state.divId).is('.ui-sortable')) {
			$('#accordion-'+this.state.divId).sortable('destroy');
		}
		TaskStore.removeChangeListener(this._onChange);
	},
	// Render our child components, passing state via props
	render: function() {
		var taskData = this.state.taskData;
		var mode = taskData.mode == 'read' ? 'sortByState-disable readable' : 'sortByState-disable editable';
		var taskLength= this.state.taskData.taskables.length;
		var writersCount = 0;
		var me = this;
		var currentUser = this.state.currentUser;
		var taskNum = taskData.taskNum ? taskData.taskNum : this.state.taskNum;
		var storeId = this.state.storeId;
		var existCurrentUser = false;
		/*for template mode checklist -- start*/
		if(!taskData.isChecklist && taskData.mode == "template") {
			return React.createElement("div", {className: "container tasklist editable template-task-list-outter"}, 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col-md-12 header-outter-div", style: {position: "inherit"}}, React.createElement(TaskAddComp, {items: this.state.taskData.taskables, storeId: storeId, currentUserAdress: currentUser.address})), 
							React.createElement("div", {className: "col-md-12 template-tasks-message"}, "A Task List created in a Template cannot have tasks added. Tasks can be added in any Instance created from this Template. If you want to add Tasks in a Template, use a Checklist instead")
						)
				)
		}
		/*for template mode checklist -- end */
		if(taskData.additionalActors){
			taskData.additionalActors.map(function(val,key) {
				if(me.state.writers && me.state.writers.map) {
					me.state.writers.map(function(writer, wkey) {
						if(writer.address == val) {
							writersCount++;
						}
						if(writer.address == currentUser.address) {
							existCurrentUser = true;
						}
					});
				}
			});
			taskData.additionalActors.map(function(val,key) {
				if(me.state.favWriters) {
					me.state.favWriters.map(function(writer, wkey) {
						if(writer.address == val) {
							writersCount++;
						}
						if(writer.address == currentUser.address) {
							existCurrentUser = true;
						}
					});
				}
			});
			if(!existCurrentUser) {
				taskData.additionalActors.map(function(val,key) {
					if(val == currentUser.address) {
						writersCount++;
					}
				});
			}
		}
		var noTaskHtml = '';
		if(taskLength <= 0) {
			noTaskHtml = (taskData.mode == 'read')? (React.createElement("div", {className: "noTask noTaskRead"}, React.createElement("h3", null, "No tasks"))): (React.createElement("div", {className: "noTask"}, React.createElement("h3", null, "No task added")));
		} 
		var writersMissing = (taskData.additionalActors && (taskData.additionalActors.length > writersCount) && taskData.taskables.length > 0) ?'Some writers have been removed...' : ' ';

		var taskHtml = null;
		switch (taskData.mode) {
			case "read":
			case "readSort":
				if(taskLength > 0 && this.state.hideHeader !== true) {
					taskHtml = React.createElement("div", {className: "col-md-12 header-outter-div"}, 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col-md-12 custom-sort"}, 
								React.createElement(Progressbar, {taskData: taskData, storeId: storeId, isDiffMode: this.state.isDiffMode, diffVersion1: this.props.diffVersion1, diffVersion2: this.props.diffVersion2})
							)
						), 
						React.createElement("div", {className: "row"}, 
							React.createElement("div", {className: "col-md-4 custom-sort", style: {width: "30%"}}, 
								
									!taskData.isChecklist ? React.createElement(SortTasks, {storeId: storeId, divId: this.state.divId, isDiffMode: this.state.isDiffMode, sortBy: this.state.taskData.sortBy ? this.state.taskData.sortBy : (this.state.isDiffMode ? 'state' : 'priority')}) : null
								
							), 
							React.createElement("div", {className: "col-md-4", style: {width: "28%", paddingTop: "5px"}}, 
								React.createElement("div", {id: "sorting", style: {display: "none"}, className: "sortMessage", key: this.state.taskData.sortBy}, "Sorting...")
							), 
							React.createElement("div", {className: "col-md-4 custom-sort", style: {width: "41%", float: "right"}}, 
								React.createElement("div", {style: {float: "right"}}, 
									
										!taskData.isChecklist ? 
											this.state.isDiffMode ? React.createElement(FilterTasks, {filterBy: this.state.taskData.filterBy ? this.state.taskData.filterBy : "changedTasks", mode: this.state.taskData.mode, storeId: storeId, divId: this.state.divId, isDiffMode: this.state.isDiffMode}) : React.createElement(ShowOpenTaskToggle, {filterBy: this.state.taskData.filterBy ? this.state.taskData.filterBy : "all", mode: this.state.taskData.mode, storeId: storeId, divId: this.state.divId, sortBy: this.state.taskData.sortBy ? this.state.taskData.sortBy : 'priority', items: this.state.taskData.taskables})
										: null
									
								)
							)
						), 
						typeof this.state.taskData.wereTasksReordered != "undefined" && this.state.taskData.wereTasksReordered ? React.createElement("div", {className: "row"}, React.createElement("div", {className: "taskReorder"}, "Tasks were reordered"), " "): null
					);
				} else {
					// return null;
				}
			break;
		}
		
		if(this.state.hideHeader){
			var clonedTasks = JSON.parse(JSON.stringify(taskData));
			var taskSelectedIndex = clonedTasks.taskables[0].index;
			taskData.toggleTaskIndex = (taskSelectedIndex != undefined) ? taskSelectedIndex : 0;
			taskData.slideTask = true;
		}
		
		if(this.state.expandTask || taskData.expandTask){
			var tt = (taskData.expandTask) ? 1000 : 0;

			this.state.expandTask = false;
			taskData.expandTask = false;
			var clonedTasks = JSON.parse(JSON.stringify(taskData));

			var taskSelectedIndex = -1;
			clonedTasks.taskables.map(function(val,key){
				if(val.taskNumber == taskNum) {
					taskSelectedIndex = val.index ? val.index : key;
					return;
				}
			});
			
			setTimeout(function(){
				if(taskSelectedIndex != -1) TaskActions.slideTaskToggle(taskSelectedIndex, storeId, true);
			}, tt);
		}

		return (
			React.createElement("div", {style: {width: "inherit", height: "inherit", position: "inherit"}}, 
				React.createElement("div", {className: (taskData.mode == 'read' || taskData.mode == 'readSort' ? 'readable' : 'editable') + ' container tasklist' + (taskData.mode == 'template' ? ' templateMode' : '')}, 
					
					taskHtml, 
					React.createElement("div", {className: "clearfix"}), 
					taskData.mode == 'template' && taskLength > 0 ? React.createElement("div", {className: "template-note"}, "[Note: In a Template, Tasks cannot be started or have a requester set or have assignees added]") : null, 
					
					React.createElement("div", {id: "sorting-content", className: mode}, 
						noTaskHtml, 
						React.createElement(TaskLists, {taskData: taskData, writers: this.state.writers, favWriters: this.state.favWriters, allWriters: this.state.allWriters, currentUser: this.state.currentUser, divId: this.state.divId, taskNum: taskNum, storeId: storeId, isChecklist: this.state.isChecklist})
					)
				)
				
			)	
		);
	},
	// Method to setState based upon Store changes
	_onChange: function() {
		this.setState({taskData: getTasksState(this.state.storeId)});
	}
});
module.exports = TaskApp;

},{"../actions/TaskActions":1,"../stores/TaskStore":12,"../stores/WritersStore":13,"../stores/favWritersStore":14,"../utils/TaskAPI":15,"./ReactChosen.react":3,"./TaskLists.react":6,"create-react-class":18,"react":"react","react-dom":"react-dom"}],5:[function(require,module,exports){
var React = require('react');
var createReactClass = require('create-react-class');
var TaskActions = require('../actions/TaskActions');
var TaskStore = require('../stores/TaskStore');
var TaskCollapseArrow = createReactClass({
	getInitialState: function(){
		return ({items: this.props.items, store: this.props.storeId});
	},
	handleClick: function(event) {
		event.preventDefault();
		var me = this;
		var e = '#'+this.props.divId+'_collapse_'+this.props.mode+this.props.items.index;
		var arrowId = '#'+this.props.divId+'-arrow-'+this.props.mode+this.props.items.index;
		if(!($(e).hasClass('in'))){
			//TaskActions.slideTaskAndCheckTitle(e, arrowId);
			TaskActions.slideTaskToggle(this.props.items.index, this.props.storeId, true);
		}else{
			var jsonData = TaskStore.getData(this.props.storeId);
			if(jsonData.taskables[this.props.keyVal].isTitleEmpty) {
				$.alert.open({
					type: 'error',
					content: 'Please enter a task title.',
					callback: function() {
						$('#task-title-' + me.props.items.index).focus();
					}
				});
			}else{
				//TaskActions.slideTaskAndCheckTitle(e, arrowId);
				TaskActions.slideTaskToggle(this.props.items.index, this.props.storeId, false);
			}
		}
	},
	render: function() {
		var me = this;
		var iconClassName = this.props.items.newItem  || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? 'glyphicon glyphicon-chevron-down collapse-i' : 'glyphicon glyphicon-chevron-right collapse-i';
		return (React.createElement("div", {className: "arrow-icon-outter"}, 
					React.createElement("a", {"data-toggle": "collapse", "data-parent": "#accordion", href: "#"+this.props.divId+"_collapse_"+ this.props.mode + this.props.items.index, onClick: this.handleClick}, 
						React.createElement("i", {name: "toggle-tasks-"+this.props.items.index, className: iconClassName, id: this.props.divId+"-arrow-"+this.props.mode + this.props.items.index})
					)
				))
	}
});
module.exports = TaskCollapseArrow;

},{"../actions/TaskActions":1,"../stores/TaskStore":12,"create-react-class":18,"react":"react"}],6:[function(require,module,exports){
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
			React.createElement("div", {className: "accordion-state1 connectedSortable panel-group", id: "accordion-"+divId}, 
				
				
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
							return React.createElement(TaskListsComp, {items: val, keyVal: val.index, key: val.index+val.type+"_"+val.taskId, propKey: val.index+val.type+"_"+val.taskId, mode: mode, tasksLength: tasksLength, writers: writers, favWriters: favWriters, currentUser: currentUser, divId: divId, storeId: storeId, addLastTaskCls: addLastTaskCls, slideTask: slideTask, toggleTaskIndex: toggleTaskIndex})
						} else {
							return React.createElement(TaskListsComp, {items: val, keyVal: val.index, key: val.index+"_"+val.taskNumber+"_"+val.taskId, propKey: val.index+"_"+val.taskNumber+"_"+val.taskId, mode: mode, tasksLength: tasksLength, allWriters: allWriters, writers: writers, favWriters: favWriters, currentUser: currentUser, divId: divId, taskNum: taskNum, storeId: storeId, isChecklist: isChecklist, addLastTaskCls: addLastTaskCls, slideTask: slideTask, toggleTaskIndex: toggleTaskIndex})
						}
					})
				
			)
		);
	},
});
module.exports = TaskLists;

},{"../actions/TaskActions":1,"../stores/TaskStore":12,"./TaskListsComp.react":7,"create-react-class":18,"react":"react"}],7:[function(require,module,exports){
var React = require('react');
var createReactClass = require('create-react-class');
var ReactDOM = require('react-dom');
var Popover = require('react-awesome-popover');
var ClipboardJS = require('clipboard/dist/clipboard.min');

var TaskListsCompHeader = require('./TaskListsCompHeader.react');
var TaskStateReadViewHtml = require('./TaskStateReadViewHtml.react');
var Chosen = require('./ReactChosen.react');
var TaskActions = require('../actions/TaskActions');
var WritersActions = require('../actions/WritersActions');
var TaskCollapseArrow = require('./TaskCollapseArrow.react');
var TaskStore = require('../stores/TaskStore');

var isMobile = function() {
	try{
		document.createEvent("TouchEvent"); return true;
	} catch(e){
		return false;
	}
}

var TaskTitle = createReactClass({
	titleUpdated: false,
	getInitialState: function() {
		return ({
			items: this.props.items,
			keyVal: this.props.keyVal,
			mode: this.props.mode,
			storeId: this.props.storeId,
			title: this.props.items.title
		});
	},
	render: function() {
		var state = this.state;
		var isDiffSection = false;
			var titleBaseValue = '';
			if(state.items.diffOpType && state.items.diffOpType == "MODIFIED") {
				if(state.items.baseValue) {
					if(state.items.baseValue.title) {
						isDiffSection = true;
						titleBaseValue = state.items.baseValue.title;
						modifyStateClass = "titleBarDiff";
					}
				}
			}
			
			var diffHtml = null;
			if(isDiffSection) {
				diffHtml = React.createElement("span", {className: modifyStateClass, title: titleBaseValue})
				
				}

			return (
				React.createElement("div", {className: "mb-10 titleBar-outter"}, 
					React.createElement("div", {className: "hiddenDivTextarea title", style: {padding: "10px 0px"}}, state.title), 
					React.createElement("textarea", {name: 'task-title-'+this.props.items.index, defaultValue: state.title, className: state.items.newItem ? "autoAdjust readText titleBar hideIcon" : "autoAdjust readText titleBar", readOnly: true}), 
					diffHtml
				)
			)
		}
});

var TaskRequester = createReactClass({
	getInitialState: function(){
		var suggestions = [],
			allWriters = this.props.allWriters,
			currentUserExists = false,
			currentUser = this.props.currentUser,
			requester = this.props.items.requester;
		
		if(Object.keys(allWriters).length > 0){
			allWriters.map(function(val,key) {
				if(requester != val.address){
					if(val.name && val.name != ""){
						suggestions.push({value: val.address, label: val.name});
					}else{
						suggestions.push({value: val.address, label: val.address});
					}
				}
			});
		}
		
		return {
			keyVal: this.props.keyVal,
			storeId: this.props.storeId,
			mode: this.props.mode,
			items: this.props.items,
			requester: requester,
			writers: this.props.writers,
			allWriters: allWriters,
			favWriters: this.props.favWriters,
			suggestions: suggestions
		} 
	},
	componentDidMount: function(){
		//
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
			if(val.address == me.state.requester && val.initial) {
				var hoverHTML = '<img src="'+imgPath+'" class="hc-pic" />'
							+'<p class="hc-p">'+ (val.name != undefined ? '<b>'+val.name+'</b><br>' : '') + val.address + '</p>';
				$("div[data-title-colps-requester='"+val.address+"'], span[data-title-colps-requester='"+val.address+"']").unbind("click");
				$("div[data-title-colps-requester='"+val.address+"'], span[data-title-colps-requester='"+val.address+"']").hovercard({
					detailsHTML: hoverHTML,
					width: '250',
				   openOnLeft: true
				});
				$("div[data-title-colp-requester='"+val.address+"'], span[data-title-colp-requester='"+val.address+"']").bind("click");
			}
		});
	},
	render: function() {
		var me = this;
		var requester = this.state.requester,
			suggestions = this.state.suggestions,
			length = this.state.writers.length;
		
		if(me.props.mode == 'read' || me.props.mode == 'readSort'){
			var name = "";
			var key = 0;
			if(typeof requester != "undefined" && requester != "") {
				me.state.allWriters.map(function(writer, key) {
					if(writer){
						if(writer.address == requester) {
							name = (writer.name != "") ? writer.name : (writer.initial && writer.initial != "" ? writer.initial : writer.address);
							key = key;
						}
					}
				})
			}
			return (
				React.createElement("div", {id: "requester-container-"+me.state.keyVal, name: "requester-container-"+me.state.keyVal}, 
					
						name == "" ? null : React.createElement("span", {className: "requesters", "data-title-colps-requester": requester, "data-title": requester, key: "reqs"+key}, React.createElement("span", null, name))
					
				)
			);
		} else if(this.props.mode == 'template'){
			return (
					React.createElement("div", {className: "ReactTags__tags template"}, 
						"Cannot be assigned"
					));
		}
	}
});
var TaskAssignees = createReactClass({
	updateComponent: false,
	getInitialState: function() {
		var me = this,
			currentUserExists = false,
			suggestions = [],
			allWriters = this.props.allWriters;
			
		var currentUser = this.props.currentUser;
		var assignees = this.props.assignees;
		if(Object.keys(allWriters).length > 0){
			var currentUserExists = false;
			allWriters.map(function(val,key) {
				if(assignees.indexOf(val.address) == -1){
					if(val.name && val.name != ""){
						suggestions.push({value: val.address, label: val.name});
					}else{
						suggestions.push({value: val.address, label: val.address});
					}
				}
			});
		}
		return ({
			mode: this.props.mode,
			assignees: this.props.assignees,
			writers: this.props.writers,
			favWriters: this.props.favWriters,
			allWriters: allWriters,
			storeId: this.props.storeId,
			keyVal: this.props.keyVal,
            suggestions: suggestions
		})
	},
	componentDidMount: function(){
		//
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
					$("div[data-title-colps-assignee='"+val.address+"'], span[data-title-colps-assignee='"+val.address+"']").unbind("click");
					$("div[data-title-colps-assignee='"+val.address+"'], span[data-title-colps-assignee='"+val.address+"']").hovercard({
						detailsHTML: hoverHTML,
						width: '250',
					   openOnLeft: true
					});
					$("div[data-title-colps-assignee='"+val.address+"'], span[data-title-colps-assignee='"+val.address+"']").bind("click");
				}
			});
		});
	},
	
	render: function() {
		var me = this;
		var length = this.state.writers.length;
		var writers = this.state.writers;
		var assignees = this.state.assignees;
		var suggestions = this.state.suggestions;
		var initialCls = '';
		if(me.props.mode == 'read' || me.props.mode == 'readSort') {
			return (
				React.createElement("div", {name: "assignee-container-"+me.state.keyVal}, 
					
						assignees.map(function(val, key) {
							var name = "";
							var type = "";
							singleAssigneeValue = "";
							me.state.allWriters.map(function(writer, writerKey) {
								if(writer.address == val) {
									singleAssigneeValue = (writer.name == "") ? writer.address : writer.name;
									name = (writer.initial == "") ? writer.address : writer.initial;
									type = writer.type ? writer.type : "human";
								}
							})
							name = assignees.length == 1 ? (type == "role" && singleAssigneeValue == "" ? name : singleAssigneeValue) : name; 
							return name == "" ? null : React.createElement("span", {className: "requesters", key: "asign"+key, "data-title": val, "data-title-colps-assignee": val}, React.createElement("span", null, name))
						})
					
				)
			)
		} else if(this.props.mode == 'template'){
			return (
					React.createElement("div", {className: "ReactTags__tags template"}, 
						"Cannot be assigned"
					));
		}
	}
});
var TaskState = createReactClass({
	getInitialState: function() {
		return ({
			items: this.props.items,
			keyVal: this.props.keyVal,
			mode: this.props.mode,
			storeId: this.props.storeId,
			taskState: this.props.items.state
		});
		//return null;
	},
	
	componentDidMount: function() {
		this.setState({taskState: this.props.items.state});
	},
	
	render: function() {
		var taskState = this.state.taskState;
		var taskStateProp = this.props.items.state;
		var state = this.state;
		var html = "";
		
		switch(taskState){
				case 'Accepted':
					html = React.createElement("span", {className: "taskState accepted"}, taskState);
				break;
				case 'Unstarted':
					html = React.createElement("span", {className: "taskState start btn btn-info"}, taskState);
				break;
				case 'Started':
					html = React.createElement("span", {className: "taskState start btn btn-info"}, taskState);
				break;
				case 'Finished':
					html = React.createElement("span", {className: "taskState delivered btn btn-info"}, taskState);
				break;
				case 'Delivered':
					html = React.createElement("span", {className: "taskState rejected btn btn-danger"}, taskState);
				break;
				case 'Rejected':
					html = React.createElement("span", {className: "taskState rejected btn btn-info"}, taskState);
				break;
				case 'NoLongerApplicable':
					html = React.createElement("span", {className: "taskState start btn btn-default"}, "No Longer Applicable");
				break;
				default:
				
				break;
			}
		
		
			return React.createElement("div", {name: "state-container-"+state.items.index}, html);
		}
});
var TaskPriority = createReactClass({
	getInitialState: function() {
		return ({
			items: this.props.items,
			keyVal: this.props.keyVal,
			mode: this.props.mode,
			storeId: this.props.storeId,
			taskPriority: this.props.items.priority
		});
	},
	
	componentDidMount: function() {
		this.setState({taskPriority: this.props.items.priority});
	},
	
	render: function() {
		var taskPriority = this.state.taskPriority;
		var taskPriorityProp = this.props.items.priority;
		var state = this.state;
		var html = "";
		
		switch(taskPriority){
				case 'High':
					html = React.createElement("div", {"data-value": "High", title: "High Priority", className: "btn-info-high btn-info-selected"});
				break;
				case 'Medium':
					html = React.createElement("div", {"data-value": "Medium", title: "Medium Priority", className: "btn-info-medium btn-info-selected"});
				break;
				case 'Low':
					html = React.createElement("div", {"data-value": "Low", title: "Low Priority", className: "btn-info-low btn-info-selected"});
				break;
				default:
				case 'NoPrioritySet':
					html = React.createElement("div", {"data-value": "NoPrioritySet", title: "No Priority Set", className: "btn-info-low-no btn-info-selected"});
				break;
			}
			return React.createElement("div", {className: "pull-right", name: "priority-container-"+state.items.index}, html);
		
		}
});
var TaskDescription = createReactClass({
	getInitialState: function() {
		return ({
			description: this.props.description,
			items: this.props.items,
			keyVal: this.props.keyVal,
			mode: this.props.mode,
			storeId: this.props.storeId,
			taskNum: this.props.taskNum
		});
	},
	
	componentDidMount: function() {
		if(this.state.taskNum && this.state.items.taskNumber ==  this.state.taskNum) {
			var parentId = ReactDOM.findDOMNode(this.refs.description).parentNode.id;
			var hiddenDivHeight = $('#'+parentId+' .hiddenDivTextarea').outerHeight() < 40 ? 40 : ($('#'+parentId+' .hiddenDivTextarea').outerHeight() + 110);
			$('#'+parentId+' textarea').height(hiddenDivHeight);
		 }
	},
	
	render: function() {
		var state = this.state;
		var description = state.description;
		
		var isDiffSection = false;
			var descBaseValue = '';
			if(state.items.diffOpType && state.items.diffOpType == "MODIFIED") {
				if(state.items.baseValue) {
					if(state.items.additionalInfo) {
						if(state.items.additionalInfo.descriptionChanged) {
							isDiffSection = true;
							descBaseValue = state.items.baseValue.description;
							modifyStateClass = "descDiff";
							if(state.items.baseValue.description == "" && state.items.description != "") {
								modifyStateClass = "descDiffAdd";
							} else if(state.items.baseValue.description != "" && state.items.description == "") {
								modifyStateClass = "descDiffDel";
							}
						}
					}
				}
			}

			var diffHtml = null;
			if(isDiffSection){
				diffHtml = React.createElement("span", {className: modifyStateClass, title: descBaseValue})

				var isOpenInMobile = isMobile();
				var hoverTitle = descBaseValue == '' ? "No Value" : descBaseValue;

				if(isOpenInMobile){
					diffHtml = React.createElement(Popover, {className: "custom-popover-content", placement: "bottom", arrow: false}, 
						React.createElement("a", {href: "##", className: "mobile-modified-data-icon"}, diffHtml), 
						hoverTitle
					)
				}
			}

			return (
				React.createElement("div", {className: "description", id: "description"+this.state.items.taskNumber}, 
					React.createElement("div", {className: "hiddenDivTextarea desc", style: {padding: "10px 0px"}}, description), 
					React.createElement("textarea", {name: 'task-description-'+state.items.index, className: "readText autoAdjust", ref: "description", defaultValue: description, readOnly: true}), 
					diffHtml
				)
			)
		}
});

var TaskTypeRequest = createReactClass({
	getInitialState: function() {
		var writersObj = {};
		if(this.props.writers) {
			this.props.writers.map(function(val, key) {
				writersObj[val.fullAdress] = val;
			});
		}
		return ({writersObj: writersObj, allWriters: this.props.allWriters});
	},
	componentDidMount: function() {
		this.bindClipBoard(".copy-task-ex-link-menu");
		this.bindClipBoard(".copy-task-ex-mobile-link-menu");
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
	render: function(){
		var me = this;
		var style = this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? 'block' : 'none';
		var className = this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? 'panel-collapse collapse in' : 'panel-collapse collapse';
		var fields = this.props.items.taskNumber.toString().split(/_/);
		var newItem = false;
		var storeId = this.props.storeId;
		var isEnabled = this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? true : false;
		if(fields[0] == 'New') {
			var newItem = true;
		}
		var requesterDiff, assigneesDiff, stateDiff, priorityDiff = false;
		var outterCls = this.props.items.diffOpType && this.props.items.diffOpType == "MODIFIED" ? "diffSection" : "";
		var isDiffSection = false;
		var assigneeBaseValue = '', requesterBaseValue = '', stateBaseValue = '', priorityBaseValue = '';
		var additionalInfo = this.props.items.additionalInfo ? this.props.items.additionalInfo : "undefined";
		if(this.props.items.diffOpType && this.props.items.diffOpType == "MODIFIED") {
			if(this.props.items.baseValue) {
				if(additionalInfo) {
					if(additionalInfo.requesterChange) {
						if(additionalInfo.requesterChange.added && additionalInfo.requesterChange.added != "" && additionalInfo.requesterChange.removed && additionalInfo.requesterChange.removed != "") {
							modifyReqStateClass = "table-style-diff";
							requesterDiff = true;
						} else if(additionalInfo.requesterChange.added && additionalInfo.requesterChange.added != "") {
							modifyReqStateClass = "table-style-diff-add";
							requesterDiff = true;
						} else if(additionalInfo.requesterChange.removed && additionalInfo.requesterChange.removed != "") {
							modifyReqStateClass = "table-style-diff-del";
							requesterDiff = true;
						} 
						var writerAddress = this.props.items.baseValue.requester;
						requesterBaseValue = writerAddress != "" ? (me.state.writersObj[writerAddress]["name"] != "" ? me.state.writersObj[writerAddress]["name"] + " (" + me.state.writersObj[writerAddress]["address"] + ")" : me.state.writersObj[writerAddress]["address"]) : "";
					}
					if(additionalInfo.assigneeChange) {
						var assigneesAdded = "";
						var assigneesRemoved = "";
						if(additionalInfo.assigneeChange.added.length > 0) {
							additionalInfo.assigneeChange.added.map(function(val,key) {
								assigneesAdded += (val + ((additionalInfo.assigneeChange.added.length-1) == key ? " " : ", "));
							})
							assigneesDiff = true;
						}
						if(additionalInfo.assigneeChange.removed.length > 0) {
							additionalInfo.assigneeChange.removed.map(function(val,key) {
								assigneesRemoved += (val + ((additionalInfo.assigneeChange.removed.length-1) == key ? " " : ", "));
							})
							assigneesDiff = true;
						}
						if(additionalInfo.assigneeChange.added.length > 0 && additionalInfo.assigneeChange.removed.length > 0) {
							modifyAssigStateClass = "table-style-diff";
							assigneesDiff = true;
						} else if(additionalInfo.assigneeChange.added.length > 0) {
							modifyAssigStateClass = "table-style-diff-add";
							assigneesDiff = true;
						} else if(additionalInfo.assigneeChange.removed.length > 0) {
							modifyAssigStateClass = "table-style-diff-del";
							assigneesDiff = true;
						}
					}
				}
				
				if(this.props.items.baseValue.assignees) {
					this.props.items.baseValue.assignees.map(function(val,key) {
						if(val) {
							if(typeof me.state.writersObj[val] != "undefined" && (me.state.writersObj[val]["address"] == val || me.state.writersObj[val]["fullAdress"] == val)) {
								assigneeBaseValue += me.state.writersObj[val]["name"] != "" ? me.state.writersObj[val]["name"] + " (" + me.state.writersObj[val]["address"] + ")" : me.state.writersObj[val]["address"];
							} else {
								assigneeBaseValue += val;
							}
							assigneeBaseValue += "\n";
						}
					});
				}
				if(this.props.items.baseValue.state) {
					modifyTaskStateClass = "table-style-diff";
					stateDiff = true;
					stateBaseValue = this.props.items.baseValue.state;
				}
				
				if(this.props.items.baseValue.priority) {
					modifyTaskPriorityClass = "table-style-diff";
					priorityDiff = true;
					priorityBaseValue = this.props.items.baseValue.priority;
				}
			}
		}
		
		var requesterDiffHtml, assigneesDiffHtml, stateDiffHtml, priorityDiffHtml = null;

		var isOpenInMobile = isMobile();
		if(requesterDiff){
			requesterDiffHtml = React.createElement("span", {className: modifyReqStateClass, title: requesterBaseValue})
			
			}

		if(assigneesDiff){
			assigneesDiffHtml = React.createElement("span", {className: modifyAssigStateClass, title: assigneeBaseValue})
			
			}

		if(stateDiff){
			stateDiffHtml = React.createElement("span", {className: modifyTaskStateClass, title: stateBaseValue})
			
			}

		if(priorityDiff){
			priorityDiffHtml = React.createElement("span", {className: modifyTaskPriorityClass, title: priorityBaseValue})
			
			}

		if(isEnabled) {
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
				React.createElement("div", {className: (this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask)  ? 'impBackgroundFFF ' : ' ')+outterCls, key: this.props.propKey}, 
					React.createElement(TaskListsCompHeader, {items: this.props.items, mode: this.props.mode, keyVal: this.props.keyVal, allWriters: this.props.allWriters, writers: this.props.writers, currentUser: this.props.currentUser, divId: this.props.divId, taskNum: this.props.taskNum, storeId: storeId, favWriters: this.props.favWriters, isChecklist: this.props.isChecklist, slideTask: this.props.slideTask, toggleTaskIndex: this.props.toggleTaskIndex}), 
					React.createElement("div", {id: this.props.divId+'_collapse_' + this.props.mode + this.props.items.index, className: className, style: {display: style}}, 
						React.createElement("div", {className: "panel-body"}, 
							React.createElement(TaskTitle, {items: this.props.items, mode: this.props.mode, keyVal: this.props.keyVal, storeId: storeId}), 
							React.createElement("div", {className: "mb-6 taskNumber"+this.props.mode == 'read' || this.props.mode == 'readSort' ? 'hiddenDelBtn' : ''+(isMobile() && !newItem && jsonData.mailboxType != 'draft' ? "copy-task-ex-mobile-link-menu" : ""), style: {float: 'left', clear: 'both', position: 'relative', cursor: (isMobile() && !newItem && jsonData.mailboxType != 'draft' ? 'pointer' : 'auto')}, "data-clipboard-text": link}, 
								React.createElement("span", {className: "content-id label-cls"}, "Task Number"), 
								React.createElement("span", {name: "task-number-"+this.props.items.index, className: newItem ? "taskId content-id newTask taskNumber" : "taskId content-id taskNumber"}, "#", newItem ? "New" : this.props.items.taskNumber), 
								
									!newItem && jsonData.mailboxType != 'draft' ? (
										React.createElement("div", {style: {float: "left", position: "relative", width: "20px"}}, 
											React.createElement("span", {className: "copied-span copied-span-ex hidden"}, "Task Link Copied"), 
											
												!isMobile() ? (
													React.createElement("div", {name: "task-number-copy-"+this.props.items.index, className: "copy-task-ex-link-menu", title: "Copy Task Link", "data-clipboard-text": link})
												) : null
											
										)
									) : null
								
								
							), 
							
							React.createElement("div", {className: "content-block"}, 
								React.createElement("div", {className: "col-md-4 table-style"}, 
									React.createElement("div", {className: "col-md-3 label-cls"}, 
										"Requester" 
									), 
									React.createElement("div", {className: "col-md-9", style: {textAlign: "right"}}, 
										React.createElement(TaskRequester, {items: this.props.items, mode: this.props.mode, keyVal: this.props.keyVal, allWriters: this.state.allWriters, writers: this.props.writers, favWriters: this.props.favWriters, currentUser: this.props.currentUser, storeId: storeId})
									), 
									requesterDiffHtml
								), 
								React.createElement("div", {style: {clear:"both"}}), 
								React.createElement("div", {className: "col-md-4 table-style"}, 
									React.createElement("div", {className: "col-md-3 label-cls"}, 
										"Assignees"
									), 
									React.createElement("div", {className: "col-md-9", style: {textAlign: "right"}}, 
										React.createElement(TaskAssignees, {assignees: this.props.items.assignees, mode: this.props.mode, keyVal: this.props.keyVal, allWriters: this.state.allWriters, writers: this.props.writers, favWriters: this.props.favWriters, currentUser: this.props.currentUser, storeId: storeId})
									), 
									assigneesDiffHtml
								), 
								React.createElement("div", {style: {clear:"both"}}), 
								React.createElement("div", {className: "col-md-4 table-style"}, 
									React.createElement("div", {className: "col-md-3 label-cls"}, 
										"State"
									), 
									React.createElement("div", {className: "col-md-9", style: {textAlign: "right"}}, 
										React.createElement(TaskState, {items: this.props.items, mode: this.props.mode, keyVal: this.props.keyVal, propKey: this.props.propKey, storeId: storeId})
									), 
									stateDiffHtml
								), 
								React.createElement("div", {style: {clear:"both"}}), 
								React.createElement("div", {className: "col-md-4 table-style table-last-row"}, 
									React.createElement("div", {className: "col-md-3 label-cls"}, 
										"Priority"
									), 
									React.createElement("div", {className: "col-md-9", style: {textAlign: "right"}}, 
										React.createElement(TaskPriority, {items: this.props.items, mode: this.props.mode, keyVal: this.props.keyVal, propKey: this.props.propKey, storeId: storeId})
									), 
									priorityDiffHtml
								), 
								React.createElement("div", {style: {clear:"both"}})
							), 
							React.createElement("div", {style: {clear:"both"}}), 
							React.createElement(TaskDescription, {items: this.props.items, description: this.props.items.description, keyVal: this.props.keyVal, mode: this.props.mode, storeId: storeId, taskNum: this.props.taskNum})
						)
					)
				)
			);
		} else {
			return (
				React.createElement("div", {className: (this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask)  ? 'impBackgroundFFF ' : ' ')+outterCls, key: this.props.propKey}, 
					React.createElement(TaskListsCompHeader, {items: this.props.items, mode: this.props.mode, keyVal: this.props.keyVal, allWriters: this.props.allWriters, writers: this.props.writers, currentUser: this.props.currentUser, divId: this.props.divId, taskNum: this.props.taskNum, storeId: storeId, favWriters: this.props.favWriters, isChecklist: this.props.isChecklist, slideTask: this.props.slideTask, toggleTaskIndex: this.props.toggleTaskIndex})
				)	
			);
		}
	}
});
var TaskTypeDivider = createReactClass({
	render: function(){
		var titleDisplay = this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? 'block' : 'none';
		var titleTopMargin =  this.props.items.newItem ? '-10px' : '-22px';
		var className = this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? 'panel-collapse collapse in' : 'panel-collapse collapse';
		var hideDivider = this.props.mode == 'readSort' ? 'none' : 'block';
		var storeId = this.props.storeId;
		var hideTitle = this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? 'none' : 'block';
		var isEnabled = this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? true : false;
		
		
		if(isEnabled) {
			return (
				React.createElement("div", {className: this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? 'impBackgroundFFF' : '', key: this.props.propKey, style: {display: hideDivider}}, 
					React.createElement("div", {className: "panel-heading"}, 
						
						React.createElement("div", {className: "title-outter", style: {display: hideTitle}}, 
							React.createElement("h4", {className: "panel-title"}, 
								this.props.items.title
							)
						)
					), 
					React.createElement("div", {id: this.props.divId+"_collapse_"+this.props.mode+this.props.items.index, className: className, style: {display: titleDisplay, marginTop: titleTopMargin}}, 
						React.createElement("div", {className: "panel-body"}, 
							React.createElement("div", {className: "mb-10"}, 
								React.createElement(TaskTitle, {items: this.props.items, keyVal: this.props.keyVal, mode: this.props.mode, storeId: storeId}), 
								React.createElement("div", {style: {float: "left", clear: 'both'}}
									
								)
								
							)
						)
					)
				)
			);
		} else {
			return (
				React.createElement("div", {className: this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? 'impBackgroundFFF' : '', key: this.props.propKey, style: {display: hideDivider}}, 
					React.createElement("div", {className: "panel-heading"}, 
						
						React.createElement("div", {className: "title-outter", style: {display: hideTitle}}, 
							React.createElement("h4", {className: "panel-title"}, 
								this.props.items.title
							)
						)
					)
				)
			);
		}
	}
});
var TaskListsComp = createReactClass({
	getInitialState: function() {
		return ({
			allWriters: this.props.allWriters,
			currentUser: this.props.currentUser,
			divId: this.props.divId,
			favWriters: this.props.favWriters,
			isChecklist: this.props.isChecklist,
			items: this.props.items,
			key: this.props.propKey,
			keyVal: this.props.keyVal,
			mode: this.props.mode,
			storeId: this.props.storeId,
			taskNum: this.props.taskNum,
			tasksLength: this.props.tasksLength,
			writers: this.props.writers
		});
	},
	render: function() {
		var outterClass = 'panel panel-default ';
		var hideDivider = this.state.mode == 'readSort' ? 'none' : 'block';
		var storeId = this.state.storeId;
		var isDiffSection = this.state.items.diffOpType ? true : false;
		if(this.state.items.deleted) {
			hideDivider = 'none';
		}
		switch(this.state.items.state){
			case 'Accepted':
				outterClass += 'panel-accepted';
			break;
			case 'NoLongerApplicable':
				outterClass += 'panel-grey';
			break;
			case 'Finished':
			case 'Delivered':
			case 'Rejected':
			case 'Started':
				outterClass += 'panel-openTask';
			break;
			default:
				outterClass += 'panel-white';
			break;
		}
		if(this.state.items.type == 'DIVIDER'){
			outterClass = 'panel panel-default panel-blue panel-divider';
		}
		if(isDiffSection) {
			var outterClass = 'panel panel-default panel-white';
			switch(this.state.items.diffOpType) {
				case "NEW":
					outterClass += " panel-diff-added";
				break;
				case "DELETED":
					outterClass += " panel-diff-deleted";
				break;
				case "MODIFIED":
					outterClass += " panel-diff-modified";
				break;
			}
		}
		if(this.props.addLastTaskCls) {
			outterClass += " last-task"
		}
		switch(this.state.items.type) {
			case 'TASK_REQUEST':
				return (
					React.createElement("div", {className: "el-container "+outterClass, name: 'sort_' + this.state.keyVal, id: 'sort_' + this.state.keyVal, style: {display: this.state.items.deleted ? "none" : "block"}}, 
						React.createElement(TaskTypeRequest, {items: this.state.items, mode: this.state.mode, keyVal: this.state.keyVal, propKey: this.state.key, tasksLength: this.state.tasksLength, allWriters: this.state.allWriters, writers: this.state.writers, favWriters: this.state.favWriters, currentUser: this.state.currentUser, divId: this.state.divId, taskNum: this.state.taskNum, storeId: storeId, isChecklist: this.state.isChecklist, slideTask: this.props.slideTask, toggleTaskIndex: this.props.toggleTaskIndex})
					)
				);
			break;
			case 'DIVIDER':
				return (this.state.mode == 'nonSort' ? null : (React.createElement("div", {className: "el-container "+outterClass, style: {display: hideDivider}, name: 'sort_' + this.state.keyVal, id: 'sort_' + this.state.keyVal}, React.createElement(TaskTypeDivider, {items: this.state.items, mode: this.state.mode, keyVal: this.state.keyVal, propKey: this.state.key, tasksLength: this.state.tasksLength, divId: this.state.divId, storeId: storeId, toggleTaskIndex: this.props.toggleTaskIndex, slideTask: this.props.slideTask}))));
			break;
		}
	},
});
module.exports = TaskListsComp;

},{"../actions/TaskActions":1,"../actions/WritersActions":2,"../stores/TaskStore":12,"./ReactChosen.react":3,"./TaskCollapseArrow.react":5,"./TaskListsCompHeader.react":8,"./TaskStateReadViewHtml.react":9,"clipboard/dist/clipboard.min":16,"create-react-class":18,"react":"react","react-awesome-popover":27,"react-dom":"react-dom"}],8:[function(require,module,exports){
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
				React.createElement("div", null, 
					
						name == "" ? null : React.createElement("div", {key: "div-req"+key+"-"+requester}, React.createElement("span", {className: "header-requester requesters", "data-title-requester": requester, key: "reqs"+key}, React.createElement("span", null, name)))
					
				)
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
				React.createElement("div", null, 
					React.createElement("div", {className: "assignee-outter header-assignees", title: "", ref: "header-assignees"}, 
							
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
								return val == 'More' || name == '' ? null : React.createElement("div", {key: "div"+key+"-"+val}, React.createElement("div", {className: "header-task-assignees chosen-single "+noInitialCls, key: key, "data-title-assignee": val}, React.createElement("span", null, name)));
							})
						
					)
				)
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
		
		var taskStateBtnsHTML = React.createElement(TaskStateReadViewHtml, {taskState: this.props.state})
		return (
			React.createElement("div", {className: "button-outter right-align", style: {display: style, float: "right"}}, 
				taskStateBtnsHTML
			)
		);
	}
});
var TaskPriorityHeader = createReactClass({
	render: function() {
		var priority = this.props.priority;
		var style = this.props.items.newItem || (typeof this.props.toggleTaskIndex != "undefined" && this.props.items.index == this.props.toggleTaskIndex && this.props.slideTask) ? 'none' : 'block';
		var className = this.props.items.newItem || (this.props.taskNum && this.props.items.taskNumber == this.props.taskNum) ? 'glyphicon glyphicon-chevron-down collapse-i' : 'glyphicon glyphicon-chevron-right collapse-i';
		
		var storeId = this.props.storeId,
			html = React.createElement("div", {style: {width: "27px", opacity: 0}}, ".");
		
		switch(priority){
			case 'High':
				html = React.createElement("div", {"data-value": "High", title: "High Priority", className: "btn-info-high btn-info-selected"});
			break;
			case 'Medium':
				html = React.createElement("div", {"data-value": "Medium", title: "Medium Priority", className: "btn-info-medium btn-info-selected"});
			break;
			case 'Low':
				html = React.createElement("div", {"data-value": "Low", title: "Low Priority", className: "btn-info-low btn-info-selected"});
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
				React.createElement("div", {className: "button-outter right-align", style: {display: style, float: "right", marginTop: mrgnTop}}, 
					html
				)
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
				return React.createElement("span", {className: "diff-text"}, React.createElement("span", {className: "task-bullet"}), " ", React.createElement("b", null, "Title"), " was changed (open task to see) ");
			}

			if(additionalInfo.stateChange && changedValue == "stateChange") {
				if(additionalInfo.stateChange && additionalInfo.stateChange == "none") {
					return null;
				} else if(additionalInfo.stateChange && additionalInfo.stateChange == "expected") {
					return React.createElement("span", {className: "diff-text"}, React.createElement("span", {className: "task-bullet"}), " This Task was ", React.createElement("b", null, this.props.items.taskState ? this.props.items.taskState : this.props.items.state), " ");
				} else {
					return React.createElement("span", {className: "diff-text"}, React.createElement("span", {className: "task-bullet"}), " This Task was moved from ", React.createElement("b", null, this.props.items.baseValue.state), " to ", React.createElement("b", null, this.props.items.state), " ");
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
					return (React.createElement("span", {className: "diff-text"}, React.createElement("span", {className: "task-bullet"}), " Requester ", React.createElement("b", null, React.createElement("span", {title: removedWriterAddress}, removedWriterName)), " was replaced by ", React.createElement("b", null, React.createElement("span", {title: addedWriterAddress}, addedWriterName)), " "));
				} else if(additionalInfo.requesterChange.added && additionalInfo.requesterChange.added != "") {
					return React.createElement("span", {className: "diff-text"}, React.createElement("span", {className: "task-bullet"}), " Requester ", React.createElement("b", null, React.createElement("span", {title: addedWriterAddress}, addedWriterName)), " was added ");
				} else if(additionalInfo.requesterChange.removed && additionalInfo.requesterChange.removed != "") {
					return React.createElement("span", {className: "diff-text"}, React.createElement("span", {className: "task-bullet"}), " Requester ", React.createElement("b", null, React.createElement("span", {title: removedWriterAddress}, removedWriterName)), " was removed ");
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
					return (React.createElement("span", {className: "diff-text"}, React.createElement("span", {className: "task-bullet"}), " Assignees ", React.createElement("b", null, 
							addedWriters.map(function(val,key){
								return (React.createElement("span", {title: val.writerAddress}, val.writerName, (addedWriters.length-1 == key) ? " " : ", "));
							})
						), " added and ", React.createElement("b", null, 
							removedWriters.map(function(val,key){
								return (React.createElement("span", {title: val.writerAddress}, val.writerName, (removedWriters.length-1 == key) ? " " : ", "));
							})
						), " removed "));
				} else if(additionalInfo.assigneeChange.added.length > 0) {
					return React.createElement("span", {className: "diff-text"}, React.createElement("span", {className: "task-bullet"}), " Assignee", additionalInfo.assigneeChange.added.length == 1 ? null : "s", " ", React.createElement("b", null, 
							addedWriters.map(function(val,key){
								return (React.createElement("span", {title: val.writerAddress}, val.writerName, (addedWriters.length-1 == key) ? " " : ", "));
							})
						), " added ");
				} else if(additionalInfo.assigneeChange.removed.length > 0) {
					return React.createElement("span", {className: "diff-text"}, React.createElement("span", {className: "task-bullet"}), " Assignee", additionalInfo.assigneeChange.removed.length == 1 ? null : "s", " ", React.createElement("b", null, 
							removedWriters.map(function(val,key){
								return (React.createElement("span", {title: val.writerAddress}, val.writerName, (removedWriters.length-1 == key) ? " " : ", "));
							})
						), " removed ");
				} else {
					return null;
				}
			}

			if(additionalInfo.descriptionChanged && changedValue == "descriptionChanged"){
				return React.createElement("span", {className: "diff-text"}, React.createElement("span", {className: "task-bullet"}), " ", React.createElement("b", null, "Description"), " was changed (open task to see) ");
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

			diffHtml = React.createElement("span", {className: "diff-type-icon "+diffIcon, title: taskDiffType})

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
			React.createElement("div", {className: headerCls}, 
				this.props.items.newItem ? null : React.createElement(TaskCollapseArrow, {items: this.props.items, keyVal: this.props.keyVal, mode: this.props.mode, divId: this.props.divId, taskNum: this.props.taskNum, storeId: storeId, slideTask: this.props.slideTask, toggleTaskIndex: this.props.toggleTaskIndex}), 
				React.createElement("div", {className: "request-icon-outter", style: {display: style}}, 
					React.createElement("i", {className: this.props.items.isFromChecklist ? "task-checklist-icon" : "task-r-icon", name: "task-icon-"+this.props.keyVal}), 
					React.createElement("div", {className: "taskId"}, 
						React.createElement("span", {name: "task-number-"+this.props.items.index, className: newItem ? 'newTask content-id header-task-number' : 'content-id header-task-number'}, "#", newItem ? "New" : this.props.items.taskNumber)
					), 
					
						!isMobile() && !newItem && jsonData.mailboxType != 'draft' ? (
							React.createElement("div", {style: {left: '-34px', position: 'absolute', top: '1px'}}, 
								React.createElement("span", {className: "copied-span hidden"}, "Task Link Copied"), 
								React.createElement("div", {name: "task-number-header-copy-"+this.props.items.index, className: "copy-task-link-menu", title: "Copy Task Link", "data-clipboard-text": link})
							)
						) : null, 
					
					diffHtml
				), 
				React.createElement("div", {className: "title-outter " + titleOutter, style: {display: style}}, 
					
						isMobile() && !newItem && jsonData.mailboxType != 'draft' ? (
							React.createElement("div", {style: {position: 'relative', cursor: 'pointer'}}, 
								React.createElement("span", {className: "copied-mobile-span copied-span hidden"}, "Task Link Copied"), 
								React.createElement("h4", {className: "task-header-title panel-title copy-task-link-mobile-menu", "data-clipboard-text": link}, " ", this.props.items.title, " ")
							)
						) : React.createElement("h4", {className: "task-header-title panel-title"}, " ", this.props.items.title, " ")
					
				), 
				(isDiffSection && typeof this.props.items.diffOpType != 'undefined' && this.props.items.diffOpType == 'DELETED') || (typeof this.props.items.isFromChecklist != 'undefined' && this.props.items.isFromChecklist == true && this.props.isChecklist == true) ? null : 
					React.createElement(TaskPriorityHeader, {priority: this.props.items.priority, mode: this.props.mode, keyVal: this.props.keyVal, items: this.props.items, taskNum: this.props.taskNum, storeId: storeId, slideTask: this.props.slideTask, toggleTaskIndex: this.props.toggleTaskIndex}), 
				
				(isDiffSection && typeof this.props.items.diffOpType != 'undefined' && this.props.items.diffOpType == 'DELETED') || (typeof this.props.items.isFromChecklist != 'undefined' && this.props.items.isFromChecklist == true && this.props.isChecklist == true) ? null : 
					React.createElement(TaskStateHeader, {state: this.props.items.state, mode: this.props.mode, keyVal: this.props.keyVal, items: this.props.items, taskNum: this.props.taskNum, storeId: storeId, slideTask: this.props.slideTask, toggleTaskIndex: this.props.toggleTaskIndex}), 
				
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "col-md-12", style: {marginTop: "10px"}}, 
						(isDiffSection && typeof this.props.items.diffOpType != 'undefined' && this.props.items.diffOpType == 'DELETED' || this.props.mode == "template" )? null :
							React.createElement("div", {className: "col-md-5 header-requester-outter", style: {display: style, position: "relative", width: "auto"}}, 
								React.createElement(TaskRequester, {requester: this.props.items.requester, allWriters: this.props.allWriters, storeId: storeId, mode: this.props.mode, slideTask: this.props.slideTask, toggleTaskIndex: this.props.toggleTaskIndex})
							), 
						
						isDiffSection && typeof this.props.items.diffOpType != 'undefined' && this.props.items.diffOpType == 'DELETED' ? null :
							React.createElement("div", {className: "col-md-7", style: {display: style, position: "relative", width: "auto", float: "right"}}, 
								React.createElement(TaskAssignees, {assignees: this.props.items.assignees, allWriters: this.props.allWriters, writers: this.props.writers, favWriters: this.props.favWriters, currentUser: this.props.currentUser, storeId: storeId, mode: this.props.mode, slideTask: this.props.slideTask, toggleTaskIndex: this.props.toggleTaskIndex})
							)
						
					)
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {className: "col-md-12 taskDiffSentenceOutter"}, 
						this.returnAditionalInfo(additionalInfo, "titleChanged"), 
						this.returnAditionalInfo(additionalInfo, "stateChange"), 
						this.returnAditionalInfo(additionalInfo, "requesterChange"), 
						this.returnAditionalInfo(additionalInfo, "assigneeChange"), 
						this.returnAditionalInfo(additionalInfo, "descriptionChanged")
					)
				)
			)
		);
	}
});
module.exports = TaskListsCompHeader;

},{"../stores/TaskStore":12,"../stores/WritersStore":13,"./TaskCollapseArrow.react":5,"./TaskStateReadViewHtml.react":9,"clipboard/dist/clipboard.min":16,"create-react-class":18,"react":"react","react-awesome-popover":27,"react-dom":"react-dom"}],9:[function(require,module,exports){
var React = require('react');
var createReactClass = require('create-react-class');
var TaskStateReadViewHtml = createReactClass({
	render: function() {
		var state = this.props.taskState;
		var html = '';
		switch(state){
			case 'Accepted':
				html = React.createElement("span", {"data-state": "Accepted", className: "state-actions taskState accepted readView"}, "Accepted");
			break;
			case 'Unstarted':
				html = React.createElement("span", {"data-state": "Unstarted", className: "state-actions taskState start btn btn-info readView", "data-title": "disabled-button"}, "Start");
			break;
			case 'Started':
				html = React.createElement("span", {"data-state": "Started", className: "state-actions taskState start btn btn-info readView", "data-title": "disabled-button"}, "Finish");
			break;
			case 'Finished':
				html = React.createElement("span", {"data-state": "Finished", className: "state-actions taskState delivered btn btn-info readView", "data-title": "disabled-button"}, "Deliver");
			break;
			case 'Delivered':
				html = React.createElement("span", {"data-state": "Delivered", className: "state-actions"}, React.createElement("span", {className: "taskState delivered btn btn-success readView", "data-title": "disabled-button"}, "Accept"), React.createElement("span", {className: "taskState rejected btn btn-danger", "data-title": "disabled-button"}, "Reject"));
			break;
			case 'Rejected':
				html = React.createElement("span", {"data-state": "Rejected", className: "state-actions taskState rejected btn btn-info readView", "data-title": "disabled-button"}, "ReStart");
			break;
			case 'NoLongerApplicable':
				html = React.createElement("span", {"data-state": "NoLongerApplicable", className: "state-actions taskState btn noLonger pull-right", title: "No Longer Applicable"}, "No Longer Appl.");
			break;
			default:
			
			break;
		}		
		return (
			React.createElement("div", {style: {position: "relative"}}, 
				html
			)
		)
	}
});
module.exports = TaskStateReadViewHtml;

},{"create-react-class":18,"react":"react"}],10:[function(require,module,exports){
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

},{"fbjs/lib/keyMirror":23}],11:[function(require,module,exports){
var Dispatcher = require('flux').Dispatcher;

// Create dispatcher instance
var AppDispatcher = new Dispatcher();

// Convenience method to handle dispatch requests
AppDispatcher.handleAction = function(action) {
  this.dispatch({
    source: 'VIEW_ACTION',
    action: action
  });
}

module.exports = AppDispatcher;

},{"flux":"flux"}],12:[function(require,module,exports){
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
	if(key == "Null" && indexName == "taskNum"){
		_taskData[storeId].taskNum = indexValue;
		_taskData[storeId].expandTask = true;
	}else{
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
		if(indexName == "title" || indexName == "assignees" || indexName == "state" || indexName == "requester"  || indexName == "description" || indexName == "priority") {
			_taskData[storeId].taskables[key].shouldUpdateHeader = true;
		}
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
		if(_taskData[storeId].taskNum > 0 && _taskData[storeId].taskNum != undefined && _taskData[storeId].taskNum != null && _taskData[storeId].taskNum != "undefined" && _taskData[storeId].taskNum != "null" && _taskData[storeId].taskNum != ""){
			if(!_taskData[storeId].filterBy) _taskData[storeId].filterBy = "all";
			// delete _taskData[storeId].taskNum;
		}else{
			// if filterBy not set then it should be openTasks by default
			if(!_taskData[storeId].filterBy) _taskData[storeId].filterBy = "openTasks";
		}
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

},{"../constants/TaskConstants":10,"../dispatcher/AppDispatcher":11,"events":19,"underscore":"underscore"}],13:[function(require,module,exports){
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

},{"../constants/TaskConstants":10,"../dispatcher/AppDispatcher":11,"events":19,"underscore":"underscore"}],14:[function(require,module,exports){
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

},{"../constants/TaskConstants":10,"../dispatcher/AppDispatcher":11,"events":19,"underscore":"underscore"}],15:[function(require,module,exports){
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

},{"../actions/TaskActions":1,"../actions/WritersActions":2}],16:[function(require,module,exports){
(function (global){
/*!
 * clipboard.js v1.7.1
 * https://zenorocha.github.io/clipboard.js
 *
 * Licensed MIT © Zeno Rocha
 */
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.Clipboard=t()}}(function(){var t,e,n;return function t(e,n,o){function i(a,c){if(!n[a]){if(!e[a]){var l="function"==typeof require&&require;if(!c&&l)return l(a,!0);if(r)return r(a,!0);var s=new Error("Cannot find module '"+a+"'");throw s.code="MODULE_NOT_FOUND",s}var u=n[a]={exports:{}};e[a][0].call(u.exports,function(t){var n=e[a][1][t];return i(n||t)},u,u.exports,t,e,n,o)}return n[a].exports}for(var r="function"==typeof require&&require,a=0;a<o.length;a++)i(o[a]);return i}({1:[function(t,e,n){function o(t,e){for(;t&&t.nodeType!==i;){if("function"==typeof t.matches&&t.matches(e))return t;t=t.parentNode}}var i=9;if("undefined"!=typeof Element&&!Element.prototype.matches){var r=Element.prototype;r.matches=r.matchesSelector||r.mozMatchesSelector||r.msMatchesSelector||r.oMatchesSelector||r.webkitMatchesSelector}e.exports=o},{}],2:[function(t,e,n){function o(t,e,n,o,r){var a=i.apply(this,arguments);return t.addEventListener(n,a,r),{destroy:function(){t.removeEventListener(n,a,r)}}}function i(t,e,n,o){return function(n){n.delegateTarget=r(n.target,e),n.delegateTarget&&o.call(t,n)}}var r=t("./closest");e.exports=o},{"./closest":1}],3:[function(t,e,n){n.node=function(t){return void 0!==t&&t instanceof HTMLElement&&1===t.nodeType},n.nodeList=function(t){var e=Object.prototype.toString.call(t);return void 0!==t&&("[object NodeList]"===e||"[object HTMLCollection]"===e)&&"length"in t&&(0===t.length||n.node(t[0]))},n.string=function(t){return"string"==typeof t||t instanceof String},n.fn=function(t){return"[object Function]"===Object.prototype.toString.call(t)}},{}],4:[function(t,e,n){function o(t,e,n){if(!t&&!e&&!n)throw new Error("Missing required arguments");if(!c.string(e))throw new TypeError("Second argument must be a String");if(!c.fn(n))throw new TypeError("Third argument must be a Function");if(c.node(t))return i(t,e,n);if(c.nodeList(t))return r(t,e,n);if(c.string(t))return a(t,e,n);throw new TypeError("First argument must be a String, HTMLElement, HTMLCollection, or NodeList")}function i(t,e,n){return t.addEventListener(e,n),{destroy:function(){t.removeEventListener(e,n)}}}function r(t,e,n){return Array.prototype.forEach.call(t,function(t){t.addEventListener(e,n)}),{destroy:function(){Array.prototype.forEach.call(t,function(t){t.removeEventListener(e,n)})}}}function a(t,e,n){return l(document.body,t,e,n)}var c=t("./is"),l=t("delegate");e.exports=o},{"./is":3,delegate:2}],5:[function(t,e,n){function o(t){var e;if("SELECT"===t.nodeName)t.focus(),e=t.value;else if("INPUT"===t.nodeName||"TEXTAREA"===t.nodeName){var n=t.hasAttribute("readonly");n||t.setAttribute("readonly",""),t.select(),t.setSelectionRange(0,t.value.length),n||t.removeAttribute("readonly"),e=t.value}else{t.hasAttribute("contenteditable")&&t.focus();var o=window.getSelection(),i=document.createRange();i.selectNodeContents(t),o.removeAllRanges(),o.addRange(i),e=o.toString()}return e}e.exports=o},{}],6:[function(t,e,n){function o(){}o.prototype={on:function(t,e,n){var o=this.e||(this.e={});return(o[t]||(o[t]=[])).push({fn:e,ctx:n}),this},once:function(t,e,n){function o(){i.off(t,o),e.apply(n,arguments)}var i=this;return o._=e,this.on(t,o,n)},emit:function(t){var e=[].slice.call(arguments,1),n=((this.e||(this.e={}))[t]||[]).slice(),o=0,i=n.length;for(o;o<i;o++)n[o].fn.apply(n[o].ctx,e);return this},off:function(t,e){var n=this.e||(this.e={}),o=n[t],i=[];if(o&&e)for(var r=0,a=o.length;r<a;r++)o[r].fn!==e&&o[r].fn._!==e&&i.push(o[r]);return i.length?n[t]=i:delete n[t],this}},e.exports=o},{}],7:[function(e,n,o){!function(i,r){if("function"==typeof t&&t.amd)t(["module","select"],r);else if(void 0!==o)r(n,e("select"));else{var a={exports:{}};r(a,i.select),i.clipboardAction=a.exports}}(this,function(t,e){"use strict";function n(t){return t&&t.__esModule?t:{default:t}}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var i=n(e),r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},a=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),c=function(){function t(e){o(this,t),this.resolveOptions(e),this.initSelection()}return a(t,[{key:"resolveOptions",value:function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.action=e.action,this.container=e.container,this.emitter=e.emitter,this.target=e.target,this.text=e.text,this.trigger=e.trigger,this.selectedText=""}},{key:"initSelection",value:function t(){this.text?this.selectFake():this.target&&this.selectTarget()}},{key:"selectFake",value:function t(){var e=this,n="rtl"==document.documentElement.getAttribute("dir");this.removeFake(),this.fakeHandlerCallback=function(){return e.removeFake()},this.fakeHandler=this.container.addEventListener("click",this.fakeHandlerCallback)||!0,this.fakeElem=document.createElement("textarea"),this.fakeElem.style.fontSize="12pt",this.fakeElem.style.border="0",this.fakeElem.style.padding="0",this.fakeElem.style.margin="0",this.fakeElem.style.position="absolute",this.fakeElem.style[n?"right":"left"]="-9999px";var o=window.pageYOffset||document.documentElement.scrollTop;this.fakeElem.style.top=o+"px",this.fakeElem.setAttribute("readonly",""),this.fakeElem.value=this.text,this.container.appendChild(this.fakeElem),this.selectedText=(0,i.default)(this.fakeElem),this.copyText()}},{key:"removeFake",value:function t(){this.fakeHandler&&(this.container.removeEventListener("click",this.fakeHandlerCallback),this.fakeHandler=null,this.fakeHandlerCallback=null),this.fakeElem&&(this.container.removeChild(this.fakeElem),this.fakeElem=null)}},{key:"selectTarget",value:function t(){this.selectedText=(0,i.default)(this.target),this.copyText()}},{key:"copyText",value:function t(){var e=void 0;try{e=document.execCommand(this.action)}catch(t){e=!1}this.handleResult(e)}},{key:"handleResult",value:function t(e){this.emitter.emit(e?"success":"error",{action:this.action,text:this.selectedText,trigger:this.trigger,clearSelection:this.clearSelection.bind(this)})}},{key:"clearSelection",value:function t(){this.trigger&&this.trigger.focus(),window.getSelection().removeAllRanges()}},{key:"destroy",value:function t(){this.removeFake()}},{key:"action",set:function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"copy";if(this._action=e,"copy"!==this._action&&"cut"!==this._action)throw new Error('Invalid "action" value, use either "copy" or "cut"')},get:function t(){return this._action}},{key:"target",set:function t(e){if(void 0!==e){if(!e||"object"!==(void 0===e?"undefined":r(e))||1!==e.nodeType)throw new Error('Invalid "target" value, use a valid Element');if("copy"===this.action&&e.hasAttribute("disabled"))throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if("cut"===this.action&&(e.hasAttribute("readonly")||e.hasAttribute("disabled")))throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');this._target=e}},get:function t(){return this._target}}]),t}();t.exports=c})},{select:5}],8:[function(e,n,o){!function(i,r){if("function"==typeof t&&t.amd)t(["module","./clipboard-action","tiny-emitter","good-listener"],r);else if(void 0!==o)r(n,e("./clipboard-action"),e("tiny-emitter"),e("good-listener"));else{var a={exports:{}};r(a,i.clipboardAction,i.tinyEmitter,i.goodListener),i.clipboard=a.exports}}(this,function(t,e,n,o){"use strict";function i(t){return t&&t.__esModule?t:{default:t}}function r(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function a(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function c(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function l(t,e){var n="data-clipboard-"+t;if(e.hasAttribute(n))return e.getAttribute(n)}var s=i(e),u=i(n),f=i(o),d="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},h=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),p=function(t){function e(t,n){r(this,e);var o=a(this,(e.__proto__||Object.getPrototypeOf(e)).call(this));return o.resolveOptions(n),o.listenClick(t),o}return c(e,t),h(e,[{key:"resolveOptions",value:function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};this.action="function"==typeof e.action?e.action:this.defaultAction,this.target="function"==typeof e.target?e.target:this.defaultTarget,this.text="function"==typeof e.text?e.text:this.defaultText,this.container="object"===d(e.container)?e.container:document.body}},{key:"listenClick",value:function t(e){var n=this;this.listener=(0,f.default)(e,"click",function(t){return n.onClick(t)})}},{key:"onClick",value:function t(e){var n=e.delegateTarget||e.currentTarget;this.clipboardAction&&(this.clipboardAction=null),this.clipboardAction=new s.default({action:this.action(n),target:this.target(n),text:this.text(n),container:this.container,trigger:n,emitter:this})}},{key:"defaultAction",value:function t(e){return l("action",e)}},{key:"defaultTarget",value:function t(e){var n=l("target",e);if(n)return document.querySelector(n)}},{key:"defaultText",value:function t(e){return l("text",e)}},{key:"destroy",value:function t(){this.listener.destroy(),this.clipboardAction&&(this.clipboardAction.destroy(),this.clipboardAction=null)}}],[{key:"isSupported",value:function t(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:["copy","cut"],n="string"==typeof e?[e]:e,o=!!document.queryCommandSupported;return n.forEach(function(t){o=o&&!!document.queryCommandSupported(t)}),o}}]),e}(u.default);t.exports=p})},{"./clipboard-action":7,"good-listener":4,"tiny-emitter":6}]},{},[8])(8)});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],17:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var _assign = require('object-assign');

var emptyObject = require('fbjs/lib/emptyObject');
var _invariant = require('fbjs/lib/invariant');

if (process.env.NODE_ENV !== 'production') {
  var warning = require('fbjs/lib/warning');
}

var MIXINS_KEY = 'mixins';

// Helper function to allow the creation of anonymous functions which do not
// have .name set to the name of the variable being assigned to.
function identity(fn) {
  return fn;
}

var ReactPropTypeLocationNames;
if (process.env.NODE_ENV !== 'production') {
  ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };
} else {
  ReactPropTypeLocationNames = {};
}

function factory(ReactComponent, isValidElement, ReactNoopUpdateQueue) {
  /**
   * Policies that describe methods in `ReactClassInterface`.
   */

  var injectedMixins = [];

  /**
   * Composite components are higher-level components that compose other composite
   * or host components.
   *
   * To create a new type of `ReactClass`, pass a specification of
   * your new class to `React.createClass`. The only requirement of your class
   * specification is that you implement a `render` method.
   *
   *   var MyComponent = React.createClass({
   *     render: function() {
   *       return <div>Hello World</div>;
   *     }
   *   });
   *
   * The class specification supports a specific protocol of methods that have
   * special meaning (e.g. `render`). See `ReactClassInterface` for
   * more the comprehensive protocol. Any other properties and methods in the
   * class specification will be available on the prototype.
   *
   * @interface ReactClassInterface
   * @internal
   */
  var ReactClassInterface = {
    /**
     * An array of Mixin objects to include when defining your component.
     *
     * @type {array}
     * @optional
     */
    mixins: 'DEFINE_MANY',

    /**
     * An object containing properties and methods that should be defined on
     * the component's constructor instead of its prototype (static methods).
     *
     * @type {object}
     * @optional
     */
    statics: 'DEFINE_MANY',

    /**
     * Definition of prop types for this component.
     *
     * @type {object}
     * @optional
     */
    propTypes: 'DEFINE_MANY',

    /**
     * Definition of context types for this component.
     *
     * @type {object}
     * @optional
     */
    contextTypes: 'DEFINE_MANY',

    /**
     * Definition of context types this component sets for its children.
     *
     * @type {object}
     * @optional
     */
    childContextTypes: 'DEFINE_MANY',

    // ==== Definition methods ====

    /**
     * Invoked when the component is mounted. Values in the mapping will be set on
     * `this.props` if that prop is not specified (i.e. using an `in` check).
     *
     * This method is invoked before `getInitialState` and therefore cannot rely
     * on `this.state` or use `this.setState`.
     *
     * @return {object}
     * @optional
     */
    getDefaultProps: 'DEFINE_MANY_MERGED',

    /**
     * Invoked once before the component is mounted. The return value will be used
     * as the initial value of `this.state`.
     *
     *   getInitialState: function() {
     *     return {
     *       isOn: false,
     *       fooBaz: new BazFoo()
     *     }
     *   }
     *
     * @return {object}
     * @optional
     */
    getInitialState: 'DEFINE_MANY_MERGED',

    /**
     * @return {object}
     * @optional
     */
    getChildContext: 'DEFINE_MANY_MERGED',

    /**
     * Uses props from `this.props` and state from `this.state` to render the
     * structure of the component.
     *
     * No guarantees are made about when or how often this method is invoked, so
     * it must not have side effects.
     *
     *   render: function() {
     *     var name = this.props.name;
     *     return <div>Hello, {name}!</div>;
     *   }
     *
     * @return {ReactComponent}
     * @required
     */
    render: 'DEFINE_ONCE',

    // ==== Delegate methods ====

    /**
     * Invoked when the component is initially created and about to be mounted.
     * This may have side effects, but any external subscriptions or data created
     * by this method must be cleaned up in `componentWillUnmount`.
     *
     * @optional
     */
    componentWillMount: 'DEFINE_MANY',

    /**
     * Invoked when the component has been mounted and has a DOM representation.
     * However, there is no guarantee that the DOM node is in the document.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been mounted (initialized and rendered) for the first time.
     *
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidMount: 'DEFINE_MANY',

    /**
     * Invoked before the component receives new props.
     *
     * Use this as an opportunity to react to a prop transition by updating the
     * state using `this.setState`. Current props are accessed via `this.props`.
     *
     *   componentWillReceiveProps: function(nextProps, nextContext) {
     *     this.setState({
     *       likesIncreasing: nextProps.likeCount > this.props.likeCount
     *     });
     *   }
     *
     * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
     * transition may cause a state change, but the opposite is not true. If you
     * need it, you are probably looking for `componentWillUpdate`.
     *
     * @param {object} nextProps
     * @optional
     */
    componentWillReceiveProps: 'DEFINE_MANY',

    /**
     * Invoked while deciding if the component should be updated as a result of
     * receiving new props, state and/or context.
     *
     * Use this as an opportunity to `return false` when you're certain that the
     * transition to the new props/state/context will not require a component
     * update.
     *
     *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
     *     return !equal(nextProps, this.props) ||
     *       !equal(nextState, this.state) ||
     *       !equal(nextContext, this.context);
     *   }
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @return {boolean} True if the component should update.
     * @optional
     */
    shouldComponentUpdate: 'DEFINE_ONCE',

    /**
     * Invoked when the component is about to update due to a transition from
     * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
     * and `nextContext`.
     *
     * Use this as an opportunity to perform preparation before an update occurs.
     *
     * NOTE: You **cannot** use `this.setState()` in this method.
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @param {ReactReconcileTransaction} transaction
     * @optional
     */
    componentWillUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component's DOM representation has been updated.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been updated.
     *
     * @param {object} prevProps
     * @param {?object} prevState
     * @param {?object} prevContext
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component is about to be removed from its parent and have
     * its DOM representation destroyed.
     *
     * Use this as an opportunity to deallocate any external resources.
     *
     * NOTE: There is no `componentDidUnmount` since your component will have been
     * destroyed by that point.
     *
     * @optional
     */
    componentWillUnmount: 'DEFINE_MANY',

    /**
     * Replacement for (deprecated) `componentWillMount`.
     *
     * @optional
     */
    UNSAFE_componentWillMount: 'DEFINE_MANY',

    /**
     * Replacement for (deprecated) `componentWillReceiveProps`.
     *
     * @optional
     */
    UNSAFE_componentWillReceiveProps: 'DEFINE_MANY',

    /**
     * Replacement for (deprecated) `componentWillUpdate`.
     *
     * @optional
     */
    UNSAFE_componentWillUpdate: 'DEFINE_MANY',

    // ==== Advanced methods ====

    /**
     * Updates the component's currently mounted DOM representation.
     *
     * By default, this implements React's rendering and reconciliation algorithm.
     * Sophisticated clients may wish to override this.
     *
     * @param {ReactReconcileTransaction} transaction
     * @internal
     * @overridable
     */
    updateComponent: 'OVERRIDE_BASE'
  };

  /**
   * Similar to ReactClassInterface but for static methods.
   */
  var ReactClassStaticInterface = {
    /**
     * This method is invoked after a component is instantiated and when it
     * receives new props. Return an object to update state in response to
     * prop changes. Return null to indicate no change to state.
     *
     * If an object is returned, its keys will be merged into the existing state.
     *
     * @return {object || null}
     * @optional
     */
    getDerivedStateFromProps: 'DEFINE_MANY_MERGED'
  };

  /**
   * Mapping from class specification keys to special processing functions.
   *
   * Although these are declared like instance properties in the specification
   * when defining classes using `React.createClass`, they are actually static
   * and are accessible on the constructor instead of the prototype. Despite
   * being static, they must be defined outside of the "statics" key under
   * which all other static methods are defined.
   */
  var RESERVED_SPEC_KEYS = {
    displayName: function(Constructor, displayName) {
      Constructor.displayName = displayName;
    },
    mixins: function(Constructor, mixins) {
      if (mixins) {
        for (var i = 0; i < mixins.length; i++) {
          mixSpecIntoComponent(Constructor, mixins[i]);
        }
      }
    },
    childContextTypes: function(Constructor, childContextTypes) {
      if (process.env.NODE_ENV !== 'production') {
        validateTypeDef(Constructor, childContextTypes, 'childContext');
      }
      Constructor.childContextTypes = _assign(
        {},
        Constructor.childContextTypes,
        childContextTypes
      );
    },
    contextTypes: function(Constructor, contextTypes) {
      if (process.env.NODE_ENV !== 'production') {
        validateTypeDef(Constructor, contextTypes, 'context');
      }
      Constructor.contextTypes = _assign(
        {},
        Constructor.contextTypes,
        contextTypes
      );
    },
    /**
     * Special case getDefaultProps which should move into statics but requires
     * automatic merging.
     */
    getDefaultProps: function(Constructor, getDefaultProps) {
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps = createMergedResultFunction(
          Constructor.getDefaultProps,
          getDefaultProps
        );
      } else {
        Constructor.getDefaultProps = getDefaultProps;
      }
    },
    propTypes: function(Constructor, propTypes) {
      if (process.env.NODE_ENV !== 'production') {
        validateTypeDef(Constructor, propTypes, 'prop');
      }
      Constructor.propTypes = _assign({}, Constructor.propTypes, propTypes);
    },
    statics: function(Constructor, statics) {
      mixStaticSpecIntoComponent(Constructor, statics);
    },
    autobind: function() {}
  };

  function validateTypeDef(Constructor, typeDef, location) {
    for (var propName in typeDef) {
      if (typeDef.hasOwnProperty(propName)) {
        // use a warning instead of an _invariant so components
        // don't show up in prod but only in __DEV__
        if (process.env.NODE_ENV !== 'production') {
          warning(
            typeof typeDef[propName] === 'function',
            '%s: %s type `%s` is invalid; it must be a function, usually from ' +
              'React.PropTypes.',
            Constructor.displayName || 'ReactClass',
            ReactPropTypeLocationNames[location],
            propName
          );
        }
      }
    }
  }

  function validateMethodOverride(isAlreadyDefined, name) {
    var specPolicy = ReactClassInterface.hasOwnProperty(name)
      ? ReactClassInterface[name]
      : null;

    // Disallow overriding of base class methods unless explicitly allowed.
    if (ReactClassMixin.hasOwnProperty(name)) {
      _invariant(
        specPolicy === 'OVERRIDE_BASE',
        'ReactClassInterface: You are attempting to override ' +
          '`%s` from your class specification. Ensure that your method names ' +
          'do not overlap with React methods.',
        name
      );
    }

    // Disallow defining methods more than once unless explicitly allowed.
    if (isAlreadyDefined) {
      _invariant(
        specPolicy === 'DEFINE_MANY' || specPolicy === 'DEFINE_MANY_MERGED',
        'ReactClassInterface: You are attempting to define ' +
          '`%s` on your component more than once. This conflict may be due ' +
          'to a mixin.',
        name
      );
    }
  }

  /**
   * Mixin helper which handles policy validation and reserved
   * specification keys when building React classes.
   */
  function mixSpecIntoComponent(Constructor, spec) {
    if (!spec) {
      if (process.env.NODE_ENV !== 'production') {
        var typeofSpec = typeof spec;
        var isMixinValid = typeofSpec === 'object' && spec !== null;

        if (process.env.NODE_ENV !== 'production') {
          warning(
            isMixinValid,
            "%s: You're attempting to include a mixin that is either null " +
              'or not an object. Check the mixins included by the component, ' +
              'as well as any mixins they include themselves. ' +
              'Expected object but got %s.',
            Constructor.displayName || 'ReactClass',
            spec === null ? null : typeofSpec
          );
        }
      }

      return;
    }

    _invariant(
      typeof spec !== 'function',
      "ReactClass: You're attempting to " +
        'use a component class or function as a mixin. Instead, just use a ' +
        'regular object.'
    );
    _invariant(
      !isValidElement(spec),
      "ReactClass: You're attempting to " +
        'use a component as a mixin. Instead, just use a regular object.'
    );

    var proto = Constructor.prototype;
    var autoBindPairs = proto.__reactAutoBindPairs;

    // By handling mixins before any other properties, we ensure the same
    // chaining order is applied to methods with DEFINE_MANY policy, whether
    // mixins are listed before or after these methods in the spec.
    if (spec.hasOwnProperty(MIXINS_KEY)) {
      RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
    }

    for (var name in spec) {
      if (!spec.hasOwnProperty(name)) {
        continue;
      }

      if (name === MIXINS_KEY) {
        // We have already handled mixins in a special case above.
        continue;
      }

      var property = spec[name];
      var isAlreadyDefined = proto.hasOwnProperty(name);
      validateMethodOverride(isAlreadyDefined, name);

      if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
        RESERVED_SPEC_KEYS[name](Constructor, property);
      } else {
        // Setup methods on prototype:
        // The following member methods should not be automatically bound:
        // 1. Expected ReactClass methods (in the "interface").
        // 2. Overridden methods (that were mixed in).
        var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
        var isFunction = typeof property === 'function';
        var shouldAutoBind =
          isFunction &&
          !isReactClassMethod &&
          !isAlreadyDefined &&
          spec.autobind !== false;

        if (shouldAutoBind) {
          autoBindPairs.push(name, property);
          proto[name] = property;
        } else {
          if (isAlreadyDefined) {
            var specPolicy = ReactClassInterface[name];

            // These cases should already be caught by validateMethodOverride.
            _invariant(
              isReactClassMethod &&
                (specPolicy === 'DEFINE_MANY_MERGED' ||
                  specPolicy === 'DEFINE_MANY'),
              'ReactClass: Unexpected spec policy %s for key %s ' +
                'when mixing in component specs.',
              specPolicy,
              name
            );

            // For methods which are defined more than once, call the existing
            // methods before calling the new property, merging if appropriate.
            if (specPolicy === 'DEFINE_MANY_MERGED') {
              proto[name] = createMergedResultFunction(proto[name], property);
            } else if (specPolicy === 'DEFINE_MANY') {
              proto[name] = createChainedFunction(proto[name], property);
            }
          } else {
            proto[name] = property;
            if (process.env.NODE_ENV !== 'production') {
              // Add verbose displayName to the function, which helps when looking
              // at profiling tools.
              if (typeof property === 'function' && spec.displayName) {
                proto[name].displayName = spec.displayName + '_' + name;
              }
            }
          }
        }
      }
    }
  }

  function mixStaticSpecIntoComponent(Constructor, statics) {
    if (!statics) {
      return;
    }

    for (var name in statics) {
      var property = statics[name];
      if (!statics.hasOwnProperty(name)) {
        continue;
      }

      var isReserved = name in RESERVED_SPEC_KEYS;
      _invariant(
        !isReserved,
        'ReactClass: You are attempting to define a reserved ' +
          'property, `%s`, that shouldn\'t be on the "statics" key. Define it ' +
          'as an instance property instead; it will still be accessible on the ' +
          'constructor.',
        name
      );

      var isAlreadyDefined = name in Constructor;
      if (isAlreadyDefined) {
        var specPolicy = ReactClassStaticInterface.hasOwnProperty(name)
          ? ReactClassStaticInterface[name]
          : null;

        _invariant(
          specPolicy === 'DEFINE_MANY_MERGED',
          'ReactClass: You are attempting to define ' +
            '`%s` on your component more than once. This conflict may be ' +
            'due to a mixin.',
          name
        );

        Constructor[name] = createMergedResultFunction(Constructor[name], property);

        return;
      }

      Constructor[name] = property;
    }
  }

  /**
   * Merge two objects, but throw if both contain the same key.
   *
   * @param {object} one The first object, which is mutated.
   * @param {object} two The second object
   * @return {object} one after it has been mutated to contain everything in two.
   */
  function mergeIntoWithNoDuplicateKeys(one, two) {
    _invariant(
      one && two && typeof one === 'object' && typeof two === 'object',
      'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.'
    );

    for (var key in two) {
      if (two.hasOwnProperty(key)) {
        _invariant(
          one[key] === undefined,
          'mergeIntoWithNoDuplicateKeys(): ' +
            'Tried to merge two objects with the same key: `%s`. This conflict ' +
            'may be due to a mixin; in particular, this may be caused by two ' +
            'getInitialState() or getDefaultProps() methods returning objects ' +
            'with clashing keys.',
          key
        );
        one[key] = two[key];
      }
    }
    return one;
  }

  /**
   * Creates a function that invokes two functions and merges their return values.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */
  function createMergedResultFunction(one, two) {
    return function mergedResult() {
      var a = one.apply(this, arguments);
      var b = two.apply(this, arguments);
      if (a == null) {
        return b;
      } else if (b == null) {
        return a;
      }
      var c = {};
      mergeIntoWithNoDuplicateKeys(c, a);
      mergeIntoWithNoDuplicateKeys(c, b);
      return c;
    };
  }

  /**
   * Creates a function that invokes two functions and ignores their return vales.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */
  function createChainedFunction(one, two) {
    return function chainedFunction() {
      one.apply(this, arguments);
      two.apply(this, arguments);
    };
  }

  /**
   * Binds a method to the component.
   *
   * @param {object} component Component whose method is going to be bound.
   * @param {function} method Method to be bound.
   * @return {function} The bound method.
   */
  function bindAutoBindMethod(component, method) {
    var boundMethod = method.bind(component);
    if (process.env.NODE_ENV !== 'production') {
      boundMethod.__reactBoundContext = component;
      boundMethod.__reactBoundMethod = method;
      boundMethod.__reactBoundArguments = null;
      var componentName = component.constructor.displayName;
      var _bind = boundMethod.bind;
      boundMethod.bind = function(newThis) {
        for (
          var _len = arguments.length,
            args = Array(_len > 1 ? _len - 1 : 0),
            _key = 1;
          _key < _len;
          _key++
        ) {
          args[_key - 1] = arguments[_key];
        }

        // User is trying to bind() an autobound method; we effectively will
        // ignore the value of "this" that the user is trying to use, so
        // let's warn.
        if (newThis !== component && newThis !== null) {
          if (process.env.NODE_ENV !== 'production') {
            warning(
              false,
              'bind(): React component methods may only be bound to the ' +
                'component instance. See %s',
              componentName
            );
          }
        } else if (!args.length) {
          if (process.env.NODE_ENV !== 'production') {
            warning(
              false,
              'bind(): You are binding a component method to the component. ' +
                'React does this for you automatically in a high-performance ' +
                'way, so you can safely remove this call. See %s',
              componentName
            );
          }
          return boundMethod;
        }
        var reboundMethod = _bind.apply(boundMethod, arguments);
        reboundMethod.__reactBoundContext = component;
        reboundMethod.__reactBoundMethod = method;
        reboundMethod.__reactBoundArguments = args;
        return reboundMethod;
      };
    }
    return boundMethod;
  }

  /**
   * Binds all auto-bound methods in a component.
   *
   * @param {object} component Component whose method is going to be bound.
   */
  function bindAutoBindMethods(component) {
    var pairs = component.__reactAutoBindPairs;
    for (var i = 0; i < pairs.length; i += 2) {
      var autoBindKey = pairs[i];
      var method = pairs[i + 1];
      component[autoBindKey] = bindAutoBindMethod(component, method);
    }
  }

  var IsMountedPreMixin = {
    componentDidMount: function() {
      this.__isMounted = true;
    }
  };

  var IsMountedPostMixin = {
    componentWillUnmount: function() {
      this.__isMounted = false;
    }
  };

  /**
   * Add more to the ReactClass base class. These are all legacy features and
   * therefore not already part of the modern ReactComponent.
   */
  var ReactClassMixin = {
    /**
     * TODO: This will be deprecated because state should always keep a consistent
     * type signature and the only use case for this, is to avoid that.
     */
    replaceState: function(newState, callback) {
      this.updater.enqueueReplaceState(this, newState, callback);
    },

    /**
     * Checks whether or not this composite component is mounted.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function() {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          this.__didWarnIsMounted,
          '%s: isMounted is deprecated. Instead, make sure to clean up ' +
            'subscriptions and pending requests in componentWillUnmount to ' +
            'prevent memory leaks.',
          (this.constructor && this.constructor.displayName) ||
            this.name ||
            'Component'
        );
        this.__didWarnIsMounted = true;
      }
      return !!this.__isMounted;
    }
  };

  var ReactClassComponent = function() {};
  _assign(
    ReactClassComponent.prototype,
    ReactComponent.prototype,
    ReactClassMixin
  );

  /**
   * Creates a composite component class given a class specification.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
   *
   * @param {object} spec Class specification (which must define `render`).
   * @return {function} Component constructor function.
   * @public
   */
  function createClass(spec) {
    // To keep our warnings more understandable, we'll use a little hack here to
    // ensure that Constructor.name !== 'Constructor'. This makes sure we don't
    // unnecessarily identify a class without displayName as 'Constructor'.
    var Constructor = identity(function(props, context, updater) {
      // This constructor gets overridden by mocks. The argument is used
      // by mocks to assert on what gets mounted.

      if (process.env.NODE_ENV !== 'production') {
        warning(
          this instanceof Constructor,
          'Something is calling a React component directly. Use a factory or ' +
            'JSX instead. See: https://fb.me/react-legacyfactory'
        );
      }

      // Wire up auto-binding
      if (this.__reactAutoBindPairs.length) {
        bindAutoBindMethods(this);
      }

      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;

      this.state = null;

      // ReactClasses doesn't have constructors. Instead, they use the
      // getInitialState and componentWillMount methods for initialization.

      var initialState = this.getInitialState ? this.getInitialState() : null;
      if (process.env.NODE_ENV !== 'production') {
        // We allow auto-mocks to proceed as if they're returning null.
        if (
          initialState === undefined &&
          this.getInitialState._isMockFunction
        ) {
          // This is probably bad practice. Consider warning here and
          // deprecating this convenience.
          initialState = null;
        }
      }
      _invariant(
        typeof initialState === 'object' && !Array.isArray(initialState),
        '%s.getInitialState(): must return an object or null',
        Constructor.displayName || 'ReactCompositeComponent'
      );

      this.state = initialState;
    });
    Constructor.prototype = new ReactClassComponent();
    Constructor.prototype.constructor = Constructor;
    Constructor.prototype.__reactAutoBindPairs = [];

    injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));

    mixSpecIntoComponent(Constructor, IsMountedPreMixin);
    mixSpecIntoComponent(Constructor, spec);
    mixSpecIntoComponent(Constructor, IsMountedPostMixin);

    // Initialize the defaultProps property after all mixins have been merged.
    if (Constructor.getDefaultProps) {
      Constructor.defaultProps = Constructor.getDefaultProps();
    }

    if (process.env.NODE_ENV !== 'production') {
      // This is a tag to indicate that the use of these method names is ok,
      // since it's used with createClass. If it's not, then it's likely a
      // mistake so we'll warn you to use the static property, property
      // initializer or constructor respectively.
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps.isReactClassApproved = {};
      }
      if (Constructor.prototype.getInitialState) {
        Constructor.prototype.getInitialState.isReactClassApproved = {};
      }
    }

    _invariant(
      Constructor.prototype.render,
      'createClass(...): Class specification must implement a `render` method.'
    );

    if (process.env.NODE_ENV !== 'production') {
      warning(
        !Constructor.prototype.componentShouldUpdate,
        '%s has a method called ' +
          'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' +
          'The name is phrased as a question because the function is ' +
          'expected to return a value.',
        spec.displayName || 'A component'
      );
      warning(
        !Constructor.prototype.componentWillRecieveProps,
        '%s has a method called ' +
          'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?',
        spec.displayName || 'A component'
      );
      warning(
        !Constructor.prototype.UNSAFE_componentWillRecieveProps,
        '%s has a method called UNSAFE_componentWillRecieveProps(). ' +
          'Did you mean UNSAFE_componentWillReceiveProps()?',
        spec.displayName || 'A component'
      );
    }

    // Reduce time spent doing lookups by setting these on the prototype.
    for (var methodName in ReactClassInterface) {
      if (!Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = null;
      }
    }

    return Constructor;
  }

  return createClass;
}

module.exports = factory;

}).call(this,require('_process'))
},{"_process":26,"fbjs/lib/emptyObject":21,"fbjs/lib/invariant":22,"fbjs/lib/warning":24,"object-assign":25}],18:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var React = require('react');
var factory = require('./factory');

if (typeof React === 'undefined') {
  throw Error(
    'create-react-class could not find the React object. If you are using script tags, ' +
      'make sure that React is being loaded before create-react-class.'
  );
}

// Hack to grab NoopUpdateQueue from isomorphic React
var ReactNoopUpdateQueue = new React.Component().updater;

module.exports = factory(
  React.Component,
  React.isValidElement,
  ReactNoopUpdateQueue
);

},{"./factory":17,"react":"react"}],19:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var objectCreate = Object.create || objectCreatePolyfill
var objectKeys = Object.keys || objectKeysPolyfill
var bind = Function.prototype.bind || functionBindPolyfill

function EventEmitter() {
  if (!this._events || !Object.prototype.hasOwnProperty.call(this, '_events')) {
    this._events = objectCreate(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

var hasDefineProperty;
try {
  var o = {};
  if (Object.defineProperty) Object.defineProperty(o, 'x', { value: 0 });
  hasDefineProperty = o.x === 0;
} catch (err) { hasDefineProperty = false }
if (hasDefineProperty) {
  Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    enumerable: true,
    get: function() {
      return defaultMaxListeners;
    },
    set: function(arg) {
      // check whether the input is a positive number (whose value is zero or
      // greater and not a NaN).
      if (typeof arg !== 'number' || arg < 0 || arg !== arg)
        throw new TypeError('"defaultMaxListeners" must be a positive number');
      defaultMaxListeners = arg;
    }
  });
} else {
  EventEmitter.defaultMaxListeners = defaultMaxListeners;
}

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || isNaN(n))
    throw new TypeError('"n" argument must be a positive number');
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

// These standalone emit* functions are used to optimize calling of event
// handlers for fast cases because emit() itself often has a variable number of
// arguments and can be deoptimized because of that. These functions always have
// the same number of arguments and thus do not get deoptimized, so the code
// inside them can execute faster.
function emitNone(handler, isFn, self) {
  if (isFn)
    handler.call(self);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self);
  }
}
function emitOne(handler, isFn, self, arg1) {
  if (isFn)
    handler.call(self, arg1);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1);
  }
}
function emitTwo(handler, isFn, self, arg1, arg2) {
  if (isFn)
    handler.call(self, arg1, arg2);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2);
  }
}
function emitThree(handler, isFn, self, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].call(self, arg1, arg2, arg3);
  }
}

function emitMany(handler, isFn, self, args) {
  if (isFn)
    handler.apply(self, args);
  else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners[i].apply(self, args);
  }
}

EventEmitter.prototype.emit = function emit(type) {
  var er, handler, len, args, i, events;
  var doError = (type === 'error');

  events = this._events;
  if (events)
    doError = (doError && events.error == null);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    if (arguments.length > 1)
      er = arguments[1];
    if (er instanceof Error) {
      throw er; // Unhandled 'error' event
    } else {
      // At least give some kind of context to the user
      var err = new Error('Unhandled "error" event. (' + er + ')');
      err.context = er;
      throw err;
    }
    return false;
  }

  handler = events[type];

  if (!handler)
    return false;

  var isFn = typeof handler === 'function';
  len = arguments.length;
  switch (len) {
      // fast cases
    case 1:
      emitNone(handler, isFn, this);
      break;
    case 2:
      emitOne(handler, isFn, this, arguments[1]);
      break;
    case 3:
      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
      break;
    case 4:
      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
      break;
      // slower
    default:
      args = new Array(len - 1);
      for (i = 1; i < len; i++)
        args[i - 1] = arguments[i];
      emitMany(handler, isFn, this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');

  events = target._events;
  if (!events) {
    events = target._events = objectCreate(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener) {
      target.emit('newListener', type,
          listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (!existing) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
          prepend ? [listener, existing] : [existing, listener];
    } else {
      // If we've already got an array, just append.
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }

    // Check for listener leak
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error('Possible EventEmitter memory leak detected. ' +
            existing.length + ' "' + String(type) + '" listeners ' +
            'added. Use emitter.setMaxListeners() to ' +
            'increase limit.');
        w.name = 'MaxListenersExceededWarning';
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        if (typeof console === 'object' && console.warn) {
          console.warn('%s: %s', w.name, w.message);
        }
      }
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    switch (arguments.length) {
      case 0:
        return this.listener.call(this.target);
      case 1:
        return this.listener.call(this.target, arguments[0]);
      case 2:
        return this.listener.call(this.target, arguments[0], arguments[1]);
      case 3:
        return this.listener.call(this.target, arguments[0], arguments[1],
            arguments[2]);
      default:
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; ++i)
          args[i] = arguments[i];
        this.listener.apply(this.target, args);
    }
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = bind.call(onceWrapper, state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function')
    throw new TypeError('"listener" argument must be a function');
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function')
        throw new TypeError('"listener" argument must be a function');

      events = this._events;
      if (!events)
        return this;

      list = events[type];
      if (!list)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = objectCreate(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else
          spliceOne(list, position);

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (!events)
        return this;

      // not listening for removeListener, no need to emit
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = objectCreate(null);
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = objectCreate(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = objectKeys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = objectCreate(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (!events)
    return [];

  var evlistener = events[type];
  if (!evlistener)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
};

// About 1.5x faster than the two-arg version of Array#splice().
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function objectCreatePolyfill(proto) {
  var F = function() {};
  F.prototype = proto;
  return new F;
}
function objectKeysPolyfill(obj) {
  var keys = [];
  for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) {
    keys.push(k);
  }
  return k;
}
function functionBindPolyfill(context) {
  var fn = this;
  return function () {
    return fn.apply(context, arguments);
  };
}

},{}],20:[function(require,module,exports){
"use strict";

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;
},{}],21:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var emptyObject = {};

if (process.env.NODE_ENV !== 'production') {
  Object.freeze(emptyObject);
}

module.exports = emptyObject;
}).call(this,require('_process'))
},{"_process":26}],22:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
}).call(this,require('_process'))
},{"_process":26}],23:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks static-only
 */

'use strict';

var invariant = require('./invariant');

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function keyMirror(obj) {
  var ret = {};
  var key;
  !(obj instanceof Object && !Array.isArray(obj)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'keyMirror(...): Argument must be an object.') : invariant(false) : void 0;
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;
}).call(this,require('_process'))
},{"./invariant":22,"_process":26}],24:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

var emptyFunction = require('./emptyFunction');

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;
}).call(this,require('_process'))
},{"./emptyFunction":20,"_process":26}],25:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],26:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],27:[function(require,module,exports){
(function (global){
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('react-dom')) :
	typeof define === 'function' && define.amd ? define(['react', 'react-dom'], factory) :
	(global.ReactAwesomePopover = factory(global.React,global.ReactDOM));
}(this, (function (React,ReactDOM) { 'use strict';

React = React && React.hasOwnProperty('default') ? React['default'] : React;
ReactDOM = ReactDOM && ReactDOM.hasOwnProperty('default') ? ReactDOM['default'] : ReactDOM;

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

"use strict";

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

var emptyFunction_1 = emptyFunction;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

'use strict';

function invariant(condition, format, a, b, c, d, e, f) {
  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

var invariant_1 = invariant;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

var ReactPropTypesSecret_1 = ReactPropTypesSecret;

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';





var factoryWithThrowingShims = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret_1) {
      // It is still safe when called from React.
      return;
    }
    invariant_1(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  }
  shim.isRequired = shim;
  function getShim() {
    return shim;
  }
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction_1;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

var propTypes = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

{
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = factoryWithThrowingShims();
}
});

var Manager_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



var _react2 = _interopRequireDefault(React);



var _propTypes2 = _interopRequireDefault(propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Manager = function (_Component) {
  _inherits(Manager, _Component);

  function Manager() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Manager);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Manager.__proto__ || Object.getPrototypeOf(Manager)).call.apply(_ref, [this].concat(args))), _this), _this._setTargetNode = function (node) {
      _this._targetNode = node;
    }, _this._getTargetNode = function () {
      return _this._targetNode;
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Manager, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        popperManager: {
          setTargetNode: this._setTargetNode,
          getTargetNode: this._getTargetNode
        }
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          tag = _props.tag,
          children = _props.children,
          restProps = _objectWithoutProperties(_props, ['tag', 'children']);

      if (tag !== false) {
        return (0, React.createElement)(tag, restProps, children);
      } else {
        return children;
      }
    }
  }]);

  return Manager;
}(React.Component);

Manager.childContextTypes = {
  popperManager: _propTypes2.default.object.isRequired
};
Manager.propTypes = {
  tag: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.bool])
};
Manager.defaultProps = {
  tag: 'div'
};
exports.default = Manager;
});

unwrapExports(Manager_1);

var Target_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



var _react2 = _interopRequireDefault(React);



var _propTypes2 = _interopRequireDefault(propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Target = function Target(props, context) {
  var _props$component = props.component,
      component = _props$component === undefined ? 'div' : _props$component,
      innerRef = props.innerRef,
      children = props.children,
      restProps = _objectWithoutProperties(props, ['component', 'innerRef', 'children']);

  var popperManager = context.popperManager;

  var targetRef = function targetRef(node) {
    popperManager.setTargetNode(node);
    if (typeof innerRef === 'function') {
      innerRef(node);
    }
  };

  if (typeof children === 'function') {
    var targetProps = { ref: targetRef };
    return children({ targetProps: targetProps, restProps: restProps });
  }

  var componentProps = _extends({}, restProps);

  if (typeof component === 'string') {
    componentProps.ref = targetRef;
  } else {
    componentProps.innerRef = targetRef;
  }

  return (0, React.createElement)(component, componentProps, children);
};

Target.contextTypes = {
  popperManager: _propTypes2.default.object.isRequired
};

Target.propTypes = {
  component: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func]),
  innerRef: _propTypes2.default.func,
  children: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func])
};

exports.default = Target;
});

unwrapExports(Target_1);

/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.12.7
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
var timeoutDuration = 0;
for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
  if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
    timeoutDuration = 1;
    break;
  }
}

function microtaskDebounce(fn) {
  var called = false;
  return function () {
    if (called) {
      return;
    }
    called = true;
    Promise.resolve().then(function () {
      called = false;
      fn();
    });
  };
}

function taskDebounce(fn) {
  var scheduled = false;
  return function () {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}

var supportsMicroTasks = isBrowser && window.Promise;

/**
* Create a debounced version of a method, that's asynchronously deferred
* but called in the minimum time possible.
*
* @method
* @memberof Popper.Utils
* @argument {Function} fn
* @returns {Function}
*/
var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

/**
 * Check if the given variable is a function
 * @method
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */
function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Eement} element
 * @argument {String} property
 */
function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  var css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
}

/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */
function getParentNode(element) {
  if (element.nodeName === 'HTML') {
    return element;
  }
  return element.parentNode || element.host;
}

/**
 * Returns the scrolling parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} scroll parent
 */
function getScrollParent(element) {
  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
  if (!element) {
    return window.document.body;
  }

  switch (element.nodeName) {
    case 'HTML':
    case 'BODY':
      return element.ownerDocument.body;
    case '#document':
      return element.body;
  }

  // Firefox want us to check `-x` and `-y` variations as well

  var _getStyleComputedProp = getStyleComputedProperty(element),
      overflow = _getStyleComputedProp.overflow,
      overflowX = _getStyleComputedProp.overflowX,
      overflowY = _getStyleComputedProp.overflowY;

  if (/(auto|scroll)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return getScrollParent(getParentNode(element));
}

/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */
function getOffsetParent(element) {
  // NOTE: 1 DOM access here
  var offsetParent = element && element.offsetParent;
  var nodeName = offsetParent && offsetParent.nodeName;

  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
    if (element) {
      return element.ownerDocument.documentElement;
    }

    return window.document.documentElement;
  }

  // .offsetParent will return the closest TD or TABLE in case
  // no offsetParent is present, I hate this job...
  if (['TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
    return getOffsetParent(offsetParent);
  }

  return offsetParent;
}

function isOffsetContainer(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY') {
    return false;
  }
  return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
}

/**
 * Finds the root node (document, shadowDOM root) of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} node
 * @returns {Element} root node
 */
function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }

  return node;
}

/**
 * Finds the offset parent common to the two provided nodes
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element1
 * @argument {Element} element2
 * @returns {Element} common offset parent
 */
function findCommonOffsetParent(element1, element2) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return window.document.documentElement;
  }

  // Here we make sure to give as "start" the element that comes first in the DOM
  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1;

  // Get common ancestor container
  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer;

  // Both nodes are inside #document

  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }

    return getOffsetParent(commonAncestorContainer);
  }

  // one of the nodes is inside shadowDOM, find which one
  var element1root = getRoot(element1);
  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}

/**
 * Gets the scroll value of the given element in the given side (top and left)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */
function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || html;
    return scrollingElement[upperSide];
  }

  return element[upperSide];
}

/*
 * Sum or subtract the element scroll values (left and top) from a given rect object
 * @method
 * @memberof Popper.Utils
 * @param {Object} rect - Rect object you want to change
 * @param {HTMLElement} element - The element from the function reads the scroll values
 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
 * @return {Object} rect - The modifier rect object
 */
function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var scrollTop = getScroll(element, 'top');
  var scrollLeft = getScroll(element, 'left');
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}

/*
 * Helper to detect borders of a given element
 * @method
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration} styles
 * Result of `getStyleComputedProperty` on the given element
 * @param {String} axis - `x` or `y`
 * @return {number} borders - The borders size of the given axis
 */

function getBordersSize(styles, axis) {
  var sideA = axis === 'x' ? 'Left' : 'Top';
  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

  return +styles['border' + sideA + 'Width'].split('px')[0] + +styles['border' + sideB + 'Width'].split('px')[0];
}

/**
 * Tells if you are running Internet Explorer 10
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean} isIE10
 */
var isIE10 = undefined;

var isIE10$1 = function () {
  if (isIE10 === undefined) {
    isIE10 = navigator.appVersion.indexOf('MSIE 10') !== -1;
  }
  return isIE10;
};

function getSize(axis, body, html, computedStyle) {
  return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE10$1() ? html['offset' + axis] + computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')] + computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')] : 0);
}

function getWindowSizes() {
  var body = window.document.body;
  var html = window.document.documentElement;
  var computedStyle = isIE10$1() && window.getComputedStyle(html);

  return {
    height: getSize('Height', body, html, computedStyle),
    width: getSize('Width', body, html, computedStyle)
  };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {Object} offsets
 * @returns {Object} ClientRect like output
 */
function getClientRect(offsets) {
  return _extends({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}

/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
function getBoundingClientRect(element) {
  var rect = {};

  // IE10 10 FIX: Please, don't ask, the element isn't
  // considered in DOM in some circumstances...
  // This isn't reproducible in IE10 compatibility mode of IE11
  if (isIE10$1()) {
    try {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, 'top');
      var scrollLeft = getScroll(element, 'left');
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } catch (err) {}
  } else {
    rect = element.getBoundingClientRect();
  }

  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };

  // subtract scrollbar size from sizes
  var sizes = element.nodeName === 'HTML' ? getWindowSizes() : {};
  var width = sizes.width || element.clientWidth || result.right - result.left;
  var height = sizes.height || element.clientHeight || result.bottom - result.top;

  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height;

  // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
  // we make this check conditional for performance reasons
  if (horizScrollbar || vertScrollbar) {
    var styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, 'x');
    vertScrollbar -= getBordersSize(styles, 'y');

    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }

  return getClientRect(result);
}

function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var isIE10 = isIE10$1();
  var isHTML = parent.nodeName === 'HTML';
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent = getScrollParent(children);

  var styles = getStyleComputedProperty(parent);
  var borderTopWidth = +styles.borderTopWidth.split('px')[0];
  var borderLeftWidth = +styles.borderLeftWidth.split('px')[0];

  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top - borderTopWidth,
    left: childrenRect.left - parentRect.left - borderLeftWidth,
    width: childrenRect.width,
    height: childrenRect.height
  });
  offsets.marginTop = 0;
  offsets.marginLeft = 0;

  // Subtract margins of documentElement in case it's being used as parent
  // we do this only on HTML because it's the only element that behaves
  // differently when margins are applied to it. The margins are included in
  // the box of the documentElement, in the other cases not.
  if (!isIE10 && isHTML) {
    var marginTop = +styles.marginTop.split('px')[0];
    var marginLeft = +styles.marginLeft.split('px')[0];

    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;

    // Attach marginTop and marginLeft because in some circumstances we may need them
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if (isIE10 ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
    offsets = includeScroll(offsets, parent);
  }

  return offsets;
}

function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);

  var scrollTop = getScroll(html);
  var scrollLeft = getScroll(html, 'left');

  var offset = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width: width,
    height: height
  };

  return getClientRect(offset);
}

/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */
function isFixed(element) {
  var nodeName = element.nodeName;
  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }
  if (getStyleComputedProperty(element, 'position') === 'fixed') {
    return true;
  }
  return isFixed(getParentNode(element));
}

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement} reference
 * @param {number} padding
 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
 * @returns {Object} Coordinates of the boundaries
 */
function getBoundaries(popper, reference, padding, boundariesElement) {
  // NOTE: 1 DOM access here
  var boundaries = { top: 0, left: 0 };
  var offsetParent = findCommonOffsetParent(popper, reference);

  // Handle viewport case
  if (boundariesElement === 'viewport') {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent);
  } else {
    // Handle other cases based on DOM element used as boundaries
    var boundariesNode = void 0;
    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(reference));
      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent);

    // In case of HTML, we need a different computation
    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(),
          height = _getWindowSizes.height,
          width = _getWindowSizes.width;

      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  }

  // Add paddings
  boundaries.left += padding;
  boundaries.top += padding;
  boundaries.right -= padding;
  boundaries.bottom -= padding;

  return boundaries;
}

function getArea(_ref) {
  var width = _ref.width,
      height = _ref.height;

  return width * height;
}

/**
 * Utility used to transform the `auto` placement to the placement with more
 * available space.
 * @method
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  if (placement.indexOf('auto') === -1) {
    return placement;
  }

  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };

  var sortedAreas = Object.keys(rects).map(function (key) {
    return _extends({
      key: key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function (a, b) {
    return b.area - a.area;
  });

  var filteredAreas = sortedAreas.filter(function (_ref2) {
    var width = _ref2.width,
        height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });

  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

  var variation = placement.split('-')[1];

  return computedPlacement + (variation ? '-' + variation : '');
}

/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
function getReferenceOffsets(state, popper, reference) {
  var commonOffsetParent = findCommonOffsetParent(popper, reference);
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent);
}

/**
 * Get the outer sizes of the given element (offset size + margins)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */
function getOuterSizes(element) {
  var styles = window.getComputedStyle(element);
  var x = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
  var y = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
  var result = {
    width: element.offsetWidth + y,
    height: element.offsetHeight + x
  };
  return result;
}

/**
 * Get the opposite placement of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement
 * @returns {String} flipped placement
 */
function getOppositePlacement(placement) {
  var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Object} position - CSS position the Popper will get applied
 * @param {HTMLElement} popper - the popper element
 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
 * @param {String} placement - one of the valid placement options
 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
 */
function getPopperOffsets(popper, referenceOffsets, placement) {
  placement = placement.split('-')[0];

  // Get popper node sizes
  var popperRect = getOuterSizes(popper);

  // Add position, width and height to our offsets object
  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  };

  // depending by the popper placement we have to compute its offsets slightly differently
  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
  var mainSide = isHoriz ? 'top' : 'left';
  var secondarySide = isHoriz ? 'left' : 'top';
  var measurement = isHoriz ? 'height' : 'width';
  var secondaryMeasurement = !isHoriz ? 'height' : 'width';

  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
  if (placement === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }

  return popperOffsets;
}

/**
 * Mimics the `find` method of Array
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function find(arr, check) {
  // use native find if supported
  if (Array.prototype.find) {
    return arr.find(check);
  }

  // use `filter` to obtain the same behavior of `find`
  return arr.filter(check)[0];
}

/**
 * Return the index of the matching object
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function findIndex(arr, prop, value) {
  // use native findIndex if supported
  if (Array.prototype.findIndex) {
    return arr.findIndex(function (cur) {
      return cur[prop] === value;
    });
  }

  // use `find` + `indexOf` if `findIndex` isn't supported
  var match = find(arr, function (obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}

/**
 * Loop trough the list of modifiers and run them in order,
 * each of them will then edit the data object.
 * @method
 * @memberof Popper.Utils
 * @param {dataObject} data
 * @param {Array} modifiers
 * @param {String} ends - Optional modifier name used as stopper
 * @returns {dataObject}
 */
function runModifiers(modifiers, data, ends) {
  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

  modifiersToRun.forEach(function (modifier) {
    if (modifier['function']) {
      // eslint-disable-line dot-notation
      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    }
    var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
    if (modifier.enabled && isFunction(fn)) {
      // Add properties to offsets to make them a complete clientRect object
      // we do this before each modifier to make sure the previous one doesn't
      // mess with these values
      data.offsets.popper = getClientRect(data.offsets.popper);
      data.offsets.reference = getClientRect(data.offsets.reference);

      data = fn(data, modifier);
    }
  });

  return data;
}

/**
 * Updates the position of the popper, computing the new offsets and applying
 * the new style.<br />
 * Prefer `scheduleUpdate` over `update` because of performance reasons.
 * @method
 * @memberof Popper
 */
function update() {
  // if popper is destroyed, don't perform any further update
  if (this.state.isDestroyed) {
    return;
  }

  var data = {
    instance: this,
    styles: {},
    arrowStyles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  };

  // compute reference element offsets
  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

  // store the computed placement inside `originalPlacement`
  data.originalPlacement = data.placement;

  // compute the popper offsets
  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);
  data.offsets.popper.position = 'absolute';

  // run the modifiers
  data = runModifiers(this.modifiers, data);

  // the first `update` will call `onCreate` callback
  // the other ones will call `onUpdate` callback
  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  } else {
    this.options.onUpdate(data);
  }
}

/**
 * Helper used to know if the given modifier is enabled.
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean}
 */
function isModifierEnabled(modifiers, modifierName) {
  return modifiers.some(function (_ref) {
    var name = _ref.name,
        enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}

/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
 */
function getSupportedPropertyName(property) {
  var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

  for (var i = 0; i < prefixes.length - 1; i++) {
    var prefix = prefixes[i];
    var toCheck = prefix ? '' + prefix + upperProp : property;
    if (typeof window.document.body.style[toCheck] !== 'undefined') {
      return toCheck;
    }
  }
  return null;
}

/**
 * Destroy the popper
 * @method
 * @memberof Popper
 */
function destroy() {
  this.state.isDestroyed = true;

  // touch DOM only if `applyStyle` modifier is enabled
  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
    this.popper.removeAttribute('x-placement');
    this.popper.style.left = '';
    this.popper.style.position = '';
    this.popper.style.top = '';
    this.popper.style[getSupportedPropertyName('transform')] = '';
  }

  this.disableEventListeners();

  // remove the popper if user explicity asked for the deletion on destroy
  // do not use `remove` because IE11 doesn't support it
  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }
  return this;
}

/**
 * Get the window associated with the element
 * @argument {Element} element
 * @returns {Window}
 */
function getWindow(element) {
  var ownerDocument = element.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}

function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  var isBody = scrollParent.nodeName === 'BODY';
  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  target.addEventListener(event, callback, { passive: true });

  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }
  scrollParents.push(target);
}

/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function setupEventListeners(reference, options, state, updateBound) {
  // Resize event listener on window
  state.updateBound = updateBound;
  getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

  // Scroll event listener on scroll parents
  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;

  return state;
}

/**
 * It will add resize/scroll events and start recalculating
 * position of the popper element when they are triggered.
 * @method
 * @memberof Popper
 */
function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}

/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function removeEventListeners(reference, state) {
  // Remove resize event listener on window
  getWindow(reference).removeEventListener('resize', state.updateBound);

  // Remove scroll event listener on scroll parents
  state.scrollParents.forEach(function (target) {
    target.removeEventListener('scroll', state.updateBound);
  });

  // Reset state
  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}

/**
 * It will remove resize/scroll events and won't recalculate popper position
 * when they are triggered. It also won't trigger onUpdate callback anymore,
 * unless you call `update` method manually.
 * @method
 * @memberof Popper
 */
function disableEventListeners() {
  if (this.state.eventsEnabled) {
    window.cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}

/**
 * Tells if a given input is a number
 * @method
 * @memberof Popper.Utils
 * @param {*} input to check
 * @return {Boolean}
 */
function isNumeric(n) {
  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Set the style to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the style to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setStyles(element, styles) {
  Object.keys(styles).forEach(function (prop) {
    var unit = '';
    // add unit if the value is numeric and is one of the following
    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
      unit = 'px';
    }
    element.style[prop] = styles[prop] + unit;
  });
}

/**
 * Set the attributes to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the attributes to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function (prop) {
    var value = attributes[prop];
    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} data.styles - List of style properties - values to apply to popper element
 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The same data object
 */
function applyStyle(data) {
  // any property present in `data.styles` will be applied to the popper,
  // in this way we can make the 3rd party modifiers add custom styles to it
  // Be aware, modifiers could override the properties defined in the previous
  // lines of this modifier!
  setStyles(data.instance.popper, data.styles);

  // any property present in `data.attributes` will be applied to the popper,
  // they will be set as HTML attributes of the element
  setAttributes(data.instance.popper, data.attributes);

  // if arrowElement is defined and arrowStyles has some properties
  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
    setStyles(data.arrowElement, data.arrowStyles);
  }

  return data;
}

/**
 * Set the x-placement attribute before everything else because it could be used
 * to add margins to the popper margins needs to be calculated to get the
 * correct popper offsets.
 * @method
 * @memberof Popper.modifiers
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper.
 * @param {Object} options - Popper.js options
 */
function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
  // compute reference element offsets
  var referenceOffsets = getReferenceOffsets(state, popper, reference);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

  popper.setAttribute('x-placement', placement);

  // Apply `position` to popper before anything else because
  // without the position applied we can't guarantee correct computations
  setStyles(popper, { position: 'absolute' });

  return options;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeStyle(data, options) {
  var x = options.x,
      y = options.y;
  var popper = data.offsets.popper;

  // Remove this legacy support in Popper.js v2

  var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'applyStyle';
  }).gpuAcceleration;
  if (legacyGpuAccelerationOption !== undefined) {
    console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
  }
  var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

  var offsetParent = getOffsetParent(data.instance.popper);
  var offsetParentRect = getBoundingClientRect(offsetParent);

  // Styles
  var styles = {
    position: popper.position
  };

  // floor sides to avoid blurry text
  var offsets = {
    left: Math.floor(popper.left),
    top: Math.floor(popper.top),
    bottom: Math.floor(popper.bottom),
    right: Math.floor(popper.right)
  };

  var sideA = x === 'bottom' ? 'top' : 'bottom';
  var sideB = y === 'right' ? 'left' : 'right';

  // if gpuAcceleration is set to `true` and transform is supported,
  //  we use `translate3d` to apply the position to the popper we
  // automatically use the supported prefixed version if needed
  var prefixedProperty = getSupportedPropertyName('transform');

  // now, let's make a step back and look at this code closely (wtf?)
  // If the content of the popper grows once it's been positioned, it
  // may happen that the popper gets misplaced because of the new content
  // overflowing its reference element
  // To avoid this problem, we provide two options (x and y), which allow
  // the consumer to define the offset origin.
  // If we position a popper on top of a reference element, we can set
  // `x` to `top` to make the popper grow towards its top instead of
  // its bottom.
  var left = void 0,
      top = void 0;
  if (sideA === 'bottom') {
    top = -offsetParentRect.height + offsets.bottom;
  } else {
    top = offsets.top;
  }
  if (sideB === 'right') {
    left = -offsetParentRect.width + offsets.right;
  } else {
    left = offsets.left;
  }
  if (gpuAcceleration && prefixedProperty) {
    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
    styles[sideA] = 0;
    styles[sideB] = 0;
    styles.willChange = 'transform';
  } else {
    // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
    var invertTop = sideA === 'bottom' ? -1 : 1;
    var invertLeft = sideB === 'right' ? -1 : 1;
    styles[sideA] = top * invertTop;
    styles[sideB] = left * invertLeft;
    styles.willChange = sideA + ', ' + sideB;
  }

  // Attributes
  var attributes = {
    'x-placement': data.placement
  };

  // Update `data` attributes, styles and arrowStyles
  data.attributes = _extends({}, attributes, data.attributes);
  data.styles = _extends({}, styles, data.styles);
  data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);

  return data;
}

/**
 * Helper used to know if the given modifier depends from another one.<br />
 * It checks if the needed modifier is listed and enabled.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers - list of modifiers
 * @param {String} requestingName - name of requesting modifier
 * @param {String} requestedName - name of requested modifier
 * @returns {Boolean}
 */
function isModifierRequired(modifiers, requestingName, requestedName) {
  var requesting = find(modifiers, function (_ref) {
    var name = _ref.name;
    return name === requestingName;
  });

  var isRequired = !!requesting && modifiers.some(function (modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });

  if (!isRequired) {
    var _requesting = '`' + requestingName + '`';
    var requested = '`' + requestedName + '`';
    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
  }
  return isRequired;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function arrow(data, options) {
  // arrow depends on keepTogether in order to work
  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
    return data;
  }

  var arrowElement = options.element;

  // if arrowElement is a string, suppose it's a CSS selector
  if (typeof arrowElement === 'string') {
    arrowElement = data.instance.popper.querySelector(arrowElement);

    // if arrowElement is not found, don't run the modifier
    if (!arrowElement) {
      return data;
    }
  } else {
    // if the arrowElement isn't a query selector we must check that the
    // provided DOM node is child of its popper node
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn('WARNING: `arrow.element` must be child of its popper element!');
      return data;
    }
  }

  var placement = data.placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isVertical = ['left', 'right'].indexOf(placement) !== -1;

  var len = isVertical ? 'height' : 'width';
  var sideCapitalized = isVertical ? 'Top' : 'Left';
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? 'left' : 'top';
  var opSide = isVertical ? 'bottom' : 'right';
  var arrowElementSize = getOuterSizes(arrowElement)[len];

  //
  // extends keepTogether behavior making sure the popper and its
  // reference have enough pixels in conjuction
  //

  // top/left side
  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  }
  // bottom/right side
  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }

  // compute center of the popper
  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

  // Compute the sideValue using the updated popper offsets
  // take popper margin in account because we don't have this info available
  var popperMarginSide = getStyleComputedProperty(data.instance.popper, 'margin' + sideCapitalized).replace('px', '');
  var sideValue = center - getClientRect(data.offsets.popper)[side] - popperMarginSide;

  // prevent arrowElement from being placed not contiguously to its popper
  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

  data.arrowElement = arrowElement;
  data.offsets.arrow = {};
  data.offsets.arrow[side] = Math.round(sideValue);
  data.offsets.arrow[altSide] = ''; // make sure to unset any eventual altSide value from the DOM node

  return data;
}

/**
 * Get the opposite placement variation of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement variation
 * @returns {String} flipped placement variation
 */
function getOppositeVariation(variation) {
  if (variation === 'end') {
    return 'start';
  } else if (variation === 'start') {
    return 'end';
  }
  return variation;
}

/**
 * List of accepted placements to use as values of the `placement` option.<br />
 * Valid placements are:
 * - `auto`
 * - `top`
 * - `right`
 * - `bottom`
 * - `left`
 *
 * Each placement can have a variation from this list:
 * - `-start`
 * - `-end`
 *
 * Variations are interpreted easily if you think of them as the left to right
 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
 * is right.<br />
 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
 *
 * Some valid examples are:
 * - `top-end` (on top of reference, right aligned)
 * - `right-start` (on right of reference, top aligned)
 * - `bottom` (on bottom, centered)
 * - `auto-right` (on the side with more space available, alignment depends by placement)
 *
 * @static
 * @type {Array}
 * @enum {String}
 * @readonly
 * @method placements
 * @memberof Popper
 */
var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

// Get rid of `auto` `auto-start` and `auto-end`
var validPlacements = placements.slice(3);

/**
 * Given an initial placement, returns all the subsequent placements
 * clockwise (or counter-clockwise).
 *
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement - A valid placement (it accepts variations)
 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
 * @returns {Array} placements including their variations
 */
function clockwise(placement) {
  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var index = validPlacements.indexOf(placement);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}

var BEHAVIORS = {
  FLIP: 'flip',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise'
};

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function flip(data, options) {
  // if `inner` modifier is enabled, we can't use the `flip` modifier
  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
    return data;
  }

  if (data.flipped && data.placement === data.originalPlacement) {
    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
    return data;
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement);

  var placement = data.placement.split('-')[0];
  var placementOpposite = getOppositePlacement(placement);
  var variation = data.placement.split('-')[1] || '';

  var flipOrder = [];

  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement, placementOpposite];
      break;
    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement);
      break;
    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement, true);
      break;
    default:
      flipOrder = options.behavior;
  }

  flipOrder.forEach(function (step, index) {
    if (placement !== step || flipOrder.length === index + 1) {
      return data;
    }

    placement = data.placement.split('-')[0];
    placementOpposite = getOppositePlacement(placement);

    var popperOffsets = data.offsets.popper;
    var refOffsets = data.offsets.reference;

    // using floor because the reference offsets may contain decimals we are not going to consider here
    var floor = Math.floor;
    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

    // flip the variation if required
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
    var flippedVariation = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      // this boolean to detect any flip loop
      data.flipped = true;

      if (overlapsRef || overflowsBoundaries) {
        placement = flipOrder[index + 1];
      }

      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }

      data.placement = placement + (variation ? '-' + variation : '');

      // this object contains `position`, we want to preserve it along with
      // any additional property we may add in the future
      data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

      data = runModifiers(data.instance.modifiers, data, 'flip');
    }
  });
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function keepTogether(data) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var placement = data.placement.split('-')[0];
  var floor = Math.floor;
  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
  var side = isVertical ? 'right' : 'bottom';
  var opSide = isVertical ? 'left' : 'top';
  var measurement = isVertical ? 'width' : 'height';

  if (popper[side] < floor(reference[opSide])) {
    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }
  if (popper[opSide] > floor(reference[side])) {
    data.offsets.popper[opSide] = floor(reference[side]);
  }

  return data;
}

/**
 * Converts a string containing value + unit into a px value number
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} str - Value + unit string
 * @argument {String} measurement - `height` or `width`
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @returns {Number|String}
 * Value in pixels, or original string if no values were extracted
 */
function toValue(str, measurement, popperOffsets, referenceOffsets) {
  // separate value from unit
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2];

  // If it's not a number it's an operator, I guess
  if (!value) {
    return str;
  }

  if (unit.indexOf('%') === 0) {
    var element = void 0;
    switch (unit) {
      case '%p':
        element = popperOffsets;
        break;
      case '%':
      case '%r':
      default:
        element = referenceOffsets;
    }

    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === 'vh' || unit === 'vw') {
    // if is a vh or vw, we calculate the size based on the viewport
    var size = void 0;
    if (unit === 'vh') {
      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    return size / 100 * value;
  } else {
    // if is an explicit pixel unit, we get rid of the unit and keep the value
    // if is an implicit unit, it's px, and we return just the value
    return value;
  }
}

/**
 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} offset
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @argument {String} basePlacement
 * @returns {Array} a two cells array with x and y offsets in numbers
 */
function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0];

  // Use height if placement is left or right and index is 0 otherwise use width
  // in this way the first offset will use an axis and the second one
  // will use the other one
  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

  // Split the offset string to obtain a list of values and operands
  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
    return frag.trim();
  });

  // Detect if the offset string contains a pair of values or a single one
  // they could be separated by comma or space
  var divider = fragments.indexOf(find(fragments, function (frag) {
    return frag.search(/,|\s/) !== -1;
  }));

  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
  }

  // If divider is found, we divide the list of values and operands to divide
  // them by ofset X and Y.
  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

  // Convert the values with units to absolute pixels to allow our computations
  ops = ops.map(function (op, index) {
    // Most of the units rely on the orientation of the popper
    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
    var mergeWithPrevious = false;
    return op
    // This aggregates any `+` or `-` sign that aren't considered operators
    // e.g.: 10 + +5 => [10, +, +5]
    .reduce(function (a, b) {
      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
        a[a.length - 1] = b;
        mergeWithPrevious = true;
        return a;
      } else if (mergeWithPrevious) {
        a[a.length - 1] += b;
        mergeWithPrevious = false;
        return a;
      } else {
        return a.concat(b);
      }
    }, [])
    // Here we convert the string values into number values (in px)
    .map(function (str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  });

  // Loop trough the offsets arrays and execute the operations
  ops.forEach(function (op, index) {
    op.forEach(function (frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
      }
    });
  });
  return offsets;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @argument {Number|String} options.offset=0
 * The offset value as described in the modifier description
 * @returns {Object} The data object, properly modified
 */
function offset(data, _ref) {
  var offset = _ref.offset;
  var placement = data.placement,
      _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var basePlacement = placement.split('-')[0];

  var offsets = void 0;
  if (isNumeric(+offset)) {
    offsets = [+offset, 0];
  } else {
    offsets = parseOffset(offset, popper, reference, basePlacement);
  }

  if (basePlacement === 'left') {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === 'right') {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === 'top') {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === 'bottom') {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }

  data.popper = popper;
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function preventOverflow(data, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

  // If offsetParent is the reference element, we really want to
  // go one step up and use the next offsetParent as reference to
  // avoid to make this modifier completely useless and look like broken
  if (data.instance.reference === boundariesElement) {
    boundariesElement = getOffsetParent(boundariesElement);
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement);
  options.boundaries = boundaries;

  var order = options.priority;
  var popper = data.offsets.popper;

  var check = {
    primary: function primary(placement) {
      var value = popper[placement];
      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        value = Math.max(popper[placement], boundaries[placement]);
      }
      return defineProperty({}, placement, value);
    },
    secondary: function secondary(placement) {
      var mainSide = placement === 'right' ? 'left' : 'top';
      var value = popper[mainSide];
      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
      }
      return defineProperty({}, mainSide, value);
    }
  };

  order.forEach(function (placement) {
    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
    popper = _extends({}, popper, check[side](placement));
  });

  data.offsets.popper = popper;

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function shift(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var shiftvariation = placement.split('-')[1];

  // if shift shiftvariation is specified, run the modifier
  if (shiftvariation) {
    var _data$offsets = data.offsets,
        reference = _data$offsets.reference,
        popper = _data$offsets.popper;

    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
    var side = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    var shiftOffsets = {
      start: defineProperty({}, side, reference[side]),
      end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
    };

    data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function hide(data) {
  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
    return data;
  }

  var refRect = data.offsets.reference;
  var bound = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'preventOverflow';
  }).boundaries;

  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === true) {
      return data;
    }

    data.hide = true;
    data.attributes['x-out-of-boundaries'] = '';
  } else {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === false) {
      return data;
    }

    data.hide = false;
    data.attributes['x-out-of-boundaries'] = false;
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function inner(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

  popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

  data.placement = getOppositePlacement(placement);
  data.offsets.popper = getClientRect(popper);

  return data;
}

/**
 * Modifier function, each modifier can have a function of this type assigned
 * to its `fn` property.<br />
 * These functions will be called on each update, this means that you must
 * make sure they are performant enough to avoid performance bottlenecks.
 *
 * @function ModifierFn
 * @argument {dataObject} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {dataObject} The data object, properly modified
 */

/**
 * Modifiers are plugins used to alter the behavior of your poppers.<br />
 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
 * needed by the library.
 *
 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
 * All the other properties are configurations that could be tweaked.
 * @namespace modifiers
 */
var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: shift
  },

  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unitless, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the height.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
   * > More on this [reading this issue](https://github.com/FezVrasta/popper.js/issues/373)
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: offset,
    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },

  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * An scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: preventOverflow,
    /**
     * @prop {Array} [priority=['left','right','top','bottom']]
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ['left', 'right', 'top', 'bottom'],
    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper this makes sure the popper has always a little padding
     * between the edges of its container
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier, can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: 'scrollParent'
  },

  /**
   * Modifier used to make sure the reference and its popper stay near eachothers
   * without leaving any gap between the two. Expecially useful when the arrow is
   * enabled and you want to assure it to point to its reference element.
   * It cares only about the first axis, you can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: keepTogether
  },

  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjuction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: arrow,
    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: '[x-arrow]'
  },

  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: flip,
    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations).
     */
    behavior: 'flip',
    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position,
     * the popper will never be placed outside of the defined boundaries
     * (except if keepTogether is enabled)
     */
    boundariesElement: 'viewport'
  },

  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,
    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,
    /** @prop {ModifierFn} */
    fn: inner
  },

  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: hide
  },

  /**
   * Computes the style that will be applied to the popper element to gets
   * properly positioned.
   *
   * Note that this modifier will not touch the DOM, it just prepares the styles
   * so that `applyStyle` modifier can apply it. This separation is useful
   * in case you need to replace `applyStyle` with a custom implementation.
   *
   * This modifier has `850` as `order` value to maintain backward compatibility
   * with previous versions of Popper.js. Expect the modifiers ordering method
   * to change in future major versions of the library.
   *
   * @memberof modifiers
   * @inner
   */
  computeStyle: {
    /** @prop {number} order=850 - Index used to define the order of execution */
    order: 850,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: computeStyle,
    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3d transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties.
     */
    gpuAcceleration: true,
    /**
     * @prop {string} [x='bottom']
     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
     * Change this if your popper should grow in a direction different from `bottom`
     */
    x: 'bottom',
    /**
     * @prop {string} [x='left']
     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
     * Change this if your popper should grow in a direction different from `right`
     */
    y: 'right'
  },

  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Note that if you disable this modifier, you must make sure the popper element
   * has its position set to `absolute` before Popper.js can do its work!
   *
   * Just disable this modifier and define you own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: applyStyle,
    /** @prop {Function} */
    onLoad: applyStyleOnLoad,
    /**
     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3d transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties.
     */
    gpuAcceleration: undefined
  }
};

/**
 * The `dataObject` is an object containing all the informations used by Popper.js
 * this object get passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
 * @name dataObject
 * @property {Object} data.instance The Popper.js instance
 * @property {String} data.placement Placement applied to popper
 * @property {String} data.originalPlacement Placement originally defined on init
 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper.
 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
 * @property {Object} data.styles Any CSS property defined here will be applied to the popper, it expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow, it expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.boundaries Offsets of the popper boundaries
 * @property {Object} data.offsets The measurements of popper, reference and arrow elements.
 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
 */

/**
 * Default options provided to Popper.js constructor.<br />
 * These can be overriden using the `options` argument of Popper.js.<br />
 * To override an option, simply pass as 3rd argument an object with the same
 * structure of this object, example:
 * ```
 * new Popper(ref, pop, {
 *   modifiers: {
 *     preventOverflow: { enabled: false }
 *   }
 * })
 * ```
 * @type {Object}
 * @static
 * @memberof Popper
 */
var Defaults = {
  /**
   * Popper's placement
   * @prop {Popper.placements} placement='bottom'
   */
  placement: 'bottom',

  /**
   * Whether events (resize, scroll) are initially enabled
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,

  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,

  /**
   * Callback called when the popper is created.<br />
   * By default, is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: function onCreate() {},

  /**
   * Callback called when the popper is updated, this callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: function onUpdate() {},

  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js
   * @prop {modifiers}
   */
  modifiers: modifiers
};

/**
 * @callback onCreate
 * @param {dataObject} data
 */

/**
 * @callback onUpdate
 * @param {dataObject} data
 */

// Utils
// Methods
var Popper$1 = function () {
  /**
   * Create a new Popper.js instance
   * @class Popper
   * @param {HTMLElement|referenceObject} reference - The reference element used to position the popper
   * @param {HTMLElement} popper - The HTML element used as popper.
   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
  function Popper(reference, popper) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Popper);

    this.scheduleUpdate = function () {
      return requestAnimationFrame(_this.update);
    };

    // make update() debounced, so that it only runs at most once-per-tick
    this.update = debounce(this.update.bind(this));

    // with {} we create a new object with the options inside it
    this.options = _extends({}, Popper.Defaults, options);

    // init state
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    };

    // get reference and popper elements (allow jQuery wrappers)
    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper;

    // Deep merge modifiers options
    this.options.modifiers = {};
    Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
      _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    });

    // Refactoring modifiers' list (Object => Array)
    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
      return _extends({
        name: name
      }, _this.options.modifiers[name]);
    })
    // sort the modifiers by order
    .sort(function (a, b) {
      return a.order - b.order;
    });

    // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
    this.modifiers.forEach(function (modifierOptions) {
      if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    });

    // fire the first update to position the popper in the right place
    this.update();

    var eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  }

  // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs


  createClass(Popper, [{
    key: 'update',
    value: function update$$1() {
      return update.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: 'enableEventListeners',
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: 'disableEventListeners',
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }

    /**
     * Schedule an update, it will run on the next UI update available
     * @method scheduleUpdate
     * @memberof Popper
     */


    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */

  }]);
  return Popper;
}();

/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */


Popper$1.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
Popper$1.placements = placements;
Popper$1.Defaults = Defaults;





var popper = Object.freeze({
	default: Popper$1
});

var _popper = ( popper && Popper$1 ) || popper;

var Popper_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



var _react2 = _interopRequireDefault(React);



var _propTypes2 = _interopRequireDefault(propTypes);



var _popper2 = _interopRequireDefault(_popper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Popper = function (_Component) {
  _inherits(Popper, _Component);

  function Popper() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Popper);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Popper.__proto__ || Object.getPrototypeOf(Popper)).call.apply(_ref, [this].concat(args))), _this), _this.state = {}, _this._setArrowNode = function (node) {
      _this._arrowNode = node;
    }, _this._getTargetNode = function () {
      return _this.context.popperManager.getTargetNode();
    }, _this._getOffsets = function (data) {
      return Object.keys(data.offsets).map(function (key) {
        return data.offsets[key];
      });
    }, _this._isDataDirty = function (data) {
      if (_this.state.data) {
        return JSON.stringify(_this._getOffsets(_this.state.data)) !== JSON.stringify(_this._getOffsets(data));
      } else {
        return true;
      }
    }, _this._updateStateModifier = {
      enabled: true,
      order: 900,
      fn: function fn(data) {
        if (_this._isDataDirty(data)) {
          _this.setState({ data: data });
        }
        return data;
      }
    }, _this._getPopperStyle = function () {
      var data = _this.state.data;

      // If Popper isn't instantiated, hide the popperElement
      // to avoid flash of unstyled content

      if (!_this._popper || !data) {
        return {
          position: 'absolute',
          pointerEvents: 'none',
          opacity: 0
        };
      }

      var _data$offsets$popper = data.offsets.popper,
          top = _data$offsets$popper.top,
          left = _data$offsets$popper.left,
          position = _data$offsets$popper.position;


      return _extends({
        position: position
      }, data.styles);
    }, _this._getPopperPlacement = function () {
      return !!_this.state.data ? _this.state.data.placement : undefined;
    }, _this._getPopperHide = function () {
      return !!_this.state.data && _this.state.data.hide ? '' : undefined;
    }, _this._getArrowStyle = function () {
      if (!_this.state.data || !_this.state.data.offsets.arrow) {
        return {};
      } else {
        var _this$state$data$offs = _this.state.data.offsets.arrow,
            top = _this$state$data$offs.top,
            left = _this$state$data$offs.left;

        return { top: top, left: left };
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Popper, [{
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        popper: {
          setArrowNode: this._setArrowNode,
          getArrowStyle: this._getArrowStyle
        }
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._updatePopper();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(lastProps) {
      if (lastProps.placement !== this.props.placement || lastProps.eventsEnabled !== this.props.eventsEnabled) {
        this._updatePopper();
      }

      if (this._popper && lastProps.children !== this.props.children) {
        this._popper.scheduleUpdate();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._destroyPopper();
    }
  }, {
    key: '_updatePopper',
    value: function _updatePopper() {
      this._destroyPopper();
      if (this._node) {
        this._createPopper();
      }
    }
  }, {
    key: '_createPopper',
    value: function _createPopper() {
      var _props = this.props,
          placement = _props.placement,
          eventsEnabled = _props.eventsEnabled;

      var modifiers = _extends({}, this.props.modifiers, {
        applyStyle: { enabled: false },
        updateState: this._updateStateModifier
      });

      if (this._arrowNode) {
        modifiers.arrow = {
          element: this._arrowNode
        };
      }

      this._popper = new _popper2.default(this._getTargetNode(), this._node, {
        placement: placement,
        eventsEnabled: eventsEnabled,
        modifiers: modifiers
      });

      // schedule an update to make sure everything gets positioned correct
      // after being instantiated
      this._popper.scheduleUpdate();
    }
  }, {
    key: '_destroyPopper',
    value: function _destroyPopper() {
      if (this._popper) {
        this._popper.destroy();
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props2 = this.props,
          component = _props2.component,
          innerRef = _props2.innerRef,
          placement = _props2.placement,
          eventsEnabled = _props2.eventsEnabled,
          modifiers = _props2.modifiers,
          children = _props2.children,
          restProps = _objectWithoutProperties(_props2, ['component', 'innerRef', 'placement', 'eventsEnabled', 'modifiers', 'children']);

      var popperRef = function popperRef(node) {
        _this2._node = node;
        if (typeof innerRef === 'function') {
          innerRef(node);
        }
      };
      var popperStyle = this._getPopperStyle();
      var popperPlacement = this._getPopperPlacement();
      var popperHide = this._getPopperHide();

      if (typeof children === 'function') {
        var _popperProps;

        var popperProps = (_popperProps = {
          ref: popperRef,
          style: popperStyle
        }, _defineProperty(_popperProps, 'data-placement', popperPlacement), _defineProperty(_popperProps, 'data-x-out-of-boundaries', popperHide), _popperProps);
        return children({
          popperProps: popperProps,
          restProps: restProps,
          scheduleUpdate: this._popper && this._popper.scheduleUpdate
        });
      }

      var componentProps = _extends({}, restProps, {
        style: _extends({}, restProps.style, popperStyle),
        'data-placement': popperPlacement,
        'data-x-out-of-boundaries': popperHide
      });

      if (typeof component === 'string') {
        componentProps.ref = popperRef;
      } else {
        componentProps.innerRef = popperRef;
      }

      return (0, React.createElement)(component, componentProps, children);
    }
  }]);

  return Popper;
}(React.Component);

Popper.contextTypes = {
  popperManager: _propTypes2.default.object.isRequired
};
Popper.childContextTypes = {
  popper: _propTypes2.default.object.isRequired
};
Popper.propTypes = {
  component: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func]),
  innerRef: _propTypes2.default.func,
  placement: _propTypes2.default.oneOf(_popper2.default.placements),
  eventsEnabled: _propTypes2.default.bool,
  modifiers: _propTypes2.default.object,
  children: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func])
};
Popper.defaultProps = {
  component: 'div',
  placement: 'bottom',
  eventsEnabled: true,
  modifiers: {}
};
exports.default = Popper;
});

unwrapExports(Popper_1);

var Arrow_1 = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



var _react2 = _interopRequireDefault(React);



var _propTypes2 = _interopRequireDefault(propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Arrow = function Arrow(props, context) {
  var _props$component = props.component,
      component = _props$component === undefined ? 'span' : _props$component,
      innerRef = props.innerRef,
      children = props.children,
      restProps = _objectWithoutProperties(props, ['component', 'innerRef', 'children']);

  var popper = context.popper;

  var arrowRef = function arrowRef(node) {
    popper.setArrowNode(node);
    if (typeof innerRef === 'function') {
      innerRef(node);
    }
  };
  var arrowStyle = popper.getArrowStyle();

  if (typeof children === 'function') {
    var arrowProps = {
      ref: arrowRef,
      style: arrowStyle
    };
    return children({ arrowProps: arrowProps, restProps: restProps });
  }

  var componentProps = _extends({}, restProps, {
    style: _extends({}, arrowStyle, restProps.style)
  });

  if (typeof component === 'string') {
    componentProps.ref = arrowRef;
  } else {
    componentProps.innerRef = arrowRef;
  }

  return (0, React.createElement)(component, componentProps, children);
};

Arrow.contextTypes = {
  popper: _propTypes2.default.object.isRequired
};

Arrow.propTypes = {
  component: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func]),
  innerRef: _propTypes2.default.func,
  children: _propTypes2.default.oneOfType([_propTypes2.default.node, _propTypes2.default.func])
};

exports.default = Arrow;
});

unwrapExports(Arrow_1);

var reactPopper = createCommonjsModule(function (module, exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Arrow = exports.Popper = exports.Target = exports.Manager = undefined;



var _Manager3 = _interopRequireDefault(Manager_1);



var _Target3 = _interopRequireDefault(Target_1);



var _Popper3 = _interopRequireDefault(Popper_1);



var _Arrow3 = _interopRequireDefault(Arrow_1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Manager = _Manager3.default;
exports.Target = _Target3.default;
exports.Popper = _Popper3.default;
exports.Arrow = _Arrow3.default;
});

unwrapExports(reactPopper);
var reactPopper_1 = reactPopper.Arrow;
var reactPopper_2 = reactPopper.Popper;
var reactPopper_3 = reactPopper.Target;
var reactPopper_4 = reactPopper.Manager;

var randomID = createCommonjsModule(function (module) {
(function(){
	var randomID = function(len,pattern){
		var possibilities = ["abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ", "0123456789", "~!@#$%^&()_+-={}[];\',"];
		var chars = "";

		var pattern = pattern ? pattern : "aA0";
		pattern.split('').forEach(function(a){
			if(!isNaN(parseInt(a))){
				chars += possibilities[2];
			}else if(/[a-z]/.test(a)){
				chars += possibilities[0];
			}else if(/[A-Z]/.test(a)){
				chars += possibilities[1];
			}else{
				chars += possibilities[3];
			}
		});
		
		var len = len ? len : 30;

		var result = '';

		while(len--){ 
			result += chars.charAt(Math.floor(Math.random() * chars.length)); 
		}

		return result;
	};

	if('object' !== "undefined" && typeof commonjsRequire !== "undefined"){
		module.exports = randomID;
	} else {
		window["randomID"] = randomID;
	}

})();
});

var jsx = function () {
  var REACT_ELEMENT_TYPE = typeof Symbol === "function" && Symbol.for && Symbol.for("react.element") || 0xeac7;
  return function createRawReactElement(type, props, key, children) {
    var defaultProps = type && type.defaultProps;
    var childrenLength = arguments.length - 3;

    if (!props && childrenLength !== 0) {
      props = {};
    }

    if (props && defaultProps) {
      for (var propName in defaultProps) {
        if (props[propName] === void 0) {
          props[propName] = defaultProps[propName];
        }
      }
    } else if (!props) {
      props = defaultProps || {};
    }

    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);

      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 3];
      }

      props.children = childArray;
    }

    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type: type,
      key: key === undefined ? null : '' + key,
      ref: null,
      props: props,
      _owner: null
    };
  };
}();



var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck$1 = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass$1 = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends$1 = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var _ref3 = jsx("feGaussianBlur", {
  "in": "SourceAlpha",
  stdDeviation: 3
});

var _ref4 = jsx("feOffset", {
  dx: 7,
  dy: 1,
  result: "offsetblur"
});

var _ref5 = jsx("feComponentTransfer", {}, void 0, jsx("feFuncA", {
  type: "linear",
  slope: "0.2"
}));

var _ref6 = jsx("feMerge", {}, void 0, jsx("feMergeNode", {}), jsx("feMergeNode", {
  "in": "SourceGraphic"
}));

var ArrowComponent = function (_React$Component) {
  inherits(ArrowComponent, _React$Component);

  function ArrowComponent() {
    classCallCheck$1(this, ArrowComponent);

    var _this = possibleConstructorReturn(this, (ArrowComponent.__proto__ || Object.getPrototypeOf(ArrowComponent)).call(this));

    _this.id = randomID(19, "a");
    return _this;
  }

  createClass$1(ArrowComponent, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          dataPlacement = _props.dataPlacement,
          customArrow = _props.customArrow;
      var id = this.id;

      var _ref2 = jsx("defs", {
        xmlns: "http://www.w3.org/2000/svg"
      }, void 0, jsx("filter", {
        id: id,
        height: "130%"
      }, void 0, _ref3, _ref4, _ref5, _ref6));

      return jsx(reactPopper_1, {}, void 0, function (_ref) {
        var arrowProps = _ref.arrowProps;

        arrowProps.style.position = "absolute";
        if (/right/gi.test(dataPlacement)) {
          arrowProps.style.transform = "rotate(-180deg)";
          arrowProps.style.left = "-19px";
        } else if (/bottom/gi.test(dataPlacement)) {
          arrowProps.style.transform = "rotate(-90deg)";
          arrowProps.style.top = "-20px";
        } else if (/top/gi.test(dataPlacement)) {
          arrowProps.style.transform = "rotate(90deg)";
          arrowProps.style.bottom = "-21px";
        } else if (/left/gi.test(dataPlacement)) {
          arrowProps.style.right = "-19px";
        }

        return customArrow ? React.createElement(
          "span",
          arrowProps,
          customArrow
        ) : React.createElement(
          "span",
          arrowProps,
          jsx("svg", {
            xmlnsXlink: "http://www.w3.org/1999/xlink",
            viewBox: "0 0 100 100",
            version: "1.1",
            x: "0px",
            y: "0px",
            width: 30,
            height: 30
          }, void 0, _ref2, jsx("polygon", {
            filter: "url(#" + id + ")",
            points: "36 23 64 55 36 80",
            fill: "#fff",
            fillRule: "evenodd"
          }))
        );
      });
    }
  }]);
  return ArrowComponent;
}(React.Component);

var PopoverComponent = function (_React$Component) {
  inherits(PopoverComponent, _React$Component);

  function PopoverComponent(props) {
    classCallCheck$1(this, PopoverComponent);

    var _this = possibleConstructorReturn(this, (PopoverComponent.__proto__ || Object.getPrototypeOf(PopoverComponent)).call(this, props));

    _this.click = _this.click.bind(_this);
    _this.onMouseOver = _this.onMouseOver.bind(_this);
    _this.closePopoverOnMouseLeave = _this.closePopoverOnMouseLeave.bind(_this);
    return _this;
  }

  createClass$1(PopoverComponent, [{
    key: "closePopoverOnMouseLeave",
    value: function closePopoverOnMouseLeave(e) {
      e.preventDefault();
      this.props.onClosePopover();
    }
  }, {
    key: "click",
    value: function click(e) {
      var thispopover = this.refs.popover._node;
      var close = e.target.closest(".popover-content");
      if (!close) {
        this.props.onClosePopover();
      } else {
        var child_popover = thispopover.querySelector(".popover-content");
        if (!child_popover) {
          if (close.getAttribute("data-id") != thispopover.getAttribute("data-id")) {
            this.props.onClosePopover();
          }
        }
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _props = this.props,
          action = _props.action,
          onClose = _props.onClose;

      if (action === "click") {
        document.removeEventListener("click", this.click, false);
      } else if (action === "hover") {
        document.removeEventListener("mouseover", this.onMouseOver, false);
        this.refs.popover._node.removeEventListener("mouseleave", this.closePopoverOnMouseLeave, false);
      }

      if (onClose) onClose();
    }
  }, {
    key: "onMouseOver",
    value: function onMouseOver(e) {
      var popover = this.refs.popover._node;
      var child = popover.querySelector(".popover-content");
      if (!child) {
        popover.addEventListener("mouseleave", this.closePopoverOnMouseLeave, false);
      }
      if (!e.target.closest(".manager")) {
        this.props.onClosePopover();
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _props2 = this.props,
          action = _props2.action,
          onOpen = _props2.onOpen;

      if (action === "click") {
        document.addEventListener("click", this.click, false);
      } else if (action === "hover") {
        document.addEventListener("mouseover", this.onMouseOver, false);
      }

      if (onOpen) onOpen();
    }
  }, {
    key: "render",
    value: function render() {
      var _props3 = this.props,
          placement = _props3.placement,
          modifiers = _props3.modifiers,
          arrow = _props3.arrow,
          className = _props3.className,
          motion = _props3.motion,
          id = _props3.id,
          customArrow = _props3.customArrow,
          children = _props3.children;


      return React.createElement(
        reactPopper_2,
        { placement: placement, modifiers: modifiers, ref: "popover" },
        function (_ref) {
          var popperProps = _ref.popperProps;

          popperProps.className = "popover-content";
          if (arrow) {
            if (popperProps["data-placement"]) {
              popperProps.className = "popover-content rap-" + popperProps["data-placement"].split("-")[0];
            }
          }
          if (className) {
            popperProps.className += " " + className;
          }

          popperProps.style.width = '250px';

          if (motion) {
            var ArrowCallback = arrow ? jsx(ArrowComponent, {
              customArrow: customArrow,
              dataPlacement: popperProps["data-placement"]
            }) : null;
            return children[1]({ "data-id": id }, popperProps, ArrowCallback);
          } else {
            return React.createElement(
              "div",
              _extends$1({}, popperProps, { "data-id": id }),
              jsx("div", {}, void 0, children[1], arrow ? jsx(ArrowComponent, {
                customArrow: customArrow,
                dataPlacement: popperProps["data-placement"]
              }) : null)
            );
          }
        }
      );
    }
  }]);
  return PopoverComponent;
}(React.Component);

var TargetComponent = function (_React$Component) {
  inherits(TargetComponent, _React$Component);

  function TargetComponent(props) {
    classCallCheck$1(this, TargetComponent);

    var _this = possibleConstructorReturn(this, (TargetComponent.__proto__ || Object.getPrototypeOf(TargetComponent)).call(this, props));

    _this.click = _this.click.bind(_this);
    _this.onMouseEnter = _this.onMouseEnter.bind(_this);
    _this.onMouseLeave = _this.onMouseLeave.bind(_this);
    return _this;
  }

  createClass$1(TargetComponent, [{
    key: "onMouseLeave",
    value: function onMouseLeave(e) {
      var getElement = e.relatedTarget;
      if (getElement && getElement.nodeName) {
        var close = getElement.closest(".manager");
        if (close) {
          var hasDataId = close.hasAttribute("data-target-id");
          if (hasDataId) {
            var getDataId = close.getAttribute("data-target-id");
            if (getDataId) {
              if (getDataId != this.props.id) this.props.closePopover();
            }
          }
        }
      }
    }
  }, {
    key: "onMouseEnter",
    value: function onMouseEnter() {
      this.props.openPopover();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var action = this.props.action;

      var target = ReactDOM.findDOMNode(this);
      this.target = target;
      if (action === "click") {
        target.addEventListener("click", this.click, false);
      } else if (action === "hover") {
        target.addEventListener("mouseenter", this.onMouseEnter, false);
        target.addEventListener("mouseleave", this.onMouseLeave, false);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _props = this.props,
          action = _props.action;

      if (action === "click") {
        this.target.removeEventListener("click", this.click, false);
      } else if (action === "hover") {
        this.target.removeEventListener("mouseenter", this.onMouseEnter, false);
        this.target.removeEventListener("mouseleave", this.onMouseLeave, false);
      }
    }
  }, {
    key: "click",
    value: function click(e) {
      e.stopImmediatePropagation();
      if (!e.target.nextSibling) this.props.tooglePopover();
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return jsx(reactPopper_3, {}, void 0, function (_ref) {
        var targetProps = _ref.targetProps;
        return React.createElement(
          "div",
          _extends$1({ className: "target-container" }, targetProps),
          _this2.props.children
        );
      });
    }
  }]);
  return TargetComponent;
}(React.Component);

function closestWebshim() {
  if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest = function (s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
          i,
          el = this;
      do {
        i = matches.length;
        while (--i >= 0 && matches.item(i) !== el) {}
      } while (i < 0 && (el = el.parentElement));
      return el;
    };
  }
}

var Popover$1 = function (_React$Component) {
  inherits(Popover, _React$Component);

  function Popover(props) {
    classCallCheck$1(this, Popover);

    var _this = possibleConstructorReturn(this, (Popover.__proto__ || Object.getPrototypeOf(Popover)).call(this, props));

    _this.closePopover = _this.closePopover.bind(_this);
    _this.tooglePopover = _this.tooglePopover.bind(_this);
    _this.openPopover = _this.openPopover.bind(_this);
    _this.state = { isOpen: props.defaultIsOpen, id: randomID(10, "a") };
    return _this;
  }

  createClass$1(Popover, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      closestWebshim();
    }
  }, {
    key: "openPopover",
    value: function openPopover() {
      this.setState({ isOpen: true });
    }
  }, {
    key: "tooglePopover",
    value: function tooglePopover() {
      this.setState({ isOpen: !this.state.isOpen });
    }
  }, {
    key: "closePopover",
    value: function closePopover() {
      this.setState({ isOpen: false });
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(_ref) {
      var open = _ref.open;

      this.setState({ isOpen: open });
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          className = _props.className,
          onClose = _props.onClose,
          onOpen = _props.onOpen,
          customArrow = _props.customArrow,
          arrow = _props.arrow,
          onClick = _props.onClick,
          placement = _props.placement,
          modifiers = _props.modifiers,
          render = _props.render,
          action = _props.action,
          motion = _props.motion,
          children = _props.children;


      return jsx(reactPopper_4, {
        className: "manager",
        style: { display: "inline" },
        "data-target-id": this.state.id
      }, void 0, jsx(TargetComponent, {
        id: this.state.id,
        closePopover: this.closePopover,
        openPopover: this.openPopover,
        tooglePopover: this.tooglePopover,
        action: action
      }, void 0, children[0]), this.state.isOpen ? React.createElement(PopoverComponent, _extends$1({
        key: Math.random(1),
        motion: motion,
        className: className,
        onClose: onClose,
        onOpen: onOpen,
        customArrow: customArrow,
        onClosePopover: this.closePopover,
        placement: placement,
        modifiers: modifiers
      }, this.props, {
        id: this.state.id
      })) : null);
    }
  }]);
  return Popover;
}(React.Component);

Popover$1.defaultProps = {
  arrow: true,
  placement: "auto",
  action: "click",
  modifiers: {},
  motion: false,
  className: undefined,
  defaultIsOpen: false,
  open: false
};

return Popover$1;

})));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"react":"react","react-dom":"react-dom"}],"TaskList":[function(require,module,exports){
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
		  React.createElement(TaskApp, {mode: this.data.mode, hideHeader: hideHeader, expandTask: expandTask, isDiffMode: isDiffMode, currentUser: this.currentUser ? this.currentUser : '', divId: divId, taskNum: taskNum, storeId: this.storeId, diffVersion1: diffVersion1, diffVersion2: diffVersion2, isChecklist: data.isChecklist}),
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

},{"./actions/TaskActions":1,"./components/TaskApp.react":4,"./stores/TaskStore":12,"./utils/TaskAPI":15,"react":"react","react-dom":"react-dom"}]},{},[]);
