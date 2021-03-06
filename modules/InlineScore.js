// ==UserScript==
// @name                  Inline Score
// @version               0.4
// @author                Beastx
//
// @history                0.4 clean list of element to listen click event
// @history                0.4 save temp data to show directly instead of search another time in the server
// @history                0.4 foxed problem with own city selection
// @history                0.4 Fixed Problems with click event
// @history                0.3 Fixed Problems with click event
// @history                0.3 Fixed Ally Media Points value
// @history                0.2 Added animation dots when script is searching
// @history                0.2 Show 'Sin puntos' msg when number value is 0
// @history                0.2 Added media points alliance score
// @history                0.2 Improve FormatNumber method to show correct unitLetter and a more friendly number
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
    
    this.infos = {};
    
    this.playerDataElements = {};
    this.allyDataElements = {};
    this.cityDataElements = {};
        
    this.searchingMsgTimeOut = {
        player: {},
        ally: {},
        city: {}
    };
    
    this.searchingMsgParts = [ '.', '...', '.....', '.......' ];
        
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

    this.cities = $$('li.cityLocation');
    for (var i = 0; i < this.cities.length; i++) {
        if (DOM.hasClass(this.cities[i], 'city')) {
            DOM.addListener(this.cities[i].childNodes[5], 'mouseup', DOM.createCaller(this, 'onCityClick'));
        }
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

Beastx.InlineScore.prototype.setSearchingMsg = function(scoreCategory, scoreType, step) {
    if (step == 0) {
        clearTimeout(this.searchingMsgTimeOut[scoreCategory][scoreType]);
    } else {
        if (step == this.searchingMsgParts.length) {
            step = 1;
        } else {
            ++step;
        }
        this.searchingMsgTimeOut[scoreCategory][scoreType] = setTimeout(DOM.createCaller(this, 'setSearchingMsg', [ scoreCategory, scoreType, step ]), 100);
        this.updateScoreMsg(this[scoreCategory + 'DataElements'][scoreType], 'Buscando ' + this.searchingMsgParts[step - 1]);
    }
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
                createOptionRow('mediaPoints', 'Media', this.allyDataElements),
                createOptionRow('ranking', 'Ranking', this.allyDataElements),
                createOptionRow('totalMembers', 'Miembros', this.allyDataElements)
            ])
        ]),
        $('actioncontainer')
    );
    this.infoBoxAdded = true;
}

Beastx.InlineScore.prototype.getSelectedPlayerName = function() {
    return escape($$('ul.cityinfo li.owner')[0].childNodes[1].nodeValue.trim()).replace('%A0', ' ');
}

Beastx.InlineScore.prototype.getSelectedPlayerId = function() {
    var ownerElement = $$('ul.cityinfo li.owner')[0]
    if (ownerElement.childNodes[2]) {
        return getQueryString('receiverId', ownerElement.childNodes[2].href);
    } else {
        return 0; // own city..
    }
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
    if (number) {
        if (number != '0') {
            var tempFormatedNumber = (number.replace(/,/g, '')/1000) + '';
            var integerPart = parseInt(tempFormatedNumber.substring(0, tempFormatedNumber.indexOf('.')));
            if (integerPart > 999) {
                integerPartTemp = (integerPart /1000) + ''
                integerPart = parseInt(integerPartTemp) + '';
                var decimalPart = integerPartTemp.substr(integerPartTemp.indexOf('.') + 1, 1);
                var unitLetter = 'M';
            } else {
                var decimalPart = tempFormatedNumber.substr(tempFormatedNumber.indexOf('.') + 1, 1);
                var unitLetter = 'K';
            }
            return  integerPart + (decimalPart != 0 ? '.'  + decimalPart : '') + ' ' + unitLetter;
        } else {
            return 'Sin puntos';
        }
    } else {
        return 'Error';
    }
}

Beastx.InlineScore.prototype.getCityInformation = function() {
    this.selectedPlayerId = this.getSelectedPlayerId();
    if (!this.infos[this.selectedPlayerId]) {
        this.selectedPlayerName = this.getSelectedPlayerName();
        this.selectedPlayerTotalPoints = this.getSelectedPlayerTotalPoints();
        this.selectedPlayerAllianceId = this.getSelectedPlayerAllianceId();
        this.selectedPlayerAllianceName = this.getSelectedPlayerAllianceName();
    } else {
        this.selectedPlayerName = this.infos[this.selectedPlayerId].selectedPlayerName;
        this.selectedPlayerTotalPoints = this.infos[this.selectedPlayerId].selectedPlayerTotalPoints;
        this.selectedPlayerAllianceId = this.infos[this.selectedPlayerId].selectedPlayerAllianceId;
        this.selectedPlayerAllianceName = this.infos[this.selectedPlayerId].selectedPlayerAllianceName;
    }
    
    this.selectedPlayerCityId = this.getSelectedPlayerCityId();
    this.selectedPlayerCityName = this.getSelectedPlayerCityName();
    this.selectedPlayerCityLevel = this.getSelectedPlayerCityLevel();
    
    if (!this.infoBoxAdded) {
        this.createAndAddInfoBox();
    } else {
        this.resetScores();
    }
    
    this.setNamesInTitles();

    if (!this.infos[this.selectedPlayerId]) {
        this.infos[this.selectedPlayerId] = {
            selectedPlayerName: this.selectedPlayerName,
            selectedPlayerTotalPoints: this.selectedPlayerTotalPoints,
            selectedPlayerAllianceId: this.selectedPlayerAllianceId,
            selectedPlayerAllianceName: this.selectedPlayerAllianceName
        };
        
        this.getScore('armyPoints');
        this.getScore('goldAmmount');
        this.getScore('offensivePoints'); 
        this.getScore('defensivePoints'); 
        
      
        if (this.selectedPlayerAllianceId) {
            this.getAllyScore(); 
        }
    } else {
        this.updateScoreMsg(this.playerDataElements['armyPoints'], this.formatPointsNumber(this.infos[this.selectedPlayerId].armyPoints));
        this.updateScoreMsg(this.playerDataElements['goldAmmount'], this.formatPointsNumber(this.infos[this.selectedPlayerId].goldAmmount));
        this.updateScoreMsg(this.playerDataElements['offensivePoints'], this.formatPointsNumber(this.infos[this.selectedPlayerId].offensivePoints));
        this.updateScoreMsg(this.playerDataElements['defensivePoints'], this.formatPointsNumber(this.infos[this.selectedPlayerId].defensivePoints));
        
        this.updateScoreMsg(this.allyDataElements.totalMembers, this.infos[this.selectedPlayerId].allianceMembers);
        this.updateScoreMsg(this.allyDataElements.ranking, this.infos[this.selectedPlayerId].alliancePosition);
        this.updateScoreMsg(this.allyDataElements.totalPoints, this.formatPointsNumber(this.infos[this.selectedPlayerId].allianceTotalPoints));
        this.updateScoreMsg(this.allyDataElements.mediaPoints, this.formatPointsNumber(this.infos[this.selectedPlayerId].mediaPoints));
    }
    
    this.updateScoreMsg(this.playerDataElements.totalPoints, this.formatPointsNumber(this.selectedPlayerTotalPoints));
    this.updateScoreMsg(this.cityDataElements.level, this.selectedPlayerCityLevel);
}

