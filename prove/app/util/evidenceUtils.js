var Constants = require("../config/constants.js");
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
    ensureHashMatches: function(errorCode, data, expectedHash, msgPrefix) {
        if(expectedHash==Constants.default.zeroBytesHash && data.length==0) {
            console.log(msgPrefix + " proof skipped as 0 bytes");
            return;            
        }
        var hashFromContent = this.computeSha256Hash(data)
        if(hashFromContent!=expectedHash) {
            throw new Error(msgPrefix + "doesn't match, expected=" + expectedHash + ", actual=" + hashFromContent);                            
        } else {
            console.log(msgPrefix + " proved");                            
        }
    },
    ensureSacSchemaVersionSupported: function(sacSchemaVersion) {
        if(sacSchemaVersion<Constants.default.supportedSacSchemaVersion) {
            throw new Error("Found sacSchemaVersion:" + sacSchemaVersion+" but only version higher than " + Constants.default.supportedSacSchemaVersion + " are supported");                            
        } 
    }    
}