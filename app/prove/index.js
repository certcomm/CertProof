var prover = require('./app/prove')

function LogEmitter() {
	this.indentTimes = 0;
};
LogEmitter.prototype = {	
	log: function(msg) {console.log(this.getPaddedMsg(msg));},
	error: function(err) {console.error(err);},
	getPaddedMsg : function(msg) {
                return "-".repeat(this.indentTimes*3) + msg;
    },
	indent: function() {
		this.indentTimes++;
	},
	deindent: function() {
		this.indentTimes--;
	}
};
var logEmitter = new LogEmitter();
var extractedEvidenceFolder = "/tmp/uploads/extracted/";
var zipFilePath = process.argv[2];
var performBlockchainProof = true;
if(process.argv.length==4) {
    performBlockchainProof = process.argv[3]=="true";
}
console.log("performBlockchainProof is " + performBlockchainProof);
prover.extractEvidence(logEmitter, extractedEvidenceFolder, zipFilePath)
.then(function(zip) {
        var proveConfig = {extractedEvidenceFolder:extractedEvidenceFolder, performBlockchainProof:performBlockchainProof};
        return prover.proveExtractedEvidenceZip(logEmitter, proveConfig, zip);
    })
.then(function(response) {
        logEmitter.log("Proof Success!"+ response);
     })
.catch(function(err) {
        console.error("Proof Failed!", err);
});
