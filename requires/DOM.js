// ==UserScript==
// @name                  DOM Tools
// @namespace       Beastx
// @description        DOM Tools
// @include               http://*.ikariam.com/*
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
//
// ==/UserScript==

function New(classRef, constructorArgs) {
    var obj = new classRef;
    obj.classRef = classRef;
    if (constructorArgs) {
        obj.init.apply(obj, constructorArgs);
    } else if (obj.init) {
        obj.init();
    }
    return obj;
}

function $(id) {
    return document.getElementById(id);
}

function $$(selector, parentElement) {
  if (!document.getElementsByTagName) {
    return new Array();
  }
  var parent = parentElement? parentElement : document;
  var tokens = selector.split(' ');
  var currentContext = new Array(parent);
  for (var i = 0; i < tokens.length; i++) {
    token = tokens[i].replace(/^\s+/,'').replace(/\s+$/,'');
    if (token.indexOf('#') > -1) {
      var bits = token.split('#');
      var tagName = bits[0];
      var id = bits[1];
      var element = parent.getElementById(id);
      if (tagName && element.nodeName.toLowerCase() != tagName) {
        return new Array();
      }
      currentContext = new Array(element);
      continue; // Skip to next token
    }
    if (token.indexOf('.') > -1) {
      var bits = token.split('.');
      var tagName = bits[0];
      var className = bits[1];
      if (!tagName) {
        tagName = '*';
      }
      var found = new Array;
      var foundCount = 0;
      for (var h = 0; h < currentContext.length; h++) {
        var elements;
        if (tagName == '*') {
            elements = currentContext[h].childNodes;
        } else {
            elements = currentContext[h].getElementsByTagName(tagName);
        }
        for (var j = 0; j < elements.length; j++) {
          found[foundCount++] = elements[j];
        }
      }
      currentContext = new Array;
      var currentContextIndex = 0;
      for (var k = 0; k < found.length; k++) {
        if (found[k].className && found[k].className.match(new RegExp('\\b'+className+'\\b'))) {
          currentContext[currentContextIndex++] = found[k];
        }
      }
      continue; // Skip to next token
    }
    if (token.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)) {
      var tagName = RegExp.$1;
      var attrName = RegExp.$2;
      var attrOperator = RegExp.$3;
      var attrValue = RegExp.$4;
      if (!tagName) {
        tagName = '*';
      }
      // Grab all of the tagName elements within current context
      var found = new Array;
      var foundCount = 0;
      for (var h = 0; h < currentContext.length; h++) {
        var elements;
        if (tagName == '*') {
            elements = getAllChildren(currentContext[h]);
        } else {
            elements = currentContext[h].getElementsByTagName(tagName);
        }
        for (var j = 0; j < elements.length; j++) {
          found[foundCount++] = elements[j];
        }
      }
      currentContext = new Array;
      var currentContextIndex = 0;
      var checkFunction; // This function will be used to filter the elements
      switch (attrOperator) {
        case '=': // Equality
          checkFunction = function(e) { return (e.getAttribute(attrName) == attrValue); };
          break;
        case '~': // Match one of space seperated words 
          checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('\\b'+attrValue+'\\b'))); };
          break;
        case '|': // Match start with value followed by optional hyphen
          checkFunction = function(e) { return (e.getAttribute(attrName).match(new RegExp('^'+attrValue+'-?'))); };
          break;
        case '^': // Match starts with value
          checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) == 0); };
          break;
        case '$': // Match ends with value - fails with "Warning" in Opera 7
          checkFunction = function(e) { return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length); };
          break;
        case '*': // Match ends with value
          checkFunction = function(e) { return (e.getAttribute(attrName).indexOf(attrValue) > -1); };
          break;
        default :
          checkFunction = function(e) { return e.getAttribute(attrName); };
      }
      currentContext = new Array;
      var currentContextIndex = 0;
      for (var k = 0; k < found.length; k++) {
        if (checkFunction(found[k])) {
          currentContext[currentContextIndex++] = found[k];
        }
      }
      continue; // Skip to next token
    }
    tagName = token;
    var found = new Array;
    var foundCount = 0;
    for (var h = 0; h < currentContext.length; h++) {
      var elements = currentContext[h].getElementsByTagName(tagName);
      for (var j = 0; j < elements.length; j++) {
        found[foundCount++] = elements[j];
      }
    }
    currentContext = found;
  }
  return currentContext;
}

function getQueryString(ji, fromString) {
    hu = fromString ? fromString : window.location.search.substring(1);
    gy = hu.split("&");
    for (i=0;i<gy.length;i++) {
        ft = gy[i].split("=");
        if (ft[0] == ji) {
            return ft[1];
        }
    }
    return null;
}




DOM = {};
    
