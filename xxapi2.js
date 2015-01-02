"use strict";

// xml2json library
$.x2js = new X2JS();
$.xml2json = $.x2js.xml2json;

var xxAPI = {};
xxAPI.version = "2.011";
xxAPI.functions = {};
xxAPI.XXLINKURL = "";
xxAPI.registered_icons = {};
xxAPI.geolocation = {}


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
hs.gui.attr = {};
hs.gui.hashes = {};
hs.gui.pages = {};
hs.gui.items = {};
hs.gui.designs_html = null;
hs.auth = {};
hs.auth.username = null;
hs.auth.password = null;
hs.auth.gui_design = null;
hs.auth.gui_refresh="R1";
hs.debuglevel = 0;

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
    _html += "<footer style='position: absolute; bottom: 1em;'>Copyright © 2015 knx-user-forum e.V.<footer>";
    var _div = $('<div />').html(_html);
    _div.css( {
        "font-size"         :"small",
        "color"             :"grey",
        "background-color"  :"white",
        "width"             :"300px",
        "height"            :"300px",
        "padding"           :"3px",
    });
    _div.modal({
        "autoPosition"  : true,
        "modal"         : true,
        "overlayClose"  : true,
    });
    if ( oarg != null) {
        oarg.item.text = '';
    }
}

hs.functions.set_debuglevel = function ( level ) {
    hs.debuglevel      = level;
    localStorage.setItem('debuglevel',level);
}

xxAPI.functions.XXSCRIPT = function( oarg ) {
    var _item = oarg.item;
    if (_item.open_page > 0) {
        debug(2,"alte xxAPI gefunden");
        _item.page.hidden = true;
        //window.setTimeout(function() {
            hs.functions.load_page( {
                "session"   : _item.session,
                "page_id"   : _item.open_page
            });
        //},1);
    }
}


xxAPI.functions.XXHTML = function ( oarg ) {
    debug(2,"XXHTML:",oarg);
    var _html = oarg.args[1] || "";
    _html = _html.replace(/\[/g, "<");
    _html = _html.replace(/\?\?/g, "\"");
    _html = _html.replace(/=\?/g, "=\"");
    _html = _html.replace(/\? /g, "\" ");
    _html = _html.replace(/\?\]/g, "\">");
    _html = _html.replace(/\]/g, ">");
    oarg.item.text = _html;
}

xxAPI.functions.XXEHTML = function ( oarg ) {
    debug(2,"XXEHTML:",oarg);
    var _html = $.base64.decode(oarg.args[1]);
    oarg.item.text = _html;
}

xxAPI.functions.XXLINK = function ( oarg ) {
    debug(2,"XXLINK:",oarg);
    oarg.item.clickcode = function() {
        xxAPI.XXLINKURL = xxAPI.functions.geturl(oarg.args[2]);
    }
    oarg.item.text = oarg.args[1];
}

xxAPI.functions.XXHTTP = function ( oarg ) {
    debug(2,"XXHTTP:",oarg);
    oarg.item.clickcode = function() {
        window.open(xxAPI.functions.geturl(oarg.args[2]),'XXHTTP');
    }
    oarg.item.text = oarg.args[1];
}


xxAPI.functions.XXIFRAME = function ( oarg ) {
    debug(2,"XXIFRAME:",oarg);
    if (oarg.args.length < 3) {
        oarg.item.text = "<iframe src='" + xxAPI.XXLINKURL + "' " +
        "width='" + oarg.item.width + "px' " +
        "height='" + oarg.item.height + "px' " +
        "allowtransparency='true'>";
    }
}
xxAPI.functions.XXEXECUTE = function ( oarg ) {
    debug(2,"XXEXECUTE:",oarg);
    var _jscode = oarg.args[1] || "";
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
    // item für abwärtskompatiblität
    var _func = new Function('item','"use strict"; ' + _jscode);
    oarg.item.text = '';
    try {
        _func( oarg.item );
    } catch (e) {
        debug(1,"XXEXECUTE_ERROR:",e);
    }
}
xxAPI.functions.XXLONGPRESS = function ( oarg ) {
    debug(2,"XXLONGPRESS",oarg);
    var _item = oarg.item;
    var _args = oarg.args;
    var _longpresstime = parseInt(_args[1]) || 50;
    if (_longpresstime < 50) {
        _longpresstime = 50;
    }
    _item.xxapi.longpresstime = _longpresstime;
    if (_args.length > 2) {
        _item.xxapi.longpressbit = parseInt(_args[2]) || 0;
    }
    if (_args.length > 3) {
        _item.xxapi.longpresscode = _args.slice(3).join("*");
    }
    _item.text = '';
}

