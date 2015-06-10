/*!
 * froala_editor v1.2.7 (https://www.froala.com/wysiwyg-editor)
 * License https://www.froala.com/wysiwyg-editor/terms
 * Copyright 2014-2015 Froala Labs
 */

(function ($) {
  $.Editable.DEFAULTS = $.extend($.Editable.DEFAULTS, {
    colors: [
      '#61BD6D', '#1ABC9C', '#54ACD2', '#2C82C9', '#9365B8', '#475577', '#CCCCCC',
      '#41A85F', '#00A885', '#3D8EB9', '#2969B0', '#553982', '#28324E', '#000000',
      '#F7DA64', '#FBA026', '#EB6B56', '#E25041', '#A38F84', '#EFEFEF', '#FFFFFF',
      '#FAC51C', '#F37934', '#D14841', '#B8312F', '#7C706B', '#D1D5D8', 'REMOVE'
    ],
    colorsStep: 7,
    colorGroups: [
      {
        text: 'Text',
        cmd: 'foreColor'
      },
      {
        text: 'Background',
        cmd: 'backColor'
      }
    ],
    defaultColorGroup: 'foreColor'
  });

  $.Editable.prototype.refreshColors = function () {
    var element = this.getSelectionElement();
    this.$editor.find('.fr-color-picker button.fr-color-bttn').removeClass('active');
    this.refreshColor(element, 'background-color', 'backColor');
    this.refreshColor(element, 'color', 'foreColor');
  };

  $.Editable.prototype.refreshColor = function (element, color_type, cmd) {
    while ($(element).get(0) != this.$element.get(0)) {
      // Not transparent.
      if (!($(element).css(color_type) === 'transparent' || $(element).css(color_type) === 'rgba(0, 0, 0, 0)')) {
        this.$editor.find('.fr-color-picker button.fr-color-bttn[data-param="' + cmd + '"][data-val="' + $.Editable.RGBToHex($(element).css(color_type)) + '"]').addClass('active');
        break;
      } else {
        element = $(element).parent();
      }
    }
  }

  $.Editable.commands = $.extend($.Editable.commands, {
    color: {
      icon: 'fa fa-tint',
      title: 'Color',
      refreshOnShow: $.Editable.prototype.refreshColors,
      callback: function (cmd, val, param) {
        this[param].apply(this, [val]);
      },
      callbackWithoutSelection: function (cmd, val, param) {
        if (param === 'backColor') param = 'background-color';
        if (param === 'foreColor') param = 'color';

        this._startInFontExec(param, cmd, val);

        if (val === '#123456' && this.text() === '') {
          this.cleanify(true, false);

          this.$element.find('span').each(function (index, span) {
            var $span = $(span);
            var color = $span.css('background-color');

            if (color === '#123456' || $.Editable.RGBToHex(color) === '#123456') {
              $span.css('background-color', '');
            }

            color = $span.css('color');

            if (color === '#123456' || $.Editable.RGBToHex(color) === '#123456') {
              $span.css('color', '');
            }
          });
        }
      },
      undo: true
    }
  });

  $.Editable.prototype.command_dispatcher = $.extend($.Editable.prototype.command_dispatcher, {
    color: function (command) {
      var dropdown = this.buildDropdownColor(command);
      var btn = this.buildDropdownButton(command, dropdown, 'fr-color-picker');
      return btn;
    }
  });

  $.Editable.prototype.buildColorList = function (type, colors) {
    var display = (this.options.defaultColorGroup == type ? 'block' : 'none');

    // Color headline.
    var color_el = '<div class="fr-color-set fr-' + type + '" style="display: ' + display + '">';

    // Iterate color blocks.
    for (var k = 0; k < colors.length; k++) {

      // Color block.
      var color = colors[k];

      if (color !== 'REMOVE') {
        color_el += '<button type="button" class="fr-color-bttn" data-val="' + color + '" data-cmd="color" data-param="' + type + '" style="background: ' + color + ';">&nbsp;</button>';
      } else {
        color_el += '<button type="button" class="fr-color-bttn" data-val="#123456" data-cmd="color" data-param="' + type + '" style="background: #FFF;"><i class="fa fa-eraser"></i></button>';
      }

      // New line.
      if (k % this.options.colorsStep == (this.options.colorsStep - 1) && k > 0) {
        color_el += '<hr/>';

        // Higher new line.
        if ((k == this.options.colorsStep - 1 || k == this.options.colorsStep * 2 - 1) && this.options.colorsTopChoices) {
          color_el += '<div class="separator"></div>';
        }
      }
    }

    color_el += '</div>';

    return color_el;
  }

  /**
   * Dropdown for color.
   *
   * @param command
   * @returns {*}
   */
  $.Editable.prototype.buildDropdownColor = function () {
    var active = '';
    var dropdown = '<div class="fr-dropdown-menu">';

    for (var i = 0; i < this.options.colorGroups.length; i++) {
      dropdown += this.buildColorList(this.options.colorGroups[i].cmd, this.options.colorGroups[i].colors || this.options.colors);
    }

    dropdown += '<p>';

    for (i = 0; i < this.options.colorGroups.length; i++) {
      active = (this.options.defaultColorGroup == this.options.colorGroups[i].cmd ? 'active' : '');
      dropdown += '<span class="fr-choose-color ' + active + '" data-text="true" data-param="' + this.options.colorGroups[i].cmd + '" style="width: ' + 100 / this.options.colorGroups.length + '%;">' + this.options.colorGroups[i].text + '</span>';
    }

    dropdown += '</p></div>';

    this.$bttn_wrapper.on(this.mousedown, '.fr-choose-color', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (e.type === 'mousedown' && e.which !== 1) return true;
    })

    var that = this;
    this.$bttn_wrapper.on(this.mouseup, '.fr-choose-color', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (e.type === 'mouseup' && e.which !== 1) return true;

      var $this = $(this);
      $this.siblings().removeClass('active');
      $this.addClass('active');

      $this.parents('.fr-dropdown-menu').find('button').attr('data-param', $this.attr('data-param'));
      $this.parents('.fr-dropdown-menu').find('.fr-color-set').hide();
      $this.parents('.fr-dropdown-menu').find('.fr-color-set.fr-' +  $this.attr('data-param')).show();

      that.refreshColors();
    });

    return dropdown;
  };

  /**
   * Set background color.
   *
   * @param val
   */
  $.Editable.prototype.backColor = function (val) {
    this.inlineStyle('background-color', 'backColor', val);

    this.saveSelectionByMarkers();
    this.$element.find('span').each(function (index, span) {
      var $span = $(span);
      var color = $span.css('background-color');

      if (color === '#123456' || $.Editable.RGBToHex(color) === '#123456') {
        $span.css('background-color', '');

        $span.find('span').each(function (idx, sp) {
          var $sp = $(sp);
          $sp.css('background-color', '');

          if ($sp.attr('style') === '' && !$sp.hasClass('f-marker')) {
            $sp.replaceWith($sp.contents());
          }
        })
      }

      if ($span.attr('style') === '' && !$span.hasClass('f-marker')) {
        $span.replaceWith($span.contents());
      }
    });
    this.restoreSelectionByMarkers();

    this.cleanify();

    // Mark current color selected.
    var $elem = this.$editor.find('button.fr-color-bttn[data-cmd="backColor"][data-val="' + val + '"]');
    $elem.addClass('active');
    $elem.siblings().removeClass('active');
  };

  /**
   * Set foreground color.
   *
   * @param val
   */
  $.Editable.prototype.foreColor = function (val) {
    this.inlineStyle('color', 'foreColor', val);

    this.saveSelectionByMarkers();
    this.$element.find('span').each(function (index, span) {
      var $span = $(span);
      var color = $span.css('color');

      if (color === '#123456' || $.Editable.RGBToHex(color) === '#123456') {
        $span.css('color', '');

        $span.find('span').each(function (idx, sp) {
          var $sp = $(sp);
          $sp.css('color', '');

          if ($sp.attr('style') === '' && !$sp.hasClass('f-marker')) {
            $sp.replaceWith($sp.contents());
          }
        })
      }

      if ($span.attr('style') === '' && !$span.hasClass('f-marker')) {
        $span.replaceWith($span.contents());
      }
    });
    this.restoreSelectionByMarkers();

    this.cleanify();

    // Mark current color selected.
    var $elem = this.$editor.find('button.fr-color-bttn[data-cmd="foreColor"][data-val="' + val + '"]');
    $elem.addClass('active');
    $elem.siblings().removeClass('active');
  };
})(jQuery);
