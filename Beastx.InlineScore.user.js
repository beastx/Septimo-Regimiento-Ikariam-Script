// ==UserScript==
// @name                  Inline Score
// @namespace       Beastx
// @description        Inline Score
// @include               http://*.ikariam.com/*

// @require               http://ikariam.beastx/tools/userScripts/requires/Beastx.js
// @require               http://ikariam.beastx/tools/userScripts/requires/VAR.js
// @require               http://ikariam.beastx/tools/userScripts/requires/DOM.js
// @require               http://ikariam.beastx/tools/userScripts/requires/IkaTools.js
// @require               http://ikariam.beastx/tools/userScripts/requires/ScriptUpdater.js

// @version               0.1
// @author                Beastx
//
// @history                0.2 Removed some default ikariam values
// @history                0.2 Complete code refactor
// @history                0.1 Initial release
// ==/UserScript==

Beastx.InlineScore = function() {};

Beastx.InlineScore.prototype.init = function(currentView) {
    if (currentView != 'island') {
        return;
    }
    
    this.scriptName = 'Inline Score';
    
    this.playerDataElements = {};
    this.allyDataElements = {};
    this.cityDataElements = {};
        
    this.serverData = {
        host: top.location.host,
        hostParts: top.location.host.split("."),
        subDomain: top.location.host.split(".")[1],
        domain: top.location.host.split(".")[2],
        lang: 'es'
    };
    
    this.baseDivCreated = false;
    this.scoreShown = false;
    
    this.post = {
        armyPoints: 'army_score_main',
        goldAmmount: 'trader_score_secondary', 
        offensivePoints: 'offense',
        defensivePoints: 'defense'
    };

    this.cities = $$('li.city');
    for (var i = 0; i < this.cities.length; i++) {
        DOM.addListener(this.cities[i].childNodes[5], 'click', DOM.createCaller(this, 'onCityClick'));
    }
        
    this.informationDiv = $('information');
    if (this.informationDiv) {
        var listElements = $$('#information li');
        if (listElements.length > 0) {
            this.getCityInformation();
        }
    }
    
    this.hideOriginalIkariamElements();
}

Beastx.InlineScore.prototype.onCityClick = function() {
    setTimeout(DOM.createCaller(this, 'getCityInformation'), 1);
}

Beastx.InlineScore.prototype.hideOriginalIkariamElements = function() {
    $('infocontainer').style.display = 'none';
}

Beastx.InlineScore.prototype.updateScoreMsg = function(element, value) {
    element.removeChild(element.firstChild);
    element.appendChild(document.createTextNode(value));
}

Beastx.InlineScore.prototype.resetScores = function() {
    for (var scoreType in this.playerDataElements) {
        this.updateScoreMsg(this.playerDataElements[scoreType], 'N/A');
    }
    for (var scoreType in this.allyDataElements) {
        this.updateScoreMsg(this.allyDataElements[scoreType], 'N/A');
    }
    for (var scoreType in this.cityDataElements) {
        this.updateScoreMsg(this.cityDataElements[scoreType], 'N/A');
    }
}

Beastx.InlineScore.prototype.setNamesInTitles = function() {
    this.titleElement.removeChild(this.titleElement.firstChild);
    this.titleElement.appendChild(document.createTextNode('Jugador: ' + this.selectedPlayerName));
    
    this.cityTitleElement.removeChild(this.cityTitleElement.firstChild);
    this.cityTitleElement.appendChild(document.createTextNode('Polis: ' + this.selectedPlayerCityName));
    
    this.allyTitleElement.removeChild(this.allyTitleElement.firstChild);
    if (this.selectedPlayerAllianceId) {
        this.allyTitleElement.appendChild(document.createTextNode('Alianza: ' + this.selectedPlayerAllianceName));
    } else {
        this.allyTitleElement.appendChild(document.createTextNode('Alianza:'));
    }
}