xxAPI.functions.XXREGICON = function ( oarg ) {
    debug(2,"XXREGICON",oarg);
    var _args = oarg.args;
    if (_args.length > 2) {
        xxAPI.registered_icons[_args[1]] = _args.slice(2).join("*");
    }
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
        debug(2,"XXGEOLOCATE send: " + attribute + " auf ID " + xxAPI.geolocation[attribute] + " Wert " + value);
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
}

xxAPI.functions.XXGEOLOCATION = function ( oarg ) {
    debug(2,"XXGEOLOCATION",oarg)
    if (oarg.item.action_id != 9) {
        debug(1,"ERROR: " + oarg.item.text + " Keine Werteingabe");
    }
    xxAPI.geolocation[oarg.args[1]] = oarg.item.id;
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
    if (window.console && window.console.debug) {
        if (typeof obj != "object") {
            window.console.debug(msg);
        } else {
            window.console.debug(msg+": %o",obj);
        }
    }
}


hs.functions.xxapi_check = function( oarg ) {
    if (oarg.item.type == "ICO") {
        oarg.text = xxAPI.registered_icons[oarg.item.image] || '';
    }
    debug(3,"xxAPI Check: (" + oarg.item.uuid + ") " + oarg.text ,oarg);
    if (oarg.text.match(/^XX.*\*/) == null) {
        return;
    }
    var args = oarg.text.split("*");
    var _func = xxAPI.functions[args[0]];
    if(typeof _func === 'function') {
        oarg.args = args;
        _func( oarg );
    }
}

hs.functions.hs_session = function(target,start_id) {
    if (typeof target == 'undefined') {
        target = "VISU";
    }
    if (hs.session.hasOwnProperty(target)) {
        //delete hs.session[target_item];
        var _session = hs.session[target];
        hs.functions.load_page({ 
            "session"   : _session,
            "page_id"   : start_id || _session.start_id,
        });
        return _session;
    }
    hs.session[target] = this;
    // Session 
    this.target = target;
    this.start_id = start_id;
    this.auth = {};
    this.auth.handle = 0;
    this.auth.pos = 0;
    this.auth.tan = 0;
    this.auth.tan_counter = 0;
    this.auth.glob_key1 = "";
    this.auth.glob_key2 = "";
    
    this.ajax_queue = $({});
    this.update_timer = null;
    
    this.connected = false;
    this.visible = false;
    
    this.active_page = null;
    this.history = [];
    
    // an eigentlicher Stelle aufrufen??
    hs.functions.login_init({ session: this, page_id : start_id});

    return this;
}


