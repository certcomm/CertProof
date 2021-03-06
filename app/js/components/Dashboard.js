import React from 'react';
import { observer } from "mobx-react";
import PerfectScrollbar from 'perfect-scrollbar';
import Clipboard from 'react-clipboard.js';

const {shell} = window.require('electron');

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const StreamZip = window.require('node-stream-zip');
var FileSystem = window.require('fs');

import Modal from 'react-modal';
const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    }
};

import Thread from "./Thread/js/components/Thread";
import prover from "./../../prove/app/prove";
import EvidenceUtils from "./../../prove/app/util/evidenceUtils.js";

var ConfigImages = require("./../../config/images.js");
var Constants = require("./../../config/constants.js");
var proverConstants = require("../../prove/app/config/constants.js");

function LogEmitter() {
    this.indentTimes = 0;
    this.terminated = false;
};

@observer
export default class Dashboard extends React.Component {
	constructor(props) {
        super(props);

        this.store = props.certProofStore;
        this.entries = [];
        this.logEmitter = {};
        this.evidenceType = '';
        this.networkJson = '';
        this.allNetworks = '';
        this.addedNode = '';
        this.addedNodeProtocol = 'https://';
        this.defaultNodeUrls = {};
        this.proveInfoHTML = null;
        this.isEthereum = false;
        this.isEthereumMainnet = false;

        this.state = {
            modalIsOpen: false,
            proveLogModalIsOpen: false,
            blockchainModalIsOpen: false,
            blockchainAnchorDisable: false,
            emptyBlockchainAnchorsOn: false,
            isProveRunning: false,
            stateData: '',
            rawJson: null,
            type: "evidencemenifest",
            network: '',
            networktype: '',
            log: "",
            errLog: []
        }

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);

        this.isMountedComponent = false;

