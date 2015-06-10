/*!
 * froala_editor v1.2.7 (https://www.froala.com/wysiwyg-editor)
 * License https://www.froala.com/wysiwyg-editor/terms
 * Copyright 2014-2015 Froala Labs
 */

(function ($) {
  $.Editable.commands = $.extend($.Editable.commands, {
    uploadFile: {
      title: 'Upload File',
      icon: 'fa fa-paperclip',
      callback: function () {
        this.insertFile();
      },
      undo: false
    }
  });

  $.Editable.DEFAULTS = $.extend($.Editable.DEFAULTS, {
    allowedFileTypes: ['*'],
    fileDeleteUrl: null,
    fileDeleteParams: {},
    fileUploadParams: {},
    fileUploadURL: 'http://i.froala.com/upload',
    fileUploadParam: 'file',
    maxFileSize: 1024 * 1024 * 10, // 10 Mb.
    useFileName: true
  });

  $.Editable.prototype.showFileWrapper = function () {
    if (this.$file_wrapper) {
      this.$file_wrapper.show();
    }
  };

  $.Editable.prototype.hideFileWrapper = function () {
    if (this.$file_wrapper) {
      this.$file_wrapper.hide();
      this.$file_wrapper.find('input').blur();
    }
  };

  $.Editable.prototype.showFileUpload = function () {
    this.hidePopups();

    this.showFileWrapper();
  };

  $.Editable.prototype.insertFile = function () {
    // Close image mode.
    this.closeImageMode();
    this.imageMode = false;

    this.showFileUpload();
    this.saveSelectionByMarkers();

    if (!this.options.inlineMode) {
      this.positionPopup('uploadFile');
    }
  }

  $.Editable.prototype.fileUploadHTML = function () {
    var html = '<div class="froala-popup froala-file-popup" style="display: none;"><h4><span data-text="true">Upload file</span><i title="Cancel" class="fa fa-times" id="f-file-close-' + this._id + '"></i></h4>';

    html += '<div id="f-file-list-' + this._id + '">';

    html += '<div class="f-popup-line drop-upload">';
    html += '<div class="f-upload" id="f-file-upload-div-' + this._id + '"><strong data-text="true">Drop File</strong><br>(<span data-text="true">or click</span>)<form target="file-frame-' + this._id + '" enctype="multipart/form-data" encoding="multipart/form-data" action="' + this.options.fileUploadURL + '" method="post" id="f-file-form-' + this._id + '"><input id="f-file-upload-' + this._id + '" type="file" name="' + this.options.fileUploadParam + '" accept="/*"></form></div>';

    if (this.browser.msie && $.Editable.getIEversion() <= 9) {
      html += '<iframe id="file-frame-' + this._id + '" name="file-frame-' + this._id + '" src="javascript:false;" style="width:0; height:0; border:0px solid #FFF; position: fixed; z-index: -1;" data-loaded="true"></iframe>';
    }

    html += '</div>';

    html += '</div>';
    html += '<p class="f-progress" id="f-file-progress-' + this._id + '"><span></span></p>';
    html += '</div>';

    return html;
  }

  $.Editable.prototype.buildFileDrag = function () {
    var that = this;

    that.$file_wrapper.on('dragover', '#f-file-upload-div-' + this._id, function () {
      $(this).addClass('f-hover');
      return false;
    });

    that.$file_wrapper.on('dragend', '#f-file-upload-div-' + this._id, function () {
      $(this).removeClass('f-hover');
      return false;
    });

    that.$file_wrapper.on('drop', '#f-file-upload-div-' + this._id, function (e) {
      e.preventDefault();
      e.stopPropagation();

      $(this).removeClass('f-hover');

      that.uploadFile(e.originalEvent.dataTransfer.files);
    });

    that.$element.on('drop', function (e) {
      var files = e.originalEvent.dataTransfer.files;
      if ($('.froala-element img.fr-image-move').length === 0 && e.originalEvent.dataTransfer && files && files.length) {
        if (that.isDisabled) return false;

        if (that.options.allowedImageTypes.indexOf(files[0].type.replace(/image\//g,'')) < 0) {
          that.closeImageMode();
          that.hide();
          that.imageMode = false;

          // Init editor if not initialized.
          if (!that.initialized) {
            that.$element.unbind('mousedown.element');
            that.lateInit();
          }

          that.insertMarkersAtPoint(e.originalEvent);
          that.showByCoordinates(e.originalEvent.pageX, e.originalEvent.pageY);
          that.uploadFile(files);
          e.preventDefault();
          e.stopPropagation();
        }
      }
    });
  }

  /**
   * Build file upload.
   */
  $.Editable.prototype.buildFileUpload = function () {
    // Add file wrapper to editor.
    this.$file_wrapper = $(this.fileUploadHTML());
    this.$popup_editor.append(this.$file_wrapper);

    this.buildFileDrag();

    var that = this;

    // Stop event propagation in file.
    this.$file_wrapper.on('mouseup touchend', $.proxy(function (e) {
      if (!this.isResizing()) {
        e.stopPropagation();
      }
    }, this));

    this.addListener('hidePopups', $.proxy(function () {
      this.hideFileWrapper();
    }, this));

    // Init progress bar.
    this.$file_progress_bar = this.$file_wrapper.find('p#f-file-progress-' + this._id);

    // Build upload frame.
    if (this.browser.msie && $.Editable.getIEversion() <= 9) {
      var iFrame = this.$file_wrapper.find('iframe').get(0);

      if (iFrame.attachEvent) {
        iFrame.attachEvent('onload', function () { that.iFrameLoad() });
      } else {
        iFrame.onload  = function () { that.iFrameLoad() };
      }
    }

    // File was picked.
    this.$file_wrapper.on('change', 'input[type="file"]', function () {
      // Files were picked.
      if (this.files !== undefined) {
        that.uploadFile(this.files);
      }

      // IE 9 upload.
      else {
        var $form = $(this).parents('form');
        $form.find('input[type="hidden"]').remove();
        var key;
        for (key in that.options.fileUploadParams) {
          $form.prepend('<input type="hidden" name="' + key + '" value="' + that.options.fileUploadParams[key] + '" />');
        }

        that.$file_wrapper.find('#f-file-list-' + that._id).hide();
        that.$file_progress_bar.show();
        that.$file_progress_bar.find('span').css('width', '100%').text('Please wait!');
        that.showFileUpload();

        $form.submit();
      }

      // Chrome fix.
      $(this).val('');
    });

    // Wrap things in file wrapper.
    this.$file_wrapper.on(this.mouseup, '#f-file-close-' + this._id, $.proxy(function (e) {
      e.stopPropagation();
      e.preventDefault();

      this.$bttn_wrapper.show();
      this.hideFileWrapper();

      this.restoreSelection();
      this.focus();

      this.hide();
    }, this))

    this.$file_wrapper.on('click', function (e) {
      e.stopPropagation();
    });

    this.$file_wrapper.on('click', '*', function (e) {
      e.stopPropagation();
    });
  };

  $.Editable.initializers.push($.Editable.prototype.buildFileUpload);


  /**
   * Upload files to server.
   *
   * @param files
   */
  $.Editable.prototype.uploadFile = function (files) {
    if (!this.triggerEvent('beforeFileUpload', [files], false)) {
      return false;
    }

    if (files !== undefined && files.length > 0) {
      var formData;

      if (this.drag_support.formdata) {
        formData = this.drag_support.formdata ? new FormData() : null;
      }

      if (formData) {
        var key;
        for (key in this.options.fileUploadParams) {
          formData.append(key, this.options.fileUploadParams[key]);
        }

        formData.append(this.options.fileUploadParam, files[0]);

        // Check file max size.
        if (files[0].size > this.options.maxFileSize) {
          this.throwFileError(5);
          return false;
        }

        // Check file types.
        if (this.options.allowedFileTypes.indexOf(files[0].type) < 0 && this.options.allowedFileTypes.indexOf('*') < 0) {
          this.throwFileError(6);
          return false;
        }
      }

      if (formData) {
        var xhr;
        if (this.options.crossDomain) {
          xhr = this.createCORSRequest('POST', this.options.fileUploadURL);
        } else {
          xhr = new XMLHttpRequest();
          xhr.open('POST', this.options.fileUploadURL);

          for (var h_key in this.options.headers) {
            xhr.setRequestHeader(h_key, this.options.headers[h_key]);
          }
        }

        var file_name = files[0].name;

        xhr.onload = $.proxy(function () {
          this.$file_progress_bar.find('span').css('width', '100%').text('Please wait!');
          try {
            if (xhr.status >= 200 && xhr.status < 300) {
              this.parseFileResponse(xhr.responseText, file_name);
            } else {
              this.throwFileError(3);
            }
          } catch (ex) {
            // Bad response.
            this.throwFileError(4);
          }
        }, this);

        xhr.onerror = $.proxy(function () {
          // Error on uploading file.
          this.throwFileError(3);

        }, this);

        xhr.upload.onprogress = $.proxy(function (event) {
          if (event.lengthComputable) {
            var complete = (event.loaded / event.total * 100 | 0);
            this.$file_progress_bar.find('span').css('width', complete + '%');
          }
        }, this);

        xhr.send(formData);

        this.$file_wrapper.find('#f-file-list-' + this._id).hide();
        this.$file_progress_bar.show();
        this.showFileUpload();
      }
    }
  };

  $.Editable.prototype.throwFileError = function (code) {
    var status = 'Unknown file upload error.';
    if (code == 1) {
      status = 'Bad link.';
    } else if (code == 2) {
      status = 'No link in upload response.';
    } else if (code == 3) {
      status = 'Error during file upload.';
    } else if (code == 4) {
      status = 'Parsing response failed.';
    } else if (code == 5) {
      status = 'File too large.';
    } else if (code == 6) {
      status = 'Invalid file type.';
    } else if (code == 7) {
      status = 'File can be uploaded only to same domain in IE 8 and IE 9.'
    }

    this.triggerEvent('fileError', [{
      code: code,
      message: status
    }], false);

    this.hideFileLoader();
  };

  $.Editable.prototype.hideFileLoader = function () {
    this.$file_progress_bar.hide();
    this.$file_progress_bar.find('span').css('width', '0%').text('');
    this.$file_wrapper.find('#f-file-list-' + this._id).show();
  };

  $.Editable.prototype.throwFileErrorWithMessage = function (message) {
    this.triggerEvent('fileError', [{
      message: message,
      code: 0
    }], false);

    this.hideFileLoader();
  }

  $.Editable.prototype.parseFileResponse = function (response, file_name) {
    try {
      if (!this.triggerEvent('afterFileUpload', [response], false)) {
        return false;
      }

      var resp = $.parseJSON(response);
      if (resp.link) {
        this.writeFile(resp.link, file_name, response);
      } else if (resp.error) {
        this.throwFileErrorWithMessage(resp.error);
      } else {
        // No link in upload request.
        this.throwFileError(2);
      }
    } catch (ex) {
      // Bad response.
      this.throwFileError(4);
    }
  };

  $.Editable.prototype.writeFile = function (link, file_name, response) {
    // Restore saved selection.
    this.restoreSelectionByMarkers();
    this.focus();

    if (!this.options.useFileName && this.text() !== '') file_name = this.text();

    // Insert link to file.
    this.insertHTML('<a class="fr-file" href="' + this.sanitizeURL(link) + '">' + file_name + '</a>');

    // Hide file controls.
    this.hide();
    this.hideFileLoader();

    // Save in undo stack.


    // Focus after upload.
    this.focus();

    // (filename, filelink)
    this.triggerEvent('fileUploaded', [file_name, link, response]);
  }

})(jQuery);
