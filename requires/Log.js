//~ // Compiled LOG
//~ // BEGIN core.js
//~ // LOG

//~ var LOG = {};
    
    //~ var tinkermanContainer = document.createElement('div');
    //~ tinkermanContainer.id = 'tinkerman';
    
//~ document.body.appendChild(tinkermanContainer);
    
//~ LOG.url = 'http://ikariam.beastx/tools/userScripts/requires/tinkerman/';
    
//~ LOG.dontLogResult = {}; // This is used internally to avoid logging some things
//~ LOG.clickedMessages = [];
//~ LOG.pendingLogCalls = []; // This is used to wait until the page is loaded

//~ LOG.setTypeName = function(constructor, name) {
    //~ constructor.prototype.getTypeName = function() {
        //~ return name;
    //~ }
//~ }

//~ LOG.logAsSection = function(sectionName, object, objectName) {
    //~ return LOG.logger.getOrAddSection(sectionName, new LOG.SingleLogItemSection(LOG.logger.doc, LOG.logger.getValueAsLogItem(object), objectName));
//~ }

//~ LOG.focusAndBlinkElement = function(element) {
    //~ element.scrollIntoView();
    //~ LOG.blinkElement(element);
//~ }

//~ LOG.blinkElement = function(element) {
    //~ element.style.backgroundColor = 'yellow';
    //~ setTimeout(
        //~ function() {
            //~ element.style.backgroundColor = '';
        //~ },
        //~ 1000
    //~ );
//~ }

//~ LOG.createOutlineFromElement = function(element) {
    //~ var div = document.createElement('div');
    //~ div.style.border = '2px solid red';
    //~ div.style.position = 'absolute';
    //~ div.style.width = element.offsetWidth + 'px';
    //~ div.style.height = element.offsetHeight + 'px';
    //~ var pos = LOG.getPosition(element);
    //~ div.style.left = pos.x + 'px';
    //~ div.style.top = pos.y + 'px';
    //~ var labelElement = document.createElement('label');
    //~ labelElement.appendChild(document.createTextNode(element.tagName + '-' + element.id));
    //~ labelElement.style.backgroundColor = '#FFF';
    //~ labelElement.onclick = function() {
        //~ Log(element);
    //~ }
    //~ div.appendChild(labelElement);
    //~ LOG.getBody().appendChild(div);
    //~ return div;
//~ }

//~ function Log(message, title, section, dontOpen, stackedMode) {
    //~ if (LOG.logger) {
        //~ return LOG.logger.log(message, title, true, section, dontOpen, stackedMode);
    //~ } else {
        //~ LOG.pendingLogCalls.push([message, title, section, dontOpen, stackedMode]);
        //~ return message;
    //~ }
//~ }

//~ function LogAndStore(value, source) {
    //~ return LOG.logger.logAndStore(value, source);
//~ }

//~ function LogX(str) { // Log in external window
    //~ var win = window.open("", "log", "resizable=yes,scrollbars=yes,status=yes");
    //~ win.document.open();
    //~ win.document.write('<html><head><title>LogX</title></head><body><pre id="pre" style="white-space: -moz-pre-wrap"> </pre></html>');
    //~ win.document.close();
    //~ win.document.getElementById('pre').firstChild.nodeValue = str;
//~ }

//~ // Log expression (usage: eval(LogE("expression")))
//~ function LogE(expression) {
    //~ return '(function() { return Log(' + expression + ', ' + expression.toSource() + ') } )();';
//~ }

//~ function LogError(e) {
    //~ var logItem = new LOG.ExceptionLogItem(LOG.logger.doc, e);
    //~ LOG.logger.defaultConsole.appendRow(
        //~ logItem.element,
        //~ 'error',
        //~ true,
        //~ 'red'
    //~ );
    //~ return LOG.dontLogResult;
//~ }
//~ // END core.js
//~ // BEGIN cookie.js
//~ LOG.addCookie = function(name, value, days) {
    //~ var path;
    //~ if (LOG.isIE) {
        //~ path = '/';
    //~ } else {
        //~ path = document.location.pathname;
    //~ }
    //~ var expires = '';
    //~ if (days) {
        //~ var date = new Date();
        //~ date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        //~ expires = '; expires=' + date.toGMTString();
    //~ }
    //~ document.cookie = name + '=' + escape(value) + expires + '; path=' + path;
//~ }

//~ LOG.getCookie = function(name) {
    //~ var nameEQ = name + '=';
    //~ var cookieStrings = document.cookie.split(';');
    //~ var cookieString;
    //~ for (var i = 0; i < cookieStrings.length; ++i) {
        //~ cookieString = cookieStrings[i];
        //~ while (cookieString.charAt(0) == ' ') {
            //~ cookieString = cookieString.substring(1);
        //~ }
        //~ if (cookieString.indexOf(nameEQ) == 0) {
            //~ return unescape(cookieString.substring(nameEQ.length));
        //~ }
    //~ }
    //~ return null;
//~ }
//~ // END cookie.js
//~ // BEGIN dom.js
//~ LOG.userAgent = navigator.userAgent.toLowerCase(); 
//~ LOG.isKonq = LOG.userAgent.indexOf('konqueror') != -1;
//~ LOG.isGecko = !LOG.isKonq && LOG.userAgent.indexOf('gecko') != -1;
//~ LOG.isOpera = LOG.userAgent.indexOf('opera') != -1;
//~ LOG.isIE = LOG.userAgent.indexOf('msie') != -1 && !LOG.isOpera;


//~ LOG.preventDefault = function(event) {
    //~ if (event.preventDefault) {
        //~ event.preventDefault();
    //~ } else {
        //~ event.returnValue = false;
    //~ }
//~ }

//~ LOG.stopPropagation = function(event) {
    //~ if (event.stopPropagation) {
        //~ event.stopPropagation();
    //~ } else {
        //~ event.cancelBubble = true;
    //~ }
//~ }

//~ if (!LOG.loaded) { // We do this to keep them even if the script is reloaded
    //~ LOG.eventListeners = {};
//~ }

//~ LOG.addEventListener = function(element, eventString, handler, useCapture) {
    //~ if (!LOG.eventListeners[eventString]) {
        //~ LOG.eventListeners[eventString] = [];
    //~ }
    //~ var item = {
        //~ handler: handler,
        //~ element: element,
        //~ useCapture: !!useCapture
    //~ };
    //~ LOG.eventListeners[eventString].push(item);
    //~ if (element.addEventListener) {
        //~ element.addEventListener(eventString, handler, !!useCapture);
    //~ } else {
        //~ element.attachEvent("on" + eventString, handler);
    //~ }
//~ }

//~ LOG.removeEventListener = function(element, eventString, handler, useCapture) {
    //~ var list = LOG.eventListeners[eventString];
    //~ var pos;
    //~ for (var i = 0; i < list.length; ++i) {
        //~ if (list[i].handler == handler && list[i].element == element && list[i].useCapture == useCapture) {
            //~ pos = i;
            //~ break;
        //~ }
    //~ }
    //~ list.splice(pos, 1);
    //~ if (list.length == 0) {
        //~ delete LOG.eventListeners[eventString];
    //~ }
    //~ if (element.addEventListener) {
        //~ element.removeEventListener(eventString, handler, useCapture);
    //~ } else {
        //~ element.detachEvent("on" + eventString, handler);
    //~ }
//~ }

//~ LOG.removeAllEventListeners = function() {
    //~ var eventString, list, item;
    //~ for (eventString in LOG.eventListeners) {
        //~ list = LOG.eventListeners[eventString];
        //~ while (list.length > 0) {
            //~ item = list[0];
            //~ LOG.removeEventListener(item.element, eventString, item.handler, item.useCapture);
        //~ }
    //~ }
//~ }

//~ // These are used to add or remove an event handler to an object preserving the "this" reference

//~ if (!LOG.loaded) { // We do this to keep them even if the script is reloaded
    //~ LOG.objEventListeners = [];
//~ }

//~ LOG.addObjEventListener = function(obj, element, eventString, handler) {
    //~ var pos = LOG.objEventListeners.length;
    //~ var item = {
        //~ obj: obj,
        //~ element: element,
        //~ eventString: eventString,
        //~ handler: handler,
        //~ internalHandler: new Function('event', "LOG.runObjEventHandler(event, " + pos + ")")
    //~ };
    //~ LOG.objEventListeners[pos] = item
    //~ LOG.addEventListener(element, eventString, item.internalHandler);
//~ }

//~ LOG.removeObjEventListener = function(obj, element, eventString, handler) {
    //~ var list = LOG.objEventListeners, item, i;
    
    //~ for (i = 0; i < list.length; i++) {
        //~ item = list[i];
        //~ if (item && item.obj == obj && item.element == element && item.eventString == eventString && item.handler == handler) {
            //~ LOG.removeEventListener(element, eventString, item.internalHandler);
            //~ delete(list[i]);
            //~ break;
        //~ }
    //~ }
//~ }

//~ LOG.runObjEventHandler = function(event, number) {
    //~ LOG.objEventListeners[number].handler.call(LOG.objEventListeners[number].obj, event);
//~ }

//~ LOG.getWindowInnerSize = function(doc) {
    //~ var w, h;
    //~ if (self.innerHeight) { // all except Explorer
        //~ w = self.innerWidth;
        //~ h = self.innerHeight;
    //~ } else if (doc.documentElement && doc.documentElement.clientHeight) { // Explorer 6 Strict Mode
        //~ w = doc.documentElement.clientWidth;
        //~ h = doc.documentElement.clientHeight;
    //~ } else if (doc.body) { // other
        //~ w = doc.body.clientWidth;
        //~ h = doc.body.clientHeight;
    //~ }
    //~ return {w: w, h: h}
//~ }

//~ LOG.getScrollBarPositions = function() {
    //~ var document = LOG.logger.doc;
    //~ var x, y;
    //~ if (typeof document.documentElement != 'undefined' && typeof document.documentElement.scrollLeft != 'undefined') {
        //~ x = document.documentElement.scrollLeft;
        //~ y = document.documentElement.scrollTop;
    //~ } else if (typeof window.pageXOffset != 'undefined') {
        //~ x = window.pageXOffset;
        //~ y = window.pageYOffset;
    //~ } else {
        //~ x = document.body.scrollLeft;
        //~ y = document.body.scrollTop;
    //~ }
    //~ return {x: x, y: y}
//~ }

//~ LOG.getPositionFromEvent = function(event) {
    //~ if (event.pageX) { /* Standards... */
        //~ return {x: event.pageX, y: event.pageY};
    //~ } else { /* ie ... */
        //~ var pos = LOG.getScrollBarPositions();
        //~ return {x: event.clientX + pos.x, y: event.clientY + pos.y};
    //~ }
//~ }

//~ // Gets the absolute position of the element from the body
//~ // It takes into account any element scroll position
//~ LOG.getPosition = function(obj, dontAdjustForScroll) {
    //~ var left = 0;
    //~ var top = 0;
    //~ if (obj.offsetParent) {
        //~ while (obj.offsetParent) {
            //~ left += obj.offsetLeft - obj.scrollLeft;
            //~ top += obj.offsetTop - obj.scrollTop;
            //~ obj = obj.offsetParent;
        //~ }
    //~ }
    //~ if (!dontAdjustForScroll) {
        //~ left += LOG.getBody().scrollLeft;
        //~ top += LOG.getBody().scrollTop;
    //~ }
    //~ return {x: left, y: top};
//~ }

//~ // Takes into account if the LOG wrapper element is active and either returns the true document's body or LOG's
//~ LOG.getBody = function(element) {
    //~ return LOG.logRunner.getBody();
//~ }

//~ // This works both with <input type=text>s and <textarea>s
//~ // returns an array [start, end]
//~ LOG.getTextInputSelection = function(element) {
    //~ if (LOG.isIE) {
        //~ var start = null, end = null;
        //~ var selection = element.ownerDocument.selection.createRange();
        
        //~ var elementSelection;
        //~ if (element.tagName.toLowerCase() == 'textarea') {
            //~ elementSelection = selection.duplicate();
            //~ elementSelection.moveToElementText(element);
        //~ } else { // input type=text
            //~ elementSelection = element.createTextRange();
        //~ }
        //~ try {
            //~ for (var i = 0; i <= element.value.length; i++) {
                //~ if (i > 0) {
                    //~ elementSelection.move('character');
                //~ }
                //~ if (elementSelection.compareEndPoints('StartToStart', selection) == 0) {
                    //~ start = i;
                    //~ if (end !== null) {
                        //~ break;
                    //~ }
                //~ }
                //~ if (elementSelection.compareEndPoints('StartToEnd', selection) == 0) {
                    //~ end = i;
                    //~ if (start !== null) {
                        //~ break;
                    //~ }
                //~ }
            //~ }
        //~ } catch (e) { // if the selection is collapsed explorer throws an exception
        //~ }
        //~ return [start === null ? 0 : start, end === null ? 0 : end];
    //~ } else {
        //~ return [element.selectionStart, element.selectionEnd];
    //~ }
//~ }

//~ // This works both with <input type=text>s and <textarea>s
//~ // range is an array [start, end]
//~ LOG.setTextInputSelection = function(element, range) {
    //~ if (LOG.isIE) {
        //~ var selection = element.createTextRange();
        //~ var i;
        //~ var distance = element.value.length - range[1];
        //~ if (distance < 0) {
            //~ distance = 0;
        //~ }
        //~ for (i = 1; i <= distance; i++) {
            //~ selection.moveEnd('character', -1);
        //~ }
        //~ distance = range[0];
        //~ if (distance > element.value.length) {
            //~ distance = element.value.length;
        //~ }
        //~ for (i = 1; i <= distance; i++) {
            //~ selection.moveStart('character');
        //~ }
        //~ selection.select();
    //~ } else {
        //~ element.selectionStart = range[0];
        //~ element.selectionEnd = range[1];
    //~ }
//~ }

//~ LOG.createElement = function(ownerDocument, tagName, attributes, childNodes) {
    //~ var element = ownerDocument.createElement(tagName);
    //~ var styleProperties, item;
    //~ var type;
    //~ for (var attribute in attributes) {
        //~ type = typeof attributes[attribute];
        //~ if (type == 'function' || type == 'boolean') {
            //~ element[attribute] = attributes[attribute];
        //~ } else if (attribute == 'style' && typeof attributes[attribute] == 'object') {
            //~ styleProperties = attributes[attribute];
            //~ for (item in styleProperties) {
                //~ element.style[item] = styleProperties[item];
            //~ }
        //~ } else if (attribute == 'class') {
            //~ element.className = attributes[attribute];
        //~ } else if (attributes[attribute] === null) {
            //~ continue;
        //~ } else {
            //~ element.setAttribute(attribute, attributes[attribute]);
        //~ }
    //~ }
    //~ if (childNodes) {
        //~ for (var i = 0; i < childNodes.length; ++i) {
            //~ if (childNodes[i] === null) {
                //~ continue;
            //~ } else if (typeof childNodes[i] == 'string' || typeof childNodes[i] == 'number') {
                //~ element.appendChild(ownerDocument.createTextNode(childNodes[i]));
            //~ } else {
                //~ element.appendChild(childNodes[i]);
            //~ }
        //~ }
    //~ }
    //~ return element;
//~ }


//~ // Creates a function which will be called as a method from obj which will
//~ //  have event as a parameter but will call the callback with 2 parameters:
//~ //  event and the extra parameter passed. This also handles the missing event
//~ //  parameter from explorer.
//~ LOG.createEventHandler = function(doc, obj, methodName, parameter) {
    //~ return function(event) {
        //~ if (!event) {
            //~ event = doc.parentWindow.event;
        //~ }
        //~ obj[methodName].call(obj, event, parameter);
    //~ }
//~ }

//~ LOG.getButtonFromEvent = function(event) {
    //~ if (event.button == 2) {
        //~ return "right";
    //~ } else if (LOG.isGecko) {
        //~ if (event.button == 0) {
            //~ return "left";
        //~ } else {
            //~ return "middle";
        //~ }
    //~ } else {
        //~ if (event.button == 1) {
            //~ return "left";
        //~ } else {
            //~ return "middle";
        //~ }
    //~ }
//~ }

//~ LOG.getElementFromEvent = function(event) {
    //~ if (event.target) {
        //~ return event.target;
    //~ } else {
        //~ return event.srcElement;
    //~ }
//~ }
//~ // END dom.js
//~ // BEGIN var.js
//~ LOG.indexOf = function(arr, item) {
    //~ for (var i = 0; i < arr.length; i++) {
        //~ if (arr[i] == item) {
            //~ return i;
        //~ }
    //~ }
    //~ return -1;
//~ }

//~ LOG.getObjectProperties = function(object) {
    //~ var item, items = [];
    //~ for (item in object) {
        //~ items.push(item);
    //~ }
    //~ return items;
//~ }

//~ LOG.isWhitespace = function(s) {
    //~ var whitespace = " \t\n\r";
    //~ for (var i = 0; i < s.length; i++) {
        //~ if (whitespace.indexOf(s.charAt(i)) == -1) {
            //~ return false;
        //~ }
    //~ }
    //~ return true;
//~ }
//~ // END var.js
//~ // BEGIN extra.js
//~ LOG.throwExceptionWithStack = function(name, message, sourceException) {
    //~ if (DOM.isGecko) {
        //~ try {
            //~ ({}).nonExistentMethod();
        //~ } catch (e2) {
            //~ var newE = {};
            //~ if (sourceException) {
                //~ newE.name = sourceException.name;
                //~ newE.message = message ? message : sourceException.message;
            //~ } else {
                //~ newE.name = name;
                //~ newE.message = message;
            //~ }
            //~ newE.fileName = e2.fileName;
            //~ newE.lineNumber = e2.lineNumber;
            //~ newE.stack = e2.stack;
            //~ throw newE;
        //~ }
    //~ } else {
        //~ throw name;
    //~ }
//~ }

//~ LOG.openClassInEditor = function(value) {
    //~ if (value.getPackage()) {
        //~ var packageName = value.getPackage().name;
        //~ var className = value.getSimpleClassName();
        //~ document.location = 'openClass.php?fileName=' + escape(Package.getFileName(packageName)) + '&class=' + escape(className);
    //~ }
//~ }// END extra.js
//~ // BEGIN guess.js
//~ // example for objectsToStartWith: [ { obj: page, name: 'page', parent: null } ]
//~ LOG.guessNameAsArray = function(objToFind, objectsToStartWith) {
    //~ function getPath(item) {
        //~ var path = [];
        //~ while (item) {
            //~ path.unshift(item);
            //~ item = item.parent;
        //~ }
        //~ return path;
    //~ }
    
    //~ var checkedObjects = [];
    //~ var objectsToCheck = LOG.shallowClone(objectsToStartWith);
    //~ for (var i = 0; i < objectsToCheck.length; ++i) {
        //~ if (objectsToCheck[i].obj == objToFind) {
            //~ return getPath(objectsToCheck[i]);
        //~ }
    //~ }
    //~ var name, currentItem;
    //~ while (objectsToCheck.length > 0) {
        //~ currentItem = objectsToCheck.shift();
        //~ parentObj = currentItem.obj;
        //~ if (parentObj.dontGuessNames) {
            //~ continue;
        //~ }
        //~ for (name in parentObj) {
            //~ try {
                //~ if (!parentObj[name]) {
                    //~ continue;
                //~ }
            //~ } catch (e) {
                //~ continue;
            //~ }
            //~ if (parentObj[name] === objToFind) {
                //~ return getPath(
                    //~ {
                        //~ obj: parentObj[name],
                        //~ name: name,
                        //~ parent: currentItem
                    //~ }
                //~ );
            //~ }
            //~ if (typeof parentObj[name] != "object") {
                //~ continue;
            //~ }
            //~ try {
                //~ if (parentObj[name].nodeType) {
                    //~ continue;
                //~ }
                //~ if (parentObj[name] == window) {
                    //~ continue;
                //~ }
                //~ if (LOG.indexOf(checkedObjects, parentObj[name]) !== -1) {
                    //~ continue;
                //~ }
            //~ } catch (e) {
                //~ continue;
            //~ }
            //~ checkedObjects.push(parentObj[name]);
            //~ objectsToCheck.push(
                //~ {
                    //~ obj: parentObj[name],
                    //~ name: name,
                    //~ parent: currentItem
                //~ }
            //~ );
        //~ }
    //~ }
    //~ return null;
//~ }

//~ //  This returns:
//~ //      "1" -> "[1]" // integers get enclosed in square brackets
//~ //      "name" -> ".name" // no conversion was necessary
//~ //      "a value" -> "[\"a value\"]" // it has value which is not valid as an identifier, so it gets quoted and enclosed
//~ LOG.getPropertyAccessor = function(propertyName) {
    //~ var nameMustNotBeQuotedRegexp = /^[a-z_$][a-z0-9_$]*$/i;
    //~ var isIntegerRegexp = /^[0-9]+$/i;
    //~ var isInteger;
    //~ if (nameMustNotBeQuotedRegexp.test(propertyName)) {
        //~ return '.' + propertyName;
    //~ } else {
        //~ var out = '[';
        //~ isInteger = isIntegerRegexp.test(propertyName);
        //~ if (!isInteger) {
            //~ out += '"';
        //~ }
        //~ out += propertyName.replace('"', "\\\"]");
        //~ if (!isInteger) {
            //~ out += '"';
        //~ }
        //~ out += ']';
        //~ return out;
    //~ }
//~ }

//~ LOG.guessName = function(objToFind, objectsToStartWith) {
    //~ function objectPathToString(pathElements) {
        //~ var out = pathElements[0].name;
        //~ for (var i = 1; i < pathElements.length; ++i) {
            //~ out += LOG.getPropertyAccessor(pathElements[i].name);
        //~ }
        //~ return out;
    //~ }
    //~ function elementPathToString(pathElements) {
        //~ var out = '';
        //~ for (var i = 0; i < pathElements.length; ++i) {
            //~ if (i > 0) {
                //~ out += '.';
            //~ }
            //~ out += 'childNodes[' + pathElements[i] + ']';
        //~ }
        //~ return out;
    //~ }
    //~ var path = LOG.guessDomNodeOwnerName(objToFind, objectsToStartWith);
    //~ if (path) {
        //~ var str = objectPathToString(path.pathToObject);
        //~ if (path.pathToElement.length) {
            //~ str += '.' + elementPathToString(path.pathToElement)
        //~ }
        //~ return str;
    //~ }
    //~ return null;
//~ }

//~ LOG.getChildNodeNumber = function(domNode) {
    //~ var childNodes = domNode.parentNode.childNodes;
    //~ for (var i = 0; i < childNodes.length; ++i) {
        //~ if (childNodes[i] == domNode) {
            //~ return i;
        //~ }
    //~ }
    //~ return null;
//~ }

