// ==UserScript==
// @name                  Scrip Updater
// @namespace       Beastx
// @description        Script Updater
// @include               http://*.ikariam.com/*
// @version               0.2
// @author                Beastx
//
// @history                0.2 El Script Updater ahora tambien updatea si ay archivos requeridos actualizados
// @history                0.1 Initial release
// ==/UserScript==


ScriptUpdater = function() {};

ScriptUpdater.prototype.init = function(scriptFileName, currentVersion, isBaseScript, callBack) {
    this.scriptFileName = scriptFileName;
    this.currentVersion = currentVersion;
    this.callBack = callBack;
    this.isBaseScript = isBaseScript ? isBaseScript : false;
    this.meta = {};
    this.icons = {
        close:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAIhSURBVDjLlZPrThNRFIWJicmJz6BWiYbIkYDEG0JbBiitDQgm0PuFXqSAtKXtpE2hNuoPTXwSnwtExd6w0pl2OtPlrphKLSXhx07OZM769qy19wwAGLhM1ddC184+d18QMzoq3lfsD3LZ7Y3XbE5DL6Atzuyilc5Ciyd7IHVfgNcDYTQ2tvDr5crn6uLSvX+Av2Lk36FFpSVENDe3OxDZu8apO5rROJDLo30+Nlvj5RnTlVNAKs1aCVFr7b4BPn6Cls21AWgEQlz2+Dl1h7IdA+i97A/geP65WhbmrnZZ0GIJpr6OqZqYAd5/gJpKox4Mg7pD2YoC2b0/54rJQuJZdm6Izcgma4TW1WZ0h+y8BfbyJMwBmSxkjw+VObNanp5h/adwGhaTXF4NWbLj9gEONyCmUZmd10pGgf1/vwcgOT3tUQE0DdicwIod2EmSbwsKE1P8QoDkcHPJ5YESjgBJkYQpIEZ2KEB51Y6y3ojvY+P8XEDN7uKS0w0ltA7QGCWHCxSWWpwyaCeLy0BkA7UXyyg8fIzDoWHeBaDN4tQdSvAVdU1Aok+nsNTipIEVnkywo/FHatVkBoIhnFisOBoZxcGtQd4B0GYJNZsDSiAEadUBCkstPtN3Avs2Msa+Dt9XfxoFSNYF/Bh9gP0bOqHLAm2WUF1YQskwrVFYPWkf3h1iXwbvqGfFPSGW9Eah8HSS9fuZDnS32f71m8KFY7xs/QZyu6TH2+2+FAAAAABJRU5ErkJggg%3D%3D"
    };
    var d = new Date();
    this.url = Beastx.Config.options.serverUrl + "/tools/userScripts/" + d.getTime() + '/' + this.scriptFileName;
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
        Beastx.log('Check: ' + this.scriptFileName + '(Actual version: ' + this.currentVersion + ')');
    }
    if (this.currentVersion) {
        if (!this.alreadyOffered(this.scriptFileName, this.currentVersion)) {
            this.addOffer(this.scriptFileName, this.currentVersion);
        }
        this.addLastCheckedDate();
    }
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
    if (this.callBack) {
        this.callBack(this.scriptFileName, this.meta);
    } else {
        if (this.isBaseScript) {
            this.checkRequires();
        }
    }
}

ScriptUpdater.prototype.checkRequires = function() {
    if (this.meta.require) {
        this.requireFilesCount = this.meta.require.length;
        this.requireFilesCountAlreadyChecked = 0;
        this.requiredFileAlreadyDispatchUpdateNotice = false;
        this.requireFilesScriptUpdaters = [];
        for (var i = 0; i < this.requireFilesCount; ++i) {
            var requireFileName = this.meta.require[i].match(new RegExp('http://[^/]*/tools/userScripts/(.*)'))[1];
            this.requireFilesScriptUpdaters[i] = New(ScriptUpdater, [requireFileName, null, false, DOM.createCaller(this, 'onRequireFileCheckRemoteScriptLoad')]);
            this.requireFilesScriptUpdaters[i].check();
        }
    }
}

ScriptUpdater.prototype.onRequireFileCheckRemoteScriptLoad = function(fileName, meta) {
    if (!this.alreadyOffered(fileName, meta.version)) {
        this.requiredFileAlreadyDispatchUpdateNotice = true;
        this.showRequireNotice(fileName, meta);
        if (!this.alreadyOffered(fileName, meta.version)) {
            this.addOffer(fileName, meta.version);
        }
    }
    ++this.requireFilesCountAlreadyChecked;
    if (this.requireFilesCount == this.requireFilesCountAlreadyChecked) {
        if (!this.requiredFileAlreadyDispatchUpdateNotice || this.forced) {
            this.onAllFilesChecked();
        }
    }
}

