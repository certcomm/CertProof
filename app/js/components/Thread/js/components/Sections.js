import React from 'react';
import PerfectScrollbar from 'perfect-scrollbar';

var excelbuilder = window.require('excel4node');

import Modal from 'react-modal';
const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        padding               : '10'
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    }
};
const customStylesForFile = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)'
    }
};

const {shell} = window.require('electron');
const StreamZip = window.require('node-stream-zip');
var FileSystem = window.require('fs');

var Constants = require("./../../../../../config/constants.js");

var Form = window.require('Form');
var TaskList = window.require('TaskList');

export default class Sections extends React.Component {
	constructor(props) {
        super(props);

        this.sections = props.sections;
        this.data = props.data;
        this.type = props.type;
        this.changeNum = props.changeNum;

        this.state = {
            modalIsOpen: false,
            section: ""
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidUpdate(){
        setTimeout(() => {
            var element =  document.getElementsByClassName('modal-content');
            if (typeof(element) != 'undefined' && element != null && element.length > 0) {
                const ps = new PerfectScrollbar('.modal-content');
                ps.update();
            }
        }, 100);
    }

    componentDidMount(){
        $("body").click(function(e) {
            if($(".hc-details") && $(".hc-details").parents(".el-container") && $(".hc-details").parents(".el-container").parent('div')[0]){
                var lastElName = $(".hc-details").parents(".el-container").parent('div')[0].lastChild.getAttribute('id');
                if (e.target.id == lastElName || $(e.target).parents("#"+lastElName).length) {
                    setTimeout(() => {
                        var viewEl = $(".hc-details:visible");
                        if(viewEl[0]){
                            viewEl.css({display: 'table'});
                            viewEl[0].scrollIntoView();
                        }
                    }, 100);
                }
            }
        });
    }

    openModal(section) {
        if(!this.state.modalIsOpen) this.setState({modalIsOpen: true, section: section});
    }

    closeModal() {
        this.setState({modalIsOpen: false, section: ""});
        
        if(this.state.section.type == "task_list"){
            TaskList.destroyTasklistComponent("modal-content-container");
        }
    }
    
    getSelections(data, selectionType, selectionVal){
        var newSelections = {}
        if(selectionVal !== ''){
            let colStringVal = selectionVal.replace(/[0-9]/g, ''),
                rowVal = Number(selectionVal.replace(/\D/g, ''))-1,
                colVal = this.lettersToNumber(colStringVal),
                tolRow = 0,
                tolCol = 0;
            switch(selectionType){
                case "ROW":
                    tolRow = 1;
                    tolCol = 1000;
                break;
                case "ROWRANGE":
                    rowVal = Number(selectionVal.split(':')[0])-1;
                    colVal = -1;
                    tolRow = (Number(selectionVal.split(':')[1]-selectionVal.split(':')[0]))+1;
                    tolCol = 1000;
                break;
                case "COLUMN":
                    tolRow = 1000;
                    tolCol = 1;
                break;
                case "COLUMNRANGE":
                    var rangeVal1 = selectionVal.split(':')[0];
                    var rangeVal2 = selectionVal.split(':')[1];
                    rowVal = -1;
                    colVal = this.lettersToNumber(rangeVal1);
                    tolRow = 1000;
                    tolCol = (Number(this.lettersToNumber(rangeVal2)-colVal)+1);
                break;
                case "CELL":
                    tolRow = 1;
                    tolCol = 1;
                break;
                case "CELLRANGE":
                    let rangeValueArr = selectionVal.split(':'),
                        colStringVal1 = rangeValueArr[0].replace(/[0-9]/g, ''),
                        rowVal1 = Number(rangeValueArr[0].replace(/\D/g, ''))-1,
                        colVal1 = this.lettersToNumber(colStringVal1);
                    
                    let colStringVal2 = rangeValueArr[1].replace(/[0-9]/g, ''),
                        rowVal2 = Number(rangeValueArr[1].replace(/\D/g, ''))-1,
                        colVal2 = this.lettersToNumber(colStringVal2);
                    
                    rowVal = rowVal1;
                    colVal = colVal1;
                    tolRow = (rowVal2-rowVal1)+1;
                    tolCol = (colVal2-colVal1)+1;
                break;
                case "SHEET":
                    rowVal = -1;
                    colVal = -1;
                    tolRow = 1000;
                    tolCol = 1000;
                break;
            }
            newSelections = {
                0: {
                    row: rowVal,
                    rowCount: tolRow,
                    col: colVal,
                    colCount: tolCol
                }
            }
        }
        
        var ssData;
        try {
            ssData = JSON.parse(data);
        } catch(e){
            ssData = data;
        }
        
        if(ssData && ssData.sheets && ssData.sheets[Object.keys(ssData.sheets)[0]]){
            ssData.sheets[Object.keys(ssData.sheets)[0]].selections = newSelections;
        }
        return JSON.stringify(ssData);
    }

    lettersToNumber(letters){
        var chrs = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ', mode = chrs.length - 1, number = 0;
        for(var p = 0; p < letters.length; p++){
            number = number * mode + chrs.indexOf(letters[p]);
        }
        return number-1;
    }

    configSectionModal(){
        var section = this.state.section,
            sectionHTML = null,
            downloadBtnHTML = null,
            modalCSS = customStyles;

        if(section.type == "rich_text"){
            sectionHTML = <div className="reset-css comment-text" dangerouslySetInnerHTML={{__html: section.sectionContent}} />
        }else if(section.type == "file" && section.fileSectionState == "BOUND"){
            modalCSS = customStylesForFile;
            sectionHTML = <div className="reset-css comment-text">
                <img src={"data:application/octet-stream;charset=utf-16le;base64," + section.sectionContent} />
            </div>
            downloadBtnHTML = <div onClick={this.downloadFile.bind(this, section.fileSectionOriginalName, section.sectionContent)} className="fr download-s"></div>;
        }else if(section.type == "file" && section.fileSectionState == "UNBOUND"){
            modalCSS = customStylesForFile;
            sectionHTML = <div className="reset-css comment-text" dangerouslySetInnerHTML={{__html: section.sectionContent}} />
        }else if(section.type == "form"){
            setTimeout(() => {
                Form.getFormSection('modal-content-container', 'modal-content-container', JSON.parse(section.sectionContent), "read", false);
            }, 500);
            sectionHTML = "loading...";
        }else if(section.type == "spreadsheet"){
            setTimeout(() => {
                section.sectionContent = section.sectionContent.split("/common-static/spreadJs/css/images/lock-icon.png").join("plugins/spreadjs/lock-icon.png");

                var isLinkClicked = false;
                if(section.selectionType && section.selectionVal) {
                    isLinkClicked = true;
                    var ssData = this.getSelections(section.sectionContent, section.selectionType, section.selectionVal);
                } else {
                    var ssData = section.sectionContent;
                }

                window.onLoadInitializeSpreadSheet("modal-content-container", ssData, isLinkClicked, process.env.npm_package_config_SPREADJS_LICENSE);
            }, 500);
            sectionHTML = <span className='modal-content-container-span'>loading...</span>;
        }else if(section.type == "task_list"){
            var writers = (this.data.writers ? this.data.writers : this.data.addedWriters),
                ttn = this.data.ttn,
                secnum = section.sectionNum,
                cnum = section.version,
                json = JSON.parse(section.sectionContent);
            json.mode = "read";

            var obj = {
                data: json,
                divId: "modal-content-container",
                writers: writers,
                favWriters: [],
                currentUser: writers[0],
                tmailNum: ttn,
                secNum: secnum,
                changeNum: cnum,
                isChecklist: ( this.data.threadType == "Template" ? true : false)
            }

            if(section.tasknum){
                obj.taskNum = section.tasknum;
                obj.expandTask = true;
            }

            setTimeout(function(){
                if(TaskList && TaskList.data && Object.keys(TaskList.data).length > 0){
                    TaskList.destroyTasklistComponent("modal-content-container");
                    TaskList.data = {};
                }
                TaskList.loadSection(obj);
            }, 500);
            sectionHTML = "loading...";
        }else{
            sectionHTML = <div className="information-message">Section not supported.</div>
        }
        return (
            <Modal
                isOpen={this.state.modalIsOpen}
                onRequestClose={this.closeModal}
                shouldCloseOnOverlayClick={false}
                style={modalCSS}
                ariaHideApp={false}
                contentLabel="Section Modal">
                <div className={(section.type == "file" ? "modal-file-container" : "modal-container")}>
                    <div className="modal-header">
                        <div className="fl modal-section-title">{section.title+' at v'+section.version}</div>
                        <div className="fr btn-close" onClick={this.closeModal} />
                        {downloadBtnHTML}
                    </div>
                    <div id="modal-content-container" className="modal-content">
                        {sectionHTML}
                    </div>
                </div>
            </Modal>
        );
    }

    bifTmailAddress(address){
		if(-1 == address.indexOf('$')){ //no extension
			var prefix = '';
			var domain = '';
		} else {
			var prefix = address.substring(0,address.lastIndexOf('$'));
			var domain = address.substring(address.lastIndexOf('$')+1);
		}
		return {prefix:prefix, domain:domain};
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
    
    getsectionTypeMap(type, sectionType){
        switch(type){
            case "sectionTypeCssMap":
                switch(sectionType){
                    case "rich_text":
                        return "t-text";
                    break;
                    case "file":
                        return "t-file";
                    break;
                    case "grid":
                        return "t-grid";
                    break;
                    case "spreadsheet":
                        return "t-spreadsheet";
                    break;
                    case "form":
                        return "t-form";
                    break;
                    case "task_list":
                        return "t-tasklist";
                    break;
                }
            break;
            case "sectionTypeTitleMap":
                switch(sectionType){
                    case "rich_text":
                        return "Text";
                    break;
                    case "file":
                        return "File";
                    break;
                    case "grid":
                        return "Grid";
                    break;
                    case "spreadsheet":
                        return "Spreadsheet";
                    break;
                    case "form":
                        return "Form";
                    break;
                    case "task_list":
                        return "Task List";
                    break;
                }
            break;
        }
    }

    urlify(text) {
		// need a wrapper
		text = "<div>"+text+"</div>";
		
		var t = $.parseHTML(text);
		$(t).each(function() {
			$(this).find("a, img, iframe").each(function() {
				var src = $(this).attr("src");
				var href = $(this).attr("href");
				
				if(undefined != src){
					var replacedSrc = src.replace(/(^\w+:|^)\/\//, 'http://');
					$(this).attr("src", replacedSrc);
				}
				
				if(undefined != href){
					var replacedHref = href.replace(/(^\w+:|^)\/\//, 'http://');
                    $(this).attr("href", "#");
                    $(this).attr("onClick","window.require('electron').shell.openExternal('" + replacedHref + "')");
				}
			});
		});
		return t[0].innerHTML.toString();
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

    // create excel sheet from json
    writeAsExcel(json, cb) {
        // set saved path
        var rootSavedPath = Constants.default.evidenceFolder+'data.xlsx';
        
        var columns = 10,
            rows = 15,
            rowHeight = json.default_row_height,
            colWidth = json.default_col_width,
            formatStack = json.format_stack,
            data = json.data,
            dataLength = data ? data.length : 0;

        if(json.rightmost_col_with_data && json.rightmost_col_with_data > 10)
            columns = json.rightmost_col_with_data;

        if(json.bottommost_row_with_data && json.bottommost_row_with_data > 15)
            rows = json.bottommost_row_with_data;

        // Create a new instance of a Workbook class
        var workbook = new excelbuilder.Workbook();

        // Add Worksheets to the workbook
        var worksheet = workbook.addWorksheet('Sheet 1');

        // Create a reusable style
        var style = workbook.createStyle({
            defaultFont: {
                color: '#000000',
                size: 12
            }
        });

        // Fill some data
        if(dataLength > 0)
            for (var i = 0; i < dataLength; i++){
                // set data for specific column and row
                worksheet.cell(data[i][1]+1, data[i][0]+1).string(data[i][2]).style(style);
            }

        // set changed column width
        if(json.columns && json.columns.length > 0)
            for (var i = 0; i < json.columns.length; i++){
                worksheet.column(json.columns[i][0]+1).setWidth(json.columns[i][1]/7)
            }
        
        // set changed row height
        if(json.rows && json.rows.length > 0)
            for (var i = 0; i < json.rows.length; i++){
                worksheet.row(json.rows[i][0]+1).setHeight(json.rows[i][1]);
            }
        
        // set columns n rows format
        if(formatStack && formatStack.length > 0){
            formatStack = formatStack.sort(function(a,b){
                if (a[0] < b[0]) return -1;
                if (a[0] > b[0]) return 1;
                return 0;
            }).reverse();

            for (var i = 0; i < formatStack.length; i++){
                var setFormat = function(col, row, prop, val){
                    var obj = "";
                    if (prop == "wrapModeProperty") {
                        obj = { alignment: { wrapText: true, horizontal: 'center' } };
                    } else if (prop == "fontBoldProperty") {
                        obj = { font: { bold: true } };
                    } else if (prop == "fontItalicProperty") {
                        obj = { font: { italics: true } };
                    } else if (prop == "fontUnderlineProperty") {
                        obj = { font: { underline: true } };
                    } else if (prop == "wrapStrikeThroughProperty") {
                        obj = { font: { strike: true } };
                    } else if (prop == "fontFontFamilyProperty") {
                        obj = { font: { name: val } };
                    } else if (prop == "fontBGColorProperty") {
                        val = val.substring(2);

                        val = val.length == 1 ? val.repeat(6) : val;
                        val = val.length == 2 ? val.repeat(3) : val;
                        val = val.length == 3 ? val.repeat(2) : val;

                        obj = { fill: { type: 'pattern', patternType: 'solid', fgColor: val } };
                    } else if (prop == "fontFontColorProperty") {
                        val = val.substring(2);

                        val = val.length == 1 ? val.repeat(6) : val;
                        val = val.length == 2 ? val.repeat(3) : val;
                        val = val.length == 3 ? val.repeat(2) : val;
                        
                        obj = { font: { color: val.toString() } };
                    } else if (prop == "fontFontSizeProperty") {
                        obj = { font: { size: Number(val) } };
                    }

                    col = Number(col)+1;
                    row = Number(row)+1;
                    try{
                        if(obj != "")
                            worksheet.cell(col, row).style(workbook.createStyle(obj));
                    }catch(e){
                        console.log("Error: , ", e);
                    }
                }

                if (formatStack[i][0] == "row") {
                    var jLen = columns < 50 ? 50 : columns+20;
                    for(var j=0; j<jLen;j++){
                        setFormat(formatStack[i][1], j, formatStack[i][2], formatStack[i][3]);
                    }
                }else{
                    setFormat(formatStack[i][2], formatStack[i][1], formatStack[i][3], formatStack[i][4]);
                }
            }
        }
        // Save it
        workbook.write(rootSavedPath, function (err, stats) {
            if (err) {
                console.error(err);
            }  else {
                var sectionContent = FileSystem.readFileSync(rootSavedPath).base64Slice();

                // again remove the file
                FileSystem.unlinkSync(rootSavedPath);

                cb(sectionContent);
            }
        });
    }

    viewSection(section, event){
        var me = this,
            te = $(event.target)

        // read incremental change num zip without extreact
        const zip = new StreamZip({
            file: Constants.default.extractedEvidenceFolder+section.zipEntryName,
            storeEntries: true
        });

        var bufferData = null;
        zip.on('ready', () => {
            if(section.type == 'file' && section.fileSectionState == "BOUND"){
                var ext = this.bifFileName(section.fileSectionOriginalName).ext,
                    fpath = "sections/"+section.sectionLeafHash+"."+ext;
            }else if(section.type == 'file' && section.fileSectionState == "UNBOUND"){
                var sectionContent = "No file associated.";
                section.sectionContent = sectionContent;
                this.openModal(section);

                zip.close();
                return false;
            }else{
                var fpath = "sections/"+section.sectionLeafHash+".txt";
            }
            try {
                bufferData = zip.entryDataSync(fpath);
            } catch(e) {
                console.log("Error", e);
            }
            
            if(bufferData != null){
                // convert buffer data into string (utf-8)
                if(section.type == 'file'){
                    var sectionContent = bufferData.base64Slice();
                }else if(section.type == 'grid'){
                    // convert bufferd data into json
                    var dataJson = bufferData.toString('utf-8');
                    try{
                        dataJson = JSON.parse(dataJson);
                    }catch(e){
                        swal("We're Sorry: File could not be displayed. This may be because the file was tampered with or has been corrupted. Please click \"Prove\" to detect if there was any tampering.");
                        zip.close();
                        return false;
                    }

                    // call function to convert json into excel file
                    this.writeAsExcel(dataJson, function(r){
                        // download the file
                        me.downloadFile(section.title+".xlsx", r);
                    });
					zip.close();
                    return false;
                }else{
                    var sectionContent = bufferData.toString('utf-8');
                    sectionContent = (section.type == "task_list") ? sectionContent : this.urlify(sectionContent);
                }

                if(section.type == "task_list"){
                    if(te && te.parents(".section-el") && te.parents(".section-el").find("a")[0]){
                        section.tasknum = te.parents(".section-el").find("a")[0].getAttribute("data-tasknum");
                        
                        // should remove attr after get value
                        te.parents(".section-el").find("a")[0].removeAttribute("data-tasknum");
                    }
                } else if(section.type == "spreadsheet"){
                    if(te){
                        try {
                            section.selectionType = te.parents(".-comment-section-container")[0].getAttribute("data-selectiontype");
                            section.selectionVal = te.parents(".-comment-section-container")[0].getAttribute("data-selectionval");
                            
                            // should remove attr after get value
                            for(var i=0; i<$(".-comment-section-container").length; i++){
                                $(".-comment-section-container")[i].removeAttribute("data-selectiontype");
                                $(".-comment-section-container")[i].removeAttribute("data-selectionval");
                            }
                        } catch(e) {
                            if(te.parents(".section-el") && te.parents(".section-el").find("a")[0]){
                                section.selectionType = te.parents(".section-el").find("a")[0].getAttribute("data-selectiontype");
                                section.selectionVal = te.parents(".section-el").find("a")[0].getAttribute("data-selectionval");
                            }
                        }
                    }
                }

                section.sectionContent = sectionContent;
                this.openModal(section);
            }
            zip.close();
        });
    }

    downloadFile(filename, content){
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
    
    viewFile(section){
        // read incremental change num zip without extreact
        const zip = new StreamZip({
            file: Constants.default.extractedEvidenceFolder+section.zipEntryName,
            storeEntries: true
        });

        var bufferData = null;
        zip.on('ready', () => {
            try {
                var ext = this.bifFileName(section.fileSectionOriginalName).ext,
                    fname = "sections/"+section.sectionLeafHash+"."+ext;

                bufferData = zip.entryDataSync(fname);
            } catch(e) {
                console.log("Error", e);
            }

            if(bufferData != null){
                // convert buffer data into string (utf-8)
                var manifestJson = bufferData.base64Slice();
                this.downloadFile(section.fileSectionOriginalName, manifestJson);
            }
            zip.close();
        });
    }
    
    getSections(sections){
        if(sections && sections.length > 0){
            var sectionHTML = sections.map( (section, i) => {
				var sectionTypeCls = this.getsectionTypeMap("sectionTypeCssMap", section.type),
				    sectionTypeTitle = this.getsectionTypeMap("sectionTypeTitleMap", section.type),
                    fileTypeIconCls = "", templateSectionColor = '';
                
                if(section.fromTemplate || section.isTemplateDescription){
                    templateSectionColor = 'templateSectionColor';
                }

                var actionFunc = this.viewSection.bind(this, section);

				if(section.type == 'file'){
					if(section.fileSectionState == 'BOUND'){
                        var fileExt = this.bifFileName(section.fileSectionOriginalName).ext;
						sectionTypeTitle = 'File of type '+fileExt;
                        fileTypeIconCls =  't-file-icon-16 t-file-icon-16-'+fileExt;
                        
                        if(!this.checkViewableFile(fileExt)){
                            actionFunc = this.viewFile.bind(this, section);
                        }
					}else{
						sectionTypeTitle = 'Empty File Section';
						fileTypeIconCls =  't-file-icon-16 t-file-icon-16-no-file';
					}
				}
                
                if(this.type == "list"){
                    return (
                        <div data-section-title={section.title} key={"section-el-"+i+"-"+this.type} className={"section-el "+templateSectionColor}>
                            <span className={sectionTypeCls+" "+fileTypeIconCls+" icon16x16 fl"} title={sectionTypeTitle}></span>
                            <a data-section-title={section.title} data-section-type={section.type} data-sectionnum={section.sectionNum} data-version={section.version} data-changenum={this.changeNum} title={section.title}>
                                <div onClick={actionFunc} className="fl section-title">{section.title}</div>
                            </a>
                        </div>
                    );
                }else{
                    switch(section.sectionChangeType){
                        case 'unchanged':
                        case 'added':
                            return (
                                <div data-changenum={this.changeNum} data-section-type={section.type} data-sectionnum={section.sectionNum} data-version={section.version} data-section-title={section.title} className={"-comment-section-container "+templateSectionColor} key={"section-container-"+i}>
                                    <div className="-comment-section-action"> 
                                        <span className="t-add icon16x16" title="Created" style={{'marginLeft': '5px'}}></span>
                                    </div>
                                    <div className="-comment-section-tittle">
                                        <div className="-comment-section-icon">
                                            <span className={sectionTypeCls+' '+fileTypeIconCls+' icon16x16 left'} title={sectionTypeTitle}></span>
                                        </div>
                                        <div onClick={actionFunc} className="section-title">{section.title}</div>
                                    </div>
                                </div>
                            );
                        break;
                        case 'updated':
                            var titleCls = '';
                            var titleTooltip = '';
                            return (
                                <div data-changenum={this.changeNum} data-section-type={section.type} data-sectionnum={section.sectionNum} data-version={section.version} data-section-title={section.title} className={"-comment-section-container "+templateSectionColor} key={"section-container-"+i}>
                                    <div className="-comment-section-action">
                                        <span className="t-changed icon16x16" title="Updated" style={{'marginLeft': '5px'}}></span>
                                    </div>
                                    <div className="-comment-section-tittle">
                                        <div className="-comment-section-icon">
                                            <span className={sectionTypeCls+' '+fileTypeIconCls+' icon16x16 left'} title={sectionTypeTitle}></span>
                                        </div>
                                        <div onClick={actionFunc} className="section-title">{section.title}</div>
                                    </div>
                                </div>
                            );
                        break;
                        case 'deleted':
                            return (
                                <div data-changenum={this.changeNum} data-section-type={section.type} data-sectionnum={section.sectionNum} data-version={section.version} data-section-title={section.title} className={"-comment-section-container "+templateSectionColor} key={"section-container-"+i}>
                                    <div className="-comment-section-action">
                                        <span className="t-deleted icon16x16" style={{'marginLeft': '5px'}}></span>
                                    </div> 
                                    <div className="-comment-section-tittle">
                                        <div className="-comment-section-icon">
                                            <span className={sectionTypeCls+' '+fileTypeIconCls+' icon16x16 left'} title={sectionTypeTitle}></span>
                                        </div>
                                        <div className="disable-section-title">{section.title}</div>
                                    </div>
                                </div>
                            );
                        break;
                        default:
                            return null;
                    }
                }
            });

            return (
                <div className="section-container">
                    {sectionHTML}
                </div>
            )
        }else{
            return null;
        }
    }
	
	render() {
        var sections = this.sections;
        return (
            <div>
                {this.getSections(sections)}
                {this.configSectionModal()}
            </div>
        );
	}
}