//~ LOG.guessDomNodeOwnerName = function(domNode, objectsToStartWith) {
    //~ if (domNode == null) {
        //~ return null;
    //~ } else {
        //~ var path = LOG.guessNameAsArray(domNode, objectsToStartWith);
        //~ if (path == null) {
            //~ var returnValue = LOG.guessDomNodeOwnerName(domNode.parentNode, objectsToStartWith);
            //~ if (returnValue == null) {
                //~ return null;
            //~ }
            //~ returnValue.pathToElement.push(LOG.getChildNodeNumber(domNode));
            //~ return returnValue;
        //~ } else {
            //~ return {
                //~ pathToObject: path,
                //~ pathToElement: []
            //~ }
            //~ return path;
        //~ }
    //~ }
//~ }

//~ // END guess.js
//~ // BEGIN diff.js
//~ LOG.shallowClone = function(obj) {
    //~ var item, out;
    //~ if (obj.constructor == Array) {
        //~ out = [];
    //~ } else {
        //~ out = {};
    //~ }
    //~ for (item in obj) {
        //~ out[item] = obj[item];
    //~ }
    //~ return out;
//~ }

//~ LOG.getObjectDifferences = function(oldObject, newObject) {
    //~ var oldKeys = LOG.getObjectProperties(oldObject);
    //~ var newKeys = LOG.getObjectProperties(newObject);
    //~ var addedKeys = [];
    //~ var i;
    //~ for (i = 0; i < newKeys.length; ++i) {
        //~ if (LOG.indexOf(oldKeys, newKeys[i]) == -1) {
            //~ addedKeys.push(newKeys[i]);
        //~ }
    //~ }
    //~ var removedKeys = [];
    //~ for (i = 0; i < oldKeys.length; ++i) {
        //~ if (LOG.indexOf(newKeys, oldKeys[i]) == -1) {
            //~ removedKeys.push(oldKeys[i]);
        //~ }
    //~ }
    //~ var notRemovedKeys = [];
    //~ for (i = 0; i < oldKeys.length; ++i) {
        //~ if (LOG.indexOf(removedKeys, oldKeys[i]) == -1) {
            //~ notRemovedKeys.push(oldKeys[i]);
        //~ }
    //~ }
    //~ var changedKeys = [], key;
    //~ for (i = 0; i < notRemovedKeys.length; ++i) {
        //~ key = notRemovedKeys[i];
        //~ if (oldObject[key] != newObject[key]) {
            //~ changedKeys.push(key);
        //~ }
    //~ }
    //~ return {
        //~ addedKeys: addedKeys,
        //~ removedKeys: removedKeys,
        //~ changedKeys: changedKeys
    //~ };
//~ }
//~ // END diff.js
//~ // BEGIN HistoryManager.js
//~ LOG.HistoryManager = function(serializedHistory) {
    //~ if (serializedHistory) {
        //~ try {
            //~ this.history = eval('(' + serializedHistory + ')');
            //~ if (this.history.length > 0) {
                //~ this.historyPosition = this.history.length;
            //~ }
        //~ } catch (e) {
            //~ this.history = [];
            //~ this.historyPosition = 0;
        //~ }
    //~ } else {
        //~ this.history = [];
        //~ this.historyPosition = 0;
    //~ }
    //~ this.currentValue = '';
//~ }

//~ LOG.setTypeName(LOG.HistoryManager, 'LOG.HistoryManager');

//~ LOG.HistoryManager.prototype.serialize = function() {
    //~ var maxLength = 2000; // since all the log's history will be kept in a cookie
    //~ var strLength = 3; // since we count both square brackets and the comma of the next element
    //~ var appendedOne = false;
    //~ var items = [], item;
    //~ for (var i = this.history.length - 1; i >= 0; --i) {
        //~ item = "\"" + this.history[i].replace('"', "\"") + "\"";
        //~ if (strLength + item.length > maxLength) {
            //~ break;
        //~ }
        //~ items.unshift(item);
        //~ strLength += item.length + 1;
    //~ }
    //~ return '[' + items.join(',') + ']';
//~ }

//~ LOG.HistoryManager.prototype.add = function(text) {
    //~ this.currentValue = '';
    //~ if (this.history[this.history.length - 1] != text) {
        //~ this.history.push(text);
    //~ }
    //~ this.historyPosition = this.history.length;
//~ }

//~ LOG.HistoryManager.prototype.up = function(currentValue) {
    //~ if (this.historyPosition == this.history.length) {
        //~ this.currentValue = currentValue;
    //~ }
    //~ if (this.historyPosition > 0) {
        //~ --this.historyPosition;
    //~ }
    //~ return this.getCurrent();
//~ }

//~ LOG.HistoryManager.prototype.down = function() {
    //~ if (this.historyPosition == this.history.length - 1) {
        //~ this.historyPosition = this.history.length;
    //~ } else if (this.historyPosition != -1 && this.historyPosition < this.history.length - 1) {
        //~ ++this.historyPosition;
    //~ }
    //~ return this.getCurrent();
//~ }

//~ LOG.HistoryManager.prototype.getCurrent = function() {
    //~ if (this.historyPosition == this.history.length) {
        //~ return this.currentValue;
    //~ } else {
        //~ return this.history[this.historyPosition];
    //~ }
//~ }
//~ // END HistoryManager.js
//~ // BEGIN BodyWrapper.js
//~ LOG.BodyWrapper = function(ownerDocument, initialSize, startWithFixedSize, onload) {
    //~ this.dragging = false;
    //~ this.ownerDocument = ownerDocument;
    //~ var doc = this.ownerDocument;
    //~ this.element = LOG.createElement(doc, 'div',
        //~ {
            //~ style: {
                //~ top: '0',
                //~ bottom: '0',
                //~ position: 'absolute',
                //~ left: '0',
                //~ right: '0',
                //~ overflow: 'hidden',
                //~ height: '100%',
                //~ width: '100%'
            //~ }
        //~ },
        //~ [
            //~ this.topElement = LOG.createElement(doc, 'div',
                //~ {
                    //~ style: {
                        //~ top: '0',
                        //~ width: '100%',
                        //~ position: 'absolute',
                        //~ left: '0',
                        //~ right: '0',
                        //~ overflow: 'auto'
                    //~ }
                //~ }
            //~ ),
            //~ this.bottomElement = LOG.createElement(doc, 'div',
                //~ {
                    //~ style: {
                        //~ width: '100%',
                        //~ bottom: '0',
                        //~ position: 'absolute',
                        //~ left: '0',
                        //~ right: '0'
                    //~ }
                //~ },
                //~ [
                    //~ this.resizeHandle = LOG.createElement(doc, 'div', // resize handle
                        //~ {
                            //~ style: {
                                //~ height: '6px',
                                //~ width: '100%',
                                //~ position: 'absolute',
                                //~ zIndex: 1000,
                                //~ cursor: 'n-resize'
                            //~ }
                        //~ }
                    //~ ),
                    //~ this.iframe = LOG.createElement(doc, 'iframe',
                        //~ {
                            //~ frameBorder: LOG.isIE ? '0' : null,
                            //~ style: {
                                //~ border: 'none',
                                //~ height: '100%',
                                //~ width: '100%'
                            //~ }
                        //~ }
                    //~ )
                //~ ]
            //~ )
        //~ ]
    //~ );
    //~ this.oldBodyOverflow = document.body.style.overflow;
    //~ this.oldBodyMargin = document.body.style.margin;
    //~ document.body.style.overflow = 'hidden';
    //~ document.body.style.margin = '0';
    //~ this.oldBodyHeight = document.body.style.height;
    //~ if (LOG.isIE) {
        //~ this.oldDocScroll = document.body.scroll;
        //~ this.oldHtmlHeight = document.getElementsByTagName('html')[0].style.height;
        //~ document.getElementsByTagName('html')[0].style.height = '100%';
        //~ document.body.scroll = "no"; // CSS doesn't always affect the scrollbar
    //~ }
    //~ document.body.style.height = '100%';
    
    //~ if (isNaN(initialSize) || initialSize < 0.1 || initialSize > 0.9) {
        //~ initialSize = 0.3333333;
    //~ }
    //~ if (startWithFixedSize) {
        //~ this.size = initialSize;
        //~ this.lock(startWithFixedSize);
    //~ } else {
        //~ this.setSize(initialSize ? initialSize : 0.3333333);
    //~ }
    //~ var child;
    //~ while (doc.body.firstChild) { 
        //~ child = doc.body.firstChild;
        //~ doc.body.removeChild(child);
        //~ this.topElement.appendChild(child);
    //~ }
    //~ this.onload = onload;
    //~ this.hidden = false;
    //~ doc.body.appendChild(this.element);
    //~ var me = this;
    
    //~ function onIframeLoad() {
        //~ console.log(me)
        //~ console.log(me.iframe)
        //~ me.iframe.onload = null;
        //~ if (!me.iframe.contentWindow) {
            //~ setTimeout(onIframeLoad, 0);
        //~ } else {
            //~ me.doc = me.iframe.contentWindow.document;
            //~ me.doc.open();
            //~ me.doc.write(LOG.getDefaultHtml(function() { me.onDocumentLoad(); }));
            //~ me.doc.close();
            //~ if (LOG.isIE) {
                //~ me.doc.body.scroll = "no"; // CSS doesn't always affect the scrollbar
            //~ }
            //~ LOG.addObjEventListener(me, me.resizeHandle, 'mousedown', me.onResizeHandleMousedown);
        //~ }
    //~ }
    //~ if (this.iframe.contentWindow && me.iframe.contentWindow.document) { // Konqueror needs this, the onload doesn't work (ie, fx and opera do)
        //~ onIframeLoad();
    //~ } else { // Opera needs this, the contentWindow is not ready yet (in ie, fx and konq this is not a problem)
        //~ this.iframe.onload = onIframeLoad();
    //~ }
//~ }

//~ LOG.setTypeName(LOG.BodyWrapper, 'LOG.BodyWrapper');

//~ LOG.BodyWrapper.prototype.onDocumentLoad = function() {
    //~ this.onload(this);
//~ }

//~ LOG.BodyWrapper.prototype.uninit = function() {
    //~ var doc = this.ownerDocument;
    //~ doc.body.removeChild(this.element);
    //~ while (this.topElement.firstChild) {
        //~ child = this.topElement.firstChild;
        //~ this.topElement.removeChild(child);
        //~ doc.body.appendChild(child);
    //~ }
    //~ var me = this;
    //~ delete this.element;
    //~ delete this.topElement;
    //~ delete this.bottomElement;
    //~ setTimeout(
        //~ function() { // otherwise IE (6, 7) crashes
            //~ document.body.style.overflow = me.oldBodyOverflow ? me.oldBodyOverflow : '';
            //~ document.body.style.margin = me.oldBodyMargin ? me.oldBodyMargin : '';
            //~ document.body.style.height = me.oldBodyHeight;
            //~ if (LOG.isIE) {
                //~ document.body.scroll = me.oldDocScroll; // CSS doesn't always affect the scrollbar
                //~ document.getElementsByTagName('html')[0].style.height = me.oldHtmlHeight;
            //~ }
            //~ LOG.removeObjEventListener(me, me.resizeHandle, 'mousedown', me.onResizeHandleMousedown);
        //~ },
        //~ 0
    //~ );
//~ }

//~ LOG.BodyWrapper.prototype.onDragKeypress = function(event) {
    //~ if (event.keyCode == 27) {
        //~ this.endDrag();
    //~ }
//~ }

//~ LOG.BodyWrapper.prototype.onResizeHandleMousedown = function(event) {
    //~ this.dragging = true;
    //~ this.originalDelta = LOG.getPositionFromEvent(event).y - LOG.getPosition(this.bottomElement, true).y;
    //~ this.element.style.borderColor = 'black';
    //~ this.draggingElement = LOG.createElement(document, 'div', { style: { width: '100%', borderTop: '1px dotted black', height: 0, position: 'absolute', left: 0 } });
    //~ this.draggingElement.style.top = ((1 - this.size) * 100) + '%';
    //~ document.body.appendChild(this.draggingElement);
    //~ LOG.addObjEventListener(this, document, 'mousemove', this.onMousemove);
    //~ LOG.addObjEventListener(this, document, 'mouseup', this.onMouseup);
    //~ LOG.addObjEventListener(this, document, 'keypress', this.onDragKeypress);
    //~ LOG.addObjEventListener(this, this.doc, 'mousemove', this.onMousemove);
    //~ LOG.addObjEventListener(this, this.doc, 'mouseup', this.onMouseup);
    //~ LOG.addObjEventListener(this, this.doc, 'keypress', this.onDragKeypress);
    //~ if (LOG.isIE) {
        //~ LOG.addObjEventListener(this, document, 'selectstart', this.onSelectstart);
        //~ LOG.addObjEventListener(this, this.doc, 'selectstart', this.onSelectstart);
    //~ }
    //~ this.oldBodyCursor = document.body.style.cursor ? document.body.style.cursor : '';
    //~ document.body.style.cursor = 'n-resize';
    //~ this.doc.body.style.cursor = 'n-resize';
    //~ LOG.stopPropagation(event);
    //~ LOG.preventDefault(event);
//~ }

//~ LOG.BodyWrapper.prototype.endDrag = function() {
    //~ this.dragging = false;
    //~ this.element.style.borderColor = 'gray';
    //~ document.body.removeChild(this.draggingElement);
    //~ delete this.draggingElement;
    //~ document.body.style.cursor = this.oldBodyCursor;
    //~ this.doc.body.style.cursor = '';
    //~ delete this.oldBodyCursor;
    //~ LOG.removeObjEventListener(this, document, 'mousemove', this.onMousemove);
    //~ LOG.removeObjEventListener(this, document, 'mouseup', this.onMouseup);
    //~ LOG.removeObjEventListener(this, document, 'keypress', this.onDragKeypress);
    //~ LOG.removeObjEventListener(this, this.doc, 'mousemove', this.onMousemove);
    //~ LOG.removeObjEventListener(this, this.doc, 'mouseup', this.onMouseup);
    //~ LOG.removeObjEventListener(this, this.doc, 'keypress', this.onDragKeypress);
    //~ if (LOG.isIE) {
        //~ LOG.removeObjEventListener(this, document, 'selectstart', this.onSelectstart);
        //~ LOG.removeObjEventListener(this, this.doc, 'selectstart', this.onSelectstart);
    //~ }
    //~ if (this.ondragend) {
        //~ this.ondragend();
    //~ }
    //~ this.setSize(this.chosenSize);
//~ }

//~ LOG.BodyWrapper.prototype.onSelectstart = function(event) {
    //~ LOG.stopPropagation(event);
    //~ LOG.preventDefault(event);
//~ }

//~ LOG.BodyWrapper.prototype.onMousemove = function(event) {
    //~ if (this.dragging) {
        //~ var top = LOG.getPositionFromEvent(event).y;
        //~ if (LOG.getElementFromEvent(event).ownerDocument == this.doc) {
            //~ top += LOG.getPosition(this.iframe, true).y;
        //~ }
        //~ top = (top - this.originalDelta) / LOG.getWindowInnerSize(this.ownerDocument).h;
        //~ if (top < 0.1) {
            //~ top = 0.1;
        //~ } else if ( top > 0.9) {
            //~ top = 0.9;
        //~ }
        //~ this.chosenSize = 1 - top;
        //~ this.draggingElement.style.top = ((1 - this.chosenSize) * 100) + '%';
        //~ return false;
    //~ }
//~ }

//~ LOG.BodyWrapper.prototype.onMouseup = function(event) {
    //~ this.endDrag();
//~ }

//~ LOG.BodyWrapper.prototype.getSize = function() {
    //~ return this.size;
//~ }

//~ LOG.BodyWrapper.prototype.setSize = function(size) {
    //~ this.size = size;
    //~ this.topElement.style.bottom = size * 100 + '%';
    //~ this.topElement.style.height = (1 - size) * 100 + '%';
    //~ this.bottomElement.style.top = (1 - size) * 100 + '%';
    //~ this.bottomElement.style.height = size * 100 + '%';
//~ }

//~ LOG.BodyWrapper.prototype.lock = function(fixedSize) {
    //~ this.topElement.style.bottom = '0';
    //~ this.topElement.style.height = '100%';
    //~ this.topElement.style.paddingBottom = fixedSize;
    //~ this.bottomElement.style.top = '';
    //~ this.bottomElement.style.bottom = '0';
    //~ this.bottomElement.style.height = fixedSize;
    //~ this.fixedSize = fixedSize;
//~ }

//~ LOG.BodyWrapper.prototype.unlock = function() {
    //~ this.setSize(this.size);
    //~ this.topElement.style.paddingBottom = '';
    //~ this.bottomElement.style.bottom = '';
    //~ delete this.fixedSize;
//~ }

//~ LOG.BodyWrapper.prototype.hide = function() {
    //~ this.hidden = true;
    //~ if (this.bottomElement) {
        //~ this.bottomElement.style.display = 'none';
        //~ this.topElement.style.height = '100%';
    //~ }
//~ }

//~ LOG.BodyWrapper.prototype.show = function() {
    //~ this.hidden = false;
    //~ if (this.bottomElement) {
        //~ this.bottomElement.style.display = '';
        //~ if (this.fixedSize) {
            //~ this.lock(this.fixedSize);
        //~ } else {
            //~ this.setSize(this.size);
        //~ }
    //~ }
//~ }

//~ LOG.BodyWrapper.prototype.appendChild = function(elementToWrap) {
    //~ this.doc.body.appendChild(elementToWrap);
//~ }

//~ LOG.BodyWrapper.prototype.getBody = function() {
    //~ return this.topElement;
//~ }

//~ LOG.BodyWrapper.prototype.getParentNodeHidingMe = function(node) {
    //~ var parentNode = node.parentNode;
    //~ if (parentNode == this.topElement) {
        //~ return this.ownerDocument.body;
    //~ } else {
        //~ return parentNode;
    //~ }
//~ }

//~ LOG.BodyWrapper.prototype.getChildNodesHidingMe = function(node) {
    //~ if (node == this.ownerDocument.body) {
        //~ return this.topElement.childNodes;
    //~ } else {
        //~ return node.childNodes;
    //~ }
//~ }
//~ // END BodyWrapper.js
//~ // BEGIN LogWindow.js
//~ LOG.LogWindow = function(callback) {
    //~ this.window = window.open('', 'LOG_logWindow', 'resizable=yes,scrollbars=yes,status=yes');
    //~ if (!this.window) {
        //~ throw "Cannot create window";
    //~ }
    //~ this.doc = this.window.document;
    //~ this.doc.open();
    //~ var me = this;
    //~ this.doc.write(
        //~ LOG.getDefaultHtml(
            //~ function() {
                //~ me.doc.title = 'Log: ' + window.document.title;
                //~ if (LOG.isGecko) {
                    //~ me.window.onunload = me.caller('onUnload');
                //~ } else {
                    //~ me.doc.body.onunload = me.caller('onUnload');
                //~ }
                //~ me.doc.body.onkeydown = LOG.createEventHandler(me.doc, me, 'onKeyDown');
                //~ callback(me);
            //~ }
        //~ )
    //~ );
    //~ this.doc.close();
//~ }

//~ LOG.setTypeName(LOG.LogWindow, 'LOG.LogWindow');

//~ LOG.LogWindow.prototype.caller = function(methodName) {
    //~ var me = this;
    //~ return function() {
       //~ return me[methodName].apply(me, arguments);
    //~ }
//~ }

//~ LOG.LogWindow.prototype.show = function() {
    //~ this.window.focus();
//~ }

//~ LOG.LogWindow.prototype.hide = function() {
//~ }

//~ LOG.LogWindow.prototype.uninit = function() {
    //~ this.window.close();
//~ }

//~ LOG.LogWindow.prototype.onKeyDown = function(event) {
    //~ if (this.onkeydown) {
        //~ return this.onkeydown(event);
    //~ }
//~ }

//~ LOG.LogWindow.prototype.onUnload = function(event) {
    //~ if (this.onunload) {
        //~ return this.onunload(event);
    //~ }
//~ }

//~ LOG.LogWindow.prototype.appendChild = function(elementToWrap) {
    //~ this.doc.body.appendChild(elementToWrap);
//~ }
//~ // END LogWindow.js
//~ // BEGIN CommandInput.js
//~ LOG.CommandInput = function(doc, useTextArea, evaluator, historyManager) {
    //~ this.doc = doc;
    //~ this.evaluator = evaluator;
    //~ this.useTextArea = useTextArea;
    
    //~ this.historyManager = historyManager;
    
    //~ this.element = LOG.createElement(
        //~ this.doc,
        //~ useTextArea ? 'textarea' : 'input',
        //~ {
            //~ style: {
                //~ width: '100%',
                //~ height: '100%',
                //~ border: 'none',
                //~ padding: '0',
                //~ fontFamily: 'terminus, monospace',
                //~ fontWeight: 'normal'
            //~ },
            //~ onmousedown: LOG.createEventHandler(doc, this, 'onInputMouseDown')
        //~ }
    //~ );
    //~ if (LOG.isIE || LOG.isKonq) {
        //~ this.element.onkeydown = LOG.createEventHandler(doc, this, 'onInputKeyPressOrDown');
    //~ }
    //~ if (!LOG.isIE) { // Konq needs both
        //~ this.element.onkeypress = LOG.createEventHandler(doc, this, 'onInputKeyPressOrDown');
    //~ }
//~ }

//~ LOG.setTypeName(LOG.CommandInput, 'LOG.CommandInput');

//~ LOG.CommandInput.prototype.onInputMouseDown = function(event) {
    //~ LOG.stopPropagation(event);
//~ }

//~ LOG.CommandInput.prototype.getCurrentExpression = function() {
    //~ function skipString(quote) {
        //~ for (--startWordPos; startWordPos > 0; --startWordPos) {
            //~ if (value.charAt(startWordPos) == quote && value.charAt(startWordPos - 1) != '\\') {
                //~ return;
            //~ }
        //~ }
        //~ throw 'unterminated string';
    //~ }
    
    //~ var endWordPos = LOG.getTextInputSelection(this.element)[0];
    //~ var startWordPos = endWordPos;
    //~ var value = this.element.value;
    //~ var depth = 0, chr, bracketDepth = 0;
    //~ while (startWordPos > 0) {
        //~ chr = value.charAt(startWordPos - 1);
        //~ if (chr == ')') {
            //~ ++depth;
        //~ } else if (chr == '(') {
            //~ if (depth == 0) {
                //~ break;
            //~ }
            //~ --depth;
        //~ } else if (chr == '[') {
            //~ if (bracketDepth == 0) {
                //~ break;
            //~ }
            //~ --bracketDepth;
        //~ } else if (chr == ']') {
            //~ ++bracketDepth;
        //~ } else if (chr == '\'' || chr == '"') {
            //~ skipString(chr);
        //~ } else if (depth == 0 && !(/^[a-zA-Z0-9_$.]$/.test(chr))) {
            //~ break;
        //~ }
        //~ --startWordPos;
    //~ }
    //~ return value.substr(startWordPos, endWordPos - startWordPos);
