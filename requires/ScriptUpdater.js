// ==UserScript==
// @name                  Scrip Updater
// @namespace       Beastx
// @description        Script Updater
// @include               http://*.ikariam.com/*
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==


ScriptUpdater = function() {};

ScriptUpdater.prototype.init = function(scriptName, currentVersion, isBaseScript, callback) {
    this.scriptName = scriptName;
    this.currentVersion = currentVersion;
    this.callback = callback;
    this.isBaseScript = isBaseScript ? isBaseScript : false;
    this.meta = {};
    this.icons = {
        install:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALZSURBVBgZBcFLiFVlAADg7zzuPLzjzDjOMINMitIie5gF+UAkIZSgRQuXLZIWrY021dYIggJdJURElJsoqlWRYA9GshGFCNQeOjoTk6bjeOd5zzn/f07flzRNA459ObcHJ3cM9+1fq2prVa2qa+uh7mAZ9xCxiAV8iu9zgDqEvU9ODOx//dkxALBa1kNrZT202I2TZcVyEd28t+Lb66uHcTwHqEMYH+xJwNyDqJUk8oQsp7eV2tqbytJUK+OpyX5bhtojH07Pv58CxKoabOeEmuUy0al4UNDp0umysM5/KxG8eWbW/u1tj4+2xnKAWFUjG3tSqwWr3ShNEzmyjDQjk8gSaiRxyYUbiy7PduZzgFiW40P9mc56sFY00rSRpaQxkaVkGlmGJnNnqXDq7N9LOJYDhLLcNj7Y0uk2AjRkMZE2iGQaeZOqG2IrCmXY/s1rB+6nALEstk0M9VotG0lKliRSpEjw+YUjPjq3RxkKoSjEsoiQwvMnvusXQ09vK1VGUg1qjVrUqDWKUJoc3emVj3dbWeuEUJZLkEMoyrF2u0+aUEPD19OHNXVQ1kEZgy2bHrZzYq/l7qr766/m3VC0ub+SQyyLDXm7R56SpYlYJ0JdOvzYy2JTi3VUa8x35jwxecBKue7S7E+dXW+nI/nB42dGcWLPI1vdXmrcvBO1++iGUmxqtxb+UtVBqCtVrCwVy3Y/dNBKtZb+OjO1kMeyfA4vXLo6Y3E9t1I0qtjo6goxGB/cKtRRbGr/dmaNDEy4PHfe+etTd8vgSB6r6ukXD+3qf+ulfQDg6OnCJ7+8p6xL3VDaMfqofTuOuHhryrk/fl4tokPz7zRX8lhVM7fvdXx29qrhgX7Dg32G271OHv3dxg09entSvXnqmXcHJGm/6Ru/ad89dmrm9AdXIK9D+GLq4rXJqYvXtmEzNmMTNmGor6fV6utr6YxWfvjzR0P/vDGTh7GvAP4H2uh1wse2x/0AAAAASUVORK5CYII%3D",
        close:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIhSURBVDjLlZPrThNRFIWJicmJz6BWiYbIkYDEG0JbBiitDQgm0PuFXqSAtKXtpE2hNuoPTXwSnwtExd6w0pl2OtPlrphKLSXhx07OZM769qy19wwAGLhM1ddC184+d18QMzoq3lfsD3LZ7Y3XbE5DL6Atzuyilc5Ciyd7IHVfgNcDYTQ2tvDr5crn6uLSvX+Av2Lk36FFpSVENDe3OxDZu8apO5rROJDLo30+Nlvj5RnTlVNAKs1aCVFr7b4BPn6Cls21AWgEQlz2+Dl1h7IdA+i97A/geP65WhbmrnZZ0GIJpr6OqZqYAd5/gJpKox4Mg7pD2YoC2b0/54rJQuJZdm6Izcgma4TW1WZ0h+y8BfbyJMwBmSxkjw+VObNanp5h/adwGhaTXF4NWbLj9gEONyCmUZmd10pGgf1/vwcgOT3tUQE0DdicwIod2EmSbwsKE1P8QoDkcHPJ5YESjgBJkYQpIEZ2KEB51Y6y3ojvY+P8XEDN7uKS0w0ltA7QGCWHCxSWWpwyaCeLy0BkA7UXyyg8fIzDoWHeBaDN4tQdSvAVdU1Aok+nsNTipIEVnkywo/FHatVkBoIhnFisOBoZxcGtQd4B0GYJNZsDSiAEadUBCkstPtN3Avs2Msa+Dt9XfxoFSNYF/Bh9gP0bOqHLAm2WUF1YQskwrVFYPWkf3h1iXwbvqGfFPSGW9Eah8HSS9fuZDnS32f71m8KFY7xs/QZyu6TH2+2+FAAAAABJRU5ErkJggg%3D%3D",
        uso:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAh9JREFUeNp0krmLWnEQxyf7zLoajyIWXojIxkK0EiIGCRamCKQwEdIIgYQoQSR/wLY2goVVJGCa1BaL2liKBESFiOJFiMRb1xMVRbx+mfdA0RwDA4/3m+Mz3xmAf9hDNJ/P9zWXy935/f7A5eXlFfzPRCKROBgMfqvX62S5XBLabDbbh8M76zRYKpUqvF5vyGw2P+bz+cBisWCz2cB2u33wV2WFQvEoFArlW60WmUwmZLVakdFoRNxu9xd8Fp51UKlUWmS91ev11zweD5AZMAFmsxkgWhpDpsfKarVaE4lEqpVKhUynU4a73++TcrlMarUa6Xa7G7vd/u4QT93c3HzmcrlPSqUSiMVihrvX68F6vYZsNkvPcOFyuV5Uq9VuoVD4ztrv91wOhwMCgQAGgwEsFguYz+eMSyQSkMvlwGazqUAg8KnRaHSo4XA4Q9leYRdmHrpyJpMBehaDwQBCoRB2ux2gapRSqbymsP2PTqezsFqtz+6hpVIpprLRaGTw8BcgBVOo2WyOj8NbLJaP+Xx+k0gkCL00xGNEoJ2WOZlMznQ6nfVsFyaT6X273d4eAmkfj8ckHo+PNRrNSzrm4jRBq9XysDWF18Cg0OzpdPrO6XS+QRVvz6oj0nOch25NYrEYgxEOhxsymezpadyxA8p5HxUDXBTgSUA0Gv3pcDheI2LiNIE6fOAN/cKkK9RdUSwWkx6P5y0mZv+8ud8CDABidDMA4Sb2JAAAAABJRU5ErkJggg%3D%3D"
    };
    this.url = Beastx.Config.options.serverUrl + "/tools/userScripts/Beastx." + this.scriptName + '.user.js';
}

