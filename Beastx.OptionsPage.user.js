// ==UserScript==
// @name                  Options Page
// @namespace       Beastx
// @description        Options Page
// @include               http://*.ikariam.com/*

// @require               http://ikariam.beastx/tools/userScripts/requires/Beastx.js
// @require               http://ikariam.beastx/tools/userScripts/requires/VAR.js
// @require               http://ikariam.beastx/tools/userScripts/requires/DOM.js
// @require               http://ikariam.beastx/tools/userScripts/requires/IkaTools.js
// @require               http://ikariam.beastx/tools/userScripts/requires/ScriptUpdater.js

// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

ScriptUpdater.check('OptionsPage', "0.1");

Beastx.OptionsPage = function() {};

Beastx.OptionsPage.prototype.init = function() {
    this.getAndPrepareConfigs();
    this.optionsForm = New(Beastx.Form, [{ save: function(value) { Beastx.log(value) } }]);
    this.createAndAppendOptionBlock();
    this.optionsForm.setValue(this.options);
}


Beastx.OptionsPage.prototype.optionBoxRow = function(label, input, description) {
    return DOM.createElement('tr', {}, [
        DOM.createElement('th', { style: { width: '250px' }}, [
            label,
            description ?
                DOM.createElement('span',
                    { style: { fontWeight: 'normal', display: 'block', fontSize: '0.9em'} },
                    [ description ]
                )
                : null
        ]),
        DOM.createElement('td', {}, [ input ])
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

Beastx.OptionsPage.prototype.createAndAppendOptionBlock = function() {
    this.optionsBoxContainer = DOM.createElement('div', null, [
        this.optionBoxBlock('Configuracion General', [
            this.optionBoxRow(
                'Mostrar Menu Superior',
                this.checkbox('showMenu')
            ),
            this.optionBoxRow(
                'Forzar Update',
                DOM.createElement('a', {
                    href: '#'
                }, [ 'Forzar' ])
            )
        ]),
        this.optionBoxBlock('Habilitar Modulos', [
            this.optionBoxRow(
                'Beastx Data Saver',
                this.checkbox('dataSaver'),
                'Este modulo se encarga de ir recolectando informacion de nuestro juego e ir enviandola al servidor para que sea guardado prosesado y mostrado en el sitio web para ayudar con el analisis y organizacion de la Alianza.'
            ),
            this.optionBoxRow(
                'Beastx Thin Views',
                this.checkbox('thinView'),
                'Este modulo sirve para sacar pedasos de la interface que no son utiles y ocupan espacio inutilmente en paginas donde el espacio es muy valioso, por ejemplo remueve los textos descriptivos de cada unidad en la vista del Cuartel.'
            ),
            this.optionBoxRow(
                'Beastx Military Page Improver',
                this.checkbox('militaryPageImprover'),
                'Mejora de las tareas y vista de la pagina del General de la alianza (se agregan filtros y se limpian de la pantalla los honderos apostados en las polis aliadas).'
            ),
            this.optionBoxRow(
                'Beastx ScrollBar Remover',
                this.checkbox('scrollBarRemover'),
                'Este modulo remueve el molesto scrollbar horizontal que aparece en Firefox (al menos en resoluciones de hasta 1280x1024).'
            ),
            this.optionBoxRow(
                'Beastx Our Deployed Cities Cleaner',
                this.checkbox('ourDeployedCitiesCleaner'),
                'Este modulo remueve de la lista de ciudades todas las ciudades de los aliados donde tenemos apostados nuestras unidades.'
            ),
            this.optionBoxRow(
                'Beastx Transport Resources Helper',
                this.checkbox('transportResourcesHelper'),
                'Este modulo agrega botones con cantidades determinadas en las paginas que tengan que ver con transporte para facilitar la tarea.'
            ),
            this.optionBoxRow(
                'Beastx Ship Movements View Improver',
                this.checkbox('shipMovementsViewImprover'),
                'Este modulo muestra iconos con los tipos y cantidades de recursos y/o tropas transportadas cuando se esta en la vista militar.'
            ),
            this.optionBoxRow(
                'Beastx Allied Online Advisor',
                this.checkbox('alliedOnlineAdvisor'),
                'Este modulo muestra iconos en las ciudades de los aliados o en la pagina de los mensajes mostrandonos si nuestro companero esta online o no.'
            ),
            this.optionBoxRow(
                'Beastx Upgrade Watcher',
                this.checkbox('upgradeWatcher'),
                'Este modulo .....'
            )
        ]),
        this.optionBoxBlock('Debug', [
            this.optionBoxRow(
                'Usar firefox para Logear',
                this.checkbox('debugMode'),
                'OJO!!!.. no tocar esto.....'
            ),
            this.optionBoxRow(
                'Url del Servidor',
                this.textInput('serverUrl'),
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
    location.href = 'http://s2.ar.ikariam.com/index.php?view=city&id=' + IkaTools.getCurrentCityId();
}

Beastx.OptionsPage.prototype.getAndPrepareConfigs = function() {
    this.options = Beastx.Config.options;
}