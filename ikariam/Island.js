// ==UserScript==
// @name                  Beastx Island Ika Object
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.IslandObject = function() {};

Beastx.IslandObject.prototype.init = function(id) {
    this.postUrl = Beastx.Config.postUrl;
    this.serverClassName = 'island';
    
    this.id = id ? id : 0; // 0 value is a new island objct
    this.scriptName = 'Island Object';
}

Beastx.IslandObject.prototype.getId = function() {
    return this.id;
}

Beastx.IslandObject.prototype.clone = function() {
    var newObject = New(Beastx.IslandObject, [ this.id ]);
    newObject.setData(this.getData());
    return newObject;
}

Beastx.IslandObject.prototype.setData = function(newData) {
    this.id = newData.id ? newData.id : 0;
}

Beastx.IslandObject.prototype.getData = function() {
    return {
        id: this.id
    }
}

Beastx.IslandObject.prototype.sendInfoToServer = function(onLoadCallback) {
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