//~ }

//~ LOG.CommandInput.prototype.getCurrentWordAndPosition = function() {
    //~ var endWordPos = LOG.getTextInputSelection(this.element)[0];
    //~ var startWordPos = endWordPos;
    //~ var value = this.element.value;
    //~ var chr;
    //~ while (startWordPos > 0) {
        //~ chr = value.charAt(startWordPos - 1);
        //~ if (!(/^[a-zA-Z0-9_$]$/.test(chr))) {
            //~ break;
        //~ }
        //~ startWordPos--;
    //~ }
    //~ return {
        //~ word: value.substr(startWordPos, endWordPos - startWordPos),
        //~ start: startWordPos,
        //~ end: endWordPos
    //~ }
//~ }

//~ LOG.CommandInput.prototype.onInputKeyPressOrDown = function(event) {
    //~ function getCommonStart(list) {
        //~ var common = list[0];
        //~ var j;
        //~ for (var i = 1; i < list.length; ++i) {
            //~ if (list[i].length < common.length) {
                //~ common = common.substr(0, list[i].length);
            //~ }
            //~ for (j = 0; j < common.length; ++j) {
                //~ if (common.charAt(j) != list[i].charAt(j)) {
                    //~ common = common.substr(0, j);
                    //~ break;
                //~ }
            //~ }
        //~ }
        //~ return common;
    //~ }
    //~ // Konqueror and opera return normal keys with keyCode as the charCode
    //~ //  For Konqueror we skip them here to prevent "(" to be detected as "down" and similar
    //~ //  For opera it seems not to be possible, so we require control+shift to use these keys
    //~ //   (since control alone triggers a link navigation behaviour which doesn't seem to be
    //~ //   cancellable)
    //~ if (event.charCode) { // This only works for Konqueror, as Opera doesn't support charCode
        //~ return;
    //~ }
    //~ if (LOG.isKonq) {
        //~ if (event.keyCode == 9) {
            //~ if (event.type != 'keydown') {
                //~ return;
            //~ }
        //~ } else {
            //~ if (event.type == 'keydown') {
                //~ return;
            //~ }
        //~ }
    //~ }
    //~ if (event.keyCode == 9) { // Tab
        //~ LOG.stopPropagation(event);
        //~ LOG.preventDefault(event);
        //~ var currentExpression = this.getCurrentExpression();
        //~ var currentWordAndPosition = this.getCurrentWordAndPosition();
        //~ var names;
        //~ if (currentExpression == currentWordAndPosition.word) {
            //~ names = LOG.getObjectProperties(window).concat(
                //~ [
                    //~ 'escape', 'unescape', 'encodeURI', 'decodeURI', 'encodeURIComponent',
                    //~ 'decodeURIComponent', 'isFinite', 'isNaN', 'Number', 'eval', 'parseFloat',
                    //~ 'parseInt', 'String', 'Infinity', 'undefined', 'NaN', 'true', 'false'
                //~ ]
            //~ );
        //~ } else {
            //~ var script = currentExpression.substr(0, currentExpression.length - currentWordAndPosition.word.length);
            //~ if (script.charAt(script.length - 1) == '.') {
                //~ script = script.substr(0, script.length - 1);
            //~ }
            //~ var result = this.evaluator.evalScript(script);
            //~ if (typeof result != 'object' || result == LOG.dontLogResult) {
                //~ return;
            //~ }
            //~ names = LOG.getObjectProperties(result);
        //~ }
        //~ var matches = this.getNamesStartingWith(currentWordAndPosition.word, names);
        //~ if (matches.length == 0) {
            //~ return;
        //~ }
        //~ if (matches.length > 1) {
            //~ Log(matches, 'Matches');
        //~ }
        //~ var commonStart = getCommonStart(matches);
        //~ if (commonStart.length > currentWordAndPosition.word.length) {
            //~ this.element.value = this.element.value.substr(0, currentWordAndPosition.end) +
                //~ commonStart.substr(currentWordAndPosition.word.length) +
                //~ this.element.value.substr(currentWordAndPosition.end)
            //~ ;
            //~ var commonStartPos = currentWordAndPosition.end + commonStart.length - currentWordAndPosition.word.length;
            //~ LOG.setTextInputSelection(this.element, [commonStartPos, commonStartPos]);
        //~ }
    //~ } else if (event.keyCode == 38 && (!this.useTextArea || event.ctrlKey) && (!LOG.isOpera || (event.ctrlKey && event.shiftKey))) { // Up
        //~ this.element.value = this.historyManager.up(this.element.value);
        //~ LOG.stopPropagation(event);
        //~ LOG.preventDefault(event);
    //~ } else if (event.keyCode == 40 && (!this.useTextArea || event.ctrlKey) && (!LOG.isOpera || (event.ctrlKey && event.shiftKey))) { // Down
        //~ this.element.value = this.historyManager.down();
        //~ LOG.stopPropagation(event);
        //~ LOG.preventDefault(event);
    //~ } else if (event.keyCode == 13) {
        //~ if (!this.useTextArea || event.ctrlKey) {
            //~ this.historyManager.add(this.element.value);
            //~ this.evaluator.evalScriptAndPrintResults(this.element.value);
            //~ LOG.stopPropagation(event);
            //~ LOG.preventDefault(event);
            //~ if (!this.useTextArea) {
                //~ this.element.value = '';
            //~ }
        //~ } else if (this.useTextArea) { // We keep indentation in enters
            //~ function getLineFromLeft(value, pos) {
                //~ var chr, line = '';
                //~ while (pos >= 0) {
                    //~ chr = value.charAt(pos);
                    //~ if (chr == '\n' || chr == '\r') {
                        //~ break;
                    //~ }
                    //~ line = chr + line;
                    //~ --pos;
                //~ }
                //~ return line;
            //~ }
            //~ function getIndentation(line) {
                //~ var chr;
                //~ var indentation = '';
                //~ for (var i = 0; i < line.length; ++i) {
                    //~ chr = line.charAt(i);
                    //~ if (chr != ' ' && chr != '\t') {
                        //~ break;
                    //~ }
                    //~ indentation += chr;
                //~ }
                //~ return indentation;
            //~ }
            //~ var pos = LOG.getTextInputSelection(this.element)[0];
            //~ var indentation = getIndentation(getLineFromLeft(this.element.value, pos - 1));
            //~ this.element.value = this.element.value.substring(0, pos) + '\n' + indentation + this.element.value.substring(pos);
            //~ pos += indentation.length + 1;
            //~ LOG.setTextInputSelection(this.element, [pos, pos]);
            //~ LOG.stopPropagation(event);
            //~ LOG.preventDefault(event);
        //~ }
    //~ }
//~ }

//~ LOG.CommandInput.prototype.writeStringToInput = function(str) {
    //~ var currentWordAndPosition = this.getCurrentWordAndPosition();
    //~ this.element.value = this.element.value.substr(0, currentWordAndPosition.end) + str +
        //~ this.element.value.substr(currentWordAndPosition.end)
    //~ ;
    //~ var endPos = currentWordAndPosition.end + str.length;
    //~ LOG.setTextInputSelection(this.element, [endPos, endPos]);
    //~ this.element.focus();
//~ }

//~ LOG.CommandInput.prototype.getNamesStartingWith = function(start, names) {
    //~ var matches = [];
    //~ for (var i = 0; i < names.length; ++i) {
        //~ if (names[i].substr(0, start.length) == start) {
            //~ matches.push(names[i]);
        //~ }
    //~ }
    //~ matches.sort();
    //~ return matches;
//~ }

//~ LOG.CommandInput.prototype.focus = function() {
    //~ this.element.focus();
//~ }
//~ // END CommandInput.js
//~ // BEGIN CommandEditor.js
//~ LOG.CommandEditor = function(doc, evalCallback, resizeCallback, historyManager) {
    //~ this.doc = doc;
    //~ this.evalCallback = evalCallback;
    //~ this.resizeCallback = resizeCallback;
    //~ this.historyManager = historyManager;
    
    //~ this.element = LOG.createElement(this.doc, 'div',
        //~ {
            //~ style: {
                //~ height: '100%',
                //~ backgroundColor: 'white',
                //~ padding: '1px'
            //~ }
        //~ },
        //~ [
            //~ this.inputTable = LOG.createElement(this.doc, 'table',
                //~ {
                    //~ style: {
                        //~ height: '100%',
                        //~ borderSpacing: 0
                    //~ }
                //~ },
                //~ [
                    //~ LOG.createElement(this.doc, 'tbody', {},
                        //~ [
                            //~ LOG.createElement(this.doc, 'tr', {},
                                //~ [
                                    //~ LOG.createElement(this.doc, 'td', {
                                            //~ style: {
                                                //~ width: '10px',
                                                //~ verticalAlign: 'top',
                                                //~ paddingTop: '3px'
                                            //~ }
                                        //~ },
                                        //~ [ '>>>' ]
                                    //~ ),
                                    //~ this.inputTd = LOG.createElement(this.doc, 'td', {
                                            //~ style: {
                                                //~ width: '100%',
                                                //~ verticalAlign: 'bottom',
                                                //~ paddingBottom: '4px'
                                            //~ }
                                        //~ }
                                    //~ ),
                                    //~ this.toggleTextAreaTd = LOG.createElement(this.doc, 'td',
                                        //~ {
                                            //~ style: {
                                                //~ width: '10px',
                                                //~ verticalAlign: 'bottom',
                                                //~ paddingBottom: '4px'
                                            //~ }
                                        //~ },
                                        //~ [
                                            //~ this.toggleTextAreaLink = LOG.createElement(this.doc, 'a',
                                                //~ {
                                                    //~ href: '#',
                                                    //~ style: {
                                                        //~ fontWeight: 'normal',
                                                        //~ fontSize: '12px',
                                                        //~ textDecoration: 'none'
                                                    //~ },
                                                    //~ onclick: LOG.createEventHandler(this.doc, this, 'onToggleTextAreaClick')
                                                //~ },
                                                //~ [ '[big]' ]
                                            //~ )
                                        //~ ]
                                    //~ )
                                //~ ]
                            //~ )
                        //~ ]
                    //~ )
                //~ ]
            //~ )
        //~ ]
    //~ );
    //~ this.setIsBig(false, true);
//~ }

//~ LOG.setTypeName(LOG.CommandEditor, 'LOG.CommandEditor');

//~ LOG.CommandEditor.prototype.setHeight = function(height, dontNotifyParent) {
    //~ this.height = height;
    //~ if (!dontNotifyParent) {
        //~ this.resizeCallback();
    //~ }
//~ }

//~ LOG.CommandEditor.prototype.getHeight = function() {
    //~ return this.height;
//~ }

//~ LOG.CommandEditor.prototype.setIsBig = function(isBig, dontNotifyParent) {
    //~ this.textAreaBig = isBig;
    //~ if (this.commandInput) {
        //~ this.commandInput.element.parentNode.removeChild(this.commandInput.element);
    //~ }
    //~ this.commandInput = new LOG.CommandInput(this.doc, this.textAreaBig, this.evalCallback, this.historyManager);
    //~ this.inputTd.appendChild(this.commandInput.element);
    
    //~ if (this.textAreaBig) {
        //~ this.setHeight(4, dontNotifyParent);
        //~ this.toggleTextAreaLink.firstChild.data = '[sml]';
    //~ } else {
        //~ this.setHeight(1.5, dontNotifyParent);
        //~ this.toggleTextAreaLink.firstChild.data = '[big]';
    //~ }
//~ }

//~ LOG.CommandEditor.prototype.onToggleTextAreaClick = function(event) {
    //~ this.setIsBig(!this.textAreaBig);
    //~ LOG.stopPropagation(event);
    //~ LOG.preventDefault(event);
//~ }

//~ LOG.CommandEditor.prototype.focus = function() {
    //~ this.commandInput.focus();
//~ }// END CommandEditor.js
//~ // BEGIN Evaluator.js
//~ LOG.Evaluator = function(logger) {
    //~ this.logger = logger;
//~ }

//~ LOG.setTypeName(LOG.Evaluator, 'LOG.Evaluator');

//~ LOG.Evaluator.prototype.evalScriptAndPrintResults = function($script) {
    //~ var result = this.evalScript($script);
    //~ if (result !== LOG.dontLogResult) {
        //~ if ($script.indexOf('\n') == -1) {
            //~ this.logger.log(result, $script, true);
        //~ } else {
            //~ this.logger.log(result, $script.substr(0, $script.indexOf('\n')) + '...', true);
        //~ }
    //~ }
//~ }

//~ LOG.Evaluator.prototype.evaluate = function(code, additionalVariables) {
    //~ for (var name in additionalVariables) {
        //~ eval("var " + name + " = additionalVariables['" + name + "'];");
    //~ }
    //~ return eval(code);
//~ }

//~ LOG.Evaluator.prototype.evalScript = function($script) {
    //~ var me = this;
    //~ if ($script == 'help') {
        //~ this.logger.logText(
            //~ '\n$0, $1 ... $n: clicked element' +
            //~ '\n$E(element): createOutlineFromElement' +
            //~ '\n$S(object, title): logObjectSource' +
            //~ '\n$P(object): getObjectProperties',
            //~ 'Help'
        //~ );
        //~ return LOG.dontLogResult;
    //~ }
    //~ try {
        //~ var vars = {
            //~ '$P': LOG.getObjectProperties,
            //~ '$S': function(object, title) { return me.logger.logObjectSource(object, title) }
        //~ };
        //~ for (var i = 0; i < LOG.clickedMessages.length; ++i) {
           //~ vars['$' + i] = LOG.clickedMessages[i];
        //~ }
        //~ return this.evaluate($script, vars);
    //~ } catch (e) {
        //~ this.logger.logException(e, 'error ' + $script);
        //~ return LOG.dontLogResult;
    //~ }
//~ }// END Evaluator.js
//~ // BEGIN Console.js
//~ LOG.Console = function(doc) {
    //~ this.maxCount = 1000;
    //~ this.append = true;
    //~ this.stopDebugging = false;
    //~ this.n = 0;
    //~ this.doc = doc;
    //~ this.stackedMode = true;
    //~ this.count = 0;
    //~ this.element = LOG.createElement(doc, 'div');
//~ }

//~ LOG.setTypeName(LOG.Console, 'LOG.Console');

//~ LOG.Console.prototype.getWindow = function() {
    //~ if (this.window) {
        //~ return this.window;
    //~ } else {
        //~ return window;
    //~ }
//~ }

//~ LOG.Console.prototype.appendRow = function(messageHtmlFragment, title, newLineAfterTitle, titleColor) {
    //~ var newRow = this.doc.createElement('div');
    //~ if (this.stopDebugging) {
        //~ return;
    //~ }
    //~ if (this.count >= this.maxCount) {
        //~ if (!this.append) {
            //~ this.element.removeChild(this.element.lastChild);
        //~ } else {
            //~ this.element.removeChild(this.element.firstChild);
        //~ }
    //~ } else {
        //~ this.count++;
    //~ }
    //~ this.n++;
    //~ newRow.style.fontFamily = 'terminus, monospace';
    //~ newRow.style.color = 'black';
    //~ newRow.style.borderBottom = '1px solid #aaaaaa';
    //~ if (LOG.isGecko) {
        //~ newRow.style.whiteSpace = '-moz-pre-wrap';
    //~ } else {
        //~ newRow.style.whiteSpace = 'pre'; // FIXME: doesn't seem to work in IE
    //~ }
    //~ newRow.style.padding = '2px';
    //~ if (this.count & 1) {
        //~ newRow.style.backgroundColor = '#faffff';
    //~ } else {
        //~ newRow.style.backgroundColor = '#fff3f2';
    //~ }
    //~ var em = this.doc.createElement('em');
    //~ em.appendChild(this.doc.createTextNode(this.n));
    //~ newRow.appendChild(em);
    //~ newRow.appendChild(this.doc.createTextNode(': '));
    
    //~ if (title) {
        //~ var strong = this.doc.createElement('strong');
        //~ if (titleColor) {
            //~ strong.style.color = titleColor;
        //~ }
        //~ strong.appendChild(this.doc.createTextNode(title + ': ' + (newLineAfterTitle ? '\n' : '')));
        //~ newRow.appendChild(strong);
    //~ }
    //~ newRow.appendChild(messageHtmlFragment);
    //~ if (!this.append) {
        //~ this.element.insertBefore(newRow, this.element.firstChild);
    //~ } else {
        //~ this.element.appendChild(newRow);
        //~ this.element.parentNode.scrollTop = this.element.parentNode.scrollHeight - this.element.parentNode.offsetHeight + 1;
    //~ }
//~ }

//~ LOG.Console.prototype.clear = function() {
    //~ this.count = 0;
    //~ while (this.element.childNodes.length > 0) {
        //~ this.element.removeChild(this.element.firstChild);
    //~ }
//~ }

//~ LOG.Console.prototype.focus = function() {
    //~ this.commandEditor.focus();
//~ }

//~ LOG.Console.prototype.newLogItem = function(type, params) {
    //~ var doc = this.doc;
    //~ function subtype() {
        //~ type.apply(this, [doc].concat(params));
    //~ }
    //~ subtype.prototype = type.prototype;
    //~ var obj = new subtype;
    //~ return obj;
//~ }
//~ // END Console.js
//~ // BEGIN logItem.js
//~ LOG.getGetPositionInVariablesElement = function(doc, value) {
    //~ var positionInVariables = LOG.indexOf(LOG.clickedMessages, value);
    //~ if (positionInVariables == -1) {
        //~ return null;
    //~ }
    //~ return LOG.createElement(doc, 'a',
        //~ {
            //~ style: {
                //~ fontSize: '7pt',
                //~ color: '#66a'
            //~ },
            //~ onclick: function(event) {
                //~ if (!event) {
                    //~ event = doc.parentWindow.event;
                //~ }
                //~ LOG.logger.commandEditor.commandInput.writeStringToInput('$' + positionInVariables);
                //~ LOG.stopPropagation(event);
                //~ LOG.preventDefault(event);
            //~ }
        //~ },
        //~ [
            //~ '$' + positionInVariables
        //~ ]
    //~ );
//~ }

//~ LOG.getValueAsHtmlElement = function(doc, value, stackedMode, alreadyLoggedContainers, showFirstLevelObjectChildren, showExpandObjectChildren) {
    //~ return LOG.getValueAsLogItem(doc, value, stackedMode, alreadyLoggedContainers, showFirstLevelObjectChildren, showExpandObjectChildren).element;
//~ }

//~ LOG.getExtraInfoToLogAsHtmlElement = function(doc, value, stackedMode, alreadyLoggedContainers) {
    //~ if (!value || !value.getExtraInfoToLog) {
        //~ return null;
    //~ }
    //~ var extraInfoToLog = value.getExtraInfoToLog();
    //~ var element = LOG.createElement(doc, 'span', {});
    //~ for (var item in extraInfoToLog) {
        //~ if (typeof extraInfoToLog[item] == 'function') {
            //~ element.appendChild(doc.createTextNode(' '));
            //~ var link = LOG.createElement(doc, 'a',
                //~ {
                    //~ style: {
                        //~ textDecoration: 'none',
                        //~ color: 'green',
                        //~ fontSize: '8pt'
                    //~ },
                    //~ href: '#',
                    //~ onclick: (function(item) {
                        //~ return function(event) {
                            //~ if (!event) {
                                //~ event = doc.parentWindow.event;
                            //~ }
                            //~ Log(extraInfoToLog[item].call(value));
                            //~ LOG.stopPropagation(event);
                            //~ LOG.preventDefault(event);
                        //~ }
                    //~ })(item)
                //~ },
                //~ [
                    //~ item
                //~ ]
            //~ )
            //~ element.appendChild(link);
        //~ } else {
            //~ var span = LOG.createElement(doc, 'span',
                //~ {
                    //~ style: {
                        //~ color: '#039',
                        //~ fontSize: '8pt'
                    //~ }
                //~ },
                //~ [' ' + item + ': ']
            //~ );
            //~ element.appendChild(span);
            //~ element.appendChild(LOG.getValueAsHtmlElement(doc, extraInfoToLog[item], stackedMode, alreadyLoggedContainers));
        //~ }
    //~ }
    //~ return element;
//~ }


//~ LOG.instanceOfDocument = function(value) {
    //~ if (LOG.isIE) {
        //~ return value.nodeType == 9;
    //~ } else {
        //~ return value instanceof Document;
    //~ }
//~ }

//~ LOG.instanceOfHTMLDocument = function(value) {
    //~ return LOG.instanceOfDocument(value) && document.body;
//~ }

//~ LOG.instanceOfWindow = function(value) {
    //~ return value.self == value && value == value.window;
//~ }


//~ LOG.getValueAsLogItem = function(doc, value, stackedMode, alreadyLoggedContainers, showFirstLevelObjectChildren, showExpandObjectChildren) {
    //~ // Simple object (used as hash tables), array, html element and typed objects are special (since they are implemented as separate objects) and should be handled separately
    //~ if (!alreadyLoggedContainers) {
        //~ alreadyLoggedContainers = [];
    //~ }
    
    //~ if (value instanceof Object && LOG.indexOf(alreadyLoggedContainers, value) != -1) {
        //~ return new LOG.RefLogItem(doc, value, stackedMode, alreadyLoggedContainers);
    //~ } else {
        //~ if (value && value.createLogItem) {
            //~ return value.createLogItem(doc, stackedMode, alreadyLoggedContainers, showFirstLevelObjectChildren, showExpandObjectChildren);
        //~ } else if (value != null && typeof value == 'object') {
            //~ if (LOG.instanceOfWindow(value) || LOG.instanceOfDocument(value) || value instanceof Date || value.getTypeName) {
                //~ return new LOG.TypedObjectLogItem(doc, value, stackedMode, alreadyLoggedContainers);
            //~ } else if (
                //~ value instanceof Array ||
                //~ typeof value.length != 'undefined' && (
                    //~ value.item || // DOM collections
                    //~ value.slice && value.pop && value.push // Arrays from other windows (in konq all arrays which are logged)
                //~ )
            //~ ) {
                //~ return new LOG.ArrayLogItem(doc, value, stackedMode, alreadyLoggedContainers);
            //~ } else if (value.nodeType) { // DOM node
                //~ if (value.nodeType == 1) { // 1: element node
                    //~ return new LOG.HTMLElementLogItem(doc, value, stackedMode, alreadyLoggedContainers);
                //~ } else {
                    //~ return new LOG.BasicLogItem(doc, value, stackedMode, alreadyLoggedContainers);
                //~ }
            //~ } else if (value.constructor != Object) {
                //~ return new LOG.TypedObjectLogItem(doc, value, stackedMode, alreadyLoggedContainers);
            //~ } else {
                //~ return new LOG.ObjectLogItem(doc, value, stackedMode, alreadyLoggedContainers, showFirstLevelObjectChildren, showExpandObjectChildren);
            //~ }
        //~ } else if (typeof value == 'function') {
            //~ return new LOG.FunctionLogItem(doc, value, stackedMode, alreadyLoggedContainers);
        //~ } else {
            //~ return new LOG.BasicLogItem(doc, value, stackedMode, alreadyLoggedContainers);
        //~ }
    //~ }
