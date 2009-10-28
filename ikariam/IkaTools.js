// ==UserScript==
// @name                  Ikariam Script Tools
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

IkaTools.getBuildingNecesayResources = function(type) {
    return IkaTools.BUILDINGSRESOURCES[type];
}


IkaTools.BUILDINGSRESOURCES = {
        // palace, wood, wine, marble, crystal, sulfur
        "palace" : [
            { "wood" : 5824, "wine" : 0, "marble" : 1434, "crystal" : 0, "sulfur" : 0 },
            { "wood" : 16048, "wine" : 0, "marble" : 4546, "crystal" : 0, "sulfur" : 3089 },
            { "wood" : 36496, "wine" : 10898, "marble" : 10770, "crystal" : 0, "sulfur" : 10301 },
            { "wood" : 77392, "wine" : 22110, "marble" : 23218, "crystal" : 21188, "sulfur" : 24725 },
            { "wood" : 159184, "wine" : 44534, "marble" : 48114, "crystal" : 42400, "sulfur" : 53573 },
            { "wood" : 322768, "wine" : 89382, "marble" : 97906, "crystal" : 84824, "sulfur" : 111269 },
            { "wood" : 649936, "wine" : 179078, "marble" : 197490, "crystal" : 169672, "sulfur" : 226661 },
            { "wood" : 1304272, "wine" : 358470, "marble" : 396658, "crystal" : 339368, "sulfur" : 457445 },
            { "wood" : 2612944, "wine" : 717254, "marble" : 794994, "crystal" : 678760, "sulfur" : 919013 }    // level 10
        ],
        
        // palaceColony, wood, wine, marble, crystal, sulfur
        "palaceColony" : [
            { "wood" : 5824, "wine" : 0, "marble" : 1434, "crystal" : 0, "sulfur" : 0 },
            { "wood" : 16048, "wine" : 0, "marble" : 4546, "crystal" : 0, "sulfur" : 3089 },
            { "wood" : 36496, "wine" : 10898, "marble" : 10770, "crystal" : 0, "sulfur" : 10301 },
            { "wood" : 77392, "wine" : 22110, "marble" : 23218, "crystal" : 21188, "sulfur" : 24725 },
            { "wood" : 159184, "wine" : 44534, "marble" : 48114, "crystal" : 42400, "sulfur" : 53573 },
            { "wood" : 322768, "wine" : 89382, "marble" : 97906, "crystal" : 84824, "sulfur" : 111269 },
            { "wood" : 649936, "wine" : 179078, "marble" : 197490, "crystal" : 169672, "sulfur" : 226661 },
            { "wood" : 1304272, "wine" : 358470, "marble" : 396658, "crystal" : 339368, "sulfur" : 457445 },
            { "wood" : 2612944, "wine" : 717254, "marble" : 794994, "crystal" : 678760, "sulfur" : 919013 }    // level 10
        ],
        
        // academy, wood, crystal
        "academy" : [
            { "wood" : 68, "crystal" : 0 },
            { "wood" : 115, "crystal" : 0 },
            { "wood" : 263, "crystal" : 0 },
            { "wood" : 382, "crystal" : 225 },
            { "wood" : 626, "crystal" : 428 },
            { "wood" : 982, "crystal" : 744 },
            { "wood" : 1330, "crystal" : 1089 },
            { "wood" : 2004, "crystal" : 1748 },
            { "wood" : 2665, "crystal" : 2454 },
            { "wood" : 3916, "crystal" : 3786 },
            { "wood" : 5156, "crystal" : 5216 },
            { "wood" : 7446, "crystal" : 7862 },
            { "wood" : 9753, "crystal" : 10729 },
            { "wood" : 12751, "crystal" : 14599 },
            { "wood" : 18163, "crystal" : 21627 },
            { "wood" : 23691, "crystal" : 29321 },
            { "wood" : 33450, "crystal" : 43020 },
            { "wood" : 43571, "crystal" : 58213 },
            { "wood" : 56728, "crystal" : 78724 },
            { "wood" : 73832, "crystal" : 106414 },
            { "wood" : 103458, "crystal" : 154857 },
            { "wood" : 144203, "crystal" : 224146 },
            { "wood" : 175057, "crystal" : 282571 },
            { "wood" : 243929, "crystal" : 408877 }        // level 25
        ],
        
        // townHall, wood, marble
        "townHall" : [
            { "wood" : 158, "marble" : 0 },
            { "wood" : 335, "marble" : 0 },
            { "wood" : 623, "marble" : 0 },
            { "wood" : 923, "marble" : 285 },
            { "wood" : 1390, "marble" : 551 },
            { "wood" : 2015, "marble" : 936 },
            { "wood" : 2706, "marble" : 1411 },
            { "wood" : 3661, "marble" : 2091 },
            { "wood" : 4776, "marble" : 2945 },
            { "wood" : 6173, "marble" : 4072 },
            { "wood" : 8074, "marble" : 5664 },
            { "wood" : 10281, "marble" : 7637 },
            { "wood" : 13023, "marble" : 10214 },
            { "wood" : 16424, "marble" : 13575 },
            { "wood" : 20986, "marble" : 18254 },
            { "wood" : 25423, "marble" : 23250 },
            { "wood" : 32285, "marble" : 31022 },
            { "wood" : 40232, "marble" : 40599 },
            { "wood" : 49286, "marble" : 52216 },
            { "wood" : 61207, "marble" : 68069 },
            { "wood" : 74804, "marble" : 87316 },
            { "wood" : 93956, "marble" : 115101 },
            { "wood" : 113035, "marble" : 145326 },
            { "wood" : 141594, "marble" : 191053 },
            { "wood" : 170213, "marble" : 241039 },
            { "wood" : 210011, "marble" : 312128 },
            { "wood" : 258875, "marble" : 403824 },
            { "wood" : 314902, "marble" : 515592 }    // level 29
        ],

        // architect, wood, marble
        "architect" : [
            { "wood" : 291, "marble" : 160 },
            { "wood" : 413, "marble" : 222 },
            { "wood" : 555, "marble" : 295 },
            { "wood" : 720, "marble" : 379 },
            { "wood" : 911, "marble" : 475 },
            { "wood" : 1133, "marble" : 587 },
            { "wood" : 1390, "marble" : 716 },
            { "wood" : 1689, "marble" : 865 },
            { "wood" : 2035, "marble" : 1036 },
            { "wood" : 2437, "marble" : 1233 },
            { "wood" : 2902, "marble" : 1460 },
            { "wood" : 3443, "marble" : 1722 },
            { "wood" : 4070, "marble" : 2023 },
            { "wood" : 4797, "marble" : 2369 },
            { "wood" : 5640, "marble" : 2767 },
            { "wood" : 6618, "marble" : 3226 },
            { "wood" : 7754, "marble" : 3752 },
            { "wood" : 9070, "marble" : 4358 },
            { "wood" : 10598, "marble" : 5056 },
            { "wood" : 12369, "marble" : 5857 },
            { "wood" : 14424, "marble" : 6777 },
            { "wood" : 16807, "marble" : 7836 },
            { "wood" : 19573, "marble" : 9052 },
            { "wood" : 22780, "marble" : 10448 },
            { "wood" : 26501, "marble" : 12054 },
            { "wood" : 30817, "marble" : 13899 },
            { "wood" : 35825, "marble" : 16017 },
            { "wood" : 41631, "marble" : 18450 },
            { "wood" : 48371, "marble" : 21245 },
            { "wood" : 56185, "marble" : 24454 },
            { "wood" : 65251, "marble" : 28141 }    // level 32
        ],

        // safehouse, wood, marble
        "safehouse" : [
            { "wood" : 248, "marble" : 0 },
            { "wood" : 402, "marble" : 0 },
            { "wood" : 578, "marble" : 129 },
            { "wood" : 779, "marble" : 197 },
            { "wood" : 1007, "marble" : 275 },
            { "wood" : 1267, "marble" : 366 },
            { "wood" : 1564, "marble" : 471 },
            { "wood" : 1903, "marble" : 593 },
            { "wood" : 2288, "marble" : 735 },
            { "wood" : 2728, "marble" : 900 },
            { "wood" : 3230, "marble" : 1090 },
            { "wood" : 3801, "marble" : 1312 },
            { "wood" : 4453, "marble" : 1569 },
            { "wood" : 5195, "marble" : 1866 },
            { "wood" : 6042, "marble" : 2212 },
            { "wood" : 7007, "marble" : 2613 },
            { "wood" : 8107, "marble" : 3078 },
            { "wood" : 9547, "marble" : 3617 },
            { "wood" : 10793, "marble" : 4242 },
            { "wood" : 12422, "marble" : 4967 },
            { "wood" : 14282, "marble" : 5810 },
            { "wood" : 16400, "marble" : 6785 },
            { "wood" : 18815, "marble" : 7919 },
            { "wood" : 21570, "marble" : 9233 },
            { "wood" : 24708, "marble" : 10757 },
            { "wood" : 29488, "marble" : 12526 },
            { "wood" : 33741, "marble" : 14577 },
            { "wood" : 38589, "marble" : 16956 },
            { "wood" : 44115, "marble" : 19715 },
            { "wood" : 46585, "marble" : 21399 },
            { "wood" : 53221, "marble" : 24867 }    // level 32
        ],

        //wall, wood, marble
        "wall" : [
            { "wood" : 361, "marble" : 203 },
            { "wood" : 657, "marble" : 516 },
            { "wood" : 1012, "marble" : 892 },
            { "wood" : 1439, "marble" : 1344 },
            { "wood" : 1951, "marble" : 1885 },
            { "wood" : 2565, "marble" : 2535 },
            { "wood" : 3302, "marble" : 3315 },
            { "wood" : 4186, "marble" : 4251 },
            { "wood" : 5247, "marble" : 5374 },
            { "wood" : 6521, "marble" : 6721 },
            { "wood" : 8049, "marble" : 8338 },
            { "wood" : 9882, "marble" : 10279 },
            { "wood" : 12083, "marble" : 12608 },
            { "wood" : 14724, "marble" : 15402 },
            { "wood" : 17892, "marble" : 18755 },
            { "wood" : 21695, "marble" : 22779 },
            { "wood" : 26258, "marble" : 27607 },
            { "wood" : 31733, "marble" : 33402 },
            { "wood" : 38304, "marble" : 40355 },
            { "wood" : 46189, "marble" : 48699 },
            { "wood" : 55650, "marble" : 58711 },
            { "wood" : 67004, "marble" : 70726 },
            { "wood" : 80629, "marble" : 85144 },
            { "wood" : 96979, "marble" : 102446 },
            { "wood" : 116599, "marble" : 123208 },
            { "wood" : 140143, "marble" : 148122 },
            { "wood" : 168395, "marble" : 178019 },
            { "wood" : 202298, "marble" : 213896 },
            { "wood" : 242982, "marble" : 256948 },
            { "wood" : 291802, "marble" : 308610 },
            { "wood" : 350387, "marble" : 370605 }    // level 32
        ],

        // shipyard, wood, marble
        "shipyard" : [
            { "wood" : 202, "marble" : 0 },
            { "wood" : 324, "marble" : 0 },
            { "wood" : 477, "marble" : 0 },
            { "wood" : 671, "marble" : 0 },
            { "wood" : 914, "marble" : 778 },
            { "wood" : 1222, "marble" : 1052 },
            { "wood" : 1609, "marble" : 1397 },
            { "wood" : 2096, "marble" : 1832 },
            { "wood" : 2711, "marble" : 2381 },
            { "wood" : 3485, "marble" : 3071 },
            { "wood" : 4460, "marble" : 3942 },
            { "wood" : 5689, "marble" : 5038 },
            { "wood" : 7238, "marble" : 6420 },
            { "wood" : 9190, "marble" : 8161 },
            { "wood" : 11648, "marble" : 10354 },
            { "wood" : 14745, "marble" : 13117 },
            { "wood" : 18650, "marble" : 16600 },
            { "wood" : 23568, "marble" : 20989 },
            { "wood" : 29765, "marble" : 26517 },
            { "wood" : 37572, "marble" : 33484 },
            { "wood" : 47412, "marble" : 42261 },
            { "wood" : 59807, "marble" : 53321 },
            { "wood" : 75428, "marble" : 67256 },
            { "wood" : 95107, "marble" : 84814 }    // level 25
        ],

        // port, wood, marble
        "port" : [
            { "wood" : 150, "marble" : 0 },
            { "wood" : 274, "marble" : 0 },
            { "wood" : 429, "marble" : 0 },
            { "wood" : 637, "marble" : 0 },
            { "wood" : 894, "marble" : 176 },
            { "wood" : 1207, "marble" : 326 },
            { "wood" : 1645, "marble" : 540 },
            { "wood" : 2106, "marble" : 791 },
            { "wood" : 2735, "marble" : 1138 },
            { "wood" : 3537, "marble" : 1598 },
            { "wood" : 4492, "marble" : 2176 },
            { "wood" : 5689, "marble" : 2928 },
            { "wood" : 7103, "marble" : 3859 },
            { "wood" : 8850, "marble" : 5051 },
            { "wood" : 11094, "marble" : 6628 },
            { "wood" : 13731, "marble" : 8566 },
            { "wood" : 17062, "marble" : 11089 },
            { "wood" : 21097, "marble" : 14265 },
            { "wood" : 25965, "marble" : 18241 },
            { "wood" : 31810, "marble" : 23197 },
            { "wood" : 39190, "marble" : 29642 },
            { "wood" : 47998, "marble" : 37636 },
            { "wood" : 58713, "marble" : 47703 },
            { "wood" : 71955, "marble" : 60556 },
            { "wood" : 87627, "marble" : 76366 },
            { "wood" : 94250, "marble" : 85042 }    // level 27
        ],

        // glassblowing, wood, marble
        "glassblowing" : [
            { "wood" : 467, "marble" : 116 },
            { "wood" : 718, "marble" : 255 },
            { "wood" : 1045, "marble" : 436 },
            { "wood" : 1469, "marble" : 671 },
            { "wood" : 2021, "marble" : 977 },
            { "wood" : 2738, "marble" : 1375 },
            { "wood" : 3671, "marble" : 1892 },
            { "wood" : 4883, "marble" : 2564 },
            { "wood" : 6459, "marble" : 3437 },
            { "wood" : 8508, "marble" : 4572 },
            { "wood" : 11172, "marble" : 6049 },
            { "wood" : 14634, "marble" : 7968 },
            { "wood" : 19135, "marble" : 10462 },
            { "wood" : 24987, "marble" : 13705 },
            { "wood" : 32594, "marble" : 17921 },
            { "wood" : 42483, "marble" : 23402 },
            { "wood" : 55339, "marble" : 30527 },
            { "wood" : 72050, "marble" : 39790 },
            { "wood" : 93778, "marble" : 51830 },
            { "wood" : 122021, "marble" : 67485 }    // level 21
        ],

        // warehouse, wood, marble
        "warehouse" : [
            { "wood" : 288, "marble" : 0 },
            { "wood" : 442, "marble" : 0 },
            { "wood" : 626, "marble" : 96 },
            { "wood" : 847, "marble" : 211 },
            { "wood" : 1113, "marble" : 349 },
            { "wood" : 1431, "marble" : 515 },
            { "wood" : 1813, "marble" : 714 },
            { "wood" : 2272, "marble" : 953 },
            { "wood" : 2822, "marble" : 1240 },
            { "wood" : 3483, "marble" : 1584 },
            { "wood" : 4275, "marble" : 1997 },
            { "wood" : 5226, "marble" : 2492 },
            { "wood" : 6368, "marble" : 3086 },
            { "wood" : 7737, "marble" : 3800 },
            { "wood" : 9380, "marble" : 4656 },
            { "wood" : 11353, "marble" : 5683 },
            { "wood" : 13719, "marble" : 6915 },
            { "wood" : 16559, "marble" : 8394 },
            { "wood" : 19967, "marble" : 10169 },
            { "wood" : 24056, "marble" : 12299 },
            { "wood" : 28963, "marble" : 14855 },
            { "wood" : 34852, "marble" : 17922 },
            { "wood" : 41918, "marble" : 21602 },
            { "wood" : 50398, "marble" : 26019 },
            { "wood" : 60574, "marble" : 31319 },
            { "wood" : 72784, "marble" : 37678 },
            { "wood" : 87437, "marble" : 45310 },
            { "wood" : 105021, "marble" : 54468 },
            { "wood" : 126121, "marble" : 65458 },
            { "wood" : 151441, "marble" : 78645 },
            { "wood" : 181825, "marble" : 94471 },
            { "wood" : 218286, "marble" : 113461 },
            { "wood" : 262039, "marble" : 136249 },
            { "wood" : 314543, "marble" : 163595 },
            { "wood" : 377548, "marble" : 196409 },
            { "wood" : 453153, "marble" : 235787 },
            { "wood" : 543880, "marble" : 283041 },
            { "wood" : 652752, "marble" : 339745 },
            { "wood" : 783398, "marble" : 407790 }    // level 40
        ],

        // museum, wood, marble
        "museum" : [
            { "wood" : 1435, "marble" : 1190 },
            { "wood" : 2748, "marble" : 2573 },
            { "wood" : 4716, "marble" : 4676 },
            { "wood" : 7669, "marble" : 7871 },
            { "wood" : 12099, "marble" : 12729 },
            { "wood" : 18744, "marble" : 20112 },
            { "wood" : 28710, "marble" : 31335 },
            { "wood" : 43661, "marble" : 48394 },
            { "wood" : 66086, "marble" : 74323 },
            { "wood" : 99724, "marble" : 113736 },
            { "wood" : 150181, "marble" : 173643 },
            { "wood" : 225866, "marble" : 264701 },
            { "wood" : 339394, "marble" : 403110 },
            { "wood" : 509686, "marble" : 613492 },
            { "wood" : 765124, "marble" : 933272 }    // level 16
        ],

        // workshop, wood, marble, missing 2 (level 30, 31)
        "workshop" : [
            { "wood" : 383, "marble" : 167 },
            { "wood" : 569, "marble" : 251 },
            { "wood" : 781, "marble" : 349 },
            { "wood" : 1023, "marble" : 461 },
            { "wood" : 1299, "marble" : 592 },
            { "wood" : 1613, "marble" : 744 },
            { "wood" : 1972, "marble" : 920 },
            { "wood" : 2380, "marble" : 1125 },
            { "wood" : 2846, "marble" : 1362 },
            { "wood" : 3377, "marble" : 1637 },
            { "wood" : 3982, "marble" : 1956 },
            { "wood" : 4672, "marble" : 2326 },
            { "wood" : 5458, "marble" : 2755 },
            { "wood" : 6355, "marble" : 3253 },
            { "wood" : 7377, "marble" : 3831 },
            { "wood" : 8542, "marble" : 4500 },
            { "wood" : 9870, "marble" : 5279 },
            { "wood" : 11385, "marble" : 6180 },
            { "wood" : 13111, "marble" : 7226 },
            { "wood" : 15078, "marble" : 8439 },
            { "wood" : 17714, "marble" : 9776 },
            { "wood" : 19481, "marble" : 11477 },
            { "wood" : 22796, "marble" : 13373 },
            { "wood" : 26119, "marble" : 15570 },
            { "wood" : 29909, "marble" : 18118 },
            { "wood" : 34228, "marble" : 21074 },
            { "wood" : 39153, "marble" : 24503 },
            { "wood" : 0, "marble" : 0 },
            { "wood" : 0, "marble" : 0 },
            { "wood" : 58462, "marble" : 38447 }    // level 31
        ],

        // forester, wood, marble
        "forester" : [
            { "wood" : 430, "marble" : 104 },
            { "wood" : 664, "marble" : 237 },
            { "wood" : 968, "marble" : 410 },
            { "wood" : 1364, "marble" : 635 },
            { "wood" : 1878, "marble" : 928 },
            { "wood" : 2546, "marble" : 1309 },
            { "wood" : 3415, "marble" : 1803 },
            { "wood" : 4544, "marble" : 2446 },
            { "wood" : 6013, "marble" : 3282 },
            { "wood" : 7922, "marble" : 4368 },
            { "wood" : 10403, "marble" : 5781 },
            { "wood" : 13629, "marble" : 7617 },
            { "wood" : 17823, "marble" : 10422 },
            { "wood" : 23274, "marble" : 13108 },
            { "wood" : 30362, "marble" : 17142 },
            { "wood" : 39574, "marble" : 22386 },
            { "wood" : 51552, "marble" : 29204 },
            { "wood" : 67123, "marble" : 38068 },
            { "wood" : 87363, "marble" : 49589 },
            { "wood" : 113680, "marble" : 64569 },
            { "wood" : 160157, "marble" : 91013 }    // level 22
        ],

        // optician, wood, marble
        "optician" : [
            { "wood" : 188, "marble" : 35 },
            { "wood" : 269, "marble" : 96 },
            { "wood" : 362, "marble" : 167 },
            { "wood" : 471, "marble" : 249 },
            { "wood" : 597, "marble" : 345 },
            { "wood" : 742, "marble" : 455 },
            { "wood" : 912, "marble" : 584 },
            { "wood" : 1108, "marble" : 733 },
            { "wood" : 1335, "marble" : 905 },
            { "wood" : 1600, "marble" : 1106 },
            { "wood" : 1906, "marble" : 1338 },
            { "wood" : 2261, "marble" : 1608 },
            { "wood" : 2673, "marble" : 1921 },
            { "wood" : 3152, "marble" : 2283 },
            { "wood" : 3706, "marble" : 2704 },
            { "wood" : 4348, "marble" : 3191 },
            { "wood" : 5096, "marble" : 3759 },
            { "wood" : 5962, "marble" : 4416 },
            { "wood" : 6966, "marble" : 5178 },
            { "wood" : 8131, "marble" : 6062 },
            { "wood" : 9482, "marble" : 7087 },
            { "wood" : 11050, "marble" : 8276 },
            { "wood" : 12868, "marble" : 9656 },
            { "wood" : 14978, "marble" : 11257 },
            { "wood" : 17424, "marble" : 13113 },
            { "wood" : 20262, "marble" : 15267 },
            { "wood" : 23553, "marble" : 17762 },
            { "wood" : 27373, "marble" : 20662 },
            { "wood" : 31804, "marble" : 24024 },
            { "wood" : 36943, "marble" : 27922 },
            { "wood" : 42904, "marble" : 32447 }    // level 32
        ],

        // barracks, wood, marble, missing 1 (level 29)
        "barracks" : [
            { "wood" : 114, "marble" : 0 },
            { "wood" : 195, "marble" : 0 },
            { "wood" : 296, "marble" : 0 },
            { "wood" : 420, "marble" : 0 },
            { "wood" : 574, "marble" : 0 },
            { "wood" : 766, "marble" : 0 },
            { "wood" : 1003, "marble" : 0 },
            { "wood" : 1297, "marble" : 178 },
            { "wood" : 1662, "marble" : 431 },
            { "wood" : 2115, "marble" : 745 },
            { "wood" : 2676, "marble" : 1134 },
            { "wood" : 3371, "marble" : 1616 },
            { "wood" : 4234, "marble" : 2214 },
            { "wood" : 5304, "marble" : 2956 },
            { "wood" : 6630, "marble" : 3875 },
            { "wood" : 8275, "marble" : 5015 },
            { "wood" : 10314, "marble" : 6429 },
            { "wood" : 12843, "marble" : 8183 },
            { "wood" : 15979, "marble" : 10357 },
            { "wood" : 19868, "marble" : 13052 },
            { "wood" : 24690, "marble" : 16395 },
            { "wood" : 30669, "marble" : 20540 },
            { "wood" : 38083, "marble" : 25680 },
            { "wood" : 47277, "marble" : 32054 },
            { "wood" : 58772, "marble" : 39957 },
            { "wood" : 72932, "marble" : 49839 },
            { "wood" : 90490, "marble" : 61909 },
            { "wood" : 0, "marble" : 0 },
            { "wood" : 158796, "marble" : 109259 },
            { "wood" : 186750, "marble" : 128687 }    // level 31
        ],

        // carpentering, wood, marble
        "carpentering" : [
            { "wood" : 122, "marble" : 0 },
            { "wood" : 192, "marble" : 0 },
            { "wood" : 274, "marble" : 0 },
            { "wood" : 372, "marble" : 0 },
            { "wood" : 486, "marble" : 0 },
            { "wood" : 620, "marble" : 0 },
            { "wood" : 777, "marble" : 359 },
            { "wood" : 962, "marble" : 444 },
            { "wood" : 1178, "marble" : 546 },
            { "wood" : 1432, "marble" : 669 },
            { "wood" : 1730, "marble" : 816 },
            { "wood" : 2078, "marble" : 993 },
            { "wood" : 2486, "marble" : 1205 },
            { "wood" : 2964, "marble" : 1459 },
            { "wood" : 3524, "marble" : 1765 },
            { "wood" : 4178, "marble" : 2131 },
            { "wood" : 4944, "marble" : 2571 },
            { "wood" : 5841, "marble" : 3097 },
            { "wood" : 6890, "marble" : 3731 },
            { "wood" : 8117, "marble" : 4490 },
            { "wood" : 9550, "marble" : 5402 },
            { "wood" : 11229, "marble" : 6496 },
            { "wood" : 13190, "marble" : 7809 },
            { "wood" : 15484, "marble" : 9383 },
            { "wood" : 18167, "marble" : 11273 },
            { "wood" : 21299, "marble" : 13543 },
            { "wood" : 24946, "marble" : 16263 },
            { "wood" : 29245, "marble" : 19531 },
            { "wood" : 34247, "marble" : 23450 },
            { "wood" : 40096, "marble" : 28154 },
            { "wood" : 46930, "marble" : 33798 }    // level 32
        ],

        // embassy, wood, marble
        "embassy" : [
            { "wood" : 415, "marble" : 342 },
            { "wood" : 623, "marble" : 571 },
            { "wood" : 873, "marble" : 850 },
            { "wood" : 1173, "marble" : 1190 },
            { "wood" : 1532, "marble" : 1606 },
            { "wood" : 1964, "marble" : 2112 },
            { "wood" : 2482, "marble" : 2730 },
            { "wood" : 3103, "marble" : 3484 },
            { "wood" : 3849, "marble" : 4404 },
            { "wood" : 4743, "marble" : 5527 },
            { "wood" : 5817, "marble" : 6896 },
            { "wood" : 7105, "marble" : 8566 },
            { "wood" : 8651, "marble" : 10604 },
            { "wood" : 10507, "marble" : 13090 },
            { "wood" : 12733, "marble" : 16123 },
            { "wood" : 15404, "marble" : 19824 },
            { "wood" : 18498, "marble" : 24339 },
            { "wood" : 22457, "marble" : 29846 },
            { "wood" : 27074, "marble" : 36564 },
            { "wood" : 32290, "marble" : 45216 },
            { "wood" : 39261, "marble" : 54769 },
            { "wood" : 47240, "marble" : 66733 },
            { "wood" : 56812, "marble" : 81859 },
            { "wood" : 70157, "marble" : 104537 },
            { "wood" : 84318, "marble" : 129580 },
            { "wood" : 101310, "marble" : 158759 },
            { "wood" : 121979, "marble" : 193849 },
            { "wood" : 146503, "marble" : 236659 },
            { "wood" : 175932, "marble" : 288888 },
            { "wood" : 222202, "marble" : 358869 },
            { "wood" : 266778, "marble" : 437985 }    // level 32
        ],

        // stonemason, wood, marble
        "stonemason" : [
            { "wood" : 467, "marble" : 116 },
            { "wood" : 718, "marble" : 255 },
            { "wood" : 1045, "marble" : 436 },
            { "wood" : 1469, "marble" : 671 },
            { "wood" : 2021, "marble" : 977 },
            { "wood" : 2738, "marble" : 1375 },
            { "wood" : 3671, "marble" : 1892 },
            { "wood" : 4883, "marble" : 2564 },
            { "wood" : 6459, "marble" : 3437 },
            { "wood" : 8508, "marble" : 4572 },
            { "wood" : 11172, "marble" : 6049 },
            { "wood" : 14634, "marble" : 7968 },
            { "wood" : 19135, "marble" : 10462 },
            { "wood" : 24987, "marble" : 13705 },
            { "wood" : 32594, "marble" : 17921 },
            { "wood" : 42483, "marble" : 23402 },
            { "wood" : 55339, "marble" : 30527 },
            { "wood" : 72050, "marble" : 39790 },
            { "wood" : 93778, "marble" : 51830 },
            { "wood" : 122021, "marble" : 67485 },
            { "wood" : 158740, "marble" : 87833 },
            { "wood" : 206471, "marble" : 114289 },
            { "wood" : 268524, "marble" : 148680 }    // level 24
        ],

        // fireworker, wood, marble
        "fireworker" : [
            { "wood" : 353, "marble" : 212 },
            { "wood" : 445, "marble" : 302 },
            { "wood" : 551, "marble" : 405 },
            { "wood" : 673, "marble" : 526 },
            { "wood" : 813, "marble" : 665 },
            { "wood" : 974, "marble" : 827 },
            { "wood" : 1159, "marble" : 1015 },
            { "wood" : 1373, "marble" : 1233 },
            { "wood" : 1618, "marble" : 1486 },
            { "wood" : 1899, "marble" : 1779 },
            { "wood" : 2223, "marble" : 2120 },
            { "wood" : 2596, "marble" : 2514 },
            { "wood" : 3025, "marble" : 2972 },
            { "wood" : 3517, "marble" : 3503 },
            { "wood" : 4084, "marble" : 4119 },
            { "wood" : 4737, "marble" : 4834 },
            { "wood" : 5487, "marble" : 5663 },
            { "wood" : 6347, "marble" : 6624 },
            { "wood" : 7339, "marble" : 7739 },
            { "wood" : 8480, "marble" : 9033 },
            { "wood" : 9791, "marble" : 10534 },
            { "wood" : 11298, "marble" : 12275 },
            { "wood" : 13031, "marble" : 14295 },
            { "wood" : 15025, "marble" : 16637 },
            { "wood" : 17318, "marble" : 19355 },
            { "wood" : 19955, "marble" : 22508 },
            { "wood" : 22987, "marble" : 26164 }    // level 28
        ],

        // winegrower, wood, marble
        "winegrower" : [
            { "wood" : 467, "marble" : 116 },
            { "wood" : 718, "marble" : 255 },
            { "wood" : 1045, "marble" : 436 },
            { "wood" : 1469, "marble" : 671 },
            { "wood" : 2021, "marble" : 977 },
            { "wood" : 2738, "marble" : 1375 },
            { "wood" : 3671, "marble" : 1892 },
            { "wood" : 4883, "marble" : 2564 },
            { "wood" : 6459, "marble" : 3437 },
            { "wood" : 8508, "marble" : 4572 },
            { "wood" : 11172, "marble" : 6049 },
            { "wood" : 14634, "marble" : 7968 },
            { "wood" : 19135, "marble" : 10462 },
            { "wood" : 24987, "marble" : 13705 },
            { "wood" : 32594, "marble" : 17921 },
            { "wood" : 42484, "marble" : 23402 },
            { "wood" : 55339, "marble" : 30527 },
            { "wood" : 72052, "marble" : 39791 },
            { "wood" : 93778, "marble" : 51830 },
            { "wood" : 122021, "marble" : 67485 }    // level 21
        ],

        // vineyard, wood, marble
        "vineyard" : [
            { "wood" : 423, "marble" : 198 },
            { "wood" : 520, "marble" : 285 },
            { "wood" : 631, "marble" : 387 },
            { "wood" : 758, "marble" : 504 },
            { "wood" : 905, "marble" : 640 },
            { "wood" : 1074, "marble" : 798 },
            { "wood" : 1269, "marble" : 981 },
            { "wood" : 1492, "marble" : 1194 },
            { "wood" : 1749, "marble" : 1440 },
            { "wood" : 2045, "marble" : 1726 },
            { "wood" : 2384, "marble" : 2058 },
            { "wood" : 2775, "marble" : 2443 },
            { "wood" : 3225, "marble" : 2889 },
            { "wood" : 3741, "marble" : 3407 },
            { "wood" : 4336, "marble" : 4008 },
            { "wood" : 5019, "marble" : 4705 },
            { "wood" : 5813, "marble" : 5513 },
            { "wood" : 6875, "marble" : 6450 },
            { "wood" : 7941, "marble" : 7537 },
            { "wood" : 8944, "marble" : 8800 },
            { "wood" : 10319, "marble" : 10263 },
            { "wood" : 11900, "marble" : 11961 },
            { "wood" : 13718, "marble" : 13930 },
            { "wood" : 15809, "marble" : 16214 },
            { "wood" : 18215, "marble" : 18864 },
            { "wood" : 20978, "marble" : 21938 },
            { "wood" : 24159, "marble" : 25503 },
            { "wood" : 27816, "marble" : 29639 },
            { "wood" : 32021, "marble" : 34437 },
            { "wood" : 36857, "marble" : 40002 },
            { "wood" : 42419, "marble" : 46457 }    // level 32
        ],

        // tavern, wood, marble
        "tavern" : [
            { "wood" : 222, "marble" : 0 },
            { "wood" : 367, "marble" : 0 },
            { "wood" : 541, "marble" : 94 },
            { "wood" : 750, "marble" : 122 },
            { "wood" : 1001, "marble" : 158 },
            { "wood" : 1302, "marble" : 206 },
            { "wood" : 1663, "marble" : 267 },
            { "wood" : 2097, "marble" : 348 },
            { "wood" : 2617, "marble" : 452 },
            { "wood" : 3241, "marble" : 587 },
            { "wood" : 3990, "marble" : 764 },
            { "wood" : 4888, "marble" : 993 },
            { "wood" : 5967, "marble" : 1290 },
            { "wood" : 7261, "marble" : 1677 },
            { "wood" : 8814, "marble" : 2181 },
            { "wood" : 10678, "marble" : 2835 },
            { "wood" : 12914, "marble" : 3685 },
            { "wood" : 15598, "marble" : 4791 },
            { "wood" : 18818, "marble" : 6228 },
            { "wood" : 22683, "marble" : 8097 },
            { "wood" : 27320, "marble" : 10526 },
            { "wood" : 32885, "marble" : 13684 },
            { "wood" : 39562, "marble" : 17789 },
            { "wood" : 47576, "marble" : 23125 },
            { "wood" : 57192, "marble" : 30063 },
            { "wood" : 68731, "marble" : 39082 },
            { "wood" : 82578, "marble" : 50806 },
            { "wood" : 99194, "marble" : 66048 },
            { "wood" : 119134, "marble" : 85862 },
            { "wood" : 143061, "marble" : 111621 },
            { "wood" : 171774, "marble" : 145107 },
            { "wood" : 206230, "marble" : 188640 },
            { "wood" : 247577, "marble" : 245231 }    // level 34
        ],

        // alchemist, wood, marble
        "alchemist" : [
            { "wood" : 467, "marble" : 116 },
            { "wood" : 718, "marble" : 255 },
            { "wood" : 1045, "marble" : 436 },
            { "wood" : 1469, "marble" : 671 },
            { "wood" : 2021, "marble" : 977 },
            { "wood" : 2738, "marble" : 1375 },
            { "wood" : 3671, "marble" : 1892 },
            { "wood" : 4883, "marble" : 2564 },
            { "wood" : 6459, "marble" : 3437 },
            { "wood" : 8508, "marble" : 4572 },
            { "wood" : 11172, "marble" : 6049 },
            { "wood" : 14634, "marble" : 7968 },
            { "wood" : 19135, "marble" : 10462 },
            { "wood" : 24987, "marble" : 13705 },
            { "wood" : 32594, "marble" : 17921 },
            { "wood" : 42483, "marble" : 23402 },
            { "wood" : 55339, "marble" : 30527 },
            { "wood" : 72050, "marble" : 39790 },
            { "wood" : 93778, "marble" : 51830 },
            { "wood" : 122021, "marble" : 67485 }    // level 21
        ],
        
        // branchOffice, 
        "branchOffice" : [
            { "wood" : 173, "marble" : 0 },
            { "wood" : 346, "marble" : 0 },
            { "wood" : 581, "marble" : 0 },
            { "wood" : 896, "marble" : 540 },
            { "wood" : 1314, "marble" : 792 },
            { "wood" : 1863, "marble" : 1123 },
            { "wood" : 2580, "marble" : 1555 },
            { "wood" : 3509, "marble" : 2115 },
            { "wood" : 4706, "marble" : 2837 },
            { "wood" : 6241, "marble" : 3762 },
            { "wood" : 8203, "marble" : 4945 },
            { "wood" : 10699, "marble" : 6450 },
            { "wood" : 13866, "marble" : 8359 },
            { "wood" : 17872, "marble" : 10774 },
            { "wood" : 22926, "marble" : 13820 },
            { "wood" : 29286, "marble" : 17654 },
            { "wood" : 37272, "marble" : 22469 },
            { "wood" : 47282, "marble" : 28502 },
            { "wood" : 59806, "marble" : 36051 },
            { "wood" : 75448, "marble" : 45481 }    // level 21
        ]
    };