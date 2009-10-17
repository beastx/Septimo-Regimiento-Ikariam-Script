// ==UserScript==
// @name                  Ship Movements View Improver
// @namespace       Beastx
// @description        Ship Movements View Improver
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

ScriptUpdater.check('ShipMovementsViewImprover', "0.01");

Beastx.ShipMovementsViewImprover = function() {};

Beastx.ShipMovementsViewImprover.prototype.init = function(currentView) {
    if (currentView != 'militaryAdvisorMilitaryMovements') {
        return;
    }
    this.scriptName = 'Ship Movements View Improver';
    Beastx.todo('hacer bien este script.. con objectos', this);
    GM_addStyle('.resourcesOnBoard { background: transparent !important; }\
            .resourcesOnBoard h5 { display:none; }\
            .resourcesOnBoard .unitBox { width:35px; float:left; margin-top:4px; text-align:center; }\
            .resourcesOnBoard .unitBox img { width:20px; }\
            .resourcesOnBoard .unitBox .iconSmall { padding-top:4px; }\
            .resourcesOnBoard .count { text-align:center; font-weight:normal; font-size:10px; }\
            .resourcesOnBoard .icon { text-align:center; }\
            tr.own td:first-child + td {  }');

    var elems = document.getElementById('mainview').getElementsByTagName('div');
    for(var i = 0; i < elems.length; i++) {
        if(elems[i].className == 'tooltip2' && elems[i].innerHTML.match(/count/)) {
            try {
                var src = elems[i].innerHTML;
                var target = elems[i].parentNode;
                target.wrappedJSObject.onmouseover = null;
                target.wrappedJSObject.onmouseout = null;
                target.style.cursor = "auto";
                target.innerHTML = "";
                target.innerHTML += '<table class="resourcesOnBoard" style="width:275px;">' + src + '</table>';	
            } catch(e) {}
        }
    }
}