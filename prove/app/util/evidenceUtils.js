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
            filename = "L2_INC_EV_"+ttn+"_"+cnum+".zip"
        } else if(evidenceJson.hasDigitalSignature && evidenceJson.hasCBlockInfo==false) {
            filename = "L1_INC_EV_"+ttn+"_"+cnum+".zip"
        } else {
            filename = "BACKUP_INC_"+ttn+"_"+cnum+".zip";
        } 
        return filename;
    },
    computeSha256Hash: function(data) {
        return crypto.createHash('sha256').update(data).digest('hex');
    },
    ensureHashMatches: function(errorCode, data, expectedHash, msgContext) {
        if(expectedHash==Constants.default.zeroBytesHash && data.length==0) {
            console.log(msgContext + " proof skipped as 0 bytes");
            return;            
        }
        var hashFromContent = this.computeSha256Hash(data)
        if(hashFromContent!=expectedHash) {
            errorMessages.throwError(errorCode, msgContext + " doesn't match, expected=" + expectedHash + ", actual=" + hashFromContent);
        } else {
            console.log(msgContext + " proved");                            
        }
    },
    ensureSacSchemaVersionSupported: function(schemaVersion) { 
        schemaVersionSupported("sac", "1006", schemaVersion, Constants.default.supportedSchemaVersions.sac);
    },
    ensureEvidenceSchemaVersionSupported: function(schemaVersion) { 
        schemaVersionSupported("evidence", "2008", schemaVersion, Constants.default.supportedSchemaVersions.evidence);
    },
    ensureIncEvidenceSchemaVersionSupported: function(schemaVersion) { 
        schemaVersionSupported("incEvidence", "1006", schemaVersion, Constants.default.supportedSchemaVersions.incEvidence);
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
    }
}

function schemaVersionSupported(schemaType, errorCode, schemaVersion, expectedSchemaVersion) {
    if(schemaVersion<expectedSchemaVersion) {
        errorMessages.throwError(errorCode, "Found " + schemaType + " SchemaVersion:" + schemaVersion+" but only version higher than " + expectedSchemaVersion + " are supported");                            
    } 
    console.log(schemaType + " version validated");
}