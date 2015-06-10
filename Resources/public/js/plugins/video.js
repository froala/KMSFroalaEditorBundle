/*!
 * froala_editor v1.2.7 (https://www.froala.com/wysiwyg-editor)
 * License https://www.froala.com/wysiwyg-editor/terms
 * Copyright 2014-2015 Froala Labs
 */

(function ($) {
  $.Editable.DEFAULTS = $.extend($.Editable.DEFAULTS, {
    videoAllowedAttrs: ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'webkitallowfullscreen', 'mozallowfullscreen', 'href', 'target', 'id', 'controls', 'value', 'name'],
    videoAllowedTags: ['iframe', 'object', 'param', 'video', 'source', 'embed'],
    defaultVideoAlignment: 'center',
    textNearVideo: true
  });

  $.Editable.VIDEO_PROVIDERS = [
    {
      test_regex: /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
      url_regex: /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/)?(.+)/g,
      url_text: '//www.youtube.com/embed/$1',
      html: '<iframe width="640" height="360" src="{url}" frameborder="0" allowfullscreen></iframe>'
    },
    {
      test_regex: /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/,
      url_regex: /(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com)\/(?:channels\/[A-z]+\/|groups\/[A-z]+\/videos\/)?(.+)/g,
      url_text: '//player.vimeo.com/video/$1',
      html: '<iframe width="640" height="360" src="{url}" frameborder="0" allowfullscreen></iframe>'
    },
    {
      test_regex: /^.+(dailymotion.com|dai.ly)\/(video|hub)?\/?([^_]+)[^#]*(#video=([^_&]+))?/,
      url_regex: /(?:https?:\/\/)?(?:www\.)?(?:dailymotion\.com|dai\.ly)\/(?:video|hub)?\/?(.+)/g,
      url_text: '//www.dailymotion.com/embed/video/$1',
      html: '<iframe width="640" height="360" src="{url}" frameborder="0" allowfullscreen></iframe>'
    },
    {
      test_regex: /^.+(screen.yahoo.com)\/(videos-for-you|popular)?\/[^_&]+/,
      url_regex: '',
      url_text: '',
      html: '<iframe width="640" height="360" src="{url}?format=embed" frameborder="0" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" allowtransparency="true"></iframe>'
    }
  ];

  $.Editable.video_commands = {
    floatVideoLeft: {
      title: 'Float Left',
      icon: {
        type: 'font',
        value: 'fa fa-align-left'
      }
    },

    floatVideoNone: {
      title: 'Float None',
      icon: {
        type: 'font',
        value: 'fa fa-align-justify'
      }
    },

    floatVideoRight: {
      title: 'Float Right',
      icon: {
        type: 'font',
        value: 'fa fa-align-right'
      }
    },

    removeVideo: {
      title: 'Remove Video',
      icon: {
        type: 'font',
        value: 'fa fa-trash-o'
      }
    }
  };

  $.Editable.DEFAULTS = $.extend($.Editable.DEFAULTS, {
    videoButtons: ['floatVideoLeft', 'floatVideoNone', 'floatVideoRight', 'removeVideo']
  })

  $.Editable.commands = $.extend($.Editable.commands, {
    insertVideo: {
      title: 'Insert Video',
      icon: 'fa fa-video-camera',
      callback: function () {
        this.insertVideo();
      },
      undo: false
    }
  });

  /**
   * Insert video.
   */
  $.Editable.prototype.insertVideo = function () {
    if (!this.options.inlineMode) {
      this.closeImageMode();
      this.imageMode = false;
      this.positionPopup('insertVideo');
    }

    if (this.selectionInEditor()) {
      this.saveSelection();
    }

    this.showInsertVideo();

    this.$video_wrapper.find('textarea').val('');
  };


  $.Editable.prototype.insertVideoHTML = function () {
    var html = '<div class="froala-popup froala-video-popup" style="display: none;"><h4><span data-text="true">Insert Video</span><i title="Cancel" class="fa fa-times" id="f-video-close-' + this._id + '"></i></h4><div class="f-popup-line"><textarea placeholder="Embedded code" id="f-video-textarea-' + this._id + '"></textarea></div><p class="or"><span data-text="true">or</span></p><div class="f-popup-line"><input type="text" placeholder="http://youtube.com/" id="f-video-input-' + this._id + '"/><button data-text="true" class="f-ok f-submit fr-p-bttn" id="f-video-ok-' + this._id + '">OK</button></div></div>';

    return html;
  }

  $.Editable.prototype.buildInsertVideo = function () {
    this.$video_wrapper = $(this.insertVideoHTML());
    this.$popup_editor.append(this.$video_wrapper);

    this.addListener('hidePopups', this.hideVideoWrapper);

    // Stop event propagation in video wrapper.
    this.$video_wrapper.on('mouseup touchend', $.proxy(function (e) {
      if (!this.isResizing()) {
        e.stopPropagation();
      }
    }, this));

    this.$video_wrapper.on('mouseup keydown', 'input#f-video-input-' + this._id + ', textarea#f-video-textarea-' + this._id, $.proxy(function (e) {
      e.stopPropagation();
    }, this));

    var that = this;
    this.$video_wrapper.on('change', 'input#f-video-input-' + this._id + ', textarea#f-video-textarea-' + this._id, function () {
      if (this.tagName == 'INPUT') {
        that.$video_wrapper.find('textarea#f-video-textarea-' + that._id).val('');
      } else if (this.tagName == 'TEXTAREA') {
        that.$video_wrapper.find('input#f-video-input-' + that._id).val('');
      }
    });

    this.$video_wrapper.on('click', 'button#f-video-ok-' + this._id, $.proxy(function () {
      var $input = this.$video_wrapper.find('input#f-video-input-' + this._id)
      var $textarea = this.$video_wrapper.find('textarea#f-video-textarea-' + this._id)
      if ($input.val() !== '') {
        this.writeVideo($input.val(), false);
      } else if ($textarea.val() !== '') {
        this.writeVideo($textarea.val(), true);
      }
    }, this))

    this.$video_wrapper.on(this.mouseup, 'i#f-video-close-' + this._id, $.proxy(function () {
      this.$bttn_wrapper.show();
      this.hideVideoWrapper();

      if (this.options.inlineMode && !this.imageMode && this.options.buttons.length === 0) {
        this.hide();
      }

      this.restoreSelection();
      this.focus();

      if (!this.options.inlineMode) {
        this.hide();
      }
    }, this))

    this.$video_wrapper.on('click', function (e) {
      e.stopPropagation();
    })

    this.$video_wrapper.on('click', '*', function (e) {
      e.stopPropagation();
    })

    // Remove video on delete key hit.
    this.$window.on('keydown.' + this._id, $.proxy(function (e) {
      if (this.$element.find('.f-video-editor.active').length > 0) {
        var keyCode = e.which;
        // Delete.
        if (keyCode == 46 || keyCode == 8) {
          e.stopPropagation();
          e.preventDefault();
          setTimeout($.proxy(function () {
            this.removeVideo();
          }, this), 0);
          return false;
        }
      }
    }, this));
  };

  $.Editable.prototype.destroyVideo = function () {
    this.$video_wrapper.html('').removeData().remove();
  }

  $.Editable.prototype.initVideo = function () {
    this.buildInsertVideo();

    this.addVideoControls();

    this.addListener('destroy', this.destroyVideo);
  }

  $.Editable.initializers.push($.Editable.prototype.initVideo);

  $.Editable.prototype.hideVideoEditorPopup = function () {
    if (this.$video_editor) {
      this.$video_editor.hide();
      $('span.f-video-editor').removeClass('active');

      this.$element.removeClass('f-non-selectable');
      if (!this.editableDisabled && !this.isHTML) {
        this.$element.attr('contenteditable', true);
      }
    }
  };

  $.Editable.prototype.showVideoEditorPopup = function () {
    this.hidePopups();

    if (this.$video_editor) {
      this.$video_editor.show();
    }

    this.$element.removeAttr('contenteditable');
  };

  $.Editable.prototype.addVideoControlsHTML = function () {
    this.$video_editor = $('<div class="froala-popup froala-video-editor-popup" style="display: none">');

    var $buttons = $('<div class="f-popup-line">').appendTo(this.$video_editor);

    for (var i = 0; i < this.options.videoButtons.length; i++) {
      var cmd = this.options.videoButtons[i];
      if ($.Editable.video_commands[cmd] === undefined) {
        continue;
      }
      var button = $.Editable.video_commands[cmd];

      var btn = '<button class="fr-bttn" data-callback="' + cmd + '" data-cmd="' + cmd + '" title="' + button.title + '">';

      if (this.options.icons[cmd] !== undefined) {
        btn += this.prepareIcon(this.options.icons[cmd], button.title);
      } else {
        btn += this.prepareIcon(button.icon, button.title);
      }

      btn += '</button>';

      $buttons.append(btn);
    }

    this.addListener('hidePopups', this.hideVideoEditorPopup);

    this.$popup_editor.append(this.$video_editor);

    this.bindCommandEvents(this.$video_editor);
  };

  $.Editable.prototype.floatVideoLeft = function () {
    $('span.f-video-editor.active').attr('class', 'f-video-editor active fr-fvl');


    this.triggerEvent('videoFloatedLeft');

    $('span.f-video-editor.active').click();
  };

  $.Editable.prototype.floatVideoRight = function () {
    $('span.f-video-editor.active').attr('class', 'f-video-editor active fr-fvr');


    this.triggerEvent('videoFloatedRight');

    $('span.f-video-editor.active').click();
  };

  $.Editable.prototype.floatVideoNone = function () {
    $('span.f-video-editor.active').attr('class', 'f-video-editor active fr-fvn');


    this.triggerEvent('videoFloatedNone');

    $('span.f-video-editor.active').click();
  };

  $.Editable.prototype.removeVideo = function () {
    $('span.f-video-editor.active').remove();

    this.hide();

    this.triggerEvent('videoRemoved');

    this.focus();
  };

  $.Editable.prototype.refreshVideo = function () {
    this.$element.find('iframe, object').each (function (index, iframe) {
      var $iframe = $(iframe);

      for (var i = 0; i < $.Editable.VIDEO_PROVIDERS.length; i++) {
        var vp = $.Editable.VIDEO_PROVIDERS[i];

        if (vp.test_regex.test($iframe.attr('src'))) {
          if ($iframe.parents('.f-video-editor').length === 0) {
            $iframe.wrap('<span class="f-video-editor fr-fvn" data-fr-verified="true" contenteditable="false">');
          }

          break;
        }
      }
    })

    if (this.browser.msie) {
      this.$element.find('.f-video-editor').each (function () {
        this.oncontrolselect = function () {
          return false;
        };
      });
    }

    if (!this.options.textNearVideo) {
      this.$element.find('.f-video-editor')
        .attr('contenteditable', false)
        .addClass('fr-tnv');
    }
  }

  $.Editable.prototype.addVideoControls = function () {
    this.addVideoControlsHTML();

    this.addListener('sync', this.refreshVideo);

    this.$element.on('mousedown', 'span.f-video-editor', $.proxy(function (e) {
      e.stopPropagation();
    }, this));

    this.$element.on('click touchend', 'span.f-video-editor', $.proxy(function (e) {
      if (this.isDisabled) return false;

      e.preventDefault();
      e.stopPropagation();

      var target = e.currentTarget;

      this.clearSelection();

      this.showVideoEditorPopup();
      this.showByCoordinates($(target).offset().left + $(target).width() / 2, $(target).offset().top + $(target).height() + 3);

      $(target).addClass('active');

      this.refreshVideoButtons(target);
    }, this));
  };

  $.Editable.prototype.refreshVideoButtons = function (video_editor) {
    var video_float = $(video_editor).attr('class');
    this.$video_editor.find('[data-cmd]').removeClass('active');

    if (video_float.indexOf('fr-fvl') >= 0) {
      this.$video_editor.find('[data-cmd="floatVideoLeft"]').addClass('active');
    }
    else if (video_float.indexOf('fr-fvr') >= 0) {
      this.$video_editor.find('[data-cmd="floatVideoRight"]').addClass('active');
    }
    else {
      this.$video_editor.find('[data-cmd="floatVideoNone"]').addClass('active');
    }
  }

  $.Editable.prototype.writeVideo = function (video_obj, embeded) {
    var video = null;

    if (!embeded) {
      for (var i = 0; i < $.Editable.VIDEO_PROVIDERS.length; i++) {
        var vp = $.Editable.VIDEO_PROVIDERS[i];
        if (vp.test_regex.test(video_obj)) {
          video_obj = video_obj.replace(vp.url_regex, vp.url_text);
          video = vp.html.replace(/\{url\}/, video_obj);
          break;
        }
      }
    } else {
      video = this.clean(video_obj, true, false, this.options.videoAllowedTags, this.options.videoAllowedAttrs);
    }

    if (video) {
      this.restoreSelection();
      this.$element.focus();

      var aligment = 'fr-fvn';
      if (this.options.defaultVideoAlignment == 'left') aligment = 'fr-fvl';
      if (this.options.defaultVideoAlignment == 'right') aligment = 'fr-fvr';

      if (!this.textNearVideo) aligment += ' fr-tnv';

      try {
        this.insertHTML('<span contenteditable="false" class="f-video-editor ' + aligment + '" data-fr-verified="true">' + video + '</span>');
      }
      catch (ex) {}

      this.$bttn_wrapper.show();
      this.hideVideoWrapper();
      this.hide();

      // call with (video)
      this.triggerEvent('videoInserted', [video]);
    } else {
      // call with ([])
      this.triggerEvent('videoError');
    }
  };

  $.Editable.prototype.showVideoWrapper = function () {
    if (this.$video_wrapper) {
      this.$video_wrapper.show();
      this.$video_wrapper.find('.f-popup-line input').val('')
    }
  };

  $.Editable.prototype.hideVideoWrapper = function () {
    if (this.$video_wrapper) {
      this.$video_wrapper.hide();
      this.$video_wrapper.find('input').blur()
    }
  };

  $.Editable.prototype.showInsertVideo = function () {
    this.hidePopups();

    this.showVideoWrapper();
  };

})(jQuery);