ScriptUpdater.prototype.getLastOfferedVersionForRequiredFile = function(requireFileName) {
    var offers = this.getOffers(requireFileName);
    return (typeof(offers) == 'undefined' || typeof(offers.length) == 'undefined' || typeof(offers.push) == 'undefined') ? new '0.0' : offers[offers.length - 1];
}

ScriptUpdater.prototype.onAllFilesChecked = function() {
    if (!this.alreadyOffered(this.scriptFileName, this.meta.version) || this.forced) {
        if (!this.alreadyOffered(this.scriptFileName, this.meta.version)) {
            this.addOffer(this.scriptFileName, this.meta.version);
        }
        this.showNotice();
    }
}

ScriptUpdater.prototype.addLastCheckedDate = function() {
    var d = new Date();
    Beastx.setGMValue('LastCheckDate_' + this.scriptFileName, d.getTime());
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

ScriptUpdater.prototype.addStyles = function() {
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
        #ScriptUpdaterHistory { margin:0 1em 1em 1em; max-height:150px; overflow-y:auto; border:1px inset #999; padding:0.5em; width:448px; } \
        #ScriptUpdaterHistory ul { margin-left:2em; } \
        #ScriptUpdaterClose { float:right; cursor:pointer; height:14px; opacity:.5; } \
        #ScriptUpdaterClose:hover { opacity:.9; } \
        #ScriptUpdaterFooter { margin:.75em 1em; } \
        #ScriptUpdaterFooter input { border:1px outset #666; padding:3px 5px 3px 5px; background:no-repeat 4px center #eee; -moz-border-radius:3px; cursor:pointer; float:right; margin-left:.5em; width: 60px; text-align: center; } \
        #ScriptUpdaterFooter input:hover { background-color:#f9f9f9; } \
        #ScriptUpdaterFooter select { border:1px inset #666; }\
        #ScriptUpdaterBodyWrapper { position:absolute; width:100%; top:0; left:0; z-index:9010; max-width:auto; min-width:auto; max-height:auto; min-height:auto; } "
    );
}

ScriptUpdater.prototype.addBackground = function() {
    document.body.appendChild(
        this.noticeBg = DOM.createElement('div', { id: 'ScriptUpdaterMask' })
    );
}

ScriptUpdater.prototype.getHeaderNotice = function() {
    return DOM.createElement('h1',null, [
        DOM.createElement('img', {
            id: 'ScriptUpdaterClose',
            src: this.icons.close,
            title: 'Cerrar',
            onclick: DOM.createCaller(this, 'closeNotice')
        }),
        'Beastx Script Updater'
    ]);
}

ScriptUpdater.prototype.getIntroTextNotice = function() {
    return DOM.createElement('p', null, [
        'Hay una nueva version de:',
        DOM.createElement('strong', null, [
            DOM.createElement('a', { href: this.url, target: '_blank', title: 'Ir a la pagina del script'}, [
                this.meta.name
            ])
        ]),
        'disponible para instalar.'
    ]);
}

ScriptUpdater.prototype.getIntroTextForRequiredFileNotice = function(scriptName, url) {
    return DOM.createElement('p', null, [
        'Hay una nueva version de:',
        DOM.createElement('strong', null, [
            DOM.createElement('a', { href: url, target: '_blank', title: 'Ir a la pagina del script'}, [
                this.meta.name,
                ' -> ',
                scriptName
            ])
        ]),
        'disponible para instalar.'
    ]);
}

ScriptUpdater.prototype.getCurrentVersionNotice = function(actualVersion, newVersion) {
    return DOM.createElement('p', null, [
        'Tenes la version ',
        DOM.createElement('strong', null, [ actualVersion ]),
        ' instalada. La ultima version disponible es ',
        DOM.createElement('strong', null, [ newVersion ])
    ]);
}

ScriptUpdater.prototype.getFooterNotice = function() {
    return DOM.createElement('div', { id: 'ScriptUpdaterFooter' }, [
        DOM.createElement('input', {
            value: 'Cerrar',
            onclick: DOM.createCaller(this, 'closeNotice')
        }),
        DOM.createElement('input', {
            value: 'Instalar',
            onclick: DOM.createCaller(this, 'onInstallClick')
        }),
        'Controlar si hay versiones nuevas:',
        this.intervalInput = DOM.createElement('select',
            {
                id: 'ScriptUpdaterInterval',
                onchange: DOM.createCaller(this, 'setInterval')
            },
            [
                DOM.createElement('option', { value: 3600000 }, [ 'Cada 1 hora' ]),
                DOM.createElement('option', { value: 21600000 }, [ 'Cada 6 horas' ]),
                DOM.createElement('option', { value: 86400000 }, [ 'Cada 1 dia' ]),
                DOM.createElement('option', { value: 604800000 }, [ 'Cada 1 semana' ]),
                DOM.createElement('option', { value: 0 }, [ 'Nunca' ])
            ]
        )
    ]);
}