ScriptUpdater.prototype.check = function() {
    this.forced = false;
    this.checkRemoteScript();
}

ScriptUpdater.prototype.forceCheck = function() {
    this.forced = true;
    this.checkRemoteScript();
}

ScriptUpdater.prototype.checkRemoteScript = function() {
    if (Beastx.debugMode) {
        Beastx.log('Check: ' + this.scriptName + '(Actual version: ' + this.currentVersion + ')');
    }
    if (!this.alreadyOffered(this.currentVersion)) {
        Beastx.log('aun no fue ofertada');
        this.addOffer(this.currentVersion);
    }
    this.addLastCheckedDate();
    var me = this;
    GM_xmlhttpRequest ({
        method: "GET",
        url: this.url,
        headers: {"User-agent": "Mozilla/5.0", "Accept": "text/html"},
        onload: function (response) {
            me.onServerResponse(response.responseText);
        }
    });
}

ScriptUpdater.prototype.onServerResponse = function(responseText) {
    this.parseHeaders(responseText);
    if (!this.alreadyOffered(this.meta.version) || this.forced) {
        if (!this.alreadyOffered(this.meta.version)) {
            this.addOffer(this.meta.version);
        }
        this.showNotice();
    }
}

ScriptUpdater.prototype.addLastCheckedDate = function() {
    var d = new Date();
    Beastx.setGMValue('LastCheckDate_' + this.scriptName, d.getTime());
}

