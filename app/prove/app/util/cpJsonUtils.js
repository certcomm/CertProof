var errorMessages = require("../config/errorMessages.js");
module.exports = {
    ensureJsonHas: function() {
        var errorCode = arguments[0];
        var json = arguments[1];
        for (var i = 2; i < arguments.length; i++) {
	        var attributeName = arguments[i];
	        if((typeof json[attributeName]) == "undefined") {
                errorMessages.throwError(errorCode, "missing attribute:" + attributeName);
	        }
        }
    },
    parseJson : function(str) {
    	try {
    		return JSON.parse(str);
    	} catch(err) {
            errorMessages.throwError("1007", err.message)
    	}
    }
}