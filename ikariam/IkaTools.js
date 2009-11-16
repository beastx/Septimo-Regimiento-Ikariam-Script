// ==UserScript==
// @name                  Ikariam Script Tools
// @version               0.2
// @author                Beastx
//
// @history                0.2 Improve addInfoBox method (added beforeElement paramter)
// @history                0.1 Initial release
//
// ==/UserScript==


IkariamTools = function() {};

IkariamTools.prototype.init = function() {
    this.version = 1;
    this.debugMode =  Beastx.Config.options.debugMode;
    this.postUrl = Beastx.Config.postUrl;
    this.cities = New(Beastx.CitiesList);
    this.player = New(Beastx.PlayerObject);
    this.alliance = New(Beastx.AllianceObject);
    
    this.data = {
        ikariam: { domain: document.domain, lang: '', version: '' },
        resourceNames: { 1: 'wine', 2: 'marble', 3: 'sulfur', 4: 'glass', 5: 'wood' },
        buildingNames: { 1: 'townHall', 2: 'academy', 3: 'port', 4: 'shipyard', 5: 'warehouse', 6: 'wall', 7: 'tavern', 8: 'museum', 9: 'palace', 10: 'palaceColony', 11: 'embassy', 12: 'safehouse', 13: 'barracks', 14: 'workshop', 15: 'carpentering', 16: 'forester', 17: 'stonemason', 18: 'winegrower', 19: 'alchemist', 20: 'architect', 21: 'vineyard', 22: 'fireworker', 23: 'optician', 24: 'glassblowing', 25: 'temple' }
    };
    
    var me = this;
    unsafeWindow.onbeforeunload = function(event) { me.saveData(); }
    
    Beastx.log(this, null, 'ikatools');
};

IkariamTools.prototype.sendInfoToServer = function(serverClassName, data, onLoadCallback) {
    DOM.post(
        this.postUrl,
        { className: serverClassName, action: 'save', params: data },
        function(response) {
            if (onLoadCallback) {
                onLoadCallback(response);
            }
        }
    );
}

IkariamTools.prototype.loadData = function() {
    this.cities.loadCitiesData();
    this.player.loadData();
    this.alliance.loadData();

    var currentView = this.getView();
    if (this[currentView + 'View']) {
        this[currentView + 'View']();
    } else {
        Beastx.log('implementar esta vista: ' + currentView);
    }
}

IkariamTools.prototype.saveData = function(event) {
    this.cities.saveCities();
    this.player.saveData();
}


/***************************************************************
*************** Several Views Data loaders ******************
***************************************************************/

IkariamTools.prototype.diplomacyAdvisorAllyView = function() {
    function getPlayerObjectFromElement(element) {
        if (element.childNodes[11].childNodes[0].childNodes[0]) {
            var playerObj = New(Beastx.PlayerObject, [ getQueryString('receiverId', element.childNodes[11].childNodes[0].childNodes[0].href) ])
            playerObj.setData({
                name: element.childNodes[3].childNodes[0].textContent
            });
            return playerObj;
        }
        return null;
    }
    var tableInfo = $('allyinfo');
    var pointsInfo = $('allyinfo').childNodes[1].childNodes[7].childNodes[2].childNodes[0].textContent;
    
    var players = VAR.filter($$('table#memberList tbody tr'), getPlayerObjectFromElement);
    players.push(this.player);
    
    this.alliance.setData({
        id: getQueryString('allyId', $('allyinfo').childNodes[1].childNodes[15].childNodes[2].childNodes[0].href),
        name: $('allyinfo').childNodes[1].childNodes[1].childNodes[2].childNodes[0].textContent,
        tag: '',
        players: players,
        totalPoints: parseInt(pointsInfo.split(' ')[1].replace('(', '').replace(')', '').replace(/,/g, '') / 100),
        ranking: pointsInfo.split(' ')[0]
    });
    
    this.alliance.saveData();
    
    Beastx.todo('controlar los miembros nuevos y los miembros que no estan mas en la alianza', this);
}

IkariamTools.prototype.optionsView = function() {
    this.player.setData({
        id: $$('div#options_debug table tr')[0].childNodes[3].childNodes[0].nodeValue.trim(),
        name: $$('div#options_userData input.textfield')[0].value,
        cities: this.cities
    });
    this.player.saveData();
}

IkariamTools.prototype.cityView = function() {
    var cities = this.cities.getAllCities();
    for (var i = 0; i < cities.length; ++i) {
        //~ Beastx.log(cities[i].getAllAvailableResources(), cities[i].getName());
        //~ Beastx.log(cities[i].getAllAvailableBuildingsForUpgrade(), cities[i].getName());
    }
}

IkariamTools.prototype.resourceView = function() {
    //~ Beastx.log('agregar un listener al boton de confirmar y actualizar los datos de production de la city: ' + this.cities.getCurrentCity().getName())
}

IkariamTools.prototype.tradegoodView = function() {
    //~ Beastx.log('agregar un listener al boton de confirmar y actualizar los datos de production de la city: ' + this.cities.getCurrentCity().getName())
}

IkariamTools.prototype.islandView = function() {
    Beastx.log('obetener la lista de ciudades, y sus players y sus miembros')
}

