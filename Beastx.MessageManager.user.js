// ==UserScript==
// @name                  Message Manager
// @namespace       Beastx
// @description        Message Manager
// @include               http://*.ikariam.com/*

// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/Beastx.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/VAR.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/DOM.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/IkaTools.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/ScriptUpdater.js

// @version               0.01
// @author                Beastx
//
// @history                0.01 Initial release
// ==/UserScript==

ScriptUpdater.check('MessageManager', "0.01");

Beastx.MessageManager = function() {};

Beastx.MessageManager.prototype.init = function() {
    this.scriptName = 'Message Manager';
}