ScriptUpdater.prototype.parseHeaders = function(metadataBlock) {
    var line, name, prefix, header, key, value;
    var lines = metadataBlock.split(/\n/).filter(/\/\/ @/);
    for each (line in lines) {
        [, name, value] = line.match(/\/\/ @(\S+)\s*(.*)/);
        [key, prefix] = name.split(/:/).reverse();

        if (prefix) {
            if (!this.meta[prefix]) {
                this.meta[prefix] = new Object;
            }
            header = this.meta[prefix];
        } else {
            header = this.meta;
        }
        if (header[key] && !(header[key] instanceof Array)) {
            header[key] = new Array(header[key]);
        }
        if (header[key] instanceof Array)  {
            header[key].push(value);
        } else {
            header[key] = value;
        }
    }
}

ScriptUpdater.prototype.showNotice = function() {
    if (this.meta.name && this.meta.version) {
        GM_addStyle(
            "#ScriptUpdaterMask { position:absolute; width:100%; top:0; left:0; height:100%; background-color:#000; opacity:.7; z-index:9000; } \
            #ScriptUpdaterBody * { border:none; font-size:12px; color:#333; font-weight:normal; margin:0; padding:0; background:none; text-decoration:none; font-family:Helvetica Neue,Arial,Helvetica,sans-serif; } \
            #ScriptUpdaterBody { width:500px; margin:auto; margin-top:125px; text-align:left; background:#f9f9f9; border:1px outset #333; padding:0; font-family:Arial; font-size:14px; -moz-border-radius:5px; cursor:default; z-index:9010; color:#333; padding-bottom:1em ; } \
            #ScriptUpdaterBody a { margin:0 .5em; text-decoration:underline; color:#000099; font-weight:bold; } \
            #ScriptUpdaterBody strong { font-weight:bold; } \
            #ScriptUpdaterBody h1 { font-size:13px; font-weight:bold; padding:.5em; border-bottom:1px solid #333; background-color:#999; margin-bottom:.75em; } \
            #ScriptUpdaterBody h2 { font-weight:bold; margin:.5em 1em; } \
            #ScriptUpdaterBody h1 a { font-size:13px; font-weight:bold; color:#fff; text-decoration:none; cursor:help; } \
            #ScriptUpdaterBody h1 a:hover { text-decoration:underline; } \
            #ScriptUpdaterBody table { width:auto; margin:0 1em; } \
            #ScriptUpdaterBody table tr th { padding-left:2em; text-align:right; padding-right:.5em; line-height:2em; } \
            #ScriptUpdaterBody table tr td { line-height:2em; font-weight:bold; } \
            #ScriptUpdaterBody li { list-style-type:circle; } \
            #ScriptUpdaterBody p { font-size:12px; font-weight:normal; margin:1em; } \
            #ScriptUpdaterHistory { margin:0 1em 1em 1em; max-height:150px; overflow-y:auto; border:1px inset #999; padding:0 1em 1em; width:448px; } \
            #ScriptUpdaterHistory ul { margin-left:2em; } \
            #ScriptUpdaterClose { float:right; cursor:pointer; height:14px; opacity:.5; } \
            #ScriptUpdaterClose:hover { opacity:.9; } \
            #ScriptUpdaterFooter { margin:.75em 1em; } \
            #ScriptUpdaterFooter input { border:1px outset #666; padding:3px 5px 5px 20px; background:no-repeat 4px center #eee; -moz-border-radius:3px; cursor:pointer; width:70px; float:right; margin-left:.5em; } \
            #ScriptUpdaterFooter input:hover { background-color:#f9f9f9; } \
            #ScriptUpdaterFooter select { border:1px inset #666; }"
        );

        var noticeBg = document.createElement('div');
        noticeBg.id = "ScriptUpdaterMask";
        document.body.appendChild(noticeBg);

        var noticeWrapper = document.createElement('div');
        noticeWrapper.setAttribute('style', 'position:absolute; width:100%; top:0; left:0; z-index:9010; max-width:auto; min-width:auto; max-height:auto; min-height:auto;');
        noticeWrapper.id = "ScriptUpdaterBodyWrapper";
        
        var notice = document.createElement('div');
        notice.id = "ScriptUpdaterBody";
        
        var html = new Array();
        html.push('<h1><img id="ScriptUpdaterClose" src="');
        html.push(this.icons.close);
        html.push('" title="Close"/><img src="');
        html.push(this.icons.uso);
        html.push('" align="absmiddle" style="margin-top:-2px;"/>');
        html.push(' Beastx Script Updater</h1><p>Hay una nueva version de: <strong><a href="');
        html.push(this.url);
        html.push('" target="_blank" title="Ir a la pagina del script">');
        html.push(this.meta.name);
        html.push('</a> </strong> disponible para instalar.</p><p>');
        
        if (this.currentVersion) {
            html.push('Tenes la version <strong>');
            html.push(this.currentVersion)
            html.push('</strong> instalada. La ultima version disponible es <strong>');
            html.push(this.meta.version);
            html.push('</strong></p>');
        }
        
        if (this.meta.history) {
            html.push('<h2>Historial de cambios:</h2><div id="ScriptUpdaterHistory">');
            var history = new Array();
            var version, desc;
            for (var i = 0; i < this.meta.history.length; i++) {
                [, version, change] = this.meta.history[i].match(/(\S+)\s+(.*)$/);
                history[version] = typeof(history[version]) == 'undefined' ? new Array() : history[version];
                history[version].push(change);
            }
            for (var v in history) {
                html.push('<div style="margin-top:.75em;"><strong>v' + v + '</strong></div><ul>');
                for (var i = 0; i < history[v].length; i++) {
                    html.push('<li>' + history[v][i] + '</li>');
                }
                html.push('</ul>');
            }
            html.push('</div>');
        }
        
        html.push('<div id="ScriptUpdaterFooter">');
        html.push('<input type="button" id="ScriptUpdaterCloseButton" value="Close" style="background-image:url(');
        html.push(this.icons.close);
        html.push(')"/><input type="button" id="ScriptUpdaterBodyInstall');
        html.push(this.scriptName);
        html.push('" value="Install" style="background-image:url(');
        html.push(this.icons.install);
        html.push(')"/>Controlar si hay versiones nuevas:  \
            <select id="ScriptUpdaterInterval"> \
                <option value="3600000">Cada 1 hora &nbsp;</option>\
                <option value="21600000">Cada 6 horas &nbsp;</option>\
                <option value="86400000">Cada 1 dia &nbsp;</option>\
                <option value="604800000">Cada 1 semana &nbsp;</option>\
                <option value="0">Nunca &nbsp;</option>\
            </select> &nbsp; &nbsp; &nbsp; </div>');
        
        notice.innerHTML = html.join('');
        noticeWrapper.appendChild(notice);
        document.body.appendChild(noticeWrapper);
        
        $('ScriptUpdaterClose').addEventListener('click', DOM.createCaller(this, 'closeNotice'), true);
        $('ScriptUpdaterCloseButton').addEventListener('click', DOM.createCaller(this, 'closeNotice'), true);
        
        var me = this;
        $('ScriptUpdaterBodyInstall' + this.scriptName).addEventListener('click', function() {
            setTimeout(DOM.createCaller(this, 'closeNotice'), 500);
            document.location = me.url;
        }, true);
        
        // set current interval in selector
        var selector = $('ScriptUpdaterInterval');
        for (var i = 0; i < selector.options.length; i++) {
            if (selector.options[i].value.toString() == this.getInterval().toString()) {
                selector.options[i].selected = true;
            }
        }
        selector.addEventListener('change', function() {
            this.setInterval(this.value);
        }, true);
        
        noticeWrapper.style.height = document.documentElement.clientHeigh + 'px';
    }
}

