var prover = require('./app/prove')
var proverConstants = require("./app/config/constants.js");
var logEmitter = require("./logEmitter").createLogEmitter();

var extractedEvidenceFolder = "/tmp/uploads/extracted/";
var zipFilePath = process.argv[2];
var performBlockchainProof = true;
if(process.argv.length==4) {
    performBlockchainProof = process.argv[3]=="true";
}
console.log("performBlockchainProof is " + performBlockchainProof);
prover.extractEvidence(logEmitter, extractedEvidenceFolder, zipFilePath)
.then(function(zip) {
        var proveConfig = {extractedEvidenceFolder:extractedEvidenceFolder,
                            performBlockchainProof:performBlockchainProof,
                            networkNodeUrlsMap:proverConstants.default.defaultNetworkNodeUrlsMap};
        return prover.proveExtractedEvidenceZip(logEmitter, proveConfig, zip);
    })
.then(function(response) {
        logEmitter.log("Proof Success!"+ response);
     })
.catch(function(err) {
        console.error("Proof Failed!", err);
});
