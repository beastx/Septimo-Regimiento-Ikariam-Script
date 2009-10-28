// ==UserScript==
// @name                  Our Deployed Cities Cleaner
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.OurDeployedCitiesCleaner = function() {};

Beastx.OurDeployedCitiesCleaner.prototype.init = function() {
    this.scriptName = 'Our Deployed Cities Cleaner';
    Beastx.todo('ver que pasa cuanod tenemos ocupada una polis enemiga, o cuanod tenemos apostadas tropas de encerio', this);
    this.allCitiesLiElements = $$('#cityNav li.coords');
    this.deployedCitiesLiElements = $$('#cityNav li.deployedCities');
    this.hide();
}

Beastx.OurDeployedCitiesCleaner.prototype.hide = function() {
    for (var i = 0; i < this.deployedCitiesLiElements.length; ++i) {
        this.deployedCitiesLiElements[i].style.display = 'none';
    }
    for (var i = this.allCitiesLiElements.length -1; i >= 0;  --i) {
        if (!DOM.hasClass(this.allCitiesLiElements[i], 'deployedCities')) {
            DOM.addClass(this.allCitiesLiElements[i], 'last');
            break;
        }
    }
    this.allCitiesLiElements = $$('#cityNav li');
}