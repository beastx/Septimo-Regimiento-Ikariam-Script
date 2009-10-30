// ==UserScript==
// @name                  Beastx Building Ika Object
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.BuildingObject = function() {};

Beastx.BuildingObject.prototype.init = function(id) {
    this.scriptName = 'Building Object';
    this.postUrl = Beastx.Config.postUrl;
    this.serverClassName = 'Building';
    this.buildingNames = { 1: 'townHall', 2: 'academy', 3: 'port', 4: 'shipyard', 5: 'warehouse', 6: 'wall', 7: 'tavern', 8: 'museum', 9: 'palace', 10: 'palaceColony', 11: 'embassy', 12: 'safehouse', 13: 'barracks', 14: 'workshop', 15: 'carpentering', 16: 'forester', 17: 'stonemason', 18: 'winegrower', 19: 'alchemist', 20: 'architect', 21: 'vineyard', 22: 'fireworker', 23: 'optician', 24: 'glassblowing' };
    this.resourcesTypeNames = { 1: 'wine', 2: 'marble', 3: 'sulfur', 4: 'glass', 5: 'wood' };
    this.id = id ? id : 0; // 0 value is a new building objct
    this.cityId = 0;
    this.buildingTypeId = 0;
    this.typeName = null;
    this.level = 0;
    this.neededResourcesToUpdate = [];
}

Beastx.BuildingObject.prototype.getId = function() {
    return this.id;
}

Beastx.BuildingObject.prototype.getTypeName = function() {
    return this.buildingNames[this.buildingTypeId];
}

Beastx.BuildingObject.prototype.clone = function() {
    var newObject = New(Beastx.BuildingObject, [ this.id ]);
    newObject.setData(this.getData());
    return newObject;
}

Beastx.BuildingObject.prototype.setData = function(newData) {
    this.id = newData.id ? newData.id : this.id;
    this.cityId = newData.cityId ? newData.cityId : this.cityId;
    this.buildingTypeId = newData.buildingTypeId ? newData.buildingTypeId : this.buildingTypeId;
    this.level = newData.level ? newData.level : this.level;
    this.neededResourcesToUpdate = newData.neededResourcesToUpdate ? newData.neededResourcesToUpdate : this.neededResourcesToUpdate;
    this.typeName = this.buildingNames[this.buildingTypeId];
}

Beastx.BuildingObject.prototype.getData = function() {
    return {
        id: this.id,
        cityId: this.cityId,
        buildingTypeId: this.buildingTypeId,
        level: this.level,
        typeName: this.typeName
    }
}

Beastx.BuildingObject.prototype.getLevel = function() {
    return this.level;
}

Beastx.BuildingObject.prototype.getTypeId = function() {
    return this.buildingTypeId;
}

Beastx.BuildingObject.prototype.sendInfoToServer = function(onLoadCallback) {
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

Beastx.BuildingObject.prototype.getResourceTypeMissing = function(resourceType) {
    var city = IkaTools.getCityById(building.cityId);
    var missing = IkaTools.buildingGetResourceRequired(type, building) - IkaTools.cityGetResource(type, city);
    return missing > 0 ? missing : 0;
}

Beastx.BuildingObject.prototype.getResourceTypeRequired = function(resourceType) {
    return (typeof(building) == 'undefined'    || typeof(building.resources) == 'undefined' || typeof(building.resources[type]) == 'undefined') ? 0 : parseInt(building.resources[type]);
}

Beastx.BuildingObject.prototype.getResourceRequired = function() {
    var total = 0;
    var resourceNames = ["wood", "wine", "marble", "glass", "sulfur"];
    for (i in resourceNames) {
        total += IkaTools.buildingGetResourceRequired(resourceNames[i], building);    
    }
    return total;
}

Beastx.BuildingObject.prototype.toString = function() {
    return this.buildingNames[this.buildingTypeId];
}