/*!
 * froala_editor v1.2.7 (https://www.froala.com/wysiwyg-editor)
 * License https://www.froala.com/wysiwyg-editor/terms
 * Copyright 2014-2015 Froala Labs
 */

(function ($) {
  $.Editable.prototype.refreshFullscreen = function () {
    if (this.$box.hasClass('fr-fullscreen')) {
      this.$editor.find('[data-cmd="fullscreen"]').addClass('active');
    } else {
      this.$editor.find('[data-cmd="fullscreen"]').removeClass('active');
    }
  }

  $.Editable.commands = $.extend($.Editable.commands, {
    fullscreen: {
      icon: 'fa fa-expand',
      title: 'Fullscreen',
      callback: function () {
        this.$box.toggleClass('fr-fullscreen');
        $('body').toggleClass('fr-fullscreen');
        this.$editor.find('[data-cmd="fullscreen"] i').toggleClass('fa-expand fa-compress')
        this.refreshFullscreen();

        // Get out of fullscreen mode.
        if (!this.$box.hasClass('fr-fullscreen')) {
          this.$wrapper.css('height', '');
          this.$element.css('minHeight', '');
          this.setDimensions();
          this.options.scrollableContainer = this.oldScrollableContainer;
          var $container = this.$document.find(this.options.scrollableContainer)
          $container.append(this.$popup_editor);
          this.$fullscreen_marker.replaceWith(this.$box);
        }

        // Enter fullscreen mode.
        else {
          this.$fullscreen_marker = $('<div>');
          this.$box.after(this.$fullscreen_marker);
          this.$box.appendTo('body');
          this.computeElementHeight();
        }
      },
      refresh: $.Editable.prototype.refreshFullscreen
    }
  });

  $.Editable.prototype.computeElementHeight = function () {
    var h = this.$window.height() -
      this.$editor.outerHeight() -
      parseFloat(this.$wrapper.css('padding-top'), 10) -
      parseFloat(this.$wrapper.css('padding-bottom'), 10) -
      parseFloat((this.$wrapper || this.$element).css('border-top-width'), 10) -
      parseFloat((this.$wrapper || this.$element).css('border-bottom-width'), 10) +
    2;

    this.$wrapper.css('height', h);

    this.$element.css('minHeight', h - parseInt(this.$element.css('padding-top'), 10) - parseInt(this.$element.css('padding-bottom'), 10));

    this.$element.css('maxHeight', '');
    this.$wrapper.css('maxHeight', '');

    this.oldScrollableContainer = this.options.scrollableContainer;
    this.options.scrollableContainer = this.$wrapper;
    this.$wrapper.append(this.$popup_editor);
  }

  $.Editable.prototype.initFullscreen = function () {
    this.$window.on('resize', $.proxy(function () {
      if (this.$box.hasClass('fr-fullscreen')) {
        this.computeElementHeight();
      }
    }, this));
  }

  $.Editable.initializers.push($.Editable.prototype.initFullscreen);
})(jQuery);
