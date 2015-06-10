/*!
 * froala_editor v1.2.7 (https://www.froala.com/wysiwyg-editor)
 * License https://www.froala.com/wysiwyg-editor/terms
 * Copyright 2014-2015 Froala Labs
 */

(function ($) {
  $.Editable.DEFAULTS = $.extend($.Editable.DEFAULTS, {
    fontList: {
      'Arial,Helvetica': 'Arial, Helvetica',
      'Courier,Courier New': 'Courier, Courier New',
      Georgia: 'Georgia',
      'Times New Roman,Times': 'Times New Roman,Times',
      'Trebuchet MS': 'Trebuchet MS',
      'Verdana, Geneva': 'Verdana,Geneva'
    }
  });

  $.Editable.prototype.refreshFontFamily = function () {
    var $element = $(this.getSelectionElement());
    this.$editor.find('.fr-dropdown > button[data-name="fontFamily"] + ul li').removeClass('active');
    this.$editor.find('.fr-dropdown > button[data-name="fontFamily"] + ul li[data-val="' + $element.css('font-family').replace(/"/gi, '\\"') + '"]').addClass('active');
  }

  $.Editable.commands = $.extend($.Editable.commands, {
    fontFamily: {
      title: 'Font Family',
      icon: 'fa fa-font',
      refreshOnShow: $.Editable.prototype.refreshFontFamily,
      callback: function (cmd, val) {
        this.inlineStyle('font-family', cmd, val);
      },
      undo: true,
      callbackWithoutSelection: function (cmd, val) {
        this._startInFontExec('font-family', cmd, val);
      }
    }
  });

  $.Editable.prototype.command_dispatcher = $.extend($.Editable.prototype.command_dispatcher, {
    fontFamily: function (command) {
      var dropdown = this.buildDropdownFontFamily();
      var btn = this.buildDropdownButton(command, dropdown, 'fr-family');
      return btn;
    }
  });

  /**
   * Dropdown for font family.
   *
   * @param command
   * @returns {*}
   */
  $.Editable.prototype.buildDropdownFontFamily = function () {
    var dropdown = '<ul class="fr-dropdown-menu">';

    // Iterate format block seed.
    for (var cmd in this.options.fontList) {
      var text = this.options.fontList[cmd];

      var format_btn = '<li data-cmd="fontFamily" data-val="' + cmd + '">';
      format_btn += '<a href="#" data-text="true" title="' + text + '" style="font-family: ' + cmd + ';">' + text + '</a></li>';

      dropdown += format_btn;
    }

    dropdown += '</ul>';

    return dropdown;
  };
})(jQuery);
