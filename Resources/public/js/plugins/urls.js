/*!
 * froala_editor v1.2.7 (https://www.froala.com/wysiwyg-editor)
 * License https://www.froala.com/wysiwyg-editor/terms
 * Copyright 2014-2015 Froala Labs
 */

(function ($) {
  $.Editable.URLRegEx = /(\s|^|>)((http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+(\.[a-zA-Z]{2,3})?(:\d*)?(\/\S*)?)(\s|$|<)/gi;

  $.Editable.prototype.convertURLs = function (contents) {
    var that = this;

    // All content zones.
    contents.each (function () {
      // Text node.
      if (this.nodeType == 3) {
        var text = this.textContent.replace(/&nbsp;/gi, '');

        // Check if text is URL.
        if ($.Editable.URLRegEx.test(text)) {
          // Convert it to A.
          $(this).before(text.replace($.Editable.URLRegEx, '$1<a href="$2">$2</a>$7'));

          $(this).remove();
        }
      }

      // Other type of node.
      else if (this.nodeType == 1 && ['A', 'BUTTON', 'TEXTAREA'].indexOf(this.tagName) < 0) {
        // Convert urls inside it.
        that.convertURLs($(this).contents());
      }
    })
  }

  $.Editable.prototype.processURLs = function () {
    this.$original_element.on('editable.afterPaste', function (e, editor) {
      editor.convertURLs(editor.$element.contents());
    });

    this.$original_element.on('editable.keyup', function (e, editor, originalE) {
      var keyCode = originalE.which;

      if (keyCode == 32 || keyCode == 13) {
        editor.convertURLs(editor.$element.contents());
      }
    });

    // Make sure we get out of A.
    this.$original_element.on('editable.keydown', function (e, editor, originalE) {
      var keyCode = originalE.which;

      if (keyCode == 32) {
        var el = editor.getSelectionElement();
        if ((el.tagName == 'A' || $(el).parents('a').length) && editor.getSelectionTextInfo(el).atEnd) {
          e.stopImmediatePropagation();

          if (el.tagName !== 'A') el = $(el).parents('a')[0];
          $(el).after('&nbsp;<span class="f-marker" data-type="false" data-id="0" data-fr-verified="true"></span><span class="f-marker" data-type="true" data-id="0" data-fr-verified="true"></span>');
          editor.restoreSelectionByMarkers();

          return false;
        }
      }
    });
  }

  $.Editable.initializers.push($.Editable.prototype.processURLs);
})(jQuery);
