const {remote} = window.require('electron');
const appPath = remote.app.getAppPath();
export function getModulePath(module, v) {
	return appPath+"/app/js/components/Thread/js/components/"+module;
}

export const comments = {
	hashValue: (window.parent.hashValue ? window.parent.hashValue : ""),
	ttnURL: '',
	ttn: '',
	data: '',
	openInAppLinks: function(link, ttn){
		// get hash value from link and set globally to acess
		var h = link.split('#') ? link.split('#')[1] : '';
		if(h != ''){
			window.parent.hashValue = this.hashValue = '#'+h;
		}
		this.renderView();
	},
	isLinkOnSameDomain: function(link){
		var host = this.ttnURL.match(/^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i)[1],
			comp = new RegExp(host);
	
		if(comp.test(link)){
			// a link that contains the current host           
			return true;
		} else {
			// a link that does not contain the current host
			return false;
		}
	},
	urlify: function(text) {
		// need a wrapper
		var me = this;
		text = "<div>"+text+"</div>";
		
		var t = $.parseHTML(text);
		$(t).each(function() {
			$(this).find("a").each(function() {
				var href = $(this).attr("href");
				
				if(undefined != href && href.split("#")){
					href = href.split("#")[0];
					var isSameDomain = me.isLinkOnSameDomain(href),
						isSameThread = ( (href.contains ? href.contains(me.ttn) : href.includes(me.ttn)) ? true : false),
						inAppClass = isSameDomain ? (isSameThread ? "in-same-domain in-same-thread" : "in-same-domain in-other-thread") : "not-in-same-domain",
						copiedLinkTTN = href.match(/\d{3}\-\d{4}\-\d{4}/g),
						copiedLinkTTN = copiedLinkTTN ? copiedLinkTTN[0] : '',
						threadttn = (isSameThread) ? "" : copiedLinkTTN;
					
					if(!$(this).attr("data-meta-data")){
						var anchorHtml = $(this).html();
						
						$(this).attr("data-meta-data", anchorHtml);
						$(this).attr("data-type-anchor", true);
						
						var splitHash = anchorHtml.split("#");
						if(splitHash[1]){
							var HashTypeArr = splitHash[1].split("="),
								type = HashTypeArr[0],
								val = HashTypeArr[1],
								fwdTTN = '', val2 = '';
							if(val && val.match(/\d{3}\-\d{4}\-\d{4}/g)){
								var splitFwdArr = val.split(":");
								fwdTTN = splitFwdArr[0];
								val = splitFwdArr[1];
								val2 = splitFwdArr[2];
							}

							var threadttn4 = "", fullThreadttn = "";
							if(threadttn != ""){
								threadttn4 = " in "+threadttn.split('-')[2];
								fullThreadttn = ' ('+threadttn+')';
							}

							switch(type){
								case "comment":
									$(this).attr("title", 'COMMENT ' +val+fullThreadttn);
									$(this).html('COMMENT ' +val+threadttn4);
								break;
								case "section":
									$(this).attr("title", me.htmlEncode('SECTION ' +val+fullThreadttn));
									$(this).html("SECTION "+val+threadttn4);
								break;
								case "task":
									var TaskValArray = val.split(":");

									$(this).attr("title", me.htmlEncode("TASK "+TaskValArray[1]+" in SECTION "+TaskValArray[0]+fullThreadttn));
									$(this).html("TASK "+TaskValArray[1]+" in SECTION "+TaskValArray[0]+threadttn4);
								break;
								case "attachment":
									var AttachmentValArray = val.split(":");
									
									$(this).attr("title", me.htmlEncode("ATTACHMENT "+AttachmentValArray[1]+" in COMMENT "+AttachmentValArray[0]+fullThreadttn));
									$(this).html("ATTACHMENT "+AttachmentValArray[1]+" in COMMENT "+AttachmentValArray[0]+threadttn4);
								break;
								case "sectionversion":
									$(this).attr("title", me.htmlEncode("SECTION VERSION "+val+fullThreadttn));
									$(this).html("SECTION VERSION "+val);
								break;
								case "release":
									$(this).html("RELEASE "+val);
								break;
								case "forwarded-comment":
									$(this).attr("title", me.htmlEncode("FORWARDED COMMENT "+val+" in "+fwdTTN+fullThreadttn));
									$(this).html("FORWARDED COMMENT "+val+" in "+fwdTTN+threadttn4);
								break;
								case "forwarded-section":
									$(this).attr("title", me.htmlEncode("FORWARDED SECTION "+val+" in "+fwdTTN+fullThreadttn));
									$(this).html("FORWARDED SECTION "+val+" in "+fwdTTN+threadttn4);
								break;
								case "forwarded-task":
									$(this).attr("title", me.htmlEncode("FORWARDED TASK "+val+" in SECTION "+val2+" in "+fwdTTN+fullThreadttn));
									$(this).html("FORWARDED TASK "+val+" in SECTION "+val2+" in "+fwdTTN+threadttn4);
								break;
								case "forwarded-attachment":
									$(this).attr("title", me.htmlEncode("FORWARDED ATTACHMENT "+val+" in COMMENT "+val2+" in "+fwdTTN+fullThreadttn));
									$(this).html("FORWARDED ATTACHMENT "+val+" in COMMENT "+val2+" in "+fwdTTN+threadttn4);
								break;
							}
						}else if(anchorHtml.match(/ttn\/\d{3}\-\d{4}\-\d{4}/g)){
							$(this).attr("title", "THREAD "+copiedLinkTTN);
							$(this).html("THREAD "+copiedLinkTTN);
						}else if(anchorHtml.match(/tmail\/\d{3}\-\d{4}\-\d{4}/g)){
							$(this).attr("title", "THREAD "+copiedLinkTTN);
							$(this).html("THREAD "+copiedLinkTTN);
						}
					}

					$(this).addClass(inAppClass);
					$(this).attr("data-same-thread", isSameThread);

					if(isSameDomain){
						$(this).attr("data-ttn", copiedLinkTTN);
					}
				}
			});
		});
		return t[0].innerHTML.toString();
	},
	htmlEncode: function(value){
		return escape(value);
	},
	htmlDecode: function(value){
		return unescape(value);
	},
    stripEndQuotes: function(s) {
        var t=s.length;
        try {
            s = s.replace(/"/g, '&quot;');
            if(s.split("titled")[1]) {
                s = s.replace('&quot; in &quot;', '" in "');
            }
            s = s.replace("&quot;", '"');
            s = s.substring(1, s.length-6)+'"';
        } catch(e) {
            console.log("e", e);
        }
        return s;
    },
	replaceURLContent: function(v, ttn){
		var me = this;
		if(v == "" || v == undefined || v == null || v == "undefined" || v == "null") return "";
		
		this.ttn = ttn;
		v = v.replace(/\s\s+/g, ' ');
		v = v.replace(/[\n\r]+/g, ' ');

		v.replace(/\[(.+?)\]/g, function($0, $1) {
			var splitArr = [],
				lastIndex = $1.lastIndexOf(",");

			splitArr[0] = $1.substring(0, lastIndex);
			splitArr[1] = $1.substring(lastIndex + 1);
			
			var message = splitArr[0].trim().split(" "),
				url = splitArr[1] ? splitArr[1].trim() : '',
				href = url.match(/href="([^"]*)/) ? url.match(/href="([^"]*)/)[1] : url,
				type = (message[0].length <= 2 && message[1] ? message[1] : message[0]),
				title = '',
				fwdTTN = 0, 
				version = 0, 
				changenum = 0, 
				val = message[1],
				val2 = message[2];
			
			// should return same value if href/url not found
			if(href == '') return v;

            var replacedArr = me.stripEndQuotes(splitArr[0]);
            var match = replacedArr.match(/"([^"]*)"/);
            // var match = splitArr[0].replace(/&quot;/g, '"').match(/"([^"]*)"/);
            if (match) {
                title = match[1].replace(/&quot;/g, '"');
                try {
                    title = title.split('" in THREAD "')[0];
                } catch(e) {
                    console.log("e", e);
                }
            }

			var copiedLinkTTN = href.match(/\d{3}\-\d{4}\-\d{4}/g);
			copiedLinkTTN = copiedLinkTTN ? copiedLinkTTN[0] : '';
			
			var isSectionVersion = false,
				isSSSectionVersion = false;
			if(splitArr[0].match("at VERSION") ){
				isSectionVersion = true;
				version = splitArr[0].match("at VERSION (.*?) in")[1];
			}

            if(type === 'CELL' || type === 'ROW' || type === 'COLUMN' || type === 'CELLRANGE' || type === 'ROWRANGE' || type === 'COLUMNRANGE' || type === 'SHEET' || val === 'CELL' || val === 'ROW' || val === 'COLUMN' || val === 'CELLRANGE' || val === 'ROWRANGE' || val === 'COLUMNRANGE' || val === 'SHEET'){
                if(isSectionVersion){
                    isSectionVersion = false;
                    isSSSectionVersion = true
                }
            }

			var inThreadSubject = "";
			if(splitArr[0].match(" in THREAD &quot(.*?)&quot")){
				inThreadSubject = splitArr[0].match(" in THREAD &quot(.*?)&quot")[0];
			}else if(splitArr[0].match(" of THREAD &quot(.*?)&quot")){
				inThreadSubject = splitArr[0].match(" of THREAD &quot(.*?)&quot")[0];
			}
			
			if(splitArr[0].match("in FORWARDED COMMENT") ){
				var cnumArr = "";
				if(splitArr[0].match("in FORWARDED COMMENT (.*?) in") != null){
					cnumArr = splitArr[0].match("in FORWARDED COMMENT (.*?) in");
				}else if(splitArr[0].match("in FORWARDED COMMENT (.*?)in") != null){
					cnumArr = splitArr[0].match("in FORWARDED COMMENT (.*?)in");
				}else if(splitArr[0].match("in FORWARDED COMMENT(.*?) in") != null){
					cnumArr = splitArr[0].match("in FORWARDED COMMENT(.*?) in");
				}else if(splitArr[0].match("in FORWARDED COMMENT(.*?)in") != null){
					cnumArr = splitArr[0].match("in FORWARDED COMMENT(.*?)in");
				}
				changenum = cnumArr ? cnumArr[1] : "";
			}

			if(type == 'FORWARDED'){
				type = type+" "+val;
				if(isSectionVersion) type = "FORWARDED SVERSION";

				var splitHashArr = $1.split("#") ? ($1.split("#")[1].split("=") ? $1.split("#")[1].split("=")[1] : "") : "";
				if(splitHashArr != ""){
					fwdTTN = splitHashArr.split(":") ? splitHashArr.split(":")[0] : '';
				}
			}else{
				if(isSectionVersion) type = "SVERSION";
			}

			var isSameThread = ( (href.contains ? href.contains(ttn) : href.includes(ttn)) ? true : false),
				threadttn = (isSameThread) ? "" : (fwdTTN != '' && fwdTTN != 0 ? fwdTTN : copiedLinkTTN);
			
			if(isSameThread) inThreadSubject = "";

			var threadttn4 = "", fullThreadttn = "";
			if(threadttn != ""){
				//threadttn4 = " in "+threadttn.split('-')[2];
				//fullThreadttn = ' ('+threadttn+')';
				threadttn4 = " in "+copiedLinkTTN;
				fullThreadttn = '';
			}

			switch(type){
				case "THREAD":
					var showedText = 'THREAD "' +title+ '"',
						showedTextinTooltip = 'THREAD "' +title+ '" '+fullThreadttn,
						link = '<a data-meta-data="'+me.htmlEncode($0)+'" href="'+href+'" class="tooltip"><span>'+showedTextinTooltip+'</span>'+showedText+'</a>';
					v = v.replace($0, link);
				break;
				case "COMMENT":
					var showedText = 'COMMENT ' +val+threadttn4,
						showedTextinTooltip = 'COMMENT ' +val+inThreadSubject+fullThreadttn,
						link = '<a data-meta-data="'+me.htmlEncode($0)+'" href="'+href+'" class="tooltip"><span>'+showedTextinTooltip+'</span>'+showedText+'</a>';
					v = v.replace($0, link);
				break;
				case "SECTION":
					var showedText = 'SECTION "'+title+'"'+threadttn4,
						showedTextinTooltip = 'SECTION "'+title+'"'+inThreadSubject+fullThreadttn,
						link = '<a data-meta-data="'+me.htmlEncode($0)+'" href="'+href+'" class="tooltip"><span>'+showedTextinTooltip+'</span>'+showedText+'</a>';
					v = v.replace($0, link);
				break;
				case "SVERSION":
					var showedText = 'SECTION "'+title+'" at VERSION '+version+threadttn4,
						showedTextinTooltip = 'SECTION "'+title+'" at VERSION '+version+inThreadSubject+fullThreadttn,
						link = '<a data-meta-data="'+me.htmlEncode($0)+'" href="'+href+'" class="tooltip"><span>'+showedTextinTooltip+'</span>'+showedText+'</a>';
					v = v.replace($0, link);
				break;
				case "TASK":
					var isNewTaskItemLink = splitArr[0].split("titled")[1];
					var tsectitleArr = splitArr[0].replace(/&quot;/g, '"').match(/"([^"]*)"/g),
						tsectitle = '"'+title+'"',
						hoverTitle = "", titledText = "";
					if( tsectitleArr && isNewTaskItemLink ) {
						tsectitle = tsectitleArr[1];
                        if(tsectitle.replace(/"/g, '') === '') {
                            try {
                                var tsectitlearr = splitArr[0].match("&quot; in &quot;(.*?)&quot; in THREAD &quot;");
                                if(tsectitlearr === null){
                                    tsectitlearr = splitArr[0].match('" in "(.*?)" in THREAD "');
                                }
                                tsectitle = '"'+tsectitlearr[1]+'"';
                            } catch(e) {

                            }
                        }
						titledText = ' titled "'+title.replace(/(^.{30}).*$/,'$1...')+' "';
						hoverTitle = ' titled "'+me.htmlEncode(title);
					}
					
					var showedText = 'TASK '+val+titledText+' in SECTION '+tsectitle+threadttn4,
						showedTextinTooltip = 'TASK '+val+hoverTitle+' in SECTION '+tsectitle+inThreadSubject+fullThreadttn,
						link = '<a data-meta-data="'+me.htmlEncode($0)+'" href="'+href+'" class="tooltip"><span>'+showedTextinTooltip+'</span>'+showedText+'</a>';
					
					v = v.replace($0, link);
				break;
                case "CELL":
                case "ROW":
                case "COLUMN":
                case "CELLRANGE":
                case "ROWRANGE":
                case "COLUMNRANGE":
                case "SHEET":
                    if(type === 'CELLRANGE'){
                        type = 'CELL RANGE';
                    } else if(type === 'ROWRANGE'){
                        type = 'ROW RANGE';
                    } else if(type === 'COLUMNRANGE'){
                        type = 'COLUMN RANGE';
                    }
                    var atVersionText = (isSSSectionVersion) ? ' at VERSION '+version : ''
                    var showedText = type+' ' + val + atVersionText + ' in SECTION "' + title + '"' + threadttn4,
                        showedTextinTooltip = type+' ' + val + atVersionText + ' in SECTION "' + title + '"' + inThreadSubject + fullThreadttn,
                        link = '<a data-meta-data="' + me.htmlEncode($0) + '" href="' + href + '" qtip="' + showedTextinTooltip + '">' + showedText + '</a>';

                    v = v.replace($0, link);
				break;
				case "ATTACHMENT":
					var cmtNum = (splitArr[0].match("COMMENT (.*) of") ? splitArr[0].match("COMMENT (.*) of") : splitArr[0].match("comment (.*) of"))[1].trim();

					var showedText = 'ATTACHMENT "'+title+'" in COMMENT '+cmtNum+threadttn4,
						showedTextinTooltip = 'ATTACHMENT "'+title+'" in COMMENT '+cmtNum+inThreadSubject+fullThreadttn,
						link = '<a data-meta-data="'+me.htmlEncode($0)+'" href="'+href+'" class="tooltip"><span>'+showedTextinTooltip+'</span>'+showedText+'</a>';
					v = v.replace($0, link);
				break;
				case "FORWARDED COMMENT":
					var showedText = 'FORWARDED COMMENT ' +val2+threadttn4,
						showedTextinTooltip = 'FORWARDED COMMENT ' +val2+inThreadSubject+fullThreadttn,
						link = '<a data-meta-data="'+me.htmlEncode($0)+'" href="'+href+'" class="tooltip"><span>'+showedTextinTooltip+'</span>'+showedText+'</a>';
					v = v.replace($0, link);
				break;
				case "FORWARDED SECTION":
					var commentText = changenum > 0 ? " in COMMENT "+changenum : "";
					var showedText = 'FORWARDED SECTION "'+title+'"'+commentText+threadttn4,
						showedTextinTooltip = 'FORWARDED SECTION "'+title+'"'+commentText+inThreadSubject+fullThreadttn,
						link = '<a data-meta-data="'+me.htmlEncode($0)+'" href="'+href+'" class="tooltip"><span>'+showedTextinTooltip+'</span>'+showedText+'</a>';
					v = v.replace($0, link);
				break;
				case "FORWARDED SVERSION":
					var commentText = changenum > 0 ? " in COMMENT "+changenum : "";
					var showedText = 'FORWARDED SECTION "'+title+'" at VERSION '+version+commentText+threadttn4,
						showedTextinTooltip = 'FORWARDED SECTION "'+title+'" at VERSION '+version+commentText+inThreadSubject+fullThreadttn,
						link = '<a data-meta-data="'+me.htmlEncode($0)+'" href="'+href+'" class="tooltip"><span>'+showedTextinTooltip+'</span>'+showedText+'</a>';
					v = v.replace($0, link);
				break;
				case "FORWARDED TASK":
					var isNewTaskItemLink = splitArr[0].split("titled")[1],
						tsectitleArr = splitArr[0].replace(/&quot;/g, '"').match(/"([^"]*)"/g),
						tsectitle = '"'+title+'"',
						hoverTitle = "", titledText = "";
					if( tsectitleArr && isNewTaskItemLink ) {
						tsectitle = tsectitleArr[1];
                        if(tsectitle.replace(/"/g, '') === '') {
                            try {
                                var tsectitlearr = splitArr[0].match("&quot; in &quot;(.*?)&quot; in THREAD &quot;");
                                if(tsectitlearr === null){
                                    tsectitlearr = splitArr[0].match('" in "(.*?)" in THREAD "');
                                }
                                tsectitle = '"'+tsectitlearr[1]+'"';
                            } catch(e) {

                            }
                        }
						titledText = ' titled "'+title.replace(/(^.{30}).*$/,'$1...')+' "';
						hoverTitle = ' titled "'+me.htmlEncode(title);
					}
					var commentText = changenum > 0 ? " in COMMENT "+changenum : "";
					
					var showedText = 'FORWARDED TASK '+val2+titledText+' in SECTION '+tsectitle+commentText+threadttn4,
						showedTextinTooltip = 'FORWARDED TASK '+val2+hoverTitle+' in SECTION '+tsectitle+commentText+inThreadSubject+fullThreadttn,
						link = '<a data-meta-data="'+me.htmlEncode($0)+'" href="'+href+'" class="tooltip"><span>'+showedTextinTooltip+'</span>'+showedText+'</a>';
					v = v.replace($0, link);
				break;
                case "FORWARDED CELL":
                case "FORWARDED ROW":
                case "FORWARDED COLUMN":
                case "FORWARDED CELLRANGE":
                case "FORWARDED ROWRANGE":
                case "FORWARDED COLUMNRANGE":
                case "FORWARDED SHEET":
                    if(type === 'FORWARDED CELLRANGE'){
                        type = 'FORWARDED CELL RANGE';
                    } else if(type === 'FORWARDED ROWRANGE'){
                        type = 'FORWARDED ROW RANGE';
                    } else if(type === 'FORWARDED COLUMNRANGE'){
                        type = 'FORWARDED COLUMN RANGE';
                    }
                    var atVersionText = (isSSSectionVersion) ? ' at VERSION '+version : '',
                        commentText = changenum > 0 ? " in COMMENT " + changenum : "";

                    var showedText = type+' ' + val2 + atVersionText + ' in SECTION "' + title + '"' + commentText + threadttn4,
                        showedTextinTooltip = type+' ' + val2 + atVersionText + ' in SECTION "' + title + '"' + commentText + inThreadSubject + fullThreadttn,
                        link = '<a data-meta-data="' + me.htmlEncode($0) + '" href="' + href + '" qtip="' + showedTextinTooltip + '">' + showedText + '</a>';
                    v = v.replace($0, link);
				break;
				case "FORWARDED ATTACHMENT":
					var cmtNum = (splitArr[0].match("COMMENT (.*) in") ? splitArr[0].match("COMMENT (.*) in") : splitArr[0].match("comment (.*) in"))[1].trim();

					var showedText = 'FORWARDED ATTACHMENT "'+title+'" in COMMENT '+cmtNum+threadttn4,
						showedTextinTooltip = 'FORWARDED ATTACHMENT "'+title+'" in COMMENT '+cmtNum+inThreadSubject+fullThreadttn,
						link = '<a data-meta-data="'+me.htmlEncode($0)+'" href="'+href+'" class="tooltip"><span>'+showedTextinTooltip+'</span>'+showedText+'</a>';
					v = v.replace($0, link);
				break;
			}
		});
		
		v = this.urlify(v);
		return v;
	},
	blinkElement: function(el){
		setTimeout(function(){
			$(el).addClass('blink_me_yellow');
			setTimeout(function(){
				$(el).removeClass('blink_me_yellow');
			}, 2000);
		}, 500);
	},
	scrollIntoViewIfNeeded: function(target, subEl) {
		$('.middle-container').animate({ scrollTop: ($('.middle-container').scrollTop() + $(target).offset().top-150) }, 500);

		var blinkedEl = subEl ? subEl : target;
		this.blinkElement(blinkedEl);
		return false;
	},
	limitCharacters: function(text, count){
		return text.slice(0, count) + ((text.length > count) ? "..." : "");
	},
	renderView: function(){
		var data = this.data;
		// if no hash then should not call any below functions
		if(this.hashValue == "") return false;

		var splitHash = this.hashValue.split("="),
			splitHashVal = splitHash[1];
		
		this.hashValue = "",
		window.parent.hashValue = "";
		
		switch(splitHash[0]){
			case "#comment":
			case "#forwarded-comment":
				var subType = "", tt = 0;
				if(splitHash[0] == "#forwarded-comment"){
					tt = 1000;
					subType = "forward-";
					this.viewForwardedLinks();
				}
				setTimeout(() => { this.viewComment(data, splitHashVal, subType); }, tt);
			break;
			case "#section":
			case "#forwarded-section":
				var subType = "", tt = 0;
				if(splitHash[0] == "#forwarded-section"){
					tt = 1000;
					subType = "forward-";
					this.viewForwardedLinks();
				}
				setTimeout(() => { this.viewSection(data, splitHashVal, subType); }, tt);
			break;
			case "#task":
			case "#forwarded-task":
				var subType = "", tt = 0;
				if(splitHash[0] == "#forwarded-task"){
					tt = 1000;
					subType = "forward-";
					this.viewForwardedLinks();
				}
				setTimeout(() => { this.viewTask(data, splitHashVal, subType); }, tt);
			break;
			case "#spreadsheet-selection":
			case "#forwarded-spreadsheet-selection":
				var subType = "";
				if (splitHash[0] == "#forwarded-spreadsheet-selection") {
					subType = "forward-";
					this.viewForwardedLinks();
				}
				this.viewSpreadSheetSection(data, splitHashVal, subType);
			break;
			case "#attachment":
			case "#forwarded-attachment":
				var subType = "", tt = 0;
				if(splitHash[0] == "#forwarded-attachment"){
					tt = 1000;
					subType = "forward-";
					this.viewForwardedLinks();
				}
				setTimeout(() => { this.viewAttachment(data, splitHashVal, subType); }, tt);
			break;
			case "#section-version":
			case "#forwarded-section-version":
				var subType = "", tt = 0;
				if(splitHash[0] == "#forwarded-section-version"){
					tt = 1000;
					subType = "forward-";
					this.viewForwardedLinks();
				}
				setTimeout(() => { this.viewSectionVersion(data, splitHashVal, subType); }, tt);
			break;
			case "#r":
				this.viewReleasedTemplate(data, splitHashVal);
			break;
			default:
				this.viewThread();
			break;
		}
	},
	viewThread: function(){
		$('.middle-container').animate({ scrollTop: 0 }, 500);
		this.blinkElement($(".header-lhs"));
	},
	viewForwardedLinks: function(){
		//  check if forwarded area expanded or collapsed
		if($(".forwarded-container div").hasClass("colt")){
			$(".forwarded-container div.colt")[0].click()
		}
	},
	viewComment: function(data, v, subType){
		var fwdttn = 0;
		if(subType == "forward-"){
			var valSplit = v.split(":");
			fwdttn = valSplit[0];
			v = valSplit[1];
		}

		var el = $(".tmail-comment-"+data.ttn+"-"+v);
		var url = this.ttnURL+"#"+subType+"comment="+(fwdttn ? fwdttn+":" : "")+v;
		url = "<div class='t-url-dialog-icon'></div> <span title='"+url+"'>"+url+"</span>";
		
		if(el[0]){
			this.scrollIntoViewIfNeeded(el);
		}else{
			alert("Comment "+v+" does not exist in this thread.");
		}
	},
	viewSection: function(data, v, subType){
		var fwdttn = 0,
			pEl = '',
			psEl = "div.section-el ";
		if(subType == "forward-"){
			var valSplit = v.split(":");
			fwdttn = valSplit[0];
			v = valSplit[1];

			pEl = ".forwarded-item-wrapper .section-container";
		}

		var el = $(pEl+" [data-sectionnum='"+v+"']");
		var url = this.ttnURL+"#"+subType+"section="+(fwdttn ? fwdttn+":" : "")+v
		url = "<div class='t-url-dialog-icon'></div> <span title='"+url+"'>"+url+"</span>";
		
		if(el.parents(psEl).find("a")[0]){
			this.scrollIntoViewIfNeeded(el.parents(psEl));
		}else if(el.length > 0){
			var secTitle = el[0].getAttribute("data-section-title");
			alert('Section "'+secTitle+'" is deleted.');
		}else{
			alert("Section "+v+" does not exist in this thread.");
		}
	},
    viewSpreadSheetSection: function(data, v, subType) {
        var inc = 0,
            fwdttn = 0,
            splitValArr = v.split(":");
        if (subType == "forward-") {
            fwdttn = splitValArr[0];
            inc = 1;
        }
        var secNum = Number(splitValArr[inc]),
            sectionVersion = Number(splitValArr[inc+1]),
            wnum = Number(splitValArr[inc+2]),
            selectionType = splitValArr[inc+3],
            selectionVal = splitValArr[inc+4];
        if(selectionType === 'ROWRANGE' || selectionType === 'COLUMNRANGE' || selectionType === 'CELLRANGE')
            selectionVal = selectionVal+':'+splitValArr[inc+5];

        var pEl = '';
        if (subType == "forward-") {
			pEl = ".forwarded-item-wrapper .section-container";
        }

        var el = $(pEl + " [data-sectionnum='" + secNum + "']" + "[data-version='" + sectionVersion + "']");
		this.scrollIntoViewIfNeeded($(el));

        // var url = this.ttnURL + "#" + subType + "spreadsheet-selection="+(fwdttn ? fwdttn + ":" : "") +secNum+":"+sectionVersion+":"+wnum+":"+selectionType+":"+selectionVal;
		setTimeout(() => {
			if(el.find(".section-title")[0]) {
				if (el[0].getAttribute("data-section-type") == "spreadsheet") {
					try{
						el[1].setAttribute("data-selectiontype", selectionType);
						el[1].setAttribute("data-selectionval", selectionVal);
						el.find(".section-title")[1].click();
					} catch(e) {
						el[0].setAttribute("data-selectiontype", selectionType);
						el[0].setAttribute("data-selectionval", selectionVal);
						el.find(".section-title")[0].click();
					}
				} else {
					var secTitle = el[1].getAttribute("data-section-title");
					alert('Section "' + secTitle + '" is deleted.');
				}
			} else {
				alert("Section " + secNum + " does not exist in this thread.");
			}
		}, 500);
    },
	viewTask: function(data, v, subType){
		var splitValArr = v.split(":"),
			secNum = splitValArr[0],
			taskNum = splitValArr[1];
		
		var pEl = '', fwdttn = 0,
			psEl = "div.section-el ",
			vnum = "NA",
			tmailtype = "undefined";
		if(subType == "forward-"){
			secNum = splitValArr[1],
			taskNum = splitValArr[2],
			fwdttn = splitValArr[0];

			pEl = ".forwarded-item-wrapper .section-container";
			
			this.scrollIntoViewIfNeeded($(pEl));
		}

		var el = $(pEl+" [data-sectionnum='"+secNum+"']");

		var url = this.ttnURL+"#"+subType+"task="+(fwdttn ? fwdttn+":" : "")+secNum+":"+taskNum;
		url = "<div class='t-url-dialog-icon'></div> <span title='"+url+"'>"+url+"</span>";

		if(el.parents(psEl).find("a")[0]){
			if(el[0].getAttribute("data-section-type") == "task_list"){
				if(subType == "forward-"){
					vnum = el[0].getAttribute("data-version");
				}
				tmailtype = el[0].getAttribute("data-tmailType");

				el[0].setAttribute("data-tasknum", taskNum);
				el[0].firstElementChild.click();
			}else{
				alert("Section "+secNum+" is not a Task List of Checklist type Section.");
			}
		}else{
			alert("Section "+secNum+" does not exist in this thread.");
		}
	},
	viewAttachment: function(data, v, subType){
		var splitValArr = v.split(":"),
			cNum = splitValArr[0],
			attNum = splitValArr[1];
		
		var fwdttn = 0,
			vnum = "NA",
			tmailtype = "undefined";
		if(subType == "forward-"){
			cNum = splitValArr[1],
			attNum = splitValArr[2],
			fwdttn = splitValArr[0];
		}
		
		var el = $(".tmail-comment-"+data.ttn+"-"+cNum);
		var url = this.ttnURL+"#"+subType+"attachment="+(fwdttn ? fwdttn+":" : "")+cNum+":"+attNum;
		url = "<div class='t-url-dialog-icon'></div> <span title='"+url+"'>"+url+"</span>";

		if(el){
			var attEl = el.find("div.anchor-attachment-"+attNum);
			if(attEl.length > 0){
				this.scrollIntoViewIfNeeded(el, attEl);
			}else if(el.find("div.anchor-np-attachment-"+attNum).length > 0){
				this.scrollIntoViewIfNeeded(el);
			}else{
				alert("Attachment "+attNum+" in <i>Comment</i> "+cNum+" does not exist.");
			}
		}else{
			alert("Comment "+cNum+" does not exist in this thread.");
		}
	},
	viewSectionVersion: function(data, v, subType){
		var valSplit = v.split(":");
		v = valSplit[0];
		var v1 = valSplit[1];

		var fwdttn = 0,
			pEl = '.comment-container ';
		if(subType == "forward-"){
			fwdttn = valSplit[0];
			v = valSplit[1];
			v1 = valSplit[2];

			if($(pEl+"[data-version='"+v1+"'][data-sectionnum='"+v+"']")[0] == undefined){
				pEl = ".tmail-comment-"+data.ttn+"-"+"-B";
				var cnum = $(pEl+" [data-sectionnum='"+v+"']")[0].getAttribute("data-changenum");

				var el = $(pEl+" [data-sectionnum='"+v+"']");
			}else{
				var cnum = $(pEl+" [data-version='"+v1+"'][data-sectionnum='"+v+"']")[0].getAttribute("data-changenum");
				pEl = ".tmail-comment-"+data.ttn+"-"+cnum+" .comment-container ";
			}
		}

		if(!el) var el = $(pEl+" [data-version='"+v1+"'][data-sectionnum='"+v+"']");

		var url = this.ttnURL+"#"+subType+"section-version="+(fwdttn ? fwdttn+":" : "")+v;
		url = "<div class='t-url-dialog-icon'></div> <span title='"+url+"'>"+url+"</span>";
		
		if(el){
			this.scrollIntoViewIfNeeded(el);
		}else{
			alert("Section "+v+" does not exist in this thread.");
		}
	},
	viewReleasedTemplate: function(data, v, subType){
		console.warn("View released template > "+this.hashValue+" ~ "+v);
		// Will be implemented later
	}
}