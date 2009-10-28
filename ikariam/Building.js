// ==UserScript==
// @name                  Beastx Building Ika Object
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.BuildingObject = function() {};

Beastx.BuildingObject.prototype.init = function(id) {
    this.postUrl = Beastx.Config.postUrl;
    this.serverClassName = 'building';
    
    this.id = id ? id : 0; // 0 value is a new building objct
    this.scriptName = 'Building Object';
}

Beastx.BuildingObject.prototype.getId = function() {
    return this.id;
}

Beastx.BuildingObject.prototype.clone = function() {
    var newObject = New(Beastx.BuildingObject, [ this.id ]);
    newObject.setData(this.getData());
    return newObject;
}

Beastx.BuildingObject.prototype.setData = function(newData) {
    this.id = newData.id ? newData.id : 0;
}

Beastx.BuildingObject.prototype.getData = function() {
    return {
        id: this.id
    }
}

Beastx.BuildingObject.prototype.sendInfoToServer = function(onLoadCallback) {
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