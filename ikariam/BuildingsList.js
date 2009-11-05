// ==UserScript==
// @name                  Beastx BuildingsList Ika Object
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.BuildingsList = function() {};

Beastx.BuildingsList.prototype.init = function(cities) {
    this.scriptName = 'BuildingsList';
    this.serverClassName = 'Building';
    this.cities = cities ? cities : [];
}


/***************************************************************
*************** Tinkerman Specific Methods *****************
***************************************************************/

Beastx.BuildingsList.prototype.toString = function() {
    return 'BuildingsList';
}