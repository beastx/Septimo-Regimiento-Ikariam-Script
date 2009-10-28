// ==UserScript==
// @name                  Top Menu
// @namespace       Beastx
// @description        Top Menu
// @include               http://*.ikariam.com/*

// @require               http://ikariam.beastx/tools/userScripts/requires/Beastx.js
// @require               http://ikariam.beastx/tools/userScripts/requires/VAR.js
// @require               http://ikariam.beastx/tools/userScripts/requires/DOM.js
// @require               http://ikariam.beastx/tools/userScripts/requires/IkaTools.js
// @require               http://ikariam.beastx/tools/userScripts/requires/ScriptUpdater.js

// @version               0.2
// @author                Beastx
//
// @history                0.2 Fixed problem with css path
// @history                0.2 Added Website and blog links
// @history                0.1 Initial release
// ==/UserScript==

Beastx.TopMenu = function() {};

Beastx.TopMenu.prototype.init = function() {
    this.options = {
    }
    this.loadCss();
    this.create();
    this.append();
    setInterval(DOM.createCaller(this, 'updateTime'), 1000);
}

Beastx.TopMenu.prototype.create = function() {
    var menuOptions = '<ul class="beastxMainMenu">';
    menuOptions += '<li class="serverTime"><a><span id="servertime" class="textLabel">Beastx Ikariam Script | Alianza Septimo Regimiento</span></a></li>';
    menuOptions += '</ul>';

    var ikariamOldOptions = '<ul class="ikariamOldOptions">';
    ikariamOldOptions += '<li class="serverTime"><a target="_blank" href="http://7moreg.beastx.com.ar/"><span id="servertime" class="textLabel">Sitio Web Alianza</span></a></li>';
    ikariamOldOptions += '<li class="serverTime"><a target="_blank" href="http://7moreg.beastx.com.ar/blog/"><span id="servertime" class="textLabel">Blog</span></a></li>';
    ikariamOldOptions += '<li class="serverTime"><a href="http://s2.ar.ikariam.com/index.php?view=highscore&showMe=1"><span id="servertime" class="textLabel">Clasificacion</span></a></li>';
    ikariamOldOptions += '<li class="serverTime"><a href="http://board.ar.ikariam.com/" target="_blank"><span id="servertime" class="textLabel">Foro</span></a></li>';
    ikariamOldOptions += '<li class="serverTime"><a href="http://s2.ar.ikariam.com/index.php?view=options"><span id="servertime" class="textLabel">Opciones</span></a></li>';
    ikariamOldOptions += '<li class="serverTime"><a href="http://board.ar.ikariam.com/" target="_blank"><span id="servertime" class="textLabel"></span></a></li>';
    ikariamOldOptions += '<li class="serverTime"><a href="http://s2.ar.ikariam.com/index.php?action=loginAvatar&function=logout"><span id="servertime" class="textLabel">Salir</span></a></li>';

    ikariamOldOptions += '<li class="serverTime"><a><span id="spanServertime" class="textLabel">' + unsafeWindow['obj_ServerTime'].textContent + '</span></a></li>';
    ikariamOldOptions += '</ul>';

    this.element = document.createElement('div');
    this.element.id = 'beastxMenuContainer';
    this.element.innerHTML = menuOptions + ikariamOldOptions;
}

Beastx.TopMenu.prototype.append = function() {
    document.body.appendChild(this.element);
}

Beastx.TopMenu.prototype.updateTime = function() {
    $('spanServertime').innerHTML = unsafeWindow['obj_ServerTime'].textContent;
}

Beastx.TopMenu.prototype.loadCss = function() {
    var styleFile = document.createElement('link');
    styleFile.href = Beastx.Config.options.serverUrl + '/tools/userScripts/menu.css';
    styleFile.type = 'text/css';
    styleFile.media = 'screen';
    styleFile.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(styleFile);
}