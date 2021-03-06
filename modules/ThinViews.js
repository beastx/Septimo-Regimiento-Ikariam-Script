// ==UserScript==
// @name                  Thin Views
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.ThinViews = function() {};

Beastx.ThinViews.prototype.init = function(view) {
    switch(view) {
        case 'academy':
        case 'blockade':
        case 'branchOffice':
        case 'buildingGround':
        case 'carpentering':
        case 'cityMilitary-army':
        case 'cityMilitary-fleet':
        case 'colonize':
        case 'culturalPossessions_assign':
        case 'defendCity':
        case 'deployment':
        case 'diplomacyAdvisorTreaty':
        case 'diplomacyAdvisorOutBox':
        case 'diplomacyAdvisor':
        case 'diplomacyAdvisorAlly':
        case 'diplomacyAdvisorArchive':
        case 'diplomacyAdvisorArchiveOutBox':
        case 'embassy':
        case 'militaryAdvisorReportView':
        case 'militaryAdvisorMilitaryMovements':
        case 'militaryAdvisorCombatReports':
        case 'militaryAdvisorCombatReportsArchive':
        case 'merchantNavy':
        case 'museum':
        case 'port':
        case 'researchAdvisor':
        case 'resource':
        case 'safehouse':
        case 'safehouseMissions':
        case 'sendSpy':
        case 'tavern':
        case 'tradegood':
        case 'tradeAdvisor':
            this.setbuildingDescriptionStyles();
            break;
        case 'plunder':
            this.setbuildingDescriptionStyles();
            this.setPlunderStyles();
            break;
        case 'transport':
            this.setbuildingDescriptionStyles();
            this.setTransportStyles();
            break;
        case 'barracks':
            this.setbuildingDescriptionStyles();
            this.setBarracksStyles();
            break;
        case 'shipyard':
            this.setbuildingDescriptionStyles();
            this.setShipYardStyles();
            break;
        case 'takeOffer':
            // Todo
        default:
            break;
        }
    };
    
Beastx.ThinViews.prototype.setbuildingDescriptionStyles = function() {
    var default_style = <><![CDATA[
    body .buildingDescription { background-image: none !important; height: auto !important; }
    body .buildingDescription h1 { font-size: 15px !important; }
    body .buildingDescription p { display: none; }
    ]]></>.toXMLString();
    GM_addStyle(default_style);
}
    
Beastx.ThinViews.prototype.setPlunderStyles = function() {
    var default_style = <><![CDATA[
    body .content p {display: none}
    ]]></>.toXMLString();
    //GM_addStyle(default_style);
}
    
Beastx.ThinViews.prototype.setBarracksStyles = function() {
    var default_style = <><![CDATA[
    body#barracks ul#units .unit {min-height: 95px !important; padding: 0px !important; overflow: hidden;}
    body#barracks ul#units .unitinfo p {display: none;}
    body#barracks ul#units .unitinfo a img {max-height: 55px; margin-left: 15px;}
    body#barracks ul#units .unitinfo .unitcount {top: 68px !important; left: 20px !important;}
    ]]></>.toXMLString();
    GM_addStyle(default_style);
    };

Beastx.ThinViews.prototype.setShipYardStyles = function() {
    var default_style = <><![CDATA[
    body#shipyard ul#units .unit {min-height: 95px !important; padding: 0px !important; overflow: hidden;}
    body#shipyard ul#units .unitinfo p {display: none;}
    body#shipyard ul#units .unitinfo a img {max-height: 55px; margin-left: 15px;}
    body#shipyard ul#units .unitinfo .unitcount {top: 68px !important; left: 20px !important;}
    ]]></>.toXMLString();
    GM_addStyle(default_style);
};
    
Beastx.ThinViews.prototype.setTransportStyles = function() {
    var default_style = <><![CDATA[
    body#transport #setPremiumTransports div.content p { display: none; }
    body#transport #setPremiumTransports div.content p.costs { display: block; }
    body#transport #transportGoods div.content p { display: none; }
    ]]></>.toXMLString();
    GM_addStyle(default_style);
}

Beastx.registerModule(
    'Thin Views',
    'Este modulo sirve para sacar pedasos de la interface que no son utiles y ocupan espacio inutilmente en paginas donde el espacio es muy valioso, por ejemplo remueve los textos descriptivos de cada unidad en la vista del Cuartel.'
);