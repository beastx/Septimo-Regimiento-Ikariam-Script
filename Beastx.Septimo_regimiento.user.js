// ==UserScript==
// @name                  Septimo regimiento
// @namespace       Beastx
// @description        Scripts para la alianza 7mo Regimiento

// @include               http://s*.ikariam.*/*
// @exclude              http://support.ikariam.*
// @exclude              http://board.*.ikariam/*
// @exclude              http://*.ikariam.*/*?view=premiumPayment
// @exclude              http://*.ikariam.*/*?view=premium

// @require               http://7moreg.beastx.com.ar/tools/userScripts/ikariam/IkaTools.js

// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/Json.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/VAR.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/DOM.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/Beastx.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/ScriptUpdater.js

// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/ColorSelector.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/DragManager.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/FloatingPopup.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/requires/TabManager.js

// @require               http://7moreg.beastx.com.ar/tools/userScripts/ikariam/CitiesList.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/ikariam/City.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/ikariam/Building.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/ikariam/BuildingsList.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/ikariam/Island.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/ikariam/Player.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/ikariam/Alliance.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/ikariam/Resource.js

// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/AllianceMap.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/AlliedOnlineAdvisor.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/CombatConverter.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/DataSaver.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/DistanceCalculator.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/DonationsPageHelper.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/Embassytools.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/EmpireBoard.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/FavoriteTargets.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/GeneralViewPageCleaner.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/InlineScore.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/LibraryImprovements.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/MessageManager.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/OurDeployedCitiesCleaner.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/PillageHelper.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/ResearchAdvisorHelper.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/ScrollbarRemover.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/ShipmentTimes.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/ShipMovementsViewImprover.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/ThinViews.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/TransportResourcesHelper.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/TriumphalArch.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/UnitFormatter.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/UpgradeWatcher.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/ResearchPointsHelper.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/GroupMessenger.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/ArribalTimesImprover.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/modules/CombatLayoutHelper.js

// @require               http://7moreg.beastx.com.ar/tools/userScripts/TopMenu.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/OptionsPage.js
// @require               http://7moreg.beastx.com.ar/tools/userScripts/Notes.js

// @version               0.6
// @author                Beastx
//
// @history                0.6 added donation page helper module
// @history                0.6 added arribal time module
// @history                0.5 fixed problem width main menu
// @history                0.4 several changes in ikatools
// @history                0.3 reorganice all requirements into folders
// @history                0.3 Fixed update message when user run the script the first time and have the newest version already
// @history                0.3 Go to options page direclty when script is installed
// @history                0.2 Several Improvements
// @history                0.1 Several Improvements
// @history                0.0 Initial release

// ==/UserScript==

if (!GM_getValue('logAdded')) {
    //~ GM_setValue('logAdded', true);
    //~ unsafeWindow.LOG = document.createElement('script');
    //~ unsafeWindow.LOG.setAttribute('src','http://ikariam.beastx/tools/log/log.js');
    //~ document.body.appendChild(unsafeWindow.LOG);
    //~ setTimeout(instanceLog);
}

function instanceLog() {
    if (unsafeWindow.LOG && unsafeWindow.LOG.ready){
        unsafeWindow.LOG.logRunner = new unsafeWindow.LOG.LogRunner(document);
        unsafeWindow.LOG.loaded = true;
        unsafeWindow.LOG.setTypeName(IkariamTools, 'ikatools');
        unsafeWindow.LOG.setTypeName(Beastx.AllianceObject, 'Beastx.AllianceObject');
        unsafeWindow.LOG.setTypeName(Beastx.ResourceObject, 'Beastx.ResourceObject');
        unsafeWindow.LOG.setTypeName(Beastx.BuildingObject, 'Beastx.BuildingObject');
        unsafeWindow.LOG.setTypeName(Beastx.PlayerObject, 'Beastx.PlayerObject');
        unsafeWindow.LOG.setTypeName(Beastx.CityObject, 'Beastx.CityObject');
        unsafeWindow.LOG.setTypeName(Beastx.CitiesList, 'Beastx.CitiesList');
        unsafeWindow.LOG.setTypeName(Beastx.BuildingsList, 'Beastx.BuildingsList');
        unsafeWindow.LOG.setTypeName(FloatingPopup, 'FloatingPopup');
        unsafeWindow.LOG.setTypeName(FloatingMenu, 'FloatingMenu');
        unsafeWindow.LOG.setTypeName(FloatingMenuItem, 'FloatingMenuItem');
        unsafeWindow.LOG.setTypeName(Beastx.TopMenu, 'Beastx.TopMenu');
        unsafeWindow.LOG.setTypeName(Beastx.TopMenuButton, 'Beastx.TopMenuButton');
        unsafeWindow.LOG.setTypeName(Beastx.Notes, 'Beastx.Notes');
        unsafeWindow.LOG.setTypeName(Beastx.OurDeployedCitiesCleaner, 'Beastx.OurDeployedCitiesCleaner');
        unsafeWindow.LOG.setTypeName(Beastx.OurDeployedCitiesManager, 'Beastx.OurDeployedCitiesManager');
    } else {
        setTimeout(instanceLog);
    }
}

