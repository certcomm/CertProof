var Constants = require("../config/constants.js");
var errorMessages = require("../config/errorMessages.js");
const crypto = require('crypto');

module.exports = {
    rejectIfErrorFileExists: function(reject, entries) {
        if(entries[Constants.default.errorFileName]) {
            reject("Invalid Zip as it contains Error.txt");
            return true;
        }
        return false;        
    },
    ensureFileExists: function(entries, fileName) {
        if(!entries[fileName]) {
            throw new Error("Invalid Zip as it does not contains " + fileName);
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
        this.ensureFileExists(entries, filename)
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
            var errorMessage = errorMessages.errors[errorCode]
            throw {name: errorCode, message: errorMessage + " " + msgContext + " doesn't match, expected=" + expectedHash + ", actual=" + hashFromContent};                            
        } else {
            console.log(msgContext + " proved");                            
        }
    },
    ensureSacSchemaVersionSupported: function(sacSchemaVersion) { 
        if(sacSchemaVersion<Constants.default.supportedSacSchemaVersion) {
            throw {name:"2008", message:"Found sacSchemaVersion:" + sacSchemaVersion+" but only version higher than " + Constants.default.supportedSacSchemaVersion + " are supported"};                            
        } 
    }    
}