import React from 'react';
import { observer } from "mobx-react";

import Clipboard from 'react-clipboard.js';
import PerfectScrollbar from 'perfect-scrollbar';

import ThreadStore from "./../stores/ThreadStore";
import Writers from "./Writers";
import Sections from "./Sections";
import Comments from "./Comments";

import EvidenceUtils from "./../../../../../prove/app/util/evidenceUtils.js";

var CommonFunc = require("./../../../../../config/common.js");
var Constants = require("./../../../../../config/constants.js");

@observer
export default class Thread extends React.Component {
	constructor(props) {
        super(props);

        this.parentStore = props.parentStore;

        this.store = ThreadStore;
        this.data = props.data;
        this.err = props.err;
        
        this.state = {
            renderView: false,
            inCompatibleEvidence: false
        }
    }
    
    componentWillMount() {
        this.store.setData(this.data);
    }

    componentDidMount(){
        $("body").on("click", function(event, target) {
            if (event.target.tagName == 'A') {
                if($(event.target).hasClass("in-same-thread")){
                    event.preventDefault();
                    var ttn = event.target.getAttribute('data-ttn');
                    CommonFunc.comments.openInAppLinks(event.target.href, ttn);
                }
            }else if(event.target.tagName == 'SPAN' && $(event.target).parent("a.tooltip").length > 0){
                event.preventDefault();
            }
        });
    }

    componentDidUpdate(){
        var element =  document.getElementsByClassName('middle-container');
        if (typeof(element) != 'undefined' && element != null && element.length > 0) {
            const ps = new PerfectScrollbar('.middle-container');
            ps.update();
        }
    }

    renderComments(data, headerData, isForwarded){
        return (
            <div>
                {
                    headerData && headerData.sections && headerData.sections.length > 0 ? (
                        <div className="section-header-container">
                            <Sections key={"section-header-container"+Math.random()} sections={headerData.sections} data={headerData} type="list" />
                        </div>
                    ) : null
                }
                <Comments comments={data.comments} data={headerData} store={this.store} />
            </div>
        );
    }
    
    renderHeader(headerData, isForwarded){
        if(!headerData) return null;

        var ttnLink = "[ "+headerData.ttn + ", "+headerData.subject+ ", "+headerData.ttnURL+" ]";
        return(
            <div className="top-container">
                <div className="header-container">
                    <div className="header-lhs">
                        <div className="header-title"><span>{headerData.subject}</span></div>
                    </div>
                    <div className="header-rhs">
                        {
                            this.state.inCompatibleEvidence === true ? (
                                <div title={"Warning: The schema version is "+headerData.firstSacSchemaVersion+" and this app only supports "+Constants.default.supportedSchemaVersions.current+". The thread may not render properly. You should use the latest version of this CertProof App."} className="incompatible-evidence">Unsupported Schema</div>
                            ) : null
                        }
                        {
                            headerData.certified && !isForwarded ? (
                                <div className="fl tmail-certified-new-rhs" title="This thread is certified"></div>
                            ) : null
                        }
                        {
                            headerData.ttn ? (
                                <div className="fl">
                                    <div className="fl ttno" title={headerData.ttn}>[{ headerData.ttn.split('-')[2]}]</div>
                                    <div id="clip-tmail-link" className="hidden">{ttnLink}</div>
                                    {
                                        !isForwarded ? (
                                            <Clipboard
                                                data-clipboard-text={ttnLink}
                                                button-title={ttnLink}
                                                onSuccess={ () => {
                                                    document.getElementById('clip-tmail-link').className = 'copied-message-text';
                                                    setTimeout(function(){
                                                        document.getElementById('clip-tmail-link').className = 'hidden';
                                                    }, 3000);
                                                }}>
                                                <div className="x-btn t-url-icon zclips"></div>
                                            </Clipboard>
                                        ) : null
                                    }
                                </div>
                            ) : null
                        }
                        {
                            headerData.templateParent ||  headerData.threadType == "Instance" ? (
                                <div title={'Instance, instantiated from smart template "'+headerData.templateParent.parentTemplateName+'" Release '+headerData.templateParent.releaseNum} className='t-instance fr toolbar-btn'></div>
                            ) : null
                        }
                        {
                            headerData.threadType == "Template" ? (
                                <div title={(headerData.certified ? "Certified" : "")+" Smart Template"} className="t-template fr toolbar-btn"></div>
                            ) : null
                        }
                    </div>
                </div>
                <div className="clear"></div>
                {
                    headerData.writers && headerData.writers.length > 0 ? (
                        <div className="writer-header-container">
                            <Writers key={"writer-header-container+"+Math.random()} data={headerData.writers} visibleToOrg={headerData.visibleToOrg} orgRestricted={headerData.orgRestricted} domainName={headerData.domainName} type={isForwarded ? "" : "list"} />
                        </div>
                    ) : null
                }
            </div>
        );
    }

    toggleSlider(el, e){
        this.__toggle = !this.__toggle;
        var target = document.getElementsByClassName(el)[0];
        if( this.__toggle) {
            document.getElementsByClassName("colt")[0].className = "expt";
            target.style.height = target.scrollHeight+"px";
            setTimeout(function(){
                $('.middle-container').animate({ scrollTop: $('.middle-container').scrollTop() + $('.more').offset().top+50 }, 500);
            }, 500);
        } else {
            document.getElementsByClassName("expt")[0].className = "colt";
            target.style.height = 0;
            setTimeout(function(){
                $('.middle-container').animate({ scrollTop:  $('.middle-container').height()+210 }, 500);
            }, 500);
        }
    }

