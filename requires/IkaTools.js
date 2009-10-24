// ==UserScript==
// @name                  Ikariam Script Tools
// @namespace       Beastx
// @description        Tools to be included in your Ikariam Greasemonkey scripts.
// @include               http://*.ikariam.com/*
// @version               0.2
// @author                Beastx
//
// @history                0.2 Improve addInfoBox method (added beforeElement paramter)
// @history                0.1 Initial release
//
// ==/UserScript==

var IkaTools = {
    version:1,
    // declare default config options
    config:{
        debugMode:false,
        trackData:{
            construction:true,
            resources:true
        }
    },
    //---------------- "public" methods --------------------------------------
    init:function(params) {     
        // load config options
        if(typeof(params) == 'object') {
            for(var k in params) { 
                if(typeof(params[k]) == 'object') {
                    for(var d in params[k]) {
                        IkaTools.config[k][d] = params[k][d];
                    }
                } else 
                    IkaTools.config[k] = params[k]; 
            }
        }
        if(IkaTools.config.debugMode) {
            var d = new Date();
            IkaTools.startTime = d.getTime();
        }
        try {
            IkaTools.ikariam = unsafeWindow.IKARIAM;
            // check for new version and clear data if necessary
            if(!IkaTools.getVal('IkaTools.version').toString().match(/^\d+$/) || IkaTools.getVal('IkaTools.version') != IkaTools.version) {
                IkaTools.clearCities();    
                IkaTools.setVal('IkaTools.version', IkaTools.version);
            }
            // track data
            if(IkaTools.config.trackData) { IkaTools.updateData(); }
        } catch(e) {
            if(IkaTools.config.debugMode) { alert("Error in IkaTools.init():\n\n" + e); }    
        }
        if(IkaTools.config.debugMode) {
            var d = new Date();
            IkaTools.endTime = d.getTime();
            IkaTools.debug('IkaTools.init() ' + (IkaTools.endTime - IkaTools.startTime) + 'ms');
        }
    },
    addCommas:function(nStr){
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    },
    addInfoBox:function(title, contentDiv, beforeElement)  {
        var box = document.createElement('div');
        box.className = 'dynamic';
        box.innerHTML = '<h3 class="header">Beastx: ' + title + '</h3>';
        contentDiv.className = "content";
        box.appendChild(contentDiv);
        var footer = document.createElement('div');
        footer.className = "footer";
        box.appendChild(footer);
        document.getElementById('mainview').parentNode.insertBefore(box, beforeElement ? beforeElement : document.getElementById('mainview'));
    },
    addOptionBlock:function(title, content) {
        var optionBox = document.createElement('div');
        var contentRandId = 'contentId_' + parseInt(Math.random(999999)*10000000);
        optionBox.innerHTML = '<div class="contentBox01h"><h3 class="header"><span class="textLabel">' + title + '</span></h3><div class="content" id="' + contentRandId + '"></div><div class="footer"/></div></div>';
        var referenceDiv = $$('#mainview .contentBox01h')[1]
        referenceDiv.parentNode.insertBefore(optionBox, referenceDiv);
        var container = $(contentRandId);
        container.appendChild(content);
    },
    buildingGetResourceMissing:function(type, building) {
        var city = IkaTools.getCityById(building.cityId);
        var missing = IkaTools.buildingGetResourceRequired(type, building) - IkaTools.cityGetResource(type, city);
        return missing > 0 ? missing : 0;
    },
    buildingGetResourceMissingTotal:function(building) {
        var total = 0;
        var resourceNames = ["wood", "wine", "marble", "glass", "sulfur"];
        for(var i = 0; i < resourceNames.length; i++) {
            total += IkaTools.buildingGetResourceMissing(resourceNames[i], building);    
        }
        return total;
    },    
    buildingGetResourceRequired:function(type, building) {
        return (typeof(building) == 'undefined'    || typeof(building.resources) == 'undefined' || typeof(building.resources[type]) == 'undefined') ? 0 : parseInt(building.resources[type]);
    },
    buildingGetResourceRequiredTotal:function(building) {
        var total = 0;
        var resourceNames = ["wood", "wine", "marble", "glass", "sulfur"];
        for(i in resourceNames) {
            total += IkaTools.buildingGetResourceRequired(resourceNames[i], building);    
        }
        return total;
    },    
    cityGetBuildingByPosition:function(position, city) {
        if(typeof(position) == 'object' && typeof(position.id) != 'undefined') {
            var pos = city;
            city = position;
            position = pos;
        } else {
            city = typeof(city) != 'undefined' ? city : IkaTools.getCurrentCity();    
        }
        var buildings = city.buildings ? city.buildings : new Array();
        for(var i = 0; i < buildings.length; i++) {
            if(buildings[i].position.toString() == position.toString()) {
                return buildings[i];
            }
        }
        return false;
    },
    cityGetBuildingByType:function(type, city) {
        if(typeof(type) == 'object' && typeof(type.id) != 'undefined') {
            var tmp = city;
            city = type;
            type = tmp;
        } else {
            city = typeof(city) != 'undefined' ? city : IkaTools.getCurrentCity();    
        }
        var buildings = city.buildings ? city.buildings : new Array();
        for(var i = 0; i < buildings.length; i++) {
            if(buildings[i].type == type) {
                return buildings[i];
            } 
        }
        return false;
    },
    cityGetBuildBuilding:function(city) {
        city = typeof(city) == 'object' ? city : IkaTools.getCurrentCity();    
        return (IkaTools.cityGetBuildSecondsRemaining(city) > 0 && typeof(city.buildBuilding) != 'undefined' && typeof(city.buildBuilding) == 'object') ? city.buildBuilding : false;
    },
    cityGetBuildSecondsRemaining:function(city) {
        city = typeof(city) == 'object' ? city : IkaTools.getCurrentCity();    
        var buildEnd = typeof(city.buildEnd) != 'undefined' ? parseInt(city.buildEnd) : 0;
        var d = new Date();
        var timeLeft = buildEnd - d.getTime();
        return timeLeft > 0 ? Math.floor(timeLeft / 1000) : false;
    },
    cityGetIncome:function(city) {
        city = typeof(city) == 'object' ? city : IkaTools.getCurrentCity();
        return typeof(city.income) == 'undefined' ? 0 : parseInt(city.income);
    },
    cityGetIslandId:function(city) {
        city = typeof(city) == 'object' ? city : IkaTools.getCurrentCity();
        return typeof(city.islandId) == 'undefined' ? 0 : parseInt(city.islandId);
    },
    cityGetLevel:function(city) {
        city =     typeof(city) == 'object' ? city : IkaTools.getCurrentCity();
        return typeof(city.level) == 'undefined' ? 0 : parseInt(city.level);
    },
    cityGetResource:function(type, city) {
        city =     typeof(city) == 'object' ? city : IkaTools.getCurrentCity();
        if(type == 'gold') {
            var income = typeof(city.income) != 'undefined' ? parseInt(city.income) : 0;
            var upkeep = typeof(city.upkeep) != 'undefined' ? parseInt(city.upkeep) : 0;
            return income - upkeep;
        } else {
            var start = (typeof(city.resources) == 'undefined' || typeof(city.resources[type]) == 'undefined') ? 0 : parseInt(city.resources[type]);
            var d = new Date();
            var timeSince = (typeof(city.resourceChangeUpdated) == 'undefined' || typeof(city.resourceChangeUpdated[type]) == 'undefined') ? 0 : (d.getTime() - parseInt(city.resourceChangeUpdated[type])) / 1000;
            timeSince = timeSince / 60;
            var hoursSince = timeSince / 60;
            var qty = Math.floor(start + (IkaTools.cityGetResourceChange(type, city) * hoursSince));
            return qty < IkaTools.cityGetResourceMax(type, city) ? qty : IkaTools.cityGetResourceMax(type, city);
        }
    },
    cityGetResourceChange:function(type, city) {
        city =     typeof(city) == 'object' ? city : IkaTools.getCurrentCity();
        var change = (typeof(city.resourceChanges) == 'undefined' || typeof(city.resourceChanges[type]) == 'undefined') ? 0 : parseInt(city.resourceChanges[type]);
        return type == 'wine' ? change - IkaTools.cityGetWineConsumption(city) : change;
    },
    cityGetResourceMax:function(type, city) {
        city =     typeof(city) == 'object' ? city : IkaTools.getCurrentCity();
        return (typeof(city.resourceMaximums) == 'undefined' || typeof(city.resourceMaximums[type]) == 'undefined') ? 0 : parseInt(city.resourceMaximums[type]);
    },
    cityGetSawmillLevel:function(city) {
        city =     typeof(city) == 'object' ? city : IkaTools.getCurrentCity();
        return typeof(city.sawmillLevel) == 'undefined' ? 0 : parseInt(city.sawmillLevel);
    },
    cityGetTradegoodLevel:function(city) {
        city =     typeof(city) == 'object' ? city : IkaTools.getCurrentCity();
        return typeof(city.tradegoodLevel) == 'undefined' ? 0 : parseInt(city.tradegoodLevel);
    },
    cityGetTradegoodType:function(city) {
        city =     typeof(city) == 'object' ? city : IkaTools.getCurrentCity();
        return typeof(city.tradegoodType) == 'undefined' ? false : city.tradegoodType;
    },
    cityGetWineConsumption:function(city) {
        city =     typeof(city) == 'object' ? city : IkaTools.getCurrentCity();
        return typeof(city.wineConsumption) == 'undefined' ? 0 : city.wineConsumption;
    },
    formatMilliseconds:function(milliseconds) {
        return IkaTools.formatSeconds(Math.floor(milliseconds/1000));
    },
    formatSeconds:function(seconds) {
        var hours = seconds > 3600 ? Math.floor(seconds / 3600) : 0;
        var minutes = Math.floor((seconds % 3600)/ 60);
        minutes = (hours > 0 && minutes < 10) ? '0' + minutes.toString() : minutes;
        seconds = seconds % 60;
        seconds = seconds < 10 ? '0' + seconds.toString() : seconds;
        var text = minutes + ':' + seconds;
        text = hours > 0 ? hours + ':' + text : text;
        return text;
    },
    getCities:function() { 
        return IkaTools.cities; 
    },
    getCityById:function(id) {
        if(IkaTools.cities) {
            var cities = IkaTools.cities;    
        } else {
            var cities = typeof(IkaTools.getVal('cities')) == 'object' ? IkaTools.getVal('cities') : new Array();
        }
        for(var i = 0; i < cities.length; i++) {
            if(cities[i].id == id) {
                return cities[i];    
            }
        }
        return false;
    },
    getCurrentCity:function() {
        return IkaTools.getCityById(IkaTools.getCurrentCityId());
    },
    getCurrentCityId:function() {
        return $('citySelect').value;
    },
    getCurrentIslandId:function() {
        var link = $("li.viewIsland a").attr("href"); 
        return link.substr(link.indexOf("id=") + 3);
    },
    getDomain:function() {
        return document.domain;
    },    
    getMovements:function() {
        return IkaTools.getVal('movements');
    },
    getMovementsUpdate:function(callbackFunction) {
        IkaTools.getRemoteDocument('http://' +IkaTools.getDomain() + '/index.php?view=militaryAdvisorMilitaryMovements', function(doc) {
            IkaTools.views['militaryAdvisorMilitaryMovements'](doc);
            if(typeof(callbackFunction) == 'function') {
                callbackFunction(IkaTools.getVal('movements'));
            }
        });
    },
    getRemoteDocument:function(url, callback) {
		GM_xmlhttpRequest ({
			method: "GET",
			url: url,
			headers: {"User-agent": navigator.userAgent, "Accept": "text/html"},
			onload: function (response){
				var html = document.createElement("html");
				html.innerHTML = response.responseText;
				var response = document.implementation.createDocument("", "", null);
				response.appendChild(html);
				callback(response);
			}
		});
	},
    getVal:function(key, useDomain) {
        if(typeof(useDomain) == 'undefined' || useDomain) {
            key = IkaTools.getDomain() + key;    
        }
        return eval(GM_getValue(key, ('({})')));
    },
    getView:function() { 
        return IkaTools.ikariam.phpSet.currentView; 
    },
    setVal:function(key, value, useDomain) {
        if(typeof(useDomain) == 'undefined' || useDomain) {
            key = IkaTools.getDomain() + key;    
        }
        GM_setValue(key, uneval(value));
    },
    goTo:function(url, cityId) {
        document.body.style.cursor = "wait";
        var loc = url.match(/^\//) ? 'http://' + IkaTools.getDomain() + url : url;
        if(typeof(cityId) != 'undefined' && cityId != IkaTools.getCurrentCityId()) {
            IkaTools.changeCity(cityId);
        }
        unsafeWindow.document.location = loc;
    },
    viewIsBuilding:function() {
        var buildingViews = ['academy', 'alchemist', 'architect', 'barracks', 'branchOffice', 'carpentering', 'embassy', 'fireworker', 'forester', 'glassblowing', 'museum', 'optician', 'palace', 'palaceColony', 'port', 'safehouse', 'shipyard', 'stonemason', 'tavern', 'townHall', 'vineyard', 'wall', 'warehouse', 'winegrower', 'workshop'];
        var isBuilding = false;
        for(i in buildingViews) {
            if(buildingViews[i] == IkaTools.getView()) {
                isBuilding = true;
                continue;
            }
        }    
        return isBuilding;
    }
}




IkaTools.debug = function(text) {
    if(IkaTools.config.debugMode) {
        if(typeof(IkaTools.debugPane) == 'undefined') {
            IkaTools.debugPane = document.createElement('div');
            IkaTools.debugPane.setAttribute('style', 'z-index:10; color:#fff; text-align:right; position:absolute; top:0; width:100%;');
            document.body.appendChild(IkaTools.debugPane);
        }
        IkaTools.debugPane.innerHTML += text + '<br>';
    }
}



IkaTools.changeCity = function(city_id) {
    var postdata = "";
    var elems = document.getElementById('changeCityForm').getElementsByTagName('fieldset')[0].getElementsByTagName('input');
    for(var i = 0; i < elems.length; i++) {
        postdata += "&" + elems[i].name + "=" + elems[i].value;
    }
    postdata = postdata + "&cityId="+city_id+"&view=city";
    var xmlhttp;
    if(window.XMLHttpRequest){
        xmlhttp = new XMLHttpRequest();
    }
    xmlhttp.open('POST','http://' + location.host + '/index.php',false);
    xmlhttp.setRequestHeader('User-agent',window.navigator.userAgent);
    xmlhttp.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    xmlhttp.setRequestHeader('Accept','application/atom+xml,application/xml,text/xml');
    xmlhttp.setRequestHeader('Referer','http://' + location.host + '/index.php');
    xmlhttp.setRequestHeader('Cookie',document.cookie);
    xmlhttp.overrideMimeType('text/javascript; charset='+document.characterSet);
    xmlhttp.send(postdata);
    var node = getDocument(xmlhttp.responseText);
    return node.getElementsByTagName("input")[2].value;
}

function getDocument(responseText) {
   var html = document.createElement("html");
   html.innerHTML = responseText;
   var response = document.implementation.createDocument("", "", null);
   response.appendChild(html);
   return response;
}



IkaTools.city = function(id) {
    this.id = id;
    this.name;
    this.level = 0;
    this.type;
    if(IkaTools.config.trackData.resources) {
        this.resources = {wood:0, wine:0, marble:0, glass:0, sulfur:0, population:0};
        this.resourceMaximums = {wood:0, wine:0, marble:0, glass:0, sulfur:0, population:0};
    }
    this.buildings = new Array();
}






IkaTools.building = function() {
    this.position;
    this.type;
    this.name;
    this.level;
    this.cityId;
    if(IkaTools.config.trackData.resources) {
        this.resources = {wood:0, wine:0, marble:0, glass:0, sulfur:0, time:""};
        this.missingResources = {wood:0, wine:0, marble:0, glass:0, sulfur:0, total:0};
    }
}

IkaTools.getCurrentPosition = function() {
    var tmp = document.location.toString().match(/position=\d+/);
    return tmp ? tmp.toString().replace(/position=/, '') : false;    
}

IkaTools.clearCities = function() {
    IkaTools.setVal('cities', new Array());
}
IkaTools.saveCities = function(cities) {
    cities = typeof(cities) == 'undefined' ? IkaTools.cities : cities;
    IkaTools.setVal('cities', cities);
    IkaTools.loadCityData();
}

IkaTools.loadCityData = function() { IkaTools.cities = IkaTools.getVal('cities'); }

IkaTools.updateData = function() {
    try {
        IkaTools.loadCityData();    // load saved cities
        // check for new cities
        var cities = new Array();
        $$('#citySelect option').each(function(i) {
            var city = IkaTools.getCityById(this.value) ? IkaTools.getCityById(this.value) : new IkaTools.city(this.value);
            city.name = this.innerHTML;    // update name
            // update current city
            if(city.id == IkaTools.getCurrentCityId()) {
                city.islandId = IkaTools.getCurrentIslandId();
                if(IkaTools.config.trackData.resources) {
                    var resourceNames = ["wood", "wine", "marble", "glass", "sulfur", "population"];
                    for(var x = 0; x < resourceNames.length; x++) {
                        var type = resourceNames[x];
                        city.resources = typeof(city.resources) == 'undefined' ? {} : city.resources;
                        city.resources[type] = 0;
                        city.resourceMaximums = typeof(city.resourceMaximums) == 'undefined' ? {} : city.resourceMaximums;
                        if(type == 'population') {
                            var population = $$('#cityResources ul.resources li #value_inhabitants').text()
                            city.freeWorkers = parseInt(population.match(/^\d+/));
                            city.resources["population"] = parseInt(population.replace(/^\d+\s\(/, '').replace(/[^\d]/, ''));
                        } else {
                            city.resourceMaximums[type] = 0;
                            city.resources[type] = parseInt(IkaTools.ikariam.currentCity.resources[(type == 'glass' ? 'crystal' : type)]);
                            city.resourceMaximums[type] = parseInt(IkaTools.ikariam.currentCity.maxCapacity[(type == 'glass' ? 'crystal' : type)]);
                        }
                        // update resoure timestamp
                        var d = new Date();
                        city.resourceChangeUpdated = typeof(city.resourceChangeUpdated) == 'undefined' ? {} : city.resourceChangeUpdated;
                        city.resourceChangeUpdated[type] = d.getTime();
                    }
                }
            }
            if(IkaTools.config.trackData.resources) {
                // check for city tradegood type in city select
                if(this.className.match(/tradegood\d+/)) {
                    var tradegoodNum = this.className.match(/tradegood\d+/).toString().replace(/[^\d]*/, '');
                    switch(parseInt(tradegoodNum)) {
                        case 1: city.tradegoodType = "wine"; break;
                        case 2: city.tradegoodType = "marble"; break;
                        case 3: city.tradegoodType = "glass"; break;
                        case 4: city.tradegoodType = "sulfur"; break;
                    }
                }
            }
            cities.push(city);                
        });
        IkaTools.cities = cities;
        // handle building views
        if(IkaTools.viewIsBuilding() && IkaTools.getCurrentPosition()) {
            building = IkaTools.cityGetBuildingByPosition(IkaTools.getCurrentPosition());
            if(!building) {
                var building = new IkaTools.building();
                building.cityId = IkaTools.getCurrentCityId();
                building.position = IkaTools.getCurrentPosition();
                IkaTools.getCurrentCity().buildings.push(building);
            }
            building.type = IkaTools.getView();
            building.name = $$('#mainview .buildingDescription h1')[0].text();
            building.level = $$('#buildingUpgrade .buildingLevel')[0].text().replace(/[^\d]*/, '').replace(/[^\d]*/, '');
            // update required resources
            if(IkaTools.config.trackData.resources) {
                building.resources = {wood:0, wine:0, marble:0, glass:0, sulphur:0, time:""};
                var resources = $$('.resources li', $('buildingUpgrade'));
                for(var i = 0; i < resources.size(); i++) {
                    var type = resources[i].className.replace(/\s.*$/, '');
                    type = type == 'crystal' ? 'glass' : type;
                    var value = resources[i].innerHTML.replace(/<span.*?<\/span>\s*/, '');
                    value = type == 'time' ? value : value.replace(/[^\d]/, '');
                    building.resources[type] = value;    
                }
            }
            // update conscruction timers
            IkaTools.updateConstructionTimer();
        }
        // update construction time after upgrade request
        IkaTools.updateConstructionTimer
        // parse current view
        if(typeof(IkaTools.views[IkaTools.getView()]) == 'function') {
            IkaTools.views[IkaTools.getView()]();                                          
        }
        IkaTools.saveCities(cities);
    } catch(e) {
        if(IkaTools.config.debugMode) { alert("Error in IkaTools.updateData():\n\n" + e); }    
    }
}

IkaTools.updateConstructionTimer = function() {
    // update conscruction timers
    if(IkaTools.config.trackData.construction && (IkaTools.getView() == 'city' || (IkaTools.viewIsBuilding() && $('upgradeInProgress').size() == 1))) {
        var end = document.body.innerHTML.match(/enddate:\s*\d+/);
        var current = document.body.innerHTML.match(/currentdate:\s*\d+/);
        if(end && current) {
            end = parseInt(end.toString().replace(/enddate:\s*/, ''));
            current = parseInt(current.toString().replace(/currentdate:\s*/, ''));
            var secondsLeft = end - current;
            var d = new Date();
            IkaTools.getCurrentCity().buildEnd = d.getTime() + (1000 * secondsLeft)
            if(IkaTools.viewIsBuilding() && IkaTools.getCurrentPosition()) {
                IkaTools.getCurrentCity().buildBuilding = IkaTools.cityGetBuildingByPosition(IkaTools.getCurrentPosition());
            }            
        }
    }
}

IkaTools.views = {};


IkaTools.views["academy"] = function() {
    var city = IkaTools.getCurrentCity();
    // update city income
    city.income = parseInt($('valueWorkCosts').text());
    // update research
    city.resourceChanges = typeof(city.resourceChanges) != 'object' ? {} : city.resourceChanges;
    city.resourceChanges['research'] = parseInt($('valueResearch').text().replace(/[^\d]*/, '').replace(/[^\d]*/, ''));
    city.resources['research'] = city.resourceChanges['research'];
    var d = new Date();
    city.resourceChangeUpdated = typeof(city.resourceChangeUpdated) == 'undefined' ? {} : city.resourceChangeUpdated;
    city.resourceChangeUpdated['research'] = d.getTime();
    if(maximum = $$('#mainview .contentBox01h .content')[0].html().replace(/setActualValue\(0\)/, '').match(/setActualValue\(\d+\)/)) {
        city.resourceMaximums = typeof(city.resourceMaximums) == 'undefined' ? {} : city.resourceMaximums;    
        city.resourceMaximums['research'] = parseInt(maximum.toString().replace(/setActualValue\(/, '').replace(/\)/, ''));
    }

}
IkaTools.views["city"] = function(root) {
    try {
        var city = IkaTools.getCurrentCity();
        var cityViewId = document.location.toString().match(/id=(\d+)/);
        if(IkaTools.getCurrentCityId() == city.id && IkaTools.getView() == 'city' && (!cityViewId || cityViewId[1] == city.id)) {
            var newBuildings = new Array();
            var underConstruction = false;
            $$('#mainview #locations > li').each(function(i) {
                if(this.id.match(/\d+$/)) {
                    var position = this.id.match(/\d+$/);
                    var type = $('.buildingimg', this).size() > 0 ? this.className : ($('.constructionSite', this).size() > 0 ? this.className : false);                
                    if(type) {
                        var title = $('a', this).attr('title');
                        var building = IkaTools.cityGetBuildingByPosition(city, position) ? IkaTools.cityGetBuildingByPosition(city, position) : new IkaTools.building();
                        building.level = parseInt(title.toString().match(/\d+$/));
                        building.name = title.toString().replace(/\s[^\s]+\s\d+$/, '');
                        building.position = position;
                        building.type = type;
                        building.cityId = city.id;
                        // check for city hall 
                        if(building.position == 0) {
                            IkaTools.getCityById(building.cityId).level = parseInt(building.level);    
                        }
                        newBuildings.push(building);    
                        // check to see if this building is being upgrades
                        if($('.timetofinish #cityCountdown', this).size() > 0) {
                            IkaTools.getCurrentCity().buildBuilding = building;
                            var underConstruction = true;
                        }
                    }
                }
            });
            if(!underConstruction) {
                IkaTools.getCurrentCity().buildEnd = 0;
            }
            city.buildings = newBuildings;
        }
        IkaTools.updateConstructionTimer();
    } catch(e) {
        if(IkaTools.config.debugMode) { alert("Error in IkaTools.views.city():\n\n" + e); }    
    }    
}
IkaTools.views["finances"] = function() {
    var rows = $('#balance tr');
    var cities = IkaTools.getCities();
    for(var i in cities) {
        var index = parseInt(i) + 1 
        if(typeof(rows[index]) != 'undefined') {
            var tds = rows[index].getElementsByTagName('td');
            if(tds.length == 4 && cities[i].name.indexOf(tds[0].innerHTML) != -1) {
                cities[i].income = parseInt(tds[1].innerHTML);
                cities[i].upkeep = parseInt(tds[2].innerHTML);
            }
        }
    }
}
IkaTools.views["island"] = function() {
    if(IkaTools.cityGetIslandId(IkaTools.getCurrentCity()) == document.location.toString().match(/\d+$/)) {
        var city = IkaTools.getCurrentCity();
        // update tradegood
        var class = $('#tradegood').attr('className');
        city.tradegoodType = class.match(/^[^\s]+/).toString();
        city.tradegoodType = IkaTools.getCurrentCity().tradegoodType == 'crystal' ? 'glass' : IkaTools.getCurrentCity().tradegoodType;
        city.tradegoodLevel = parseInt(class.match(/\d+$/).toString());
        // update sawmill
        var title = $('#islandfeatures li.wood a').attr('title');
        city.sawmillLevel = parseInt(title.match(/\d+$/).toString());
    }
}
IkaTools.views["militaryAdvisorMilitaryMovements"] = function(root) {
    root = typeof(root) == 'undefined' ? document.body : root;
    var movements = new Array();
    var d = new Date();
    $('#fleetMovements table.locationEvents tr', root).each(function() {
        if(this.className != "") {
            var tds = $('td', this);
            var movement = {
                type:this.className.toString().match(/[^\s]+$/).toString(),
                units:new Array()
            };
            for(var i = 0; i < tds.length; i++) {
                // get ID and arrival time
                if(tds[i].id.toString().match(/fleetRow/)) {
                    movement.id = parseInt(tds[i].id.toString().match(/\d+$/).toString());
                    movement.timeString = tds[i].innerHTML.toString();            
                    movement.hours = movement.timeString.match(/\d+h/) ? parseInt(movement.timeString.match(/\d+h/).toString().replace(/h/, '')) : 0;
                    movement.minutes = movement.timeString.match(/\d+m/) ? parseInt(movement.timeString.match(/\d+m/).toString().replace(/m/, '')) : 0;
                    movement.seconds = movement.timeString.match(/\d+s/) ? parseInt(movement.timeString.match(/\d+s/).toString().replace(/s/, '')) : 0;
                    movement.arrivalTime = d.getTime() + (movement.hours * (60*60*1000)) + (movement.minutes * (60*1000) + (movement.seconds * 1000));
                }
                // get mission & status
                if($('img', tds[i]).size() == 1 && $('img', tds[i]).attr('src').toString().match(/mission_/)) {
                    movement.mission =     $('img', tds[i]).attr('src').toString().match(/mission_[^\.]+/).toString().replace(/^mission_/, '');
                    movement.status = tds[i].title.match(/\([^\)]+\)/).toString().replace(/(\(|\))/g, '');
                    movement.description = tds[i].title;
                }
                // get abort href
                if($('a', tds[i]).size() == 1 && $('a', tds[i]).attr('href').toString().match(/abortFleetOperation/)) {
                    movement.abortHref = $('a', tds[i]).attr('href').toString();
                }
                // get units
                if($('.unitBox', tds[i]).size() > 0) {
                    var unitDivs = $('.unitBox', tds[i]);                    
                    for(var x = 0; x < unitDivs.size(); x++) {
                        var u = {
                            name:unitDivs[x].title,
                            qty:parseInt($('.count', unitDivs[x]).text().toString().replace(/(,|\.)/g, '')),
                            iconSrc:$('.icon img', unitDivs[x]).size() == 1 ? $('.icon img', unitDivs[x]).attr('src') : $('.iconSmall img', unitDivs[x]).attr('src')
                        };                                        
                        movement.units.push(u);
                    }
                }
                movement.direction = ($('img', tds[6]).size() == 1 ? 'right' : ($('img', tds[4]).size() == 1  ? 'left' : false));
                movement.originId = $('a', $('td', this)[3])[0].href.toString().match(/\d+$/).toString();
                movement.originCityName = $('a', $('td', this)[3])[0].innerHTML.toString();
                movement.originPlayerName = $('td', this)[3].innerHTML.toString().match(/\([^\)]+\)/).toString().replace(/^\(/, '').replace(/\)$/, '');
                movement.targetId = $('a', $('td', this)[7])[0].href.toString().match(/\d+$/).toString();
                movement.targetCityName = $('a', $('td', this)[7])[0].innerHTML.toString();
                try {
                    movement.targetPlayerName = $('td', this)[7].innerHTML.toString().match(/\([^\)]+\)/).toString().replace(/^\(/, '').replace(/\)$/, '');
                } catch(e) {
                    movement.targetPlayerName = false;
                }
            }
            movements.push(movement);
        }
    });
    IkaTools.setVal('movements', movements);
}
IkaTools.views["resource"] = function() {
    // update resource
    if(IkaTools.cityGetIslandId(IkaTools.getCurrentCity()) == document.location.toString().match(/\d+$/) || document.location.toString().match(/index\.php$/)) {
        var city = IkaTools.getCurrentCity();
        city.sawmillLevel = parseInt($('#resUpgrade .buildingLevel').text().replace(/[^\d]*/, ''));
        // update wood change
        city.resourceChanges = typeof(city.resourceChanges) != 'object' ? {} : city.resourceChanges;
        city.resourceChanges['wood'] = parseInt($('#valueResource').text().replace(/[^\d]*/, '').replace(/[^\d]*/, ''));
        city.resourceChangeUpdated = typeof(city.resourceChangeUpdated) != 'object' ? {} : city.resourceChangeUpdated;
        // update city income
        city.income = parseInt($('#valueWorkCosts').text());
    }
}
IkaTools.views["tavern"] = function() {
    IkaTools.getCurrentCity().wineConsumption = parseInt($('#wineAmount option:selected').text().match(/^\d+/).toString().replace(/(,|\.)/g, ''));
}
IkaTools.views["tradegood"] = function() {
    if(IkaTools.cityGetIslandId(IkaTools.getCurrentCity()) == document.location.toString().match(/\d+$/) || document.location.toString().match(/index\.php$/)) {
        var city = IkaTools.getCurrentCity();
        // update tradegood level
        city.tradegoodLevel = parseInt($('#resUpgrade .buildingLevel').text().replace(/[^\d]*/, ''));
        // update tradegood type
        if(type = $('#resUpgrade .content img:first-child').attr('src').match(/img_.+\.jpg/)) {
            type =     type.toString().replace(/img_/, '').replace(/\.jpg/, '');
            city.tradegoodType = type == 'crystal' ? 'glass' : type;
            // update tradegood change
            city.resourceChanges = typeof(city.resourceChanges) != 'object' ? {} : city.resourceChanges;
            city.resourceChanges[type] = parseInt($('#valueResource').text().replace(/[^\d]*/, '').replace(/[^\d]*/, ''));
            city.resourceChangeUpdated = typeof(city.resourceChangeUpdated) != 'object' ? {} : city.resourceChangeUpdated;
        }
        // update city income
        city.income = parseInt($('#valueWorkCosts').text());
    }
}
IkaTools.views["townHall"] = function() {
    var city = IkaTools.getCurrentCity();
    city.level = parseInt($('#buildingUpgrade .buildingLevel').text().replace(/[^\d]*/, ''));    
    city.resourceMaximums = typeof(city.resourceMaximums) == 'undefined' ? {} : city.resourceMaximums;
    city.resourceMaximums["population"] = parseInt($('#CityOverview .stats .space .total').text());
    // update town hall name
    var building = IkaTools.cityGetBuildingByPosition(0);
    building.name = $('#mainview h1:first-child').text();
}

