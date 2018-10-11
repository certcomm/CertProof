import React from 'react';
import PerfectScrollbar from 'perfect-scrollbar';
import Modal from 'react-modal';
const customStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    }
};

const StreamZip = window.require('node-stream-zip');

var Constants = require("./../../../../../config/constants.js");

export default class Attachments extends React.Component {
	constructor(props) {
        super(props);

        this.data = props.data;

        this.state = {
            modalIsOpen: false,
            attachment: ""
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidUpdate(){
        var element =  document.getElementsByClassName('modal-content');
        if (typeof(element) != 'undefined' && element != null && element.length > 0) {
            const ps = new PerfectScrollbar('.modal-content');
            ps.update();
        }
    }

    openModal(attachment) {
        this.setState({modalIsOpen: true, attachment: attachment});
    }

    closeModal() {
        this.setState({modalIsOpen: false, attachment: ""});
    }

    configAttachmentModal(){
        var attachment = this.state.attachment;

        return (
            <Modal
                isOpen={this.state.modalIsOpen}
                onRequestClose={this.closeModal}
                shouldCloseOnOverlayClick={false}
                style={customStyles}
                ariaHideApp={false}
                contentLabel="Attachment Modal">
                <div className="modal-file-container">
                    <div className="modal-header">
                        <div className="fl modal-attachment-title">{attachment.title}</div>
                        <div className="fr btn-close" onClick={this.closeModal} />
                        <div onClick={this.downloadAttachment.bind(this, attachment.title, attachment.content)} className="fr download-s"></div>
                    </div>
                    <div className="modal-content">
                        <div className="reset-css comment-text">
                            <img src={"data:application/octet-stream;charset=utf-16le;base64," + attachment.content} />
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
    
    checkViewableFile(filtExt){
        switch(filtExt){
            case 'jpg':
            case 'jpeg':
            case 'gif':
            case 'png':
            case 'svg':
                return true;
            break;
            default:
                return false;
            break;
        }
    }

    downloadAttachment(filename, content){
        // create anchor tag and set href and few attributes which will help to open download dialog box
        var element = document.createElement('a');
        element.setAttribute('href', 'data:application/octet-stream;charset=utf-16le;base64,' + content);
        element.setAttribute('download', filename);
        
        // element should be in hidden mode
        element.style.display = 'none';
        // append element into body
        document.body.appendChild(element);
        
        // manually click that elemtn to open dialog box
        element.click();
        
        // after all process, element should be removed.
        document.body.removeChild(element);
    }
    
    viewAttachment(attachment){
        // read incremental change num zip without extreact
        const zip = new StreamZip({
            file: Constants.default.extractedEvidenceFolder+attachment.zipEntryName,
            storeEntries: true
        });

        var bufferData = null;
        zip.on('ready', () => {
            try {
                var ext = this.bifFileName(attachment.title).ext,
                    fname = "attachments/"+attachment.attachmentLeafHash+"."+ext;

                bufferData = zip.entryDataSync(fname);
            } catch(e) {
                console.log("Error", e);
            }

            if(bufferData != null){
                // convert buffer data into string (utf-8)
                var manifestJson = bufferData.base64Slice();
                attachment.content = manifestJson;
                if(!this.checkViewableFile(ext)){
                    this.downloadAttachment(attachment.title, manifestJson);
                }else{
                    this.openModal(attachment);
                }
            }
            zip.close();
        });
    }

    bifFileName(fileName){
		if(-1 == fileName.indexOf('.')){ //no extension
			var ext = '';
			var name = fileName;
		} else {
			var fileNameIndex = fileName.lastIndexOf("/") + 1;
			var filename = fileName.substr(fileNameIndex);
			
			var ext = fileName.substring(fileName.lastIndexOf('.')+1);
			ext = ext.toLowerCase();
			
			var name = fileName.substring(0,fileName.lastIndexOf('.'));
		}
		return {ext:ext, name:name};
    }

    getAttachments(attachments){
        if(attachments && attachments.length > 0){
            return attachments.map( (file, i) => {
                var f = this.bifFileName(file.title),
                    fileType = f.ext;

                var attachmentNumHtml = "";
                if(typeof file.attachmentNum != "undefined"){
                    attachmentNumHtml = <div className="comment-attachment-file-num">
                        <span className="comment-attachment-num">{"#"+file.attachmentNum}</span>
                    </div>
                }
                
                return (
                    <div className={"-comment-attachment-container x-attachments anchor-attachment-"+file.attachmentNum} key={"atachment-container-"+i}>
                        <div className="comment-attachment">
                            <div className="add-attachment left"></div>
                        </div>
                        <div className="comment-attachment-right">
                            {attachmentNumHtml}
                            <div className="comment-attachment-file-icon">
                                <span className={"t-file-icon-16 t-file-icon-16-"+fileType+" left"}></span>
                            </div>
                            <div className="comment-attachment-name">
                                <a onClick={this.viewAttachment.bind(this, file)} className="section-title">{file.title} </a>
                            </div>
                            <div className="comment-attachment-size">
                                
                            </div>
                        </div>
                    </div>
                )
            });
        }else{
            return false;
        }
    }
	
	render() {
        var attachments = this.data;
        return (
            <div className="attachment-container">
                { this.getAttachments(attachments) }
                {this.configAttachmentModal()}
            </div>
        );
	}
}