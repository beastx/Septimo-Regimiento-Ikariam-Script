// ==UserScript==
// @name                  Beastx Resource Ika Object
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.ResourceObject = function() {};

Beastx.ResourceObject.prototype.init = function(typeId) {
    this.scriptName = 'Resource Object';
    this.postUrl = Beastx.Config.postUrl;
    this.serverClassName = 'Resource';
    
    this.id = 0; // 0 value is a new resource objct
    this.islandId = 0;
    this.typeId = typeId ? typeId : 0;
    this.typeNames = { 1: 'wine', 2: 'marble', 3: 'sulfur', 4: 'glass', 5: 'wood' };
    this.ammount = 0;
    this.maxAmmount = 0;
    this.resourceFieldLevel = 0;
}

Beastx.ResourceObject.prototype.getId = function() {
    return this.id;
}

Beastx.ResourceObject.prototype.getTypeId = function() {
    return this.typeId;
}

Beastx.ResourceObject.prototype.getTypeName = function() {
    return this.typeNames[this.typeId];
}

Beastx.ResourceObject.prototype.getAmmount = function() {
    return this.ammount;
}

Beastx.ResourceObject.prototype.clone = function() {
    var newObject = New(Beastx.ResourceObject, [ this.id ]);
    newObject.setData(this.getData());
    return newObject;
}

Beastx.ResourceObject.prototype.setData = function(newData) {
    this.id = newData.id ? newData.id : this.id;
    this.islandId = newData.islandId ? newData.islandId : this.islandId;
    this.typeId = newData.typeId ? newData.typeId : this.typeId;
    this.ammount = newData.ammount ? newData.ammount : this.ammount;
    this.maxAmmount = newData.maxAmmount ? newData.maxAmmount : this.maxAmmount;
    this.resourceFieldLevel = newData.resourceFieldLevel ? newData.resourceFieldLevel : this.resourceFieldLevel;
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

Beastx.ResourceObject.prototype.toString = function() {
    return this.typeNames[this.typeId];
}