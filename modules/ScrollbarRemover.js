// ==UserScript==
// @name                  Scrollbar Remover
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
// ==/UserScript==

Beastx.ScrollBarRemover = function() {};

Beastx.ScrollBarRemover.prototype.init = function() {
    var css = "body {overflow-x: hidden !important;}";
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            var node = document.createElement("style");
            node.type = "text/css";
            node.appendChild(document.createTextNode(css));
            heads[0].appendChild(node); 
        }
    }
}