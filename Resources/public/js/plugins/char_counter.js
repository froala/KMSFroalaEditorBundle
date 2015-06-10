/*!
 * froala_editor v1.2.7 (https://www.froala.com/wysiwyg-editor)
 * License https://www.froala.com/wysiwyg-editor/terms
 * Copyright 2014-2015 Froala Labs
 */

(function ($) {
  $.Editable.DEFAULTS = $.extend($.Editable.DEFAULTS, {
    maxCharacters: -1,
    countCharacters: true
  });

  $.Editable.prototype.validKeyCode = function (keyCode, ctrlKey) {
    if (ctrlKey) return false;

    return (keyCode > 47 && keyCode < 58)   || // number keys
            keyCode == 32 || keyCode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
            (keyCode > 64 && keyCode < 91)   || // letter keys
            (keyCode > 95 && keyCode < 112)  || // numpad keys
            (keyCode > 185 && keyCode < 193) || // ;=,-./` (in order)
            (keyCode > 218 && keyCode < 223);   // [\]' (in order)
  }

  $.Editable.prototype.charNumber = function () {
    return this.getText().length;
  }

  $.Editable.prototype.checkCharNumber = function (e, editor, originalE) {
    // Continue if infinite characters;
    if (editor.options.maxCharacters < 0) return true;

    // Continue if enough characters.
    if (editor.charNumber() < editor.options.maxCharacters) return true;

    // Stop if the key will produce a new char.
    var keyCode = originalE.which;
    var ctrlKey = (originalE.ctrlKey || originalE.metaKey) && !originalE.altKey;
    if (editor.validKeyCode(keyCode, ctrlKey)) {
      editor.triggerEvent('maxCharNumberExceeded', [], false);
      return false;
    }

    return true;
  }

  $.Editable.prototype.checkCharNumberOnPaste = function (e, editor, pastedFrag) {
    if (editor.options.maxCharacters < 0) return true;

    var pastedLength = $('<div>').html(pastedFrag).text().length;

    if (pastedLength + editor.charNumber() <= editor.options.maxCharacters) return pastedFrag;

    editor.triggerEvent('maxCharNumberExceeded', [], false);
    return '';
  }

  $.Editable.prototype.updateCharNumber = function (e, editor) {
    if (editor.options.countCharacters) {
      var chars = editor.charNumber() + (editor.options.maxCharacters > 0 ?  '/' + editor.options.maxCharacters : '');

      editor.$box.attr('data-chars', chars);
    }
  }

  $.Editable.prototype.initCharNumber = function () {
    this.$original_element.on('editable.keydown', this.checkCharNumber);
    this.$original_element.on('editable.afterPasteCleanup', this.checkCharNumberOnPaste);
    this.$original_element.on('editable.keyup', this.updateCharNumber);
    this.$original_element.on('editable.contentChanged', this.updateCharNumber);
    this.updateCharNumber(null, this);
  }

  $.Editable.initializers.push($.Editable.prototype.initCharNumber);
})(jQuery);
