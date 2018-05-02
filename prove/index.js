var prover = require('./app/prove')

function LogEmitter() {};
LogEmitter.prototype = {
	log: function(msg) {console.log(msg);},
	error: function(err) {console.error(err);}
};
var logEmitter = new LogEmitter();

prover.extractEvidence(logEmitter, process.argv[2])
.then(function(response) {
        return prover.proveEvidence(response);
    })
.then(function(response) {
        console.log("Success!"+ response);
     })
.catch(function(err) {
        console.error("Failed!", err);
});
