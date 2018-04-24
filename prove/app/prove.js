var Constants = require("./config/constants.js");
var cpJsonUtils = require("./util/cpJsonUtils.js");
var evidenceUtils = require("./util/evidenceUtils.js");
var fs = require('fs-extra');
var path = require('path');
const StreamZip = require('node-stream-zip');

function extractEvidence(evidenceFileName) {
  return new Promise(function(resolve, reject) {
    if (fs.existsSync(Constants.default.extractedEvidenceFolder)){
        fs.removeSync(Constants.default.extractedEvidenceFolder);
    }
    const zip = new StreamZip({
        file: process.argv[2],
        storeEntries: true
    });
    zip.on('ready', () => {
        this.entries = zip.entries()
        if(evidenceUtils.rejectIfErrorFileExists(reject, this.entries)){
            return;
        }
        fs.ensureDir(Constants.default.extractedEvidenceFolder, err => {
          if(err) {
            reject(err);
          }
        })
        zip.extract(null, Constants.default.extractedEvidenceFolder, (err, count) => {
            if(err) {
                console.log(err ? 'Extract error' : `Extracted ${count} entries`);
                zip.close();
                reject(err);
            } else if(this.entries[Constants.default.routeEvidenceJsonFileName]) {
               this.evidenceData = zip.entryDataSync(Constants.default.routeEvidenceJsonFileName).toString('utf-8');
               resolve({
                entries: this.entries,
                evidenceJson:cpJsonUtils.parseJson(this.evidenceData)
               });
            } else {
                reject("Invalid zip missing "+ Constants.default.routeEvidenceJsonFileName);
                return;
            }
        });
    });
  });
}

function proveEvidence(extractResponse) {
    var evidenceJson = extractResponse.evidenceJson
    cpJsonUtils.ensureJsonHas("1010", evidenceJson, "ttnGlobal");
    cpJsonUtils.ensureJsonHas("1013", evidenceJson, "governor");
    cpJsonUtils.ensureJsonHas("1020", evidenceJson, "ttn", "highestCnum", "evidenceSchemaVersion", "hasDigitalSignature", "hasCBlockInfo");
    evidenceUtils.ensureEvidenceSchemaVersionSupported(evidenceJson.evidenceSchemaVersion)
    this.sectionsHashesSeen = {}
    this.ttn = evidenceJson.ttn;
    this.ttnGlobal = evidenceJson.ttnGlobal;
    this.governor = evidenceJson.governor;
    this.hasDigitalSignature = evidenceJson.hasDigitalSignature;
    this.hasCBlockInfo = evidenceJson.hasCBlockInfo;
    return proveIncEvidence(evidenceJson,entries, 1);
}

function proveIncEvidence(evidenceJson, mainZipEntries, cnum) {
    return new Promise(function(resolve, reject) {
        var ttn = evidenceJson.ttn;
        var highestcnum = evidenceJson.highestCnum;      
        var incEvidenceFileName = evidenceUtils.getIncEvidenceFileName(evidenceJson, mainZipEntries, ttn, cnum)
        evidenceUtils.ensureFileExists("2001", mainZipEntries, incEvidenceFileName);
        const zip = new StreamZip({
            file: Constants.default.extractedEvidenceFolder+incEvidenceFileName,
            storeEntries: true
        });

        zip.on('ready', () => {
            this.entries = zip.entries()
            if(evidenceUtils.rejectIfErrorFileExists(reject, this.entries)){
                return;
            }
            try {
                evidenceUtils.ensureFileExists("1024", this.entries, Constants.default.incManifestJsonFileName)
                var incManifestJson = cpJsonUtils.parseJson(zip.entryDataSync(Constants.default.incManifestJsonFileName).toString('utf-8'));
                cpJsonUtils.ensureJsonHas("1020",incManifestJson, "sacHash","incEvidenceSchemaVersion", "hasDigitalSignature", "hasCBlockInfo");
                evidenceUtils.assertEquals("2009", incManifestJson.hasDigitalSignature, this.hasDigitalSignature);                
                evidenceUtils.assertEquals("2010", incManifestJson.hasCBlockInfo, this.hasCBlockInfo);                

                evidenceUtils.ensureIncEvidenceSchemaVersionSupported(incManifestJson.incEvidenceSchemaVersion)

                evidenceUtils.ensureFileExists("2012", this.entries, Constants.default.manifestJsonFileName)
                var sacManifestData = zip.entryDataSync(Constants.default.manifestJsonFileName);
                evidenceUtils.ensureHashMatches("1005", sacManifestData, incManifestJson.sacHash, "sacHash for cnum:" + cnum);

                var sacManifestJson = cpJsonUtils.parseJson(sacManifestData.toString('utf-8'));
                cpJsonUtils.ensureJsonHas("1010",sacManifestJson, "ttnGlobal");
                cpJsonUtils.ensureJsonHas("1009",sacManifestJson, "subject");
                cpJsonUtils.ensureJsonHas("1013",sacManifestJson, "governor");
                cpJsonUtils.ensureJsonHas("1020",sacManifestJson, "ttn", "certified", "sacSchemaVersion"
                                                            , "changeset","ssac", "ssacHash", "wsac");
                evidenceUtils.assertEquals("2003", sacManifestJson.ttnGlobal, this.ttnGlobal);
                evidenceUtils.assertEquals("2002", sacManifestJson.ttn, this.ttn);                
                evidenceUtils.assertEquals("2011", sacManifestJson.governor, this.governor);                
                evidenceUtils.ensureSacSchemaVersionSupported(sacManifestJson.sacSchemaVersion);
                evidenceUtils.ensureThreadTypeSupported(sacManifestJson.threadType);
                validateWriters(cnum, sacManifestJson);

                var changeset = sacManifestJson.changeset;
                evidenceUtils.ensureChangeTypeSupported(changeset.changeType);
                
                if(sacManifestJson.certified) {
                    evidenceUtils.ensureCertOpTypeSupported(changeset.certOpType);
                }

                proveComment(cnum, changeset, zip);
                proveAttachments(cnum, changeset, zip);
                proveSsac(cnum, sacManifestJson.ssacHash, zip);
                console.log("proved", incEvidenceFileName);
                if (cnum != highestcnum) {
                    proveIncEvidence(evidenceJson, mainZipEntries, cnum+1);
                }
                resolve("proved")
            } catch(err) {
                console.error(err);
                reject(err.message);
            }
        });  
    });
}

