// ==UserScript==
// @name                  Data Saver
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.DataSaver = function() {};
    
Beastx.DataSaver.prototype.init = function(postUrl, currentView) {
    this.postUrl = postUrl;
    this.currentView = currentView;
    switch(this.currentView) {
        case 'city':
            this.saveCityData();
            break;
        case 'worldmap_iso':
            this.saveWorldData();
            break;
        case 'island':
            this.saveIslandData();
            break;
        case 'sendSpy':
            this.saveSpyData();
            break;
        case 'tradegood':
            this.saveTradeGood();
            break;
        case 'resource':
            this.saveResource();
            break;
        case 'academy':
        case 'blockade':
        case 'branchOffice':
        case 'buildingGround':
        case 'carpentering':
        case 'cityMilitary-army':
        case 'cityMilitary-fleet':
        case 'colonize':
        case 'culturalPossessions_assign':
        case 'defendCity':
        case 'deployment':
        case 'diplomacyAdvisorTreaty':
        case 'diplomacyAdvisorOutBox':
        case 'diplomacyAdvisor':
        case 'diplomacyAdvisorAlly':
        case 'diplomacyAdvisorArchive':
        case 'diplomacyAdvisorArchiveOutBox':
        case 'embassy':
        case 'militaryAdvisorReportView':
        case 'militaryAdvisorMilitaryMovements':
        case 'militaryAdvisorCombatReports':
        case 'militaryAdvisorCombatReportsArchive':
        case 'merchantNavy':
        case 'museum':
        case 'port':
        case 'researchAdvisor':
        case 'safehouse':
        case 'safehouseMissions':
        case 'tavern':
        case 'tradeAdvisor':
        case 'plunder':
        case 'transport':
        case 'barracks':
        case 'shipyard':
        case 'takeOffer':
            // Todo
        default:
            break;
    };
}

Beastx.DataSaver.prototype.sendToServer = function(className, data) {
    DOM.post(
        this.postUrl,
        { className: className, action: 'save', params: data },
        function(response) {}
    );
}

Beastx.DataSaver.prototype.saveTradeGood = function() {
    var resourceTypeId = {
        marble: 2,
        wine: 1,
        glass: 4,
        sulfur:  3
    };
    var trs = $$('#resourceUsers .content table tbody tr');
    var donations = [];
    for (var i = 0; i < trs.length; ++i) {
        if (trs[i].childNodes[9].childNodes.length > 0) {
            var playerId = getQueryString('receiverId', trs[i].childNodes[11].childNodes[0].href);
            playerId = playerId ? playerId : Beastx.Config.user.id;
            donations.push({
                playerId: playerId,
                ammount: parseInt(trs[i].childNodes[9].childNodes[0].nodeValue.replace(',', ''))
            });
        }
    }
    var data = {
        islandId: getQueryString('id', $$('a.island')[0].href),
        resourceTypeId: resourceTypeId[$$('#resUpgrade .content img')[0].src.replace("http://s2.ar.ikariam.com/skin/resources/img_", "").replace(".jpg", "")],
        donations: donations
    }
    this.sendToServer('Donate', data);
}

Beastx.DataSaver.prototype.saveResource = function() {
    var trs = $$('#resourceUsers .content table tbody tr');
    var donations = [];
    for (var i = 0; i < trs.length; ++i) {
        if (trs[i].childNodes[9].childNodes.length > 0) {
            var playerId = getQueryString('receiverId', trs[i].childNodes[11].childNodes[0].href);
            playerId = playerId ? playerId : Beastx.Config.user.id;
            donations.push({
                playerId: playerId,
                ammount: parseInt(trs[i].childNodes[9].childNodes[0].nodeValue.replace(',', ''))
            });
        }
    }
    var data = {
        islandId: getQueryString('id', $$('a.island')[0].href),
        resourceTypeId: 5,
        donations: donations
    }
    this.sendToServer('Donate', data);
}

Beastx.DataSaver.prototype.saveSpyData = function() {
    var data = {
        toCityId: getQueryString('destinationCityId'),
        fromCityId: $('citySelect').value,
        risk: parseInt(document.getElementsByClassName('risk')[0].childNodes[2].childNodes[1].style.width)
    };
    this.sendToServer('Spy', data);
}

