var Constants = require("../config/constants.js");
var errorMessages = require("../config/errorMessages.js");
const crypto = require('crypto');
const threadTypes = new Set(["Instance","Template","Basic","Standard"]); 
const changeTypes = new Set(["created_tmail","created_tmail_with_cloned_base","forwarded_tmail","added_comment","ack_read","ack_receipt",
                            "added_section","added_sections","auto_added_section","updated_section","updated_sections","deleted_section","deleted_sections"
                            ,"added_writers","batch_update","released_template","instantiated_template","attached_user"]); 
const certOpTypes = new Set(["C-SEND","C-CLONE","C-FORWARD","C-RESPOND","C-RESPOND-WITH-READ-ACK","C-RESPOND-WITH-RECEIPT-ACK","C-RESPOND-WITH-UPDATES"
                            ,"C-TEMPLATE-RELEASE","C-INSTANTIATE","C-RESPOND-WITH-USER-ATTACH"]); 

module.exports = {
    rejectIfErrorFileExists: function(reject, entries) {
        if(entries[Constants.default.errorFileName]) {
            reject("Invalid Zip as it contains Error.txt");
            return true;
        }
        return false;        
    },
    ensureFileExists: function(errorCode, entries, fileName) {
        if(!entries[fileName]) {
            errorMessages.throwError(errorCode, "invalid Zip as it does not contains " + fileName);
        }
    },
    assertEquals: function (errorCode, actual, expected) {
        if(actual != expected) {
            errorMessages.throwError(errorCode, " doesn't match, expected=" + expected + ", actual=" + actual);
        }        
    },
    getIncEvidenceFileName: function(evidenceJson, entries, ttn, cnum) {
        var filename;
        if(evidenceJson.hasDigitalSignature && evidenceJson.hasCBlockInfo) {
            filename = "L1_INC_EV_"+ttn+"_"+cnum+".zip"
        } else if(evidenceJson.hasDigitalSignature && evidenceJson.hasCBlockInfo==false) {
            filename = "L2_INC_EV_"+ttn+"_"+cnum+".zip"
        } else {
            filename = "BACKUP_INC_"+ttn+"_"+cnum+".zip";
        } 
        return filename;
    },
    computeSha256Hash: function(data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    },
    ensureHashMatches: function(logEmitter, errorCode, data, expectedHash, msgContext) {
        if(expectedHash==Constants.default.zeroBytesHash && data.length==0) {
            logEmitter.log(msgContext + " proof skipped as 0 bytes");
            return;            
        }
        var hashFromContent = this.computeSha256Hash(data)
        if(hashFromContent!=expectedHash) {
            errorMessages.throwError(errorCode, msgContext + " doesn't match, expected=" + expectedHash + ", actual=" + hashFromContent);
        } else {
            logEmitter.log(msgContext + " proved");                            
        }
    },
    ensureSacSchemaVersionSupported: function(logEmitter, schemaVersion) { 
        schemaVersionSupported(logEmitter, "sac", schemaVersion);
    },
    ensureEvidenceSchemaVersionSupported: function(logEmitter, schemaVersion) { 
        schemaVersionSupported(logEmitter, "evidence", schemaVersion);
    },
    ensureIncEvidenceSchemaVersionSupported: function(logEmitter, schemaVersion) { 
        schemaVersionSupported(logEmitter, "incEvidence", schemaVersion);
    },
    ensureThreadTypeSupported: function(threadType) {
        if(!(threadTypes.has(threadType))) {
            errorMessages.throwError("1008", threadType);            
        }
    },
    ensureChangeTypeSupported: function(changeType) {
        if(!(changeTypes.has(changeType))) {
            errorMessages.throwError("1015", changeType);            
        }
    },
    ensureCertOpTypeSupported: function(certOpType) {
        if(!(certOpTypes.has(certOpType))) {
            errorMessages.throwError("1018", certOpType);            
        }
    },
    proveMerklePathToRoot: function (logEmitter, merkleRootHash, leafSignature, merklePathToRoot) {
        try {
            logEmitter.indent();            
            logEmitter.log("Proving leafSignature:"+ leafSignature + " is part of merkleRootHash:" + merkleRootHash + " using merklePathToRoot: " + merklePathToRoot);
            var digest = Buffer.from(leafSignature,'hex');
            for(var treeNode of merklePathToRoot.split(",")) {
                var msg = "Hashing node " + treeNode + " and " + digest.toString('hex');
                var hash = crypto.createHash('sha256');
                var split = treeNode.split(":")
                if(split[0]=="L"){
                    hash.update(Buffer.from(split[1],'hex'));
                    hash.update(digest);
                    digest = hash.digest();
                } else {
                    hash.update(digest);
                    hash.update(Buffer.from(split[1],'hex'));
                    digest = hash.digest();
                }
                logEmitter.log(msg + " leads to hash:" + digest.toString('hex'));
            }
            var actualRootHash = digest.toString('hex');
            logEmitter.log("actualRootHash:" + actualRootHash)
            if(actualRootHash != merkleRootHash) {
                errorMessages.throwError("1022", "expectedRootHash:" + merkleRootHash +", actualRootHash=" + actualRootHash);            
            }
            logEmitter.log("MerkleTree proved leafSignature:"+ leafSignature + " is part of merkleRootHash:" + merkleRootHash);
        } finally {
            logEmitter.deindent();
        }                
    }
}

function schemaVersionSupported(logEmitter, schemaType, schemaVersion) {
    schemaVersion = ""+schemaVersion;
    if(schemaVersion.indexOf(".")==-1) {
        errorMessages.throwError("1026", ",found " + schemaType + " SchemaVersion:" + schemaVersion);
    }
    var majorSchemaVersion = parseInt(schemaVersion.split(".")[0]);
    var minorSchemaVersion = parseInt(schemaVersion.split(".")[1]);

    if(isNaN(majorSchemaVersion) || isNaN(minorSchemaVersion)) {
        errorMessages.throwError("1026", "found " + schemaType + " SchemaVersion:" + schemaVersion + " to be not proper numeric format");
    }
    var expectedSchemaVersion = Constants.default.supportedSchemaVersions.current;
    var expectedMajorSchemaVersion = parseInt(expectedSchemaVersion.split(".")[0]);
    var expectedMinorSchemaVersion = parseInt(expectedSchemaVersion.split(".")[1]);

    if(majorSchemaVersion>expectedMajorSchemaVersion) {
        errorMessages.throwError("1027", "found " + schemaType + " MajorSchemaVersion:" + majorSchemaVersion + " but only versions less than " + expectedMajorSchemaVersion + " are supported");
    } 
    var minExpectedSchemaVersion = Constants.default.supportedSchemaVersions.min;
    var minExpectedMajorSchemaVersion = parseInt(minExpectedSchemaVersion.split(".")[0]);
    var minExpectedMinorSchemaVersion = parseInt(minExpectedSchemaVersion.split(".")[1]);

    if(minExpectedMajorSchemaVersion<expectedMajorSchemaVersion||(minExpectedMajorSchemaVersion==expectedMajorSchemaVersion && minExpectedMinorSchemaVersion<minorSchemaVersion)) {
        errorMessages.throwError("1006", "found " + schemaType + " schemaVersion:" + schemaVersion + " but only versions greater than " + minExpectedSchemaVersion + " are supported");
    }
    
    logEmitter.log(schemaType + " version validated");
}