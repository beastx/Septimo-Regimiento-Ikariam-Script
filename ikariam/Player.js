// ==UserScript==
// @name                  Beastx Player Ika Object
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.PlayerObject = function() {};

Beastx.PlayerObject.prototype.init = function(id) {
    this.scriptName = 'Player Object';
    this.serverClassName = 'Player';
    
    this.id = id ? id : 0; // 0 value is a new player objct
    this.name = null;
    this.allianceId = 0;
    this.ranking = 0;
    this.totalPoints = 0;
    this.armyPoints = 0;
    this.ofensivePoints = 0;
    this.defensivePoints = 0;
    this.roleTypeId = 0;
    this.cities = [];
}


/***************************************************************
****** Main methods to set and get data and clone ********
***************************************************************/

Beastx.PlayerObject.prototype.clone = function() {
    var newObject = New(Beastx.PlayerObject, [ this.id ]);
    newObject.setData(this.getData());
    return newObject;
}

Beastx.PlayerObject.prototype.setData = function(newData) {
    this.id = newData.id ? newData.id : this.id;
    this.name = newData.name ? newData.name : this.name;
    this.allianceId = newData.allianceId ? newData.allianceId : this.allianceId;
    this.ranking = newData.ranking ? newData.ranking : this.ranking;
    this.totalPoints = newData.totalPoints ? newData.totalPoints : this.totalPoints;
    this.armyPoints = newData.armyPoints ? newData.armyPoints : this.armyPoints;
    this.ofensivePoints = newData.ofensivePoints ? newData.ofensivePoints : this.ofensivePoints;
    this.defensivePoints = newData.defensivePoints ? newData.defensivePoints : this.defensivePoints;
    this.roleTypeId = newData.roleTypeId ? newData.roleTypeId : this.roleTypeId;
    this.cities = newData.cities ? newData.cities : this.cities;
}

Beastx.PlayerObject.prototype.getData = function() {
    return {
        id: this.id,
        name: this.name,
        allianceId: this.allianceId,
        ranking: this.ranking,
        totalPoints: this.totalPoints,
        armyPoints: this.armyPoints,
        ofensivePoints: this.ofensivePoints,
        defensivePoints: this.defensivePoints,
        roleTypeId: this.roleTypeId
    }
}

/***************************************************************
******* Main methods to load and save player data ********
***************************************************************/

Beastx.PlayerObject.prototype.loadData = function() {
    var tempDataPlayer = IkaTools.getVal('player');
    if (tempDataPlayer) {
        this.setData(tempDataPlayer);
    }
}

Beastx.PlayerObject.prototype.saveData = function() {
    IkaTools.setVal('player', this.getData());
}


/***************************************************************
************ Several Getters for external use ****************
***************************************************************/

Beastx.PlayerObject.prototype.getId = function() {
    return this.id;
}


/***************************************************************
*************** Tinkerman Specific Methods *****************
***************************************************************/

Beastx.PlayerObject.prototype.toString = function() {
    return this.name ? this.name : 'PlayerObject';
}