hs.functions.hs_item = function( oarg ) {
    var _json = oarg.json;
    this.json = _json;
    this.id     = _json._pos || _json._id;
    this.type   = oarg.item_type;
    this.uid = this.type + "_" + this.id;
    this.uuid = this.uid;
    
    this.page_id = oarg.page_id
    this.page = oarg.page;
    this.session = oarg.session;
    
    var _item = this;
    
//    if (this.type == "BOX") {
        this.uuid = "PAGE_" + this.page_id + "_" + this.uuid;
//    }

    if (this.page.items.hasOwnProperty(this.uuid)) {

        _item = this.page.items[this.uuid];
        hs.functions.update_item( {
            "json"  : _json,
            "item"  : _item,
        });

    } else {

        this.width  = parseInt(_json._w);
        this.height = parseInt(_json._h);
        this.top    = parseInt(_json._y);
        this.left   = parseInt(_json._x);
        
        this.click       = (_json._click*1) == 1;
        this.has_command = (_json._hcmd*1) == 1;
        this.open_page   = parseInt(_json._pid   || -1);
        this.action_id   = parseInt(_json._typ   || -1);
        this.font        = parseInt(_json._fid   ||  0);
        this.align       = parseInt(_json._align ||  0);
        this.indent      = parseInt(_json._bord  ||  0);
        
        this.color       = hs.functions.get_hexcolor( _json._fcol                || -1);
        this.bg_color    = hs.functions.get_hexcolor( _json._bgcol || _json._col || -1);
        this.text        = _json._txt ||   "";
        this.image       = _json._ico || null;
        this.url         = _json._url || null;
        
        // xxAPI
        this.xxapi = {};
        this.clickcode = null;
        this.mousedowncode = null;
        this.mouseupcode = null;
        this.hidden = false;
        this.object = null;

        hs.functions.xxapi_check( {
            "cmd"       : "create",
            "json"      : _json,
            "text"      : _item.text,
            "item"      : _item,
        });
        
        if (this.object == null) {
            debug(5,"Create HTML Element " + this.uid,_json);
            this.object = $("<div />", {
                "id"        : this.session.target + "_PAGE_" + this.page_id + "_" + this.uid,
                css         : {
                    "position"      : "absolute",
                    "display"       : "block",
                    "overflow"      : "hidden",
                    "top"           : this.top,
                    "left"          : this.left,
                    "height"        : this.height + "px",
                    "width"         : this.width  + "px",
                    "line-height"   : this.height + "px",
                }
            });
            if (this.click) {
                this.object.click(function (e) {
                    hs.functions.check_click( {
                        "item"      : _item,
                    });
                });
            }
            if (this.type == "BOX") {
                if (this.width > 5 && this.height > 5) {
                    this.object.css( {
                        "width"             : (this.width  -2) + "px",
                        "height"            : (this.height -2) + "px",
                        "border-width"      : "1px",
                        "border-style"      : "solid",
                        "border-color"      : this.bg_color,
                    });
                }
                this.object.css("background-color", this.bg_color);

            }
            
            if (this.type == "TXT") {
                this.object.css( hs.gui.fonts[this.font] );
                this.object.css( hs.functions.css_align(this.align) );
                this.object.css( {
                    "background-color"  : this.bg_color,
                    "color"             : this.color,
                });
                this.object.html(_item.text);
            }
            
            if (this.type == "CAM") {
                var _url = _url != null ? "http://" + this.url : 
                    hs.functions.get_url ({ 
                        "session"   : this.session, 
                        "url"       : "/guicamv?id=" + this.id, 
                        "cmd"       : "", 
                        });
            }
            
            if (this.type == "GRAF") {
                var _url = hs.functions.get_url ({ 
                    "session"   : this.session, 
                    "url"       : "/guigrafv?id=" + this.id, 
                    "cmd"       : "",
                });
            }
            
            if (this.type == "ICO") {
                var _url = "/guiico?id=" + this.image + "&cl=" + hs.auth.gui_design;
            }
            
            if ( $.inArray(this.type, ["CAM","GRAF","ICO"]) > -1) {
                hs.functions.add_image( { 
                    "item_object"   : this.object, 
                    "item"          : this , 
                    "url"           : _url,
                });
            }
        }
        this.page.items[this.uuid] = this;
        if(!this.hidden) {
            this.page.object.append(this.object);
        }
    }
    /*
    */
}

hs.functions.update_item = function ( oarg ) {
    var _json = oarg.json;
    var _color    = hs.functions.get_hexcolor( _json._fcol                || -1);
    var _bg_color = hs.functions.get_hexcolor( _json._bgcol || _json._col || -1);
    var _text     = _json._txt ||   "";
    var _image    = _json._ico || null;
    var _url      = _json._url || null;
    $.each(hs.gui.pages, function() {
        var _tmp = null;

        if (this.items.hasOwnProperty(oarg.item.uuid)) {
            var _item = this.items[oarg.item.uuid];
            
            // xxAPI update check

            hs.functions.xxapi_check( {
                "cmd"       : "update",
                "json"      : _json,
                "text"      : _text,
                "item"      : _item,
            });

            if ( $.inArray(_item.type, ["TXT"]) > -1) {
                if (_color != _item.color) {
                    _item.color = _color;
                    _item.object.css("color",_color);
                }
                if (_text != _item.text) {
                    debug(4,"TEXT CHANGED '" + _text + "' != '" + _item.text + "'")
                    _item.text = _text;
                    _item.object.html(_text);
                }

            }
            if ( $.inArray(_item.type, ["TXT","BOX"]) > -1) {
                if (_bg_color != _item.bg_color) {
                    debug(4,"BOX/TEXT changed");
                    _item.bg_color = _bg_color;
                    _item.object.css({
                        "background-color"  : _bg_color,
                        "border-color"      : _bg_color,
                    });
                }
            }
            if ( $.inArray(_item.type, ["ICO"]) > -1) {
                if (_json._ico != _item.image) {
                    debug(4,"ICO changed")
                    _item.image = _json._ico;
                    
                }
                
            }
            if ( $.inArray(_item.type, ["CAM"]) > -1) {
                if (_json._url != _item.url) {
                    _item.url = _json._url;
                }
            }
        }
    });
}


