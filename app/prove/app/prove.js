require("babel-polyfill");

var Constants = require("./config/constants.js");
var errorMessages = require("./config/errorMessages.js");
var cpJsonUtils = require("./util/cpJsonUtils.js");
var evidenceUtils = require("./util/evidenceUtils.js");
var blockchainUtils = require("./util/blockchainUtils.js");

try{
    var fs = window.require('fs-extra');
    var path = window.require('path');
    var StreamZip = window.require('node-stream-zip');
}catch(e){
    var fs = require('fs-extra');
    var path = require('path');
    var StreamZip = require('node-stream-zip');
}

module.exports = {
    extractEvidence: function(logEmitter, extractedEvidenceFolder, evidenceFileName) {
      this.logEmitter = logEmitter;
      var outer = this;
      return new Promise(function(resolve, reject) {
        if (fs.existsSync(extractedEvidenceFolder)){
            fs.removeSync(extractedEvidenceFolder);
        }
        const zip = new StreamZip({
            file: evidenceFileName,
            storeEntries: true
        });
        zip.on('ready', () => {
            if(evidenceUtils.rejectIfErrorFileExists(reject, zip.entries)) {
                zip.close();
                return;
            }
            fs.ensureDir(extractedEvidenceFolder, err => {
              if(err) {
                zip.close();
                reject(err);
              }
            })
            zip.extract(null, extractedEvidenceFolder, (err, count) => {
                if(err) {
                    outer.logEmitter.error('Extract error');
                    reject(err);
                } else {
                    resolve(zip);
                }
            });
        });
      });
    },

    proveExtractedEvidenceZip :function(logEmitter, proveConfig, zip) {
        this.logEmitter = logEmitter;
        this.proveConfig = proveConfig;
        var outer = this;
        return new Promise((resolve, reject) => {
            this.logEmitter.log("Starting Proof");
            this.logEmitter.log("proveConfig=" + JSON.stringify(proveConfig));
            this.entries = zip.entries()
            if(evidenceUtils.rejectIfErrorFileExists(reject, this.entries)) {
                return;
            }
            if(this.entries[Constants.default.routeEvidenceJsonFileName]) {
               this.evidenceData = zip.entryDataSync(Constants.default.routeEvidenceJsonFileName).toString('utf-8');
               resolve(outer.proveEvidence({
                extractedEvidenceFolder:proveConfig.extractedEvidenceFolder,
                entries: this.entries,
                evidenceJson:cpJsonUtils.parseJson(this.evidenceData)
               }));
            } else {
                reject("Invalid zip missing "+ Constants.default.routeEvidenceJsonFileName);
                return;
            }    
        });
    },
    
    proveEvidence : async function(extractResponse) {
        var evidenceJson = extractResponse.evidenceJson
        cpJsonUtils.ensureJsonHas("1010", evidenceJson, "ttnGlobal");
        cpJsonUtils.ensureJsonHas("1013", evidenceJson, "governor");
        cpJsonUtils.ensureJsonHas("1020", evidenceJson, "ttn", "highestCnum", "evidenceSchemaVersion", "hasDigitalSignature", "hasCBlockInfo");
        evidenceUtils.ensureEvidenceSchemaVersionSupported(this.logEmitter, evidenceJson.evidenceSchemaVersion)
        this.sectionsHashesSeen = new Set()
        this.currentSectionNums = new Set()
        this.currentWriters = new Set()
        this.ttn = evidenceJson.ttn;
        this.ttnGlobal = evidenceJson.ttnGlobal;
        this.governor = evidenceJson.governor;
        this.hasDigitalSignature = evidenceJson.hasDigitalSignature;
        this.certified = evidenceJson.certified;
        this.hasCBlockInfo = evidenceJson.hasCBlockInfo;
        this.cblocksProved = new Set()
        return await this.proveIncEvidence(evidenceJson,extractResponse.extractedEvidenceFolder, extractResponse.entries, 1);
    },

    proveIncEvidence : async function (evidenceJson, extractedEvidenceFolder, mainZipEntries, cnum) {
        var outer = this;
        return new Promise((resolve, reject) => {
            var ttn = evidenceJson.ttn;
            var highestcnum = evidenceJson.highestCnum;      
            var incEvidenceFileName = evidenceUtils.getIncEvidenceFileName(evidenceJson, ttn, cnum)
            evidenceUtils.ensureFileExists("2001", mainZipEntries, incEvidenceFileName);
            const zip = new StreamZip({
                file: extractedEvidenceFolder + incEvidenceFileName,
                storeEntries: true
            });

            zip.on('ready', async () => {
                this.entries = zip.entries();
                this.logEmitter = outer.logEmitter;
                this.proveConfig = outer.proveConfig;
                if(evidenceUtils.rejectIfErrorFileExists(reject, this.entries)){
                    zip.close();
                    return;
                }
                var deindented = false;
                try {
                    this.logEmitter.indent();
                    this.logEmitter.log("");
                    this.logEmitter.log("");
                    this.logEmitter.log("Starting Proof for cnum:" + cnum);
                    evidenceUtils.ensureFileExists("1024", this.entries, Constants.default.incManifestJsonFileName)
                    var incManifestJson = cpJsonUtils.parseJson(zip.entryDataSync(Constants.default.incManifestJsonFileName).toString('utf-8'));
                    outer.validateIncManifest(cnum, incManifestJson);

                    evidenceUtils.ensureFileExists("2012", this.entries, Constants.default.manifestJsonFileName)                
                    var sacManifestData = zip.entryDataSync(Constants.default.manifestJsonFileName);
                    evidenceUtils.ensureHashMatches(this.logEmitter, "1005", sacManifestData, incManifestJson.sacHash, "sacHash for cnum:" + cnum);

                    var sacManifestJson = cpJsonUtils.parseJson(sacManifestData.toString('utf-8'));
                    var allWsacForeverTmailAddress = new Set();
                    outer.validateSacManifest(cnum, sacManifestJson, allWsacForeverTmailAddress);

                    outer.proveChangeset(cnum, sacManifestJson, zip)
                    outer.proveSsac(cnum, sacManifestJson.ssacHash, zip);
                    if (cnum==1) {
                        outer.proveForwards(sacManifestJson, zip, allWsacForeverTmailAddress);
                    }
                    outer.validateWriterImageMapping(incManifestJson, allWsacForeverTmailAddress)
                    await outer.proveCThinBlockInfo(reject, cnum, incManifestJson, sacManifestJson, zip);
                    this.logEmitter.log("Proved cnum:" + cnum);
                    if (cnum != highestcnum) {
                        this.logEmitter.deindent();
                        deindented=true;
                        await outer.proveIncEvidence(evidenceJson, extractedEvidenceFolder, mainZipEntries, cnum+1);
                    }
                    resolve("proved")
                    zip.close();
                } catch(err) {
                    this.logEmitter.error(err);
                    zip.close();
                    reject(err.message || err);
                } finally {
                    if (!deindented) {
                        this.logEmitter.deindent();
                    }
                }
            });  
        });
    },

    proveForwards : function (sacManifestJson, zip, allWsacForeverTmailAddress) {
        if((typeof sacManifestJson.forwards)!="undefined") {
            this.logEmitter.log("Proving forwards");
            try {
                this.logEmitter.indent();
                for(var forward of sacManifestJson.forwards) {
                    cpJsonUtils.ensureJsonHas("1020", forward, "forwardedComments", "subject", "ttnGlobal", "ttn", "forwardedAtChangeNum", "threadType");
                    for(var forwardedComment of forward.forwardedComments) {
                        cpJsonUtils.ensureJsonHas("1020", forwardedComment, "sacHash", "changeNum");
                        var forwardedCommentSacManifestPath = "forwards/" + forward.ttn + "_" + forwardedComment.changeNum + "_sacManifest.json";
                        this.logEmitter.log("Proving " + forwardedCommentSacManifestPath);
                        try {
                            this.logEmitter.indent();
                            evidenceUtils.ensureFileExists("1025", zip.entries(), forwardedCommentSacManifestPath);
                            var forwardedCommentSacData = zip.entryDataSync(forwardedCommentSacManifestPath);
                            evidenceUtils.ensureHashMatches(this.logEmitter, "1025", forwardedCommentSacData, forwardedComment.sacHash, "forwardedCommentSac for " + forwardedCommentSacManifestPath);

                            var forwardedCommentSacJson = cpJsonUtils.parseJson(forwardedCommentSacData.toString('utf-8'));
                            if(forwardedCommentSacJson.metadataDeleted==true) {
                                this.proveComment(forwardedCommentSacJson.changeNum, forwardedCommentSacJson.commentLeafHash, zip);
                            } else {
                                var changeset = forwardedCommentSacJson.changeset;
                                var cnum = changeset.changeNum;
                                this.proveComment(cnum, changeset.commentLeafHash, zip);
                                this.proveAttachments(cnum, changeset, zip);
                                this.proveSections(cnum, forwardedCommentSacJson.ssac, zip);
                                
                                var wsacForeverTmailAddresses = this.getWsacForeverTmailAddresses(forwardedCommentSacJson)
                                wsacForeverTmailAddresses.forEach(allWsacForeverTmailAddress.add, allWsacForeverTmailAddress);
                            }
                        } finally {
                            this.logEmitter.deindent();
                        }
                        this.logEmitter.log("Proved " + forwardedCommentSacManifestPath);
                    }
                }
            } finally {
                this.logEmitter.deindent();
            }
            this.logEmitter.log("proved forwards");
        }
    },

    proveChangeset:function (cnum, sacManifestJson, zip) {
        var changeset = sacManifestJson.changeset;
        evidenceUtils.ensureChangeTypeSupported(changeset.changeType);
        
        if(sacManifestJson.certified) {
            evidenceUtils.ensureCertOpTypeSupported(changeset.certOpType);
        }
        cpJsonUtils.ensureJsonHas("1020",changeset, "changeNum", "sections");
        if(cnum!=changeset.changeNum) {
            errorMessages.throwError("1016", "changeNum:" + changeset.changeNum);
        }
        try {
            this.logEmitter.indent();
            for(var section of  changeset.sections) {
                cpJsonUtils.ensureJsonHas("1017", section, "sectionNum","sectionChangeType")
                var sectionChangeType = section.sectionChangeType;
                var sectionNum = section.sectionNum;
                if(sectionChangeType=="added") {
                    this.currentSectionNums.add(sectionNum);
                } else if(sectionChangeType=="deleted") {
                    if(!this.currentSectionNums.has(sectionNum)) {
                        errorMessages.throwError("2005", "sectionNum:" + sectionNum);
                    }
                } else if(sectionChangeType=="updated"|| sectionChangeType=="unchanged") {
                    if(!this.currentSectionNums.has(sectionNum)) {
                        errorMessages.throwError("2004", "sectionNum:" + sectionNum);
                    }
                }

            }

            this.proveComment(cnum, changeset.commentLeafHash, zip);
            this.proveAttachments(cnum, changeset, zip);    
        } finally {
            this.logEmitter.deindent();            
        }
        this.logEmitter.log("Proved changeset for cnum:"+ cnum);                            
    },

    validateIncManifest: function(cnum, incManifestJson) {
        cpJsonUtils.ensureJsonHas("1020", incManifestJson, "sacHash","incEvidenceSchemaVersion", "hasDigitalSignature", "hasCBlockInfo");
        evidenceUtils.assertEquals("2009", incManifestJson.hasDigitalSignature, this.hasDigitalSignature);                
        evidenceUtils.assertEquals("2010", incManifestJson.hasCBlockInfo, this.hasCBlockInfo);
        evidenceUtils.assertEquals("2013", incManifestJson.certified, this.certified);
        evidenceUtils.assertEquals("2003", incManifestJson.ttnGlobal, this.ttnGlobal);
        evidenceUtils.assertEquals("2002", incManifestJson.ttn, this.ttn);
        evidenceUtils.ensureIncEvidenceSchemaVersionSupported(this.logEmitter, incManifestJson.incEvidenceSchemaVersion)
        if(evidenceUtils.schemaVersionGreaterThanEqualTo(incManifestJson.incEvidenceSchemaVersion, "1.1")) {
            cpJsonUtils.ensureJsonHas("1020", incManifestJson, "governor", "shardKey", "blockNum");
            evidenceUtils.assertEquals("2011", incManifestJson.governor, this.governor, "governor");
        }
    },

    proveCThinBlockInfo : async function(reject, cnum, incManifestJson, sacManifestJson, zip) {
        if(incManifestJson.hasCBlockInfo) {
            this.logEmitter.log("Proving CThinBlock for cnum:"+ cnum);                            
            try {
                this.logEmitter.indent();            
                cpJsonUtils.ensureJsonHas("1020", incManifestJson, "cThinBlockHashes","sacMerklePath", "ssacMerklePath", "cThinBlockMerkleRoot");
                var opsHashes = new Set()
                var cThinBlockMerkleRootHashes = new Set()
                for(var cThinBlockHash of incManifestJson.cThinBlockHashes) {
                    var cThinBlockFilePath = "cBlockInfo/" + cThinBlockHash + ".json";
                    evidenceUtils.ensureFileExists("1022", zip.entries(), cThinBlockFilePath);
                    var cThinBlockData = zip.entryDataSync(cThinBlockFilePath);
                    evidenceUtils.ensureHashMatches(this.logEmitter, "1022", cThinBlockData, cThinBlockHash, "CThinBlockHash for cnum:" + cnum);
                    var cThinBlockJson = cpJsonUtils.parseJson(cThinBlockData.toString('utf-8'));
                    cpJsonUtils.ensureJsonHas("1010",cThinBlockJson, "blockNum", "cThinBlockMerkleRootHash","governor","shardKey");
                    cThinBlockMerkleRootHashes.add(cThinBlockJson.cThinBlockMerkleRootHash);
                    if(cThinBlockJson.cThinBlockMerkleRootHash==incManifestJson.cThinBlockMerkleRoot) {
                        if(evidenceUtils.schemaVersionGreaterThanEqualTo(incManifestJson.incEvidenceSchemaVersion, "1.1")) {
                            evidenceUtils.assertEquals("2011", incManifestJson.shardKey, cThinBlockJson.shardKey, "shardKey");
                            evidenceUtils.assertEquals("2011", incManifestJson.blockNum, cThinBlockJson.blockNum, "blockNum");
                        }
                    }
                    for(var op of cThinBlockJson.operations) {
                        cpJsonUtils.ensureJsonHas("1010", op, "transactionNum", "ttnGlobalHash", "sacHash", "ssacHash", "changeNum");
                        opsHashes.add(op.ttnGlobalHash + ":" + op.changeNum + op.sacHash);
                        opsHashes.add(op.ttnGlobalHash + ":" + op.changeNum + op.ssacHash);
                    }
                    this.logEmitter.log("Proved " + cThinBlockFilePath);
                }
                if(!cThinBlockMerkleRootHashes.has(incManifestJson.cThinBlockMerkleRoot)) {
                    errorMessages.throwError("2010", "cThinBlockMerkleRoot in incremental evidence missing in included cthinBlocks");                
                }
                this.logEmitter.log("Proved cThinBlockMerkleRoot:" + incManifestJson.cThinBlockMerkleRoot  + " exists");                                                    
                var ttnGlobalHash = evidenceUtils.computeSha256Hash(incManifestJson.ttnGlobal);
                var sacOpHash = ttnGlobalHash + ":" + cnum + incManifestJson.sacHash;
                if(!opsHashes.has(sacOpHash)) {
                    errorMessages.throwError("2010", "sacHash in incremental evidence missing in included cthinBlocks operations");                
                }
                this.logEmitter.log("Proved sacHash:" + incManifestJson.sacHash  + " exists  in cthinBlock");                                                    
                var ssacOpHash = ttnGlobalHash + ":" + cnum + sacManifestJson.ssacHash;
                if(!opsHashes.has(ssacOpHash)) {
                    errorMessages.throwError("2010", "ssacHash in incremental evidence missing in included cthinBlocks operations");                
                }
                this.logEmitter.log("Proved ssacHash:" + sacManifestJson.ssacHash  + " exists in cthinBlock");                                                    

                this.logEmitter.log("Proving sacMerklePath");
                evidenceUtils.proveMerklePathToRoot(this.logEmitter, incManifestJson.cThinBlockMerkleRoot, incManifestJson.sacHash, incManifestJson.sacMerklePath);
                this.logEmitter.log("Proving ssacMerklePath");
                evidenceUtils.proveMerklePathToRoot(this.logEmitter, incManifestJson.cThinBlockMerkleRoot, sacManifestJson.ssacHash, incManifestJson.ssacMerklePath);

                if(this.proveConfig.performBlockchainProof) {
                    if ((typeof incManifestJson.blockchainAnchorsOn)!="undefined") {
                        for(var cThinBlockHash of incManifestJson.cThinBlockHashes) {
                            var cThinBlockFilePath = "cBlockInfo/" + cThinBlockHash + ".json";
                            var cThinBlockData = zip.entryDataSync(cThinBlockFilePath);
                            var cThinBlockJson = cpJsonUtils.parseJson(cThinBlockData.toString('utf-8'));
                            cpJsonUtils.ensureJsonHas("1020", incManifestJson.blockchainAnchorsOn[0], "type", "networks");
                            var cblockProvedKey = cThinBlockJson.shardKey + ":" + cThinBlockJson.blockNum;
                            var networkType = incManifestJson.blockchainAnchorsOn[0].networks[0];
                            if(!this.cblocksProved.has(cblockProvedKey)) {
                                //for now prove on first type and first network in the type
                                await blockchainUtils.proveOnBlockChain(this.logEmitter, this.proveConfig.networkNodeUrlsMap, networkType, cThinBlockJson.governor, cThinBlockJson.shardKey, cThinBlockJson.blockNum, cThinBlockHash, cThinBlockJson.cThinBlockMerkleRootHash);
                                this.cblocksProved.add(cblockProvedKey);
                            } else {
                                this.logEmitter.log("Already Proved shard=" + cThinBlockJson.shardKey + ",cblockNum=" + cThinBlockJson.blockNum  + " on blockchain networkType= " + networkType, "*");
                            }
                        }
                    } else {
                        errorMessages.throwError("3005", ", cnum=" + cnum);
                    }
                }

            } finally {
                this.logEmitter.deindent();
            }                
            this.logEmitter.log("Proved CThinBlock for cnum:"+ cnum);                            
        }
    },


    validateSacManifest: function(cnum, sacManifestJson, allWsacForeverTmailAddress) {
        cpJsonUtils.ensureJsonHas("1010",sacManifestJson, "ttnGlobal");
        cpJsonUtils.ensureJsonHas("1009",sacManifestJson, "subject");
        cpJsonUtils.ensureJsonHas("1013",sacManifestJson, "governor");
        cpJsonUtils.ensureJsonHas("1020",sacManifestJson, "ttn", "certified", "sacSchemaVersion"
                                                    , "changeset","ssac", "ssacHash", "wsac");
        evidenceUtils.assertEquals("2003", sacManifestJson.ttnGlobal, this.ttnGlobal);
        evidenceUtils.assertEquals("2002", sacManifestJson.ttn, this.ttn);                
        evidenceUtils.assertEquals("2011", sacManifestJson.governor, this.governor, "governor");
        evidenceUtils.ensureSacSchemaVersionSupported(this.logEmitter, sacManifestJson.sacSchemaVersion);
        evidenceUtils.ensureThreadTypeSupported(sacManifestJson.threadType);

        this.validateWriters(cnum, sacManifestJson, allWsacForeverTmailAddress);
    },

    validateWriters: function (cnum, sacManifestJson, allWsacForeverTmailAddress) {
        var changeset = sacManifestJson.changeset;
        cpJsonUtils.ensureJsonHas("1014", changeset, "creator");
        this.validateWriter("1014", changeset.creator);
        var creatorForeverTmailAddress = changeset.creator.foreverTmailAddress;
        
        if((typeof changeset.addedWriters)!="undefined") {
            for(var writer of changeset.addedWriters) {
                this.validateWriter("1019", writer);
                this.currentWriters.add(writer.foreverTmailAddress);
            }
        }
        var wsac = sacManifestJson.wsac;
        cpJsonUtils.ensureJsonHas("1012", wsac, "writers");
        var creatorExists = false;
        var wsacForeverTmailAddress = new Set();
        for(var writer of wsac.writers) {
            this.validateWriter("1012", writer);
            if(!creatorExists && writer.foreverTmailAddress==creatorForeverTmailAddress) {
                creatorExists = true;
            }
            if(!this.currentWriters.has(writer.foreverTmailAddress)) {
                errorMessages.throwError("2007", "unseen writer:" + writer.foreverTmailAddress);    
            }
            wsacForeverTmailAddress.add(writer.foreverTmailAddress);
        }
        //test for narrow of wsac
        for(var foreverTmailAddress of this.currentWriters) {
            if(!wsacForeverTmailAddress.has(foreverTmailAddress)) {
                errorMessages.throwError("2006", "missing writer:" + foreverTmailAddress);       
            }
        }
        if(!creatorExists) {
            errorMessages.throwError("1021", "missing:" + creatorForeverTmailAddress);
        }
        wsacForeverTmailAddress.forEach(allWsacForeverTmailAddress.add, allWsacForeverTmailAddress);
        this.logEmitter.log("Validated writers for cnum:"+ cnum);                            
    },

    getWsacForeverTmailAddresses: function(sacManifestJson){
        var wsacForeverTmailAddress = new Set();
        for(var writer of sacManifestJson.wsac.writers) {
            wsacForeverTmailAddress.add(writer.foreverTmailAddress);
        }
        return wsacForeverTmailAddress;
    },

    validateWriterImageMapping: function(incManifestJson, allWsacForeverTmailAddress) {
        if(incManifestJson.writerImageMappings){
            for(var writerImageMapping of incManifestJson.writerImageMappings) {
                if(!allWsacForeverTmailAddress.has(writerImageMapping.foreverTmailAddress)) {
                    errorMessages.throwError("2008", "missing writer in sac:" + writerImageMapping.foreverTmailAddress);
                }
            }
        }else{
            errorMessages.throwError("2008", "missing writer mapping");
        }
    },

    validateWriter : function(errorCode, writer) {
        cpJsonUtils.ensureJsonHas(errorCode, writer, "foreverTmailAddress", "contemporaneousTmailAddress", "role");
    },

    proveComment: function(cnum, commentLeafHash, zip) {
        this.logEmitter.log("Proving comment for cnum:"+ cnum);
        //changeset may optionally have comment
        //thats why do the explcit check instead of ensureJsonHas 
        if((typeof commentLeafHash)!="undefined") {
            evidenceUtils.ensureFileExists("1001", zip.entries(), "comments/" + commentLeafHash +".html");
            var commentData = zip.entryDataSync("comments/" + commentLeafHash +".html")
            evidenceUtils.ensureHashMatches(this.logEmitter, "1001", commentData, commentLeafHash, "CommentLeafHash for cnum"+ cnum);
        }
        this.logEmitter.log("Proved comment for cnum:"+ cnum);
    },

    proveAttachments: function(cnum, changeset, zip) {
        this.logEmitter.log("Proving attachments for cnum:"+ cnum);                            
        if((typeof changeset.attachments)!="undefined") {
            try {
                this.logEmitter.indent();            
                for(var attachment of changeset.attachments) {
                    cpJsonUtils.ensureJsonHas("1020", attachment, "attachmentLeafHash","attachmentNum", "title")
                    this.logEmitter.log("Proving cnum:" + cnum+ ". attachmentNum:" + attachment.attachmentNum + ",title:" + attachment.title);
                    var attachmentLeafHash = attachment.attachmentLeafHash;
                    var extension = path.extname(attachment.title);
                    var attachmentFilePath = "attachments/" + attachmentLeafHash + extension;
                    evidenceUtils.ensureFileExists("1003", zip.entries(), attachmentFilePath);
                    var attachmentData = zip.entryDataSync(attachmentFilePath);
                    evidenceUtils.ensureHashMatches(this.logEmitter, "1003", attachmentData, attachmentLeafHash, "AttachmentLeafHash for cnum:" + cnum+ ", attachmentNum:" + attachment.attachmentNum);
                }
            } finally {
                this.logEmitter.deindent();
            } 
        }   
        this.logEmitter.log("Proved attachments for cnum:"+ cnum);                            
    },

    proveSsac : function(cnum, ssacHash, zip) {
        this.logEmitter.log("Proving ssac for cnum:"+ cnum);                            
        try {
            this.logEmitter.indent();            
            evidenceUtils.ensureFileExists("1004", zip.entries(), Constants.default.ssacManifestJsonFileName)
            var ssacData = zip.entryDataSync(Constants.default.ssacManifestJsonFileName);
            evidenceUtils.ensureHashMatches(this.logEmitter, "1004", ssacData, ssacHash, "ssacHash for cnum:" + cnum);
            var ssac = cpJsonUtils.parseJson(ssacData.toString('utf-8'));
            this.proveSections(cnum, ssac, zip);
        } finally {
            this.logEmitter.deindent();
        }                
        this.logEmitter.log("Proved ssac for cnum:"+ cnum);                            
    },

    proveSections : function(cnum, ssac, zip) {
        this.logEmitter.log("Proving sections for cnum:"+ cnum);
        if((typeof ssac.sections)!="undefined") {
            try {
                this.logEmitter.indent();
                for(var section of ssac.sections) {
                    cpJsonUtils.ensureJsonHas("1017", section, "type", "title")
                    if(section.type == "file" && section.fileSectionState == "BOUND") {
                        cpJsonUtils.ensureJsonHas("1017", section, "sectionLeafHash")
                    }
                    if(section.sectionLeafHash!=undefined) {
                        var sectionLeafHash = section.sectionLeafHash;
                        if(!this.sectionsHashesSeen.has(sectionLeafHash)) {
                            var extension = ".txt"
                            if(section.type=="file") {
                                cpJsonUtils.ensureJsonHas("1017", section, "fileSectionOriginalName")
                                extension = path.extname(section.fileSectionOriginalName);
                            }

                            var sectionFilePath = "sections/" + sectionLeafHash + extension;
                            evidenceUtils.ensureFileExists("1002", zip.entries(), sectionFilePath);
                            var sectionData = zip.entryDataSync(sectionFilePath);
                            evidenceUtils.ensureHashMatches(this.logEmitter, "1002", sectionData, sectionLeafHash, "SectionLeafHash for cnum:" + cnum + ", title:" + section.title);
                            this.sectionsHashesSeen.add(sectionLeafHash);
                        }
                    }
                }
            } finally {
                this.logEmitter.deindent();
            }
        }
        this.logEmitter.log("Proved sections for cnum:"+ cnum);
    },

};
