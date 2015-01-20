/*
 * Copyright 2015, KNX-User-Forum e.V.
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
$.x2js = new X2JS();
$.xml2json = $.x2js.xml2json;

var xxAPI = {};
xxAPI.version = "2.022";
xxAPI.functions = {};
xxAPI.events = {
    "lastclick" : {
        "top"   : 0,
        "left"  : 0,
    }
}
xxAPI.XXLINKURL = "";
xxAPI.registered_icons = { 
    "XXPAGE"    : "XXPAGE*",
    "XXPOPUP"   : "XXPAGE*POPUP"
};
xxAPI.marked_pages = {};
xxAPI.geolocation = {};

// Homeserver Object
var hs = {};
hs.functions = {};
hs.functions.async = {};
hs.session = {};  // keyname ist target

// Globale
hs.user = null;
hs.gui = {};
hs.gui.update_timer = null;
hs.gui.fonts = {};
hs.gui.systemfonts = {};
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
    _html += "<tr><td class='xxapi_config_name'>Debuglevel</td><td class='xxapi_config_value'><input type='number' min='0' max='5' value='" + hs.debuglevel + "' onchange='hs.functions.set_debuglevel(this.value);'><td><tr>";
    _html += "<tr><td colspan='2'><button class='simplemodal-close' onclick='window.applicationCache.update(); window.location.reload();'>Reload Cache</button></td></tr>";
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
    _div.modal({
        "autoPosition"  : true,
        "modal"         : true,
        "overlayClose"  : true
    });
    if ( oarg != null) {
        oarg.item.text = oarg.args[1];
    }
}

hs.functions.set_debuglevel = function ( level ) {
    hs.debuglevel      = level;
    localStorage.setItem('debuglevel',level);
}

/* 
    * old xxAPI is ignored but the action "Seite aufrufen" is triggered
    * it is used on xxAPI-INIT page to go to the next page
    
    * Argument 1 (deprecated) is the old xxAPI
     XXSCRIPT*[old xxAPI in base64]
*/
xxAPI.functions.XXSCRIPT = function( oarg ) {
    if (oarg.item.open_page > 0) {
        debug(2,"XXSCRIPT");
        oarg.item.page.hidden = true;
        window.setTimeout(function() {
            oarg.page_id = oarg.item.open_page;
            hs.functions.load_page( oarg );
        },1);
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
    var _url = xxAPI.XXLINKURL;
    if (oarg.args[1] != "") {
        _url = oarg.args[1];
    }
    oarg.item.html = "<iframe src='" + _url + "' " +
    "width='" + oarg.item.width + "px' " +
    "height='" + oarg.item.height + "px' " +
    "allowtransparency='true'>";
    oarg.item.customcss = { "pointer-events":"auto" };

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
    var _func = new Function('item','"use strict"; ' + _jscode);
    oarg.item.text = '';
    try {
        _func( oarg.item );
    } catch (e) {
        debug(1,"XXEXECUTE_ERROR:",e);
    }
}

hs.functions.fix_hsjavascript = function ( broken ) {
    var _jscode = broken || "";
    _jscode = _jscode.replace(/\[/g, "<");
    _jscode = _jscode.replace(/\(\?/g, "\(\"");
    _jscode = _jscode.replace(/=\?/g, "=\"");
    _jscode = _jscode.replace(/\? /g, "\" ");
    _jscode = _jscode.replace(/\?[,]/g, "\",");
    _jscode = _jscode.replace(/\?[;]/g, "\";");
    _jscode = _jscode.replace(/\?[\+]/g, "\"\+");
    _jscode = _jscode.replace(/[\+]\?/g, "\+\"");
    _jscode = _jscode.replace(/[,]\?/g, ",\"");
    _jscode = _jscode.replace(/\?\)/g, "\"\)");
    _jscode = _jscode.replace(/\]/g, ">");
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
    var _func = new Function('item','"use strict"; ' + _jscode);
    oarg.item.text = '';
    try {
        _func( oarg.item );
    } catch (e) {
        debug(1,"XXEEXECUTE_ERROR:",e);
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
    oarg.item.html = $("<div />", {
        "id"        : _modulname
    });
    var _page = oarg.item.open_page || xxAPI.marked_pages[oarg.args[1]] || hs.user.start_page;
    if(hs.session[_modulname] && hs.session[_modulname].active_page) {
        _page = hs.session[_modulname].active_page.page_id;
    }
    if(oarg.args.length > 2) {
        _page = xxAPI.marked_pages[oarg.args[2]] || _page;
    } 
    setTimeout(function() {
        new hs.functions.hs_session(_modulname,_page);
    },1);
    oarg.item.click = false;
    oarg.item.text = '';
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
    },1);
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
    var _func = new Function('item','"use strict"; ' + _jscode);
    oarg.item.eventcode["click"] = function( oarg ) {
        try {
            _func( oarg.item );
        } catch (e) {
            debug(1,"XXCLICK_ERROR:",e);
        }
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
    oarg.item.next_update = $.now() + parseInt(oarg.args[1]);
    var _func = null;
    if(oarg.args.length > 2) {
        var _jscode = hs.functions.fix_hsjavascript( oarg.args.slice(2).join("*") );
        var _func = new Function('item','"use strict"; ' + _jscode);
    }
    oarg.item.update_code = function ( oarg ) {
        if(_func) {
            try {
                _func( oarg.item );
            } catch (e) {
                debug(1,"XXTRIGGER_ERROR:",e);
            }
        }
        hs.functions.check_click ( oarg );
        oarg.item.next_update = null;
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
    oarg.item.url = oarg.args[1];
    if(oarg.args.length > 2) {
        oarg.item.refresh = oarg.args[2]*1;
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
    * which can be bitshiftet with optinal Argument 2
    
    * Argument 1 (optional) is the time in milliseconds 
    * Argument 2 (optonal) is an integer used to bitshift the values
    * Argument 3 (optonal) is Javascript code executed on longpress
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
    oarg.item.xxapi.longpress_bit = 0;
    if (oarg.args.length > 2) {
        oarg.item.xxapi.longpress_bit = parseInt(oarg.args[2]) || 0;
    }
    if (oarg.args.length > 3) {
        oarg.item.xxapi.longpress_code = oarg.args.slice(3).join("*");
    }

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
    oarg.item.value = _typeval[presstype]<<oarg.item.xxapi.longpress_bit;
    hs.functions.do_valset( oarg );
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
    oarg.item.page.width = oarg.item.left;
    oarg.item.page.height = oarg.item.top;
    oarg.item.page.popup = oarg.args[1] == "POPUP";
    
    if(!oarg.item.page.is_modul && !oarg.item.page.popup) {
        hs.gui.attr.visu_width = oarg.page.width;
        hs.gui.attr.visu_height = oarg.page.height;
    }
    
    if (oarg.args.length > 2) {
        var _match = null;
        var _regex =new RegExp(/([-\w]+)[:](.*?);/g);
        while(_match = _regex.exec(oarg.args[2])) {
            if(_match[1] == "top" || _match[1] == "left") {
                oarg.item.page.centered = false;
                _match[2] = _match[2].replace(/MOUSE([+-]\d+)px/,function(match,capture) {
                    var _mouse = _match[1] == "top" ? xxAPI.events.lastclick.top : xxAPI.events.lastclick.left;
                    // eval should be save here 
                    return eval(_mouse + capture) + "px";
                })
            }
            debug(5,"XXPAGE: change_css '"+_match[1]+"':'"+_match[2]+"'");
            oarg.item.page.object.css(_match[1],_match[2]);
        }
    }
}

/*
    * Text prefixed with XXWRAPTEXT is wraped inside the item text.
    
    * Argument 1 is the text that is to be wraped
    XXWRAPTEXT*The quick brown fox jumps over the lazy dog
*/
xxAPI.functions.XXWRAPTEXT = function ( oarg ) {
    debug(2,"XXWRAPTEXT",oarg);
    oarg.item.customcss["white-space"] = "normal";
    oarg.item.customcss["line-height"] = "130%";
    oarg.item.text = oarg.item.text.substring(11);
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

xxAPI.functions.XXGEOLOCATION = function ( oarg ) {
    debug(2,"XXGEOLOCATION",oarg)
    if (oarg.item.action_id != 9) {
        debug(1,"ERROR: " + oarg.item.text + " Keine Werteingabe");
    }
    xxAPI.geolocation[oarg.args[1]] = oarg.item;
    oarg.item.text = "";
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
}

hs.functions.xxapi_check = function( oarg ) {
    if (oarg.item.type == "ICO") {
        oarg.item.text = xxAPI.registered_icons[oarg.item.image] || '';
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

hs.functions.hs_session = function(target,start_page) {
    target = target || "VISU";
    if (hs.session.hasOwnProperty(target)) {
        //delete hs.session[target_item];
        var _session = hs.session[target];
        _session.start_page = start_page;
        hs.functions.load_page({ 
            "session"   : _session,
            "page_id"   : _session.start_page
        });
        return;
    }
    hs.session[target] = this;
    // Session 
    this.target = target;
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
    
    this.ajax_queue = $({});
    this.update_timer = null;

    this.connected = false;
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

    oarg.item.json = oarg.json;
    
    oarg.item.color       = hs.functions.get_hexcolor( oarg.json._fcol ) || oarg.item.color || "transparent";
    oarg.item.bg_color    = hs.functions.get_hexcolor( oarg.json._bgcol || oarg.json._col) || oarg.item.bg_color || "transparent";
    oarg.item.text        = oarg.json._txt ||   "";
    oarg.item.html        = null;
    oarg.item.image       = oarg.json._ico || null;
    oarg.item.url         = oarg.json._url || null;
    oarg.item.auth        = oarg.json._auth || null;

    if (oarg.page.items.hasOwnProperty(oarg.item.uid)) {
        oarg.item.cmd = "update";
        hs.functions.update_item( oarg );
    } else {
        // xxAPI
        oarg.item.xxapi = {};
        oarg.item.customcss = {};
        oarg.item.eventcode = {};
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
        
        if (oarg.item.object == null) {
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

            $.each( $.merge(["mousedown","mouseup","touchstart","touchend","mouseleave","blur"],Object.keys(oarg.item.eventcode)) ,function(index, value) {
                oarg.item.object.bind(value,function (event) {
                    oarg.item.event = event;
                    hs.functions.mouse_event( oarg )
                });
            });

            if (oarg.item.click) {
                oarg.item.object.bind("click",function (event) {
                    oarg.item.event = event;
                    hs.functions.check_click( oarg );
                });
                oarg.item.object.addClass("visuclickelement");
            } else {
                if(Object.keys(oarg.item.eventcode).length != 0) {
                    oarg.item.object.addClass("visuclickelement");
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
                if (oarg.item.html == null) {
                    oarg.item.object.append(hs.functions.get_textobject( oarg ));
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

hs.functions.get_textobject = function ( oarg ) {
        var _txtobject = $("<span />").text(oarg.item.text);
        if (oarg.item.indent > 0) {
            if ($.inArray(oarg.item.align,["left","center"]) > -1) {
                _txtobject.css( "margin-left",oarg.item.indent + "px");
            } 
            if ($.inArray(oarg.item.align,["center","right"]) > -1) {
                _txtobject.css( "margin-right",oarg.item.indent + "px");
            } 
        }
        return _txtobject;
}

hs.functions.update_item = function ( oarg ) {
    // xxAPI update check
    hs.functions.xxapi_check( oarg );

    if ( $.inArray(oarg.item.type, ["TXT"]) > -1) {
        if (oarg.item.s_color != oarg.item.color) {
            debug(4,"COLOR CHANGED '" + oarg.item.s_color + "' != '" + oarg.item.color + "'")
            oarg.item.object.css("color",oarg.item.color);
        }
        if (oarg.item.s_text != oarg.item.text) {
            debug(4,"TEXT CHANGED '" + oarg.item.s_text + "' != '" + oarg.item.text + "'")
            if (oarg.item.html == null) {
                oarg.item.object.children().replaceWith(hs.functions.get_textobject( oarg ));
            } else {
                oarg.item.object.html(oarg.item.html);
            }
        }

    }
    if ( $.inArray(oarg.item.type, ["TXT","BOX"]) > -1) {
        if (oarg.item.s_bg_color != oarg.item.bg_color) {
            debug(4,"BOX/TEXT BGCOLORT changed '" + oarg.item.s_bg_color + "' != '" + oarg.item.bg_color + "'");
            oarg.item.object.css({
                "background-color"  : oarg.item.bg_color,
                "border-color"      : oarg.item.bg_color
            });
        }
    }
    if ( $.inArray(oarg.item.type, ["ICO"]) > -1) {
        if (oarg.item.s_image != oarg.item.image) {
            debug(4,"ICO changed");
            hs.functions.load_image( oarg );
        }
    }
    if ( $.inArray(oarg.item.type, ["CAM"]) > -1) {
        if (oarg.item.s_url != oarg.item.url) {
            debug(4,"URL changed");
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
            if (oarg.item.auth) {
                _url = $.base64.decode(oarg.item.auth) + "@" + _url;
            }
            _url = _url.match(/http?:\/\/.*/) ? _url : "http://" + _url;
        } else {
            _url = hs.functions.get_url ({ 
                "session"   : oarg.item.session, 
                "url"       : "/guicamv?id=" + oarg.item.id, 
                "cmd"       : ""
            });
        }
    }
    
    if (oarg.item.type == "GRAF") {
        _url = hs.functions.get_url ({ 
            "session"   : oarg.item.session, 
            "url"       : "/guigrafv?id=" + oarg.item.id, 
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
            "position"  : "absolute"
        },
        "on"        : {
            "dragstart" : function () { return false; },
            "load"      : function () { 
                //debug(5,"Image:load",oarg)
                if (this.naturalWidth == 0 && this.naturalHeight == 0) {
                    debug(1,"Error: Image '" + this.src + "' failed",{ "img" : this, "item" : oarg.item });
                    return;
                }
                oarg.item.image_loading = false;
                oarg.item.image_object = $(this);
                oarg.item.next_update = hs.functions.get_next_update ( oarg.item );
                oarg.item.object.prepend( this );
                if (_child != null) {
                    _child.fadeOut(20,function() {
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
        debug(5,"update existing Page: ",oarg);
        oarg.page = hs.gui.pages[this.id];
        
        hs.functions.loop_items( oarg );

        if (oarg.cmd == "gv") {
            hs.functions.fade_page( oarg );
        }
        return oarg.page;
    }
    debug(4,"create new Page: ",oarg);
    oarg.page.next_update = hs.functions.get_next_update( oarg.page );
    hs.gui.pages[oarg.page.id] = oarg.page;
    oarg.page.hidden     = false;
    oarg.page.popup      = false;
    oarg.page.centered   = true;
    oarg.page.popup_object = null;
    oarg.page.bg_image   = oarg.json.HS.VISU._bg;
    oarg.page.icon       = oarg.json.HS.VISU._ico;
    oarg.page.qanz       = parseInt(oarg.json.HS.VISU._bg);
    oarg.page.title      = oarg.json.HS.VISU._txt1;
    oarg.page.text       = oarg.json.HS.VISU._txt2;
    oarg.page.width      = hs.gui.attr.visu_width;
    oarg.page.height     = hs.gui.attr.visu_height;
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
        "width"     : oarg.page.width,
        "height"    : oarg.page.height
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
        oarg.session.target_obj.prepend(oarg.page.object);
        oarg.page.object.show();
        if(oarg.session.active_page && oarg.session.active_page.page_id != oarg.page.page_id) {
            //FIXME Popup
            oarg.session.active_page.object.fadeOut(10,function() { 
                $(this).detach();
            });
        }
        oarg.session.active_page = oarg.page;
        oarg.session.history.push(oarg.page_id);
        if(!oarg.page.is_modul) {
            document.title = "xxAPI² - " + oarg.page.title;
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
}

hs.functions.make_globkey = function(xor) {
    var _key = "";
    var _temp = string_padding(hs.auth.password,64,String.fromCharCode(0));
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
    var jqXHR,
        dfd = $.Deferred(),
        promise = dfd.promise();
    var ajaxOpts = {
        "datatype"      : "xml",
        "contentType"   : "application/x-www-form-urlencoded;charset=ISO-8859-1",
        "complete"      : function(xhttpobj) {
            oarg.xhttpobj = xhttpobj;
            hs.functions.async.handler( oarg );
        }
    };

    // run the actual query
    function doRequest( next ) {
        ajaxOpts.url = hs.functions.get_url( oarg );
        debug(5,"do_request (" + oarg.session.target + "): " + oarg.cmd + " / url=" + oarg.url, ajaxOpts);
        jqXHR = $.ajax( ajaxOpts );
        jqXHR.done( dfd.resolve )
            .fail( dfd.reject )
            .then( next, next );
    }

    // queue our ajax request
    
    
    // TODO prio für login 
    oarg.session.ajax_queue.queue( doRequest );
    // add the abort method
    promise.abort = function( statusText ) {

        // proxy abort to the jqXHR if it is active
        if ( jqXHR ) {
            return jqXHR.abort( statusText );
        }

        // if there wasn't already a jqXHR we need to remove from queue
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
    oarg.cmd = string_cut_after_match(oarg.cmd,"&");
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
        
        case "logout"   : break;
        default:
            break;
    }
};

hs.functions.item_handler = function( oarg ) {
    debug(4,"item_handler",oarg);
    var _id = "PAGE_" + oarg.item.page_id + "_" + oarg.item.type + "_" + oarg.item.id;
    var _elem = "";
    switch(oarg.item.action_id) {
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
    }
    hs.gui.items[_id] = {}
    $.each(oarg.json.HS[_elem],
        function(attr,val) {
             hs.gui.items[_id][attr.toLowerCase()] = oarg.item.info[attr.toLowerCase()] = isNaN(val*1) ? val : val*1;
        }
    );
    if (typeof oarg.callback == 'function') {
    }
}

hs.functions.get_item_info = function ( oarg ) {
    debug(5,"get_item_info",oarg);
    if($.inArray(oarg.item.action_id,[8,9,10,11,12,14,15,16,17,18]) == -1) {
        return null;
    }
    var _id = "PAGE_" + oarg.item.page_id + "_" + oarg.item.type + "_" + oarg.item.id;
    if(hs.gui.items.hasOwnProperty(_id)) {
        return hs.gui.items[_id];
    }
    hs.functions.make_request({
        "session"   : oarg.session,
        "cmd"       : "getpag&id=" + oarg.item.id,
        "item"      : oarg.item,
        "page_id"   : oarg.page_id
     });
    return {};
}

hs.functions.error_handler = function( oarg ) {
    //handle Error
    // <HS><ERR code="99"></ERR></HS>
    // <HS><ERROR>Timeout !!</ERROR></HS>
    debug(5,"error_handler: (" + oarg.cmd + ")", oarg.xhttpobj);
    oarg.error = ""
    if (typeof oarg.xhttpobj != 'undefined') {
        if (!navigator.onLine) {
            oarg.error = "offline";
        }
        if (oarg.xhttpobj.status != 200) {
            switch (oarg.xhttpobj.status) {
                case 0: oarg.error = "connreset"; break;
                case 404: oarg.error = "notfound"; break;
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
                    debug(4,"fix item order", { "_xml" : _xml });
                    if (typeof oarg.xhttpobj.responseXML == 'undefined') {
                        _xml = hs.functions.fix_xml(oarg.xhttpobj.responseText);
                    }
                    // fix item order
                    _xml = _xml.replace(/<(TXT|BOX|ICO|GRAF|CAM)\s\w+=[^]*?\/>/g, function(match, capture) {
                        return match.replace(capture,'ITEM type="' + capture + '"');
                    });
                    oarg.xhttpobj.responseXML = $.parseXML(_xml)
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
    oarg.session.connected = false;
    hs.connection.failure += 1;
    debug(3,"reconnect " + hs.connection.failure,oarg);
    var _waittime = Math.min(2000 * (hs.connection.failure -1) ,60000); // max 60sec
    setTimeout(function() {
        hs.functions.login_init( oarg );
    },_waittime + 1);
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
    var entityobj = this;
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
    debug(5,"login_init:",oarg);
    var _cmd = "init";
    var _url =  "/hsgui?cmd=" + _cmd;
    _url += "&user=" + hs.auth.username;
    _url += "&cid="  + hs.auth.gui_design;
    _url += "&ref="  + hs.auth.gui_refresh;
    oarg.session.ajax_queue = $({});
    oarg.session.connected = false;
    hs.functions.make_request( {
        "session"     : oarg.session,
        "cmd"         : _cmd,
        "url"         : _url
    });
};

hs.functions.async.login = function( oarg ) {
    debug(5,"async.login:",oarg);
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
    debug(5,"async.logged_in (" + oarg.session.target + "):",oarg.json);
    // check main
    hs.connection.failure = 0;
    oarg.session.connected = true;
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
    // Visuseite laden
        
    oarg.page_id = oarg.session.active_page ? oarg.session.active_page.page_id : null || oarg.session.start_page || hs.user.start_page;
    hs.functions.load_page( oarg );
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
    var _delay = hs.gui.hidden ? hs.connection.hiddentime * 1000: 0;
    $.each(hs.session, function(index, session) {
        if(!session.connected || !session.active_page) {
            return;
        }
        if(session.target_obj.length == 0 || session.target_obj.is(":hidden")) {
            if(session.last_communication_time + (hs.connection.timeout * 1000 * 0.80)> _now) { // 80% of timeout
                return;
            } else {
                debug(4,"Keep-alive Session " + session.target,session);
            }
        }
        // timeout
        if(session.last_communication_time + (hs.connection.timeout * 1000) < _now) {
            debug(3,"connection_timeout",session);
            hs.functions.login_init( { "session" : session } );
            return;
        }
        if (session.active_page.next_update && session.active_page.next_update + _delay <= _now) {
            debug(4,"Update " + session.active_page.id,session);
            session.active_page.next_update = hs.functions.get_next_update(session.active_page) ;
            hs.functions.make_request( {
                "session"     : session,
                "cmd"         : "gvu&id=" + session.active_page.page_id,
                "page_id"     : session.active_page.page_id
            });
        }
        $.each(session.active_page.items, function(index,item) {
            if($.inArray(item.type,["CAM","GRAF","ICO"]) > -1) {
                if(item.next_update && item.next_update + _delay <= _now) {
                    item.next_update = null;
                    debug(4,"Update " + item.uid,item);
                    hs.functions.load_image({
                        "item" : item
                    });
                }
            }
            if(item.type == "TXT" && item.next_update && item.next_update + _delay <= _now) {
                if(typeof item.update_code == 'function') {
                    debug(4,"Update " + item.uid,session);
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
    debug(4,"load_page (" + oarg.session.target + "): " + oarg.page_id + " (" + oarg.command_id + ")", oarg);

    var _extra_request = "";
    if (typeof oarg.item != 'undefined' && oarg.item.has_command) {
        _extra_request = "&cmdid=" + oarg.item.id + "&cmdpos=0";
    }

    if (hs.gui.pages.hasOwnProperty(oarg.page_id)) {
        var _page = hs.gui.pages[oarg.page_id];
        if (!_page.hidepage) {
            //FIXME
            if ($.inArray(oarg.page_id, hs.gui.active_pages) > -1 ) {
                debug(5,"load_page:FadeIn Cached Page "+oarg.page_id);
                _page.object.css("z-index","50");
                _page.object.fadeIn(20);
                oarg.session.history.push(oarg.page_id);
                document.title = "xxAPI - " + _page.text1;
            }
            oarg.cmd = "gv&id=" + oarg.page_id + _extra_request;
            hs.functions.make_request( oarg );
            return
        }
    } 
    hs.functions.make_request( {
        "session"     : oarg.session,
        "cmd"         : "gv&id=" + oarg.page_id + _extra_request,
        "page_id"     : oarg.page_id
    });
};

hs.functions.async.gv = function( oarg ) {
    debug(5,"async.gv (" + oarg.session.target + "): ",oarg);
    if (oarg.json.HS == "") {
        return false;
    }

    var _page = new hs.functions.hs_page( oarg );
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
            case "touchend"     : $(".visuelement").removeClass("activevisuelement"); break;
        }
    }
}

hs.functions.check_click = function( oarg ) {
    debug(3,"check_click",oarg);
    var _session_position =  oarg.item.session.target_obj.position();
    oarg.item.event = oarg.item.event || {};
    xxAPI.events.lastclick.top = oarg.item.event.pageY - _session_position.top;
    xxAPI.events.lastclick.left = oarg.item.event.pageX - _session_position.left;
    /* 
        Element .action_id
             0 = Nur Befehl
             1 = Seitenaufruf (optional Befehl)
             2 = 
             3 =
             4 =
             5 =
             6 =
             7 = Kamera
             8 = Wochenschaltuhr /hsgui?cmd=getpag&id=31&hnd=4&code=C52747C9D8
             9 = Werteingabe  /hsgui?cmd=getpag&id=23&hnd=3&code=CB87CC79BA
            10 = Urlaubskalender
            11 = Feiertagskalender
            12 = Datum/Uhrzeit setzen /hsgui?cmd=getpag&id=17&hnd=3&code=CB87CC79BA
            13 = 
            14 = Meldungsarchiv /hsgui?cmd=getmsg&id=29&dir=0&cnt=5&hnd=4&code=2EB8E86D8F
            15 = Buddy   /hsgui?cmd=getbud&id=25&dir=0&cnt=5&hnd=3&code=CC16E8CD49
            16 = Diagramm /hsgui?cmd=getpag&id=32&hnd=4&code=C65F9B4058
            17 = Kamera-Archiv  /hsgui?cmd=getcama&id=30&dir=0&cnt=6&hnd=4&code=FF8BF7D074
            18 = Universal Zeitschaltuhr /hsgui?cmd=getuhr&id=18&dir=0&cnt=5&hnd=4&code=18831A2D12
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
            hs.functions.load_page( oarg );
            break;
            
        case 8:
            // Wochenschaltuhr
            /*
                /hsgui?cmd=timset&id=31&days=000000000&frm=1200&to=2100&act=0&hnd=4&code=A2669029CE
            */
            alert("Wochenschaltuhr noch nicht implementiert");
            break;
        case 9:
            // Werteingabe
            /*
                /hsgui?cmd=valset&id=2&val=8.123456
            */
            alert("Werteingabe noch nicht implementiert");
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
        case 16:
            // Diagramm
            /*
                /hsgui?cmd=getpag&id=32&hnd=4&code=C65F9B4058
                <HS><GRAF txt1="Diagramm" txt2="" ico="MLOGO"/></HS>
            */
            alert("Diagrammaufruf noch nicht implementiert");
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
            
                if (_lastpage !== undefined) {
                    oarg.page_id = _lastpage;
                    hs.functions.load_page( oarg );
                }
            }
            break;
        case 23:
            // 23 = Menü
            //hs.functions.make_request({ session:session,cmd:"gl&id=" + hs.user.start_list + "&frm=1&cnt=5"} );
            alert("Menü noch nicht implementiert")
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
    window.location.href += "?logout=1";
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
};

hs.functions.login_dialog = function( oarg ) {
    if( oarg ) {
        oarg.session.connected = false;
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
    _form_html += "<input name='username' class='textinput' tabindex='1' type='text' value='" + (hs.auth.username == null ? "" : hs.auth.username) + "'>";
    _form_html += "<label for='password'>Passwort</label>";
    _form_html += "<input name='password' class='textinput' tabindex='2'type='password' >";
    _form_html += "<label for='cl'>Design</label>";
    _form_html += hs.gui.designs_html;
    _form_html += "<label for'remember'>&#160;</label>";
    _form_html += "<button type='submit' tabindex='4'>Login</button>";
    _form_html += "<div class='wide'>";
    _form_html += "<input name='remember' tabindex='5' type='checkbox'" + ((hs.auth.username != null) == (localStorage.getItem('username') == hs.auth.username) ? " checked": "" ) + ">";
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
            if (hs.auth.gui_design != null) {
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
                    localStorage.setItem('username',hs.auth.username);
                    localStorage.setItem('password',hs.auth.password);
                    localStorage.setItem('gui_design',hs.auth.gui_design);
                } else {
                    localStorage.clear();
                    debug(4,"Clear Storage",localStorage);
                }
                new hs.functions.hs_session("VISU");
                //$('#login_form',elements));
                hs.gui.modal_popup.close();
            });
        }
    });

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

function string_padding(str, len, pad) {
    if (typeof len == "undefined") { var len = 0; }
    if (typeof pad == "undefined") { var pad = ' '; }
    len += 1;
    if (len >= str.length) {
        return str + Array(len - str.length).join(pad);
    }
    return str;
};
function string_cut_after_match(str,pattern) {
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

jQuery.fn.reverse = [].reverse;

jQuery.fn.center = function (parent) {
    if(typeof parent == 'undefined') {
        parent = this.parent()
    } else {
        parent = $(parent);
    }
    this.css({
        "position"  : "absolute",
        "top"       : parent.height() < this.height() ? 0 : parent.height()/2 - this.height()/2,
        "left"      : parent.width() < this.width()   ? 0 : parent.width()/2 - this.width()/2
    });
}

hs.functions.set_viewport = function() {
    debug(5,"Set Viewport",hs.gui.attr);
    $("#VISU").css({
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

hs.functions.post_loading = function () {
    var _base = $("base");
    if (typeof _base.attr("href") != "undefined" && _base.attr("href") != "") {
        $("head").append('<link rel="stylesheet" href="libs/xxapi.css">');
        // Clear Base
        $("base").attr("href","");
    } else {
        // HS Fix for Content Type not text/css
        hs.functions.element_loader("libs/xxapi.css");
    }
    hs.functions.element_loader("custom.css");
    hs.functions.element_loader("custom.js");
}

hs.functions.element_loader = function ( filename ) {
    var _id = filename.replace(".","_").replace("/","_");
    var _type = filename.toLowerCase().split(".")[1];
    var _element = "script";
    if (_type == "css") {
        _element = "style";
    }
    $("head").append(
        $("<"+_element+" />", { 
            "id" : _id
        })
    )
    debug(4,"element_loader", { "filename" : filename, "type" : _type, "id" : _id });
    $.ajax({ 
        url     : filename, 
        cache   : true, 
        complete: function(xhttpobj) { 
            var _html = xhttpobj.responseText;
            if (_html == "") { 
                return;
            }
            debug(5,"element_loader_ajax",{ "html" : _html });
            if (_element == "script") {
                _html = '"use strict"; ' + _html;
            }
            $("#"+_id).html(_html)
         } 
     });
}

$(document).ready(function() {
    $("#POPUP").remove();
    if(hs.functions.get_query_parameter("logout")) {
        localStorage.removeItem('password');
        window.location.replace(location.protocol + '//' + location.host + location.pathname);
    }
    if (typeof Storage != 'undefined') {
        hs.auth.username = localStorage.getItem('username');
        hs.auth.password = localStorage.getItem('password');
        hs.auth.gui_design = localStorage.getItem('gui_design');
        hs.debuglevel      = localStorage.getItem('debuglevel') || 0;
    }

    if (hs.auth.username == null || hs.auth.password == null || hs.auth.gui_design == null) {
        hs.functions.login_dialog()
    } else {
        new hs.functions.hs_session("VISU");
    }
});

$(window).bind('orientationchange', function(event) {
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

$(document).on("visibilitychange",  function() {
    if(document.hidden) {
        debug(4,"xxAPI is hidden, delayed refresh");
    } else {
        debug(4,"xxAPI is visible, normal refresh");
    }
    hs.gui.hidden = document.hidden;
});

window.addEventListener('load', function(e) {
    window.applicationCache.addEventListener('updateready', function (e) {
        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
            window.applicationCache.swapCache();
            window.location.reload();
        }
    });
});
