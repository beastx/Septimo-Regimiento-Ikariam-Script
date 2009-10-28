// ==UserScript==
// @name                  Beastx Alliance Ika Object
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.AllianceObject = function() {};

Beastx.AllianceObject.prototype.init = function(id) {
    this.postUrl = Beastx.Config.postUrl;
    this.serverClassName = 'alliance';
    
    this.id = id ? id : 0; // 0 value is a new alliance objct
    this.scriptName = 'Alliance Object';
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
}

Beastx.AllianceObject.prototype.getData = function() {
    return {
        id: this.id
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