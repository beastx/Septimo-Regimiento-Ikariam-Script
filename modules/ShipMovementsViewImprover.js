// ==UserScript==
// @name                  Ship Movements View Improver
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

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

Beastx.registerModule(
    'Ship Movements View Improver',
    'Este modulo muestra iconos con los tipos y cantidades de recursos y/o tropas transportadas cuando se esta en la vista militar.'
);