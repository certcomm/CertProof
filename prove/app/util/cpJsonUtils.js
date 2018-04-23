module.exports = {
    ensureJsonHas: function() {
        var json = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
	        var attributeName = arguments[i];
	        if((typeof json[attributeName]) == "undefined") {
	            throw new Error("Invalid json as it does not contains " + attributeName);
	        }
        }
    },
}