var start = false;
var position = "initial";
var currentWindowId = undefined;
var focusedWindowId = undefined;
var extentionWindowId = undefined;
document.addEventListener('DOMContentLoaded', function() {
	bootStrap();
});



chrome.windows.onCreated.addListener(function(createInfo) {
	console.log('windows.onCreated -- window: ' + createInfo.id);
	extentionWindowId = createInfo.id;
	saveOption();
});

chrome.windows.onFocusChanged.addListener(function(windowId) {
	focusedWindowId = windowId;
	console.log('windows.onFocusChanged -- window: ' + windowId);
	if(focusedWindowId == extentionWindowId){
		loadOption();
		loadChange("start", function(e){
		});
		loadChange("position", function(e){
		});
	}
});

chrome.windows.onRemoved.addListener(function(windowId) {
	console.log('windows.onRemoved -- window: ' + windowId);
	
});

chrome.tabs.onCreated.addListener(function(tab) {
	console.log(
			'tabs.onCreated -- window: ' + tab.windowId + ' tab: ' + tab.id +
			' title: ' + tab.title + ' index ' + tab.index + ' url ' + tab.url);
	
});

chrome.tabs.onAttached.addListener(function(tabId, props) {
	console.log(
			'tabs.onAttached -- window: ' + props.newWindowId + ' tab: ' + tabId +
			' index ' + props.newPosition);
	
});

chrome.tabs.onMoved.addListener(function(tabId, props) {
	console.log(
			'tabs.onMoved -- window: ' + props.windowId + ' tab: ' + tabId +
			' from ' + props.fromIndex + ' to ' +  props.toIndex);
	
});



function bootStrap() {
	chrome.windows.getCurrent(function(currentWindow) {
		currentWindowId = currentWindow.id;
		chrome.windows.getLastFocused(function(focusedWindow) {
			focusedWindowId = focusedWindow.id;
			
		});
	});
}

function sendMessage(target, param, callback ){
	chrome.tabs.sendMessage(target[0].id, param, function(response) {
		callback(response.msg);
	});
}


function saveOption(){
	saveChange({start : start, position: position });
}

function loadOption(){
	loadChange("start", function(e){console.log(e)});
	loadChange("position", function(e){console.log(e)});
}

function saveChange( dic ){
	chrome.storage.sync.set(dic, function() {

	});
}

function loadChange( key, callback ){
	chrome.storage.sync.get( key , callback );
}

$("#add_start_button").bind("click",function(e) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		if(start){
			start = false;
			$("#add_start_button").toggleClass( "red_background green_background" );

		}else{
			start = true;
			$("#add_start_button").toggleClass( "red_background green_background" );
		}

		sendMessage(tabs, {now : start}, function(m){
			$("#add_start_button").html(m);
			saveOption();
		});
	});
});

function changeToggle(){
	
}

function setToggle(){
	
}

$("#add_absolute_button").bind("click",function(e) {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		if(position == "absolute"){
			position = "initial";
			$("#add_absolute_button").toggleClass( "gray_background green_background" );

		}else if(position == "initial"){
			position = "absolute";
			$("#add_absolute_button").toggleClass( "gray_background green_background" );
		}

		sendMessage(tabs, {pos : position}, function(m){
			$("#add_absolute_button").html(m);
			saveOption();
		});
	});
});



