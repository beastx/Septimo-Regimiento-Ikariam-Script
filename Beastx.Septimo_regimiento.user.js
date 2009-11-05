// ==UserScript==
// @name                  Septimo regimiento
// @namespace       Beastx
// @description        Scripts para la alianza 7mo Regimiento

// @include               http://s*.ikariam.*/*
// @exclude              http://support.ikariam.*
// @exclude              http://board.*.ikariam/*

// @require               http://ikariam.beastx/tools/userScripts/ikariam/IkaTools.js

// @require               http://ikariam.beastx/tools/userScripts/requires/Json.js
// @require               http://ikariam.beastx/tools/userScripts/requires/VAR.js
// @require               http://ikariam.beastx/tools/userScripts/requires/DOM.js
// @require               http://ikariam.beastx/tools/userScripts/requires/Beastx.js
// @require               http://ikariam.beastx/tools/userScripts/requires/ScriptUpdater.js

// @require               http://ikariam.beastx/tools/userScripts/requires/ColorSelector.js
// @require               http://ikariam.beastx/tools/userScripts/requires/DragManager.js
// @require               http://ikariam.beastx/tools/userScripts/requires/FloatingPopup.js
// @require               http://ikariam.beastx/tools/userScripts/requires/TabManager.js

// @require               http://ikariam.beastx/tools/userScripts/ikariam/CitiesList.js
// @require               http://ikariam.beastx/tools/userScripts/ikariam/City.js
// @require               http://ikariam.beastx/tools/userScripts/ikariam/Building.js
// @require               http://ikariam.beastx/tools/userScripts/ikariam/BuildingsList.js
// @require               http://ikariam.beastx/tools/userScripts/ikariam/Island.js
// @require               http://ikariam.beastx/tools/userScripts/ikariam/Player.js
// @require               http://ikariam.beastx/tools/userScripts/ikariam/Alliance.js
// @require               http://ikariam.beastx/tools/userScripts/ikariam/Resource.js

// @require               http://ikariam.beastx/tools/userScripts/modules/AllianceMap.js
// @require               http://ikariam.beastx/tools/userScripts/modules/AlliedOnlineAdvisor.js
// @require               http://ikariam.beastx/tools/userScripts/modules/CombatConverter.js
// @require               http://ikariam.beastx/tools/userScripts/modules/DataSaver.js
// @require               http://ikariam.beastx/tools/userScripts/modules/DistanceCalculator.js
// @require               http://ikariam.beastx/tools/userScripts/modules/DonationsPageHelper.js
// @require               http://ikariam.beastx/tools/userScripts/modules/Embassytools.js
// @require               http://ikariam.beastx/tools/userScripts/modules/EmpireBoard.js
// @require               http://ikariam.beastx/tools/userScripts/modules/FavoriteTargets.js
// @require               http://ikariam.beastx/tools/userScripts/modules/GeneralViewPageCleaner.js
// @require               http://ikariam.beastx/tools/userScripts/modules/InlineScore.js
// @require               http://ikariam.beastx/tools/userScripts/modules/LibraryImprovements.js
// @require               http://ikariam.beastx/tools/userScripts/modules/MessageManager.js
// @require               http://ikariam.beastx/tools/userScripts/modules/OurDeployedCitiesCleaner.js
// @require               http://ikariam.beastx/tools/userScripts/modules/PillageHelper.js
// @require               http://ikariam.beastx/tools/userScripts/modules/ResearchAdvisorHelper.js
// @require               http://ikariam.beastx/tools/userScripts/modules/ScrollbarRemover.js
// @require               http://ikariam.beastx/tools/userScripts/modules/ShipmentTimes.js
// @require               http://ikariam.beastx/tools/userScripts/modules/ShipMovementsViewImprover.js
// @require               http://ikariam.beastx/tools/userScripts/modules/ThinViews.js
// @require               http://ikariam.beastx/tools/userScripts/modules/TransportResourcesHelper.js
// @require               http://ikariam.beastx/tools/userScripts/modules/TriumphalArch.js
// @require               http://ikariam.beastx/tools/userScripts/modules/UnitFormatter.js
// @require               http://ikariam.beastx/tools/userScripts/modules/UpgradeWatcher.js
// @require               http://ikariam.beastx/tools/userScripts/modules/ResearchPointsHelper.js
// @require               http://ikariam.beastx/tools/userScripts/modules/GroupMessenger.js
// @require               http://ikariam.beastx/tools/userScripts/modules/ArribalTimesImprover.js
// @require               http://ikariam.beastx/tools/userScripts/modules/CombatLayoutHelper.js

// @require               http://ikariam.beastx/tools/userScripts/TopMenu.js
// @require               http://ikariam.beastx/tools/userScripts/OptionsPage.js

// @version               0.3
// @author                Beastx
//
// @history                0.3 reorganice all requirements into folders
// @history                0.3 Fixed update message when user run the script the first time and have the newest version already
// @history                0.3 Go to options page direclty when script is installed
// @history                0.2 Several Improvements
// @history                0.1 Several Improvements
// @history                0.0 Initial release

// ==/UserScript==

if (!GM_getValue('logAdded')) {
    GM_setValue('logAdded', true);
    unsafeWindow.LOG = document.createElement('script');
    unsafeWindow.LOG.setAttribute('src','http://ikariam.beastx/tools/log/log.js');
    document.body.appendChild(unsafeWindow.LOG);
    setTimeout(instanceLog);
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
    Beastx.init('0.2');
    
    IkaTools = New(IkariamTools);
    IkaTools.loadData();

    var actualView = IkaTools.getView();

    if (actualView == 'login') {
        $('universe').value = 's2.ar.ikariam.com';
    } else {
        
        if (!Beastx.getGMValue('firstRun')) {
            Beastx.setGMValue('firstRun', true);
            location.href = "http://" + IkaTools.getDomain() + "/index.php?view=options";
        }
        
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

    var scriptUpdater = New(ScriptUpdater, [ 'Beastx.Septimo_regimiento.user.js', '0.3', true ]);
    scriptUpdater.check();
}