hs.functions.add_image = function ( oarg ) {
    debug(5,"add_image",oarg);
    oarg.item_object.append( 
        $("<img />", {
            // "id"        : oarg.session.target + "_PAGE_" + oarg.page_id + "_" + _item.id + "_IMG",
            "src"       : oarg.url,
            "alt"       : " ",
            "width"     : oarg.item.width,
            "height"    : oarg.item.height,
            "css"       : {
                "position"  : "absolute",
            },
            "on"        : {
                "dragstart" : function () { return false; },
            }    
        })
    );
}


hs.functions.hs_page = function( oarg ) {
    this.page_id    = oarg.page_id;
    this.id         = oarg.session.target + "_PAGE_" + oarg.page_id;

    if (hs.gui.pages.hasOwnProperty(this.id)) {
        debug(5,"update existing Page: ",oarg);
        oarg.page = hs.gui.pages[this.id];
        
        hs.functions.loop_items( oarg );
        if (oarg.cmd == "gv") {
            hs.functions.fade_page( oarg.page );
        }
        return oarg.page;
    }
    debug(5,"create new Page: ",oarg);
    oarg.page = this;
    var _json = oarg.json;
    hs.gui.pages[this.id] = this;
    this.visible    = false;
    this.hidden     = false;
    this.popup      = false;
    this.bg_image   = _json.HS.VISU._bg;
    this.icon       = _json.HS.VISU._ico;
    this.qanz       = parseInt(_json.HS.VISU._bg);
    this.title      = _json.HS.VISU._txt1;
    this.text       = _json.HS.VISU._txt2;
    this.width      = hs.gui.attr.visu_width;
    this.height     = hs.gui.attr.visu_height;
    this.items      = {};
    this.object = $("<div />", {
        "id"            : this.id,
        "css"   : {
            "position"  : "absolute",
            "overflow"  : "hidden",
            "width"     : this.width,
            "height"    : this.height,
        }
    });
    if (this.bg_image != "XXTRSPBG") {
        this.object.append( 
            $("<img />", {
                "id"        : this.id + "_BGIMG",
                "src"       : "/guibg?id=" + this.bg_image + "&cl=" + hs.auth.gui_design,
                "alt"       : " ",
                "on"        : {
                    "dragstart" : function () { return false; },
                }    
            })
        );
        
    } 
    hs.functions.loop_items( oarg );
    hs.functions.fade_page( oarg.page );
    if (!this.hidden) {
        $("#" + oarg.session.target).append(this.object);
    }
    return this;
}

hs.functions.fade_page = function( page ) {
    debug(5,"fade_page",page);
    page.object.show();
    $.each(hs.gui.pages,function(page_id,page_obj) {
        debug(5,"PAGE: ",page_obj);
        if (page.page_id == page_obj.page_id) {
            return;
        }
        if (page_obj.visible) {
            page_obj.object.css("z-index",1000);
            page_obj.visible = false;
            page_obj.object.fadeOut(10,function() {
                debug(5,"FADEOUT",$(this));
                $(this).css("z-index","");
                $(this).hide();
                
            });
        }
    });
    page.visible = true;
}