//~ }
//~ // END logItem.js
//~ // BEGIN LogPanel.js
//~ LOG.LogPanel = function(doc, name, selected, content) {
    //~ this.labelElement = LOG.createElement(doc, 'span',
        //~ {
            //~ style: {
                //~ cursor: 'pointer'
            //~ },
            //~ onclick: LOG.createEventHandler(doc, this, 'onLabelClick')
        //~ },
        //~ [ name ]
    //~ );
    
    //~ this.panelElement = LOG.createElement(doc, 'td',
        //~ {
            //~ style: {
                //~ width: '1%',
                //~ height: '100%',
                //~ borderLeft: '1px solid gray',
                //~ display: selected ? '' : 'none'
            //~ }
        //~ },
        //~ [
            //~ LOG.createElement(doc, 'div',
                //~ {
                    //~ style: {
                        //~ height: '100%',
                        //~ width: '100%',
                        //~ position: 'relative'
                    //~ }
                //~ },
                //~ [
                    //~ this.contentElementContainer = LOG.createElement(doc, 'div',
                        //~ {
                            //~ style: {
                                //~ left: '0',
                                //~ top: '0',
                                //~ width: '100%',
                                //~ height: '100%',
                                //~ overflow: 'auto',
                                //~ position: 'absolute',
                                //~ borderTop: '1px solid #ccc',
                                //~ borderBottom: '1px solid #ccc',
                                //~ backgroundColor: 'white',
                                //~ padding: '5px',
                                //~ fontWeight: 'normal',
                                //~ backgroundColor: '#fcfcfc',
                                //~ MozBoxSizing: 'border-box',
                                //~ boxSizing: 'border-box',
                                //~ fontFamily: 'terminus, lucida console, monospace'
                            //~ }
                        //~ }
                    //~ )
                //~ ]
            //~ )
        //~ ]
    //~ );
    
    //~ this.setSelected(selected);
    //~ if (content) {
        //~ this.setContent(content);
    //~ }
//~ }

//~ LOG.setTypeName(LOG.LogPanel, 'LOG.LogPanel');

//~ LOG.LogPanel.prototype.setWidth = function(width) {
    //~ this.panelElement.style.width = width;
//~ }

//~ LOG.LogPanel.prototype.setContent = function(content) {
    //~ if (this.contentElementContainer.firstChild) {
        //~ this.contentElementContainer.removeChild(this.contentElementContainer.firstChild);
    //~ }
    //~ this.content = content;
    //~ if (this.content) {
        //~ this.contentElementContainer.appendChild(content.element);
        //~ if (this.content.setSelected) {
            //~ this.content.setSelected(this.selected);
        //~ }
    //~ }
//~ }

//~ LOG.LogPanel.prototype.onLabelClick = function(event) {
    //~ if (this.onlabelclick && this.onlabelclick(!this.selected)) {
        //~ return;
    //~ }
    //~ this.setSelected(!this.selected);
//~ }

//~ LOG.LogPanel.prototype.getSelected = function() {
    //~ return this.selected;
//~ }

//~ LOG.LogPanel.prototype.setSelected = function(selected) {
    //~ if (selected) {
        //~ this.labelElement.style.textDecoration = 'underline';
        //~ this.labelElement.style.fontWeight = 'bold';
        //~ this.panelElement.style.display = '';
        //~ if (this.onselect) {
            //~ this.onselect();
        //~ }
        //~ this.setChanged(false);
    //~ } else {
        //~ this.labelElement.style.textDecoration = '';
        //~ this.labelElement.style.fontWeight = '';
        //~ this.panelElement.style.display = 'none';
    //~ }
    //~ this.selected = selected;
    //~ if (this.content && this.content.setSelected) {
        //~ this.content.setSelected(selected);
    //~ }
    //~ if (this.onselectchange) {
        //~ this.onselectchange(selected);
    //~ }
//~ }

//~ LOG.LogPanel.prototype.setChanged = function(changed) {
    //~ this.labelElement.style.color = changed ? 'red' : '';
//~ }


//~ LOG.LogPanel.prototype.scrollElementIntoView = function(element) {
    //~ var containerPos = LOG.getPosition(this.panelElement);
    //~ var elementPos = LOG.getPosition(element);
    //~ var containerY0 = containerPos.y;
    //~ var containerY1 = containerY0 + this.panelElement.offsetHeight;
    //~ var y0 = elementPos.y;
    //~ var y1 = y0 + element.offsetHeight;
    //~ if (y0 < containerY0 || y1 > containerY1) {
        //~ var scrollToTop = y0 + this.contentElementContainer.scrollTop - containerY0;
        //~ var scrollToCenter = scrollToTop - this.panelElement.offsetHeight / 2 - element.offsetHeight / 2;
        //~ if (scrollToCenter < 0) {
            //~ scrollToCenter = 0;
        //~ }
        //~ this.contentElementContainer.scrollTop = scrollToCenter;
    //~ }
    //~ var containerX0 = containerPos.x;
    //~ var containerX1 = containerX0 + this.panelElement.offsetWidth;
    //~ var x0 = elementPos.x;
    //~ var x1 = x0 + element.offsetWidth;
    //~ if (x0 < containerX0 || x1 > containerX1) {
        //~ this.contentElementContainer.scrollLeft = x0 + this.contentElementContainer.scrollLeft - containerX0;
    //~ }
//~ }

//~ // END LogPanel.js
//~ // BEGIN PanelManager.js
//~ LOG.PanelManager = function(doc, rightToolbarElement) {
    //~ this.doc = doc;
    //~ this.box = new LOG.Vbox(doc);
    //~ this.element = this.box.element;
    //~ this.panels = [];
    //~ this.scrollContainer = LOG.createElement(this.doc, 'div',
        //~ {
            //~ style: {
                //~ width: '100%',
                //~ height: '100%'
            //~ }
        //~ },
        //~ [
            //~ LOG.createElement(this.doc, 'table',
                //~ {
                    //~ style: {
                        //~ width: '100%',
                        //~ height: '100%'
                    //~ },
                    //~ cellPadding: '0',
                    //~ cellSpacing: '0'
                //~ },
                //~ [
                    //~ LOG.createElement(this.doc, 'tbody', {},
                        //~ [
                            //~ this.panelElements = LOG.createElement(this.doc, 'tr')
                        //~ ]
                    //~ )
                //~ ]
            //~ )
        //~ ]
    //~ );
    //~ this.toolbarContainer = LOG.createElement(this.doc, 'div', // toolbar container
        //~ {
            //~ style: {
                //~ fontFamily: 'terminus, lucida console, monospace',
                //~ backgroundColor: '#f0f0f0',
                //~ height: '100%'
            //~ }
        //~ },
        //~ [
            //~ LOG.createElement(this.doc, 'div', // toolbar
                //~ {
                    //~ style: {
                        //~ padding: '0.1em',
                        //~ width: '100%'
                    //~ }
                //~ },
                //~ [
                    //~ LOG.createElement(this.doc, 'span', { style: { cssFloat: 'right', styleFloat: 'right' } }, [ rightToolbarElement ]),
                    //~ this.panelLabels = LOG.createElement(this.doc, 'span')
                //~ ]
            //~ )
        //~ ]
    //~ );
    
    //~ this.box.add(this.toolbarContainer, { size: 1.3, sizeUnit: 'em' });
    //~ this.box.add(this.scrollContainer, { size: 100, sizeUnit: '%' });
//~ }

//~ LOG.setTypeName(LOG.PanelManager, 'LOG.PanelManager');

//~ LOG.PanelManager.prototype.setBodyHidden = function(hidden) {
    //~ this.box.setChildHidden(1, hidden);
//~ }

//~ LOG.PanelManager.prototype.onPanelSelectChange = function(logPanel, selected) {
    //~ var visiblePanels = 0;
    //~ for (var i = 0; i < this.panels.length; ++i) {
        //~ if (this.panels[i].getSelected()) {
            //~ ++visiblePanels;
        //~ }
    //~ }
    //~ for (var i = 0; i < this.panels.length; ++i) {
        //~ if (this.panels[i].getSelected()) {
            //~ this.panels[i].setWidth((100 / visiblePanels) + '%');
        //~ }
    //~ }
//~ }

//~ LOG.PanelManager.prototype.onPanelLabelClick = function(logPanel, selected) {
    //~ if (this.onpanellabelclick) {
        //~ return this.onpanellabelclick(logPanel, selected);
    //~ }
//~ }

//~ LOG.PanelManager.prototype.add = function(logPanel) {
    //~ if (this.panelLabels.childNodes.length > 0) {
        //~ this.panelLabels.appendChild(this.doc.createTextNode(' '));
    //~ }
    //~ var me = this;
    //~ logPanel.onlabelclick = function(selected) { return me.onPanelLabelClick(logPanel, selected); }
    //~ logPanel.onselectchange = function(selected) { return me.onPanelSelectChange(logPanel, selected); }
    //~ this.panelLabels.appendChild(logPanel.labelElement);
    //~ this.panelElements.appendChild(logPanel.panelElement);
    //~ this.panels.push(logPanel);
    //~ return logPanel;
//~ }
//~ // END PanelManager.js
//~ // BEGIN Logger.js
//~ LOG.Logger = function(doc, inNewWindow, historyManager, openSectionsStr) {
    //~ this.doc = doc;
    //~ this.panels = {};
    //~ this.box = new LOG.Vbox(doc);
    //~ this.panelManager = new LOG.PanelManager(doc,
        //~ LOG.createElement(doc, 'span', {},
            //~ [
                //~ LOG.createElement(doc, 'a',
                    //~ {
                        //~ href: '#',
                        //~ style: {
                            //~ fontWeight: 'normal'
                        //~ },
                        //~ title: 'ctrl-shift-c: clear visible panels',
                        //~ onclick: LOG.createEventHandler(doc, this, 'onClearClick')
                    //~ },
                    //~ [
                        //~ LOG.createElement(doc, 'span',
                            //~ { style: { fontWeight: 'bold' } },
                            //~ [ 'c' ]
                        //~ ),
                        //~ 'lr'
                    //~ ]
                //~ ),
                //~ ' ',
                //~ LOG.createElement(doc, 'a',
                    //~ {
                        //~ href: '#',
                        //~ style: {
                            //~ fontWeight: 'normal'
                        //~ },
                        //~ title: 'ctrl-shift-t: attach / detach window',
                        //~ onclick: LOG.createEventHandler(doc, this, 'onNewWindowClick')
                    //~ },
                    //~ [
                        //~ this.inNewWindowAttachDetachPrefix = doc.createTextNode(inNewWindow ? 'at' : 'de'),
                        //~ LOG.createElement(doc, 'span',
                            //~ { style: { fontWeight: 'bold' } },
                            //~ [ 't' ]
                        //~ )
                    //~ ]
                //~ ),
                //~ this.collapseButton = LOG.createElement(doc, 'span',
                    //~ {
                        //~ style: { display: inNewWindow ? 'none' : '' }
                    //~ },
                    //~ [
                        //~ ' ',
                        //~ LOG.createElement(doc, 'a',
                            //~ {
                                //~ href: '#',
                                //~ style: {
                                    //~ fontWeight: 'normal'
                                //~ },
                                //~ onclick: LOG.createEventHandler(doc, this, 'onCollapseToggleClick'),
                                //~ title: 'toggle collapse'
                            //~ },
                            //~ [ '[', this.closeButtonTextNode = doc.createTextNode('x'), ']' ]
                        //~ )
                    //~ ]
                //~ )
            //~ ]
        //~ )
    //~ );
    //~ var me = this;
    //~ this.panelManager.onpanellabelclick = function(panel, selected) {
        //~ return me.onPanelLabelClick(panel, selected);
    //~ }
    //~ this.element = LOG.createElement(doc, 'div',
        //~ {
            //~ onkeydown: LOG.createEventHandler(doc, this, 'onKeyDown'),
            //~ style: {
                //~ borderTop: '1px solid gray',
                //~ height: '100%'
            //~ }
        //~ },
        //~ [
            //~ this.box.element
        //~ ]
    //~ );
    
    //~ // create the default console
    //~ var consoleSection = this.addConsoleSection('console');
    //~ consoleSection.setSelected(true);
    //~ this.defaultConsole = consoleSection.content;
    
    //~ this.evaluator = new LOG.Evaluator(this);

    //~ this.htmlSection = this.addSection('html', new LOG.HtmlSection(doc));
    //~ this.historyManager = historyManager;
    //~ this.commandEditor = new LOG.CommandEditor(doc, this.evaluator, function() { me.updateCommandEditorSize() }, this.historyManager);
    //~ this.box.add(this.panelManager.element, { size: 100, sizeUnit: '%' });
    //~ this.box.add(this.commandEditor.element, { size: this.commandEditor.getHeight(), sizeUnit: 'em' });
    //~ this.unserializeOpenSections(openSectionsStr);
//~ }

//~ LOG.setTypeName(LOG.Logger, 'LOG.Logger');

//~ LOG.Logger.prototype.onPanelLabelClick = function(panel, selected) {
    //~ if (this.collapsed) {
        //~ if (this.onexpandrequest) {
            //~ this.onexpandrequest();
        //~ }
        //~ this.setCollapsed(false);
        //~ return !selected; // We cancel (return true) if the panel would be unselected (we want to open the panel)
    //~ }
//~ }

//~ LOG.Logger.prototype.setInNewWindow = function(inNewWindow) {
    //~ this.inNewWindowAttachDetachPrefix.nodeValue = inNewWindow ? 'at' : 'de';
    //~ this.collapseButton.style.display = inNewWindow ? 'none' : '';
    //~ if (inNewWindow) {
        //~ this.setCollapsed(false);
    //~ }
//~ }

//~ LOG.Logger.prototype.unserializeOpenSections = function(str) {
    //~ if (str) {
        //~ this.panels.console.setSelected(false);
        //~ var openSections = str.split(',');
        //~ for (var i = 0; i < openSections.length; ++i) {
            //~ this.getOrAddConsoleSection(openSections[i]).setSelected(true);
        //~ }
    //~ }
//~ }

//~ LOG.Logger.prototype.serializeOpenSections = function() {
    //~ var out = '';
    //~ var panels = this.panels;
    //~ for (var sectionName in panels) {
        //~ if (panels[sectionName].selected) {
            //~ if (out) {
                //~ out += ',';
            //~ }
            //~ out += sectionName;
        //~ }
    //~ }
    //~ return out;
//~ }

//~ LOG.setTypeName(LOG.Logger, 'LOG.Logger');

//~ LOG.Logger.prototype.logText = function(text, title) {
    //~ this.defaultConsole.appendRow(this.doc.createTextNode(text), title);
//~ }

//~ LOG.Logger.prototype.logException = function(exception, title) {
    //~ var logItem = new LOG.ExceptionLogItem(this.doc, exception);
    //~ this.defaultConsole.appendRow(
        //~ logItem.element,
        //~ title,
        //~ true,
        //~ 'red'
    //~ );
//~ }

//~ LOG.Logger.prototype.logObjectSource = function(object, title) {
    //~ var logItem = new LOG.ObjectLogItem(this.doc, object, this.stackedMode);
    //~ this.defaultConsole.appendRow(logItem.element, title);
    //~ return LOG.dontLogResult;
//~ }

//~ LOG.Logger.prototype.log = function(message, title, newLineAfterTitle, sectionName, dontOpen, stackedMode) {
    //~ if (!sectionName) {
        //~ sectionName = 'console';
    //~ }
    //~ var section = this.getOrAddConsoleSection(sectionName);
    //~ section.content.appendRow(
        //~ LOG.getValueAsHtmlElement(
            //~ this.doc,
            //~ message,
            //~ stackedMode == undefined ? this.stackedMode : stackedMode,
            //~ undefined,
            //~ true,
            //~ true
        //~ ),
        //~ title,
        //~ newLineAfterTitle,
        //~ null
    //~ );
    //~ if (!dontOpen) {
        //~ section.setSelected(true);
    //~ } else if (!section.selected) {
        //~ section.setChanged(true);
    //~ }
    //~ return message;
//~ }

//~ LOG.Logger.prototype.logAndStore = function(value, source) {
    //~ var pos = LOG.indexOf(LOG.clickedMessages, value);
    //~ if (pos == -1) {
        //~ pos = LOG.clickedMessages.length;
        //~ LOG.clickedMessages[pos] = value;
    //~ }
    
    //~ if (source) {
        //~ this.logObjectSource(value, null, this.stackedMode);
    //~ } else {
        //~ this.defaultConsole.appendRow(LOG.getValueAsHtmlElement(this.doc, value, this.stackedMode, undefined, true));
    //~ }

    //~ if (this.commandEditor.commandInput.element.value == '' || this.commandEditor.commandInput.element.value.match(/^\$[0-9]+$/)) {
        //~ this.commandEditor.commandInput.element.value = '$' + pos;
    //~ }
    //~ return;
//~ }

//~ LOG.Logger.prototype.updateCommandEditorSize = function() {
    //~ this.box.setChildSize(1, this.commandEditor.getHeight(), 'em');
//~ }

//~ LOG.Logger.prototype.onNewWindowClick = function(event) {
    //~ LOG.stopPropagation(event);
    //~ LOG.preventDefault(event);
    //~ if (this.onnewwindowtoggleclick) {
        //~ this.onnewwindowtoggleclick();
    //~ }
//~ }

//~ LOG.Logger.prototype.focus = function() {
    //~ this.commandEditor.focus();
//~ }

//~ LOG.Logger.prototype.onKeyDown = function(event) {
    //~ if (event.keyCode == 27) { // Esc
        //~ if (this.onescpress) {
            //~ this.onescpress();
        //~ }
        //~ LOG.stopPropagation(event);
        //~ LOG.preventDefault(event);
    //~ } else {
        //~ var chr = String.fromCharCode(event.keyCode).toLowerCase();
        //~ if (event.altKey && event.shiftKey) {
            //~ if (chr == 'c') {
                //~ this.onClearClick(event);
            //~ }
        //~ }
    //~ }
//~ }

//~ LOG.Logger.prototype.addConsoleSection = function(sectionName) {
    //~ return this.addSection(sectionName, new LOG.Console(this.doc));
//~ }

//~ LOG.Logger.prototype.getOrAddConsoleSection = function(sectionName) {
    //~ if (this.panels[sectionName]) {
        //~ return this.panels[sectionName];
    //~ } else {
        //~ return this.addConsoleSection(sectionName);
    //~ }
//~ }

//~ LOG.Logger.prototype.getOrAddSection = function(sectionName, content) {
    //~ if (this.panels[sectionName]) {
        //~ // if content is set the old panel will have the content replaced
        //~ if (content) {
            //~ this.panels[sectionName].setContent(content);
        //~ }
        //~ return this.panels[sectionName];
    //~ } else {
        //~ return this.addSection(sectionName, content);
    //~ }
//~ }

//~ LOG.Logger.prototype.addSection = function(sectionName, content) {
    //~ var panel = new LOG.LogPanel(this.doc, sectionName, false, content);
    //~ this.panelManager.add(panel);
    //~ this.panels[sectionName] = panel;
    //~ return panel;
//~ }

//~ LOG.Logger.prototype.onClearClick = function(event) {
    //~ LOG.stopPropagation(event);
    //~ LOG.preventDefault(event);
    //~ for (var sectionName in this.panels) {
        //~ if (this.panels[sectionName].selected) {
            //~ this.panels[sectionName].setChanged(false);
            //~ if (this.panels[sectionName].content && this.panels[sectionName].content.clear) {
                //~ this.panels[sectionName].content.clear();
            //~ }
        //~ }
    //~ }
//~ }

//~ LOG.Logger.prototype.setCollapsed = function(collapsed) {
    //~ if (collapsed) {
        //~ this.box.setChildHidden(1, true);
        //~ this.panelManager.setBodyHidden(true);
        //~ this.closeButtonTextNode.nodeValue = '|';
    //~ } else {
        //~ this.box.setChildHidden(1, false);
        //~ this.panelManager.setBodyHidden(false);
        //~ this.closeButtonTextNode.nodeValue = 'x';
    //~ }
    //~ this.collapsed = collapsed;
//~ }

//~ LOG.Logger.prototype.onCollapseToggleClick = function(event) {
    //~ if (this.oncollapsetoggleclick) {
        //~ this.oncollapsetoggleclick();
    //~ }
    //~ LOG.stopPropagation(event);
    //~ LOG.preventDefault(event);
//~ }

//~ LOG.Logger.prototype.getValueAsLogItem = function(value, stackedMode, alreadyLoggedContainers, showFirstLevelObjectChildren, showExpandObjectChildren) {
    //~ return LOG.getValueAsLogItem(this.doc, value, stackedMode, alreadyLoggedContainers, showFirstLevelObjectChildren, showExpandObjectChildren);
//~ }

//~ // This searchs for some value in all the selected panels and focuses it
//~ LOG.Logger.prototype.focusValue = function(value, dontLog, dontSeparatePathBySpaces) {
    //~ for (var sectionName in this.panels) {
        //~ var section = this.panels[sectionName].content;
        //~ if (section.focusValue) {
            //~ section.focusValue(value, dontLog, this.panels[sectionName], dontSeparatePathBySpaces);
        //~ }
    //~ }
//~ }
//~ // END Logger.js
//~ // BEGIN LogRunner.js
//~ LOG.LogRunner = function() {
    //~ this.doc = document;
    //~ this.willOpenInNewWindow = false;//LOG.getCookie('LOG_IN_NEW_WINDOW') == 'true';
    //~ this.historyManager = new LOG.HistoryManager(LOG.getCookie('LOG_HISTORY'));
    //~ this.containerSavedSize = parseFloat(LOG.getCookie('LOG_SIZE'));
    //~ this.loggerSavedOpenSections = LOG.getCookie('LOG_OPEN_SECTIONS');
    //~ this.collapsed = LOG.getCookie('LOG_OPEN') != 'true';
    //~ LOG.addEventListener(document, 'keydown', LOG.createEventHandler(document, this, 'onKeyDown'), true);
    //~ LOG.addEventListener(document, 'selectstart', this.caller('onDocumentSelectStart'), true);
    //~ LOG.addEventListener(document, 'mousedown', this.caller('onMouseDown'), true);
    //~ LOG.addEventListener(document, 'mouseup', this.caller('onClick'), true);
    //~ LOG.addEventListener(document, 'click', this.caller('onClick'), true);
    //~ LOG.addEventListener(window, 'unload', this.caller('onUnload'));
    //~ this.appendLogger();
