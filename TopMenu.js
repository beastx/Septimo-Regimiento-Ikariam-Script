// ==UserScript==
// @name                  Top Menu
// @version               0.2
// @author                Beastx
//
// @history                0.2 Fixed problem with css path
// @history                0.2 Added Website and blog links
// @history                0.1 Initial release
// ==/UserScript==

Beastx.TopMenu = function() {};

Beastx.TopMenu.prototype.init = function() {
    this.options = {};
    this.addStyles();
    this.create();
    this.append();
    setInterval(DOM.createCaller(this, 'updateTime'), 1000);
}

Beastx.TopMenu.prototype.create = function() {
    var menuOptions = '<ul class="beastxMainMenu">';
    menuOptions += '<li class="serverTime"><a><span id="servertime" class="textLabel">Beastx Ikariam Script | Alianza Septimo Regimiento</span></a></li>';
    menuOptions += '</ul>';

    var ikariamOldOptions = '<ul class="ikariamOldOptions">';
    ikariamOldOptions += '<li class="serverTime"><a target="_blank" href="http://7moreg.beastx.com.ar/"><span id="servertime" class="textLabel">Sitio Web Alianza</span></a></li>';
    ikariamOldOptions += '<li class="serverTime"><a target="_blank" href="http://7moreg.beastx.com.ar/blog/"><span id="servertime" class="textLabel">Blog</span></a></li>';
    ikariamOldOptions += '<li class="serverTime"><a href="http://s2.ar.ikariam.com/index.php?view=highscore&showMe=1"><span id="servertime" class="textLabel">Clasificacion</span></a></li>';
    
    ikariamOldOptions += '<li class="serverTime"><a href="#" onclick="javascript:switchNoteDisplay(); return false;"><span id="servertime" class="textLabel">Notas</span></a></li>';
    
    ikariamOldOptions += '<li class="serverTime"><a href="http://board.ar.ikariam.com/" target="_blank"><span id="servertime" class="textLabel">Foro</span></a></li>';
    ikariamOldOptions += '<li class="serverTime"><a href="http://s2.ar.ikariam.com/index.php?view=options"><span id="servertime" class="textLabel">Opciones</span></a></li>';
    ikariamOldOptions += '<li class="serverTime"><a href="http://board.ar.ikariam.com/" target="_blank"><span id="servertime" class="textLabel"></span></a></li>';
    ikariamOldOptions += '<li class="serverTime"><a href="http://s2.ar.ikariam.com/index.php?action=loginAvatar&function=logout"><span id="servertime" class="textLabel">Salir</span></a></li>';

    ikariamOldOptions += '<li class="serverTime"><a><span id="spanServertime" class="textLabel"></span></a></li>';
    ikariamOldOptions += '</ul>';

    this.element = document.createElement('div');
    this.element.id = 'beastxMenuContainer';
    this.element.innerHTML = menuOptions + ikariamOldOptions;
}

Beastx.TopMenu.prototype.append = function() {
    document.body.appendChild(this.element);
}

Beastx.TopMenu.prototype.updateTime = function() {
    $('spanServertime').innerHTML = $('servertime').textContent;
}

Beastx.TopMenu.prototype.addStyles = function() {
    GM_addStyle("\
        #container { margin-top: 20px; }\
        #GF_toolbar { display: none; }\
        #extraDiv1 { margin-top: 20px; }\
        #extraDiv2 { margin-top: 20px; }\
        #beastxMenuContainer { text-align: left; position: fixed; width: 100%; height: 28px; background-color: #666; top: 0px; left: 0px; z-index: 999999; color: white; border-bottom: 2px solid black; }\
        #beastxMenuContainer a { color: white; }\
        #beastxMenuContainer .rightContainer { float: right; }\
        #beastxMenuContainer .leftContainer { float: left; }\
        #beastxMenuContainer ul.ikariamOldOptions { right: 1em; top: 8px; position: absolute; }\
        #beastxMenuContainer ul.ikariamOldOptions li { float: left; margin-left: 1em; }\
        #beastxMenuContainer ul.ikariamOldOptions li a { font-weight: bold }\
        #beastxMenuContainer ul.beastxMainMenu { left: 1em; top: 8px; position: absolute; }\
        #beastxMenuContainer ul.beastxMainMenu li { float: left; margin-left: 1em; }\
        #beastxMenuContainer ul.beastxMainMenu li a { font-weight: bold }\
        .menu { display: none; }\
    ");
}
