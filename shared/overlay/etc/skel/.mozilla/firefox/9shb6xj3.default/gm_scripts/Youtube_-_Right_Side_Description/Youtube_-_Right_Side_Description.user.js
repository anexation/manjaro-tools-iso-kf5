// ==UserScript==
// @id             b77e78bb-5ab5-403b-ae45-7540077fbc64
// @name           Youtube - Right Side Description 
// @namespace      Takato
// @author         Takato
// @copyright      2010+, Takato (https://greasyfork.org/users/1158/)
// @licence        Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International - Additional conditions apply; https://greasyfork.org/scripts/976/
// @description    Moves the video description to the right of the video (like it used to be 2009 and earlier) and makes a few 2009ish style tweaks to the video page. (Previously known as Better Watch Page)
// @icon           http://i.imgur.com/RAHw2kQ.png http://i.imgur.com/qlQhuaa.png
// @icon64         http://i.imgur.com/qlQhuaa.png
// @version        2014.10.08
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @website        https://greasyfork.org/scripts/976/
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_registerMenuCommand
// @grant          GM_listValues
// @grant          GM_addStyle
// @include        http://www.youtube.com/watch*
// @include        http://youtube.com/watch*
// @include        https://www.youtube.com/watch*
// @include        https://youtube.com/watch*
// ==/UserScript==
var script = {};
script.version = "2014.10.08";
 
// SETTINGS -----------------------------
// Want to change styling between default and retro? Click the "More" button below the video.
// --------------------------------------


// DEBUG MODE ---------------------------
// To enable Debug Mode add "&debug=1" to the page address ( eg http://youtube.com/watch?v=jNQXAC9IVRw&debug=1 )
// To disable Debug Mode just go to a new page or remove "&debug=1"
// --------------------------------------


// This script is licenced under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (https://creativecommons.org/licenses/by-nc-sa/4.0/) with additional conditions. 
// See https://greasyfork.org/scripts/976/ for full details of the licence and conditions.


// Everything below this line shouldn't be edited unless you are an advanced user and know what you are doing.

// Defining script properties
script.name = "Right Side Description"; // Previously known as Better Watch Page
script.shortname = "RSD";
script.website = "https://greasyfork.org/scripts/976/";
script.discussion = "https://greasyfork.org/scripts/976/feedback";
script.icon = "http://i.imgur.com/RAHw2kQ.png";
script.icon64 = "http://i.imgur.com/qlQhuaa.png";
script.mainCSS = "";
script.mainCSS = "/* Title */ #player {margin-top:5px;} #watch-headline-title {font-size:19px; font-weight:bold; margin-bottom:5px !important;} #watch-headline-title .long-title {font-size:inherit !important; letter-spacing:normal !important;}  /* Sidebar */ #bwp-sidebar-container {overflow:auto; margin-top:0; max-height:390px;}  #watch7-user-header .yt-user-info {max-width:calc(100% - 58px);} #watch7-user-header .yt-user-name {max-width:calc(100% - 16px) !important; height:1.5em !important;} #watch-uploader-info {margin-left:58px;} #watch-uploader-info strong {font-weight:normal;} #watch7-subscription-container {float:right;}  #action-panel-details {clear:both;} #action-panel-details button.yt-uix-button-expander.yt-uix-expander-body {display:none;}  /* Below Video */ #watch-header {position:relative;} #watch8-action-buttons, #watch8-ytcenter-buttons {border-top:none;} .watch8 #watch-header > #watch7-views-info {height:100%; top:0 !important; bottom:0px !important; right:12px !important;} #watch7-views-info .watch-view-count {position:absolute; top:0; right:0;} #watch7-views-info .video-extras-sparkbars {position:absolute; bottom:3px; right:0; width:100%;} #watch-like-dislike-buttons {z-index:5; position:relative;}   /* Retro Mode*/ body.bwpRetro {background-color:white;} .bwpRetro .yt-card {box-shadow:none; border:1px solid #e2e2e2;} .bwpRetro #bwp-sidebar-container {background:#EEEEEE; border:1px solid #CCCCCC; font-size:12px; padding:6px;} .bwpRetro #bwp-sidebar-container a {color:#0033CC !important;} .bwpRetro #watch7-user-header {padding-bottom:5px;} .bwpRetro #watch7-user-header .yt-user-photo {border:1px solid #999999;} .bwpRetro #watch7-user-header .yt-user-photo > .video-thumb {border:1px solid white;} .bwpRetro #watch-description-text {line-height:15px;} .bwpRetro #watch-description-extras {border-top:1px solid #CCCCCC;}  .bwpRetro #yt-masthead-container {border-bottom-color:#CCCCCC;} .bwpRetro #logo-container:not(.doodle) #logo:not(.doodle) {background:url(https://s.ytimg.com/yt/img/master.png) 0px -641px; height:40px; width:98px; margin-top:-5px; margin-bottom:-5px;} .bwpRetro #logo-container .content-region {display:none;}";



