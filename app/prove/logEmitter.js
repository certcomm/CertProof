function LogEmitter() {
	this.indentTimes = 0;
    this.terminated = false;
};
LogEmitter.prototype = {
	log: function(msg, delimiter="-") {
	    console.log(this.getPaddedMsg(msg, delimiter));
	    this.stopIfTerminated();
	},
	error: function(err) {console.error(err);},
	getPaddedMsg : function(msg, delimiter="-") {
                return delimiter.repeat(this.indentTimes*3) + msg;
    },
	indent: function() {
		this.indentTimes++;
	},
	deindent: function() {
		this.indentTimes--;
	},
	triggerTerminate() {
	    this.terminated = true;
	},
	stopIfTerminated() {
	    if(this.terminated == true) {
	        throw {name:"0000", message:"Terminated by user action"}
	    }
	}
};

module.exports = {
    createLogEmitter: function () {
        return new LogEmitter();
    }
}
