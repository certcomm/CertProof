var prover = require('./app/prove')

function LogEmitter() {};
LogEmitter.prototype = {
	log: function(msg) {console.log(msg);},
	error: function(err) {console.error(err);}
};
var logEmitter = new LogEmitter();
var extractedEvidenceFolder = "/tmp/uploads/extracted/";
var zipFilePath = process.argv[2];
prover.extractEvidence(logEmitter, extractedEvidenceFolder, zipFilePath)
.then(function(zip) {
        return prover.proveExtractedEvidenceZip(logEmitter, extractedEvidenceFolder, zip);
    })
.then(function(response) {
        logEmitter.log("Success!"+ response);
     })
.catch(function(err) {
        console.error("Failed!", err);
});
