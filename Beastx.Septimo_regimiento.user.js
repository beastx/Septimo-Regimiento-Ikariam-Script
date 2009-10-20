// ==UserScript==
// @name                  Septimo regimiento
// @namespace       Beastx
// @description        Scripts para la alianza 7mo Regimiento
// @include               http://*.ikariam.com/*

// @require               http://ikariam.beastx/tools/userScripts/requires/Json.js
// @require               http://ikariam.beastx/tools/userScripts/requires/VAR.js
// @require               http://ikariam.beastx/tools/userScripts/requires/DOM.js
// @require               http://ikariam.beastx/tools/userScripts/requires/IkaTools.js
// @require               http://ikariam.beastx/tools/userScripts/requires/Beastx.js
// @require               http://ikariam.beastx/tools/userScripts/requires/ScriptUpdater.js

// @require               http://ikariam.beastx/tools/userScripts/requires/ColorSelector.js
// @require               http://ikariam.beastx/tools/userScripts/requires/DragManager.js
// @require               http://ikariam.beastx/tools/userScripts/requires/FloatingPopup.js
// @require               http://ikariam.beastx/tools/userScripts/requires/TabManager.js

// @require               http://ikariam.beastx/tools/userScripts/Beastx.ThinViews.user.js
// @require               http://ikariam.beastx/tools/userScripts/Beastx.ScrollbarRemover.user.js
// @require               http://ikariam.beastx/tools/userScripts/Beastx.DataSaver.user.js
// @require               http://ikariam.beastx/tools/userScripts/Beastx.AllianceViewImprover.user.js
// @require               http://ikariam.beastx/tools/userScripts/Beastx.AlliedOnlineAdvisor.user.js
// @require               http://ikariam.beastx/tools/userScripts/Beastx.GeneralViewPageCleaner.user.js
// @require               http://ikariam.beastx/tools/userScripts/Beastx.InlineScore.user.js
// @require               http://ikariam.beastx/tools/userScripts/Beastx.MessageManager.user.js
// @require               http://ikariam.beastx/tools/userScripts/Beastx.OurDeployedCitiesCleaner.user.js
// @require               http://ikariam.beastx/tools/userScripts/Beastx.ShipMovementsViewImprover.user.js
// @require               http://ikariam.beastx/tools/userScripts/Beastx.TransportResourcesHelper.user.js
// @require               http://ikariam.beastx/tools/userScripts/Beastx.UpgradeWatcher.user.js

// @require               http://ikariam.beastx/tools/userScripts/Beastx.TopMenu.user.js
// @require               http://ikariam.beastx/tools/userScripts/Beastx.OptionsPage.user.js

// @version               0.2
// @author                Beastx
//
// @history                0.2 Several Improvements
// @history                0.1 Several Improvements
// @history                0.0 Initial release

// ==/UserScript==

Beastx.init('0.2');

var actualView = IkaTools.getView();

if (actualView == 'login') {
    $('universe').value = 's2.ar.ikariam.com';
} else {
    
    if (Beastx.Config.options.showMenu) {
        var mainMenu = New(Beastx.TopMenu);
    }
    
    if (Beastx.Config.options.thinView) {
        var thinViews = New(Beastx.ThinViews, [ actualView ]);
    }
    if (Beastx.Config.options.scrollBarRemover) {
        var scrollBarRemover = New(Beastx.ScrollBarRemover);
    }
    
    if (Beastx.Config.options.dataSaver) {
        var dataSaver = New(Beastx.DataSaver, [ Beastx.Config.postUrl, actualView ]);
    }
    
    if (actualView == 'options') {
        var optionsPage = New(Beastx.OptionsPage);
    }
    
    if (actualView == 'embassyGeneralAttacksFromAlly' && Beastx.Config.options.militaryPageImprover) {
        New(Beastx.GeneralViewPageCleaner);
    }
    
    if (Beastx.Config.options.ourDeployedCitiesCleaner) {
        New(Beastx.OurDeployedCitiesCleaner);
    }
    
    if (Beastx.Config.options.transportResourcesHelper) {
        New(Beastx.TransportResourcesHelper, [ actualView ]);
    }
    
    if (Beastx.Config.options.shipMovementsViewImprover) {
        New(Beastx.ShipMovementsViewImprover, [ actualView ]);
    }
    
    if (Beastx.Config.options.alliedOnlineAdvisor) {
        New(Beastx.AlliedOnlineAdvisor, [ actualView ]);
    }
    
    if (Beastx.Config.options.upgradeWatcher) {
        New(Beastx.UpgradeWatcher, [ actualView ]);
    }
    
    if (Beastx.Config.options.inlineScore) {
        New(Beastx.InlineScore, [ actualView ]);
    }
    
};


var scriptUpdater = New(ScriptUpdater, [ 'Septimo_regimiento', '0.1', true ]);
scriptUpdater.check();