hs.functions.loop_items = function ( oarg ) {
    var _items = {};
    var _json = oarg.json;
    $.each(_json.HS.ITEMS, 
        function(item_type, child) {
            oarg.item_type = item_type;
            if ($.isArray(child)) {
                $.each(child, 
                    function(counter,item) {
                        oarg.json = item;
                        var _hs_item = new hs.functions.hs_item( oarg );
                        _items[_hs_item.id] = _hs_item;
                    }
                );
            } else {
                oarg.json = child;
                var _hs_item = new hs.functions.hs_item( oarg );
                _items[_hs_item.id] = _hs_item;
            }
        }
    );
    return _items;
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
    debug(5,"make_request (" + oarg.session.target + "): " + oarg.cmd + " / id=" + oarg.id + " / url=" + oarg.url);
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
        debug(5,"do_request (" + oarg.session.target + "): " + oarg.cmd + " / id=" + oarg.id + " / url=" + oarg.url, ajaxOpts);
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
    debug(5,"async_handler (" + oarg.session.target + ") : " + oarg.cmd + " / id=" + oarg.id ,oarg);
    oarg.url = "";
    oarg.json =  hs.functions.error_handler( oarg ) 
    if (!oarg.json) {
        return false;
    }

    var _cmd = string_cut_after_match(oarg.cmd,"&");
    oarg.cmd = _cmd;
    switch (_cmd) {
        case "init"     : hs.functions.async.login( oarg ); break;
        case "login"    : hs.functions.async.logged_in(  oarg ); break;
        case "getfont"  : hs.functions.async.getfont( oarg ); break;
        case "getattr"  : hs.functions.async.getattr( oarg ); break;
        
        // VISU Seite laden
        case "gv"       : hs.functions.async.gv( oarg ); break;
        // VISU Seite update
        case "gvu"      : hs.functions.async.gvu( oarg ); break;
        // VISU Seite update und Befehl
        case "vcu"      : hs.functions.async.gvu( oarg ); break;
        
        case "logout"   : break;
        default:
            alert("unknow CMD '" + _cmd + "'");
    }
    
    // check id etc
    // error if response_xml invalid/undefined
    
};

hs.functions.error_handler = function( oarg ) {
    //handle Error
    // <HS><ERR code="99"></ERR></HS>
    // <HS><ERROR>Timeout !!</ERROR></HS>
    debug(5,"error_handler: (" + oarg.cmd + ")", oarg.xhttpobj);
    var _error_xml_regex = new RegExp("(?:<ERROR>|<ERR code=\")(.*?)(?:<\/ERROR>|\"\/>)","g");
    var _error = ""
    if (typeof oarg.xhttpobj != 'undefined') {
        if (!navigator.onLine) {
            _error = "offline";
        }
        if (oarg.id > -1 ) { 
            hs.gui.active_pageload = false;
        }
        if (oarg.xhttpobj.status != 200) {
            switch (oarg.xhttpobj.status) {
                case 0: _error = "offline"; break;
                case 404: _error = "notfound"; break;
            }
        } else {
            if (oarg.xhttpobj.responseText.length == 0) {
                switch(oarg.cmd) {
                    case "init"     : _error = "auth_error"; break;
                    case "login"    : _error = "pass_error"; break;
                    
                }
            }
            var _errorcode = _error_xml_regex.exec(oarg.xhttpobj.responseText);
            if (_errorcode != null) {
                _error = _errorcode[1].toLowerCase();
                _error = _error.substring(0,17);
            }
            if (_error == "") {
                try {
                    var _json =  $.xml2json(oarg.xhttpobj.responseXML);
                    return _json;
                } catch (e) {
                    _error = e.toString();
                    alert(oarg.xhttpobj.responseText);
                }
            }
        }
    }
    
    debug(1,"Error: " + _error + " / " + oarg.id,oarg);
    switch (_error) {
        case "auth_error"       : hs.functions.login_dialog("Benutzer falsch"); break;
        case "pass_error"       : hs.functions.login_dialog("Password falsch"); break;
        case "timeout !!"       : hs.functions.login_init( oarg ); break;
        case "handle error !!"  : hs.functions.login_init( oarg ); break;
        case "user kidnapped !!": hs.functions.login_init( oarg ); break;
        case "99"               : alert("Visuseite nicht gefunden"); break;
        default                 : alert("Error " + _error); break
    }
    return (_error == "");
}

hs.functions.login_init = function( oarg ) {
    debug(5,"login_init: " + oarg.id);
    var _cmd = "init";
    var _url =  "/hsgui?cmd=" + _cmd;
    _url += "&user=" + hs.auth.username;
    _url += "&cid="  + hs.auth.gui_design;
    _url += "&ref="  + hs.auth.gui_refresh;
    hs.functions.make_request( {
        session     : oarg.session,
        cmd         : _cmd,
        id          : oarg.id,
        url         : _url
    });
};