//~ }

//~ LOG.setTypeName(LOG.LogRunner, 'LOG.LogRunner');

//~ LOG.LogRunner.prototype.caller = function(methodName) {
    //~ var me = this;
    //~ return function() {
        //~ return me[methodName].apply(me, arguments);
    //~ }
//~ }


//~ LOG.LogRunner.prototype.createLogger = function(doc) {
    //~ LOG.logger = new LOG.Logger(doc, this.willOpenInNewWindow, this.historyManager, this.loggerSavedOpenSections);
    //~ LOG.logger.onnewwindowtoggleclick = this.caller('onLoggerNewWindowToggleClick');
    //~ LOG.logger.onescpress = this.caller('onLoggerEscPress');
    //~ LOG.logger.oncollapsetoggleclick = this.caller('onLoggerCollapseToggleClick');
    //~ for (var i = 0; i < LOG.pendingLogCalls.length; ++i) {
        //~ Log.apply(window, LOG.pendingLogCalls[i]);
    //~ }
    //~ LOG.pendingLogCalls = [];
    //~ LOG.logger.setCollapsed(this.collapsed);
    //~ LOG.logger.onexpandrequest = this.caller('onLoggerExpandRequest');
//~ }

//~ LOG.LogRunner.prototype.onLoggerExpandRequest = function() {
    //~ if (!this.willOpenInNewWindow) {
        //~ this.setCollapsed(this.container, false);
    //~ }
//~ }

//~ LOG.LogRunner.prototype.createWindowContainer = function(callback) {
    //~ var container;
    //~ var me = this;
    //~ try {
        //~ new LOG.LogWindow(
            //~ function (container) {
                //~ container.onkeydown = me.caller('onKeyDown');
                //~ container.onunload = me.caller('onLogWindowUnload');
                //~ callback(container);
            //~ }
        //~ );
    //~ } catch (e) {
        //~ callback(null);
    //~ }
//~ }

//~ LOG.LogRunner.prototype.createBodyWrapperContainer = function(callback) {
    //~ var me = this;
    //~ new LOG.BodyWrapper(
        //~ this.doc,
        //~ this.containerSavedSize,
        //~ this.collapsed ? '17px' : undefined,
        //~ function (container) {
            //~ container.ondragend = me.caller('onBodyWrapperDragEnd');
            //~ me.setCollapsed(container, me.collapsed);
            //~ callback(container);
        //~ }
    //~ );
//~ }

//~ LOG.LogRunner.prototype.createContainer = function(callback) {
    //~ var container;
    //~ var me = this;
    //~ if (this.willOpenInNewWindow) {
        //~ this.createWindowContainer(
            //~ function (container) {
                //~ if (container) {
                    //~ me.container = container;
                    //~ callback();
                //~ } else {
                    //~ me.willOpenInNewWindow = false;
                    //~ me.createContainer(callback);
                //~ }
            //~ }
        //~ );
    //~ } else {
        //~ this.willOpenInNewWindow = false;
        //~ if (this.container) { // there is an old window or BodyWrapper left
            //~ this.container.uninit();
            //~ delete this.container;
        //~ }
        //~ this.createBodyWrapperContainer(
            //~ function(container) {
                //~ me.container = container;
                //~ callback();
            //~ }
        //~ );
    //~ }
//~ }

//~ LOG.LogRunner.prototype.appendLoggerNow = function() {
    //~ if (this.appendLoggerNowCaller) {
        //~ LOG.removeEventListener(window, 'load', this.appendLoggerNowCaller);
        //~ delete this.appendLoggerNowCaller;
    //~ }
    //~ var me = this;
    //~ this.createContainer(
        //~ function() {
            //~ me.createLogger(me.container.doc);
            //~ me.container.appendChild(LOG.logger.element);
            //~ LOG.logger.setInNewWindow(me.willOpenInNewWindow);
            //~ // LOG.logger.focus();
        //~ }
    //~ );
//~ }

//~ LOG.LogRunner.prototype.appendLogger = function() {
    //~ if (document.body) {
        //~ this.appendLoggerNow();
    //~ } else {
        //~ if (!this.appendLoggerNowCaller) {
            //~ this.appendLoggerNowCaller = this.caller('appendLoggerNow');
        //~ }
        //~ LOG.addEventListener(window, 'load', this.appendLoggerNowCaller);
    //~ }
    //~ this.loggerAppended = true;
//~ }

//~ LOG.LogRunner.prototype.onBodyWrapperDragEnd = function() {
    //~ if (this.collapsed) {
        //~ this.setCollapsed(this.container, false);
    //~ }
//~ }

//~ LOG.LogRunner.prototype.setCollapsed = function(bodyWrapper, collapsed) {
    //~ if (collapsed) {
        //~ bodyWrapper.lock('17px');
        //~ window.focus();
    //~ } else {
        //~ bodyWrapper.unlock();
    //~ }
    //~ if (LOG.logger) {
        //~ LOG.logger.setCollapsed(collapsed);
    //~ }
    //~ this.collapsed = collapsed;
//~ }

//~ LOG.LogRunner.prototype.onLoggerCollapseToggleClick = function() {
    //~ this.setCollapsed(this.container, !this.collapsed);
//~ }

//~ LOG.LogRunner.prototype.onLoggerNewWindowToggleClick = function() {
    //~ this.deleteContainer();
    //~ if (!this.willOpenInNewWindow) { // otherwise this will be handled by onLogWindowUnload
        //~ this.willOpenInNewWindow = !this.willOpenInNewWindow;
        //~ this.appendLogger();
    //~ }
//~ }

//~ LOG.LogRunner.prototype.onLogWindowUnload = function() {
    //~ delete this.logWindow;
    //~ this.willOpenInNewWindow = false;
    //~ this.appendLogger();
//~ }

//~ LOG.LogRunner.prototype.deleteContainer = function() {
    //~ if (this.container && this.container.getSize) {
        //~ this.containerSavedSize = this.container.getSize();
    //~ }
    //~ this.container.uninit();
    //~ delete this.container;
//~ }

//~ LOG.LogRunner.prototype.onKeyDown = function(event) {
    //~ var chr = String.fromCharCode(event.keyCode).toLowerCase();
    //~ if (event.keyCode == 120) {
        //~ if (!LOG.logger) {
            //~ this.stopDebugging = false;
            //~ this.createAndAppendLogger();
        //~ }
        //~ this.showLogger();
        //~ LOG.preventDefault(event);
        //~ LOG.stopPropagation(event);
    //~ } else if (event.altKey && event.shiftKey && chr == 't') {
        //~ this.onLoggerNewWindowToggleClick(event);
        //~ LOG.preventDefault(event);
        //~ LOG.stopPropagation(event);
    //~ }
//~ }

//~ LOG.LogRunner.prototype.showLogger = function() {
    //~ if (!this.willOpenInNewWindow) {
        //~ this.setCollapsed(this.container, false);
    //~ }
    //~ this.container.show();
    //~ LOG.logger.focus();
//~ }

//~ LOG.LogRunner.prototype.hide = function() {
    //~ if (!this.willOpenInNewWindow) {
        //~ this.setCollapsed(this.container, true);
    //~ } else {
        //~ this.container.hide();
    //~ }
//~ }

//~ LOG.LogRunner.prototype.onUnload = function() {
    //~ LOG.addCookie('LOG_HISTORY', this.historyManager.serialize(), 30);
    //~ if (this.container && this.container.getSize) {
        //~ LOG.addCookie('LOG_SIZE', this.container.getSize(), 30);
    //~ } else {
        //~ LOG.addCookie('LOG_SIZE', this.containerSavedSize, 30);
    //~ }
    //~ LOG.addCookie('LOG_IN_NEW_WINDOW', this.willOpenInNewWindow ? 'true' : 'false', 30);
    //~ LOG.addCookie('LOG_OPEN', LOG.logger && (this.container && !this.container.hidden && !this.collapsed) ? "true" : "false", 30);
    //~ if (LOG.logger) {
        //~ LOG.addCookie('LOG_OPEN_SECTIONS', LOG.logger.serializeOpenSections(), 30);
    //~ }
    //~ if (LOG.isGecko) {
        //~ LOG.removeAllEventListeners();
    //~ }
//~ }

//~ LOG.LogRunner.prototype.close = function() {
    //~ if (!LOG.logger || this.stopDebugging) {
        //~ return;
    //~ }
    //~ this.deleteContainer();
    //~ this.stopDebugging = true;
//~ }

//~ LOG.LogRunner.prototype.onLoggerEscPress = function() {
    //~ this.hide();
//~ }

//~ LOG.LogRunner.prototype.onDocumentSelectStart = function() {
    //~ if (LOG.nextClickShouldBeStopped) {
        //~ LOG.preventDefault(event);
        //~ LOG.stopPropagation(event);
    //~ }
//~ }

//~ LOG.LogRunner.prototype.onMouseDown = function(event) {
    //~ if (LOG.getButtonFromEvent(event) == 'left' && event.ctrlKey && event.shiftKey) {
        //~ LOG.nextClickShouldBeStopped = true;
        //~ var element = LOG.getElementFromEvent(event);
        //~ LOG.logger.focusValue(element, undefined, event.altKey);
        //~ LOG.preventDefault(event);
        //~ LOG.stopPropagation(event);
    //~ } else if (LOG.getButtonFromEvent(event) == 'left' && event.altKey && event.ctrlKey) { // FIXME: iats dependancy, unmigrated
        //~ if (!window.Reloadable) {
            //~ return;
        //~ }
        //~ var element = LOG.getElementFromEvent(event);
        //~ var path = LOG.guessDomNodeOwnerName(LOG.getElementFromEvent(event));
        //~ if (path && path.pathToObject) {
            //~ var i = 0;
            //~ for (var i = path.pathToObject.length - 1; i >= 0; --i) {
                //~ if (path.pathToObject[i].obj instanceof window.Reloadable) { // FIXME
                    //~ LOG.openClassInEditor(path.pathToObject[i].obj);
                    //~ break;
                //~ }
            //~ }
        //~ }
        //~ LOG.preventDefault(event);
        //~ LOG.stopPropagation(event);
        //~ LOG.nextClickShouldBeStopped = true;
    //~ } else {
        //~ LOG.nextClickShouldBeStopped = false;
    //~ }
//~ }

//~ LOG.LogRunner.prototype.onClick = function(event) {
    //~ if (LOG.nextClickShouldBeStopped) {
        //~ LOG.preventDefault(event);
        //~ LOG.stopPropagation(event);
    //~ }
//~ }

//~ LOG.LogRunner.prototype.getBody = function() {
    //~ if (this.container && this.container.getBody) {
        //~ return this.container.getBody();
    //~ } else {
        //~ return document.body;
    //~ }
//~ }

//~ LOG.LogRunner.prototype.getParentNodeHidingContainer = function(node) {
    //~ if (this.container.getParentNodeHidingMe) {
        //~ return this.container.getParentNodeHidingMe(node);
    //~ } else {
        //~ return node.parentNode;
    //~ }
//~ }

//~ LOG.LogRunner.prototype.getChildNodesHidingContainer = function(node) {
    //~ if (this.container.getChildNodesHidingMe) {
        //~ return this.container.getChildNodesHidingMe(node);
    //~ } else {
        //~ return node.childNodes;
    //~ }
//~ }
//~ // END LogRunner.js
//~ // BEGIN Box.js
//~ LOG.AbstractBox = function() {
//~ }

//~ LOG.setTypeName(LOG.AbstractBox, 'LOG.AbstractBox');

//~ LOG.AbstractBox.prototype.init = function(doc) {
    //~ this.doc = doc;
    //~ this.element = LOG.createElement(
        //~ doc,
        //~ 'div',
        //~ {
            //~ style: {
                //~ position: 'relative',
                //~ overflow: 'hidden',
                //~ height: '100%',
                //~ width: '100%'
            //~ }
        //~ }
    //~ );
    //~ this.sizes = [];
//~ }

//~ LOG.AbstractBox.prototype.getFixedSize = function() {
    //~ var totalFixedSize = 0, fixedSizeUnit, unitName, item;
    //~ for (var i = 0; i < this.sizes.length; ++i) {
        //~ item = this.sizes[i];
        //~ if (item.hidden) {
            //~ continue;
        //~ }
        //~ unitName = item.sizeUnit; 
        //~ if (unitName != '%') {
            //~ if (!fixedSizeUnit) {
                //~ fixedSizeUnit = unitName;
            //~ } else if (fixedSizeUnit != unitName) {
                //~ throw "Inconsistent units (all non percentage units should be of the same type)";
            //~ }
            //~ totalFixedSize += item.size;
        //~ }
    //~ }
    //~ return { size: totalFixedSize, name: fixedSizeUnit };
//~ }

//~ LOG.AbstractBox.prototype.updateSizes = function() {
    //~ function setStyle(element, property, value) {
        //~ element.style[property] = value;
    //~ }
    
    //~ var fixedSize = this.getFixedSize();
    //~ var item, node, marginSize;
    //~ for (var i = 0; i < this.sizes.length; ++i) {
        //~ item = this.sizes[i];
        //~ node = this.element.childNodes[i];
        //~ setStyle(node, this.sizeProperty.toLowerCase(), item.size + item.sizeUnit);
        //~ if (item.sizeUnit == '%') {
            //~ marginSize = fixedSize.size * item.size / 100;
            //~ var margin = marginSize + (fixedSize.name ? fixedSize.name : '');
            //~ setStyle(node, 'margin' + this.reservedSpacePosition, '-' + margin);
            //~ setStyle(node, 'padding' + this.reservedSpacePosition, margin);
        //~ }
    //~ }
//~ }

//~ LOG.AbstractBox.prototype.setChildSize = function(childNumber, size, sizeUnit) {
    //~ this.sizes[childNumber].size = size;
    //~ this.sizes[childNumber].sizeUnit = sizeUnit;
    //~ this.updateSizes();
//~ }

//~ LOG.AbstractBox.prototype.setChildHidden = function(childNumber, hidden) {
    //~ this.sizes[childNumber].hidden = hidden;
    //~ this.sizes[childNumber].element.style.display = hidden ? 'none': '';
    //~ this.updateSizes();
//~ }

//~ LOG.AbstractBox.prototype.getChildSize = function(childNumber) {
    //~ return this.sizes[childNumber];
//~ }

//~ LOG.AbstractBox.prototype.add = function(element, size) { //  size: { size, sizeUnit: %|px|em }
    //~ var sizeElement;
    //~ this.element.appendChild(
        //~ sizeElement = LOG.createElement(
            //~ this.doc, 'div',
            //~ { // opera 9.25 doesn't understand border-box if set as as an attribute of .style
                //~ style: 'position: relative; -moz-box-sizing: border-box; box-sizing: border-box'
            //~ },
            //~ [
            
                //~ LOG.createElement(
                    //~ this.doc, 'div',
                    //~ {
                        //~ style: {
                            //~ height: '100%',
                            //~ overflow: 'hidden'
                        //~ }
                    //~ },
                    //~ [
                        //~ element
                    //~ ]
                //~ )
            //~ ]
        //~ )
    //~ );
    //~ size.element = sizeElement;
    //~ this.sizes.push(size);
    //~ this.updateSizes();
//~ }

//~ LOG.Hbox = function(doc) {
    //~ this.init(doc);
//~ }

//~ LOG.setTypeName(LOG.Hbox, 'LOG.Hbox');

//~ LOG.Hbox.prototype = new LOG.AbstractBox;
//~ LOG.Hbox.prototype.sizeProperty = 'width';
//~ LOG.Hbox.prototype.reservedSpacePosition = 'Right';


//~ LOG.Vbox = function(doc) {
    //~ this.init(doc);
//~ }

//~ LOG.setTypeName(LOG.Vbox, 'LOG.Vbox');

//~ LOG.Vbox.prototype = new LOG.AbstractBox;
//~ LOG.Vbox.prototype.sizeProperty = 'height';
//~ LOG.Vbox.prototype.reservedSpacePosition = 'Bottom';
//~ // END Box.js
//~ // BEGIN SingleLogItemSection.js
//~ LOG.SingleLogItemSection = function(doc, logItem, objectName) {
    //~ this.doc = doc;
    //~ this.element = LOG.createElement(this.doc, 'div', {}, [ logItem.element ]);
    //~ this.logItem = logItem;
    //~ this.objectName = objectName;
//~ }

//~ LOG.setTypeName(LOG.SingleLogItemSection, 'LOG.SingleLogItemSection');

//~ LOG.SingleLogItemSection.prototype.setSelected = function(isSelected) {
    //~ this.selected = isSelected;
//~ }

//~ LOG.SingleLogItemSection.prototype.getSelected = function() {
    //~ return this.selected;
//~ }

//~ LOG.SingleLogItemSection.prototype.focusValue = function(value, dontLog, panel, dontSeparateBySpaces) {
    //~ if (!this.objectName) {
        //~ return;
    //~ }
    //~ var path = LOG.guessDomNodeOwnerName(value, [ { obj: this.logItem.value, name: this.objectName, parent: null } ]);
    //~ if (!dontLog) {
        //~ // Log the path into the console panel
        //~ var logItem = new LOG.PathToObjectLogItem(this.doc, path, dontSeparateBySpaces);
        //~ LOG.logger.defaultConsole.appendRow(logItem.element);
    //~ }
    //~ if (path && this.selected) {
        //~ if (this.logItem.value == path.pathToObject[0].obj) {
            //~ path.pathToObject.shift(); // remove the 'page' part
            //~ if (path.pathToObject.length == 0) {
                //~ panel.scrollElementIntoView(this.logItem.element);
                //~ LOG.blinkElement(this.logItem.element);
            //~ } else {
                //~ var propertyLogItem = this.logItem.expandProperty(path.pathToObject);
                //~ panel.scrollElementIntoView(propertyLogItem.element);
                //~ LOG.blinkElement(propertyLogItem.element);
            //~ }
        //~ }
    //~ }
//~ }
//~ // END SingleLogItemSection.js
//~ // BEGIN HtmlSection.js
//~ LOG.HtmlSection = function(doc) {
    //~ this.doc = doc;
    //~ this.logItem = new LOG.HTMLElementLogItem(this.doc, document.getElementsByTagName('html')[0], false, [], true);
    //~ this.element = LOG.createElement(this.doc, 'div', {}, [ this.logItem.element ]);
//~ }

//~ LOG.setTypeName(LOG.HtmlSection, 'LOG.HtmlSection');

//~ LOG.HtmlSection.prototype.setSelected = function(isSelected) {
    //~ this.selected = isSelected;
//~ }

//~ LOG.HtmlSection.prototype.getSelected = function() {
    //~ return this.selected;
//~ }

//~ LOG.HtmlSection.prototype.focusValue = function(value, dontLog, panel, dontSeparateBySpaces) {
    //~ function getPathToNodeFromHtmlNode(node) {
        //~ var htmlNode = document.getElementsByTagName('html')[0];
        //~ var path = [];
        //~ while (node && node != htmlNode) {
            //~ path.unshift(LOG.getChildNodeNumber(node));
            //~ node = LOG.logRunner.getParentNodeHidingContainer(node); // this takes into account the extra elements which the LOG could have added and ignores them
        //~ }
        //~ return path;
    //~ }
    //~ if (this.selected && value.nodeType) {
        //~ // Focus the element in the html panel
        //~ if (this.logItem) {
            //~ var elementLogItem = this.logItem.expandChild(getPathToNodeFromHtmlNode(value));
            //~ if (elementLogItem) {
                //~ panel.scrollElementIntoView(elementLogItem.element);
                //~ LOG.blinkElement(elementLogItem.element);
            //~ }
        //~ }
    //~ }
//~ }
//~ // END HtmlSection.js
//~ LOG.BasicLogItem = function(doc, value, stackedMode, alreadyLoggedContainers) {
    //~ function getText() {
        //~ if (typeof value == 'object') {
            //~ if (value == null) {
                //~ return 'null';
            //~ } else if (typeof value == 'object' && value.nodeType == 8) { // 8 = comment
                //~ return '[Comment] ' + value.nodeValue;
            //~ } else if (typeof value == 'object' && value.nodeType == 3) { // 3 = text node
                //~ return '[TextNode] ' + value.nodeValue;
            //~ }
        //~ } else if (typeof value == 'undefined') {
            //~ return 'undefined';
        //~ } else if (typeof value == 'string') {
            //~ return '"' + value.toString().replace(/"/g, '\\"') + '"';
        //~ } else if (typeof value != 'undefined' && typeof value.toString == 'function') {
            //~ return value.toString();
        //~ }
    //~ }
    
    //~ this.element = LOG.createElement(doc, 'span', {}, [
        //~ LOG.getGetPositionInVariablesElement(doc, value),
        //~ getText(),
        //~ LOG.getExtraInfoToLogAsHtmlElement(doc, value, stackedMode, alreadyLoggedContainers)
    //~ ]);
//~ }

//~ LOG.setTypeName(LOG.BasicLogItem, 'LOG.BasicLogItem');

