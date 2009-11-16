// ==UserScript==
// @name                  Transport Resources Helper
// @version               0.4
// @author                Beastx
//
// @history                0.4 improve buttons behaviors
// @history                0.3 fixed problems with complete ship button
// @history                0.2 Fixed problem when dont have all resources availabled
// @history                0.2 Added complete ship button
// @history                0.2 Added status msg
// @history                0.1 Initial release
// ==/UserScript==

Beastx.TransportResourcesHelper = function() {};

Beastx.TransportResourcesHelper.prototype.init = function(currentView) {
    if (currentView != 'transport' && currentView != 'branchOffice' && currentView != 'takeOffer' && currentView != 'colonize') {
        return;
    }
    this.scriptName = 'Transport Resources Helper';
    Beastx.todo('ver que pasa en las vistas de la tienda', this);
    this.resources = ['wood', 'wine', 'marble', 'glass', 'sulfur'];
    this.posibleValues = [
        { text: ' - ', value: -500, width: 5, left: 0 },
        { text: ' + ', value: 500, width: 5, left: 23 },
        { text: '1k', value: 1000, width: 15, left: 46 },
        { text: '2k', value: 2000, width: 15, left: 79 },
        { text: '5k', value: 5000, width: 15, left: 112 },
        { text: '10k', value: 10000, width: 20, left: 145 }
    ];
    this.completeShipButtons = [];
    this.buttons = [];
    this.ulElement = $$('ul.resourceAssign')[0];
    this.resourceLiElements = $$('ul.resourceAssign li');
    this.resourceInputElements = $$('ul.resourceAssign li input.textfield');
    this.ulElement.parentNode.insertBefore(this.getStautsMSG(), this.ulElement);
    this.addBasicStyles();
    this.addButtons();
    setInterval(this.caller('updateStatus'), 100);
    setInterval(this.caller('updateButtons'), 100);
}

Beastx.TransportResourcesHelper.prototype.getStautsMSG = function() {
    this.statusMsg = this.element('div', { 'class': 'statusMsg' }, [ this.element('span', null, [ ' ' ]) ]);
    return this.statusMsg;
}

Beastx.TransportResourcesHelper.prototype.getTotalResources = function() {
    var totalResources = 0;
    for (var i = 0; i < this.resourceInputElements.length; ++i) {
        totalResources += parseInt(this.resourceInputElements[i].value);
    }
    return totalResources;
}

Beastx.TransportResourcesHelper.prototype.updateButtons = function() {
    var totalResources = this.getTotalResources();
    for (var i = 0; i < this.resourceInputElements.length; ++i) {
        DOM.setHasClass(this.completeShipButtons[i], 'disabled', totalResources%500 == 0);
        DOM.setHasClass(this.buttons[i][1], 'disabled', parseInt(this.resourceInputElements[i].value) < 500);
    }
}

Beastx.TransportResourcesHelper.prototype.updateStatus = function() {
    var totalResources = this.getTotalResources();
    this.statusMsg.removeChild(this.statusMsg.childNodes[0]);
    this.statusMsg.appendChild(this.element('span', null, [
        'Total de bienes cargados: ',
        this.element('strong', null, [ totalResources > 0 ? totalResources : '0' ]),
        ' | Barcos usados: ',
        this.element('strong', null, [ (Math.floor(totalResources / 500)) > 0 ? (Math.floor(totalResources / 500)) : '0' ]),
        ' | Bienes necesarios para carga completa: ',
        this.element('strong', null, [ (500 - (totalResources%500)) > 0 && (500 - (totalResources%500)) != 500 ? (500 - (totalResources%500)) : '0' ])
    ]));
}

Beastx.TransportResourcesHelper.prototype.addButtons = function() {
    for (var i = 0; i < this.resourceLiElements.length; ++i) {
        var buttonsContainer = this.element('div', { 'class': 'buttonsContainer'});
        for (var j = 0; j < this.posibleValues.length; ++j) {
            buttonsContainer.appendChild(this.getButton(i, this.posibleValues[j], (j + 1)));
        }
        buttonsContainer.appendChild(this.getCompleteShipButton(i));
        this.resourceLiElements[i].appendChild(buttonsContainer);
    }
}

