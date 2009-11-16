// ==UserScript==
// @name                  Our Deployed Cities Cleaner
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.OurDeployedCitiesCleaner = function() {};

Beastx.OurDeployedCitiesCleaner.prototype.init = function(currentView, isConfigMode) {
    this.scriptName = 'Our Deployed Cities Cleaner';
    if (isConfigMode) {
        return;
    }
    this.loadAlliedCitiesData();
    this.loadDeployedCitiesData();
    this.addBasicStyles();
    var hiddenCitiesList = Beastx.getGMValue('hiddenCitiesList');
    if (hiddenCitiesList) {
        this.hiddenCitiesList = hiddenCitiesList;
    }
    if (Beastx.Config.options.OurDeployedCitiesCleaner.hideCitiesInList) {
        this.hideCitiesInList();
    }
    if (Beastx.Config.options.OurDeployedCitiesCleaner.showDontDeployedCities) {
        this.showDontDeployedCitiesBox();
    }
}

Beastx.OurDeployedCitiesCleaner.prototype.loadAlliedCitiesData = function() {
    if (IkaTools.getView() == 'diplomacyAdvisorAlly') {
        this.alliedCities = VAR.filter($$('table#memberList tbody tr td.cityInfo ul li ul li a.city'), this.caller('getCityObjectFromLinkElement'));
        Beastx.setGMValue('OurDeployedCitiesCleanerAlliedCities', this.alliedCities);
    } else {
        this.alliedCities = Beastx.getGMValue('OurDeployedCitiesCleanerAlliedCities');
    }
}

Beastx.OurDeployedCitiesCleaner.prototype.loadDeployedCitiesData = function() {
    if (IkaTools.getView() == 'diplomacyAdvisorAlly') {
        this.deployedCities = VAR.filter($$('select#citySelect option.deployedCities'), this.caller('getCityObjectFromDeployedOptionElement'));
        Beastx.setGMValue('OurDeployedCitiesCleanerDeployedCities', this.deployedCities);
    } else {
        var deployedCities = Beastx.getGMValue('OurDeployedCitiesCleanerDeployedCities');
        if (deployedCities) {
            this.deployedCities = deployedCities;
        } else {
            this.deployedCities = VAR.filter($$('select#citySelect option.deployedCities'), this.caller('getCityObjectFromDeployedOptionElement'));
            Beastx.setGMValue('OurDeployedCitiesCleanerDeployedCities', this.deployedCities);
        }
    }
}


Beastx.OurDeployedCitiesCleaner.prototype.getCityObjectFromLinkElement = function(linkElement) {
    var cityId = getQueryString('selectCity', linkElement.href);
    if (IkaTools.cities.isOwnCity(cityId)) {
        return null;
    } else {
        return {
            name: linkElement.textContent.split('[')[0].trim(),
            coords: linkElement.textContent.split('[')[1].replace(']', '').split(':'),
            id: cityId,
            islandId: getQueryString('id', linkElement.href),
            ownerName: linkElement.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[3].textContent.trim()
        }
    }
}

Beastx.OurDeployedCitiesCleaner.prototype.getCityObjectFromDeployedOptionElement = function(optionElement) {
    return {
        name: optionElement.textContent.split('[')[0].trim(),
        coords: optionElement.textContent.split('[')[1].replace(']', '').split(':'),
        id: optionElement.value,
        element: optionElement
    }
}

Beastx.OurDeployedCitiesCleaner.prototype.hideCitiesInList = function() {
    var allLiElements = $$('#changeCityForm div.jsSelect ul.optionList li');
    if (this.hiddenCitiesList) {
        for (var i = 0; i < allLiElements.length; ++i) {
            if (VAR.inArray(this.hiddenCitiesList, allLiElements[i].textContent)) {
                allLiElements[i].style.display = 'none';
            } else {
                allLiElements[i].style.display = '';
            }
            DOM.removeClass(allLiElements[i], 'last');
        }
    } else {
        var me = this;
        if (confirm('No tiene configurado que polis se deben ocultar. \nSeleccionar ahora?')) { me.showSelectCitiesToHidePopup(); };
    }
    if (this.configElement) {
        this.configElement.parentNode.removeChild(this.configElement);
    }
    this.addLastClass();
    this.configElement = this.element('li', { onclick: this.caller('showSelectCitiesToHidePopup') }, [ 'Configurar' ]);
    $$('#changeCityForm div.jsSelect ul.optionList')[0].insertBefore(this.configElement, $$('#changeCityForm div.jsSelect ul.optionList li.deployedCities')[0]);
    DOM.addClass(this.configElement, 'last');
}

