/*!
 * froala_editor v1.2.7 (https://www.froala.com/wysiwyg-editor)
 * License https://www.froala.com/wysiwyg-editor/terms
 * Copyright 2014-2015 Froala Labs
 */

(function ($) {
  $.Editable.commands = $.extend($.Editable.commands, {
    insertOrderedList: {
      title: 'Numbered List',
      icon: 'fa fa-list-ol',
      refresh: function () {},
      callback: function (cmd) {
        this.formatList(cmd);
      },
      undo: true
    },

    insertUnorderedList: {
      title: 'Bulleted List',
      icon: 'fa fa-list-ul',
      refresh: function () {},
      callback: function (cmd) {
        this.formatList(cmd);
      },
      undo: true
    }
  });

  $.Editable.prototype.refreshLists = function () {
    var $element = $(this.getSelectionElement());

    var $parents = this.parents($element, 'ul, ol');
    if ($parents.length > 0) {

      var cmd = 'insertUnorderedList';
      if ($parents[0].tagName == 'OL') {
        cmd = 'insertOrderedList';
      }

      this.$editor.find('button[data-cmd="' + cmd + '"]').addClass('active');
    }
  }

  $.Editable.prototype.processBackspace = function ($li) {
    var $prev_li = $li.prev();

    if ($prev_li.length) {
      this.removeMarkers();

      // There is an UL or OL before. Join with the last li.
      if ($prev_li.get(0).tagName == 'UL' || $prev_li.get(0).tagName == 'OL') {
        $prev_li = $prev_li.find('li:last');
      }

      // Check if previous li has a list.
      while ($prev_li.find('> ul, > ol').length) {
        $prev_li = $prev_li.find('> ul li:last, > ol li:last');
      }

      // Search for blocks inside the previous LI.
      var blocks = $prev_li.find('> p, > h1, > h3, > h4, > h5, > h6, > div, > pre, > blockquote');
      if ($prev_li.text().length === 0 && $prev_li.find('img, table, input, iframe, video').length === 0) {
        $prev_li.remove();
      }
      else {
        // Do that only when the previous LI is not empty.
        if (!this.emptyElement($prev_li.get(0))) {
          this.keep_enter = true;
          $li.find('> p, > h1, > h3, > h4, > h5, > h6, > div, > pre, > blockquote').each (function (index, el) {
            $(el).replaceWith($(el).html());
          })
          this.keep_enter = false;
        }

        // There are blocks inside the previous LI.
        if (blocks.length) {
          // Place cursor at the end of the previous LI.
          $(blocks[blocks.length - 1]).append(this.markers_html);

          // No nested list.
          if ($li.find('ul, ol').length === 0) {
            $(blocks[blocks.length - 1]).append($li.html());
          }
          else {
            var add_after = false;
            var contents = $li.contents();
            for (var i = 0; i < contents.length; i++) {
              var nd = contents[i];

              if (['OL', 'UL'].indexOf(contents[i].tagName) >= 0) add_after = true;

              if (!add_after) {
                $(blocks[blocks.length - 1]).append(nd);
              }
              else {
                $(blocks[blocks.length - 1]).after(nd);
              }
            }

            this.$element.find('breakli').remove();
            var ns = blocks[blocks.length - 1].nextSibling;
            if (ns && ns.tagName == 'BR') {
              $(ns).remove();
            }
          }
        } else {
          if (!this.emptyElement($prev_li.get(0))) {
            $prev_li.append(this.markers_html);
            $prev_li.append($li.html());
          }
          else {
            this.$element.find('breakli').replaceWith(this.markers_html);
            $prev_li.html($li.html())
          }
        }

        $li.remove();

        this.cleanupLists();
        this.restoreSelectionByMarkers();
      }
      this.$element.find('breakli').remove();
    } else {
      this.$element.find('breakli').remove();

      if (this.parents($li, 'ul').length) {
        this.formatList('insertUnorderedList', false);
      } else {
        this.formatList('insertOrderedList', false);
      }
    }

    this.sync();
  }

  $.Editable.prototype.liBackspace = function () {
    // There is text in li.
    if (this.text() !== '') return true;

    var $li;
    var element = this.getSelectionElement();

    // We are in table. Resume default action.
    var possible_parents = this.parents($(element), 'table, li');
    if (possible_parents.length > 0 && possible_parents[0].tagName === 'TABLE') {
      return true;
    }

    if (element.tagName == 'LI') {
      $li = $(element);
    } else {
      $li = this.parents($(element), 'li:first');
    }

    this.removeMarkers();
    if (this.emptyElement($li.get(0))) {
      $li.prepend('<breakli></breakli>');

      if ($li.find('br').length == 1) $li.find('br').remove();
    }
    else {
      this.insertHTML('<breakli></breakli>');
    }

    if ($li.find('breakli').prev().length && $li.find('breakli').prev().get(0).tagName === 'TABLE') {
      if ($li.find('breakli').next().length && $li.find('breakli').next().get(0).tagName === 'BR') {
        this.setSelection($li.find('breakli').prev().find('td:first').get(0));

        $li.find('breakli').next().remove();

        this.$element.find('breakli').remove();
        return false;
      }
    }

    var html = $li.html();
    var tag;
    var li_html = [];

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
          if (tag_name == 'breakli') {
            if (!this.isClosingTag(tag)) {
              if (!this.isClosingTag(li_html[li_html.length - 1])) {
                this.processBackspace($li);
                return false;
              }
            }
          } else {
            li_html.push(tag);
          }
        }
      } else {
        this.$element.find('breakli').remove();
        return true;
      }
    }

    this.$element.find('breakli').remove();
    return true;
  }

  $.Editable.prototype.textLiEnter = function ($li) {
    this.removeMarkers();
    this.insertSimpleHTML('<breakli></breakli>', false);

    var html = $li.html();
    var tag;
    var open_tags = [];
    var tag_indexes = {};
    var li_html = [];
    var chars = 0;
    var i;

    var attrs = $li.prop('attributes');
    var props = '';
    for (i = 0; i < attrs.length; i++) props += ' ' + attrs[i].name + '="' + attrs[i].value + '"';

    var last_is_char = false;
    for (i = 0; i < html.length; i++) {
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
          if (tag_name == 'breakli') {
            if (!this.isClosingTag(tag)) {
              for (var k = open_tags.length - 1; k >= 0; k--) {
                var open_tag_name = this.tagName(open_tags[k]);

                li_html.push('</' + open_tag_name + '>');
              }

              li_html.push('</li>');
              li_html.push('<li' + props + '>');

              for (var p = 0; p < open_tags.length; p++) {
                li_html.push(open_tags[p]);
              }

              li_html.push('<span class="f-marker" data-type="false" data-collapsed="true" data-id="0" data-fr-verified="true"></span><span class="f-marker" data-type="true" data-collapsed="true" data-id="0" data-fr-verified="true"></span>');
              last_is_char = false;
            }
          } else {
            li_html.push(tag);
            last_is_char = false;

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
        if (chr.charCodeAt(0) == 32 && !last_is_char) {
          li_html.push('&nbsp;');
        }
        else {
          li_html.push(chr);
          last_is_char = true;
        }
      }
    }

    var $li_parent = $($li.parents('ul, ol')[0]);
    $li.replaceWith('<li' + props + '>' + li_html.join('') + '</li>');

    // Make tables consistent in p.
    $li_parent.find('p:empty + table').prev().remove();

    $li_parent.find('p + table').each (function (index, table) {
      var $table = $(table);
      $table.prev().append($table.clone())
      $table.remove();
    })

    $li_parent.find('table + p').each (function (index, p) {
      var $p = $(p);
      $p.append($p.prev().clone())
      $p.prev().remove();
    })

    // Empty elements add invisible space.
    this.keep_enter = true;
    $li_parent.find(this.valid_nodes.join(',')).each ($.proxy(function (index, el) {
      if ($(el).text().trim() === '' && $(el).find(this.valid_nodes.join(',')).length === 0) {
        $(el).prepend($.Editable.INVISIBLE_SPACE);
      }
    }, this));
    this.keep_enter = false;
  }

  $.Editable.prototype.liEnter = function () {
    var $li;
    var element = this.getSelectionElement();

    // We are in table. Resume default action.
    var possible_parents = this.parents($(element), 'table, li')
    if (possible_parents.length > 0 && possible_parents[0].tagName == 'TABLE') {
      return true;
    }

    if (element.tagName == 'LI') {
      $li = $(element);
    } else {
      $li = this.parents($(element), 'li:first');
    }

    if (this.getSelectionTextInfo($li.get(0)).atStart && this.text() === '') {
      $li.before('<li>' + $.Editable.INVISIBLE_SPACE + '</li>');
    }
    else {
      if (this.trim($li.text()).length === 0 && $li.find('img, table, iframe, input, object').length === 0) {
        this.outdent(false);
        return false;
      } else {
        this.textLiEnter($li);
      }

      this.$element.find('breakli').remove();

      this.restoreSelectionByMarkers();
    }

    this.sync();

    return false;
  }

  $.Editable.prototype.listTab = function () {
    var $el = $(this.getSelectionElement());
    if (this.parents($el, 'ul, ol').length > 0 && this.parents($el, 'table').length === 0) {
      this.indent();

      return false;
    }
  }

  $.Editable.prototype.listShiftTab = function () {
    var $el = $(this.getSelectionElement());
    if (this.parents($el, 'ul, ol').length > 0 && this.parents($el, 'table').length === 0) {
      this.outdent();

      return false;
    }
  }

  $.Editable.prototype.indentList = function ($element, outdent) {
    if ($element.get(0).tagName === 'LI') {
      if (!outdent) {
        this.indentLi($element);
      }
      else {
        this.outdentLi($element);
      }

      this.cleanupLists();

      return false;
    }

    return true;
  }

  $.Editable.prototype.initList = function () {
    this.addListener('tab', this.listTab);
    this.addListener('shift+tab', this.listShiftTab);
    this.addListener('refresh', this.refreshLists);
    this.addListener('indent', this.indentList);

    if (!this.isImage && !this.isLink && !this.options.editInPopup) {
      this.$element.on('keydown', $.proxy(function (e) {
        if (['TEXTAREA', 'INPUT'].indexOf(e.target.tagName) < 0) {
          if (!this.isHTML) {
            var keyCode = e.which;

            var element = this.getSelectionElement();

            if (element.tagName == 'LI' || this.parents($(element), 'li').length > 0) {
              if (keyCode == 13 && !e.shiftKey && this.options.multiLine) {
                return this.liEnter();
              }

              if (keyCode == 8) {
                return this.liBackspace();
              }
            }
          }
        }
      }, this));
    }
  };

  $.Editable.initializers.push($.Editable.prototype.initList);

  /**
   * Format list.
   *
   * @param val
   */
  $.Editable.prototype.formatList = function (cmd, reposition) {
    if (this.browser.msie && $.Editable.getIEversion() < 9) {
      document.execCommand(cmd, false, false);
      return false;
    }

    if (reposition === undefined) reposition = true;

    var tag_name;
    var replace_list = false;
    var all = true;
    var replaced = false;

    var $element;
    var elements = this.getSelectionElements();

    // Check if lists should be replaced.
    var $parents = this.parents($(elements[0]), 'ul, ol');
    if ($parents.length) {
      if ($parents[0].tagName === 'UL') {
        if (cmd != 'insertUnorderedList') {
          replace_list = true;
        }
      } else {
        if (cmd != 'insertOrderedList') {
          replace_list = true;
        }
      }
    }

    this.saveSelectionByMarkers();

    if (replace_list) {
      tag_name = 'ol';
      if (cmd === 'insertUnorderedList') tag_name = 'ul';
      var $list = $($parents[0]);
      $list.replaceWith('<' + tag_name + '>' + $list.html() + '</' + tag_name + '>');
    }

    else {
      // Clean elements.
      for (var i = 0; i < elements.length; i++) {
        $element = $(elements[i]);

        // Wrap
        if ($element.get(0).tagName == 'TD' || $element.get(0).tagName == 'TH') {
          this.wrapTextInElement($element);
        }

        // Check if current element rezides in LI.
        if (this.parents($element, 'li').length > 0 || $element.get(0).tagName == 'LI') {
          var $li;
          if ($element.get(0).tagName == 'LI') {
            $li = $element;
          }
          else {
            $li = $($element.parents('li')[0]);
          }

          // Mark where to close and open again ol.
          var $p_list = this.parents($element, 'ul, ol');
          if ($p_list.length > 0) {
            tag_name = $p_list[0].tagName.toLowerCase();
            $li.before('<span class="close-' + tag_name + '" data-fr-verified="true"></span>');
            $li.after('<span class="open-' + tag_name + '" data-fr-verified="true"></span>');
          }

          if (this.parents($($p_list[0]), 'ol, ul').length === 0 || replace_list) {
            if ($li.find(this.valid_nodes.join(',')).length === 0) {
              var ht = $li.html().replace(/\u200B/gi, '');
              if (!this.options.paragraphy) {
                ht += $li.find('br').length > 0 ? '' : this.br;
              }
              else {
                if ($li.text().replace(/\u200B/gi, '').length === 0) {
                  ht += $li.find('br').length > 0 ? '' : this.br;
                }
                ht = '<' + this.options.defaultTag + this.attrs($li.get(0)) + '>' + ht;
                ht = ht + '</' + this.options.defaultTag + '>';
              }

              $li.replaceWith(ht);
            } else {
              $li.replaceWith($li.html().replace(/\u200B/gi, ''));
            }
          }

          replaced = true;
        }

        else {
          all = false;
        }
      }

      if (replaced) {
        this.cleanupLists();
      }

      if (all === false || replace_list === true) {
        this.wrapText();

        this.restoreSelectionByMarkers();

        elements = this.getSelectionElements();

        this.saveSelectionByMarkers();

        this.elementsToList(elements, cmd);

        this.unwrapText();

        this.cleanupLists();
      }
    }

    if (this.options.paragraphy && !replace_list) this.wrapText(true);

    this.restoreSelectionByMarkers();

    if (reposition) this.repositionEditor();

    if (cmd == 'insertUnorderedList') {
      cmd = 'unorderedListInserted';
    } else {
      cmd = 'orderedListInserted';
    }

    this.triggerEvent(cmd);
  };

  $.Editable.prototype.elementsToList = function (elements, cmd) {
    var list_tag = '<ol>';
    if (cmd == 'insertUnorderedList') {
      list_tag = '<ul>';
    }

    if (elements[0] == this.$element.get(0)) {
      elements = this.$element.find('> ' + this.valid_nodes.join(', >'));
    }

    for (var j = 0; j < elements.length; j++) {
      var $list = $(list_tag);

      $element = $(elements[j]);

      // Main element skip.
      if ($element.get(0) == this.$element.get(0)) {
        continue;
      }

      // Table cell.
      if ($element.get(0).tagName === 'TD' || $element.get(0).tagName === 'TH') {
        this.wrapTextInElement($element, true);
        this.elementsToList($element.find('> ' + this.valid_nodes.join(', >')), cmd);
      }

      // Other.
      else {
        // Append cloned list.
        if ($element.attr('class') === '') $element.removeAttr('class');
        if ($element.get(0).tagName == this.options.defaultTag && $element.get(0).attributes.length === 0) {
          $list.append($('<li>').html($element.clone().html()));
        }
        else {
          $list.append($('<li>').html($element.clone()));
        }

        $element.replaceWith($list);
      }
    }
  }

  $.Editable.prototype.indentLi = function ($li) {
    var $list = $li.parents('ul, ol');
    var tag_name = $list.get(0).tagName.toLowerCase();

    if ($li.find('> ul, > ol').length > 0 && $li.prev('li').length > 0) {
      this.wrapTextInElement($li);
      $li.find('> ' + this.valid_nodes.join(' , > ')).each (function (i, el) {
        $(el).wrap('<' + tag_name + '></' + tag_name + '>').wrap('<li></li>');
      });

      $li.prev('li').append($li.find('> ul, > ol'))
      $li.remove()
    }
    else if ($li.find('> ul, > ol').length === 0 && $li.prev('li').length > 0) {
      $li.prev().append($('<' + tag_name + '>').append($li.clone()));
      $li.remove();

      $($list.find('li').get().reverse()).each(function (i, el) {
        var $el = $(el);
        if ($el.find(' > ul, > ol').length > 0) {
          if ($el.prev() && $el.prev().find(' > ul, > ol').length > 0 && $el.contents().length === 1) {
            $el.prev().append($el.html())
            $el.remove();
          }
        }
      });
    }
  }

  $.Editable.prototype.outdentLi = function ($li) {
    var $list = $($li.parents('ul, ol')[0]);
    var $list_parent = this.parents($list, 'ul, ol');

    var tag_name = $list.get(0).tagName.toLowerCase();

    // The first li in a nested list.
    if ($li.prev('li').length === 0 && this.parents($li, 'li').length > 0) {
      $li.before('<span class="close-' + tag_name + '" data-fr-verified="true"></span>');
      $li.before('<span class="close-li" data-fr-verified="true"></span>');
      $li.before('<span class="open-li" data-fr-verified="true"></span>');
      $li.after('<span class="open-' + tag_name + '" data-fr-verified="true"></span>');
      $li.replaceWith($li.html());
    }
    else {
      $li.before('<span class="close-' + tag_name + '" data-fr-verified="true"></span>');
      $li.after('<span class="open-' + tag_name + '" data-fr-verified="true"></span>');

      // Nested list item.
      if (this.parents($li, 'li').length > 0) {
        $li.before('<span class="close-li" data-fr-verified="true"></span>');
        $li.after('<span class="open-li" data-fr-verified="true"></span>');
      }
    }

    // First item in list.
    if (!$list_parent.length) {
      if ($li.find(this.valid_nodes.join(',')).length === 0) {
        $li.replaceWith($li.html().replace(/\u200b/gi, '') + this.br);
      } else {
        $li.find(this.valid_nodes.join(', ')).each($.proxy(function (i, el) {
          if (this.emptyElement(el)) $(el).append(this.br);
        }, this));
        $li.replaceWith($li.html().replace(/\u200b/gi, ''));
      }
    }
  }

  $.Editable.prototype.listTextEmpty = function (element) {
    var text = $(element).text().replace(/(\r\n|\n|\r|\t|\u200B)/gm, '');

    return (text === '' || element === this.$element.get(0)) && $(element).find('br').length === 1;
  }
})(jQuery);
