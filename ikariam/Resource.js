// ==UserScript==
// @name                  Beastx Resource Ika Object
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.ResourceObject = function() {};

Beastx.ResourceObject.prototype.init = function(id) {
    this.scriptName = 'Resource Object';
    this.postUrl = Beastx.Config.postUrl;
    this.serverClassName = 'Resource';
    
    this.id = id ? id : 0; // 0 value is a new resource objct
    this.islandId = 0;
    this.typeId = 0;
    this.ammount = 0;
    this.maxAmmount = 0;
    this.resourceFieldLevel = 0;
}

Beastx.ResourceObject.prototype.getId = function() {
    return this.id;
}

Beastx.ResourceObject.prototype.clone = function() {
    var newObject = New(Beastx.ResourceObject, [ this.id ]);
    newObject.setData(this.getData());
    return newObject;
}

Beastx.ResourceObject.prototype.setData = function(newData) {
    this.id = newData.id ? newData.id : 0;
    this.islandId = newData.islandId ? newData.islandId : 0;
    this.typeId = newData.typeId ? newData.typeId : 0;
    this.ammount = newData.ammount ? newData.ammount : 0;
    this.maxAmmount = newData.maxAmmount ? newData.maxAmmount : 0;
    this.resourceFieldLevel = newData.resourceFieldLevel ? newData.resourceFieldLevel : 0;
}

Beastx.ResourceObject.prototype.getData = function() {
    return {
        id: this.id,
        islandId: this.islandId,
        typeId: this.typeId,
        ammount: this.ammount,
        maxAmmount: this.maxAmmount,
        resourceFieldLevel: this.resourceFieldLevel
    }
}

Beastx.ResourceObject.prototype.sendInfoToServer = function(onLoadCallback) {
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