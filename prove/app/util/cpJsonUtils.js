var errorMessages = require("../config/errorMessages.js");
module.exports = {
    ensureJsonHas: function() {
        var json = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
	        var attributeName = arguments[i];
	        if((typeof json[attributeName]) == "undefined") {
	            var errorCode = "1025";
	            var errorMessage = errorMessages.errors[errorCode];
	            throw {name:errorCode, message:errorMessage + ", missing attribute:" + attributeName};                            
	        }
        }
    },
    parseJson : function(str) {
    	try {
    		return JSON.parse(str);
    	} catch(err) {
            var errorCode = "1007";
            var errorMessage = errorMessages.errors[errorCode] + "," + err.message;
            throw {name:errorCode, message:errorMessage + ", missing attribute:" + attributeName};                            
    	}
    }
}