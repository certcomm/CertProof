import React from 'react';
import { observer } from "mobx-react";
import moment from "moment";
import PerfectScrollbar from 'perfect-scrollbar';

const {shell} = window.require('electron');

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const StreamZip = window.require('node-stream-zip');
const remote = window.require('electron').remote;
var dialog = remote.dialog;
var FileSystem = window.require('fs');

import Modal from 'react-modal';
const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    }
};

import Thread from "./Thread/js/components/Thread";
import prover from "./../../prove/app/prove";

var ConfigImages = require("./../../config/images.js");
var Constants = require("./../../config/constants.js");

function LogEmitter() {
    this.indentTimes = 0;    
};

@observer
export default class Dashboard extends React.Component {
	constructor(props) {
        super(props);

        this.store = props.certProofStore;
        this.entries = [];
        this.logEmitter = {};

        this.state = {
            modalIsOpen: false,
            progress: 0,
            stateData: '',
            rawJson: null,
            type: "evidencemenifest",
            log: "",
            errLog: []
        }

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }
    
    openModal() {
        var rawJson = this.store.getRawJson(),
            evidenceJson = rawJson.evidenceJson;
        this.setState({modalIsOpen: true, rawJson: evidenceJson});

    }

    closeModal() {
        this.setState({modalIsOpen: false});
    }
    
    replacer(match, pIndent, pKey, pVal, pEnd) {
        var key = '<span class=json-key>';
        var val = '<span class=json-value>';
        var str = '<span class=json-string>';
        var r = pIndent || '';
        if (pKey) r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
        if (pVal) r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
        return r + (pEnd || '');
    }

