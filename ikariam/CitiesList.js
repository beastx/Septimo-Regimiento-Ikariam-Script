// ==UserScript==
// @name                  Beastx CitiesList Ika Object
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.CitiesList = function() {};

Beastx.CitiesList.prototype.init = function() {
    this.scriptName = 'CitiesList';
    this.serverClassName = 'City';
    this.cities = [];
}


/***************************************************************
******* Main methods to load and save cities data *********
***************************************************************/

Beastx.CitiesList.prototype.loadCitiesData = function() {
    function cleanCitiesList(cities) {
        var returnCities = [];
        for (var i = 0; i < cities.length; ++i) {
            if (!DOM.hasClass(cities[i], 'deployedCities')) {
                returnCities.push(cities[i]);
            }
        }
        return returnCities;
    }
    var citiesElements = cleanCitiesList($$('#citySelect option.coords'));
    this.cities = VAR.filter(citiesElements, DOM.createCaller(this, 'getCityObjectFromElement'));
    this.resourceObjectsUpdater();
}

Beastx.CitiesList.prototype.saveCities = function() {
    var citiesData = [];
    for (var i = 0; i < this.cities.length; ++i) {
        IkaTools.setVal('cities_' + this.cities[i].getId(), this.cities[i].getData());
    }
}

Beastx.CitiesList.prototype.getCityObjectFromElement = function(cityElement) {
    var city = New(Beastx.CityObject, [ cityElement.value ]);
    city.setData({ name: cityElement.innerHTML.split(']')[1].trim() });
    city.setData({ resourceTypeId: this.getCityResourceTypeIdFromComboTitle(cityElement.title) });
    if (city.getId() == this.getCurrentCityId() && IkaTools.getView() == 'city') {
        var cityPlayerId = 0;
        var cityLevel = 0;
        var cityLevelElement = $$('li.citylevel')[0];
        if (cityLevelElement) {
            cityLevel = cityLevelElement.childNodes[1].nodeValue;
        }
        var tempPopulation = $$('#cityResources ul.resources li #value_inhabitants')[0].textContent;
        var tempPopulationParts = tempPopulation.split(' ');
        city.setData({
            islandId: IkaTools.getCurrentIslandId(),
            population: parseInt(tempPopulationParts[0].replace(',', '')),
            maxPopulation: parseInt(tempPopulationParts[1].replace(',', '').replace('(', '').replace(')', '')),
            freeWorkers: parseInt(tempPopulation.match(/^\d+/)),
            playerId: cityPlayerId,
            level: cityLevel,
            resources: this.getCurrentCityResourceObjects(),
            buildings: this.getCurrentCityBuildingsObjects()
        });
    } else {
        var tempCitiesData = IkaTools.getVal('cities_' + city.getId());
        if (tempCitiesData) {
            city.setData({
                islandId: tempCitiesData.islandId,
                population: tempCitiesData.population,
                maxPopulation: tempCitiesData.maxPopulation,
                freeWorkers: tempCitiesData.freeWorkers,
                playerId: tempCitiesData.playerId,
                level: tempCitiesData.level,
                production: tempCitiesData.production,
                resources: this.getResourcesObjectsFromSavedData(tempCitiesData.resources),
                buildings: this.getBuildingsObjectsFromSavedData(tempCitiesData.buildings)
            });
        }
    }
    return city;
}

Beastx.CitiesList.prototype.getCityResourceTypeIdFromComboTitle = function(title) {
    var tempTitle = title.substr(title.lastIndexOf(' ') + 1);
    var tempHashLangTitles = {
        'Vino': 'wine',
        'Mármol': 'marble',
        'Azufre': 'sulfur',
        'Cristal': 'glass'
    };
    for (var id in IkaTools.data.resourceNames) {
        var type = IkaTools.data.resourceNames[id];
        if (type == tempHashLangTitles[tempTitle]) {
            return id;
        }
    }
    return 0;
}


/***************************************************************
********* Methods to load and parse saved Data ***********
***************************************************************/

Beastx.CitiesList.prototype.getBuildingObject = function(buildingElement) {
    var building = New(Beastx.BuildingObject);
    building.setData({
        cityId: this.getCurrentCityId(),
        neededResourcesToUpdate: IkariamTools.BUILDINGSRESOURCES[buildingElement.className],
        level: buildingElement.childNodes[3].title.substr(buildingElement.childNodes[3].title.lastIndexOf(' ') + 1),
        buildingTypeId: IkaTools.getBuildingTypeIdFromBuildingName(buildingElement.className)
    });
    return building;
}


