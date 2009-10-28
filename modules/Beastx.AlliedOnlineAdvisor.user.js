// ==UserScript==
// @name                  Allied Online Advisor
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.AlliedOnlineAdvisor = function() {};

Beastx.AlliedOnlineAdvisor.prototype.init = function(currentView) {
    this.scriptName = 'Allied Online Advisor';
    if (currentView != 'island' && currentView != 'diplomacyAdvisor') {
        return;
    }
    this.allyUrl = "http://" + IkaTools.getDomain() + "/index.php?view=diplomacyAdvisorAlly";
    this.onlineImg = "/skin/layout/bulb-on.gif";
    this.onlinePlayers = {};
        
    if (currentView == 'island') {
        this.showOnlineUsersInIsland();
    } else if (currentView == 'diplomacyAdvisor') {
        this.showOnlineUsersInDiplomacyAdvisor();
    }
};

Beastx.AlliedOnlineAdvisor.prototype.getOnlinePlayers = function(doc) {
    var elements = doc.getElementsByClassName('online');
    for (var i = 0; i < elements.length; i++) {
        var playerTD = elements[i].nextSibling.nextSibling;
        var player = playerTD.innerHTML.replace(/\s/g, "_").replace(/-/g, "_");
        this.onlinePlayers[player] =true;
    }
};

Beastx.AlliedOnlineAdvisor.prototype.getCitiesFromPlayerName = function(player) {
    var tempAlliedCities = $$("div.allyCityImg");
    var playerCities = [];
    var exp = new RegExp(player.trim().toLowerCase());
    for (var i = 0; i < tempAlliedCities.length; ++i) {
        var city = tempAlliedCities[i].parentNode;
        var cityPlayerName = city.childNodes[7].childNodes[5].textContent.trim().replace('Jugador: ', '');
        if (exp.test(cityPlayerName.trim().toLowerCase())) {
            playerCities.push(tempAlliedCities[i].parentNode);
        }
    }
    return playerCities;
}

Beastx.AlliedOnlineAdvisor.prototype.showOnlineUsersInIsland = function() {
    if($$("div.allyCityImg").length == 0) { return; }
    IkaTools.getRemoteDocument(this.allyUrl, DOM.createCaller(this, 'onGetRemoteDocumentLoadForIsland'));
};

Beastx.AlliedOnlineAdvisor.prototype.onGetRemoteDocumentLoadForIsland = function(doc) {
    this.getOnlinePlayers(doc);
    
    for (prop in this.onlinePlayers) {
        if (this.onlinePlayers[prop]) {
            var player = prop.replace(/_/g, " ");
            var cities = this.getCitiesFromPlayerName(player);
            for (var i = 0; i < cities.length; i++) {
                cities[i].childNodes[5].appendChild(DOM.createElement('img', {
                    src: this.onlineImg,
                    style: {
                        paddingTop: '10px',
                        paddingLeft: '55px',
                        zIndex: '999',
                        position: 'absolute'
                    }
                }));
            }
        }
    }
}

Beastx.AlliedOnlineAdvisor.prototype.showOnlineUsersInDiplomacyAdvisor = function() {
    IkaTools.getRemoteDocument(this.allyUrl, DOM.createCaller(this, 'onGetRemoteDocumentLoadForDiplomacyAdvisor'));
};

Beastx.AlliedOnlineAdvisor.prototype.onGetRemoteDocumentLoadForDiplomacyAdvisor = function(doc) {
    this.getOnlinePlayers(doc);
    for (prop in this.onlinePlayers) {
        var player = prop.replace(/_/g, " ");
        var exp = new RegExp(player.trim().toLowerCase());
        var entries = $$('tr.entry');
        for (var i = 0; i < entries.length; ++i) {
            var link = entries[i].childNodes[5].childNodes[0];
            var playerName = link.textContent;
            if (exp.test(playerName.trim().toLowerCase())) {
                link.innerHTML = player + "  <img src='" + this.onlineImg + "'/>";
            }
        }
    }
}