    renderView(){
        this.setState({renderView: true, inCompatibleEvidence: true});
    }

    navigateToUploadEvidence(){
        this.parentStore.setData({});
        this.parentStore.setUploadedEvidenceFlag(false)
    }
    
    renderThread(){
        var data = this.store.getData(),
            err = this.err,
            headerData = data && data.header ? data.header : null,
            forwardedCommentHtml = null;
        
        if(err == "" && headerData == null) {
            if(!data.comments) return null;
            return <Comments comments={data.comments} data={headerData} store={this.store} />
        }

        if(data.forwards){
            //  we are considering latest forward if that is certified 
            var isCertifiedForward = (data.forwards[0] && data.forwards[0].header && data.forwards[0].header.certified) ? true : false;

            forwardedCommentHtml = data.forwards.map((forward)=>{
                var fcm = forward.comments,
                    cloneData = JSON.parse(JSON.stringify(forward.comments)),
                    startDelete = "",
                    endDelete = "";
                
                /*
                * run loop to group deleted comments
                * ex. single delete (e.g. c#22 deleted)
                    range delete (e.g. c#5-c#18 deleted) in reverse order
                    range special case (e.g. all c#6's below deleted)
                * */
                Object.keys(fcm).map( (i) => {
                    var updateComments = function(sD, eD, obj, index){
                        if(sD != ""){
                            if(sD == 1 && eD != ""){
                                if(isCertifiedForward)
                                    obj[index-1] =  "All forwarded comments below deleted";
                                else
                                    obj[index-1] =  "All #"+eD+"'s below deleted";
                            }else if(sD != "" && eD != ""){
                                obj[index-1] =  "#"+eD+"-#"+sD+" deleted";
                            }else{
                                obj[index-1] =  "#"+sD+" deleted";
                            }
                        }
                        return obj;
                    }

                    if(typeof fcm[i] == "string"){
                        if(startDelete != ""){
                            endDelete = i;
                        }else{
                            startDelete = i;
                        }
                        delete fcm[i];
                    }else{
                        fcm = updateComments(startDelete, endDelete, fcm, i);
                        startDelete = "";
                        endDelete = "";
                    }
                    if(i == Object.keys(cloneData).length){
                        fcm = updateComments(startDelete, endDelete, fcm, i);
                        startDelete = "";
                        endDelete = "";
                    }
                });
                return (
                    <div className="forwarded-item-wrapper" key={Math.random()}>
                        {this.renderHeader(forward.header, true)}
                        {this.renderComments(forward, forward.header, true)}
                    </div>
                );
            });
            forwardedCommentHtml = <div className="forwarded-container">
                <div className="more">
                    <div className="colt" onClick={this.toggleSlider.bind(this, "hide-forwarded-container")}>
                        {
                            isCertifiedForward ? (
                                <span>
                                    Certified Forwarded Comments
                                    <div className="fl tmail-certified-new-rhs" title="This thread is certified"></div>
                                </span>
                            ) : <span> Forwarded Comments </span>
                        }
                    </div>
                </div>
                <div className="hide-forwarded-container">
                    {forwardedCommentHtml}
                </div>
            </div>
        }

        var supportErrorCode = '',
            supportMessage = "";
        try{
            var logEmitter = {
                log: function(r){
                    console.log("logEmitter response", r);
                }
            }
            EvidenceUtils.ensureSacSchemaVersionSupportedUI(logEmitter, headerData.sacSchemaVersion);
        }catch(e){
            supportErrorCode = e.name;
            switch(e.name){
                case "1006":
                    supportMessage = "Warning: The evidence file contains information older than incremental schema version v"+Constants.default.supportedSchemaVersions.current+" which is not supported in this version of the app (app version v"+process.env.npm_package_version+").";
                break;
                case "1026":
                    supportMessage = "Warning: The evidence file contains information in a pre-production format which is no longer supported.";
                break;
                case "1027":
                    supportMessage = "Warning: The evidence file contains information that requires a newer version of CertProof. Please download the latest version of CertProof. Note that this version of CertProof is v"+process.env.npm_package_version+".";
                break;
                case "1028":
                    supportMessage = "Warning: The evidence file contains information that is best rendered with the latest version of CertProof.";
                break;
            }
        }

        if(err != ""){
            return (
                <div className="blank-container">
                    <div className="information-message">
                        This Evidence file could not be opened due to the following error(s):
                    </div>
                    <div className="information-danger-message">{err}</div>
                </div>
            );
        }else if(supportErrorCode == "1006" || supportErrorCode == "1026" || supportErrorCode == "1027"){
            return (
                <div className="blank-container">
                    <div className="information-message">{supportMessage}</div>
                </div>
            );
        }else if( supportErrorCode == "1028" && !this.state.renderView){
            return (
                <div className="blank-container">
                    <div className="information-message">{supportMessage}</div>
                    <div className="information-message"> Do you want to go ahead anyway? </div>
                    <div className="information-message">
                        <input className="btn-primary btn btn-w-m" type="button" value="Yes" onClick={this.renderView.bind(this)} />
                        <input className="btn-danger btn btn-w-m margin-between" type="button" value="No" onClick={this.navigateToUploadEvidence.bind(this)} />
                    </div>
                </div>
            );
        }else{
            return (
                <div className="thread-container">
                    {this.renderHeader(headerData)}
                    <div className="middle-container">
                        {this.renderComments(data, headerData)}
                        {forwardedCommentHtml}
                    </div>
                </div>
            )
        }
    }

	render() {
        return this.renderThread()
	}
}