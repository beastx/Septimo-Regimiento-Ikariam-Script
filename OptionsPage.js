// ==UserScript==
// @name                  Options Page
// @version               0.2
// @author                Beastx

// @history                0.2 Improve several styles for option boxs
// @history                0.2 Added some module descriptions
// @history                0.2 Added new options
// @history                0.1 Initial release
// ==/UserScript==

Beastx.OptionsPage = function() {};

Beastx.OptionsPage.prototype.init = function() {
    this.getAndPrepareConfigs();
    this.optionsForm = New(Beastx.Form, [{ save: function(value) {} }]);
    this.registeredModules = Beastx.getRegisteredModules();
    this.createAndAppendOptionBlock();
    //~ this.optionsForm.setValue(this.options);
}

Beastx.OptionsPage.prototype.optionBoxRow = function(label, input, description, hasSubOptionsBox) {
    return DOM.createElement('tr', {}, [
        DOM.createElement('th', { style: { padding: '15px 8px', width: '400px', borderBottom: '1px solid #CCC' }}, [
            label,
            DOM.createElement('span',
                { style: { fontWeight: 'normal', display: 'block', fontSize: '0.9em'} },
                [ description ]
            )
        ]),
        DOM.createElement('td', { style: { padding: '15px 8px', borderBottom: '1px solid #CCC'} }, [ input ])
    ])
}
    
Beastx.OptionsPage.prototype.optionBoxBlock = function(title, inputs) {
    return DOM.createElement('div', null, [
        DOM.createElement('h3', {}, [ title ]),
        DOM.createElement('table', { cellSpacing: 0, cellPadding: 0 }, [
            DOM.createElement('tbody', {}, inputs)
        ])
    ]);
}

Beastx.OptionsPage.prototype.textInput = function(id, value) {
    return this.optionsForm.add(
        id,
        DOM.createElement('input', {
            'class': 'textfield',
            type: 'text',
            value: value,
            size: 20
        })
    );
}

Beastx.OptionsPage.prototype.checkbox = function(id, value) {
    return this.optionsForm.add(
        id,
        DOM.createElement('input', {
            type: 'checkbox',
            checked: value
        })
    );
}

Beastx.OptionsPage.prototype.onForceClick = function(event) {
    DOM.cancelEvent(event);
    var date = new Date();
    location.href = 'http://7moreg.beastx.com.ar/tools/userScripts/' + date.getTime() + '/Beastx.Septimo_regimiento.user.js';
    //~ var scriptUpdater = New(ScriptUpdater, [ 'Beastx.Septimo_regimiento.user.js', Beastx.currentVersion, true ]);
    //~ scriptUpdater.forceCheck();
}
Beastx.OptionsPage.prototype.getModuleRow = function(registeredModule) {
    var instancedModuleRow = New(Beastx.OptionsPageRow, [ registeredModule.id, 'Beastx - ' + registeredModule.name, registeredModule.description ])
    this.optionsForm.add(
        registeredModule.id,
        instancedModuleRow
    );
    return instancedModuleRow.element;
}

Beastx.OptionsPage.prototype.createAndAppendOptionBlock = function() {
    var optionsBlocks = [];
    for (var i = 0; i < this.registeredModules.length; ++i) {
        optionsBlocks.push(
            this.getModuleRow(this.registeredModules[i])
        );
    }
    
    this.optionsBoxContainer = DOM.createElement('div', null, [
        this.optionBoxBlock('Configuracion General', [
            this.optionBoxRow(
                'Dejar el menu fijo',
                this.checkbox('menuFixed', Beastx.Config.options.menuFixed),
                'Cuando habilitamos esta opcion, el menu quedara siempre visible aunque usemos el scroll de la pagina, en cambio si la desabilitamos el menu bajara y subira cmo una parte mas d ela pagina.'
            ),
            this.optionBoxRow(
                'Forzar Update',
                DOM.createElement('a', {
                    href: '#',
                    onclick: DOM.createCaller(this, 'onForceClick')
                }, [ 'Forzar' ])
            )
        ]),
        this.optionBoxBlock('Habilitar Modulos', optionsBlocks),
        this.optionBoxBlock('Debug', [
            this.optionBoxRow(
                'Usar firefox para Logear',
                this.checkbox('debugMode', Beastx.Config.options.debugMode),
                'OJO!!!.. no tocar esto.....'
            ),
            this.optionBoxRow(
                'Url del Servidor',
                this.textInput('serverUrl', Beastx.Config.options.serverUrl),
                'OJO!!!.. no tocar esto.....'
            )
        ]),
        DOM.createElement('div', { 'class': 'centerButton' }, [
            DOM.createElement('input', {
                'class': 'button',
                type: 'button',
                onclick: DOM.createCaller(this, 'save'),
                value: 'Guardar cambios'
            })
        ]),
        DOM.createElement('div', { 'class': 'content' }, [
            DOM.createElement('p', { 'class': 'error' }, [
                DOM.createElement('a',
                    {
                        href: 'http://7moreg.beastx.com.ar/',
                        target: '_blank'
                    },
                    [ 'Septimo Regimiento Script' ]
                ),
                '  ',
                DOM.createElement('a',
                    {
                        style: { fontWeight: 'normal' },
                        href: 'http://beastxblog.com',
                        target: '_blank'
                    },
                    [ 'by Beastx' ]
                )
            ])
        ])
    ]);
    
    IkaTools.addOptionBlock('Septimo Regimiento Script', this.optionsBoxContainer);
}

