// ==UserScript==
// @name                  Beastx Player Ika Object
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.PlayerObject = function() {};

Beastx.PlayerObject.prototype.init = function(id) {
    this.postUrl = Beastx.Config.postUrl;
    this.serverClassName = 'player';
    
    this.id = id ? id : 0; // 0 value is a new player objct
    this.scriptName = 'Player Object';
}

Beastx.PlayerObject.prototype.getId = function() {
    return this.id;
}

Beastx.PlayerObject.prototype.clone = function() {
    var newObject = New(Beastx.PlayerObject, [ this.id ]);
    newObject.setData(this.getData());
    return newObject;
}

Beastx.PlayerObject.prototype.setData = function(newData) {
    this.id = newData.id ? newData.id : 0;
}

Beastx.PlayerObject.prototype.getData = function() {
    return {
        id: this.id
    }
}

Beastx.PlayerObject.prototype.sendInfoToServer = function(onLoadCallback) {
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