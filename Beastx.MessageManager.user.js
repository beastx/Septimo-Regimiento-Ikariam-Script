// ==UserScript==
// @name                  Message Manager
// @namespace       Beastx
// @description        Message Manager
// @include               http://*.ikariam.com/*

// @require               http://ikariam.beastx/tools/userScripts/requires/Beastx.js
// @require               http://ikariam.beastx/tools/userScripts/requires/VAR.js
// @require               http://ikariam.beastx/tools/userScripts/requires/DOM.js
// @require               http://ikariam.beastx/tools/userScripts/requires/IkaTools.js
// @require               http://ikariam.beastx/tools/userScripts/requires/ScriptUpdater.js

// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.MessageManager = function() {};

Beastx.MessageManager.prototype.init = function() {
    this.scriptName = 'Message Manager';
}