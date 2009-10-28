// ==UserScript==
// @name                  VAR Tools
// @version               0.1
// @author                Beastx
//
// @history                0.1 Initial release
//
// ==/UserScript==

VAR = {};
    
VAR.whitespaceCharacters = " \t\n\r";

VAR.isNumber = function(s, min, max) {
    var n = Number(s);
    return !VAR.isWhitespace(s) &&
        !isNaN(n) &&
        (min === undefined || n >= min) &&
        (max === undefined || n <= max)
    ;
}

VAR.isWhitespace = function(s) {
    for (var i = 0; i < s.length; ++i) {
        if (VAR.whitespaceCharacters.indexOf(s.charAt(i)) == -1) {
            return false;
        }
    }
    return true;
}

VAR.isArray = function(a) {
    return typeof a == 'object' && a.constructor == Array;
}

VAR.trim = function(s) {
    var i;
    for (i = 0; i < s.length; ++i) {
        if (VAR.whitespaceCharacters.indexOf(s.charAt(i)) == -1) {
            break;
        }
    }
    s = s.substr(i);
    for (i=s.length; i > 0; --i) {
        if (VAR.whitespaceCharacters.indexOf(s.charAt(i)) == -1) {
            break;
        }
    }
    s = s.substr(0, i + 1);
    return s;
}

// Returns a string with no whitespaces
VAR.removeAllWhitespace = function(s) {
    var tmp = '';
    for (var i = s.length; i > 0; --i) {
        var c = s.charAt(i);
        if (VAR.whitespaceCharacters.indexOf(c) == -1) {
            tmp += c;
        }
    }
    return tmp;
}

VAR.addWord = function(str, word) {
    if (VAR.hasWord(str, word)) {
        return str;
    } else {
        return str + ' ' + word;
    }
}

VAR.splitBySpaces = function(str) {
    var words = [];
    var start = 0, end;
    while (true) {
        end = str.indexOf(' ', start);
        if (end != -1) {
            if (end > start) {
                words.push(str.substring(start, end));
            }
            start = end + 1;
        } else {
            if (str.length > start) {
                words.push(str.substring(start));
            }
            return words;
        }
    }
}

VAR.getUncamelized = function(str) {
    var newStr = '';
    for (var i=0; i < str.length; ++i) {
        if (str.charAt(i) == str.charAt(i).toUpperCase()) {
            newStr += ' ' + str.charAt(i).toLowerCase();
        } else {
            newStr += str.charAt(i);
        }
    }
    return VAR.ucfirst(newStr);
}

VAR.removeWord = function(str, word) {
    var str2 = '', c = 0;
    var list = VAR.splitBySpaces(str);
    for (var i = 0; i < list.length; ++i) {
        if (list[i] != word) {
            if (c) {
                str2 += ' ';
            }
            str2 += list[i];
            ++c;
        }
    }
    return str2;
}

VAR.hasWord = function(str, word) {
    var words = [];
    var start = 0, end;
    while (true) {
        end = str.indexOf(' ', start);
        if (end != -1) {
            if (end > start) {
                if (word == str.substring(start, end)) {
                    return true;
                }
            }
            start = end + 1;
        } else {
            if (str.length > start) {
                if (word == str.substring(start)) {
                    return true;
                }
            }
            return false;
        }
    }
}

VAR.endsWith = function(complete_string, part) {
    var pos = complete_string.length - part.length;
    if (complete_string.substr(pos) == part) {
        return complete_string.substr(0, pos);
    } else {
        return false;
    }
}

VAR.startsWith = function(complete_string, part) {
    if (complete_string.substr(0, part.length) == part) {
        return complete_string.substr(part.length);
    } else {
        return false;
    }
}

// Removes an element from an array (it returns true if the element was there)
VAR.remove = function(arr, item) {
    var index = VAR.indexOf(arr, item);
    if (index == -1) {
        return false;
    } else {
        arr.splice(index, 1);
        return true;
    }
}
// Ensures an element is present on an array depending on the "contains" argument
//  if returns contains == true it returns the index of the item, otherwise it returns true of it was there or false if it wasn't
VAR.setContains = function(arr, item, contains) {
    var index = VAR.indexOf(arr, item);
    var isContained = index != -1;
    if (isContained == contains) {
        return index;
    }
    if (contains) {
        arr.push(item);
        return arr.length - 1;
    } else {
        return VAR.remove(arr, item);
    }
}

VAR.forEach = function(list, callback) {
    for (var i = 0; i < list.length; ++i) {
        callback(list[i]);
    }
}

VAR.covertStringToCamelCase = function(stringVar) {
    var wordArray = stringVar.split(' ');
    var returnString = '';
    for (var i = 0; i < wordArray.length; ++i) {
        returnString += VAR.ucfirst(wordArray[i]);
    }
    return returnString;
}

VAR.serialize = function(object) {
    return JSN.serialize(object);
}

VAR.unserialize = function(string) {
    return JSN.unserialize(string);
}

VAR.serializeObject = function(object) {
    var returnString = '';
    for (var i in object) {
        if (returnString != '') {
            returnString += ',';
        } else {
            if (object.length) {
                returnString += '[';
            } else {
                returnString += '{';
            }
        }
        if (!object.length) {
            returnString += '"' + i + '":';
        }
        if (typeof object[i] == 'object') {
            returnString += VAR.serializeObject(object[i]);
        } else if (typeof object[i] == 'string' || typeof object[i] == 'number') {
            returnString += '"' + object[i] + '"';
        }
    }
    if (returnString != '') {
        if (object.length) {
            returnString += ']';
        } else {
            returnString += '}';
        }
    } else {
        returnString += '""';
    }
    return returnString;
}