Beastx.InlineScore.prototype.addStyles = function() {
    GM_addStyle("\
        #BeastxInlineScore ul { margin-top: -7px; }\
        #BeastxInlineScore .title { font-size: 1em; padding: 0.3em; margin-bottom: 0.3em; border-bottom: 1px solid #999; background-color: #CCC; }\
        #BeastxInlineScore .textLabel { padding: 0em 1em; }\
        #BeastxInlineScore .separator { height: 2px; }\
    ");
}

Beastx.InlineScore.prototype.createAndAddInfoBox = function() {
    this.addStyles();
    
    function createOptionRow(id, title, playerDataElementsList) {
        return DOM.createElement('li', null, [
            DOM.createElement('span', { 'class': 'textLabel' }, [
                DOM.createElement('strong', null, [ title + ': ' ])
            ]),
            playerDataElementsList[id] = DOM.createElement('span', null, [ 'N/A' ])
        ])
    }
    
    IkaTools.addInfoBox(
        'Inline Score',
        DOM.createElement('div', { id: 'BeastxInlineScore' }, [
            DOM.createElement('ul', null, [
                DOM.createElement('li', { 'class': 'separator' }, [
                    DOM.createElement('hr')
                ]),
                DOM.createElement('li', { 'class': 'title' }, [
                    DOM.createElement('span', { 'class': 'textLabel' }, [
                        this.titleElement = DOM.createElement('strong', null, [ 'Jugador:' ])
                    ])
                ]),
                createOptionRow('totalPoints', 'Totales', this.playerDataElements),
                createOptionRow('armyPoints', 'Militares', this.playerDataElements),
                createOptionRow('goldAmmount', 'Oro', this.playerDataElements),
                createOptionRow('offensivePoints', 'Ofensivos', this.playerDataElements),
                createOptionRow('defensivePoints', 'Defensivos', this.playerDataElements),
                DOM.createElement('li', { 'class': 'separator' }, [
                    DOM.createElement('hr')
                ]),
                DOM.createElement('li', { 'class': 'title' }, [
                    DOM.createElement('span', { 'class': 'textLabel' }, [
                        this.cityTitleElement = DOM.createElement('strong', null, [ 'Polis:' ])
                    ])
                ]),
                createOptionRow('level', 'Nivel', this.cityDataElements),
                DOM.createElement('li', { 'class': 'separator' }, [
                    DOM.createElement('hr')
                ]),
                DOM.createElement('li', { 'class': 'title' }, [
                    DOM.createElement('span', { 'class': 'textLabel' }, [
                        this.allyTitleElement = DOM.createElement('strong', null, [ 'Alianza:' ])
                    ])
                ]),
                createOptionRow('totalPoints', 'Totales', this.allyDataElements),
                createOptionRow('ranking', 'Ranking', this.allyDataElements),
                createOptionRow('totalMembers', 'Miembros', this.allyDataElements)
            ])
        ]),
        $('actioncontainer')
    );
    this.infoBoxAdded = true;
}

Beastx.InlineScore.prototype.getSelectedPlayerName = function() {
    return $$('ul.cityinfo li.owner')[0].childNodes[1].textContent.trim();
}

Beastx.InlineScore.prototype.getSelectedPlayerId = function() {
    var ownerElement = $$('ul.cityinfo li.owner')[0]
    return getQueryString('receiverId', ownerElement.childNodes[2].href);
}

Beastx.InlineScore.prototype.getSelectedPlayerTotalPoints = function() {
    return $$('ul.cityinfo li.name')[1].childNodes[1].textContent;
}

Beastx.InlineScore.prototype.getSelectedPlayerAllianceName = function() {
    var allyNameElement = $$('ul.cityinfo li.ally')[0].childNodes[1];
    if (allyNameElement.textContent != '-') {
        return allyNameElement.textContent.trim();
    } else {
        return null;
    }
}

Beastx.InlineScore.prototype.getSelectedPlayerAllianceId = function() {
    var allyElement = $$('ul.cityinfo li.ally')[0]
    if (allyElement.childNodes.length >= 4) {
        return getQueryString('allyId', allyElement.childNodes[3].href);
    } else {
        return null;
    }
}

