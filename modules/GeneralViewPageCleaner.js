// ==UserScript==
// @name                  General View Page Cleaner
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.GeneralViewPageCleaner = function() {}
    
Beastx.GeneralViewPageCleaner.prototype.init = function(currentView) {
    if (currentView != 'embassyGeneralAttacksFromAlly') {
        return;
    }
    this.scriptName = 'General View Page Cleaner';
    this.tableElement = $$('div.content table.table01')[0];
    this.trs = $$('tr.rowRanks');
    this.ourRowVisible = Beastx.getGMValue('GeneralViewPageCleaner_ourRowVisible', false);
    this.addOptionsLinks();
    this.toggleViewOurRow();
    Beastx.todo('leer la lista de players desde el server', this);
}

Beastx.GeneralViewPageCleaner.prototype.addOptionsLinks = function() {
    this.optionsBlock = DOM.createElement('table', { 'class': 'table01' }, [ 
        DOM.createElement('tbody', null, [ 
            DOM.createElement('tr', null, [ 
                DOM.createElement('td', null, [ 
                    this.toogleLink = DOM.createElement('a', { href: '#', onclick: DOM.createCaller(this, 'onToggleViewOurRowCheckboxClick') }, [ 'Ocultar nuestros honderos' ])
                ]),
                DOM.createElement('td', null, [ 
                    'Filtrar por miembro:',
                    this.playerSelect = DOM.createElement('select', { onchange: DOM.createCaller(this, 'onPlayerSelectChange') }, [
                        DOM.createElement('option', { value: '' }, [ 'Sin filtrar' ]),
                        DOM.createElement('option', { value: 'beastx' }, [ 'beastx' ]),
                        DOM.createElement('option', { value: 'heroe anonimo' }, [ 'heroe anonimo' ]),
                        DOM.createElement('option', { value: 'lais' }, [ 'lais' ]),
                        DOM.createElement('option', { value: 'adergus' }, [ 'adergus' ]),
                        DOM.createElement('option', { value: 'homar' }, [ 'homar' ]),
                        DOM.createElement('option', { value: 'wodan' }, [ 'wodan' ]),
                        DOM.createElement('option', { value: 'maidamar' }, [ 'maidamar' ]),
                        DOM.createElement('option', { value: 'pedrote' }, [ 'pedrote' ]),
                        DOM.createElement('option', { value: 'amazona' }, [ 'amazona' ]),
                        DOM.createElement('option', { value: 'ferman' }, [ 'ferman' ]),
                        DOM.createElement('option', { value: 'leocossu' }, [ 'leocossu' ])
                    ])
                ])
            ])
        ])
    ]);
    this.tableElement.parentNode.insertBefore(this.optionsBlock, this.tableElement);
}

Beastx.GeneralViewPageCleaner.prototype.onPlayerSelectChange = function() {
    this.filterByPlayer(this.playerSelect.value);
}

Beastx.GeneralViewPageCleaner.prototype.onToggleViewOurRowCheckboxClick = function(event) {
    DOM.cancelEvent(event);
    this.ourRowVisible = !this.ourRowVisible;
    this.toggleViewOurRow();
    Beastx.setGMValue('GeneralViewPageCleaner_ourRowVisible', this.ourRowVisible);
}

Beastx.GeneralViewPageCleaner.prototype.toggleViewOurRow = function() {
    for (var i = 0; i < this.trs.length; ++i) {
        if (this.playerSelect.value != '') {
             if (this.isOfPlayer(this.trs[i], this.playerSelect.value)) {
                if (this.isOurRow(this.trs[i])) {
                    this.trs[i].style.display = this.ourRowVisible ? '' : 'none';
                }
            } else {
                this.trs[i].style.display = 'none';
            }
        } else {
            if (this.isOurRow(this.trs[i])) {
                this.trs[i].style.display = this.ourRowVisible ? '' : 'none';
            }
        }
    }
    this.toogleLink.firstChild.nodeValue = this.ourRowVisible ? 'Ocultar nuestros honderos' : 'Mostrar nuestros honderos';
}

Beastx.GeneralViewPageCleaner.prototype.filterByPlayer = function(player) {
    for (var i = 0; i < this.trs.length; ++i) {
        if (player == '') {
            if (!this.ourRowVisible && this.isOurRow(this.trs[i])) {
                this.trs[i].style.display =  'none';
            } else {
                this.trs[i].style.display =  '';
            }
        } else {
            if (this.isOfPlayer(this.trs[i], player)) {
                if (!this.ourRowVisible && this.isOurRow(this.trs[i])) {
                    this.trs[i].style.display =  'none';
                } else {
                    this.trs[i].style.display =  '';
                }
            } else {
                this.trs[i].style.display = 'none';
            }
        }
    }
}

Beastx.GeneralViewPageCleaner.prototype.isOurRow = function(tr) {
    return tr.childNodes[3].childNodes[0].nodeValue == 'Estacionar tropas' && tr.childNodes[5].childNodes[0].nodeValue == 1;
}

Beastx.GeneralViewPageCleaner.prototype.isOfPlayer = function(tr, player) {
    return tr.childNodes[7].childNodes[0].childNodes[0].nodeValue.toLowerCase() == player.toLowerCase();
}

Beastx.registerModule(
    'General View Page Cleaner',
    'Mejora de las tareas y vista de la pagina del General de la alianza (se agregan filtros y se limpian de la pantalla los honderos apostados en las polis aliadas).'
);