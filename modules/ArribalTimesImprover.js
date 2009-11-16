// ==UserScript==
// @name                  ArribalTimesImprover
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.ArribalTimesImprover = function() {};

Beastx.ArribalTimesImprover.prototype.init = function(currentView) {
    if (currentView != 'transport' && currentView != 'branchOffice' && currentView != 'takeOffer' && currentView != 'colonize') {
        return;
    }
    this.scriptName = 'Arribal Times Improver';
    this.resources = ['wood', 'wine', 'marble', 'glass', 'sulfur'];
    this.resourceInputElements = $$('ul.resourceAssign li input.textfield');
    setTimeout(this.caller('initializeUpdateTravelTime'), 0);
}

Beastx.ArribalTimesImprover.prototype.getTotalResources = function() {
    var totalResources = 0;
    for (var i = 0; i < this.resourceInputElements.length; ++i) {
        totalResources += parseInt(this.resourceInputElements[i].value);
    }
    return totalResources;
}

Beastx.ArribalTimesImprover.prototype.formatTime = function(totalSeconds) {
    if (totalSeconds > 3600) {
        var hours = parseInt(totalSeconds/3600);
        var minutes = parseInt((totalSeconds%3600)/60);
        var seconds = parseInt((totalSeconds%3600)%60);
        return (hours > 0 ? hours + 'h ' : '') + (minutes > 0 ? minutes + 'm ' : '') + (seconds > 0 ? seconds + 's' : '');
    } else if (totalSeconds > 60) {
        var minutes = parseInt(totalSeconds/60);
        var seconds = parseInt(totalSeconds%60);
        return (minutes > 0 ? minutes + 'm ' : '') + (seconds > 0 ? seconds + 's' : '');
    } else {
        return totalSeconds > 0 ? totalSeconds + 's' : null;
    }
}

Beastx.ArribalTimesImprover.prototype.parseTravelTime = function(travelTimeString) {
    var seconds = 0;
    var timeArray = travelTimeString.split(' ');
    if (timeArray.length == 3) {
        seconds += parseInt(timeArray[0].substring(0, timeArray[0].length-1)) * 3600;
        seconds += parseInt(timeArray[1].substring(0, timeArray[1].length-1)) * 60;
        seconds += parseInt(timeArray[2].substring(0, timeArray[2].length-1));
    } else if (timeArray.length == 2) {
        if (timeArray[0].search('h') != -1) {
            seconds += parseInt(timeArray[0].substring(0,timeArray[0].length-1)) * 3600;
        }
        if (timeArray[1].search('h') != -1) {
            seconds += parseInt(timeArray[0].substring(0,timeArray[0].length-1)) * 3600;
        }
        if (timeArray[0].search('m') != -1) {
            seconds += parseInt(timeArray[0].substring(0,timeArray[0].length-1)) * 60;
        }
        if (timeArray[1].search('m') != -1) {
            seconds += parseInt(timeArray[0].substring(0,timeArray[0].length-1)) * 60;
        }
        if (timeArray[0].search('s') != -1) {
            seconds += parseInt(timeArray[0].substring(0,timeArray[0].length-1));
        }
        if (timeArray[1].search('s') != -1) {
            seconds += parseInt(timeArray[0].substring(0,timeArray[0].length-1));
        }
    } else if (timeArray.length == 1) {
        if (timeArray[0].search('h') != -1) {
            seconds += parseInt(timeArray[0].substring(0,timeArray[0].length-1)) * 3600;
        }
        if (timeArray[0].search('m') != -1) {
            seconds += parseInt(timeArray[0].substring(0,timeArray[0].length-1)) * 60;
        }
        if (timeArray[0].search('s') != -1) {
            seconds += parseInt(timeArray[0].substring(0,timeArray[0].length-1));
        }
    }
    return seconds;
}

Beastx.ArribalTimesImprover.prototype.setTravelTimeMsg = function(loadingSeconds, travelSeconds) {
    DOM.removeAllChildNodes(this.timeDescriptionElement);
    this.timeDescriptionElement.appendChild(this.timeDescriptionLabelElement);
    
    var formatedLoadingTime = this.formatTime(loadingSeconds);
    var formatedTravelTime = this.formatTime(travelSeconds);
    var formatedTotalTime = this.formatTime(loadingSeconds + travelSeconds);
    
    if (formatedLoadingTime) {
        this.timeDescriptionElement.appendChild(DOM.createElement('span', null, [ formatedLoadingTime ]));
        this.timeDescriptionElement.appendChild(DOM.createElement('span', null, [ ' + ' ]));
        this.timeDescriptionElement.appendChild(DOM.createElement('span', null, [ formatedTravelTime ]));
        this.timeDescriptionElement.appendChild(DOM.createElement('span', null, [ ' = ' ]));
    }
    this.timeDescriptionElement.appendChild(DOM.createElement('strong', null, [ formatedTotalTime ]));
}

Beastx.ArribalTimesImprover.prototype.initializeUpdateTravelTime = function() {
    this.portLevel = IkaTools.cities.getCurrentCity().getBuildingByTypeId(3).getLevel();
    this.loadingSpeeds = [ 3, 30, 60, 93, 129, 169, 213, 261, 315, 373, 437, 508, 586, 672, 766, 869, 983, 1108, 1246, 1398, 1565, 1748, 1950, 2172, 2416 ];
    this.timeDescriptionElement = $$('#missionSummary .journeyTime')[0];
    this.travelTime = this.parseTravelTime(this.timeDescriptionElement.textContent.split(':')[1].trim());
    this.timeDescriptionLabelElement = DOM.createElement('span', { 'class': 'textLabel' }, [ 'Tiempo de viaje: ' ]);
    this.setTravelTimeMsg(0, this.travelTime);
    setInterval(this.caller('updateTravelTime'), 100);
}

Beastx.ArribalTimesImprover.prototype.updateTravelTime = function() {
    var totalResources = this.getTotalResources();
    var resourcesLoadedBySeconds = this.loadingSpeeds[this.portLevel] / 60;
    this.setTravelTimeMsg(parseInt(totalResources / resourcesLoadedBySeconds), this.travelTime);
}

Beastx.ArribalTimesImprover.prototype.getDefaultConfigs = function() {
    Beastx.log('paso por aca');
    Beastx.Config.options.ArribalTimesImprover = {
        enabled: true,
        calculateTotalTravelTime: true
    }
}

Beastx.ArribalTimesImprover.prototype.getConfigs = function() {
    return {
        calculateTotalTravelTime: this.calculateTotalTravelTimeCheckbox.checked
    };
}

Beastx.ArribalTimesImprover.prototype.getOptionBox = function() {
    this.calculateTotalTravelTimeCheckbox = this.checkbox('calculateTotalTravelTime', Beastx.Config.options.ArribalTimesImprover.calculateTotalTravelTime);
    return this.keyValueTable([
        { label: 'Calcular tiempo total sumando el tiempo de carga"', value:  this.calculateTotalTravelTimeCheckbox}
    ]);
}

Beastx.registerModule(
    'Arribal Times Improver',
    'Este modulo nos mejora la vista del tiempo que tardaran los barcos en llegar, ya que le suma el tiempo de carga teniendo en cuenta el level del puerto.'
);