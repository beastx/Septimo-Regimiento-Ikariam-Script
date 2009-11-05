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
    this.serverClassName = 'City';
    
    this.id = id ? id : 0; // 0 value is a new city objct
    this.islandId = 0;
    this.resourceTypeId = 0;
    this.population = 0;
    this.maxPopulation = 0;
    this.freeWorkers = 0;
    this.name = null;
    this.playerId = 0;
    this.level = 0;
    this.wineConsumption = 0;
    this.resources = [];
    this.buildings = [];
    this.production = {};
}

/***************************************************************
****** Main methods to set and get data and clone ********
***************************************************************/

Beastx.CityObject.prototype.clone = function() {
    var newObject = New(Beastx.CityObject, [ this.id ]);
    newObject.setData(this.getData());
    return newObject;
}

Beastx.CityObject.prototype.setData = function(newData) {
    this.id = newData.id ? newData.id : this.id;
    this.islandId = newData.islandId ? newData.islandId : this.islandId;
    this.resourceTypeId = newData.resourceTypeId ? newData.resourceTypeId : this.resourceTypeId;
    this.population = newData.population ? newData.population : this.population;
    this.maxPopulation = newData.maxPopulation ? newData.maxPopulation : this.maxPopulation;
    this.freeWorkers = newData.freeWorkers ? newData.freeWorkers : this.freeWorkers;
    this.name = newData.name ? newData.name : this.name;
    this.playerId = newData.playerId ? newData.playerId : this.playerId;
    this.level = newData.level ? newData.level : this.level;
    this.resources = newData.resources ? newData.resources : this.resources;
    this.buildings = newData.buildings ? newData.buildings : this.buildings;
    this.production = newData.production ? newData.production : this.production;
    this.wineConsumption = newData.wineConsumption ? newData.wineConsumption : this.wineConsumption;
}

Beastx.CityObject.prototype.getData = function() {
    return {
        id: this.id,
        islandId: this.islandId,
        resourceTypeId: this.resourceTypeId,
        population: this.population,
        maxPopulation: this.maxPopulation,
        freeWorkers: this.freeWorkers,
        name: this.name,
        playerId: this.playerId,
        level: this.level,
        resources: VAR.filter(this.resources, DOM.createCaller(this, 'getChildData')),
        buildings: VAR.filter(this.buildings, DOM.createCaller(this, 'getChildData')),
        production: this.production,
        wineConsumption: this.wineConsumption
    }
}

Beastx.CityObject.prototype.getChildData = function(child) {
    return child.getData();
}


/***************************************************************
**** Methods for calculate if an building can upgrade ******
***************************************************************/

Beastx.CityObject.prototype.getResourceReductionPercent = function(resourceType) {
    var resourceReductionBuildingTypeIdRelation = { 'wine': 21, 'marble': 20,  'sulfur': 22,  'glass': 23,  'wood': 15 };
    var buildingForReduction = this.getBuildingByTypeId(resourceReductionBuildingTypeIdRelation[resourceType]);
    if (buildingForReduction) {
        var  resourceReductionBuildingLevel = buildingForReduction.getLevel();
        Beastx.todo('el 86% deberia ser calculado en base a las investigaciones', this);
        return 1 - ((86 * (1 - parseInt(resourceReductionBuildingLevel) / 100)) / 100);
    } else {
        return  1 - (86 / 100);
    }
}

Beastx.CityObject.prototype.buildingCanUpgrade = function(typeId) {
    var resourcesMissing = this.getResourcesMissingByBuildingTypeId(typeId);
    for (var type in resourcesMissing) {
        if (resourcesMissing[type] > 0) {
            return false;
        }
    }
    return true;
}



/***************************************************************
************ Several Getters for external use ****************
***************************************************************/

Beastx.CityObject.prototype.getAllAvailableBuildingsForUpgrade = function() {
    var buildingsCanUpgrade = [];
    for (var i = 0; i < this.buildings.length; ++i) {
         if (this.buildingCanUpgrade(this.buildings[i].getTypeId())) {
            buildingsCanUpgrade.push(this.buildings[i]);
         }
    }
    return buildingsCanUpgrade;
}

Beastx.CityObject.prototype.getResourcesMissingForAllBuildings = function() {
    var resourcesMissing = {};
    for (var i = 0; i < this.buildings.length; ++i) {
        resourcesMissing[this.buildings[i].getTypeName()] = this.getResourcesMissingByBuildingTypeId(this.buildings[i].getTypeId());
    }
    return resourcesMissing;
}

Beastx.CityObject.prototype.getAvailableResourcesByTypeName = function(type) {
    return this.getResourceByTypeName(type).getAmmount();
}

Beastx.CityObject.prototype.getAllAvailableResources = function() {
    var availableResources = {};
    for (var i = 0; i < this.resources.length; ++i) {
        availableResources[this.resources[i].getResourceTypeName()] = this.getAvailableResourcesByTypeName(this.resources[i].getResourceTypeName());
    }
    return availableResources;
}

Beastx.CityObject.prototype.getName = function() {
    return this.name;
}

Beastx.CityObject.prototype.getBuildingByTypeId = function(typeId) {
    for (var i = 0; i < this.buildings.length; ++i) {
        if (this.buildings[i].getTypeId() == typeId) {
            return this.buildings[i];
        }
    }
}

Beastx.CityObject.prototype.getResourceByTypeId = function(typeId) {
    for (var i = 0; i < this.resources.length; ++i) {
        if (this.resources[i].getTypeId() == typeId) {
            return this.resources[i];
        }
    }
}

Beastx.CityObject.prototype.getResourceByTypeName = function(type) {
    for (var i = 0; i < this.resources.length; ++i) {
        if (this.resources[i].getResourceTypeName() == type) {
            return this.resources[i];
        }
    }
}

Beastx.CityObject.prototype.getResourcesMissingByBuildingTypeId = function(buildingTypeId) {
    var buildingObject =this.getBuildingByTypeId(buildingTypeId);
    var resourcesNeededForNextLevel = buildingObject.neededResourcesToUpdate[buildingObject.getLevel() - 1];
    var resourcesMissing = {};
    var reductionPercentByBuilding = {
        'wine': this.getResourceReductionPercent('wine'),
        'marble': this.getResourceReductionPercent('marble'), 
        'sulfur': this.getResourceReductionPercent('sulfur'), 
        'glass': this.getResourceReductionPercent('glass'), 
        'wood': this.getResourceReductionPercent('wood')
    };
    for (var type in resourcesNeededForNextLevel) {
        var resourceNeeded = parseInt(resourcesNeededForNextLevel[type]  * (1 - reductionPercentByBuilding[type]));
        var resourceMissing = resourceNeeded - this.getAvailableResourcesByTypeName(type);
        resourcesMissing[type] = resourceMissing;
    }
    return resourcesMissing;
}

Beastx.CityObject.prototype.getProduction = function() {
    return this.production;
}

Beastx.CityObject.prototype.getId = function() {
    return this.id;
}

Beastx.CityObject.prototype.getBuildings = function() {
    return this.buildings;
}

Beastx.CityObject.prototype.getResources = function() {
    return this.resources;
}


/***************************************************************
*************** Tinkerman Specific Methods *****************
***************************************************************/

Beastx.CityObject.prototype.toString = function() {
    return this.name;
}