Beastx.InlineScore.prototype.getSelectedPlayerCityId = function() {
    return parseInt($$('ul#cities li.selected')[0].childNodes[5].id.replace('city_', ''));
}

Beastx.InlineScore.prototype.getSelectedPlayerCityName = function() {
    return $$('ul.cityinfo li.name')[0].childNodes[1].textContent.trim()
}

Beastx.InlineScore.prototype.getSelectedPlayerCityLevel = function() {
    return parseInt($$('ul.cityinfo li.citylevel')[0].childNodes[1].textContent);
}

Beastx.InlineScore.prototype.formatPointsNumber = function(number) {
    return number ? number : 'Error';
    //~ return parseInt(parseInt(number.replace(',', '')) / 1000) + 'k';
}

Beastx.InlineScore.prototype.getCityInformation = function() {
    this.selectedPlayerId = this.getSelectedPlayerId();
    this.selectedPlayerName = this.getSelectedPlayerName();
    this.selectedPlayerTotalPoints = this.getSelectedPlayerTotalPoints();
    
    this.selectedPlayerAllianceId = this.getSelectedPlayerAllianceId();
    this.selectedPlayerAllianceName = this.getSelectedPlayerAllianceName();
    
    this.selectedPlayerCityId = this.getSelectedPlayerCityId();
    this.selectedPlayerCityName = this.getSelectedPlayerCityName();
    this.selectedPlayerCityLevel = this.getSelectedPlayerCityLevel();
    
    if (!this.infoBoxAdded) {
        this.createAndAddInfoBox();
    } else {
        this.resetScores();
    }
    
    this.setNamesInTitles();

    this.getScore('armyPoints');
    this.getScore('goldAmmount');
    this.getScore('offensivePoints'); 
    this.getScore('defensivePoints'); 
    
  
    if (this.selectedPlayerAllianceId) {
        this.getAllyScore(); 
    }
    
    this.updateScoreMsg(this.playerDataElements.totalPoints, this.formatPointsNumber(this.selectedPlayerTotalPoints));
    this.updateScoreMsg(this.cityDataElements.level, this.selectedPlayerCityLevel);
    
    return;
    
    var checkedTime = (new Date().getTime() - (1000*60*10));
    if (playerName != Beastx.getGMValue("lastPlayerCheck") || Beastx.getGMValue("lastCheckedTimestamp") < checkedTime || Beastx.getGMValue("lastServerCheck") != this.serverData.host) {

        if (playerScore > -1) {
            updateScore('score', VAR.formatNumber(playerScore));
        } else {
            requestScore(playerName, 'score', function(responseDetails) {
                updateDetails('score', playerName, townLevel, responseDetails.responseText);
            });
        }

        requestScore(playerName, 'military', function(responseDetails) {
            updateDetails('military', playerName, townLevel, responseDetails.responseText);
        });
        requestScore(playerName, 'gold', function(responseDetails) {
            updateDetails('gold', playerName, townLevel, responseDetails.responseText);
        });
        requestScore(playerName, 'offensive', function(responseDetails) {
            updateDetails('offensive', playerName, townLevel, responseDetails.responseText);
        });
        requestScore(playerName, 'defensive', function(responseDetails) {
            updateDetails('defensive', playerName, townLevel, responseDetails.responseText);
        });

        if (allyId != -1) {
            requestAlliance(allyId, function(responseDetails) {
                updateAllyDetails('allyscore', responseDetails.responseText);
            });
        } else {
            updateScore("allyscore", "-")
            $('ally_members').style.display = "none";
        }


        Beastx.setGMValue("lastCheckedTimestamp", new Date().getTime() + "");
        Beastx.setGMValue("lastPlayerCheck", playerName);
        Beastx.setGMValue("lastServerCheck", this.serverData.host);
    } else {
        for (var interation = 0;interation < 4; interation++) {
            var type = this.scoreTypes[interation];
            if (type == "allyscore" && Beastx.getGMValue(type) == "-") {
                $(type).innerHTML = Beastx.getGMValue(type);
                $('ally_members').style.display = "none";
            } else {
                $(type).innerHTML = Beastx.getGMValue(type);
            }
        }
    }
}