Beastx.InlineScore.prototype.onGetScoreRequestLoad = function(scoreType, responseHtmlAsText) {
    var hiddenDiv = DOM.createElement("div");
    hiddenDiv.innerHTML = responseHtmlAsText;
    
    var tdScore = $$('td.score', hiddenDiv);
    var tdName = $$('td.name', hiddenDiv);
    
    for (var i = 0; i < tdName.length; i++) {
        if (this.selectedPlayerName.replace(' ', '-') == tdName[i].innerHTML.trim().replace(' ', '-')) {
            var totalScore = tdScore[i].textContent.trim();
        }
    }
    this.updateScoreMsg(this.playerDataElements[scoreType], this.formatPointsNumber(totalScore));
    this.infos[this.selectedPlayerId][scoreType] = totalScore;
    this.setSearchingMsg('player', scoreType, 0);
}

Beastx.InlineScore.prototype.onGetAllianceRequestLoad = function(responseHtmlAsText) {
    var hiddenDiv = DOM.createElement("div");
    hiddenDiv.innerHTML = responseHtmlAsText;
    var tds = $$('#allyinfo', hiddenDiv)[0];
    var allianceMembers = tds.childNodes[1].childNodes[4].childNodes[2].textContent;
    var alliancePositionAndTotalPoints = tds.childNodes[1].childNodes[8].childNodes[2].textContent;
    
    var allianceTempData = alliancePositionAndTotalPoints.split(" ");
    var alliancePosition = allianceTempData[0];
    var allianceTotalPoints = allianceTempData[1].replace('(', '').replace(')', '');

    this.setSearchingMsg('ally', 'totalMembers', 0);
    this.setSearchingMsg('ally', 'ranking', 0);
    this.setSearchingMsg('ally', 'totalPoints', 0);
    this.setSearchingMsg('ally', 'mediaPoints', 0);
    
    this.updateScoreMsg(this.allyDataElements.totalMembers, allianceMembers);
    this.updateScoreMsg(this.allyDataElements.ranking, alliancePosition);
    this.updateScoreMsg(this.allyDataElements.totalPoints, this.formatPointsNumber(allianceTotalPoints));
    
    var mediaPointsAsFormatedString = ((parseInt(allianceTotalPoints.replace(/,/g, '') / allianceMembers) / 1000) + '').replace(/\./g, ',');
    this.updateScoreMsg(this.allyDataElements.mediaPoints, this.formatPointsNumber(mediaPointsAsFormatedString));
    
    this.infos[this.selectedPlayerId].allianceMembers = allianceMembers;
    this.infos[this.selectedPlayerId].alliancePosition = alliancePosition;
    this.infos[this.selectedPlayerId].allianceTotalPoints = allianceTotalPoints;
    this.infos[this.selectedPlayerId].mediaPoints = mediaPointsAsFormatedString;
}

Beastx.InlineScore.prototype.getScore = function(scoreType) {
    this.setSearchingMsg('player', scoreType, 1);
    this.requestScore(scoreType, DOM.createCaller(this, 'onGetScoreRequestLoad'));
}

Beastx.InlineScore.prototype.getAllyScore = function() {
    for (var scoreType in this.allyDataElements) {
        this.setSearchingMsg('ally', scoreType, 1);
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

Beastx.InlineScore.prototype.getDefaultConfigs = function() {
    Beastx.Config.options.InlineScore = {
        enabled: true,
        showAllianceData: true
    }
}

Beastx.InlineScore.prototype.getConfigs = function() {
    return {
        showAllianceData: this.showAllianceCheckbox.checked
    };
}

Beastx.InlineScore.prototype.getOptionBox = function() {
    this.showAllianceCheckbox = this.checkbox('showLessButton', Beastx.Config.options.InlineScore.showAllianceData);
    return this.keyValueTable([
        { label: 'Mostrar Info Alianza', value: this.showAllianceCheckbox }
    ]);
}

Beastx.registerModule(
    'Inline Score',
    'Nos muestra informacion de los diferentes puntajes de cada jugador en la vista Isla.'
);