        this.blockchainModalAction = this.blockchainModalAction.bind(this);
        this.proveModalAction = this.proveModalAction.bind(this);
    }

    setStates(states){
        if(this.isMountedComponent){
            this.setState(states);
        }
    }
    
    openModal() {
        var rawJson = this.store.getRawJson(),
            evidenceJson = rawJson.evidenceJson;
        this.setStates({modalIsOpen: true, rawJson: evidenceJson});
    }

    closeModal() {
        this.setStates({modalIsOpen: false});
    }
    
    blockchainModalAction(isVisible) {
        this.setStates({blockchainModalIsOpen: isVisible});
    }
    
    proveModalAction(isVisible) {
        this.setStates({proveLogModalIsOpen: isVisible});
        setTimeout(()=>{
            if(isVisible) this.implementScrollOnModal();
        }, 100);
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
        this.setStates({rawJson: json, type: type});
        document.getElementsByClassName("pretty-json")[0].children[0].scrollIntoView()
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
                shouldCloseOnOverlayClick={false}
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
                                    <div className="hide-evidence-list">
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

    configBlockchainNetworksModal(){
        return (
            <Modal
                isOpen={this.state.blockchainModalIsOpen}
                onRequestClose={this.blockchainModalAction.bind(this, false)}
                shouldCloseOnOverlayClick={false}
                style={customStyles}
                ariaHideApp={false}
                contentLabel="Section Modal">
                <div className={"modal-file-container"}>
                    <div className="modal-header">
                        <div className="fr btn-close" onClick={this.blockchainModalAction.bind(this, false)} />
                        <div className="fr help" title="When you click Prove, the current default Blockchain node URL(s) will be used by the Prover" />
                    </div>
                    {this.getNetworkHTMLDialog()}
                </div>
            </Modal>
        );
    }

    configProveLogModal(){
        var infoHTML = null,
            statelog = "", pureCopiedText = "",
            stateErrLog = [];
        if(this.state.proveLogModalIsOpen){
            statelog = this.state.log;
            stateErrLog = this.state.errLog;

            pureCopiedText = this.state.log+(this.state.errLog.length > 0 ? "\n\n"+JSON.stringify(this.state.errLog) : "");
            pureCopiedText = pureCopiedText.replace(/<br\s*[\/]?>/gi, "\n");
            pureCopiedText = pureCopiedText.replace(/(<([^>]+)>)/ig,"");

            if(this.proveInfoHTML != null && $(".prove-info-text:visible")[0]){
                var infoCls = $(".prove-info-text:visible")[0].className,
                    infoText = $(".prove-info-text:visible")[0].innerHTML;
                
                infoHTML = <div className={"fr "+infoCls} dangerouslySetInnerHTML={{__html: infoText}} />;
            }
        }

        return (
            <Modal
                isOpen={this.state.proveLogModalIsOpen}
                onRequestClose={this.proveModalAction.bind(this, false)}
                shouldCloseOnOverlayClick={false}
                style={customStyles}
                ariaHideApp={false}
                contentLabel="Proof Log">
                {
                    statelog != "" ? (
                        <div className={"modal-file-container"}>
                            <div className="modal-header">
                                <div className="fl modal-section-title evidence-prove-container">Proof Log {infoHTML != null ? " - " : ""}{infoHTML}</div>
                                <div className="fr btn-close" onClick={this.proveModalAction.bind(this, false)} />
                                <div className="copy-to-clipboard-container">
                                    <div id="clip-log-text-modal" className="hidden">Log Copied to Clipboard</div>
                                    <Clipboard
                                        data-clipboard-text={pureCopiedText}
                                        onSuccess={ () => {
                                            document.getElementById('clip-log-text-modal').className = 'copied-message-text';
                                            setTimeout(function(){
                                                document.getElementById('clip-log-text-modal').className = 'hidden';
                                            }, 3000);
                                        }}>
                                        <div title="Copy Log to Clipboard" className={"copy-to-clipboard "+(this.state.log == "" && this.state.errLog.length <= 0 ? "hidden" : "")} />
                                    </Clipboard>
                                </div>
                            </div>
                            <div className="clear" />
                            <div className="log-container-model log-container">
                                <div className="log-text" dangerouslySetInnerHTML={{__html: statelog}} />
                                <div className="clear" />
                                {
                                    stateErrLog.length > 0 ? (
                                        <div className="err-text"><br />Error: 
                                            <div className='pretty-json err-text'>
                                                {this.prettyPrint(this.state.errLog)}
                                            </div>
                                        </div>
                                    ) : null
                                }
                            </div>
                            <div className="modal-footer">
                                <button onClick={this.proveModalAction.bind(this, false)} data-dismiss="modal" className="btn btn-gray" type="button">Close</button>
                            </div>
                        </div>
                    ) : null
                }
            </Modal>
        );
    }

    mergeTwoNetworkJson(){
        // get network json from store
        var userNetworkJson = this.store.getNetworkJson(),
            appDefaultNetworkJson = this.store.getAppDefaultNetworkJson();
        
        /*
        * there are two networks (app default store at other place and user added networks store in user app data folder)
        *   now we need to fetch both networks and combine into single object for use in further within app
        * */
        if(appDefaultNetworkJson.length > 0){
            var clonedNetworkJson = JSON.parse(JSON.stringify(appDefaultNetworkJson));
            if(userNetworkJson && userNetworkJson.map){
                userNetworkJson.map((uglobalFileJson, upi) => {
                    if(userNetworkJson && userNetworkJson[upi] && userNetworkJson[upi].networks && userNetworkJson[upi].networks.map){
                        userNetworkJson[upi].networks.map((uglobalFileJsonNetworks, upni) => {
                            if(uglobalFileJsonNetworks && uglobalFileJsonNetworks.value && uglobalFileJsonNetworks.value.map){
                                // do not add if already added
                                uglobalFileJsonNetworks.value.map(function(ue, uei) {
                                    var cexistPIndex = clonedNetworkJson[upi].networks[upni].value.map(function(cue, cuei) {
                                        // if custom network is set default then appdefault should be set false
                                        if(ue.default && ue.custom){
                                            cue.default = false;
                                        }
                                        return cue.url;
                                    }).indexOf(ue.url);
                                    if(cexistPIndex < 0){
                                        clonedNetworkJson[upi].networks[upni].value.push(ue);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
        this.networkJson = clonedNetworkJson;
    }

    componentWillMount(){
        this.isMountedComponent = true;

        this.store.resetRawJson();

        this.mergeTwoNetworkJson();
    }
    
    componentWillUnmount() {
        this.isMountedComponent = false;
    }

    componentDidMount() {
		var me = this, i = 0;
        this.copyEvidence();

        LogEmitter.prototype = {
            log: function(msg, delimiter="-") {
                i++;
                if(me.state.log == ""){
                    me.setStates({log: this.getPaddedMsg(msg, delimiter)})
                }else{
                    // just to implement this to improve performance
                    if(i == 20){
                        i = 0;
                        me.setStates({log: me.state.log+"<br />"+ this.getPaddedMsg(msg, delimiter)})
                    }else{
                        me.state.log = me.state.log+"<br />"+ this.getPaddedMsg(msg, delimiter);
                    }
                }
        	    this.stopIfTerminated();
            },
            debug: function(msg, delimiter="-") {
        	    //do not log to screen for now
        	    this.stopIfTerminated();
            },
            error: (err) => {
                if(this.state.errLog.length <= 0){
                    this.state.errLog.push(err);
                }else{
                    if (this.state.errLog.filter(e => e.message === err).length < 0) {
                        this.state.errLog.push(err);
                    }
                }
                // to reset view if user terminated prove, because sometime `prover.proveExtractedEvidenceZip` does not return anything
                if(this.logEmitter.terminated === true){
                    var cloneErrLog = JSON.parse(JSON.stringify(this.state.errLog));
                    this.state.errLog = "";
                    this.setState({errLog: cloneErrLog});
                }
            },
            getPaddedMsg : function(msg, delimiter="-") {
                return delimiter.repeat(this.indentTimes*3) + msg;
            },
            indent: function() {
                this.indentTimes++;
            },
            deindent: function() {
                this.indentTimes--;
            },
            triggerTerminate() {
                this.terminated = true;
            },
            resetTermination() {
                this.terminated = false;
            },
            stopIfTerminated() {
                if(this.terminated == true) {
                    throw {name:"0000",message:"Terminated by user action"}
                }
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
            this.createPScroll("log-container-model", 7);
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

    replaceImgSrc(imgZip1, text, inlineImages) {
		// need a wrapper
		text = "<div>"+text+"</div>";
		
		var t = $.parseHTML(text);
		$(t).each(function() {
			$(this).find("img").each(function() {
                var imgSrc = $(this).attr("src");
                if(imgSrc.indexOf("dummyuser$dummyorg.com") !== -1){
                    var explodeImgSrc = imgSrc.split("/");
                    if(explodeImgSrc.length > 0){
                        var ImgHash = explodeImgSrc[explodeImgSrc.length-1];
                        
                        inlineImages.map( (inlImg, i) => {
                            if(inlImg.inlineImageLeafHash == ImgHash){
                                var extension = EvidenceUtils.getInlineImageExtensionByMimeType(inlImg.mimeType);
                                if(extension!="") {
                                    extension = "." + extension;
                                }
                                var ReplacedimgSrc = "inlineImages/"+ImgHash+extension;
                                try {
                                    ReplacedimgSrc = imgZip1.entryDataSync(ReplacedimgSrc).base64Slice();
                                    $(this).attr("src", "data:application/octet-stream;charset=utf-16le;base64," + ReplacedimgSrc);
                                } catch(e) {
                                    console.log("Error", e);
                                }
                        }
                        })
                    }
                }
			});
		});
		return t[0].innerHTML.toString();
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
            var manifestJson = bufferData.toString('ascii'),
                jsonData = JSON.parse(manifestJson);
        } catch(e) {
            if(!changesetJson.comments) changesetJson.comments = {}

            if(isForwarded){
                changesetJson.deletedComments.unshift(cnum);
                changesetJson.comments[cnum] = "#"+cnum+" Deleted";
                
                if(!isForwarded) this.store.setRawJson({cnum: cnum, json: "#"+cnum+" Deleted", type: "changeset"});
            }else{
                changesetJson.comments[cnum] = "Missing or corrupted "+filename+" file for changeset "+cnum;
                
                if(!isForwarded) this.store.setRawJson({cnum: cnum, json: "Missing "+filename+" file for changeset "+cnum, type: "changeset"});
            }

            return changesetJson;
        }
        
        if(bufferData != null){
            var cloneJsonData = JSON.parse(JSON.stringify(jsonData));
            
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
                    var chstcmt = bufferData.toString('utf-8');
                    if(jsonData.changeset.inlineImages){
                        chstcmt = this.replaceImgSrc(zip1, chstcmt, jsonData.changeset.inlineImages);
                    }

                    jsonData.changeset.comment = chstcmt;
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

                var domainName = "";
                if(jsonData.changeset && jsonData.changeset.creator){
                    var creatorAddress = jsonData.changeset.creator.contemporaneousTmailAddress;
                    if(creatorAddress && creatorAddress.indexOf('$') >= 0){
                        domainName = creatorAddress.substring(creatorAddress.lastIndexOf('$')+1);
                    }
                }

                changesetJson.header = {
                    sacSchemaVersion: jsonData.sacSchemaVersion,
                    threadType: jsonData.threadType,
                    subject: jsonData.subject,
                    ttnGlobal: jsonData.ttnGlobal,
                    certified: jsonData.certified,
                    visibleToOrg: jsonData.visibleToOrg,
                    orgRestricted: jsonData.orgRestricted,
                    domainName: domainName,
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

    getIncEvidenceFileName(evidenceJson, ttn, cnum) {
        var filename;
        if(evidenceJson.hasCBlockInfo) {
            filename = "L1_INC_EV_"+ttn+"_"+cnum+".zip"
            this.evidenceType = 'Certified L1';
        } else if(evidenceJson.hasDigitalSignature || evidenceJson.certified) {
            filename = "L2_INC_EV_"+ttn+"_"+cnum+".zip"
            this.evidenceType = 'Certified L2';
            
            this.state.blockchainAnchorDisable = true;
        } else {
            filename = "BACKUP_INC_"+ttn+"_"+cnum+".zip";
            this.evidenceType = 'Backup';
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
            var filename = this.getIncEvidenceFileName(json, ttn, cnum)
            var zipEntry = this.entries[filename];

            if(!zipEntry){
                if(!changesetJson.comments) changesetJson.comments = {}
                changesetJson.comments[cnum] = "Missing or corrupted "+filename+" file for changeset "+cnum;
                this.store.setRawJson({cnum: cnum, json: "Missing or corrupted "+filename+" file for changeset "+cnum, type: "changeset"});
                
                // we are in loop so below function should call only if all zip file's data has been extracted and added into single onject
                cnum--;
                if(cnum == 0){
                    this.store.setData(changesetJson);
                }else{
                    t(cnum)
                }
                return false;
            }

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
                        try{
                            var jsonData = JSON.parse(data);
                        }catch(e){
                            this.store.setError("We're Sorry: The uploaded evidence file could not be displayed. This may be because the file was tampered with or has been corrupted.");
                            return false;
                        }
                        
                        var cloneJsonData = JSON.parse(JSON.stringify(jsonData));
                        
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
            localFilepath = Constants.default.evidenceFolder+filename,
            isFileExist = FileSystem.existsSync(filepath);
        
        if(isFileExist){
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
                    this.store.setError(" "+ err);
                });
            }else{
                // call function to read evidence
                this.readEvidence(filename, localFilepath);
            }
        }else{
            this.store.setError("File not found. Please upload file again.");
        }
    }

    navigateToUploadEvidence(){
        var isErr = this.store.getError();

        this.store.setData({});
        this.store.setUploadedEvidenceFlag(false)

        if(isErr != ""){
            this.store.setUploadEvidenceDetails(null, null);
            this.store.setError('')
        }
    }
    
    toggleSlider(el, e){
        var x = document.getElementsByClassName(el)[0];
        if (x.style.display === "none" || x.style.display == "") {
            document.getElementsByClassName("col")[0].className = "exp fancy";
            x.style.display = "block";
            $(".log-container").addClass("log-container-hgt");
        } else {
            document.getElementsByClassName("exp")[0].className = "col fancy";
            x.style.display = "none";
            $(".log-container").removeClass("log-container-hgt");
        }

        this.implementScrollOnModal();
    }

    checkProveEvidence(isPassed){
        if(document.getElementsByClassName("progress-bar-container")[0]){
            document.getElementsByClassName("evidence-prove-form")[0].style.display = "none";
            document.getElementsByClassName("progress-bar-container")[0].style.display = "none";
            if(isPassed === false){
                document.getElementsByClassName("verification-container")[0].style.display = "none";
                document.getElementsByClassName("verification-failed-container")[0].style.display = "block";
            }else{
                document.getElementsByClassName("verification-container")[0].style.display = "block";
                document.getElementsByClassName("verification-failed-container")[0].style.display = "none";
            }
        }
        document.getElementsByClassName("copy-to-clipboard-container")[0].classList.remove("hide-ccc");

        this.setStates({isProveRunning: false});
    }

    proveEvidence(e){
        // reset termination
        this.logEmitter.resetTermination();

        // to disable back button
        this.setStates({isProveRunning: true});
        document.getElementsByClassName("evidence-prove-form")[0].style.display = "none";
        document.getElementsByClassName("progress-bar-container")[0].style.display = "block";
        document.getElementsByClassName("log-container-ps")[0].classList.remove("hidden");

        // both log should be blank on prove click each time
        this.state.log = "";
        this.state.errLog = [];

        var filepath = this.store.getFilePath();

        // read zip evidence
        const proveZip = new StreamZip({
            file: filepath,
            storeEntries: true
        });

        var implementScrollForProve = function(){
            setTimeout(()=>{
                var element6 =  document.getElementsByClassName('log-container-ps');
                if (element6 && element6.length > 0) {
                    new PerfectScrollbar('.log-container-ps').update();
                }

                if($(".advanced-container .more .exp").length > 0) $(".log-container").addClass("log-container-hgt");
            }, 50);
        }

        var isDis = this.state.blockchainAnchorDisable;
        if(!this.isEthereum){
            isDis = true;
        }
        proveZip.on('ready', () => {
            var proveConfig = {extractedEvidenceFolder:Constants.default.extractedEvidenceFolder,
                               performBlockchainProof:!isDis,
                               networkNodeUrlsMap:this.defaultNodeUrls};
            
            implementScrollForProve();
            prover.proveExtractedEvidenceZip(this.logEmitter, proveConfig, proveZip)
            .then((response) => {
                proveZip.close();
                this.logEmitter.log("Success!"+ response);
                setTimeout(()=>{
                    if(this.state.errLog.length > 0) this.checkProveEvidence(false);
                    else this.checkProveEvidence(true);
                }, 500);
                implementScrollForProve();  // enable scroll after log loaded
            })
            .catch((err) => {
                if(this.state.errLog.length <= 0) this.state.errLog.push(err);
                proveZip.close();
                this.checkProveEvidence(false);
                implementScrollForProve();  // enable scroll after log loaded
            });
        });
    }

    reproveEvidence(e){
        this.setState({log: "", errLog: []});

        document.getElementsByClassName("evidence-prove-form")[0].style.display = "inline-block";
        document.getElementsByClassName("verification-container")[0].style.display = "none";
        document.getElementsByClassName("progress-bar-container")[0].style.display = "none";
        document.getElementsByClassName("verification-failed-container")[0].style.display = "none";
        document.getElementsByClassName("log-container-ps")[0].classList.add("hidden");
    }

    navigateToLiveThread(link){
        shell.openExternal(link);
    }
    
    addNode(nname, ntype, e){
        if(this.addedNode.trim() == ""){
            swal("Field should not be empty.");
            $(e.target).parents('.node-row-add-container').find('input').focus();
            return false;
        }

        // add protocol in url
        var blockchainUrl = this.addedNodeProtocol+this.addedNode;
        var regexp = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
        if(!regexp.test(blockchainUrl)){
            swal("Invalid URL. Please type correct URL.");
            $(e.target).parents('.node-row-add-container').find('input').focus();
            return false;
        }

        // check if url already exist in same network
        var shouldAdd = true;
        this.allNetworks.map((localStoreJson1, lsj1) => {
            if(localStoreJson1.type == ntype){
                this.allNetworks[lsj1].networks.map((localStoreJsonNetwork1) => {
                    // if network is same as selected
                    if(localStoreJsonNetwork1.name == nname){
                        // get appdefault url index
                        var getCAppDefaultIndex1 = localStoreJsonNetwork1.value.map(function(e) { return e.url; }).indexOf(blockchainUrl);
                        if(getCAppDefaultIndex1 >= 0){
                            shouldAdd = false;
                        }
                    }
                });
            }
        })

        // should stop if return false
        if(shouldAdd === false){
            swal("Duplicate record.");
            $(e.target).parents('.node-row-add-container').find('input').focus();
            return false;
        }
        
        var fileName = Constants.default.networkFileFolder+Constants.default.networkJsonFileName;
        
        //  add new node object under custom value array
        var obj = {
            url: blockchainUrl,
            custom: true,
            default: true
        }

        //  check if networkjson exist
        if(this.networkJson && this.networkJson.length > 0){
            var clonedNetworkJson = JSON.parse(JSON.stringify(this.networkJson));
            this.networkJson.map((globalFileJson, pi) => {
                if(globalFileJson.type == ntype){
                    this.networkJson[pi].networks.map((globalFileJsonNetworks, pni) => {
                        globalFileJsonNetworks.value.map(function(ad, adi) {
                            // should delete all appdefault urls object
                            if(ad.appDefault){
                                clonedNetworkJson[pi].networks[pni].value.splice(adi, 1);
                            }else{
                                if(clonedNetworkJson[pi].networks[pni].value[adi]) clonedNetworkJson[pi].networks[pni].value[adi].default = false;
                            }
                        });
                        clonedNetworkJson[pi].networks[pni].value.map(function(cad, cadi) {
                            cad.default = false;
                        });
                        if(globalFileJsonNetworks.name == nname){
                            // do not add if already added
                            var existPIndex = globalFileJsonNetworks.value.map(function(e, ei) {
                                if(e.url != obj.url ){
                                    e.default = false;
                                }
                                return e.url;
                            }).indexOf(obj.url);
                            if(existPIndex < 0){
                                globalFileJsonNetworks.value.push(obj);
                                clonedNetworkJson[pi].networks[pni].value.push(obj);
                            }else{
                                if(globalFileJsonNetworks.value[pni]) globalFileJsonNetworks.value[pni].default = false;
                            }
                        }
                    });
                }
            });
            this.allNetworks.map((localStoreJson, ci) => {
                if(localStoreJson.type == ntype){
                    this.allNetworks[ci].networks.map((localStoreJsonNetworks, cni) => {
                        if(localStoreJsonNetworks.name == nname){
                            var existCIndex = localStoreJsonNetworks.value.map(function(e) {
                                if(e.url != obj.url ){
                                    e.default = false;
                                }
                                return e.url;
                            }).indexOf(obj.url);
                            if(existCIndex < 0){
                                localStoreJsonNetworks.value.push(obj);
                            }else{
                                if(localStoreJsonNetworks.value[cni]){
                                    if(localStoreJsonNetworks.value[cni].url != obj.url)
                                        localStoreJsonNetworks.value[cni].default = false;
                                }
                            }
                        }
                    });
                }
            })
            
            FileSystem.writeFile(fileName, JSON.stringify(clonedNetworkJson), {spaces:4}, (err) => {
                if(err){
                    console.log("Err while writing data into "+Constants.default.networkJsonFileName, err);
                }else{
                    this.store.setNetworkJson(clonedNetworkJson);
                    this.setStates({clonedNetworkJson: clonedNetworkJson});
                }
            });
        }

        this.cancelCustomNode(e);
    }

    removeNode(node, nname, ntype, e){
        var url = node.url;

        var t = () => {
            var fileName = Constants.default.networkFileFolder+Constants.default.networkJsonFileName;
            var clonedNetworkJson = JSON.parse(JSON.stringify(this.networkJson));

            this.networkJson.map((globalFileJson, gfj1) => {
                if(globalFileJson.type == ntype){
                    this.networkJson[gfj1].networks.map((globalFileJsonNetwork, gfj2) => {
                        globalFileJsonNetwork.value.map(function(ad, adi) {
                            // should delete all appdefault urls object
                            if(ad.appDefault){
                                clonedNetworkJson[gfj1].networks[gfj2].value.splice(adi, 1);
                            }
                        });
                        // delete added custom node
                        if(globalFileJsonNetwork.name == nname){
                            var existPIndex = globalFileJsonNetwork.value.map(function(e, gi) { return e.url; }).indexOf(url);
                            if(existPIndex >= 0){
                                if(globalFileJsonNetwork.value[existPIndex].default){
                                    var getPAppDefaultIndex = globalFileJsonNetwork.value.map(function(e) { return e.appDefault; }).indexOf(true);
                                    if(getPAppDefaultIndex >= 0){
                                        globalFileJsonNetwork.value[getPAppDefaultIndex].default = true;
                                    }
                                }
                                globalFileJsonNetwork.value.splice(existPIndex, 1);
                                clonedNetworkJson[gfj1].networks[gfj2].value.splice(clonedNetworkJson[gfj1].networks[gfj2].value.map(function(e, gi) { return e.url; }).indexOf(url), 1);
                            }
                        }
                    });
                }
            });
    
            this.allNetworks.map((localStoreJson, lsji) => {
                if(localStoreJson.type == ntype){
                    this.allNetworks[lsji].networks.map((localStoreJsonNetwork) => {
                        // delete added custom node
                        if(localStoreJsonNetwork.name == nname){
                            var existCIndex = localStoreJsonNetwork.value.map(function(e) { return e.url; }).indexOf(url);
                            if(existCIndex >= 0){
                                if(localStoreJsonNetwork.value[existCIndex].default){
                                    var getCAppDefaultIndex = localStoreJsonNetwork.value.map(function(e) { return e.appDefault; }).indexOf(true);
                                    if(getCAppDefaultIndex >= 0){
                                        localStoreJsonNetwork.value[getCAppDefaultIndex].default = true;
                                    }
                                }
                                localStoreJsonNetwork.value.splice(existCIndex, 1);
                            }
                        }
                    });
                }
            });
            
            FileSystem.writeFile(fileName, JSON.stringify(clonedNetworkJson), {spaces:4}, (err) => {
                if(err){
                    console.log("Err while writing data into "+Constants.default.networkJsonFileName, err);
                }else{
                    this.store.setNetworkJson(clonedNetworkJson);
                    this.setStates({clonedNetworkJson: clonedNetworkJson});
                }
            });
        }

        // if default node selected
        if(node.default){
            // run loop to get app default url
            this.allNetworks.map((localStoreJson1, lsj1) => {
                if(localStoreJson1.type == ntype){
                    this.allNetworks[lsj1].networks.map((localStoreJsonNetwork1) => {
                        // if network is same as selected
                        if(localStoreJsonNetwork1.name == nname){
                            // get appdefault url index
                            var getCAppDefaultIndex1 = localStoreJsonNetwork1.value.map(function(e) { return e.appDefault; }).indexOf(true);
                            if(getCAppDefaultIndex1 >= 0){
                                var warnMgs = "You are removing a node which is the current default node for Ethereum_Mainnet. The new default will be the application default "+localStoreJsonNetwork1.value[getCAppDefaultIndex1].url;
                                swal({
                                    title: '',
                                    text: warnMgs,
                                    showCancelButton: true,
                                    confirmButtonColor: "#DD6B55",
                                    confirmButtonText: "Ok",
                                }, function () {
                                    t();
                                });
                            }
                        }
                    });
                }
            })
        }else{
            t();
        }
    }

    setDefaultNode(url, nname, ntype, e){
        var fileName = Constants.default.networkFileFolder+Constants.default.networkJsonFileName;

        var clonedNetworkJson = JSON.parse(JSON.stringify(this.networkJson));
        this.networkJson.map((globalFileJson, gi) => {
            if(globalFileJson.type == ntype){
                this.networkJson[gi].networks.map((globalFileJsonNetwork, ggi) => {
                    globalFileJsonNetwork.value.map(function(ad, adi) {
                        // should delete all appdefault urls object
                        if(ad.appDefault){
                            clonedNetworkJson[gi].networks[ggi].value.splice(adi, 1);
                        }else{
                            clonedNetworkJson[gi].networks[ggi].value.map(function(e, gggi) {
                                if(e.url == url){
                                    clonedNetworkJson[gi].networks[ggi].value[gggi].default = true;
                                }else{
                                    clonedNetworkJson[gi].networks[ggi].value[gggi].default = false;
                                }
                            });
                        }
                    });
                    // change default set node
                    if(globalFileJsonNetwork.name == nname){
                        var existPIndex = globalFileJsonNetwork.value.map(function(e, i) {
                            if(e.url != url){
                                if(globalFileJsonNetwork.value[i]) globalFileJsonNetwork.value[i].default = false;
                            }
                            return e.url;
                        }).indexOf(url);
                        if(existPIndex >= 0){
                            if(globalFileJsonNetwork.value[existPIndex]) globalFileJsonNetwork.value[existPIndex].default = true;
                        }
                    }
                });
            }
        });

        this.allNetworks.map((localStoreJson, li) => {
            if(localStoreJson.type == ntype){
                this.allNetworks[li].networks.map((localStoreJsonNetwork) => {
                    // change default set node
                    if(localStoreJsonNetwork.name == nname){
                        var existCIndex = localStoreJsonNetwork.value.map(function(e, i) {
                            if(e.url != url){
                                if(localStoreJsonNetwork.value[i]) localStoreJsonNetwork.value[i].default = false;
                            }
                            return e.url;
                        }).indexOf(url);
                        if(existCIndex >= 0){
                            if(localStoreJsonNetwork.value[existCIndex]) localStoreJsonNetwork.value[existCIndex].default = true;
                        }
                    }
                });
            }
        });
    
        FileSystem.writeFile(fileName, JSON.stringify(clonedNetworkJson), {spaces:4}, (err) => {
            if(err){
                console.log("Err while writing data into "+Constants.default.networkJsonFileName, err);
            }else{
                this.store.setNetworkJson(clonedNetworkJson);
                this.setStates({clonedNetworkJson: clonedNetworkJson});
            }
        });
    }

    addCustomNode(e){
        $(e.target).parents('.node-row').find('.node-row-add-container').show()
        $(e.target).parents('.add-custom-node-btn').hide();
        $(e.target).parents('.node-row').find('.node-row-add-container input').focus();
    }

    cancelCustomNode(e){
        this.addedNode = "";
        this.addedNodeProtocol = "https://";

        $(e.target).parents('.node-row').find('.add-custom-node-btn').show();
        $(e.target).parents('.node-row-add-container').hide();
        $(e.target).parents('.node-row-add-container').find('input').val('');
    }
    
    viewNetworkNode(network, networktype) {
        this.setStates({network: network, networktype: networktype});
        document.getElementsByClassName("network-nodes")[0].children[0].scrollIntoView()
    }

    blockchainAnchorDisableFunc(isEnable, btnDisabled, e){
        e.preventDefault();
        if(!btnDisabled){
            this.setStates({blockchainAnchorDisable: isEnable});
            
            this.reproveEvidence();
        }
    }

    getNetworkHTMLDialog(){
        var rawJson = this.store.getRawJson(),
            sacJson = rawJson.sac,
            evidenceData = this.store.getEvidenceManifestData(),
            blockchainAnchorsOn = evidenceData.blockchainAnchorsOn;
        
        if(this.networkJson != "" && this.evidenceType == 'Certified L1'){
            if(!blockchainAnchorsOn && !this.state.emptyBlockchainAnchorsOn){
                setTimeout(()=>{
                    this.setStates({emptyBlockchainAnchorsOn: true});
                }, 100);
                return false;
            }else if(this.state.emptyBlockchainAnchorsOn){
                return false;
            }
            
            var allNetworks = [];
            blockchainAnchorsOn.map(networkType => {
                this.networkJson.map((e) => {
                    if(e.type == networkType.type){
                        var ntwrkObj = {type: networkType.type};
                        e.networks.map(en => {
                            networkType.networks.map(networkName => {
                                if(en.name == networkName){
                                    if(!ntwrkObj.networks){
                                        ntwrkObj.networks = [];
                                    }
                                    ntwrkObj.networks.push(en);
                                }
                            });
                        });
                        allNetworks.push(ntwrkObj);
                    }
                });
            });
            this.allNetworks = allNetworks;

            if(this.state && this.state.network && this.state.network != ""){
                this.defaultNodeUrls[this.state.network.name] = [];
            }
            
            return <div id="modal-blockchain-content-container" className="modal-content">
                <div className="panel-container">
                    <div className="xpanel-modal xpanel-modal-inspenia">
                        <div className="xpanel-lhs-container">
                            {
                                allNetworks.map((ntwrkType, i) => {
                                    return <div key={"lhs-cset-"+i+Math.random()}>
                                        <div className="evidence-cnum-list-normal">
                                            <div className="info-label">
                                                <img className="ethereum-logo" src={ConfigImages.default.ethereumLogo} alt={ntwrkType.type} title={ntwrkType.type} />
                                                {ntwrkType.type}
                                            </div>
                                            <div className="clear" />
                                        </div>
                                        <div className="hide-evidence-list">
                                            {
                                                ntwrkType.networks && ntwrkType.networks.map( (ntwrk, i) => {
                                                    var selectionCls = "";
                                                    if( (i == 0 && this.state.network == '') || (JSON.stringify(this.state.network) != JSON.stringify(ntwrk) ) ){
                                                        this.state.network = ntwrk;
                                                        this.state.networkType = ntwrkType.type;
                                                        selectionCls = "evidence-cnum-list-selected";
                                                    }else if(this.state.network.name == ntwrk.name){
                                                        selectionCls = "evidence-cnum-list-selected";
                                                    }

                                                    return <div className={"evidence-cnum-list "+selectionCls} key={"lhs-cset-"+i+Math.random()} onClick={this.viewNetworkNode.bind(this, ntwrk, ntwrkType.type)}>
                                                        <div className="info-label">{ntwrk.name}</div>
                                                        <div className="clear" />
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <div className="ypanel-modal">
                        <div className="evidence-network-container">
                            <div className="node-container">
                                <div className='network-nodes node-row'>
                                    {
                                        this.state && this.state.network && this.state.network.value.map(node => {
                                            if(node.default){
                                                if(!this.defaultNodeUrls[this.state.network.name]){
                                                    this.defaultNodeUrls[this.state.network.name] = [];
                                                }
                                                this.defaultNodeUrls[this.state.network.name].push(node.url);
                                            }
                                            return <div key={"node-row-sub-container-"+Math.random()} className="node-row-sub-container">
                                                <div className="node-row-url fl">{node.url}</div>
                                                <div className="node-row-btn-delete-container fr">
                                                    {
                                                        node.custom ? (
                                                            <div className="node-row-btn-delete btn" onClick={this.removeNode.bind(this, node, this.state.network.name, this.state.networkType)} title="Remove"></div>
                                                        ) : <div>&nbsp;</div>
                                                    }
                                                </div>
                                                <div className="node-row-btn-selection-container fr">
                                                    {
                                                        !node.default ? (
                                                            <div className="node-row-btn btn" onClick={this.setDefaultNode.bind(this, node.url, this.state.network.name, this.state.networkType)}>Set As Default</div>
                                                        ) : <div className="default node-row-btn">Default</div>
                                                    }
                                                </div>
                                                <div className="clear" />
                                            </div>
                                        })
                                    }
                                    <div className="node-row-sub-container node-row-add-container hidden">
                                        <div className="node-row-url fl">
                                            <select onChange={(e) => {this.addedNodeProtocol = e.target.value;}} defaultValue="https://" className="node-row-url-select">
                                                <option value="https://">https://</option>
                                                <option value="http://">http://</option>
                                            </select>
                                            <input
                                                onChange = {(e)=> {
                                                    this.addedNode = e.target.value;
                                                }}
                                                onKeyPress={event => {
                                                    if (event.key === 'Enter') {
                                                        this.addNode(this.state.network.name, this.state.networkType, event)
                                                    }
                                                }}
                                                ref="custom-node-input"
                                                placeholder="Add Blockchain Node URL" className="single-line" />
                                        </div>
                                        <div className="node-row-btn btn fr" style={{marginLeft: 10}} onClick={this.cancelCustomNode.bind(this)}>Cancel</div>
                                        <div className="node-row-btn btn fr" onClick={this.addNode.bind(this, this.state.network.name, this.state.networkType)}>Add</div>
                                        <div className="clear" />
                                    </div>
                                    <div className="node-row-sub-container add-custom-node-btn">
                                        <div className="node-row-btn-add btn" onClick={this.addCustomNode}title="Add Blockchain Node URL"></div>
                                    </div>
                                    <div className="clear" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }else{
            return null;
        }
    }

    emptyFunc(e){
        console.log("Empty func !!");
    }

    terminateProveEvidence(e){
        this.checkProveEvidence(false);
        this.logEmitter.triggerTerminate();
    }

    getDefaultNodes(){
        var evidenceData = this.store.getEvidenceManifestData(),
            blockchainAnchorsOn = evidenceData.blockchainAnchorsOn;
        
        if(this.networkJson != "" && this.evidenceType == 'Certified L1'){
            if(!blockchainAnchorsOn && !this.state.emptyBlockchainAnchorsOn){
                return null;
            }else if(this.state.emptyBlockchainAnchorsOn){
                return null;
            }
            
            var allNetworks = [];
            blockchainAnchorsOn.map(networkType => {
                this.networkJson.map((e) => {
                    if(e.type == networkType.type){
                        if(e.type.toLowerCase() == "ethereum"){
                            this.isEthereum = true;
                        }
                        var defaultNetworks = [];
                        e.networks.map(en => {
                            networkType.networks.map(networkName => {
                                if(en.name == networkName && en.value){
                                    en.value.map(networkVal => {
                                        if(networkVal.default){
                                            defaultNetworks.push(en.name);
                                            if(en.name.toLowerCase() == "mainnet"){
                                                this.isEthereumMainnet = true;
                                            }
                                        }
                                    });
                                }
                            });
                        });

                        if(defaultNetworks.length > 0){
                            var proveInfo = "the "+networkType.type+" ( "+defaultNetworks.join()+" ) Blockchain";
                            allNetworks.push(proveInfo);
                        }
                    }
                });
            });
            return allNetworks;
        }else{
            return null;
        }
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

        // to check network and network type
        var proveInfoArr = this.getDefaultNodes();
        var proveInfoHTML = null;
        if(!this.state.blockchainAnchorDisable && this.evidenceType == 'Certified L1'){
            proveInfoHTML = proveInfoArr.join("\n");

            if(proveInfoHTML == "") proveInfoHTML = null;
        }
        this.proveInfoHTML = proveInfoHTML;

        var productionGovernorHTML = null, productionGovernorInfoIcon = null;
        if(evidenceData.isProductionGovernor !== true){
            productionGovernorHTML = "Evidence generated by a test version of a governor";
            if(evidenceData.governorStageURI){
                productionGovernorHTML = productionGovernorHTML+ " ("+evidenceData.governorStageURI+")";
            }
            productionGovernorInfoIcon = <div title="L1 proofs against evidence generated by test versions of governors should not be considered definitive." className="prove-warning-sign" />;
        }

        var inforBtnHTML = null, inforBtn = null;
        if(this.state.blockchainAnchorDisable || (this.state.emptyBlockchainAnchorsOn && this.evidenceType == 'Certified L1') ){
            inforBtnHTML = "The Evidence File is a Layer 1 (L1) evidence file";
            if(this.state.blockchainAnchorDisable){
                var tooltip = "Warning: The Blockchain part of the proof has been disabled. This proof cannot be considered definitive. In  order to enable the Blockchain part of the proof, click on \"More Details\" above and switch \"Perform Blockchain Proof\" to on.";
                var toolalert = "Warning: The Blockchain Proof has been disabled. Hence only internal self-consistency is being proved. This should not be considered a definitive proof of certified operation(s). Click on \'More Details\' to switch it on.";
                if(this.evidenceType == 'Certified L2'){
                    tooltip = toolalert = "Warning: This is a Layer 2 (L2) evidence file. It does not contain Layer 1 (L1) evidence which is used to prove certified operations against the blockchain. Hence only internal self-consistency is being proved. This should not be considered a definitive proof of certified operation(s).";
                    inforBtnHTML = "The Evidence File is a Layer 2 (L2) evidence file";
                }
            }else{
                var tooltip = toolalert = "Warning: This is an L1 Evidence with no Blockchain anchor. Hence only internal self-consistency can be proved. this should NOT be considered a definitive proof of certified operation(s).";
            }
            var inforBtn = <div title={tooltip} onClick={() => {swal(toolalert)}} className="prove-warning-sign" />;
        }

        if(this.evidenceType == 'Backup'){
            inforBtnHTML = "This is a backup file.";
            var inforBtn = <div title="Backup files cannot be definitively proven and should not be considered as evidence." onClick={() => {swal("Backup files cannot be definitively proven and should not be considered as evidence.")}} className="prove-warning-sign" />;
        }

        var pureCopiedText = this.state.log+(this.state.errLog.length > 0 ? "\n\n"+JSON.stringify(this.state.errLog) : "");
        pureCopiedText = pureCopiedText.replace(/<br\s*[\/]?>/gi, "\n");
        pureCopiedText = pureCopiedText.replace(/(<([^>]+)>)/ig,"");

        var networkAgainstIcon = null, networkTypeAgainstIcon = null;
        if(this.evidenceType == 'Certified L1'){
            if(!this.isEthereum){
                networkAgainstIcon = <div title="Can only prove against Ethereum Blockchain" className="prove-warning-sign" />;
            } else if(!this.isEthereumMainnet){
                networkTypeAgainstIcon = <div title="L1 Proofs against Ethereum test networks should not be considered definitive" className="prove-warning-sign" />;
            }
        }

		return (
            <div className="panel-container">
                <div className="xpanel">
                    <div className="xpanel-header">
                        <div className="logo fl">
                            <img className="logo" src={ConfigImages.default.appIcon} alt="CertComm" title="CertComm" />
                        </div>
                        <div className="xpanel-header-back-btn">
                            {
                                this.state.isProveRunning ? (
                                    <button className="btn btn-breadcrumb disabled">&#x276e; Back</button>
                                ) : <button className="btn btn-breadcrumb" onClick={this.navigateToUploadEvidence.bind(this)}>&#x276e; Back</button>
                            }
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
                            
                            {
                                err == "" ? (
                                    <div className="advanced-container">
                                        <div className="more">
                                            <div className="col fancy" onClick={this.toggleSlider.bind(this, "hide-me")}><span>More Details</span></div>
                                        </div>
                                        <div className="clear" />
                                        <div className="advanced-sub-container hide-me hidden">
                                            <div className="info-label">CertProof App Version</div>
                                            <div className="fl bold"> : </div>
                                            <div className="info-value">{process.env.npm_package_version}</div>
                                            
                                            <div className="clear"></div>
                                            <div className="info-label">Commit Hash</div>
                                            <div className="fl bold"> : </div>
                                            <div className="info-value">{process.env.npm_package_config_GIT_COMMIT}</div>
                                            
                                            <div className="clear"></div>
                                            <div className="info-label">Schema Version</div>
                                            <div className="fl bold"> : </div>
                                            <div className="info-value">Inc-{evidenceData.evidenceSchemaVersion}</div>
                                            
                                            <div className="clear"></div>
                                            <div className="info-label">Evidence Type</div>
                                            <div className="fl bold"> : </div>
                                            <div className="info-value">{this.evidenceType}</div>
                                            
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

                                            <div className="clear"></div>
                                            {
                                                !this.state.emptyBlockchainAnchorsOn ? (
                                                    <div>
                                                        <div className="info-label">Perform Blockchain Proof </div>
                                                        <div className="fl bold"> : </div>
                                                        <div className="info-value">
                                                            <div className="link" onClick={this.evidenceType == 'Certified L2' || !this.isEthereum ? this.emptyFunc.bind(this) : this.blockchainAnchorDisableFunc.bind(this, !this.state.blockchainAnchorDisable, this.state.isProveRunning)}>
                                                                <div className="switch">
                                                                    <div className="fl onoffswitch">
                                                                        {
                                                                            this.state.isProveRunning || this.evidenceType == 'Certified L2' || !this.isEthereum ? (
                                                                                <input type="checkbox" id="blockchainAnchorDisableCheck"  className="onoffswitch-checkbox" checked={(this.isEthereum ? !this.state.blockchainAnchorDisable : false)} disabled />
                                                                            ) : <input type="checkbox" id="blockchainAnchorDisableCheck"  className="onoffswitch-checkbox" checked={!this.state.blockchainAnchorDisable} readOnly />
                                                                        }
                                                                        <label htmlFor="blockchainAnchorDisableCheck" className="onoffswitch-label">
                                                                            <span className="onoffswitch-inner"></span>
                                                                            <span className="onoffswitch-switch"></span>
                                                                        </label>
                                                                    </div>
                                                                    {networkAgainstIcon}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="clear"></div>
                                                        <div className="info-label">Blockchain URLs</div>
                                                        <div className="fl bold"> : </div>
                                                        <div className="info-value">
                                                            {
                                                                !this.state.blockchainAnchorDisable && this.isEthereum ? (
                                                                    <a className="link" onClick={this.blockchainModalAction.bind(this, true)}>Update</a>
                                                                ) : <a className="no-link">Update</a>
                                                            }
                                                        </div>
                                                    </div>
                                                ) : null
                                            }
                                        </div>
                                    </div>
                                ) : null
                            }
                        </div>
                        {
                            err == "" ? (
                                <div className="evidence-prove-container">
                                    <div className="evidence-prove-form">
                                        <div className="evidence-prove-container-btn">
                                            <div onClick={this.proveEvidence.bind(this)} className="fl prove-btn btn-success">Prove</div>
                                        </div>
                                        <div className="clear" />
                                        {
                                            productionGovernorHTML != null ? (
                                                <div className="evidence-prove-container-text">{productionGovernorHTML} {productionGovernorInfoIcon}</div>
                                            ) : null
                                        }
                                        <div className="clear" />
                                        {
                                            inforBtn != null ? (
                                                <div className="evidence-prove-container-text">{inforBtnHTML} {inforBtn}</div>
                                            ) : null
                                        }
                                        <div className="clear" />
                                        {
                                            proveInfoHTML != null ? (
                                                <div className="prove-info-text">Will prove on {proveInfoHTML} {networkTypeAgainstIcon}</div>
                                            ) : null
                                        }
                                    </div>
                                    <div className="progress-bar-container hidden">
                                        <div className="evidence-prove-container-btn">
                                            <div className="proving-btn">
                                                Proving
                                                <div className="fr fa-spin"></div>
                                            </div>
                                            <div onClick={this.terminateProveEvidence.bind(this)} className="btn-primary prove-cancel-btn"> Cancel </div>
                                        </div>
                                        <div className="clear" />
                                        {
                                            productionGovernorHTML != null ? (
                                                <div className="evidence-prove-container-text">{productionGovernorHTML} {productionGovernorInfoIcon}</div>
                                            ) : null
                                        }
                                        <div className="clear" />
                                        {
                                            inforBtn != null ? (
                                                <div className="evidence-prove-container-text">{inforBtnHTML} {inforBtn}</div>
                                            ) : null
                                        }
                                        <div className="clear" />
                                        {
                                            proveInfoHTML != null ? (
                                                <div className="prove-info-text prove-info-text-proving">Proving on {proveInfoHTML} {networkTypeAgainstIcon}</div>
                                            ) : null
                                        }
                                    </div>
                                    <div className="verification-container hidden">
                                        <div className="evidence-prove-container-btn">
                                            <div className="btn-primary proved-btn">
                                                Proved
                                                <div className="fr proved-icon"></div>
                                            </div>
                                            <div onClick={this.reproveEvidence.bind(this)} className="btn-success re-prove-btn">
                                                Re-Prove
                                                <div className="fr re-prove-icon"></div>
                                            </div>
                                        </div>
                                        <div className="clear" />
                                        {
                                            productionGovernorHTML != null ? (
                                                <div className="evidence-prove-container-text">{productionGovernorHTML} {productionGovernorInfoIcon}</div>
                                            ) : null
                                        }
                                        <div className="clear" />
                                        {
                                            inforBtn != null ? (
                                                <div className="evidence-prove-container-text">{inforBtnHTML} {inforBtn}</div>
                                            ) : null
                                        }
                                        <div className="clear" />
                                        {
                                            proveInfoHTML != null ? (
                                                <div className="prove-info-text prove-info-text-proved">Proved on  {proveInfoHTML} {networkTypeAgainstIcon}</div>
                                            ) : null
                                        }
                                    </div>
                                    <div className="verification-failed-container hidden">
                                        <div className="evidence-prove-container-btn">
                                            <div className="btn-primary prove-failed-btn tooltip">
                                                <span>{(this.state.errLog[0] ? this.state.errLog[0].name+" - "+this.state.errLog[0].message : "" )}</span>
                                                Proof Failed
                                                <div className="fr prove-failed-icon"></div>
                                            </div>
                                            <div onClick={this.reproveEvidence.bind(this)} className="btn-success re-prove-btn">
                                                Re-Prove
                                                <div className="fr re-prove-icon"></div>
                                            </div>
                                        </div>
                                        <div className="clear" />
                                        {
                                            productionGovernorHTML != null ? (
                                                <div className="evidence-prove-container-text">{productionGovernorHTML} {productionGovernorInfoIcon}</div>
                                            ) : null
                                        }
                                        <div className="clear" />
                                        {
                                            inforBtn != null ? (
                                                <div className="evidence-prove-container-text">{inforBtnHTML} {inforBtn}</div>
                                            ) : null
                                        }
                                        <div className="clear" />
                                        {
                                            proveInfoHTML != null ? (
                                                <div className="prove-info-text prove-info-text-failed">Unable to proved against {proveInfoHTML} {networkTypeAgainstIcon}</div>
                                            ) : null
                                        }
                                    </div>
                                    <div className="clear" />
                                    {
                                        this.state.log != "" || this.state.errLog.length > 0 ? (
                                            <div className="copy-to-clipboard-container hide-ccc">
                                                <div id="clip-log-text" className="hidden">Log Copied to Clipboard</div>
                                                <Clipboard
                                                    data-clipboard-text={pureCopiedText}
                                                    onSuccess={ () => {
                                                        document.getElementById('clip-log-text').className = 'copied-message-text';
                                                        setTimeout(function(){
                                                            document.getElementById('clip-log-text').className = 'hidden';
                                                        }, 3000);
                                                    }}>
                                                    <div title="Copy Log to Clipboard" className={"copy-to-clipboard "+(this.state.log == "" && this.state.errLog.length <= 0 ? "hidden" : "")} />
                                                </Clipboard>
                                                <div title="View this log in a wide dialog" className="new-tab-icon" onClick={this.proveModalAction.bind(this, true)} />
                                            </div>
                                        ) : null
                                    }
                                </div>
                            ) : null
                        }
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
                {this.configBlockchainNetworksModal()}
                {this.configProveLogModal()}
            </div>
        );
	}
}