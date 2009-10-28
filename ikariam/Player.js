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
    this.postUrl = Beastx.Config.postUrl;
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

Beastx.PlayerObject.prototype.getId = function() {
    return this.id;
}

Beastx.PlayerObject.prototype.clone = function() {
    var newObject = New(Beastx.PlayerObject, [ this.id ]);
    newObject.setData(this.getData());
    return newObject;
}

Beastx.PlayerObject.prototype.setData = function(newData) {
    this.id = newData.id ? newData.id : 0;
    this.name = newData.name ? newData.name : null;
    this.allianceId = newData.allianceId ? newData.allianceId : 0;
    this.ranking = newData.ranking ? newData.ranking : 0;
    this.totalPoints = newData.totalPoints ? newData.totalPoints : 0;
    this.armyPoints = newData.armyPoints ? newData.armyPoints : 0;
    this.ofensivePoints = newData.ofensivePoints ? newData.ofensivePoints : 0;
    this.defensivePoints = newData.defensivePoints ? newData.defensivePoints : 0;
    this.roleTypeId = newData.roleTypeId ? newData.roleTypeId : 0;
    this.cities = newData.cities ? newData.cities : [];
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
        roleTypeId: this.roleTypeId,
        cities: this.cities
    }
}

Beastx.PlayerObject.prototype.sendInfoToServer = function(onLoadCallback) {
    DOM.post(
        this.postUrl,
        { className: this.serverClassName, action: 'save', params: this.getData() },
        function(response) {
            if (onLoadCallback) {
                onLoadCallback(response);
            }
        }
    );
}