Beastx.TransportResourcesHelper.prototype.addBasicStyles = function() {
    var default_style = <><![CDATA[
    #mainview .resourceAssign li { height: 70px; background-position: 4px 10px !important; }\
    .buttonsContainer { margin-top: 15px; text-align: right; } \
    .buttonsContainer .button{ margin-left: 5px; } \
    .buttonsContainer .disabled{ opacity: 0.4; cursor: default;} \
    .buttonsContainer .disabled:hover{ color: #542C0F} \
    .statusMsg { margin-top: 10px; margin-bottom: 10px; margin-left: 25px; margin-right: 20px; text-align: center; font-size: 12px; border-bottom: 1px solid #666; padding-bottom: 3px; }
    ]]></>.toXMLString();
    GM_addStyle(default_style);
}

Beastx.TransportResourcesHelper.prototype.onButtonClick = function(resourceIndex, value) {
    var input = this.resourceInputElements[resourceIndex];
    var newValue = parseInt(input.value) + parseInt(value);
    if (value == 500 || value == -500) {
        if (newValue%500 != 0) {
            if (newValue%500 >= 250) {
                newValue += 500 - (newValue%500);
            } else {
                newValue -= newValue%500;
            }
        }
    }
    input.value = newValue;
    var evt = document.createEvent("KeyEvents");
    evt.initKeyEvent('keyup', true, true, window, false, false, false, false, 13, 0);
    input.dispatchEvent(evt);
}

Beastx.TransportResourcesHelper.prototype.getButton = function(resourceIndex, value, index) {
    var me = this;
    if (!this.buttons[resourceIndex]) {
        this.buttons[resourceIndex] = [];
    }
    this.buttons[resourceIndex][index] = this.element('a', {
        href: '#',
        'class': 'button',
        onclick: function(event) {
            DOM.cancelEvent(event);
            me.onButtonClick(resourceIndex, value.value);
        }
    }, [ value.text ]);
    return this.buttons[resourceIndex][index];
}

Beastx.TransportResourcesHelper.prototype.onCompleteShipButtonClick = function(resourceIndex) {
    var totalResources = this.getTotalResources();
    if (totalResources%500 != 0) {
        var input = this.resourceInputElements[resourceIndex];
        input.value = parseInt(input.value) + (500 - (totalResources%500));
        var evt = document.createEvent("KeyEvents");
        evt.initKeyEvent('keyup', true, true, window, false, false, false, false, 13, 0);
        input.dispatchEvent(evt);
    }
}

Beastx.TransportResourcesHelper.prototype.getCompleteShipButton = function(resourceIndex) {
    var me = this;
    this.completeShipButtons[resourceIndex] = this.element('a', {
        href: '#',
        'class': 'button',
        onclick: function(event) {
            DOM.cancelEvent(event);
            me.onCompleteShipButtonClick(resourceIndex);
        }
    }, [ 'Completar barco' ]);
    return this.completeShipButtons[resourceIndex];
}

Beastx.TransportResourcesHelper.prototype.getDefaultConfigs = function() {
    Beastx.Config.options.TransportResourcesHelper = {
        enabled: true,
        showLessButton: true,
        showMoreButton: true,
        show1kButton: true,
        show2kButton: true,
        show5kButton: true,
        show10kButton: true,
        showFullCargoButton: true
    }
}

Beastx.TransportResourcesHelper.prototype.getConfigs = function() {
    return {
        showLessButton: this.showLessCheckbox.checked,
        showMoreButton: this.showMoreCheckbox.checked,
        show1kButton: this.show1kCheckbox.checked,
        show2kButton: this.show2kCheckbox.checked,
        show5kButton: this.show5kCheckbox.checked,
        show10kButton: this.show10kCheckbox.checked,
        showFullCargoButton: this.showFullCargoCheckbox.checked
    };
}

Beastx.TransportResourcesHelper.prototype.getOptionBox = function() {
    this.showLessCheckbox = this.checkbox('showLessButton', Beastx.Config.options.TransportResourcesHelper.showLessButton);
    this.showMoreCheckbox = this.checkbox('showMoreButton', Beastx.Config.options.TransportResourcesHelper.showMoreButton);
    this.show1kCheckbox = this.checkbox('show1kButton', Beastx.Config.options.TransportResourcesHelper.show1kButton);
    this.show2kCheckbox = this.checkbox('show2kButton', Beastx.Config.options.TransportResourcesHelper.show2kButton);
    this.show5kCheckbox = this.checkbox('show5kButton', Beastx.Config.options.TransportResourcesHelper.show5kButton);
    this.show10kCheckbox = this.checkbox('show10kButton', Beastx.Config.options.TransportResourcesHelper.show10kButton);
    this.showFullCargoCheckbox = this.checkbox('showFullCargoButton', Beastx.Config.options.TransportResourcesHelper.showFullCargoButton);
    return this.keyValueTable([
        { label: 'Mostrar Boton " - "', value: this.showLessCheckbox },
        { label: 'Mostrar Boton " + "', value: this.showMoreCheckbox },
        { label: 'Mostrar Boton "1k"', value: this.show1kCheckbox },
        { label: 'Mostrar Boton "2k"', value: this.show2kCheckbox },
        { label: 'Mostrar Boton "5k"', value: this.show5kCheckbox },
        { label: 'Mostrar Boton "10k"', value: this.show10kCheckbox },
        { label: 'Mostrar Boton "Completar Barco"', value:  this.showFullCargoCheckbox}
    ]);
}

Beastx.registerModule(
    'Transport Resources Helper',
    'Este modulo agrega botones con cantidades determinadas en las paginas que tengan que ver con transporte para facilitar la tarea.'
);