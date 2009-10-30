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

Beastx.CityObject.prototype.getId = function() {
    return this.id;
}

Beastx.CityObject.prototype.getBuildings = function() {
    return this.buildings;
}

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

Beastx.CityObject.prototype.getProduction = function() {
    return this.production;
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

Beastx.CityObject.prototype.getResourceReductionPercent = function(resourceType) {
    var resourceReductionBuildingTypeIdRelation = {
        'wine': 21,
        'marble': 20, 
        'sulfur': 22, 
        'glass': 23, 
        'wood': 15
    };
    var buildingForReduction = this.getBuildingByTypeId(resourceReductionBuildingTypeIdRelation[resourceType]);
    if (buildingForReduction) {
        var  resourceReductionBuildingLevel = buildingForReduction.getLevel();
        Beastx.todo('el 86% deberia ser calculado en base a las investigaciones', this);
        return 1 - ((86 * (1 - parseInt(resourceReductionBuildingLevel) / 100)) / 100);
    } else {
        return  1 - (86 / 100);
    }
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
        if (this.resources[i].getTypeName() == type) {
            return this.resources[i];
        }
    }
}

Beastx.CityObject.prototype.toString = function() {
    return this.name;
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
        availableResources[this.resources[i].getTypeName()] = this.getAvailableResourcesByTypeName(this.resources[i].getTypeName());
    }
    return availableResources;
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

Beastx.CityObject.prototype.getAllAvailableBuildingsForUpgrade = function() {
    var buildingsCanUpgrade = [];
    for (var i = 0; i < this.buildings.length; ++i) {
         if (this.buildingCanUpgrade(this.buildings[i].getTypeId())) {
            buildingsCanUpgrade.push(this.buildings[i]);
         }
    }
    return buildingsCanUpgrade;
}


