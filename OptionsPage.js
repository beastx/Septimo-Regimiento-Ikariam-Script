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
    this.createAndAppendOptionBlock();
    this.optionsForm.setValue(this.options);
}

Beastx.OptionsPage.prototype.optionBoxRow = function(label, input, description, disabled) {
    if (disabled) {
        input.disabled = true;
    }
    return DOM.createElement('tr', {}, [
        DOM.createElement('th', { style: { padding: '15px 8px', width: '400px', borderBottom: '1px solid #CCC' }}, [
            label,
            disabled ? DOM.createElement('span', { style: { color: 'red', fontWeight: 'normal' }}, [ ' No Disponible!!' ]) : null,
            description ?
                DOM.createElement('span',
                    { style: { fontWeight: 'normal', display: 'block', fontSize: '0.9em'} },
                    [ description ]
                )
                : null
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
    var scriptUpdater = New(ScriptUpdater, [ 'Beastx.Septimo_regimiento.user.js', Beastx.currentVersion, true ]);
    scriptUpdater.forceCheck();
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
                    href: '#',
                    onclick: DOM.createCaller(this, 'onForceClick')
                }, [ 'Forzar' ])
            )
        ]),
        this.optionBoxBlock('Habilitar Modulos', [
            this.optionBoxRow(
                'Beastx - Data Saver',
                this.checkbox('dataSaver'),
                'Este modulo se encarga de ir recolectando informacion de nuestro juego e ir enviandola al servidor para que sea guardado prosesado y mostrado en el sitio web para ayudar con el analisis y organizacion de la Alianza.'
            ),
            this.optionBoxRow(
                'Beastx - Thin Views',
                this.checkbox('thinView'),
                'Este modulo sirve para sacar pedasos de la interface que no son utiles y ocupan espacio inutilmente en paginas donde el espacio es muy valioso, por ejemplo remueve los textos descriptivos de cada unidad en la vista del Cuartel.'
            ),
            this.optionBoxRow(
                'Beastx - Military Page Improver',
                this.checkbox('militaryPageImprover'),
                'Mejora de las tareas y vista de la pagina del General de la alianza (se agregan filtros y se limpian de la pantalla los honderos apostados en las polis aliadas).'
            ),
            this.optionBoxRow(
                'Beastx - ScrollBar Remover',
                this.checkbox('scrollBarRemover'),
                'Este modulo remueve el molesto scrollbar horizontal que aparece en Firefox (al menos en resoluciones de hasta 1280x1024).'
            ),
            this.optionBoxRow(
                'Beastx - Our Deployed Cities Cleaner',
                this.checkbox('ourDeployedCitiesCleaner'),
                'Este modulo remueve de la lista de ciudades todas las ciudades de los aliados donde tenemos apostados nuestras unidades.'
            ),
            this.optionBoxRow(
                'Beastx - Transport Resources Helper',
                this.checkbox('transportResourcesHelper'),
                'Este modulo agrega botones con cantidades determinadas en las paginas que tengan que ver con transporte para facilitar la tarea.'
            ),
            this.optionBoxRow(
                'Beastx - Ship Movements View Improver',
                this.checkbox('shipMovementsViewImprover'),
                'Este modulo muestra iconos con los tipos y cantidades de recursos y/o tropas transportadas cuando se esta en la vista militar.'
            ),
            this.optionBoxRow(
                'Beastx - Allied Online Advisor',
                this.checkbox('alliedOnlineAdvisor'),
                'Este modulo muestra iconos en las ciudades de los aliados o en la pagina de los mensajes mostrandonos si nuestro companero esta online o no.'
            ),
            this.optionBoxRow(
                'Beastx - Upgrade Watcher',
                this.checkbox('upgradeWatcher'),
                'Este modulo nos muestra un icono de color al lado de cada construccion para saber si tenemos recursos suficientes para una ampliacion o no.'
            ),
            this.optionBoxRow(
                'Beastx - Inline Score',
                this.checkbox('inlineScore'),
                'Nos muestra informacion de los diferentes puntajes de cada jugador en la vista Isla.'
            ),
            this.optionBoxRow(
                'Beastx - Empire Board',
                this.checkbox('empireBoard'),
                'Este modulo incluye los script Empire Board y Empire Board Graphic AddOn'
            ),
            this.optionBoxRow(
                'Beastx - Embassy Tools',
                this.checkbox('embassyTools'),
                'Este modulo nos da diferentes herramientas en la pagina del Diplomatico y en la pagina de la embajada, como ordenar los usuarios por diferentes columnas, accesos directos a las polis de los miembros entre otras cosas.'
            ),
            this.optionBoxRow(
                'Beastx - Favorite Targets',
                this.checkbox('favoriteTargets'),
                'Este modulo nos permite guardar en favoritos diferentes polis para tener un facil acceso a ellas.',
                true
            ),
            this.optionBoxRow(
                'Beastx - Alliance Map',
                this.checkbox('allianceMap'),
                'Este modulo nos muestra un mapa marcandonos en las islas aledanias donde hay ciudades de aliados.',
                true
            ),
            this.optionBoxRow(
                'Beastx - Distance Calculator',
                this.checkbox('distanceCalculator'),
                'Este modulo nos agrega un cuadro en la vista de isla diciendonos los tiempos que demora cada tipo de unidad en llegar desde nuestra polis actual a la isla que estamos viendo.',
                true
            ),
            this.optionBoxRow(
                'Beastx - Library Improvements',
                this.checkbox('libraryImprovements'),
                'Este modulo mejora la vista de biblioteca, mostrandonos que nos provee y cuanto tiempo nos demora cada investigacion en la lista, en vez de simplemente el nombre de la investigacion.',
                true
            ),
            this.optionBoxRow(
                'Beastx - Message Manager',
                this.checkbox('messageManager'),
                'Este modulo hace que el envio de mensajes sea mucho mas organizado, dandonos tipos de mensajes a enviar, y agregando opciones de reenviar a otra persona, etc.',
                true
            ),
            this.optionBoxRow(
                'Beastx - Shipment Times',
                this.checkbox('shipmentTimes'),
                'Este modulo nos el dato de cuanto tiempo tardara un envio desde nuestro puerto, teniendo en cuenta el tiempo de carga segun nuestro nivel de puerto y el tiempo de viaje segun la polis de destino.',
                true
            ),
            this.optionBoxRow(
                'Beastx - Research Advisor Helper',
                this.checkbox('researchAdvisorHelper'),
                'Este modulo nos agrega botones y tablas con datos que nos ayudaran en la tarea de manejar los investigadores.',
                true
            ),
            this.optionBoxRow(
                'Beastx - ResearchPointsHelper',
                this.checkbox('researchPointsHelper'),
                'Este modulo....',
                true
            ),
            this.optionBoxRow(
                'Beastx - GroupMessenger',
                this.checkbox('groupMessenger'),
                'Este modulo.....',
                true
            ),
            this.optionBoxRow(
                'Beastx - ArribalTimesImprover',
                this.checkbox('arribalTimesImprover'),
                'Este modulo....',
                true
            ),
            this.optionBoxRow(
                'Beastx - CombatLayoutHelper',
                this.checkbox('combatLayoutHelper'),
                'Este modulo....',
                true
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
    location.href = 'http://s2.ar.ikariam.com/index.php?view=city&id=' + IkaTools.cities.getCurrentCityId();
}

Beastx.OptionsPage.prototype.getAndPrepareConfigs = function() {
    this.options = Beastx.Config.options;
}