ScriptUpdater.prototype.closeNotice = function() {
    document.body.removeChild($('ScriptUpdaterBodyWrapper'));
    document.body.removeChild($('ScriptUpdaterMask'));
}

ScriptUpdater.prototype.onKeyUp = function(event) {
    if (event.keyCode == 27) { this.closeNotice(); }
}

ScriptUpdater.prototype.alreadyOffered = function(version) {
    var offers = this.getOffers();
    if (offers.length == 0) {
        this.addOffer(version);
        return true;
    }
    for (var i = 0; i < offers.length; i++) {
        if(version.toString() == offers[i].toString()) { return true; }
    }
    return false;
}

ScriptUpdater.prototype.getOffers = function() {
    var offers = Beastx.getGMValue('VersionsOfferedFor_' + this.scriptName);
    return (typeof(offers) == 'undefined' || typeof(offers.length) == 'undefined' || typeof(offers.push) == 'undefined') ? new Array() : offers;
}

ScriptUpdater.prototype.addOffer = function(version) {
    var offers = this.getOffers();
    offers.push(version);
    Beastx.setGMValue('VersionsOfferedFor_' + this.scriptName, offers);
}

ScriptUpdater.prototype.getInterval = function() {
    var interval = Beastx.getGMValue('Interval_' + this.scriptName);
    return (typeof(interval) == 'undefined' || !interval.toString().match(/^\d+$/)) ? 86400000 : parseInt(interval.toString());
}