IkariamTools.prototype.tavernView = function() {
    var selectElement = $('wineAmount');
    var wineConsumption = parseInt(selectElement.options[selectElement.selectedIndex].textContent.match(/^\d+/).toString().replace(/(,|\.)/g, ''));
    this.cities.getCurrentCity().setData({
        wineConsumption: wineConsumption
    });
}

IkariamTools.prototype.financesView = function() {
    Beastx.log('leer los datos y actualizar los datos de production de oro de todas las cities')
    var rows = $$('#balance tr');
    var cities = this.cities.getAllCities();
    for (var i = 0; i < cities.length; ++i) {
        var cityName = rows[i +1].childNodes[1].childNodes[0].textContent.trim();
        var city = this.cities.getCityByName(cityName);
        var tempProduction = city.getProduction();
        tempProduction.goldIncome = parseInt(rows[i +1].childNodes[3].childNodes[0].textContent.trim().replace(',', ''));
        tempProduction.goldUpkeep = parseInt(rows[i +1].childNodes[5].childNodes[0].textContent.trim().replace(',', ''));
        tempProduction.goldTotal = parseInt(rows[i +1].childNodes[7].childNodes[0].textContent.trim().replace(',', ''));
        city.setData({ production: tempProduction });
    }
}

IkariamTools.prototype.townHallView = function() {
    var city = this.cities.getCurrentCity();
    var data = {
        goldIncome: null,
        goldUpkeep: null,
        goldTotal: parseInt($$('#CityOverview ul.stats li.incomegold span.value')[0].firstChild.nodeValue),
        wood: parseInt($$('#CityOverview div#PopulationGraph div.woodworkers span.production')[0].childNodes[2].nodeValue),
        luxury: parseInt($$('#CityOverview div#PopulationGraph div.specialworkers span.production')[0].childNodes[4].nodeValue),
        research: parseInt($$('#CityOverview div#PopulationGraph div.scientists span.production')[0].childNodes[2].nodeValue),
        population: parseFloat($$('#CityOverview ul.stats li.growth span.value')[0].firstChild.nodeValue),
        corruption: parseFloat($$('#CityOverview ul.stats li.corruption span.value')[0].childNodes[1].textContent.replace(',', '.'))
    };
    city.setData({ production: data });
}


/***************************************************************
********* Change Url and Selected City Helpers *************
***************************************************************/

IkariamTools.prototype.goTo = function(view, cityId) {
    document.body.style.cursor = "wait";
    var loc = 'http://' + this.getDomain() + '/index.php?view=' + view;
    if (typeof(cityId) != 'undefined' && cityId != this.cities.getCurrentCityId()) {
        this.changeCity(cityId);
    }
    unsafeWindow.document.location = loc;
}

