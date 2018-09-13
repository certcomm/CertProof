import React from 'react';
import { observer } from "mobx-react";
import moment from "moment";
import momentZone from "moment-timezone";

import Writers from "./Writers";
import Sections from "./Sections";
import Attachments from "./Attachments";

var CommonFunc = require("./../../../../../config/common.js");

@observer
class Comment extends React.Component {
	constructor(props) {
        super(props);

        this.store = props.store;
        this.comment = props.comment;
        this.data = props.data;
        this.ttn = props.data.ttn;

        CommonFunc.comments.data = props.data;
        CommonFunc.comments.ttnURL = props.data.ttnURL;
    }

    componentDidMount(){
        var aTags = document.getElementsByTagName("a");
        for (var i = 0; i < aTags.length; i++) {
            var url = aTags[i].href;

            if(url && url.slice(-1) != "#"){
                if(url.startsWith("file")){
                    url = url.replace("file", "http");
                }
                if(!$(aTags[i]).hasClass("in-same-thread")){
                    aTags[i].setAttribute("onclick","window.require('electron').shell.openExternal('" + url + "')");
                    aTags[i].href = "#";
                }
            }
        }
    }

    getComment(v){
        return CommonFunc.comments.replaceURLContent(v, this.ttn);
    }
    
	render() {
        var comment = this.comment;
        if(typeof comment == "string"){
            return (
                <div className={"item-wrapper tmail-comment-"+this.ttn+"-D"} key={"item-wrapper-"+Math.random()}>
                    <div className="forwarded-comment-deleted">{comment}</div>
                </div>
            );
        }else if(comment.metadataDeleted){
            return (
                <div className={"item-wrapper tmail-comment-"+this.ttn+"-"+comment.changeNum} key={"item-wrapper-"+Math.random()}>
                    <div className="forwarded-header-deleted">#{comment.changeNum}: Comment Header Deleted</div>
                    {
                        comment.comment ? (
                            <div className="comment-container">
                                <div className="comment-text" dangerouslySetInnerHTML={{__html: this.getComment(comment.comment)}} />
                            </div>
                        ) : null
                    }
                </div>
            );
        }else{
            var commentDate = comment.creationTimestamp,
                currentYear = new Date().getFullYear(),
                commentDateYear = moment(comment.creationTimestamp).format('YYYY'),
                currentTimeZone = momentZone.tz.guess(),
                dateWithNewTimeZone = moment.tz(commentDate, currentTimeZone),
                dateWithNewTimeZone = dateWithNewTimeZone.valueOf(),
                formatedDate = moment(dateWithNewTimeZone).calendar(null, {
                    sameDay: '[Today] LT',
                    lastDay: '[Yesterday] LT',
                    lastWeek: 'dddd  LT',
                    sameElse: (currentYear == commentDateYear ? 'MMM LT' : 'MMM YYYY LT')
                }),
                tooltipDate = new Date(Date.parse(commentDate)).toUTCString().replace(/GMT.*/g,"UTC");
            
            if(comment.changeType == "ack_read"){
                var commentHTML = <div className="comment-text-ack">
                    <div className="comment-text">I acknowledge that I have read Comments.</div>
                    <div title="Read acknowledgement" className="ack-certified-read"></div>
                </div>
            }else if(comment.changeType == "ack_receipt"){
                var commentHTML = <div className="comment-text-ack">
                    <div className="comment-text">I acknowledge that I have received Comments.</div>
                    <div title="Explicit Receipt acknowledgement" className="ack-certified"></div>
                </div>
            }else{
                var commentHTML = <div className="comment-text" dangerouslySetInnerHTML={{__html: this.getComment(comment.comment)}} />
            }
            return (
                <div className={"item-wrapper tmail-comment-"+this.ttn+"-"+comment.changeNum} key={"item-wrapper-"+comment.changeNum}>
                    <div className="detail-data">
                        <Writers key={Math.random()} data={[comment.creator]} />
                        <div className="contribute-data">
                            <div className="contribute-info">
                                <div className="num">#{comment.changeNum}</div>
                                <div className="writer-nm">{(comment.creator ? comment.creator.firstName+" "+comment.creator.lastName : "")}</div>
                                <span title={tooltipDate}>{formatedDate}</span>
                            </div>
                        </div>
                    </div>
                    <div className="comment-container">
                        <Sections key={Math.random()} sections={comment.sections} data={this.data} />
                        <Attachments key={Math.random()} data={comment.attachments} />
                        <div className="added-writer-container">
                            <Writers key={Math.random()} data={comment.addedWriters} type="added" />
                        </div>
                        {commentHTML}
                    </div>
                </div>
            )
        }
	}
}

module.exports = Comment;