// ==UserScript==
// @name                  Transport Resources Helper
// @namespace       Beastx
// @description        Transport Resources Helper
// @include               http://*.ikariam.com/*

// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/Beastx.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/VAR.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/DOM.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/IkaTools.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/ScriptUpdater.js

// @version               0.01
// @author                Beastx
//
// @history                0.01 Initial release
// ==/UserScript==

ScriptUpdater.check('TransportResourcesHelper', "0.01");

Beastx.TransportResourcesHelper = function() {};

Beastx.TransportResourcesHelper.prototype.init = function(currentView) {
    if (currentView != 'transport' && currentView != 'branchOffice' && currentView != 'takeOffer' && currentView != 'colonize') {
        return;
    }
    this.scriptName = 'Transport Resources Helper';
    Beastx.todo('ver que pasa en las vistas de la tienda', this);
    this.resources = ['wood', 'wine', 'marble', 'glass', 'sulfur'];
    this.posibleValues = [
        { text: '-', value: -500, width: 5, left: 0 },
        { text: '+', value: 500, width: 5, left: 23 },
        { text: '1k', value: 1000, width: 15, left: 46 },
        { text: '2k', value: 2000, width: 15, left: 79 },
        { text: '5k', value: 5000, width: 15, left: 112 },
        { text: '10k', value: 10000, width: 20, left: 145 }
    ];
    this.ulElement = $$('ul.resourceAssign')[0];
    this.resourceLiElements = $$('ul.resourceAssign li');
    this.resourceInputElements = $$('ul.resourceAssign li input.textfield');
    this.addBasicStyles();
    this.addButtons();
}

Beastx.TransportResourcesHelper.prototype.addButtons = function() {
    for (var i = 0; i < this.resources.length; ++i) {
        for (var j = 0; j < this.posibleValues.length; ++j) {
            if (this.resourceInputElements[i]) {
                this.resourceLiElements[i].appendChild(this.getButton(i, this.posibleValues[j], (j + 1)));
            }
        }
    }
}

Beastx.TransportResourcesHelper.prototype.addBasicStyles = function() {
    this.ulElement.style.margin = '0em';
    this.ulElement.style.width = '100%';
    for (var i = 0; i < this.resourceInputElements.length; ++i) {
        this.resourceInputElements[i].style.width = '45px';
        this.resourceInputElements[i].style.left = '430px';
    }
    var default_style = <><![CDATA[
    #container .resourceAssign .sliderinput { margin-left: 30px; }
    ]]></>.toXMLString();
    GM_addStyle(default_style);
}

Beastx.TransportResourcesHelper.prototype.onButtonClick = function(resourceIndex, value) {
    var input = this.resourceInputElements[resourceIndex];
    input.value = (Math.floor(parseInt(input.value)/500)*500) + value;
    var evt = document.createEvent("KeyEvents");
    evt.initKeyEvent('keyup', true, true, window, false, false, false, false, 13, 0);
    input.dispatchEvent(evt);
}

Beastx.TransportResourcesHelper.prototype.getButton = function(resourceIndex, value, index) {
    var me = this;
    return DOM.createElement('a', {
        href: '#',
        'class': 'button',
        style: {
            width: value.width + 'px',
            padding: '2px 5px',
            top: '-7px',
            left: (485 + value.left) + 'px',
            position: 'absolute'
        },
        onclick: function(event) {
            DOM.cancelEvent(event);
            me.onButtonClick(resourceIndex, value.value);
        }
    }, [ value.text ]);
}