//~ LOG.ArrayLogItem = function(doc, value, stackedMode, alreadyLoggedContainers) {
    //~ this.doc = doc;
    //~ if (typeof alreadyLoggedContainers == 'undefined') {
        //~ alreadyLoggedContainers = [];
    //~ }
    
    //~ this.value = value;
    //~ this.stackedMode = stackedMode;
    //~ this.alreadyLoggedContainers = alreadyLoggedContainers;
    //~ this.alreadyLoggedContainers.push(value);
    //~ var me = this;
    //~ var link;
    //~ this.element = LOG.createElement(
        //~ this.doc, 'span',
        //~ {},
        //~ [
            //~ LOG.getGetPositionInVariablesElement(this.doc, value),
            //~ link = LOG.createElement(
                //~ this.doc, 'a',
                //~ {
                    //~ style: {
                        //~ textDecoration: 'none',
                        //~ color: 'black'
                    //~ },
                    //~ href: '#',
                    //~ onmouseover: function() {
                        //~ link.style.textDecoration = 'underline';
                        //~ link.style.color = 'red';
                        //~ endSpan.style.textDecoration = 'underline';
                        //~ endSpan.style.color = 'red';
                    //~ },
                    //~ onmouseout: function() {
                        //~ link.style.textDecoration = 'none';
                        //~ link.style.color = 'black';
                        //~ endSpan.style.textDecoration = 'none';
                        //~ endSpan.style.color = '';
                    //~ },
                    //~ onclick: function(event) {
                        //~ if (!event) {
                            //~ event = doc.parentWindow.event;
                        //~ }
                        //~ LogAndStore(value);
                        //~ LOG.stopPropagation(event);
                        //~ LOG.preventDefault(event);
                    //~ }
                //~ },
                //~ [ '[' ]
            //~ ),
            //~ this.updateLink = LOG.createElement(this.doc, 'a',
                //~ {
                    //~ style: {
                        //~ textDecoration: 'none',
                        //~ color: 'black'
                    //~ },
                    //~ href: '#',
                    //~ onmouseover: function() {
                        //~ me.updateLink.style.textDecoration = 'underline';
                        //~ me.updateLink.style.color = 'red';
                    //~ },
                    //~ onmouseout: function() {
                        //~ me.updateLink.style.textDecoration = 'none';
                        //~ me.updateLink.style.color = 'black';
                    //~ },
                    //~ onclick: function(event) {
                        //~ if (!event) {
                            //~ event = doc.parentWindow.event;
                        //~ }
                        //~ LOG.preventDefault(event);
                        //~ LOG.stopPropagation(event);
                        //~ me.toggleAutoUpdate();
                    //~ }
                //~ },
                //~ [ '\u21ba' ]
            //~ ),
            //~ ' ',
            //~ this.stackedToggleLink = LOG.createElement(
                //~ this.doc, 'a',
                //~ {
                    //~ style: {
                        //~ textDecoration: 'none',
                        //~ color: 'olive',
                        //~ fontSize: '8pt'
                    //~ },
                    //~ href: '#',
                    //~ onmouseover: function() {
                        //~ me.stackedToggleLink.style.textDecoration = 'underline';
                        //~ endSpan.style.textDecoration = 'underline';
                    //~ },
                    //~ onmouseout: function() {
                        //~ me.stackedToggleLink.style.textDecoration = 'none';
                        //~ endSpan.style.textDecoration = 'none';
                    //~ },
                    //~ onclick: function(event) {
                        //~ if (!event) {
                            //~ event = doc.parentWindow.event;
                        //~ }
                        //~ LOG.preventDefault(event);
                        //~ LOG.stopPropagation(event);
                        //~ me.toggleStackedMode(event.ctrlKey);
                        //~ me.stackedToggleLink.style.textDecoration = 'none';
                        //~ endSpan.style.textDecoration = 'none';
                    //~ }
                //~ },
                //~ [ '\u25ba' ]
            //~ ),
            //~ this.propertiesSpan = LOG.createElement(this.doc, 'span')
        //~ ]
    //~ );
    
    //~ this.currentStackedMode = false;
    //~ this.properties = [];
    //~ this.oldValue = LOG.shallowClone(value);
    
    //~ for (var i = 0; i < value.length; i++) {
        //~ this.createProperty(i);
        //~ me.lastVisibleProperty = this.properties[i];
        //~ this.propertiesSpan.appendChild(this.properties[i].element);
    //~ }
    
    //~ var endSpan = LOG.createElement(
        //~ this.doc, 'span',
        //~ {},
        //~ [ ']' ]
    //~ );
    
    //~ this.autoUpdateInterval = null;
    
    //~ this.element.appendChild(endSpan);
    //~ if (stackedMode) {
        //~ this.toggleStackedMode();
    //~ }
//~ }

//~ LOG.setTypeName(LOG.ArrayLogItem, 'LOG.ArrayLogItem');

//~ LOG.ArrayLogItem.prototype.setShowChildren = function(showChildren, applyToChildren) {
    //~ if (!showChildren || !applyToChildren) {
        //~ return;
    //~ }
    //~ for (var i = 0; i < this.value.length; i++) {
        //~ if (this.properties[i].logItem.setShowChildren) {
            //~ this.properties[i].logItem.setShowChildren(true, true);
        //~ }
    //~ }
//~ }

//~ LOG.ArrayLogItem.prototype.createProperty = function(index) {
    //~ var logItem = LOG.getValueAsLogItem(this.doc, this.value[index], this.stackedMode, this.alreadyLoggedContainers);
    //~ var span, labelElement, logItemSpan, commaSpan;
    //~ span = LOG.createElement(this.doc, 'span',
        //~ {},
        //~ [
            //~ labelElement = LOG.createElement(
                //~ this.doc, 'span',
                //~ {
                    //~ style: {
                        //~ display: 'none',
                        //~ color: 'gray'
                    //~ }
                //~ },
                //~ [ index + ': ' ]
            //~ ),
            //~ logItemSpan = LOG.createElement(
                //~ this.doc, 'span',
                //~ {},
                //~ [logItem.element]
            //~ ),
            //~ commaSpan = LOG.createElement(
                //~ this.doc, 'span',
                //~ {},
                //~ [', ']
            //~ )
        //~ ]
    //~ );
    //~ var property = {
        //~ element: span,
        //~ labelElement: labelElement,
        //~ propertyValueElement: logItemSpan,
        //~ logItem: logItem,
        //~ commaSpan: commaSpan
    //~ };
    //~ this.properties[index] = property;
    //~ if (index == this.value.length - 1) {
        //~ property.commaSpan.style.display = 'none';
    //~ }
//~ }

//~ LOG.ArrayLogItem.prototype.expandProperty = function(pathToProperty) {
    //~ var property = pathToProperty.shift().name;
    //~ if (pathToProperty.length == 0) {
        //~ return this.properties[property].logItem;
    //~ } else {
        //~ if (this.properties[property].logItem.expandProperty) {
            //~ return this.properties[property].logItem.expandProperty(pathToProperty);
        //~ }
    //~ }
//~ }

//~ LOG.ArrayLogItem.prototype.setStackedMode = function(stacked, applyToChildren) {
    //~ if (this.currentStackedMode == stacked) {
        //~ return;
    //~ }
    //~ this.currentStackedMode = stacked;
    //~ for (var i in this.properties) {
        //~ this.setPropertyStackMode(i, applyToChildren);
    //~ }
    //~ if (stacked) {
        //~ this.stackedToggleLink.firstChild.nodeValue = '\u25bc';
    //~ } else {
        //~ this.stackedToggleLink.firstChild.nodeValue = '\u25ba';
    //~ }
//~ }

//~ LOG.ArrayLogItem.prototype.setPropertyStackMode = function(index, applyToChildren) {
    //~ var text, margin;
    //~ if (this.currentStackedMode) {
        //~ margin = '2em';
    //~ } else {
        //~ margin = '0';
    //~ }
    //~ var property = this.properties[index];
    //~ property.element.style.display = this.currentStackedMode ? 'block' : 'inline';
    //~ property.element.style.marginLeft = margin;
    //~ property.labelElement.style.display = this.currentStackedMode ? '' : 'none';
    //~ if (applyToChildren && property.logItem.setStackedMode) {
        //~ property.logItem.setStackedMode(this.currentStackedMode, applyToChildren);
    //~ }
//~ }

//~ LOG.ArrayLogItem.prototype.toggleStackedMode = function(applyToChildren) {
    //~ this.setStackedMode(!this.currentStackedMode, applyToChildren);
//~ }

//~ LOG.ArrayLogItem.prototype.toggleAutoUpdate = function() {
    //~ this.setAutoUpdate(!this.autoUpdateInterval);
//~ }

//~ LOG.ArrayLogItem.prototype.setAutoUpdate = function(enabled) {
    //~ if (!!this.autoUpdateInterval == enabled) {
       //~ return;
    //~ }
    //~ if (this.autoUpdateInterval) {
        //~ clearInterval(this.autoUpdateInterval);
        //~ this.autoUpdateInterval = null;
        //~ this.updateLink.firstChild.nodeValue = '\u21ba';
        //~ this.updateLink.style.backgroundColor = '';
    //~ } else {
        //~ var me = this;
        //~ this.autoUpdateInterval = setInterval(
            //~ function() {
                //~ me.updateAndMarkDifferences()
            //~ },
            //~ 100
        //~ );
        //~ this.updateLink.firstChild.nodeValue = '\u21bb';
        //~ this.updateLink.style.backgroundColor = '#af5';
    //~ }
    //~ for (var i = 0; i < this.properties.length; ++i) {
        //~ if (this.properties[i].logItem.setAutoUpdate) {
            //~ this.properties[i].logItem.setAutoUpdate(enabled);
        //~ }
    //~ }
//~ }

//~ LOG.ArrayLogItem.prototype.updateAndMarkDifferences = function() {
    //~ var me = this;
    //~ function blinkProperty(key) {
        //~ if (me.properties[key].blinkTimeout) {
            //~ clearTimeout(me.properties[key].blinkTimeout);
        //~ }
        //~ me.properties[key].propertyValueElement.style.backgroundColor = 'yellow';
        //~ me.properties[key].labelElement.style.backgroundColor = 'yellow';
        //~ me.properties[key].blinkTimeout = setTimeout(
            //~ function() {
                //~ me.properties[key].propertyValueElement.style.backgroundColor = '';
                //~ me.properties[key].labelElement.style.backgroundColor = '';
                //~ delete me.properties[key].blinkTimeout;
            //~ }, 1000
        //~ );
    //~ }
    
    //~ function updateChangedProperty(key) {
        //~ var propertyValueElement = me.properties[key].propertyValueElement;
        //~ if (me.properties[key].logItem.onRemove) {
            //~ me.properties[key].logItem.onRemove();
        //~ }
        //~ var wasShowingChildren = me.properties[key].logItem.getShowChildren && me.properties[key].logItem.getShowChildren();
        //~ while (propertyValueElement.firstChild) {
            //~ propertyValueElement.removeChild(propertyValueElement.firstChild);
        //~ }
        //~ me.properties[key].logItem = LOG.getValueAsLogItem(me.doc, me.value[key], me.stackedMode, me.alreadyLoggedContainers);
        //~ if (wasShowingChildren) {
            //~ me.properties[key].logItem.setShowChildren(wasShowingChildren);
        //~ }
        //~ if (me.properties[key].logItem.setAutoUpdate) {
            //~ me.properties[key].logItem.setAutoUpdate(!!me.autoUpdateInterval);
        //~ }
        //~ propertyValueElement.appendChild(me.properties[key].logItem.element);
        //~ blinkProperty(key);
    //~ }
    
    //~ function updateAddedProperty(key) {
        //~ me.createProperty(key);
        //~ me.setPropertyStackMode(key);
        //~ if (me.lastVisibleProperty) {
            //~ me.lastVisibleProperty.commaSpan.style.display = '';
        //~ }
        //~ me.properties[key].commaSpan.style.display = 'none';
        //~ me.lastVisibleProperty = me.properties[key];
        //~ blinkProperty(key);
        //~ if (me.properties[key].logItem.setAutoUpdate) {
            //~ me.properties[key].logItem.setAutoUpdate(!!me.autoUpdateInterval);
        //~ }
        //~ me.propertiesSpan.appendChild(me.properties[key].element);
    //~ }
    
    //~ function updateRemovedProperty(key) {
        //~ if (me.properties[key].blinkTimeout) {
            //~ clearTimeout(me.properties[key].blinkTimeout);
        //~ }
        //~ var property = me.properties[key];
        //~ if (property.logItem.onRemove) {
            //~ property.logItem.onRemove();
        //~ }
        //~ property.propertyValueElement.style.backgroundColor = 'yellow';
        //~ property.labelElement.style.backgroundColor = 'yellow';
        //~ property.propertyValueElement.style.textDecoration = 'line-through';
        //~ property.labelElement.style.textDecoration = 'line-through';
        
        //~ setTimeout(
            //~ function() {
                //~ me.propertiesSpan.removeChild(property.element);
                //~ if (me.lastVisibleProperty == property) {
                    //~ me.lastVisibleProperty = null;
                    //~ for (var i = me.properties.length - 1; i >= 0; --i) {
                        //~ if (me.properties[i].element.style.display != 'none') {
                            //~ me.lastVisibleProperty = me.properties[i];
                            //~ me.lastVisibleProperty.commaSpan.style.display = 'none';
                            //~ break;
                        //~ }
                    //~ }
                //~ }
            //~ }, 1000
        //~ );
    //~ }
    
    //~ var diffs = LOG.getObjectDifferences(this.oldValue, this.value);
    //~ for (var i = 0; i < diffs.changedKeys.length; ++i) {
        //~ updateChangedProperty(diffs.changedKeys[i]);
    //~ }
    //~ for (var i = 0; i < diffs.addedKeys.length; ++i) {
        //~ updateAddedProperty(diffs.addedKeys[i]);
    //~ }
    //~ for (var i = 0; i < diffs.removedKeys.length; ++i) {
        //~ updateRemovedProperty(diffs.removedKeys[i]);
    //~ }
    //~ this.oldValue = LOG.shallowClone(this.value);
//~ }

//~ LOG.ArrayLogItem.prototype.onRemove = function() {
    //~ this.setAutoUpdate(false);
//~ }

//~ LOG.PathToObjectLogItem = function(doc, value, dontSeparateBySpaces) {
    //~ this.doc = doc;
    //~ var me = this;
    //~ this.value = value;
    //~ this.element = LOG.createElement(
        //~ this.doc, 'span',
        //~ {}
    //~ );
    //~ if (value) {
        //~ var part, i;
        //~ for (i = 0; i < value.pathToObject.length; ++i) {
            //~ part = new LOG.PathToObjectPart(this.doc, value.pathToObject[i].obj, i == 0 ? value.pathToObject[i].name : LOG.getPropertyAccessor(value.pathToObject[i].name));
            //~ if (!dontSeparateBySpaces) {
                //~ this.element.appendChild(LOG.createElement(this.doc, 'span', { style: { fontSize: '0.1pt' } }, [ ' ' ]));
            //~ }
            //~ this.element.appendChild(part.element);
        //~ }
        //~ var node = value.pathToObject[value.pathToObject.length - 1].obj;
        //~ for (i = 0; i < value.pathToElement.length; ++i) {
            //~ node = node.childNodes[value.pathToElement[i]];
            //~ part = new LOG.PathToObjectPart(this.doc, node, '.childNodes[' + value.pathToElement[i] + ']');
            //~ this.element.appendChild(part.element);
        //~ }
    //~ } else {
        //~ this.element.appendChild(this.doc.createTextNode('Could not compute path'));
    //~ }
//~ }

//~ LOG.setTypeName(LOG.PathToObjectLogItem, 'LOG.PathToObjectLogItem');

//~ LOG.PathToObjectPart = function(doc, value, pathPartName) {
    //~ this.doc = doc;
    //~ this.value = value;
    //~ this.ctrlClick = false;
    //~ var me = this;
    //~ var link = this.element = LOG.createElement(
        //~ this.doc, 'a',
        //~ {
            //~ style: {
                //~ textDecoration: 'none',
                //~ color: 'black'
            //~ },
            //~ href: '#',
            //~ onmouseover: function() {
                //~ link.style.textDecoration = 'underline';
                //~ link.style.color = 'olive';
                //~ me.showElementOutline();
            //~ },
            //~ onmouseout: function() {
                //~ link.style.textDecoration = 'none';
                //~ link.style.color = 'black';
                //~ me.hideElementOutline();
            //~ },
            //~ onmousedown: LOG.createEventHandler(this.doc, this, 'onLinkMouseDown'),
            //~ onclick: LOG.createEventHandler(this.doc, this, 'onLinkClick')
        //~ },
        //~ [ pathPartName ]
    //~ );
//~ }

//~ LOG.setTypeName(LOG.PathToObjectPart, 'LOG.PathToObjectPart');

//~ LOG.PathToObjectPart.prototype.onLinkMouseDown = function(event) {
    //~ this.ctrlClick = LOG.getButtonFromEvent(event) == 'left' && event.ctrlKey;
//~ }

//~ LOG.PathToObjectPart.prototype.onLinkClick = function(event) {
    //~ if (!this.ctrlClick) {
        //~ LogAndStore(this.value);
        //~ LOG.logger.focusValue(this.value, true);
    //~ } else if (window.Reloadable && this.value instanceof window.Reloadable) {
        //~ LOG.openClassInEditor(this.value);
    //~ }
    //~ LOG.stopPropagation(event);
    //~ LOG.preventDefault(event);
//~ }


//~ LOG.PathToObjectPart.prototype.showElementOutline = function() {
    //~ if (this.value.getDomNode) {
        //~ var node = this.value.getDomNode();
        //~ if (node) {
            //~ this.outlineElement = LOG.createOutlineFromElement(node);
        //~ }
    //~ } else if (this.value.nodeType) {
        //~ this.outlineElement = LOG.createOutlineFromElement(this.value);
    //~ }
//~ }

//~ LOG.PathToObjectPart.prototype.hideElementOutline = function() {
    //~ if (this.outlineElement) {
        //~ this.outlineElement.parentNode.removeChild(this.outlineElement);
        //~ delete this.outlineElement;
    //~ }
//~ }

//~ LOG.RefLogItem = function(doc, value, stackedMode, alreadyLoggedContainers) {
    //~ this.value = value;
    //~ var link;
    //~ this.element = LOG.createElement(doc, 'span', {},
        //~ [
            //~ LOG.getGetPositionInVariablesElement(doc, value),
            //~ '«',
            //~ link = LOG.createElement(doc, 'a',
                //~ {
                    //~ style: {
                        //~ textDecoration: 'none',
                        //~ color: 'gray'
                    //~ },
                    //~ href: '#',
                    //~ onmouseover: function() {
                        //~ link.style.textDecoration = 'underline';
                    //~ },
                    //~ onmouseout: function() {
                        //~ link.style.textDecoration = 'none';
                    //~ },
                    //~ onclick: LOG.createEventHandler(doc, this, 'onNameClick')
                //~ },
                //~ [ 'Ref#' + LOG.indexOf(alreadyLoggedContainers, value) ]
            //~ ),
            //~ '»'
        //~ ]
    //~ );
//~ }

//~ LOG.setTypeName(LOG.RefLogItem, 'LOG.RefLogItem');

//~ LOG.RefLogItem.prototype.onNameClick = function(event) {
    //~ LOG.preventDefault(event);
    //~ LOG.stopPropagation(event);
    //~ LogAndStore(this.value);
//~ }

//~ // This works with JS and PHP exceptions traces
//~ LOG.ExceptionLogItem = function(doc, value) {
    //~ this.doc = doc;
    //~ var link;
    //~ var me = this;
    //~ this.showingMoreInfo = false;
    //~ this.value = value;
    
    //~ if (LOG.isIE && !value.type == 'PHP') {
        //~ this.stack = this.getStackFromArguments();
    //~ } else {
        //~ this.stack = this.value.stack;
    //~ }
    
    //~ this.element = LOG.createElement(
        //~ this.doc, 'span',
        //~ {},
        //~ [
            //~ LOG.getGetPositionInVariablesElement(this.doc, value),
            //~ '«',
            //~ link = LOG.createElement(
                //~ this.doc, 'a',
                //~ {
                    //~ style: {
                        //~ textDecoration: 'none',
                        //~ color: 'red'
                    //~ },
                    //~ href: '#',
                    //~ onmouseover: function() {
                        //~ link.style.textDecoration = 'underline';
                        //~ link.style.color = 'olive';
                    //~ },
                    //~ onmouseout: function() {
                        //~ link.style.textDecoration = 'none';
                        //~ link.style.color = 'red';
                    //~ },
                    //~ onclick: LOG.createEventHandler(this.doc, this, 'onNameLinkClik')
                //~ },
                //~ [ value.name ? value.name : 'Exception' ]
            //~ ),
            //~ ' ',
            //~ value.message ? value.message : value.toString(),
            //~ LOG.isGecko ? ' in ' : null,
            //~ (LOG.isGecko && this.value.fileName) ? this.getFileLink(this.getLocalFile(this.value.fileName), this.value.lineNumber) : null,
            //~ ' ',
            //~ this.showMoreLink = LOG.createElement(this.doc, 'a',
                //~ {
                    //~ style: {
                        //~ textDecoration: 'underline',
                        //~ color: 'black'
                    //~ },
                    //~ href: '#',
                    //~ onmouseover: function() {
                        //~ me.showMoreLink.style.textDecoration = 'none';
                        //~ me.showMoreLink.style.color = 'red';
                    //~ },
                    //~ onmouseout: function() {
                        //~ me.showMoreLink.style.textDecoration = 'underline';
                        //~ me.showMoreLink.style.color = 'black';
                    //~ },
                    //~ onclick: LOG.createEventHandler(this.doc, this, 'onShowMoreLinkClick')
                //~ },
                //~ [ 'more' ]
            //~ ),
            //~ this.moreInfoSpan = LOG.createElement(this.doc, 'span'),
            //~ '»'
        //~ ]
    //~ );
//~ }

//~ LOG.setTypeName(LOG.ExceptionLogItem, 'LOG.ExceptionLogItem');

//~ LOG.ExceptionLogItem.prototype.onShowMoreLinkClick = function(event) {
    //~ LOG.preventDefault(event);
    //~ LOG.stopPropagation(event);
    //~ this.toggleShowMoreInfo();
//~ }

//~ LOG.ExceptionLogItem.prototype.onNameLinkClick = function(event) {
    //~ LogAndStore(this.value);
    //~ LOG.stopPropagation(event);
    //~ LOG.preventDefault(event);
//~ }

//~ LOG.ExceptionLogItem.prototype.toggleShowMoreInfo = function() {
    //~ this.setShowMoreInfo(!this.showingMoreInfo);
//~ }

//~ LOG.ExceptionLogItem.prototype.getLocalFile = function(url) {
    //~ var start = window.location.protocol + '//' + window.location.host + '/';
    //~ if (url.substr(0, start.length) == start) {
        //~ url = url.substr(start.length);
    //~ }
    //~ var queryStringPos = url.lastIndexOf('?');
    //~ if (queryStringPos != -1) {
        //~ url = url.substr(0, queryStringPos);
    //~ }
    //~ return url;
//~ }

//~ LOG.ExceptionLogItem.prototype.getStackAsArray = function(stackString) {
    //~ var linesArray = stackString.split(/\r\n|\r|\n/);
    //~ var out = [];
    //~ var linePos, line;
    //~ for (var i = 0; i < linesArray.length; ++i) {
        //~ line = linesArray[i];
        //~ if (!line) {
            //~ continue;
        //~ }
        //~ var atPos = line.lastIndexOf('@');
        //~ var colonPos = line.lastIndexOf(':');
        //~ out.push(
            //~ {
                //~ 'function': this.getLocalFile(line.substr(0, atPos)),
                //~ file: this.getLocalFile(line.substring(atPos + 1, colonPos)),
                //~ line: parseInt(line.substr(colonPos + 1)),
                //~ args: []
            //~ }
        //~ );
    //~ }
    //~ return out;
//~ }

//~ function getStackFromArguments() {
    //~ var currentCaller = arguments.callee.caller;
    //~ var stack = [];
    //~ var caller;
    //~ while (currentCaller) {
        //~ stack.push(currentCaller);
        //~ currentCaller = currentCaller.caller;
    //~ }
    //~ return stack;
//~ }

//~ LOG.ExceptionLogItem.prototype.getStackFromArguments = getStackFromArguments;

