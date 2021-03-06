// ==UserScript==
// @name                  Embassy Tools
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.EmbassyTools = function() {};

Beastx.EmbassyTools.prototype.init = function() {
    this.scriptName = 'Embassy Tools';
    
   
    (function() {
        
var startTime = (new Date).getTime();

var view = document.getElementsByTagName("body")[0].id;

if (view == "embassy" || view == "diplomacyAdvisorAlly") {

	var cities = document.evaluate("id('memberList')/tbody/tr/td[3]/ul/li/ul/li/a", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	var shotCity, shotRegExp = shotRegExp = new RegExp(/[\?&]id=([^&#]*)/), shotResult, shotIterator = cities.snapshotLength;

	if (shotIterator > 0) {

		var sulfur = (document.getElementById("value_sulfur")?"skin/resources/icon_sulfur.gif":"skin/resources/icon_sulphur.gif");

		var resourceImageById = [
			null,
			"skin/resources/icon_wine.gif",
			"skin/resources/icon_marble.gif",
			"skin/resources/icon_glass.gif",
			sulfur
		];

		var resourceById = [
			,2,3,,4,1,2,3,,4,,1,,2,,3,1,2,3,4,1,,,,2,1,4,1,2,3,3,1,2,4,2,1,3,2,4,1,4,2,1,3,4,1,3,2,2,4,2,1,3,4,1,2,3,4,1,2,1,2,4,3,1,4,2,3,1,2,1,2,3,4,3,2,1,4,1,2,3,2,3,4,1,1,2,3,4,2,1,3,4,2,1,3,2,4,1,3,
			2,2,1,4,3,2,1,4,3,4,2,2,1,4,3,2,4,1,3,2,4,3,1,2,1,3,2,3,4,1,2,1,4,3,2,3,4,1,,2,3,1,4,2,3,1,4,1,3,2,2,4,3,2,1,1,2,3,4,2,1,3,4,1,2,3,2,3,1,4,1,2,3,4,2,1,3,4,2,1,2,4,3,1,4,3,2,3,4,1,2,,,,,,,,,,
			,,,3,2,1,4,4,1,2,3,4,2,1,1,3,4,2,2,3,1,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,,,,,,,,3,4,,2,1,3,1,4,,3,2,1,,,,,,,,2,1,4,3,2,2,4,3,3,1,2,1,1,2,3,4,2,1,3,4,4,1,,2,3,4,2,3,1,4,2,1,2,4,3,4,2,3,
			1,1,3,2,4,4,1,2,3,4,1,2,3,1,2,3,4,,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,4,1,2,3,4,1,2,3,4,1,2,3,2,4,1,3,2,3,1,4,4,1,3,2,2,4,2,1,4,3,3,1,2,1,2,3,4,1,2,3,4,2,1,1,2,3,4,1,3,2,1,1,3,2,4,2,4,3,1,3,1,2,4,1,2,
			3,4,,,,,,,,,,,1,2,3,4,2,3,1,4,2,1,3,2,1,4,2,1,4,3,2,1,4,3,2,1,2,3,4,1,2,3,4,1,2,3,1,2,4,3,2,1,4,1,2,3,4,1,2,3,4,1,4,3,2,1,2,1,3,4,2,2,3,4,1,2,3,2,3,4,1,2,3,4,1,2,4,2,3,1,2,3,4,1,2,3,4,1,2,1,
			4,3,2,1,4,2,3,4,1,2,3,4,1,2,3,4,1,2,3,1,2,3,4,2,1,3,2,3,2,1,4,1,3,4,2,1,4,1,2,3,1,,,,4,4,3,2,1,4,3,2,2,4,1,2,3,4,1,1,2,3,4,2,1,3,4,1,2,3,1,3,4,1,2,3,1,4,2,3,2,3,4,1,2,3,4,3,2,1,4,1,2,3,4,1,2,3,4,,
			2,3,4,1,4,1,3,4,1,2,3,,,,4,1,2,1,2,3,4,1,2,4,3,1,2,4,1,2,3,4,1,2,3,4,1,2,3,3,4,1,2,3,,,,4,1,2,3,,4,1,2,2,3,4,1,2,3,4,,1,2,3,4,2,1,4,3,2,1,4,2,4,1,2,3,4,1,2,3,4,1,2,3,4,1,,,4,1,3,2,1,4,2,3,2,
			1,4,1,3,2,4,1,,2,,4,3,2,4,1,2,3,4,1,1,3,2,4,1,2,3,4,2,3,1,2,1,2,3,4,2,3,1,4,2,1,4,3,2,3,4,1,2,,,,,2,3,1,4,3,2,1,4,1,2,3,2,1,4,3,1,2,3,4,2,1,2,3,4,1,3,4,2,1,2,1,3,4,3,2,1,4,4,1,2,3,4,1,2,3,,,4,
			2,2,3,4,1,,,2,3,4,1,2,1,4,4,1,2,3,4,1,2,3,4,2,3,1,4,1,2,4,1,2,3,4,1,2,3,4,1,2,2,3,1,4,2,3,1,4,2,1,3,4,1,2,3,4,1,2,2,1,4,3,2,1,4,1,3,3,2,2,3,1,4,1,3,2,1,4,2,1,3,4,1,2,3,4,1,2,3,4,1,4,3,2,1,1,2,3,4,1,
			2,3,4,2,1,4,3,3,4,1,2,3,2,4,,,,,,1,4,2,3,,,,,,,,,3,4,2,1,3,4,1,3,2,4,1,2,3,4,1,2,3,4,1,4,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,2,4,3,3,1,4,1,3,2,2,4,1,3,2,1,4,2,3,1,2,,,3,3,4,1,2,3,4,1,2,4,
			3,2,1,4,3,2,1,2,4,1,3,3,4,1,2,3,4,1,2,1,3,4,3,4,1,2,3,4,1,2,3,3,4,2,4,1,2,3,4,1,2,3,4,1,2,2,3,4,1,2,3,4,1,,1,2,4,3,3,1,4,2,2,1,1,2,3,4,1,2,3,2,1,4,1,2,3,4,1,3,2,1,4,2,3,4,1,2,3,1,2,4,3,2,1,4,1,2,3,2,
			1,4,3,4,2,1,1,2,3,4,1,2,3,4,1,2,3,4,3,2,1,4,3,1,3,2,1,4,3,2,2,4,1,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,3,2,1,2,3,4,1,2,3,4,1,3,4,2,1,4,3,2,1,2,1,4,3,3,4,1,2,3,4,1,2,3,4,1,2,4,1,2,3,2,4,1,3,4,1,2,3,3,4,1,
			2,3,4,1,2,3,4,1,2,4,3,2,4,1,2,3,4,1,3,4,1,2,3,1,2,4,1,3,2,4,3,1,1,2,4,3,1,2,4,3,2,1,4,2,,,1,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,2,1,4,,2,3,4,1,2,3,4,1,2,2,4,1,3,2,4,1,4,2,1,3,4,1,2,4,3,3,2,4,1,2,1,,
			1,2,3,4,1,4,3,2,1,3,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,3,4,1,2,3,4,1,2,1,2,3,4,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,1,
			2,3,4,1,4,2,3,1,2,3,4,1,2,1,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,3,4,1,2,3,4,1,2,3,4,1,4,1,2,3,4,1,2,3,4,1,3,2,4,1,4,1,3,3,2,2,1,4,2,3,4,1,2,3,4,1,2,1,3,2,3,1,2,4,1,3,2,1,2,4,3,1,2,4,1,3,2,3,4,1,2,3,4,
			2,1,3,4,1,2,4,3,4,1,2,3,4,1,2,3,4,1,2,,,3,4,1,2,4,2,3,1,4,1,2,4,4,1,2,3,1,4,2,3,4,2,3,2,4,1,1,2,3,4,1,2,3,4,2,3,1,4,2,3,1,2,2,3,1,4,3,4,1,2,3,4,2,1,3,2,4,1,2,3,4,1,2,3,4,2,1,3,3,1,4,2,2,3,1,2,1,4,3,
			2,3,4,1,2,3,4,1,2,3,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,4,1,2,3,4,1,2,3,1,2,1,4,3,2,1,1,4,1,2,3,3,4,1,2,3,4,1,2,3,4,1,2,2,3,4,1,2,3,4,1,3,4,1,2,3,4,3,2,4,1,2,4,3,1,3,2,4,2,1,2,3,4,1,2,3,4,2,3,4,
			1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,3,2,1,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,3,4,1,2,4,3,2,1,2,4,3,2,1,1,2,3,,4,1,4,3,2,1,3,2,4,3,1,2,4,3,2,4,1,2,3,2,3,4,1,2,1,3,3,4,2,1,1,2,3,4,1,2,3,4,1,2,3,1,2,
			3,4,1,2,3,4,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,2,,,4,2,3,1,4,1,2,3,4,1,2,2,1,4,3,2,,4,,1,2,1,3,2,4,1,3,2,1,4,3,2,1,4,2,4,1,2,3,1,4,2,1,3,2,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,
			1,2,4,4,1,2,3,4,1,2,3,2,3,4,1,2,3,4,1,4,2,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,3,4,1,2,3,4,1,2,3,4,1,2,1,2,3,4,1,2,3,4,4,2,1,4,1,3,4,2,1,3,4,2,1,3,4,2,3,4,1,2,3,4,1,3,4,1,2,1,3,4,2,1,3,4,2,3,
			4,1,2,2,4,3,4,3,4,1,2,,1,3,2,4,1,3,1,2,4,1,2,3,,,,,4,1,2,3,4,1,2,1,4,3,2,1,3,3,4,1,3,2,4,2,1,1,3,4,2,2,1,3,4,4,1,3,1,2,,,,,,,3,4,1,2,2,3,3,4,1,2,3,4,1,2,2,1,4,3,2,3,4,1,2,3,4,1,2,3,4,2,4,1,
			2,3,1,4,2,3,1,4,2,4,1,2,3,4,1,2,3,3,4,1,2,3,4,1,2,4,3,2,1,1,2,3,4,1,2,3,4,1,2,4,2,3,4,1,2,3,4,1,2,3,4,2,2,3,4,1,2,3,4,1,2,3,4,1,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,1,2,3,4,1,2,3,4,2,3,4,1,4,1,2,3,
			4,2,3,4,1,2,4,3,2,1,4,4,1,2,3,4,1,2,3,4,1,2,3,4,1,4,1,2,3,4,1,2,3,4,1,2,4,1,2,3,4,1,2,3,4,1,2,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,,4,1,2,3,4,2,1,2,3,4,1,2,4,4,1,2,3,4,1,2,3,2,3,1,4,4,4,1,3,2,2,
			4,1,3,3,4,1,2,3,4,1,3,4,1,2,3,4,1,2,1,4,1,2,3,4,1,2,3,4,4,1,2,3,4,1,2,3,4,1,2,3,4,3,4,1,2,3,4,1,2,3,1,2,4,3,2,1,2,,4,1,2,3,4,1,2,3,1,2,3,4,1,2,4,1,4,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,2,3,
			4,1,2,3,4,1,2,3,4,1,2,3,4,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,2,4,1,4,3,2,3,4,1,2,4,3,1,2,3,2,1,4,3,,,,,,,,,,3,,4,1,2,,4,1,3,2,1,1,4,,,,,,,,,,,2,1,3,2,4,1,3,2,4,4,1,2,3,4,1,2,1,3,4,
			1,2,3,4,1,2,4,3,1,2,4,2,1,,,2,3,4,2,1,3,2,3,4,1,2,3,4,3,1,4,3,1,2,2,3,4,1,2,3,4,1,1,4,3,2,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,2,3,4,1,2,3,4,1,2,3,4,1,3,4,3,2,1,2,4,2,1,3,4,2,1,2,3,1,4,4,3,2,1,2,
			3,4,1,3,2,4,1,3,2,3,1,2,1,2,3,4,1,2,3,4,1,2,3,4,3,4,1,2,3,4,1,2,3,4,1,2,4,3,1,2,4,1,2,3,3,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,3,4,1,2,4,2,1,3,3,4,1,2,3,4,1,2,3,4,1,1,2,3,4,1,2,3,4,1,2,3,4,2,1,3,4,1,2,3,
			,,,,,1,3,4,1,2,3,1,4,2,1,2,3,4,1,2,3,4,1,2,3,2,4,1,3,1,2,1,4,3,2,,,4,1,2,3,4,2,1,3,3,4,1,2,3,4,1,2,1,3,4,3,4,1,2,3,4,1,2,3,4,1,2,3,1,1,2,3,4,1,3,1,2,4,3,4,1,2,3,4,1,2,3,1,1,2,3,4,1,2,3,4,1,2,4,
			4,1,2,3,4,1,,,,,,,2,4,4,3,2,1,4,2,1,3,4,1,2,4,4,1,2,3,4,1,2,3,,,,,4,1,2,3,4,2,1,3,4,1,2,3,4,1,2,2,3,1,4,2,3,1,2,4,1,2,3,4,1,2,3,4,3,2,1,4,2,3,1,4,2,1,3,2,4,1,3,4,1,2,3,4,2,1,3,4,2,4,3,1,3,1,
			4,2,1,2,3,2,2,1,4,3,4,1,2,3,2,1,4,3,4,2,1,3,2,1,4,2,3,4,1,2,1,1,2,3,4,1,2,3,4,2,3,4,1,2,3,4,1,2,3,4,1,3,4,1,2,3,4,1,2,3,2,1,4,3,2,1,4,3,2,1,,3,4,1,2,1,2,3,4,1,4,3,2,4,2,1,4,1,2,3,3,4,2,1,3,4,1,2,4,3,
			2,4,1,3,2,1,4,2,4,2,3,1,4,2,,,,,,,,,,,,,,,,,,,,,3,4,1,2,1,4,,1,2,3,1,3,2,4,1,3,2,4,1,3,1,2,4,1,2,3,4,1,2,3,1,2,3,4,1,2,3,4,1,2,3,4,2,1,4,3,2,1,4,3,2,1,1,4,1,2,3,4,1,2,3,4,1,2,3,4,
			1,2,3,4,,,,,,,1,2,3,4,1,2,3,4,1,3,4,2,3,1,4,2,1,3,4,1,2,3,2,1,2,1,4,3,2,1,4,3,2,3,4,1,2,3,4,1,2,2,3,4,1,3,2,4,1,1,3,2,4,,,,,1,2,3,4,1,2,3,4,1,4,1,2,3,4,1,2,3,4,1,2,,4,3,2,1,2,3,4,1,2,3,4,1,
			2,3,4,1,4,3,1,2,4,1,1,2,3,4,1,2,3,4,1,2,3,1,2,3,4,1,2,3,4,3,4,2,1,3,2,4,1,1,2,3,,,,,,,4,1,4,1,2,3,4,1,2,3,4,1,2,3,1,2,3,4,1,2,3,1,4,2,4,1,2,3,4,1,2,3,4,2,1,4,1,3,2,4,1,2,3,1,1,4,2,3,1,2,4,3,1,2,
			3,4,1,2,4,4,1,2,3,4,1,2,3,4,1,3,2,4,1,2,3,4,1,4,1,2,3,4,1,2,3,,3,4,1,2,3,4,1,2,3,4,4,3,2,1,4,3,2,1,3,4,1,2,3,4,1,2,3,4,2,4,1,2,3,4,1,2,3,4,1,2,3,4,2,3,4,1,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,2,4,1,2,3,4,
			1,2,3,4,1,2,3,1,,,2,3,4,1,2,3,4,1,2,3,4,1,1,2,3,4,1,3,2,1,4,2,4,1,2,3,4,2,1,3,4,1,2,3,4,1,2,3,4,1,3,1,4,2,3,4,2,1,3,4,2,3,1,4,1,2,4,3,1,2,1,4,,3,1,2,2,1,2,3,4,1,3,1,2,3,4,1,2,4,1,2,3,4,1,2,3,4,1,2,
			4,3,1,2,3,4,1,2,2,4,1,2,3,4,2,4,1,3,1,2,3,4,1,2,3,4,1,2,3,,,,,,,,2,1,4,3,1,2,1,4,3,2,4,1,2,4,1,2,3,4,1,2,3,1,2,4,3,4,1,2,1,2,3,4,1,4,2,3,4,1,2,1,2,3,4,3,1,2,4,3,1,2,4,2,3,4,1,2,3,4,1,4,1,3,2,4,
			2,1,4,1,2,4,3,2,3,4,1,2,3,4,1,2,3,2,1,4,3,4,1,2,1,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,1,2,3,4,1,2,3,4,1,2,3,1,1,2,4,3,2,1,4,3,4,1,2,1,4,1,2,3,4,1,2,3,4,2,3,4,1,2,3,4,1,2,3,1,4,1,2,3,4,2,1,3,4,
			1,2,3,4,1,2,3,4,1,2,3,4,1,1,3,4,1,2,3,4,1,2,3,4,1,1,4,4,1,2,3,4,1,2,3,2,1,2,3,4,1,2,3,4,1,3,2,4,3,1,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,4,2,3,1,1,4,2,3,1,4,2,3,1,4,2,,,2,3,1,4,1,2,3,4,1,2,3,4,1,3,4,1,2,
			3,4,1,2,3,4,3,4,1,2,3,4,1,2,4,1,2,3,4,1,2,3,4,3,4,1,2,3,4,1,2,1,2,3,4,1,2,3,4,1,2,3,4,1,3,2,4,1,4,2,1,4,1,2,3,4,1,2,3,4,3,2,1,2,3,4,3,2,1,4,,2,3,1,4,2,2,3,4,1,2,3,1,2,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,
			4,1,2,3,1,1,2,3,4,1,2,3,4,1,2,3,4,2,4,1,2,3,4,1,2,3,1,2,3,4,1,2,3,4,1,3,4,1,2,3,4,1,2,3,4,4,3,1,2,1,2,3,4,1,2,3,4,1,2,3,1,2,1,4,3,4,1,2,3,1,4,2,2,3,4,1,2,3,4,1,2,3,4,4,1,2,3,4,1,2,4,1,2,3,,1,2,3,4,2,
			3,4,1,2,3,1,2,1,4,3,2,4,3,1,2,3,4,1,2,3,4,1,1,4,2,3,1,2,3,4,1,2,3,4,1,2,3,4,3,4,1,2,3,4,1,2,4,1,2,3,4,1,2,3,2,4,2,3,4,1,2,4,1,2,4,3,3,1,4,2,1,3,3,2,1,4,1,2,3,4,2,3,4,1,1,2,4,3,1,2,3,4,2,1,3,4,1,2,3,4,
			1,2,,,,,3,2,1,4,1,3,4,2,4,1,3,2,1,4,3,2,1,1,2,3,4,1,2,3,4,1,2,2,4,3,1,2,1,4,3,4,1,2,2,3,,4,1,2,3,4,1,2,3,4,1,2,4,3,1,2,3,4,1,2,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,2,4,3,4,2,1,,,1,3,1,2,1,2,3,4,3,2,
			1,4,1,2,3,,,,,,,,,,,,,,,,,,,,3,2,4,2,1,3,4,2,1,2,,4,3,4,1,2,3,1,,,2,4,1,3,2,4,1,3,2,1,1,4,2,1,3,4,1,2,3,2,3,4,1,4,,,,,,,,,,,,,,,,,,,,,3,4,1,2,3,4,1,2,4,3,2,1,
			4,1,2,3,4,1,2,,3,4,1,2,4,3,1,2,3,4,2,1,3,4,2,1,4,3,2,1,4,1,2,3,4,1,2,4,1,3,2,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,3,4,1,2,3,4,1,2,3,4,2,3,4,1,2,3,4,1,2,3,3,2,1,4,3,4,1,2,3,4,1,2,3,,2,1,4,1,2,3,4,1,2,3,4,
			3,4,1,2,3,4,1,2,3,1,2,3,4,1,2,3,4,1,3,1,2,3,4,1,2,3,4,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,2,3,4,1,2,3,4,1,2,3,4,1,1,2,3,4,1,2,3,4,1,2,3,4,2,2,2,3,4,1,3,2,4,2,3,1,1,2,3,4,1,2,3,4,1,2,4,1,3,2,4,
			1,3,2,4,2,1,4,1,3,2,1,4,2,3,3,1,2,4,4,1,3,2,4,1,2,3,4,1,2,3,4,4,1,2,3,2,1,4,3,3,2,1,4,3,2,2,4,1,4,2,3,1,4,2,3,1,4,1,2,2,4,3,1,2,3,4,1,2,3,4,1,2,3,4,2,2,3,4,1,2,3,4,1,1,2,3,4,1,2,3,4,1,2,4,1,2,3,4,1,2,
			4,2,3,4,1,,3,4,2,1,2,3,4,1,2,2,1,3,2,1,4,3,2,1,3,3,4,1,2,4,2,3,2,1,4,2,3,4,1,4,1,2,3,4,1,2,4,3,1,2,3,1,4,2,3,1,4,2,4,1,2,3,2,3,1,4,1,3,2,2,3,4,1,2,3,4,1,,2,3,4,1,4,1,3,4,1,2,3,4,1,2,3,4,1,2,1,,,3,
			4,1,2,3,4,1,2,3,4,3,4,1,2,3,4,1,2,1,,1,,,,3,4,2,2,3,4,1,1,2,4,2,,,4,,1,2,3,4,1,2,3,4,2,,,,,3,4,,,1,2,3,4,2,1,3,4,2,2,3,4,1,2,1,4,3,3,4,3,4,1,2,3,4,1,2,2,3,1,4,1,2,3,4,2,3,4,1,2,1,2,3,4,1,
			2,,,4,3,2,1,2,1,4,3,1,2,3,1,2,3,4,1,2,1,3,4,1,2,3,4,2,3,4,1,2,3,1,4,1,2,4,4,1,2,3,4,1,2,3,3,1,4,2,3,4,1,2,3,2,1,4,3,4,1,2,3,3,4,1,2,3,4,1,2,2,3,4,1,2,3,4,1,3,2,4,1,2,1,3,2,3,4,1,2,3,4,1,2,3,4,1,2,3,
			4,4,1,2,3,4,1,2,3,4,1,4,2,3,2,4,1,2,3,1,4,2,4,1,3,2,4,1,3,4,2,4,1,2,3,4,1,2,3,2,3,4,1,2,3,4,1,2,2,3,4,1,2,3,4,1,2,3,3,1,1,4,3,2,1,4,3,2,4,1,3,2,4,1,3,2,1,4,2,1,2,4,3,1,3,2,4,1,1,2,3,4,1,2,3,4,1,2,3,4,
			1,2,3,4,2,1,3,4,3,4,1,2,,,,,3,4,,,,,1,2,1,2,3,4,1,2,3,4,2,4,1,2,4,1,2,3,4,1,3,2,1,4,3,3,4,2,1,2,3,4,1,2,4,3,1,2,3,,4,1,2,3,,,4,3,1,2,2,4,1,3,1,2,3,4,1,2,3,4,1,4,2,2,3,4,1,2,3,4,1,2,3,4,1,2,
			3,4,1,2,3,4,1,2,4,3,1,2,1,3,4,1,2,3,4,2,1,3,4,2,1,1,3,1,4,3,2,1,2,1,2,3,4,1,2,3,4,1,2,1,2,3,4,1,2,3,4,1,2,3,2,3,4,1,2,3,4,1,2,3,4,1,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,4,1,2,3,,,2,1,,4,3,2,3,1,2,4,1,4,2,
			3,2,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,2,3,1,4,3,2,4,1,1,2,3,2,4,1,3,2,2,4,1,2,3,1,2,4,3,2,3,4,1,2,3,4,1,2,3,4,1,4,,,1,2,2,3,4,1,2,3,4,1,2,1,2,3,4,2,1,3,4,2,1,1,2,3,4,2,4,1,2,3,4,1,2,3,4,1,2,3,4,,,1,2,
			3,1,4,2,3,1,4,2,3,1,2,1,1,2,3,4,1,2,3,2,4,3,,2,1,1,2,3,4,1,2,3,4,1,2,2,3,4,1,2,3,4,1,2,3,4,2,4,1,2,3,4,3,2,1,4,1,2,3,4,1,3,1,2,3,4,1,2,3,4,1,3,2,2,3,4,1,2,3,4,1,1,2,2,4,1,3,2,4,3,1,2,4,1,3,2,4,1,3,2,
			3,2,4,1,2,3,4,1,2,3,2,1,4,3,4,3,2,1,2,4,4,3,2,1,2,3,4,1,3,4,1,2,3,4,1,2,3,4,1,2,3,4,2,1,2,3,4,1,2,3,4,3,4,1,2,3,4,1,2,3,1,2,3,4,1,2,3,4,1,2,4,1,2,3,4,1,2,3,1,4,1,2,3,4,1,3,2,4,1,1,2,4,1,2,3,2,4,1,3,4,
			1,4,1,2,3,4,1,2,3,4,1,2,1,2,4,3,2,4,1,2,4,1,3,2,4,1,2,3,4,1,,2,3,1,4,2,3,1,4,2,1,3,2,3,4,1,2,4,3,2,1,3,1,2,4,4,1,2,3,1,2,3,4,1,2,3,4,1,2,3,4,2,4,1,4,2,3,1,,4,2,3,1,2,4,1,2,3,4,1,2,3,3,1,4,1,2,3,4,1,
			2,3,4,1,2,3,4,1,2,3,4,1,2,3,2,3,1,4,2,3,1,3,2,4,1,4,4,1,2,3,4,1,2,3,4,1,2,3,4,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,,,,,,,,,4,1,3,2,1,2,4,,,,,1,2,3,1,4,3,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,2,2,
			1,3,4,2,3,1,4,3,2,2,1,2,1,4,3,3,1,2,2,4,3
		];

		do {
			shotCity = cities.snapshotItem(shotIterator-1);
			shotResult = shotRegExp.exec(shotCity.href);
			shotCity.setAttribute("style", "padding-left: 28px; width: 330px; background: transparent no-repeat scroll left center; background-image: url("+resourceImageById[resourceById[parseInt(shotResult[1], 10)]]+");");
		} while (--shotIterator);

	}

}

var endTime = (new Date).getTime();
    })()
}

Beastx.registerModule(
    'Embassy Tools',
    'Este modulo nos da diferentes herramientas en la pagina del Diplomatico y en la pagina de la embajada, como ordenar los usuarios por diferentes columnas, accesos directos a las polis de los miembros entre otras cosas.'
);