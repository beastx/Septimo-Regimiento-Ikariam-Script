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
    this.serverClassName = 'Building';
    this.buildingNames = IkaTools.data.buildingNames;
    this.resourcesTypeNames = IkaTools.data.resourceNames;
    this.id = id ? id : 0; // 0 value is a new building objct
    this.cityId = 0;
    this.buildingTypeId = 0;
    this.typeName = null;
    this.level = 0;
    this.neededResourcesToUpdate = [];
}


/***************************************************************
****** Main methods to set and get data and clone ********
***************************************************************/

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


/***************************************************************
************ Several Getters for external use ****************
***************************************************************/

Beastx.BuildingObject.prototype.getId = function() {
    return this.id;
}

Beastx.BuildingObject.prototype.getBuildingTypeName = function() {
    return this.buildingNames[this.buildingTypeId];
}

Beastx.BuildingObject.prototype.getLevel = function() {
    return this.level;
}

Beastx.BuildingObject.prototype.getTypeId = function() {
    return this.buildingTypeId;
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


/***************************************************************
*************** Tinkerman Specific Methods *****************
***************************************************************/

Beastx.BuildingObject.prototype.toString = function() {
    return this.buildingTypeId ? this.buildingNames[this.buildingTypeId] : this.scriptName;
}