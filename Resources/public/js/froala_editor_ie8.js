// https://github.com/inexorabletash/polyfill/blob/master/es5.js
// ES5 15.4.4.14 Array.prototype.indexOf ( searchElement [ , fromIndex ] )
// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
    if (this === void 0 || this === null) { throw TypeError(); }
    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) { return -1; }
    var n = 0;
    if (arguments.length > 0) {
      n = Number(arguments[1]);
      if (isNaN(n)) {
        n = 0;
      } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) { return -1; }
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}

// ES5 15.5.4.20 String.prototype.trim()
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return String(this).replace(/^\s+/, '').replace(/\s+$/, '');
  };
}

if (!Object.keys) {
  Object.keys = function (obj) {
    var keys = [];

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        keys.push(i);
      }
    }

    return keys;
  };
}

/* jshint ignore:start */
var Node = Node || {
  ELEMENT_NODE: 1,
  ATTRIBUTE_NODE: 2,
  TEXT_NODE: 3
};
/* jshint ignore:end */

$.Editable.prototype.saveSelection = function () {
  var sel = window.document.selection;
  this.savedSelection = (sel.type != 'None') ? sel.createRange() : null;
};

$.Editable.prototype.restoreSelection = function () {
  if (!this.selectionDisabled) {
    if (this.savedSelection) {
      this.savedSelection.select();
    }
  }
};

$.Editable.prototype.getSelectionTextInfo = function () {
  return false;
};

$.Editable.DEFAULTS.blockTags = {
  n: 'Normal',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6'
};