//~ cityGetBuildingByPosition:function(position, city) {
        //~ if(typeof(position) == 'object' && typeof(position.id) != 'undefined') {
            //~ var pos = city;
            //~ city = position;
            //~ position = pos;
        //~ } else {
            //~ city = typeof(city) != 'undefined' ? city : IkaTools.getCurrentCity();    
        //~ }
        //~ var buildings = city.buildings ? city.buildings : new Array();
        //~ for(var i = 0; i < buildings.length; i++) {
            //~ if(buildings[i].position.toString() == position.toString()) {
                //~ return buildings[i];
            //~ }
        //~ }
        //~ return false;
    //~ },
    //~ cityGetBuildingByType:function(type, city) {
        //~ if(typeof(type) == 'object' && typeof(type.id) != 'undefined') {
            //~ var tmp = city;
            //~ city = type;
            //~ type = tmp;
        //~ } else {
            //~ city = typeof(city) != 'undefined' ? city : IkaTools.getCurrentCity();    
        //~ }
        //~ var buildings = city.buildings ? city.buildings : new Array();
        //~ for(var i = 0; i < buildings.length; i++) {
            //~ if(buildings[i].type == type) {
                //~ return buildings[i];
            //~ } 
        //~ }
        //~ return false;
    //~ },
    //~ cityGetBuildBuilding:function(city) {
        //~ city = typeof(city) == 'object' ? city : IkaTools.getCurrentCity();    
        //~ return (IkaTools.cityGetBuildSecondsRemaining(city) > 0 && typeof(city.buildBuilding) != 'undefined' && typeof(city.buildBuilding) == 'object') ? city.buildBuilding : false;
    //~ },
    //~ cityGetBuildSecondsRemaining:function(city) {
        //~ city = typeof(city) == 'object' ? city : IkaTools.getCurrentCity();    
        //~ var buildEnd = typeof(city.buildEnd) != 'undefined' ? parseInt(city.buildEnd) : 0;
        //~ var d = new Date();
        //~ var timeLeft = buildEnd - d.getTime();
        //~ return timeLeft > 0 ? Math.floor(timeLeft / 1000) : false;
    //~ },
    //~ cityGetIncome:function(city) {
        //~ city = typeof(city) == 'object' ? city : IkaTools.getCurrentCity();
        //~ return typeof(city.income) == 'undefined' ? 0 : parseInt(city.income);
    //~ },
    //~ cityGetIslandId:function(city) {
        //~ city = typeof(city) == 'object' ? city : IkaTools.getCurrentCity();
        //~ return typeof(city.islandId) == 'undefined' ? 0 : parseInt(city.islandId);
    //~ },
    //~ cityGetLevel:function(city) {
        //~ city =     typeof(city) == 'object' ? city : IkaTools.getCurrentCity();
        //~ return typeof(city.level) == 'undefined' ? 0 : parseInt(city.level);
    //~ },
    //~ cityGetResource:function(type, city) {
        //~ city =     typeof(city) == 'object' ? city : IkaTools.getCurrentCity();
        //~ if(type == 'gold') {
            //~ var income = typeof(city.income) != 'undefined' ? parseInt(city.income) : 0;
            //~ var upkeep = typeof(city.upkeep) != 'undefined' ? parseInt(city.upkeep) : 0;
            //~ return income - upkeep;
        //~ } else {
            //~ var start = (typeof(city.resources) == 'undefined' || typeof(city.resources[type]) == 'undefined') ? 0 : parseInt(city.resources[type]);
            //~ var d = new Date();
            //~ var timeSince = (typeof(city.resourceChangeUpdated) == 'undefined' || typeof(city.resourceChangeUpdated[type]) == 'undefined') ? 0 : (d.getTime() - parseInt(city.resourceChangeUpdated[type])) / 1000;
            //~ timeSince = timeSince / 60;
            //~ var hoursSince = timeSince / 60;
            //~ var qty = Math.floor(start + (IkaTools.cityGetResourceChange(type, city) * hoursSince));
            //~ return qty < IkaTools.cityGetResourceMax(type, city) ? qty : IkaTools.cityGetResourceMax(type, city);
        //~ }
    //~ },
    //~ cityGetResourceChange:function(type, city) {
        //~ city =     typeof(city) == 'object' ? city : IkaTools.getCurrentCity();
        //~ var change = (typeof(city.resourceChanges) == 'undefined' || typeof(city.resourceChanges[type]) == 'undefined') ? 0 : parseInt(city.resourceChanges[type]);
        //~ return type == 'wine' ? change - IkaTools.cityGetWineConsumption(city) : change;
    //~ },
    //~ cityGetResourceMax:function(type, city) {
        //~ city =     typeof(city) == 'object' ? city : IkaTools.getCurrentCity();
        //~ return (typeof(city.resourceMaximums) == 'undefined' || typeof(city.resourceMaximums[type]) == 'undefined') ? 0 : parseInt(city.resourceMaximums[type]);
    //~ },
    //~ cityGetSawmillLevel:function(city) {
        //~ city =     typeof(city) == 'object' ? city : IkaTools.getCurrentCity();
        //~ return typeof(city.sawmillLevel) == 'undefined' ? 0 : parseInt(city.sawmillLevel);
    //~ },
    //~ cityGetTradegoodLevel:function(city) {
        //~ city =     typeof(city) == 'object' ? city : IkaTools.getCurrentCity();
        //~ return typeof(city.tradegoodLevel) == 'undefined' ? 0 : parseInt(city.tradegoodLevel);
    //~ },
    //~ cityGetTradegoodType:function(city) {
        //~ city =     typeof(city) == 'object' ? city : IkaTools.getCurrentCity();
        //~ return typeof(city.tradegoodType) == 'undefined' ? false : city.tradegoodType;
    //~ },
    //~ cityGetWineConsumption:function(city) {
        //~ city =     typeof(city) == 'object' ? city : IkaTools.getCurrentCity();
        //~ return typeof(city.wineConsumption) == 'undefined' ? 0 : city.wineConsumption;
    //~ },
    