ScriptUpdater.prototype.setInterval = function(interval) {
    Beastx.setGMValue('Interval_' + this.scriptName, parseInt(interval));
}

ScriptUpdater.prototype.getLastCheck = function() {
}









/*
ScriptUpdater = {
    version:"0.1",
    //------------------------------------------- "public" methods --------------------------------------
    check:function() {    
            
    },
    forceCheck:function() {    
        ScriptUpdater.initVars(scriptName, currentVersion, callback, true, false);
        ScriptUpdater.checkRemoteScript();    
    },
    getLatestVersion:function() {    
        if(typeof(callback) != 'function')
            alert("ScriptUpdater error:\n\n scriptUpdater.getLatestVersion() requires a callback function as the third argument"); 
        ScriptUpdater.initVars(scriptName, callback, false, false);
        ScriptUpdater.checkRemoteScript();
    },
    forceNotice:function() {    
        ScriptUpdater.initVars(scriptName, currentVersion, callback, true, true);
        ScriptUpdater.checkRemoteScript();    
    },
    //------------------------------------------- "private" methods --------------------------------------
    $:function(id) {
        return document.getElementById(id);
    },
    initVars:function(scriptName, currentVersion, callbackFunction, useNotice, forceNotice) {
        ScriptUpdater.scriptName = scriptName;
        ScriptUpdater.currentVersion = typeof(currentVersion) != 'undefined' ? currentVersion.toString() : false;
        ScriptUpdater.callbackFunction = typeof(callbackFunction) == 'function' ? callbackFunction : false;
        ScriptUpdater.useNotice = useNotice;
        ScriptUpdater.forceNotice = forceNotice;
    },
    checkRemoteScript:function() {
        Beastx.log('Check: ' + ScriptUpdater.scriptName + '(Actual version: ' + ScriptUpdater.currentVersion + ')');
        if(ScriptUpdater.currentVersion && !ScriptUpdater.alreadyOffered(ScriptUpdater.currentVersion))
            ScriptUpdater.addOffer(ScriptUpdater.currentVersion);
        var d = new Date();
        ScriptUpdater.setVal('lastCheck_' + ScriptUpdater.scriptName, d.getTime());
        // check the userscripts.org code review page    
        if (!ScriptUpdater.isBaseScript) {
            var url = Beastx.Config.options.serverUrl + "/tools/userScripts/Beastx." + ScriptUpdater.scriptName + '.user.js';
        } else {
            var url = Beastx.Config.options.serverUrl + "/tools/userScripts/requires/" + ScriptUpdater.scriptName + '.js';
        }
        GM_xmlhttpRequest ({
            method: "GET",
            url: url,
            headers: {"User-agent": "Mozilla/5.0", "Accept": "text/html"},
            onload: function (response){
                ScriptUpdater.meta = ScriptUpdater.parseHeaders(response.responseText);
                Beastx.log(ScriptUpdater.meta);
                Beastx.log(ScriptUpdater.alreadyOffered(ScriptUpdater.meta.version));
                Beastx.log(ScriptUpdater.useNotice);
                if(ScriptUpdater.forceNotice || (!ScriptUpdater.alreadyOffered(ScriptUpdater.meta.version) && ScriptUpdater.useNotice)) {
                    if(!ScriptUpdater.alreadyOffered(ScriptUpdater.meta.version)) 
                        ScriptUpdater.addOffer(ScriptUpdater.meta.version);
                    ScriptUpdater.showNotice();
                }
            }    
        });
    },
    parseHeaders:function(metadataBlock) {
        // taken from http://wiki.greasespot.net/Metadata_block - thanks to sizzlemctwizzle for the suggestion
        var headers = {};
        var line, name, prefix, header, key, value;
        
        var lines = metadataBlock.split(/\n/).filter(/\/\/ @/);
        for each (line in lines) {
            [, name, value] = line.match(/\/\/ @(\S+)\s*(.*)/);
            
            switch(name) { case "licence": name = "license"; break;     }
            
            [key, prefix] = name.split(/:/).reverse();
            
            if(prefix) {
                if(!headers[prefix])
                    headers[prefix] = new Object;
                header = headers[prefix];
            } else
                header = headers;

            if(header[key] && !(header[key] instanceof Array))
                header[key] = new Array(header[key]);
            
            if(header[key] instanceof Array) 
                header[key].push(value);
            else
                header[key] = value;

        }    
        headers["licence"] = headers["license"];        
        return headers;
    },
    showNotice:function() {
        if(ScriptUpdater.meta.name && ScriptUpdater.meta.version) {    
            GM_addStyle(
                "#ScriptUpdaterMask { position:absolute; width:100%; top:0; left:0; height:100%; background-color:#000; opacity:.7; z-index:9000; } \
                #ScriptUpdaterBody * { border:none; font-size:12px; color:#333; font-weight:normal; margin:0; padding:0; background:none; text-decoration:none; font-family:Helvetica Neue,Arial,Helvetica,sans-serif; } \
                #ScriptUpdaterBody { width:500px; margin:auto; margin-top:125px; text-align:left; background:#f9f9f9; border:1px outset #333; padding:0; font-family:Arial; font-size:14px; -moz-border-radius:5px; cursor:default; z-index:9010; color:#333; padding-bottom:1em ; } \
                #ScriptUpdaterBody a { margin:0 .5em; text-decoration:underline; color:#000099; font-weight:bold; } \
                #ScriptUpdaterBody strong { font-weight:bold; } \
                #ScriptUpdaterBody h1 { font-size:13px; font-weight:bold; padding:.5em; border-bottom:1px solid #333; background-color:#999; margin-bottom:.75em; } \
                #ScriptUpdaterBody h2 { font-weight:bold; margin:.5em 1em; } \
                #ScriptUpdaterBody h1 a { font-size:13px; font-weight:bold; color:#fff; text-decoration:none; cursor:help; } \
                #ScriptUpdaterBody h1 a:hover { text-decoration:underline; } \
                #ScriptUpdaterBody table { width:auto; margin:0 1em; } \
                #ScriptUpdaterBody table tr th { padding-left:2em; text-align:right; padding-right:.5em; line-height:2em; } \
                #ScriptUpdaterBody table tr td { line-height:2em; font-weight:bold; } \
                #ScriptUpdaterBody li { list-style-type:circle; } \
                #ScriptUpdaterBody p { font-size:12px; font-weight:normal; margin:1em; } \
                #ScriptUpdaterHistory { margin:0 1em 1em 1em; max-height:150px; overflow-y:auto; border:1px inset #999; padding:0 1em 1em; width:448px; } \
                #ScriptUpdaterHistory ul { margin-left:2em; } \
                #ScriptUpdaterClose { float:right; cursor:pointer; height:14px; opacity:.5; } \
                #ScriptUpdaterClose:hover { opacity:.9; } \
                #ScriptUpdaterFooter { margin:.75em 1em; } \
                #ScriptUpdaterFooter input { border:1px outset #666; padding:3px 5px 5px 20px; background:no-repeat 4px center #eee; -moz-border-radius:3px; cursor:pointer; width:70px; float:right; margin-left:.5em; } \
                #ScriptUpdaterFooter input:hover { background-color:#f9f9f9; } \
                #ScriptUpdaterFooter select { border:1px inset #666; }"
            );
            
            var noticeBg = document.createElement('div');                            
            noticeBg.id = "ScriptUpdaterMask";
            document.body.appendChild(noticeBg);
        
            var noticeWrapper = document.createElement('div');
            noticeWrapper.setAttribute('style', 'position:absolute; width:100%; top:0; left:0; z-index:9010; max-width:auto; min-width:auto; max-height:auto; min-height:auto;');
            noticeWrapper.id = "ScriptUpdaterBodyWrapper";
                var html = new Array();
                var notice = document.createElement('div');
                notice.id = "ScriptUpdaterBody";
                html.push('<h1><img id="ScriptUpdaterClose" src="');
                html.push(ScriptUpdater.icons.close);
                html.push('" title="Close"/><img src="');
                html.push(ScriptUpdater.icons.uso);
                html.push('" align="absmiddle" style="margin-top:-2px;"/><a href="http://userscripts.org/scripts/review/57756" target="_blank" title="About the Userscripts.org Script Updater v');
                html.push(ScriptUpdater.meta.version);
                html.push('">Userscripts.org Updater</a></h1><p>There is a new version of <strong><a href="http://userscripts.org/scripts/show/');
                html.push(ScriptUpdater.scriptName);
                html.push('" target="_blank" title="Go to script page">');
                html.push(ScriptUpdater.meta.name);
                html.push('</a> </strong>is available for installation.</p><p>');
                if(ScriptUpdater.currentVersion) {
                    html.push('You currently have version <strong>');
                    html.push(ScriptUpdater.currentVersion)
                    html.push('</strong> installed. The latest version is <strong>');
                    html.push(ScriptUpdater.meta.version);
                    html.push('</strong></p>');
                }
                if(ScriptUpdater.meta.history) {
                    html.push('<h2>Version History:</h2><div id="ScriptUpdaterHistory">');
                    var history = new Array();
                    var version, desc;
                    for(var i = 0; i < ScriptUpdater.meta.history.length; i++) {
                        [, version, change] = ScriptUpdater.meta.history[i].match(/(\S+)\s+(.*)$/);
                        history[version] = typeof(history[version]) == 'undefined' ? new Array() : history[version];
                        history[version].push(change);
                    }                
                    for(var v in history) {
                        html.push('<div style="margin-top:.75em;"><strong>v' + v + '</strong></div><ul>');
                        for(var i = 0; i < history[v].length; i++)
                            html.push('<li>' + history[v][i] + '</li>');
                        html.push('</ul>');
                    }
                    html.push('</div>');    
                }
                html.push('<div id="ScriptUpdaterFooter">');
                html.push('<input type="button" id="ScriptUpdaterCloseButton" value="Close" style="background-image:url(');
                html.push(ScriptUpdater.icons.close);
                html.push(')"/><input type="button" id="ScriptUpdaterBodyInstall');
                html.push(ScriptUpdater.scriptName);
                html.push('" value="Install" style="background-image:url(');
                html.push(ScriptUpdater.icons.install);
                html.push(')"/>Check this script for updates \
                                <select id="ScriptUpdaterInterval"> \
                                    <option value="3600000">every hour &nbsp;</option>\
                                    <option value="21600000">every 6 hours &nbsp;</option>\
                                    <option value="86400000">every day &nbsp;</option>\
                                    <option value="604800000">every week &nbsp;</option>\
                                    <option value="0">never &nbsp;</option>\
                                </select> &nbsp; &nbsp; &nbsp; </div>');
                notice.innerHTML = html.join('');
            noticeWrapper.appendChild(notice);
            document.body.appendChild(noticeWrapper);
            ScriptUpdater.$('ScriptUpdaterClose').addEventListener('click', ScriptUpdater.closeNotice, true);
            ScriptUpdater.$('ScriptUpdaterCloseButton').addEventListener('click', ScriptUpdater.closeNotice, true);
            ScriptUpdater.$('ScriptUpdaterBodyInstall' + ScriptUpdater.scriptName).addEventListener('click', function() {
                setTimeout(ScriptUpdater.closeNotice, 500);                                                                                                
                document.location = 'http://userscripts.org/scripts/source/' + ScriptUpdater.scriptName + '.user.js';
            }, true);
            window.addEventListener('keyup', ScriptUpdater.onKeyUp, true);
            // set current interval in selector
            var selector = ScriptUpdater.$('ScriptUpdaterInterval');
            for(var i = 0; i < selector.options.length; i++) {
                if(selector.options[i].value.toString() == ScriptUpdater.getInterval().toString())
                    selector.options[i].selected = true;
            }
            selector.addEventListener('change', function() {
                ScriptUpdater.setInterval(this.value);
            }, true);
            noticeWrapper.style.height = document.documentElement.clientHeigh + 'px';
        }
    },

    

    getLastCheck:function() {
        var lastCheck = ScriptUpdater.getVal('lastCheck_' + ScriptUpdater.scriptName);
        return (typeof(lastCheck) == 'undefined' || !lastCheck.toString().match(/^\d+$/)) ? 0: parseInt(lastCheck.toString());
    },
    

};
*/