ScriptUpdater.prototype.showRequireNotice = function(fileName, meta) {
    this.createAndAppendNotice(
        this.notice = DOM.createElement('div',{ id: 'ScriptUpdaterBody' }, [
            this.getHeaderNotice(),
            this.getIntroTextForRequiredFileNotice(meta.name, this.url),
            this.currentVersion ? this.getCurrentVersionNotice(this.getLastOfferedVersionForRequiredFile(fileName), meta.version) : null,
            this.getHistoryForNotice(meta),
            this.getFooterNotice()
        ])
    );
}

ScriptUpdater.prototype.showNotice = function() {
    this.createAndAppendNotice(
        this.notice = DOM.createElement('div',{ id: 'ScriptUpdaterBody' }, [
            this.getHeaderNotice(),
            this.getIntroTextNotice(),
            this.currentVersion ? this.getCurrentVersionNotice(this.currentVersion, this.meta.version) : null,
            this.getHistoryForNotice(),
            this.getFooterNotice()
        ])
    );
}

ScriptUpdater.prototype.createAndAppendNotice = function(noticeElement) {
    this.addStyles();
    this.addBackground();
    this.noticeWrapper = DOM.createElement('div', { id: 'ScriptUpdaterBodyWrapper', style: { height: document.documentElement.clientHeigh + 'px' }}, [ noticeElement ]);
    this.intervalInput.value = this.getInterval();
    document.body.appendChild(this.noticeWrapper);
}

ScriptUpdater.prototype.onInstallClick = function() {
    setTimeout(DOM.createCaller(this, 'closeNotice'), 500);
    document.location = this.url;
}

ScriptUpdater.prototype.getHistoryForNotice = function(meta) {
    if (!meta) {
        var meta = this.meta;
    }
    if (meta.history) {
        var historyElements = [];
        var history = {};
        var version, desc;
        for (var i = 0; i < meta.history.length; i++) {
            [, version, change] = meta.history[i].match(/(\S+)\s+(.*)$/);
            history[version] = typeof(history[version]) == 'undefined' ? new Array() : history[version];
            history[version].push(change);
        }
        
        for (var v in history) {
            var historyElement = [];
            for (var i = 0; i < history[v].length; i++) {
                historyElement.push(DOM.createElement('li', null, [ history[v][i] ]));
            }
            historyElements.push(
                historyElement = DOM.createElement('div', { style: { marginTop: '75em;' }}, [
                    DOM.createElement('strong', null, [ 'v', v ]),
                    DOM.createElement('ul', null, historyElement)
                ])
            );
        }
        
        return DOM.createElement('div', null, [
            DOM.createElement('h2', null, [ 'Historial de cambios:' ]),
            DOM.createElement('div', { id: 'ScriptUpdaterHistory' }, historyElements )
        ]);
        
        html.push('</div>');
    } else {
        return null;
    }
}
    
ScriptUpdater.prototype.closeNotice = function() {
    document.body.removeChild($('ScriptUpdaterBodyWrapper'));
    document.body.removeChild($('ScriptUpdaterMask'));
}

ScriptUpdater.prototype.alreadyOffered = function(scriptFileName, version) {
    var offers = this.getOffers(scriptFileName);
    if (offers.length == 0) {
        this.addOffer(scriptFileName, version);
        return true;
    }
    for (var i = 0; i < offers.length; i++) {
        if(version.toString() == offers[i].toString()) { return true; }
    }
    return false;
}

ScriptUpdater.prototype.getOffers = function(scriptFileName) {
    var offers = Beastx.getGMValue('VersionsOfferedFor_' + scriptFileName);
    return (typeof(offers) == 'undefined' || typeof(offers.length) == 'undefined' || typeof(offers.push) == 'undefined') ? new Array() : offers;
}

ScriptUpdater.prototype.addOffer = function(scriptFileName, version) {
    var offers = this.getOffers(scriptFileName);
    offers.push(version);
    Beastx.setGMValue('VersionsOfferedFor_' + scriptFileName, offers);
}

ScriptUpdater.prototype.getInterval = function() {
    var interval = Beastx.getGMValue('Interval_' + this.scriptFileName);
    return (typeof(interval) == 'undefined' || !interval.toString().match(/^\d+$/)) ? 86400000 : parseInt(interval.toString());
}

ScriptUpdater.prototype.setInterval = function() {
    Beastx.setGMValue('Interval_' + this.scriptFileName, parseInt(this.intervalInput.value));
}

ScriptUpdater.prototype.getLastCheck = function() {
}