hs.functions.async.login = function( oarg ) {
    debug(5,"async.login: " + oarg.id ,oarg.session);
    oarg.session.auth.handle = oarg.json.HS.HND;
    oarg.session.auth.tan = oarg.json.HS.TAN;
    oarg.session.auth.tan_counter = 0;
    oarg.session.auth.pos = parseInt(oarg.json.HS.POS)+1;
    oarg.session.auth.glob_key1 = hs.functions.make_globkey(0x5c);
    oarg.session.auth.glob_key2 = hs.functions.make_globkey(0x36);
    hs.functions.make_request( {
        session     : oarg.session,
        cmd         : "login",
        id          : oarg.id,
    });
};

hs.functions.async.logged_in = function(  oarg ) {
    debug(5,"async.logged_in (" + oarg.session.target + "):",oarg.json);
    // check main
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

    }
    
    // überprüfen ob die Schriften sich geändert haben
    if (hs.gui.hashes._font != oarg.json.HS.HASH._font) {
        hs.functions.make_request( {
            session     : oarg.session,
            cmd         : "getfont",
            id          : oarg.id,
        });
    }
    // überprüfen ob die Parameter geändert wurden
    if (hs.gui.hashes._para != oarg.json.HS.HASH._para) {
        hs.functions.make_request( {
            session     : oarg.session,
            cmd         : "getattr",
            id          : oarg.id,
        });
    }
    hs.gui.hashes = oarg.json.HS.HASH;
    // Visuseite laden
        
    oarg.page_id = oarg.session.start_id || hs.user.start_page;
    hs.functions.load_page( oarg );
};


hs.functions.do_command = function( oarg ) {
    // hascommand cmd=vcu
    hs.functions.make_request( {
        "session"     : oarg.session,
        "cmd"         : "vcu&id=" + oarg.command_id,
        "page_id"     : oarg.page_id,
    });
}

hs.functions.load_page = function( oarg ) {
    debug(5,"load_page (" + oarg.session.target + "): " + oarg.page_id + " (" + oarg.command_id + ")");
    oarg.session.start_id = oarg.page_id;
    if (typeof oarg.id == "undefined") { oarg.command_id = -1; }

    var _extra_request = "";
    if (oarg.command_id > -1) {
        _extra_request = "&cmdid=" + oarg.command_id + "&cmdpos=0";
    }

    if (hs.gui.pages.hasOwnProperty(oarg.page_id)) {
        var _page = hs.gui.pages[oarg.page_id];
        if (!_page.hidepage) {
            if ($.inArray(oarg.page_id, hs.gui.active_pages) > -1 ) {
                debug(5,"load_page:FadeIn Cached Page "+oarg.page_id);
                _page.object.css("z-index","50");
                _page.object.fadeIn(20);
                $(".ACTIVEVISUPAGE").each(function () {
                    debug("load_page:loaded_page: " + oarg.page_id,$(this));
                    //
                    $(this).fadeOut(10, function() {
                        $(this).removeClass("ACTIVEVISUPAGE")
                        $(this).css("z-index","");
                        $(this).hide();
                        debug(5,"load_page:faded " + oarg.page_id,$(this));
                    });
                });
                debug(5,"load_page: activate: +" + oarg.page_id,_page);
                _page.object.css("z-index","");
                _page.object.addClass("ACTIVEVISUPAGE");
                hs.gui.active_pages = [ oarg.page_id ];
                oarg.session.history.push(oarg.page_id);
                document.title = "xxAPI - " + _page.text1;

            }
            oarg.cmd = "gv&id=" + oarg.page_id + _extra_request;
            hs.functions.make_request( oarg );
            return
        }
    } 
    hs.gui.active_pageload = true;
    hs.functions.make_request( {
        "session"     : oarg.session,
        "cmd"         : "gv&id=" + oarg.page_id + _extra_request,
        "page_id"     : oarg.page_id,
    });
};