Beastx.InlineScore.prototype.onGetScoreRequestLoad = function(scoreType, responseHtmlAsText) {
    var hiddenDiv = DOM.createElement("div", { id: scoreType + 'HiddenDiv', style: { display: 'none' }});
    hiddenDiv.innerHTML = responseHtmlAsText;
    document.body.appendChild(hiddenDiv);
    
    var tdScore = $$('div#' + scoreType + 'HiddenDiv td.score');
    var tdName = $$('div#' + scoreType + 'HiddenDiv  td.name');
    
    for (var i = 0; i < tdName.length; i++) {
        Beastx.log(tdName[i].innerHTML)
        Beastx.log(this.selectedPlayerName)
        if (this.selectedPlayerName == tdName[i].innerHTML.trim()) {
            var totalScore = tdScore[i].textContent.trim();
        }
    }
    document.body.removeChild(hiddenDiv);
    this.updateScoreMsg(this.playerDataElements[scoreType], this.formatPointsNumber(totalScore));
}

Beastx.InlineScore.prototype.onGetAllianceRequestLoad = function(responseHtmlAsText) {
    var hiddenDiv = DOM.createElement("div", { id: 'allyHiddenDiv', style: { display: 'none' }});
    hiddenDiv.innerHTML = responseHtmlAsText;
    document.body.appendChild(hiddenDiv);
    
    var tds = $$('#allyHiddenDiv #allyinfo');
    var allianceMembers = tds.childNodes[1].childNodes[4].childNodes[2].textContent;
    var alliancePositionAndTotalPoints = tds.childNodes[1].childNodes[8].childNodes[2].textContent;

    var allianceTempData = alliancePositionAndTotalPoints.split(" ");
    var alliancePosition = allianceTempData[0];
    var allianceTotalPoints = allianceTempData[1].replace('(', '').replace(')', '');

    document.body.removeChild(hiddenDiv);
    this.updateScoreMsg(this.allyDataElements.totalMembers, allianceMembers);
    this.updateScoreMsg(this.allyDataElements.ranking, alliancePosition);
    this.updateScoreMsg(this.allyDataElements.totalPoints, this.formatPointsNumber(allianceTotalPoints));
}

Beastx.InlineScore.prototype.getScore = function(scoreType) {
    this.updateScoreMsg(this.playerDataElements[scoreType], 'Buscando...');
    this.requestScore(scoreType, DOM.createCaller(this, 'onGetScoreRequestLoad'));
}

Beastx.InlineScore.prototype.getAllyScore = function() {
    for (var scoreType in this.allyDataElements) {
        this.updateScoreMsg(this.allyDataElements[scoreType], 'Buscando...');
    }
    this.requestAlliance(DOM.createCaller(this, 'onGetAllianceRequestLoad'));
}

Beastx.InlineScore.prototype.requestScore = function(scoreType, onLoadCallback) {
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://' + this.serverData.host + '/index.php',
        data: "view=highscore&highscoreType=" + this.post[scoreType] + "&searchUser=" + this.selectedPlayerName,
        headers: {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/atom+xml,application/xml,text/xml',
            'Referer': 'http://' + this.serverData.host + '/index.php', 
            'Cookie': document.cookie
        },
        onload: function(xhr) {
            onLoadCallback(scoreType, xhr.responseText);
        }
    });
}

Beastx.InlineScore.prototype.requestAlliance = function(onLoadCallback) {
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://' + this.serverData.host + '/index.php',
        data: "view=allyPage&allyId=" + this.selectedPlayerAllianceId, 
        headers: {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/atom+xml,application/xml,text/xml',
            'Referer': 'http://' + this.serverData.host + '/index.php',
            'Cookie': document.cookie
        },
        onload: function(xhr) {
            onLoadCallback(xhr.responseText);
        }
    });
}
