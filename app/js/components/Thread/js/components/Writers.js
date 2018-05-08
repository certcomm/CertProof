import React from 'react';
import ReactTooltip from 'react-tooltip'

export default class Writers extends React.Component {
	constructor(props) {
        super(props);

        this.data = props.data;
        this.type = props.type;
    }
    
    getFirstLetter(v){
        var vArr = v.split(" ");
        var v1 = vArr[0].charAt(0).toUpperCase();
        var v2 = (vArr[1]) ? vArr[1].charAt(0).toUpperCase() : vArr[0].charAt(1).toUpperCase();
        return v1+v2;
    }

    getWritersInitials(writers) {
        if(writers && typeof writers == 'object') {
            // For array writers object
            writers.map((val, key) => {
                if(val.firstName && val.firstName != '') {
                    var name = val.firstName+" "+val.lastName;
                    writers[key]['firstInitials'] = this.getFirstLetter(name);
					writers[key]['initial'] = this.getFirstLetter(name);
                } else {
					var initials = val.contemporaneousTmailAddress ? val.contemporaneousTmailAddress.substring(0, 2).toUpperCase() : val.foreverTmailAddress ? val.foreverTmailAddress.substring(0, 2).toUpperCase() : '';
                    writers[key]['firstInitials'] = initials;
                    writers[key]['initial'] = initials;
                }
            });
        }
        return writers;
    }

    compileWriterTooltip(writer, index) {
        writer.toolTip = true;
        writer.view = "list";
        return (
            <div className="actorsHoverView">
                <div className="ahv-wrapper">
                    <ul className="actors-writer writers-wrapper2">{this.compileWriterObject(writer, index)}</ul>
                </div>
            </div>
        );
    }

    getUserImage(user){
		if(user.role === true) {
			return './role_human.jpg'; 
		} else {
            return "data:image/png;base64,"+user.profileImage;
		}
    }
    
    compileWriterObject(writer, index) {
        var tooltipKey = writer.contemporaneousTmailAddress+"-"+index+"-"+Math.random();
        var writerHTML = <li data-tip data-for={tooltipKey} className="writer-rounded w-list-view my-org">
            {
                writer.role !== true && writer.bindEmailAddress == undefined ? (
                    writer.profileImage ? (
                        <img src={this.getUserImage(writer)} className="img-circle m-t-xs img-responsive" />
                    ) : <div className="no-image">{writer.firstInitials}</div>
                ) : ""
            }
            {
                writer.role === true || writer.bindEmailAddress ? (
                    <div className={"no-image "+ (writer.role === true ? "role" : "email")}>{writer.firstInitials}</div>
                ) : ""
            }
            {
                writer.view == "list" ? (
                    <div className="w-info">
                        {
                            writer.firstName != undefined && writer.firstName != "" ? (
                                <div className="w-name">{writer.firstName+" "+writer.lastName}</div>
                            ) : ""
                        }
                        <div className="w-address">{writer.contemporaneousTmailAddress}</div>
                    </div>
                ) : ""
            }
        </li>

        if(writer.hover === true){
            return <div key={"writer-hover-container-"+this.type+"-"+Math.random()}>{writerHTML}</div>;
        }else{
            var qtip = null, writerTooltipHtml = null;
            if(!writer.toolTip) {
                qtip = this.compileWriterTooltip(writer, index);
                writerTooltipHtml = <ReactTooltip className="tooltip-container" id={tooltipKey} type="light" effect="solid">
                    {qtip}
                </ReactTooltip>
            }
            
            return (
                <div key={"writer-container-"+this.type+"-"+Math.random()}>
                    {writerHTML}
                    {writerTooltipHtml}
                </div>
            )
        }
    }

    getWriters(writers, type){
        writers = this.getWritersInitials(writers);
        return writers.map( (writer, i) => {
            writer.view = "";
            writer.hover = false;
            if(type == "hover"){
                writer.view = "list";
                writer.hover = true;
            }
            return (
                this.compileWriterObject(writer, i)
            )
        });
    }
	
	render() {
        var writers = this.data;
        if(writers && writers.length > 0 && writers[0] != undefined){
            var writerPrefixHtml = null;
            if(this.type == "added"){
                writerPrefixHtml = <li className="added-writer t-add icon16x16"></li>
            }else if(this.type == "list" && writers.length > 1){
                writerPrefixHtml = <div data-tip data-for="writers-header-tooltip">
                    <div className="writers-count-wrapper">
                        <div className="h-inner-wrapper"><span className="h-users-icon"></span></div>
                    </div>
                    <ReactTooltip className="tooltip-container" id="writers-header-tooltip" aria-haspopup='true' type="light" effect="solid" place="bottom">
                        <div className="actorsHoverView">
                            <div className="ahv-wrapper">
                                <ul className="actors-writer writers-wrapper2 hover-list">
                                    {this.getWriters(writers, "hover")}
                                </ul>
                            </div>
                        </div>
                    </ReactTooltip>
                </div>
            }

            return (
                <ul>
                    {writerPrefixHtml}
                    { this.getWriters(writers) }
                </ul>
            );
        }else{
            return null;
        }
	}
}