IkaTools.getCurrentCityResource = function(type) {
    var resourceLis = $('#cityResources ul.resources li');
    for(var i = 0; i < resourceLis.size(); i++) {
        if(resourceLis[i].className == type) {
            switch(type) {
                case 'glass': var parsedType = 'crystal'; break;
                case 'population': var parsedType = 'inhabitants'; break;
            }
            return parseInt($('#value_' + (type == 'glass' ? 'crystal' : type), resourceLis[i]).text().replace(/[^\d]/, ''));
        }
    }
    return 0;
}











/*
kaTools.init(params)	Triggers data collection & initiates the IkaTools for use
IkaTools.addCommas(number)	Returns the number formatted with commas
IkaTools.addInfoBox(titleHtml, contentDiv)	Adds a left column info box
IkaTools.addOptionBlock(contentDiv)	Adds an option block to the Ikariam Options page above player debug
IkaTools.buildingGetResourceMissing(type, building)	Gets the amount of a given resource missing to upgrade a building
IkaTools.buildingGetResourceMissingTotal(building)	Gets the total number of all resources missing to upgrade a building
IkaTools.buildingGetResourceRequired(type, building)	Gets the amount of a given resource required to upgrade a building
IkaTools.buildingGetResourceRequiredTotal(building)	Gets the total number of all resources required to upgrade a building
IkaTools.cityGetBuildingByPosition(position, city)	Gets a building by position for a giving city
IkaTools.cityGetBuildingByType(type, city)	Gets the first building found of a given type for a given city
IkaTools.cityGetBuildBuilding(city)	Get the building currently under construction in a given city
IkaTools.cityGetBuildSecondsRemaining(city)	Get the seconds remaining for construction in a given city
IkaTools.cityGetIncome(city)	Get the gross income of a given city (does not include upkeep)
IkaTools.cityGetIslandId(city)	Get the island ID of a given city
IkaTools.cityGetLevel(city)	Get the level of a given city
IkaTools.cityGetResource(type, city)	Get the current amount of a given resource in a given city
IkaTools.cityGetResourceChange(type, city)	Gets the change (+/- per hour) of a given resource type for a given city
IkaTools.cityGetResourceMax(type, city)	Gets the maximum capacity for a resource type in a given city
IkaTools.cityGetSawmillLevel(city)	Gets the level of the saw mill (wood mine) in a given city
IkaTools.cityGetTradegoodLevel(city)	Gets the level of the luxury good mine for a given city
IkaTools.cityGetTradegoodType(city)	Gets the type of the luxury good mine for a given city
IkaTools.cityGetWineConsumption(city)	Gets the amount of wine consumed per hour for a given city
IkaTools.getCities()	Returns an array containing all of the players cities as objects
IkaTools.getCityById(id)	Returns a city object for the given city ID
IkaTools.getCurrentCity()	Returns a city object for the current city
IkaTools.getCurrentCityId()	Gets the ID of the current city
IkaTools.getCurrentIslandId()	Gets the ID of the island of the current city
IkaTools.getDomain()	Gets the current Ikariam domain (e.g. s5.ikariam.org)
IkaTools.getRemoteDocument(url, callback)	Gets a remote URL as an element that can be manipulated
IkaTools.getVal(key, useDomain)	Retrieves a stored value, string, or object.
IkaTools.getView()	Gets the name of the current Ikariam view (e.g. city, island, academy)
IkaTools.setVal(key, value, useDomain)	Stores a value, string, or object.
IkaTools.goTo(url, cityId)	Redirects to a given URL and changes the current city if necessary
IkaTools.viewIsBuilding()	Returns true if the current view is a building
Method Details

Method documentation as of v0.02 ... will update soon.

The following method names are available and can be called as follows: IkaTools.methodName(params)
IkaTools.addInfoBox(titleHtml, contentDiv)

    * Adds an info box to the left bar of the Ikariam window.
    * Parameters
          o titleHtml - String representing the HTML to be used within the info boxe's h3 header tag
          o contentDiv - Div element to be used as the content of the info box.
    * Usage Example
          o var myContent = document.createElement('div');
            myContent.innerHTML = "<p>Hello world, try <a href"http://google.com">Google</a></p>";
            IkaTools.addInfoBox("Hello World", myContent);

IkaTools.cityGetBuildingByPosition(position, city)

    * Returns a building object for the given city and position or false if the building can't be found.
    * Parameters
          o city - An optional city object. If none is given, the current city will be used.
          o position - The numerical position to check (0 to 14)

IkaTools.cityGetLevel(city)

    * Returns the level of the city supplied as a parameter or the level of the current city if none is supplied.
    * Parameters
          o city - An optional city object for which to get the level. If none is supplied, the current city will be used.

IkaTools.getCityById(id)

    * Returns a city object or false if the city can't be found.
    * Parameters
          o id - The ID of the city you wish to get

IkaTools.getCurrentCityId()

    * Returns a city object representing the current city.

IkaTools.getCurrentCityId()

    * Returns the ID of the current city.

IkaTools.getDomain()

    * Returns the current Ikariam domain as a string (e.g. "s1.ikariam.com")

IkaTools.getVal(key, useDomain)

    * Gets the stored value for the current Ikariam server from the Firefox config. Similar to GM_getValue() except that it automatically pulls data for the specific domain you are currently on (e.g. s2.ikariam.org). Capable of directly returning stored objects.
    * Parameters
          o key - String representing the unique value you wish to retrieve
          o useDomain - Optional boolean parameter to specify whether or not to get data for the current Ikariam domain. Defaults to true.

IkaTools.goTo(url, cityId)

    * Redirects to a new url, automatically handling any city changes if a city ID is provided and does not match the current city.
    * Parameters
          o url - String representing the url to navigate to (e.g. "/index.php?view=academy&id=12345&position=4")
          o cityId- Optional integer value representing the ID of the city to load. If this is provided and does not match the current city ID, the current city will automatically be changed to the new city ID.

IkaTools.getView()

    * Returns the current view as a string (e.g. "city", "island", "academy").

IkaTools.setVal(key, value, useDomain)

    * Sets a stored value for the current Ikariam server to the Firefox config. Similar to GM_setValue() except that it automatically associates data with the specific domain you are currently on (e.g. s2.ikariam.org). Capable of storing just about anything (integers, strings, objects, arrays, etc.)
    * Parameters
          o key - String representing the unique value you wish to set
          o value - String, value, or object to store. Note that 0 (zero) should be set as a string as follows: "0"
          o useDomain - Optional boolean parameter to specify whether or not to set data for the current Ikariam domain. Defaults to true.

Objects
building - represents an Ikariam building

    * Properties
          o position - The numerical position in the city (0 to 14)
          o name - The name of the building
          o level - The building's current level
          o cityId - The ID of the city to which the building belongs

city - represents an Ikariam city

    * Properties
          o id - The ID of the city
          o name - The name of the city
          o buildings - An array containing the building objects for each building in the city
*/