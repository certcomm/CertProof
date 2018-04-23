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
                evidenceJson:JSON.parse(this.evidenceData)
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
    this.sectionsHashesSeen = {}
    return proveIncEvidence(evidenceJson,entries, 1);
}

function proveIncEvidence(evidenceJson, mainZipEntries, cnum) {
    return new Promise(function(resolve, reject) {
        var ttn = evidenceJson.ttn;
        var highestcnum = evidenceJson.highestCnum;      
        var incEvidenceFileName = evidenceUtils.getIncEvidenceFileName(evidenceJson, mainZipEntries, ttn, cnum)
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
                evidenceUtils.ensureFileExists(this.entries, Constants.default.incManifestJsonFileName)
                var incManifestJson = JSON.parse(zip.entryDataSync(Constants.default.incManifestJsonFileName).toString('utf-8'));
                cpJsonUtils.ensureJsonHas(incManifestJson, "sacHash");

                evidenceUtils.ensureFileExists(this.entries, Constants.default.manifestJsonFileName)
                var sacManifestData = zip.entryDataSync(Constants.default.manifestJsonFileName);
                evidenceUtils.ensureHashMatches("1005", sacManifestData, incManifestJson.sacHash, "sacHash for cnum:" + cnum);

                var sacManifestJson = JSON.parse(sacManifestData.toString('utf-8'));
                cpJsonUtils.ensureJsonHas(sacManifestJson, "sacSchemaVersion", "changeset","ssac", "ssacHash");
                evidenceUtils.ensureSacSchemaVersionSupported(sacManifestJson.sacSchemaVersion)

                var changeset = sacManifestJson.changeset;
                proveComment(reject, cnum, changeset, zip);
                proveAttachments(reject, cnum, changeset, zip);
                proveSsac(reject, cnum, sacManifestJson.ssacHash, zip);
                console.log("proved", incEvidenceFileName);
                if(cnum!=highestcnum) {
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

function proveComment(reject, cnum, changeset, zip) {
    console.log("Proving comment for cnum:"+ cnum);                            
    if((typeof changeset.commentLeafHash)!="undefined") {
        var commentLeafHash = changeset.commentLeafHash;
        evidenceUtils.ensureFileExists(this.entries, "comments/" + commentLeafHash +".html");
        var commentData = zip.entryDataSync("comments/" + commentLeafHash +".html")
        evidenceUtils.ensureHashMatches("1001", commentData, commentLeafHash, "CommentLeafHash for cnum"+ cnum);
    }
    console.log("Proved comment for cnum:"+ cnum);                            
}

function proveAttachments(reject, cnum, changeset, zip) {
    console.log("Proving attachments for cnum:"+ cnum);                            
    if((typeof changeset.attachments)!="undefined") {
        for(attachmentIdx in changeset.attachments) {
            attachment = changeset.attachments[attachmentIdx];
            cpJsonUtils.ensureJsonHas(attachment, "attachmentLeafHash","attachmentNum", "title")
            console.log("Proving cnum:" + cnum+ ". attachmentNum:" + attachment.attachmentNum);
            var attachmentLeafHash = attachment.attachmentLeafHash;
            var extension = path.extname(attachment.title);
            var attachmentFilePath = "attachments/" + attachmentLeafHash + extension;
            evidenceUtils.ensureFileExists(this.entries, attachmentFilePath);
            var attachmentData = zip.entryDataSync(attachmentFilePath);
            evidenceUtils.ensureHashMatches("1003", attachmentData, attachmentLeafHash, "AttachmentLeafHash for cnum:" + cnum+ ", attachmentNum:" + attachment.attachmentNum);
        }
    }   
    console.log("Proved attachments for cnum:"+ cnum);                            
}

function proveSsac(reject, cnum, ssacHash, zip) {
    console.log("Proving ssac for cnum:"+ cnum);                            
    evidenceUtils.ensureFileExists(this.entries, Constants.default.ssacManifestJsonFileName)
    var ssacData = zip.entryDataSync(Constants.default.ssacManifestJsonFileName);
    evidenceUtils.ensureHashMatches("1004", ssacData, ssacHash, "ssacHash for cnum:" + cnum);
    var ssac = JSON.parse(ssacData.toString('utf-8'));
    if((typeof ssac.sections)!="undefined") {
        for(sectionIdx in ssac.sections) {
            section = ssac.sections[sectionIdx];
            cpJsonUtils.ensureJsonHas(section, "sectionLeafHash","type", "title")
            var sectionLeafHash = section.sectionLeafHash;
            if(this.sectionsHashesSeen[sectionLeafHash]=="undefined") {
                var extension = ".txt"
                if(section.type=="file") {
                    cpJsonUtils.ensureJsonHas(section, "fileSectionOriginalName")
                    extension = path.extname(section.fileSectionOriginalName);
                } 
                
                var sectionFilePath = "sections/" + sectionLeafHash + extension;
                evidenceUtils.ensureFileExists(this.entries, sectionFilePath);
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
