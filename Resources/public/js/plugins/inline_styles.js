/*!
 * froala_editor v1.2.7 (https://www.froala.com/wysiwyg-editor)
 * License https://www.froala.com/wysiwyg-editor/terms
 * Copyright 2014-2015 Froala Labs
 */

(function ($) {
  /**
   * Update block styles.
   */
  $.Editable.prototype.refreshInlineStyles = function () {
    var element = this.getSelectionElements()[0];
    var active_block_tag = element.tagName.toLowerCase();

    // Clear styles.
    this.$bttn_wrapper.find('.fr-block-style').empty();

    var block_style = this.options.blockStyles[active_block_tag];
    if (block_style === undefined) {
      block_style = this.options.defaultBlockStyle;
    }

    // Check if there are any block styles available.
    if (block_style !== undefined) {
      this.$bttn_wrapper.find('.fr-dropdown > button[data-name="blockStyle"].fr-trigger').removeAttr('disabled');

      for (var cls in block_style) {
        var style = block_style[cls];
        var active = '';
        if ($(element).hasClass(cls)) {
          active = ' class="active"';
        }

        this.$bttn_wrapper.find('.fr-block-style').append(
          $('<li' + active + '>').append($('<a href="#" data-text="true">').text(style).addClass(cls))
            .attr('data-cmd', 'blockStyle')
            .attr('data-val', cls)
        )
      }
    }
  };

  $.Editable.commands = $.extend($.Editable.commands, {
    inlineStyle: {
      title: 'Inline Style',
      icon: 'fa fa-paint-brush',
      refreshOnShow: $.Editable.prototype.refreshInlineStyles,
      callback: function (cmd, is_name) {
        this.applyInlineStyles(is_name);
      },
      callbackWithoutSelection: function (cmd, is_name) {
        this.applyInlineStyles(is_name);
      }
    }
  });

  $.Editable.DEFAULTS = $.extend($.Editable.DEFAULTS, {
    inlineStyles: {
      'Big Red': 'font-size: 20px; color: red;',
      'Small Blue': 'font-size: 14px; color: blue;'
    }
  })

  $.Editable.prototype.command_dispatcher = $.extend($.Editable.prototype.command_dispatcher, {
    inlineStyle: function (command) {
      var dropdown = this.buildDropdownInlineStyle();
      var btn = this.buildDropdownButton(command, dropdown);
      return btn;
    }
  });

  /**
   * Dropdown for formatBlock.
   *
   * @param command
   * @returns {*}
   */
  $.Editable.prototype.buildDropdownInlineStyle = function () {
    var dropdown = '<ul class="fr-dropdown-menu fr-inline-style">';

    for (var is_name in this.options.inlineStyles) {
      dropdown += '<li data-cmd="inlineStyle" data-val="' + is_name + '"><a href="#" style="' + this.options.inlineStyles[is_name] + '">' + is_name + '</a></li>';
    }

    dropdown += '</ul>';

    return dropdown;
  };

  /**
   * Block style.
   *
   * @param val
   */
  $.Editable.prototype.applyInlineStyles = function (is_name) {
    if (this.text() !== '') {
      this.insertHTML(this.start_marker + '<span data-fr-verified="true" style="' + this.options.inlineStyles[is_name] + '">' + this.text() + '</span>' + this.end_marker);
    }
    else {
      this.insertHTML('<span data-fr-verified="true" style="' + this.options.inlineStyles[is_name] + '">' + this.markers_html + $.Editable.INVISIBLE_SPACE + '</span>');
    }
    this.restoreSelectionByMarkers();

    this.triggerEvent('inlineStyle');
  };

  $.Editable.prototype.startInInlineStyles = function (is_name) {
    for (var prop in this.options.inlineStyles[is_name]) {
      this._startInFontExec(prop.replace(/([A-Z])/g, '-$1').toLowerCase(), null, this.options.inlineStyles[is_name][prop]);
    }

    this.triggerEvent('inlineStyle');
  }

})(jQuery);