// Set up debug mode
script.debugOn = false;
script.debugMessages = "";
if (checkForDebugMode()) {
	script.debugOn = true;
	debugModeStart();
	debug("Starting "+script.shortname+" debug log");
	debug(script.shortname+" version: " + script.version);
	debug("HTML lang: " + document.getElementsByTagName("html")[0].getAttribute("lang"));
	debug("Body class: " + document.getElementsByTagName('body')[0].getAttribute("class"));
	debug("Direction: " + document.getElementsByTagName("html")[0].getAttribute("dir"));
	debug("Page class: " + document.getElementById("page").getAttribute("class"));
}



// Stop this script if this isn't a proper YT video page
debug("Stop script if not proper YT video page");
vidplayer = document.getElementById("player-api");
if (vidplayer == null) {
	debug("This isn't a proper YT video page. The video is unavailable. Now ending script. player-api not found.");
	debugModeEnd();
	return;
}
if (vidplayer.children.length <= 0) {
	debug("This isn't a proper YT video page. The video is unavailable. Now ending script. player-api empty.");
	debugModeEnd();
	return;
}
winLoc = window.location.toString();
if (winLoc.indexOf("watch_editaudio") > -1) {
	debug("This isn't a proper YT video page. Now ending script. watch_editaudio.");
	debugModeEnd();
	return;
}
if (winLoc.indexOf("watch_popup") > -1) {
	debug("This isn't a proper YT video page. Now ending script. watch_popup.");
	debugModeEnd();
	return;
}



// Stop if already running conflicting script
debug("Stop if already running conflicting script");
if ($("body").hasClass("bwpScript")) { // Already running this script
	debug("Script conflict: bwpScript? Script possibly just updated.");
	return;
} else {
	$("body").addClass("bwpScript");
}



// Script crash notification
debug("Constructing crash notification");
$(document.createElement("div"))
	.attr("id", "bwpCrash")
	.attr("style", "font-size:12px !important; border:1px solid black !important; padding:2px !important; margin:2px !important; font-weight:bold !important;")
	.html("'" + script.name + "' has crashed. Refresh the page if this is the first time. If it still crashes, try 'debug mode' and <a href='"+script.discussion+"' target='_window'>report</a> the error to the script developer. <a class='debugLink' href='" + window.location + "&debug=1'>Click here</a> to load debug mode (page will reload). Already running debug mode? The debug log should be displayed above.")
	.insertBefore("#page");
if (!script.debugOn) {
	GM_registerMenuCommand("Enable Debug Mode for \"" + script.name + "\"", debugEnable, "D");
}
	
// Insert CSS
debug("Inserting main CSS");
GM_addStyle(script.mainCSS);
debug("Main CSS is now active");

// Enable retro style (based on setting)
if (GM_getValue("retrostyle", true)) {
	$("body").addClass("bwpRetro");
}
// Add button to toggle retro style
$(document.createElement("li"))
	.attr("id", "bwp-retrostyle-toggle")
	.appendTo("#action-panel-overflow-menu");