//~ LOG.ExceptionLogItem.prototype.getStackHtmlElement = function(fileName, lineNumber) {
    //~ var stackArray;
    //~ if (LOG.isIE) {
        //~ return LOG.getValueAsHtmlElement(this.doc, this.stack);
    //~ } else if (this.value.stack) {
        //~ if (typeof this.value.stack == 'string') {
            //~ stackArray = this.getStackAsArray(this.value.stack);
        //~ } else {
            //~ stackArray = this.value.stack;
        //~ }
        //~ var element = LOG.createElement(this.doc, 'div');
        //~ var link;
        //~ for (var i = 1; i < stackArray.length; ++i) {
            //~ if (stackArray[i].file && stackArray[i].line) {
                //~ link = this.getFileLink(stackArray[i].file, stackArray[i].line)
            //~ } else if (!stackArray[i].file && !stackArray[i].line && !stackArray.line) {
                //~ continue;
            //~ } else {
                //~ link = null;
            //~ }
            //~ element.appendChild(
                //~ LOG.createElement(this.doc, 'div',
                    //~ {},
                    //~ [
                        //~ link,
                        //~ link ? ': ' + stackArray[i]['function'] : stackArray[i]['function'],
                        //~ stackArray[i]['args'] ? LOG.createElement(this.doc, 'span',
                            //~ {},
                            //~ [
                                //~ ' (',
                                //~ LOG.getValueAsHtmlElement(this.doc, stackArray[i]['args']),
                                //~ ')'
                            //~ ]
                        //~ ) : null
                    //~ ]
                //~ )
            //~ )
        //~ }
        //~ return element;
    //~ } else {
        //~ return LOG.createElement(
            //~ this.doc, 'div',
            //~ {
            //~ },
            //~ [
                //~ 'No more info available'
            //~ ]
        //~ );
    //~ }
//~ }

//~ // FIXME: iats dependency: this should be done from outside
//~ LOG.ExceptionLogItem.getFileLink = function(ownerDoc, fileName, lineNumber) { // this is available to use from outside
    //~ return LOG.createElement(
        //~ ownerDoc, 'a',
        //~ {
            //~ href: 'openFile.php?file=' + escape(fileName) + '&line=' + lineNumber
        //~ },
        //~ [
            //~ fileName + ' line ' + lineNumber
        //~ ]
    //~ );
//~ }

//~ LOG.ExceptionLogItem.prototype.getFileLink = function(fileName, lineNumber) {
    //~ return LOG.ExceptionLogItem.getFileLink(this.doc, fileName, lineNumber);
//~ }

//~ LOG.ExceptionLogItem.prototype.setShowMoreInfo = function(show) {
    //~ if (show == this.showingMoreInfo) {
        //~ return;
    //~ }
    //~ this.showingMoreInfo = show;
    //~ if (!show) {
        //~ if (this.moreInfoSpan.firstChild) {
            //~ this.moreInfoSpan.removeChild(this.moreInfoSpan.firstChild);
        //~ }
    //~ } else {
        //~ var start = window.location.protocol + '//' + window.location.host;
        //~ var stackElement = this.getStackHtmlElement();
        //~ if (stackElement) { // could be null if there is no stack to show
            //~ this.moreInfoSpan.appendChild(
                //~ stackElement
            //~ );
        //~ }
    //~ }
//~ }

//~ LOG.HTMLElementLogItem = function(doc, value, stackedMode, alreadyLoggedContainers, dontShowParentLink) {
    //~ this.doc = doc;
    //~ var link;
    //~ var showParentLink;
    
    //~ this.stackedMode = stackedMode;
    //~ this.alreadyLoggedContainers = alreadyLoggedContainers;
    //~ this.dontShowParentLink = dontShowParentLink;
    
    //~ var me = this;
    //~ this.value = value;
    //~ this.onlyTextNodeChildren = true;
    
    //~ var childNodes = this.getChildNodes();
    //~ this.hasChildNodes = childNodes.length > 0;
    //~ for (var i = 0; i < childNodes.length; ++i) {
        //~ if (childNodes[i].nodeName != '#text') {
            //~ this.onlyTextNodeChildren = false;
            //~ break;
        //~ }
    //~ }
    //~ this.showChildNodes = false;
    //~ this.element = LOG.createElement(this.doc, 'span',
        //~ {
            //~ style: {
                //~ color: '#00e'
            //~ }
        //~ },
        //~ [
            //~ this.showChildNodesLink = LOG.createElement(this.doc, 'a',
                //~ {
                    //~ style: {
                        //~ textDecoration: 'none',
                        //~ color: 'black',
                        //~ fontWeight: 'bold',
                        //~ cursor: 'pointer'
                    //~ },
                    //~ onmouseover: function() {
                        //~ me.showChildNodesLink.style.textDecoration = 'underline';
                        //~ me.showChildNodesLink.style.color = 'red';
                    //~ },
                    //~ onmouseout: function() {
                        //~ me.showChildNodesLink.style.textDecoration = 'none';
                        //~ me.showChildNodesLink.style.color = 'black';
                    //~ },
                    //~ onclick: LOG.createEventHandler(this.doc, this, 'onShowChildNodesLinkClick'),
                    //~ title: 'Toggle show child nodes'
                //~ },
                //~ [
                    //~ this.hasChildNodes ?
                        //~ (this.showChildNodes ? '-' : '+') :
                        //~ '\u00A0'
                //~ ]
            //~ ),
            //~ '<',
            //~ link = LOG.createElement(this.doc, 'a',
                //~ {
                    //~ style: {
                        //~ textDecoration: 'none',
                        //~ color: '#00e'
                    //~ },
                    //~ onmouseover: function() {
                        //~ link.style.textDecoration = 'underline';
                        //~ me.showElementOutline();
                    //~ },
                    //~ onmouseout: function() {
                        //~ link.style.textDecoration = 'none';
                        //~ me.hideElementOutline();
                    //~ },
                    //~ onclick: LOG.createEventHandler(this.doc, this, 'onTagNameLinkClick'),
                    //~ href: '#'
                //~ },
                //~ [
                    //~ value.tagName.toLowerCase()
                //~ ]
            //~ ),
            //~ LOG.getGetPositionInVariablesElement(this.doc, value),
            //~ (!dontShowParentLink ? showParentLink = LOG.createElement(this.doc, 'a',
                //~ {
                    //~ style: {
                        //~ textDecoration: 'none',
                        //~ color: 'gray'
                    //~ },
                    //~ onmouseover: function() {
                        //~ showParentLink.style.textDecoration = 'underline';
                        //~ showParentLink.style.color = 'red';
                    //~ },
                    //~ onmouseout: function() {
                        //~ showParentLink.style.textDecoration = 'none';
                        //~ showParentLink.style.color = 'gray';
                    //~ },
                    //~ onclick: LOG.createEventHandler(this.doc, this, 'onShowParentLinkClick'),
                    //~ title: 'Show parent node'
                //~ },
                //~ ['\u21A5']
            //~ ) : null),
            //~ this.propertiesContainer = LOG.createElement(this.doc, 'span'),
            //~ this.startTagEnd = this.doc.createTextNode(this.showChildNodes ? '>' : '/>'),
            //~ this.withChildNodesEnd = LOG.createElement(this.doc, 'span',
                //~ {
                    //~ style: {
                        //~ display: this.showChildNodes ? null :  'none'
                    //~ }
                //~ },
                //~ [
                    //~ this.childNodesContainer = LOG.createElement(this.doc, 'span'),
                    //~ this.endTag = LOG.createElement(this.doc, 'span',
                        //~ {
                            //~ onmouseover: function() {
                                //~ link.style.textDecoration = 'underline';
                                //~ me.showElementOutline();
                            //~ },
                            //~ onmouseout: function() {
                                //~ link.style.textDecoration = 'none';
                                //~ me.hideElementOutline();
                            //~ }
                        //~ },
                        //~ [
                            //~ '\u00A0</' + value.tagName.toLowerCase() + '>'
                        //~ ]
                    //~ )
                //~ ]
            //~ )
        //~ ]
    //~ )
    
    //~ for (var i = 0; i < value.attributes.length; ++i) {
        //~ if (value.attributes[i].specified) {
            //~ this.propertiesContainer.appendChild(this.doc.createTextNode(' '));
            //~ this.propertiesContainer.appendChild(
                //~ LOG.createElement(this.doc, 'span',
                    //~ { style: {color: '#036' } },
                    //~ [ value.attributes[i].name + '=' ]
                //~ )
            //~ );
            //~ this.propertiesContainer.appendChild(
                //~ LOG.createElement(this.doc, 'span',
                    //~ { style: { color: '#630' } },
                    //~ [ '"' + value.attributes[i].value.replace(/"/, '"') + '"' ]
                //~ )
            //~ );
        //~ }
    //~ }
    //~ if (this.hasChildNodes && this.value.nodeName.toLowerCase() != 'script' && this.value.nodeName.toLowerCase() != 'style' && this.onlyTextNodeChildren) {
        //~ this.setShowChildNodes(true);
    //~ }
//~ }

//~ LOG.setTypeName(LOG.HTMLElementLogItem, 'LOG.HTMLElementLogItem');

//~ LOG.HTMLElementLogItem.prototype.onShowParentLinkClick = function(event) {
    //~ this.showParent();
    //~ LOG.stopPropagation(event);
    //~ LOG.preventDefault(event);
//~ }

//~ LOG.HTMLElementLogItem.prototype.onTagNameLinkClick = function(event) {
    //~ LogAndStore(this.value);
    //~ LOG.stopPropagation(event);
    //~ LOG.preventDefault(event);
//~ }

//~ LOG.HTMLElementLogItem.prototype.onShowChildNodesLinkClick = function(event) {
    //~ this.toggleShowChildNodes(event.ctrlKey);
    //~ LOG.stopPropagation(event);
    //~ LOG.preventDefault(event);
//~ }

//~ LOG.HTMLElementLogItem.prototype.expandChild = function(pathToChild) {
    //~ if (pathToChild.length > 0) {
        //~ if (!this.showChildNodes) {
            //~ this.setShowChildNodes(true, false);
        //~ }
        //~ var i = pathToChild.shift();
        //~ if (this.childNodeItems[i].expandChild) {
            //~ return this.childNodeItems[i].expandChild(pathToChild);
        //~ } else {
            //~ Log('expanding something which is not an htmlelementlogitem');
        //~ }
    //~ } else {
        //~ return this;
    //~ }
//~ }

//~ LOG.HTMLElementLogItem.prototype.showElementOutline = function() {
    //~ this.outlineElement = LOG.createOutlineFromElement(this.value);
//~ }

//~ LOG.HTMLElementLogItem.prototype.hideElementOutline = function() {
    //~ if (this.outlineElement) {
        //~ this.outlineElement.parentNode.removeChild(this.outlineElement);
        //~ delete this.outlineElement;
    //~ }
//~ }

//~ LOG.HTMLElementLogItem.prototype.getChildNodes = function() {
    //~ if (LOG.logRunner) { // Hide LOG's wrapper elements in the DOM
        //~ return LOG.logRunner.getChildNodesHidingContainer(this.value);
    //~ } else {
        //~ return this.value.childNodes;
    //~ }
//~ }

//~ LOG.HTMLElementLogItem.prototype.showParent = function() {
    //~ Log(this.value.parentNode);
//~ }

//~ LOG.HTMLElementLogItem.prototype.toggleShowChildNodes = function(applyToChildNodes) {
    //~ this.setShowChildNodes(!this.showChildNodes, applyToChildNodes);
//~ }

//~ LOG.HTMLElementLogItem.prototype.setShowChildNodes = function(show, applyToChildNodes) {
    //~ if (show == this.showChildNodes) {
        //~ return;
    //~ }
    //~ this.showChildNodes = show;
    //~ while (this.childNodesContainer.firstChild) {
        //~ this.childNodesContainer.removeChild(this.childNodesContainer.firstChild);
    //~ }
    //~ this.withChildNodesEnd.style.display = show ? '' : 'none';
    //~ this.showChildNodesLink.firstChild.nodeValue = show ? '-' : '+';
    //~ this.startTagEnd.nodeValue = show ? '>' : '/>';
    //~ if (show) {
        //~ if (!this.onlyTextNodeChildren) {
            //~ this.childNodesContainer.style.display = 'block';
            //~ this.childNodesContainer.style.marginLeft = '1em';
        //~ }
        //~ var childNodeLogItem;
        //~ var childNode;
        //~ var childNodes = this.getChildNodes();
        //~ this.childNodeItems = [];
        //~ for (var i = 0; i < childNodes.length; ++i) {
            //~ childNode = childNodes[i];
            //~ if (childNode.nodeType == 1) {
                //~ childNodeLogItem = new LOG.HTMLElementLogItem(this.doc, childNode, this.stackedMode, this.alreadyLoggedContainers, true);
                //~ if (applyToChildNodes) {
                    //~ childNodeLogItem.setShowChildNodes(true, true);
                //~ }
            //~ } else if (childNode.nodeName == '#text') {
                //~ childNodeLogItem = {
                    //~ element: LOG.createElement(this.doc, 'span', { style: { color: '#999' } },
                        //~ [
                            //~ LOG.isWhitespace(childNode.nodeValue) ? ' ' : ('\u00A0' + childNode.nodeValue)
                        //~ ]
                    //~ )
                //~ };
            //~ } else if (childNode.nodeName == '#comment') {
                //~ childNodeLogItem = {
                    //~ element: LOG.createElement(this.doc, 'span', { style: { color: '#bc7' } }, [ '<!--' + childNode.nodeValue + '-->' ] )
                //~ };
            //~ } else {
                //~ childNodeLogItem = LOG.getValueAsLogItem(this.doc, childNode);
            //~ }
            
            //~ this.childNodeItems.push(childNodeLogItem);
            //~ if (!this.onlyTextNodeChildren) {
                //~ childNodeLogItem.element.style.display = 'block';
            //~ }
            //~ this.childNodesContainer.appendChild(childNodeLogItem.element);
        //~ }
        
    //~ } else {
        //~ this.childNodesContainer.style.display = 'inline';
        //~ this.childNodesContainer.style.marginLeft = '0';
    //~ }
//~ }
//~ LOG.TypedObjectLogItem = function(doc, value, stackedMode, alreadyLoggedContainers) {
    //~ this.doc = doc;
    //~ this.showSource = false;
    //~ this.value = value;
    //~ this.stackedMode = stackedMode;
    //~ this.alreadyLoggedContainers = alreadyLoggedContainers;
    //~ this.autoUpdate = false;
    //~ var decoration = '';
    //~ if (value.Deleted) {
        //~ decoration = 'line-through';
    //~ }
    //~ var me = this;
    //~ var outlineElement;
    //~ this.typeName = this.getTypeName();
    //~ var showProps;
    //~ var stringToShow;
    //~ if (this.typeName != 'HTMLDocument' && this.typeName != 'Window') {
        //~ stringToShow = (typeof value.toString == 'function' && value.toString != Object.prototype.toString) ? ' ' + value.toString() : null;
        //~ showProps = true;
    //~ } else {
        //~ stringToShow = null;
        //~ showProps = false;
    //~ }
    
    //~ this.element = LOG.createElement(this.doc,
        //~ 'span', {},
        //~ [
            //~ LOG.getGetPositionInVariablesElement(this.doc, value),
            //~ '«',
            //~ this.link = LOG.createElement(this.doc, 'a',
                //~ {
                    //~ style: {
                        //~ color: 'gray',
                        //~ textDecoration: decoration ? decoration : 'none'
                    //~ },
                    //~ href: '#',
                    //~ onmouseover: function() {
                        //~ me.link.style.textDecoration = 'underline ' + decoration;
                        //~ if (value.getDomNode) {
                            //~ var node = value.getDomNode();
                            //~ if (node) {
                                //~ outlineElement = LOG.createOutlineFromElement(node);
                            //~ }
                        //~ }
                    //~ },
                    //~ onmouseout: function() {
                        //~ if (decoration) {
                            //~ me.link.style.textDecoration = decoration;
                        //~ } else {
                            //~ me.link.style.textDecoration = 'none';
                        //~ }
                        //~ if (outlineElement) {
                            //~ outlineElement.parentNode.removeChild(outlineElement);
                        //~ }
                    //~ },
                    //~ onclick: LOG.createEventHandler(this.doc, this, 'onNameLinkClick')
                //~ },
                //~ [ this.typeName ]
            //~ ),
            //~ showProps ? ' ' : null,
            //~ showProps ? this.srcLink = LOG.createElement(this.doc, 'a',
                //~ {
                    //~ style: {
                        //~ color: 'green',
                        //~ textDecoration: 'none',
                        //~ fontSize: '8pt'
                    //~ },
                    //~ href: '#',
                    //~ onmouseover: function() {
                        //~ me.srcLink.style.textDecoration = me.showSource ? 'line-through underline' : 'underline';
                    //~ },
                    //~ onmouseout: function() {
                        //~ me.srcLink.style.textDecoration = me.showSource ? 'line-through' : 'none';
                    //~ },
                    //~ onclick: LOG.createEventHandler(this.doc, this, 'onSrcLinkClick')
                //~ },
                //~ [
                    //~ 'src'
                //~ ]
            //~ ) : null,
            //~ LOG.getExtraInfoToLogAsHtmlElement(this.doc, value, stackedMode, alreadyLoggedContainers),
            //~ stringToShow,
            //~ showProps ? this.srcElement = LOG.createElement(this.doc, 'span') : null,
            //~ '»'
        //~ ]
    //~ );
//~ }

//~ LOG.setTypeName(LOG.TypedObjectLogItem, 'LOG.TypedObjectLogItem');

//~ LOG.TypedObjectLogItem.prototype.onNameLinkClick = function(event) {
    //~ if (event.ctrlKey) {
        //~ LOG.openClassInEditor(this.value);
    //~ } else {
        //~ LogAndStore(this.value);
    //~ }
    //~ LOG.stopPropagation(event);
    //~ LOG.preventDefault(event);
//~ }

//~ LOG.TypedObjectLogItem.prototype.onSrcLinkClick = function(event) {
    //~ this.toggleShowSource();
    //~ LOG.stopPropagation(event);
    //~ LOG.preventDefault(event);
//~ }

//~ LOG.TypedObjectLogItem.getTypeName = function(value) {
    //~ if (LOG.instanceOfWindow(value)) {
        //~ return "Window";
    //~ } else if (LOG.instanceOfDocument(value)) {
        //~ if (LOG.instanceOfHTMLDocument(value)) {
            //~ return "HTMLDocument";
        //~ } else {
            //~ return "Document";
        //~ }
    //~ }
    
    //~ var txt = '';
    //~ var objectToStringName = null;
    //~ if (value.toString && value.toString && value.toString != Object.prototype.toString) {
        //~ objectToStringName = (
            //~ function() { // This is used to detect object like Window or Navigator which generate an [object Navigator] like toString()
                //~ var match = value.toString().match(/^\[object ([a-zA-Z0-9_$]+)\]/);
                //~ if (!match) {
                    //~ return null;
                //~ }
                //~ return match[1];
            //~ }
        //~ )();
    //~ }
    //~ if (value.constructor && value.constructor.name) {
        //~ txt += value.constructor.name.toString();
    //~ } else if (objectToStringName) {
        //~ txt += objectToStringName;
    //~ } else if (value.getTypeName) {
        //~ txt += value.getTypeName();
    //~ } else {
        //~ txt += 'Anonymous';
    //~ }
    //~ return txt;
//~ }

//~ LOG.TypedObjectLogItem.prototype.getTypeName = function() {
    //~ return LOG.TypedObjectLogItem.getTypeName(this.value);
//~ }

//~ LOG.TypedObjectLogItem.prototype.expandProperty = function(pathToProperty) {
    //~ if (!this.showSource) {
        //~ this.setShowSource(true);
    //~ }
    //~ return this.objectLogItem.expandProperty(pathToProperty);
//~ }

//~ LOG.TypedObjectLogItem.prototype.setAutoUpdate = function(enabled) {
    //~ this.autoUpdate = enabled;
    //~ if (this.objectLogItem) {
        //~ this.objectLogItem.setAutoUpdate(enabled);
    //~ }
//~ }

//~ LOG.TypedObjectLogItem.prototype.toggleShowSource = function() {
    //~ this.setShowSource(!this.showSource);
//~ }

//~ LOG.TypedObjectLogItem.prototype.setShowSource = function(showSource) {
    //~ if (this.showSource == showSource) {
        //~ return;
    //~ }
    //~ this.showSource = showSource;
    //~ if (showSource) {
        //~ this.srcLink.style.textDecoration = 'line-through';
        //~ this.srcElement.appendChild(this.doc.createTextNode(' '));
        //~ this.objectLogItem = new LOG.ObjectLogItem(this.doc, this.value, true, this.alreadyLoggedContainers, true, false);
        //~ if (this.autoUpdate) {
            //~ this.objectLogItem.setAutoUpdate(true);
        //~ }
        //~ this.srcElement.appendChild(this.objectLogItem.element);
    //~ } else {
        //~ this.objectLogItem.setAutoUpdate(false);
        //~ delete this.objectLogItem;
        //~ this.srcLink.style.textDecoration = 'none';
        //~ while (this.srcElement.firstChild) {
            //~ this.srcElement.removeChild(this.srcElement.firstChild);
        //~ }
    //~ }
//~ }

//~ LOG.FunctionLogItem = function(doc, value, stackedMode, alreadyLoggedContainers) {
    //~ function getName() {
        //~ var result = /function[^(]*(\([^)]*\))/.exec(value.toString());
        //~ if (!result) {
            //~ return value.toString();
        //~ } else {
            //~ return 'f' + result[1];
        //~ }
    //~ }
    
    //~ if (!alreadyLoggedContainers) {
        //~ alreadyLoggedContainers = [];
    //~ }
    
    //~ this.value = value;
    //~ var link, srcLink;
    //~ this.element = LOG.createElement(doc, 'span', {},
        //~ [
            //~ LOG.getGetPositionInVariablesElement(doc, value),
            //~ '«',
            //~ link = LOG.createElement(doc, 'a',
                //~ {
                    //~ style: {
                        //~ textDecoration: 'none',
                        //~ color: 'gray'
                    //~ },
                    //~ href: '#',
                    //~ onmouseover: function() {
                        //~ link.style.textDecoration = 'underline';
                    //~ },
                    //~ onmouseout: function() {
                        //~ link.style.textDecoration = 'none';
                    //~ },
                    //~ onclick: LOG.createEventHandler(doc, this, 'onNameClick')
                //~ },
                //~ [ getName() ]
            //~ ),
            //~ ' ',
            //~ srcLink = LOG.createElement(doc, 'a',
                //~ {
                    //~ style: {
                        //~ textDecoration: 'none',
                        //~ color: 'green',
                        //~ fontSize: '8pt'
                    //~ },
                    //~ href: '#',
                    //~ onmouseover: function() {
                        //~ srcLink.style.textDecoration = 'underline';
                    //~ },
                    //~ onmouseout: function() {
                        //~ srcLink.style.textDecoration = 'none';
                    //~ },
                    //~ onclick: LOG.createEventHandler(doc, this, 'onSrcClick')
                //~ },
                //~ [ 'src' ]
            //~ ),
            //~ LOG.getExtraInfoToLogAsHtmlElement(doc, value, stackedMode, alreadyLoggedContainers),
            //~ '»'
        //~ ]
    //~ );