Beastx.OurDeployedCitiesCleaner.prototype.addLastClass = function() {
    var allLiElements = $$('#changeCityForm div.jsSelect ul.optionList li');
    DOM.addClass(allLiElements[allLiElements.length - 1], 'last');
    for (var i = 0; i < allLiElements.length; ++i) {
        if (DOM.hasClass(allLiElements[i], 'deployedCities')) {
            DOM.addClass(allLiElements[i - 1], 'last');
            break;
        }
    }
    for (var j = allLiElements.length - 1; j >= 0; --j) {
        if (allLiElements[j].style.display == 'none') {
            DOM.addClass(allLiElements[j], 'last');
            break;
        }
    }
}

Beastx.OurDeployedCitiesCleaner.prototype.showSelectCitiesToHidePopup = function(event) {
    if (event) { DOM.cancelEvent(event); }
    this.manager = NewModule(Beastx.OurDeployedCitiesManager, [ this.alliedCities, this.hiddenCitiesList ], { onclose: this.caller('onManagerClose') });
    this.manager.open();
}

Beastx.OurDeployedCitiesCleaner.prototype.onManagerClose = function() {
    this.hiddenCitiesList = this.manager.getValue();
    Beastx.setGMValue('hiddenCitiesList', this.hiddenCitiesList);
    this.hideCitiesInList();
}

Beastx.OurDeployedCitiesCleaner.prototype.getDontDeployedCitiesElements = function() {
    var polis = [];
    var me = this;
    for (var i = 0; i < this.alliedCities.length; ++i) {
        (function(i) {
            var isInList = VAR.inArrayWithCallBack(
                me.deployedCities,
                function(item){
                    return parseInt(me.alliedCities[i].id.trim()) == parseInt(item.id.trim())
                }
            );
            if (!isInList) {
                polis.push(me.element('li', null, [
                    me.element('a', { href: 'index.php?view=island&id=' + me.alliedCities[i].islandId + '&selectCity=' + me.alliedCities[i].id }, [ me.alliedCities[i].name ]),
                    me.element('span', { 'class': 'ownerName' }, [ ' (', me.alliedCities[i].ownerName, ')' ])
                ]));
            }
        })(i);
    }
    return polis;
}

Beastx.OurDeployedCitiesCleaner.prototype.showDontDeployedCitiesBox = function() {
    if (IkaTools.getView() == 'diplomacyAdvisorAlly' || IkaTools.getView() == 'city' || IkaTools.getView() == 'barracks' || IkaTools.getView() == 'cityMilitary-army' || IkaTools.getView() == 'cityMilitary-fleet' || IkaTools.getView() == 'island' || IkaTools.getView() == 'diplomacyAdvisor') {
        var polis = this.getDontDeployedCitiesElements();
        IkaTools.addInfoBox(
            'Polis sin cobertura (' + polis.length + ' polis)',
            DOM.createElement('div', { id: 'DontDeployedCitiesBox', 'class': 'cityInfo' }, [
                DOM.createElement('ul', null, polis)
            ])
        );
    }
}

Beastx.OurDeployedCitiesCleaner.prototype.addBasicStyles = function() {
    var default_style = <><![CDATA[
    #DontDeployedCitiesBox { padding: 0.5em; } \
    #DontDeployedCitiesBox .ownerName { font-size: 0.9em; } 
    ]]></>.toXMLString();
    GM_addStyle(default_style);
}

Beastx.OurDeployedCitiesManager = function() {};

Beastx.OurDeployedCitiesManager.prototype.init = function(alliedCities, hiddenCities) {
    this.scriptName = 'OurDeployedCitiesManager';
    this.alliedCities = alliedCities;
    this.hiddenCities = hiddenCities ? hiddenCities : null;
}

Beastx.OurDeployedCitiesManager.prototype.isAlliedCity = function(name) {
    for (var i = 0; i < this.alliedCities.length; ++i ) {
        if (name == this.alliedCities[i].name) {
            return true;
        }
    }
    return false;
}

