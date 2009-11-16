// ==UserScript==
// @name                  VAR Tools
// @version               0.01
// @author                Beastx
//
// @history                0.01 Initial release
//
// ==/UserScript==



FloatingPopup = function() {}
    
FloatingPopup.prototype.init = function(content, cssClass, dontCloseOnBlur) {
    this.scriptName = 'FloatingPopup';
    this.content = content;
    this.cssClass = cssClass;
    this.dontCloseOnBlur = dontCloseOnBlur;
    this.addBasicStyles();
    if (content) {
        this.updateUI();
    }
}

FloatingPopup.prototype.setContent = function(content) {
    this.content = content;
    if (!this.widget) {
        this.updateUI();
    } else {
        this.updateContent();
    }
}

FloatingPopup.prototype.addBasicStyles = function() {
    var default_style = <><![CDATA[
     .FloatingPopup { position: absolute; top: 0; left: 0; z-index: 9999999; border: 1px solid #7E0D0B; border-top: 3px solid #7E0D0B; background-color: #F6EBBC }
    ]]></>.toXMLString();
    GM_addStyle(default_style);
}

FloatingPopup.prototype.updateContent = function() {
    DOM.removeAllChildNodes(this.widget);
    this.widget.appendChild(this.content);
}

FloatingPopup.prototype.updateUI = function() {
    this.widget = this.element('div', { tabIndex: -1, 'class': 'FloatingPopup' + (this.cssClass ? ' ' + this.cssClass : ''), onblur: this.caller('onBlur') }, [ '' ]);
    this.updateContent();
}

FloatingPopup.prototype.onBlur = function() {
    if (!this.dontCloseOnBlur) {
        this.close();
    }
}

FloatingPopup.prototype.setPosition = function(pos) {
    this.widget.style.left = pos.x + 'px';
    this.widget.style.top = pos.y + 'px';
}

FloatingPopup.prototype.openBellowElement = function(referenceElement) {
    this.open();
    var pos = DOM.getPosition(referenceElement);
    this.setPosition({
        x: pos.x,
        y: pos.y + referenceElement.offsetHeight
    });
}

FloatingPopup.prototype.openCentered = function() {
    this.open();
    var winSize = DOM.getWindowInnerSize();
    this.setPosition({
        x: parseInt(winSize.w / 2) - parseInt(this.widget.offsetWidth / 2),
        y: 100
    });
}

FloatingPopup.prototype.open = function() {
    if (!this.isOpen) {
        document.body.appendChild(this.widget);
        this.widget.focus();
        this.isOpen = true;
    }
}

FloatingPopup.prototype.close = function() {
    if (this.isOpen) {
        this.widget.parentNode.removeChild(this.widget);
        this.isOpen = false;
    }
}

FloatingMenu = function() {}
    
FloatingMenu.prototype = New(FloatingPopup);
    
FloatingMenu.prototype.init = function(options, cssClass) {
    this.scriptName = 'FloatingMenu';
    this.cssClass = cssClass;
    var content = this.element('div');
    this.options = options;
    this.addBasicStyles();
    for (var i = 0; i < this.options.length; ++i) {
        content.appendChild(this.options[i].widget);
    }
    FloatingPopup.prototype.init.call(this, content, cssClass);
}

FloatingMenu.prototype.addBasicStyles = function() {
    var default_style = <><![CDATA[
     .FloatingMenuItem { padding: 0.2em; cursor: pointer}\
     .FloatingMenuItem:hover { background-color: gray; color: white; }\
     .FloatingMenuSeparator { background-color: white; padding: 0em; height: 1px; margin: 0.2em 0em; }
    ]]></>.toXMLString();
    GM_addStyle(default_style);
}

FloatingMenuItem = function() {}
    
FloatingMenuItem.prototype.init = function(label, url, action, target) {
    this.scriptName = 'FloatingMenuItem';
    this.label = label;
    this.action = action;
    this.url = url;
    this.target = target;
    this.updateUI();
}

FloatingMenuItem.prototype.updateUI = function() {
    this.widget = this.element('div', { 'class': 'FloatingMenuItem', onclick: this.caller('onClick') }, [ this.label ]);
}

FloatingMenuItem.prototype.onClick = function() {
    if (this.action) {
        this.action();
    } else {
        if (this.target == '_blank') {
            window.open(this.url);
        } else {
            location.href = this.url;
        }
    }
}

FloatingMenuItem.prototype.toString = function() {
    return this.label ? this.label : this.scriptName;
}

FloatingMenuSeparator = function() {}
    
FloatingMenuSeparator.prototype.init = function() {
    this.scriptName = 'FloatingMenuSeparator';
    this.updateUI();
}

FloatingMenuSeparator.prototype.updateUI = function() {
    this.widget = this.element('div', { 'class': 'FloatingMenuItem FloatingMenuSeparator' }, [ '' ]);
}

FloatingMenuSeparator.prototype.toString = function() {
    return 'separator';
}