hs.functions.async.gv = function( oarg ) {
    debug(5,"async.gv (" + oarg.session.target + "): ",oarg);
    if (oarg.json.HS == "") {
        return false;
    }

    // PRELOAD
    var _loaded_images = $(document.images).map( function() {  return this.src  });
    $(oarg.json.HS.ITEMS.ICO).reverse().each( function() {
        var _tmpimage =  "/guiico?id=" +  $(this)._ico + "&cl=" + hs.auth.gui_design;
        if (! $.inArray(_tmpimage, _loaded_images) ) {
            debug(5,"Preload: " + _tmpimage);
            $('<img />')[0].src = _tmpimage
        }
    });
    if (oarg.page_id != oarg.session.active_page) {
        oarg.session.active_page = oarg.page_id;
        oarg.session.history.push(oarg.page_id);
    }
    var _page = new hs.functions.hs_page( oarg );
};

hs.functions.check_click = function( oarg ) {
    debug(3,"check_click",oarg);
    var _item = oarg.item;
    var _session = _item.session;
    var _command_id = _item.has_command ? _item.id : -1;
    if (typeof _item.clickcode === 'function') {
        _item.clickcode( oarg );
    }
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
            20 = Seite aktualieren
            21 = Navigation: Startseite
            22 = Navigation: Zurück
            23 = Menü /hsgui?cmd=gl&id=153&frm=1&cnt=5&hnd=2&code=935C315C9D /hsgui?cmd=glu&hnd=1&code=33B5E3DF74 // /hsgui?cmd=gl&id=291&frm=1&cnt=5&hnd=1&code=A5840BEDB8 
            24 = Query /hsgui?cmd=gq&id=6&frm=1&cnt=5&chk=0&hnd=4&code=3BC1D69459
            25 = Navigation: Beenden  /hsgui?cmd=logout&hnd=3&code=AE7A1C1473
    */
    switch (_item.action_id) {
        case 0:
            //  0 = Nur Befehl
            if (_command_id > -1 ) {
                hs.functions.do_command( {
                    "session"       : _session,
                    "command_id"    : _command_id,
                    "page_id"       : _item.page_id,
                });
            }
            break;
        
        case 1: 
            // 1 = Seitenaufruf (optional Befehl)
            hs.functions.load_page( {
                "session"       : _session,
                "page_id"       : _item.open_page,
                "command_id"    : _command_id,
            });
            break;
            
        case 8:
            // Wochenschaltuhr
            /*
                /hsgui?cmd=timset&id=31&days=000000000&frm=1200&to=2100&act=0&hnd=4&code=A2669029CE
            */
            alert("Wochenschaltuhr noch nicht implementiert");
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
            if ( hs.user.start_page != _item.page.id) {
                hs.functions.load_page( {
                    "session"       : _session,
                    "page_id"       : hs.user.start_page,
                    "command_id"    : _command_id
                });
            }
            break;
        case 22:
            // 22 = Navigation: Zurück
            if (_session.history.length > 2) {
                debug(5,"history_back",oarg);
                _session.history.pop();
                var _lastpage = _session.history.pop();
            
                if (_lastpage !== undefined) {
                    hs.functions.load_page( {
                        "session"       : _session,
                        "page_id"       : _lastpage,
                        "command_id"    : _command_id
                    });
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
            alert("Funktionstyp " + _item.action_id + " noch nicht implementiert");
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

hs.functions.visu_refresh = function() {
    $.each(hs.gui.active_page, function(page_id) {
        hs.functions.make_request(session,"gvu&id=" + page_id,page_id);
    });
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
                'font-weight'  : item._bold == 1 ? "bold":"normal",
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
    
    hs.gui.attr.visu_height = (
        hs.gui.attr.ltitleh +
        (hs.gui.attr.llinec * hs.gui.attr.llineh) +
        hs.gui.attr.lnavh +
        (hs.gui.attr.hasborder == 0 ? 0:
            hs.gui.attr.lsep1h + hs.gui.attr.lsep2h + hs.gui.attr.lsep3h + hs.gui.attr.lsep4h
        )
    );
    hs.gui.attr.visu_width = (
        (6 * hs.gui.attr.lnavw) +
        (hs.gui.attr.hasborder < 2 ? 0:
            hs.gui.attr.lbleftw + hs.gui.attr.lbrightw
        )
    );
    hs.functions.set_viewport();
};

hs.functions.login_dialog = function(errortype) {
    if (hs.gui.designs_html != null) {
        return hs.functions.login_form(errortype)
        
    }
    $.ajax({ 
        url     : "/hs",
        dataType: "html",
        complete: function(xhttpobj) {
            hs.functions.async.parse_designs(xhttpobj,errortype);
        }
    });
}

hs.functions.async.parse_designs = function(xhttpobj,errortype) {
    var _regex = new RegExp("(<select name=\"cl\".*?<\/select>)");
    try {
        var _result = _regex.exec(xhttpobj.responseText);
        hs.gui.designs_html = _result[1];
        hs.functions.login_form(errortype)

    } catch (e) {
        
    }
}

hs.functions.login_form = function(errortype) {
    /* $('form').submit( function(e) {
        e.preventDefault();
            dostuff
        });
    */
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
                hs.auth.gui_design = $('#login_form > select[name="cl"]').val();
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


hs.functions.css_align = function(align) {
    switch (parseInt(align)) {
        case 1:
            return {"text-align" :"left" };
        case 2:
            return {"text-align" :"center"};
        case 3:
            return {"text-align" :"right"};
    }
    return {}
}
hs.functions.get_hexcolor = function(numcolor) {
    var _hex = "";
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

/*
jQuery.fn.vertical_align = function () {
    debug(5,"vertical_align:",$(this).parent());
    return this
            .css("margin-top",($(this).parent().height() - $(this).height())/2 + 'px' )
};
*/


/*
 return true == item wird weiter verarbeitet / false abruch nächstes item
 xxapi.functions.abc = new Function(" oarg ", "oarg.item.txt = ''; return false");
*/



jQuery.fn.reverse = [].reverse;

jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}

hs.functions.set_viewport = function() {
    //$("body").css("width","100%");
    if (typeof hs.gui.attr.visu_height == "undefined") {
        return false;
    }
    debug(5,"Set Viewport");
    hs.gui.attr.centered_left = (
        ($(window).width() < hs.gui.attr.visu_width) ? 0:
            ($(window).width() - hs.gui.attr.visu_width)/2
    
    );
    hs.gui.attr.centered_top = (
        ($(window).height() < hs.gui.attr.visu_height) ? 0:
            ($(window).height() - hs.gui.attr.visu_height)/2
    );

    $("#VISU").css("display","block");
    $("#VISU").css("position","absolute");
    $("#VISU").css("width",hs.gui.attr.visu_width);
    $("#VISU").css("height",hs.gui.attr.visu_height);
    $("#VISU").css("top",hs.gui.attr.centered_top);
    $("#VISU").css("left",hs.gui.attr.centered_left);
    
    //return true;
    var _orientation = hs.functions.get_orientation();
    var _visual_height = _orientation == "landscape" ? window.screen.availWidth  : window.screen.availHeight;
    var _visual_width  = _orientation == "landscape" ? window.screen.availHeight : window.screen.availWidth;
    
    var _scaleto_width = Math.min(Math.floor ( _visual_width / hs.gui.attr.visu_width * 100) / 100, 1.0);
    var _scaleto_height = Math.min(Math.floor ( _visual_height / hs.gui.attr.visu_height * 100) / 100, 1.0);
    var _scale_min = Math.min( _scaleto_width, _scaleto_height);
    //var _scale_max = Math.max( _scaleto_width, _scaleto_height);
    var _viewport_meta = 
        "width="          +  hs.gui.attr.visu_width +
        ",initial-scale=" + _scale_min +
        ",minimum-scale=" + _scale_min +
        ",maximum-scale=1" +  //_scale_max +
        ",user-scalable=" + (_scale_min < 1 ? "yes":"no");
    $("#meta_viewport").attr("content", _viewport_meta );
    debug(5,"Viewport: " +  _viewport_meta + " orientation: " + _orientation + " vheight: " + _visual_height + " vwidth: " + _visual_width);
}

hs.functions.get_orientation = function () {
    if (typeof orientation != "undefined") {
        return ( Math.abs(orientation)  == 90 ? "landscape":"portrait");
    } else {
        return "unsupported";
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

$(document).ready(function() {
    if(get_query_parameter("logout")) {
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

$(document).keydown( function(e) {
    if (e.ctrlKey && String.fromCharCode(e.which) === 'X') {
        xxAPI.functions.XXAPICONFIG( null );
        return false;
    }
});

window.addEventListener('load', function(e) {
    window.applicationCache.addEventListener('updateready', function (e) {
        if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
            window.applicationCache.swapCache();
            window.location.reload();
        }
    });
});