Beastx.OurDeployedCitiesManager.prototype.open = function() {
    this.addBasicStyles();
    var liElements = $$('#changeCityForm div.jsSelect ul.optionList li.deployedCities');
    var trs = [];
    var tr = [];
    this.checks = [];
    for (var i = 0; i < liElements.length; ++i) {
        var cityName = liElements[i].textContent;
        if (this.isAlliedCity(cityName.split(']')[1].trim())) {
            var input = this.element('input', { type: 'checkbox', checked: this.hiddenCities ? VAR.inArray(this.hiddenCities, cityName) : true });
            this.checks.push({ city: cityName, input: input});
            tr.push(this.element('td', null, [
                this.element('label', null, [ input, cityName ])
            ]));
            if (tr.length == 4) {
                trs.push(this.element('tr', null, tr));
                var tr = [];
            }
        }
    }
    if (tr.length > 0) {
        trs.push(this.element('tr', null, tr));
        var tr = [];
    }
    var content = this.element('div', null, [
        this.element('h4', null, [ 'Ciudades a ocultar' ]),
        this.element('div', null, [ 'Las ciudades seleccionadas no se veran en la lista.' ]),
        this.element('table', null, [
            this.element('tbody', null, trs)
        ]),
        this.element('div', null, [
            this.element('input', { 'class': 'button', value: 'Seleccionar todas',  type: 'button', onclick: this.caller('selectAll') }),
            this.element('input', { 'class': 'button', value: 'Deseleccionar todas',  type: 'button', onclick: this.caller('unSelectAll') }),
            this.element('input', { 'class': 'button', value: 'Guardar',  type: 'button', onclick: this.caller('saveHideCitiesConfig') })
        ])
    ]);
    this.popup = New(FloatingPopup, [ content, 'OurDeployesCitiesPopup', true ]);
    this.popup.openCentered();
}

Beastx.OurDeployedCitiesManager.prototype.saveHideCitiesConfig = function() {
    this.hiddenCitiesList = [];
    for (var i = 0; i < this.checks.length; ++i) {
        if (this.checks[i].input.checked) {
            this.hiddenCitiesList.push(this.checks[i].city)
        }
    }
    this.close();
}

Beastx.OurDeployedCitiesManager.prototype.close = function() {
    this.popup.close();
    this.popup = null;
    this.dispatchEvent('close');
}

Beastx.OurDeployedCitiesManager.prototype.selectAll = function() {
    for (var i = 0; i < this.checks.length; ++i) {
        this.checks[i].input.checked = true;
    }
}

Beastx.OurDeployedCitiesManager.prototype.unSelectAll = function() {
    for (var i = 0; i < this.checks.length; ++i) {
        this.checks[i].input.checked = false;
    }
}

Beastx.OurDeployedCitiesManager.prototype.getValue = function() {
    return this.hiddenCitiesList;
}

Beastx.OurDeployedCitiesManager.prototype.addBasicStyles = function() {
    var default_style = <><![CDATA[
    .OurDeployesCitiesPopup { width: 55em; padding: 1em; } \
    .OurDeployesCitiesPopup td { text-align: left; width: 25% } \
    .OurDeployesCitiesPopup label { display: block; white-space: nowrap; cursor: pointer; }
    ]]></>.toXMLString();
    GM_addStyle(default_style);
}

Beastx.OurDeployedCitiesCleaner.prototype.getDefaultConfigs = function() {
    Beastx.Config.options.OurDeployedCitiesCleaner = {
        enabled: true,
        hideCitiesInList: false,
        showDontDeployedCities: true
    }
}

Beastx.OurDeployedCitiesCleaner.prototype.getConfigs = function() {
    return {
        hideCitiesInList: this.hideCitiesInListCheckbox.checked,
        showDontDeployedCities: this.showDontDeployedCitiesCheckbox.checked
    };
}

Beastx.OurDeployedCitiesCleaner.prototype.getOptionBox = function() {
    this.hideCitiesInListCheckbox = this.checkbox('hideCitiesInList', Beastx.Config.options.OurDeployedCitiesCleaner.hideCitiesInList);
    this.showDontDeployedCitiesCheckbox = this.checkbox('showDontDeployedCities', Beastx.Config.options.OurDeployedCitiesCleaner.showDontDeployedCities);
    return this.keyValueTable([
        { label: 'Ocultar polis cubiertas en la lista de polis nuestras', value: this.hideCitiesInListCheckbox },
        { label: 'Mostrar bloque con ciudades no cubiertas', value: this.showDontDeployedCitiesCheckbox }
    ]);
}

Beastx.registerModule(
    'Our Deployed Cities Cleaner',
    'Este modulo remueve de la lista de ciudades todas las ciudades de los aliados donde tenemos apostados nuestras unidades.'
);