IkariamTools.prototype.changeCity = function(city_id) {
    var postdata = "";
    var elems = document.getElementById('changeCityForm').getElementsByTagName('fieldset')[0].getElementsByTagName('input');
    for(var i = 0; i < elems.length; i++) {
        postdata += "&" + elems[i].name + "=" + elems[i].value;
    }
    postdata = postdata + "&cityId="+city_id+"&view=city";
    var xmlhttp;
    if (window.XMLHttpRequest) {
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
    var node = this.getDocument(xmlhttp.responseText);
    return node.getElementsByTagName("input")[2].value;
}


/***************************************************************
********** Getters for Ikariam Common Values **************
***************************************************************/

IkariamTools.prototype.getView = function() {
    return document.body.id; 
}

IkariamTools.prototype.getDomain = function() {
    return this.data.ikariam.domain;
}

IkariamTools.prototype.getBuildingTypeIdFromBuildingName = function(buildingName) {
    for (var id in this.data.buildingNames) {
        var type = this.data.buildingNames[id];
        if (type == buildingName) {
            return id;
        }
    }
    return 0;
}

IkariamTools.prototype.getCurrentIslandId = function() {
    if (!this.currentIslandId) {
        var link = $$('li.viewIsland a')[0].href; 
        this.currentIslandId = link.substr(link.indexOf("id=") + 3);
    }
    return this.currentIslandId;
}


/***************************************************************
************** Remote Documents Helpers ******************
***************************************************************/

IkariamTools.prototype.getRemoteDocument = function(url, callback) {
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
}

IkariamTools.prototype.getDocument = function(responseText) {
   var html = document.createElement("html");
   html.innerHTML = responseText;
   var response = document.implementation.createDocument("", "", null);
   response.appendChild(html);
   return response;
}


/***************************************************************
************* Getters and Setters GM values*****************
***************************************************************/

IkariamTools.prototype.getVal = function(varName) {
    return Beastx.getGMValue('IkariamTools_' + varName);
}

IkariamTools.prototype.setVal = function(varName, varValue) {
    Beastx.setGMValue('IkariamTools_' + varName, varValue);
}


/***************************************************************
***************** Add DOM Blocks Helpers *******************
***************************************************************/

IkariamTools.prototype.addInfoBox = function(title, contentDiv, beforeElement) {
    var box = document.createElement('div');
    box.className = 'dynamic';
    box.innerHTML = '<h3 class="header">Beastx: ' + title + '</h3>';
    contentDiv.className = "content";
    box.appendChild(contentDiv);
    var footer = document.createElement('div');
    footer.className = "footer";
    box.appendChild(footer);
    document.getElementById('mainview').parentNode.insertBefore(box, beforeElement ? beforeElement : document.getElementById('mainview'));
}

IkariamTools.prototype.addOptionBlock = function(title, content) {
    var optionBox = document.createElement('div');
    var contentRandId = 'contentId_' + parseInt(Math.random(999999)*10000000);
    optionBox.innerHTML = '<div class="contentBox01h"><h3 class="header"><span class="textLabel">' + title + '</span></h3><div class="content" id="' + contentRandId + '"></div><div class="footer"/></div></div>';
    var referenceDiv = $$('#mainview .contentBox01h')[1]
    referenceDiv.parentNode.insertBefore(optionBox, referenceDiv);
    var container = $(contentRandId);
    container.appendChild(content);
}


/***************************************************************
*************** Tinkerman Specific Methods *****************
***************************************************************/

IkariamTools.prototype.toString = function() {
    return 'IkariamTools:' + this.getView() + 'View'; 
}



/***************************************************************
************ Common Ikariam Values Database **************
***************************************************************/

IkariamTools.BUILDINGSRESOURCES = {
    palace: [
        { wood: 5824, wine: 0, marble : 1434, glass: 0, sulfur: 0 },
        { wood: 16048, wine: 0, marble : 4546, glass: 0, sulfur: 3089 },
        { wood: 36496, wine: 10898, marble : 10770, glass: 0, sulfur: 10301 },
        { wood: 77392, wine: 22110, marble : 23218, glass: 21188, sulfur: 24725 },
        { wood: 159184, wine: 44534, marble : 48114, glass: 42400, sulfur: 53573 },
        { wood: 322768, wine: 89382, marble : 97906, glass: 84824, sulfur: 111269 },
        { wood: 649936, wine: 179078, marble : 197490, glass: 169672, sulfur: 226661 },
        { wood: 1304272, wine: 358470, marble : 396658, glass: 339368, sulfur: 457445 },
        { wood: 2612944, wine: 717254, marble : 794994, glass: 678760, sulfur: 919013 }    // level 10
    ],
    palaceColony: [
        { wood: 5824, wine: 0, marble : 1434, glass: 0, sulfur: 0 },
        { wood: 16048, wine: 0, marble : 4546, glass: 0, sulfur: 3089 },
        { wood: 36496, wine: 10898, marble : 10770, glass: 0, sulfur: 10301 },
        { wood: 77392, wine: 22110, marble : 23218, glass: 21188, sulfur: 24725 },
        { wood: 159184, wine: 44534, marble : 48114, glass: 42400, sulfur: 53573 },
        { wood: 322768, wine: 89382, marble : 97906, glass: 84824, sulfur: 111269 },
        { wood: 649936, wine: 179078, marble : 197490, glass: 169672, sulfur: 226661 },
        { wood: 1304272, wine: 358470, marble : 396658, glass: 339368, sulfur: 457445 },
        { wood: 2612944, wine: 717254, marble : 794994, glass: 678760, sulfur: 919013 }    // level 10
    ],
    academy: [
        { wood: 68, glass: 0 },
        { wood: 115, glass: 0 },
        { wood: 263, glass: 0 },
        { wood: 382, glass: 225 },
        { wood: 626, glass: 428 },
        { wood: 982, glass: 744 },
        { wood: 1330, glass: 1089 },
        { wood: 2004, glass: 1748 },
        { wood: 2665, glass: 2454 },
        { wood: 3916, glass: 3786 },
        { wood: 5156, glass: 5216 },
        { wood: 7446, glass: 7862 },
        { wood: 9753, glass: 10729 },
        { wood: 12751, glass: 14599 },
        { wood: 18163, glass: 21627 },
        { wood: 23691, glass: 29321 },
        { wood: 33450, glass: 43020 },
        { wood: 43571, glass: 58213 },
        { wood: 56728, glass: 78724 },
        { wood: 73832, glass: 106414 },
        { wood: 103458, glass: 154857 },
        { wood: 144203, glass: 224146 },
        { wood: 175057, glass: 282571 },
        { wood: 243929, glass: 408877 }        // level 25
    ],
    townHall : [
        { wood: 158, marble : 0 },
        { wood: 335, marble : 0 },
        { wood: 623, marble : 0 },
        { wood: 923, marble : 285 },
        { wood: 1390, marble : 551 },
        { wood: 2015, marble : 936 },
        { wood: 2706, marble : 1411 },
        { wood: 3661, marble : 2091 },
        { wood: 4776, marble : 2945 },
        { wood: 6173, marble : 4072 },
        { wood: 8074, marble : 5664 },
        { wood: 10281, marble : 7637 },
        { wood: 13023, marble : 10214 },
        { wood: 16424, marble : 13575 },
        { wood: 20986, marble : 18254 },
        { wood: 25423, marble : 23250 },
        { wood: 32285, marble : 31022 },
        { wood: 40232, marble : 40599 },
        { wood: 49286, marble : 52216 },
        { wood: 61207, marble : 68069 },
        { wood: 74804, marble : 87316 },
        { wood: 93956, marble : 115101 },
        { wood: 113035, marble : 145326 },
        { wood: 141594, marble : 191053 },
        { wood: 170213, marble : 241039 },
        { wood: 210011, marble : 312128 },
        { wood: 258875, marble : 403824 },
        { wood: 314902, marble : 515592 }    // level 29
    ],
    architect : [
        { wood: 291, marble : 160 },
        { wood: 413, marble : 222 },
        { wood: 555, marble : 295 },
        { wood: 720, marble : 379 },
        { wood: 911, marble : 475 },
        { wood: 1133, marble : 587 },
        { wood: 1390, marble : 716 },
        { wood: 1689, marble : 865 },
        { wood: 2035, marble : 1036 },
        { wood: 2437, marble : 1233 },
        { wood: 2902, marble : 1460 },
        { wood: 3443, marble : 1722 },
        { wood: 4070, marble : 2023 },
        { wood: 4797, marble : 2369 },
        { wood: 5640, marble : 2767 },
        { wood: 6618, marble : 3226 },
        { wood: 7754, marble : 3752 },
        { wood: 9070, marble : 4358 },
        { wood: 10598, marble : 5056 },
        { wood: 12369, marble : 5857 },
        { wood: 14424, marble : 6777 },
        { wood: 16807, marble : 7836 },
        { wood: 19573, marble : 9052 },
        { wood: 22780, marble : 10448 },
        { wood: 26501, marble : 12054 },
        { wood: 30817, marble : 13899 },
        { wood: 35825, marble : 16017 },
        { wood: 41631, marble : 18450 },
        { wood: 48371, marble : 21245 },
        { wood: 56185, marble : 24454 },
        { wood: 65251, marble : 28141 }    // level 32
    ],
    safehouse : [
        { wood: 248, marble : 0 },
        { wood: 402, marble : 0 },
        { wood: 578, marble : 129 },
        { wood: 779, marble : 197 },
        { wood: 1007, marble : 275 },
        { wood: 1267, marble : 366 },
        { wood: 1564, marble : 471 },
        { wood: 1903, marble : 593 },
        { wood: 2288, marble : 735 },
        { wood: 2728, marble : 900 },
        { wood: 3230, marble : 1090 },
        { wood: 3801, marble : 1312 },
        { wood: 4453, marble : 1569 },
        { wood: 5195, marble : 1866 },
        { wood: 6042, marble : 2212 },
        { wood: 7007, marble : 2613 },
        { wood: 8107, marble : 3078 },
        { wood: 9547, marble : 3617 },
        { wood: 10793, marble : 4242 },
        { wood: 12422, marble : 4967 },
        { wood: 14282, marble : 5810 },
        { wood: 16400, marble : 6785 },
        { wood: 18815, marble : 7919 },
        { wood: 21570, marble : 9233 },
        { wood: 24708, marble : 10757 },
        { wood: 29488, marble : 12526 },
        { wood: 33741, marble : 14577 },
        { wood: 38589, marble : 16956 },
        { wood: 44115, marble : 19715 },
        { wood: 46585, marble : 21399 },
        { wood: 53221, marble : 24867 }    // level 32
    ],
    wall : [
        { wood: 361, marble : 203 },
        { wood: 657, marble : 516 },
        { wood: 1012, marble : 892 },
        { wood: 1439, marble : 1344 },
        { wood: 1951, marble : 1885 },
        { wood: 2565, marble : 2535 },
        { wood: 3302, marble : 3315 },
        { wood: 4186, marble : 4251 },
        { wood: 5247, marble : 5374 },
        { wood: 6521, marble : 6721 },
        { wood: 8049, marble : 8338 },
        { wood: 9882, marble : 10279 },
        { wood: 12083, marble : 12608 },
        { wood: 14724, marble : 15402 },
        { wood: 17892, marble : 18755 },
        { wood: 21695, marble : 22779 },
        { wood: 26258, marble : 27607 },
        { wood: 31733, marble : 33402 },
        { wood: 38304, marble : 40355 },
        { wood: 46189, marble : 48699 },
        { wood: 55650, marble : 58711 },
        { wood: 67004, marble : 70726 },
        { wood: 80629, marble : 85144 },
        { wood: 96979, marble : 102446 },
        { wood: 116599, marble : 123208 },
        { wood: 140143, marble : 148122 },
        { wood: 168395, marble : 178019 },
        { wood: 202298, marble : 213896 },
        { wood: 242982, marble : 256948 },
        { wood: 291802, marble : 308610 },
        { wood: 350387, marble : 370605 }    // level 32
    ],
    shipyard : [
        { wood: 202, marble : 0 },
        { wood: 324, marble : 0 },
        { wood: 477, marble : 0 },
        { wood: 671, marble : 0 },
        { wood: 914, marble : 778 },
        { wood: 1222, marble : 1052 },
        { wood: 1609, marble : 1397 },
        { wood: 2096, marble : 1832 },
        { wood: 2711, marble : 2381 },
        { wood: 3485, marble : 3071 },
        { wood: 4460, marble : 3942 },
        { wood: 5689, marble : 5038 },
        { wood: 7238, marble : 6420 },
        { wood: 9190, marble : 8161 },
        { wood: 11648, marble : 10354 },
        { wood: 14745, marble : 13117 },
        { wood: 18650, marble : 16600 },
        { wood: 23568, marble : 20989 },
        { wood: 29765, marble : 26517 },
        { wood: 37572, marble : 33484 },
        { wood: 47412, marble : 42261 },
        { wood: 59807, marble : 53321 },
        { wood: 75428, marble : 67256 },
        { wood: 95107, marble : 84814 }    // level 25
    ],
    port : [
        { wood: 150, marble : 0 },
        { wood: 274, marble : 0 },
        { wood: 429, marble : 0 },
        { wood: 637, marble : 0 },
        { wood: 894, marble : 176 },
        { wood: 1207, marble : 326 },
        { wood: 1645, marble : 540 },
        { wood: 2106, marble : 791 },
        { wood: 2735, marble : 1138 },
        { wood: 3537, marble : 1598 },
        { wood: 4492, marble : 2176 },
        { wood: 5689, marble : 2928 },
        { wood: 7103, marble : 3859 },
        { wood: 8850, marble : 5051 },
        { wood: 11094, marble : 6628 },
        { wood: 13731, marble : 8566 },
        { wood: 17062, marble : 11089 },
        { wood: 21097, marble : 14265 },
        { wood: 25965, marble : 18241 },
        { wood: 31810, marble : 23197 },
        { wood: 39190, marble : 29642 },
        { wood: 47998, marble : 37636 },
        { wood: 58713, marble : 47703 },
        { wood: 71955, marble : 60556 },
        { wood: 87627, marble : 76366 },
        { wood: 94250, marble : 85042 }    // level 27
    ],
    glassblowing : [
        { wood: 467, marble : 116 },
        { wood: 718, marble : 255 },
        { wood: 1045, marble : 436 },
        { wood: 1469, marble : 671 },
        { wood: 2021, marble : 977 },
        { wood: 2738, marble : 1375 },
        { wood: 3671, marble : 1892 },
        { wood: 4883, marble : 2564 },
        { wood: 6459, marble : 3437 },
        { wood: 8508, marble : 4572 },
        { wood: 11172, marble : 6049 },
        { wood: 14634, marble : 7968 },
        { wood: 19135, marble : 10462 },
        { wood: 24987, marble : 13705 },
        { wood: 32594, marble : 17921 },
        { wood: 42483, marble : 23402 },
        { wood: 55339, marble : 30527 },
        { wood: 72050, marble : 39790 },
        { wood: 93778, marble : 51830 },
        { wood: 122021, marble : 67485 }    // level 21
    ],
    warehouse : [
        { wood: 288, marble : 0 },
        { wood: 442, marble : 0 },
        { wood: 626, marble : 96 },
        { wood: 847, marble : 211 },
        { wood: 1113, marble : 349 },
        { wood: 1431, marble : 515 },
        { wood: 1813, marble : 714 },
        { wood: 2272, marble : 953 },
        { wood: 2822, marble : 1240 },
        { wood: 3483, marble : 1584 },
        { wood: 4275, marble : 1997 },
        { wood: 5226, marble : 2492 },
        { wood: 6368, marble : 3086 },
        { wood: 7737, marble : 3800 },
        { wood: 9380, marble : 4656 },
        { wood: 11353, marble : 5683 },
        { wood: 13719, marble : 6915 },
        { wood: 16559, marble : 8394 },
        { wood: 19967, marble : 10169 },
        { wood: 24056, marble : 12299 },
        { wood: 28963, marble : 14855 },
        { wood: 34852, marble : 17922 },
        { wood: 41918, marble : 21602 },
        { wood: 50398, marble : 26019 },
        { wood: 60574, marble : 31319 },
        { wood: 72784, marble : 37678 },
        { wood: 87437, marble : 45310 },
        { wood: 105021, marble : 54468 },
        { wood: 126121, marble : 65458 },
        { wood: 151441, marble : 78645 },
        { wood: 181825, marble : 94471 },
        { wood: 218286, marble : 113461 },
        { wood: 262039, marble : 136249 },
        { wood: 314543, marble : 163595 },
        { wood: 377548, marble : 196409 },
        { wood: 453153, marble : 235787 },
        { wood: 543880, marble : 283041 },
        { wood: 652752, marble : 339745 },
        { wood: 783398, marble : 407790 }    // level 40
    ],
    museum : [
        { wood: 1435, marble : 1190 },
        { wood: 2748, marble : 2573 },
        { wood: 4716, marble : 4676 },
        { wood: 7669, marble : 7871 },
        { wood: 12099, marble : 12729 },
        { wood: 18744, marble : 20112 },
        { wood: 28710, marble : 31335 },
        { wood: 43661, marble : 48394 },
        { wood: 66086, marble : 74323 },
        { wood: 99724, marble : 113736 },
        { wood: 150181, marble : 173643 },
        { wood: 225866, marble : 264701 },
        { wood: 339394, marble : 403110 },
        { wood: 509686, marble : 613492 },
        { wood: 765124, marble : 933272 }    // level 16
    ],
    workshop : [
        { wood: 383, marble : 167 },
        { wood: 569, marble : 251 },
        { wood: 781, marble : 349 },
        { wood: 1023, marble : 461 },
        { wood: 1299, marble : 592 },
        { wood: 1613, marble : 744 },
        { wood: 1972, marble : 920 },
        { wood: 2380, marble : 1125 },
        { wood: 2846, marble : 1362 },
        { wood: 3377, marble : 1637 },
        { wood: 3982, marble : 1956 },
        { wood: 4672, marble : 2326 },
        { wood: 5458, marble : 2755 },
        { wood: 6355, marble : 3253 },
        { wood: 7377, marble : 3831 },
        { wood: 8542, marble : 4500 },
        { wood: 9870, marble : 5279 },
        { wood: 11385, marble : 6180 },
        { wood: 13111, marble : 7226 },
        { wood: 15078, marble : 8439 },
        { wood: 17714, marble : 9776 },
        { wood: 19481, marble : 11477 },
        { wood: 22796, marble : 13373 },
        { wood: 26119, marble : 15570 },
        { wood: 29909, marble : 18118 },
        { wood: 34228, marble : 21074 },
        { wood: 39153, marble : 24503 },
        { wood: 0, marble : 0 },
        { wood: 0, marble : 0 },
        { wood: 58462, marble : 38447 }    // level 31
    ],
    forester : [
        { wood: 430, marble : 104 },
        { wood: 664, marble : 237 },
        { wood: 968, marble : 410 },
        { wood: 1364, marble : 635 },
        { wood: 1878, marble : 928 },
        { wood: 2546, marble : 1309 },
        { wood: 3415, marble : 1803 },
        { wood: 4544, marble : 2446 },
        { wood: 6013, marble : 3282 },
        { wood: 7922, marble : 4368 },
        { wood: 10403, marble : 5781 },
        { wood: 13629, marble : 7617 },
        { wood: 17823, marble : 10422 },
        { wood: 23274, marble : 13108 },
        { wood: 30362, marble : 17142 },
        { wood: 39574, marble : 22386 },
        { wood: 51552, marble : 29204 },
        { wood: 67123, marble : 38068 },
        { wood: 87363, marble : 49589 },
        { wood: 113680, marble : 64569 },
        { wood: 160157, marble : 91013 }    // level 22
    ],
    optician : [
        { wood: 188, marble : 35 },
        { wood: 269, marble : 96 },
        { wood: 362, marble : 167 },
        { wood: 471, marble : 249 },
        { wood: 597, marble : 345 },
        { wood: 742, marble : 455 },
        { wood: 912, marble : 584 },
        { wood: 1108, marble : 733 },
        { wood: 1335, marble : 905 },
        { wood: 1600, marble : 1106 },
        { wood: 1906, marble : 1338 },
        { wood: 2261, marble : 1608 },
        { wood: 2673, marble : 1921 },
        { wood: 3152, marble : 2283 },
        { wood: 3706, marble : 2704 },
        { wood: 4348, marble : 3191 },
        { wood: 5096, marble : 3759 },
        { wood: 5962, marble : 4416 },
        { wood: 6966, marble : 5178 },
        { wood: 8131, marble : 6062 },
        { wood: 9482, marble : 7087 },
        { wood: 11050, marble : 8276 },
        { wood: 12868, marble : 9656 },
        { wood: 14978, marble : 11257 },
        { wood: 17424, marble : 13113 },
        { wood: 20262, marble : 15267 },
        { wood: 23553, marble : 17762 },
        { wood: 27373, marble : 20662 },
        { wood: 31804, marble : 24024 },
        { wood: 36943, marble : 27922 },
        { wood: 42904, marble : 32447 }    // level 32
    ],
    barracks : [
        { wood: 114, marble : 0 },
        { wood: 195, marble : 0 },
        { wood: 296, marble : 0 },
        { wood: 420, marble : 0 },
        { wood: 574, marble : 0 },
        { wood: 766, marble : 0 },
        { wood: 1003, marble : 0 },
        { wood: 1297, marble : 178 },
        { wood: 1662, marble : 431 },
        { wood: 2115, marble : 745 },
        { wood: 2676, marble : 1134 },
        { wood: 3371, marble : 1616 },
        { wood: 4234, marble : 2214 },
        { wood: 5304, marble : 2956 },
        { wood: 6630, marble : 3875 },
        { wood: 8275, marble : 5015 },
        { wood: 10314, marble : 6429 },
        { wood: 12843, marble : 8183 },
        { wood: 15979, marble : 10357 },
        { wood: 19868, marble : 13052 },
        { wood: 24690, marble : 16395 },
        { wood: 30669, marble : 20540 },
        { wood: 38083, marble : 25680 },
        { wood: 47277, marble : 32054 },
        { wood: 58772, marble : 39957 },
        { wood: 72932, marble : 49839 },
        { wood: 90490, marble : 61909 },
        { wood: 0, marble : 0 },
        { wood: 158796, marble : 109259 },
        { wood: 186750, marble : 128687 }    // level 31
    ],
    carpentering : [
        { wood: 122, marble : 0 },
        { wood: 192, marble : 0 },
        { wood: 274, marble : 0 },
        { wood: 372, marble : 0 },
        { wood: 486, marble : 0 },
        { wood: 620, marble : 0 },
        { wood: 777, marble : 359 },
        { wood: 962, marble : 444 },
        { wood: 1178, marble : 546 },
        { wood: 1432, marble : 669 },
        { wood: 1730, marble : 816 },
        { wood: 2078, marble : 993 },
        { wood: 2486, marble : 1205 },
        { wood: 2964, marble : 1459 },
        { wood: 3524, marble : 1765 },
        { wood: 4178, marble : 2131 },
        { wood: 4944, marble : 2571 },
        { wood: 5841, marble : 3097 },
        { wood: 6890, marble : 3731 },
        { wood: 8117, marble : 4490 },
        { wood: 9550, marble : 5402 },
        { wood: 11229, marble : 6496 },
        { wood: 13190, marble : 7809 },
        { wood: 15484, marble : 9383 },
        { wood: 18167, marble : 11273 },
        { wood: 21299, marble : 13543 },
        { wood: 24946, marble : 16263 },
        { wood: 29245, marble : 19531 },
        { wood: 34247, marble : 23450 },
        { wood: 40096, marble : 28154 },
        { wood: 46930, marble : 33798 }    // level 32
    ],
    embassy : [
        { wood: 415, marble : 342 },
        { wood: 623, marble : 571 },
        { wood: 873, marble : 850 },
        { wood: 1173, marble : 1190 },
        { wood: 1532, marble : 1606 },
        { wood: 1964, marble : 2112 },
        { wood: 2482, marble : 2730 },
        { wood: 3103, marble : 3484 },
        { wood: 3849, marble : 4404 },
        { wood: 4743, marble : 5527 },
        { wood: 5817, marble : 6896 },
        { wood: 7105, marble : 8566 },
        { wood: 8651, marble : 10604 },
        { wood: 10507, marble : 13090 },
        { wood: 12733, marble : 16123 },
        { wood: 15404, marble : 19824 },
        { wood: 18498, marble : 24339 },
        { wood: 22457, marble : 29846 },
        { wood: 27074, marble : 36564 },
        { wood: 32290, marble : 45216 },
        { wood: 39261, marble : 54769 },
        { wood: 47240, marble : 66733 },
        { wood: 56812, marble : 81859 },
        { wood: 70157, marble : 104537 },
        { wood: 84318, marble : 129580 },
        { wood: 101310, marble : 158759 },
        { wood: 121979, marble : 193849 },
        { wood: 146503, marble : 236659 },
        { wood: 175932, marble : 288888 },
        { wood: 222202, marble : 358869 },
        { wood: 266778, marble : 437985 }    // level 32
    ],
    stonemason : [
        { wood: 467, marble : 116 },
        { wood: 718, marble : 255 },
        { wood: 1045, marble : 436 },
        { wood: 1469, marble : 671 },
        { wood: 2021, marble : 977 },
        { wood: 2738, marble : 1375 },
        { wood: 3671, marble : 1892 },
        { wood: 4883, marble : 2564 },
        { wood: 6459, marble : 3437 },
        { wood: 8508, marble : 4572 },
        { wood: 11172, marble : 6049 },
        { wood: 14634, marble : 7968 },
        { wood: 19135, marble : 10462 },
        { wood: 24987, marble : 13705 },
        { wood: 32594, marble : 17921 },
        { wood: 42483, marble : 23402 },
        { wood: 55339, marble : 30527 },
        { wood: 72050, marble : 39790 },
        { wood: 93778, marble : 51830 },
        { wood: 122021, marble : 67485 },
        { wood: 158740, marble : 87833 },
        { wood: 206471, marble : 114289 },
        { wood: 268524, marble : 148680 }    // level 24
    ],
    fireworker : [
        { wood: 353, marble : 212 },
        { wood: 445, marble : 302 },
        { wood: 551, marble : 405 },
        { wood: 673, marble : 526 },
        { wood: 813, marble : 665 },
        { wood: 974, marble : 827 },
        { wood: 1159, marble : 1015 },
        { wood: 1373, marble : 1233 },
        { wood: 1618, marble : 1486 },
        { wood: 1899, marble : 1779 },
        { wood: 2223, marble : 2120 },
        { wood: 2596, marble : 2514 },
        { wood: 3025, marble : 2972 },
        { wood: 3517, marble : 3503 },
        { wood: 4084, marble : 4119 },
        { wood: 4737, marble : 4834 },
        { wood: 5487, marble : 5663 },
        { wood: 6347, marble : 6624 },
        { wood: 7339, marble : 7739 },
        { wood: 8480, marble : 9033 },
        { wood: 9791, marble : 10534 },
        { wood: 11298, marble : 12275 },
        { wood: 13031, marble : 14295 },
        { wood: 15025, marble : 16637 },
        { wood: 17318, marble : 19355 },
        { wood: 19955, marble : 22508 },
        { wood: 22987, marble : 26164 }    // level 28
    ],
    winegrower : [
        { wood: 467, marble : 116 },
        { wood: 718, marble : 255 },
        { wood: 1045, marble : 436 },
        { wood: 1469, marble : 671 },
        { wood: 2021, marble : 977 },
        { wood: 2738, marble : 1375 },
        { wood: 3671, marble : 1892 },
        { wood: 4883, marble : 2564 },
        { wood: 6459, marble : 3437 },
        { wood: 8508, marble : 4572 },
        { wood: 11172, marble : 6049 },
        { wood: 14634, marble : 7968 },
        { wood: 19135, marble : 10462 },
        { wood: 24987, marble : 13705 },
        { wood: 32594, marble : 17921 },
        { wood: 42484, marble : 23402 },
        { wood: 55339, marble : 30527 },
        { wood: 72052, marble : 39791 },
        { wood: 93778, marble : 51830 },
        { wood: 122021, marble : 67485 }    // level 21
    ],
    vineyard : [
        { wood: 423, marble : 198 },
        { wood: 520, marble : 285 },
        { wood: 631, marble : 387 },
        { wood: 758, marble : 504 },
        { wood: 905, marble : 640 },
        { wood: 1074, marble : 798 },
        { wood: 1269, marble : 981 },
        { wood: 1492, marble : 1194 },
        { wood: 1749, marble : 1440 },
        { wood: 2045, marble : 1726 },
        { wood: 2384, marble : 2058 },
        { wood: 2775, marble : 2443 },
        { wood: 3225, marble : 2889 },
        { wood: 3741, marble : 3407 },
        { wood: 4336, marble : 4008 },
        { wood: 5019, marble : 4705 },
        { wood: 5813, marble : 5513 },
        { wood: 6875, marble : 6450 },
        { wood: 7941, marble : 7537 },
        { wood: 8944, marble : 8800 },
        { wood: 10319, marble : 10263 },
        { wood: 11900, marble : 11961 },
        { wood: 13718, marble : 13930 },
        { wood: 15809, marble : 16214 },
        { wood: 18215, marble : 18864 },
        { wood: 20978, marble : 21938 },
        { wood: 24159, marble : 25503 },
        { wood: 27816, marble : 29639 },
        { wood: 32021, marble : 34437 },
        { wood: 36857, marble : 40002 },
        { wood: 42419, marble : 46457 }    // level 32
    ],
    tavern : [
        { wood: 222, marble : 0 },
        { wood: 367, marble : 0 },
        { wood: 541, marble : 94 },
        { wood: 750, marble : 122 },
        { wood: 1001, marble : 158 },
        { wood: 1302, marble : 206 },
        { wood: 1663, marble : 267 },
        { wood: 2097, marble : 348 },
        { wood: 2617, marble : 452 },
        { wood: 3241, marble : 587 },
        { wood: 3990, marble : 764 },
        { wood: 4888, marble : 993 },
        { wood: 5967, marble : 1290 },
        { wood: 7261, marble : 1677 },
        { wood: 8814, marble : 2181 },
        { wood: 10678, marble : 2835 },
        { wood: 12914, marble : 3685 },
        { wood: 15598, marble : 4791 },
        { wood: 18818, marble : 6228 },
        { wood: 22683, marble : 8097 },
        { wood: 27320, marble : 10526 },
        { wood: 32885, marble : 13684 },
        { wood: 39562, marble : 17789 },
        { wood: 47576, marble : 23125 },
        { wood: 57192, marble : 30063 },
        { wood: 68731, marble : 39082 },
        { wood: 82578, marble : 50806 },
        { wood: 99194, marble : 66048 },
        { wood: 119134, marble : 85862 },
        { wood: 143061, marble : 111621 },
        { wood: 171774, marble : 145107 },
        { wood: 206230, marble : 188640 },
        { wood: 247577, marble : 245231 }    // level 34
    ],
    alchemist: [
        { wood: 467, marble : 116 },
        { wood: 718, marble : 255 },
        { wood: 1045, marble : 436 },
        { wood: 1469, marble : 671 },
        { wood: 2021, marble : 977 },
        { wood: 2738, marble : 1375 },
        { wood: 3671, marble : 1892 },
        { wood: 4883, marble : 2564 },
        { wood: 6459, marble : 3437 },
        { wood: 8508, marble : 4572 },
        { wood: 11172, marble : 6049 },
        { wood: 14634, marble : 7968 },
        { wood: 19135, marble : 10462 },
        { wood: 24987, marble : 13705 },
        { wood: 32594, marble : 17921 },
        { wood: 42483, marble : 23402 },
        { wood: 55339, marble : 30527 },
        { wood: 72050, marble : 39790 },
        { wood: 93778, marble : 51830 },
        { wood: 122021, marble : 67485 }    // level 21
    ],
    branchOffice: [
        { wood: 173, marble : 0 },
        { wood: 346, marble : 0 },
        { wood: 581, marble : 0 },
        { wood: 896, marble : 540 },
        { wood: 1314, marble : 792 },
        { wood: 1863, marble : 1123 },
        { wood: 2580, marble : 1555 },
        { wood: 3509, marble : 2115 },
        { wood: 4706, marble : 2837 },
        { wood: 6241, marble : 3762 },
        { wood: 8203, marble : 4945 },
        { wood: 10699, marble : 6450 },
        { wood: 13866, marble : 8359 },
        { wood: 17872, marble : 10774 },
        { wood: 22926, marble : 13820 },
        { wood: 29286, marble : 17654 },
        { wood: 37272, marble : 22469 },
        { wood: 47282, marble : 28502 },
        { wood: 59806, marble : 36051 },
        { wood: 75448, marble : 45481 }    // level 21
    ]
};