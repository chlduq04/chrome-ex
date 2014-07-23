var lm;
var DEBUG_MODE = true;

function cout(value){
	if(DEBUG_MODE){ console.log(value);}
}

function preventDefault(e) {
	e = e || window.event;
	if (e.preventDefault) {
		e.preventDefault();
	}
	e.returnValue = false;
}

function wheel(e) {
	preventDefault(e);
}

function disable_scroll() {
	if (window.addEventListener) {
		window.addEventListener('DOMMouseScroll', wheel, false);
	}
	window.onmousewheel = document.onmousewheel = wheel;
}

function enable_scroll() {
	if (window.removeEventListener) {
		window.removeEventListener('DOMMouseScroll', wheel, false);
	}
	window.onmousewheel = document.onmousewheel = document.onkeydown = null;  
}


(function($){
	$.fn.getStyleObject = function(){
		var dom = this.get(0);
		var style;
		var returns = {};
		if(window.getComputedStyle){
			var camelize = function(a,b){
				return b.toUpperCase();
			};
			style = window.getComputedStyle(dom, null);
			for(var i = 0, l = style.length; i < l; i++){
				var prop = style[i];
				var camel = prop.replace(/\-([a-z])/g, camelize);
				var val = style.getPropertyValue(prop);
				returns[camel] = val;
			};
			return returns;
		};
		if(style = dom.currentStyle){
			for(var prop in style){
				returns[prop] = style[prop];
			};
			return returns;
		};
		return this.css();
	}
})(jQuery);


$(document).ready(function(){
	lm = new LayoutManager;
	lm.startLM();

	/*
	$.fn.copyCSS = function(source){
		var styles = $(source).getStyleObject();
		this.css(styles);
	}
	 */
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	if(request.now != null && request.now != undefined){
		cout(request);
		if (request.now == true){
			lm.setModifyTrue();
			sendResponse({msg: "On"});
		}else{
			lm.setModifyFalse();
			sendResponse({msg: "Off"});
		}
	}

	if(request.pos!=null && request.pos!= undefined){
		if (request.pos == "absolute"){
			sendResponse({msg: "Absolute"});
		}else if(request.pos == "initial"){
			sendResponse({msg: "Initial"});
		}
	}
});



function LayoutManager(option){

	var self = this;
	this.base_option = {
			mouse_over_color : "rgba(255, 0, 0, 0.2)",
			mouse_click_color : "rgba(0, 255, 0, 0.2)",
			mouse_friend_color : "rgba(0, 0, 255, 0.2)",
	}

	$.extend( this.base_option, option );

	this.clickdic = {};
	this.switch_modify = false;
	this.now_url;
	this.click_obj = null;
	this.click_origin = null;
	this.click_friend = [];
	this.checkModify = function(func){
		if(this.switch_modify){
			func();
		}
	};

	this.checkValue = function(){
		for (var i = 0; i < arguments.length; i++) {
			if(!arguments[i]){
				return false;
			}
		}
		return true;
	};

}

LayoutManager.prototype = {

		startLM : function(){
			this.switch_modify = false;
			this.setBind();
		},	

		setModifyTrue : function(){
			this.switch_modify = true;
		},

		setModifyFalse : function(){
			this.switch_modify = false;
		},

		setBind : function(){
			var fself = this;
			$(document).on("mouseover",function(e){
				fself.checkModify(function(){
					if(fself.click_origin == undefined || fself.click_origin == null){
						$("*").css("background-color", "");
						$(e.toElement).css("background-color", fself.base_option.mouse_over_color);
					}
				});
			}).on("click",function(e){
				fself.checkModify(function(){
					e.preventDefault();
					chrome.extension.sendMessage({tag : ""+e.toElement}, function(response) {
						cout("tag : " + response.resp);
					});

					if(fself.click_origin != undefined && fself.click_origin != null){
						if(e.toElement == fself.click_origin){
//							enable_scroll();
							fself.click_origin = null;	
							fself.click_obj = null;
							fself.click_friend = [];
							$("*").css("background-color", "");
							$($(fself.click_origin).parent()).sortable( "destroy" );
						}
					}else{
						fself.click_obj = e.toElement;
						fself.click_origin = fself.click_obj;
						var arr = $(fself.click_origin).parent().children();
						cout(arr);
						for(var i =  0 ; i < arr.length ; i++){
							fself.click_friend[i] = arr[i];
							$(arr[i]).css("background-color", fself.base_option.mouse_friend_color);
							cout(arr[i]);
//							$(arr[i]).draggable({ appendTo: $($(fself.click_origin).parent()), containment: $($(fself.click_origin).parent()) });
						}
						$($(fself.click_origin).parent()).sortable({
							placeholder: "ui-state-highlight"
						});

						$($(fself.click_origin).parent()).disableSelection();

						cout(fself.click_obj);		

						$(fself.click_obj).css("background-color", fself.base_option.mouse_click_color);

						var cssObj = $(fself.click_origin).getStyleObject();
						/*
						var cssHtml = $("<div></div>");
						for (var key in cssObj) {
							var div = $("<div></div>");
							div.html(key + " : " + cssObj[key] +"<br />");
							console.log(div);
							cssHtml.append(div);
						}
						*/
						console.log("sendcss");
						chrome.extension.sendMessage({cssObj : ""+cssObj}, function(response) {
							cout("sendcss : " + response.resp);
						});
					}

					return false;
				})
			})
			/*
			.on("mousewheel",function(e){
				fself.checkModify(function(){
					if(fself.click_obj != undefined && fself.click_obj != null){
						disable_scroll();
						$("*").not( $(fself.click_origin) ).css("background-color", "");
						if(e.deltaY == "-1"){
							fself.click_obj = $(fself.click_obj).children();
							if(fself.click_obj == undefined && fself.click_obj == null){
								enable_scroll();
								fself.click_obj = null;
							}
						}else if(e.deltaY == "1"){
							fself.click_obj = $(fself.click_obj).parent();
						}
						$(fself.click_obj).not( $(fself.click_origin) ).css("background-color", fself.base_option.mouse_over_color);
						cout($(fself.click_obj));
						cout(e.deltaX, e.deltaY, e.deltaFactor);					
					}
				});
			})
			 */
		},

		findUrl : function(){
			this.now_url = window.location.href;
		},

		saveFile : function(){

		}

}






/*
if($(".layout_manager_background_black").length <= 0){
	cout("hide");
	$("body").append( $("<div></div>").attr({"class":"layout_manager_background_black"}).css({width:"100%", height:"100%", "position" : "fixed","margin-left" : "auto", "margin-right":"auto",right:"0px", left : "0px", top : "0px", "z-index" : "10000", "opacity":"0.6", "background" : "url('"+chrome.extension.getURL("black.png")+"')", "background-size":"cover"}));
	$(".layout_manager_background_black").bind("click",function(eve){
		$(this).hide();
		$(this).html();
	})
}else{
	if(e.target.className != "layout_manager_background_black"){
		cout("show");
		$(".layout_manager_background_black").show();
	}
}
var temp = $(e.target).clone();
$(temp).copyCSS($(e.target));
$(".layout_manager_background_black").append( temp );
 */