DOM.xpath = function(query) {
    return document.evaluate(query, document, null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

DOM.getNode = function(path) {
    var node = DOM.xpath(path);
    if (node.snapshotLength == 1) {
        return node.snapshotItem(0);
    }
    return null;
}

DOM.getNodeValue = function(path, defaultValue, forceToUseTextContent) {
    var node = DOM.getNode(path);
    if (node != null) {
        if (node.value && !forceToUseTextContent) {
            return node.value;
        } else {
            return node.textContent;
        }
    }
    return defaultValue;
}

DOM.getNodes = function(query) {
    return document.evaluate(query, document, null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
};

DOM.getFirstNode = function(path) {
    var value = this.getNodes(path);
    if (value.snapshotLength == 1) {
        return value.snapshotItem(0);
    }
    return null;
};

DOM.getFirstNodeValue = function(path, defaultValue) {
    var value = this.getFirstNode(path);
    if (value != null) {
        return value.value;
    }
    else return defaultValue;
};

DOM.getFirstNodeTextContent = function(path, defaultValue) {
    var value = this.getFirstNode(path);
    if (value != null) {
        return value.textContent;
    }
    else return defaultValue;
};

DOM.createCaller = function(object, methodName, params) {
    var f;
    if (params) {
        f = function() {
            if (!object[methodName]) {
                debugger;
            }
            return object[methodName].apply(object, params);
        }
    } else {
        f = function() {
            if (!object[methodName]) {
                debugger;
            }
            return object[methodName].apply(object, arguments);
        }
    }
    return f;
};

DOM.createElement = function(tagName, attributes, childNodes) {
    var element = document.createElement(tagName);
    
    if (attributes) {
        for (var attribute in attributes) {
            type = typeof attributes[attribute];
            if (type == 'function') {
                if (attribute.substr(0, 2) != 'on') {
                    throw new Error('function attributes must begin with on');
                }
                DOM.addListener(element, attribute.substr(2), attributes[attribute]);
            } else if (type == 'boolean') {
                element[attribute] = attributes[attribute];
            } else if (attribute == 'style' && typeof attributes[attribute] == 'object') {
                styleProperties = attributes[attribute];
                for (item in styleProperties) {
                    if (styleProperties[item] !== null) {
                        element.style[item] = styleProperties[item];
                    }
                }
            } else if (attribute == 'class') {
                element.className = attributes[attribute];
            } else if (attributes[attribute] === null) {
                continue;
            } else if (tagName != 'input' || (attributes[attribute] != 'type' && attributes[attribute] != 'name')) {
                element.setAttribute(attribute, attributes[attribute]);
            }
        }
    }
    
    if (childNodes) {
        for (var i = 0; i < childNodes.length; ++i) {
            if (childNodes[i]) {
                if (typeof childNodes[i] == 'string' || typeof childNodes[i] == 'number') {
                    element.appendChild(document.createTextNode(childNodes[i]));
                } else if (childNodes[i].nodeType == 1) {
                    element.appendChild(childNodes[i]);
                } else {
                    if (Beastx.debugMode) {
                        Beastx.log('falta implementar otros tipos de datos en core.js createElement');
                    }
                }
            }
        }
    }
    return element;
};

DOM.addListener = function(element, eventString, caller) {
    element.addEventListener(eventString, caller, true);
};

DOM.post = function(url, data, onLoadCallback) {
    if (Beastx.debugMode) {
        Beastx.log(url + '?className=' + data.className + '&action=' + data.action + '&params=' + VAR.serializeObject(data.params));
    }
    GM_xmlhttpRequest({
        url: url + '?className=' + data.className + '&action=' + data.action + '&params=' + encodeURI(VAR.serializeObject(data.params)),
        method: 'POST',
        headers: {
            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
            'Accept': 'application/atom+xml,application/xml,text/xml',
            'Content-type':'application/x-www-form-urlencoded'
        },
        onload: function(xhr) {
            if (onLoadCallback) {
                onLoadCallback(eval('response=' + xhr.responseText.replace(/^\s*|\s*$/g,"")));
            }
        }
    });
}

DOM.hasClass = function(element, className) {
    return !!element.className && VAR.hasWord(element.className, className)
}

DOM.addClass = function(element, className) {
    element.className = VAR.addWord(element.className, className)
}

DOM.removeClass = function(element, className) {
    element.className = VAR.removeWord(element.className, className)
}

DOM.toggleClass = function(element, className) {
    if (DOM.hasClass(element, className)) {
        DOM.removeClass(element, className);
    } else {
        DOM.addClass(element, className);
    }
}

DOM.setHasClass = function(element, className, addIfTrueRemoveIfFalse) {
    if (addIfTrueRemoveIfFalse) {
        DOM.addClass(element, className);
    } else {
        DOM.removeClass(element, className);
    }
}

DOM.preventDefault = function(event) {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
}

DOM.stopPropagation = function(event) {
    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.cancelBubble = true;
    }
}

DOM.cancelEvent = function(event) {
    this.preventDefault(event);
    this.stopPropagation(event);
}