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
				progressBar = <div className="progressbar_block progressbar-grn">
					<div className="progressbar ui-progressbar ui-widget ui-widget-content ui-corner-all">
						<div className="ui-progressbar-value ui-widget-header ui-corner-left" style={{width: otherProgress + "%"}}></div>
					</div>
					<p className="progressbar_status">{otherCount + ' / ' + otherTotal}</p>
				</div>;
			} else{
				progressBar = <div className="row">
							<div className="progressbar_block progressbar-grn col-md-8" style={{marginLeft: "-5px", marginRight: "5px"}}>
								<div className="progressbar ui-progressbar ui-widget ui-widget-content ui-corner-all">
									<div className="ui-progressbar-value ui-widget-header ui-corner-left" style={{width: otherProgress + "%"}}></div>
								</div>
								<p className="progressbar_status">
									{this.props.diffVersion1 && this.props.diffVersion2 ? <span className="diffVersion">V{this.props.diffVersion1} </span>: null} 
									{otherCount + ' / ' + otherTotal}
								</p>
							</div>
							<div className="progressbar_block progressbar-orange col-md-4">
								<div className="progressbar ui-progressbar ui-widget ui-widget-content ui-corner-all">
									<div className="ui-progressbar-value ui-widget-header ui-corner-left" style={{width: baseProgress + "%"}}></div>
								</div>
								<p className="progressbar_status">
									{this.props.diffVersion1 && this.props.diffVersion2 ? <span className="diffVersion" title={"('baseline' state was [" + baseCount + " of " + baseTotal + "])"}>V{this.props.diffVersion2} </span>: null} 
									{baseCount + ' / ' + baseTotal}
								</p>
							</div>
						</div>;
			}			
		} else {
			progressBar = <div className="progressbar_block progressbar-grn">
					<div className="progressbar ui-progressbar ui-widget ui-widget-content ui-corner-all">
						<div className="ui-progressbar-value ui-widget-header ui-corner-left" style={{width: progress + "%"}}></div>
					</div>
					<p className="progressbar_status">{count + ' / ' + totalTasks}</p>
				</div>;
		}
		
		return (
			<div>
				{progressBar}
			</div>
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
				<div>
					<span style={{marginRight: "10px", float: "left"}}>Sort By</span>
					<Chosen name="custom-sort-by" className="chosen-select chosen-select-custom" defaultValue={this.props.sortBy} onChange={this.handleChange} onClick={this.handleClick} key={"select-"+this.props.sortBy} disableSearch={true} inheritSelectClasses={true}>
						<option value="manual">Manual</option>
						<option value="taskNumber">Task #</option>
						<option value="priority">Priority</option>
					</Chosen>
				</div>
			);
		}
	
		if(this.props.isDiffMode) {
			return (
				<div>
					<span style={{marginRight: "10px", float: "left"}}>Sort By</span>
					<Chosen name="custom-sort-by" className="chosen-select chosen-select-custom" defaultValue={this.props.sortBy} onChange={this.handleChange} onClick={this.handleClick} key={"select-"+this.props.sortBy} disableSearch={true} inheritSelectClasses={true}>
						<option value="state">State</option>
						<option value="taskNumber">Task #</option>
						<option value="priority">Priority</option>
					</Chosen>
				</div>
			);
		} else {
			return (
				<div>
					<span style={{marginRight: "10px", float: "left"}}>Sort By</span>
					<Chosen name="custom-sort-by" className="chosen-select chosen-select-custom" defaultValue={this.props.sortBy} onChange={this.handleChange} onClick={this.handleClick} key={"select-"+this.props.sortBy} disableSearch={true} inheritSelectClasses={true}>
						<option value="manual">Manual</option>
						<option value="state">State</option>
						<option value="taskNumber">Task #</option>
						<option value="priority">Priority</option>
					</Chosen>
				</div>
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
				<div style={{width: "146px"}}>
					<input type="checkbox" id="hide-tasks" name="hide-tasks" onChange={this.handleChange} disabled={disabled} ref="hideTasks"/> Show only open tasks
				</div>
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
			return <div className="container tasklist editable template-task-list-outter">
						<div className="row">
							<div className="col-md-12 header-outter-div" style={{position: "inherit"}}><TaskAddComp items={this.state.taskData.taskables} storeId={storeId}  currentUserAdress={currentUser.address} /></div>
							<div className="col-md-12 template-tasks-message">A Task List created in a Template cannot have tasks added. Tasks can be added in any Instance created from this Template. If you want to add Tasks in a Template, use a Checklist instead</div>
						</div>
				</div>
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
			noTaskHtml = (taskData.mode == 'read')? (<div className="noTask noTaskRead"><h3>No tasks</h3></div>): (<div className="noTask"><h3>No task added</h3></div>);
		} 
		var writersMissing = (taskData.additionalActors && (taskData.additionalActors.length > writersCount) && taskData.taskables.length > 0) ?'Some writers have been removed...' : ' ';

		var taskHtml = null;
		switch (taskData.mode) {
			case "read":
			case "readSort":
				if(taskLength > 0 && this.state.hideHeader !== true) {
					taskHtml = <div className="col-md-12 header-outter-div">
						<div className="row">
							<div className="col-md-12 custom-sort">
								<Progressbar taskData={taskData} storeId={storeId} isDiffMode={this.state.isDiffMode} diffVersion1={this.props.diffVersion1} diffVersion2={this.props.diffVersion2}/>
							</div>
						</div>
						<div className="row">
							<div className="col-md-4 custom-sort" style={{width: "30%"}}>
								{
									!taskData.isChecklist ? <SortTasks storeId={storeId} divId={this.state.divId} isDiffMode={this.state.isDiffMode} sortBy={this.state.taskData.sortBy ? this.state.taskData.sortBy : (this.state.isDiffMode ? 'state' : 'priority')}/> : null
								}
							</div>
							<div className="col-md-4" style={{width: "28%", paddingTop: "5px"}}>
								<div id="sorting" style={{display: "none"}} className="sortMessage" key={this.state.taskData.sortBy}>Sorting...</div>
							</div>
							<div className="col-md-4 custom-sort" style={{width: "41%", float: "right"}}>
								<div style={{float: "right"}}>
									{
										!taskData.isChecklist ? 
											this.state.isDiffMode ? <FilterTasks filterBy={this.state.taskData.filterBy ? this.state.taskData.filterBy : "changedTasks"} mode={this.state.taskData.mode} storeId={storeId} divId={this.state.divId} isDiffMode={this.state.isDiffMode}/> : <ShowOpenTaskToggle filterBy={this.state.taskData.filterBy ? this.state.taskData.filterBy : "all"} mode={this.state.taskData.mode} storeId={storeId} divId={this.state.divId} sortBy={this.state.taskData.sortBy ? this.state.taskData.sortBy : 'priority'} items={this.state.taskData.taskables}/>
										: null
									}
								</div>
							</div>
						</div>
						{typeof this.state.taskData.wereTasksReordered != "undefined" && this.state.taskData.wereTasksReordered ? <div className="row"><div className="taskReorder">Tasks were reordered</div> </div>: null}
					</div>;
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
			<div style={{width: "inherit", height: "inherit", position: "inherit"}}>
				<div className={(taskData.mode == 'read' || taskData.mode == 'readSort' ? 'readable' : 'editable') + ' container tasklist' + (taskData.mode == 'template' ? ' templateMode' : '')}>
					{}
					{taskHtml}
					<div className="clearfix"></div>
					{taskData.mode == 'template' && taskLength > 0 ? <div className="template-note">[Note: In a Template, Tasks cannot be started or have a requester set or have assignees added]</div> : null}
					{}
					<div id="sorting-content" className={mode}>
						{noTaskHtml}
						<TaskLists taskData={taskData} writers={this.state.writers} favWriters={this.state.favWriters} allWriters={this.state.allWriters} currentUser={this.state.currentUser} divId={this.state.divId} taskNum={taskNum} storeId={storeId} isChecklist={this.state.isChecklist}/>
					</div>
				</div>
				{}
			</div>	
		);
	},
	// Method to setState based upon Store changes
	_onChange: function() {
		this.setState({taskData: getTasksState(this.state.storeId)});
	}
});
module.exports = TaskApp;