    prettyPrint(obj) {
        var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
        return <pre dangerouslySetInnerHTML={{__html: JSON.stringify(obj, null, 3).replace(/&/g, '&amp;').replace(/\\"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(jsonLine, this.replacer)}}>
        </pre>
    }
    
    viewRawEvidene(json, type) {
        this.setState({rawJson: json, type: type});
        document.getElementsByClassName("pretty-json")[0].scrollIntoView();
    }

    configSectionModal(){
        var rawJson = this.store.getRawJson();
        var evidenceJson = rawJson.evidenceJson;
        var sacJson = rawJson.sac;
        var ssacJson = rawJson.ssac;
        var incEvidenceJson = rawJson.incEvidenceJson;
        return (
            <Modal
                isOpen={this.state.modalIsOpen}
                onRequestClose={this.closeModal}
                style={customStyles}
                ariaHideApp={false}
                contentLabel="Section Modal">
                <div className={"modal-file-container"}>
                    <div className="modal-header">
                        <div className="fl modal-section-title">Raw Evidence {(sacJson && sacJson[evidenceJson.highestCnum] ? " - "+sacJson[evidenceJson.highestCnum].subject : "" )}</div>
                        <div className="fr btn-close" onClick={this.closeModal} />
                        <div className="fr header-ttn">{evidenceJson.ttn}</div>
                    </div>
                    <div id="modal-content-container" className="modal-content">
                        <div className="panel-container">
                            <div className="xpanel-modal xpanel-modal-inspenia">
                                <div className="xpanel-lhs-container">
                                    <div className={"evidence-cnum-list "+(this.state.type == "evidencemenifest" ? "evidence-cnum-list-selected" : "")} onClick={this.viewRawEvidene.bind(this, evidenceJson, "evidencemenifest")}>
                                        <div className="info-label">Evidence Manifest</div>
                                        <div className="clear" />
                                    </div>

                                    <div className="evidence-cnum-list-normal">
                                        <div className="more">
                                            <div className="col-m"><span>Incremental Evidence</span></div>
                                        </div>
                                        <div className="clear" />
                                    </div>
                                    <div className="hide-evidence-list hidden1">
                                        {
                                            Object.keys(sacJson).reverse().map( (i) => {
                                                return <div className={"evidence-cnum-list "+(this.state.type == i ? "evidence-cnum-list-selected" : "")} key={"lhs-cset-"+i+Math.random()} onClick={this.viewRawEvidene.bind(this, sacJson[i], i)}>
                                                    <div className="info-label">#{i}</div>
                                                    <div className="clear" />
                                                </div>
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="ypanel-modal">
                                {
                                    this.state.type == "evidencemenifest" ? (
                                        <div className='pretty-json pretty-json-1'>
                                            {this.prettyPrint(this.state.rawJson)}
                                        </div>
                                    ) : <Tabs onSelect={tabIndex => this.implementScrollOnModal()}>
                                        <TabList>
                                            <Tab>SAC</Tab>
                                            <Tab>SSAC</Tab>
                                            <Tab>Incremental Manifest</Tab>
                                            <Tab>Hashes</Tab>
                                        </TabList>

                                        <TabPanel>
                                            <div className='pretty-json pretty-json-2'>
                                                {this.prettyPrint(sacJson[this.state.type])}
                                            </div>
                                        </TabPanel>
                                        <TabPanel>
                                            <div className='pretty-json pretty-json-3'>
                                                {this.prettyPrint(ssacJson[this.state.type])}
                                            </div>
                                        </TabPanel>
                                        <TabPanel>
                                            <div className='pretty-json pretty-json-4'>
                                                {this.prettyPrint(incEvidenceJson[this.state.type])}
                                            </div>
                                        </TabPanel>
                                        <TabPanel>
                                            <div className='pretty-json pretty-json-5'>
                                                {this.prettyPrint({
                                                    sacHash: incEvidenceJson[this.state.type].sacHash,
                                                    ssacHash: sacJson[this.state.type].ssacHash
                                                })}
                                            </div>
                                        </TabPanel>
                                    </Tabs>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
    
    componentWillMount(){
        this.store.resetRawJson();
    }

    componentDidMount() {
		var me = this;
        this.copyEvidence();

        LogEmitter.prototype = {
            log: function(msg) {
                if(me.state.log == "")
                    me.setState({log: this.getPaddedMsg(msg)})
                else
                    me.setState({log: me.state.log+"<br />"+ this.getPaddedMsg(msg)})
            },
            error: (err) => {
                this.state.errLog.push(err);
            },
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
        this.logEmitter = new LogEmitter();
    }

    componentDidUpdate(){
        this.implementScrollOnModal();
    }

    createPScroll(el){
        var element =  document.getElementsByClassName(el);
        if ( (element && element.length > 0) && (!$(element[0]).hasClass('ps')) ) {
            const ps = new PerfectScrollbar('.'+el);
            ps.update()
        }
    }

    implementScrollOnModal(){
        setTimeout(()=>{
            this.createPScroll("xpanel-modal", 1);
            this.createPScroll("pretty-json-1", 2);
            this.createPScroll("pretty-json-2", 3);
            this.createPScroll("pretty-json-3", 4);
            this.createPScroll("pretty-json-4", 5);
            this.createPScroll("pretty-json-5", 6);
        }, 50);
    }
    
    /*
    *  function is just to add zip file name into specific section to check in later process.
    * when user will click on any file or attachment to download, then we need to extract exact zip file and get file section or attachment from folders to download
    */
    updateSectionToAddFileName(changesetjson, currentchangeset, zipentryname, isForwarded){
        var header = (changesetjson && changesetjson.header) ? changesetjson.header : "";
        if(header != ""){
            var currentChangeSetSections = currentchangeset.sections;
            var headerSections = header.sections;
            
            if(currentChangeSetSections && Object.keys(currentChangeSetSections).length > 0)
                currentChangeSetSections.map( (cssection, i) => {
                    if(!cssection.zipEntryName){
                        cssection.zipEntryName = zipentryname;
                        cssection.sacSchemaVersion = currentchangeset.sacSchemaVersion;
                    }

                    if(headerSections)
                        headerSections.map( (hsection, i) => {
                            if(hsection.sectionNum == cssection.sectionNum){
                                if(!hsection.zipEntryName){
                                    hsection.zipEntryName = zipentryname;
                                    hsection.sacSchemaVersion = currentchangeset.sacSchemaVersion;
                                }
                            } else if(isForwarded === true){
                                if(!hsection.zipEntryName){
                                    hsection.zipEntryName = zipentryname;
                                    hsection.sacSchemaVersion = currentchangeset.sacSchemaVersion;
                                }
                            }
                        })
                })
            else
                if(headerSections && isForwarded === true)
                    headerSections.map( (hsection, i) => {
                        if(!hsection.zipEntryName){
                            hsection.zipEntryName = zipentryname;
                            hsection.sacSchemaVersion = currentchangeset.sacSchemaVersion;
                        }
                    })
        }
        return changesetjson;
    }

    updateAttachmentsToAddFileName(changesetjson, currentchangeset, zipentryname){
        var attachments = currentchangeset.attachments;

        if(attachments)
            attachments.map( (attachment, i) => {
                if(!attachment.zipEntryName){
                    attachment.zipEntryName = zipentryname;
                    attachment.sacSchemaVersion = currentchangeset.sacSchemaVersion;
                }
            })
        
        return changesetjson;
    }

    updateWriterImages(params){
        var changesetjson = params.changesetjson,
            currentchangeset = params.changeset,
            writerimagemappings = params.writerimagemappings;

        var header = (changesetjson && changesetjson.header) ? changesetjson.header : "";
        if(header && header.writers){
            header.writers.map( (hwriter, i) => {
                if(writerimagemappings[hwriter.foreverTmailAddress]){
                    hwriter.profileImage = writerimagemappings[hwriter.foreverTmailAddress];
                    hwriter.profileImageUri = "data:image/png;base64,"+writerimagemappings[hwriter.foreverTmailAddress];
                    hwriter.sacSchemaVersion = currentchangeset.sacSchemaVersion;
                }
            })
        }

        // if creator exist and address exist in 
        if(currentchangeset.creator)
            if(writerimagemappings[currentchangeset.creator.foreverTmailAddress]){
                currentchangeset.creator.profileImage = writerimagemappings[currentchangeset.creator.foreverTmailAddress];
                currentchangeset.creator.profileImageUri = "data:image/png;base64,"+writerimagemappings[currentchangeset.creator.foreverTmailAddress];
                currentchangeset.creator.sacSchemaVersion = currentchangeset.sacSchemaVersion;
            }
    
        // if added writer property exist and address exist in 
        if(currentchangeset.addedWriters && currentchangeset.addedWriters.length > 0)
            currentchangeset.addedWriters.map( (cwriter, i) => {
                if(writerimagemappings[cwriter.foreverTmailAddress]){
                    cwriter.profileImage = writerimagemappings[cwriter.foreverTmailAddress];
                    cwriter.profileImageUri = "data:image/png;base64,"+writerimagemappings[cwriter.foreverTmailAddress];
                    cwriter.sacSchemaVersion = currentchangeset.sacSchemaVersion;
                }
            })
        
        return changesetjson;
    }

    // read manifest.json files globally for root zip and forwaded comments too 
    readManifestJson(params){
        // get data only from `manifest.json` file
        /*
        * get data from files
        * manifest.json. comments (comment/html file)
        */
        var zip1 = params.zip1,
            filename = params.filename,
            cnum = params.cnum,
            changesetJson = params.changesetJson,
            zipEntryName = params.zipEntryName,
            isForwarded = params.forward;

        var evidenceDataJson = this.store.getEvidenceManifestData();
        
        try {
            // check if sac manifest json exist in zip
            var sacManifestBuffer = zip1.entryDataSync(Constants.default.smanifestJsonFileName),
                sacManifestString = sacManifestBuffer.toString('ascii'),
                sacManifestJson = JSON.parse(sacManifestString),
                cloneSacManifestJson = JSON.parse(JSON.stringify(sacManifestJson));

            if(!isForwarded) this.store.setRawJson({cnum: cnum, json: cloneSacManifestJson, type: "sacchangeset"});
        }catch(e){
            console.log("Missing ssacManifest.json, ", e);
        }

        var bufferData = null;
        try {
            bufferData = zip1.entryDataSync(filename);
        } catch(e) {
            if(!changesetJson.comments) changesetJson.comments = {}

            if(isForwarded){
                changesetJson.deletedComments.unshift(cnum);
                changesetJson.comments[cnum] = "#"+cnum+" Deleted";
                
                if(!isForwarded) this.store.setRawJson({cnum: cnum, json: "#"+cnum+" Deleted", type: "changeset"});
            }else{
                changesetJson.comments[cnum] = "Missing "+filename+" file for changeset "+cnum;
                
                if(!isForwarded) this.store.setRawJson({cnum: cnum, json: "Missing "+filename+" file for changeset "+cnum, type: "changeset"});
            }

            return changesetJson;
        }
        
        if(bufferData != null){
            var manifestJson = bufferData.toString('ascii'),
                jsonData = JSON.parse(manifestJson),
                cloneJsonData = JSON.parse(JSON.stringify(jsonData));
            
            if(!isForwarded) this.store.setRawJson({cnum: cnum, json: cloneJsonData, type: "changeset"});
            
            // if comment is deleted then we are not getting whole data so creating object with minimum data
            if(jsonData.metadataDeleted === true){
                jsonData.changeset = {};
                jsonData.changeset.metadataDeleted = jsonData.metadataDeleted;
                jsonData.changeset.commentLeafHash = jsonData.commentLeafHash;
                jsonData.changeset.changeNum = jsonData.changeNum;
            }

            var commentFileName = (jsonData.changeset && jsonData.changeset.commentLeafHash) ? "comments/"+jsonData.changeset.commentLeafHash+".html" : "";

            if(commentFileName != ""){
                // get buffered data from files
                try{
                    var bufferData = zip1.entryDataSync(commentFileName);
                    // convert buffered data into string (utf-8 for binary data)
                    jsonData.changeset.comment = bufferData.toString('utf-8');
                }
                catch(e){
                    console.log("Error >", e)
                }
            }
            
            //  create object with all changeset according to change num to display data for rendering
            if(!changesetJson.header && !jsonData.metadataDeleted){
                // get manifestfile json
                var eManiFestData = this.store.getEvidenceManifestData();
                // add sacschemaversion property
                eManiFestData.sacSchemaVersion = jsonData.sacSchemaVersion;
                // and reset the data with new property
                this.store.setEvidenceManifestData(eManiFestData);

                changesetJson.header = {
                    sacSchemaVersion: jsonData.sacSchemaVersion,
                    threadType: jsonData.threadType,
                    subject: jsonData.subject,
                    ttnGlobal: jsonData.ttnGlobal,
                    certified: jsonData.certified,
                    governor: jsonData.governor,
                    ttn: jsonData.ttn,
                    ttnURL: evidenceDataJson.ttnUrl,
                    writers: (jsonData.wsac && jsonData.wsac.writers ? jsonData.wsac.writers : []),
                    ssacHash: jsonData.ssacHash,
                    sections: (jsonData.ssacFull && jsonData.ssacFull.sections ? jsonData.ssacFull.sections : [])
                };

                changesetJson.header.writers.map( (writer, i) => {
                    writer.address = writer.foreverTmailAddress;
                    writer.name = writer.firstName+" "+writer.lastName;
                    writer.type = writer.role === true ? "role" : (writer.bindEmailAddress ? "email" : "");
                    writer.profileImageUri = (writer.role ? ConfigImages.default.roleImage : ConfigImages.default.noImage);
                });

                if(jsonData.templateParent) changesetJson.header.templateParent = jsonData.templateParent;

                if(changesetJson.comments == undefined){
                    changesetJson.comments = {};
                }
            }else{
                if(changesetJson.comments == undefined){
                    changesetJson.comments = {};
                }
            }
            
            if(jsonData.forwards){
                // if forwarded comment
                var forwards = [];
                jsonData.forwards.map((forward)=>{
                    var forwardedChangesetJson = {};
                    //  add all deleted changenum into array
                    forwardedChangesetJson.deletedComments = [];
                    
                    // var forwardedComments = forward.forwardedComments.map((frdCmnt)=>{
                    for (var i=forward.forwardedAtChangeNum; i > 0; i--) {
                        var fn = "forwards/"+forward.ttn+"_"+i+"_"+Constants.default.manifestJsonFileName;
                        
                        var params = {
                            zip1: zip1,
                            filename: fn,
                            cnum: i,
                            changesetJson: forwardedChangesetJson,
                            zipEntryName: zipEntryName,
                            forward: true
                        }
            
                        // run same logic as simple comments, so will create two objects one for comments and other for forwarded comments
                        forwardedChangesetJson = this.readManifestJson(params);
                    }
                    //});
                    forwards.unshift(forwardedChangesetJson);
                });
                // add forwarded comments into main object
                changesetJson.forwards = forwards;
            }
            // call function to add zip file name into specific attachment object
            changesetJson = this.updateAttachmentsToAddFileName(changesetJson, jsonData.changeset, zipEntryName);

            jsonData.changeset.sacSchemaVersion = jsonData.sacSchemaVersion;
            changesetJson.comments[jsonData.changeset.changeNum] = jsonData.changeset;

            // call function to add zip file name into specific section object
            changesetJson = this.updateSectionToAddFileName(changesetJson, jsonData.changeset, zipEntryName, isForwarded);

            // call function to update object with profile images
            try {
                // check if incremental manifest json exist in zip
                var incManifestBuffer = zip1.entryDataSync(Constants.default.incManifestJsonFileName),
                    incManifestString = incManifestBuffer.toString('ascii'),
                    incManifestJson = JSON.parse(incManifestString),
                    cloneIncManifestJson = JSON.parse(JSON.stringify(incManifestJson));

                if(!isForwarded) this.store.setRawJson({cnum: cnum, json: cloneIncManifestJson, type: "incevidencemanifest"});
                
                // check if writerImageMappings property exist in json
                if(incManifestJson.writerImageMappings){
                    var writersImages = {};
                    incManifestJson.writerImageMappings.map( (writer, i) => {
                        try{
                            var ProfileImageBufferData = zip1.entryDataSync("writerImages/"+writer.profileImageFileName);
                            // convert buffered data into string (utf-8 for binary data)
                            writersImages[writer.foreverTmailAddress] = ProfileImageBufferData.base64Slice();
                        }
                        catch(e){
                            console.log("Error while reading incremental manifest json >", e)
                        }
                    });
                    
                    if(Object.keys(writersImages).length > 0){
                        var writerImageParams = {
                            writerimagemappings: writersImages,
                            changesetjson: changesetJson,
                            changeset: jsonData.changeset
                        }
                    }
                    // 
                    changesetJson = this.updateWriterImages(writerImageParams);
                }
            } catch(e) {
                console.log("No "+Constants.default.incManifestJsonFileName+" file found");
            }

            // if templateParent property exist in changeset but not in created json then it should add in object
            if(jsonData.templateParent && (changesetJson.header && !changesetJson.header.templateParent) ) changesetJson.header.templateParent = jsonData.templateParent;

            if(changesetJson.header) changesetJson.header.firstSacSchemaVersion = jsonData.sacSchemaVersion;
        }
        return changesetJson;
    }

    getIncEvidenceFileName(evidenceJson, entries, ttn, cnum) {
        var filename;
        if(evidenceJson.hasDigitalSignature && evidenceJson.hasCBlockInfo) {
            filename = "L2_INC_EV_"+ttn+"_"+cnum+".zip"
        } else if(evidenceJson.hasDigitalSignature && evidenceJson.hasCBlockInfo==false) {
            filename = "L1_INC_EV_"+ttn+"_"+cnum+".zip"
        } else {
            filename = "BACKUP_INC_"+ttn+"_"+cnum+".zip";
        } 
        return filename;
    }

    // run loop on all zip files under evidenceManifest.json
    accessChildZip(json){
        var ttn = json.ttn,
            //highestcnum = 1,
            highestcnum = json.highestCnum,
            changesetJson = {};

        // get highest cnum from file and run a loop
        var t = (cnum) =>{
            // create file name dynamically
            var filename = this.getIncEvidenceFileName(json, this.entries, ttn, cnum)
            var zipEntry = this.entries[filename];

            // read incremental change num zip without extreact
            const zip1 = new StreamZip({
                file: Constants.default.extractedEvidenceFolder+zipEntry.name,
                storeEntries: true
            });

            zip1.on('entry', entry => {
                // console.log("sub filename", filename, entry.name, filename);
            });

            zip1.on('ready', () => {
                /*
                *
                * created common functoin to read all manifest.json file, either from incremental zip file's manifest.json or from forwarded comments manifest.json
                * zip1 object, changenum, or whole changesetjson object should send into function to update variable globally
                * 
                */
                
                var manifestJsonFile = Constants.default.manifestJsonFileName;
                var params = {
                    zip1: zip1,
                    filename: manifestJsonFile,
                    cnum: cnum,
                    changesetJson: changesetJson,
                    zipEntryName: zipEntry.name
                }

                changesetJson = this.readManifestJson(params);
                
                // we are in loop so below function should call only if all zip file's data has been extracted and added into single onject
                cnum--;
                if(cnum == 0){
                    this.store.setData(changesetJson);
                }else{
                    t(cnum)
                }
                zip1.close();
            });
        }
        t(highestcnum);
    }
    
    readEvidence(filename, filepath){
        // read zip evidence
        const zip = new StreamZip({
            file: filepath,
            storeEntries: true
        });

        // Handle errors
        zip.on('error', err => {
            console.log("Unable to zip ", err);
        });

        zip.on('ready', () => {
            //  add all data from parent zip into global variable
            this.entries = zip.entries();

            // create extracted folder if not already created
            if (!FileSystem.existsSync(Constants.default.extractedEvidenceFolder)){
                FileSystem.mkdirSync(Constants.default.extractedEvidenceFolder);
            }

            // extract parent zip into specific folder to read
            zip.extract(null, Constants.default.extractedEvidenceFolder, (err, count) => {
                if(err) console.log('Extract error '+err);
                
                // get data only from {`Constants.default.routeEvidenceJsonFileName`} file
                if(this.entries[Constants.default.errorFileName]){
                    var bufferErrorData = zip.entryDataSync(Constants.default.errorFileName);
                    var errData = bufferErrorData.toString('utf-8');
                    this.store.setError("Error "+errData);
                }else{
                    if(this.entries[Constants.default.routeEvidenceJsonFileName]){
                        var bufferData = zip.entryDataSync(Constants.default.routeEvidenceJsonFileName);
                        var data = bufferData.toString('ascii');
                        
                        //  convert buffer data to json
                        var jsonData = JSON.parse(data),
                            cloneJsonData = JSON.parse(JSON.stringify(jsonData));
                        
                        this.store.setRawJson({json: cloneJsonData, type: "evidencemanifest"});

                        this.store.setEvidenceManifestData(jsonData);

                        // access child zip
                        this.accessChildZip(jsonData);
                    }else{
                        this.store.setError("Missing "+Constants.default.routeEvidenceJsonFileName+" file.");
                    }
                }

                zip.close();
            });
        });
    }

    copyEvidence() {
        // create upload folder if not already created
        if (!FileSystem.existsSync(Constants.default.evidenceFolder)){
            FileSystem.mkdirSync(Constants.default.evidenceFolder);
        }

        // get file name and file apth from store
        var filename = this.store.getFileName(),
            filepath = this.store.getFilePath(),
            localFilepath = Constants.default.evidenceFolder+filename;
        
        if(filepath){
            // if file path exist it means file is already exist into folder (app - reopend)
            // copy file into our app folder directory for further functionality
            var source = FileSystem.createReadStream(filepath);
            var dest = FileSystem.createWriteStream(localFilepath);

            source.pipe(dest);
            source.on('end', () => {
                // call function to read evidence
                this.readEvidence(filename, filepath);
            });
            source.on('error', (err) => {
                console.log("Unable to copy file.", err);
                this.store.setError(" "+ err);
            });
        }else{
            // call function to read evidence
            this.readEvidence(filename, localFilepath);
        }
    }

    navigateToUploadEvidence(){
        this.store.setData({});
        this.store.setUploadedEvidenceFlag(false)
    }
    
    toggleSlider(el, e){
        var x = document.getElementsByClassName(el)[0];
        if (x.style.display === "none" || x.style.display == "") {
            if(el == "hide-evidence-list")
                document.getElementsByClassName("col-m")[0].className = "exp-m";
            else
                document.getElementsByClassName("col")[0].className = "exp fancy";
            
            x.style.display = "block";
        } else {
            if(el == "hide-evidence-list")
                document.getElementsByClassName("exp-m")[0].className = "col-m";
            else
                document.getElementsByClassName("exp")[0].className = "col fancy";
            
            x.style.display = "none";
        }

        this.implementScrollOnModal();
    }

    checkProveEvidence(isPassed){
        var verificationBtn = isPassed === false ? "verification-failed-container" : "verification-container";

        document.getElementsByClassName("progress-bar-container")[0].style.display = "none";
        document.getElementsByClassName(verificationBtn)[0].style.display = "block";
    }

    proveEvidence(e){
        document.getElementsByClassName("evidence-prove-form")[0].style.display = "none";
        document.getElementsByClassName("progress-bar-container")[0].style.display = "block";

        // both log should be blank on prove click each time
        this.state.log = "";
        this.state.errLog = [];

        var filepath = this.store.getFilePath();

        // read zip evidence
        const proveZip = new StreamZip({
            file: filepath,
            storeEntries: true
        });

        proveZip.on('ready', () => {
            var implementScrollForProve = function(){
                setTimeout(()=>{
                    var element6 =  document.getElementsByClassName('log-container-ps');
                    if (element6 && element6.length > 0) {
                        new PerfectScrollbar('.log-container-ps').update();
                    }
                    var element7 =  document.getElementsByClassName('modal-xpanel-lhs-container');
                    if (element7 && element7.length > 0) {
                        new PerfectScrollbar('.modal-xpanel-lhs-container').update();
                    }
                }, 50);
            }

            prover.proveExtractedEvidenceZip(this.logEmitter, Constants.default.extractedEvidenceFolder, proveZip)
            .then((response) => {
                console.error("Success!"+ response);
                proveZip.close();
                
                this.logEmitter.log("Success!"+ response);

                setTimeout(()=>{
                    if(this.state.errLog.length > 0){
                        this.checkProveEvidence(false);
                        this.setState({progress: this.state.progress+1});
                    }else{
                        this.checkProveEvidence(true);
                    }
                }, 500);

                // enable scroll after log loaded
                implementScrollForProve();
            })
            .catch((err) => {
                proveZip.close();

                console.error("Failed!", err);
                this.checkProveEvidence(false);

                // set error log
                this.setState({progress: this.state.progress+1});

                // enable scroll after log loaded
                implementScrollForProve();
            });
        });
    }

    navigateToLiveThread(link){
        shell.openExternal(link);
    }

	render() {
        var storeFileName = this.store.getFileName(),
            data = this.store.getData(),
            evidenceData = this.store.getEvidenceManifestData(),
            governor = evidenceData.governor,
            sacSchemaVersion = evidenceData.sacSchemaVersion,
            isCertified = (data.header) ? data.header.certified : false,
            ttnURL = evidenceData.ttnUrl ? evidenceData.ttnUrl : "NA",
            ttnGlobal = (data.header) ? data.header.ttnGlobal : "NA",
            err = this.store.getError();
        
        // set state
        this.state.stateData = data;

		return (
            <div className="panel-container">
                <div className="xpanel">
                    <div className="xpanel-header">
                        <div className="logo fl">
                            <img className="logo" src={ConfigImages.default.appIcon} alt="CertComm" title="CertComm" />
                        </div>
                        <div className="xpanel-header-back-btn">
                            <button className="btn btn-breadcrumb" onClick={this.navigateToUploadEvidence.bind(this)}>&#x276e; Back</button>
                        </div>
                    </div>
                    <div className="clear" />
                    <div className="xpanel-lhs-container modal-xpanel-lhs-container">
                        <div className="xpanel-info-container">
                            {
                                governor ? (
                                    <div className="xpanel-info-sub-container" title={"CertComm governor of this "+(isCertified ? "certified" : "")+" thread"}>
                                        <img className="dashboard-icon" src={ConfigImages.default.governorIcon} alt={"CertComm governor of this "+(isCertified ? "certified" : "")+" thread"} title={"CertComm governor of this "+(isCertified ? "certified" : "")+" thread"} />
                                        <span className="zip-file-name">{governor}</span>
                                        {
                                            evidenceData.governorLogoExtension ? (
                                                <img className="dashboard-icon margin-between" src={Constants.default.extractedEvidenceFolder+"governorLogo."+evidenceData.governorLogoExtension} alt={governor} title={governor} />
                                            ) : null
                                        }
                                    </div>
                                ) : null
                            }
                            <div className="xpanel-info-sub-container" title={"Current Evidence File: "+storeFileName}>
                                <span className="zip-file-name">{storeFileName}</span>
                            </div>

                            <div className="advanced-container">
                                <div className="more">
                                    <div className="col fancy" onClick={this.toggleSlider.bind(this, "hide-me")}><span>More Details</span></div>
                                </div>
                                <div className="clear" />
                                <div className="advanced-sub-container hide-me hidden">
                                    <div className="info-label">CertProof App Version</div>
                                    <div className="fl bold"> : </div>
                                    <div className="info-value">1.0.16</div>
                                    
                                    <div className="clear"></div>
                                    <div className="info-label">Schema Version</div>
                                    <div className="fl bold"> : </div>
                                    <div className="info-value">Inc-10</div>
                                    
                                    <div className="clear"></div>
                                    <div className="info-label">Live Thread</div>
                                    <div className="fl bold"> : </div>
                                    <div className="info-value">
                                        <a className="link" onClick={this.navigateToLiveThread.bind(this, ttnURL)}>{ttnURL}</a>
                                    </div>

                                    <div className="clear"></div>
                                    <div className="info-label">CertComm global TTN</div>
                                    <div className="fl bold"> : </div>
                                    <div className="info-value">{ttnGlobal}</div>

                                    <div className="clear"></div>
                                    <div className="info-label">Raw Evidence</div>
                                    <div className="fl bold"> : </div>
                                    <div className="info-value"><a className="link" onClick={this.openModal}>View</a></div>
                                </div>
                            </div>
                        </div>
                        <div className="evidence-prove-container">
                            <div className="evidence-prove-form">
                                <div>
                                    <div onClick={this.proveEvidence.bind(this)} className="fl prove-btn btn-success">Prove</div>
                                    <div onClick={this.proveEvidence.bind(this)} className="fl prove-gear-btn gear btn-success" />
                                    <div className="prove-info-sign" />
                                </div>
                            </div>
                            <div className="progress-bar-container hidden">
                                <div className="proving-btn">
                                    Proving
                                    <div className="fr fa-spin"></div>
                                </div>
                                {/* <div className="cancel-link" style={{marginTop: 10}}>Cancel</div> */}
                            </div>
                            <div className="verification-container hidden">
                                <div className="btn-primary proved-btn">
                                    Proved
                                    <div className="fr proved-icon"></div>
                                </div>
                            </div>
                            <div className="verification-failed-container hidden">
                                <div className="btn-primary prove-failed-btn">
                                    Proof Failed
                                    <div className="fr prove-failed-icon"></div>
                                </div>
                            </div>
                        </div>
                        <div className="clear" />
                        <div className={"log-container-ps "+(this.state.log == "" && this.state.errLog.length <= 0 ? "hidden" : "log-container")}>
                            <div className="log-text" dangerouslySetInnerHTML={{__html: this.state.log}} />
                            <div className="clear" />
                            {
                                this.state.errLog.length > 0 ? (
                                    <div className="err-text"><br />Error: 
                                        <div className='pretty-json err-text'>
                                            {this.prettyPrint(this.state.errLog)}
                                        </div>
                                    </div>
                                ) : null
                            }
                        </div>
                    </div>
                </div>
                <div className="ypanel">
                    {<Thread key={"thread-"+err} data={data} err={err} parentStore={this.store} />}
                </div>
                {this.configSectionModal()}
            </div>
        );
	}
}