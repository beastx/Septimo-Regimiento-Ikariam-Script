// ==UserScript==
// @name                  Alliance View Improver
// @namespace       Beastx
// @description        Alliance View Improver
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

ScriptUpdater.check('AllianceViewImprover', "0.01");

Beastx.AllianceViewImprover = function() {};

Beastx.AllianceViewImprover.prototype.init = function() {
    this.scriptName = 'Alliance View Improver';
}