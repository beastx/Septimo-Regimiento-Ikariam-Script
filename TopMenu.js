// ==UserScript==
// @name                  Top Menu
// @version               0.3
// @author                Beastx
//
// @history                0.3 several improvements in messages menu
// @history                0.3 added menus for every option
// @history                0.3 Complete rewrite
// @history                0.2 Fixed problem with css path
// @history                0.2 Added Website and blog links
// @history                0.1 Initial release
// ==/UserScript==

Beastx.TopMenu = function() {};

Beastx.TopMenu.prototype.init = function() {
    this.scriptName = 'TopMenu';

    this.menus = {
        alliance: {
            label: 'Alianza',
            items: [
                { id: 'site', label: 'Website', url: 'http://7moreg.beastx.com.ar/', action: null, target: '_blank' },
                { id: 'blog', label: 'Blog', url: 'http://7moreg.beastx.com.ar/blog/', action: null, target: '_blank' }
            ]
        },
        messages: {
            label: 'Mensajeria',
            items: [
                { id: 'view', label: 'Ver', url: 'http://s2.ar.ikariam.com/index.php?view=diplomacyAdvisor&oldView=tradeAdvisor', action: null },
                { id: 'sendGlobal', label: 'Enviar global', url: 'http://s2.ar.ikariam.com/index.php?view=sendIKMessage&msgType=51&allyId=3972', action: null }
            ]
        },
        notes: {
            label: 'Notas',
            items: [
                { id: 'add', label: 'Agregar nota', url: null, action: this.caller('addNote') },
                { id: 'view', label: 'Ver notas', url: null, action: this.caller('viewNotes') }
            ]
        },
        ikariam: {
            label: 'Ikariam',
            items: [
                { id: 'options', label: 'Opciones', url: 'http://s2.ar.ikariam.com/index.php?view=options', action: null },
                { id: 'forum', label: 'Foro', url: 'http://board.ar.ikariam.com', action: null },
                { id: 'help', label: 'Ayuda', url: 'http://s2.ar.ikariam.com/index.php?view=informations&articleId=10000&mainId=10000', action: null },
                { id: 'close', label: 'Salir', url: 'http://s2.ar.ikariam.com/index.php?action=loginAvatar&function=logout', action: null }
            ]
        },
        clasification: {
            label: 'Clasificaciones',
            items: [
                { id: 'totals', label: 'Total', url: 'http://s2.ar.ikariam.com/index.php?view=highscore&showMe=1', action: null },
                { id: 'army', label: 'Militar', url: 'http://s2.ar.ikariam.com/index.php?view=highscore&showMe=1&highscoreType=army_score_main', action: null },
                { id: 'gold', label: 'Oro', url: 'http://s2.ar.ikariam.com/index.php?view=highscore&showMe=1&highscoreType=trader_score_secondary', action: null },
                { id: 'alliance', label: 'Alianza', url: 'http://s2.ar.ikariam.com/index.php?view=allyHighscore', action: null }
            ]
        }
    };
    this.menus.messages.items.push({id: 'separator', isSeparator: true });
    if (IkaTools.alliance.players && IkaTools.alliance.players.length > 0) {
        for (var i = 0; i < IkaTools.alliance.players.length; ++i) {
            this.menus.messages.items.push({
                id: 'sendMP' + IkaTools.alliance.players[i].getId(), label: IkaTools.alliance.players[i].getName(), url: 'http://s2.ar.ikariam.com/index.php?view=sendIKMessage&receiverId=' + IkaTools.alliance.players[i].getId(), action: null
            });
        }
    } else {
        this.menus.messages.items.push({
            id: 'updateInfo', label: 'Completar info...', url: 'http://s2.ar.ikariam.com/index.php?view=diplomacyAdvisorAlly', action: null
        });
    }
    this.addStyles();
    this.createAndAppend();
    //~ setInterval(this.caller('updateTime'), 1000);
}

Beastx.TopMenu.prototype.addNote = function() {
    Beastx.myNotes.showAddOrEditNotePopup();
}

Beastx.TopMenu.prototype.viewNotes = function() {
    Beastx.myNotes.showNoteListPopup();
}

Beastx.TopMenu.prototype.createAndAppend = function() {
    this.widget = this.element('div', { id: 'beastxMenuContainer' }, [
        this.element('div', { id: 'beastxMenuContainer2' }, this.getButtons())
    ]);
    document.body.appendChild(this.widget);
}

Beastx.TopMenu.prototype.getButtons = function() {
    var buttonsElements = [];
    var buttonsObjects = [];
    for (var id in this.menus) {
        var topMenuButton = New(Beastx.TopMenuButton, [id, this.menus[id]])
        buttonsObjects.push(topMenuButton);
        buttonsElements.push(topMenuButton.widget);
    }
    return buttonsElements;
}

Beastx.TopMenu.prototype.updateTime = function() {
    this.serverTimeElement.innerHTML = $('servertime').textContent;
}

Beastx.TopMenu.prototype.addStyles = function() {
    GM_addStyle("\
        #container { margin-top: 20px; }\
        #GF_toolbar { display: none; }\
        #extraDiv1 { margin-top: 20px; }\
        #extraDiv2 { margin-top: 20px; }\
        #beastxMenuContainer { text-align: center; position: " + (Beastx.Config.options.menuFixed === false ? 'absolute' : 'fixed') + "; width: 100%; height: 26px; background-color: #666; top: 0px; left: 0px; z-index: 999999; color: white; border-bottom: 2px solid black; }\
        #beastxMenuContainer a { color: white; }\
        #beastxMenuContainer2 { position: absolute; width: 700px; margin-left: -350px; left: 50% }\
        #beastxMenuContainer .topMenuButton { cursor: pointer; display: block; float: left; width: 100px; padding: 0.5em 1em; font-weight: bold; border-left: 1px solid black; border-right: 1px solid black; } \
         body div.mainMenu { position: " + (Beastx.Config.options.menuFixed === false ? 'absolute' : 'fixed') + "; width: 114px; border: 1px solid black; border-top: 1px solid #333; color: black; background-color: #AAA; text-align: left; border-bottom: 3px solid black; padding: 0.5em 5px 0.4em 5px; font-weight: bold; }\
    ");
}

Beastx.TopMenuButton = function() {};

Beastx.TopMenuButton.prototype.init = function(id, options) {
    this.scriptName = 'TopMenuButton';
    this.id = id;
    this.options = options;
    this.items = this.options.items;
    this.updateUI();
}

Beastx.TopMenuButton.prototype.updateUI = function() {
    this.widget = this.element('span',
        {
            'class': 'topMenuButton',
            onclick: this.caller('onClick')
        },
        [ this.options.label ]
    )
}

Beastx.TopMenuButton.prototype.onClick = function(event) {
    DOM.cancelEvent(event);
    var items = [];
    for (var i = 0; i < this.items.length; ++i) {
        if (this.items[i].isSeparator) {
            items.push(New(FloatingMenuSeparator));
        } else {
            items.push(New(FloatingMenuItem, [ this.items[i].label, this.items[i].url, this.items[i].action, this.items[i].target ]));
        }
    }
    var menu = New(FloatingMenu, [ items, 'mainMenu']);
    menu.openBellowElement(this.widget);
}

Beastx.TopMenuButton.prototype.toString = function() {
    return this.id ? this.id : this.scriptName;
}