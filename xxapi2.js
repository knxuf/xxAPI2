/*
 * Copyright 2016, KNX-User-Forum e.V.
 * 
 *     This file is part of xxAPI2.
 * 
 *     xxAPI2 is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Lesser General Public License as published by
 *     the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 * 
 *     xxAPI2 is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Lesser General Public License for more details.
 * 
 *     You should have received a copy of the GNU Lesser General Public License
 *     along with xxAPI2.  If not, see <http://www.gnu.org/licenses/>.
 * 
 *     Diese Datei ist Teil von xxAPI2.
 * 
 *     xxAPI2 ist Freie Software: Sie können es unter den Bedingungen
 *     der GNU Lesser General Public License, wie von der Free Software Foundation,
 *     Version 3 der Lizenz oder (nach Ihrer Wahl) jeder späteren
 *     veröffentlichten Version, weiterverbreiten und/oder modifizieren.
 * 
 *     xxAPI2 wird in der Hoffnung, dass es nützlich sein wird, aber
 *     OHNE JEDE GEWÄHRLEISTUNG, bereitgestellt; sogar ohne die implizite
 *     Gewährleistung der MARKTFÄHIGKEIT oder EIGNUNG FÜR EINEN BESTIMMTEN ZWECK.
 *     Siehe die GNU Lesser General Public License für weitere Details.
 * 
 *     Sie sollten eine Kopie der GNU Lesser General Public License zusammen mit diesem
 *     Programm erhalten haben. Wenn nicht, siehe <http://www.gnu.org/licenses/>.

 * https://github.com/knxuf/xxAPI2/blob/master/LICENSE
 *
*/
"use strict";

// xml2json library
$.base64 = {
    "decode"    : function(arg) { return window.atob(arg);},
    "encode"    : function(arg) { return window.btoa(arg);}
}

var xxAPI = {};
xxAPI.version = "2.044";
xxAPI.functions = {};
var performance = window.performance || $ // make performance.now() work in any case
xxAPI.events = {
    "lastclick" : {
        "top"   : 0,
        "left"  : 0,
        "event" : null
    }
}
xxAPI.XXLINKURL = "";
xxAPI.registered_icons = { 
    "XXPAGE"    : "XXPAGE*",
    "XXPOPUP"   : "XXPAGE*POPUP"
};
xxAPI.marked_pages = {};
xxAPI.geolocation = {};
xxAPI.xxtemplates = {
    "default"   : null
};

// Homeserver Object
var hs = {};
hs.debug_cache = [];
hs.cached_load_count = -1;
hs.libraries_loaded = false;
hs.functions = {};
hs.functions.async = {};
hs.post_load_functions = [];
hs.session = {};  // keyname ist target

// Globale
hs.user = null;
hs.options = {
    "autoscale"     : true,
    "scaledown"     : false,
    "dateformat"    : "%ddd% %dd%.%MM%.%YYYY% %HH%:%mm%:%ss%",
    "timezone"      : null,
    "sliderstep_px" : 10,
    "visualclickdelay"  : 800,
    "itemdiscardmode": 2, // discard items outside visu / 0 = don't discard / 1 = discard only html / 2 = discard html + xxapi
    "fadeouttime"   : 200,
    "temp_colors"   : {
        "one"   : [52, 152, 219],
        "two"   : [137, 224, 223],
        "three" : [46, 204, 113],
        "four"  : [241, 196, 15],
        "five"  : [231, 76, 60]
    }
}

hs.language = {
    "monthnames"    : [ "","Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],
    "weekdaynames"  : [ "Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag" ],
    "shortweekdaynames" : [ "So","Mo","Di","Mi","Do","Fr","Sa" ],
    "filternames" : [ "Immer","Normale Tage","Feiertage","Urlaub","Nie" ]
}

hs.gui = {};
hs.gui.update_timer = null;
hs.gui.fonts = {};
hs.gui.systemfonts = {};
hs.gui.popup_layer = 0;
hs.gui.device = {
    "width"  : $(window).width(),
    "height" : $(window).height()
};
hs.gui.attr = {
    "initial_visu_width"    : $(window).width(), 
    "initial_visu_height"   : $(window).height(),
    "visu_width"            : $(window).width(),
    "visu_height"           : $(window).height()
};
hs.gui.hashes = {};
hs.gui.pages = {};
hs.gui.items = {};
hs.gui.designs_html = null;
hs.gui.hidden = false;
hs.gui.container_scale = 1;
hs.auth = {};
hs.auth.username = null;
hs.auth.password = null;
hs.auth.gui_design = null;
hs.auth.gui_refresh="R1";
hs.connection = {
    "timeout"    : 300, // 300sec
    "failure"    : 0,
    "hiddentime" : 120 // 120sec if page is hidden
};
hs.debuglevel = 0;

/*
    * XXAPICONFIG opens the xxAPI configmenu
    
    * Argument 1 (optional) is the text shown on Visu
     XXAPICONFIG*
*/
xxAPI.functions.XXAPICONFIG = function ( oarg ) {
    var _html = "<h3 style='text-align: center;'>xxAPI² Config</h3>";
    _html += "<table style='width:100%;'>";
    _html += "<tr><td class='xxapi_config_name'>Version:</td><td class='xxapi_config_value'>" + xxAPI.version + "<td><tr>";
    _html += "<tr><td class='xxapi_config_name'>jQuery:</td><td class='xxapi_config_value'>" + $.md5(hs.functions.stringify($)) + "<td><tr>";
    _html += "<tr><td class='xxapi_config_name'>HSClient:</td><td class='xxapi_config_value'>" + $.md5(hs.functions.stringify(hs.functions)) + "<td><tr>";
    _html += "<tr><td class='xxapi_config_name'>xxAPI:</td><td class='xxapi_config_value'>" + $.md5(hs.functions.stringify(xxAPI.functions)) + "<td><tr>";
    _html += "<tr><td class='xxapi_config_name'>Debuglevel</td><td class='xxapi_config_value'><select onchange='hs.functions.set_debuglevel(this.value);'>";
    for(var _o=0;_o<6;_o++) {
        _html += "<option"+ (_o == hs.debuglevel ? " selected": "") + ">" + _o + "</option>";
    }
    _html += "</select><td><tr>";
    _html += "<tr><td colspan='2'><button class='simplemodal-close' onclick='window.applicationCache.update(); window.location.reload();'>Reload Cache</button></td></tr>";
    _html += "<tr><td colspan='2'><button class='simplemodal-close' onclick='window.localStorage.clear()'>Clear LocalStorage</button><td><tr>";
    _html += "<tr><td colspan='2'><button class='simplemodal-close' onclick='hs.functions.logout();'>Logout</button><td><tr>";
    //_html += "<tr><td colspan='2'><button class='simplemodal-close'>Close</button><td><tr>";
    _html += "</table>";
    _html += "<footer style='position: absolute; bottom: 1em;'>Copyright © 2015 <a href='http://www.knx-user-forum.de'>knx-user-forum e.V.</a>&#160;<a rel='license' href='https://github.com/knxuf/xxAPI2/blob/master/LICENSE'>licensed LGPL</a><footer>";
    var _div = $('<div />').html(_html);
    _div.css( {
        "font-size"         :"small",
        "color"             :"grey",
        "background-color"  :"white",
        "width"             :"300px",
        "height"            :"300px",
        "padding"           :"3px"
    });
    if ( oarg != null) {
        oarg.item.text = oarg.args[1];
        oarg.item.eventcode["click"] = function( oarg ) {
            _div.modal({
                "autoPosition"  : true,
                "modal"         : true,
                "overlayClose"  : true
            });
        }
    } else {
        _div.modal({
            "autoPosition"  : true,
            "modal"         : true,
            "overlayClose"  : true
        });
    
    }
}

hs.functions.set_debuglevel = function ( level ) {
    hs.debuglevel      = level;
    hs.functions.storage("set","debuglevel",level);
}

/* 
    * old xxAPI is ignored but the action "Seite aufrufen" is triggered
    * it is used on xxAPI-INIT page to go to the next page
    
    * Argument 1 (deprecated) is the old xxAPI
     XXSCRIPT*[old xxAPI in base64]
*/
xxAPI.functions.XXSCRIPT = function( oarg ) {
    debug(2,"XXSCRIPT");
    oarg.item.page.hidden = true;
    if (oarg.item.open_page > 0) {
        hs.post_load_functions.push(function() {
            oarg.page_id = oarg.item.open_page;
            hs.functions.load_page({
                "session"   : oarg.session, 
                "page_id"   :  xxAPI.marked_pages[xxAPI.start_page] || oarg.page_id
            });
        });
    }
}

/*
    * With XXHTML the textelement is interpreted as HTML-Code to manipulate the text
    
    * Argument 1 is the HTML-Code
     XXHTML*<span style='color:red;'>Some Text</span>
*/
xxAPI.functions.XXHTML = function ( oarg ) {
    debug(2,"XXHTML:",oarg);
    var _html = oarg.args[1] || "";
    _html = _html.replace(/\[/g, "<");
    _html = _html.replace(/\?\?/g, "\"");
    _html = _html.replace(/=\?/g, "=\"");
    _html = _html.replace(/\? /g, "\" ");
    _html = _html.replace(/\?\]/g, "\">");
    _html = _html.replace(/\]/g, ">");
    oarg.item.html = _html;
}

/*
    * XXEHTML is similar to XXHTML, but the arguments are base64-encoded to handle 
    * linebreaks, specialchars and quotes
    
    * Argument 1 is the base64 encoded HTML-Code
     XXEHTML*base64 encoded HTML-Code
*/
xxAPI.functions.XXEHTML = function ( oarg ) {
    debug(2,"XXEHTML:",oarg);
    var _html = $.base64.decode(oarg.args[1]);
    oarg.item.html = _html;
}

/*
    * XXETEXT is similar to XXEHTML, but the arguments is base64-encoded Text not HTML
    
    * Argument 1 is the base64 encoded Text
     XXETEXT*base64 encoded Text
*/
xxAPI.functions.XXETEXT = function ( oarg ) {
    debug(2,"XXETEXT:",oarg);
    var _text = $.base64.decode(oarg.args[1]);
    oarg.item.text = _text;
}

/*
    * XXLINK is used to set the URL for XXIFRAME elements.
    * To access Homeserver-archivs the URL can also be
    * The first argument can be omitted if used as an overlay
    * HSLIST:name_of_archiv
    
    * Argument 1 (can be blank) is the text shown on Visu
    * Argument 2 is the URL
     XXLINK*[Linktext or blank]*http://knx-user-forum.de/
     XXLINK**http://knx-user-forum.de
*/
xxAPI.functions.XXLINK = function ( oarg ) {
    debug(2,"XXLINK:",oarg);
    oarg.item.eventcode["click"] = function() {
        xxAPI.XXLINKURL = xxAPI.functions.geturl(oarg.args[2]);
    }
    oarg.item.text = oarg.args[1];
}

/*
    * XXHTTP is used to open links in a new tab/window.
    * The syntax is the same as XXLINK
    
    * Argument 1 (can be blank)  is the text shown on Visu
    * Argument 2 is the URL
     XXHTTP*[Linktext or blank]*HSLIST:meldungen
     XXHTTP**http://knx-user-forum.de
*/
xxAPI.functions.XXHTTP = function ( oarg ) {
    debug(2,"XXHTTP:",oarg);
    oarg.item.eventcode["click"] = function() {
        window.open(xxAPI.functions.geturl(oarg.args[2]),'XXHTTP');
    }
    oarg.item.text = oarg.args[1];
}

/*
    * XXIFRAME is either used standalone or with an URL as argument.
    * If the argument is omitted, the URL is provided by XXLINK
    
    * Argument 1 (optional) is the URL
     XXIFRAME*http://knx-user-forum.de
     XXFRAME*
*/
xxAPI.functions.XXIFRAME = function ( oarg ) {
    debug(2,"XXIFRAME:",oarg);
    if (oarg.args[1] != "") {
        oarg.item.xxapi.xxiframe_url = oarg.args[1];
    }
    if(!oarg.item.xxapi.hasOwnProperty("xxiframe")) {
        oarg.item.xxapi.xxiframe = $("<iframe />",{
            "width"     : "100%",
            "height"    : "100%",
            "border"    : "none",
            "allowtransparency" : true
        });
        if(oarg.args[1] == "") {
            oarg.item.xxapi.xxiframe.in_dom(function() {
                var _url = oarg.item.xxapi.xxiframe_url || xxAPI.XXLINKURL;
                if(this.src != _url) {
                    this.setAttribute("src",_url);
                }
            },{"once" : false});
        }
        
    }
    oarg.item.xxapi.xxiframe.attr("src",oarg.item.xxapi.xxiframe_url ||  xxAPI.XXLINKURL);
    oarg.item.html = oarg.item.xxapi.xxiframe;
    oarg.item.customcss = { 
        "pointer-events" : "auto",
        "-webkit-overflow-scrolling" : "touch",
    };
    if("ontouchstart" in document.documentElement) {
        oarg.item.customcss["overflow-y"] = "auto";
    }
    oarg.item.bg_color = "transparent";
}

/*
    * XXEXECUTE is a function to execute Javascript code which is executed as a function
    * with the itemobject as the argument. The item can be manipulated within the code
    
    * Argument 1 is the Javascript code
     XXEXECUTE*item.text='';item.bg_color=red;
*/
xxAPI.functions.XXEXECUTE = function ( oarg ) {
    debug(2,"XXEXECUTE:",oarg);
    var _jscode = hs.functions.fix_hsjavascript( oarg.args[1] );
    // item für Abwärtskompatiblität
    oarg.item.text = '';
    try {
        var _func = new Function('item','"use strict"; ' + _jscode);
        _func( oarg.item );
    } catch (e) {
        debug(1,"XXEXECUTE_ERROR:",{
            "e"      : e,
            "oarg"   : oarg,
            "jscode" : _jscode
        });
    }
}

