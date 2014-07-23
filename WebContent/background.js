//Copyright (c) 2011 The Chromium Authors. All rights reserved.
//Use of this source code is governed by a BSD-style license that can be
//found in the LICENSE file.

//Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	// No tabs or host permissions needed!
	chrome.tabs.insertCSS(null,{file:"basic.css"},null);
	chrome.tabs.executeScript(null,{file:"jquery.min.js"});
	chrome.tabs.executeScript(null,{file:"basic.js"});
});


chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			if (request.tag != null && request.tag != undefined){
//				console.log("sendtag");
//				sendResponse({resp: "s"});
			}

			if(request.cssObj != null && request.cssObj != undefined){
				var css = request.cssObj;
				console.log("css! : "+request.cssObj);
				var cssHtml = $("<div></div>");
				for (var key in css) {
					var div = $("<div></div>");
					div.html(key + " : " + css[key] +"<br />");
					console.log(div);
					cssHtml.append(div);
					$("#add_old_style_div").append(cssHtml);
				}
//				sendResponse({resp: "s"});
			}
		});