//~ }

//~ LOG.setTypeName(LOG.FunctionLogItem, 'LOG.FunctionLogItem');

//~ LOG.FunctionLogItem.prototype.onSrcClick = function(event) {
    //~ LOG.preventDefault(event);
    //~ LOG.stopPropagation(event);
    //~ Log(this.value.toString());
//~ }

//~ LOG.FunctionLogItem.prototype.onNameClick = function(event) {
    //~ LOG.preventDefault(event);
    //~ LOG.stopPropagation(event);
    //~ LogAndStore(this.value);
//~ }

//~ LOG.ObjectLogItem = function(doc, value, stackedMode, alreadyLoggedContainers, showChildren, showToggleChildrenLink) {
    //~ if (typeof alreadyLoggedContainers == 'undefined') {
        //~ alreadyLoggedContainers = [];
    //~ }
    //~ if (typeof showChildren == 'undefined') {
        //~ showChildren = false;
    //~ }
    //~ if (typeof showToggleChildrenLink == 'undefined') {
        //~ showToggleChildrenLink = true;
    //~ }
    
    //~ this.doc = doc;
    
    //~ this.stackedMode = stackedMode;
    //~ this.alreadyLoggedContainers = alreadyLoggedContainers;
    //~ alreadyLoggedContainers.push(value);
    
    //~ this.value = value;
    
    //~ var endSpan;
    
    //~ function highlightCurlyBraces() {
        //~ me.startObjectLink.style.textDecoration = 'underline';
        //~ me.startObjectLink.style.color = 'red';
        //~ me.startObjectLink.style.backgroundColor = 'yellow';
        //~ endSpan.style.textDecoration = 'underline';
        //~ endSpan.style.color = 'red';
        //~ endSpan.style.backgroundColor = 'yellow';
    //~ }
    
    //~ function endHighlightCurlyBraces() {
        //~ me.startObjectLink.style.textDecoration = 'none';
        //~ me.startObjectLink.style.color = 'black';
        //~ me.startObjectLink.style.backgroundColor = '';
        //~ endSpan.style.textDecoration = 'none';
        //~ endSpan.style.color = '';
        //~ endSpan.style.backgroundColor = '';
    //~ }
    
    //~ this.element = LOG.createElement(doc, 'span',
        //~ {},
        //~ [
            //~ LOG.getGetPositionInVariablesElement(doc, value),
            //~ showToggleChildrenLink ? this.toggleChildrenLink = LOG.createElement(doc, 'a',
                //~ {
                    //~ style: {
                        //~ textDecoration: 'none',
                        //~ color: 'black'
                    //~ },
                    //~ href: '#',
                    //~ onmouseover: function() {
                        //~ me.toggleChildrenLink.style.textDecoration = 'underline';
                        //~ me.toggleChildrenLink.style.color = 'red';
                    //~ },
                    //~ onmouseout: function() {
                        //~ me.toggleChildrenLink.style.textDecoration = 'none';
                        //~ me.toggleChildrenLink.style.color = 'black';
                    //~ },
                    //~ onclick: LOG.createEventHandler(doc, this, 'onElementClick')
                //~ },
                //~ [ showChildren ? '-' : '+' ]
            //~ ) : null,
            //~ this.startObjectLink = LOG.createElement(doc, 'a',
                //~ {
                    //~ style: {
                        //~ textDecoration: 'none',
                        //~ color: 'black'
                    //~ },
                    //~ href: '#',
                    //~ onmouseover: function() {
                        //~ highlightCurlyBraces();
                    //~ },
                    //~ onmouseout: function() {
                        //~ endHighlightCurlyBraces();
                    //~ },
                    //~ onclick: LOG.createEventHandler(doc, this, 'onStartObjectLinkClick')
                //~ },
                //~ [ '{' ]
            //~ ),
            //~ this.updateLink = LOG.createElement(doc, 'a',
                //~ {
                    //~ style: {
                        //~ textDecoration: 'none',
                        //~ color: 'black',
                        //~ display: 'none'
                    //~ },
                    //~ href: '#',
                    //~ onmouseover: function() {
                        //~ me.updateLink.style.textDecoration = 'underline';
                        //~ me.updateLink.style.color = 'red';
                    //~ },
                    //~ onmouseout: function() {
                        //~ me.updateLink.style.textDecoration = 'none';
                        //~ me.updateLink.style.color = 'black';
                    //~ },
                    //~ onclick: LOG.createEventHandler(doc, this, 'onUpdateLinkClick')
                //~ },
                //~ [ '\u21ba' ]
            //~ ),
            //~ this.stackedToggleLink = LOG.createElement(doc, 'a',
                //~ {
                    //~ style: {
                        //~ textDecoration: 'none',
                        //~ color: 'green',
                        //~ fontSize: '8pt',
                        //~ display: 'none'
                    //~ },
                    //~ href: '#',
                    //~ onmouseover: function() {
                        //~ me.stackedToggleLink.style.textDecoration = 'underline';
                    //~ },
                    //~ onmouseout: function() {
                        //~ me.stackedToggleLink.style.textDecoration = 'none';
                    //~ },
                    //~ onclick: function(event) {
                        //~ if (!event) {
                            //~ event = doc.parentWindow.event;
                        //~ }
                        //~ LOG.preventDefault(event);
                        //~ LOG.stopPropagation(event);
                        //~ me.toggleStackedMode(event.ctrlKey);
                    //~ }
                //~ },
                //~ [ '\u25ba' ]
            //~ ),
            //~ this.toggleMethodsLink = LOG.createElement(doc, 'a',
                //~ {
                    //~ style: {
                        //~ textDecoration: 'none',
                        //~ color: '#a3f',
                        //~ fontSize: '8pt',
                        //~ display: 'none'
                    //~ },
                    //~ href: '#',
                    //~ onmouseover: function() {
                        //~ me.toggleMethodsLink.style.textDecoration = 'underline';
                        //~ me.toggleMethodsLink.style.color = '#660';
                    //~ },
                    //~ onmouseout: function() {
                        //~ me.toggleMethodsLink.style.textDecoration = 'none';
                        //~ me.toggleMethodsLink.style.color = '#a3f';
                    //~ },
                    //~ onclick: function(event) {
                        //~ if (!event) {
                            //~ event = doc.parentWindow.event;
                        //~ }
                        //~ LOG.preventDefault(event);
                        //~ LOG.stopPropagation(event);
                        //~ me.toggleMethodsVisible();
                    //~ }
                //~ },
                //~ [ '+' ]
            //~ ),
            //~ this.propertiesSpan = LOG.createElement(doc, 'span', { style: { display: 'none' } }),
            //~ this.ellipsisSpan = LOG.createElement(doc, 'span', {}, [ '...' ]),
            //~ endSpan = LOG.createElement(doc, 'span',
                //~ {
                    //~ onmouseover: function() {
                        //~ highlightCurlyBraces();
                    //~ },
                    //~ onmouseout: function() {
                        //~ endHighlightCurlyBraces();
                    //~ }
                //~ },
                //~ [ '}' ]
            //~ )
        //~ ]
    //~ );
    
    //~ this.autoUpdateInterval = null;
    //~ this.currentStackedMode = false;
    //~ this.properties = {};
    //~ this.methodsVisible = false;
    //~ var me = this;
    //~ this.setStackedMode(this.stackedMode);
    //~ this.showingChildren = false;
    //~ this.setShowChildren(showChildren);
//~ }

//~ LOG.setTypeName(LOG.ObjectLogItem, 'LOG.ObjectLogItem');

//~ LOG.ObjectLogItem.prototype.onUpdateLinkClick = function(event) {
    //~ LOG.preventDefault(event);
    //~ LOG.stopPropagation(event);
    //~ this.toggleAutoUpdate();
//~ }

//~ LOG.ObjectLogItem.prototype.onStartObjectLinkClick = function(event) {
    //~ LOG.preventDefault(event);
    //~ LOG.stopPropagation(event);
    //~ LogAndStore(this.value);
//~ }

//~ LOG.ObjectLogItem.prototype.onElementClick = function(event) {
    //~ LOG.preventDefault(event);
    //~ LOG.stopPropagation(event);
    //~ this.toggleShowChildren(event.ctrlKey);
//~ }

//~ LOG.ObjectLogItem.prototype.setShowChildren = function(showChildren, applyToChildren) {
    //~ if (this.showingChildren == showChildren) {
        //~ return;
    //~ }
    //~ this.showingChildren = showChildren;
    
    //~ this.propertiesSpan.style.display = showChildren ? '' : 'none';
    //~ this.ellipsisSpan.firstChild.nodeValue = showChildren ? ' ' : '...';
    //~ this.updateLink.style.display = showChildren ? '' : 'none';
    //~ this.stackedToggleLink.style.display = showChildren ? '' : 'none';
    //~ this.toggleMethodsLink.style.display = showChildren ? '' : 'none';
    
    //~ if (this.toggleChildrenLink) {
        //~ this.toggleChildrenLink.firstChild.nodeValue = showChildren ? '-' : '+';
    //~ }
    
    //~ if (showChildren) {
        //~ this.lastVisibleProperty = null; // the one which shouldn't have a coma
        
        //~ this.oldValue = LOG.shallowClone(this.value);
        
        //~ this.keys = LOG.getObjectProperties(this.value);
        //~ this.keys.sort();
        
        //~ var key;
        //~ this.someMethodExists = false;
        //~ for (var i = 0; i < this.keys.length; ++i) {
            //~ key = this.keys[i];
            //~ this.createProperty(key);
            //~ this.propertiesSpan.appendChild(this.properties[key].element);
            //~ if (typeof this.value[key] == 'function') {
                //~ this.someMethodExists = true;
            //~ }
            //~ if (!this.methodsVisible && typeof this.value[key] == 'function') {
                //~ this.properties[key].element.style.display = 'none';
            //~ } else {
                //~ this.lastVisibleProperty = this.properties[key]; // always the last one
            //~ }
            //~ this.setPropertyStackMode(key);
            //~ if (applyToChildren) {
                //~ if (this.properties[key].logItem.setShowChildren) {
                    //~ this.properties[key].logItem.setShowChildren(true, true);
                //~ }
            //~ }
        //~ }
        //~ if (!this.someMethodExists) {
            //~ this.toggleMethodsLink.style.display = 'none';
        //~ }
        
        //~ if (this.lastVisibleProperty) {
            //~ this.lastVisibleProperty.commaSpan.style.display = 'none';
        //~ }
        //~ if (this.wasAutoUpdating) {
            //~ this.setAutoUpdate(true);
        //~ }
    //~ } else {
        //~ this.wasAutoUpdating = !!this.autoUpdateInterval;
        //~ this.setAutoUpdate(false);
        //~ for (var key in this.properties) {
            //~ if (this.properties[key].logItem.onRemove) {
                //~ this.properties[key].logItem.onRemove();
            //~ }
            //~ this.properties[key].element.parentNode.removeChild(this.properties[key].element);
        //~ }
        //~ this.properties = {};
    //~ }
//~ }

//~ LOG.ObjectLogItem.prototype.getShowChildren = function() {
    //~ return this.showingChildren;
//~ }

//~ LOG.ObjectLogItem.prototype.toggleShowChildren = function(applyToChildren) {
    //~ this.setShowChildren(!this.showingChildren, applyToChildren);
//~ }

//~ LOG.ObjectLogItem.prototype.createProperty = function(key) {
    //~ var itemSpan, span, propertyValueElement;
    //~ itemSpan = this.doc.createElement('span');
    //~ span = this.doc.createElement('span');
    //~ span.appendChild(this.doc.createTextNode(key));
    //~ span.style.color = '#930';
    //~ itemSpan.appendChild(span);
    //~ itemSpan.appendChild(this.doc.createTextNode(': '));
    //~ propertyValueElement = this.doc.createElement('span');
    //~ var logItem = LOG.getValueAsLogItem(this.doc, this.value[key], this.stackedMode, this.alreadyLoggedContainers)
    //~ propertyValueElement.appendChild(logItem.element);
    //~ itemSpan.appendChild(propertyValueElement);
    //~ var commaSpan = this.doc.createElement('span')
    //~ commaSpan.appendChild(this.doc.createTextNode(', '));
    //~ itemSpan.appendChild(commaSpan);
    //~ this.properties[key] = {
        //~ element: itemSpan,
        //~ labelElement: span,
        //~ propertyValueElement: propertyValueElement,
        //~ commaSpan: commaSpan,
        //~ logItem: logItem
    //~ };
//~ }

//~ LOG.ObjectLogItem.prototype.updateAndMarkDifferences = function() {
    //~ var me = this;
    //~ function blinkProperty(key) {
        //~ if (me.properties[key].blinkTimeout) {
            //~ clearTimeout(me.properties[key].blinkTimeout);
        //~ }
        //~ me.properties[key].propertyValueElement.style.backgroundColor = 'yellow';
        //~ me.properties[key].labelElement.style.backgroundColor = 'yellow';
        //~ me.properties[key].blinkTimeout = setTimeout(
            //~ function() {
                //~ me.properties[key].propertyValueElement.style.backgroundColor = '';
                //~ me.properties[key].labelElement.style.backgroundColor = '';
                //~ delete me.properties[key].blinkTimeout;
            //~ }, 1000
        //~ );
    //~ }
    
    //~ function updateChangedProperty(key) {
        //~ var propertyValueElement = me.properties[key].propertyValueElement;
        //~ if (me.properties[key].logItem.onRemove) {
            //~ me.properties[key].logItem.onRemove();
        //~ }
        //~ var wasShowingChildren = me.properties[key].logItem.getShowChildren && me.properties[key].logItem.getShowChildren();
        //~ while (propertyValueElement.firstChild) {
            //~ propertyValueElement.removeChild(propertyValueElement.firstChild);
        //~ }
        //~ me.properties[key].logItem = LOG.getValueAsLogItem(me.doc, me.value[key], me.stackedMode, me.alreadyLoggedContainers);
        //~ me.properties[key].element = me.properties[key].logItem.element;
        //~ if (wasShowingChildren) {
            //~ me.properties[key].logItem.setShowChildren(wasShowingChildren);
        //~ }
        //~ if (me.properties[key].logItem.setAutoUpdate) {
            //~ me.properties[key].logItem.setAutoUpdate(!!me.autoUpdateInterval);
        //~ }
        //~ propertyValueElement.appendChild(me.properties[key].element);
        //~ blinkProperty(key);
    //~ }
    
    //~ function updateAddedProperty(key) {
        //~ me.keys.push(key);
        //~ me.createProperty(key);
        //~ me.setPropertyStackMode(key);
        //~ if (!me.methodsVisible && typeof me.value[key] == 'function') {
            //~ me.properties[key].element.style.display = 'none';
        //~ } else { // the property will be visible and the last, update the lastVisibleProperty
            //~ if (me.lastVisibleProperty) {
                //~ me.lastVisibleProperty.commaSpan.style.display = '';
            //~ }
            //~ me.properties[key].commaSpan.style.display = 'none';
            //~ me.lastVisibleProperty = me.properties[key];
            //~ blinkProperty(key);
        //~ }
        //~ if (me.properties[key].logItem.setAutoUpdate) {
            //~ me.properties[key].logItem.setAutoUpdate(!!me.autoUpdateInterval);
        //~ }
        //~ me.propertiesSpan.appendChild(me.properties[key].element);
    //~ }
    
    //~ function updateRemovedProperty(key) {
        //~ if (me.properties[key].blinkTimeout) {
            //~ clearTimeout(me.properties[key].blinkTimeout);
        //~ }
        //~ var property = me.properties[key];
        //~ if (property.logItem.onRemove) {
            //~ property.logItem.onRemove();
        //~ }
        //~ me.keys.splice(LOG.indexOf(me.keys, key), 1);
        //~ property.propertyValueElement.style.backgroundColor = 'yellow';
        //~ property.labelElement.style.backgroundColor = 'yellow';
        //~ property.propertyValueElement.style.textDecoration = 'line-through';
        //~ property.labelElement.style.textDecoration = 'line-through';
        
        //~ setTimeout(
            //~ function() {
                //~ me.propertiesSpan.removeChild(property.element);
                //~ if (me.lastVisibleProperty == property) {
                    //~ me.lastVisibleProperty = null;
                    //~ for (var i = me.keys.length - 1; i >= 0; --i) {
                        //~ if (me.properties[me.keys[i]].element.style.display != 'none') {
                            //~ me.lastVisibleProperty = me.properties[me.keys[i]];
                            //~ me.lastVisibleProperty.commaSpan.style.display = 'none';
                            //~ break;
                        //~ }
                    //~ }
                //~ }
            //~ }, 1000
        //~ );
    //~ }
    
    //~ var diffs = LOG.getObjectDifferences(this.oldValue, this.value);
    //~ for (var i = 0; i < diffs.changedKeys.length; ++i) {
        //~ updateChangedProperty(diffs.changedKeys[i]);
    //~ }
    //~ for (var i = 0; i < diffs.addedKeys.length; ++i) {
        //~ updateAddedProperty(diffs.addedKeys[i]);
    //~ }
    //~ for (var i = 0; i < diffs.removedKeys.length; ++i) {
        //~ updateRemovedProperty(diffs.removedKeys[i]);
    //~ }
    //~ this.oldValue = LOG.shallowClone(this.value);
//~ }

//~ LOG.ObjectLogItem.prototype.onRemove = function() {
    //~ this.setAutoUpdate(false);
//~ }

//~ LOG.ObjectLogItem.prototype.toggleAutoUpdate = function() {
    //~ this.setAutoUpdate(!this.autoUpdateInterval);
//~ }

//~ LOG.ObjectLogItem.prototype.setAutoUpdate = function(enabled) {
    //~ if (!!this.autoUpdateInterval == enabled) {
       //~ return;
    //~ }
    //~ if (!this.showingChildren) {
        //~ this.wasAutoUpdating = enabled;
        //~ return;
    //~ }
    //~ if (this.autoUpdateInterval) {
        //~ clearInterval(this.autoUpdateInterval);
        //~ this.autoUpdateInterval = null;
        //~ this.updateLink.firstChild.nodeValue = '\u21ba';
        //~ this.updateLink.style.backgroundColor = '';
    //~ } else {
        //~ var me = this;
        //~ this.autoUpdateInterval = setInterval(
            //~ function() {
                //~ me.updateAndMarkDifferences()
            //~ },
            //~ 100
        //~ );
        //~ this.updateLink.firstChild.nodeValue = '\u21bb';
        //~ this.updateLink.style.backgroundColor = '#af5';
    //~ }
    //~ for (var property in this.properties) {
        //~ if (this.properties[property].logItem.setAutoUpdate) {
            //~ this.properties[property].logItem.setAutoUpdate(enabled);
        //~ }
    //~ }
//~ }

//~ LOG.ObjectLogItem.prototype.setPropertyStackMode = function(key) {
    //~ this.properties[key].element.style.marginLeft = this.currentStackedMode ? '2em' : '0';
    //~ if (this.methodsVisible || typeof this.value[key] != 'function') {
        //~ this.properties[key].element.style.display = this.currentStackedMode ? 'block' : 'inline';
    //~ }
//~ }

//~ LOG.ObjectLogItem.prototype.setStackedMode = function(stacked, applyToChildren) {
    //~ if (this.currentStackedMode == stacked) {
        //~ return;
    //~ }
    //~ var text, margin;
    //~ this.currentStackedMode = stacked;
    //~ for (var key in this.properties) {
        //~ this.setPropertyStackMode(key);
        //~ if (applyToChildren && this.properties[key].logItem.setStackedMode) {
            //~ this.properties[key].logItem.setStackedMode(stacked, applyToChildren);
        //~ }
    //~ }
    //~ if (stacked) {
        //~ this.stackedToggleLink.firstChild.nodeValue = '\u25bc';
    //~ } else {
        //~ this.stackedToggleLink.firstChild.nodeValue = '\u25ba';
    //~ }
//~ }

//~ LOG.ObjectLogItem.prototype.toggleStackedMode = function(applyToChildren) {
    //~ this.setStackedMode(!this.currentStackedMode, applyToChildren);
//~ }

//~ LOG.ObjectLogItem.prototype.toggleMethodsVisible = function() {
    //~ this.methodsVisible = !this.methodsVisible;
    //~ var key;
    //~ if (this.lastVisibleProperty) {
        //~ this.lastVisibleProperty.commaSpan.style.display = '';
    //~ }
    //~ this.lastVisibleProperty = null;
    //~ for (var i = 0; i < this.keys.length; ++i) {
        //~ key = this.keys[i];
        //~ this.setPropertyStackMode(key);
        //~ if (this.methodsVisible || typeof this.value[key] != 'function') {
            //~ this.lastVisibleProperty = this.properties[key]; // always the last
            //~ this.properties[key].element.style.display = this.currentStackedMode ? 'block' : 'inline';
        //~ } else {
            //~ this.properties[key].element.style.display = 'none';
        //~ }
    //~ }
    //~ this.lastVisibleProperty.commaSpan.style.display = 'none';
    //~ if (this.methodsVisible) {
        //~ this.toggleMethodsLink.firstChild.nodeValue = '-';
    //~ } else {
        //~ this.toggleMethodsLink.firstChild.nodeValue = '+';
    //~ }
//~ }

//~ LOG.ObjectLogItem.prototype.expandProperty = function(pathToProperty) {
    //~ var property = pathToProperty.shift().name;
    //~ if (typeof this.value[property] == 'function') {
        //~ this.toggleMethodsVisible(true);
    //~ }
    //~ this.setShowChildren(true);
    //~ if (pathToProperty.length == 0) {
        //~ return this.properties[property].logItem;
    //~ } else {
        //~ if (this.properties[property].logItem.expandProperty) {
            //~ return this.properties[property].logItem.expandProperty(pathToProperty);
        //~ }
    //~ }
//~ }
//~ // BEGIN init.js
//~ LOG.getDefaultHtml = function(onload) {
    //~ LOG.onHtmlLoadFunction = onload;
    //~ return '<html><head><link rel="stylesheet" type="text/css" href="' + LOG.url + 'style.css"></head><body><script type="text/javascript">(top.LOG ? top.LOG : opener.LOG).onHtmlLoadFunction();</script></body></html>';
//~ }

//~ LOG.logRunner = new LOG.LogRunner(document);

//~ LOG.loaded = true;
//~ // END init.js