hs.functions.fix_hsjavascript = function ( broken ) {
    var _jscode = broken || "";
    _jscode = _jscode.replace(/(\?[\w\s.#:*<>^=~]+\?)/g, function(match,capture) {
        return '"' + capture.slice(1,-1) + '"';
    });
    _jscode = _jscode.replace(/(\[\w+\])/g,function(match,capture) {
        return '<' + capture.slice(1,-1) + '>';
    });
    _jscode = _jscode.replace(/##/g, "||");
    return _jscode;
}

/*
    * XXEEXCECUTE is an base64 encoded version of XXEXECUTE an can be used 
    * for complexer code with quotes,linebreaks and specialchars
    
    * Argument 1 is the base64 encoded Javascript code
     XXEEXECUTE*base64code
*/
xxAPI.functions.XXEEXECUTE = function ( oarg ) {
    debug(2,"XXEEXECUTE:",oarg);
    var _jscode = $.base64.decode(oarg.args[1]);
    oarg.item.text = '';
    try {
        var _func = new Function('item','"use strict"; ' + _jscode);
        _func( oarg.item );
    } catch (e) {
        debug(1,"XXEEXECUTE_ERROR:",{
            "e"      : e,
            "oarg"   : oarg,
            "jscode" : _jscode
        });
    }
}

/*
    * XXMARK is used to give pages a name to call them later
    * with XXMODUL or XXMODULCLICK. XXMARK should be placed on
    * the xxAPI-INIT page to make them globaly available.
    * The action of the textelement must be "Seite aufrufen" 
    * with the page called is aliased by the name.

    * Argument 1 is the alias for the page
     XXMARK*Weatherstation
*/
xxAPI.functions.XXMARK = function ( oarg ) {
    debug(2,"XXMARK",oarg);
    if(oarg.item.open_page) {
        xxAPI.marked_pages[oarg.args[1]] = oarg.item.open_page;
    }
    oarg.item.hidden = true;
}

/*
    * To integrate other pages as modules in another page
    * XXMODUL can be used. There are diffent ways to use it.

    * Argument 1 is always the name for the module, which is 
    * also the name for the session to connect to the Homeserver,
    * it will be reused if present.
    * Argument 2 (optional) is the name of an XXMARK'ed page,
    * if it is omitted the pageaction "Seite aufrufen" is used
    * for the startpage of the module
    * (no Argument 2 and no "Seite aufrufen" is deprecated but can still be used)
     XXMODUL*Modulename
     XXMODUL*Modulename*Weatherstation
*/
xxAPI.functions.XXMODUL = function ( oarg ) {
    debug(2,"XXMODUL",oarg);
    var _modulname = "MODUL_" + oarg.args[1].toUpperCase();
    oarg.item.indent = 0;
    if(hs.session.hasOwnProperty(_modulname)) {
        if(oarg.item.session.target == _modulname) {
            debug(1,"XXMODUL: nested modul " + _modulname,oarg);
            return;
        }
        if(oarg.item.object) {
            debug(5,"XXMODUL: modul has object",hs.session[_modulname]);
            oarg.item.object.append(hs.session[_modulname].target_obj);
        } else {
            if (hs.session[_modulname].target_obj.length > 0) {
                debug(5,"XXMODUL: modul has session",oarg);
                oarg.item.html =  hs.session[_modulname].target_obj;
            }
        }
    }
    if (oarg.item.width + oarg.item.left > oarg.item.page.width) {
        oarg.item.width = oarg.item.page.width - oarg.item.left;
    }
    if (oarg.item.height + oarg.item.top > oarg.item.page.height) {
        oarg.item.height = oarg.item.page.height - oarg.item.top;
    }
    if (!oarg.item.html){
        oarg.item.html = $("<div />", {
            "id"        : _modulname,
            "width"     : oarg.item.width,
            "height"    : oarg.item.height
        });
    }
    var _active_page;
    if(hs.session[_modulname] && hs.session[_modulname].active_page) {
        _active_page = hs.session[_modulname].active_page.page_id;
    }
    //          Seite aufrufen                               XXMODULNAME
    var _page = oarg.item.open_page || _active_page || xxAPI.marked_pages[oarg.args[1]];
    if(oarg.args.length > 2) {
        //          XXMARKed Page
        _page = xxAPI.marked_pages[oarg.args[2]] || _page;
    }
    if (!Number(_page)) {
        delete oarg.item.html;
        oarg.item.text = "NO MODULPAGE";
        debug(1,"XXMODUL: module page not found",oarg);
        return;
    }
    if(_active_page != _page) {
        debug(5,"XXMODUL: different_pages: " + _active_page + " != " + _page, oarg);
        setTimeout(function() {
            new hs.functions.hs_session(_modulname,_page,oarg.item.width,oarg.item.height);
        },0);
    } else {
        debug(5,"XXMODUL: same page: " + _active_page + " == " + _page, oarg);
        hs.session[_modulname]._width = oarg.item.width;
        hs.session[_modulname]._height = oarg.item.height;
    }
    oarg.item.click = false;
    oarg.item.text = '';
    oarg.item.bg_color = "transparent";
    oarg.item.customcss = {
        "pointer-events"    : "auto"
    }
}

/*
    * XXMODULCLICK  is used to change other modulepages, it can
    * be used in different ways. Commands attached to the item 
    * are also executed.
    
    * Argument 1 (can be  blank) is the text shown on visu
    * Argument [2,4,6...] is the name of the module that will be changed
    * Argument [3,5,7...] (can be blank) is the XXMARK'ed pagename 
    *  (if blank the Visu-Page from "Seite aufrufen" is used)
     XXMODULCLICK**Modulename*Weatherstation
     XXMODULCLICK**Modulename*Weatherstation*Othermodul

*/
xxAPI.functions.XXMODULCLICK = function ( oarg ) {
    debug(2,"XXMODULCLICK",oarg);
    oarg.item.text = oarg.args[1];
    oarg.item.action_id = oarg.item.has_command ? 0 : -1;
    var _args = oarg.args.slice(2);
    oarg.item.eventcode["click"] = function( oarg ) {
        for (var i = 0; i <_args.length; i+=2) {
            xxAPI.functions.modul_click( _args[i],_args[i+1], oarg);
        }
    }
}

/*
    * XXDOMODULCLICK is used to change a modulpage programaticaly
    * commands are also executed
    
    * Argument [1,3,5 ....] is the name of the module that will be changed
    * Argument [2,4,6 ....] (can be blank) is the XXMARK'ed pagename
    *  (if blank the Visu-Page from "Seite aufrufen" is used)
    
*/
xxAPI.functions.XXDOMODULCLICK = function ( oarg ) {
    debug(2,"XXDOMODULCLICK",oarg);
    oarg.item.text = "";
    oarg.item.action_id = oarg.item.has_command ? 0 : -1;
    var _args = oarg.args.slice(1);
    for (var i = 0; i <_args.length; i+=2) {
        xxAPI.functions.modul_click( _args[i],_args[i+1], oarg);
    }
}

/*
    * xxAPI.functions.modul_click is a Helperfunction to change Modulepages with XXEXECUTE
    
    * Argument 1 is the name of the module
    * Argument 2 (can be empty if argument 3) is the pagename
    * Argument 3 (optional) is for using the items "Seite aufrufen" page
*/
xxAPI.functions.modul_click = function ( module_name, page_name, oarg ) {
    oarg = oarg ? oarg : { "item" : {} };
    module_name = module_name || "";
    page_name = page_name || "";
    var _session = module_name == "" ? hs.session.VISU : hs.session["MODUL_" + module_name];
    var _page_id = page_name == "" ? oarg.item.open_page : xxAPI.marked_pages[page_name];
    if(!_session || !_page_id) {
        debug(1,"XXMODULCLICK Error: Session " + module_name + " or Page " + page_name + " not found",oarg);
        return;
    }
    setTimeout(function() {
        hs.functions.load_page({
            "session"   : _session,
            "page_id"   : _page_id
        });
    },0);
}

/*
    * xxAPI.modulClick is a backwardcompatible alias for xxAPI.functions.modul_click (deprecated)
*/
xxAPI.modulClick = xxAPI.functions.modul_click;

/*
    * XXCLICK is used to execute Javascript if the item is clicked
    
    * Argument 1 (can be blank) is the text shown on Visu
    * Argument 2 is the Javascript 
*/
xxAPI.functions.XXCLICK = function ( oarg ) {
    debug(2,"XXCLICK",oarg);
    oarg.item.text = oarg.args[1];
    var _jscode = hs.functions.fix_hsjavascript( oarg.args.slice(2).join("*") );
    // remove deprecated XXEXECUTE prefix
    _jscode = _jscode.replace(/^XXEXECUTE\*/,"");
    try {
        var _func = new Function('item','"use strict"; ' + _jscode);
        oarg.item.eventcode["click"] = function( oarg ) {
            try {
                _func( oarg.item );
            } catch (e) {
                debug(1,"XXCLICK_ERROR:",{
                    "e"      : e,
                    "oarg"   : oarg,
                    "jscode" : _jscode
                });
            }
        }
    } catch (e) {
        debug(1,"XXCLICK_JS_COMPILE_ERROR:",e);
    }
}

/*
    * XXTRIGGER is used as a timer function that triggers
    * the items action and commands to a given time.
    
    * Argument 1 (optional defaults to 50ms) is the delay in milliseconds
    * Argument 2 (optional) is Javascript code
     XXTRIGGER*30000 (30 seconds)
*/
xxAPI.functions.XXTRIGGER = function ( oarg ) {
    debug(2,"XXTRIGGER",oarg);
    var _time = parseInt(oarg.args[1]) || 0;
    oarg.item.next_update = $.now() + _time;
    var _func = null;
    if(oarg.args.length > 2) {
        var _jscode = hs.functions.fix_hsjavascript( oarg.args.slice(2).join("*") );
        try {
            _func = new Function('item','"use strict"; ' + _jscode);
        } catch (e) {
            debug(1,"XXTRIGGER_JS_COMPILE_ERROR",e);
        }
    }
    oarg.item.update_code = function ( oarg ) {
        if(_func) {
            try {
                _func( oarg.item );
            } catch (e) {
                debug(1,"XXTRIGGER_ERROR:",{
                    "e"      : e,
                    "oarg"   : oarg,
                    "jscode" : _jscode
                });
            }
        }
        hs.functions.check_click ( oarg );
        oarg.item.next_update = null;
    }
    if(_time == 0) {
        setTimeout(function() {
            oarg.item.update_code( oarg );
        },0);
    }
    oarg.item.hidden = true;
}

/*
    * XXIMG is used to load an image from an URL and refresh it
    
    * Argument 1 is the image URL
    * Argument 2 (optinal) is the refreshtime in seconds
     XXIMG*http://1.2.3.4/image?qual=1024*5
*/
xxAPI.functions.XXIMG = function ( oarg ) {
    debug(2,"XXIMG",oarg);
    oarg.item.type = "CAM";
    oarg.item.url = hs.functions.format_date(oarg.args[1]);
    if(oarg.args.length > 2) {
        oarg.item.refresh = oarg.args[2]*1;
        if(oarg.item.refresh == 0) {
            oarg.item.refresh = Infinity;
        }
    }
}

xxAPI.functions.XXGAUGE = function ( oarg ) {
    debug(2,"XXGAUGE",oarg);
    oarg.item.text = "";
    var _is_vertical = oarg.item.width < oarg.item.height;
    var _reversed = oarg.item.align == "right";
    if (!oarg.item.xxapi.gauge) {
        oarg.item.xxapi.gauge_options = {
            "min"   : 0,
            "max"   : 100,
            "prec"  : 0,
            "click" : 1,
            "gradient" : ""
        };
        debug(5,"XXGAUGE: create object",oarg);
        if(oarg.item.action_id != 9) {
            if(oarg.args.length > 2) {
                oarg.item.xxapi.gauge_options = $.extend(oarg.item.xxapi.gauge_options, hs.functions.option_parser(oarg.args[2],oarg.item.xxapi.gauge_options));
            }
            oarg.item.action_id = 9
            oarg.item.info = {
                "_min"  : oarg.item.xxapi.gauge_options.min,
                "_max"  : oarg.item.xxapi.gauge_options.max,
                "_prec" : oarg.item.xxapi.gauge_options.prec,
                "_txt2" : "",
            };
        } else {
            oarg.item.click = oarg.item.xxapi.gauge_options.click;
        }
        var _text2 = oarg.item.info._txt2 || "";
        if(_text2.match(/^XXOPTIONS\*/)) {
            oarg.item.xxapi.gauge_options = $.extend(oarg.item.xxapi.gauge_options, hs.functions.option_parser(_text2.substring(10),oarg.item.xxapi.gauge_options));
        }
        var _posx = _reversed ? "top" : "bottom";
        var _posy = _reversed ? "right" : "left"
        oarg.item.xxapi.gauge_container = $("<div />",{
            "css" : {
                "position"  : "absolute",
                "overflow"  : "hidden"
            }
        });
        oarg.item.xxapi.gauge_container.css(_posx,"0px");
        oarg.item.xxapi.gauge_container.css(_posy,"0px");
        oarg.item.xxapi.gauge = $("<div />",{
            "position"  : "absolute",
            "width" : oarg.item.width,
            "height" : oarg.item.height,
        });
        oarg.item.xxapi.gauge.css(_posx,"0px");
        oarg.item.xxapi.gauge.css(_posy,"0px");
        oarg.item.xxapi.gauge_container.append(oarg.item.xxapi.gauge);
        oarg.item.html = oarg.item.xxapi.gauge_container;
        oarg.item.customcss = {
            "line-height" : "inherit"
        }
    } 
    debug(5,"XXGAUGE: update values",oarg);
    var _min = oarg.item.info._min
    var _max = oarg.item.info._max
    var _value = Number(oarg.args[1]) || 0;
    var _percent = ((_value - _min) / (_max - _min) * 100) || 0;

    // update
    oarg.item.xxapi.gauge_container.css("width", _is_vertical ? "100%" : _percent + "%");
    oarg.item.xxapi.gauge_container.css("height", _is_vertical ? _percent  + "%" : "100%");
    oarg.item.xxapi.gauge.css("background", oarg.item.xxapi.gauge_options.gradient || oarg.item.color);
}

xxAPI.functions.XXHISTOGRAM = function ( oarg ) {
    debug(2,"XXHISTOGRAM",oarg);
    oarg.item.text = "";
    var _values = oarg.args[1].split(",");
    var _step = 1 / _values.length;
    var _options = {
        "border-radius"     : 0,
        "negative-color"    : "",
        "invert"            : 0
    };
    if(oarg.args.length > 2) {
        _options = $.extend(_options,hs.functions.option_parser(oarg.args[2],_options));
    }
    if(!oarg.item.xxapi.canvas) {
        oarg.item.xxapi.canvas =  $("<canvas />",{
        });
        oarg.item.xxapi.canvas.attr("width",oarg.item.width);
        oarg.item.xxapi.canvas.attr("height",oarg.item.height);
    }
    oarg.item.xxapi.canvas.css({
        "background-color"  : oarg.item.bg_color,
        "border-radius"     : parseInt(_options["border-radius"] || 0) + "px"
    });

    var _ctx = oarg.item.xxapi.canvas[0].getContext("2d");
    var _gradient;
    if (oarg.item.width > oarg.item.height) {
        _gradient = _ctx.createLinearGradient(_options.invert ? oarg.item.width : 0 ,0,_options.invert ? 0 : oarg.item.width,0);
    } else {
        _gradient = _ctx.createLinearGradient(0,_options.invert ? 0 : oarg.item.height,0,_options.invert ? oarg.item.height : 0);
    }
    for(var _i=0;_i<_values.length;_i++) {
        var _val = parseFloat(_values[_i]);
        if(isNaN(_val)) {
            continue;
        }
        var _color = oarg.item.color;
        if (_val < 0) {
            _val*=-1;
            _color = _options["negative-color"] || _color;
        }
        _gradient.addColorStop(_step*_i,hs.functions.get_rgba_color(_color,_val.toString()));
    }
    if (!oarg.item.html){
        oarg.item.html = oarg.item.xxapi.canvas;
    } 
    oarg.item.customcss = {
        "border-radius" : parseInt(_options["border-radius"] || 0) + "px"
    }
    _ctx.clearRect(0,0,oarg.item.width,oarg.item.height);
    _ctx.fillStyle = _gradient;
    _ctx.fillRect(0,0,oarg.item.width,oarg.item.height);
}

xxAPI.functions.XXSLIDER = function ( oarg ) {
    debug(2,"XXSLIDER",oarg);
    if(oarg.item.action_id != 9) {
        debug(1,"XXSLIDER needs Action 'Werteingabe'",oarg);
        return;
    }
    oarg.item.text = "";
    var _value = Number(oarg.args[1]) || 0;
    if(oarg.item.xxapi.hasOwnProperty("slider")) {
        oarg.item.xxapi.slider.val(_value);
    } else {
        oarg.item.click = false;
        oarg.item.customcss = {
            "background-color"  : "transparent",
            "pointer-events"    : "auto",
            "overflow"          : "initial"
        }
    }

    if($.isEmptyObject(oarg.item.info)) {
        debug(4,"XXSLIDER no item info " + oarg.item.uid,oarg);
        oarg.item.item_callback = function() {
            oarg.iscallback = true;
            xxAPI.functions.XXSLIDER( oarg );
        }
        return;
    }
    
    if(!oarg.item.xxapi.hasOwnProperty("slider")) {
        var _orientation = oarg.item.width > oarg.item.height ? "horizontal" : "vertical";
        var _range = Math.abs(oarg.item.info._min - oarg.item.info._max);
        var _size = Math.max(oarg.item.width, oarg.item.height);
        var _numsteps = _size / hs.options.sliderstep_px;
        oarg.item.xxapi.slider_step = hs.functions.math_round(_range / _numsteps,oarg.item.info._prec) || 1;
        debug(4,"XXSLIDER: set step to " + oarg.item.xxapi.slider_step,oarg);
        oarg.item.xxapi.slider_options = {
            "start"     : _value,
            "class"     : "",
            "connect"   : "lower",
            "extended"  : true,
            "orientation"   : _orientation,
            "direction"     : _orientation == "horizontal" ? "ltr" : "rtl",
            "step"          : oarg.item.xxapi.slider_step || 1,
            "range"         : {
                "min"   : oarg.item.info._min || 0,
                "max"   : oarg.item.info._max || 1
            }
        };
        var _text2 = oarg.item.info._txt2 || "";
        if(_text2.match(/^XXOPTIONS\*/)) {
            oarg.item.xxapi.slider_options = $.extend(oarg.item.xxapi.slider_options, hs.functions.option_parser(_text2.substring(10),oarg.item.xxapi.slider_options));
        }
        if(oarg.item.xxapi.slider_options.temp) {
            oarg.item.xxapi.temp = $.extend({
                "low"   : 2,
                "high"  : 28,
            },oarg.item.xxapi.slider_options.temp);
            delete oarg.item.xxapi.slider_options.temp;
        }
        oarg.item.xxapi.slider = $("<div />",{
            "class" : oarg.item.xxapi.slider_options.class + " " + (oarg.item.xxapi.slider_options.extended ? "noUi-extended" : ""),
            "css"   : {
                "width"   : _orientation == "horizontal" ? "100%" : "",
                "height"  : _orientation == "vertical" ? "100%" : ""
            }
        });
        oarg.item.xxapi.slider.noUiSlider(oarg.item.xxapi.slider_options);
        if(oarg.item.xxapi.slider_options.disabled) {
            oarg.item.xxapi.slider.attr("disabled","disabled");
        }
        if(oarg.item.xxapi.slider_options.hasOwnProperty("handle")) {
            if(!oarg.item.xxapi.slider_options.handle) {
                oarg.item.xxapi.slider.find(".noUi-handle").css("display","none");
            } else {
                oarg.item.xxapi.slider.find(".noUi-handle").addClass(oarg.item.xxapi.slider_options.handle);
            }
        }
        oarg.item.xxapi.slider.on("change",function() {
            oarg.item.value = oarg.item.info._val = oarg.item.xxapi.slider.val();
            hs.functions.do_valset( oarg );
        });
    }
    if(oarg.iscallback) {
        oarg.item.object.html(oarg.item.xxapi.slider);
    } else {
        oarg.item.html = oarg.item.xxapi.slider;
    }
    if(oarg.item.xxapi.temp) {
        oarg.item.color = hs.functions.temp2rgb(oarg.item.xxapi.temp.low ,oarg.item.xxapi.temp.high, _value);
    }
    if(oarg.item.object) {
        oarg.item.object.find(".noUi-connect").css("background-color",oarg.item.color);
        oarg.item.object.find(".noUi-background").css("background-color",oarg.item.bg_color);
    } else {
        setTimeout(function() {
            oarg.item.object.find(".noUi-connect").css("background-color",oarg.item.color);
            oarg.item.object.find(".noUi-background").css("background-color",oarg.item.bg_color);
        },0);
    }
}

xxAPI.functions.XXKNOB = function ( oarg ) {
    debug(2,"XXKNOB",oarg);
    if(oarg.item.action_id != 9) {
        debug(1,"XXKNOB " + oarg.item.uid + " needs Action 'Werteingabe'",oarg);
        return;
    }
    oarg.item.text = "";
    oarg.item.value = Number(oarg.args[1]);
    if(oarg.item.xxapi.hasOwnProperty("knob_input")) {
        oarg.item.xxapi.knob_input.val(oarg.item.value).trigger("change");
    } else {
        oarg.item.customcss = {
            "background-color"  : "transparent",
            "pointer-events"    : "auto"
        }
        oarg.item.xxapi.knob_input = $("<input />",{
            "disabled"      : true,
            "value"         : oarg.item.value,
            "css"    : {
                "user-select"   :"none",
                "opacity"       : 1
            }
        })
        oarg.item.click = false;
    }
    if($.isEmptyObject(oarg.item.info)) {
        debug(2,"XXKNOB no item info " + oarg.item.uid,oarg);
        oarg.item.item_callback = function() {
            oarg.iscallback = true;
            xxAPI.functions.XXKNOB( oarg );
        }
        return;
    }
    
    if(!oarg.item.xxapi.hasOwnProperty("knob_obj")) {
        var _min = Math.min(oarg.item.width,oarg.item.height);
        oarg.item.xxapi.knob_options = {
            "width"     : _min,
            "height"    : _min,    
            "fgColor"   : oarg.item.color,
            "bgColor"   : oarg.item.bg_color,
            "font"      : hs.gui.fonts[oarg.item.font]["font-family"],
            "fontWeight": hs.gui.fonts[oarg.item.font]["font-weight"],
            "min"       : oarg.item.info._min,
            "max"       : oarg.item.info._max,
            "format"    : function(text) {
                return hs.functions.math_round(text,oarg.item.info._prec) + " " + (oarg.item.info._einh || "");
            },
            "release"   : function(val) {
                if(oarg.item.value != val) {
                    oarg.item.value = oarg.item.info._val = val;
                    hs.functions.do_valset( oarg );
                }
            },
            "draw"      : function() {
                this.i.css("font-size",hs.gui.fonts[oarg.item.font]["font-size"]);  
            }
        };
        var _text2 = oarg.item.info._txt2 || "";
        if(_text2.match(/^XXOPTIONS\*/)) {
            oarg.item.xxapi.knob_options = $.extend(oarg.item.xxapi.knob_options,hs.functions.option_parser(_text2.substring(10),oarg.item.xxapi.knob_options));
        }
        if(oarg.item.xxapi.knob_options.temp) {
            var _temp = $.extend({
                "low"   : 2,
                "high"  : 28,
            },oarg.item.xxapi.knob_options.temp);
            delete oarg.item.xxapi.knob_options.temp;
            oarg.item.xxapi.knob_options.draw = function() {
                this.i.css("font-size",hs.gui.fonts[oarg.item.font]["font-size"]);
                this.i.css("color",hs.functions.temp2rgb(_temp.low ,_temp.high, this.cv));
                if(this.o.displayPrevious) {
                    this.o.fgColor = this.fgColor = hs.functions.temp2rgb(_temp.low ,_temp.high, this.cv).replace(")",",0.6)").replace("rgb","rgba");
                    this.pColor = hs.functions.temp2rgb(_temp.low ,_temp.high, this.v).replace(")",",0.4)").replace("rgb","rgba");
                } else {
                    this.o.fgColor = hs.functions.temp2rgb(_temp.low ,_temp.high, this.cv);
                }
            }
        }
        oarg.item.xxapi.knob_obj = oarg.item.xxapi.knob_input.knob(oarg.item.xxapi.knob_options);
    }
    if(oarg.iscallback) {
        oarg.item.object.html(oarg.item.xxapi.knob_obj);
    } else {
        oarg.item.html = oarg.item.xxapi.knob_obj;
    }
}

/*
    * XXLONGPRESS is used to send different values based on
    * duration the item is pressed. It is used in combination
    * with the "Logikbaustein" XXLONGPRESSHELPER and must always
    * be used with an item that has action "Werteingabe" with an
    * internal KO of type EIS2,6 (8-Bit 0-255). It sends the
    * following values:
        1 = click
        2 = longpress
        4 = longpress stopped
    * which can be bitshiftet with optinal Argument 2 ( 8 / 16 / 32 )
    
    * Argument 1 (optional) is the time in milliseconds 
    * Argument 2 (optonal) is an integer used to bitshift the values
    * Argument 3 (optonal) is values (1/2/4 see above) on which to open the page  / execute command (8/16/32)
    * Argument 4 (optonal) is Javascript code executed on longpress
     XXLONGPRESS*
*/
xxAPI.functions.XXLONGPRESS = function ( oarg ) {
    debug(2,"XXLONGPRESS",oarg);
    var _longpress_duration = parseInt(oarg.args[1]) || 50;
    if (_longpress_duration < 50) {
        _longpress_duration = 50;
    }
    oarg.item.xxapi.longpress_time = null;
    oarg.item.xxapi.longpress_timer = null;
    oarg.item.xxapi.longpress_bit = oarg.args.length > 2 ? parseInt(oarg.args[2]) || 0 : 0;
    oarg.item.xxapi.longpress_behaviour = oarg.args.length > 3 ? parseInt(oarg.args[3]) : 2;
    oarg.item.xxapi.longpress_code = oarg.args.length > 4 ? oarg.args.slice(4).join("*") : null; //FIXME

    oarg.item.eventcode["touchstart"] = oarg.item.eventcode["mousedown"] = function( oarg ) {
        oarg.item.xxapi.longpress_time = $.now() + _longpress_duration;
        if (oarg.item.xxapi.longpress_timer) {
            window.clearTimeout(oarg.item.xxapi.longpress_timer);
        }
        oarg.item.object.addClass("xxlongpressshort");
        var _oarg = oarg;
        oarg.item.xxapi.longpress_timer = window.setTimeout(function() {
            oarg.item.object.removeClass("xxlongpressshort").addClass("xxlongpresslong");
            xxAPI.functions.longpress_event("longpress", _oarg);
        },_longpress_duration);

    };
    oarg.item.eventcode["touchend"] = oarg.item.eventcode["mouseup"] = function( oarg ) {
        if(oarg.item.xxapi.longpress_timer) {
            window.clearTimeout(oarg.item.xxapi.longpress_timer);
        }
        oarg.item.xxapi.longpress_timer = null;
        $(".visuelement").removeClass("xxlongpressshort xxlongpresslong")
        if ($.now() >= oarg.item.xxapi.longpress_time) {
            xxAPI.functions.longpress_event("longpressup", oarg);
        } else {
            xxAPI.functions.longpress_event("click", oarg);
        }
    };
    oarg.item.click = false;
    oarg.item.text = '';
}

xxAPI.functions.longpress_event = function( presstype, oarg ) {
    debug(3,"XXLONGPRESS_event:" + presstype,oarg);
    var _typeval = {
        "click"         : 1,
        "longpress"     : 2,
        "longpressup"   : 4
    };
    if(oarg.item.xxapi.longpress_code) {
        var _jscode = hs.functions.fix_hsjavascript( oarg.item.xxapi.longpress_code );
        try {
            var _func = new Function('item','presstype','"use strict"; ' + _jscode);
            _func( oarg.item, presstype );
        } catch (e) {
            debug(1,"XXLONGPRESS_JS_ERROR:",{
                "e"      : e,
                "oarg"   : oarg,
                "jscode" : _jscode
            });
        }
    }
    if(oarg.item.action_id == 9) {
        oarg.item.value = _typeval[presstype]<<oarg.item.xxapi.longpress_bit;
        hs.functions.do_valset( oarg );
    }

    // not for "Befehl" or "Werteingabe"
    if ($.inArray(oarg.item.action_id,[0,9]) == -1 && _typeval[presstype] == (oarg.item.xxapi.longpress_behaviour & 0x7)) {
        var _has_cmd = oarg.item.has_command;
        // prevent commands from execute
        oarg.item.has_command = false;
        hs.functions.check_click( oarg );
        // restore
        oarg.item.has_command = _has_cmd;
    }

    if(oarg.item.has_command && _typeval[presstype] == (oarg.item.xxapi.longpress_behaviour >> 3)) {
        hs.functions.do_command( oarg );
    }
}

/*
    * XXREGICON is used to register xxAPI functions to an image.
    
    * Argument 1 is the image icon-id found top right in Experte on symbol
    * Argument 2 is the xxAPI function as it would be in a text item.
     XXREGICON*GIRA0815*XXMODULCLICK**Modulname*Weatherstation
*/
xxAPI.functions.XXREGICON = function ( oarg ) {
    debug(2,"XXREGICON",oarg);
    if (oarg.args.length > 2) {
        xxAPI.registered_icons[oarg.args[1]] = oarg.args.slice(2).join("*");
    }
    oarg.item.hidden = true;
}

/*
    * XXPAGE is either used as a text item or with
    * images with icon-id XXPAGE or XXPOPUP
    * XXPAGE is used to limit a page to a specifiv width,
    * the position of this item. The backgroundimage is scaled.
    * XXPAGE*POPUP is used to limit a page and open it as a popup.
    
    * Argument 1 (can be blank) is POPUP for a popup page.
    * Argument 2 (optinonal) CSS attributes to change the page
    * with special string MOUSE+0px can be used for top and left
    * to open the popup near the mouseclick
     XXPAGE*POPUP*top:MOUSE+10px;left:MOUSE+0px;
*/
xxAPI.functions.XXPAGE = function ( oarg ) {
    debug(2,"XXPAGE",oarg);
    oarg.item.hidden = true;
    oarg.item.page.is_popup = oarg.args[1] == "POPUP";
    if(oarg.item.page.is_modul && !oarg.item.page.is_popup) {
        debug(2,"XXPAGE inside Modul ignored",oarg);
        return;
    }

    oarg.item.page.width = oarg.item.left;
    oarg.item.page.height = oarg.item.top;
    
    if(!oarg.item.page.is_modul && !oarg.item.page.is_popup) {
        if(oarg.args[1] == "VISU") {
            var _resolution = "{0}x{1}".format(screen.width,screen.height);
            debug(3,"check Visu resize for " + _resolution,oarg);
            if (oarg.args.length == 2 || $.inArray(_resolution,oarg.args) > -1) {
                hs.gui.attr.initial_visu_width = oarg.page.width + oarg.item.width;
                hs.gui.attr.initial_visu_height = oarg.page.height + oarg.item.height;
                debug(3,"Visu resized to " + hs.gui.attr.initial_visu_width + "x" + hs.gui.attr.initial_visu_height);
            }
            return;
        } else {
            hs.gui.attr.visu_width = oarg.page.width;
            hs.gui.attr.visu_height = oarg.page.height;
        }
    }
    if(oarg.item.page.is_popup) {
        oarg.item.page.centered = true;
    }
    if (oarg.args.length > 2 && !oarg.item.page.object.is(":visible")) {
        var _match = null;
        var _regex =new RegExp(/([-\w]+)[:](.*?);/g);
        var _offset = {
            "x"       : 0,
            "y"       : 0, 
            "mirror"  : false
        };
        while(_match = _regex.exec(oarg.args[2])) {
            if(_match[1] == "top" || _match[1] == "left") {
                oarg.item.page.centered = false;
                _match[2] = _match[2].replace(/MOUSE([+-]\d+)(px|%)/,function(match,distance,unit) {
                    _offset.mirror = true;
                    _offset[_match[1] == "top" ? "y" : "x"] = parseInt(distance);
                    return "0";
                })
            }
            debug(5,"XXPAGE: change_css '"+_match[1]+"':'"+_match[2]+"'",_offset);
            oarg.item.page.object.css(_match[1],_match[2]);
        }
        if(_offset.mirror) {
            hs.functions.open_at_mouseclick( oarg.item.page.object, _offset);
        }
    }
}

hs.functions.open_at_mouseclick = function ( object, offset ) {
    object.css({
        "visibility"    : "hidden",
        "top"           : "0px", // top and left must be reset to 0
        "left"          : "0px"
    });
    setTimeout(function() {
        $("#VISUCONTAINER").css("transform","");
        var _calculator = new $.PositionCalculator({
            "item"          : object,
            "target"        : xxAPI.events.lastclick.event.currentTarget,
            "boundary"      : "#VISUCONTAINER",
            "itemAt"        : "top left",
            "targetAt"      : "bottom right",
            "flip"          : "both",
            "stick"         : "all",
            "itemOffset"    : offset || {x: 0, y: 0, mirror: true}
        });
        var _result = _calculator.calculate();
        var _top  = _result.moveBy.y;
        var _left = _result.moveBy.x;
        debug(5,"calculated_position " + _top + "/" +_left + "(" + offset.y + "/" + offset.x + ")",{"result" : _result, "object" : object, "target" : xxAPI.events.lastclick.event.currentTarget });
        object.css({
            "position"      : "absolute",
            "visibility"    : "visible",
            "top"           : parseInt(_top) + "px",
            "left"          : parseInt(_left) + "px"
        });
        if(hs.gui.container_scale > 1) {
            $("#VISUCONTAINER").css("transform","scale(" + hs.gui.container_scale + "," + hs.gui.container_scale + ")");
        }
    },0);
}

/*
    * XXIF is a function to evaluate an if statement
    * it can be used to execute the "Action" set on the item property page
    * and also execute the commands on the "Befehle" tab
    * if argument 1 evaluates to "true"
    
    * Argument 1 is the if that will be evaluated
    * special names $screen$/$user$/$orientation$ can be used to check for the 
    * screen resolution as "1024x768" ($screen$) / the current user "username" ($user$)
    * or the orientation as landscape/portrait ($orientation$)
    * Quotes are made using ? and the or doublepipe (||) will be made with ##
    * Argument 2... can be a common xxAPI function 
    * if Argument 2 is used / "Action" and "Befehle" is not executed by the if but are
    * passed through to the appended xxAPI function
    
    XXIF*$user$==?admin? && $orientation$ == ?landscape?
    XXIF*$screen$ == ?1024x768? ## $screen$ == ?768x1024?*XXDOMODULCLICK*QTR*WETTER

*/
xxAPI.functions.XXIF = function ( oarg ) {
    debug(2,"XXIF",oarg);
    oarg.item.hidden = true;
    if(oarg.args.length < 2) {
        return;
    }
    var _resources = {
        "screen" : "{0}x{1}".format(screen.width,screen.height),
        "user"   : hs.auth.username,
        "orientation"  : hs.functions.get_orientation()
    };
    var _regex = new RegExp(/\$(\w+)\$/,"g");
    var _args = oarg.args[1].replace(_regex,function(match,capture) {
        var _res = _resources[capture.toLowerCase()];
        if (_res) {
            return '"' + _res + '"';
        }
        return capture;
    });
    _args = hs.functions.fix_hsjavascript(_args);
    debug(5,"XXIF args",{ "args" :_args});
    try {
        var _result = eval(_args);
    } catch(e) {
        debug(1,"XXIF: eval error",{"oarg":oarg,"args":_args,"error":e});
    }
    if (_result == false) {
        return;
    }
    if (oarg.args.length > 2) {
        var _rest = oarg.args.splice(2)
        oarg.item.hidden = false;
        oarg.item.text = _rest.join("*");
        hs.functions.xxapi_check( oarg );
    } else {
        if (oarg.item.open_page > 0) {
            oarg.item.page.hidden = true;
            hs.post_load_functions.push(function() {
                oarg.page_id = oarg.item.open_page;
                hs.functions.load_page( oarg );
            });
        }
    }
}

/*
    * Text prefixed with XXWRAPTEXT is wraped inside the item text.
    
    * Argument 1 is the text that is to be wraped
    XXWRAPTEXT*The quick brown fox jumps over the lazy dog
    * $$BR$$ in the Text from Argument 1 will be replaced with newlines

*/
xxAPI.functions.XXWRAPTEXT = function ( oarg ) {
    debug(2,"XXWRAPTEXT",oarg);
    oarg.item.customcss["white-space"] = "normal";
    oarg.item.customcss["line-height"] = "130%";
    var _text = oarg.item.text.substring(11);
    var _elem = $("<span />").text(_text);
    _text = _elem.html().replace(/\$\$BR\$\$/g,"<br>");
    oarg.item.html = $("<p>").append( _elem.html(_text)).html();
}

/*
    * Text prefixed with XXBOUNCETEXT bounces from left to right and back if it don't fit
    
    * Argument 1 is the text that is to be bounced
    XXBOUNCETEXT*The quick brown fox jumps over the lazy dog
    * Argument 2 is the speed the text moves

*/
xxAPI.functions.XXBOUNCETEXT = function ( oarg ) {
    debug(2,"XXBOUNCETEXT",oarg);
    oarg.item.text = "";
    var _text = oarg.args[1];
    var _speed = oarg.args[2] || 30;
    var _item = oarg.item;
    setTimeout(function() {
        var _elem = $(_item.object.children()[0]);
        _elem.css({
            "position"  : "relative",
            "left"      : 0,
            "font-size" : "inherit"
        });
        _elem.stop(true,true);
        _elem.html(_text);
        var _maxleft = _elem.width() - _item.width;
        if (_maxleft > 0) {
            if (_maxleft < 15 ) {
                _elem.css("font-size",parseInt(_elem.css("font-size")) - 1 + "px");
            } else {
                xxAPI.functions.element_slide_left(_elem,_item,_speed);
            }
        }
    },0);
}
xxAPI.functions.element_slide_left = function(obj,item,speed) {
    if (!obj.is(":visible")) {
        return;
    }
    var _maxleft = obj.width() - item.width;
    obj.animate({left: -_maxleft}, {
        duration: _maxleft / speed * 1000,
        complete: function() { 
            xxAPI.functions.element_slide_right(obj, item, speed); 
        }
    });
}
xxAPI.functions.element_slide_right = function(obj,item,speed) {
    if (!obj.is(":visible")) {
        return;
    }
    var _maxleft = obj.width() - item.width;
    obj.animate({left: 0}, {
        duration: _maxleft / speed * 1000,
        complete: function() { 
            xxAPI.functions.element_slide_left(obj, item, speed); 
        }
    });
}

xxAPI.functions.geolocation_callback = function ( position ) {
    debug(2,"GEOLOCATION Received",position);
    xxAPI.functions.geolocation_send("timestamp",position.timestamp);
    $.each(position.coords, function( attribute, value ) {
        xxAPI.functions.geolocation_send(attribute, value);
    });
}

xxAPI.functions.geolocation_send = function ( attribute, value) {
    debug(5,"Attribute: " + attribute + "=" + value);
    if (xxAPI.geolocation.hasOwnProperty(attribute)) {
        debug(2,"XXGEOLOCATE send: " + attribute + " auf ID " + xxAPI.geolocation[attribute].id + " Wert " + value);
        xxAPI.geolocation[attribute].value = value;
        hs.functions.do_valset({
            "item"  : xxAPI.geolocation[attribute] ,
        });
    }
}

xxAPI.functions.geolocation_error = function ( err ) {
    debug(1,"Geolocation Failed", err);
}

/*
    * The XXGEOLOCATE is used to fire the geoloaction from the browser
    * it will send its data to predefined XXGEOLOCATION*attribute

*/
xxAPI.functions.XXGEOLOCATE = function ( oarg ) {
    debug(2,"XXGEOLOCATE",oarg)
    var _options = {
        enableHighAccuracy: true,
    };
    navigator.geolocation.getCurrentPosition(
        xxAPI.functions.geolocation_callback,
        xxAPI.functions.geolocation_error,
        _options
    );
    if (oarg) {
        oarg.item.text = "";
    }
}

/*
    * With XXGEOLOCATION, attributes from the browsers geolocation
    get tied to a Werteingabe function that will be called if attribute is received
    
    * Argument 1 is one of the getCurrentPosition attributes the Browser support
    * latitude, longitude, altitude, accuracy, altitudeAccuracy heading, speed, timestamp

    * The Element must be configured with Action "Werteingabe" with a 4 Byte EIS9 IEEE Float KO
*/
xxAPI.functions.XXGEOLOCATION = function ( oarg ) {
    debug(2,"XXGEOLOCATION",oarg)
    if (oarg.item.action_id != 9) {
        debug(1,"ERROR: " + oarg.item.text + " Keine Werteingabe");
    }
    xxAPI.geolocation[oarg.args[1]] = oarg.item;
    oarg.item.text = "";
}

/*
    * Template Section
*/
xxAPI.xxtemplates.DEFAULT = function ( obj ) {
    debug(2,"DEFAULT xxtemplate",obj);
    obj.options = $.extend(obj.defaults,obj.options);
    xxAPI.xxtemplates.werteingabe ( obj );
}

xxAPI.xxtemplates.werteingabe = function ( obj ) {
    var _prec = obj.oarg.item.info._prec;
    var _maxsize = Math.max(obj.oarg.item.info._min.toString().length, obj.oarg.item.info._max.toString().length) + ( _prec > 0 ? _prec +1 : 0);
    var _display_div = $("<div />",{
        "class"     : "werteingabe popupdisplay " + obj.options.class,
    });

    var _input = $("<input />",{
        "readonly"  : "true",
        "type"      : obj.options.type,
        "pattern"   : obj.options.pattern || (_prec ==  0 ? "^[-]?\\d+$": "^[-]?\\d+(\\.\\d{0," + _prec + "})?$"),
        "min"       : obj.oarg.item.info._min,
        "max"       : obj.oarg.item.info._max,
        "css"       : {
            "padding"   : "0",
            "height"    : "100%",    
            "color"     : "inherit",
            "font-size" : "inherit",
            "font-weight": "inherit",
            "font-family": "inherit",
            "text-align": "right",
        }
    });
    _input.attr("size",_maxsize.toString());
    var _unit_span = $("<span />",{
        "css"       : {
            "height"    : "100%",
        }
    }).text(obj.oarg.item.info._einh || "");

    _display_div.append(_input);
    _display_div.append(_unit_span);
    obj.popupbox.append(_display_div);
    hs.functions.set_validinput(_input,obj.options.initvalue);
    var _numpad = $("<ul class='werteingabe " + obj.options.class + "' />");
    var _buttons = obj.options.buttons.split(",");
    var _firstkey = true;
    $.each(_buttons,function (index,key) {
        var _button = $("<li />",{
            "rel"     : key,
            "class"     : "popupboxbutton werteingabe " + obj.options.class
        }).html(key);
        _button.on("click",function() {
            var _key = $(this).attr("rel");
            if(!_key) {
                return;
            }
            switch(_key) {
                case obj.options.clearbutton:  
                    hs.functions.set_validinput(_input,function(index,value) { 
                        return value.length > 1 && !value.match(/-\d$/) ? 
                            value.substr(0,value.length-1) : obj.options.clearvalue;
                    }); 
                    return;
                case obj.options.clearallbutton:  hs.functions.set_validinput(_input,obj.options.clearvalue); return;
                case obj.options.cancelbutton:
                    obj.popupbox.remove();
                    hs.functions.popup_overlay(false,false,obj.oarg);
                    return;
                case obj.options.okbutton:
                    if(_input.attr("valid") != "true") { 
                        return; 
                    }
                    obj.popupbox.remove();
                    hs.functions.popup_overlay(false,false,obj.oarg);
                    obj.oarg.item.info._val = obj.oarg.item.value = _input.val();
                    hs.functions.do_valset( obj.oarg );
                    return;
                case "&bull;": _key = "."; break;
                case "+/&minus;": _key = "-"; break;
                default:
                    if(_firstkey) {
                         hs.functions.set_validinput(_input,obj.options.clearvalue);
                        _firstkey = false;
                    }
                    debug(5,"button '" + _key + "' pressed");
            };
            hs.functions.write_input(_input,_key);
        });
        hs.functions.default_click_element(_button);
        _numpad.append(_button);
    });
    _numpad.appendTo(obj.popupbox);
}

xxAPI.xxtemplates.PINCODE = function ( obj ) {
    debug(2,"PINCODE",obj);
    obj.options = $.extend(obj.defaults,{
        "type"          : "password",
        "initvalue"     : "",
        "clearvalue"    : "",
        "buttons"       : "1,2,3,4,5,6,7,8,9,C,0,&#10003;",
        "class"         : "passworteingabe",
        "pattern"       : "^\\d{0,4}$"
    },obj.options);
    xxAPI.xxtemplates.werteingabe ( obj );
}

xxAPI.xxtemplates.TEMP = function ( obj ) {
    obj.popupbox.addClass("temperaturepopup");
    obj.options.temp = $.extend({
        "low"   : 2,
        "high"  : 28
    },obj.options.temp);

    obj.options.xxknob = $.extend({
        "angleArc"      : 250,
        "angleOffset"   : -125,
        "step"          : .1,
        "draw"          : function() {
            if(this.o.displayPrevious) {
                this.o.fgColor = this.fgColor = hs.functions.temp2rgb(obj.options.temp.low ,obj.options.temp.high, this.cv).replace(")",",0.6)").replace("rgb","rgba");
                this.pColor = hs.functions.temp2rgb(obj.options.temp.low ,obj.options.temp.high, this.v).replace(")",",0.4)").replace("rgb","rgba");
            } else {
                this.o.fgColor = hs.functions.temp2rgb(obj.options.temp.low ,obj.options.temp.high, this.cv);
            }
        }
    },obj.options.xxknob);
    xxAPI.xxtemplates.xxknob ( obj );
    obj.contentdiv.css("padding-bottom","0");
}

xxAPI.xxtemplates.SPEAKER = function ( obj ) {
    obj.popupbox.addClass("speakerpopup");
    obj.options.xxknob = $.extend({
        "angleArc"      : 300,
        "angleOffset"   : -150,
        "cursor"    : 30,
        "stopper"   : true
    },obj.options.xxknob);
    xxAPI.xxtemplates.xxknob ( obj );
}

xxAPI.xxtemplates.DIMMER = function ( obj ) {
    obj.popupbox.addClass("dimmerpopup");
    obj.options.xxknob = $.extend({
    },obj.options.xxknob);
    xxAPI.xxtemplates.xxknob ( obj );
}

xxAPI.xxtemplates.xxknob = function ( obj ) {
    debug(2,"XXKNOB Template",obj);
    obj.popupbox.removeClass("werteingabe");
    obj.knob_input = $("<input />",{
        "disabled"      : true,
        "value"         : obj.oarg.item.info._val,
        "css"    : {
            "user-select"   :"none",
            "opacity":  1
        }
    })
    var _rgb;
    var _knob_options = {
        "width"     : 200,
        "height"    : 200,
        "fgColor"   : "yellow",
        "bgColor"   : "grey",
        "font"      : hs.gui.systemfonts["WERT"]["font-family"],
        "fontWeight": hs.gui.systemfonts["WERT"]["font-weight"],
        "min"       : obj.oarg.item.info._min,
        "max"       : obj.oarg.item.info._max,
        "format"    : function(text) {
            return hs.functions.math_round(text,obj.oarg.item.info._prec) + " " + (obj.oarg.item.info._einh || "");
        },
        "release"   : function(val) {
            if(obj.oarg.item.value != val) {
                obj.oarg.item.value = obj.oarg.item.info._val = val;
                hs.functions.do_valset( obj.oarg );
            }
        },
        "draw"      : function() {
            if(this.o.displayPrevious && _rgb) {
                this.fgColor = _rgb.replace(")",",0.6)").replace("rgb","rgba");
                this.pColor  = _rgb.replace(")",",0.4)").replace("rgb","rgba");
            }
        }
    };
    _knob_options = $.extend(_knob_options,obj.options.xxknob || {});
    obj.knob_input.css("color",_knob_options.fgColor);
    obj.popupbox.css("width",obj.options.width  || "220px");
    obj.contentdiv = $("<div />",{
        "css"   : {
            "position"  : "relative",
            "width"     : "100%",
            "height"    : _knob_options.height ,
            "padding"           : "20px 0px",
            "text-algin"        : "center",
            "vertical-align"    : "bottom",
        }
    });
    obj.knob_obj = obj.knob_input.knob(_knob_options);
    obj.contentdiv.append(obj.knob_obj);
    obj.knob_obj.in_dom(function() {
        $(this).center(obj.contentdiv,"left");
        _rgb = window.getComputedStyle(obj.knob_input.get(0)).color;
    });
    obj.popupbox.append(obj.contentdiv);
    obj.popupbox.on("touchend mouseup",function() {
        obj.popupbox.fadeOut(hs.options.fadeouttime,function() {
            obj.popupbox.remove();
            hs.functions.popup_overlay(false,false,obj.oarg);
        });
    });
}

xxAPI.functions.geturl = function ( url ) {
    if (url.match(/^HSLIST:.*/) == null) {
        return url;
    }
    var _list = url.slice(7);
    return "/hslist?lst=" + _list + "&user=" + hs.auth.username + "&pw=" + hs.auth.password;
}

function debug(level,msg,obj) {
    if (level > hs.debuglevel) {
        return;
    }
    if (window.console) {
        var _logger = window.console.debug;
        switch (level) {
            case 0: _logger = window.console.error; break;
            case 1: _logger = window.console.warn; break;
            case 2: _logger = window.console.info; break;
            case 3: _logger = window.console.info; break;
            case 4: _logger = window.console.log; break;
        }
        if (typeof obj != "object") {
            _logger.call(window.console,msg);
        } else {
            _logger.call(window.console,msg+": %o",obj);
        }
    } 
        if (msg.indexOf("[start]") == 0) {
            hs.debug_cache.push(performance.now().toFixed(1) + "ms " + msg.substr(7))
        }
}

hs.functions.xxapi_check = function( oarg ) {
    if (oarg.item.type == "ICO") {
        oarg.item.text = xxAPI.registered_icons[oarg.item.image] || oarg.item.text;
    }
    if (oarg.item.text.match(/^XX.*\*/) == null) {
        return;
    }
    debug(3,"xxAPI Check: (" + oarg.item.uid + ") " + oarg.item.text ,oarg);
    oarg.args = oarg.item.text.split("*");
    var _func = xxAPI.functions[oarg.args[0].toUpperCase()];
    if(typeof _func === 'function') {
        _func( oarg );
    }
}

hs.functions.hs_session = function(target,start_page,session_width,session_height) {
    target = target || "VISU";
    if (hs.session.hasOwnProperty(target)) {
        //delete hs.session[target_item];
        var _session = hs.session[target];
        if(parseInt(session_width) && parseInt(session_height)) {
            _session._width = session_width;
            _session._height = session_height;
        }
        _session.target_obj = $("#" + target);
        _session.start_page = start_page;
        if (parseInt(_session.start_page)) {
            hs.functions.load_page({ 
                "session"   : _session,
                "page_id"   : _session.start_page
            });
            return;
        }
    }
    hs.session[target] = this;
    // Session
    this.target = target;
    this.default_target = null;
    this.target_obj = $("#" + target);
    this.start_page = start_page || null;
    this.auth = {
        "handle"        : 0,
        "pos"           : 0,
        "tan"           : 0,
        "tan_counter"   : 0,
        "glob_key1"     : "",
        "glob_key2"     : ""
    };
    debug(2,"Session_width: " + session_width + "/" + hs.gui.attr.visu_width);
    this._width = session_width;
    this._height = session_height;
    this.width = function() {
        return this._width || hs.gui.attr.visu_width;
    };
    this.height = function() {
        return this._height || hs.gui.attr.visu_height;
    };
    this.ajax_queue = $({});
    this.update_timer = null;

    this.connection_status = "initial";
    this.last_communication_time = 0;

    this.active_page = null;
    this.history = [];

    hs.functions.login_init({ 
        "session"   : this,
        "page_id"   : start_page
    });
}

hs.functions.hs_item = function( oarg ) {
    this.id     = oarg.json._pos || oarg.json._id;
    this.type   = oarg.json._type;
    this.session = oarg.session;

    this.page_id = oarg.page_id;
    this.page = oarg.page;
    this.uid = this.session.target + "_PAGE_" + this.page_id + "_" + this.type + "_" + this.id;
    oarg.item = this;
    if (this.page.items.hasOwnProperty(this.uid)) {

        oarg.item = this.page.items[this.uid];

    } else {
        oarg.item.width  = parseInt(oarg.json._w);
        oarg.item.height = parseInt(oarg.json._h);
        oarg.item.top    = parseInt(oarg.json._y);
        oarg.item.left   = parseInt(oarg.json._x);
        
        oarg.item.click       = (oarg.json._click*1) == 1;
        oarg.item.has_command = (oarg.json._hcmd*1) == 1;
        oarg.item.open_page   = parseInt(oarg.json._pid   || null);
        oarg.item.action_id   = parseInt(oarg.json._typ   || -1);
        oarg.item.font        = parseInt(oarg.json._fid   ||  0);
        oarg.item.align       = hs.functions.number2align( parseInt(oarg.json._align ||  0));
        oarg.item.indent      = parseInt(oarg.json._bord  ||  0);
        oarg.item.info        = hs.functions.get_item_info( oarg );
    }
    oarg.item.text        = oarg.json._txt || oarg.json._val ||  "";
    if (!(typeof oarg.item.text == "string" && oarg.item.text.match(/^(XXPAGE|XXSCRIPT)\*/)) && hs.options.itemdiscardmode == 2 && (oarg.item.left > oarg.session.width() || oarg.item.top > oarg.session.height())) {
        debug(3,"discard item " + oarg.item.uid + " outside visu",oarg);
        oarg.item.page.items[oarg.item.uid] = oarg.item;
        return;
    }
    oarg.item.json = oarg.json;
    
    oarg.item.color       = hs.functions.get_hexcolor( oarg.json._fcol ) || oarg.item.color || "transparent";
    oarg.item.bg_color    = hs.functions.get_hexcolor( oarg.json._bgcol || oarg.json._col) || oarg.item.bg_color || "transparent";
    oarg.item.html        = null;
    oarg.item.image       = oarg.json._ico || null;
    oarg.item.url         = oarg.json._url || null;
    oarg.item.auth        = oarg.json._auth || null;
    oarg.item.image_onload = null;

    if (oarg.page.items.hasOwnProperty(oarg.item.uid)) {
        oarg.item.cmd = "update";
        hs.functions.update_item( oarg );
    } else {
        // xxAPI
        oarg.item.xxapi = {};
        oarg.item.customcss = {};
        oarg.item.eventcode = {
            "mousedown" : null,
            "mouseup"   : null,
            "touchstart": null,
            "touchend"  : null,
            "mouseleave": null,
            "blur"      : null
        };
        oarg.item.hidden = false;
        oarg.item.object = null;
        oarg.item.title = "";
        oarg.item.event = null;
        oarg.item.update_code = null;
        
        if(oarg.item.click && oarg.item.action_id == 1 && oarg.item.open_page == oarg.item.page.page_id) {
            debug(4,"hs_item: remove click from page",oarg.item);
            oarg.item.action_id = 0;
            oarg.item.click = oarg.item.has_command;
        }
        oarg.item.cmd = "create";
        hs.functions.xxapi_check( oarg );
        if(hs.options.itemdiscardmode == 1 && (oarg.item.left > oarg.session.width || oarg.item.top > oarg.session.height)) {
            debug(3,"discard html item " + oarg.item.uid + " outside visu",oarg);
            oarg.item.page.items[oarg.item.uid] = oarg.item;
            return;
        }
        if (oarg.item.object == null ) {
            debug(5,"Create HTML Element " + oarg.item.uid,oarg);
            oarg.item.object = $("<div />", {
                "id"        : oarg.item.uid,
                "title"     : oarg.item.title,
                "css"         : {
                    "position"      : "absolute",
                    "display"       : "block",
                    "top"           : oarg.item.top,
                    "left"          : oarg.item.left,
                    "height"        : oarg.item.height + "px",
                    "width"         : oarg.item.width  + "px",
                    "line-height"   : oarg.item.height + "px"
                },
                "class"         : "visuelement"
                
            });

            $.each( Object.keys(oarg.item.eventcode) ,function(index, value) {
                oarg.item.object.on(value,function (event) {
                    oarg.item.event = event;
                    hs.functions.mouse_event( oarg )
                });
            });

            if (oarg.item.click && oarg.item.action_id != 20) {
                oarg.item.object.on("click",function (event) {
                    oarg.item.event = event;
                    hs.functions.check_click( oarg );
                });
                oarg.item.object.addClass("visuclickelement");
            } else {
                if(hs.functions.has_functions(oarg.item.eventcode)) {
                    oarg.item.object.addClass("visuclickelement");
                }
                if(oarg.item.action_id == 20) {
                    oarg.item.click = false;
                    oarg.item.object.css("pointer-events","auto");
                }
            }
            if (oarg.item.type == "BOX") {
                if (oarg.item.width > 5 && oarg.item.height > 5) {
                    oarg.item.object.css( {
                        "width"             : (oarg.item.width  -2) + "px",
                        "height"            : (oarg.item.height -2) + "px",
                        "border-width"      : "1px",
                        "border-style"      : "solid",
                        "border-color"      : oarg.item.bg_color
                    });
                }
                oarg.item.object.css("background-color", oarg.item.bg_color);
            }
            
            if (oarg.item.type == "TXT") {
                oarg.item.object.css( hs.gui.fonts[oarg.item.font] );
                oarg.item.object.css( {
                    "background-color"  : oarg.item.bg_color,
                    "color"             : oarg.item.color,
                    "white-space"       : "nowrap",
                    "text-align"        : oarg.item.align
                });
                if (oarg.item.indent > 0) {
                    var _multiply = 0;
                    if ($.inArray(oarg.item.align,["left","center"]) > -1) {
                        oarg.item.object.css( "padding-left",oarg.item.indent + "px");
                        _multiply += 1;
                    } 
                    if ($.inArray(oarg.item.align,["center","right"]) > -1) {
                        oarg.item.object.css( "padding-right",oarg.item.indent + "px");
                        _multiply += 1;
                    }
                    oarg.item.object.css("width",oarg.item.width - (oarg.item.indent * _multiply ) ); 
                }

                if (oarg.item.html == null) {
                    oarg.item.object.append($("<span />").text(oarg.item.text));
                } else {
                    oarg.item.object.html(oarg.item.html);
                }
            }
            
            if ( $.inArray(oarg.item.type, ["CAM","GRAF","ICO"]) > -1) {
                hs.functions.load_image( oarg );
            }
            
            oarg.item.s_text = oarg.item.text;
            oarg.item.s_color = oarg.item.color;
            oarg.item.s_bg_color = oarg.item.bg_color;
            oarg.item.s_image = oarg.item.image;
            oarg.item.s_url = oarg.item.url;
            

        }
        oarg.item.page.items[oarg.item.uid] = oarg.item;
        if(!oarg.item.hidden) {
            oarg.item.page.object.append(oarg.item.object);
        }
    }
    oarg.item.object.css(oarg.item.customcss);
}

hs.functions.update_item = function ( oarg ) {
    // xxAPI update check
    hs.functions.xxapi_check( oarg );

    if ( $.inArray(oarg.item.type, ["TXT"]) > -1) {
        if (oarg.item.s_color != oarg.item.color) {
            debug(4,"COLOR (" + oarg.item.uid + ") changed to '" + oarg.item.color + "'")
            oarg.item.object.css("color",oarg.item.color);
        }
        if (oarg.item.s_text != oarg.item.text) {
            debug(4,"TEXT (" + oarg.item.uid + ") changed to '" + oarg.item.text + "'")
            if (oarg.item.html == null) {
                oarg.item.object.children().replaceWith($("<span />").text(oarg.item.text));
            } else {
                oarg.item.object.html(oarg.item.html);
            }
        }

    }
    if ( $.inArray(oarg.item.type, ["TXT","BOX"]) > -1) {
        if (oarg.item.s_bg_color != oarg.item.bg_color) {
            debug(4,"BGCOLOR BOX/TEXT (" + oarg.item.uid + ")  changed to '" + oarg.item.bg_color + "'");
            oarg.item.object.css({
                "background-color"  : oarg.item.bg_color,
                "border-color"      : oarg.item.bg_color
            });
        }
    }
    if ( $.inArray(oarg.item.type, ["ICO"]) > -1) {
        if (oarg.item.image && oarg.item.s_image != oarg.item.image) {
            debug(4,"ICO (" + oarg.item.uid + ") changed # " + oarg.item.image);
            hs.functions.load_image( oarg );
        }
    }
    if ( $.inArray(oarg.item.type, ["CAM"]) > -1) {
        if (oarg.item.url && oarg.item.s_url != oarg.item.url) {
            debug(4,"URL (" + oarg.item.uid + ") changed # " + oarg.item.url );
            hs.functions.load_image( oarg );
        }
    }
    oarg.item.s_text = oarg.item.text;
    oarg.item.s_color = oarg.item.color;
    oarg.item.s_bg_color = oarg.item.bg_color;
    oarg.item.s_image = oarg.item.image;
    oarg.item.s_url = oarg.item.url;
}

hs.functions.load_image = function ( oarg ) {
    debug(5,"load_image",oarg);
    var _child = oarg.item.image_object || null;
    if(oarg.item.image_loading) {
        // cancel loading new Image
        return;
    }
    var _url = "";
    if (oarg.item.type == "CAM") {
        if (oarg.item.url) {
            _url =  oarg.item.url;
            _url = _url.replace(new RegExp(/^(http[s]?:\/\/)?([\w:]+@)?([\w]*[.]+[\w.]*)?(\/.*|[^].*)/),function(match,proto,auth,host,uri) {
                debug(5,"load_image - fix url", { "match" : match, "proto" : proto, "host" : host, "uri" : uri });
                if (!host) {
                    // auth local client uri
                    return uri.indexOf("/gui") == 0 ? hs.functions.get_url ({ 
                        "session"   : oarg.item.session, 
                        "url"       : uri, 
                        "cmd"       : ""
                    }) : uri;
                }
                if (!auth) {
                    auth = "";
                }
                if (!proto) {
                    proto = "http://";
                }
                if (oarg.item.auth) {
                    // add basic auth
                    auth = $.base64.decode(oarg.item.auth) + "@";
                }
                return proto + auth + host + uri;
            });
        } else {
            _url = hs.functions.get_url ({ 
                "session"   : oarg.item.session, 
                "url"       : oarg.item.page ? "/guicamv?id=" + oarg.item.id : "/guicam?id=" + oarg.item.id, 
                "cmd"       : ""
            });
        }
    }
    
    if (oarg.item.type == "GRAF") {
        _url = hs.functions.get_url ({ 
            "session"   : oarg.item.session, 
            "url"       : oarg.item.page ? "/guigrafv?id=" + oarg.item.id : "/guigraf?id=" + oarg.item.id, 
            "cmd"       : ""
        });
    }
    if(oarg.item.type == "ICO") {
        _url = "/guiico?id=" +  oarg.item.image + "&cl=" + hs.auth.gui_design + "&hash=" + hs.gui.hashes._ico;
    }

    oarg.item.image_loading = true;
    var _img = $("<img />", {
        "src"       : hs.functions.get_nocache_url(_url),
        "alt"       : " ",
        "width"     : oarg.item.width,
        "height"    : oarg.item.height,
        "css"       : {
            "position"  : "absolute",
            "display"   : "block"
        },
        "on"        : {
            "dragstart" : function () { return false; },
            "load"      : function () { 
                //debug(5,"Image:load",oarg)
                if (this.naturalWidth == 0 && this.naturalHeight == 0) {
                    debug(1,"Error: Image '" + this.src + "' failed",{ "img" : this, "item" : oarg.item });
                    this.remove();
                }
                if (typeof oarg.item.image_onload === 'function') {
                    oarg.item.image_onload(oarg);
                }
                oarg.item.image_loading = false;
                oarg.item.image_object = $(this);
                oarg.item.next_update = hs.functions.get_next_update ( oarg.item );
                oarg.item.object.prepend( this );
                if (_child != null) {
                    _child.fadeOut(hs.options.fadeouttime,function() {
                        _child.attr("src","");
                        _child.remove();
                    });
                }
            },
            "error"     : function() {
                debug(1,"Error: Image '" + this.src + "' failed",{ "img" : this, "item" : oarg.item });
                oarg.item.image_loading = false;
                oarg.item.next_update = hs.functions.get_next_update ( oarg.item );
                return true;
            }
        }    
    })
}

hs.functions.get_nocache_url = function( url ) {
    var _sep = url.match(/\?/) ? "&_=" : "?_=";
    return url.match(/http[s]?\:\/\//) ? url + _sep + $.now() : url;
}

hs.functions.get_next_update = function ( oarg ) {
    var _now = $.now();
    var _ret = 0;
    switch(oarg.type) {
        case "ICO"  : _ret = _now + ((oarg.refresh || 1000000 )*1000); break;
        case "CAM"  : _ret = _now + ((oarg.refresh || hs.user.refresh_visucam)*1000); break;
        case "GRAF" : _ret = _now + ((oarg.refresh || hs.user.refresh_visugraf)*1000); break;
        case "PAGE" : _ret = _now + ((oarg.refresh || hs.user.refresh_visu)*1000); break;
    };
    debug(5,"get_next_update " + oarg.uid + " to (" + (_ret - _now) + ")" ,oarg);
    return _ret;
}

hs.functions.hs_page = function( oarg ) {
    this.page_id    = oarg.page_id;
    this.session    = oarg.session;
    this.type       = "PAGE";
    this.is_modul   = oarg.session.target == "VISU" ? false:true;
    this.id         = this.session.target + "_PAGE_" + this.page_id;
    oarg.page       = this;
    if (!this.is_modul) {
        hs.gui.attr.visu_height = hs.gui.attr.initial_visu_height;
        hs.gui.attr.visu_width = hs.gui.attr.initial_visu_width;
    }
    if (hs.gui.pages.hasOwnProperty(this.id)) {
        debug(4,"update existing Page (" + oarg.page_id + "): ",oarg);
        oarg.page = hs.gui.pages[this.id];
        oarg.page.object.css("visibility","visible");
        hs.functions.loop_items( oarg );

        if (oarg.cmd == "gv" && !oarg.page.hidden) {
            hs.functions.fade_page( oarg );
        }
        return oarg.page;
    }
    debug(4,"create new Page (" + oarg.page_id + "): ",oarg);
    oarg.page.next_update = hs.functions.get_next_update( oarg.page );
    hs.gui.pages[oarg.page.id] = oarg.page;
    oarg.page.hidden     = false;
    oarg.page.is_popup   = false;
    oarg.page.centered   = false;
    oarg.page.bg_image   = oarg.json.HS.VISU._bg;
    oarg.page.icon       = oarg.json.HS.VISU._ico;
    oarg.page.qanz       = parseInt(oarg.json.HS.VISU._bg);
    oarg.page.title      = oarg.json.HS.VISU._txt1;
    oarg.page.text       = oarg.json.HS.VISU._txt2;
    oarg.page.width      = oarg.session.width();
    oarg.page.height     = oarg.session.height();
    oarg.page.items      = {};
    oarg.page.object = $("<div />", {
        "id"            : oarg.page.id,
        "class"         : "visupage"
    });
    
    if (oarg.page.bg_image != "XXTRSPBG") {
        oarg.page.object.css({
            "background-image"      : "url(/guibg?id=" + oarg.page.bg_image + "&cl=" + hs.auth.gui_design + "&hash=" + hs.gui.hashes._bg + ")",
            "background-repeat"     : "no-repeat"
        });
    }

    hs.functions.loop_items( oarg );

    oarg.page.object.css({
        "position"  : "absolute",
        "overflow"  : "hidden",
        "visibility": "visible",
        "width"     : oarg.page.is_popup ? oarg.page.width : "100%",
        "height"    : oarg.page.is_popup ? oarg.page.height : "100%"
    })
    
    if (!oarg.page.hidden) {
        hs.functions.fade_page( oarg );
        if (oarg.page.centered) {
            oarg.page.object.center();
        }
    }
}

hs.functions.fade_page = function( oarg ) {
    hs.functions.set_viewport();
    if(oarg.page.is_popup) {
        $("#POPUP").append(oarg.page.object);
        hs.functions.popup_overlay(true,false,oarg);
    } else {
        debug(4,"Fade Page " + oarg.page.page_id,oarg);
        oarg.session.target_obj.prepend(oarg.page.object);
        if(oarg.session.active_page && oarg.session.active_page.page_id != oarg.page.page_id) {
            $.each($(oarg.session.target_obj).children(),function() {
                if(this == oarg.page.object[0]) {
                    return;
                }
                debug(4,"Detach Element " + this.id,$(this));
                $(this).detach();
            });
            $.each($("#POPUP").children(),function() {
                $(this).detach();
            });
            oarg.session.history = $.grep(oarg.session.history,function(obj) {
                return obj.is_popup == false;
            });
            hs.functions.popup_overlay(false,false,oarg);
        }
    }
    if(!oarg.page.is_modul && !oarg.page.is_popup) {
        document.title = "xxAPI² - " + oarg.page.title;
    }
    hs.functions.add_history( oarg );
    oarg.page.object.show();
    oarg.session.active_page = oarg.page;
}

hs.functions.popup_overlay = function( status, blur, oarg ) {
    if(blur) {
        $("#VISUCONTAINER").addClass("popupeffect");
        hs.gui.popup_layer = 0;
    }
    if(status) {
        hs.gui.popup_layer +=1;
        if(oarg) {
            oarg.session.target_obj.addClass("blocked");
        }
        $("#POPUP").css("display","block");
    } else {
        hs.gui.popup_layer = hs.gui.popup_layer > 0 ? hs.gui.popup_layer -1 : 0;
        if(oarg) {
            oarg.session.target_obj.removeClass("blocked");
        } else {
            $(".blocked").removeClass("blocked");
        }
        debug(5,"popup_remove " + $("#POPUP").children().length,$("#POPUP").children());
        if($("#POPUP").children().length == 0) {
            $("#POPUP").css("display","none");
            hs.gui.popup_layer = 0;
        }
        $("#VISUCONTAINER").removeClass("popupeffect");
    }
}

hs.functions.add_history = function( oarg ) {
    debug(5,"add_history " + oarg.page.uid,oarg);
    if(oarg.page.is_popup) {
        var _popindex;
        $.each(oarg.session.history,function(index,obj) {
            if(obj.page_id == oarg.page_id) {
                _popindex = index;
                return false;
            };
        });
        if(_popindex) {
            oarg.session.history.splice(_popindex,1);
        }
    }
    var _last = oarg.session.history[oarg.session.history.length -1];
    if(!_last || _last.page_id != oarg.page_id) {
        oarg.session.history.push({
            "page_id"       : oarg.page_id,
            "is_popup"      : oarg.page.is_popup,
            "is_modul"      : oarg.page.is_modul
        });
    }
}

hs.functions.loop_items = function ( oarg ) {
    $.each(oarg.json.HS.ITEMS, 
        function(item_type, child) {
            if ($.isArray(child)) {
                $.each(child, 
                    function(counter,item) {
                        var _json = item;
                        // create new oarg object
                        new hs.functions.hs_item({
                            "json"      : _json,
                            "session"   : oarg.session,
                            "page"      : oarg.page,
                            "page_id"   : oarg.page_id
                        });
                    }
                );
            } else {
                var _json = child;
                // create new oarg object
                new hs.functions.hs_item({
                    "json"      : _json,
                    "session"   : oarg.session,
                    "page"      : oarg.page,
                    "page_id"   : oarg.page_id
                });
            }
        }
    );
    hs.post_load_functions = $.grep(hs.post_load_functions, function(_func,_index) {
        debug(5,"loop_items: post_load_function",_func);
        if(typeof _func === 'function') {
            try {
                _func();
            } catch (e) {
                debug(1,"post_load_function error",e);
            }
        }
        return false;
    });
}

hs.functions.write_input = function ( input, value ) {
    var _val = input.val();
    if(value == "-") {
        _val = _val*-1;
    } else {
        if(_val == "0" && value != ".") {
            _val = value;
        } else {
            _val = _val + value;
        }
    }
    hs.functions.set_validinput(input,_val,true);
}

hs.functions.set_validinput = function ( input, value, deny_invalid_pattern) {
    debug(4,"set_validinput " + value,input);
    if(typeof value == 'function') {
        value = value(0,input.val());
    }
    value = value || "";
    var _min = input.attr("min")*1;
    var _max = input.attr("max")*1;
    var _maxlen = input.attr("size")*1;
    if(value.length > _maxlen) {
        return false;
    }
    var _pattern = new RegExp(input.attr("pattern"));
    var _valid = true;
    if(!_pattern.test(value)) {
        _valid = false;
        if(deny_invalid_pattern) {
            return false;
        }
    }
    var _val = parseFloat(value);
    if(!isNaN(_max) && _val > _max ) {
        _valid = false;
    }
    if(!isNaN(_min) && _val < _min ) {
        _valid = false;
    }
    if(_valid) {
       input.parent().removeClass("invalidinput");
    } else {
       input.parent().addClass("invalidinput");
    }
   
    input.attr("valid",_valid);
    input.val(value);
}

hs.functions.stringdot2object = function ( obj, text ) {
    debug(5,"string to obj " + text,obj);
    return text.split(".").reduce(function(_obj,_index) {
      return typeof _obj == "object" ? _obj[_index] : undefined;
    },obj);
}

hs.functions.option_parser = function ( text , defaults) {
    var _obj = {};
    var _regex = /(.*?)(?::|=)(?:"(.*?)"|'(.*?)'|([^;]*?))(?:;|$)/g;
    var _match;
    while(_match = _regex.exec(text)) {
        var _val = _match[2] || _match[3] || _match[4];
        var _default = hs.functions.stringdot2object( defaults, _match[1] );
        switch(Object.prototype.toString.call(_default)) {
            case "[object Number]":
                _val = parseFloat(_val);
                if(isNaN(_val)) {
                    continue;
                }
                break;
            case "[object Boolean]":
                _val = (_val == true);
                break;
            case "[object Array]":
                try {
                    _val = JSON.parse(_val);
                } catch (e) {
                    debug(1,"ERROR: option_parser",e);
                    continue;
                }
                break;
            default:
                var _numval = _val*1;
                if(_val == "true" || _val == "false") {
                    _val = (_val == "true");
                } else {
                    _val = isNaN(_numval) ? _val : _numval;
                }
                break;
        }
        var _levels = _match[1].split(".");
        var _objcopy = _obj;
        var _i = 0;
        // objects with dot in string
        while(_i < _levels.length -1) {
            if(typeof _objcopy[_levels[_i]] != "object") {
                _objcopy[_levels[_i]] = {};
            }
            _objcopy = _objcopy[_levels[_i]];
            _i++;
        }
        _objcopy[_levels[_levels.length -1]] = _val;
    }
    return _obj;
}

hs.functions.popup_werteingabe = function ( oarg, callback ) {
    if(!callback) {
        oarg.item.item_callback = function() {
            hs.functions.popup_werteingabe( oarg ,true);
        }
        hs.functions.get_item_info( oarg );
        return;
    }
    var _options = {};
    var _defaults = {
        "xxtemplate": "default",    
        "type"      : "text",
        "pattern"   : null,
        "class"     : "",
        "buttons"   : "1,2,3,C,4,5,6,AC,7,8,9,&#8630;,&bull;,0,+/&minus;,&#10003;",
        "okbutton"       : "&#10003;",
        "cancelbutton"   : "&#8630;",
        "clearbutton"    : "C",
        "clearallbutton" : "AC",
        "initvalue"      : oarg.item.info._val || "0",
        "clearvalue"     : "0",
        "top"   : null,
        "left"  : null
    };


    var _text2 = oarg.item.info._txt2 || "";
    if(_text2.match(/^XXOPTIONS\*/)) {
        _options = hs.functions.option_parser(_text2.substring(10),_defaults);
    }
    var _popupbox = $("<div />",{
        "class"     : "popupbox werteingabe " + (_options.class || _defaults.class ),
        "css"       : hs.gui.systemfonts["WERT"]
    });
    var _title = $("<div />",{
        "class"     : "popuptitle " + (_options.class || _defaults.class),
        "css"       : hs.gui.systemfonts["TITEL1"]
    }).text(oarg.item.info._txt1).on("click",function() {
        _popupbox.remove();
        hs.functions.popup_overlay(false,false,oarg);
    });
     var obj = {
        "oarg"      : oarg,
        "options"   : _options,
        "defaults"  : _defaults,
        "popupbox"  : _popupbox,
        "title"     : _title
    }
    var _template_func = xxAPI.xxtemplates[(_options.xxtemplate || "default").toUpperCase()] || xxAPI.xxemplates.DEFAULT;
    if(typeof _template_func === "function") {
        _template_func(obj);
    }
    $.each(_popupbox.children(),function() {
        if($(this).width() > _popupbox.width()) {
            _popupbox.css("width",$(this).width());
        }
    });
    _popupbox.prepend(_title);
    hs.functions.popup_overlay(true,false,oarg);

    if(hs.gui.device.scale > 1) {
         _popupbox.css("transform","scale(" + hs.gui.device.scale + "," + hs.gui.device.scale + ")");
    }
    $("#POPUP").append(_popupbox);
    if(!_options.top && !_options.left) {
        _popupbox.center();
    } else {
        var _offset = {
            "x"       : 0,
            "y"       : 0, 
            "mirror"  : false
        };
        $.each(["top","left"],function() {
            var _attr = this;
            var _text = _options[_attr];
            if(!_text) {
                return;
            }
            _text = _text.replace(/MOUSE([+-]\d+)(px|%)/,function(match,distance,unit) {
                _offset.mirror = true;
                _offset[_attr == "top" ? "y" : "x"] = parseInt(distance);
                return "0";
            })
        });
        if(_offset.mirror) {
            hs.functions.open_at_mouseclick( _popupbox, _offset);
        } else {
            if(_options.top) {
                _popupbox.css("top",_options.top);
            }
            if(_options.left) {
                _popupbox.css("left",_options.left);
            }
        }
    }

};

hs.functions.default_click_element = function ( obj ) {
    obj.addClass("visuelement visuclickelement");
    obj.on({
        "mousedown touchstart": function() {
            $(this).addClass("activevisuelement");
        },
        "mouseup touchend": function() {
            var _this = $(this);
            window.setTimeout(function() {
                _this.removeClass("activevisuelement");
            },hs.options.visualclickdelay);
        }
    });
}

hs.functions.popup_image = function ( oarg ) {
    debug(3,"popup_image",oarg);
    if($.isEmptyObject(oarg.item.info)) {
        oarg.item.item_callback = function() {
            hs.functions.popup_image( oarg );
        }
        return;
    }
    var _options = {
        "class"     : "",
        "defaultclass"  : " ",
        "imgtype"       : "CAM",
        "top"       : null,
        "left"      : null,
        "width"     : hs.gui.attr.visu_width * 0.665,
        "height"    : hs.gui.attr.visu_height * 0.665
    };
    var _text2 = oarg.item.info._txt2 || "";
    if(_text2.match(/^XXOPTIONS\*/)) {
        _options = $.extend(_options,hs.functions.option_parser(_text2.substring(10),_options));
    }
    switch(oarg.item.action_id) {
        case 7:
            _options.defaultclass = " kamerapopup ";
            break;
        case 16:
            _options.defaultclass = " diagrammpopup ";
            _options.imgtype = "GRAF";
            break;
    }

    var _div = $("<div />",{
        "class"     : "popupbox" + _options.defaultclass + _options.class,
        "css"       : hs.gui.systemfonts["CAMARCH1"]
    });

    var _title = $("<span />",{
        "class"     : "popuptitle " + _options.defaultclass + _options.class,
        "css"       : hs.gui.systemfonts["TITEL1"]
    }).text(oarg.item.info._txt1).on("click",function() {
        _div.remove();
        delete oarg.item.page.items["POPUP"];
        hs.functions.popup_overlay(false,false,oarg);
    });
    _div.append(_title);

    var _imgdiv = $("<div />",{
        "css"   : {
            "position"  : "relative",
            "margin"    : "15px 40px 15px 40px",
            "width"     : _options.width,
            "height"    : _options.height,
            "background-color"   : "black",
        }
    }).on("click",function() {
        _div.remove();
        delete oarg.item.page.items["POPUP"];
        hs.functions.popup_overlay(false,false,oarg);

    });
    var _fake_item = {
        "session"   : oarg.item.session,
        "id"        : oarg.item.id,
        "type"      : _options.imgtype,
        "object"    : _imgdiv,
        "width"     : "auto",
        "height"    : "100%",
        "top"       : "0px",
        "left"      : "0px",
        "url"       : oarg.item.info._url,
        "auth"      : oarg.item.info._auth,
        "info"      : oarg.item.info
    };
    
    if(oarg.item.info._mot == 0) { // no manual refresh for Streams
        oarg.item.page.items["POPUP"] = _fake_item;
    }
    
    hs.functions.load_image({ "item"    : _fake_item });
    _div.append(_imgdiv);

    if(oarg.item.info.tast) {
        _imgdiv.css("margin-bottom","120px");
        var _button_div = $("<div />",{
            "css"       : {
                "width"             : "100%",
                "bottom"            : "0px",
                "position"          : "absolute",
                "white-space"       : "nowrap",
                "text-align"        : "center", // fixme 
                "margin-top"        : "15px",
                "margin-bottom"     : "15px",
            }
        }).appendTo(_div);
        $.each(oarg.item.info.tast, function(index,obj) {
            var _button = $("<div />").append($("<img />",{
                "class"     : _options.defaultclass + _options.class,
                "src"       : "/guiico?id=" +  obj._ico + "&cl=" + hs.auth.gui_design + "&hash=" + hs.gui.hashes._ico
            }));
            _button.css({
                "position"  : "relative",
                "display"   : "inline-block"
            });
            _button.on({
                "click" : function() {
                    hs.functions.do_list_command(oarg, obj._pos);
                }
            });

            hs.functions.default_click_element(_button);
            _button_div.append(_button);
        });
    }

    hs.functions.popup_overlay(true,false,oarg);
    $("#POPUP").append(_div);

    _div.center();
    if(_options.top) {
        _div.css("top",_options.top);
    }
    if(_options.left) {
        _div.css("left",_options.left);
    }
}

hs.functions.popup_timer = function ( oarg, callback ) {
    debug(3,"popup_timer",oarg);
    if(!callback) {
        oarg.item.item_callback = function() {
            hs.functions.popup_timer( oarg ,true);
        }
        hs.functions.get_item_info( oarg );
        return;
    }
}

hs.functions.popup_lister = function ( oarg ) {
    debug(3,"popup_lister",oarg);
    if($.isEmptyObject(oarg.item.info)) {
        oarg.item.item_callback = function() {
            hs.functions.popup_image( oarg );
        }
        return;
    }
    var _options = {
        "class"     : "",
        "defaultclass"  : " ",
        "top"       : null,
        "left"      : null,
        "width"     : hs.gui.attr.visu_width * 0.9,
        "height"    : hs.gui.attr.visu_height * 0.9
    };
    var _cmd;
    var _font;
    switch(oarg.item.action_id) {
        case 14:
            _options.defaultclass = " meldungpopup ";
            _cmd = "getmsg";
            _font = hs.gui.systemfonts["MELD1"];
            _options.width = hs.gui.attr.visu_width * 0.4
            break;
        case 15:
            _options.defaultclass = " buddypopup ";
            _cmd = "getbud";
            _font = hs.gui.systemfonts["BUDDY1"];
            _options.width = hs.gui.attr.visu_width * 0.4
            break;
        case 17:
            _options.defaultclass = " kameraarchivpopup ";
            _cmd = "getcama";
            _font = hs.gui.systemfonts["CAMARCH1"];
            break;
        default:
            return;
    }

    var _text2 = oarg.item.info._txt2 || "";
    if(_text2.match(/^XXOPTIONS\*/)) {
        _options = $.extend(_options,hs.functions.option_parser(_text2.substring(10),_options));
    }

    var _list = $("<ul />");
    var _scrolldiv = $("<div />",{
        "class"     : "scrollwraper" + _options.defaultclass + _options.class
    });
    _scrolldiv.css({
        "height"    : _options.height - 60,
        "width"     : "90%",
        "top"       : "20px",
        "position"  : "relative",
        "overflow"  : "hidden"
    });
    if (oarg.action == "click" && typeof oarg.item != 'undefined' && oarg.item.has_command) {
        hs.functions.get_item_info(oarg);
    }
    hs.functions.make_request({
        "session"   : oarg.session,
        "cmd"       : _cmd + "&id=" + oarg.item.id + "&dir=0&cnt=1000",
        "item"      : oarg.item,
        "page_id"   : oarg.page_id,
        "result"    : {
            "list"      : _list,
            "scroller"  : _scrolldiv,
            "options"   : _options
        }
     });

    var _div = $("<div />",{
        "class"     : "popupbox" + _options.defaultclass + _options.class,
        "css"       : _font
    });
    _div.css("width",_options.width + 30);
    _div.css("height",_options.height + 40);
    var _title = $("<span />",{
        "class"     : "popuptitle " + _options.defaultclass + _options.class,
        "css"       : hs.gui.systemfonts["TITEL1"]
    }).text(oarg.item.info._txt1).on("click",function() {
        _div.remove();
        delete oarg.item.page.items["POPUP"];
        hs.functions.popup_overlay(false,false,oarg);
    });
    _div.append(_title);
    _scrolldiv.append($("<div class='scroller'/>").append(_list));
    _div.append(_scrolldiv);
    hs.functions.popup_overlay(true,false,oarg);
    $("#POPUP").append(_div);
    _div.center();
    _scrolldiv.center(_div,"left");
    if(_options.top) {
        _div.css("top",_options.top);
    }
    if(_options.left) {
        _div.css("left",_options.left);
    }

}

hs.functions.camarchive_handler = function( oarg ) {
    debug(5,"camarchive_handler",oarg);
    var _list = oarg.result.list;
    if(!oarg.json.HS.ARCH) {
        return;
    }
    $.each(oarg.json.HS.ARCH.PIC,function(index,obj) {
        var _li = $("<li />",{
            "class"     : "popuplist camarchiveitem" + oarg.result.options.defaultclass + oarg.result.options.class, 
            "on"        : {
                "tap"   : function() {
                    $(this).hasClass("camarchive-full") ? $(this).removeClass("camarchive-full") : $(this).addClass("camarchive-full")
                    _scroller.refresh();
                    _scroller.scrollToElement(this);
                }
            }
        });
        var _url = hs.functions.get_url ({ 
            "session"   : oarg.item.session, 
            "url"       : "/guicama?id=" + oarg.item.id + "&pid=" + obj._id, 
            "cmd"       : ""
        });

        var _img = $("<img />",{
            "data-original"  : _url,
            "class"     : "lazyload camarchiveitem",
            "width"     : "100%",
            "height"    : "auto"
        });
        _li.append(_img);
        var _date = $("<div />",{
            "class"     : "popuplist_date",
        }).text(
            hs.functions.format_date(hs.options.dateformat,hs.functions.date_from_hs(obj._date))
        );
        _li.append(_date);
        _list.append(_li);
    });

    var _scroller = new IScroll(oarg.result.scroller.get(0),{
        mouseWheel      : true,
        scrollbars      : true,
        fadeScrollbars  : true,
        tap             : true,
        snap            : "li",
        bounce          : true,
    })
    _scroller.on("scrollEnd", function() {
        oarg.result.scroller.trigger("scroll");
    });
    
    $("img.lazyload").lazyload({
        "container"     : oarg.result.scroller,
        "threshold"     : 200,
        "failure_limit" : 10,
        "effect"        : "fadeIn"
    });
    //oarg.result.scroller.on("DOMSubtreeModified",function() { //FIXME
    //    _scroller.refresh();
    //});
}

hs.functions.default_list_handler = function( oarg ) {
    debug(5,"default_list_handler",oarg);
    var _list = oarg.result.list;
    var _json;
    var _class;
    switch(true) {
        case (oarg.json.HS.hasOwnProperty("MSGS")):
            _json = oarg.json.HS.MSGS.MSG;
            _class = " msgitem ";
            break;
        case (oarg.json.HS.hasOwnProperty("BUDS")):
            _json = oarg.json.HS.BUDS.BUD;
            _class = " buddyitem ";
            break;
    }
    if(!_json) {
        return;
    }
    $.each(_json,function(index,obj) {
        var _li = $("<li />",{
            "class"     : "popuplist defaultlist " + _class + oarg.result.options.defaultclass + oarg.result.options.class, 
        });
        var _text = $("<div />",{
            "class"     : "popuplist_text",
        }).text(obj._txt);
        var _date = $("<div />",{
            "class"     : "popuplist_date",
        }).text(
            hs.functions.format_date(hs.options.dateformat,hs.functions.date_from_hs(obj._date))
        );
        _li.append(_text);
        _li.append(_date);
        _list.append(_li);
   });
    var _scroller = new IScroll(oarg.result.scroller.get(0),{
        mouseWheel      : true,
        scrollbars      : true,
        fadeScrollbars  : true,
        tap             : true,
        snap            : "li",
        bounce          : true,
    })
}

hs.functions.make_globkey = function(xor) {
    var _key = "";
    var _temp = hs.functions.string_padding(hs.auth.password,64,String.fromCharCode(0));
    for (var i=0; i < 64; i++) {
        _key += String.fromCharCode(_temp.charCodeAt(i)^xor);
    }
    return _key;
};

hs.functions.get_url = function( oarg ) {
    if (typeof oarg.session == 'undefined') {
        debug(0,"undefined Session");
        return oarg.url || "";
    }
    // /guigrafv? // /guicamv? ///hsgui? ///guicama 
    //debug(5,"get_url ("+ oarg.session.target + "): " + oarg.cmd + " / " + oarg.url,oarg.session);
    if (oarg.cmd =="init") {
        return oarg.url;
    }

    if ((typeof oarg.url == 'undefined') || (oarg.url == '')) { 
        oarg.url = "/hsgui?"; 
        //debug (5,"tan_counter ++");
        oarg.session.auth.tan_counter ++;
    }
    var _url = "";
    if (oarg.cmd != "") {
        _url = "cmd=" + oarg.cmd;
    }
    _url += "&hnd=" + oarg.session.auth.handle;
    if (oarg.cmd == "login") {
        var _code_tmp = $.md5(oarg.session.auth.glob_key2 + oarg.session.auth.tan + oarg.session.auth.tan_counter + _url).toUpperCase();
        var _code = $.md5(oarg.session.auth.glob_key1 + _code_tmp).toUpperCase();
        _code = _code.substr(oarg.session.auth.pos -1,10);
    } else {
        var _code = "XX" + oarg.session.auth.tan + oarg.session.auth.tan_counter;
    }
    oarg.url = oarg.url + _url + "&code=" + _code;
    //debug(5,"get_url: " + oarg.url);
    return oarg.url;
};

hs.functions.make_request = function ( oarg ) {
    // based on jquery-ajaxQueue
    debug(5,"make_request (" + oarg.session.target + "): " + oarg.cmd + " / url=" + oarg.url);
    var dfd = $.Deferred(),
        promise = dfd.promise();
    var ajaxOpts = {
        "cache"         : true,
        "datatype"      : "xml",
        "contentType"   : "application/x-www-form-urlencoded;charset=iso-8859-1",
        "complete"      : function(xhttpobj) {
            oarg.xhttpobj = xhttpobj;
            hs.functions.async.handler( oarg );
        }
    };

    // run the actual query
    function doRequest( next ) {
        ajaxOpts.url = hs.functions.get_url( oarg );
        debug(5,"do_request (" + oarg.session.target + "): " + oarg.cmd + " / url=" + oarg.url, ajaxOpts);
        oarg.session.ajax_xhr = $.ajax( ajaxOpts );
        oarg.session.ajax_xhr.done( dfd.resolve )
            .fail( dfd.reject )
            .then( next, next );
    }

    // queue our ajax request
    
    
    // TODO prio für login 
    oarg.session.ajax_queue.queue( doRequest );
    // add the abort method
    promise.abort = function( statusText ) {

        // proxy abort to the XHR if it is active
        if ( oarg.session.ajax_xhr ) {
            return oarg.session.ajax_xhr.abort( statusText );
        }

        // if there wasn't already a XHR we need to remove from queue
        var queue = ajax_queue.queue(),
            index = $.inArray( doRequest, queue );

        if ( index > -1 ) {
            queue.splice( index, 1 );
        }

        // and then reject the deferred
        dfd.rejectWith( ajaxOpts.context || ajaxOpts, [ promise, statusText, "" ] );
        return promise;
    };

    return promise;
}

hs.functions.async.handler = function( oarg ) {
    debug(5,"async_handler (" + oarg.session.target + ") : " + oarg.cmd,oarg);
    oarg.url = "";
    oarg.json =  hs.functions.error_handler( oarg ) 
    if (!oarg.json) {
        return false;
    }
    oarg.session.last_communication_time = $.now();
    oarg.cmd = hs.functions.string_cut_after(oarg.cmd,"&");
    switch (oarg.cmd) {
        case "init"     : hs.functions.async.login( oarg ); break;
        case "login"    : hs.functions.async.logged_in(  oarg ); break;
        case "getfont"  : hs.functions.async.getfont( oarg ); break;
        case "getattr"  : hs.functions.async.getattr( oarg ); break;
        
        // VISU Seite laden
        case "gv"       : hs.functions.async.gv( oarg ); break;
        // VISU Seite update
        case "gvu"      : hs.functions.async.gv( oarg ); break;
        // VISU Seite update und Befehl
        case "vcu"      : hs.functions.async.gv( oarg ); break;
        
        case "getpag"   : hs.functions.item_handler( oarg ); break;
        case "getuhr"   : hs.functions.item_handler( oarg ); break;
        case "getcama"  : hs.functions.camarchive_handler( oarg ); break;
        case "getmsg"   : hs.functions.default_list_handler( oarg ); break;
        case "getbud"   : hs.functions.default_list_handler( oarg ); break;

        case "logout"   : break;
        default:
            break;
    }
};

hs.functions.item_handler = function( oarg ) {
    debug(5,"item_handler",oarg);
    var _id = "PAGE_" + oarg.item.page_id + "_" + oarg.item.type + "_" + oarg.item.id;
    var _elem = "";
    switch(oarg.item.action_id) {
        case 7: _elem = "CAM"; break; // Kamera
        case 8: _elem = "TIM"; break; // Wochenschaltuhr
        case 9: _elem = "VAL"; break; // Werteingabe
        case 10: _elem = "VAC"; break; // Urlaubskalender
        case 11: _elem = "HOL"; break; // Feiertagskalender
        case 12: _elem = "DATE"; break; // Datum/Uhrzeit
        case 14: _elem = "MSG"; break; // Meldungsarchiv
        case 15: _elem = "BUD"; break; // Buddyliste
        case 16: _elem = "GRAF"; break; // Diagramm
        case 17: _elem = "CAMA"; break; // Kamera-archiv
        case 18: _elem = "UHR"; break; // Universal Zeitschaltuhr
        default: return;
    }
    if(!hs.gui.items.hasOwnProperty(_id)) {
        hs.gui.items[_id] = {};
    }
    if(oarg.item.action_id == 18 && oarg.cmd == "getuhr") { // UHR
        hs.gui.items[_id]["_aktiv"] = oarg.item.info["_aktiv"] = oarg.json.HS.PAG._aktiv*1;
        if(oarg.item.info.hasOwnProperty("evt")) { // clear old events
            delete hs.gui.items[_id]["evt"];
            delete oarg.item.info["evt"];
        }
        if(!oarg.item.info.hasOwnProperty("aktionen")) {
            
        }
    }
    $.each(oarg.json.HS[_elem],
        function(attr,val) {
             hs.gui.items[_id][attr.toLowerCase()] = oarg.item.info[attr.toLowerCase()] = isNaN(val*1) ? val : val*1;
        }
    );
    hs.functions.storage("set","CACHE_ITEM_" + _id, hs.gui.items[_id]);
    if (typeof oarg.item.item_callback == 'function') {
        debug(4,"callback for " + _id,oarg)
        var _func = oarg.item.item_callback;
        setTimeout(function() {
            _func.call(hs.gui.items[_id]);
        },1);
        oarg.item.item_callback = null;
    }
}

hs.functions.get_item_info = function ( oarg ) {
    debug(5,"get_item_info",oarg);
    if($.inArray(oarg.item.action_id,[7,8,9,10,11,12,14,15,16,17,18]) == -1) {
        return null;
    }
    var _id = "PAGE_" + oarg.item.page_id + "_" + oarg.item.type + "_" + oarg.item.id;
    if(oarg.item.action_id == 18) {
        hs.functions.make_request({
            "session"   : oarg.session,
            "cmd"       : "getuhr&cnt=100&dir=1&id=" + oarg.item.id,
            "item"      : oarg.item,
            "page_id"   : oarg.page_id
         });
         
    }
    var _extra_request = "";
    if (oarg.action == "click" && typeof oarg.item != 'undefined' && oarg.item.has_command) {
        _extra_request = "&cmdid=" + oarg.item.id + "&cmdpos=0";
    }
    hs.functions.make_request({
        "session"   : oarg.session,
        "cmd"       : "getpag&id=" + oarg.item.id + _extra_request,
        "item"      : oarg.item,
        "page_id"   : oarg.page_id
     });
    if(hs.gui.items.hasOwnProperty(_id)) {
        return hs.gui.items[_id];
    }
    return hs.functions.storage("get","CACHE_ITEM_" + _id) || {};
}

hs.functions.error_handler = function( oarg ) {
    //handle Error
    // <HS><ERR code="99"></ERR></HS>
    // <HS><ERROR>Timeout !!</ERROR></HS>
    debug(5,"error_handler: (" + oarg.cmd + ")", oarg.xhttpobj);
    oarg.error = ""
    if (typeof oarg.xhttpobj != 'undefined') {
        if (oarg.xhttpobj.status != 200) {
            switch (oarg.xhttpobj.status) {
                case 0: oarg.error = "connreset"; break;
                case 404: oarg.error = "notfound"; break;
                case 503: oarg.error = "connreset"; break;
            }
        } else {
            if (oarg.xhttpobj.responseText.length == 0) {
                switch(oarg.cmd) {
                    case "init"     : oarg.error = "auth_error"; break;
                    case "login"    : oarg.error = "pass_error"; break;
                    
                }
            }
            var _error_regex = new RegExp(/(?:<ERROR>|<ERR code=\")(.*?)(?:<\/ERROR>|\"\/>)/g);
            var _errorcode = _error_regex.exec(oarg.xhttpobj.responseText);
            if (_errorcode != null) {
                oarg.error = _errorcode[1].toLowerCase();
                oarg.error = oarg.error.substring(0,17);
            }
            if (oarg.error == "") {
                var _xml = oarg.xhttpobj.responseText;
                if (_xml.match(/<HS>.*?<ITEMS>[^]*?<\/ITEMS>/gm)) {
                    debug(5,"fix item order", { "_xml" : _xml });
                    if (typeof oarg.xhttpobj.responseXML == 'undefined') {
                        _xml = hs.functions.fix_xml(oarg.xhttpobj.responseText);
                    }
                    // fix item order
                    _xml = _xml.replace(/<(TXT|BOX|ICO|GRAF|CAM)\s\w+=[^]*?\/>/g, function(match, capture) {
                        return match.replace(capture,'ITEM type="' + capture + '"');
                    });
                    try {
                        oarg.xhttpobj.responseXML = $.parseXML(_xml)
                    } catch (e) {
                        debug(0,"INVALID XML",e);
                        return null;
                    }
                }

                try {
                    var _json =  $.xml2json(oarg.xhttpobj.responseXML);
                    return _json;
                } catch (e) {
                    oarg.error = e.toString();
                }
            }
        }
    }
    
    debug(0,"Error: " + oarg.error, oarg);
    switch (oarg.error) {
        case "auth_error"       : hs.functions.login_dialog( oarg ); break;
        case "pass_error"       : hs.functions.login_dialog( oarg ); break;
        case "timeout !!"       : hs.functions.login_init( oarg ); break;
        case "connreset"        : hs.functions.reconnect( oarg ); break;
        case "handle error !!"  : hs.functions.login_init( oarg ); break;
        case "user kidnapped !!": hs.functions.login_init( oarg ); break;
        case "99"               : debug(0,"Visuseite nicht gefunden",oarg); break;
        default                 : alert("Error " + oarg.error); break
    }
    return (oarg.error == "");
}

hs.functions.reconnect = function( oarg ) {
    hs.functions.popup_overlay(true,true);
    hs.connection.failure += 1;
    debug(3,"reconnect " + hs.connection.failure,oarg);
    var _waittime = Math.min(2000 * (hs.connection.failure -1) ,60000); // max 60sec
    $.each(hs.session,function(index,session) {
        session.connection_status = "reconnect";
        session.ajax_queue.clearQueue();
        session.ajax_xhr.abort('reconnect');
        debug(3,"clear_session",session);
        // remove all session except main VISU session
        if(session.target != "VISU") {
            delete hs.session[session.target];
        }
    });

    if (navigator.onLine) {
        setTimeout(function() {
            if(hs.session.VISU.connection_status != "connected") {
                hs.functions.login_init({ 
                    "session"   : hs.session.VISU
                });
            }
        },_waittime + 1);
    }
}

hs.functions.swap_object = function( obj ) {
    var _ret = {};
    for (var key in obj) {
        _ret[obj[key]] = key;
    }
    return _ret;
}

hs.functions.entity = new (function() {
    var map = {
        "&" : "&amp;",
        "<" : "&lt;",
        ">" : "&gt;",
        '"' : "&quot;",
        "'" : "&apos;"
    };
    var rmap = hs.functions.swap_object( map ); 

    this.encode_regex = new RegExp("[" + Object.keys(map).join("") + "]","g");
    this.decode_regex = new RegExp("[" + Object.keys(rmap).join("") + "]","g");
    this.encode = function ( text ) {
        return text.replace(this.encode_regex, function (entity) {
            return map[entity];
        });
    }
    this.decode = function ( text ) {
        return text.replace(this.decode_regex, function (entity) {
            return rmap[entity];
        });
    }
    return this;
})();

hs.functions.fix_xml = function ( xml ) {
    debug(4,"fix_xml: broken xml ",{ "xml": xml });
    var _result = null;
    var _regex = new RegExp(/=\"(.*?)\"/gm);
    while( _result = _regex.exec(xml)) {
        var _match = _result[1];
        if (_match.match(hs.functions.entity.encode_regex) == null) {
            continue;
        }
        var _match_len = _match.length;
        _match = hs.functions.entity.encode(_match);
        var _xml_len = xml.length;
        var _index = _result.index +2; 
        xml = xml.substr(0,_index ) + _match + xml.substr(_index + _match_len ,_xml_len - _index + _match_len);
    }
    return xml;
}

hs.functions.login_init = function( oarg ) {
    debug(5,"[start] login_init:",oarg);
    oarg.session.connection_status = "init";
    oarg.session.ajax_queue.clearQueue();
    var _cmd = "init";
    var _url =  "/hsgui?cmd=" + _cmd;
    _url += "&user=" + hs.auth.username;
    _url += "&cid="  + hs.auth.gui_design;
    _url += "&ref="  + hs.auth.gui_refresh;
    hs.functions.make_request( {
        "session"     : oarg.session,
        "cmd"         : _cmd,
        "url"         : _url
    });
};

hs.functions.async.login = function( oarg ) {
    debug(5,"[start] async.login:",oarg);
    oarg.session.connection_status = "authenticate";
    oarg.session.auth.handle = oarg.json.HS.HND;
    oarg.session.auth.tan = oarg.json.HS.TAN;
    oarg.session.auth.tan_counter = 0;
    oarg.session.auth.pos = parseInt(oarg.json.HS.POS)+1;
    oarg.session.auth.glob_key1 = hs.functions.make_globkey(0x5c);
    oarg.session.auth.glob_key2 = hs.functions.make_globkey(0x36);
    hs.functions.make_request( {
        "session"     : oarg.session,
        "cmd"         : "login"
    });
};

hs.functions.async.logged_in = function(  oarg ) {
    debug(5,"[start] async.logged_in (" + oarg.session.target + "):",oarg.json);
    // check main
    hs.connection.failure = 0;
    oarg.session.connection_status = "connected";
    if (hs.user == null) {
        hs.user = {};
        hs.user.load_background = parseInt(oarg.json.HS.VIS._bgi);  // unwichtig ? 
        hs.user.fullscreen_visu = oarg.json.HS.VIS._fv == 1;
        hs.user.start_page      = parseInt(oarg.json.HS.USR._vis);
        hs.user.start_query     = parseInt(oarg.json.HS.USR._qry);
        hs.user.start_list      = parseInt(oarg.json.HS.USR._lst);
        hs.user.start_go        = parseInt(oarg.json.HS.USR._go); // ????
        
        hs.user.streaming       = oarg.json.HS.USR._stream == 1; 

        hs.user.refresh_visu         = oarg.json.HS.USR._refvis*1;
        hs.user.refresh_visucam      = oarg.json.HS.USR._refvcam*1;
        hs.user.refresh_visugraf     = oarg.json.HS.USR._refvgraf*1;
        hs.user.refresh_visugrafcam  = oarg.json.HS.USR._refvgrafcam*1;
        hs.user.refresh_list  = oarg.json.HS.USR._reflst*1;
        hs.user.refresh_query = oarg.json.HS.USR._refqry*1;
        hs.user.refresh_mask  = oarg.json.HS.USR._refmask*1;
        hs.user.refresh_graf  = oarg.json.HS.USR._refgraf*1;
        hs.user.refresh_cam   = oarg.json.HS.USR._refcam*1;
        hs.functions.update_timer();
    }
    
    // überprüfen ob die Schriften sich geändert haben
    if (hs.gui.hashes._font != oarg.json.HS.HASH._font) {
        hs.functions.make_request( {
            "session"     : oarg.session,
            "cmd"         : "getfont"
        });
    }
    // überprüfen ob die Parameter geändert wurden
    if (hs.gui.hashes._para != oarg.json.HS.HASH._para) {
        hs.functions.make_request( {
            "session"     : oarg.session,
            "cmd"         : "getattr"
        });
    }
    hs.gui.hashes = oarg.json.HS.HASH;

    hs.functions.storage("set","hashes",hs.gui.hashes);

    // remove old pages after reconnect
    debug(4,"Remove old pages",hs.gui.pages);
    $.each(hs.gui.pages,function(index,page) {
        if(page.session.target == oarg.session.target) {
            page.object.remove()
            delete hs.gui.pages[page.id];
        }
    });

    // Visuseite laden
    oarg.session.start_page = oarg.session.start_page || hs.user.start_page;
    oarg.page_id = oarg.session.active_page ? oarg.session.active_page.page_id : null || oarg.session.start_page;
    hs.functions.load_page( oarg );
    setTimeout(hs.functions.popup_overlay,500);
};

hs.functions.update_timer = function() {
    if ( hs.gui.update_timer != null) {
        clearTimeout(hs.gui.update_timer)
    }
    if(hs.auth.password) {
        hs.functions.update()
    }

    hs.gui.update_timer = setTimeout(hs.functions.update_timer, (hs.user.refresh_visu *50));
}

hs.functions.update = function() {
    var _now = $.now();
    $.each(hs.session, function(index, session) {
        var _delay = (hs.gui.hidden || (session.target_obj.is(":visible") == false) ) ? hs.connection.hiddentime * 1000: 0;
        if(session.connection_status != "connected" || !session.active_page) {
            return;
        }
        if (session.active_page.next_update && session.active_page.next_update + _delay <= _now) {
            debug(5,"Update " + session.active_page.id,session);
            session.active_page.next_update = hs.functions.get_next_update(session.active_page) ;
            hs.functions.make_request( {
                "session"     : session,
                "cmd"         : "gvu&id=" + session.active_page.page_id + "&det=1",
                "page_id"     : session.active_page.page_id
            });
        }
        $.each(session.active_page.items, function(index,item) {
            if($.inArray(item.type,["CAM","GRAF","ICO"]) > -1) {
                if(item.next_update && item.next_update + _delay <= _now) {
                    item.next_update = null;
                    debug(5,"Update " + item.uid,item);
                    hs.functions.load_image({
                        "item" : item
                    });
                }
            }
            if(item.type == "TXT" && item.next_update && item.next_update + _delay <= _now) {
                if(typeof item.update_code == 'function') {
                    debug(5,"Update " + item.uid,session);
                    item.update_code( { 
                        "session"       : session,
                        "item"          : item,
                        "page_id"       : session.active_page.page_id
                    });
                }
            }
        });
    });
}

hs.functions.do_command = function( oarg ) {
    debug(4,"do_command:",oarg);
    if (oarg.item.has_command) {
        hs.functions.make_request( {
            "session"     : oarg.item.session,
            "cmd"         : "vcu&id=" + oarg.item.id,
            "page_id"     : oarg.page_id
        });
    }
}

hs.functions.do_list_command = function( oarg, pos ) {
    debug(4,"do_list_command:",oarg);
    if (oarg.item.has_command) {
        hs.functions.make_request( {
            "session"     : oarg.item.session,
            "cmd"         : "lstcmd&id=" + oarg.item.id + "&pos=" + pos,
            "page_id"     : oarg.page_id
        });
    }
}

hs.functions.math_round = function(value, digits) {
    var _exp = parseInt("1" + Array(1 + (digits || 0) ).join("0"));
    return Math.round(value * _exp) / _exp;
}

hs.functions.do_valset = function ( oarg ) {
    debug(4,"do_valset: " + oarg.item.value,oarg);
    if(typeof oarg.item.value == 'undefined' || oarg.item.action_id != 9) {
        return;
    }
    if(oarg.item.session.active_page != oarg.item.page) {
        debug(1,"Error Valset page not the active page",oarg);
        return;
    }
    if(oarg.item.info) {
        oarg.item.value = hs.functions.math_round(oarg.item.value,oarg.item.info._prec);
    }
    hs.functions.make_request( {
        "session"       : oarg.item.session,
        "cmd"           : "valset&id=" + oarg.item.id + "&val=" + oarg.item.value,
        "page_id"       : oarg.item.page.page_id
    });
}

hs.functions.load_page = function( oarg ) {
    debug(4,"load_page (" + oarg.session.target + "): " + oarg.page_id, oarg);

    var _extra_request = "";
    if (typeof oarg.item != 'undefined' && oarg.item.has_command) {
        _extra_request = "&cmdid=" + oarg.item.id + "&cmdpos=0";
    }
    oarg.page_id = parseInt(oarg.page_id) || oarg.session.start_page;
    if (hs.gui.pages.hasOwnProperty(oarg.page_id)) {
        var _page = hs.gui.pages[oarg.page_id];
        if (!_page.hidepage) {
            //FIXME
            if ($.inArray(oarg.page_id, hs.gui.active_pages) > -1 ) {
                debug(5,"load_page:FadeIn Cached Page "+oarg.page_id);
                _page.object.css("z-index","50");
                _page.object.fadeIn(20);
                hs.functions.add_history( oarg );
                document.title = "xxAPI² - " + _page.text1;
            }
            oarg.cmd = "gv&id=" + oarg.page_id + "&det=1" + _extra_request;
            hs.functions.make_request( oarg );
            return
        }
    }
    hs.functions.make_request( {
        "session"     : oarg.session,
        "cmd"         : "gv&id=" + oarg.page_id + "&det=1" + _extra_request,
        "page_id"     : oarg.page_id
    });
};

hs.functions.async.gv = function( oarg ) {
    debug(5,"async.gv (" + oarg.session.target + "): ",oarg);
    if (oarg.session.target == "VISU" && oarg.json.HS.VISU && (oarg.json.HS.VISU._pop*1) > 0) {
        debug(3,"visu_alarm",oarg);
        setTimeout(function() {
            oarg.page_id = oarg.json.HS.VISU._pop*1;
            hs.functions.load_page(oarg) ;
        },1);
        return;
    }
    if (oarg.json.HS.ITEMS) {
        new hs.functions.hs_page( oarg );
    }
};

hs.functions.mouse_event = function( oarg ) {
    debug(5,"mouse_event: " + oarg.item.event.type,oarg);
    if (typeof oarg.item.eventcode[oarg.item.event.type] == 'function') {
        oarg.item.eventcode[oarg.item.event.type]( oarg );
    }
    if (oarg.item.click) {
        switch(oarg.item.event.type) {
            case "mousedown"    :
            case "touchstart"   : oarg.item.object.addClass("activevisuelement"); break;
            case "mouseup"      :
            case "mouseleave"   :
            case "blur"         :
            case "touchend"     : window.setTimeout(function() {oarg.item.object.removeClass("activevisuelement");},hs.options.visualclickdelay); break;
        }
    }
}

hs.functions.check_click = function( oarg ) {
    debug(3,"check_click",oarg);
    oarg.action = "click";
    //var _session_position =  oarg.item.session.target_obj.position();
    xxAPI.events.lastclick.event = oarg.item.event = oarg.item.event || {};
    xxAPI.events.lastclick.top = oarg.item.event.pageY // - _session_position.top;
    xxAPI.events.lastclick.left = oarg.item.event.pageX // - _session_position.left;
    /* 
        Element .action_id
             0 = Nur Befehl
             1 = Seitenaufruf (optional Befehl)
             2 = 
             3 =
             4 =
             5 =
             6 =
             7 = Kamera (CAM)
             8 = Wochenschaltuhr /hsgui?cmd=getpag&id=31&hnd=4&code=C52747C9D8 (TIM)
             9 = Werteingabe  /hsgui?cmd=getpag&id=23&hnd=3&code=CB87CC79BA (VAL)
            10 = Urlaubskalender (VAC)
            11 = Feiertagskalender (HOL)
            12 = Datum/Uhrzeit setzen /hsgui?cmd=getpag&id=17&hnd=3&code=CB87CC79BA (DATE)
            13 = 
            14 = Meldungsarchiv /hsgui?cmd=getmsg&id=29&dir=0&cnt=5&hnd=4&code=2EB8E86D8F (MSG)
            15 = Buddy   /hsgui?cmd=getbud&id=25&dir=0&cnt=5&hnd=3&code=CC16E8CD49 (BUD)
            16 = Diagramm /hsgui?cmd=getpag&id=32&hnd=4&code=C65F9B4058 (GRAF)
            17 = Kamera-Archiv  /hsgui?cmd=getcama&id=30&dir=0&cnt=6&hnd=4&code=FF8BF7D074 (CAMA)
            18 = Universal Zeitschaltuhr /hsgui?cmd=getuhr&id=18&dir=0&cnt=5&hnd=4&code=18831A2D12 (UHR)
            19 = 
            20 = Seite aktualisieren
            21 = Navigation: Startseite
            22 = Navigation: Zurück
            23 = Menü /hsgui?cmd=gl&id=153&frm=1&cnt=5&hnd=2&code=935C315C9D /hsgui?cmd=glu&hnd=1&code=33B5E3DF74 // /hsgui?cmd=gl&id=291&frm=1&cnt=5&hnd=1&code=A5840BEDB8 
            24 = Query /hsgui?cmd=gq&id=6&frm=1&cnt=5&chk=0&hnd=4&code=3BC1D69459
            25 = Navigation: Beenden  /hsgui?cmd=logout&hnd=3&code=AE7A1C1473
    */
    switch (oarg.item.action_id) {
        case -1:
            break;
        case 0:
            //  0 = Nur Befehl
            hs.functions.do_command( oarg );
            break;
        
        case 1: 
            // 1 = Seitenaufruf (optional Befehl)
            oarg.page_id = oarg.item.open_page;
            oarg.session = hs.session[oarg.session.default_target] || oarg.session;
            hs.functions.load_page( oarg );
            break;
        case 7:
            hs.functions.popup_image( oarg );
            break;
        case 8:
        case 18:
            // Wochenschaltuhr / UZSU
            /*
                /hsgui?cmd=timset&id=31&days=000000000&frm=1200&to=2100&act=0&hnd=4&code=A2669029CE
            */
            hs.functions.popup_timer ( oarg );
            break;
        case 9:
            // Werteingabe
            hs.functions.popup_werteingabe( oarg );
            break;
        case 12:
            // Datum/Zeit setzen
            /*
                /hsgui?cmd=getpag&id=17&hnd=3&code=CB87CC79BA
                <HS><DATE txt1="Datum/Uhrzeit setzen 1.Zeile" txt2="2.zeile" ico="MLOGO" date="201412090927"/></HS>
                /hsgui?cmd=dateset&id=17&date=20141209&time=092100&hnd=4&code=C49E6423F3
            */
            alert("Datum/Zeit setzen noch nicht implementiert");
            break;
        case 14:
        case 15:
            hs.functions.popup_lister( oarg );
            break;
        case 16:
            // Diagramm
            /*
                /hsgui?cmd=getpag&id=32&hnd=4&code=C65F9B4058
                <HS><GRAF txt1="Diagramm" txt2="" ico="MLOGO"/></HS>
            */
            hs.functions.popup_image( oarg );
            break;
        case 17:
            hs.functions.popup_lister( oarg );
            break;
        case 21:
            // 21 = Navigation: Startseite
            if ( oarg.session.start_page != oarg.item.page.id) {
                oarg.page_id = oarg.session.start_page;
                hs.functions.load_page( oarg );
            }
            break;
        case 22:
            // 22 = Navigation: Zurück
            debug(5,"history_back",oarg);
            if (oarg.session.history.length > 1) {
                oarg.session.history.pop();
                var _lastpage = oarg.session.history.pop();
                if(oarg.item.page.is_popup) {
                    oarg.item.page.object.detach()
                }
                if (_lastpage !== undefined) {
                    oarg.page_id = _lastpage.page_id;
                    hs.functions.load_page( oarg );
                }
            }
            break;
        case 23:
            // 23 = Menü
            //hs.functions.make_request({ session:session,cmd:"gl&id=" + hs.user.start_list + "&frm=1&cnt=5"} );
            alert("Menü noch nicht implementiert");
            break;
        case 25:
            // 25 = Logout
            hs.functions.logout();
            break;
            
        default:
            alert("Funktionstyp " + oarg.item.action_id + " noch nicht implementiert");
    }
}

hs.functions.logout = function() {
    hs.auth.password = "";
    hs.auth.glob_key1 = "";
    hs.auth.glob_key2 = "";
//    hs.functions.make_request({ 
//        "session"   : _item.session,
//        "cmd"       : "logout"
//    });
    window.location.href = (window.location.href.replace(window.location.hash,"") + "?logout=1");
}

hs.functions.async.getfont = function( oarg ) {
    hs.gui.fonts = { 
        0 : {} 
    };
    $.each(oarg.json.HS.FONTS.FONT,
        function(i,item) {
            hs.gui.fonts[item._id] = { 
                'font-family'  : item._name,
                'font-size'    : item._size + "pt",
                'font-weight'  : item._bold == 1 ? "bold":"normal"
            };
        }
    );
    hs.gui.systemfonts = {}
    $.each(oarg.json.HS.SYSFONTS.FONT,
        function(i,item) {
            hs.gui.systemfonts[item._key] = {
                'font-family'  : item._name,
                'font-size'    : item._size + "pt",
                'font-weight'  : item._bold == 1 ? "bold":"normal",
                'color'        : hs.functions.get_hexcolor(item._color)
            };
        }
    );
    hs.functions.storage("set","fonts",hs.gui.fonts);
    hs.functions.storage("set","systemfonts",hs.gui.systemfonts);
};

hs.functions.async.getattr = function( oarg ) {
    $.each(oarg.json.HS.PARAS.P,
        function(i,item) {
            // parse Integer if possible
            hs.gui.attr[item._key.toLowerCase()] = isNaN(item._val*1) ? item._val:item._val*1;
        }
    );
    
    hs.gui.attr.initial_visu_height = (
        hs.gui.attr.ltitleh +
        (hs.gui.attr.llinec * hs.gui.attr.llineh) +
        hs.gui.attr.lnavh +
        (hs.gui.attr.hasborder == 0 ? 0:
            hs.gui.attr.lsep1h + hs.gui.attr.lsep2h + hs.gui.attr.lsep3h + hs.gui.attr.lsep4h
        )
    );
    hs.gui.attr.initial_visu_width = (
        (6 * hs.gui.attr.lnavw) +
        (hs.gui.attr.hasborder < 2 ? 0:
            hs.gui.attr.lbleftw + hs.gui.attr.lbrightw
        )
    );
    hs.functions.storage("set","attributes",hs.gui.attr);
};

hs.functions.login_dialog = function( oarg ) {
    if( oarg ) {
        oarg.session.connection_status = "login";
        var errortype = oarg.error == "auth_error" ? "Benutzer falsch" : "Passwort falsch";

    }
    if (hs.gui.designs_html != null) {
        return hs.functions.login_form(errortype)
    }
    $.ajax({ 
        "url"           : "/hs",
        "contentType"   : "application/x-www-form-urlencoded;charset=ISO-8859-1",
        "dataType"      : "html",
        "complete"      : function(xhttpobj) {
            hs.functions.async.parse_designs(xhttpobj,errortype);
        }
    });
}

hs.functions.async.parse_designs = function(xhttpobj,errortype) {
    try {
        var _result = new RegExp(/.*<td>(.*?name="cl".*?)<\/td>/).exec(xhttpobj.responseText);
        hs.gui.designs_html = _result[1];

    } catch (e) {
        debug(0,"Error parsing Designs from /hs",xhttpobj);
        hs.gui.designs_html = "<input name='cl' type='text'>";
    }
    hs.functions.login_form(errortype)

}

hs.functions.login_form = function(errortype) {
    var _form_html = "";
    _form_html += "<form id='login_form' action='#' accept-charset='utf-8'  autocomplete='off'>";
    _form_html += "<h2>xxAPI Login</h2>";
    _form_html += "<label for='username'>Benutzer</label>";
    _form_html += "<input autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' name='username' class='textinput' tabindex='1' type='text' value='" + (hs.auth.username == null ? "" : hs.auth.username) + "'>";
    _form_html += "<label for='password'>Passwort</label>";
    _form_html += "<input name='password' class='textinput' tabindex='2'type='password' >";
    _form_html += "<label for='cl'>Design</label>";
    _form_html += hs.gui.designs_html;
    _form_html += "<label for'remember'>&#160;</label>";
    _form_html += "<button type='submit' tabindex='4'>Login</button>";
    _form_html += "<div class='wide'>";
    _form_html += "<input name='remember' tabindex='5' type='checkbox'" + ((hs.functions.storage("get","rememberpass")) ? " checked": "" ) + ">";
    _form_html += "Kennwort speichern</div>";
    _form_html += "</form>";
    var _form_div = $('<div />').html(_form_html);
    _form_div.modal({
        "modal"         : true,
        "escClose"      : false,
        "autoPosition"  : true,
        "onShow"        : function (dialog) {
            hs.gui.modal_popup = this;
            $('#login_form > select[name="cl"]').attr('tabindex', 3);
            $('#login_form > select[name="cl"]').css("width", "100%");
            if (hs.auth.gui_design.length > 0 && hs.gui.designs_html.match(hs.auth.gui_design)) {
                $('#login_form > select[name="cl"]').val(hs.auth.gui_design);
            } else {
                $('#login_form > select[name="cl"]').val(
                    $('#login_form > select[name="cl"] > option:first').val()
                );
            }
            //if (hs.auth.username.length > 0) {
               //$('#login_form > input[name="password"]').attr("type","text");
            //}
            $('#login_form > button',dialog.data[0]).click(function (e) {
                e.preventDefault();
                hs.auth.username = $('#login_form > input[name="username"]').val();
                hs.auth.password = $('#login_form > input[name="password"]').val();
                hs.auth.gui_design = $('#login_form > [name="cl"]').val();
                debug(5,"CHECKED: ",$('#login_form  input[name="remember"]').prop("checked"));
                if ($('#login_form  input[name="remember"]').prop("checked")) {
                    hs.functions.storage("set","rememberpass",true);
                    hs.functions.storage("set","username",hs.auth.username);
                    hs.functions.storage("set","password",hs.auth.password);
                    hs.functions.storage("set","gui_design",hs.auth.gui_design);
                } else {
                    hs.functions.storage("set","rememberpass",false);
                    //hs.functions.storage("remove","username");
                    hs.functions.storage("remove","password");
                }
                new hs.functions.hs_session("VISU");
                //$('#login_form',elements));
                hs.gui.modal_popup.close();
            });
        }
    });

}

hs.functions.has_functions = function(obj) {
    for (var i in obj) {
        if (typeof obj[i] == 'function') {
            return true;
        }
    }
    return false;
}

hs.functions.number2align = function(align) {
    switch (parseInt(align)) {
        case 1:
            return "left"
        case 2:
            return "center"
        case 3:
            return "right"
    };
    return ""
}

hs.functions.get_hexcolor = function(numcolor) {
    var _hex = "";
    if (typeof numcolor == 'undefined') {
        return;
    }
    if (numcolor*1 >= 0) {
        _hex = "#" + ("000000" + parseInt(numcolor).toString(16).toUpperCase()).substr(-6);
        //debug(5,"get_hexcolor: " + numcolor + " = " + _hex);
    } else {
        _hex = "transparent";
    }
    return _hex;
}

hs.functions.get_rgba_color = function(hex,alpha) {
    alpha = alpha || 1;
    var _res = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return _res ? "rgba(" + parseInt(_res[1],16) +  ","  + parseInt(_res[2],16) + "," + parseInt(_res[3],16) + "," + alpha + ")"  : "rgba(0,0,0,0)";
}

hs.functions.string_padding = function(str, len, pad, prefix) {
    str || (str = "")
    typeof str == "string" || (str = str.toString());
    len || (len = 0);
    pad || (pad = " ");
    len += 1;
    if (len >= str.length) {
        if(prefix) {
            return Array(len - str.length).join(pad) + str;
        } else {
            return str + Array(len - str.length).join(pad);
        }
    }
    return str;
};

hs.functions.string_cut_after = function(str,pattern) {
    var _idx = str.indexOf(pattern);
    var _str = str
    if (_idx != -1) {
        _str = str.substring(0,_idx);
    }
    return _str;
}

hs.functions.get_query_parameter = function(item) {
    var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));
    return svalue ? svalue[1] : svalue;
}

hs.functions.get_hash_parameter = function(item) {    
    var svalue = location.hash.match(new RegExp("[#\&]" + item + "=([^\&]*)(\&?|$)","i"));
    return svalue ? svalue[1] : svalue;
}

hs.functions.get_style = function(css_selector) {
    var _regex = new RegExp(css_selector);
    var _ret;
    var _rules = [].map.call(document.styleSheets, function(item) {
        return [].slice.call(item.cssRules);
    }).reduce(function(a, b) {
        return b.concat(a);
    })
    $.each(_rules,function(index,value) {
        if(_regex.exec(value.selectorText || "")) {
            _ret = value
            return false;
        }
    });
    return _ret ? _ret.style : {};
}

jQuery.fn.reverse = [].reverse;

jQuery.fn.center = function (parent, dir) {
    parent || (parent = this.parent());
    parent = parent instanceof jQuery ? parent : $(parent);
    var _elem = this instanceof jQuery ? this : $(this);
    debug(5,"center " + parent.width()+"/" +parent.height()+ "/" + this.width() + "/" +this.height());
    if(parent.width() == null || parent.height() == null) {
        _elem.in_dom(function() {
            _elem.center();
        },{once:true});
    }
    this.css("position",this.css("position") == "relative" ? "relative" : "absolute");
    if(dir != "left") {
        this.css("top",parent.height() < this.height() ? 0 : parent.height()/2 - this.height()/2);
    }
    if(dir != "top") {
        this.css("left",parent.width() < this.width()  ? 0 : parent.width()/2 - this.width()/2);
    }
}

jQuery.fn.fitsize = function () {
    var _elem = $(this);
    if(!_elem.is(":visible")) {
        return;
    }
    var _clone = _elem.data('fitsize-clone');
    if(!_clone) {
        _clone = $("<span />", {
            css  : {
                "visbility"     : "hidden",
                "font-size"      : _elem.css('font-size'),
                "font-family"    : _elem.css('font-family'),
                "font-style"     : _elem.css('font-style'),
                "font-weight"    : _elem.css('font-weight'),
                "font-variant"   : _elem.css('font-variant')
            }
        });
        _elem.data('fitsize-clone', _clone);
    }
    _clone.appendTo("body");
    var _txt = _elem.prop("tagName") == "INPUT" ? _elem.val() : _elem.text();
    _clone.html(_txt.replace(/\s/g,"&nbsp;"));
    var _width = _elem.innerWidth() * 0.9;
    var _ratio = _width / (_clone.width() || 1);
    var _fontsize = parseInt(_clone.css("font-size"),10);
    if(_ratio < 1) {
        _fontsize = Math.floor(_fontsize * _ratio);
        debug(5,"font_change: " + _fontsize + "/" + _ratio + " " + _clone.width() + "/" + _width,_elem);
    }
    _clone.detach();
    _elem.css("font-size",_fontsize);
}

jQuery.fn.in_dom = function(callback, options) {
    var _elements = this;
    var _options = $.extend({
        "root"  : document.body,
        "once"  : true
    },options);
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var _observer = new MutationObserver(function(mutations) {
        $.each(mutations,function(index,mutation) {
            if(!mutation.addedNodes) {
                return;
            }
            $.each(mutation.addedNodes,function(index,node) {
                $.each(_elements,function(index,element) {
                    if(element === node || $.contains(node,element)) {
                        callback.apply(element);
                        if(_options.once) {
                            _elements.splice($.inArray(element,_elements),1);
                        }
                    }
                });
            });
        });
        if(!_elements.length > 0) {
            _observer.disconnect();
        }
    });
    _observer.observe(_options.root,{
        childList: true,
        subtree :true
    });
};

hs.functions.set_viewport = function() {
    debug(5,"Set Viewport",hs.gui.attr);
    $("#VISUCONTAINER").css({
        "display"   : "block",
        "position"  : "absolute",
        "width"     : hs.gui.attr.visu_width,
        "height"    : hs.gui.attr.visu_height
    }).center(window);
    //return true;
    var _orientation = hs.functions.get_orientation();
    var _visual_height = _orientation == "landscape" ? screen.width  : screen.height;
    var _visual_width  = _orientation == "landscape" ? screen.height : screen.width;
    
    var _scaleto_width = Math.floor ( _visual_width / hs.gui.attr.visu_width * 100) / 100;
    var _scaleto_height = Math.floor ( _visual_height / hs.gui.attr.visu_height * 100) / 100;
    var _scale_min = Math.min( _scaleto_width, _scaleto_height);
    var _scale_max = Math.max( _scaleto_width, _scaleto_height, 1.0);
    var _viewport_meta = 
        "width="          +  hs.gui.attr.visu_width +
        (_scale_min > 1 ? "" : ",initial-scale=" + _scale_min) +
        ",minimum-scale=" + _scale_min +
        ",maximum-scale=" + _scale_max +
        ",user-scalable=" + (_scale_min != _scale_max ? "yes":"no");
    $("#meta_viewport").attr("content", _viewport_meta );
    debug(5,"Viewport: " +  _viewport_meta + " orientation: " + _orientation + " vheight: " + _visual_height + " vwidth: " + _visual_width);
    hs.gui.device.scale = Math.max(hs.gui.attr.visu_width,hs.gui.attr.visu_height) / Math.max(hs.gui.device.width,hs.gui.device.height);

    if(hs.options.autoscale) {
        var _container_scale_width = $(window).width()/hs.gui.attr.visu_width;
        var _container_scale_height = $(window).height()/hs.gui.attr.visu_height;
        hs.gui.container_scale = Math.min(_container_scale_width,_container_scale_height)
        if(!hs.options.scaledown) {
            hs.gui.container_scale = Math.max(hs.gui.container_scale,1.0);
        } 
        if(hs.gui.container_scale < 1) {
            $("#VISUCONTAINER").css({
                "width"     : "",
                "height"    : ""
            });
        }
        $("#VISUCONTAINER").css("transform","scale(" + hs.gui.container_scale + "," + hs.gui.container_scale + ")");
    } else {
        hs.gui.container_scale = 1;
        $("#VISUCONTAINER").css("transform","");
    }
}

hs.functions.get_orientation = function () {
    if (typeof orientation != "undefined") {
        return ( orientation % 180 ? "landscape":"portrait");
    } else {
        return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
    }
}

hs.functions.stringify = function (obj) {
    return JSON.stringify(obj, function (key, value) {
      if (value instanceof Function || typeof value == 'function') {
        // use strict wird im chrome nicht übernommen daher sind die Funktionen unterschiedlich
        return value.toString().replace("\n\"use strict\";\n","");
      }
      return value;
    });
}

hs.functions.date_from_hs = function (dstr) {
    var _match = dstr.match(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
    if (_match == null) {
        return $.now();
    }
    if (hs.options.timezone === null) {
        // Homeserver und Client gleiche Zeitzone
        return new Date(
            _match[1], // Year
            _match[2] -1, // Month
            _match[3], // Day
            _match[4], // Hour
            _match[5], // Minute
            _match[6]  // Seconds
        );
    } else {
        return new Date(Date.UTC(
            _match[1], // Year
            _match[2] -1, // Month
            _match[3], // Day
            _match[4], // Hour
            _match[5], // Minute
            _match[6]  // Seconds
        )).diffhour((hs.options.timezone*-1));
    }
}

Date.prototype.diffhour = function (hours) {
    this.setHours(this.getHours() + hours);
    return this;
}

Date.prototype.getWeekNumber = function() {
    var d = new Date(+this);
    d.setHours(0,0,0);
    d.setDate(d.getDate()+4-(d.getDay()||7));
    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
}

Date.prototype.getDayNumber = function() {
    var d = new Date(+this);
    d.setHours(0,0,0);
    return Math.floor((d - new Date(d.getFullYear(),0,1))/8.64e7)+1;
}

hs.functions.get_date_object = function ( date ) {
    date || (date = (new Date()));
    if(typeof date == 'string') {
        date = new Date(date);
    }
    if(date == "Invalid Date") {
        return;
    }
    var _date = {
        "YYYY"  : date.getFullYear(),
        "M"     : date.getMonth() + 1,
        "d"     : date.getDate(),
        "H"     : date.getHours(),
        "m"     : date.getMinutes(),
        "i"     : (function(hour) { return hour % 12 == 0 ? 12 : hour % 12 })(date.getHours()),
        "s"     : date.getSeconds(),
        "f"     : date.getMilliseconds(),
        "w"     : date.getDay(),
        "U"     : date.getWeekNumber(),
        "j"     : date.getDayNumber()
    };
    $.extend(_date,{
        "YY"    : _date.YYYY.toString().substring(2),
        "MM"    : hs.functions.string_padding(_date.M,2,"0",true),
        "MMM"   : hs.language.monthnames[_date.M].substring(0,3),
        "MMMM"  : hs.language.monthnames[_date.M],
        "dd"    : hs.functions.string_padding(_date.d,2,"0",true),
        "ddd"   : hs.language.weekdaynames[_date.w ].substring(0,2),
        "dddd"  : hs.language.weekdaynames[_date.w ],
        "HH"    : hs.functions.string_padding(_date.H,2,"0",true),
        "ii"    : hs.functions.string_padding(_date.i,2,"0",true),
        "p"     : _date.H > 12 ? "P" : "A",
        "pp"    : _date.H > 12 ? "PM" : "AM",
        "mm"    : hs.functions.string_padding(_date.m,2,"0",true),
        "mz"    : hs.functions.string_padding((_date.m - (_date.m % 10)),2,"0",true),
        "ss"    : hs.functions.string_padding(_date.s,2,"0",true),
        "sz"    : hs.functions.string_padding((_date.s - (_date.s % 10)),2,"0",true),
        "ff"    : hs.functions.string_padding(_date.f,2,"0",true).substring(0,2),
        "fff"   : hs.functions.string_padding(_date.f,3,"0",true).substring(0,3),
        "f"     : _date.f.toString().substring(0,1),
        
    });
    return _date;
}

hs.functions.format_date = function ( format, date ) {
    var _date = hs.functions.get_date_object(date);
    return format.replace(/%(\w+)\%/g,function(match,capture) {
        return _date[capture] || match;
    });
}

String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
        ? args[number]
        : match;
    });
};

hs.functions.temp2rgb = function (low, high, temp) {
    var _tempdiff = high-low;
    var _rate = {
        "cold"  : _tempdiff *0.25,
        "mid"   : _tempdiff *0.5,
        "warm"  : _tempdiff *0.75
    };
    if (temp <= _rate.cold) {
        var _cold = hs.options.temp_colors.one;
        var _warm = hs.options.temp_colors.two;
        high = _rate.cold;
    } else if (temp >= _rate.cold && temp <= _rate.mid) {
        var _cold = hs.options.temp_colors.two;
        var _warm = hs.options.temp_colors.three;
        low = _rate.cold;
        high = _rate.mid;
    } else if (temp >= _rate.mid && temp <= _rate.warm) {
        var _cold = hs.options.temp_colors.three;
        var _warm = hs.options.temp_colors.four;
        low = _rate.mid;
        high = _rate.warm;
    } else if (temp >= _rate.warm) {
        var _cold = hs.options.temp_colors.four;
        var _warm = hs.options.temp_colors.five;
        low = _rate.warm;
    }
    if(temp < low) {
        temp = low;
    }
    if(temp > high) {
        temp = high;
    }
    var _start = temp - low;
    _tempdiff = high-low;
    var _red   = ((((_warm[0]-_cold[0])/_tempdiff)*_start)+_cold[0]).toFixed();
    var _green = ((((_warm[1]-_cold[1])/_tempdiff)*_start)+_cold[1]).toFixed();
    var _blue  = ((((_warm[2]-_cold[2])/_tempdiff)*_start)+_cold[2]).toFixed();
    return "rgb(" + _red + "," + _green + "," + _blue + ")";
}

hs.functions.post_loading = function () {
}

hs.functions.ajaxload_css = function (id, url, callback) {
    debug(3,"[start] ajaxload css " + id);
    var _content = hs.functions.storage("get","CACHE_FILE_" + id) || "";
    var _element = $("<style />", {
        "id"    : id,
        "type"  : "text/css"
    }).text(_content);
    $("head:first").append(_element);
    $.ajax({
        url: url,
        cache: false, // url already tagged with date
        async: true,
        dataType: 'text',
        context: _element
    }).success(function(data,status,xhr) {
        debug(3,"[start] loaded as [style] "+ id);
        if (data != this.text()) {
            this.text(data)
            hs.functions.storage("set","CACHE_FILE_" + id,data);
        }
        callback(id,false);
    }).error(function(xhr,status) {
        debug(1,"[start] failed loading as [style] " + id + " / " + status);
        callback(id,true);
    });
}

hs.functions.element_loader = function ( urls, cache, callback ) {
    var _failure = false;
    var _finish = function(id, failure) {
        var _index = _queue.indexOf(id);
        if(_index < 0) {
            return;
        }
        if(failure) {
            _failure = true;
        }
        _queue.splice(_index,1);
        if(_queue.length == 0) {
            debug(3,"element_loader callback is called");
            clearTimeout(_timer);
            if(typeof callback == "function") {
                callback(_failure);
            }
        }
        debug(5,"[start] element_loader finished loading " + id + " from (" + _queue.length + ")");
    };
    var _timer = setTimeout(function() {
        debug(1,"[start] Error element_loader: failed loading " + _queue.join(", "));
    },3000);
    var _getid = function(filename) {
        return filename.replace(/http[s]?:\/\/.*?\//,"").replace(/\./g,"_").replace(/\//g,"_");
    }
    
    urls = typeof urls == 'string' ? [urls] : urls.concat();
    var _base = $("base").attr("href") || "";
    var _cache = typeof cache == "undefined" ? true : cache;
    var _queue = [];
    var _i,_filename, _id, _type, _element, _old_elem;
    for (_i=0; _i < urls.length; _i++) {
        _filename = _base + urls[_i];
        _id = _getid(_filename);
        _queue.push(_id);
    }
    for (_i=0; _i < urls.length; _i++) {
        _filename = _base + urls[_i];
        debug(3,"[start] element_loader loading " + _filename);
        _id = _getid(_filename);
        _type = _filename.toLowerCase().split(".");
        _type = _type[_type.length -1];
        switch(_type) {
            case "js":
                $.ajax({
                    url: _filename,
                    cache: _cache,
                    async: true,
                    dataType: 'script',
                    context: _id
                })
                .success(function(data,status,xhr) {
                        debug(5,"[start] loaded [getscript] " + this);
                        _finish(this,false);
                    })
                .error(function(xhr,status) {
                        debug(1,"[start] failed loading [getscript] " + this + " / " + status);
                        _finish(this,true);
                    }
                );
                break;
            case "css":
                _old_elem = $("#" + _id).remove();
                if (!_cache) {
                    _filename += "?_" + $.now();
                }
                if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
                    hs.functions.ajaxload_css(_id,_filename,_finish);
                    continue;
                }
                debug(3,"[start] add [link] " + _filename);
                var _element = $("<link />", {
                    "id"    : _id,
                    "rel"   : "stylesheet",
                    "type"  : "text/css",
                    "href"  : _filename
                }).on("load",function(event) {
                    var _id = event.target.id;
                    var _filename = event.target.href;
                    try { // Firefox issues Security Error
                        if(event.target.sheet && event.target.sheet.cssRules && event.target.sheet.cssRules.length == 0) {
                            debug(1,"[start] invalid length [link] " + _id);
                            hs.functions.ajaxload_css(_id,_filename,_finish);
                            $(event.target).remove();
                            return;
                        }
                    } catch (e) {};
                    debug(3,"[start] loaded [link] "+ _id,event.target);
                    _finish(_id,false);
                }).on("error",function(event) {
                    var _id = event.target.id;
                    var _filename = event.target.href;
                    debug(2,"[start] failed loading [link] " + _id + " / trying with ajax",event);
                    $(event.target).remove();
                    hs.functions.ajaxload_css(_id,_filename,_finish);
                });
                if(!$.contains(document, _element[0])) {
                    $("head:first").append(_element);
                }

        }
    }
}

hs.functions.storage = function ( command, name, value ) {
    if(window.localStorage === undefined) {
        // no support
        debug(1,"localStorage not supported");
        return;
    }
    switch(command) {
        case "get":
            var _json = window.localStorage.getItem(name);
            try {
                _json = JSON.parse(_json);
            } catch(e) {
                // convert localstorage to json
                hs.functions.storage("set",name,_json);
            }
            return _json;
        case "set":
            if(value == undefined || value.toString().length == 0) {
                window.localStorage.removeItem(name);
            } else {
                window.localStorage.setItem(name,JSON.stringify(value));
            }
            return;
        case "remove":
            window.localStorage.removeItem(name);
            return;
        case "clear":
            window.localStorage.clear();
            return;
    };
}

hs.functions.fix_base = function() {
    var _base = document.getElementById('htmlbase');
    if (!_base) {
        return
    }
    var _base_url = _base.href;
    if (_base_url != location.href) {
        var _elements = document.getElementsByTagName("link");
        for ( var i = 0; i < _elements.length; i ++ ) {
            // FIX href
            _elements[i].setAttribute('href', _elements[i].href);
        }
        _elements = document.getElementsByName("msapplication-TileImage");
        _elements[0].setAttribute('content', _base_url + _elements[0].content);
    }
}

$(window).on('orientationchange', function(event) {
    hs.functions.set_viewport();
    //hs.functions.get_orientation();
});

$(window).resize(function() {
    hs.functions.set_viewport();
});

$(document).on("keydown",  function(e) {
    if (e.ctrlKey && String.fromCharCode(e.which) === 'X') {
        xxAPI.functions.XXAPICONFIG( null );
        return false;
    }
});

hs.functions.checkonline = function(e) {
    debug(3,"xxAPI is " + e.type + "/" + (navigator.onLine ? "online" : "offline"));
    var _online = e.type == "online";
    hs.gui.hidden = !_online;
    if (_online) {
        hs.functions.popup_overlay(false,false);
        hs.functions.reconnect("Online");
    } else {
        hs.functions.popup_overlay(true,true);
    }
};

window.addEventListener("online",hs.functions.checkonline,true);
window.addEventListener("offline",hs.functions.checkonline,true);

$(document).on("visibilitychange",  function() {
    if(document.hidden) {
        debug(3,"xxAPI is hidden, delayed refresh");
    } else {
        debug(3,"xxAPI is visible, normal refresh");
    }
    hs.gui.hidden = document.hidden;
});



$(document).on("touchmove", function(e) {
    var _visual_width  = hs.functions.get_orientation() == "landscape" ? screen.height : screen.width;
    if( _visual_width  >= document.documentElement.clientWidth) {
        e.preventDefault();
    }
});

// Fix iOS alert when using FastClick
var broken_alert = window.alert;
window.alert = function(msg) {
    setTimeout(function() { broken_alert(msg); },0);
}


hs.functions.start_client = function() {
    var _x2js = new X2JS();
    $.xml2json = _x2js.xml2json;

    FastClick.attach(document.body);

    if(hs.functions.get_query_parameter("logout")) {
        hs.functions.storage("remove","password");
        window.location.replace(location.protocol + '//' + location.host + location.pathname);
    }
    hs.auth.username = hs.functions.storage("get","username") || hs.functions.get_hash_parameter("user");
    hs.auth.password = hs.functions.storage("get","password") || hs.functions.get_hash_parameter("pass");
    hs.auth.gui_design = hs.functions.storage("get","gui_design") || hs.functions.get_hash_parameter("design") || "";
    hs.auth.gui_refresh = hs.functions.get_hash_parameter('refresh') || hs.auth.gui_refresh ;
    xxAPI.start_page =  hs.functions.get_hash_parameter("startpage");
    hs.gui.hashes = hs.functions.storage("get","hashes") || hs.gui.hashes;

    hs.gui.fonts = hs.functions.storage("get","fonts") || hs.gui.fonts;
    hs.gui.systemfonts = hs.functions.storage("get","systemfonts") || hs.gui.systemfonts;
    hs.gui.attr = hs.functions.storage("get","attributes") || hs.gui.attr;

    if (hs.auth.username == null || hs.auth.password == null || hs.auth.gui_design == null) {
        hs.functions.login_dialog()
    } else {
        debug(3,"[start] Main Session")
        new hs.functions.hs_session("VISU");
        if (hs.showstartuplog > 0 && hs.debug_cache.length > 0) {
            setTimeout(function(){
                alert(hs.debug_cache.join("\n"));
            }
            ,hs.showstartuplog * 1000);
        }
    }
}


hs.debuglevel = hs.functions.get_hash_parameter("debug") || hs.functions.storage("get","debuglevel") || 0;
hs.showstartuplog = hs.functions.get_hash_parameter("showdebug") || 0;

$("html").on("touchmove",function(jQevent) {
    var event = jQevent.originalEvent;
        if (event && event.touches && event.touches.length != 2) {
            event.preventDefault();
        }
});

hs.functions.load_libraries = function() {
    debug(3,"[start] load libraries");
    if(hs.libraries_loaded) {
        return;
    }
    hs.functions.element_loader([
        "libs/fastclick.js", // https://github.com/ftlabs/fastclick
        "libs/xml2json.min.js", // https://github.com/abdmob/x2js
        "libs/jquery.md5.js", // https://github.com/placemarker/jQuery-MD5
        "libs/jquery.simplemodal.js", // http://www.ericmmartin.com/projects/simplemodal
        "libs/position-calculator.min.js", // https://github.com/tlindig/position-calculator
        "libs/iscroll.js", // https://github.com/cubiq/iscroll
        "libs/jquery.lazyload.min.js", // https://github.com/tuupola/jquery_lazyload
        "libs/jquery.nouislider.min.css", 
        "libs/jquery.nouislider.pips.min.css",
        "libs/jquery.nouislider.all.min.js", // https://github.com/leongersen/noUiSlider
        "libs/jquery.knob.min.js", // https://github.com/aterrien/jQuery-Knob
        "libs/xxapi.css",
        "libs/theme.css"
        ],true,
        function(fail) {
            if(fail) {
                if(confirm("failed to load all required javascript libraries\n\nReload?")) {
                    window.location.reload();
                }

            }
            debug(3,"[start] fix base")
            hs.libraries_loaded = true;
            hs.functions.fix_base()
            debug(3,"[start] fix base done")
            $("base").attr("href","");
            hs.functions.element_loader([
                "custom.css",
                "custom.js"
                ],hs.has_appcache,
                function(fail) {
                    debug(3,"[start] hsclient")
                    hs.functions.start_client();
                }
            );
        }
    );
}

hs.functions.progressbar = function(element,percent) {
    debug(1,"progressbar " + percent);
    var _width = percent * element.width() / 100;
    element.find('div').animate({ width: _width }, 0).html(percent + "% ");
}

debug(2,"[start] xxAPI² load");

window.applicationCache.addEventListener('progress', function (e) {
    if (Number(hs.cached_files_count)) {
        $("#PROGRESSINFO").html(hs.cached_files[hs.cached_load_count - 1]);
        var _percent = parseInt(hs.cached_load_count / hs.cached_files_count * 100);
        hs.functions.progressbar($("#PROGRESSBAR"), _percent);
        debug(5,"APPCACHE: download " + hs.cached_files[hs.cached_load_count - 1] + "  -  "+ hs.cached_load_count + "/" + hs.cached_files_count + " :: " + _percent);
    }
    hs.cached_load_count++;
});

$(document).ready(function() {
    hs.has_appcache = $("html[manifest$=appcache]").length > 0;
    if (hs.has_appcache) {
        debug(3,"[start] HTML5 Manifest active");
        $("html").css({
            "width"     : "100vh",
            "height"    : "100vh",
            "background-color"  : "#000000",
            "color"             : "#FFFFFF"
        });
        window.applicationCache.addEventListener('updateready', function (e) {
            if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
                window.applicationCache.swapCache();
                window.location.reload();
            }
        });
        window.applicationCache.addEventListener('noupdate', function (e) {
            $("#POPUP").html(""); 
            hs.functions.load_libraries(); 
        });
        window.applicationCache.addEventListener('cached', function (e) {
            $("#POPUP").html(""); 
            hs.functions.load_libraries();
        });
        window.applicationCache.addEventListener('checking', function (e) {
            if(navigator.onLine) {
                $("#POPUP").html("Check");
            } else {
                hs.functions.load_libraries();
            }
        });
        window.applicationCache.addEventListener('obsolete', function (e) {
            debug(1,"Appcache: Removed");
            $("#POPUP").html(""); 
            hs.functions.load_libraries();
        });
        window.applicationCache.addEventListener('error', function (e) {
            debug(1,"Appcache: Error",e);
            $("#POPUP").html(""); 
            if(!navigator.onLine) {
                hs.functions.load_libraries();
                return false;
            }
            if(confirm("Appcache error: start anyway? " + window.applicationCache.status.toString())) {
                hs.functions.load_libraries();
            }
        });
        window.applicationCache.addEventListener('downloading', function (e) {
            $.ajax({
                url         : $("html").attr("manifest"),
                dataType    : "text",
                cache       : false,
                success     : function( content ) {
                    hs.cached_files = content.match(/^(?:[/]|http[s]?:\/\/)?\w+[/.?]+.*/gm);
                    hs.cached_files_count = hs.cached_files.length;
                }
            });
            $("#POPUP").html("<div id='PROGRESSBAR' style='position: absolute; top: 50%; text-align: right; width: 90vw; max-width: 400px;'><div style='background-color: grey; width: 0%; border-radius: 15px; padding-right: 10px;'/></div><div id='PROGRESSINFO' style='position: absolute; bottom: 5px;'/>"); 
        });
            
    } else {
        hs.functions.load_libraries();
    }
});
