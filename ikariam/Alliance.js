// ==UserScript==
// @name                  Beastx Alliance Ika Object
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.AllianceObject = function() {};

Beastx.AllianceObject.prototype.init = function(id) {
    this.scriptName = 'Alliance Object';
    this.postUrl = Beastx.Config.postUrl;
    this.serverClassName = 'Alliance';
    
    this.id = id ? id : 0; // 0 value is a new alliance objct
    this.name = null;
    this.tag = null;
    this.players =  [];
    this.totalPoints = 0;
    this.ranking = 0;
}

Beastx.AllianceObject.prototype.getId = function() {
    return this.id;
}

Beastx.AllianceObject.prototype.clone = function() {
    var newObject = New(Beastx.AllianceObject, [ this.id ]);
    newObject.setData(this.getData());
    return newObject;
}

Beastx.AllianceObject.prototype.setData = function(newData) {
    this.id = newData.id ? newData.id : 0;
    this.name = newData.name ? newData.name : null;
    this.tag = newData.tag ? newData.tag : null;
    this.players = newData.players ? newData.players : [];
    this.totalPoints = newData.totalPoints ? newData.totalPoints : 0;
    this.ranking = newData.ranking ? newData.ranking : 0;
}

Beastx.AllianceObject.prototype.getData = function() {
    return {
        id: this.id,
        name: this.name,
        tag: this.tag,
        players: this.players,
        totalPoints: this.totalPoints,
        ranking: this.ranking
    }
}

Beastx.AllianceObject.prototype.sendInfoToServer = function(onLoadCallback) {
    DOM.post(
        this.postUrl,
        { className: this.serverClassName, action: 'save', params: this.getData() },
        function(response) {
            if (onLoadCallback) {
                onLoadCallback(response);
            }
        }
    );
}