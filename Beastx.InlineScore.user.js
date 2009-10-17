// ==UserScript==
// @name                  Inline Score
// @namespace       Beastx
// @description        Inline Score
// @include               http://*.ikariam.com/*

// @require               http://ikariam.beastx/tools/userScripts/requires/Beastx.js
// @require               http://ikariam.beastx/tools/userScripts/requires/VAR.js
// @require               http://ikariam.beastx/tools/userScripts/requires/DOM.js
// @require               http://ikariam.beastx/tools/userScripts/requires/IkaTools.js
// @require               http://ikariam.beastx/tools/userScripts/requires/ScriptUpdater.js

// @version               0.01
// @author                Beastx
//
// @history                0.01 Initial release
// ==/UserScript==

ScriptUpdater.check('InlineScore', "0.01");

Beastx.InlineScore = function() {};

Beastx.InlineScore.prototype.init = function() {
    this.scriptName = 'Inline Score';
}