unsafeWindow.onunload = function() {
    GM_setValue('logAdded', false);
    GM_setValue('logAdded2', false);
}

if (!GM_getValue('logAdded2')) {
    GM_setValue('logAdded2', true);
    
    IkaTools = New(IkariamTools);
    IkaTools.loadData();

    Beastx.myNotes = NewModule(Beastx.Notes);
    var actualView = IkaTools.getView();
    var mainMenu = NewModule(Beastx.TopMenu);
    
    if (actualView == 'login') {
        $('universe').value = 's2.ar.ikariam.com';
    } else {
        
        //~ var dataSaver = New(Beastx.DataSaver, [ Beastx.Config.postUrl, actualView ]);
        
        if (actualView == 'options') {
            NewModule(Beastx.OptionsPage);
        }
        
        if (Beastx.Config.options.OurDeployedCitiesCleaner && Beastx.Config.options.OurDeployedCitiesCleaner.enabled) { NewModule(Beastx.OurDeployedCitiesCleaner); }
        if (Beastx.Config.options.ThinViews && Beastx.Config.options.ThinViews.enabled) { var thinViews = NewModule(Beastx.ThinViews, [ actualView ]); }
        if (Beastx.Config.options.ScrollbarRemover && Beastx.Config.options.ScrollbarRemover.enabled) { var scrollbarRemover = NewModule(Beastx.ScrollbarRemover); }
        if (Beastx.Config.options.GeneralViewPageCleaner && Beastx.Config.options.GeneralViewPageCleaner.enabled) { NewModule(Beastx.GeneralViewPageCleaner); }
        if (Beastx.Config.options.TransportResourcesHelper && Beastx.Config.options.TransportResourcesHelper.enabled) { NewModule(Beastx.TransportResourcesHelper, [ actualView ]); }
        if (Beastx.Config.options.ArribalTimesImprover && Beastx.Config.options.ArribalTimesImprover.enabled) { NewModule(Beastx.ArribalTimesImprover, [ actualView ]); }
        if (Beastx.Config.options.ShipMovementsViewImprover && Beastx.Config.options.ShipMovementsViewImprover.enabled) { NewModule(Beastx.ShipMovementsViewImprover, [ actualView ]); }
        if (Beastx.Config.options.AlliedOnlineAdvisor && Beastx.Config.options.AlliedOnlineAdvisor.enabled) { NewModule(Beastx.AlliedOnlineAdvisor, [ actualView ]); }
        if (Beastx.Config.options.UpgradeWatcher && Beastx.Config.options.UpgradeWatcher.enabled) { NewModule(Beastx.UpgradeWatcher, [ actualView ]); }
        if (Beastx.Config.options.InlineScore && Beastx.Config.options.InlineScore.enabled) { NewModule(Beastx.InlineScore, [ actualView ]); }
        if (Beastx.Config.options.EmpireBoard && Beastx.Config.options.EmpireBoard.enabled) { NewModule(Beastx.EmpireBoard, [ actualView ]); }
        if (Beastx.Config.options.EmbassyTools && Beastx.Config.options.EmbassyTools.enabled) { NewModule(Beastx.EmbassyTools, [ actualView ]); }
        if (Beastx.Config.options.DonationsPageHelper && Beastx.Config.options.DonationsPageHelper.enabled) { NewModule(Beastx.DonationsPageHelper, [ actualView ]); }
    };

    //~ var scriptUpdater = New(ScriptUpdater, [ 'Beastx.Septimo_regimiento.user.js', '0.6', true ]);
    //~ scriptUpdater.check();
}