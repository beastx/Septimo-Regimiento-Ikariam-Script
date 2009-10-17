// ==UserScript==
// @name                  MainScript
// @namespace       Beastx
// @description        MainScript
// @include               http://*.ikariam.com/*
// @require               http://ikariam.beastx/tools/userScripts/requires/Json.js
// @require               http://ikariam.beastx/tools/userScripts/requires/VAR.js
// @require               http://ikariam.beastx/tools/userScripts/requires/DOM.js
// @require               http://ikariam.beastx/tools/userScripts/requires/IkaTools.js
// @require               http://ikariam.beastx/tools/userScripts/requires/ScriptUpdater.js
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx = {
    ScriptName: 'Beastx Base Ikariam Script',
    HomePage: 'http://7moreg.beastx.com.ar/herramientas/',
    Version: 0
};

Beastx.log = function(val, title) {
    if (!Beastx.Config) {
        Beastx.getConfig();
    }
    if (!Beastx.Config.options.debugMode) {
        GM_log(val);
    } else {
        console.log(val, title ? title : '');
    }
};

Beastx.todo = function(val, object) {
    if (!Beastx.Config) {
        Beastx.getConfig();
    }
    if (Beastx.Config.options.debugMode) {
        console.info((object && object.scriptName ? object.scriptName + ': ' : '') + val);
    }
};

Beastx.init = function() {
    this.getConfig();
    this.log('Start...');
    
    Beastx.log('Current view: ' + IkaTools.getView());
    Beastx.log('Current cityId: ' + IkaTools.getCurrentCityId());
    Beastx.log('Ikariam ' + IkaTools.getDomain());
}

Beastx.getGMValue = function(varname, vardefault) {
    var res = GM_getValue(this.name + '_' + varname);
    if (!res) {
        return vardefault;
    }
    return VAR.unserialize(res);
}

Beastx.setGMValue = function (varname, varvalue) {
    GM_setValue(this.name + '_' + varname, VAR.serialize(varvalue));
}

Beastx.getConfig = function () {
    var config = Beastx.getGMValue('config');
    Beastx.Config = config ? config :{
        options: {
            serverUrl: 'http://7moreg.beastx.com.ar',
            useFirefox: true,
            dataSaver: true,
            thinView: false,
            showMenu: true,
            scrollBarRemover: true,
            militaryPageImprover: true
        },
        user: {
            id: 126035,
            name: 'beastx',
            ally: {
                id: 3972,
                name: '7-R'
            }
        }
    };
    if (!config) {
        Beastx.setGMValue('config', Beastx.Config);
    }
    Beastx.Config.postUrl = Beastx.Config.options.serverUrl + '/code/main/router.php';
}

Beastx.saveConfig = function () {
    Beastx.setGMValue('config', Beastx.Config);
}


Beastx.Form = function() {}
    
Beastx.Form.prototype.init = function(saver) {
    this.saver = saver;
    this.fields = {};
    this.formContainer = $('formContainer');
}

Beastx.Form.prototype.add = function(fieldId, input) {
    this.fields[fieldId] = { input: input };
    return input;
}

Beastx.Form.prototype.remove = function(fieldId) {
    this.fields[fieldId] = null;
}

Beastx.Form.prototype.getValue = function() {
    var value = {};
    for (var item in this.fields) {
        if (this.fields[item].input.getValue) {
            value[item] = this.fields[item].input.getValue();
        } else if (this.fields[item].input.type == 'checkbox') {
            value[item] = this.fields[item].input.checked;
        } else {
            value[item] = this.fields[item].input.value;    
        }
    };
    return value;
}

Beastx.Form.prototype.setValue = function(values, donEmptyIfDontExist) {
    if (!values) { values = {} };
    for (var item in this.fields) {
        var value = !donEmptyIfDontExist ? (values[item] ? values[item] : '') : (values[item] ? values[item] : this.fields[item].input.value);
        if (this.fields[item].input.setValue) {
            this.fields[item].input.setValue(value);
        } else if (this.fields[item].input.type == 'checkbox') {
            this.fields[item].input.checked = value;
        } else {
            this.fields[item].input.value = value;
        }
    };
}

Beastx.Form.prototype.save = function() {
    var value;
    if (value = this.getValue()) {
        this.saver.save(value);
    }
}

ScriptUpdater.check('Beastx', "0.1", null, true);
IkaTools.init();