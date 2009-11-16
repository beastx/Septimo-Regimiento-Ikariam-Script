// ==UserScript==
// @name                  Notes
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.Notes = function() {};

Beastx.Notes.prototype.init = function() {
    this.scriptName = 'Notes';
    this.notes = [];
    this.postUrl = Beastx.Config.postUrl;
    this.loadNotes();
    this.addStyles();
}

Beastx.Notes.prototype.loadNotes = function() {
    DOM.post(
        this.postUrl,
        { className: 'Notes', action: 'get', params: { playerId: IkaTools.player.getId() } },
        this.caller('onServerResponse')
    );
}

Beastx.Notes.prototype.onServerResponse = function(notes) {
    this.notes = notes;
}

Beastx.Notes.prototype.saveNote = function(id, value) {
    if (typeof(id) == 'undefined') {
        this.notes.unshift({
            title: value.title,
            text: value.text
        });
    } else {
        this.notes[id] = {
            title: value.title,
            text: value.text
        };
    }
    DOM.post(
        this.postUrl,
        { className: 'Notes', action: 'save', params: { playerId: IkaTools.player.getId(), notes: this.notes } },
        this.caller('onSaveDone')
    );
}

Beastx.Notes.prototype.onSaveDone = function(notes) {
    this.notes = notes;
    if (this.popup) {
        this.closePopup();
    }
    if (this.notes.length > 0) {
        this.showNoteListPopup(); 
    }
}

Beastx.Notes.prototype.getNoteById = function(id) {
    return this.notes[id];
}

Beastx.Notes.prototype.deleteNote = function(id) {
    var newNotesArray = [];
    for (var i = 0; i < this.notes.length; ++i) {
        if (id != i) {
            newNotesArray.push(this.notes[i]);
        }
    }
    DOM.post(
        this.postUrl,
        { className: 'Notes', action: 'save', params: { playerId: IkaTools.player.getId(), notes: newNotesArray } },
        this.caller('onSaveDone')
    );
}

Beastx.Notes.prototype.editNote = function(id) {
    if (this.popup) {
        this.closePopup();
    }
    this.showAddOrEditNotePopup(id);
}

Beastx.Notes.prototype.getAllNotes = function() {
    return this.notes;
}

Beastx.Notes.prototype.addStyles = function() {
    GM_addStyle("\
        .NotesPopup { padding-top: 0.5em; padding-right: 0.5em; }\
        .NotesPopup h4 { font-weight: bold; padding-bottom: 0.5em; text-decoration: underline; font-size: 1.1em; }\
        .NotesPopup td { padding-bottom: 0.5em; padding-left: 0.5em; }\
        .NotesPopup label { width: 4em; text-align: right; display: block; font-weight: bold; }\
        .NotesPopup .noteNumber { width: 2em; text-align: left; border-bottom: 1px solid #666; }\
        .NotesPopup .noteTitle { width: 30em; text-align: left; border-bottom: 1px solid #666; }\
        .NotesPopup .noteActions { width: 6em; text-align: left; border-bottom: 1px solid #666; }\
        .NotesPopup .noteTitle span { text-decoration: underline; cursor: pointer; }\
        .NotesPopup .noteActions span { text-decoration: underline; cursor: pointer; }\
    ");
}

Beastx.Notes.prototype.showAddOrEditNotePopup = function(id) {
    if (this.popup) {
        this.closePopup();
    }
    if (typeof(id) == 'undefined') {
        var title = '';
        var text = '';
        var popupTitle = 'Agregar nota';
    } else {
        var title = this.notes[id].title;
        var text = this.notes[id].text;
        var popupTitle = 'Editar nota';
    }
    this.createAndOpenPopup(this.element('div', null, [
        this.element('h4', null, [ popupTitle ]),
        this.element('table', null, [
            this.element('tbody', null, [
                this.element('tr', null, [
                    this.element('td', null, [ this.element('label', null, [ 'Titulo' ]) ]),
                    this.element('td', null, [ this.titleInput = this.element('input', { type: 'text', style: { width: '30em' }, value: title }) ])
                ]),
                this.element('tr', null, [
                    this.element('td', null, [ this.element('label', null, [ 'Texto' ]) ]),
                    this.element('td', null, [ this.textInput = this.element('textarea', { style: { height: '10em', width: '30em' } }, [ text ]) ])
                ]),
                this.element('tr', null, [
                    this.element('td'),
                    this.element('td', null, [
                        this.element('input', { onclick: this.caller('onSaveClick', [ id ]),'class': 'button',  type: 'button', value: 'Grabar' }),
                        this.element('input', { onclick: this.caller('closePopup'), 'class': 'button', type: 'button', value: 'Cancelar' })
                    ])
                ])
            ])
        ])
    ]));
}

Beastx.Notes.prototype.onSaveClick = function(id) {
    this.saveNote(id, { title: this.titleInput.value, text: this.textInput.value });
}

Beastx.Notes.prototype.closePopup = function() {
    this.popup.close();
    this.popup = null;
}

Beastx.Notes.prototype.getNotesListUI = function() {
    var trs = [];
    var me = this;
    for (var i = 0; i < this.notes.length; ++i) {
        (function(i) {
            trs.push(
                me.element('tr', null, [
                    me.element('td', { 'class': 'noteNumber' }, [ '#' + i ]),
                    me.element('td', { 'class': 'noteTitle' }, [ me.element('span', { onclick: me.caller('editNote', [ i ]) }, [ me.notes[i].title ]) ]),
                    me.element('td', { 'class': 'noteActions' }, [ me.element('span', { onclick: me.caller('deleteNote', [ i ]) }, [ 'Eliminar' ]) ])
                ])
            );
        })(i);
    }
    return trs;
}

Beastx.Notes.prototype.showNoteListPopup = function() {
    if (this.popup) {
        this.closePopup();
    }
    this.createAndOpenPopup(this.element('div', null, [
        this.element('h4', null, [ 'Notas guardadas' ]),
        this.element('table', null, [
            this.element('tbody', null, this.getNotesListUI()),
            this.element('tbody', null, [
                this.element('tr', null, [
                    this.element('td'),
                    this.element('td', null, [ this.element('input', { 'class': 'button', onclick: this.caller('closePopup'), type: 'button', value: 'Cerrar' }) ]),
                    this.element('td')
                ])
            ])
        ])
    ]));
}

Beastx.Notes.prototype.createAndOpenPopup = function(content) {
    this.popup = New(FloatingPopup, [ content, 'NotesPopup', true ]);
    this.popup.openCentered();
}

Beastx.Notes.prototype.toString = function() {
    return this.scriptName;
}