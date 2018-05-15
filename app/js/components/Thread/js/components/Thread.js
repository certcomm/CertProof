import React from 'react';
import { observer } from "mobx-react";

import Clipboard from 'react-clipboard.js';
import PerfectScrollbar from 'perfect-scrollbar';

import ThreadStore from "./../stores/ThreadStore";
import Writers from "./Writers";
import Sections from "./Sections";
import Comments from "./Comments";

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
            renderView: false
        }
    }
    
    componentWillMount() {
        this.store.setData(this.data);
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
                    <div className="header-title">
                        <span>{headerData.subject}</span>
                    </div>
                    <div className="header-rhs">
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
                            <Writers key={"writer-header-container+"+Math.random()} data={headerData.writers} type={isForwarded ? "" : "list"} />
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
            document.getElementsByClassName("col")[0].className = "exp";
            target.style.height = target.scrollHeight+"px";
            setTimeout(function(){
                document.getElementsByClassName("more")[0].scrollTop = 100;
            }, 500);
        } else {
            document.getElementsByClassName("exp")[0].className = "col";
            target.style.height = 0;
        }
    }

    renderView(){
        this.setState({renderView: true});
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
        
        if(err == "" && headerData == null) return null;

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
                    <div className="col" onClick={this.toggleSlider.bind(this, "hide-forwarded-container")}>
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

        if(err != ""){
            return (
                <div className="blank-container">
                    <div className="information-message">
                        This Evidence file could not be opened due to the following error(s):
                    </div>
                    <div className="information-danger-message">{err}</div>
                </div>
            );
        }else if( (Constants.default.supportedSchema > headerData.sacSchemaVersion || Constants.default.supportedSchema > headerData.firstSacSchemaVersion) && !this.state.renderView){
            return (
                <div className="blank-container">
                    <div className="information-message">
                        Warning: The evidence file contains information that is best rendered with the latest version of CertProof.
                    </div>
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