Beastx.OptionsPage.prototype.save = function() {
    var options = this.optionsForm.getValue();
    Beastx.Config.options = options;
    Beastx.saveConfig();
    location.href = 'http://s2.ar.ikariam.com/index.php?view=city&id=' + IkaTools.cities.getCurrentCityId();
}

Beastx.OptionsPage.prototype.getAndPrepareConfigs = function() {
    this.options = Beastx.Config.options;
}


Beastx.OptionsPageRow = function() {};
    
Beastx.OptionsPageRow.prototype.init = function(id, label, description) {
    this.id = id;
    this.value = Beastx.Config.options[id];
    this.label = label;
    this.description = description;
    this.showExtraOptions = false;
    this.updateUI();
    this.onChange();
};

Beastx.OptionsPageRow.prototype.updateUI = function() {
    this.tempInstancedModule = NewModule(Beastx[this.id], [ 'options', true ]);
    if (this.tempInstancedModule.getOptionBox) {
        this.extraOptionsElement = this.tempInstancedModule.getOptionBox();
    }
    this.element = DOM.createElement('tr', {}, [
        DOM.createElement('th', { style: { padding: '15px 8px', width: '400px', borderBottom: '1px solid #CCC' }}, [
            this.label,
            DOM.createElement('span',
                { style: { fontWeight: 'normal', display: 'block', fontSize: '0.9em'} },
                [ this.description ]
            ),
            this.extraOptionsContainer = DOM.createElement('div', null, [ '' ])
        ]),
        DOM.createElement('td', { style: { padding: '15px 8px', borderBottom: '1px solid #CCC'} }, [ this.getCheckbox() ])
    ]);
};

Beastx.OptionsPageRow.prototype.onChange = function() {
    DOM.removeAllChildNodes(this.extraOptionsContainer);
    this.showExtraOptions = false;
    if (this.input.checked && this.tempInstancedModule.getOptionBox) {
        this.extraOptionsContainer.appendChild(
            this.toogleViewExtraOptionsLink = DOM.createElement('a', { href: '#', onclick: DOM.createCaller(this, 'toogleViewExtraOptions') }, [ 'Mostrar opciones de este modulo'] )
        );
    }
}

Beastx.OptionsPageRow.prototype.toogleViewExtraOptions = function(event) {
    DOM.cancelEvent(event);
    this.showExtraOptions = !this.showExtraOptions;
    if (this.showExtraOptions) {
        this.extraOptionsContainer.appendChild(this.extraOptionsElement);
        this.toogleViewExtraOptionsLink.firstChild.nodeValue = 'Ocultar opciones de este modulo';
    } else {
        this.extraOptionsContainer.removeChild(this.extraOptionsElement);
        this.toogleViewExtraOptionsLink.firstChild.nodeValue = 'Mostrar opciones de este modulo';
    }
}

Beastx.OptionsPageRow.prototype.getValue = function() {
    var configs = this.tempInstancedModule.getConfigs();
    configs.enabled = this.input.checked;
    return configs;
}

Beastx.OptionsPageRow.prototype.setValue = function(value) {
    this.input.checked = value.enabled ? value.enabled : true;
}

Beastx.OptionsPageRow.prototype.getCheckbox = function() {
    this.input = DOM.createElement('input', {
        type: 'checkbox',
        checked: this.value ? this.value.enabled : true,
        onchange: DOM.createCaller(this, 'onChange')
    });
    return this.input;
}