$(document.createElement("button"))
	.attr("class", "yt-ui-menu-item has-icon")
	.html("<span class='yt-ui-menu-item-icon' style='margin-right:4px;margin-left:-4px;opacity:1'><img width='24' src='"+script.icon+"'/></span> <span class='yt-ui-menu-item-label'>Toggle 'Retro Style'</span>")
	.click(function() {
		$("body").toggleClass("bwpRetro");
		GM_setValue("retrostyle", !GM_getValue("retrostyle", true));
	})
	.appendTo("#bwp-retrostyle-toggle");



// Remove VEVO branding
debug("Removing VEVO branding if exists");
$("#watch7-container")
	.removeClass("watch-branded")
	.removeClass("watch-branded-banner");
$("#player")
	.attr("style", "")
	.removeClass("watch-branded-banner");
$("#watch7-branded-banner").remove();

// Move description & channel details to the right-side column
$(document.createElement("div"))
	.attr("id","bwp-sidebar-container")
	.attr("class", "yt-card yt-card-has-padding")
	.insertBefore("#watch7-sidebar-contents");
$("#watch7-user-header").appendTo("#bwp-sidebar-container");
$("#action-panel-details")
	.removeClass("yt-uix-expander-collapsed")
	.removeClass("yt-card")
	.removeClass("yt-card-has-padding")
	.appendTo("#bwp-sidebar-container");

// Move Upload time into user info
$("#watch-uploader-info").appendTo("#watch7-user-header");
$("#watch-uploader-info strong").text(function() { return $(this).text().replace("Published on ",""); });

// Move views back to below video
$("#watch7-views-info").appendTo("#watch-header");


// Move title above video
debug("Moving title above video");
$("#watch7-headline").prependTo("#player");
debug("Title moved");



// Remove Crash notice
debug("Removing crash notice");
$("#bwpCrash").remove();





// ---------------------------------------
// FUNCTIONS -----------------------------
// ---------------------------------------


function debugDisable() {
	currentPage = window.location.toString();
	currentPage = currentPage.substring(0, currentPage.indexOf("&debug=1"));
	window.location = currentPage;
}

function debugEnable() {
	currentPage = window.location.toString();
	currentPage = currentPage + "&debug=1";
	window.location = currentPage;
}

function debugModeStart() {
	if (script.debugOn) {
		alert("\""+script.name+"\" Script - Debug Mode \n\nDebug Mode has been enabled. \n\nAfter you click \"OK\" on this message, please wait 5 seconds and another message (like this one) should appear with further instructions. \n\nIf no message appears please copy the \"debug log\" text from the box in YouTube's header, and paste it in a message on this script's page on Greasyfork.org so the script author can help you.\n");
		$(document.createElement("div"))
			.attr("style", "margin-top:50px")
			.html("<h1>\""+script.name+"\" Debug Log</h1> <textarea id='bwpDebugLog' style='border:4px solid red !important; width:500px !important; height:150px !important;' readonly='readonly'>DEBUG LOG</textarea> <br/> <input type='button' value='Reload page without debug' id='bwpDebugDisable' /> - Pressing this button will also remove the debug log, so please copy/paste the debug log before pressing the button.")
			.prependTo("body");
		$("#bwpDebugDisable").click(debugDisable);
	}
}

function debugModeEnd() {
	if (script.debugOn) {
		debug("Ending Debug Process");
		alert("\""+script.name+"\" Script - Debug Mode \n\nDebugging has been completed. \n\nThere is now a \"debug log\" in YouTube's header. Please copy the debug log and paste it in a message on this script's page on Greaseyfork.org \n\nAfter you've posted the debug log, click \"Reload page without debug\" which will turn off debug mode and will reload the page.");
		document.getElementById("bwpDebugLog").focus();
		document.getElementById("bwpDebugLog").select();
	}
}

function debug(message) {
	if (script.debugOn) {
		script.debugMessages = script.debugMessages + message + "\n";
		try {
			document.getElementById("bwpDebugLog").value = script.debugMessages;
		} catch (ex) {
		}
	}
}

function checkForDebugMode() {
	currentPage = window.location.toString();
	if (currentPage.indexOf("debug=1") > -1) {
		return true;
	}
	return false;
}






debug("Reached final line of script");
debugModeEnd();	
// End of script