// ==UserScript==
// @name                  Beastx Polis Ika Object
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.PolisObject = function() {};

Beastx.PolisObject.prototype.init = function(id) {
    this.postUrl = Beastx.Config.postUrl;
    this.serverClassName = 'Polis';
    
    this.id = id ? id : 0; // 0 value is a new polis objct
    this.scriptName = 'Polis Object';
}

Beastx.PolisObject.prototype.getId = function() {
    return this.id;
}

Beastx.PolisObject.prototype.clone = function() {
    var newObject = New(Beastx.PolisObject, [ this.id ]);
    newObject.setData(this.getData());
    return newObject;
}

Beastx.PolisObject.prototype.setData = function(newData) {
    this.id = newData.id ? newData.id : 0;
}

Beastx.PolisObject.prototype.getData = function() {
    return {
        id: this.id
    }
}

Beastx.PolisObject.prototype.sendInfoToServer = function(onLoadCallback) {
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