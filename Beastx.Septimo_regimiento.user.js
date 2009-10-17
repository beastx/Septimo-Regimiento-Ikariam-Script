// ==UserScript==
// @name                  Septimo regimiento
// @namespace       Beastx
// @description        Scripts para la alianza 7mo Regimiento
// @include               http://*.ikariam.com/*

// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/Json.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/VAR.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/DOM.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/IkaTools.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/ScriptUpdater.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/Beastx.js

// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/ColorSelector.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/DragManager.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/FloatingPopup.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/TabManager.js

// @require               http://7moreg.beastx.com.ar/tools/userScripts/Beastx.ThinViews.user.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/Beastx.ScrollbarRemover.user.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/Beastx.DataSaver.user.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/Beastx.AllianceViewImprover.user.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/Beastx.AlliedOnlineAdvisor.user.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/Beastx.GeneralViewPageCleaner.user.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/Beastx.InlineScore.user.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/Beastx.MessageManager.user.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/Beastx.OurDeployedCitiesCleaner.user.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/Beastx.ShipMovementsViewImprover.user.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/Beastx.TransportResourcesHelper.user.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/Beastx.UpgradeWatcher.user.js

// @require               http://7moreg.beastx.com.ar/tools/userScripts/Beastx.TopMenu.user.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/Beastx.OptionsPage.user.js

// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release

// ==/UserScript==

ScriptUpdater.check('Septimo_regimiento', "0.1");

Beastx.init();

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
    
}