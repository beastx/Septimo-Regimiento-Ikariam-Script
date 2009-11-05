// ==UserScript==
// @name                  Beastx Island Ika Object
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.IslandObject = function() {};

Beastx.IslandObject.prototype.init = function(id) {
    this.scriptName = 'Island Object';
    this.serverClassName = 'Island';
    
    this.id = id ? id : 0; // 0 value is a new island objct
    this.name = null;
    this.xPos = 0;
    this.yPos = 0;
    this.wonderId = 0;
    this.resourceTypeId = 0;
    this.woodLevel = 0;
    this.players = [];
}


/***************************************************************
****** Main methods to set and get data and clone ********
***************************************************************/

Beastx.IslandObject.prototype.clone = function() {
    var newObject = New(Beastx.IslandObject, [ this.id ]);
    newObject.setData(this.getData());
    return newObject;
}

Beastx.IslandObject.prototype.setData = function(newData) {
    this.id = newData.id ? newData.id : 0;
    this.name = newData.name ? newData.name : null;
    this.xPos = newData.xPos ? newData.xPos : 0;
    this.yPos = newData.yPos ? newData.yPos : 0;
    this.wonderId = newData.wonderId ? newData.wonderId : 0;
    this.resourceTypeId = newData.resourceTypeId ? newData.resourceTypeId : 0;
    this.woodLevel = newData.woodLevel ? newData.woodLevel : 0;
    this.players = newData.players ? newData.players : [];
}

Beastx.IslandObject.prototype.getData = function() {
    return {
        id: this.id,
        name: this.name,
        xPos: this.xPos,
        yPos: this.yPos,
        wonderId: this.wonderId,
        resourceTypeId: this.resourceTypeId,
        woodLevel: this.woodLevel,
        players: this.players
    }
}


/***************************************************************
************ Several Getters for external use ****************
***************************************************************/

Beastx.IslandObject.prototype.getId = function() {
    return this.id;
}


/***************************************************************
*************** Tinkerman Specific Methods *****************
***************************************************************/

Beastx.IslandObject.prototype.toString = function() {
    return this.name + '[' + this.coords[x] + ':' + this.coords[y] + ']';
}