function validateWriters(cnum, sacManifestJson) {
    var changeset = sacManifestJson.changeset;
    cpJsonUtils.ensureJsonHas("1014", changeset, "creator");
    validateWriter("1014", changeset.creator);
    var creatorForeverTmailAddress = changeset.creator.foreverTmailAddress;
    
    if((typeof changeset.addedWriters)!="undefined") {
        for(writerIdx in changeset.addedWriters) {
            validateWriter("1019", changeset.addedWriters[writerIdx]);
        }
    }
    var wsac = sacManifestJson.wsac;
    cpJsonUtils.ensureJsonHas("1012", wsac, "writers");
    var creatorExists = false;
    for(writerIdx in wsac.writers) {
        writer = wsac.writers[writerIdx];
        validateWriter("1012", writer);
        if(writer.foreverTmailAddress==creatorForeverTmailAddress) {
            creatorExists = true;
        }
    }
    if(!creatorExists) {
        errorMessages.throwError("1021", "missing:" + creatorForeverTmailAddress);
    }
    console.log("Validated writers for cnum:"+ cnum);                            
}

function validateWriter(errorCode, writer) {
    cpJsonUtils.ensureJsonHas(errorCode, writer, "foreverTmailAddress", "contemporaneousTmailAddress", "role");
}

function proveComment(cnum, changeset, zip) {
    console.log("Proving comment for cnum:"+ cnum);                            
    //changeset may optionally have comment
    //thats why do the explcit check instead of ensureJsonHas 
    if((typeof changeset.commentLeafHash)!="undefined") {
        var commentLeafHash = changeset.commentLeafHash;
        evidenceUtils.ensureFileExists("1001", this.entries, "comments/" + commentLeafHash +".html");
        var commentData = zip.entryDataSync("comments/" + commentLeafHash +".html")
        evidenceUtils.ensureHashMatches("1001", commentData, commentLeafHash, "CommentLeafHash for cnum"+ cnum);
    }
    console.log("Proved comment for cnum:"+ cnum);                            
}

function proveAttachments(cnum, changeset, zip) {
    console.log("Proving attachments for cnum:"+ cnum);                            
    if((typeof changeset.attachments)!="undefined") {
        for(attachmentIdx in changeset.attachments) {
            attachment = changeset.attachments[attachmentIdx];
            cpJsonUtils.ensureJsonHas("1020", attachment, "attachmentLeafHash","attachmentNum", "title")
            console.log("Proving cnum:" + cnum+ ". attachmentNum:" + attachment.attachmentNum);
            var attachmentLeafHash = attachment.attachmentLeafHash;
            var extension = path.extname(attachment.title);
            var attachmentFilePath = "attachments/" + attachmentLeafHash + extension;
            evidenceUtils.ensureFileExists("1003", this.entries, attachmentFilePath);
            var attachmentData = zip.entryDataSync(attachmentFilePath);
            evidenceUtils.ensureHashMatches("1003", attachmentData, attachmentLeafHash, "AttachmentLeafHash for cnum:" + cnum+ ", attachmentNum:" + attachment.attachmentNum);
        }
    }   
    console.log("Proved attachments for cnum:"+ cnum);                            
}

function proveSsac(cnum, ssacHash, zip) {
    console.log("Proving ssac for cnum:"+ cnum);                            
    evidenceUtils.ensureFileExists("1004", this.entries, Constants.default.ssacManifestJsonFileName)
    var ssacData = zip.entryDataSync(Constants.default.ssacManifestJsonFileName);
    evidenceUtils.ensureHashMatches("1004", ssacData, ssacHash, "ssacHash for cnum:" + cnum);
    var ssac = cpJsonUtils.parseJson(ssacData.toString('utf-8'));
    if((typeof ssac.sections)!="undefined") {
        for(sectionIdx in ssac.sections) {
            section = ssac.sections[sectionIdx];
            cpJsonUtils.ensureJsonHas("1017", section, "sectionLeafHash","type", "title")
            var sectionLeafHash = section.sectionLeafHash;
            if(this.sectionsHashesSeen[sectionLeafHash]=="undefined") {
                var extension = ".txt"
                if(section.type=="file") {
                    cpJsonUtils.ensureJsonHas("1017", section, "fileSectionOriginalName")
                    extension = path.extname(section.fileSectionOriginalName);
                } 
                
                var sectionFilePath = "sections/" + sectionLeafHash + extension;
                evidenceUtils.ensureFileExists("1002", this.entries, sectionFilePath);
                var sectionData = zip.entryDataSync(sectionFilePath);
                evidenceUtils.ensureHashMatches("1002", sectionData, sectionLeafHash, "SectionLeafHash for cnum:" + cnum + ", title:" + section.title);
                this.sectionsHashesSeen[sectionLeafHash]=true;
            }
        }
    }
    console.log("Proved ssac for cnum:"+ cnum);                            
}


extractEvidence(process.argv[2])
.then(function(response) {
        return proveEvidence(response);
    })
.then(function(response) {
        console.log("Success!", response);
     })
.catch(function(err) {
        console.error("Failed!", err);
});