Beastx.DataSaver.prototype.saveCityData = function() {
    var positions = [];
    for (var i = 0; i < 15; ++i) {
        var liElement = document.getElementById('position' + i);
        if (!DOM.hasClass(liElement, 'buildingGround')) {
            positions.push(
                {
                    cityId: getQueryString('id', liElement.childNodes[3].href),
                    level: liElement.childNodes[3].title.split(' ')[liElement.childNodes[3].title.split(' ').length - 1],
                    buildingType: liElement.className
                }
            );
        }
    }
    this.sendToServer('Building', positions);
}

Beastx.DataSaver.prototype.saveIslandData = function() {
    var cityLocations = document.getElementsByClassName('cityLocation');
    var ourCities = [];
    var alliedCities = [];
    var enemyCities = [];
    var luxury = $$('#islandfeatures li#tradegood')[0].className.split(' ');
    var wood = $$('#islandfeatures li.wood')[0].className.split(' ');
    var island = $$('#breadcrumbs span.island')[0].textContent.split('[')
    var islandData = {
        id: getQueryString('id'),
        luxuryType: luxury[0],
        luxuryLevel: luxury[1].replace('level', ''),
        woodLevel: wood[1].replace('level', '')
    };
    for (var i = 0; i < cityLocations.length; ++i) {
        if (DOM.hasClass(cityLocations[i], 'city')) {
            var link = cityLocations[i].childNodes[5];
            if (DOM.hasClass(cityLocations[i].childNodes[1], 'allyCityImg')){
                alliedCities.push({
                    id: link.id.substr(5),
                    name: cityLocations[i].childNodes[7].childNodes[1].childNodes[1].nodeValue,
                    level: cityLocations[i].childNodes[7].childNodes[3].childNodes[1].nodeValue,
                    island: islandData,
                    player: {
                        id: getQueryString('receiverId', cityLocations[i].childNodes[7].childNodes[5].childNodes[2].href),
                        name: VAR.trim(cityLocations[i].childNodes[7].childNodes[5].textContent.replace('Jugador: ', '')),
                        ally: {
                            id: getQueryString('allyId', cityLocations[i].childNodes[7].childNodes[9].childNodes[1].href),
                            name: VAR.trim(cityLocations[i].childNodes[7].childNodes[9].textContent.replace('Alianza: ', ''))
                        }
                    }
                });
            } else if (DOM.hasClass(cityLocations[i].childNodes[1], 'ownCityImg')) {
                ourCities.push({
                    id: link.id.substr(5),
                    name: cityLocations[i].childNodes[7].childNodes[1].childNodes[1].nodeValue,
                    level: cityLocations[i].childNodes[7].childNodes[3].childNodes[1].nodeValue,
                    island: islandData,
                    player: Beastx.Config.user
                });
            } else {
                enemyCities.push({
                    id: link.id.substr(5),
                    name: cityLocations[i].childNodes[7].childNodes[1].childNodes[1].nodeValue,
                    level: cityLocations[i].childNodes[7].childNodes[3].childNodes[1].nodeValue,
                    island: islandData,
                    player: {
                        id: getQueryString('receiverId', cityLocations[i].childNodes[7].childNodes[5].childNodes[2].href),
                        name: VAR.trim(cityLocations[i].childNodes[7].childNodes[5].textContent.replace('Jugador: ', '')),
                        ally: {
                            id: getQueryString('allyId', cityLocations[i].childNodes[7].childNodes[9].childNodes[1].href),
                            name: VAR.trim(cityLocations[i].childNodes[7].childNodes[9].textContent.replace('Alianza: ', ''))
                        }
                    }
                });
            }
        }
    }
    var cities = {
        ourCities: ourCities,
        alliedCities: alliedCities,
        enemyCities: enemyCities
    };
    this.sendToServer('City', cities);
}

Beastx.DataSaver.prototype.saveWorldData = function() {
    var map = unsafeWindow['map'];
    for (var i = 0; i < 100; ++i) {
        var row = map.islands[i];
        if (row) {
            var islands = [];
            for (var j = 0; j < 100; ++j) {
                var island = map.islands[i][j];
                if (island && island != 'ocean') {
                    islands.push({
                        id: island[0],
                        woodLevel: island[6],
                        playersCount: island[7]
                    });
                    this.sendToServer('Island', islands);
                }
            }
        }
    };
    //~ occupiedIslandJs
    //~ own
    //~ ownIslandJs
    //~ allyIslandJs
}