Beastx.CitiesList.prototype.getResourcesObjectsFromSavedData = function(savedData) {
    var cityResources = [];
    for (var i = 0; i < savedData.length; ++i) {
        resource = New(Beastx.ResourceObject, [ savedData[i].typeId ]);
        cityResources.push(resource);
        resource.setData({
            ammount: savedData[i].ammount,
            maxAmmount: savedData[i].maxAmmount,
            islandId: savedData[i].islandId
        });
    }
    return cityResources;
}

Beastx.CitiesList.prototype.getBuildingsObjectsFromSavedData = function(savedData) {
    var cityBuildings = [];
    for (var i = 0; i < savedData.length; ++i) {
        var building = New(Beastx.BuildingObject);
        building.setData({
            cityId: savedData[i].cityId,
            neededResourcesToUpdate: IkariamTools.BUILDINGSRESOURCES[savedData[i].typeName],
            level: savedData[i].level,
            buildingTypeId: savedData[i].buildingTypeId
        });
        cityBuildings.push(building);
    }
    return cityBuildings;
}


/***************************************************************
*************** Get Current city Detail Data ******************
***************************************************************/

Beastx.CitiesList.prototype.getCurrentCityBuildingsObjects = function() {
    function cleanBuildingList(buildings) {
        var returnBuildings = [];
        for (var i = 0; i < buildings.length; ++i) {
            if (VAR.startsWith(buildings[i].id, 'position') && !DOM.hasClass(buildings[i], 'buildingGround')) {
                returnBuildings.push(buildings[i]);
            }
        }
        return returnBuildings;
    }
    var cityBuildings = [];
    var cityBuildingsElements = cleanBuildingList($$('ul#locations li'));
    return VAR.filter(cityBuildingsElements, DOM.createCaller(this, 'getBuildingObject'));
}

Beastx.CitiesList.prototype.getCurrentCityResourceObjects = function() {
    var cityResources = [];
    for (var id in IkaTools.data.resourceNames) {
        var type = IkaTools.data.resourceNames[id];
        resource = New(Beastx.ResourceObject, [ id ]);
        cityResources.push(resource);
        resource.setData({
            ammount: parseInt($$('li.' + type)[0].childNodes[2].childNodes[0].nodeValue.replace(',', '')),
            maxAmmount: parseInt($$('li.' + type)[0].childNodes[4].childNodes[1].nodeValue.replace(',', '')),
            islandId: IkaTools.getCurrentIslandId()
        });
    }
    return cityResources;
}

Beastx.CitiesList.prototype.resourceObjectsUpdater = function() {
    var cityResources = this.getCurrentCity().getResources();
    for (var id in cityResources) {
        var type = cityResources[id].getResourceTypeName();
        var resource = cityResources[id];
        resource.setData({
            ammount: parseInt($$('#cityResources li.' + type)[0].childNodes[2].childNodes[0].nodeValue.replace(',', ''))
        });
    }
    setTimeout(DOM.createCaller(this, 'resourceObjectsUpdater'), 5000);
}


/***************************************************************
************ Several Getters for external use ****************
***************************************************************/

Beastx.CitiesList.prototype.getCityById = function(cityId) {
    for (var i = 0; i < this.cities.length; ++i) {
        if (this.cities[i].id == cityId) {
            return this.cities[i];
        }
    }
    return null;
}

Beastx.CitiesList.prototype.getCityByName = function(cityName) {
    for (var i = 0; i < this.data.cities.length; ++ i) {
        if (this.data.cities[i].getName() == cityName) {
            return this.data.cities[i];
        }
    }
    return null;
}

Beastx.CitiesList.prototype.getAllCities = function() {
    return this.cities;
}

Beastx.CitiesList.prototype.getCurrentCityId = function() {
    if (!this.currentCityId) {
        this.currentCityId = $('citySelect').value;
    }
    return this.currentCityId;
}

Beastx.CitiesList.prototype.getCurrentCity = function() {
    return this.getCityById(this.getCurrentCityId());
}


/***************************************************************
*************** Tinkerman Specific Methods *****************
***************************************************************/

Beastx.CitiesList.prototype.toString = function() {
    return 'CitiesList';
}