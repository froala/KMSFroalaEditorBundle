/*!
 * froala_editor v1.2.7 (https://www.froala.com/wysiwyg-editor)
 * License https://www.froala.com/wysiwyg-editor/terms
 * Copyright 2014-2015 Froala Labs
 */

(function ($) {
  $.Editable.prototype.refreshFontSize = function () {
    var $element = $(this.getSelectionElement());
    var size = parseInt($element.css('font-size').replace(/px/g, ''), 10) || 16;
    this.$editor.find('.fr-dropdown > button[data-name="fontSize"] + ul li').removeClass('active');
    this.$editor.find('.fr-dropdown > button[data-name="fontSize"] + ul li[data-val="' + size + 'px"]').addClass('active');
  }

  $.Editable.commands = $.extend($.Editable.commands, {
    fontSize: {
      title: 'Font Size',
      icon: 'fa fa-text-height',
      refreshOnShow: $.Editable.prototype.refreshFontSize,
      seed: [{
        min: 11,
        max: 52
      }],
      undo: true,
      callback: function (cmd, val) {
        this.inlineStyle('font-size', cmd, val);
      },
      callbackWithoutSelection: function (cmd, val) {
        this._startInFontExec('font-size', cmd, val);
      }
    }
  });

  $.Editable.prototype.command_dispatcher = $.extend($.Editable.prototype.command_dispatcher, {
    fontSize: function (command) {
      var dropdown = this.buildDropdownFontsize(command);
      var btn = this.buildDropdownButton(command, dropdown);
      return btn;
    }
  });

  /**
   * Dropdown for fontSize.
   *
   * @param command
   * @returns {*}
   */
  $.Editable.prototype.buildDropdownFontsize = function (command) {
    var dropdown = '<ul class="fr-dropdown-menu f-font-sizes">';

    // Iterate color seed.
    for (var j = 0; j < command.seed.length; j++) {
      var font = command.seed[j];

      for (var k = font.min; k <= font.max; k++) {
        dropdown += '<li data-cmd="' + command.cmd + '" data-val="' + k + 'px"><a href="#"><span>' + k + 'px</span></a></li>';
      }
    }

    dropdown += '</ul>';

    return dropdown;
  };
})(jQuery);
