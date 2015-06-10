/*!
 * froala_editor v1.2.7 (https://www.froala.com/wysiwyg-editor)
 * License https://www.froala.com/wysiwyg-editor/terms
 * Copyright 2014-2015 Froala Labs
 */

if (typeof jQuery === "undefined") { throw new Error("Froala requires jQuery") }

/*jslint browser: true, debug: true, vars: true, devel: true, expr: true, jQuery: true */

!function ($) {
  'use strict';

  // EDITABLE CLASS DEFINITION
  // =========================

  var Editable = function (element, options) {
    // Set options
    this.options = $.extend({}, Editable.DEFAULTS, $(element).data(), typeof options == 'object' && options);

    // Do not initialize on unsupported browsers.
    if (this.options.unsupportedAgents.test(navigator.userAgent)) return false;

    // Set valid nodes.
    this.valid_nodes = $.merge([], Editable.VALID_NODES);
    this.valid_nodes = $.merge(this.valid_nodes, $.map(Object.keys(this.options.blockTags), function (val) {
      return val.toUpperCase();
    }));

    // Find out browser
    this.browser = Editable.browser();

    // List of disabled options.
    this.disabledList = [];

    this._id = ++Editable.count;

    this._events = {};

    this.blurred = true;

    this.$original_element = $(element);

    this.document = element.ownerDocument;
    this.window = 'defaultView' in this.document ? this.document.defaultView : this.document.parentWindow;
    this.$document = $(this.document);
    this.$window = $(this.window);

    if (this.browser.msie && $.Editable.getIEversion() <= 10) {
      this.br = '';
    } else {
      this.br = '<br/>';
    }

    this.init(element);

    $(element).on('editable.focus', $.proxy(function () {
      for (var i = 1; i <= $.Editable.count; i++) {
        if (i != this._id) {
          this.$window.trigger('blur.' + i);
        }
      }
    }, this));
  };

  Editable.initializers = [];

  Editable.count = 0;

  Editable.VALID_NODES = ['P', 'DIV', 'LI', 'TD', 'TH'];

  Editable.LANGS = [];

  Editable.INVISIBLE_SPACE = '&#x200b;';

  Editable.DEFAULTS = {
    allowComments: true,
    allowScript: false,
    allowStyle: false,
    allowedAttrs: ['accept', 'accept-charset', 'accesskey', 'action', 'align', 'alt', 'async', 'autocomplete', 'autofocus', 'autoplay', 'autosave', 'background', 'bgcolor', 'border', 'charset', 'cellpadding', 'cellspacing', 'checked', 'cite', 'class', 'color', 'cols', 'colspan', 'content', 'contenteditable', 'contextmenu', 'controls', 'coords', 'data', 'data-.*', 'datetime', 'default', 'defer', 'dir', 'dirname', 'disabled', 'download', 'draggable', 'dropzone', 'enctype', 'for', 'form', 'formaction', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'http-equiv', 'icon', 'id', 'ismap', 'itemprop', 'keytype', 'kind', 'label', 'lang', 'language', 'list', 'loop', 'low', 'max', 'maxlength', 'media', 'method', 'min', 'multiple', 'name', 'novalidate', 'open', 'optimum', 'pattern', 'ping', 'placeholder', 'poster', 'preload', 'pubdate', 'radiogroup', 'readonly', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'scoped', 'scrolling', 'seamless', 'selected', 'shape', 'size', 'sizes', 'span', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'summary', 'spellcheck', 'style', 'tabindex', 'target', 'title', 'type', 'translate', 'usemap', 'value', 'valign', 'width', 'wrap'],
    allowedTags: ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'queue', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'],
    alwaysBlank: false,
    alwaysVisible: false,
    autosave: false,
    autosaveInterval: 10000,
    beautifyCode: true,
    blockTags: {
      n: 'Normal',
      blockquote: 'Quote',
      pre: 'Code',
      h1: 'Heading 1',
      h2: 'Heading 2',
      h3: 'Heading 3',
      h4: 'Heading 4',
      h5: 'Heading 5',
      h6: 'Heading 6'
    },
    buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'fontSize', 'fontFamily', 'color', 'sep',
      'formatBlock', 'blockStyle', 'align', 'insertOrderedList', 'insertUnorderedList', 'outdent', 'indent', 'sep',
      'createLink', 'insertImage', 'insertVideo', 'insertHorizontalRule', 'undo', 'redo', 'html'
    ],
    crossDomain: true,
    convertMailAddresses: true,
    customButtons: {},
    customDropdowns: {},
    customText: false,
    defaultTag: 'P',
    direction: 'ltr',
    disableRightClick: false,
    editInPopup: false,
    editorClass: '',
    formatTags: ['p', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'ul', 'ol', 'li', 'table', 'tbody', 'thead', 'tfoot', 'tr', 'th', 'td', 'body', 'head', 'html', 'title', 'meta', 'link', 'base', 'script', 'style'],
    headers: {},
    height: 'auto',
    icons: {}, // {cmd: {type: 'x', value: 'y'}}
    inlineMode: true,
    initOnClick: false,
    fullPage: false,
    language: 'en_us',
    linkList: [],
    linkText: false,
    linkClasses: {},
    linkAttributes: {},
    linkAutoPrefix: '',
    maxHeight: 'auto',
    minHeight: 'auto',
    multiLine: true,
    noFollow: true,
    paragraphy: true,
    placeholder: 'Type something',
    plainPaste: false,
    preloaderSrc: '',
    saveURL: null,
    saveParam: 'body',
    saveParams: {},
    saveRequestType: 'POST',
    scrollableContainer: 'body',
    simpleAmpersand: false,
    shortcuts: true,
    shortcutsAvailable: ['show', 'bold', 'italic', 'underline', 'createLink', 'insertImage', 'indent',  'outdent', 'html', 'formatBlock n', 'formatBlock h1', 'formatBlock h2', 'formatBlock h3', 'formatBlock h4', 'formatBlock h5', 'formatBlock h6', 'formatBlock blockquote', 'formatBlock pre', 'strikeThrough'],
    showNextToCursor: false,
    spellcheck: false,
    theme: null,
    toolbarFixed: true,
    trackScroll: false,
    unlinkButton: true,
    useClasses: true,
    tabSpaces: true,
    typingTimer: 500,
    pastedImagesUploadRequestType: 'POST',
    pastedImagesUploadURL: 'http://i.froala.com/upload_base64',
    unsupportedAgents: /Opera Mini/i,
    useFrTag: false,
    width: 'auto',
    withCredentials: false,
    zIndex: 2000
  };

  /**
   * Destroy editable object.
   */
  Editable.prototype.destroy = function () {
    this.sync();

    if (this.options.useFrTag) this.addFrTag();

    this.hide();

    if (this.isHTML) {
      this.html();
    }

    if (this.$bttn_wrapper) {
      this.$bttn_wrapper.html('').removeData().remove();
    }

    if (this.$editor) {
      this.$editor.html('').removeData().remove();
    }

    this.raiseEvent('destroy');

    if (this.$popup_editor) {
      this.$popup_editor.html('').removeData().remove();
    }

    if (this.$placeholder) {
      this.$placeholder.html('').removeData().remove();
    }

    clearTimeout(this.ajaxInterval);
    clearTimeout(this.typingTimer);

    // Off element events.
    this.$element.off('mousedown mouseup click keydown keyup cut copy paste focus keypress touchstart touchend touch drop');
    this.$element.off('mousedown mouseup click keydown keyup cut copy paste focus keypress touchstart touchend touch drop', '**');

    // Off window events.
    this.$window.off('mouseup.' + this._id);
    this.$window.off('keydown.' + this._id);
    this.$window.off('keyup.' + this._id);
    this.$window.off('blur.' + this._id);
    this.$window.off('hide.' + this._id);
    this.$window.off('scroll.' + this._id);
    this.$window.off('resize.' + this._id);
    this.$window.off('orientationchange.' + this._id);

    // Off document events.
    this.$document.off('selectionchange.' + this._id);

    // Off editor events.
    this.$original_element.off('editable');

    if (this.$upload_frame !== undefined) {
      this.$upload_frame.remove();
    }

    if (this.$textarea) {
      this.$box.remove();
      this.$textarea.removeData('fa.editable');
      this.$textarea.show();
    }

    // Remove events.
    for (var k in this._events) {
      delete this._events[k];
    }

    if (this.$placeholder) this.$placeholder.remove();

    if (!this.isLink) {
      if (this.$wrapper) {
        this.$wrapper.replaceWith(this.getHTML(false, false))
      }
      else {
        this.$element.replaceWith(this.getHTML(false, false));
      }

      if (this.$box && !this.editableDisabled) {
        this.$box.removeClass('froala-box f-rtl');
        this.$box.find('.html-switch').remove();
        this.$box.removeData('fa.editable');
        clearTimeout(this.typingTimer);
      }
    } else {
      this.$element.removeData('fa.editable');
    }

    if (this.$lb) this.$lb.remove();
  };

  /**
   * Set callbacks.
   *
   * @param event - Event name
   * @param data - Data to pass to the callback.
   * @param sync - Do a sync after calling the callback.
   */
  Editable.prototype.triggerEvent = function (event, data, sync, cleanify) {
    if (sync === undefined) sync = true;
    if (cleanify === undefined) cleanify = false;

    // Will break image resize if does sync.
    if (sync === true) {
      if (!this.isResizing() && !this.editableDisabled && !this.imageMode && cleanify) {
        this.cleanify();
      }

      this.sync();
    }

    var resp = true;

    if (!data) data = [];
    resp = this.$original_element.triggerHandler('editable.' + event, $.merge([this], data));

    if (resp === undefined) {
      return true;
    }

    return resp;
  };

  /**
   * Sync style when fullPage is enabled.
   */
  Editable.prototype.syncStyle = function () {
    if (this.options.fullPage) {
      var matches = this.$element.html().match(/\[style[^\]]*\].*\[\/style\]/gi);
      this.$document.find('head style[data-id]').remove();
      if (matches) {
        for (var i = 0; i < matches.length; i++) {
          this.$document.find('head').append(matches[i].replace(/\[/gi, '<').replace(/\]/gi, '>'))
        }
      }
    }
  }

  /**
   * Sync between textarea and content.
   */
  Editable.prototype.sync = function () {
    if (!this.isHTML) {
      this.raiseEvent('sync');

      this.disableImageResize();

      // Check placeholder.
      if (!this.isLink && !this.isImage) {
        this.checkPlaceholder();
      }

      // Check if content has changed.
      var html = this.getHTML();

      if (this.trackHTML !== html && this.trackHTML != null) {
        this.refreshImageList();
        this.refreshButtons();
        this.trackHTML = html;

        // Set textarea value.
        if (this.$textarea) {
          this.$textarea.val(html);
        }

        // Save in undo stack.
        if (!this.doingRedo) this.saveUndoStep();

        this.triggerEvent('contentChanged', [], false);
      }

      else if (this.trackHTML == null) {
        this.trackHTML = html;
      }

      this.syncStyle();
    }
  };

  /**
   * Check if the element passed as argument is empty or not.
   *
   * @param element - Dom Object.
   */
  Editable.prototype.emptyElement = function (element) {
    if (element.tagName == 'IMG' || $(element).find('img').length > 0) {
      return false;
    }

    if ($(element).find('input, iframe, object').length > 0) {
      return false;
    }

    var text = $(element).text();

    for (var i = 0; i < text.length; i++) {
      if (text[i] !== '\n' && text[i] !== '\r' && text[i] !== '\t' && text[i].charCodeAt(0) != 8203) {
        return false;
      }
    }

    return true;
  };

  Editable.prototype.initEvents = function () {
    if (this.mobile()) {
      this.mousedown = 'touchstart';
      this.mouseup = 'touchend';
      this.move = 'touchmove';
    }
    else {
      this.mousedown = 'mousedown';
      this.mouseup = 'mouseup';
      this.move = '';
    }

  }

  Editable.prototype.initDisable = function () {
    this.$element.on('keypress keydown keyup', $.proxy(function (e) {
      if (this.isDisabled) {
        e.stopPropagation();
        e.preventDefault();

        return false;
      }
    }, this));
  }

  Editable.prototype.continueInit = function () {
    this.initDisable();

    this.initEvents();

    this.browserFixes();

    this.handleEnter();

    if (!this.editableDisabled) {
      this.initUndoRedo();

      this.enableTyping();

      this.initShortcuts();
    }

    this.initTabs();

    this.initEditor();

    // Initializers.
    for (var i = 0; i < $.Editable.initializers.length; i++) {
      $.Editable.initializers[i].call(this);
    }

    this.initOptions();

    this.initEditorSelection();

    this.initAjaxSaver();

    this.setLanguage();

    this.setCustomText();

    if (!this.editableDisabled) {
      this.registerPaste();
    }

    this.refreshDisabledState();
    this.refreshUndo();
    this.refreshRedo();

    this.initPopupSubmit();

    this.initialized = true;

    this.triggerEvent('initialized', [], false, false);
  }

  Editable.prototype.initPopupSubmit = function () {
    this.$popup_editor.find('.froala-popup input').keydown(function (e) {
      var keyCode = e.which;
      if (keyCode == 13) {
        e.preventDefault();
        e.stopPropagation();
        $(this).blur();
        $(this).parents('.froala-popup').find('button.f-submit').click();
      }
    });
  }

  Editable.prototype.lateInit = function () {
    // this.$element.attr('contenteditable', false);
    this.saveSelectionByMarkers();
    this.continueInit();
    this.restoreSelectionByMarkers();
    this.$element.focus();

    this.hideOtherEditors();
  }

  /**
   * Init.
   *
   * @param element - The element on which to set editor.
   */
  Editable.prototype.init = function (element) {
    if (!this.options.paragraphy) this.options.defaultTag = 'DIV';

    if (this.options.allowStyle) this.setAllowStyle();
    if (this.options.allowScript) this.setAllowScript();

    this.initElement(element);

    this.initElementStyle();

    if (!this.isLink || this.isImage) {
      this.initImageEvents();

      this.buildImageMove();
    }

    if (this.options.initOnClick) {
      if (!this.editableDisabled) {
        this.$element.attr('contenteditable', true);
        this.$element.attr('spellcheck', false);
      }

      this.$element.bind('mousedown.element focus.element', $.proxy(function (e) {
        if (!this.isLink) e.stopPropagation();
        if (this.isDisabled) return false;

        this.$element.unbind('mousedown.element focus.element');

        if (this.browser.webkit) this.initMouseUp = false;
        this.lateInit();
      }, this))
    }
    else {
      this.continueInit();
    }
  };

  Editable.prototype.phone = function () {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
  }

  // http://detectmobilebrowsers.com
  Editable.prototype.mobile = function () {
    return this.phone() || this.android() || this.iOS() || this.blackberry();
  }

  Editable.prototype.iOS = function () {
    return /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
  }

  Editable.prototype.iOSVersion = function () {
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
      var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
      var version = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
      if (version && version[0]) return version[0];
    }

    return 0;
  }

  Editable.prototype.iPad = function () {
    return /(iPad)/g.test(navigator.userAgent);
  }

  Editable.prototype.iPhone = function () {
    return /(iPhone)/g.test(navigator.userAgent);
  }

  Editable.prototype.iPod = function () {
    return /(iPod)/g.test(navigator.userAgent);
  }

  Editable.prototype.android = function () {
    return /(Android)/g.test(navigator.userAgent);
  }

  Editable.prototype.blackberry = function () {
    return /(Blackberry)/g.test(navigator.userAgent);
  }

  Editable.prototype.initOnTextarea = function (element) {
    this.$textarea = $(element);

    if (this.$textarea.attr('placeholder') !== undefined && this.options.placeholder == 'Type something') {
      this.options.placeholder = this.$textarea.attr('placeholder');
    }

    this.$element = $('<div>').html(this.clean(this.$textarea.val(), true, false));
    this.$textarea.before(this.$element).hide();

    // Before submit textarea do a sync.
    this.$textarea.parents('form').bind('submit', $.proxy(function () {
      if (this.isHTML) {
        this.html();
      } else {
        this.sync();
      }
    }, this));


    // Remove submit event on form.
    this.addListener('destroy', $.proxy(function () {
      this.$textarea.parents('form').unbind('submit');
    }, this));
  }

  Editable.prototype.initOnLink = function (element) {
    this.isLink = true;
    this.options.linkText = true;
    this.selectionDisabled = true;
    this.editableDisabled = true;
    this.options.buttons = [];
    this.$element = $(element);
    this.options.paragraphy = false;
    this.options.countCharacters = false;
    this.$box = this.$element;
  }

  Editable.prototype.initOnImage = function (element) {
    var img_float = $(element).css('float')
    if ($(element).parent().get(0).tagName == 'A') {
      element = $(element).parent()
    }

    this.isImage = true;
    this.editableDisabled = true;
    this.imageList = [];
    this.options.buttons = [];
    this.options.paragraphy = false;
    this.options.imageMargin = 'auto';
    $(element).wrap('<div>');
    this.$element = $(element).parent();
    this.$element.css('display', 'inline-block');
    this.$element.css('max-width', '100%');
    this.$element.css('margin-left', 'auto');
    this.$element.css('margin-right', 'auto');
    this.$element.css('float', img_float);
    this.$element.addClass('f-image');
    this.$box = $(element);
  }

  Editable.prototype.initForPopup = function (element) {
    this.$element = $(element);
    this.$box = this.$element;
    this.editableDisabled = true;
    this.options.countCharacters = false;
    this.options.buttons = [];

    this.$element.on('click', $.proxy(function (e) {
      e.preventDefault();
    }, this));
  }

  Editable.prototype.initOnDefault = function (element) {
    // Remove format block if the element is not a DIV.
    if (element.tagName != 'DIV' && this.options.buttons.indexOf('formatBlock') >= 0) {
      this.disabledList.push('formatBlock');
    }

    this.$element = $(element);
  }

  /**
   * Init element.
   *
   * @param element
   */
  Editable.prototype.initElement = function (element) {
    if (element.tagName == 'TEXTAREA') this.initOnTextarea(element);
    else if (element.tagName == 'A') this.initOnLink(element);
    else if (element.tagName == 'IMG') this.initOnImage(element);
    else if (this.options.editInPopup) this.initForPopup(element);
    else this.initOnDefault(element);

    if (!this.editableDisabled) {
      this.$box = this.$element.addClass('froala-box');
      this.$wrapper = $('<div class="froala-wrapper">');
      this.$element = $('<div>');
      var html = this.$box.html();
      this.$box.html(this.$wrapper.html(this.$element));

      this.$element.on('keyup', $.proxy(function () {
        if (this.$element.find('ul, ol').length > 1) {
          this.cleanupLists();
        }
      }, this))

      this.setHTML(html, true);
    }

    // Drop event.
    this.$element.on('drop', $.proxy(function () {
      setTimeout($.proxy(function () {
        $('html').click();
        this.$element.find('.f-img-wrap').each (function (i, e) {
          if ($(e).find('img').length === 0) {
            $(e).remove();
          }
        })

        this.$element.find(this.options.defaultTag + ':empty').remove();
      }, this), 1);
    }, this));
  };

  /**
   * Trim text.
   */
  Editable.prototype.trim = function (text) {
    text = String(text).replace(/^\s+|\s+$/g, '');

    text = text.replace(/\u200B/gi, '');

    return text;
  };

  /**
   * Unwrap text from editor.
   */
  Editable.prototype.unwrapText = function () {
    if (!this.options.paragraphy) {
      this.$element.find(this.options.defaultTag).each ($.proxy(function (index, elem) {
        if (elem.attributes.length === 0) {
          var $br = $(elem).find('br:last');
          if ($br.length && this.isLastSibling($br.get(0))) {
            $(elem).replaceWith($(elem).html());
          }
          else {
            $(elem).replaceWith($(elem).html() + '<br/>');
          }
        }
      }, this));
    }
  }

  Editable.prototype.wrapTextInElement = function ($element, force_wrap) {
    if (force_wrap === undefined) force_wrap = false;

    var newWrap = [];
    var INSIDE_TAGS = ['SPAN', 'A', 'B', 'I', 'EM', 'U', 'S', 'STRONG', 'STRIKE', 'FONT', 'IMG', 'SUB', 'SUP', 'BUTTON', 'INPUT'];

    var that = this;

    this.no_verify = true;

    var mergeText = function () {
      if (newWrap.length === 0) return false;

      var $div = $('<' + that.options.defaultTag + '>');

      var $wrap_0 = $(newWrap[0]);
      if (newWrap.length == 1 && $wrap_0.attr('class') == 'f-marker') {
        newWrap = []
        return;
      }

      for (var i = 0; i < newWrap.length; i++) {
        var $wrap_obj = $(newWrap[i]);
        $div.append($wrap_obj.clone());
        if (i == newWrap.length - 1) {
          $wrap_obj.replaceWith($div);
        } else {
          $wrap_obj.remove();
        }
      }

      newWrap = [];
    }

    var start_marker = false;
    var end_marker = false;
    var wrap_at_br = false;

    $element
      .contents()
      .filter(function () {
        var $this = $(this);

        if ($this.hasClass('f-marker') || $this.find('.f-marker').length) {
          var $marker = $this;
          if ($this.find('.f-marker').length == 1 || $this.hasClass('f-marker')) {
            if ($this.find('.f-marker').length) $marker = $($this.find('.f-marker')[0]);
            else $marker = $this;

            var $prev = $marker.prev();
            if ($marker.attr('data-type') === 'true') {
              if ($prev.length && $($prev[0]).hasClass('f-marker')) {
                wrap_at_br = true;
              }
              else {
                start_marker = true;
                end_marker = false;
              }
            }
            else {
              end_marker = true;
            }
          }
          else {
            wrap_at_br = true;
          }
        }

        // Check if node is text, not empty and it is an inside tag.
        if ((this.nodeType == Node.TEXT_NODE && $this.text().length > 0) || INSIDE_TAGS.indexOf(this.tagName) >= 0) {
          newWrap.push(this);
        }

        // Empty text. Remove it.
        else if ((this.nodeType == Node.TEXT_NODE && $this.text().length === 0) && that.options.beautifyCode) {
          $this.remove();
        }

        // Merge text so far.
        else {
          if (start_marker || force_wrap || wrap_at_br) {
            if (this.tagName === 'BR') {
              if (newWrap.length > 0) $this.remove();
              else newWrap.push(this);
            }

            mergeText();

            if (end_marker) start_marker = false;

            wrap_at_br = false;
          } else {
            newWrap = [];
          }
        }
      });

    if (start_marker || force_wrap || wrap_at_br) {
      mergeText();
    }

    // Add an invisible character at the end of empty elements.
    $element.find('> ' + this.options.defaultTag).each (function (index, elem) {
      if ($(elem).text().trim().length === 0 &&
        $(elem).find('img').length === 0 &&
        $(elem).find('br').length === 0) {
        $(elem).append(this.br);
      }
    });

    $element.find('div:empty:not([class])').remove();

    if ($element.is(':empty')) {
      if (that.options.paragraphy === true) {
        $element.append('<' + this.options.defaultTag + '>' + this.br + '</' + this.options.defaultTag + '>');
      } else {
        $element.append(this.br);
      }
    }

    this.no_verify = false;
  }

  /**
   * Wrap text from editor.
   */
  Editable.prototype.wrapText = function (force_wrap) {
    // No need to do it if image or link.
    if (this.isImage || this.isLink) {
      return false;
    }

    this.allow_div = true;

    // Remove care of blank spans first.
    this.removeBlankSpans();

    var $elements = this.getSelectionElements();
    for (var i = 0; i < $elements.length; i++) {
      var $element = $($elements[i]);

      if (['LI', 'TH', 'TD'].indexOf($element.get(0).tagName) >= 0) {
        this.wrapTextInElement($element, true);
      }
      else if (this.parents($element, 'li').length) {
        this.wrapTextInElement($(this.parents($element, 'li')[0]), force_wrap);
      }
      else {
        this.wrapTextInElement(this.$element, force_wrap);
      }
    }

    this.allow_div = false;
  };

  Editable.prototype.convertNewLines = function () {
    this.$element.find('pre').each (function (i, pre) {
      var $pre = $(pre);
      var content = $(pre).html();
      if (content.indexOf('\n') >= 0) {
        $pre.html(content.replace(/\n/g, '<br>'));
      }
    });
  }

  /**
   * Set a HTML into the current editor.
   *
   * @param html - The HTML to set.
   * @param sync - Passing false will not sync after setting the HTML.
   */
  Editable.prototype.setHTML = function (html, sync) {
    this.no_verify = true;
    this.allow_div = true;
    if (sync === undefined) sync = true;

    // Clean.
    html = this.clean(html, true, false);

    // Remove unecessary spaces.
    html = html.replace(/>\s+</g, '><');

    this.$element.html(html);

    this.cleanAttrs(this.$element.get(0));

    this.convertNewLines();

    this.imageList = [];
    this.refreshImageList();

    // Do paragraphy wrap.
    if (this.options.paragraphy) this.wrapText(true);

    this.$element.find('li:empty').append($.Editable.INVISIBLE_SPACE);
    this.cleanupLists();

    this.cleanify(false, true, false);

    // Sync if necessary.
    if (sync) {
      // Restore selection.
      this.restoreSelectionByMarkers();
      this.sync();
    }

    this.$element.find('span').attr('data-fr-verified', true);

    if (this.initialized) {
      this.hide();
      this.closeImageMode();
      this.imageMode = false;
    }

    this.no_verify = false;
    this.allow_div = false;
  };

  Editable.prototype.beforePaste = function () {
    // Save selection
    this.saveSelectionByMarkers();

    // Set clipboard HTML.
    this.clipboardHTML = null;

    // Store scroll.
    this.scrollPosition = this.$window.scrollTop();

    // Remove and store the editable content
    if (!this.$pasteDiv) {
      this.$pasteDiv = $('<div contenteditable="true" style="position: fixed; top: 0; left: -9999px; height: 100%; width: 0; z-index: 4000; line-height: 140%;" tabindex="-1"></div>');
      this.$box.after(this.$pasteDiv);
    }
    else {
      this.$pasteDiv.html('');
    }

    this.$pasteDiv.focus();

    this.window.setTimeout($.proxy(this.processPaste, this), 1);
  }

  Editable.prototype.processPaste = function () {
    var pastedFrag = this.clipboardHTML;

    if (this.clipboardHTML === null) {
      pastedFrag = this.$pasteDiv.html();

      // Restore selection.
      this.restoreSelectionByMarkers();

      // Restore scroll.
      this.$window.scrollTop(this.scrollPosition);
    }

    var clean_html;

    var response = this.triggerEvent('onPaste', [pastedFrag], false);
    if (typeof(response) === 'string') {
      pastedFrag = response;
    }

    // Add image pasted flag.
    pastedFrag = pastedFrag.replace(/<img /gi, '<img data-fr-image-pasted="true" ');

    // Word paste.
    if (pastedFrag.match(/(class=\"?Mso|style=\"[^\"]*\bmso\-|w:WordDocument)/gi)) {
      clean_html = this.wordClean(pastedFrag);
      clean_html = this.clean($('<div>').append(clean_html).html(), false, true);
      clean_html = this.removeEmptyTags(clean_html);
    }

    // Paste.
    else {
      clean_html = this.clean(pastedFrag, false, true);
      clean_html = this.removeEmptyTags(clean_html);

      if (Editable.copiedText && $('<div>').html(clean_html).text().replace(/\u00A0/gi, ' ') == Editable.copiedText.replace(/(\u00A0|\r|\n)/gi, ' ')) {
        clean_html = Editable.copiedHTML;
      }
    }

    // Do plain paste cleanup.
    if (this.options.plainPaste) {
      clean_html = this.plainPasteClean(clean_html);
    }

    // After paste cleanup event.
    response = this.triggerEvent('afterPasteCleanup', [clean_html], false);
    if (typeof(response) === 'string') {
      clean_html = response;
    }

    // Check if there is anything to clean.
    if (clean_html !== '') {
      // Insert HTML.
      this.insertHTML(clean_html, true, true);

      // Remove empty spans and other empty valid nodes.
      this.saveSelectionByMarkers();
      this.removeBlankSpans();
      this.$element.find(this.valid_nodes.join(':empty, ') + ':empty').remove();
      this.restoreSelectionByMarkers();

      // Indent lists.
      this.$element.find('li[data-indent]').each ($.proxy(function (index, li) {
        if (this.indentLi) {
          $(li).removeAttr('data-indent')
          this.indentLi($(li));
        }
        else {
          $(li).removeAttr('data-indent')
        }
      }, this));

      // Li cleanup.
      this.$element.find('li').each ($.proxy(function (index, li) {
        this.wrapTextInElement($(li), true);
      }, this));

      if (this.options.paragraphy) {
        this.wrapText(true);
      }

      this.cleanupLists();
    }

    this.afterPaste();
  }

  Editable.prototype.afterPaste = function () {
    this.uploadPastedImages();

    this.checkPlaceholder();

    this.pasting = false;

    this.triggerEvent('afterPaste', [], true, false);
  }

  Editable.prototype.getSelectedHTML = function () {
    var that = this;

    function wrapSelection(container, parentNode) {
      while (parentNode.nodeType == 3 || that.valid_nodes.indexOf(parentNode.tagName) < 0) {
        if (parentNode.nodeType != 3) $(container).wrapInner('<' + parentNode.tagName + that.attrs(parentNode) + '>' + '</' + parentNode.tagName + '>');
        parentNode = parentNode.parentNode;
      }
    }

    var html = '';
    if (typeof window.getSelection != 'undefined') {
      var ranges = this.getRanges();
      for (var i = 0; i < ranges.length; i++) {
        var container = document.createElement('div');
        container.appendChild(ranges[i].cloneContents());
        wrapSelection(container, this.getSelectionParent());
        html += container.innerHTML;
      }
    }

    else if (typeof document.selection != 'undefined') {
      if (document.selection.type == 'Text') {
        html = document.selection.createRange().htmlText;
      }
    }
    return html;
  }

  /**
   * Register paste event.
   */
  Editable.prototype.registerPaste = function () {
    this.$element.on('copy cut', $.proxy(function () {
      if (!this.isHTML) {
        Editable.copiedHTML = this.getSelectedHTML();
        Editable.copiedText = $('<div>').html(Editable.copiedHTML).text();
      }
    }, this));

    this.$element.on('paste', $.proxy(function (e) {
      if (!this.isHTML) {
        if (e.originalEvent) e = e.originalEvent;

        if (!this.triggerEvent('beforePaste', [], false)) {
          return false;
        }

        // Clipboard paste.
        if (this.clipboardPaste(e)) return false;

        this.clipboardHTML = '';

        // Enable pasting.
        this.pasting = true;

        // Store scroll position.
        this.scrollPosition = this.$window.scrollTop();

        // Read data from clipboard.
        var clipboard = false;
        if (e && e.clipboardData && e.clipboardData.getData) {
          var types = '';
          var clipboard_types = e.clipboardData.types;

          if ($.Editable.isArray(clipboard_types)) {
            for (var i = 0 ; i < clipboard_types.length; i++) {
              types += clipboard_types[i] + ';';
            }
          } else {
            types = clipboard_types;
          }

          // HTML.
          if (/text\/html/.test(types)) {
            this.clipboardHTML = e.clipboardData.getData('text/html');
          }

          // Safari HTML.
          else if (/text\/rtf/.test(types) && this.browser.safari) {
            this.clipboardHTML = e.clipboardData.getData('text/rtf');
          }

          else if (/text\/plain/.test(types) && !this.browser.mozilla) {
            this.clipboardHTML = this.escapeEntities(e.clipboardData.getData('text/plain')).replace(/\n/g, '<br/>');
          }

          if (this.clipboardHTML !== '') {
            clipboard = true;
          } else {
            this.clipboardHTML = null;
          }

          if (clipboard) {
            this.processPaste();

            if (e.preventDefault) {
              e.stopPropagation();
              e.preventDefault();
            }

            return false;
          }
        }

        // Normal paste.
        this.beforePaste();
      }
    }, this));
  };

  // Image upload Chrome. http://www.foliotek.com/devblog/copy-images-from-clipboard-in-javascript/
  Editable.prototype.clipboardPaste = function (e) {
    if (e && e.clipboardData) {
      if (e.clipboardData.items && e.clipboardData.items[0]) {

        var file = e.clipboardData.items[0].getAsFile();

        if (file) {
          var reader = new FileReader();
          reader.onload = $.proxy(function (e) {
            var result = e.target.result;

            this.insertHTML('<img data-fr-image-pasted="true" src="' + result + '" />');

            this.afterPaste();
          }, this);

          reader.readAsDataURL(file);

          return true;
        }
      }
    }

    return false;
  }

  Editable.prototype.uploadPastedImages = function () {
    if (this.options.imageUpload) {
      // Safari won't work https://bugs.webkit.org/show_bug.cgi?id=49141
      this.$element.find('img[data-fr-image-pasted]').each ($.proxy(function (index, img) {
        if (!this.options.pasteImage) {
          $(img).remove();
        }

        else {
          // Data images.
          if (img.src.indexOf('data:') === 0) {

            // Set image width.
            if (this.options.defaultImageWidth) {
              $(img).attr('width', this.options.defaultImageWidth);
            }

            if (this.options.pastedImagesUploadURL) {
              if (!this.triggerEvent('beforeUploadPastedImage', [img], false)) {
                return false;
              }

              setTimeout($.proxy(function () {
                this.showImageLoader();
                this.$progress_bar.find('span').css('width', '100%').text('Please wait!');
                this.showByCoordinates($(img).offset().left + $(img).width() / 2, $(img).offset().top + $(img).height() + 10);
                this.isDisabled = true;
              }, this), 10);

              $.ajax({
                type: this.options.pastedImagesUploadRequestType,
                url: this.options.pastedImagesUploadURL,
                data: $.extend({ image: decodeURIComponent(img.src) }, this.options.imageUploadParams),
                crossDomain: this.options.crossDomain,
                xhrFields: {
                  withCredentials: this.options.withCredentials
                },
                headers: this.options.headers,
                dataType: 'json'
              })
              .done($.proxy(function (resp) {
                try {
                  if (resp.link) {
                    var img_x = new Image();

                    // Bad image url.
                    img_x.onerror = $.proxy(function () {
                      $(img).remove();
                      this.hide();
                      this.throwImageError(1);
                    }, this);

                    // Image loaded.
                    img_x.onload = $.proxy(function () {
                      img.src = resp.link;

                      this.hideImageLoader();
                      this.hide();
                      this.enable();

                      setTimeout (function () {
                        $(img).trigger('touchend');
                      }, 50);

                      this.triggerEvent('afterUploadPastedImage', [$(img)]);
                    }, this);

                    // Set image src.
                    img_x.src = resp.link;
                  }

                  else if (resp.error) {
                    $(img).remove();
                    this.hide();
                    this.throwImageErrorWithMessage(resp.error);
                  }

                  else {
                    // No link in upload request.
                    $(img).remove();
                    this.hide();
                    this.throwImageError(2);
                  }
                } catch (ex) {
                  // Bad response.
                  $(img).remove();
                  this.hide();
                  this.throwImageError(4);
                }
              }, this))
              .fail($.proxy(function () {
                // Failed during upload.
                $(img).remove();
                this.hide();
                this.throwImageError(3);
              }, this));
            }
          }

          // Images without http (Safari ones.).
          else if (img.src.indexOf('http') !== 0) {
            $(img).remove();
          }

          $(img).removeAttr('data-fr-image-pasted');
        }
      }, this));
    }
  }

  Editable.prototype.disable = function () {
    this.isDisabled = true;
    this.$element.blur();
    this.$box.addClass('fr-disabled');
    this.$element.attr('contenteditable', false);
  }

  Editable.prototype.enable = function () {
    this.isDisabled = false;
    this.$box.removeClass('fr-disabled');
    this.$element.attr('contenteditable', true);
  }

  /**
   * Word clean.
   */
  Editable.prototype.wordClean = function (html) {
    // Keep only body.
    if (html.indexOf('<body') >= 0) {
      html = html.replace(/[.\s\S\w\W<>]*<body[^>]*>([.\s\S\w\W<>]*)<\/body>[.\s\S\w\W<>]*/g, '$1');
    }

    // Single item list.
    html = html.replace(
      /<p(.*?)class="?'?MsoListParagraph"?'? ([\s\S]*?)>([\s\S]*?)<\/p>/gi,
      '<ul><li>$3</li></ul>'
    );
    html = html.replace(
      /<p(.*?)class="?'?NumberedText"?'? ([\s\S]*?)>([\s\S]*?)<\/p>/gi,
      '<ol><li>$3</li></ol>'
    );

    // List start.
    html = html.replace(
      /<p(.*?)class="?'?MsoListParagraphCxSpFirst"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi,
      '<ul><li$3>$5</li>'
    );
    html = html.replace(
      /<p(.*?)class="?'?NumberedTextCxSpFirst"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi,
      '<ol><li$3>$5</li>'
    );

    // List middle.
    html = html.replace(
      /<p(.*?)class="?'?MsoListParagraphCxSpMiddle"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi,
      '<li$3>$5</li>'
    );
    html = html.replace(
      /<p(.*?)class="?'?NumberedTextCxSpMiddle"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi,
      '<li$3>$5</li>'
    );

    // List end.
    html = html.replace(
      /<p(.*?)class="?'?MsoListParagraphCxSpLast"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi,
      '<li$3>$5</li></ul>'
    );
    html = html.replace(
      /<p(.*?)class="?'?NumberedTextCxSpLast"?'?([\s\S]*?)(level\d)?([\s\S]*?)>([\s\S]*?)<\/p>/gi,
      '<li$3>$5</li></ol>'
    );

    // Clean list bullets.
    html = html.replace(/<span([^<]*?)style="?'?mso-list:Ignore"?'?([\s\S]*?)>([\s\S]*?)<span/gi, '<span><span');

    // Webkit clean list bullets.
    html = html.replace(/<!--\[if \!supportLists\]-->([\s\S]*?)<!--\[endif\]-->/gi, '');
    html = html.replace(/<!\[if \!supportLists\]>([\s\S]*?)<!\[endif\]>/gi, '');

    // Remove mso classes.
    html = html.replace(/(\n|\r| class=(")?Mso[a-zA-Z0-9]+(")?)/gi, ' ');

    // Remove comments.
    html = html.replace(/<!--[\s\S]*?-->/gi, '');

    // Remove tags but keep content.
    html = html.replace(/<(\/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>/gi, '');

    // Remove no needed tags.
    var word_tags = ['style', 'script', 'applet', 'embed', 'noframes', 'noscript'];
    for (var i = 0; i < word_tags.length; i++) {
      var regex = new RegExp('<' + word_tags[i] + '.*?' + word_tags[i] + '(.*?)>', 'gi');
      html = html.replace(regex, '');
    }

    // Remove attributes.
    html = html.replace(/([\w\-]*)=("[^<>"]*"|'[^<>']*'|\w+)/gi, '');

    // Remove spaces.
    html = html.replace(/&nbsp;/gi, ' ');

    // Remove empty tags.
    var oldHTML;
    do {
      oldHTML = html;
      html = html.replace(/<[^\/>][^>]*><\/[^>]+>/gi, '');
    } while (html != oldHTML);

    // Process list indentation.
    html = html.replace(/<lilevel([^1])([^>]*)>/gi, '<li data-indent="true"$2>');
    html = html.replace(/<lilevel1([^>]*)>/gi, '<li$1>');

    html = this.clean(html);

    // Clean empty links.
    html = html.replace(/<a>(.[^<]+)<\/a>/gi, '$1');

    return html;
  }

  Editable.prototype.tabs = function (tabs_no) {
    var html = '';

    for (var k = 0; k < tabs_no; k++) {
      html += '  ';
    }

    return html;
  }

  /**
   * Clean tags.
   */
  Editable.prototype.cleanTags = function (html, new_line_to_br) {
    if (new_line_to_br === undefined) new_line_to_br = false;

    var chr;
    var i;
    var ok;
    var last;

    var open_tags = [];
    var dom = [];
    var is_pre = false;
    var keep_head = false;

    var format_tags = this.options.formatTags;

    // Iterate through the html.
    for (i = 0; i < html.length; i++) {
      chr = html.charAt(i);

      // Tag start.
      if (chr == '<') {
        // Tag end.
        var j = html.indexOf('>', i + 1);
        if (j !== -1) {
          // Get tag.
          var tag = html.substring(i, j + 1);
          var tag_name = this.tagName(tag);

          if (tag_name.indexOf('!--') === 0) {
            j = html.indexOf('-->', i + 1);
            if (j !== -1) {
              tag = html.substring(i, j + 3);
              dom.push(tag);
              i = j + 2;
              continue;
            }
          }

          // Handle IE comments.
          if (tag_name.indexOf('!') === 0) {
            dom.push(tag);
            i = j;
            continue;
          }

          // Keep all content inside head unaltered.
          if (tag_name == 'head' && this.options.fullPage) keep_head = true;
          if (keep_head) {
            dom.push(tag);
            i = j;
            if (tag_name == 'head' && this.isClosingTag(tag)) keep_head = false;
            continue;
          }

          if (this.options.allowedTags.indexOf(tag_name) < 0 && (!this.options.fullPage || ['html', 'head', 'body', '!doctype'].indexOf(tag_name) < 0)) {
            i = j;
            continue;
          }

          // Closing tag.
          var is_closing = this.isClosingTag(tag);

          // Determine if pre.
          if (tag_name === 'pre') {
            if (is_closing) {
              is_pre = false;
            } else {
              is_pre = true;
            }
          }

          // Self enclosing tag.
          if (this.isSelfClosingTag(tag)) {
            if (tag_name === 'br' && is_pre) {
              dom.push('\n');
            }
            else {
              dom.push(tag);
            }
          }
          // New open tag.
          else if (!is_closing) {
            // Keep tag in dom.
            dom.push(tag);

            // Store open tag.
            open_tags.push({
              tag_name: tag_name,
              i: (dom.length - 1)
            });

          } else {
            ok = false;
            last = true;

            // Search for opened tag.
            while (ok === false && last !== undefined) {
              // Get last node.
              last = open_tags.pop();

              // Remove nodes that are not closed correctly.
              if (last !== undefined && last.tag_name !== tag_name) {
                dom.splice(last.i, 1);
              } else {
                ok = true;

                // Last tag should be the correct one and not undefined.
                if (last !== undefined) {
                  dom.push(tag);
                }
              }
            }
          }

          // Update i position.
          i = j;
        }
      }

      else {
        if (chr === '\n' && this.options.beautifyCode) {
          if (new_line_to_br && is_pre) {
            dom.push('<br/>');
          }
          else if (is_pre) {
            dom.push(chr);
          }
          else if (open_tags.length > 0) {
            dom.push(' ');
          }
        } else if (chr.charCodeAt(0) != 9) {
          dom.push(chr);
        }
      }
    }

    // Remove open tags.
    while (open_tags.length > 0) {
      last = open_tags.pop();
      dom.splice(last.i, 1);
    }

    var new_line_sep = '\n';
    if (!this.options.beautifyCode) {
      new_line_sep = '';
    }

    // Build the new html.
    html = '';
    open_tags = 0;
    var remove_space = true;
    for (i = 0; i < dom.length; i++) {
      if (dom[i].length == 1) {
        if (!(remove_space && dom[i] === ' ')) {
          html += dom[i];
          remove_space = false;
        }
      }
      else if (format_tags.indexOf(this.tagName(dom[i]).toLowerCase()) < 0) {
        html += dom[i];
        if (this.tagName(dom[i]) == 'br') html += new_line_sep;
      }
      else if (this.isSelfClosingTag(dom[i])) {
        if (format_tags.indexOf(this.tagName(dom[i]).toLowerCase()) >= 0) {
          html += this.tabs(open_tags) + dom[i] + new_line_sep;
          remove_space = false;
        }
        else {
          html += dom[i];
        }
      }
      else if (!this.isClosingTag(dom[i])) {
        html += new_line_sep + this.tabs(open_tags) + dom[i];
        open_tags += 1;
        remove_space = false;
      }
      else {
        open_tags -= 1;

        if (open_tags === 0) remove_space = true;

        if (html.length > 0 && html[html.length - 1] == new_line_sep) {
          html += this.tabs(open_tags);
        }

        html += dom[i] + new_line_sep;
      }
    }

    // Remove starting \n.
    if (html[0] == new_line_sep) {
      html = html.substring(1, html.length);
    }

    // Remove ending \n.
    if (html[html.length - 1] == new_line_sep) {
      html = html.substring(0, html.length - 1);
    }

    return html;
  };

  Editable.prototype.cleanupLists = function () {
    this.$element.find('ul, ol').each (function (index, list) {
      var $list = $(list);

      if ($list.find('.close-ul, .open-ul, .close-ol, .open-ol, .open-li, .close-li').length > 0) {
        var oldHTML = '<' + list.tagName.toLowerCase() + '>' + $list.html() + '</' + list.tagName.toLowerCase() + '>';
        oldHTML = oldHTML.replace(new RegExp('<span class="close-ul" data-fr-verified="true"></span>', 'g'), '</ul>');
        oldHTML = oldHTML.replace(new RegExp('<span class="open-ul" data-fr-verified="true"></span>', 'g'), '<ul>');
        oldHTML = oldHTML.replace(new RegExp('<span class="close-ol" data-fr-verified="true"></span>', 'g'), '</ol>');
        oldHTML = oldHTML.replace(new RegExp('<span class="open-ol" data-fr-verified="true"></span>', 'g'), '<ol>');
        oldHTML = oldHTML.replace(new RegExp('<span class="close-li" data-fr-verified="true"></span>', 'g'), '</li>');
        oldHTML = oldHTML.replace(new RegExp('<span class="open-li" data-fr-verified="true"></span>', 'g'), '<li>');

        $list.replaceWith(oldHTML);
      }
    });

    this.$element.find('li > td').remove();
    this.$element.find('li td:empty').append($.Editable.INVISIBLE_SPACE);

    this.$element.find(' > li').wrap('<ul>');

    // Remove empty ul and ol.
    this.$element.find('ul, ol').each ($.proxy(function (index, lst) {
      var $lst = $(lst);
      if ($lst.find(this.valid_nodes.join(',')).length === 0) {
        $lst.remove();
      }
    }, this));

    // Make sure we can type in nested list.
    this.$element.find('li > ul, li > ol').each ($.proxy(function (idx, lst) {
      if (this.isFirstSibling(lst)) $(lst).before('<br/>');
    }, this));

    // Remove empty li.
    this.$element.find('li:empty').remove();

    var lists = this.$element.find('ol + ol, ul + ul');
    for (var k = 0; k < lists.length; k++) {
      var $list = $(lists[k]);
      if (this.attrs(lists[k]) == this.attrs($list.prev().get(0))) {
        $list.prev().append($list.html());
        $list.remove();
      }
    }

    this.$element.find('li > td').remove();
    this.$element.find('li td:empty').append($.Editable.INVISIBLE_SPACE);

    // Remove first p in li.
    this.$element.find('li > ' + this.options.defaultTag).each(function (index, p) {
      if (p.attributes.length === 0) {
        $(p).replaceWith($(p).html());
      }
    });
  }

  Editable.prototype.escapeEntities = function (str) {
    return str.replace(/</gi, '&lt;')
              .replace(/>/gi, '&gt;')
              .replace(/"/gi, '&quot;')
              .replace(/'/gi, '&apos;')
  }

  Editable.prototype.cleanNodeAttrs = function (node, allowed_attrs) {
    var attrs = node.attributes;
    if (attrs) {
      var r = new RegExp('^' + allowed_attrs.join('$|^') + '$', 'i');
      for (var i = 0; i < attrs.length; i++) {
        var att = attrs[i];

        if (!r.test(att.nodeName)) {
          node.removeAttribute(att.nodeName);
        }
        else {
          node.setAttribute(
            att.nodeName,
            this.escapeEntities(att.nodeValue)
          )
        }
      }
    }
  }

  Editable.prototype.cleanAttrs = function (el) {
    if (el.nodeType == 1 && el.className.indexOf('f-marker') < 0 && el !== this.$element.get(0) && el.tagName != 'IFRAME') {
      this.cleanNodeAttrs(el, this.options.allowedAttrs, true);
    }

    var contents = el.childNodes;
    for (var i = 0; i < contents.length; i++) this.cleanAttrs(contents[i]);
  }

  /**
   * Clean the html.
   */
  Editable.prototype.clean = function (html, allow_id, clean_style, allowed_tags, allowed_attrs) {
    // Pasting.
    if (this.pasting && Editable.copiedText === $('<div>').html(html).text()) {
      clean_style = false;
      allow_id = true;
    }

    // List of allowed attributes.
    if (!allowed_attrs) allowed_attrs = $.merge([], this.options.allowedAttrs);

    // List of allowed tags.
    if (!allowed_tags) allowed_tags = $.merge([], this.options.allowedTags);

    // Remove the id.
    if (!allow_id) {
      if (allowed_attrs.indexOf('id') > -1) allowed_attrs.splice(allowed_attrs.indexOf('id'), 1);
    }

    if (this.options.fullPage) {
      html = html.replace(/<!DOCTYPE([^>]*?)>/i, '<!-- DOCTYPE$1 -->')
      html = html.replace(/<html([^>]*?)>/i, '<!-- html$1 -->')
      html = html.replace(/<\/html([^>]*?)>/i, '<!-- \/html$1 -->')
      html = html.replace(/<body([^>]*?)>/i, '<!-- body$1 -->')
      html = html.replace(/<\/body([^>]*?)>/i, '<!-- \/body$1 -->')
      html = html.replace(/<head>([\w\W]*)<\/head>/i, function (str, a1) {
        var x = 1;
        a1 = a1.replace(/(<style)/gi, function (str, x1) {
          return x1 + ' data-id=' + x++;
        });

        return '<!-- head ' + a1.replace(/(>)([\s|\t]*)(<)/gi, '$1$3').replace(/</gi, '[').replace(/>/gi, ']') + ' -->';
      });
    }

    if (!this.options.allowComments) {
      html = html.replace(/<!--.*?-->/gi, '');
    }
    else {
      this.options.allowedTags.push('!--');
      this.options.allowedTags.push('!');
    }

    // Remove script tag.
    if (!this.options.allowScript) html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove style tag.
    if (!this.options.allowStyle) html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    // Remove all tags not in allowed tags.
    var at_reg = new RegExp('<\\/?((?!(?:' + allowed_tags.join(' |') + ' |' + allowed_tags.join('>|') + '>|' + allowed_tags.join('/>|') + '/>))\\w+)[^>]*?>', 'gi');
    html = html.replace(at_reg, '');

    // Clean style.
    if (clean_style) {
      var style_reg = new RegExp('style=("[a-zA-Z0-9:;\\.\\s\\(\\)\\-\\,!\\/\'%]*"|\'[a-zA-Z0-9:;\\.\\s\\(\\)\\-\\,!\\/"%]*\')', 'gi');
      html = html.replace(style_reg, '');

      html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    }

    // Clean tags.
    html = this.cleanTags(html, true);

    // Sanitize SRC or HREF.
    html = html.replace(/(\r|\n)/gi, '');
    var s_reg = new RegExp('<([^>]*)( src| href)=(\'[^\']*\'|"[^"]*"|[^\\s>]+)([^>]*)>', 'gi');
    html = html.replace(s_reg, $.proxy(function (str, a1, a2, a3, a4) {
      return '<' + a1 + a2 + '="' + this.sanitizeURL(a3.replace(/^["'](.*)["']\/?$/gi, '$1')) + '"' + a4 + '>';
    }, this));

    // Remove the class.
    if (!allow_id) {
      var $div = $('<div>').append(html);
      $div.find('[class]:not([class^="fr-"])').each (function (index, el) {
        $(el).removeAttr('class');
      })

      html = $div.html();
    }

    return html;
  };

  Editable.prototype.removeBlankSpans = function () {
    // Clean possible empty spans, specially in Webkit browsers.
    this.no_verify = true;
    this.$element.find('span').removeAttr('data-fr-verified');
    this.$element.find('span').each($.proxy(function (index, span) {
      if (this.attrs(span).length === 0) $(span).replaceWith($(span).html());
    }, this));
    this.$element.find('span').attr('data-fr-verified', true);
    this.no_verify = false;
  }

  Editable.prototype.plainPasteClean = function (html) {
    var $div = $('<div>').html(html);

    $div.find('p, div, h1, h2, h3, h4, h5, h6, pre, blockquote').each ($.proxy(function (i, el) {
      $(el).replaceWith('<' + this.options.defaultTag + '>' + $(el).html() + '</' + this.options.defaultTag + '>');
    }, this));

    // Remove with the content.
    $($div.find('*').not('p, div, h1, h2, h3, h4, h5, h6, pre, blockquote, ul, ol, li, table, tbody, thead, tr, td').get().reverse()).each (function () {
      $(this).replaceWith($(this).html());
    });

    // Remove comments.
    var cleanComments = function ($node) {
      var contents = $node.contents();

      for (var i = 0; i < contents.length; i++) {
        if (contents[i].nodeType != 3 && contents[i].nodeType != 1) {
          $(contents[i]).remove();
        }
        else {
          cleanComments($(contents[i]));
        }
      }
    };

    cleanComments($div);

    return $div.html();
  }

  Editable.prototype.removeEmptyTags = function (html) {
    var i;
    var $div = $('<div>').html(html);

    // Clean empty tags.
    var empty_tags = $div.find('*:empty:not(br, img, td, th)');
    while (empty_tags.length) {
      for (i = 0; i < empty_tags.length; i++) {
        $(empty_tags[i]).remove();
      }

      empty_tags = $div.find('*:empty:not(br, img, td, th)');
    }

    // Workaround for Nodepad paste.
    var divs = $div.find('> div, td > div, th > div, li > div');
    while (divs.length) {
      var $dv = $(divs[divs.length - 1]);
      $dv.replaceWith($dv.html() + '<br/>');
      divs = $div.find('> div, td > div, th > div, li > div');
    }

    // Remove divs.
    divs = $div.find('div');
    while (divs.length) {
      for (i = 0; i < divs.length; i++) {
        var $el = $(divs[i]);
        var text = $el.html().replace(/\u0009/gi, '').trim();

        $el.replaceWith(text);
      }

      divs = $div.find('div');
    }

    return $div.html();
  }

  /**
   * Init style for element.
   */
  Editable.prototype.initElementStyle = function () {
    // Enable content editable.
    if (!this.editableDisabled) {
      this.$element.attr('contenteditable', true);
    }

    var cls = 'froala-view froala-element ' + this.options.editorClass;

    if (this.browser.msie && Editable.getIEversion() < 9) {
      cls += ' ie8';
    }

    // Remove outline.
    this.$element.css('outline', 0);

    if (!this.browser.msie) {
      cls += ' not-msie';
    }

    this.$element.addClass(cls);
  };

  Editable.prototype.CJKclean = function (text) {
    var regex = /[\u3041-\u3096\u30A0-\u30FF\u4E00-\u9FFF\u3130-\u318F\uAC00-\uD7AF]/gi;
    return text.replace(regex, '');
  }

  /**
   * Typing is saved in undo stack.
   */
  Editable.prototype.enableTyping = function () {
    this.typingTimer = null;

    this.$element.on('keydown', 'textarea, input', function (e) {
      e.stopPropagation();
    })

    this.$element.on('keydown cut', $.proxy(function (e) {
      if (!this.isHTML) {
        if (!this.options.multiLine && e.which == 13) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        if (e.type === 'keydown' && !this.triggerEvent('keydown', [e], false)) {
          return false;
        }

        clearTimeout(this.typingTimer);
        this.ajaxSave = false;

        this.oldHTML = this.getHTML(true, false);

        this.typingTimer = setTimeout($.proxy(function () {
          var html = this.getHTML(true, false);

          if (!this.ime && (this.CJKclean(html) !== this.CJKclean(this.oldHTML) && this.CJKclean(html) === html)) {
            // Do sync.
            this.sync();
          }
        }, this), Math.max(this.options.typingTimer, 500));
      }
    }, this));
  };

  Editable.prototype.removeMarkersByRegex = function (html) {
    return html.replace(/<span[^>]*? class\s*=\s*["']?f-marker["']?[^>]+>([\S\s][^\/])*<\/span>/gi, '');
  };

  Editable.prototype.getImageHTML = function () {
    return JSON.stringify({
      src: this.$element.find('img').attr('src'),
      style: this.$element.find('img').attr('style'),
      alt: this.$element.find('img').attr('alt'),
      width: this.$element.find('img').attr('width'),
      link: this.$element.find('a').attr('href'),
      link_title: this.$element.find('a').attr('title'),
      link_target: this.$element.find('a').attr('target')
    })
  };

  Editable.prototype.getLinkHTML = function () {
    return JSON.stringify ({
      body: this.$element.html(),
      href: this.$element.attr('href'),
      title: this.$element.attr('title'),
      popout: this.$element.hasClass('popout'),
      nofollow: this.$element.attr('ref') == 'nofollow',
      blank: this.$element.attr('target') == '_blank',
      cls: !this.$element.attr('class') ? '' : this.$element.attr('class').replace(/froala-element ?|not-msie ?|froala-view ?/gi, '').trim()
    })
  };

  Editable.prototype.addFrTag = function () {
    this.$element.find(this.valid_nodes.join(',') + ', table, ul, ol, img').addClass('fr-tag');
  }

  Editable.prototype.removeFrTag = function () {
    // Restore fr-tag class.
    this.$element.find(this.valid_nodes.join(',') + ', table, ul, ol, img').removeClass('fr-tag');
  }

  /**
   * Get HTML from the editor.
   * Default: (false, false, true)
   */
  Editable.prototype.getHTML = function (keep_markers, add_fr_tag, remove_verifier) {
    if (keep_markers === undefined) keep_markers = false;
    if (add_fr_tag === undefined) add_fr_tag = this.options.useFrTag;
    if (remove_verifier === undefined) remove_verifier = true;

    if (this.$element.hasClass('f-placeholder') && !keep_markers) return '';

    if (this.isHTML) return this.$html_area.val();

    if (this.isImage) return this.getImageHTML();

    if (this.isLink) return this.getLinkHTML();

    // Add f-link to links.
    this.$element.find('a').data('fr-link', true);

    // fr-tag class.
    if (add_fr_tag) {
      this.addFrTag();
    }

    // Set image margin.
    this.$element.find('.f-img-editor > img').each($.proxy(function (index, elem) {
      $(elem)
        .removeClass('fr-fin fr-fil fr-fir fr-dib fr-dii')
        .addClass(this.getImageClass($(elem).parent().attr('class')));
    }, this));

    if (!this.options.useClasses) {
      this.$element.find('img').each ($.proxy (function (index, img) {
        var $img = $(img);

        $img.attr('data-style', this.getImageStyle($img));
      }, this));
    }

    // Replace &nbsp; from pre.
    this.$element.find('pre').each ($.proxy(function (index, pre) {
      var $pre = $(pre);
      var old_html = $pre.html();
      var new_html = old_html.replace(/\&nbsp;/gi, ' ');

      if (old_html != new_html) {
        this.saveSelectionByMarkers();
        $pre.html(new_html);
        this.restoreSelectionByMarkers();
      }
    }, this));

    this.$element.find('pre br').addClass('fr-br');

    this.$element.find('[class=""]').removeAttr('class');

    // Clean attrs.
    this.cleanAttrs(this.$element.get(0));

    // Clone element.
    var html = this.$element.html();

    this.removeFrTag();
    this.$element.find('pre br').removeAttr('class');

    // Remove empty link.
    html = html.replace(/<a[^>]*?><\/a>/g, '');

    if (!keep_markers) {
      // Remove markers.
      html = this.removeMarkersByRegex(html);
    }

    // Remove image handles.
    html = html.replace(/<span[^>]*? class\s*=\s*["']?f-img-handle[^>]+><\/span>/gi, '');

    // Remove f-img-editor.
    html = html.replace(/^([\S\s]*)<span[^>]*? class\s*=\s*["']?f-img-editor[^>]+>([\S\s]*)<\/span>([\S\s]*)$/gi, '$1$2$3');

    // Remove image wrapper.
    html = html.replace(/^([\S\s]*)<span[^>]*? class\s*=\s*["']?f-img-wrap[^>]+>([\S\s]*)<\/span>([\S\s]*)$/gi, '$1$2$3');

    // Add image style.
    if (!this.options.useClasses) {
      html = html.replace(/data-style/gi, 'style');
      html = html.replace(/(<img[^>]*)( class\s*=['"]?[a-zA-Z0-9- ]+['"]?)([^>]*\/?>)/gi, '$1$3');
    }

    // Ampersand fix.
    if (this.options.simpleAmpersand) {
      html = html.replace(/\&amp;/gi, '&');
    }

    // Remove data-fr-verified
    if (remove_verifier) {
      html = html.replace(/ data-fr-verified="true"/gi, '');
    }

    // Remove new lines.
    if (this.options.beautifyCode) {
      html = html.replace(/\n/gi, '');
    }

    html = html.replace(/<br class="fr-br">/gi, '\n');

    // Remove invisible whitespace.
    html = html.replace(/\u200B/gi, '');

    if (this.options.fullPage) {
      html = html.replace(/<!-- DOCTYPE([^>]*?) -->/i, '<!DOCTYPE$1>')
      html = html.replace(/<!-- html([^>]*?) -->/i, '<html$1>')
      html = html.replace(/<!-- \/html([^>]*?) -->/i, '<\/html$1>')
      html = html.replace(/<!-- body([^>]*?) -->/i, '<body$1>')
      html = html.replace(/<!-- \/body([^>]*?) -->/i, '<\/body$1>')
      html = html.replace(/<!-- head ([\w\W]*?) -->/i, function (str, a1) {
        return '<head>' + a1.replace(/\[/gi, '<').replace(/\]/gi, '>') + '</head>';
      });
    }

    // Trigger getHTML event.
    var new_html = this.triggerEvent('getHTML', [html], false);
    if (typeof(new_html) === 'string') {
      return new_html
    }

    return html;

  };

  /**
   * Get the text from the current element.
   */
  Editable.prototype.getText = function () {
    return this.$element.text();
  };

  /**
   * Set a dirty flag which indicates if there are any changes for autosave.
   */
  Editable.prototype.setDirty = function (dirty) {
    this.dirty = dirty;

    if (!dirty) {
      clearTimeout (this.ajaxInterval);
      this.ajaxHTML = this.getHTML(false, false);
    }
  }


  /**
   * Make ajax requests if autosave is enabled.
   */
  Editable.prototype.initAjaxSaver = function () {
    this.ajaxHTML = this.getHTML(false, false);
    this.ajaxSave = true;

    this.ajaxInterval = setInterval($.proxy(function () {
      var html = this.getHTML(false, false);
      if ((this.ajaxHTML != html || this.dirty) && this.ajaxSave) {
        if (this.options.autosave) {
          this.save();
        }

        this.dirty = false;
        this.ajaxHTML = html;
      }

      this.ajaxSave = true;
    }, this), Math.max(this.options.autosaveInterval, 100));
  };

  /**
   * Disable browser undo.
   */
  Editable.prototype.disableBrowserUndo = function () {
    this.$element.keydown($.proxy(function (e) {
      var keyCode = e.which;
      var ctrlKey = (e.ctrlKey || e.metaKey) && !e.altKey;

      if (!this.isHTML && ctrlKey) {
        if (keyCode == 90 && e.shiftKey) {
          e.preventDefault();
          return false;
        }

        if (keyCode == 90) {
          e.preventDefault();
          return false;
        }
      }
    }, this));
  };

  Editable.prototype.shortcutEnabled = function (shortcut) {
    return this.options.shortcutsAvailable.indexOf(shortcut) >= 0;
  }

  Editable.prototype.shortcuts_map = {
    69: { cmd: 'show', params: [null], id: 'show' },
    66: { cmd: 'exec', params: ['bold'], id: 'bold' },
    73: { cmd: 'exec', params: ['italic'], id: 'italic' },
    85: { cmd: 'exec', params: ['underline'], id: 'underline' },
    83: { cmd: 'exec', params: ['strikeThrough'], id: 'strikeThrough' },
    75: { cmd: 'exec', params: ['createLink'], id: 'createLink' },
    80: { cmd: 'exec', params: ['insertImage'], id: 'insertImage' },
    221: { cmd: 'exec', params: ['indent'], id: 'indent' },
    219: { cmd: 'exec', params: ['outdent'], id: 'outdent' },
    72: { cmd: 'exec', params: ['html'], id: 'html' },
    48: { cmd: 'exec', params: ['formatBlock', 'n'], id: 'formatBlock n' },
    49: { cmd: 'exec', params: ['formatBlock', 'h1'], id: 'formatBlock h1' },
    50: { cmd: 'exec', params: ['formatBlock', 'h2'], id: 'formatBlock h2' },
    51: { cmd: 'exec', params: ['formatBlock', 'h3'], id: 'formatBlock h3' },
    52: { cmd: 'exec', params: ['formatBlock', 'h4'], id: 'formatBlock h4' },
    53: { cmd: 'exec', params: ['formatBlock', 'h5'], id: 'formatBlock h5' },
    54: { cmd: 'exec', params: ['formatBlock', 'h6'], id: 'formatBlock h6' },
    222: { cmd: 'exec', params: ['formatBlock', 'blockquote'], id: 'formatBlock blockquote' },
    220: { cmd: 'exec', params: ['formatBlock', 'pre'], id: 'formatBlock pre' }
  };

  // Check if we should consider that CTRL key is pressed.
  Editable.prototype.ctrlKey = function (e) {
    if (navigator.userAgent.indexOf('Mac OS X') != -1) {
      if (e.metaKey && !e.altKey) return true;
    } else {
      if (e.ctrlKey && !e.altKey) return true;
    }

    return false;
  }

  /**
   * Enable editor shortcuts.
   */
  Editable.prototype.initShortcuts = function () {
    if (this.options.shortcuts) {
      this.$element.on('keydown', $.proxy(function (e) {
        var keyCode = e.which;
        var ctrlKey = this.ctrlKey(e);

        if (!this.isHTML && ctrlKey) {
          if (this.shortcuts_map[keyCode] && this.shortcutEnabled(this.shortcuts_map[keyCode].id))  {
            return this.execDefaultShortcut(this.shortcuts_map[keyCode].cmd, this.shortcuts_map[keyCode].params);
          }

          // CTRL + SHIFT + z
          if (keyCode == 90 && e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();

            this.redo();

            return false;
          }

          // CTRL + z
          if (keyCode == 90) {
            e.preventDefault();
            e.stopPropagation();

            this.undo();

            return false;
          }
        }
      }, this));
    }
  };

  Editable.prototype.initTabs = function () {
    this.$element.on('keydown', $.proxy(function (e) {
      var keyCode = e.which;

      // TAB.
      if (keyCode == 9 && !e.shiftKey) {
        if (!this.raiseEvent('tab')) {
          e.preventDefault();
        }

        else if (this.options.tabSpaces) {
          e.preventDefault();

          var spaces = '&nbsp;&nbsp;&nbsp;&nbsp;';
          var element = this.getSelectionElements()[0];
          if (element.tagName === 'PRE') {
            spaces = '    ';
          }

          this.insertHTML(spaces, false);
        }
        else {
          this.blur();
        }
      }

      // SHIFT + TAB.
      else if (keyCode == 9 && e.shiftKey) {
        if (!this.raiseEvent('shift+tab')) {
          e.preventDefault();
        }
        else if (this.options.tabSpaces) {
          e.preventDefault();
        }
        else {
          this.blur();
        }
      }
    }, this));
  }

  /*
   * Check if element is text empty.
   */
  Editable.prototype.textEmpty = function (element) {
    var text = $(element).text().replace(/(\r\n|\n|\r|\t)/gm, '');

    return (text === '' || element === this.$element.get(0)) && $(element).find('br').length === 0;
  }

  Editable.prototype.inEditor = function (el) {
    while (el && el.tagName !== 'BODY') {
      if (el === this.$element.get(0)) return true;
      el = el.parentNode;
    }

    return false;
  }

  /*
   * Focus in element.
   */
  Editable.prototype.focus = function (try_to_focus) {
    if (this.isDisabled) return false;

    if (try_to_focus === undefined) try_to_focus = true;

    if (this.text() !== '' && !this.$element.is(':focus')) {
      if (!this.browser.msie) {
        this.clearSelection();
        this.$element.focus();
      }

      return;
    }

    if (!this.isHTML) {
      if (try_to_focus && !this.pasting) {
        this.$element.focus();
      }

      if (this.pasting && !this.$element.is(':focus')) {
        this.$element.focus();
      }

      // Focus when there is placeholder.
      if (this.$element.hasClass('f-placeholder')) {
        if (this.$element.find(this.options.defaultTag).length > 0) {
          this.setSelection(this.$element.find(this.options.defaultTag)[0]);
        }
        else {
          this.setSelection(this.$element.get(0));
        }
        return;
      }

      var range = this.getRange();


      if (this.text() === '' && (range && (range.startOffset === 0 || range.startContainer === this.$element.get(0) || !this.inEditor(range.startContainer)))) {
        var i;
        var element;
        var elements = this.getSelectionElements();

        // Keep focus in elements such as SPAN, STRONG, etc.
        if ($.merge(['IMG', 'BR'], this.valid_nodes).indexOf(this.getSelectionElement().tagName) < 0) {
          return false;
        }

        // Selection is in text not at the beginning.
        if ((range.startOffset > 0 && this.valid_nodes.indexOf(this.getSelectionElement().tagName) >= 0 && range.startContainer.tagName != 'BODY') ||  (range.startContainer && range.startContainer.nodeType === 3)) {
          return;
        }

        // Paragraphy is false and selection element is the main one.
        if (!this.options.paragraphy && elements.length >= 1 && elements[0] === this.$element.get(0)) {
          var search_text = function (node) {
            if (!node) return null;
            if (node.nodeType == 3 && node.textContent.length > 0) return node;
            if (node.nodeType == 1 && node.tagName == 'BR') return node;

            var contents = $(node).contents();
            for (var i = 0; i < contents.length; i++) {
              var nd = search_text(contents[i]);
              if (nd != null) return nd;
            }

            return null;
          }

          if (range.startOffset === 0 && this.$element.contents().length > 0 && this.$element.contents()[0].nodeType != 3) {
            var node = search_text(this.$element.get(0));
            if (node != null) {
              if (node.tagName == 'BR') {
                if (this.$element.is(':focus')) {
                  $(node).before(this.markers_html);
                  this.restoreSelectionByMarkers();
                }
              }
              else {
                this.setSelection(node);
              }
            }
          }

          return false;
        }

        // There is an element and not the main element.
        if (elements.length >= 1 && elements[0] !== this.$element.get(0)) {
          for (i = 0; i < elements.length; i++) {
            element = elements[i];
            if (!this.textEmpty(element) || this.browser.msie) {
              this.setSelection(element);
              return;
            }

            // Empty Li and TD.
            if (this.textEmpty(element) && ['LI', 'TD'].indexOf(element.tagName) >= 0) {
              return;
            }
          }
        }

        // Range starts in element at a higher position.
        if (range.startContainer === this.$element.get(0) && range.startOffset > 0 && !this.options.paragraphy) {
          this.setSelection(this.$element.get(0), range.startOffset);
          return;
        }

        elements = this.$element.find(this.valid_nodes.join(','));
        for (i = 0; i < elements.length; i++) {
          element = elements[i];
          if (!this.textEmpty(element) && $(element).find(this.valid_nodes.join(',')).length === 0) {
            this.setSelection(element);
            return;
          }
        }

        this.setSelection(this.$element.get(0));
      }
    }
  };

  Editable.prototype.addMarkersAtEnd = function ($element) {
    var elements = $element.find(this.valid_nodes.join(', '));
    if (elements.length === 0) elements.push($element.get(0))

    var el = elements[elements.length - 1];
    $(el).append(this.markers_html);
  }

  Editable.prototype.setFocusAtEnd = function ($element) {
    if ($element === undefined) $element = this.$element;

    this.addMarkersAtEnd($element);
    this.restoreSelectionByMarkers();
  }

  Editable.prototype.breakHTML = function (clean_html, break_list) {
    if (typeof break_list == 'undefined') break_list = true;

    // Clear selection first.
    this.removeMarkers();
    if (this.$element.find('break').length === 0) {
      this.insertSimpleHTML('<break></break>');
    }

    // Search for focus element.
    var element = this.parents(this.$element.find('break'), $.merge(['UL', 'OL'], this.valid_nodes).join(','))[0];

    // Special UL/OL parent case condition.
    if (this.parents($(element), 'ul, ol').length) element = this.parents($(element), 'ul, ol')[0];

    if (element === undefined) element = this.$element.get(0);

    // Wrap pasted li content in UL. Firefox doesn't do that.
    if (['UL', 'OL'].indexOf(element.tagName) >= 0) {
      var $div = $('<div>').html(clean_html);
      $div.find('> li').wrap('<' + element.tagName + '>');
      clean_html = $div.html();
    }

    // Insert in main element.
    if (element == this.$element.get(0)) {
      if (this.$element.find('break').next().length) {
        this.insertSimpleHTML('<div id="inserted-div">' + clean_html + '</div>');

        var $insDiv = this.$element.find('div#inserted-div');
        this.setFocusAtEnd($insDiv);
        this.saveSelectionByMarkers();
        $insDiv.replaceWith($insDiv.contents());
        this.restoreSelectionByMarkers();
      }
      else {
        this.insertSimpleHTML(clean_html);
        this.setFocusAtEnd();
      }

      this.$element.find('break').remove();
      this.checkPlaceholder();
      return true;
    }

    // Insert in TD.
    if (element.tagName === 'TD') {
      this.$element.find('break').remove();
      this.insertSimpleHTML(clean_html);
      return true;
    }

    // Set markers.
    var $divx = $('<div>').html(clean_html);
    this.addMarkersAtEnd($divx);
    clean_html = $divx.html();

    // Empty element.
    if (this.emptyElement($(element))) {
      $(element).replaceWith(clean_html);
      this.restoreSelectionByMarkers();
      this.checkPlaceholder();
      return true;
    }

    // Mark empty li.
    this.$element.find('li').each ($.proxy(function (index, li) {
      if (this.emptyElement(li)) $(li).addClass('empty-li');
    }, this));

    var html = $('<div></div>').append($(element).clone()).html();
    var tag;
    var open_tags = [];
    var tag_indexes = {};
    var li_html = [];
    var chr;
    var chars = 0;

    for (var i = 0; i < html.length; i++) {
      chr = html.charAt(i);

      // Tag start.
      if (chr == '<') {
        // Tag end.
        var j = html.indexOf('>', i + 1);
        if (j !== -1) {

          // Get tag.
          tag = html.substring(i, j + 1);
          var tag_name = this.tagName(tag);
          i = j;

          // Do break here.
          if (tag_name == 'break') {
            if (!this.isClosingTag(tag)) {
              var li_breaked = true;
              var tags_to_open = [];
              for (var k = open_tags.length - 1; k >= 0; k--) {
                var open_tag_name = this.tagName(open_tags[k]);

                // Do not break li.
                if (!break_list && open_tag_name.toUpperCase() == 'LI') {
                  li_breaked = false;
                  break;
                }

                li_html.push('</' + open_tag_name + '>');
                tags_to_open.push(open_tags[k]);
              }

              li_html.push(clean_html);
              if (!li_breaked) {
                li_html.push('</li><li>');
              }

              for (var p = 0; p < tags_to_open.length; p++) {
                li_html.push(tags_to_open[p]);
              }
            }
          } else {
            li_html.push(tag);

            if (!this.isSelfClosingTag(tag)) {
              if (this.isClosingTag(tag)) {
                var idx = tag_indexes[tag_name].pop();

                // Remove the open tag.
                open_tags.splice(idx, 1);

              } else {
                open_tags.push(tag);

                if (tag_indexes[tag_name] === undefined) tag_indexes[tag_name] = [];
                tag_indexes[tag_name].push(open_tags.length - 1);
              }
            }
          }
        }
      }
      else {
        chars++;
        li_html.push(chr);
      }
    }

    $(element).replaceWith(li_html.join(''));

    // Remove new empty li.
    this.$element.find('li').each ($.proxy(function (index, li) {
      var $li = $(li);
      if ($li.hasClass('empty-li')) {
        $li.removeClass('empty-li');
      }
      else if (this.emptyElement(li)) {
        $li.remove();
      }
    }, this));

    this.cleanupLists();
    this.restoreSelectionByMarkers();
  }

  Editable.prototype.insertSimpleHTML = function (html) {
    var sel;
    var range;
    this.no_verify = true;
    if (this.window.getSelection) {
      // IE9 and non-IE
      sel = this.window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        if (!this.browser.webkit) {
          range.deleteContents();
        }
        else {
          if (!range.collapsed) {
            document.execCommand('delete');
          }
        }

        this.$element.find(this.valid_nodes.join(':empty, ') + ':empty').remove();

        var el = this.document.createElement('div');
        el.innerHTML = html;

        var frag = this.document.createDocumentFragment();
        var node;
        var lastNode;

        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);

        // Preserve the selection
        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }
    else if ((sel = this.document.selection) && sel.type != 'Control') {
      // IE < 9
      var originalRange = sel.createRange();
      originalRange.collapse(true);
      sel.createRange().pasteHTML(html);
    }

    this.no_verify = false;
  }

  // http://stackoverflow.com/questions/6690752/insert-html-at-caret-in-a-contenteditable-div/6691294#6691294
  Editable.prototype.insertHTML = function (html, do_focus, force_focus_after) {
    if (do_focus === undefined) do_focus = true;
    if (force_focus_after === undefined) force_focus_after = false;

    if (!this.isHTML && do_focus) {
      this.focus();
    }

    // Clear selection first.
    this.removeMarkers();
    this.insertSimpleHTML('<break></break>');
    this.checkPlaceholder(true);

    // Empty.
    if (this.$element.hasClass('f-placeholder')) {
      this.$element.html(html);
      if (this.options.paragraphy) this.wrapText(true);

      // Remove empty new lines.
      this.$element.find('p > br').each (function () {
        var pNode = this.parentNode;
        if ($(pNode).contents().length == 1) {
          $(pNode).remove();
        }
      })

      this.$element.find('break').remove();
      this.setFocusAtEnd();
      this.checkPlaceholder();
      this.convertNewLines();
      return false;
    }

    // Break if it's necessary.
    var elems = $('<div>').append(html).find('*');
    for (var i = 0; i < elems.length; i++) {
      if (this.valid_nodes.indexOf(elems[i].tagName) >= 0) {
        this.breakHTML(html);
        this.$element.find('break').remove();
        this.convertNewLines();
        return false;
      }
    }

    this.$element.find('break').remove();
    this.insertSimpleHTML(html);
    this.convertNewLines();
  };

  /**
   * Run shortcut.
   *
   * @param command - Command name.
   * @param val - Command value.
   * @returns {boolean}
   */
  Editable.prototype.execDefaultShortcut = function (method, params) {
    this[method].apply(this, params);

    return false;
  };

  /**
   * Init editor.
   */
  Editable.prototype.initEditor = function () {
    var cls = 'froala-editor';
    if (this.mobile()) {
      cls += ' touch';
    }
    if (this.browser.msie && Editable.getIEversion() < 9) {
      cls += ' ie8';
    }

    this.$editor = $('<div class="' + cls + '" style="display: none;">');

    var $container = this.$document.find(this.options.scrollableContainer);
    $container.append(this.$editor);

    if (this.options.inlineMode) {
      this.initInlineEditor();
    } else {
      this.initBasicEditor();
    }
  };

  Editable.prototype.refreshToolbarPosition = function () {
    // Scroll is where the editor is.
    if (this.$window.scrollTop() > this.$box.offset().top && this.$window.scrollTop() < this.$box.offset().top + this.$box.outerHeight() - this.$editor.outerHeight()) {
      this.$element.css('padding-top', this.$editor.outerHeight() + this.$element.data('padding-top'))
      this.$placeholder.css('margin-top', this.$editor.outerHeight() + this.$element.data('padding-top'))

      this.$editor
        .addClass('f-scroll')
        .removeClass('f-scroll-abs')
        .css('bottom', '')
        .css('left', this.$box.offset().left + parseFloat(this.$box.css('padding-left'), 10) - this.$window.scrollLeft())
        .width(this.$box.width() - parseFloat(this.$editor.css('border-left-width'), 10) - parseFloat(this.$editor.css('border-right-width'), 10))

      // IOS.
      if (this.iOS()) {
        if (this.$element.is(':focus')) {
          this.$editor.css('top', this.$window.scrollTop())
        }
        else {
          this.$editor.css('top', '');
        }
      }
    }

    // Scroll is above or below the editor.
    else {
      // Scroll is above.
      if (this.$window.scrollTop() < this.$box.offset().top) {
        if (this.iOS() && this.$element.is(':focus')) {
          this.$element.css('padding-top', this.$editor.outerHeight() + this.$element.data('padding-top'))
          this.$placeholder.css('margin-top', this.$editor.outerHeight() + this.$element.data('padding-top'))

          this.$editor
            .addClass('f-scroll')
            .removeClass('f-scroll-abs')
            .css('bottom', '')
            .css('left', this.$box.offset().left + parseFloat(this.$box.css('padding-left'), 10) - this.$window.scrollLeft())
            .width(this.$box.width() - parseFloat(this.$editor.css('border-left-width'), 10) - parseFloat(this.$editor.css('border-right-width'), 10))

          this.$editor.css('top', this.$box.offset().top)
        }
        else {
          this.$editor
            .removeClass('f-scroll f-scroll-abs')
            .css('bottom', '')
            .css('top', '')
            .width('');

          this.$element.css('padding-top', '');
          this.$placeholder.css('margin-top', '');
        }
      }

      // Scroll is below.
      else if (this.$window.scrollTop() > this.$box.offset().top + this.$box.outerHeight() - this.$editor.outerHeight() && !this.$editor.hasClass('f-scroll-abs')) {
        this.$element.css('padding-top', this.$editor.outerHeight() + this.$element.data('padding-top'))
        this.$placeholder.css('margin-top', this.$editor.outerHeight() + this.$element.data('padding-top'))

        this.$editor.removeClass('f-scroll').addClass('f-scroll-abs');
        this.$editor.css('bottom', 0).css('top', '').css('left', '');
      }
    }
  }

  Editable.prototype.toolbarTop = function () {
    if (!this.options.toolbarFixed && !this.options.inlineMode) {
      this.$element.data('padding-top', parseInt(this.$element.css('padding-top'), 10));
      this.$window.on('scroll resize load', $.proxy(function () {
        this.refreshToolbarPosition();
      }, this));

      if (this.iOS()) {
        this.$element.on('focus blur', $.proxy(function () {
          this.refreshToolbarPosition();
        }, this));
      }
    }
  };

  /**
   * Basic editor.
   */
  Editable.prototype.initBasicEditor = function () {
    this.$element.addClass('f-basic');
    this.$wrapper.addClass('f-basic');

    this.$popup_editor = this.$editor.clone();

    // if (this.options.scrollableContainer == 'body') this.options.scrollableContainer = this.$wrapper;
    var $container = this.$document.find(this.options.scrollableContainer)
    this.$popup_editor.appendTo($container).addClass('f-inline');

    this.$editor.addClass('f-basic').show();
    this.$editor.insertBefore(this.$wrapper);

    this.toolbarTop();
  };

  /**
   * Inline editor.
   */
  Editable.prototype.initInlineEditor = function () {
    this.$editor.addClass('f-inline');
    this.$element.addClass('f-inline');

    this.$popup_editor = this.$editor;
  };

  /**
   * Init drag for image insertion.
   */
  Editable.prototype.initDrag = function () {
    // Drag and drop support.
    this.drag_support = {
      filereader: typeof FileReader != 'undefined',
      formdata: !!this.window.FormData,
      progress: 'upload' in new XMLHttpRequest()
    };
  };

  /**
   * Init options.
   */
  Editable.prototype.initOptions = function () {
    this.setDimensions();

    this.setSpellcheck();

    this.setImageUploadURL();

    this.setButtons();

    this.setDirection();

    this.setZIndex();

    this.setTheme();

    if (this.options.editInPopup) {
      this.buildEditPopup();
    }

    if (!this.editableDisabled) {
      this.setPlaceholder();

      this.setPlaceholderEvents();
    }
  };

  Editable.prototype.setAllowStyle = function (allow_style) {
    if (typeof allow_style == 'undefined') allow_style = this.options.allowStyle;

    if (allow_style) this.options.allowedTags.push('style');
    else this.options.allowedTags.splice(this.options.allowedTags.indexOf('style'), 1);
  }

  Editable.prototype.setAllowScript = function (allow_script) {
    if (typeof allow_script == 'undefined') allow_script = this.options.allowScript;

    if (allow_script) this.options.allowedTags.push('script');
    else this.options.allowedTags.splice(this.options.allowedTags.indexOf('script'), 1);
  }

  /**
   * Determine if is touch device.
   */
  Editable.prototype.isTouch = function () {
    return WYSIWYGModernizr.touch && this.window.Touch !== undefined;
  };

  /**
   * Selection events.
   */
  Editable.prototype.initEditorSelection = function () {
    this.$element.on('keyup', $.proxy(function (e) {
      return this.triggerEvent('keyup', [e], false);
    }, this));

    this.$element.on('focus', $.proxy(function () {
      if (this.blurred) {
        this.blurred = false;

        if (!this.pasting && this.text() === '') {
          this.focus(false);
        }

        this.triggerEvent('focus', [], false);
      }
    }, this));

    // Hide editor on mouse down.
    this.$element.on('mousedown touchstart', $.proxy(function () {
      if (this.isDisabled) return false;

      if (!this.isResizing()) {
        this.closeImageMode();
        this.hide();
      }
    }, this));

    if (this.options.disableRightClick) {
      // Disable right click.
      this.$element.contextmenu($.proxy(function (e) {
        e.preventDefault();

        if (this.options.inlineMode) {
          this.$element.focus();
        }

        return false;
      }, this))
    }

    // Mouse up on element.
    this.$element.on(this.mouseup, $.proxy(function (e) {
      if (this.isDisabled) return false;

      if (!this.isResizing()) {
        var text = this.text();

        e.stopPropagation();
        this.imageMode = false;

        // There is text selected.
        if ((text !== '' || this.options.alwaysVisible || this.options.editInPopup || ((e.which == 3 || e.button == 2) && this.options.inlineMode && !this.isImage && this.options.disableRightClick)) && !this.link && !this.imageMode) {
          setTimeout($.proxy(function () {
            text = this.text();
            if ((text !== '' || this.options.alwaysVisible || this.options.editInPopup || ((e.which == 3 || e.button == 2) && this.options.inlineMode && !this.isImage && this.options.disableRightClick)) && !this.link && !this.imageMode) {
              this.show(e);

              if (this.options.editInPopup) {
                this.showEditPopup();
              }
            }
          }, this), 0);
        }

        // We are in basic mode. Refresh button state.
        else if (!this.options.inlineMode) {
          this.refreshButtons();
        }
      }

      this.hideDropdowns();
      this.hideOtherEditors()
    }, this));


    // Hide editor if not in inline mode.
    this.$editor.on(this.mouseup, $.proxy(function (e) {
      if (this.isDisabled) return false;

      if (!this.isResizing()) {
        e.stopPropagation();

        if (this.options.inlineMode === false) {
          this.hide();
        }
      }
    }, this));


    this.$editor.on('mousedown', '.fr-dropdown-menu', $.proxy(function (e) {
      if (this.isDisabled) return false;

      e.stopPropagation();
      this.noHide = true;
    }, this));

    this.$popup_editor.on('mousedown', '.fr-dropdown-menu', $.proxy(function (e) {
      if (this.isDisabled) return false;

      e.stopPropagation();
      this.noHide = true;
    }, this));


    // Mouse up on editor. If we have text or we are in image mode stop it.
    this.$popup_editor.on('mouseup', $.proxy(function (e) {
      if (this.isDisabled) return false;

      if (!this.isResizing()) {
        e.stopPropagation();
      }
    }, this));


    // Stop event propagation in link wrapper.
    if (this.$edit_popup_wrapper) {
      this.$edit_popup_wrapper.on('mouseup', $.proxy(function (e) {
        if (this.isDisabled) return false;

        if (!this.isResizing()) {
          e.stopPropagation();
        }
      }, this));
    }

    this.setDocumentSelectionChangeEvent();

    this.setWindowMouseUpEvent();

    this.setWindowKeyDownEvent();

    this.setWindowKeyUpEvent();

    this.setWindowOrientationChangeEvent();

    this.setWindowHideEvent();

    this.setWindowBlurEvent();

    // Add scrolling event.
    if (this.options.trackScroll) {
      this.setWindowScrollEvent();
    }

    this.setWindowResize();
  };

  Editable.prototype.setWindowResize = function () {
    this.$window.on('resize.' + this._id, $.proxy(function () {
      this.hide();
      this.closeImageMode();
      this.imageMode = false;
    }, this));
  }

  Editable.prototype.blur = function (clear_selection) {
    if (!this.blurred && !this.pasting) {
      this.selectionDisabled = true;
      this.triggerEvent('blur', []);

      if (clear_selection && $('*:focus').length === 0) {
        this.clearSelection();
      }

      if (!this.isLink && !this.isImage) this.selectionDisabled = false;

      this.blurred = true;
    }
  }

  Editable.prototype.setWindowBlurEvent = function () {
    this.$window.on('blur.' + this._id, $.proxy(function (e, clear_selection) {
      this.blur(clear_selection);
    }, this));
  }

  Editable.prototype.setWindowHideEvent = function () {
    // Hide event.
    this.$window.on('hide.' + this._id, $.proxy(function () {
      if (!this.isResizing()) {
        this.hide(false);
      } else {
        this.$element.find('.f-img-handle').trigger('moveend');
      }
    }, this));
  }

  // Hide on orientation change.
  Editable.prototype.setWindowOrientationChangeEvent = function () {
    this.$window.on('orientationchange.' + this._id, $.proxy(function () {
      setTimeout($.proxy(function () {
        this.hide();
      }, this), 10);
    }, this));
  };

  Editable.prototype.setDocumentSelectionChangeEvent = function () {
    // Selection changed. Touch support..
    this.$document.on('selectionchange.' + this._id, $.proxy(function (e) {
      if (this.isDisabled) return false;

      if (!this.isResizing() && !this.isScrolling) {
        clearTimeout(this.selectionChangedTimeout);
        this.selectionChangedTimeout = setTimeout($.proxy(function () {
          if (this.options.inlineMode && this.selectionInEditor() && this.link !== true && this.isTouch()) {
            var text = this.text();

            // There is text selected.
            if (text !== '') {
              if (!this.iPod()) {
                this.show(null);
              } else if (this.options.alwaysVisible) {
                this.hide();
              }

              e.stopPropagation();
            } else if (!this.options.alwaysVisible) {
              this.hide();
              this.closeImageMode();
              this.imageMode = false;
            } else {
              this.show(null);
            }
          }
        }, this), 75);
      }
    }, this));
  }

  Editable.prototype.setWindowMouseUpEvent = function () {
    // Window mouseup for current editor.
    this.$window.on(this.mouseup + '.' + this._id, $.proxy(function () {

      if (this.browser.webkit && !this.initMouseUp) {
        this.initMouseUp = true;
        return false;
      }

      if (!this.isResizing() && !this.isScrolling && !this.isDisabled) {
        this.$bttn_wrapper.find('button.fr-trigger').removeClass('active');

        if (this.selectionInEditor() && this.text() !== '' && !this.isTouch()) {
          this.show(null);
        } else if (this.$popup_editor.is(':visible')) {
          this.hide();
          this.closeImageMode();
          this.imageMode = false;
        }

        this.blur(true);
      }

      // Remove button down.
      $('[data-down]').removeAttr('data-down');
    }, this));
  }

  Editable.prototype.setWindowKeyDownEvent = function () {
    // Key down anywhere on window.
    this.$window.on('keydown.' + this._id, $.proxy(function (e) {
      var keyCode = e.which;

      if (keyCode == 27) {
        this.focus();
        this.restoreSelection();
        this.hide();
        this.closeImageMode();
        this.imageMode = false;
      }

      if (this.imageMode) {
        // Insert br before image if enter is hit.
        if (keyCode == 13) {
          this.$element.find('.f-img-editor').parents('.f-img-wrap').before('<br/>')
          this.sync();
          this.$element.find('.f-img-editor img').click();
          return false;
        }

        // Delete.
        if (keyCode == 46 || keyCode == 8) {
          e.stopPropagation();
          e.preventDefault();
          setTimeout($.proxy(function () {
            this.removeImage(this.$element.find('.f-img-editor img'));
          }, this), 0);
          return false;
        }
      }

      else if (this.selectionInEditor()) {
        if (this.isDisabled) return true;

        var ctrlKey = (e.ctrlKey || e.metaKey) && !e.altKey;
        if (!ctrlKey && this.$popup_editor.is(':visible')) {
          if ((this.$bttn_wrapper.is(':visible') && this.options.inlineMode)) {
            this.hide();
            this.closeImageMode();
            this.imageMode = false;
          }
        }
      }
    }, this));

  }

  Editable.prototype.setWindowKeyUpEvent = function () {
    // Key up anywhere on window.
    this.$window.on('keyup.' + this._id, $.proxy(function () {
      if (this.isDisabled) return false;

      if (this.selectionInEditor() && this.text() !== '' && !this.$popup_editor.is(':visible')) {
        this.repositionEditor();
      }
    }, this));
  }

  Editable.prototype.setWindowScrollEvent = function () {
    $.merge(this.$window, $(this.options.scrollableContainer)).on('scroll.' + this._id, $.proxy(function () {
      if (this.isDisabled) return false;

      clearTimeout(this.scrollTimer);
      this.isScrolling = true;
      this.scrollTimer = setTimeout($.proxy(function () {
        this.isScrolling = false;
      }, this), 2500);
    }, this));
  }

  /**
   * Set placeholder.
   *
   * @param text - Placeholder text.
   */
  Editable.prototype.setPlaceholder = function (text) {
    if (text) {
      this.options.placeholder = text;
    }

    if (this.$textarea) {
      this.$textarea.attr('placeholder', this.options.placeholder);
    }

    if (!this.$placeholder) {
      this.$placeholder = $('<span class="fr-placeholder" unselectable="on"></span>')
        .bind('click', $.proxy(function () {
          this.focus();
        }, this));

      this.$element.after(this.$placeholder);
    }

    this.$placeholder.text(this.options.placeholder);
  };

  Editable.prototype.isEmpty = function () {
    var text = this.$element.text().replace(/(\r\n|\n|\r|\t|\u200B|\u0020)/gm, '');
    return text === '' &&
      this.$element.find('img, table, iframe, input, textarea, hr, li, object').length === 0 &&
      this.$element.find(this.options.defaultTag + ' > br, br').length === 0 &&
      this.$element.find($.map(this.valid_nodes, $.proxy(function (val) {
        return this.options.defaultTag == val ? null : val;
      }, this)).join(', ')).length === 0;
  };

  Editable.prototype.checkPlaceholder = function (ignore_flags) {
    if (this.isDisabled && !ignore_flags) return false;
    if (this.pasting && !ignore_flags) return false;

    this.$element.find('td:empty, th:empty').append($.Editable.INVISIBLE_SPACE);
    this.$element.find(this.valid_nodes.join(':empty, ') + ':empty').append(this.br);

    if (!this.isHTML) {
      // Empty.
      if (this.isEmpty() && !this.fakeEmpty()) {
        var $p;
        var focused = this.selectionInEditor() || this.$element.is(':focus');

        if (this.options.paragraphy) {
          $p = $('<' + this.options.defaultTag + '>' + this.br + '</' + this.options.defaultTag + '>');
          this.$element.html($p);

          if (focused) {
            this.setSelection($p.get(0));
          }

          this.$element.addClass('f-placeholder');
        }

        else {
          if (this.$element.find('br').length === 0 && !(this.browser.msie && Editable.getIEversion() <= 10)) {
            this.$element.append(this.br);
            if (focused && this.browser.msie) {
              this.focus();
            }
          }

          this.$element.addClass('f-placeholder');
        }
      }

      // There is no p.
      else if (!this.$element.find(this.options.defaultTag + ', li, td, th').length && this.options.paragraphy) {
        // Wrap text.
        this.wrapText(true);

        // Place cursor.
        if (this.$element.find(this.options.defaultTag).length && this.text() === '') {
          this.setSelection(this.$element.find(this.options.defaultTag)[0], this.$element.find(this.options.defaultTag).text().length, null, this.$element.find(this.options.defaultTag).text().length);
        } else {
          this.$element.removeClass('f-placeholder');
        }
      }

      // Not empty at all.
      else if (this.fakeEmpty() === false && (!this.options.paragraphy || this.$element.find(this.valid_nodes.join(',')).length >= 1)) {
        this.$element.removeClass('f-placeholder');
      }

      else if (!this.options.paragraphy && this.$element.find(this.valid_nodes.join(',')).length >= 1) {
        this.$element.removeClass('f-placeholder');
      }

      else {
        this.$element.addClass('f-placeholder');
      }
    }

    return true;
  }

  // Determine if it's not fake empty.
  Editable.prototype.fakeEmpty = function ($element) {
    if ($element === undefined) {
      $element = this.$element;
    }

    var defaultTag = true;
    if (this.options.paragraphy) {
      if ($element.find(this.options.defaultTag).length == 1) defaultTag = true;
      else defaultTag = false;
    }

    var text = $element.text().replace(/(\r\n|\n|\r|\t|\u200B)/gm, '');
    return text === '' && (defaultTag && $element.find('br, li').length == 1)
      && $element.find('img, table, iframe, input, textarea, hr, li').length === 0;
  }

  // For Korean keydown keyup events are not dispatched in Firefox.
  // https://bugzilla.mozilla.org/show_bug.cgi?id=354358
  Editable.prototype.setPlaceholderEvents = function () {
    // Older browsers.
    if (!(this.browser.msie && Editable.getIEversion() < 9)) {
      // IE needs click for focus on outside of the contenteditable.
      this.$element.on('focus click', $.proxy(function (e) {
        if (this.isDisabled) return false;

        if ((this.$element.text() === '') && !this.pasting) {
          // If click instead of focus then do focus. IE only.
          if (!this.$element.data('focused') && e.type === 'click') {
            this.$element.focus();
          }
          else if (e.type == 'focus') {
            this.focus(false);
          }

          this.$element.data('focused', true);
        }
      }, this))

      this.$element.on('keyup keydown input focus placeholderCheck', $.proxy(function () {
        return this.checkPlaceholder();
      }, this));

      this.$element.trigger('placeholderCheck');
    }
  };

  /**
   * Set element dimensions.
   *
   * @param width - Editor width.
   * @param height - Editor height.
   */
  Editable.prototype.setDimensions = function (height, width, minHeight, maxHeight) {

    if (height) {
      this.options.height = height;
    }

    if (width) {
      this.options.width = width;
    }

    if (minHeight) {
      this.options.minHeight = minHeight;
    }

    if (maxHeight) {
      this.options.maxHeight = maxHeight;
    }

    if (this.options.height != 'auto') {
      this.$wrapper.css('height', this.options.height);
      this.$element.css('minHeight', this.options.height - parseInt(this.$element.css('padding-top'), 10) - parseInt(this.$element.css('padding-bottom'), 10));
    }

    if (this.options.minHeight != 'auto') {
      this.$wrapper.css('minHeight', this.options.minHeight);
      this.$element.css('minHeight', this.options.minHeight);
    }

    if (this.options.maxHeight != 'auto') {
      this.$wrapper.css('maxHeight', this.options.maxHeight);
    }

    if (this.options.width != 'auto') {
      this.$box.css('width', this.options.width);
    }
  };

  /**
   * Set element direction.
   *
   * @param dir - Text direction.
   */
  Editable.prototype.setDirection = function (dir) {
    if (dir) {
      this.options.direction = dir;
    }

    if (this.options.direction != 'ltr' && this.options.direction != 'rtl') {
      this.options.direction = 'ltr';
    }

    if (this.options.direction == 'rtl') {
      this.$element.removeAttr('dir');
      this.$box.addClass('f-rtl');
      this.$element.addClass('f-rtl');
      this.$editor.addClass('f-rtl');
      this.$popup_editor.addClass('f-rtl');
      if (this.$image_modal) {
        this.$image_modal.addClass('f-rtl');
      }
    } else {
      this.$element.attr('dir', 'auto');
      this.$box.removeClass('f-rtl');
      this.$element.removeClass('f-rtl');
      this.$editor.removeClass('f-rtl');
      this.$popup_editor.removeClass('f-rtl');
      if (this.$image_modal) {
        this.$image_modal.removeClass('f-rtl');
      }
    }
  };

  Editable.prototype.setZIndex = function (zIndex) {
    if (zIndex) {
      this.options.zIndex = zIndex;
    }

    this.$editor.css('z-index', this.options.zIndex);
    this.$popup_editor.css('z-index', this.options.zIndex + 1);
    if (this.$overlay) {
      this.$overlay.css('z-index', this.options.zIndex + 2);
    }
    if (this.$image_modal) {
      this.$image_modal.css('z-index', this.options.zIndex + 3);
    }
  }

  Editable.prototype.setTheme = function (theme) {
    if (theme) {
      this.options.theme = theme;
    }

    if (this.options.theme != null) {
      this.$editor.addClass(this.options.theme + '-theme');
      this.$popup_editor.addClass(this.options.theme + '-theme');
      if (this.$box) {
        this.$box.addClass(this.options.theme + '-theme');
      }
      if (this.$image_modal) {
        this.$image_modal.addClass(this.options.theme + '-theme');
        // this.$overlay.addClass(this.options.theme + '-theme');
      }
    }
  }

  Editable.prototype.setSpellcheck = function (enable) {
    if (enable !== undefined) {
      this.options.spellcheck = enable;
    }

    this.$element.attr('spellcheck', this.options.spellcheck);
  };

  Editable.prototype.customizeText = function (customText) {
    if (customText) {
      var list = this.$editor.find('[title]').add(this.$popup_editor.find('[title]'));

      if (this.$image_modal) {
        list = list.add(this.$image_modal.find('[title]'));
      }

      list.each($.proxy(function (index, elem) {
        for (var old_text in customText) {
          if ($(elem).attr('title').toLowerCase() == old_text.toLowerCase()) {
            $(elem).attr('title', customText[old_text]);
          }
        }
      }, this));


      list = this.$editor.find('[data-text="true"]').add(this.$popup_editor.find('[data-text="true"]'))
      if (this.$image_modal) {
        list = list.add(this.$image_modal.find('[data-text="true"]'));
      }

      list.each($.proxy(function (index, elem) {
        for (var old_text in customText) {
          if ($(elem).text().toLowerCase() == old_text.toLowerCase()) {
            $(elem).text(customText[old_text]);
          }
        }
      }, this));
    }
  };

  Editable.prototype.setLanguage = function (lang) {
    if (lang !== undefined) {
      this.options.language = lang;
    }

    if ($.Editable.LANGS[this.options.language]) {
      this.customizeText($.Editable.LANGS[this.options.language].translation);
      if ($.Editable.LANGS[this.options.language].direction && $.Editable.LANGS[this.options.language].direction != $.Editable.DEFAULTS.direction) {
        this.setDirection($.Editable.LANGS[this.options.language].direction);
      }

      if ($.Editable.LANGS[this.options.language].translation[this.options.placeholder]) {
        this.setPlaceholder($.Editable.LANGS[this.options.language].translation[this.options.placeholder]);
      }
    }
  };

  Editable.prototype.setCustomText = function (customText) {
    if (customText) {
      this.options.customText = customText;
    }

    if (this.options.customText) {
      this.customizeText(this.options.customText);
    }
  };

  Editable.prototype.execHTML = function () {
    this.html();
  };

  Editable.prototype.initHTMLArea = function () {
    this.$html_area = $('<textarea wrap="hard">')
      .keydown(function (e) {
        var keyCode = e.keyCode || e.which;

        if (keyCode == 9) {
          e.preventDefault();
          var start = $(this).get(0).selectionStart;
          var end = $(this).get(0).selectionEnd;

          // set textarea value to: text before caret + tab + text after caret
          $(this).val($(this).val().substring(0, start) + '\t' + $(this).val().substring(end));

          // put caret at right position again
          $(this).get(0).selectionStart = $(this).get(0).selectionEnd = start + 1;
        }
      })
      .focus($.proxy(function () {
        if (this.blurred) {
          this.blurred = false;

          this.triggerEvent('focus', [], false);
        }
      }, this))
      .mouseup($.proxy(function () {
        if (this.blurred) {
          this.blurred = false;

          this.triggerEvent('focus', [], false);
        }
      }, this))
  };

  Editable.prototype.command_dispatcher = {
    align: function (command) {
      var dropdown = this.buildDropdownAlign(command);
      var btn = this.buildDropdownButton(command, dropdown);
      return btn;
    },

    formatBlock: function (command) {
      var dropdown = this.buildDropdownFormatBlock(command);
      var btn = this.buildDropdownButton(command, dropdown);
      return btn;
    },

    html: function (command) {
      var btn = this.buildDefaultButton(command);

      if (this.options.inlineMode) {
        this.$box.append($(btn).clone(true).addClass('html-switch').attr('title', 'Hide HTML').click($.proxy(this.execHTML, this)));
      }

      this.initHTMLArea();

      return btn;
    }
  }

  /**
   * Set buttons for editor.
   *
   * @param buttons
   */
  Editable.prototype.setButtons = function (buttons) {
    if (buttons) {
      this.options.buttons = buttons;
    }

    this.$editor.append('<div class="bttn-wrapper" id="bttn-wrapper-' + this._id + '">');
    this.$bttn_wrapper = this.$editor.find('#bttn-wrapper-' + this._id);

    if (this.mobile()) {
      this.$bttn_wrapper.addClass('touch');
    }

    var dropdown;
    var btn;

    var btn_string = '';
    // Add commands to editor.
    for (var i = 0; i < this.options.buttons.length; i++) {
      var button_name = this.options.buttons[i];

      if (button_name == 'sep') {
        if (this.options.inlineMode) {
          btn_string += '<div class="f-clear"></div><hr/>';
        } else {
          btn_string += '<span class="f-sep"></span>';
        }
        continue;
      }

      // Look for custom button with that name.
      var command = Editable.commands[button_name];
      if (command === undefined) {
        command = this.options.customButtons[button_name];

        if (command === undefined) {
          command = this.options.customDropdowns[button_name];

          if (command === undefined) {
            continue;
          }
          else {
            btn = this.buildCustomDropdown(command, button_name);
            btn_string += btn;
            this.bindRefreshListener(command);
            continue;
          }
        } else {
          btn = this.buildCustomButton(command, button_name);
          btn_string += btn;
          this.bindRefreshListener(command);
          continue;
        }
      }

      command.cmd = button_name;
      var command_dispatch = this.command_dispatcher[command.cmd];

      if (command_dispatch) {
        btn_string += command_dispatch.apply(this, [command]);
      } else {
        if (command.seed) {
          dropdown = this.buildDefaultDropdown(command);
          btn = this.buildDropdownButton(command, dropdown);
          btn_string += btn;
        } else {
          btn = this.buildDefaultButton(command);
          btn_string += btn;
          this.bindRefreshListener(command);
        }
      }
    }

    this.$bttn_wrapper.html(btn_string);
    this.$bttn_wrapper.find('button[data-cmd="undo"], button[data-cmd="redo"]').prop('disabled', true);

    // Assign events.
    this.bindButtonEvents();
  };

  Editable.prototype.bindRefreshListener = function (command) {
    if (command.refresh) {
      this.addListener('refresh', $.proxy(function () {
        command.refresh.apply(this, [command.cmd])
      }, this));
    }
  }

  /**
   * Create button for command.
   *
   * @param command - Command name.
   * @returns {*}
   */
  Editable.prototype.buildDefaultButton = function (command) {
    var btn = '<button tabIndex="-1" type="button" class="fr-bttn" title="' + command.title + '" data-cmd="' + command.cmd + '">';

    if (this.options.icons[command.cmd] === undefined) {
      btn += this.addButtonIcon(command);
    } else {
      btn += this.prepareIcon(this.options.icons[command.cmd], command.title);
    }

    btn += '</button>';

    return btn;
  };

  /*
   * Prepare icon.
   */
  Editable.prototype.prepareIcon = function (icon, title) {
    switch (icon.type) {
      case 'font':
        return this.addButtonIcon({
          icon: icon.value
        });

      case 'img':
        return this.addButtonIcon({
          icon_img: icon.value,
          title: title
        });

      case 'txt':
        return this.addButtonIcon({
          icon_txt: icon.value
        });
    }
  };


  /**
   * Add icon to button.
   *
   * @param $btn - jQuery object.
   * @param command - Command name.
   */
  Editable.prototype.addButtonIcon = function (command) {
    if (command.icon) {
      return '<i class="' + command.icon + '"></i>';
    } else if (command.icon_alt) {
      return '<i class="for-text">' + command.icon_alt + '</i>';
    } else if (command.icon_img) {
      return '<img src="' + command.icon_img + '" alt="' + command.title + '"/>';
    } else if (command.icon_txt) {
      return '<i>' + command.icon_txt + '</i>';
    } else {
      return command.title;
    }
  };

  Editable.prototype.buildCustomButton = function (button, button_name) {
    this['call_' + button_name] = button.callback;
    var btn = '<button tabIndex="-1" type="button" class="fr-bttn" data-callback="call_' + button_name + '" data-cmd="button_name" data-name="' + button_name + '" title="' + button.title + '">' + this.prepareIcon(button.icon, button.title) + '</button>';

    return btn;
  };

  Editable.prototype.callDropdown = function (btn_name, callback) {
    this.$bttn_wrapper.on('click touch', '[data-name="' + btn_name + '"]', $.proxy(function (e) {
      e.preventDefault();
      e.stopPropagation();
      callback.apply(this);
    }, this))
  };

  Editable.prototype.buildCustomDropdown = function (button, button_name) {
    // Dropdown button.
    var btn_wrapper = '<div class="fr-bttn fr-dropdown">';

    btn_wrapper += '<button tabIndex="-1" type="button" class="fr-trigger" title="' + button.title + '" data-name="' + button_name + '">' + this.prepareIcon(button.icon, button.title) + '</button>';

    btn_wrapper += '<ul class="fr-dropdown-menu">';

    var i = 0;
    for (var text in button.options) {
      this['call_' + button_name + i] = button.options[text];
      var m_btn = '<li data-callback="call_' + button_name + i + '" data-cmd="' + button_name + i + '" data-name="' + button_name + i + '"><a href="#">' + text + '</a></li>';

      btn_wrapper += m_btn;

      i++ ;
    }

    btn_wrapper += '</ul></div>';

    return btn_wrapper;
  };

  /**
   * Default dropdown.
   *
   * @param command - Command.
   * @param cls - Dropdown custom class.
   * @returns {*}
   */
  Editable.prototype.buildDropdownButton = function (command, dropdown, cls) {
    cls = cls || '';

    // Dropdown button.
    var btn_wrapper = '<div class="fr-bttn fr-dropdown ' + cls + '">';

    var icon = '';
    if (this.options.icons[command.cmd] === undefined) {
      icon += this.addButtonIcon(command);
    } else {
      icon += this.prepareIcon(this.options.icons[command.cmd], command.title);
    }

    var btn = '<button tabIndex="-1" type="button" data-name="' + command.cmd + '" class="fr-trigger" title="' + command.title + '">' + icon + '</button>';

    btn_wrapper += btn;
    btn_wrapper += dropdown;
    btn_wrapper += '</div>';

    return btn_wrapper;
  };

  /**
   * Dropdown for align.
   *
   * @param command
   * @returns {*}
   */
  Editable.prototype.buildDropdownAlign = function (command) {
    this.bindRefreshListener(command);

    var dropdown = '<ul class="fr-dropdown-menu f-align">';

    // Iterate color seed.
    for (var j = 0; j < command.seed.length; j++) {
      var align = command.seed[j];

      dropdown += '<li data-cmd="align" data-val="' + align.cmd + '" title="' + align.title + '"><a href="#"><i class="' + align.icon + '"></i></a></li>';
    }

    dropdown += '</ul>';

    return dropdown;
  };



  /**
   * Dropdown for formatBlock.
   *
   * @param command
   * @returns {*}
   */
  Editable.prototype.buildDropdownFormatBlock = function (command) {
    var dropdown = '<ul class="fr-dropdown-menu">';

    // Iterate format block seed.
    for (var b_name in this.options.blockTags) {
      var format_btn = '<li data-cmd="' + command.cmd + '" data-val="' + b_name + '">';
      format_btn += '<a href="#" data-text="true" class="format-' + b_name + '" title="' + this.options.blockTags[b_name] + '">' + this.options.blockTags[b_name] + '</a></li>';

      dropdown += format_btn;
    }

    dropdown += '</ul>';

    return dropdown;
  };

  /**
   * Dropdown for formatBlock.
   *
   * @param command
   * @returns {*}
   */
  Editable.prototype.buildDefaultDropdown = function (command) {
    var dropdown = '<ul class="fr-dropdown-menu">';

    // Iterate format block seed.
    for (var j = 0; j < command.seed.length; j++) {
      var cmd = command.seed[j];

      var format_btn = '<li data-namespace="' + command.namespace + '" data-cmd="' + (cmd.cmd || command.cmd) + '" data-val="' + cmd.value + '" data-param="' + (cmd.param || command.param) + '">'
      format_btn += '<a href="#" data-text="true" class="' + cmd.value + '" title="' + cmd.title + '">' + cmd.title + '</a></li>';

      dropdown += format_btn;
    }

    dropdown += '</ul>';

    return dropdown;
  };

  Editable.prototype.createEditPopupHTML = function () {
    var html = '<div class="froala-popup froala-text-popup" style="display:none;">';
    html += '<h4><span data-text="true">Edit text</span><i title="Cancel" class="fa fa-times" id="f-text-close-' + this._id + '"></i></h4></h4>';
    html += '<div class="f-popup-line"><input type="text" placeholder="http://www.example.com" class="f-lu" id="f-ti-' + this._id + '">';
    html += '<button data-text="true" type="button" class="f-ok" id="f-edit-popup-ok-' + this._id + '">OK</button>';
    html += '</div>';
    html += '</div>';

    return html;
  }

  /**
   * Build create link.
   */
  Editable.prototype.buildEditPopup = function () {
    this.$edit_popup_wrapper = $(this.createEditPopupHTML());
    this.$popup_editor.append(this.$edit_popup_wrapper);

    this.$edit_popup_wrapper.find('#f-ti-' + this._id).on('mouseup keydown', function (e) {
      e.stopPropagation();
    });

    this.addListener('hidePopups', $.proxy(function () {
      this.$edit_popup_wrapper.hide();
    }, this));

    this.$edit_popup_wrapper.on('click', '#f-edit-popup-ok-' + this._id, $.proxy(function () {
      this.$element.text(this.$edit_popup_wrapper.find('#f-ti-' + this._id).val());
      this.sync();
      this.hide();
    }, this));

    // Close button.
    this.$edit_popup_wrapper
      .on('click', 'i#f-text-close-' + this._id, $.proxy(function () {
        this.hide();
      }, this))
  };

  /**
   * Make request with CORS.
   *
   * @param method
   * @param url
   * @returns {XMLHttpRequest}
   */
  Editable.prototype.createCORSRequest = function (method, url) {
    var xhr = new XMLHttpRequest();
    if ('withCredentials' in xhr) {

      // Check if the XMLHttpRequest object has a "withCredentials" property.
      // "withCredentials" only exists on XMLHTTPRequest2 objects.
      xhr.open(method, url, true);

      // Set with credentials.
      if (this.options.withCredentials) {
        xhr.withCredentials = true;
      }

      // Set headers.
      for (var header in this.options.headers) {
        xhr.setRequestHeader(header, this.options.headers[header]);
      }

    } else if (typeof XDomainRequest != 'undefined') {

      // Otherwise, check if XDomainRequest.
      // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      // Otherwise, CORS is not supported by the browser.
      xhr = null;

    }
    return xhr;
  };

  /**
   * Check if command is enabled.
   *
   * @param cmd - Command name.
   * @returns {boolean}
   */
  Editable.prototype.isEnabled = function (cmd) {
    return $.inArray(cmd, this.options.buttons) >= 0;
  };


  /**
   * Bind events for buttons.
   */
  Editable.prototype.bindButtonEvents = function () {
    this.bindDropdownEvents(this.$bttn_wrapper);

    this.bindCommandEvents(this.$bttn_wrapper);
  };

  /**
   * Bind events for dropdown.
   */
  Editable.prototype.bindDropdownEvents = function ($div) {
    var that = this;

    $div.on(this.mousedown, '.fr-dropdown .fr-trigger:not([disabled])', function (e) {
      if (e.type === 'mousedown' && e.which !== 1) return true;

      if (!(this.tagName === 'LI' && e.type === 'touchstart' && that.android()) && !that.iOS()) {
        e.preventDefault();
      }

      // Simulate click.
      $(this).attr('data-down', true);
    });

    // Dropdown event.
    $div.on(this.mouseup, '.fr-dropdown .fr-trigger:not([disabled])', function (e) {
      if (that.isDisabled) return false;

      e.stopPropagation();
      e.preventDefault();

      if (!$(this).attr('data-down')) {
        $('[data-down]').removeAttr('data-down');
        return false;
      }

      $('[data-down]').removeAttr('data-down');

      if (that.options.inlineMode === false && $(this).parents('.froala-popup').length === 0) {
        that.hide();
        that.closeImageMode();
        that.imageMode = false;
      }

      $(this)
        .toggleClass('active')
        .trigger('blur');

      var refreshCallback;
      var btn_name = $(this).attr('data-name');

      if (Editable.commands[btn_name]) {
        refreshCallback = Editable.commands[btn_name].refreshOnShow;
      } else if (that.options.customDropdowns[btn_name]) {
        refreshCallback = that.options.customDropdowns[btn_name].refreshOnShow;
      } else if (Editable.image_commands[btn_name]) {
        refreshCallback = Editable.image_commands[btn_name].refreshOnShow;
      }

      if (refreshCallback) {
        refreshCallback.call(that);
      }


      $div.find('button.fr-trigger').not(this).removeClass('active');

      return false;
    });

    $div.on(this.mouseup, '.fr-dropdown', function (e) {
      e.stopPropagation();
      e.preventDefault();
    });

    this.$element.on('mouseup', 'img, a', $.proxy(function () {
      if (this.isDisabled) return false;

      $div.find('.fr-dropdown .fr-trigger').removeClass('active');
    }, this));

    // Prevent click in A tag inside LI.
    $div.on('click', 'li[data-cmd] > a', function (e) {
      e.preventDefault();
    });
  };

  /**
   * Bind events for button command.
   */
  Editable.prototype.bindCommandEvents = function ($div) {
    var that = this;

    $div.on(this.mousedown, 'button[data-cmd], li[data-cmd], span[data-cmd], a[data-cmd]', function (e) {
      if (e.type === 'mousedown' && e.which !== 1) return true;

      if (!(this.tagName === 'LI' && e.type === 'touchstart' && that.android()) && !that.iOS()) {
        e.preventDefault();
      }

      // Simulate click.
      $(this).attr('data-down', true);
    });

    $div.on(this.mouseup + ' ' + this.move, 'button[data-cmd], li[data-cmd], span[data-cmd], a[data-cmd]', $.proxy(function (e) {
      if (that.isDisabled) return false;

      if (e.type === 'mouseup' && e.which !== 1) return true;

      var elem = e.currentTarget;

      if (e.type != 'touchmove') {
        e.stopPropagation();
        e.preventDefault();

        // Simulate click.
        if (!$(elem).attr('data-down')) {
          $('[data-down]').removeAttr('data-down');
          return false;
        }
        $('[data-down]').removeAttr('data-down');

        if ($(elem).data('dragging') || $(elem).attr('disabled')) {
          $(elem).removeData('dragging');
          return false;
        }

        var timeout = $(elem).data('timeout');
        if (timeout) {
          clearTimeout(timeout);
          $(elem).removeData('timeout');
        }

        var callback = $(elem).attr('data-callback');

        if (that.options.inlineMode === false && $(elem).parents('.froala-popup').length === 0) {
          that.hide();
          that.closeImageMode();
          that.imageMode = false;
        }

        if (callback) {
          // Hide possible dropdowns.
          $(elem).parents('.fr-dropdown').find('.fr-trigger.active').removeClass('active');

          // Callback.
          that[callback]();
        }
        else {
          var namespace = $(elem).attr('data-namespace');
          var cmd = $(elem).attr('data-cmd');
          var val = $(elem).attr('data-val');
          var param = $(elem).attr('data-param');
          if (namespace) {
            that['exec' + namespace](cmd, val, param);
          }
          else {
            that.exec(cmd, val, param);
            that.$bttn_wrapper.find('.fr-dropdown .fr-trigger').removeClass('active');
          }
        }

        return false;
      }

      else {
        if (!$(elem).data('timeout')) {
          $(elem).data('timeout', setTimeout(function () {
            $(elem).data('dragging', true);
          }, 200));
        }
      }
    }, this));
  };

  /**
   * Save in DB.
   */
  Editable.prototype.save = function () {
    if (!this.triggerEvent('beforeSave', [], false)) {
      return false;
    }

    if (this.options.saveURL) {
      var params = {};
      for (var key in this.options.saveParams) {
        var param = this.options.saveParams[key];
        if (typeof(param) == 'function') {
          params[key] = param.call(this);
        } else {
          params[key] = param;
        }
      }

      var dt = {};
      dt[this.options.saveParam] = this.getHTML();

      $.ajax({
        type: this.options.saveRequestType,
        url: this.options.saveURL,
        data: $.extend(dt, params),
        crossDomain: this.options.crossDomain,
        xhrFields: {
          withCredentials: this.options.withCredentials
        },
        headers: this.options.headers
      })
      .done($.proxy(function (data) {
        // data
        this.triggerEvent('afterSave', [data]);
      }, this))
      .fail($.proxy(function () {
        // (error)
        this.triggerEvent('saveError', ['Save request failed on the server.']);
      }, this));

    } else {
      // (error)
      this.triggerEvent('saveError', ['Missing save URL.']);
    }
  };

  Editable.prototype.isURL = function (url) {
    if (!/^(https?:|ftps?:|)\/\//.test(url)) return false;

    url = String(url)
            .replace(/</g, '%3C')
            .replace(/>/g, '%3E')
            .replace(/"/g, '%22')
            .replace(/ /g, '%20');


    var test_reg = /\(?(?:(https?:|ftps?:|)\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|(?:www.)?(?:[^\W\s]|\.|-)|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/gi;

    return test_reg.test(url);
  }

  Editable.prototype.sanitizeURL = function (url) {
    if (/^(https?:|ftps?:|)\/\//.test(url)) {
      if (!this.isURL(url)) {
        return '';
      }
    }
    else {
      url = encodeURIComponent(url)
                .replace(/%23/g, '#')
                .replace(/%2F/g, '/')
                .replace(/%25/g, '%')
                .replace(/mailto%3A/g, 'mailto:')
                .replace(/tel%3A/g, 'tel:')
                .replace(/data%3Aimage/g, 'data:image')
                .replace(/webkit-fake-url%3A/g, 'webkit-fake-url:')
                .replace(/%3F/g, '?')
                .replace(/%3D/g, '=')
                .replace(/%26/g, '&')
                .replace(/&amp;/g, '&')
                .replace(/%2C/g, ',')
                .replace(/%3B/g, ';')
                .replace(/%2B/g, '+')
                .replace(/%40/g, '@');
    }

    return url;
  }

  Editable.prototype.parents = function ($element, selector) {
    if ($element.get(0) != this.$element.get(0)) {
      return $element.parentsUntil(this.$element, selector);
    }

    return [];
  }

  Editable.prototype.option = function (prop, val) {
    if (prop === undefined) {
      return this.options;
    } else if (prop instanceof Object) {
      this.options = $.extend({}, this.options, prop);

      this.initOptions();
      this.setCustomText();
      this.setLanguage();
      this.setAllowScript();
      this.setAllowStyle();
    } else if (val !== undefined) {
      this.options[prop] = val;

      switch (prop) {
        case 'direction':
          this.setDirection();
          break;
        case 'height':
        case 'width':
        case 'minHeight':
        case 'maxHeight':
          this.setDimensions();
          break;
        case 'spellcheck':
          this.setSpellcheck();
          break;
        case 'placeholder':
          this.setPlaceholder();
          break;
        case 'customText':
          this.setCustomText();
          break;
        case 'language':
          this.setLanguage();
          break;
        case 'textNearImage':
          this.setTextNearImage();
          break;
        case 'zIndex':
          this.setZIndex();
          break;
        case 'theme':
          this.setTheme();
          break;
        case 'allowScript':
          this.setAllowScript();
          break;
        case 'allowStyle':
          this.setAllowStyle();
          break;
      }
    } else {
      return this.options[prop];
    }
  };

  // EDITABLE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.editable;

  $.fn.editable = function (option) {
    var arg_list = [];
    for (var i = 0; i < arguments.length; i++) {
      arg_list.push(arguments[i]);
    }

    if (typeof option == 'string') {
      var returns = [];

      this.each(function () {
        var $this = $(this);
        var editor = $this.data('fa.editable');

        if (editor[option]) {
          var returned_value = editor[option].apply(editor, arg_list.slice(1));
          if (returned_value === undefined) {
            returns.push(this);
          } else if (returns.length === 0) {
            returns.push(returned_value);
          }
        }
        else {
          return $.error('Method ' +  option + ' does not exist in Froala Editor.');
        }
      });

      return (returns.length == 1) ? returns[0] : returns;
    }
    else if (typeof option === 'object' || !option) {
      return this.each(function () {
        var that = this;
        var $this = $(that);
        var editor = $this.data('fa.editable');

        if (!editor) $this.data('fa.editable', (editor = new Editable(that, option)));
      });
    }
  };

  $.fn.editable.Constructor = Editable;
  $.Editable = Editable;

  $.fn.editable.noConflict = function () {
    $.fn.editable = old;
    return this;
  };
}(window.jQuery);

(function ($) {
  /**
   * Init undo support.
   */
  $.Editable.prototype.initUndoRedo = function () {
    // Undo stack array.
    this.undoStack = [];
    this.undoIndex = 0;
    this.saveUndoStep();

    this.disableBrowserUndo();
  };

  /**
   * Undo.
   */
  $.Editable.prototype.undo = function () {
    this.no_verify = true;
    if (this.undoIndex > 1) {
      clearTimeout(this.typingTimer);

      this.triggerEvent('beforeUndo', [], false);

      var snapshot = this.undoStack[--this.undoIndex - 1];
      this.restoreSnapshot(snapshot);

      this.doingRedo = true;
      this.triggerEvent('afterUndo', []);
      this.doingRedo = false;

      if (this.text() !== '') {
        this.repositionEditor();
      }
      else {
        this.hide();
      }

      this.$element.trigger('placeholderCheck');
      this.focus();
      this.refreshButtons();
    }
    this.no_verify = false;
  };

  /**
   * Redo.
   */
  $.Editable.prototype.redo = function () {
    this.no_verify = true;

    if (this.undoIndex < this.undoStack.length) {
      clearTimeout(this.typingTimer);

      this.triggerEvent('beforeRedo', [], false);

      var snapshot = this.undoStack[this.undoIndex++];
      this.restoreSnapshot(snapshot);

      this.doingRedo = true;
      this.triggerEvent('afterRedo', []);
      this.doingRedo = false;

      if (this.text() !== '') {
        this.repositionEditor();
      }
      else {
        this.hide();
      }

      this.$element.trigger('placeholderCheck');
      this.focus();
      this.refreshButtons();
    }
    this.no_verify = false;
  };

  /**
   * Save current HTML in undo stack.
   */
  $.Editable.prototype.saveUndoStep = function () {
    if (!this.undoStack) return false;

    while (this.undoStack.length > this.undoIndex) {
      this.undoStack.pop();
    }

    var snapshot = this.getSnapshot();

    if (!this.undoStack[this.undoIndex - 1] || !this.identicSnapshots(this.undoStack[this.undoIndex - 1], snapshot)) {
      this.undoStack.push(snapshot);
      this.undoIndex++;
    }

    this.refreshUndo();
    this.refreshRedo();
  };

  /**
   * Refresh undo, redo buttons.
   */
  $.Editable.prototype.refreshUndo = function () {
    if (this.isEnabled('undo')) {
      if (this.$editor === undefined) return;

      this.$bttn_wrapper.find('[data-cmd="undo"]').removeAttr('disabled');

      if (this.undoStack.length === 0 || this.undoIndex <= 1 || this.isHTML) {
        this.$bttn_wrapper.find('[data-cmd="undo"]').attr('disabled', true);
      }
    }
  };

  $.Editable.prototype.refreshRedo = function () {
    if (this.isEnabled('redo')) {
      if (this.$editor === undefined) return;

      this.$bttn_wrapper.find('[data-cmd="redo"]').removeAttr('disabled');

      if (this.undoIndex == this.undoStack.length || this.isHTML) {
        this.$bttn_wrapper.find('[data-cmd="redo"]').prop('disabled', true);
      }
    }
  };

  $.Editable.prototype.getNodeIndex = function (node) {
    var childNodes = node.parentNode.childNodes;
    var idx = 0;
    var prevNode = null;
    for (var i = 0; i < childNodes.length; i++) {
      if (prevNode) {
        // Current node is text and it is empty.
        var isEmptyText = childNodes[i].nodeType === 3 && childNodes[i].textContent === '';

        // Previous node is text, current node is text.
        var twoTexts = prevNode.nodeType === 3 && childNodes[i].nodeType === 3;

        if (!isEmptyText && !twoTexts) idx++;
      }

      if (childNodes[i] == node) return idx;

      prevNode = childNodes[i];
    }
  }

  $.Editable.prototype.getNodeLocation = function (node) {
    var loc = [];
    if (!node.parentNode) return [];
    while (node != this.$element.get(0)) {
      loc.push(this.getNodeIndex(node));
      node = node.parentNode;
    }

    return loc.reverse();
  };

  $.Editable.prototype.getNodeByLocation = function (loc) {
    var node = this.$element.get(0);
    for (var i = 0; i < loc.length; i++) {
      node = node.childNodes[loc[i]];
    }

    return node;
  }

  $.Editable.prototype.getRealNodeOffset = function (node, offset) {
    while (node && node.nodeType === 3) {
      var prevNode = node.previousSibling;
      if (prevNode && prevNode.nodeType == 3) offset+= prevNode.textContent.length;
      node = prevNode;
    }

    return offset;
  }

  $.Editable.prototype.getRangeSnapshot = function (range) {
    return {
      scLoc: this.getNodeLocation(range.startContainer),
      scOffset: this.getRealNodeOffset(range.startContainer, range.startOffset),
      ecLoc: this.getNodeLocation(range.endContainer),
      ecOffset: this.getRealNodeOffset(range.endContainer, range.endOffset)
    }
  }

  $.Editable.prototype.getSnapshot = function () {
    var snapshot = {};

    snapshot.html = this.$element.html();

    snapshot.ranges = [];
    if (this.selectionInEditor() && this.$element.is(':focus')) {
      var ranges = this.getRanges();
      for (var i = 0; i < ranges.length; i++) {
        snapshot.ranges.push(this.getRangeSnapshot(ranges[i]));
      }
    }

    return snapshot;
  }

  $.Editable.prototype.identicSnapshots = function (s1, s2) {
    if (s1.html != s2.html) return false;
    if (JSON.stringify(s1.ranges) != JSON.stringify(s2.ranges)) return false;

    return true;
  }

  $.Editable.prototype.restoreRangeSnapshot = function (rangeSnapshot, sel) {
    try {
      // Get range info.
      var startNode = this.getNodeByLocation(rangeSnapshot.scLoc);
      var startOffset = rangeSnapshot.scOffset;
      var endNode = this.getNodeByLocation(rangeSnapshot.ecLoc);
      var endOffset = rangeSnapshot.ecOffset;

      // Restore range.
      var range = this.document.createRange();
      range.setStart(startNode, startOffset);
      range.setEnd(endNode, endOffset);

      sel.addRange(range);
    }
    catch (ex) {}
  }

  $.Editable.prototype.restoreSnapshot = function (snapshot) {
    // Restore HTML.
    if (this.$element.html() != snapshot.html) this.$element.html(snapshot.html);

    // Make sure to clear current selection.
    var sel = this.getSelection();
    this.clearSelection();

    // Focus.
    this.$element.focus();

    // Restore Ranges.
    for (var i = 0; i < snapshot.ranges.length; i++) {
      this.restoreRangeSnapshot(snapshot.ranges[i], sel);
    }

    setTimeout($.proxy(function () {
      this.$element.find('.f-img-wrap img').click();
    }, this), 0);
  }
})(jQuery);

(function ($) {
  /**
   * Refresh button state.
   */
  $.Editable.prototype.refreshButtons = function (force_refresh) {
    if (!this.initialized) return false;

    if (((!this.selectionInEditor() || this.isHTML) && !(this.browser.msie && $.Editable.getIEversion() < 9)) && !force_refresh) {
      return false;
    }

    // Remove class active from toolbar buttons.
    this.$editor.find('button[data-cmd]').removeClass('active');

    // Refresh disabled state.
    this.refreshDisabledState();

    // Trigger refresh event.
    this.raiseEvent('refresh');
  };

  $.Editable.prototype.refreshDisabledState = function () {
    if (this.isHTML) return false;

    if (this.$editor) {
      // Add disabled where necessary.
      for (var i = 0; i < this.options.buttons.length; i++) {
        var button = this.options.buttons[i];
        if ($.Editable.commands[button] === undefined) {
          continue;
        }

        var disabled = false;
        if ($.isFunction($.Editable.commands[button].disabled)) {
          disabled = $.Editable.commands[button].disabled.apply(this);
        }
        else if ($.Editable.commands[button].disabled !== undefined) {
          disabled = true;
        }

        if (disabled) {
          this.$editor.find('button[data-cmd="' + button + '"]').prop('disabled', true);
          this.$editor.find('button[data-name="' + button + '"]').prop('disabled', true);
        }
        else {
          this.$editor.find('button[data-cmd="' + button + '"]').removeAttr('disabled');
          this.$editor.find('button[data-name="' + button + '"]').removeAttr('disabled');
        }
      }

      this.refreshUndo();
      this.refreshRedo();
    }
  }

  $.Editable.prototype.refreshFormatBlocks = function () {
    var element = this.getSelectionElements()[0];
    var tag = element.tagName.toLowerCase();

    if (this.options.paragraphy && tag === this.options.defaultTag.toLowerCase()) {
      tag = 'n';
    }

    // Update format block first so that we can refresh block style list.
    this.$editor.find('.fr-bttn > button[data-name="formatBlock"] + ul li').removeClass('active');
    this.$bttn_wrapper.find('.fr-bttn > button[data-name="formatBlock"] + ul li[data-val="' + tag + '"]').addClass('active');
  }

  /**
   * Refresh default buttons.
   *
   * @param elem
   */
  $.Editable.prototype.refreshDefault = function (cmd) {
    try {
      if (this.document.queryCommandState(cmd) === true) {
        this.$editor.find('[data-cmd="' + cmd + '"]').addClass('active');
      }
    } catch (ex) {}
  };

  /**
   * Refresh alignment.
   *
   * @param elem
   */
  $.Editable.prototype.refreshAlign = function () {
    var $element = $(this.getSelectionElements()[0]);
    this.$editor.find('.fr-dropdown > button[data-name="align"] + ul li').removeClass('active');

    var cmd;
    var alignment = $element.css('text-align');
    if (['left', 'right', 'justify', 'center'].indexOf(alignment) < 0) alignment = 'left';

    if (alignment == 'left') {
      cmd = 'justifyLeft';
    } else if (alignment == 'right') {
      cmd = 'justifyRight';
    } else if (alignment == 'justify') {
      cmd = 'justifyFull';
    } else if (alignment == 'center') {
      cmd = 'justifyCenter';
    }

    this.$editor.find('.fr-dropdown > button[data-name="align"].fr-trigger i').attr('class', 'fa fa-align-' + alignment);
    this.$editor.find('.fr-dropdown > button[data-name="align"] + ul li[data-val="' + cmd + '"]').addClass('active');
  };

  $.Editable.prototype.refreshHTML = function () {
    if (this.isActive('html')) {
      this.$editor.find('[data-cmd="html"]').addClass('active');
    } else {
      this.$editor.find('[data-cmd="html"]').removeClass('active');
    }
  }

})(jQuery);

(function ($) {
  $.Editable.commands = {
    bold: {
      title: 'Bold',
      icon: 'fa fa-bold',
      shortcut: '(Ctrl + B)',
      refresh: $.Editable.prototype.refreshDefault,
      undo: true,
      callbackWithoutSelection: function (cmd) {
        this._startInDefault(cmd);
      }
    },

    italic: {
      title: 'Italic',
      icon: 'fa fa-italic',
      shortcut: '(Ctrl + I)',
      refresh: $.Editable.prototype.refreshDefault,
      undo: true,
      callbackWithoutSelection: function (cmd) {
        this._startInDefault(cmd);
      }
    },

    underline: {
      cmd: 'underline',
      title: 'Underline',
      icon: 'fa fa-underline',
      shortcut: '(Ctrl + U)',
      refresh: $.Editable.prototype.refreshDefault,
      undo: true,
      callbackWithoutSelection: function (cmd) {
        this._startInDefault(cmd);
      }
    },

    strikeThrough: {
      title: 'Strikethrough',
      icon: 'fa fa-strikethrough',
      refresh: $.Editable.prototype.refreshDefault,
      undo: true,
      callbackWithoutSelection: function (cmd) {
        this._startInDefault(cmd);
      }
    },

    subscript: {
      title: 'Subscript',
      icon: 'fa fa-subscript',
      refresh: $.Editable.prototype.refreshDefault,
      undo: true,
      callbackWithoutSelection: function (cmd) {
        this._startInDefault(cmd);
      }
    },

    superscript: {
      title: 'Superscript',
      icon: 'fa fa-superscript',
      refresh: $.Editable.prototype.refreshDefault,
      undo: true,
      callbackWithoutSelection: function (cmd) {
        this._startInDefault(cmd);
      }
    },

    formatBlock: {
      title: 'Format Block',
      icon: 'fa fa-paragraph',
      refreshOnShow: $.Editable.prototype.refreshFormatBlocks,
      callback: function (cmd, val) {
        this.formatBlock(val);
      },
      undo: true
    },

    align: {
      title: 'Alignment',
      icon: 'fa fa-align-left',
      refresh: $.Editable.prototype.refreshAlign,
      refreshOnShow: $.Editable.prototype.refreshAlign,
      seed: [{
        cmd: 'justifyLeft',
        title: 'Align Left',
        icon: 'fa fa-align-left'
      }, {
        cmd: 'justifyCenter',
        title: 'Align Center',
        icon: 'fa fa-align-center'
      }, {
        cmd: 'justifyRight',
        title: 'Align Right',
        icon: 'fa fa-align-right'
      }, {
        cmd: 'justifyFull',
        title: 'Justify',
        icon: 'fa fa-align-justify'
      }],
      callback: function (cmd, val) {
        this.align(val);
      },
      undo: true
    },

    outdent: {
      title: 'Indent Less',
      icon: 'fa fa-dedent',
      activeless: true,
      shortcut: '(Ctrl + <)',
      callback: function () {
        this.outdent(true);
      },
      undo: true
    },

    indent: {
      title: 'Indent More',
      icon: 'fa fa-indent',
      activeless: true,
      shortcut: '(Ctrl + >)',
      callback: function () {
        this.indent();
      },
      undo: true
    },

    selectAll: {
      title: 'Select All',
      icon: 'fa fa-file-text',
      shortcut: '(Ctrl + A)',
      callback: function (cmd, val) {
        this.$element.focus();
        this.execDefault(cmd, val);
      },
      undo: false
    },

    createLink: {
      title: 'Insert Link',
      icon: 'fa fa-link',
      shortcut: '(Ctrl + K)',
      callback: function () {
        this.insertLink();
      },
      undo: false
    },

    insertImage: {
      title: 'Insert Image',
      icon: 'fa fa-picture-o',
      activeless: true,
      shortcut: '(Ctrl + P)',
      callback: function () {
        this.insertImage();
      },
      undo: false
    },

    undo: {
      title: 'Undo',
      icon: 'fa fa-undo',
      activeless: true,
      shortcut: '(Ctrl+Z)',
      refresh: $.Editable.prototype.refreshUndo,
      callback: function () {
        this.undo();
      },
      undo: false
    },

    redo: {
      title: 'Redo',
      icon: 'fa fa-repeat',
      activeless: true,
      shortcut: '(Shift+Ctrl+Z)',
      refresh: $.Editable.prototype.refreshRedo,
      callback: function () {
        this.redo();
      },
      undo: false
    },

    html: {
      title: 'Show HTML',
      icon: 'fa fa-code',
      refresh: $.Editable.prototype.refreshHTML,
      callback: function () {
        this.html();
      },
      undo: false
    },

    save: {
      title: 'Save',
      icon: 'fa fa-floppy-o',
      callback: function () {
        this.save();
      },
      undo: false
    },

    insertHorizontalRule: {
      title: 'Insert Horizontal Line',
      icon: 'fa fa-minus',
      callback: function (cmd) {
        this.insertHR(cmd);
      },
      undo: true
    },

    removeFormat: {
      title: 'Clear formatting',
      icon: 'fa fa-eraser',
      activeless: true,
      callback: function () {
        this.removeFormat();
      },
      undo: true
    }
  };

  /**
   * Exec command.
   *
   * @param cmd
   * @param val
   * @returns {boolean}
   */
  $.Editable.prototype.exec = function (cmd, val, param) {
    if (!this.selectionInEditor() && $.Editable.commands[cmd].undo) this.focus();

    if (this.selectionInEditor() && this.text() === '') {
      if ($.Editable.commands[cmd].callbackWithoutSelection) {
        $.Editable.commands[cmd].callbackWithoutSelection.apply(this, [cmd, val, param]);
        return false;
      }
    }

    if ($.Editable.commands[cmd].callback) {
      $.Editable.commands[cmd].callback.apply(this, [cmd, val, param]);
    } else {
      this.execDefault(cmd, val);
    }
  };

  /**
   * Set html.
   */
  $.Editable.prototype.html = function () {
    var html;

    if (this.isHTML) {
      this.isHTML = false;

      html = this.$html_area.val();

      this.$box.removeClass('f-html');

      this.$element.attr('contenteditable', true);
      this.setHTML(html, false);
      this.$editor.find('.fr-bttn:not([data-cmd="html"]), .fr-trigger').removeAttr('disabled');
      this.$editor.find('.fr-bttn[data-cmd="html"]').removeClass('active');

      // Hack to focus right.
      this.$element.blur();
      this.focus();

      this.refreshButtons();

      // (html)
      this.triggerEvent('htmlHide', [html], true, false);
    } else {
      this.$box.removeClass('f-placeholder');
      this.clearSelection();

      this.cleanify(false, true, false);

      html = this.cleanTags(this.getHTML(false, false));

      this.$html_area.val(html).trigger('resize');

      this.$html_area.css('height', this.$element.height() - 1);
      this.$element.html('').append(this.$html_area).removeAttr('contenteditable');
      this.$box.addClass('f-html');
      this.$editor.find('button.fr-bttn:not([data-cmd="html"]), button.fr-trigger').attr('disabled', true);
      this.$editor.find('.fr-bttn[data-cmd="html"]').addClass('active');

      this.isHTML = true;
      this.hide();
      this.imageMode = false;

      this.$element.blur();

      this.$element.removeAttr('contenteditable');

      // html
      this.triggerEvent('htmlShow', [html], true, false);
    }
  };

  $.Editable.prototype.insertHR = function (cmd) {
    this.$element.find('hr').addClass('fr-tag');

    if (!this.$element.hasClass('f-placeholder')) {
      this.document.execCommand(cmd);
    }
    else {
      $(this.$element.find('> ' + this.valid_nodes.join(', >'))[0]).before('<hr/>');
    }

    this.hide();

    var nextElems = this.$element.find('hr:not(.fr-tag)').next(this.valid_nodes.join(','));
    if (nextElems.length > 0) {
      $(nextElems[0]).prepend(this.markers_html);
    }
    else {
      if (this.options.paragraphy) {
        this.$element.find('hr:not(.fr-tag)').after('<p>' + this.markers_html + '<br/></p>');
      }
      else {
        this.$element.find('hr:not(.fr-tag)').after(this.markers_html);
      }
    }

    this.restoreSelectionByMarkers();

    this.triggerEvent(cmd, [], true, false);
  }

  /**
   * Format block.
   *
   * @param val
   */
  $.Editable.prototype.formatBlock = function (val) {
    if (this.disabledList.indexOf('formatBlock') >= 0) {
      return false;
    }

    // IE 8.
    if (this.browser.msie && $.Editable.getIEversion() < 9) {
      if (val == 'n') {
        val = this.options.defaultTag;
      }

      this.document.execCommand('formatBlock', false, '<' + val + '>');
      this.triggerEvent('formatBlock');

      return false;
    }

    // Start in a specific mode.
    if (this.$element.hasClass('f-placeholder')) {
      if (!(!this.options.paragraphy && val == 'n')) {
        if (val == 'n') val = this.options.defaultTag;

        var $el = $('<' + val + '><br/>' + '</' + val + '>')
        this.$element.html($el);
        this.setSelection($el.get(0), 0);

        this.$element.removeClass('f-placeholder');
      }
    }
    else {
      // Wrap text.
      this.saveSelectionByMarkers();
      this.wrapText();
      this.restoreSelectionByMarkers();

      // Get selection elements.
      var elements = this.getSelectionElements();
      if (elements[0] == this.$element.get(0)) {
        elements = this.$element.find('> ' + this.valid_nodes.join(', >'));
      }

      this.saveSelectionByMarkers();

      var $sel;

      var format_pre = function ($element) {
        // Replace br in PRE.
        if ($element.get(0).tagName == 'PRE') {
          while ($element.find('br + br').length > 0) {
            var $br = $($element.find('br + br')[0]);
            $br.prev().remove();
            $br.replaceWith('\n\n');
          }
        }
      }

      for (var i = 0; i < elements.length; i++) {
        var $element = $(elements[i]);

        if (this.fakeEmpty($element)) continue;

        format_pre($element);

        // If element is empty, then add a br.
        if (!this.options.paragraphy && this.emptyElement($element.get(0))) $element.append('<br/>');

        // Format or no format.
        if (val == 'n') {
          if (this.options.paragraphy) {
            var h = '<' + this.options.defaultTag + this.attrs($element.get(0)) + '>' + $element.html() + '</' + this.options.defaultTag + '>';

            $sel = $(h);
          }
          else {
            $sel = $element.html() + '<br/>';
          }
        }
        else {
          $sel = $('<' + val + this.attrs($element.get(0)) + '>').html($element.html());
        }

        if ($element.get(0) != this.$element.get(0)) {
          $element.replaceWith($sel);
        }
        else {
          $element.html($sel);
        }
      }

      this.unwrapText();

      // Join PRE.
      this.$element.find('pre + pre').each (function () {
        $(this).prepend($(this).prev().html() + '<br/><br/>');
        $(this).prev().remove();
      })

      // Split what comes from PRE.
      var that = this;
      this.$element.find(this.valid_nodes.join(',')).each (function () {
        if (this.tagName == 'PRE') return;

        $(this).replaceWith('<' + this.tagName + that.attrs(this) + '>' + $(this).html().replace(/\n\n/gi, '</' + this.tagName + '><' + this.tagName + '>') + '</' + this.tagName + '>');
      })

      // Add br to empty elements that would come from PRE.
      this.$element.find(this.valid_nodes.join(':empty ,') + ':empty').append('<br/>');

      this.cleanupLists();
      this.restoreSelectionByMarkers();
    }

    this.triggerEvent('formatBlock');
    this.repositionEditor();
  };

  /**
   * Align.
   *
   * @param val
   */
  $.Editable.prototype.align = function (val) {
    if (this.browser.msie && $.Editable.getIEversion() < 9) {
      this.document.execCommand(val, false, false);

      // (val)
      this.triggerEvent('align', [val]);

      return false;
    }

    this.saveSelectionByMarkers();
    this.wrapText();
    this.restoreSelectionByMarkers();

    this.saveSelectionByMarkers();
    var elements = this.getSelectionElements();

    if (val == 'justifyLeft') {
      val = 'left';
    } else if (val == 'justifyRight') {
      val = 'right';
    } else if (val == 'justifyCenter') {
      val = 'center';
    } else if (val == 'justifyFull') {
      val = 'justify';
    }

    for (var i = 0; i < elements.length; i++) {
      if (this.parents($(elements[i]), 'LI').length > 0) elements[i] = $(elements[i]).parents('LI').get(0);
      $(elements[i]).css('text-align', val);
    }

    this.cleanupLists();
    this.unwrapText();
    this.restoreSelectionByMarkers();
    this.repositionEditor();

    // (val)
    this.triggerEvent('align', [val]);
  };

  /**
   * Indent.
   *
   * @param outdent - boolean.
   */
  $.Editable.prototype.indent = function (outdent, reposition) {
    if (reposition === undefined) reposition = true;

    if (this.browser.msie && $.Editable.getIEversion() < 9) {
      if (!outdent) {
        this.document.execCommand('indent', false, false);
      } else {
        this.document.execCommand('outdent', false, false);
      }
      return false;
    }

    var margin = 20;
    if (outdent) {
      margin = -20;
    }

    // Wrap text.
    this.saveSelectionByMarkers();
    this.wrapText();
    this.restoreSelectionByMarkers();

    var elements = this.getSelectionElements();

    this.saveSelectionByMarkers();

    for (var i = 0; i < elements.length; i++) {
      var $element = $(elements[i]);

      if ($element.parentsUntil(this.$element, 'li').length > 0) {
        $element = $element.closest('li');
      }

      if (this.raiseEvent('indent', [$element, outdent])) {
        if ($element.get(0) != this.$element.get(0)) {
          var oldMargin = parseInt($element.css('margin-left'), 10);
          var newMargin = Math.max(0, oldMargin + margin);
          $element.css('marginLeft', newMargin);
          if (newMargin === 0) {
            $element.css('marginLeft', '');
            if ($element.css('style') === undefined) $element.removeAttr('style');
          }
        }

        else {
          var $sel = $('<div>').html($element.html());
          $element.html($sel);
          $sel.css('marginLeft', Math.max(0, margin));
          if (Math.max(0, margin) === 0) {
            $sel.css('marginLeft', '');
            if ($sel.css('style') === undefined) $sel.removeAttr('style');
          }
        }
      }
    }

    this.unwrapText();

    this.restoreSelectionByMarkers();
    if (reposition) this.repositionEditor();

    if (!outdent) {
      this.triggerEvent('indent');
    }
  };

  /**
   * Outdent.
   */
  $.Editable.prototype.outdent = function (reposition) {
    this.indent(true, reposition);

    this.triggerEvent('outdent');
  };

  /**
   * Run default command.
   *
   * @param cmd - command name.
   * @param val - command value.
   */
  $.Editable.prototype.execDefault = function (cmd, val) {
    this.saveUndoStep();
    this.document.execCommand(cmd, false, val);

    this.triggerEvent(cmd, [], true, true);
  };

  $.Editable.prototype._startInDefault = function (cmd) {
    this.focus();

    this.document.execCommand(cmd, false, false);

    this.refreshButtons();
  }

  $.Editable.prototype._startInFontExec = function (prop, cmd, val) {
    this.focus();

    try {
      var range = this.getRange();
      var boundary = range.cloneRange();

      boundary.collapse(false);

      var $span = $('<span data-inserted="true" data-fr-verified="true" style="' + prop + ': ' + val + ';">' + $.Editable.INVISIBLE_SPACE + '</span>', this.document);
      boundary.insertNode($span[0]);

      $span = this.$element.find('[data-inserted]');
      $span.removeAttr('data-inserted');

      this.setSelection($span.get(0), 1);
    }
    catch (ex) {}
  }

  /**
   * Remove format.
   */
  $.Editable.prototype.removeFormat = function () {
    this.document.execCommand('removeFormat', false, false);
    this.document.execCommand('unlink', false, false);
  };

  /**
   * Set font size or family.
   *
   * @param val
   */
  $.Editable.prototype.inlineStyle = function (prop, cmd, val) {
    // Preserve font size.
    if (this.browser.webkit && prop != 'font-size') {
      var hasFontSizeSet = function ($span) {
        return $span.attr('style').indexOf('font-size') >= 0;
      }

      this.$element.find('span').each (function (index, span) {
        var $span = $(span);

        if ($span.attr('style') && hasFontSizeSet($span)) {
          $span.data('font-size', $span.css('font-size'));
          $span.css('font-size', '');
        }
      })
    }

    // Apply format.
    this.document.execCommand('fontSize', false, 4);

    this.saveSelectionByMarkers();

    // Restore font size.
    if (this.browser.webkit && prop != 'font-size') {
      this.$element.find('span').each (function (index, span) {
        var $span = $(span);

        if ($span.data('font-size')) {
          $span.css('font-size', $span.data('font-size'));
          $span.removeData('font-size');
        }
      })
    }

    // Clean font.
    var clean_format = function (elem) {
      var $elem = $(elem);
      if ($elem.css(prop) != val) {
        $elem.css(prop, '');
      }

      if ($elem.attr('style') === '') {
        $elem.replaceWith($elem.html());
      }
    }

    // Remove all fonts with size=3.
    this.$element.find('font').each(function (index, elem) {
      var $span = $('<span data-fr-verified="true" style="' + prop + ': ' + val + ';">' + $(elem).html() + '</span>');
      $(elem).replaceWith($span);

      // Replace in reverse order to take care of the inner spans first.
      var inner_spans = $span.find('span');
      for (var i = inner_spans.length - 1; i >= 0; i--) {
        clean_format(inner_spans[i]);
      }
    });

    this.removeBlankSpans();

    this.restoreSelectionByMarkers();
    this.repositionEditor();

    if (cmd != null) this.triggerEvent(cmd, [val], true, true);
  };

})(jQuery);

(function ($) {
  $.Editable.prototype.addListener = function (event_name, callback) {
    var events      = this._events;
    var callbacks   = events[event_name] = events[event_name] || [];

    callbacks.push(callback);
  }

  $.Editable.prototype.raiseEvent = function (event_name, args) {
    if (args === undefined) args = [];

    var resp = true;

    var callbacks = this._events[event_name];

    if (callbacks) {
      for (var i = 0, l = callbacks.length; i < l; i++) {
        var i_resp = callbacks[i].apply(this, args);
        if (i_resp !== undefined && resp !== false) resp = i_resp;
      }
    }

    if (resp === undefined) resp = true;

    return resp;
  }
})(jQuery);

(function ($) {
  $.Editable.prototype.start_marker = '<span class="f-marker" data-id="0" data-fr-verified="true" data-type="true"></span>';
  $.Editable.prototype.end_marker = '<span class="f-marker" data-id="0" data-fr-verified="true" data-type="false"></span>';
  $.Editable.prototype.markers_html = '<span class="f-marker" data-id="0" data-fr-verified="true" data-type="false"></span><span class="f-marker" data-id="0" data-fr-verified="true" data-type="true"></span>';

  /**
   * Get selection text.
   *
   * @returns {string}
   */
  $.Editable.prototype.text = function () {
    var text = '';

    if (this.window.getSelection) {
      text = this.window.getSelection();
    } else if (this.document.getSelection) {
      text = this.document.getSelection();
    } else if (this.document.selection) {
      text = this.document.selection.createRange().text;
    }

    return text.toString();
  };

  /**
   * Determine if selection is inside current editor.
   *
   * @returns {boolean}
   */
  $.Editable.prototype.selectionInEditor = function () {
    var parent = this.getSelectionParent();
    var inside = false;

    if (parent == this.$element.get(0)) {
      inside = true;
    }

    if (inside === false) {
      $(parent).parents().each($.proxy(function (index, elem) {
        if (elem == this.$element.get(0)) {
          inside = true;
        }
      }, this));
    }

    return inside;
  };

  /**
   * Get current selection.
   *
   * @returns {string}
   */
  $.Editable.prototype.getSelection = function () {
    var selection = '';
    if (this.window.getSelection) {
      selection = this.window.getSelection();
    } else if (this.document.getSelection) {
      selection = this.document.getSelection();
    } else {
      selection = this.document.selection.createRange();
    }

    return selection;
  };

  /**
   * Get current range.
   *
   * @returns {*}
   */
  $.Editable.prototype.getRange = function () {
    var ranges = this.getRanges();
    if (ranges.length > 0) {
      return ranges[0];
    }

    return null;
  };

  $.Editable.prototype.getRanges = function () {
    var sel = this.getSelection();

    // Get ranges.
    if (sel.getRangeAt && sel.rangeCount) {
      var ranges = [];
      for (var i = 0; i < sel.rangeCount; i++) {
        ranges.push(sel.getRangeAt(i));
      }

      return ranges;
    }

    if (this.document.createRange) {
      return [this.document.createRange()];
    } else {
      return [];
    }
  }

  /**
   * Clear selection.
   *
   * @returns {*}
   */
  $.Editable.prototype.clearSelection = function () {
    var sel = this.getSelection();

    try {
      if (sel.removeAllRanges) {
        sel.removeAllRanges();
      } else if (sel.empty) {  // IE?
        sel.empty();
      } else if (sel.clear) {
        sel.clear();
      }
    }
    catch (ex) {}
  };

  /**
   * Get the element where the current selection starts.
   *
   * @returns {*}
   */
  $.Editable.prototype.getSelectionElement = function () {
    var sel = this.getSelection();

    if (sel.rangeCount) {
      var range = this.getRange();
      var node = range.startContainer;

      // Get parrent if node type is not DOM.
      if (node.nodeType == 1) {
        var node_found = false;

        // Search for node deeper.
        if (node.childNodes.length > 0 && node.childNodes[range.startOffset] && $(node.childNodes[range.startOffset]).text() === this.text()) {
          node = node.childNodes[range.startOffset];
          node_found = true;
        }

        if (!node_found && node.childNodes.length > 0 && $(node.childNodes[0]).text() === this.text() && ['BR', 'IMG', 'HR'].indexOf(node.childNodes[0].tagName) < 0) {
          node = node.childNodes[0];
        }
      }

      while (node.nodeType != 1 && node.parentNode) {
        node = node.parentNode;
      }

      // Make sure the node is in editor.
      var p = node;
      while (p && p.tagName != 'BODY') {
        if (p == this.$element.get(0)) {
          return node;
        }

        p = $(p).parent()[0];
      }
    }

    return this.$element.get(0);
  };

  /**
   * Get the parent of the current selection.
   *
   * @returns {*}
   */
  $.Editable.prototype.getSelectionParent = function () {
    var parent = null;
    var sel;

    if (this.window.getSelection) {
      sel = this.window.getSelection();
      if (sel.rangeCount) {
        parent = sel.getRangeAt(0).commonAncestorContainer;
        if (parent.nodeType != 1) {
          parent = parent.parentNode;
        }
      }
    } else if ((sel = this.document.selection) && sel.type != 'Control') {
      parent = sel.createRange().parentElement();
    }

    if (parent != null && ($.inArray(this.$element.get(0), $(parent).parents()) >= 0 || parent == this.$element.get(0))) {
      return parent;
    }
    else {
      return null;
    }
  };

  /**
   * Check if DOM node is in range.
   *
   * @param range - A range object.
   * @param node - A DOM node object.
   * @returns {*}
   */
  // From: https://code.google.com/p/rangy/source/browse/trunk/test/intersectsnode.html
  $.Editable.prototype.nodeInRange = function (range, node) {
    var nodeRange;
    if (range.intersectsNode) {
      return range.intersectsNode(node);
    } else {
      nodeRange = node.ownerthis.document.createRange();
      try {
        nodeRange.selectNode(node);
      } catch (e) {
        nodeRange.selectNodeContents(node);
      }

      return range.compareBoundaryPoints(Range.END_TO_START, nodeRange) == -1 &&
        range.compareBoundaryPoints(Range.START_TO_END, nodeRange) == 1;
    }
  };


  /**
   * Get the valid element of DOM node.
   *
   * @param node - DOM node.
   * @returns {*}
   */
  $.Editable.prototype.getElementFromNode = function (node) {
    if (node.nodeType != 1) {
      node = node.parentNode;
    }

    while (node !== null && this.valid_nodes.indexOf(node.tagName) < 0) {
      node = node.parentNode;
    }

    if (node != null && node.tagName == 'LI' && $(node).find(this.valid_nodes.join(',')).not('li').length > 0) {
      return null;
    }

    if ($.makeArray($(node).parents()).indexOf(this.$element.get(0)) >= 0) {
      return node;
    } else {
      return null;
    }
  };

  /**
   * Find next node as a child or as a sibling.
   *
   * @param node - Current node.
   * @returns {DOM Object}
   */
  $.Editable.prototype.nextNode = function (node, endNode) {
    if (node.hasChildNodes()) {
      return node.firstChild;
    } else {
      while (node && !node.nextSibling && node != endNode) {
        node = node.parentNode;
      }
      if (!node || node == endNode) {
        return null;
      }

      return node.nextSibling;
    }
  };

  /**
   * Find the nodes within the range passed as parameter.
   *
   * @param range - A range object.
   * @returns {Array}
   */
  $.Editable.prototype.getRangeSelectedNodes = function (range) {
    // Iterate nodes until we hit the end container
    var rangeNodes = [];

    var node = range.startContainer;
    var endNode = range.endContainer;

    // Special case for a range that is contained within a single node
    if (node == endNode && node.tagName != 'TR') {
      if (!node.hasChildNodes() || node.childNodes.length === 0) {
        return [node];
      }
      else {
        var childs = node.childNodes;
        for (var i = range.startOffset; i < range.endOffset; i++) {
          if (childs[i]) {
            rangeNodes.push(childs[i]);
          }
        }

        if (rangeNodes.length === 0) rangeNodes.push(node);

        return rangeNodes;
      }
    }

    if (node == endNode && node.tagName == 'TR') {
      var child_nodes = node.childNodes;
      var start_offset = range.startOffset;

      if (child_nodes.length > start_offset && start_offset >= 0) {
        var td = child_nodes[start_offset];
        if (td.tagName == 'TD' || td.tagName == 'TH') {
          return [td];
        }
      }
    }

    while (node && node != endNode) {
      node = this.nextNode(node, endNode);
      if (node != endNode || range.endOffset > 0) rangeNodes.push(node);
    }

    // Add partially selected nodes at the start of the range
    node = range.startContainer;
    while (node && node != range.commonAncestorContainer) {
      rangeNodes.unshift(node);
      node = node.parentNode;
    }

    return rangeNodes;
  };

  /**
   * Get the nodes that are in the current selection.
   *
   * @returns {Array}
   */
  // Addapted from http://stackoverflow.com/questions/7781963/js-get-array-of-all-selected-nodes-in-contenteditable-div
  $.Editable.prototype.getSelectedNodes = function () {
    // IE gt 9. Other browsers.
    if (this.window.getSelection) {
      var sel = this.window.getSelection();
      if (!sel.isCollapsed) {
        var ranges = this.getRanges();
        var nodes = [];
        for (var i = 0; i < ranges.length; i++) {
          nodes = $.merge(nodes, this.getRangeSelectedNodes(ranges[i]));
        }

        return nodes;
      } else if (this.selectionInEditor()) {
        var container = sel.getRangeAt(0).startContainer;
        if (container.nodeType == 3)
          return [container.parentNode];
        else
          return [container];
      }
    }

    return [];
  };


  /**
   * Get the elements that are selected.
   *
   * @returns {Array}
   */
  $.Editable.prototype.getSelectionElements = function () {
    var actualNodes = this.getSelectedNodes();
    var nodes = [];

    $.each(actualNodes, $.proxy(function (index, node) {
      if (node !== null) {
        var element = this.getElementFromNode(node);
        if (nodes.indexOf(element) < 0 && element != this.$element.get(0) && element !== null) {
          nodes.push(element);
        }
      }
    }, this));

    if (nodes.length === 0) {
      nodes.push(this.$element.get(0));
    }

    return nodes;
  };

  /**
   * Get the URL from selection.
   *
   * @returns {string}
   */
  $.Editable.prototype.getSelectionLink = function () {
    var links = this.getSelectionLinks();

    if (links.length > 0) {
      return $(links[0]).attr('href');
    }

    return null;
  };

  /**
   * Save current selection.
   */
  // From: http://stackoverflow.com/questions/5605401/insert-link-in-contenteditable-element
  $.Editable.prototype.saveSelection = function () {
    if (!this.selectionDisabled) {
      this.savedRanges = [];
      var selection_ranges = this.getRanges();

      for (var i = 0; i < selection_ranges.length; i++) {
        this.savedRanges.push(selection_ranges[i].cloneRange())
      }
    }
  };

  /**
   * Restore if there is any selection saved.
   */
  $.Editable.prototype.restoreSelection = function () {
    if (!this.selectionDisabled) {
      var i;
      var len;
      var sel = this.getSelection();

      if (this.savedRanges && this.savedRanges.length) {
        sel.removeAllRanges();
        for (i = 0, len = this.savedRanges.length; i < len; i += 1) {
          sel.addRange(this.savedRanges[i]);
        }
      }

      this.savedRanges = null;
    }
  };

  // https://developer.mozilla.org/en-US/docs/Web/API/this.document.caretPositionFromPoint
  // http://stackoverflow.com/questions/11191136/set-a-selection-range-from-a-to-b-in-absolute-position
  $.Editable.prototype.insertMarkersAtPoint = function (e) {
    var x = e.clientX;
    var y = e.clientY;

    // Clear markers.
    this.removeMarkers();

    var start;
    var range = null;

    // Default.
    if (typeof this.document.caretPositionFromPoint != 'undefined') {
      start = this.document.caretPositionFromPoint(x, y);
      range = this.document.createRange();

      range.setStart(start.offsetNode, start.offset);
      range.setEnd(start.offsetNode, start.offset);
    }

    // Webkit.
    else if (typeof this.document.caretRangeFromPoint != 'undefined') {
      start = this.document.caretRangeFromPoint(x, y);
      range = this.document.createRange();

      range.setStart(start.startContainer, start.startOffset);
      range.setEnd(start.startContainer, start.startOffset);
    }

    // Set ranges.
    if (range !== null && typeof this.window.getSelection != 'undefined') {
      var sel = this.window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }

    // MSIE.
    else if (typeof this.document.body.createTextRange != 'undefined') {
      try {
        range = this.document.body.createTextRange();
        range.moveToPoint(x, y);
        var end_range = range.duplicate();
        end_range.moveToPoint(x, y);
        range.setEndPoint('EndToEnd', end_range);
        range.select();
      }
      catch (ex) {

      }
    }

    // Place markers.
    this.placeMarker(range, true, 0);
    this.placeMarker(range, false, 0);
  }

  /**
   * Save selection using markers.
   */
  $.Editable.prototype.saveSelectionByMarkers = function () {
    if (!this.selectionDisabled) {
      if (!this.selectionInEditor()) this.focus();

      this.removeMarkers();

      var ranges = this.getRanges();

      for (var i = 0; i < ranges.length; i++) {
        if (ranges[i].startContainer !== this.document) {
          var range = ranges[i];
          this.placeMarker(range, true, i); // Start.
          this.placeMarker(range, false, i); // End.
        }
      }
    }
  };

  /**
   * Check if there is any selection stored.
   */
  $.Editable.prototype.hasSelectionByMarkers = function () {
    // Get markers.
    var markers = this.$element.find('.f-marker[data-type="true"]');

    if (markers.length > 0) {
      return true;
    }

    return false;
  }

  /**
   * Restore selection using markers.
   */
  $.Editable.prototype.restoreSelectionByMarkers = function (clear_ranges) {
    if (clear_ranges === undefined) clear_ranges = true;

    if (!this.selectionDisabled) {
      // Get markers.
      var markers = this.$element.find('.f-marker[data-type="true"]');

      // No markers.
      if (markers.length === 0) {
        return false;
      }

      // Focus before restoring selection.
      if (!this.$element.is(':focus') && !this.browser.msie) {
        this.$element.focus();
      }

      var sel = this.getSelection();

      if (clear_ranges || (this.getRange() && !this.getRange().collapsed) || !$(markers[0]).attr('data-collapsed')) {
        if (!(this.browser.msie && $.Editable.getIEversion() < 9)) {
          this.clearSelection();
          clear_ranges = true;
        }
      }

      // Add ranges.
      for (var i = 0; i < markers.length; i++) {
        var id = $(markers[i]).data('id');
        var start_marker = markers[i];
        var end_marker = this.$element.find('.f-marker[data-type="false"][data-id="' + id + '"]');

        // IE 8 workaround.
        if (this.browser.msie && $.Editable.getIEversion() < 9) {
          this.setSelection(start_marker, 0, end_marker, 0);

          // Remove used markers.
          this.removeMarkers();

          return false;
        }

        var range;

        if (clear_ranges) {
          range = this.document.createRange();
        } else {
          // Get ranges.
          range = this.getRange();
        }

        // Make sure there is an start marker.
        if (end_marker.length > 0) {
          end_marker = end_marker[0];

          try {
            range.setStartAfter(start_marker);
            range.setEndBefore(end_marker);
          } catch (ex) {
          }
        }

        if (clear_ranges) {
          sel.addRange(range);
        }
      }

      // Remove used markers.
      this.removeMarkers();
    }
  };

  /**
   * Set selection start.
   *
   * @param sn - Start node.
   * @param fn - Final node.
   */
  $.Editable.prototype.setSelection = function (sn, so, fn, fo) {
    // Check if there is any selection first.
    var sel = this.getSelection();
    if (!sel) return;

    // Clean other ranges.
    this.clearSelection();

    // Sometimes this throws an error.
    try {
      // Start selection.
      if (!fn) fn = sn;
      if (so === undefined) so = 0;
      if (fo === undefined) fo = so;

      // Set ranges (https://developer.mozilla.org/en-US/docs/Web/API/range.setStart)
      var range = this.getRange();
      range.setStart(sn, so);
      range.setEnd(fn, fo);

      // Add range to current selection.
      sel.addRange(range);
    } catch (e) { }
  };

  $.Editable.prototype.buildMarker = function (marker, id, collapsed) {
    if (collapsed === undefined) collapsed = '';

    return $('<span class="f-marker"' + collapsed + ' style="display:none; line-height: 0;" data-fr-verified="true" data-id="' + id + '" data-type="' + marker + '">', this.document)[0];
  };

  /**
   * Insert marker at start/end of range.
   *
   * @param range
   * @param marker - true/false for begin/end.
   */
  $.Editable.prototype.placeMarker = function (range, marker, id) {
    var collapsed = '';
    if (range.collapsed) {
      collapsed = ' data-collapsed="true"';
    }

    try {
      var boundary = range.cloneRange();
      boundary.collapse(marker);

      var sibling;
      var contents;
      var mk;

      boundary.insertNode(this.buildMarker(marker, id, collapsed));
      if (marker === true && collapsed) {
        sibling = this.$element.find('span.f-marker[data-type="true"][data-id="' + id + '"]').get(0).nextSibling;
        while (sibling.nodeType === 3 && sibling.data.length === 0) {
          $(sibling).remove();
          sibling = this.$element.find('span.f-marker[data-type="true"][data-id="' + id + '"]').get(0).nextSibling;
        }
      }

      if (marker === true && collapsed === '') {
        mk = this.$element.find('span.f-marker[data-type="true"][data-id="' + id + '"]').get(0);
        sibling = mk.nextSibling;
        if (sibling && sibling.nodeType === Node.ELEMENT_NODE && this.valid_nodes.indexOf(sibling.tagName) >= 0) {
          // Place the marker deep inside the block tags.
          contents = [sibling];
          do {
            sibling = contents[0];
            contents = $(sibling).contents();
          } while (contents[0] && this.valid_nodes.indexOf(contents[0].tagName) >= 0);

          $(sibling).prepend($(mk));
        }
      }

      if (marker === false && collapsed === '') {
        mk = this.$element.find('span.f-marker[data-type="false"][data-id="' + id + '"]').get(0);
        sibling = mk.previousSibling;
        if (sibling && sibling.nodeType === Node.ELEMENT_NODE && this.valid_nodes.indexOf(sibling.tagName) >= 0) {
          // Place the marker deep inside the block tags.
          contents = [sibling];
          do {
            sibling = contents[contents.length - 1];
            contents = $(sibling).contents();
          } while (contents[contents.length - 1] && this.valid_nodes.indexOf(contents[contents.length - 1].tagName) >= 0);

          $(sibling).append($(mk));
        }
      }
    }
    catch (ex) {
    }
  };

  /**
   * Remove markers.
   */
  $.Editable.prototype.removeMarkers = function () {
    this.$element.find('.f-marker').remove();
  };

  // From: http://www.coderexception.com/0B1B33z1NyQxUQSJ/contenteditable-div-how-can-i-determine-if-the-cursor-is-at-the-start-or-end-of-the-content
  $.Editable.prototype.getSelectionTextInfo = function (el) {
    var atStart = false;
    var atEnd = false;
    var selRange;
    var testRange;

    if (this.window.getSelection) {
      var sel = this.window.getSelection();
      if (sel.rangeCount) {
        selRange = sel.getRangeAt(0);
        testRange = selRange.cloneRange();

        testRange.selectNodeContents(el);
        testRange.setEnd(selRange.startContainer, selRange.startOffset);
        atStart = (testRange.toString() === '');

        testRange.selectNodeContents(el);
        testRange.setStart(selRange.endContainer, selRange.endOffset);
        atEnd = (testRange.toString() === '');
      }
    } else if (this.document.selection && this.document.selection.type != 'Control') {
      selRange = this.document.selection.createRange();
      testRange = selRange.duplicate();

      testRange.moveToElementText(el);
      testRange.setEndPoint('EndToStart', selRange);
      atStart = (testRange.text === '');

      testRange.moveToElementText(el);
      testRange.setEndPoint('StartToEnd', selRange);
      atEnd = (testRange.text === '');
    }

    return { atStart: atStart, atEnd: atEnd };
  };

  /**
   * Check if selection is at the end of block.
   */
  $.Editable.prototype.endsWith = function (string, suffix) {
    return string.indexOf(suffix, string.length - suffix.length) !== -1;
  }
})(jQuery);

(function ($) {
  /**
   * Transform a hex value to an RGB array.
   *
   * @param hex - HEX string.
   * @returns {Array}
   */
  $.Editable.hexToRGB = function (hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  /**
   * Transform a hex string to an RGB string.
   *
   * @param val - HEX string.
   * @returns {string}
   */
  $.Editable.hexToRGBString = function (val) {
    var rgb = this.hexToRGB(val);
    if (rgb) {
      return 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
    }
    else {
      return '';
    }
  };

  $.Editable.RGBToHex = function (rgb) {
    function hex(x) {
      return ('0' + parseInt(x, 10).toString(16)).slice(-2);
    }

    try {
      if (!rgb || rgb === 'transparent') return '';

      if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

      rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

      return ('#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])).toUpperCase();
    }
    catch (ex) {
      return null;
    }
  }

  /**
   * Find the IE version.
   *
   * @returns {integer}
   */
  $.Editable.getIEversion = function () {
    /*global navigator */
    var rv = -1;
    var ua;
    var re;

    if (navigator.appName == 'Microsoft Internet Explorer') {
      ua = navigator.userAgent;
      re = new RegExp('MSIE ([0-9]{1,}[\\.0-9]{0,})');
      if (re.exec(ua) !== null)
        rv = parseFloat(RegExp.$1);
    } else if (navigator.appName == 'Netscape') {
      ua = navigator.userAgent;
      re = new RegExp('Trident/.*rv:([0-9]{1,}[\\.0-9]{0,})');
      if (re.exec(ua) !== null)
        rv = parseFloat(RegExp.$1);
    }
    return rv;
  };

  /**
   * Find current browser.
   *
   * @returns {Object}
   */
  $.Editable.browser = function () {
    var browser = {};

    if (this.getIEversion() > 0) {
      browser.msie = true;
    } else {
      var ua = navigator.userAgent.toLowerCase();

      var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
        /(webkit)[ \/]([\w.]+)/.exec(ua) ||
        /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
        /(msie) ([\w.]+)/.exec(ua) ||
        ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
        [];

      var matched = {
        browser: match[1] || '',
        version: match[2] || '0'
      };

      if (match[1]) browser[matched.browser] = true;
      if (parseInt(matched.version, 10) < 9 && browser.msie) browser.oldMsie = true;

      // Chrome is Webkit, but Webkit is also Safari.
      if (browser.chrome) {
        browser.webkit = true;
      } else if (browser.webkit) {
        browser.safari = true;
      }
    }

    return browser;
  };

  $.Editable.isArray = function (obj) {
    return obj && !(obj.propertyIsEnumerable('length')) &&
            typeof obj === 'object' && typeof obj.length === 'number';
  }

  $.Editable.uniq = function (array) {
    return $.grep(array, function (el, index) {
      return index == $.inArray(el, array);
    });
  }

  $.Editable.cleanWhitespace = function ($node) {
    $node
      .contents()
      .filter(function () {
        if (this.nodeType == 1) $.Editable.cleanWhitespace($(this));
        return (this.nodeType == 3 && !/\S/.test(this.nodeValue));
      })
      .remove();
  }

})(jQuery);

(function ($) {
  /**
   * Show editor
   */
  $.Editable.prototype.show = function (e) {
    this.hideDropdowns();
    if (e === undefined) return;

    if (this.options.inlineMode || this.options.editInPopup) {
      if (e !== null && e.type !== 'touchend') {
        if (this.options.showNextToCursor) {
          var x = e.pageX;
          var y = e.pageY;

          // Fix releasing cursor outside.
          if (x < this.$element.offset().left) {
            x = this.$element.offset().left;
          }

          if (x > this.$element.offset().left + this.$element.width()) {
            x = this.$element.offset().left + this.$element.width();
          }

          if (y < this.$element.offset.top) {
            y = this.$element.offset().top;
          }

          if (y > this.$element.offset().top + this.$element.height()) {
            y = this.$element.offset().top + this.$element.height();
          }

          // Make coordinates decent.
          if (x < 20) x = 20;
          if (y < 0) y = 0;

          // Show by coordinates.
          this.showByCoordinates(x, y);
        }
        else {
          this.repositionEditor();
        }

        // Hide other editors.
        $('.froala-editor:not(.f-basic)').hide();

        // Show editor.
        this.$editor.show();

        if (this.options.buttons.length === 0 && !this.options.editInPopup) {
          this.$editor.hide();
        }
      }
      else {
        $('.froala-editor:not(.f-basic)').hide();
        this.$editor.show();
        this.repositionEditor();
      }
    }

    this.hidePopups();
    if (!this.options.editInPopup) {
      this.showEditPopupWrapper();
    }

    this.$bttn_wrapper.show();
    this.refreshButtons();

    this.imageMode = false;
  };

  $.Editable.prototype.hideDropdowns = function () {
    this.$bttn_wrapper.find('.fr-dropdown .fr-trigger').removeClass('active');
    this.$bttn_wrapper.find('.fr-dropdown .fr-trigger');
  };

  /**
   * Hide inline editor.
   */
  $.Editable.prototype.hide = function (propagateable) {

    if (!this.initialized) {
      return false;
    }

    if (propagateable === undefined) {
      propagateable = true;
    }

    // Hide other editors.
    if (propagateable) {
      this.hideOtherEditors();
    }

    // Command to hide from another editor.
    else {
      this.closeImageMode();
      this.imageMode = false;
    }

    this.$popup_editor.hide();
    this.hidePopups(false);
    this.link = false;
  };

  /**
   * Hide other editors from page.
   */
  $.Editable.prototype.hideOtherEditors = function () {
    for (var i = 1; i <= $.Editable.count; i++) {
      if (i != this._id) {
        this.$window.trigger('hide.' + i);
      }
    }
  }

  $.Editable.prototype.hideBttnWrapper = function () {
    if (this.options.inlineMode) {
      this.$bttn_wrapper.hide();
    }
  };

  $.Editable.prototype.showBttnWrapper = function () {
    if (this.options.inlineMode) {
      this.$bttn_wrapper.show();
    }
  };

  $.Editable.prototype.showEditPopupWrapper = function () {
    if (this.$edit_popup_wrapper) {
      this.$edit_popup_wrapper.show();

      setTimeout($.proxy(function () {
        this.$edit_popup_wrapper.find('input').val(this.$element.text()).focus().select()
      }, this), 1);
    }
  };

  $.Editable.prototype.hidePopups = function (hide_btn_wrapper) {
    if (hide_btn_wrapper === undefined) hide_btn_wrapper = true;

    if (hide_btn_wrapper) {
      this.hideBttnWrapper();
    }

    this.raiseEvent('hidePopups');
  }

  $.Editable.prototype.showEditPopup = function () {
    this.showEditPopupWrapper();
  };
})(jQuery);

(function ($) {
  /**
   * Get bounding rect around selection.
   *
   * @returns {Object}
   */
  $.Editable.prototype.getBoundingRect = function () {
    var boundingRect;

    if (!this.isLink) {
      if (this.getRange() && this.getRange().collapsed) {
        var $element = $(this.getSelectionElement());
        this.saveSelectionByMarkers();
        var $marker = this.$element.find('.f-marker:first');
        $marker.css('display', 'inline');
        var offset = $marker.offset();
        $marker.css('display', 'none');

        boundingRect = {}
        boundingRect.left = offset.left - this.$window.scrollLeft();
        boundingRect.width = 0;
        boundingRect.height = (parseInt($element.css('line-height').replace('px', ''), 10) || 10) - 10 - this.$window.scrollTop();
        boundingRect.top = offset.top;
        boundingRect.right = 1;
        boundingRect.bottom = 1;
        boundingRect.ok = true;

        this.removeMarkers();
      }
      else if (this.getRange()) {
        boundingRect = this.getRange().getBoundingClientRect();
      }
    } else {
      boundingRect = {}
      var $link = this.$element;

      boundingRect.left = $link.offset().left - this.$window.scrollLeft();
      boundingRect.top = $link.offset().top - this.$window.scrollTop();
      boundingRect.width = $link.outerWidth();
      boundingRect.height = parseInt($link.css('padding-top').replace('px', ''), 10) + $link.height();
      boundingRect.right = 1;
      boundingRect.bottom = 1;
      boundingRect.ok = true;
    }

    return boundingRect;
  };

  /**
   * Reposition editor using boundingRect.
   *
   * @param position - Force showing the editor.
   */
  $.Editable.prototype.repositionEditor = function (position) {
    var boundingRect;
    var x;
    var y;

    if (this.options.inlineMode || position) {
      boundingRect = this.getBoundingRect();
      this.showBttnWrapper();

      if (boundingRect.ok || (boundingRect.left >= 0 && boundingRect.top >= 0 && boundingRect.right > 0 && boundingRect.bottom > 0)) {
        x = boundingRect.left + (boundingRect.width) / 2;
        y = boundingRect.top + boundingRect.height;

        if (!(this.iOS() && this.iOSVersion() < 8)) {
          x = x + this.$window.scrollLeft();
          y = y + this.$window.scrollTop();
        }

        this.showByCoordinates(x, y);
      } else if (!this.options.alwaysVisible) {
        var el_offset = this.$element.offset();
        this.showByCoordinates(el_offset.left, el_offset.top + 10);
      } else {
        this.hide();
      }

      if (this.options.buttons.length === 0) {
        this.hide();
      }
    }
  };

  $.Editable.prototype.showByCoordinates = function (x, y) {
    x = x - 22;
    y = y + 8;

    var $container = this.$document.find(this.options.scrollableContainer);

    if (this.options.scrollableContainer != 'body') {
      x = x - $container.offset().left;
      y = y - $container.offset().top;

      if (!this.iPad()) {
        y = y + $container.scrollTop();
        x = x + $container.scrollLeft();
      }
    }

    if (y > this.$box.offset().top + this.$box.outerHeight()) {
      y = this.$box.offset().top + this.$box.outerHeight();

      if (this.options.inlineMode) y = y + 10;
    }

    var editor_width = Math.max(this.$popup_editor.outerWidth(), 250);

    if (x + editor_width >= $container.outerWidth() - 50 && (x + 44) - editor_width > 0) {
      this.$popup_editor.addClass('right-side');
      x = $container.outerWidth() - (x + 44);

      if ($container.css('position') == 'static') {
        x = x + parseFloat($container.css('margin-left'), 10) + parseFloat($container.css('margin-right'), 10)
      }

      this.$popup_editor.css('top', y);
      this.$popup_editor.css('right', x);
      this.$popup_editor.css('left', 'auto');
    } else if (x + editor_width < $container.outerWidth() - 50) {
      this.$popup_editor.removeClass('right-side');
      this.$popup_editor.css('top', y);
      this.$popup_editor.css('left', x);
      this.$popup_editor.css('right', 'auto');
    } else {
      this.$popup_editor.removeClass('right-side');
      this.$popup_editor.css('top', y);
      this.$popup_editor.css('left', Math.max(($container.outerWidth() - editor_width), 10) / 2);
      this.$popup_editor.css('right', 'auto');
    }

    this.$popup_editor.show();
  };

  /**
   * Set position for popup editor.
   */
  $.Editable.prototype.positionPopup = function (command) {
    if ($(this.$editor.find('button.fr-bttn[data-cmd="' + command + '"]')).length) {
      var $btn = this.$editor.find('button.fr-bttn[data-cmd="' + command + '"]');
      var w = $btn.width();
      var h = $btn.height();
      var x = $btn.offset().left + w / 2;
      var y = $btn.offset().top + h;
      this.showByCoordinates(x, y)
    }
  };

})(jQuery);

(function ($) {
  $.Editable.prototype.refreshImageAlign = function ($img) {
    this.$image_editor.find('.fr-dropdown > button[data-name="align"] + ul li').removeClass('active');

    var cmd = 'floatImageNone';
    var alignment = 'center';

    if ($img.hasClass('fr-fil')) {
      alignment = 'left';
      cmd = 'floatImageLeft';
    } else if ($img.hasClass('fr-fir')) {
      alignment = 'right';
      cmd = 'floatImageRight';
    }

    this.$image_editor.find('.fr-dropdown > button[data-name="align"].fr-trigger i').attr('class', 'fa fa-align-' + alignment);
    this.$image_editor.find('.fr-dropdown > button[data-name="align"] + ul li[data-val="' + cmd + '"]').addClass('active');
  }

  $.Editable.prototype.refreshImageDisplay = function () {
    var $img = this.$element.find('.f-img-editor');
    this.$image_editor.find('.fr-dropdown > button[data-name="display"] + ul li').removeClass('active');
    if ($img.hasClass('fr-dib')) {
      this.$image_editor.find('.fr-dropdown > button[data-name="display"] + ul li[data-val="fr-dib"]').addClass('active');
    }
    else {
      this.$image_editor.find('.fr-dropdown > button[data-name="display"] + ul li[data-val="fr-dii"]').addClass('active');
    }
  }

  $.Editable.image_commands = {
    align: {
      title: 'Alignment',
      icon: 'fa fa-align-center',
      refresh: $.Editable.prototype.refreshImageAlign,
      refreshOnShow: $.Editable.prototype.refreshImageAlign,
      seed: [{
        cmd: 'floatImageLeft',
        title: 'Align Left',
        icon: 'fa fa-align-left'
      }, {
        cmd: 'floatImageNone',
        title: 'Align Center',
        icon: 'fa fa-align-center'
      }, {
        cmd: 'floatImageRight',
        title: 'Align Right',
        icon: 'fa fa-align-right'
      }],
      callback: function ($img, cmd, val) {
        this[val]($img);
      },
      undo: true
    },

    display: {
      title: 'Text Wrap',
      icon: 'fa fa-star',
      refreshOnShow: $.Editable.prototype.refreshImageDisplay,
      namespace: 'Image',
      seed: [{
        title: 'Inline',
        value: 'fr-dii'
      }, {
        title: 'Break Text',
        value: 'fr-dib'
      }],
      callback: function ($img, cmd, val) {
        this.displayImage($img, val);
      },
      undo: true
    },

    linkImage: {
      title: 'Insert Link',
      icon: {
        type: 'font',
        value: 'fa fa-link'
      },
      callback: function ($img) {
        this.linkImage($img);
      }
    },

    replaceImage: {
      title: 'Replace Image',
      icon: {
        type: 'font',
        value: 'fa fa-exchange'
      },
      callback: function ($img) {
        this.replaceImage($img);
      }
    },

    removeImage: {
      title: 'Remove Image',
      icon: {
        type: 'font',
        value: 'fa fa-trash-o'
      },
      callback: function ($img) {
        this.removeImage($img);
      }
    }
  };

  $.Editable.DEFAULTS = $.extend($.Editable.DEFAULTS, {
    allowedImageTypes: ['jpeg', 'jpg', 'png', 'gif'],
    customImageButtons: {},
    defaultImageTitle: 'Image title',
    defaultImageWidth: 300,
    defaultImageDisplay: 'block',
    defaultImageAlignment: 'center',
    imageButtons: ['display', 'align', 'linkImage', 'replaceImage', 'removeImage'],
    imageDeleteConfirmation: true,
    imageDeleteURL: null,
    imageDeleteParams: {},
    imageMove: true,
    imageResize: true,
    imageLink: true,
    imageTitle: true,
    imageUpload: true,
    imageUploadParams: {},
    imageUploadParam: 'file',
    imageUploadToS3: false,
    imageUploadURL: 'http://i.froala.com/upload',
    maxImageSize: 1024 * 1024 * 10, // 10 Mb.,
    pasteImage: true,
    textNearImage: true
  })

  $.Editable.prototype.hideImageEditorPopup = function () {
    if (this.$image_editor) {
      this.$image_editor.hide();
    }
  };

  $.Editable.prototype.showImageEditorPopup = function () {
    if (this.$image_editor) {
      this.$image_editor.show();
    }

    if (!this.options.imageMove) {
      this.$element.attr('contenteditable', false);
    }
  };

  $.Editable.prototype.showImageWrapper = function () {
    if (this.$image_wrapper) {
      this.$image_wrapper.show();
    }
  };

  $.Editable.prototype.hideImageWrapper = function (image_mode) {
    if (this.$image_wrapper) {
      if (!this.$element.attr('data-resize') && !image_mode) {
        this.closeImageMode();
        this.imageMode = false;
      }

      this.$image_wrapper.hide();
      this.$image_wrapper.find('input').blur()
    }
  };

  $.Editable.prototype.showInsertImage = function () {
    this.hidePopups();

    this.showImageWrapper();
  };

  $.Editable.prototype.showImageEditor = function () {
    this.hidePopups();

    this.showImageEditorPopup();
  };

  $.Editable.prototype.insertImageHTML = function () {
    var html = '<div class="froala-popup froala-image-popup" style="display: none;"><h4><span data-text="true">Insert Image</span><span data-text="true">Uploading image</span><i title="Cancel" class="fa fa-times" id="f-image-close-' + this._id + '"></i></h4>';

    html += '<div id="f-image-list-' + this._id + '">';

    if (this.options.imageUpload) {
      html += '<div class="f-popup-line drop-upload">';
      html += '<div class="f-upload" id="f-upload-div-' + this._id + '"><strong data-text="true">Drop Image</strong><br>(<span data-text="true">or click</span>)<form target="frame-' + this._id + '" enctype="multipart/form-data" encoding="multipart/form-data" action="' + this.options.imageUploadURL + '" method="post" id="f-upload-form-' + this._id + '"><input id="f-file-upload-' + this._id + '" type="file" name="' + this.options.imageUploadParam + '" accept="image/*"></form></div>';

      if (this.browser.msie && $.Editable.getIEversion() <= 9) {
        html += '<iframe id="frame-' + this._id + '" name="frame-' + this._id + '" src="javascript:false;" style="width:0; height:0; border:0px solid #FFF; position: fixed; z-index: -1;"></iframe>';
      }

      html += '</div>';
    }

    if (this.options.imageLink) {
      html += '<div class="f-popup-line"><label><span data-text="true">Enter URL</span>: </label><input id="f-image-url-' + this._id + '" type="text" placeholder="http://example.com"><button class="f-browse fr-p-bttn" id="f-browser-' + this._id + '"><i class="fa fa-search"></i></button><button data-text="true" class="f-ok fr-p-bttn f-submit" id="f-image-ok-' + this._id + '">OK</button></div>';
    }

    html += '</div>';
    html += '<p class="f-progress" id="f-progress-' + this._id + '"><span></span></p>';
    html += '</div>';

    return html;
  }

  $.Editable.prototype.iFrameLoad = function () {
    var $iframe = this.$image_wrapper.find('iframe#frame-' + this._id);
    if (!$iframe.attr('data-loaded')) {
      $iframe.attr('data-loaded', true);
      return false;
    }

    try {
      var $form = this.$image_wrapper.find('#f-upload-form-' + this._id);

      // S3 upload.
      if (this.options.imageUploadToS3) {
        var domain = $form.attr('action')
        var key = $form.find('input[name="key"]').val()
        var url = domain + key;

        this.writeImage(url);
        if (this.options.imageUploadToS3.callback) {
          this.options.imageUploadToS3.callback.call(this, url, key);
        }
      }

      // Normal upload.
      else {
        var response = $iframe.contents().text();
        this.parseImageResponse(response);
      }
    }
    catch (ex) {
      // Same domain.
      this.throwImageError(7);
    }
  }

  $.Editable.prototype.initImage = function () {
    this.buildInsertImage();

    if (!this.isLink || this.isImage) {
      this.initImagePopup();
    }

    this.addListener('destroy', this.destroyImage);
  }

  $.Editable.initializers.push($.Editable.prototype.initImage);

  $.Editable.prototype.destroyImage = function () {
    if (this.$image_editor) this.$image_editor.html('').removeData().remove();
    if (this.$image_wrapper) this.$image_wrapper.html('').removeData().remove();
  }

  /**
   * Build insert image.
   */
  $.Editable.prototype.buildInsertImage = function () {
    // Add image wrapper to editor.
    this.$image_wrapper = $(this.insertImageHTML());
    this.$popup_editor.append(this.$image_wrapper);

    var that = this;

    // Stop event propagation in image.
    this.$image_wrapper.on('mouseup touchend', $.proxy(function (e) {
      if (!this.isResizing()) {
        e.stopPropagation();
      }
    }, this));

    this.addListener('hidePopups', $.proxy(function () {
      this.hideImageWrapper(true);
    }, this));

    // Init progress bar.
    this.$progress_bar = this.$image_wrapper.find('p#f-progress-' + this._id);

    // Build drag and drop upload.
    if (this.options.imageUpload) {
      // Build upload frame.
      if (this.browser.msie && $.Editable.getIEversion() <= 9) {
        var iFrame = this.$image_wrapper.find('iframe').get(0);

        if (iFrame.attachEvent) {
          iFrame.attachEvent('onload', function () { that.iFrameLoad() });
        } else {
          iFrame.onload  = function () { that.iFrameLoad() };
        }
      }

      // File was picked.
      this.$image_wrapper.on('change', 'input[type="file"]', function () {
        // Files were picked.
        if (this.files !== undefined) {
          that.uploadImage(this.files);
        }

        // IE 9 upload.
        else {
          if (!that.triggerEvent('beforeImageUpload', [], false)) {
            return false;
          }

          var $form = $(this).parents('form');
          $form.find('input[type="hidden"]').remove();
          var key;
          for (key in that.options.imageUploadParams) {
            $form.prepend('<input type="hidden" name="' + key + '" value="' + that.options.imageUploadParams[key] + '" />');
          }

          if (that.options.imageUploadToS3 !== false) {
            for (key in that.options.imageUploadToS3.params) {
              $form.prepend('<input type="hidden" name="' + key + '" value="' + that.options.imageUploadToS3.params[key] + '" />');
            }

            $form.prepend('<input type="hidden" name="' + 'success_action_status' + '" value="' + 201 + '" />');
            $form.prepend('<input type="hidden" name="' + 'X-Requested-With' + '" value="' + 'xhr' + '" />');
            $form.prepend('<input type="hidden" name="' + 'Content-Type' + '" value="' + '' + '" />');
            $form.prepend('<input type="hidden" name="' + 'key' + '" value="' + that.options.imageUploadToS3.keyStart + (new Date()).getTime() + '-' + $(this).val().match(/[^\/\\]+$/) + '" />');
          } else {
            $form.prepend('<input type="hidden" name="XHR_CORS_TRARGETORIGIN" value="' + that.window.location.href + '" />');
          }

          that.showInsertImage();
          that.showImageLoader(true);
          that.disable();

          $form.submit();
        }

        // Chrome fix.
        $(this).val('');
      });
    }

    // Add drag and drop support.
    this.buildDragUpload();

    // URL input for insert image.
    this.$image_wrapper.on('mouseup keydown', '#f-image-url-' + this._id, $.proxy(function (e) {
      var keyCode = e.which;
      if (!keyCode || keyCode !== 27) {
        e.stopPropagation();
      }
    }, this));

    // Create a list with all the items from the popup.
    this.$image_wrapper.on('click', '#f-image-ok-' + this._id, $.proxy(function () {
      this.writeImage(this.$image_wrapper.find('#f-image-url-' + this._id).val(), true);
    }, this));

    // Wrap things in image wrapper.
    this.$image_wrapper.on(this.mouseup, '#f-image-close-' + this._id, $.proxy(function (e) {
      if (this.isDisabled) return false;

      e.stopPropagation();

      this.$bttn_wrapper.show();
      this.hideImageWrapper(true);

      if (this.options.inlineMode && this.options.buttons.length === 0) {
        if (this.imageMode) {
          this.showImageEditor();
        } else {
          this.hide();
        }
      }

      if (!this.imageMode) {
        this.restoreSelection();
        this.focus();
      }

      if (!this.options.inlineMode && !this.imageMode) {
        this.hide();
      } else if (this.imageMode) {
        this.showImageEditor();
      }
    }, this))

    this.$image_wrapper.on('click', function (e) {
      e.stopPropagation();
    });

    this.$image_wrapper.on('click', '*', function (e) {
      e.stopPropagation();
    });
  };


  // Delete an image.
  $.Editable.prototype.deleteImage = function ($img) {
    if (this.options.imageDeleteURL) {
      var deleteParams = this.options.imageDeleteParams;
      deleteParams.info = $img.data('info');
      deleteParams.src = $img.attr('src');
      $.ajax({
        type: 'POST',
        url: this.options.imageDeleteURL,
        data: deleteParams,
        crossDomain: this.options.crossDomain,
        xhrFields: {
          withCredentials: this.options.withCredentials
        },
        headers: this.options.headers
      })
      .done($.proxy(function (data) {
        // In media manager.
        if ($img.parent().parent().hasClass('f-image-list')) {
          $img.parent().remove();
        }

        // Normal delete.
        else {
          $img.parent().removeClass('f-img-deleting');
        }

        this.triggerEvent('imageDeleteSuccess', [data], false);
      }, this))
      .fail($.proxy(function () {
        $img.parent().removeClass('f-img-deleting');
        this.triggerEvent('imageDeleteError', ['Error during image delete.'], false);
      }, this));
    }
    else {
      $img.parent().removeClass('f-img-deleting');
      this.triggerEvent('imageDeleteError', ['Missing imageDeleteURL option.'], false);
    }
  };

  /**
   * Initialize actions for image handles.
   */
  $.Editable.prototype.imageHandle = function () {
    var that = this;

    var $handle = $('<span data-fr-verified="true">').addClass('f-img-handle').on({
      // Start to drag.
      movestart: function (e) {
        that.hide();
        that.$element.addClass('f-non-selectable').attr('contenteditable', false);
        that.$element.attr('data-resize', true);

        $(this).attr('data-start-x', e.startX);
        $(this).attr('data-start-y', e.startY);
      },

      // Still moving.
      move: function (e) {
        var $elem = $(this);
        var diffX = e.pageX - parseInt($elem.attr('data-start-x'), 10);

        $elem.attr('data-start-x', e.pageX);
        $elem.attr('data-start-y', e.pageY);

        var $img = $elem.prevAll('img');
        var width = $img.width();
        if ($elem.hasClass('f-h-ne') || $elem.hasClass('f-h-se')) {
          $img.attr('width', width + diffX);
        } else {
          $img.attr('width', width - diffX);
        }

        that.triggerEvent('imageResize', [$img], false);
      },

      // Drag end.
      moveend: function () {
        $(this).removeAttr('data-start-x');
        $(this).removeAttr('data-start-y');

        var $elem = $(this);
        var $img = $elem.prevAll('img');

        that.$element.removeClass('f-non-selectable');
        if (!that.isImage) {
          that.$element.attr('contenteditable', true);
        }

        that.triggerEvent('imageResizeEnd', [$img]);

        $(this).trigger('mouseup');
      },

      // Issue #221.
      touchend: function () {
        $(this).trigger('moveend');
      }
    });

    return $handle;
  };

  /**
   * Disable image resizing from browser.
   */
  $.Editable.prototype.disableImageResize = function () {
    // Disable resize for FF.
    if (this.browser.mozilla) {
      try {
        document.execCommand('enableObjectResizing', false, false);
        document.execCommand('enableInlineTableEditing', false, false);
      } catch (ex) {}
    }
  };

  $.Editable.prototype.isResizing = function () {
    return this.$element.attr('data-resize');
  };

  $.Editable.prototype.getImageStyle = function ($img) {
    var style = 'z-index: 1; position: relative; overflow: auto;';

    var $c = $img;
    var p = 'padding';
    if ($img.parent().hasClass('f-img-editor')) {
      $c = $img.parent();
      p = 'margin';
    }
    style += ' padding-left:' + $c.css(p + '-left') + ';';
    style += ' padding-right:' + $c.css(p + '-right') + ';';
    style += ' padding-bottom:' + $c.css(p + '-bottom') + ';';
    style += ' padding-top:' + $c.css(p + '-top') + ';';

    if ($img.hasClass('fr-dib')) {
      style += ' vertical-align: top; display: block;';

      if ($img.hasClass('fr-fir')) {
        style += ' float: none; margin-right: 0; margin-left: auto;';
      }
      else if ($img.hasClass('fr-fil')) {
        style += ' float: none; margin-left: 0; margin-right: auto;';
      }
      else {
        style += ' float: none; margin: auto;';
      }
    }
    else {
      style += ' display: inline-block;';
      if ($img.hasClass('fr-fir')) {
        style += ' float: right;';
      }
      else if ($img.hasClass('fr-fil')) {
        style += ' float: left;';
      }
      else {
        style += ' float: none;';
      }
    }

    return style;
  };

  $.Editable.prototype.getImageClass = function (cls) {
    var classes = cls.split(' ');

    cls = 'fr-fin';

    if (classes.indexOf('fr-fir') >= 0) cls = 'fr-fir';
    if (classes.indexOf('fr-fil') >= 0) cls = 'fr-fil';
    if (classes.indexOf('fr-dib') >= 0) cls += ' fr-dib';
    if (classes.indexOf('fr-dii') >= 0) cls += ' fr-dii';

    return cls;
  };

  $.Editable.prototype.refreshImageButtons = function ($img) {
    // Unmark active buttons in the popup.
    this.$image_editor.find('button').removeClass('active');

    // Mark active float.
    var image_float = $img.css('float');
    if ($img.hasClass('fr-fil')) {
      image_float = 'Left';
    } else if ($img.hasClass('fr-fir')) {
      image_float = 'Right';
    } else {
      image_float = 'None';
    }

    this.$image_editor.find('button[data-cmd="floatImage' + image_float + '"]').addClass('active');

    this.raiseEvent('refreshImage', [$img]);
  }

  /**
   * Image controls.
   */
  $.Editable.prototype.initImageEvents = function () {

    // Image drop.
    if (document.addEventListener && !document.dropAssigned) {
      document.dropAssigned = true;
      document.addEventListener('drop', $.proxy(function (e) {
        if ($('.froala-element img.fr-image-move').length) {
          e.preventDefault();
          e.stopPropagation();
          $('.froala-element img.fr-image-move').removeClass('fr-image-move');
          return false;
        }
      }, this));
    }

    this.disableImageResize();

    var that = this;

    // Image mouse down.
    this.$element.on('mousedown', 'img:not([contenteditable="false"])', function (e) {
      if (that.isDisabled) return false;

      if (!that.isResizing()) {
        // Stop propagation.
        if (that.initialized) e.stopPropagation();

        // Remove content editable if move is not allowed or MSIE.
        that.$element.attr('contenteditable', false);
        $(this).addClass('fr-image-move');
      }
    });

    // Image mouse up.
    this.$element.on('mouseup', 'img:not([contenteditable="false"])', function () {
      if (that.isDisabled) return false;

      if (!that.isResizing()) {
        // Add contenteditable back after move.
        if (!that.options.imageMove && !that.isImage && !that.isHTML) {
          that.$element.attr('contenteditable', true);
        }

        $(this).removeClass('fr-image-move');
      }
    });

    // Image click.
    this.$element.on('click touchend', 'img:not([contenteditable="false"])', function (e) {
      if (that.isDisabled) return false;

      if (!that.isResizing() && that.initialized) {
        e.preventDefault();
        e.stopPropagation();

        // Close other images.
        that.closeImageMode();

        // iPad Fix.
        that.$element.blur();

        that.refreshImageButtons($(this));

        // Set alt for image.
        that.$image_editor.find('.f-image-alt input[type="text"]').val($(this).attr('alt') || $(this).attr('title'));

        // Hide basic editor.
        that.showImageEditor();

        // Wrap image with image editor.
        if (!($(this).parent().hasClass('f-img-editor') && $(this).parent().get(0).tagName == 'SPAN')) {
          var image_class = that.getImageClass($(this).attr('class'));

          $(this).wrap('<span data-fr-verified="true" class="f-img-editor ' + image_class + '"></span>');

          if ($(this).parents('.f-img-wrap').length === 0 && !that.isImage) {
            if ($(this).parents('a').length > 0) {
              $(this).parents('a:first').wrap('<span data-fr-verified="true" class="f-img-wrap ' + image_class + '"></span>');
            } else {
              $(this).parent().wrap('<span data-fr-verified="true" class="f-img-wrap ' + image_class + '"></span>');
            }
          } else {
            $(this).parents('.f-img-wrap').attr('class', image_class + ' f-img-wrap');
          }
        }

        // Remove old handles.
        $(this).parent().find('.f-img-handle').remove();

        // Add Handles.
        if (that.options.imageResize) {
          // Get image handle.
          var $handle = that.imageHandle();
          $(this).parent().append($handle.clone(true).addClass('f-h-ne'));
          $(this).parent().append($handle.clone(true).addClass('f-h-se'));
          $(this).parent().append($handle.clone(true).addClass('f-h-sw'));
          $(this).parent().append($handle.clone(true).addClass('f-h-nw'));
        }

        // Reposition editor.
        that.showByCoordinates($(this).offset().left + $(this).width() / 2, $(this).offset().top + $(this).height());

        // Image mode power.
        that.imageMode = true;

        that.$bttn_wrapper.find('.fr-bttn').removeClass('active');

        // No selection needed. We have image.
        that.clearSelection();
      }
    });

    // Add resizing data.
    this.$element.on('mousedown touchstart', '.f-img-handle', $.proxy(function () {
      if (that.isDisabled) return false;

      this.$element.attr('data-resize', true);
    }, this));


    // Remove resizing data.
    this.$element.on('mouseup', '.f-img-handle', $.proxy(function (e) {
      if (that.isDisabled) return false;

      var $img = $(e.target).prevAll('img');
      setTimeout($.proxy(function () {
        this.$element.removeAttr('data-resize');
        $img.click();
      }, this), 0);
    }, this));
  };

  $.Editable.prototype.execImage = function (cmd, val, param) {
    var $image_editor = this.$element.find('span.f-img-editor');
    var $img = $image_editor.find('img');

    var button = $.Editable.image_commands[cmd] || this.options.customImageButtons[cmd];

    if (button && button.callback) {
      button.callback.apply(this, [$img, cmd, val, param]);
    }
  }

  $.Editable.prototype.bindImageRefreshListener = function (button) {
    if (button.refresh) {
      this.addListener('refreshImage', $.proxy(function ($img) {
        button.refresh.apply(this, [$img])
      }, this));
    }
  }

  $.Editable.prototype.buildImageButton = function (button, cmd) {
    var btn = '<button class="fr-bttn" data-namespace="Image" data-cmd="' + cmd + '" title="' + button.title + '">';

    if (this.options.icons[cmd] !== undefined) {
      btn += this.prepareIcon(this.options.icons[cmd], button.title);
    } else {
      btn += this.prepareIcon(button.icon, button.title);
    }

    btn += '</button>';

    this.bindImageRefreshListener(button);

    return btn;
  }

  $.Editable.prototype.buildImageAlignDropdown = function (command) {
    this.bindImageRefreshListener(command);

    var dropdown = '<ul class="fr-dropdown-menu f-align">';

    // Iterate color seed.
    for (var j = 0; j < command.seed.length; j++) {
      var align = command.seed[j];

      dropdown += '<li data-cmd="align" data-namespace="Image" data-val="' + align.cmd + '" title="' + align.title + '"><a href="#"><i class="' + align.icon + '"></i></a></li>';
    }

    dropdown += '</ul>';

    return dropdown;
  }

  $.Editable.prototype.buildImageDropdown = function (button) {
    dropdown = this.buildDefaultDropdown(button);
    btn = this.buildDropdownButton(button, dropdown);
    return btn;
  }

  $.Editable.prototype.image_command_dispatcher = {
    align: function (button) {
      var dropdown = this.buildImageAlignDropdown(button);
      var btn = this.buildDropdownButton(button, dropdown);
      return btn;
    }
  }

  $.Editable.prototype.buildImageButtons = function () {
    var buttons = '';

    for (var i = 0; i < this.options.imageButtons.length; i++) {
      var cmd = this.options.imageButtons[i];
      if ($.Editable.image_commands[cmd] === undefined && this.options.customImageButtons[cmd] === undefined) {
        continue;
      }
      var button = $.Editable.image_commands[cmd] || this.options.customImageButtons[cmd];

      button.cmd = cmd;
      var command_dispatch = this.image_command_dispatcher[cmd];
      if (command_dispatch) {
        buttons += command_dispatch.apply(this, [button]);
      }
      else {
        if (button.seed) {
          buttons += this.buildImageDropdown(button, cmd);
        }
        else {
          buttons += this.buildImageButton(button, cmd);
        }
      }
    }

    return buttons;
  }

  /**
   * Init popup for image.
   */
  $.Editable.prototype.initImagePopup = function () {
    this.$image_editor = $('<div class="froala-popup froala-image-editor-popup" style="display: none">');

    var $buttons = $('<div class="f-popup-line f-popup-toolbar">').appendTo(this.$image_editor);
    $buttons.append(this.buildImageButtons());

    this.addListener('hidePopups', this.hideImageEditorPopup);

    if (this.options.imageTitle) {
      $('<div class="f-popup-line f-image-alt">')
        .append('<label><span data-text="true">Title</span>: </label>')
        .append($('<input type="text">').on('mouseup keydown touchend', function (e) {
          var keyCode = e.which;
          if (!keyCode || keyCode !== 27) {
            e.stopPropagation();
          }
        }))
        .append('<button class="fr-p-bttn f-ok" data-text="true" data-callback="setImageAlt" data-cmd="setImageAlt" title="OK">OK</button>')
        .appendTo(this.$image_editor)
    }

    this.$popup_editor.append(this.$image_editor);

    this.bindCommandEvents(this.$image_editor);
    this.bindDropdownEvents(this.$image_editor);
  };

  $.Editable.prototype.displayImage = function ($img, cls) {
    var $image_editor = $img.parents('span.f-img-editor');
    $image_editor.removeClass('fr-dii fr-dib').addClass(cls);

    this.triggerEvent('imageDisplayed', [$img, cls]);
    $img.click();
  }

  /**
   * Float image to the left.
   */
  $.Editable.prototype.floatImageLeft = function ($img) {
    var $image_editor = $img.parents('span.f-img-editor');
    $image_editor.removeClass('fr-fin fr-fil fr-fir').addClass('fr-fil');

    if (this.isImage) {
      this.$element.css('float', 'left')
    }

    this.triggerEvent('imageFloatedLeft', [$img]);
    $img.click();
  };

  /**
   * Align image center.
   */
  $.Editable.prototype.floatImageNone = function ($img) {
    var $image_editor = $img.parents('span.f-img-editor');
    $image_editor.removeClass('fr-fin fr-fil fr-fir').addClass('fr-fin');

    if (!this.isImage) {
      if ($image_editor.parent().get(0) == this.$element.get(0)) {
        $image_editor.wrap('<div style="text-align: center;"></div>');
      } else {
        $image_editor.parents('.f-img-wrap:first').css('text-align', 'center');
      }
    }

    if (this.isImage) {
      this.$element.css('float', 'none')
    }


    this.triggerEvent('imageFloatedNone', [$img]);
    $img.click();
  };

  /**
   * Float image to the right.
   */
  $.Editable.prototype.floatImageRight = function ($img) {
    var $image_editor = $img.parents('span.f-img-editor');
    $image_editor.removeClass('fr-fin fr-fil fr-fir').addClass('fr-fir');

    if (this.isImage) {
      this.$element.css('float', 'right')
    }


    this.triggerEvent('imageFloatedRight', [$img]);
    $img.click();
  };

  /**
   * Link image.
   */
  $.Editable.prototype.linkImage = function ($img) {
    this.imageMode = true;
    this.showInsertLink();

    var $image_editor = $img.parents('span.f-img-editor');

    if ($image_editor.parent().get(0).tagName == 'A') {
      this.updateLinkValues($image_editor.parent());
    } else {
      this.resetLinkValues();
    }
  };

  /**
   * Replace image with another one.
   */
  $.Editable.prototype.replaceImage = function ($img) {
    this.showInsertImage();
    this.imageMode = true;

    this.$image_wrapper.find('input[type="text"]').val($img.attr('src'));

    this.showByCoordinates($img.offset().left + $img.width() / 2, $img.offset().top + $img.height());
  };

  /**
   * Remove image.
   */
  $.Editable.prototype.removeImage = function ($img) {
    var $image_editor = $img.parents('span.f-img-editor');
    if ($image_editor.length === 0) return false;

    var img = $img.get(0);

    var message = 'Are you sure? Image will be deleted.';
    if ($.Editable.LANGS[this.options.language]) {
      message = $.Editable.LANGS[this.options.language].translation[message];
    }

    // Ask to remove.
    if (!this.options.imageDeleteConfirmation || confirm(message)) {
      // (src)
      if (this.triggerEvent('beforeRemoveImage', [$(img)], false)) {
        var img_parent = $image_editor.parents(this.valid_nodes.join(','));

        if ($image_editor.parents('.f-img-wrap').length) {
          $image_editor.parents('.f-img-wrap').remove();
        } else {
          $image_editor.remove();
        }
        this.refreshImageList(true);
        this.hide();

        if (img_parent.length && img_parent[0] != this.$element.get(0)) {
          if ($(img_parent[0]).text() === '' && img_parent[0].childNodes.length == 1) {
            $(img_parent[0]).remove()
          }
        }


        this.wrapText();

        this.triggerEvent('afterRemoveImage', [$img]);
        this.focus();

        this.imageMode = false;
      }
    }
    else {
      $img.click();
    }
  };

  /**
   * Set image alt.
   */
  $.Editable.prototype.setImageAlt = function () {
    var $image_editor = this.$element.find('span.f-img-editor');
    var $img = $image_editor.find('img');
    $img.attr('alt', this.$image_editor.find('.f-image-alt input[type="text"]').val());
    $img.attr('title', this.$image_editor.find('.f-image-alt input[type="text"]').val());

    this.hide();
    this.closeImageMode();
    this.triggerEvent('imageAltSet', [$img]);
  };

  $.Editable.prototype.buildImageMove = function () {
    var that = this;

    if (!this.isLink) {
      this.initDrag();
    }

    that.$element.on('dragover dragenter dragend', function (e) {
      e.preventDefault();
    });

    that.$element.on('drop', function (e) {
      if (that.isDisabled) return false;

      that.closeImageMode();
      that.hide();
      that.imageMode = false;

      // Init editor if not initialized.
      if (!that.initialized) {
        that.$element.unbind('mousedown.element');
        that.lateInit();
      }

      if (that.options.imageUpload && $('.froala-element img.fr-image-move').length === 0) {
        if (e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files.length) {
          if (that.isDisabled) return false;

          var files = e.originalEvent.dataTransfer.files;
          if (that.options.allowedImageTypes.indexOf(files[0].type.replace(/image\//g,'')) >= 0) {
            that.insertMarkersAtPoint(e.originalEvent);
            that.showByCoordinates(e.originalEvent.pageX, e.originalEvent.pageY);
            that.uploadImage(files);
            e.preventDefault();
            e.stopPropagation();
          }
        }
      } else {
        // MSIE drag and drop workaround.
        if ($('.froala-element .fr-image-move').length > 0 && that.options.imageMove) {
          e.preventDefault();
          e.stopPropagation();
          that.insertMarkersAtPoint(e.originalEvent);
          that.restoreSelectionByMarkers();
          var html = $('<div>')
              .append(
                $('.froala-element img.fr-image-move')
                  .clone()
                  .removeClass('fr-image-move')
                  .addClass('fr-image-dropped')
              ).html();

          that.insertHTML(html);

          var $parent = $('.froala-element img.fr-image-move').parent();
          $('.froala-element img.fr-image-move').remove();

          if ($parent.get(0) != that.$element.get(0) && $parent.is(':empty')) {
            $parent.remove();
          }

          that.clearSelection();

          if (that.initialized) {
            setTimeout(function () {
              that.$element
                .find('.fr-image-dropped')
                .removeClass('.fr-image-dropped')
                .click();
            }, 0);
          } else {
            that.$element
              .find('.fr-image-dropped')
              .removeClass('.fr-image-dropped')
          }

          that.sync();
          that.hideOtherEditors();
        } else {
          e.preventDefault();
          e.stopPropagation();
          $('.froala-element img.fr-image-move').removeClass('fr-image-move');
        }

        return false;
      }
    })
  }

  /**
   * Add drag and drop upload.
   *
   * @param $holder - jQuery object.
   */
  $.Editable.prototype.buildDragUpload = function () {
    var that = this;

    that.$image_wrapper.on('dragover', '#f-upload-div-' + this._id, function () {
      $(this).addClass('f-hover');
      return false;
    });

    that.$image_wrapper.on('dragend', '#f-upload-div-' + this._id, function () {
      $(this).removeClass('f-hover');
      return false;
    });

    that.$image_wrapper.on('drop', '#f-upload-div-' + this._id, function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!that.options.imageUpload) return false;

      $(this).removeClass('f-hover');

      that.uploadImage(e.originalEvent.dataTransfer.files);
    });
  };

  $.Editable.prototype.showImageLoader = function (waiting) {
    if (waiting === undefined) waiting = false;

    if (!waiting) {
      this.$image_wrapper.find('h4').addClass('uploading');
    }
    else {
      var message = 'Please wait!';
      if ($.Editable.LANGS[this.options.language]) {
        message = $.Editable.LANGS[this.options.language].translation[message];
      }

      this.$progress_bar.find('span').css('width', '100%').text(message);
    }

    this.$image_wrapper.find('#f-image-list-' + this._id).hide();
    this.$progress_bar.show();
    this.showInsertImage();
  }

  $.Editable.prototype.hideImageLoader = function () {
    this.$progress_bar.hide();
    this.$progress_bar.find('span').css('width', '0%').text('');
    this.$image_wrapper.find('#f-image-list-' + this._id).show();
    this.$image_wrapper.find('h4').removeClass('uploading');
  };

  /**
   * Insert image command.
   *
   * @param image_link
   */
  $.Editable.prototype.writeImage = function (image_link, sanitize, response) {
    if (sanitize) {
      image_link = this.sanitizeURL(image_link);
      if (image_link === '') {
        return false;
      }
    }

    var img = new Image();
    img.onerror = $.proxy(function () {
      this.hideImageLoader();
      this.throwImageError(1);
    }, this);

    if (this.imageMode) {
      img.onload = $.proxy(function () {
        var $img = this.$element.find('.f-img-editor > img');
        $img.attr('src', image_link);

        this.hide();
        this.hideImageLoader();
        this.$image_editor.show();

        this.enable();

        // call with (image HTML)
        this.triggerEvent('imageReplaced', [$img, response]);

        setTimeout(function () {
          $img.trigger('click');
        }, 0);
      }, this);
    }

    else {
      img.onload = $.proxy(function () {
        this.insertLoadedImage(image_link, response);
      }, this);
    }

    this.showImageLoader(true);

    img.src = image_link;
  };

  $.Editable.prototype.processInsertImage = function (image_link, image_preview) {
    if (image_preview === undefined) image_preview = true;

    this.enable();

    // Restore saved selection.
    this.focus();
    this.restoreSelection();

    var image_width = '';
    if (parseInt(this.options.defaultImageWidth, 10) || 0 > 0) {
      image_width = ' width="' + this.options.defaultImageWidth + '"';
    }

    var alignment = 'fr-fin';
    if (this.options.defaultImageAlignment == 'left') alignment = 'fr-fil';
    if (this.options.defaultImageAlignment == 'right') alignment = 'fr-fir';

    alignment += ' fr-di' + this.options.defaultImageDisplay[0];

    // Build image string.
    var img_s = '<img class="' + alignment + ' fr-just-inserted" alt="' + this.options.defaultImageTitle + '" src="' + image_link + '"' + image_width + '>';

    // Search for start container.
    var selected_element = this.getSelectionElements()[0];
    var range = this.getRange();
    var $span = (!this.browser.msie && $.Editable.getIEversion() > 8 ? $(range.startContainer) : null);

    // Insert was called with image selected.
    if ($span && $span.hasClass('f-img-wrap')) {
      // Insert image after.
      if (range.startOffset === 1) {
        $span.after('<' + this.options.defaultTag + '><span class="f-marker" data-type="true" data-id="0"></span><br/><span class="f-marker" data-type="false" data-id="0"></span></' + this.options.defaultTag + '>');
        this.restoreSelectionByMarkers();
        this.getSelection().collapseToStart();
      }

      // Insert image before.
      else if (range.startOffset === 0) {
        $span.before('<' + this.options.defaultTag + '><span class="f-marker" data-type="true" data-id="0"></span><br/><span class="f-marker" data-type="false" data-id="0"></span></' + this.options.defaultTag + '>');
        this.restoreSelectionByMarkers();
        this.getSelection().collapseToStart();
      }

      // Add image.
      this.insertHTML(img_s);
    }

    // Insert in table.
    else if (this.getSelectionTextInfo(selected_element).atStart && selected_element != this.$element.get(0) && selected_element.tagName != 'TD' && selected_element.tagName != 'TH' && selected_element.tagName != 'LI') {
      $(selected_element).before('<' + this.options.defaultTag + '>' + img_s + '</' + this.options.defaultTag + '>');
    }

    // Normal insert.
    else {
      this.insertHTML(img_s);
    }

    this.disable();
  }

  $.Editable.prototype.insertLoadedImage = function (image_link, response) {
    // Image was loaded fine.
    this.triggerEvent('imageLoaded', [image_link], false);

    this.processInsertImage(image_link, false);

    // IE fix.
    if (this.browser.msie) {
      this.$element.find('img').each(function (index, elem) {
        elem.oncontrolselect = function () {
          return false;
        };
      });
    }

    this.enable();

    // Hide image controls.
    this.hide();
    this.hideImageLoader();

    // Have to wrap image.
    this.wrapText();

    // Unwrap image from p inside list.
    this.cleanupLists();
    var p_node;
    var img = this.$element.find('img.fr-just-inserted').get(0);
    if (img) p_node = img.previousSibling;
    if (p_node && p_node.nodeType == 3 && /\u200B/gi.test(p_node.textContent)) {
      $(p_node).remove();
    }

    // (jquery image)
    this.triggerEvent('imageInserted', [this.$element.find('img.fr-just-inserted'), response]);

    // Select image.
    setTimeout($.proxy(function () {
      this.$element.find('img.fr-just-inserted').removeClass('fr-just-inserted').trigger('touchend');
    }, this), 50);
  };

  $.Editable.prototype.throwImageErrorWithMessage = function (message) {
    this.enable();

    this.triggerEvent('imageError', [{
      message: message,
      code: 0
    }], false);

    this.hideImageLoader();
  }

  $.Editable.prototype.throwImageError = function (code) {
    this.enable();

    var status = 'Unknown image upload error.';
    if (code == 1) {
      status = 'Bad link.';
    } else if (code == 2) {
      status = 'No link in upload response.';
    } else if (code == 3) {
      status = 'Error during file upload.';
    } else if (code == 4) {
      status = 'Parsing response failed.';
    } else if (code == 5) {
      status = 'Image too large.';
    } else if (code == 6) {
      status = 'Invalid image type.';
    } else if (code == 7) {
      status = 'Image can be uploaded only to same domain in IE 8 and IE 9.'
    }

    this.triggerEvent('imageError', [{
      code: code,
      message: status
    }], false);

    this.hideImageLoader();
  };

  /**
   * Upload files to server.
   *
   * @param files
   */
  $.Editable.prototype.uploadImage = function (files) {
    if (!this.triggerEvent('beforeImageUpload', [files], false)) {
      return false;
    }

    if (files !== undefined && files.length > 0) {
      var formData;

      if (this.drag_support.formdata) {
        formData = this.drag_support.formdata ? new FormData() : null;
      }

      if (formData) {
        var key;
        for (key in this.options.imageUploadParams) {
          formData.append(key, this.options.imageUploadParams[key]);
        }

        // Upload to S3.
        if (this.options.imageUploadToS3 !== false) {
          for (key in this.options.imageUploadToS3.params) {
            formData.append(key, this.options.imageUploadToS3.params[key]);
          }

          formData.append('success_action_status', '201');
          formData.append('X-Requested-With', 'xhr');
          formData.append('Content-Type', files[0].type);
          formData.append('key', this.options.imageUploadToS3.keyStart + (new Date()).getTime() + '-' + files[0].name);
        }

        formData.append(this.options.imageUploadParam, files[0]);

        // Check image max size.
        if (files[0].size > this.options.maxImageSize) {
          this.throwImageError(5);
          return false;
        }

        // Check image types.
        if (this.options.allowedImageTypes.indexOf(files[0].type.replace(/image\//g,'')) < 0) {
          this.throwImageError(6);
          return false;
        }
      }

      if (formData) {
        var xhr;
        if (this.options.crossDomain) {
          xhr = this.createCORSRequest('POST', this.options.imageUploadURL);
        } else {
          xhr = new XMLHttpRequest();
          xhr.open('POST', this.options.imageUploadURL);

          for (var h_key in this.options.headers) {
            xhr.setRequestHeader(h_key, this.options.headers[h_key]);
          }
        }

        xhr.onload = $.proxy(function () {
          var message = 'Please wait!';
          if ($.Editable.LANGS[this.options.language]) {
            message = $.Editable.LANGS[this.options.language].translation[message];
          }

          this.$progress_bar.find('span').css('width', '100%').text(message);
          try {
            if (this.options.imageUploadToS3) {
              if (xhr.status == 201) {
                this.parseImageResponseXML(xhr.responseXML);
              } else {
                this.throwImageError(3);
              }
            }
            else {
              if (xhr.status >= 200 && xhr.status < 300) {
                this.parseImageResponse(xhr.responseText);
              }

              else {
                try {
                  var resp = $.parseJSON(xhr.responseText);
                  if (resp.error) {
                    this.throwImageErrorWithMessage(resp.error);
                  } else {
                    this.throwImageError(3);
                  }
                } catch (ex) {
                  this.throwImageError(3);
                }
              }
            }
          } catch (ex) {
            // Bad response.
            this.throwImageError(4);
          }
        }, this);

        xhr.onerror = $.proxy(function () {
          // Error on uploading file.
          this.throwImageError(3);

        }, this);

        xhr.upload.onprogress = $.proxy(function (event) {
          if (event.lengthComputable) {
            var complete = (event.loaded / event.total * 100 | 0);
            this.$progress_bar.find('span').css('width', complete + '%');
          }
        }, this);

        // Keep the editor only for uploading.
        this.disable();

        xhr.send(formData);

        // Prepare progress bar for uploading.
        this.showImageLoader();
      }
    }
  };

  $.Editable.prototype.parseImageResponse = function (response) {
    try {
      if (!this.triggerEvent('afterImageUpload', [response], false)) {
        return false;
      }

      var resp = $.parseJSON(response);
      if (resp.link) {
        this.writeImage(resp.link, false, response);
      } else if (resp.error) {
        this.throwImageErrorWithMessage(resp.error);
      } else {
        // No link in upload request.
        this.throwImageError(2);
      }
    } catch (ex) {
      // Bad response.
      this.throwImageError(4);
    }
  };

  $.Editable.prototype.parseImageResponseXML = function (xml_doc) {
    try {
      var link = $(xml_doc).find('Location').text();
      var key = $(xml_doc).find('Key').text();

      // Callback.
      if (this.options.imageUploadToS3.callback) {
        this.options.imageUploadToS3.callback.call(this, link, key);
      }

      if (link) {
        this.writeImage(link);
      } else {
        // No link in upload request.
        this.throwImageError(2);
      }
    } catch (ex) {
      // Bad response.
      this.throwImageError(4);
    }
  }


  $.Editable.prototype.setImageUploadURL = function (url) {
    if (url) {
      this.options.imageUploadURL = url;
    }

    if (this.options.imageUploadToS3) {
      this.options.imageUploadURL = 'https://' + this.options.imageUploadToS3.bucket + '.' + this.options.imageUploadToS3.region + '.amazonaws.com/';
    }
  }

  $.Editable.prototype.closeImageMode = function () {
    this.$element.find('span.f-img-editor > img').each($.proxy(function (index, elem) {
      $(elem)
        .removeClass('fr-fin fr-fil fr-fir fr-dib fr-dii')
        .addClass(this.getImageClass($(elem).parent().attr('class')));

      if ($(elem).parents('.f-img-wrap').length > 0) {
        if ($(elem).parent().parent().get(0).tagName == 'A') {
          $(elem).siblings('span.f-img-handle').remove().end().unwrap().parent().unwrap();
        } else {
          $(elem).siblings('span.f-img-handle').remove().end().unwrap().unwrap();
        }
      } else {
        $(elem).siblings('span.f-img-handle').remove().end().unwrap();
      }
    }, this));

    if (this.$element.find('span.f-img-editor').length) {
      this.$element.find('span.f-img-editor').remove();
      this.$element.parents('span.f-img-editor').remove();
    }

    this.$element.removeClass('f-non-selectable');
    if (!this.editableDisabled && !this.isHTML) {
      this.$element.attr('contenteditable', true);
    }

    if (this.$image_editor) {
      this.$image_editor.hide();
    }

    if (this.$link_wrapper && this.options.linkText) {
      this.$link_wrapper.find('input[type="text"].f-lt').parent().removeClass('fr-hidden');
    }
  };

  $.Editable.prototype.refreshImageList = function (no_check) {
    if (!this.isLink && !this.options.editInPopup) {
      var newListSrc = [];
      var newList = [];
      var that = this;

      this.$element.find('img').each (function (index, img) {
        var $img = $(img);

        newListSrc.push($img.attr('src'));
        newList.push($img);

        if ($img.attr('contenteditable') == 'false') return true;

        if ($img.parents('.f-img-editor').length === 0 && !$img.hasClass('fr-dii') && !$img.hasClass('fr-dib')) {
          // No text near image. Just add fr-dib.
          if (!that.options.textNearImage) {
            $img.addClass('fr-dib');
            that.options.imageButtons.splice(that.options.imageButtons.indexOf('display'), 1);
          }
          else {
            // If centered and not floated, add fr-dib.
            if ($img.hasClass('fr-fin')) {
              $img.addClass('fr-dib');
            }
            else if ($img.hasClass('fr-fil') || $img.hasClass('fr-fir')) {
              $img.addClass('fr-dii');
            }
            else {
              if ($img.css('display') == 'block' && $img.css('float') == 'none') {
                $img.addClass('fr-dib');
              }
              else {
                $img.addClass('fr-dii');
              }
            }
          }
        }

        if (!that.options.textNearImage) {
          $img.removeClass('fr-dii').addClass('fr-dib');
        }

        // Add the right class.
        if ($img.parents('.f-img-editor').length === 0 && !$img.hasClass('fr-fil') && !$img.hasClass('fr-fir') && !$img.hasClass('fr-fin')) {
          if ($img.hasClass('fr-dii')) {
            // Set floating margin.
            if ($img.css('float') == 'right') {
              $img.addClass('fr-fir');
            } else if ($img.css('float') == 'left') {
              $img.addClass('fr-fil');
            } else {
              $img.addClass('fr-fin');
            }
          }
          else {
            var st = $img.attr('style');
            $img.hide();
            // Set floating margin.
            if (parseInt($img.css('margin-right'), 10) === 0 && st) {
              $img.addClass('fr-fir');
            } else if (parseInt($img.css('margin-left'), 10) === 0 && st) {
              $img.addClass('fr-fil');
            } else {
              $img.addClass('fr-fin');
            }
            $img.show();
          }
        }

        $img.css('margin', '');
        $img.css('float', '');
        $img.css('display', '')

        $img.removeAttr('data-style');
      });

      if (no_check === undefined) {
        for (var i = 0; i < this.imageList.length; i++) {
          if (newListSrc.indexOf(this.imageList[i].attr('src')) < 0) {
            this.triggerEvent('afterRemoveImage', [this.imageList[i]], false);
          }
        }
      }

      this.imageList = newList;
    }
  };

  /**
   * Insert image.
   */
  $.Editable.prototype.insertImage = function () {
    if (!this.options.inlineMode) {
      this.closeImageMode();
      this.imageMode = false;
      this.positionPopup('insertImage');
    }

    if (this.selectionInEditor()) {
      this.saveSelection();
    }

    this.showInsertImage();

    this.imageMode = false;

    this.$image_wrapper.find('input[type="text"]').val('');
  };

})(jQuery);

(function ($) {
  $.Editable.prototype.showLinkWrapper = function () {
    if (this.$link_wrapper) {
      this.$link_wrapper.show();
      this.$link_wrapper.trigger('hideLinkList');
      this.$link_wrapper.trigger('hideLinkClassList');

      this.$link_wrapper.find('input.f-lu').removeClass('fr-error');

      // Show or not the text link.
      if (this.imageMode || !this.options.linkText) {
        this.$link_wrapper.find('input[type="text"].f-lt').parent().addClass('fr-hidden');
      } else {
        this.$link_wrapper.find('input[type="text"].f-lt').parent().removeClass('fr-hidden');
      }

      // Url for link disabled or not.
      if (this.imageMode) {
        this.$link_wrapper.find('input[type="text"].f-lu').removeAttr('disabled');
      }

      if (!this.phone()) {
        setTimeout($.proxy(function () {
          if (!(this.imageMode && this.iPad())) {
            this.$link_wrapper.find('input[type="text"].f-lu').focus().select();
          }
        }, this), 0);
      } else {
        this.$document.scrollTop(this.$link_wrapper.offset().top + 30);
      }

      this.link = true;
    }

    this.refreshDisabledState();
  };

  $.Editable.prototype.hideLinkWrapper = function () {
    if (this.$link_wrapper) {
      this.$link_wrapper.hide();
      this.$link_wrapper.find('input').blur()
    }

    this.refreshDisabledState();
  };

  $.Editable.prototype.showInsertLink = function () {
    this.hidePopups();

    this.showLinkWrapper();
  };

  $.Editable.prototype.updateLinkValues = function ($link) {
    var href = $link.attr('href') || 'http://';

    // Set link text.
    this.$link_wrapper.find('input.f-lt').val($link.text());

    // Set href.
    if (!this.isLink) {
      // Simple ampersand.
      this.$link_wrapper.find('input.f-lu').val(href.replace(/\&amp;/g, '&'));
      this.$link_wrapper.find('.f-external-link').attr('href', href);
    }
    else {
      if (href == '#') {
        href = '';
      }

      // Simple ampersand.
      this.$link_wrapper.find('input#f-lu-' + this._id).val(href.replace(/\&amp;/g, '&'));
      this.$link_wrapper.find('.f-external-link').attr('href', href || '#');
    }

    // Set blank.
    this.$link_wrapper.find('input.f-target').prop('checked', $link.attr('target') == '_blank');

    // Set link classes.
    this.$link_wrapper.find('li.f-choose-link-class').each ($.proxy(function (index, elem) {
      if ($link.hasClass($(elem).data('class'))) {
        $(elem).click();
      }
    }, this));

    for (var attr in this.options.linkAttributes) {
      var ca = $link.attr(attr);
      if (ca) {
        this.$link_wrapper.find('input.fl-' + attr).val(ca);
      }
      else {
        this.$link_wrapper.find('input.fl-' + attr).val('');
      }
    }

    this.$link_wrapper.find('a.f-external-link, button.f-unlink').show();
  }

  $.Editable.prototype.initLinkEvents = function () {
    var that = this;

    var cancel_click = function (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    var link_click = function (e) {
      e.stopPropagation();
      e.preventDefault();

      if (that.isDisabled) return false;

      if (that.text() !== '') {
        that.hide();
        return false;
      }

      that.link = true;

      that.clearSelection();
      that.removeMarkers();

      if (!that.selectionDisabled) {
        $(this).before('<span class="f-marker" data-type="true" data-id="0" data-fr-verified="true"></span>');
        $(this).after('<span class="f-marker" data-type="false" data-id="0" data-fr-verified="true"></span>');
        that.restoreSelectionByMarkers();
      }

      that.exec('createLink');

      that.updateLinkValues($(this));

      // Show editor.
      that.showByCoordinates($(this).offset().left + $(this).outerWidth() / 2, $(this).offset().top + (parseInt($(this).css('padding-top'), 10) || 0) + $(this).height());

      // Keep these 2 lines in this order for issue #224.
      // Show link wrapper.
      that.showInsertLink();

      // File link.
      if ($(this).hasClass('fr-file')) {
        that.$link_wrapper.find('input.f-lu').attr('disabled', 'disabled');
      } else {
        that.$link_wrapper.find('input.f-lu').removeAttr('disabled');
      }

      // Make sure we close image mode.
      that.closeImageMode();
    };

    // Link click. stop propagation.
    this.$element.on('mousedown', 'a', $.proxy(function (e) {
      if (!this.isResizing()) {
        e.stopPropagation();
      }
    }, this));

    // Click on a link.
    if (!this.isLink) {
      if (this.iOS()) {
        this.$element.on('touchstart', 'a:not([contenteditable="false"])', cancel_click);
        this.$element.on('touchend', 'a:not([contenteditable="false"])', link_click);

        this.$element.on('touchstart', 'a[contenteditable="false"]', cancel_click);
        this.$element.on('touchend', 'a[contenteditable="false"]', cancel_click);
      } else {
        this.$element.on('click', 'a:not([contenteditable="false"])', link_click);
        this.$element.on('click', 'a[contenteditable="false"]', cancel_click);
      }
    } else {
      if (this.iOS()) {
        this.$element.on('touchstart', cancel_click);
        this.$element.on('touchend', link_click);
      } else {
        this.$element.on('click', link_click);
      }
    }
  }

  $.Editable.prototype.destroyLink = function () {
    this.$link_wrapper.html('').removeData().remove();
  }

  /**
   * Initialize links.
   */
  $.Editable.prototype.initLink = function () {
    this.buildCreateLink();

    this.initLinkEvents();

    this.addListener('destroy', this.destroyLink);
  };

  $.Editable.initializers.push($.Editable.prototype.initLink);

  /**
   * Remove link
   */
  $.Editable.prototype.removeLink = function () {
    if (this.imageMode) {
      if (this.$element.find('.f-img-editor').parent().get(0).tagName == 'A') {
        $(this.$element.find('.f-img-editor').get(0)).unwrap();
      }

      this.triggerEvent('imageLinkRemoved');


      this.showImageEditor();
      this.$element.find('.f-img-editor').find('img').click();

      this.link = false;
    }

    else {
      this.restoreSelection();
      this.document.execCommand('unlink', false, null);

      if (!this.isLink) {
        this.$element.find('a:empty').remove();
      }

      this.triggerEvent('linkRemoved');



      this.hideLinkWrapper();
      this.$bttn_wrapper.show();

      if (!this.options.inlineMode || this.isLink) {
        this.hide();
      }

      this.link = false;
    }
  };

  /**
   * Write link in document.
   *
   * @param url - Link URL.
   * @param blank - New tab.
   */
  $.Editable.prototype.writeLink = function (url, text, cls, blank, attrs) {
    var links;

    var nofollow = this.options.noFollow;

    if (this.options.alwaysBlank) {
      blank = true;
    }

    var attr;
    var nofollow_string = '';
    var blank_string = '';
    var attrs_string = '';

    // No follow and link is external.
    if (nofollow === true && /^https?:\/\//.test(url)) {
      nofollow_string = 'rel="nofollow"';
    }

    if (blank === true) {
      blank_string = 'target="_blank"';
    }

    for (attr in attrs) {
      attrs_string += ' ' + attr + '="' + attrs[attr] + '"';
    }

    var original_url = url;
    url = this.sanitizeURL(url);

    if (this.options.convertMailAddresses) {
      var regex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/i;

      if (regex.test(url) && url.indexOf('mailto:') !== 0) {
        url = 'mailto:' + url;
      }
    }

    if (url.indexOf('mailto:') !== 0 && this.options.linkAutoPrefix !== '' && !/^(https?:|ftps?:|)\/\//.test(url)) {
      url = this.options.linkAutoPrefix + url;
    }

    if (url === '') {
      this.$link_wrapper.find('input.f-lu').addClass('fr-error').focus();
      this.triggerEvent('badLink', [original_url], false);
      return false;
    }

    this.$link_wrapper.find('input.f-lu').removeClass('fr-error');

    // Insert link to image.
    if (this.imageMode) {
      if (this.$element.find('.f-img-editor').parent().get(0).tagName != 'A') {
        this.$element.find('.f-img-editor').wrap('<a data-fr-link="true" href="' + url + '" ' + blank_string + ' ' + nofollow_string + attrs_string + '></a>');
      } else {

        var $link = this.$element.find('.f-img-editor').parent();

        if (blank === true) {
          $link.attr('target', '_blank');
        } else {
          $link.removeAttr('target');
        }

        if (nofollow === true) {
          $link.attr('rel', 'nofollow');
        } else {
          $link.removeAttr('rel');
        }

        for (attr in attrs) {
          if (attrs[attr]) {
            $link.attr(attr, attrs[attr]);
          }
          else {
            $link.removeAttr(attr);
          }
        }

        $link.removeClass(Object.keys(this.options.linkClasses).join(' '));
        $link.attr('href', url).addClass(cls);
      }

      // (URL)
      this.triggerEvent('imageLinkInserted', [url]);


      this.showImageEditor();
      this.$element.find('.f-img-editor').find('img').click();

      this.link = false;
    }

    // Insert link.
    else {
      var attributes = null;

      if (!this.isLink) {
        this.restoreSelection();

        links = this.getSelectionLinks();
        if (links.length > 0) {
          attributes = links[0].attributes;
          is_file = $(links[0]).hasClass('fr-file');
        }

        this.saveSelectionByMarkers();
        this.document.execCommand('unlink', false, url);
        this.$element.find('span[data-fr-link="true"]').each(function (index, elem) {
          $(elem).replaceWith($(elem).html());
        });
        this.restoreSelectionByMarkers();
      } else {
        if (text === '') {
          text = this.$element.text();
        }
      }

      // URL is not empty.
      if (!this.isLink) {
        this.removeMarkers();
        if (this.options.linkText || this.text() === '') {
          this.insertHTML('<span class="f-marker" data-fr-verified="true" data-id="0" data-type="true"></span>' + (text || original_url) + '<span class="f-marker" data-fr-verified="true" data-id="0" data-type="false"></span>');
          this.restoreSelectionByMarkers();
        }

        this.document.execCommand('createLink', false, url);
        links = this.getSelectionLinks();
      }
      else {
        this.$element.text(text);
        links = [this.$element.attr('href', url).get(0)];
      }

      for (var i = 0; i < links.length; i++) {
        if (attributes) {
          for (var l = 0; l < attributes.length; l++) {
            if (attributes[l].nodeName != 'href') {
              $(links[i]).attr(attributes[l].nodeName, attributes[l].value);
            }
          }
        }

        if (blank === true) {
          $(links[i]).attr('target', '_blank');
        } else {
          $(links[i]).removeAttr('target');
        }

        if (nofollow === true && /^https?:\/\//.test(url)) {
          $(links[i]).attr('rel', 'nofollow');
        } else {
          $(links[i]).removeAttr('rel');
        }

        $(links[i]).data('fr-link', true);
        $(links[i]).removeClass(Object.keys(this.options.linkClasses).join(' '));
        $(links[i]).addClass(cls);

        for (attr in attrs) {
          if (attrs[attr]) {
            $(links[i]).attr(attr, attrs[attr]);
          }
          else {
            $(links[i]).removeAttr(attr);
          }
        }
      }

      this.$element.find('a:empty').remove();

      this.triggerEvent('linkInserted', [url]);

      this.hideLinkWrapper();
      this.$bttn_wrapper.show();

      if (!this.options.inlineMode || this.isLink) this.hide();

      this.link = false;
    }
  };

  $.Editable.prototype.createLinkHTML = function () {
    var html = '<div class="froala-popup froala-link-popup" style="display: none;">';
    html += '<h4><span data-text="true">Insert Link</span><a target="_blank" title="Open Link" class="f-external-link" href="#"><i class="fa fa-external-link"></i></a><i title="Cancel" class="fa fa-times" id="f-link-close-' + this._id + '"></i></h4>';

    // Text.
    html += '<div class="f-popup-line fr-hidden"><input type="text" placeholder="Text" class="f-lt" id="f-lt-' + this._id + '"></div>';

    // Browse input.
    var browse_cls = '';
    if (this.options.linkList.length) {
      browse_cls = 'f-bi';
    }

    // URL.
    html += '<div class="f-popup-line"><input type="text" placeholder="http://www.example.com" class="f-lu ' + browse_cls + '" id="f-lu-' + this._id + '"/>';

    // Link list.
    if (this.options.linkList.length) {
      html += '<button class="fr-p-bttn f-browse-links" id="f-browse-links-' + this._id + '"><i class="fa fa-chevron-down"></i></button>';
      html += '<ul id="f-link-list-' + this._id + '">';

      for (var i = 0; i < this.options.linkList.length; i++) {
        var link = this.options.linkList[i];
        var options = '';
        for (var at in link) {
          options += ' data-' + at + '="' + link[at] + '"';
        }
        html += '<li class="f-choose-link"' + options + '>' + link.body + '</li>';
      }

      html += '</ul>';
    }
    html += '</div>';

    // Link classes.
    if (Object.keys(this.options.linkClasses).length) {
      html += '<div class="f-popup-line"><input type="text" placeholder="Choose link type" class="f-bi" id="f-luc-' + this._id + '" disabled="disabled"/>';

      html += '<button class="fr-p-bttn f-browse-links" id="f-links-class-' + this._id + '"><i class="fa fa-chevron-down"></i></button>';
      html += '<ul id="f-link-class-list-' + this._id + '">';

      for (var l_class in this.options.linkClasses) {
        var l_name = this.options.linkClasses[l_class];

        html += '<li class="f-choose-link-class" data-class="' + l_class + '">' + l_name + '</li>';
      }

      html += '</ul>';

      html += '</div>';
    }

    // Other attributes.
    for (var attr in this.options.linkAttributes) {
      var txt = this.options.linkAttributes[attr];
      html += '<div class="f-popup-line"><input class="fl-' + attr + '" type="text" placeholder="' + txt + '" id="fl-' + attr + '-' + this._id + '"/></div>';
    }

    // Open in new tab.
    html += '<div class="f-popup-line"><input type="checkbox" class="f-target" id="f-target-' + this._id + '"> <label data-text="true" for="f-target-' + this._id + '">Open in new tab</label><button data-text="true" type="button" class="fr-p-bttn f-ok f-submit" id="f-ok-' + this._id + '">OK</button>';

    // Unlink.
    if (this.options.unlinkButton) {
      html += '<button type="button" data-text="true" class="fr-p-bttn f-ok f-unlink" id="f-unlink-' + this._id + '">UNLINK</button>';
    }

    html += '</div></div>';

    return html;
  }

  /**
   * Build create link.
   */
  $.Editable.prototype.buildCreateLink = function () {
    this.$link_wrapper = $(this.createLinkHTML());
    this.$popup_editor.append(this.$link_wrapper);

    var that = this;

    // Link wrapper to hidePopups listener.
    this.addListener('hidePopups', this.hideLinkWrapper);

    // Stop event propagation in link.
    this.$link_wrapper.on('mouseup touchend', $.proxy(function (e) {
      if (!this.isResizing()) {
        e.stopPropagation();
        this.$link_wrapper.trigger('hideLinkList');
      }
    }, this));

    this.$link_wrapper.on('click', function (e) {
      e.stopPropagation();
    });

    this.$link_wrapper.on('click', '*', function (e) {
      e.stopPropagation();
    });

    // Field to edit text.
    if (this.options.linkText) {
      this.$link_wrapper
        .on('mouseup keydown', 'input#f-lt-' + this._id, $.proxy(function (e) {
          var keyCode = e.which;
          if (!keyCode || keyCode !== 27) {
            e.stopPropagation();
          }

          this.$link_wrapper.trigger('hideLinkList');
          this.$link_wrapper.trigger('hideLinkClassList');
        }, this));
    }

    // Set URL events.
    this.$link_wrapper
      .on('mouseup keydown touchend touchstart', 'input#f-lu-' + this._id, $.proxy(function (e) {
        var keyCode = e.which;
        if (!keyCode || keyCode !== 27) {
          e.stopPropagation();
        }

        this.$link_wrapper.trigger('hideLinkList');
        this.$link_wrapper.trigger('hideLinkClassList');
      }, this));

    // Blank url event.
    this.$link_wrapper.on('click keydown', 'input#f-target-' + this._id, function (e) {
      var keyCode = e.which;
      if (!keyCode || keyCode !== 27) {
        e.stopPropagation();
      }
    });

    // OK button.
    this.$link_wrapper
      .on('touchend', 'button#f-ok-' + this._id, function (e) {
        e.stopPropagation();
      })
      .on('click', 'button#f-ok-' + this._id, $.proxy(function () {
        var text;
        var $text = this.$link_wrapper.find('input#f-lt-' + this._id);
        var $url = this.$link_wrapper.find('input#f-lu-' + this._id);
        var $lcls = this.$link_wrapper.find('input#f-luc-' + this._id);
        var $blank_url = this.$link_wrapper.find('input#f-target-' + this._id);

        if ($text) {
          text = $text.val();
        }
        else {
          text = '';
        }

        var url = $url.val();
        if (this.isLink && url === '') {
          url = '#';
        }

        var cls = '';
        if ($lcls) {
          cls = $lcls.data('class');
        }

        var attrs = {};
        for (var attr in this.options.linkAttributes) {
          attrs[attr] = this.$link_wrapper.find('input#fl-' + attr + '-' + this._id).val()
        }

        this.writeLink(url, text, cls, $blank_url.prop('checked'), attrs);
      }, this));

    // Unlink button.
    this.$link_wrapper.on('click touch', 'button#f-unlink-' + this._id, $.proxy(function () {
      this.link = true;
      this.removeLink();
    }, this));

    // Predefined link list.
    if (this.options.linkList.length) {
      this.$link_wrapper
        .on('click touch', 'li.f-choose-link', function () {
          that.resetLinkValues();
          var $link_list_button = that.$link_wrapper.find('button#f-browse-links-' + that._id);
          var $text = that.$link_wrapper.find('input#f-lt-' + that._id);
          var $url = that.$link_wrapper.find('input#f-lu-' + that._id);
          var $blank_url = that.$link_wrapper.find('input#f-target-' + that._id);

          if ($text) {
            $text.val($(this).data('body'));
          }

          $url.val($(this).data('href'));
          $blank_url.prop('checked', $(this).data('blank'));

          for (var attr in that.options.linkAttributes) {
            if ($(this).data(attr)) {
              that.$link_wrapper.find('input#fl-' + attr + '-' + that._id).val($(this).data(attr));
            }
          }

          $link_list_button.click();
        })
        .on('mouseup', 'li.f-choose-link', function (e) {
          e.stopPropagation();
        })

      this.$link_wrapper
        .on('click', 'button#f-browse-links-' + this._id + ', button#f-browse-links-' + this._id + ' > i', function (e) {
          e.stopPropagation();
          var $link_list = that.$link_wrapper.find('ul#f-link-list-' + that._id);
          that.$link_wrapper.trigger('hideLinkClassList')
          $(this).find('i').toggleClass('fa-chevron-down')
          $(this).find('i').toggleClass('fa-chevron-up')
          $link_list.toggle();
        })
        .on('mouseup', 'button#f-browse-links-' + this._id + ', button#f-browse-links-' + this._id + ' > i', function (e) {
          e.stopPropagation();
        })

      this.$link_wrapper.bind('hideLinkList', function () {
        var $link_list = that.$link_wrapper.find('ul#f-link-list-' + that._id);
        var $link_list_button = that.$link_wrapper.find('button#f-browse-links-' + that._id);
        if ($link_list && $link_list.is(':visible')) {
          $link_list_button.click();
        }
      })
    }

    // Link classes.
    if (Object.keys(this.options.linkClasses).length) {
      this.$link_wrapper
        .on('mouseup keydown', 'input#f-luc-' + this._id, $.proxy(function (e) {
          var keyCode = e.which;
          if (!keyCode || keyCode !== 27) {
            e.stopPropagation();
          }

          this.$link_wrapper.trigger('hideLinkList');
          this.$link_wrapper.trigger('hideLinkClassList');
        }, this));

      this.$link_wrapper
        .on('click touch', 'li.f-choose-link-class', function () {
          var $label = that.$link_wrapper.find('input#f-luc-' + that._id);

          $label.val($(this).text());
          $label.data('class', $(this).data('class'));

          that.$link_wrapper.trigger('hideLinkClassList');
        })
        .on('mouseup', 'li.f-choose-link-class', function (e) {
          e.stopPropagation();
        })

      this.$link_wrapper
        .on('click', 'button#f-links-class-' + this._id, function (e) {
          e.stopPropagation();
          that.$link_wrapper.trigger('hideLinkList')
          var $link_list = that.$link_wrapper.find('ul#f-link-class-list-' + that._id);
          $(this).find('i').toggleClass('fa-chevron-down')
          $(this).find('i').toggleClass('fa-chevron-up')
          $link_list.toggle();
        })
        .on('mouseup', 'button#f-links-class-' + this._id, function (e) {
          e.stopPropagation();
        })

      this.$link_wrapper.bind('hideLinkClassList', function () {
        var $link_list = that.$link_wrapper.find('ul#f-link-class-list-' + that._id);
        var $link_list_button = that.$link_wrapper.find('button#f-links-class-' + that._id);
        if ($link_list && $link_list.is(':visible')) {
          $link_list_button.click();
        }
      })
    }

    // Close button.
    this.$link_wrapper
      .on(this.mouseup, 'i#f-link-close-' + this._id, $.proxy(function () {
        this.$bttn_wrapper.show();
        this.hideLinkWrapper();

        if ((!this.options.inlineMode && !this.imageMode) || this.isLink || this.options.buttons.length === 0) {
          this.hide();
        }

        if (!this.imageMode) {
          this.restoreSelection();
          this.focus();
        } else {
          this.showImageEditor();
        }
      }, this))
  };

  /**
   * Get links from selection.
   *
   * @returns {Array}
   */
  // From: http://stackoverflow.com/questions/5605401/insert-link-in-contenteditable-element
  $.Editable.prototype.getSelectionLinks = function () {
    var selectedLinks = [];
    var range;
    var containerEl;
    var links;
    var linkRange;

    if (window.getSelection) {
      var sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        linkRange = this.document.createRange();
        for (var r = 0; r < sel.rangeCount; ++r) {
          range = sel.getRangeAt(r);
          containerEl = range.commonAncestorContainer;

          if (containerEl && containerEl.nodeType != 1) {
            containerEl = containerEl.parentNode;
          }

          if (containerEl && containerEl.nodeName.toLowerCase() == 'a') {
            selectedLinks.push(containerEl);
          } else {
            links = containerEl.getElementsByTagName('a');
            for (var i = 0; i < links.length; ++i) {
              linkRange.selectNodeContents(links[i]);
              if (linkRange.compareBoundaryPoints(range.END_TO_START, range) < 1 && linkRange.compareBoundaryPoints(range.START_TO_END, range) > -1) {
                selectedLinks.push(links[i]);
              }
            }
          }
        }
        // linkRange.detach();
      }
    } else if (this.document.selection && this.document.selection.type != 'Control') {
      range = this.document.selection.createRange();
      containerEl = range.parentElement();
      if (containerEl.nodeName.toLowerCase() == 'a') {
        selectedLinks.push(containerEl);
      } else {
        links = containerEl.getElementsByTagName('a');
        linkRange = this.document.body.createTextRange();
        for (var j = 0; j < links.length; ++j) {
          linkRange.moveToElementText(links[j]);
          if (linkRange.compareEndPoints('StartToEnd', range) > -1 && linkRange.compareEndPoints('EndToStart', range) < 1) {
            selectedLinks.push(links[j]);
          }
        }
      }
    }

    return selectedLinks;
  };

  $.Editable.prototype.resetLinkValues = function () {
    this.$link_wrapper.find('input').val('');
    this.$link_wrapper.find('input[type="checkbox"].f-target').prop('checked', this.options.alwaysBlank);
    this.$link_wrapper.find('input[type="text"].f-lt').val(this.text());
    this.$link_wrapper.find('input[type="text"].f-lu').val('http://');
    this.$link_wrapper.find('input[type="text"].f-lu').removeAttr('disabled');
    this.$link_wrapper.find('a.f-external-link, button.f-unlink').hide();

    for (var attr in this.options.linkAttributes) {
      this.$link_wrapper.find('input[type="text"].fl-' + attr).val('');
    }
  }

  /**
   * Insert link.
   */
  $.Editable.prototype.insertLink = function () {
    if (!this.options.inlineMode) {
      this.closeImageMode();
      this.imageMode = false;
      this.positionPopup('createLink');
    }

    if (this.selectionInEditor()) {
      this.saveSelection();
    }

    this.showInsertLink();

    var links = this.getSelectionLinks();
    if (links.length > 0) {
      this.updateLinkValues($(links[0]));
    } else {
      this.resetLinkValues();
    }
  };

})(jQuery);

(function ($) {
  $.Editable.prototype.browserFixes = function () {
    this.backspaceEmpty();

    this.backspaceInEmptyBlock();

    this.fixHR();

    this.domInsert();

    this.fixIME();

    this.cleanInvisibleSpace();

    this.cleanBR();

    this.insertSpace();
  }

  // Fix for issue stefanneculai/froala-editor-js#439.
  $.Editable.prototype.backspaceInEmptyBlock = function () {
    this.$element.on('keyup', $.proxy(function (e) {
      var keyCode = e.which;

      if (this.browser.mozilla && !this.isHTML && keyCode == 8) {
        var $selEl = $(this.getSelectionElement());

        if (this.valid_nodes.indexOf($selEl.get(0).tagName) >= 0 && $selEl.find('*').length == 1 && $selEl.text() === '' && $selEl.find('br').length == 1) {
          this.setSelection($selEl.get(0));
        }
      }
    }, this));
  }

  $.Editable.prototype.insertSpace = function () {
    if (this.browser.mozilla) {
      this.$element.on('keypress', $.proxy(function (e) {
        var keyCode = e.which;

        var el = this.getSelectionElements()[0];

        if (!this.isHTML && keyCode == 32 && el.tagName != 'PRE') {
          e.preventDefault();
          this.insertSimpleHTML('&nbsp;');
        }
      }, this));
    }
  }

  $.Editable.prototype.cleanBR = function () {
    this.$element.on('keyup', $.proxy(function () {
      this.$element.find(this.valid_nodes.join(',')).each ($.proxy(function (idx, node) {
        if (['TH', 'TD', 'LI'].indexOf(node.tagName) >= 0) return true;

        var contents = node.childNodes;
        var br = null;
        if (contents.length && contents[contents.length - 1].tagName == 'BR') {
          br = contents[contents.length - 1];
        }
        else {
          return true;
        }

        var prev = br.previousSibling;

        // Check if parent has text.
        if (prev && prev.tagName != 'BR' && $(br).parent().text().length > 0 && this.valid_nodes.indexOf(prev.tagName) < 0) {
          $(br).remove();
        }
      }, this));
    }, this));
  }

  $.Editable.prototype.replaceU200B = function (contents) {
    for (var i = 0; i < contents.length; i++) {
      if (contents[i].nodeType == 3 && /\u200B/gi.test(contents[i].textContent)) {
        contents[i].textContent = contents[i].textContent.replace(/\u200B/gi, '');
      }
      else if (contents[i].nodeType == 1) this.replaceU200B($(contents[i]).contents());
    }
  }

  $.Editable.prototype.cleanInvisibleSpace = function () {
    var has_invisible = function (node) {
      var text = $(node).text();
      if (node && /\u200B/.test($(node).text()) && text.replace(/\u200B/gi, '').length > 0) return true;
      return false;
    }

    this.$element.on('keyup', $.proxy(function () {
      var el = this.getSelectionElement();
      if (has_invisible(el) && $(el).find('li').length === 0) {
        this.saveSelectionByMarkers();
        this.replaceU200B($(el).contents());
        this.restoreSelectionByMarkers();
      }
    }, this))
  }

  $.Editable.prototype.fixHR = function () {
    this.$element.on ('keypress', $.proxy (function (e) {
      var $pseduoEl = $(this.getSelectionElement());
      if ($pseduoEl.is('hr') || $pseduoEl.parents('hr').length) return false;

      var keyCode = e.which;

      if (keyCode == 8) {
        var $element = $(this.getSelectionElements()[0]);
        if ($element.prev().is('hr') && this.getSelectionTextInfo($element.get(0)).atStart) {
          this.saveSelectionByMarkers();
          $element.prev().remove();
          this.restoreSelectionByMarkers();
          e.preventDefault();
        }
      }
    }, this));
  }

  $.Editable.prototype.backspaceEmpty = function () {
    this.$element.on('keydown', $.proxy(function (e) {
      var keyCode = e.which;

      if (!this.isHTML && keyCode == 8 && this.$element.hasClass('f-placeholder')) {
        e.preventDefault();
      }
    }, this));
  };

  $.Editable.prototype.domInsert = function () {
    this.$element.on('keydown', $.proxy(function (e) {
      var keyCode = e.which;
      if (keyCode === 13) {
        this.add_br = true;
      }
    }, this));

    this.$element.on('DOMNodeInserted', $.proxy(function (e) {
      // Remove spans that are not verified.
      if (e.target.tagName === 'SPAN' && !$(e.target).attr('data-fr-verified') && !this.no_verify && !this.textEmpty(e.target)) {
        $(e.target).replaceWith($(e.target).contents());
      }

      // Remove br type moz.
      if (e.target.tagName === 'BR') {
        setTimeout(function () {
          $(e.target).removeAttr('type');
        }, 0);
      }

      if (e.target.tagName === 'A') {
        setTimeout(function () {
          $(e.target).removeAttr('_moz_dirty');
        }, 0);
      }

      // Enter before and after table.
      if (this.options.paragraphy && this.add_br && e.target.tagName === 'BR') {
        if (($(e.target).prev().length && $(e.target).prev().get(0).tagName === 'TABLE') || ($(e.target).next().length && $(e.target).next().get(0).tagName === 'TABLE')) {
          $(e.target).wrap('<p class="fr-p-wrap">');
          var $p = this.$element.find('p.fr-p-wrap').removeAttr('class');
          this.setSelection($p.get(0));
        }
      }

      // Do not add BR in LI.
      if (e.target.tagName === 'BR' && this.isLastSibling(e.target) && e.target.parentNode.tagName == 'LI' && this.textEmpty(e.target.parentNode)) {
        $(e.target).remove();
      }
    }, this));

    this.$element.on('keyup', $.proxy(function (e) {
      var keyCode = e.which;
      if (keyCode === 8) {
        this.$element.find('span:not([data-fr-verified])').attr('data-fr-verified', true);
      }

      if (keyCode === 13) {
        this.add_br = false;
      }
    }, this));
  };

  $.Editable.prototype.fixIME = function () {
    try {
      if (this.$element.get(0).msGetInputContext) {
        this.$element.get(0).msGetInputContext().addEventListener('MSCandidateWindowShow', $.proxy(function () {
          this.ime = true;
        }, this))

        this.$element.get(0).msGetInputContext().addEventListener('MSCandidateWindowHide', $.proxy(function () {
          this.ime = false;
          this.$element.trigger('keydown');
          this.oldHTML = '';
        }, this))
      }
    }
    catch (ex) {

    }
  }

})(jQuery);

(function ($) {
  $.Editable.prototype.handleEnter = function () {
    var inLi = $.proxy(function () {
      var element = this.getSelectionElement();
      if (!(element.tagName == 'LI' || this.parents($(element), 'li').length > 0)) return false;
      return true;
    }, this);

    // Keypress.
    this.$element.on('keypress', $.proxy(function (e) {
      if (!this.isHTML && !inLi()) {
        var keyCode = e.which;

        // ENTER key was pressed.
        if (keyCode == 13 && !e.shiftKey) {
          e.preventDefault();

          // Save undo step.
          this.saveUndoStep();

          // Reduce selection to one element.
          this.insertSimpleHTML('<break></break>');

          // Get the selected elements.
          var elements = this.getSelectionElements();

          // We are in main element.
          if (elements[0] == this.$element.get(0)) {
            this.enterInMainElement(elements[0]);
          }

          // We are in another element.
          else {
            this.enterInElement(elements[0]);
          }

          if (this.getSelectionTextInfo(this.$element.get(0)).atEnd) {
            this.$wrapper.scrollTop(this.$element.height());
          }

          else {
            var info = this.getBoundingRect();
            if (this.$wrapper.offset().top + this.$wrapper.height() < info.top + info.height) {
              this.$wrapper.scrollTop(info.top + this.$wrapper.scrollTop() - (this.$wrapper.height() + this.$wrapper.offset().top) + info.height + 10);
            }
          }
        }
      }
    }, this));
  };

  // Do enter in main element.
  $.Editable.prototype.enterInMainElement = function (el) {
    // Main element.
    var insertedSpan = $(el).find('break').get(0);

    // Insert in main element.
    if ($(insertedSpan).parent().get(0) == el) {
      if (!this.isLastSibling(insertedSpan)) {
        if ($(el).hasClass('f-placeholder')) {
          $(el).html('</br>' + this.markers_html + this.br);
        }
        else {
          this.insertSimpleHTML('</br>' + this.markers_html);
        }
      }
      else {
        this.insertSimpleHTML('</br>' + this.markers_html + this.br);
      }

      $(el).find('break').remove();
      this.restoreSelectionByMarkers();
    }

    // We are in another DOM element than the main element (probably a SPAN or A).
    else if ($(insertedSpan).parents(this.$element).length) {
      el = this.getSelectionElement();
      while (el.tagName == 'BREAK' || ($(el).text().length === 0 && el.parentNode != this.$element.get(0))) el = el.parentNode;

      // End. Do break and add a <br/> inside the new line.
      if (this.getSelectionTextInfo(el).atEnd) {
        $(el).after(this.breakEnd(this.getDeepParent(el), true));
        this.$element.find('break').remove();
        this.restoreSelectionByMarkers();
      }
      // Start. Add a <br/> before the last child in element.
      else if (this.getSelectionTextInfo(el).atStart) {
        while (insertedSpan.parentNode != this.$element.get(0)) insertedSpan = insertedSpan.parentNode;
        $(insertedSpan).before('<br/>');
        this.$element.find('break').remove();

        // Fix for https://github.com/froala/wysiwyg-editor/issues/395
        this.$element.find('a:empty').replaceWith(this.markers_html + '<br/>');
        this.restoreSelectionByMarkers();
      }
      // Middle. Break and add <br/>
      else {
        this.breakMiddle(this.getDeepParent(el), true);
        this.restoreSelectionByMarkers();
      }
    }

    else {
      $(insertedSpan).remove();
    }
  }

  $.Editable.prototype.enterInElement = function (el) {
    if (['TD', 'TH'].indexOf(el.tagName) < 0) {

      var enter_in_quote = false;
      if (this.emptyElement(el)) {
        if (el.parentNode && el.parentNode.tagName == 'BLOCKQUOTE') {
          $(el).before(this.$element.find('break'));
          var x = el;
          el = el.parentNode;
          $(x).remove();
          enter_in_quote = true;
        }
      }

      // Selection is at the end.
      if (this.getSelectionTextInfo(el).atEnd) {
        $(el).after(this.breakEnd(el), false);
        this.$element.find('break').remove();
        this.restoreSelectionByMarkers();
      }

      // Selection is at start.
      else if (this.getSelectionTextInfo(el).atStart) {
        if (this.options.paragraphy) {
          if (enter_in_quote) {
            $(el).before('<' + this.options.defaultTag + '>' + this.markers_html + this.br + '</' + this.options.defaultTag + '>');
            this.restoreSelectionByMarkers();
          }
          else {
            $(el).before('<' + this.options.defaultTag + '>' + this.br + '</' + this.options.defaultTag + '>');
          }
        }
        else {
          if (enter_in_quote) {
            $(el).before(this.markers_html + '<br/>');
            this.restoreSelectionByMarkers();
          }
          else {
            $(el).before('<br/>');
          }
        }
        this.$element.find('break').remove();
      }

      // Selection is in the middle.
      else {
        // PRE enter.
        if (el.tagName == 'PRE') {
          this.$element.find('break').after('<br/>' + this.markers_html);
          this.$element.find('break').remove();
          this.restoreSelectionByMarkers();
        }
        else {
          this.breakMiddle(el, false, enter_in_quote);

          this.restoreSelectionByMarkers();
        }
      }
    }
    else {
      this.enterInMainElement(el);
    }
  }

  $.Editable.prototype.breakEnd = function (parentEl, breakBefore) {
    if (breakBefore === undefined) breakBefore = false;

    if (parentEl.tagName == 'BLOCKQUOTE') {
      var contents = $(parentEl).contents();
      if (contents.length && contents[contents.length - 1].tagName == 'BR') {
        $(contents[contents.length - 1]).remove();
      }
    }

    // Find the element where to start.
    var el = $(parentEl).find('break').get(0);

    // IE 9, 10 workaround.
    var br = this.br;
    if (!this.options.paragraphy) br = '<br/>'

    // Build string.
    var str = this.markers_html + br;
    if (breakBefore) str = this.markers_html + $.Editable.INVISIBLE_SPACE;

    while (el != parentEl) {
      // Pass over A and BREAK tags.
      if (el.tagName != 'A' && el.tagName != 'BREAK') {
        str = '<' + el.tagName + this.attrs(el) + '>' + str + '</' + el.tagName + '>';
      }

      el = el.parentNode;
    }

    if (breakBefore) {
      if (el.tagName != 'A' && el.tagName != 'BREAK') {
        str = '<' + el.tagName + this.attrs(el) + '>' + str + '</' + el.tagName + '>';
      }
    }

    // Wrap with parent.
    if (this.options.paragraphy) {
      str = '<' + this.options.defaultTag + '>' + str + '</' + this.options.defaultTag + '>';
    }

    if (breakBefore) str = br + str;

    return str;
  }

  $.Editable.prototype.breakMiddle = function (parentEl, addBr, enterInQuote) {
    if (addBr === undefined) addBr = false;
    if (enterInQuote === undefined) enterInQuote = false;

    // Find element where to start.
    var el = $(parentEl).find('break').get(0);

    // Build strings separate for closed and opened tags.
    var openStr = this.markers_html;
    if (enterInQuote) openStr = '';
    var closeStr = '';
    while (el != parentEl) {
      el = el.parentNode;

      closeStr = closeStr + '</' + el.tagName + '>';
      openStr = '<' + el.tagName + this.attrs(el) + '>' + openStr;
    }

    var qt = '';
    if (enterInQuote) {
      if (this.options.paragraphy) {
        qt = '<' + this.options.defaultTag + '>' + this.markers_html + '<br/></' + this.options.defaultTag + '>';
      }
      else {
        qt = this.markers_html + '<br/>';
      }
    }

    // Create new HTML string.
    var elStr = '<' + parentEl.tagName + this.attrs(parentEl) + '>' + $(parentEl).html() + '</' + parentEl.tagName + '>';
    elStr = elStr.replace(/<break><\/break>/, closeStr + (addBr ? this.br : '') + qt + openStr);

    // Replace current tag.
    $(parentEl).replaceWith(elStr);
  }
})(jQuery);

(function ($) {
  // Check if is first in element.
  $.Editable.prototype.isFirstSibling = function (node) {
    var sibling = node.previousSibling;

    if (!sibling) return true;
    if (sibling.nodeType == 3 && sibling.textContent === '') return this.isFirstSibling(sibling);
    return false;
  }

  // Check if is last in element.
  $.Editable.prototype.isLastSibling = function (node) {
    var sibling = node.nextSibling;

    if (!sibling) return true;
    if (sibling.nodeType == 3 && sibling.textContent === '') return this.isLastSibling(sibling);
    return false;
  }

  // Get the most upper parent that is not element.
  $.Editable.prototype.getDeepParent = function (node) {
    if (node.parentNode == this.$element.get(0)) return node;
    return this.getDeepParent(node.parentNode);
  }

  // Get attributes of node.
  $.Editable.prototype.attrs = function (el) {
    var str = '';
    var atts = el.attributes;
    for (var i = 0; i < atts.length; i++) {
      var att = atts[i];
      str += ' ' + att.nodeName + '="' + att.value + '"';
    }

    return str;
  }
})(jQuery);

// jquery.event.move
//
// 1.3.6
//
// Stephen Band
//
// Triggers 'movestart', 'move' and 'moveend' events after
// mousemoves following a mousedown cross a distance threshold,
// similar to the native 'dragstart', 'drag' and 'dragend' events.
// Move events are throttled to animation frames. Move event objects
// have the properties:
//
// pageX:
// pageY:   Page coordinates of pointer.
// startX:
// startY:  Page coordinates of pointer at movestart.
// distX:
// distY:  Distance the pointer has moved since movestart.
// deltaX:
// deltaY:  Distance the finger has moved since last event.
// velocityX:
// velocityY:  Average velocity over last few events.


(function (module) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], module);
	} else {
		// Browser globals
		module(jQuery);
	}
})(function(jQuery, undefined){

	var // Number of pixels a pressed pointer travels before movestart
	    // event is fired.
	    threshold = 6,

	    add = jQuery.event.add,

	    remove = jQuery.event.remove,

	    // Just sugar, so we can have arguments in the same order as
	    // add and remove.
	    trigger = function(node, type, data) {
	    	jQuery.event.trigger(type, data, node);
	    },

	    // Shim for requestAnimationFrame, falling back to timer. See:
	    // see http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	    requestFrame = (function(){
	    	return (
	    		window.requestAnimationFrame ||
	    		window.webkitRequestAnimationFrame ||
	    		window.mozRequestAnimationFrame ||
	    		window.oRequestAnimationFrame ||
	    		window.msRequestAnimationFrame ||
	    		function(fn, element){
	    			return window.setTimeout(function(){
	    				fn();
	    			}, 25);
	    		}
	    	);
	    })(),

	    ignoreTags = {
	    	textarea: true,
	    	input: true,
	    	select: true,
	    	button: true
	    },

	    mouseevents = {
	    	move: 'mousemove',
	    	cancel: 'mouseup dragstart',
	    	end: 'mouseup'
	    },

	    touchevents = {
	    	move: 'touchmove',
	    	cancel: 'touchend',
	    	end: 'touchend'
	    };


	// Constructors

	function Timer(fn){
		var callback = fn,
		    active = false,
		    running = false;

		function trigger(time) {
			if (active){
				callback();
				requestFrame(trigger);
				running = true;
				active = false;
			}
			else {
				running = false;
			}
		}

		this.kick = function(fn) {
			active = true;
			if (!running) { trigger(); }
		};

		this.end = function(fn) {
			var cb = callback;

			if (!fn) { return; }

			// If the timer is not running, simply call the end callback.
			if (!running) {
				fn();
			}
			// If the timer is running, and has been kicked lately, then
			// queue up the current callback and the end callback, otherwise
			// just the end callback.
			else {
				callback = active ?
					function(){ cb(); fn(); } :
					fn ;

				active = true;
			}
		};
	}


	// Functions

	function returnTrue() {
		return true;
	}

	function returnFalse() {
		return false;
	}

	function preventDefault(e) {
		e.preventDefault();
	}

	function preventIgnoreTags(e) {
		// Don't prevent interaction with form elements.
		if (ignoreTags[ e.target.tagName.toLowerCase() ]) { return; }

		e.preventDefault();
	}

	function isLeftButton(e) {
		// Ignore mousedowns on any button other than the left (or primary)
		// mouse button, or when a modifier key is pressed.
		return (e.which === 1 && !e.ctrlKey && !e.altKey);
	}

	function identifiedTouch(touchList, id) {
		var i, l;

		if (touchList.identifiedTouch) {
			return touchList.identifiedTouch(id);
		}

		// touchList.identifiedTouch() does not exist in
		// webkit yet… we must do the search ourselves...

		i = -1;
		l = touchList.length;

		while (++i < l) {
			if (touchList[i].identifier === id) {
				return touchList[i];
			}
		}
	}

	function changedTouch(e, event) {
		var touch = identifiedTouch(e.changedTouches, event.identifier);

		// This isn't the touch you're looking for.
		if (!touch) { return; }

		// Chrome Android (at least) includes touches that have not
		// changed in e.changedTouches. That's a bit annoying. Check
		// that this touch has changed.
		if (touch.pageX === event.pageX && touch.pageY === event.pageY) { return; }

		return touch;
	}


	// Handlers that decide when the first movestart is triggered

	function mousedown(e){
		var data;

		if (!isLeftButton(e)) { return; }

		data = {
			target: e.target,
			startX: e.pageX,
			startY: e.pageY,
			timeStamp: e.timeStamp
		};

		add(document, mouseevents.move, mousemove, data);
		add(document, mouseevents.cancel, mouseend, data);
	}

	function mousemove(e){
		var data = e.data;

		checkThreshold(e, data, e, removeMouse);
	}

	function mouseend(e) {
		removeMouse();
	}

	function removeMouse() {
		remove(document, mouseevents.move, mousemove);
		remove(document, mouseevents.cancel, mouseend);
	}

	function touchstart(e) {
		var touch, template;

		// Don't get in the way of interaction with form elements.
		if (ignoreTags[ e.target.tagName.toLowerCase() ]) { return; }

		touch = e.changedTouches[0];

		// iOS live updates the touch objects whereas Android gives us copies.
		// That means we can't trust the touchstart object to stay the same,
		// so we must copy the data. This object acts as a template for
		// movestart, move and moveend event objects.
		template = {
			target: touch.target,
			startX: touch.pageX,
			startY: touch.pageY,
			timeStamp: e.timeStamp,
			identifier: touch.identifier
		};

		// Use the touch identifier as a namespace, so that we can later
		// remove handlers pertaining only to this touch.
		add(document, touchevents.move + '.' + touch.identifier, touchmove, template);
		add(document, touchevents.cancel + '.' + touch.identifier, touchend, template);
	}

	function touchmove(e){
		var data = e.data,
		    touch = changedTouch(e, data);

		if (!touch) { return; }

		checkThreshold(e, data, touch, removeTouch);
	}

	function touchend(e) {
		var template = e.data,
		    touch = identifiedTouch(e.changedTouches, template.identifier);

		if (!touch) { return; }

		removeTouch(template.identifier);
	}

	function removeTouch(identifier) {
		remove(document, '.' + identifier, touchmove);
		remove(document, '.' + identifier, touchend);
	}


	// Logic for deciding when to trigger a movestart.

	function checkThreshold(e, template, touch, fn) {
		var distX = touch.pageX - template.startX,
		    distY = touch.pageY - template.startY;

		// Do nothing if the threshold has not been crossed.
		if ((distX * distX) + (distY * distY) < (threshold * threshold)) { return; }

		triggerStart(e, template, touch, distX, distY, fn);
	}

	function handled() {
		// this._handled should return false once, and after return true.
		this._handled = returnTrue;
		return false;
	}

	function flagAsHandled(e) {
    try {
      e._handled();
    }
    catch(ex) {
      return false;
    }
	}

	function triggerStart(e, template, touch, distX, distY, fn) {
		var node = template.target,
		    touches, time;

		touches = e.targetTouches;
		time = e.timeStamp - template.timeStamp;

		// Create a movestart object with some special properties that
		// are passed only to the movestart handlers.
		template.type = 'movestart';
		template.distX = distX;
		template.distY = distY;
		template.deltaX = distX;
		template.deltaY = distY;
		template.pageX = touch.pageX;
		template.pageY = touch.pageY;
		template.velocityX = distX / time;
		template.velocityY = distY / time;
		template.targetTouches = touches;
		template.finger = touches ?
			touches.length :
			1 ;

		// The _handled method is fired to tell the default movestart
		// handler that one of the move events is bound.
		template._handled = handled;

		// Pass the touchmove event so it can be prevented if or when
		// movestart is handled.
		template._preventTouchmoveDefault = function() {
			e.preventDefault();
		};

		// Trigger the movestart event.
		trigger(template.target, template);

		// Unbind handlers that tracked the touch or mouse up till now.
		fn(template.identifier);
	}


	// Handlers that control what happens following a movestart

	function activeMousemove(e) {
		var timer = e.data.timer;

		e.data.touch = e;
		e.data.timeStamp = e.timeStamp;
		timer.kick();
	}

	function activeMouseend(e) {
		var event = e.data.event,
		    timer = e.data.timer;

		removeActiveMouse();

		endEvent(event, timer, function() {
			// Unbind the click suppressor, waiting until after mouseup
			// has been handled.
			setTimeout(function(){
				remove(event.target, 'click', returnFalse);
			}, 0);
		});
	}

	function removeActiveMouse(event) {
		remove(document, mouseevents.move, activeMousemove);
		remove(document, mouseevents.end, activeMouseend);
	}

	function activeTouchmove(e) {
		var event = e.data.event,
		    timer = e.data.timer,
		    touch = changedTouch(e, event);

		if (!touch) { return; }

		// Stop the interface from gesturing
		e.preventDefault();

		event.targetTouches = e.targetTouches;
		e.data.touch = touch;
		e.data.timeStamp = e.timeStamp;
		timer.kick();
	}

	function activeTouchend(e) {
		var event = e.data.event,
		    timer = e.data.timer,
		    touch = identifiedTouch(e.changedTouches, event.identifier);

		// This isn't the touch you're looking for.
		if (!touch) { return; }

		removeActiveTouch(event);
		endEvent(event, timer);
	}

	function removeActiveTouch(event) {
		remove(document, '.' + event.identifier, activeTouchmove);
		remove(document, '.' + event.identifier, activeTouchend);
	}


	// Logic for triggering move and moveend events

	function updateEvent(event, touch, timeStamp, timer) {
		var time = timeStamp - event.timeStamp;

		event.type = 'move';
		event.distX =  touch.pageX - event.startX;
		event.distY =  touch.pageY - event.startY;
		event.deltaX = touch.pageX - event.pageX;
		event.deltaY = touch.pageY - event.pageY;

		// Average the velocity of the last few events using a decay
		// curve to even out spurious jumps in values.
		event.velocityX = 0.3 * event.velocityX + 0.7 * event.deltaX / time;
		event.velocityY = 0.3 * event.velocityY + 0.7 * event.deltaY / time;
		event.pageX =  touch.pageX;
		event.pageY =  touch.pageY;
	}

	function endEvent(event, timer, fn) {
		timer.end(function(){
			event.type = 'moveend';

			trigger(event.target, event);

			return fn && fn();
		});
	}


	// jQuery special event definition

	function setup(data, namespaces, eventHandle) {
		// Stop the node from being dragged
		//add(this, 'dragstart.move drag.move', preventDefault);

		// Prevent text selection and touch interface scrolling
		//add(this, 'mousedown.move', preventIgnoreTags);

		// Tell movestart default handler that we've handled this
		add(this, 'movestart.move', flagAsHandled);

		// Don't bind to the DOM. For speed.
		return true;
	}

	function teardown(namespaces) {
		remove(this, 'dragstart drag', preventDefault);
		remove(this, 'mousedown touchstart', preventIgnoreTags);
		remove(this, 'movestart', flagAsHandled);

		// Don't bind to the DOM. For speed.
		return true;
	}

	function addMethod(handleObj) {
		// We're not interested in preventing defaults for handlers that
		// come from internal move or moveend bindings
		if (handleObj.namespace === "move" || handleObj.namespace === "moveend") {
			return;
		}

		// Stop the node from being dragged
		add(this, 'dragstart.' + handleObj.guid + ' drag.' + handleObj.guid, preventDefault, undefined, handleObj.selector);

		// Prevent text selection and touch interface scrolling
		add(this, 'mousedown.' + handleObj.guid, preventIgnoreTags, undefined, handleObj.selector);
	}

	function removeMethod(handleObj) {
		if (handleObj.namespace === "move" || handleObj.namespace === "moveend") {
			return;
		}

		remove(this, 'dragstart.' + handleObj.guid + ' drag.' + handleObj.guid);
		remove(this, 'mousedown.' + handleObj.guid);
	}

	jQuery.event.special.movestart = {
		setup: setup,
		teardown: teardown,
		add: addMethod,
		remove: removeMethod,

		_default: function(e) {
			var event, data;

			// If no move events were bound to any ancestors of this
			// target, high tail it out of here.
			if (!e._handled()) { return; }

			function update(time) {
				updateEvent(event, data.touch, data.timeStamp);
				trigger(e.target, event);
			}

			event = {
				target: e.target,
				startX: e.startX,
				startY: e.startY,
				pageX: e.pageX,
				pageY: e.pageY,
				distX: e.distX,
				distY: e.distY,
				deltaX: e.deltaX,
				deltaY: e.deltaY,
				velocityX: e.velocityX,
				velocityY: e.velocityY,
				timeStamp: e.timeStamp,
				identifier: e.identifier,
				targetTouches: e.targetTouches,
				finger: e.finger
			};

			data = {
				event: event,
				timer: new Timer(update),
				touch: undefined,
				timeStamp: undefined
			};

			if (e.identifier === undefined) {
				// We're dealing with a mouse
				// Stop clicks from propagating during a move
				add(e.target, 'click', returnFalse);
				add(document, mouseevents.move, activeMousemove, data);
				add(document, mouseevents.end, activeMouseend, data);
			}
			else {
				// We're dealing with a touch. Stop touchmove doing
				// anything defaulty.
				e._preventTouchmoveDefault();
				add(document, touchevents.move + '.' + e.identifier, activeTouchmove, data);
				add(document, touchevents.end + '.' + e.identifier, activeTouchend, data);
			}
		}
	};

	jQuery.event.special.move = {
		setup: function() {
			// Bind a noop to movestart. Why? It's the movestart
			// setup that decides whether other move events are fired.
			add(this, 'movestart.move', jQuery.noop);
		},

		teardown: function() {
			remove(this, 'movestart.move', jQuery.noop);
		}
	};

	jQuery.event.special.moveend = {
		setup: function() {
			// Bind a noop to movestart. Why? It's the movestart
			// setup that decides whether other move events are fired.
			add(this, 'movestart.moveend', jQuery.noop);
		},

		teardown: function() {
			remove(this, 'movestart.moveend', jQuery.noop);
		}
	};

	add(document, 'mousedown.move', mousedown);
	add(document, 'touchstart.move', touchstart);

	// Make jQuery copy touch event properties over to the jQuery event
	// object, if they are not already listed. But only do the ones we
	// really need. IE7/8 do not have Array#indexOf(), but nor do they
	// have touch events, so let's assume we can ignore them.
	if (typeof Array.prototype.indexOf === 'function') {
		(function(jQuery, undefined){
			var props = ["changedTouches", "targetTouches"],
			    l = props.length;

			while (l--) {
				if (jQuery.event.props.indexOf(props[l]) === -1) {
					jQuery.event.props.push(props[l]);
				}
			}
		})(jQuery);
	};
});

/* WYSIWYGModernizr 2.7.1 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-touch-mq-teststyles-prefixes
 */
;



window.WYSIWYGModernizr = (function( window, document, undefined ) {

    var version = '2.7.1',

    WYSIWYGModernizr = {},


    docElement = document.documentElement,

    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    inputElem  ,


    toString = {}.toString,

    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),



    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName,


    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node, docOverflow,
          div = document.createElement('div'),
                body = document.body,
                fakeBody = body || document.createElement('body');

      if ( parseInt(nodes, 10) ) {
                      while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

                style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
      div.id = mod;
          (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if ( !body ) {
                fakeBody.style.background = '';
                fakeBody.style.overflow = 'hidden';
          docOverflow = docElement.style.overflow;
          docElement.style.overflow = 'hidden';
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
        if ( !body ) {
          fakeBody.parentNode.removeChild(fakeBody);
          docElement.style.overflow = docOverflow;
      } else {
          div.parentNode.removeChild(div);
      }

      return !!ret;

    },

    testMediaQuery = function( mq ) {

      var matchMedia = window.matchMedia || window.msMatchMedia;
      if ( matchMedia ) {
        return matchMedia(mq).matches;
      }

      var bool;

      injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function( node ) {
        bool = (window.getComputedStyle ?
                  getComputedStyle(node, null) :
                  node.currentStyle)['position'] == 'absolute';
      });

      return bool;

     },
    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProp = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function (object, property) {
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }


    if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

        var target = this;

        if (typeof target != "function") {
            throw new TypeError();
        }

        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F();

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };

        return bound;
      };
    }

    function setCss( str ) {
        mStyle.cssText = str;
    }

    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    function is( obj, type ) {
        return typeof obj === type;
    }

    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }


    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                            if (elem === false) return props[i];

                            if (is(item, 'function')){
                                return item.bind(elem || obj);
                }

                            return item;
            }
        }
        return false;
    }
    tests['touch'] = function() {
        var bool;

        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
          bool = true;
        } else {
          injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {
            bool = node.offsetTop === 9;
          });
        }

        return bool;
    };
    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
                                    featureName  = feature.toLowerCase();
            WYSIWYGModernizr[featureName] = tests[feature]();

            classes.push((WYSIWYGModernizr[featureName] ? '' : 'no-') + featureName);
        }
    }



     WYSIWYGModernizr.addTest = function ( feature, test ) {
       if ( typeof feature == 'object' ) {
         for ( var key in feature ) {
           if ( hasOwnProp( feature, key ) ) {
             WYSIWYGModernizr.addTest( key, feature[ key ] );
           }
         }
       } else {

         feature = feature.toLowerCase();

         if ( WYSIWYGModernizr[feature] !== undefined ) {
                                              return WYSIWYGModernizr;
         }

         test = typeof test == 'function' ? test() : test;

         if (typeof enableClasses !== "undefined" && enableClasses) {
           docElement.className += ' ' + (test ? '' : 'no-') + feature;
         }
         WYSIWYGModernizr[feature] = test;

       }

       return WYSIWYGModernizr;
     };


    setCss('');
    modElem = inputElem = null;


    WYSIWYGModernizr._version      = version;

    WYSIWYGModernizr._prefixes     = prefixes;

    WYSIWYGModernizr.mq            = testMediaQuery;
    WYSIWYGModernizr.testStyles    = injectElementWithStyles;
    return WYSIWYGModernizr;

})(this, this.document);
;
/*!
 * froala_editor v1.2.7 (https://www.froala.com/wysiwyg-editor)
 * License https://www.froala.com/wysiwyg-editor/terms
 * Copyright 2014-2015 Froala Labs
 */
!function(a){a.Editable.prototype.coreInit=function(){var a=this,b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",c=function(a){for(var b=a.toString(),c=0,d=0;d<b.length;d++)c+=parseInt(b.charAt(d),10);return c>10?c%9+1:c};if(a.options.key!==!1){var d=function(a,b,c){for(var d=Math.abs(c);d-->0;)a-=b;return 0>c&&(a+=123),a},e=function(a){return a},f=function(a){if(!a)return a;for(var f="",g=e("charCodeAt"),h=e("fromCharCode"),i=b.indexOf(a[0]),j=1;j<a.length-2;j++){for(var k=c(++i),l=a[g](j),m="";/[0-9-]/.test(a[j+1]);)m+=a[++j];m=parseInt(m,10)||0,l=d(l,k,m),l^=i-1&31,f+=String[h](l)}return f},g=e(f),h=function(a){return"none"==a.css("display")?(a.attr("style",a.attr("style")+g("zD4D2qJ-7dhuB-11bB4E1wqlhlfE4gjhkbB6C5eg1C-8h1besB-16e1==")),!0):!1},i=function(){for(var a=0,b=document.domain,c=b.split("."),d="_gd"+(new Date).getTime();a<c.length-1&&-1==document.cookie.indexOf(d+"="+d);)b=c.slice(-1-++a).join("."),document.cookie=d+"="+d+";domain="+b+";";return document.cookie=d+"=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain="+b+";",b}(),j=function(){var b=g(a.options.key)||"";return b!==g("eQZMe1NJGC1HTMVANU==")&&b.indexOf(i,b.length-i.length)<0&&[g("9qqG-7amjlwq=="),g("KA3B3C2A6D1D5H5H1A3==")].indexOf(i)<0?(a.$box.append(g("uA5kygD3g1h1lzrA7E2jtotjvooB2A5eguhdC-22C-16nC2B3lh1deA-21C-16B4A2B4gi1F4D1wyA-13jA4H5C2rA-65A1C10dhzmoyJ2A10A-21d1B-13xvC2I4enC4C2B5B4G4G4H1H4A10aA8jqacD1C3c1B-16D-13A-13B2E5A4jtxfB-13fA1pewxvzA3E-11qrB4E4qwB-16icA1B3ykohde1hF4A2E4clA4C7E6haA4D1xtmolf1F-10A1H4lhkagoD5naalB-22B8B4quvB-8pjvouxB3A-9plnpA2B6D6BD2D1C2H1C3C3A4mf1G-10C-8i1G3C5B3pqB-9E5B1oyejA3ddalvdrnggE3C3bbj1jC6B3D3gugqrlD8B2DB-9qC-7qkA10D2VjiodmgynhA4HA-9D-8pI-7rD4PrE-11lvhE3B5A-16C7A6A3ekuD1==")),a.$lb=a.$box.find("> div:last"),a.$ab=a.$lb.find("> a"),h(a.$lb)||h(a.$ab)):void 0};j()}},a.Editable.initializers.push(a.Editable.prototype.coreInit)}(jQuery);
(function ($) {

  $.Editable.DEFAULTS = $.extend($.Editable.DEFAULTS, {
    allowedBlankTags: ['TEXTAREA'],
    selfClosingTags: ['br', 'input', 'img', 'hr', 'param', '!--', 'source', 'embed', '!', 'meta', 'link', 'base'],
    doNotJoinTags: ['a'],
    iconClasses: ['fa-']
  })

  $.Editable.prototype.isClosingTag = function (tag) {
    if (!tag) return false;

    // Detect closing tag.
    return tag.match(/^<\/([a-zA-Z0-9]+)([^<]+)*>$/gi) !== null;
  }

  $.Editable.prototype.tagName = function (tag) {
    return tag.replace(/^<\/?([a-zA-Z0-9-!]+)([^>]+)*>$/gi, '$1').toLowerCase();
  }

  $.Editable.SELF_CLOSING_AFTER = ['source'];

  $.Editable.prototype.isSelfClosingTag = function (tag) {
    var tag_name = this.tagName(tag);

    return this.options.selfClosingTags.indexOf(tag_name.toLowerCase()) >= 0;
  }

  $.Editable.prototype.tagKey = function (tag) {
    return tag.type + (tag.attrs || []).sort().join('|');
  }

  $.Editable.prototype.extendedKey = function (tag) {
    return this.tagKey(tag) + JSON.stringify(tag.style);
  }

  $.Editable.prototype.mapDOM = function (mainNode) {
    var nodesMap = [];
    var openedNodes = {};
    var closedNodes = {};
    var index = 0;
    var that = this;

    $(mainNode).find('.f-marker').html($.Editable.INVISIBLE_SPACE);

    var buildNode = function (originalNode, sp) {
      if (originalNode.nodeType === 3) return [];
      if (originalNode.nodeType === 8) {
        return [{
          comment: true,
          attrs: {},
          styles: {},
          idx: index++,
          sp: sp,
          ep: sp,
          text: originalNode.textContent
        }]
      }

      var tagName = originalNode.tagName;

      // Convert to HTML5.
      if (tagName == 'B') tagName = 'STRONG';
      if (tagName == 'I' && (!originalNode.className || originalNode.className.match(new RegExp(that.options.iconClasses.join('|'), 'gi')) == null)) tagName = 'EM';

      // Remove display inline
      originalNode.style.display = '';

      var attrs = {};
      var styles = {};
      var style = null;

      if (originalNode.attributes) {
        for (var i = 0; i < originalNode.attributes.length; i++) {
          var att = originalNode.attributes[i];

          if (att.nodeName == 'style') {
            style = att.value;
          }
          else {
            attrs[att.nodeName] = att.value;
          }
        }
      }

      if (style) {
        var matches = style.match(/([^:]*):([^:;]*(;|$))/gi);
        if (matches) {
          for (var l = 0; l < matches.length; l++) {
            var parts = matches[l].split(':');
            var val = parts.slice(1).join(':').trim();

            if (val[val.length - 1] == ';') {
              val = val.substr(0, val.length - 1);
            }

            styles[parts[0].trim()] = val;
          }
        }
      }

      var nodes = [];

      if ($.isEmptyObject(attrs) && originalNode.tagName == 'SPAN' && !$.isEmptyObject(styles)) {
        for (var p in styles) {
          var c_style = {}
          c_style[p] = styles[p];
          nodes.push({
            selfClosing: false,
            attrs: attrs,
            styles: c_style,
            idx: index++,
            sp: sp,
            ep: sp + originalNode.textContent.length,
            tagName: tagName,
            noJoin: (originalNode.nextSibling && originalNode.nextSibling.tagName === 'BR')
          })
        }

        return nodes;
      }

      return [{
        selfClosing: that.options.selfClosingTags.indexOf(tagName.toLowerCase()) >= 0,
        attrs: attrs,
        styles: styles,
        idx: index++,
        sp: sp,
        ep: sp + originalNode.textContent.length,
        tagName: tagName,
        noJoin: (originalNode.nextSibling && originalNode.nextSibling.tagName === 'BR')
      }]
    }

    var mapNodes = function (originalNode, sp) {
      var i;
      var nodes;
      var node;
      if (originalNode != mainNode) {
        // Get nodes for current node.
        nodes = buildNode(originalNode, sp);

        // Go through all the nodes.
        for (i = 0; i < nodes.length; i++) {
          node = nodes[i];

          // Add node in nodes map.
          nodesMap.push(node);

          // Initialize open nodes and closed nodes.
          if (!openedNodes[node.sp]) openedNodes[node.sp] = {};
          if (!closedNodes[node.ep]) closedNodes[node.ep] = {};

          // Initialize open nodes and closed nodes for current tag name.
          if (!openedNodes[node.sp][node.tagName]) openedNodes[node.sp][node.tagName] = [];
          if (!closedNodes[node.ep][node.tagName]) closedNodes[node.ep][node.tagName] = [];

          // Add current node in open nodes and closed nodes.
          openedNodes[node.sp][node.tagName].push(node);
          closedNodes[node.ep][node.tagName].push(node);
        }
      }

      // Get childrens of the node.
      var children = originalNode.childNodes;
      if (children) {
        // Map all childrens.
        for (i = 0; i < children.length; i++) {
          if (i > 0 && children[i - 1].nodeType != 8) sp += children[i - 1].textContent.length;
          mapNodes(children[i], sp);
        }

        // If we have nodes inside the initial node.
        if (nodes) {
          // Loop through them.
          for (i = 0; i < nodes.length; i++) {
            node = nodes[i];

            // Set closing index.
            node.ci = index++;

            // Initialize open nodes for end position.
            if (!openedNodes[node.ep]) openedNodes[node.ep] = {};

            // Initialze open nodes at end position for current tag name.
            if (!openedNodes[node.ep][node.tagName]) openedNodes[node.ep][node.tagName] = [];

            // Put a shadow.
            openedNodes[node.ep][node.tagName].push({
              shadow: true,
              ci: index - 1
            })
          }
        }
      }
    }

    var normalizeNodes = function () {
      var i;
      var node;
      var k;
      var extendedNode;

      // Look in all open nodes.
      for (i in openedNodes) {
        // Get each node type from open nodes.
        for (var tagName in openedNodes[i]) {
          // Loop through all open nodes at this position.
          for (k = 0; k < openedNodes[i][tagName].length; k++) {
            // Current node.
            node = openedNodes[i][tagName][k];

            // Go forward if the node is selfClosing, dirty, shadow or comment.
            if (node.selfClosing) continue;
            if (node.dirty) continue;
            if (node.shadow) continue;
            if (node.comment) continue;
            if (node.noJoin) continue;

            // Look through the rest of the opened nodes at the current position and same node type.
            for (var j = k + 1; j < openedNodes[i][tagName].length; j++) {
              // Get the extended node.
              extendedNode = openedNodes[i][tagName][j];

              // Go forward if node is selfClosing, dirty, shadow or comment.
              if (extendedNode.selfClosing) continue;
              if (extendedNode.dirty) continue;
              if (extendedNode.shadow) continue;
              if (extendedNode.comment) continue;
              if (extendedNode.noJoin) continue;

              // If both nodes have only one style property and extendedNode is not being closed at the same position.
              if (Object.keys(node.styles).length == 1 && Object.keys(extendedNode.styles).length == 1 && extendedNode.sp != extendedNode.ep) {
                // Get the property.
                var prop = Object.keys(node.styles)[0];

                // Check if extended node has the same prop as the starting node.
                if (extendedNode.styles[prop]) {
                  // Start current node only after the extended node.
                  node.sp = extendedNode.ep;

                  // Look where is the extended node being closed.
                  for (var t = 0; t < openedNodes[node.sp][node.tagName].length; t++) {

                    // Possible node.
                    var nd = openedNodes[node.sp][node.tagName][t];

                    // Check if node is shadow and has the same closing index.
                    if (nd.shadow && nd.ci == extendedNode.ci) {

                      // Add the node where extended node is closing.
                      openedNodes[node.sp][node.tagName].splice(t, 0, node);
                      break;
                    }
                  }

                  // Remove node from its current position.
                  openedNodes[i][tagName].splice(k, 1);

                  k--;
                  break;
                }
              }
            }
          }
        }
      }

      // Join same nodes one after another.
      for (i = 0; i < nodesMap.length; i++) {
        node = nodesMap[i];
        if (node.dirty) continue;
        if (node.selfClosing) continue;
        if (node.comment) continue;
        if (node.noJoin) continue;
        if (node.shadow) continue;

        // Do not check nodes that should not be joined.
        if (that.options.doNotJoinTags.indexOf(node.tagName.toLowerCase()) >= 0) {
          continue;
        }

        // Skip node if it has attrs.
        if (!$.isEmptyObject(node.attrs)) continue;

        // Starting at the same position and not in allowedBlankTags.
        if (node.sp == node.ep && $.isEmptyObject(node.attrs) && $.isEmptyObject(node.styles) && that.options.allowedBlankTags.indexOf(node.tagName) < 0) {
          node.dirty = true;
          continue;
        }

        // Check if there are open nodes of the node that start at the ending position of the current node.
        if (openedNodes[node.ep] && openedNodes[node.ep][node.tagName]) {
          // Loop through possible nodes.
          for (k = 0; k < openedNodes[node.ep][node.tagName].length; k++) {
            // Extended node.
            extendedNode = openedNodes[node.ep][node.tagName][k];
            if (node == extendedNode) continue;
            if (extendedNode.dirty) continue;
            if (extendedNode.selfClosing) continue;
            if (extendedNode.shadow) continue;
            if (extendedNode.comment) continue;
            if (extendedNode.noJoin) continue;

            // If the extended node has no attrs.
            if ($.isEmptyObject(extendedNode.attrs)) {
              // Both nodes have the same style.
              if (JSON.stringify(extendedNode.styles) == JSON.stringify(node.styles)) {
                if (node.ep < extendedNode.ep) {
                  node.ep = extendedNode.ep;
                }
                if (node.sp > extendedNode.sp) {
                  node.sp = extendedNode.sp;
                }
                extendedNode.dirty = true;
                i--;
                break;
              }
            }
          }
        }
      }

      // Merge style.
      for (i = 0; i < nodesMap.length; i++) {
        node = nodesMap[i];
        if (node.dirty) continue;
        if (node.selfClosing) continue;
        if (node.comment) continue;
        if (node.noJoin) continue;
        if (node.shadow) continue;

        // Skip node if it has attrs.
        if (!$.isEmptyObject(node.attrs)) continue;

        if (node.sp == node.ep && $.isEmptyObject(node.attrs) && $.isEmptyObject(node.style) && that.options.allowedBlankTags.indexOf(node.tagName) < 0) {
          node.dirty = true;
          continue;
        }

        if (openedNodes[node.sp] && openedNodes[node.sp][node.tagName]) {
          for (k = openedNodes[node.sp][node.tagName].length - 1; k >= 0; k--) {
            extendedNode = openedNodes[node.sp][node.tagName][k];
            if (node == extendedNode) continue;
            if (extendedNode.dirty) continue;
            if (extendedNode.selfClosing) continue;
            if (extendedNode.shadow) continue;
            if (extendedNode.comment) continue;
            if (extendedNode.noJoin) continue;

            if (node.ep == extendedNode.ep) {
              if ($.isEmptyObject(extendedNode.attrs)) {
                node.styles = $.extend(node.styles, extendedNode.styles);
                extendedNode.dirty = true;
              }
            }
          }
        }
      }
    }

    mapNodes(mainNode, 0);

    normalizeNodes();

    for (var i = nodesMap.length - 1; i >= 0; i--) {
      if (nodesMap.dirty) nodesMap.splice(i, 1);
    }

    return nodesMap;
  };

  // Sort nodes.
  $.Editable.prototype.sortNodes = function (node_a, node_b) {
    if (node_a.comment) return 1;
    if (node_a.selfClosing || node_b.selfClosing) return node_a.idx - node_b.idx;

    var diff_a = node_a.ep - node_a.sp;
    var diff_b = node_b.ep - node_b.sp;

    if (diff_a === 0 && diff_b === 0) {
      return node_a.idx - node_b.idx;
    }

    if (diff_a === diff_b) return node_b.ci - node_a.ci;
    return diff_b - diff_a;
  };

  // Build open tag.
  $.Editable.prototype.openTag = function (node) {
    var i;
    var html = '<' + node.tagName.toLowerCase();

    var attrs = Object.keys(node.attrs).sort();
    for (i = 0; i < attrs.length; i++) {
      var attrName = attrs[i];
      html += ' ' + attrName + '="' + node.attrs[attrName] + '"';
    }

    var style = '';
    var props = Object.keys(node.styles).sort();
    for (i = 0; i < props.length; i++) {
      var prop = props[i];
      if (node.styles[prop] != null) {
        style += prop.replace('_', '-') + ': ' + node.styles[prop] + '; ';
      }
    }

    if (style !== '') {
      html += ' style="' + style.trim() + '"';
    }

    html += '>';

    return html;
  }

  // Build open tag.
  $.Editable.prototype.commentTag = function (node) {
    var html = '';
    if (node.selfClosing) {
      var i;
      html = '<' + node.tagName.toLowerCase();

      var attrs = Object.keys(node.attrs).sort();
      for (i = 0; i < attrs.length; i++) {
        var attrName = attrs[i];
        html += ' ' + attrName + '="' + node.attrs[attrName] + '"';
      }

      var style = '';
      var props = Object.keys(node.styles).sort();
      for (i = 0; i < props.length; i++) {
        var prop = props[i];
        if (node.styles[prop] != null) {
          style += prop.replace('_', '-') + ': ' + node.styles[prop] + '; ';
        }
      }

      if (style !== '') {
        html += ' style="' + style.trim() + '"';
      }

      html += '/>';
    }
    else if (node.comment) {
      html = '<!--' + node.text + '-->';
    }

    return html;
  }

  $.Editable.prototype.closeTag = function (node) {
    return '</' + node.tagName.toLowerCase() + '>';
  }

  $.Editable.prototype.nodesOpenedAt = function (nodesMap, i) {
    var nodes = [];
    var len = nodesMap.length - 1;
    while (len >= 0 && nodesMap[len].sp == i) {
      nodes.push(nodesMap.pop());
      len--;
    }

    return nodes;
  }

  $.Editable.prototype.entity = function (ch) {
    ch_map = {
      '>': '&gt;',
      '<': '&lt;',
      '&': '&amp;'
    }

    if (ch_map[ch]) return ch_map[ch];
    return ch;
  }

  $.Editable.prototype.removeInvisibleWhitespace = function (el) {
    for (var i = 0; i < el.childNodes.length; i++) {
      var node = el.childNodes[i];

      if (node.childNodes.length) {
        this.removeInvisibleWhitespace(node);
      }
      else {
        node.textContent = node.textContent.replace(/\u200B/gi, '');
      }
    }
  }

  // Clean.
  $.Editable.prototype.cleanOutput = function (elem, remove_whitespace) {
    var i;
    var k;
    var p;
    var tag;

    if (remove_whitespace) this.removeInvisibleWhitespace(elem);

    // Get initial mapping.
    var nodesMap =  this.mapDOM(elem, remove_whitespace).sort(function (a, b) {
      return b.sp - a.sp;
    });

    // Text.
    var froala_text =  elem.textContent;

    html = '';

    // Those tags that are empty.
    var simple_nodes = [];
    var tagNo = -1;
    var addSimpleNodes = $.proxy(function () {
      var str = '';

      simple_nodes_to_close = [];
      // Sort nodes by starting index to preserve order.
      simple_nodes = simple_nodes.sort(function (a, b) { return a.idx - b.idx }).reverse();

      while (simple_nodes.length) {
        var node = simple_nodes.pop();

        // Close nodes that should be closed so far.
        while (simple_nodes_to_close.length && simple_nodes_to_close[simple_nodes_to_close.length - 1].ci < node.ci) {
          str += this.closeTag(simple_nodes_to_close.pop())
        }

        if (node.selfClosing || node.comment) {
          str += this.commentTag(node);
        }
        else if (!$.isEmptyObject(node.attrs) || this.options.allowedBlankTags.indexOf(node.tagName) >= 0) {
          str += this.openTag(node);
          simple_nodes_to_close.push(node);
        }
      }

      // Close remaining nodes.
      while (simple_nodes_to_close.length) {
        str += this.closeTag(simple_nodes_to_close.pop())
      }

      html += str;
    }, this);

    var close_at = {};
    var opened_nodes = [];

    for (i = 0; i <= froala_text.length; i++) {
      // Close tags first.
      if (close_at[i]) {
        for (k = close_at[i].length - 1; k >= 0; k--) {
          // Last opened tag is the same with the open we want to close.
          if (opened_nodes.length && opened_nodes[opened_nodes.length - 1].tagName == close_at[i][k].tagName && JSON.stringify(opened_nodes[opened_nodes.length - 1].styles) == JSON.stringify(close_at[i][k].styles)) {
            html += this.closeTag(close_at[i][k]);
            opened_nodes.pop();
          }

          // Close all tags until the one we expect to close and then open them again.
          else {
            var to_open_again = [];

            // Close tags that are opened.
            while (opened_nodes.length && (opened_nodes[opened_nodes.length - 1].tagName !== close_at[i][k].tagName || JSON.stringify(opened_nodes[opened_nodes.length - 1].styles) !== JSON.stringify(close_at[i][k].styles))) {
              tag = opened_nodes.pop();
              html += this.closeTag(tag);
              to_open_again.push(tag);
            }

            // Add the close tag.
            html += this.closeTag(close_at[i][k]);
            opened_nodes.pop();

            // Open tags again.
            while (to_open_again.length) {
              var o_tag = to_open_again.pop();
              html += this.openTag(o_tag);
              opened_nodes.push(o_tag);
            }
          }
        }
      }

      var openNodes = this.nodesOpenedAt(nodesMap, i).sort(this.sortNodes).reverse();

      // Open tags.
      while (openNodes.length) {
        // Get node.
        var node = openNodes.pop();

        // SKIP. Dirty node.
        if (node.dirty) continue;

        // Check if is selfclosing.
        if (node.selfClosing || node.comment) {
          // Check if we should add simple tags to HTML that we'll build based on original position.
          if (node.ci > tagNo || node.tagName == 'BR') {
            addSimpleNodes();
            html += this.commentTag(node);
            tagNo = node.ci;
          }

          // Store in simple tags only if there are other tags there.
          else if (simple_nodes.length) {
            simple_nodes.push(node);
            if (tagNo < node.ci) tagNo = node.ci;
          }

          else {
            html += this.commentTag(node);
            if (tagNo < node.ci) tagNo = node.ci;
          }
        }
        else {
          // Has text inside.
          if (node.ep > node.sp) {
            if (node.ci > tagNo) addSimpleNodes();

            // Close tags that that should close inside A. We'll open them again at the bottom.
            var close_inside_a = [];
            if (node.tagName == 'A') {
              for (var ai = node.sp + 1; ai < node.ep; ai++) {
                if (close_at[ai] && close_at[ai].length) {
                  for (p = 0; p < close_at[ai].length; p++) {
                    close_inside_a.push(close_at[ai][p]);
                    html += this.closeTag(close_at[ai][p]);
                    opened_nodes.pop();
                  }
                }
              }
            }

            // Transparent BG.
            var close_inside_t = [];
            if (node.tagName == 'SPAN' && (node.styles['background-color'] == '#123456' || $.Editable.RGBToHex(node.styles['background-color']) === '#123456' || node.styles.color == '#123456' || $.Editable.RGBToHex(node.styles.color) === '#123456')) {
              while (opened_nodes.length) {
                var nd = opened_nodes.pop();
                html += this.closeTag(nd);
                close_inside_t.push(nd);
              }
            }

            html += this.openTag(node);
            if (tagNo < node.ci) tagNo = node.ci;

            // Keep track of open nodes.
            opened_nodes.push(node);

            // Add close info.
            if (!close_at[node.ep]) close_at[node.ep] = [];
            close_at[node.ep].push(node);

            // Open tags that we closed because of A tag.
            while (close_inside_a.length) {
              node = close_inside_a.pop()
              html += this.openTag(node);
              opened_nodes.push(node);
            }

            // Open tags that we closed because of A tag.
            while (close_inside_t.length) {
              node = close_inside_t.pop()
              html += this.openTag(node);
              opened_nodes.push(node);
            }
          }
          else if (node.sp == node.ep) {
            simple_nodes.push(node);
            if (tagNo < node.ci) tagNo = node.ci;
          }
        }
      }

      // Index is increasing. We should add the simple tags that are left.
      addSimpleNodes();

      if (i != froala_text.length) html += this.entity(froala_text[i]);
    }

    // Remove whitespace from markers.
    html = html.replace(/(<span[^>]*? class\s*=\s*["']?f-marker["']?[^>]+>)\u200B(<\/span>)/gi, '$1$2');

    return html;
  };

  $.Editable.prototype.wrapDirectContent = function () {
    var valid_nodes = $.merge(['UL', 'OL', 'TABLE'], this.valid_nodes);

    if (!this.options.paragraphy) {
      var $wr = null;
      var contents = this.$element.contents();
      for (var i = 0; i < contents.length; i++) {
        if (contents[i].nodeType != 1 || valid_nodes.indexOf(contents[i].tagName) < 0) {
          if (!$wr) {
            $wr = $('<div class="fr-wrap">');
            $(contents[i]).before($wr);
          }
          $wr.append(contents[i]);
        }
        else {
          $wr = null;
        }
      }
    }
  }

  $.Editable.prototype.cleanify = function (selection_only, remove_whitespace, save_selection) {
    if (this.browser.msie && $.Editable.getIEversion() < 9) return false;

    var elements;

    if (this.isHTML) return false;
    if (selection_only === undefined) selection_only = true;
    if (save_selection === undefined) save_selection = true;

    this.no_verify = true;

    this.$element.find('span').removeAttr('data-fr-verified');

    if (save_selection) {
      this.saveSelectionByMarkers();
    }

    // Nodes to apply selection on.
    if (selection_only) {
      elements = this.getSelectionElements();
    }
    else {
      this.wrapDirectContent();
      elements = this.$element.find(this.valid_nodes.join(','));
      if (elements.length === 0) elements = [this.$element.get(0)];
    }

    var html;
    var clean_output;

    // Other than the main element.
    if (elements[0] != this.$element.get(0)) {
      for (var i = 0; i < elements.length; i++) {
        var $elem = $(elements[i]);

        if ($elem.find(this.valid_nodes.join(',')).length === 0) {
          html = $elem.html();
          clean_output = this.cleanOutput($elem.get(0), remove_whitespace);

          if (clean_output !== html) {
            $elem.html(clean_output);
          }
        }
      }
    }
    // Main element.
    else if (this.$element.find(this.valid_nodes.join(',')).length === 0) {
      html = this.$element.html();
      clean_output = this.cleanOutput(this.$element.get(0), remove_whitespace);

      if (clean_output !== html) {
        this.$element.html(clean_output);
      }
    }

    // Remove idx.
    this.$element.find('[data-fr-idx]').removeAttr('data-fr-idx');
    this.$element.find('.fr-wrap').each (function () {
      $(this).replaceWith($(this).html());
    })

    this.$element.find('.f-marker').html('');
    if (save_selection) {
      this.restoreSelectionByMarkers();
    }

    this.$element.find('span').attr('data-fr-verified', true);

    this.no_verify = false;
  };

})(jQuery);
