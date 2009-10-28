// ==UserScript==
// @name                  Beastx City Ika Object
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.CityObject = function() {};

Beastx.CityObject.prototype.init = function(id) {
    this.scriptName = 'City Object';
    this.postUrl = Beastx.Config.postUrl;
    this.serverClassName = 'City';
    
    this.id = id ? id : 0; // 0 value is a new city objct
    this.name = null;
    this.playerId = 0;
    this.level = 0;
    this.resources = {};
    this.buildings = [];
}

Beastx.CityObject.prototype.getId = function() {
    return this.id;
}

Beastx.CityObject.prototype.clone = function() {
    var newObject = New(Beastx.CityObject, [ this.id ]);
    newObject.setData(this.getData());
    return newObject;
}

Beastx.CityObject.prototype.setData = function(newData) {
    this.id = newData.id ? newData.id : 0;
    this.name = newData.name ? newData.name : null;
    this.playerId = newData.playerId ? newData.playerId : 0;
    this.level = newData.level ? newData.level : 0;
    this.resources = newData.resources ? newData.resources : {};
    this.buildings = newData.buildings ? newData.buildings : [];
}

Beastx.CityObject.prototype.getData = function() {
    return {
        id: this.id,
        name: this.name,
        playerId: this.playerId,
        level: this.level,
        resources: this.resources,
        buildings: this.buildings
    }
}

Beastx.CityObject.prototype.sendInfoToServer = function(onLoadCallback) {
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