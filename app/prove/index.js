var prover = require('./app/prove')
var proverConstants = require("./app/config/constants.js");
var logEmitter = require("./logEmitter").createLogEmitter();
var fs = require('fs-extra');

var extractedEvidenceFolder = "/tmp/uploads/extracted/";
var zipFilePath = process.argv[2];
var performBlockchainProof = true;
if(process.argv.length==4) {
    performBlockchainProof = process.argv[3]=="true";
}
fs.ensureDirSync(extractedEvidenceFolder);
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
        process.exit(0);
     })
.catch(function(err) {
        logEmitter.log("Proof Failed!" + JSON.stringify(err));
        logEmitter.error(err);
        process.exit(1);
});
