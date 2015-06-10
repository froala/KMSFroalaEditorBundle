/*!
 * froala_editor v1.2.7 (https://www.froala.com/wysiwyg-editor)
 * License https://www.froala.com/wysiwyg-editor/terms
 * Copyright 2014-2015 Froala Labs
 */

(function ($) {
  $.Editable.commands = $.extend($.Editable.commands, {
    table: {
      title: 'Table',
      icon: 'fa fa-table',
      callback: function (cmd, val, param) {
        if (this.table_commands[val]) {
          this.table_commands[val].apply(this, [val, param]);
        } else {
          this.table_commands.insertTable.apply(this, [val, param]);
        }

        this.cleanupTables();
      }
    }
  });

  $.Editable.DEFAULTS.buttons[$.Editable.DEFAULTS.buttons.indexOf('insertHorizontalRule')] = 'table';

  $.Editable.prototype.table_commands = {
    insertTable: function (rows, cols) {
      this.insertTable(rows, cols);
    },

    insertRowAbove: function () {
      this.insertRow('above');
    },

    insertRowBelow: function () {
      this.insertRow('below');
    },

    insertColumnBefore: function () {
      this.insertColumn('before');
    },

    insertColumnAfter: function () {
      this.insertColumn('after');
    },

    deleteColumn: function () {
      this.deleteColumn();
    },

    deleteRow: function () {
      this.deleteRow();
    },

    insertCellBefore: function () {
      this.insertCell('before');
    },

    insertCellAfter: function () {
      this.insertCell('after');
    },

    mergeCells: function () {
      this.mergeCells();
    },

    deleteCell: function () {
      this.deleteCell();
    },

    splitVertical: function () {
      this.splitVertical();
    },

    splitHorizontal: function () {
      this.splitHorizontal();
    },

    insertHeader: function () {
      this.insertHeader();
    },

    deleteHeader: function () {
      this.deleteHeader();
    },

    deleteTable: function () {
      this.deleteTable();
    }
  };


  $.Editable.prototype.command_dispatcher = $.extend($.Editable.prototype.command_dispatcher, {
    table: function (command) {
      var dropdown = this.buildDropdownTable();
      var btn = this.buildDropdownButton(command, dropdown, 'fr-table');
      this.bindTableDropdownEvents();
      return btn;
    }
  });

  $.Editable.prototype.tableTab = function () {
    var current_cell;
    if (this.currentCell) current_cell = this.currentCell();

    var $el = $(this.getSelectionElement());
    if ($el.parents('ul, ol').length > 0) {
      return true;
    }
    else if (current_cell && this.nextCell()) {
      this.setSelection(this.nextCell());
      return false;
    }
  }

  $.Editable.prototype.tableShiftTab = function () {
    var current_cell;
    if (this.currentCell) current_cell = this.currentCell();

    var $el = $(this.getSelectionElement());
    if ($el.parents('ul, ol').length > 0) {
      return true;
    }
    else if (current_cell && this.prevCell()) {
      this.setSelection(this.prevCell());
      return false;
    }
  }

  $.Editable.prototype.initTable = function () {
    var that = this;

    this.$editor.on('click mouseup touch touchend', '.fr-table a', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (that.android()) {
        $(this).parent().siblings().removeClass('hover');
        $(this).parent().addClass('hover');
      }
    })

    this.addListener('tab', this.tableTab);
    this.addListener('shift+tab', this.tableShiftTab);
  }

  $.Editable.initializers.push($.Editable.prototype.initTable);

  /**
   * Dropdown for table.
   *
   * @param command
   * @returns {*}
   */
  $.Editable.prototype.buildDropdownTable = function () {
    var dropdown = '<ul class="fr-dropdown-menu fr-table">';

    dropdown += '<li> ' +
      '<a href="#"><span data-text="true">Insert table</span> <i class="fa fa-chevron-right"></i></a>' +
      '<div class="select-table"> ';

    dropdown += '<div class="fr-t-info">1 x 1</div>';

    for (var i = 1; i <= 10; i++) {
      for (var j = 1; j <= 10; j++) {
        var display = 'inline-block';
        if (i > 5 || j > 5) {
          display = 'none';
        }

        var cls = 'fr-bttn ';
        if (i == 1 && j == 1) {
          cls += ' hover';
        }

        dropdown += '<span class="' + cls + '" data-cmd="table" data-val="' + i + '" data-param="' + j + '" style="display: ' + display + ';"><span></span></span>';
      }
      dropdown += '<div class="new-line"></div>';
    }

    dropdown += '</div> ' +
      '</li>';
    dropdown += '<li><a href="#"><span data-text="true">Cell</span> <i class="fa fa-chevron-right"></i></a> ' +
      '<ul> ' +
        '<li data-cmd="table" data-val="insertCellBefore"><a href="#" data-text="true">Insert cell before</a></li>' +
        '<li data-cmd="table" data-val="insertCellAfter"><a href="#" data-text="true">Insert cell after</a></li>' +
        '<li data-cmd="table" data-val="deleteCell"><a href="#" data-text="true">Delete cell</a></li>' +
        '<li data-cmd="table" data-val="mergeCells"><a href="#" data-text="true">Merge cells</a></li>' +
        '<li data-cmd="table" data-val="splitHorizontal"><a href="#" data-text="true">Horizontal split</a></li>' +
        '<li data-cmd="table" data-val="splitVertical"><a href="#" data-text="true">Vertical split</a></li>' +
      '</ul></li>';
    dropdown += '<li><a href="#"><span data-text="true">Row</span> <i class="fa fa-chevron-right"></i></a> ' +
      '<ul>' +
        '<li data-cmd="table" data-val="insertRowAbove"><a href="#" data-text="true">Insert row above</a></li>' +
        '<li data-cmd="table" data-val="insertRowBelow"><a href="#" data-text="true">Insert row below</a></li>' +
        '<li data-cmd="table" data-val="deleteRow"><a href="#" data-text="true">Delete row</a></li>' +
      '</ul></li>';
    dropdown += '<li><a href="#"><span data-text="true">Column</span> <i class="fa fa-chevron-right"></i></a> ' +
      '<ul> ' +
        '<li data-cmd="table" data-val="insertColumnBefore"><a href="#" data-text="true">Insert column before</a></li> ' +
        '<li data-cmd="table" data-val="insertColumnAfter"><a href="#" data-text="true">Insert column after</a></li> ' +
        '<li data-cmd="table" data-val="deleteColumn"><a href="#" data-text="true">Delete column</a></li> ' +
      '</ul></li>';
    dropdown += '<li data-cmd="table" data-val="deleteTable"><a href="#" data-text="true">Delete table</a></li>';

    dropdown += '</ul>';

    return dropdown;
  };

  $.Editable.prototype.bindTableDropdownEvents = function () {
    var that = this;
    this.$bttn_wrapper.on('mouseenter', '.fr-table .select-table > span', function () {
      var row = $(this).data('val');
      var col = $(this).data('param');

      that.$bttn_wrapper.find('.fr-table .select-table .fr-t-info').text(row + ' x ' + col);
      that.$bttn_wrapper.find('.fr-table .select-table > span').removeClass('hover');

      for (var i = 1; i <= 10; i++) {
        for (var j = 0; j <= 10; j++) {
          var $btn = that.$bttn_wrapper.find('.fr-table .select-table > span[data-val="' + i + '"][data-param="' + j + '"]');
          if (i <= row && j <= col) {
            $btn.addClass('hover');
          } else if ((i <= row + 1 || i <= 5) && (j <= col + 1 || j <= 5)) {
            $btn.css('display', 'inline-block');
          } else if (i > 5 || j > 5) {
            $btn.css('display', 'none');
          }
        }
      }
    });

    this.$bttn_wrapper.on('mouseleave', '.fr-table .select-table', function () {
      that.$bttn_wrapper.find('.fr-table .select-table > span[data-val="1"][data-param="1"]').trigger('mouseenter');
    });

    if (this.android()) {
      this.$bttn_wrapper.on('touchend', '.fr-table .fr-trigger', function () {
        $(this).parents('.fr-table').find('.hover').removeClass('hover');
      });
    }
  };

  $.Editable.prototype.tableMap = function () {
    var $table = this.currentTable();
    var map = [];

    if ($table) {
      $table.find('tr:not(:empty)').each (function (row, tr) {
        var $tr = $(tr);

        var c_index = 0;
        $tr.find('th, td').each (function (col, td) {
          var $td = $(td);
          var cspan = parseInt($td.attr('colspan'), 10) || 1;
          var rspan = parseInt($td.attr('rowspan'), 10) || 1;

          for (var i = row; i < row + rspan; i++) {
            for (var j = c_index; j < c_index + cspan; j++) {
              if (!map[i]) map[i] = [];
              if (!map[i][j]) {
                map[i][j] = td;
              } else {
                c_index++;
              }
            }
          }

          c_index += cspan;
        })
      })
    }

    return map;
  };

  $.Editable.prototype.cellOrigin = function (td, map) {
    for (var i = 0; i < map.length; i++) {
      for (var j = 0; j < map[i].length; j++) {
        if (map[i][j] == td) {
          return {
            row: i,
            col: j
          };
        }
      }
    }
  };

  $.Editable.prototype.canMergeCells = function () {
    var tds = this.getSelectionCells();

    if (tds.length < 2) {
      return false;
    }

    var map = this.tableMap();
    var total_area = 0;
    var left_p = 32000;
    var right_p = 0;
    var top_p = 32000;
    var bottom_p = 0;

    for (var i = 0; i < tds.length; i++) {
      var $td = $(tds[i]);
      var cspan = parseInt($td.attr('colspan'), 10) || 1;
      var rspan = parseInt($td.attr('rowspan'), 10) || 1;
      var cell_origin = this.cellOrigin(tds[i], map);

      total_area += cspan * rspan;

      left_p = Math.min(left_p, cell_origin.col);
      right_p = Math.max(right_p, cell_origin.col + cspan);
      top_p = Math.min(top_p, cell_origin.row);
      bottom_p = Math.max(bottom_p, cell_origin.row + rspan);
    }

    if (total_area == (right_p - left_p) * (bottom_p - top_p)) {
      return {
        row: top_p,
        col: left_p,
        colspan: (right_p - left_p),
        rowspan: (bottom_p - top_p),
        map: map,
        cells: tds
      };
    }

    return null;
  };

  /**
   * Get the selected cells.
   */
  $.Editable.prototype.getSelectionCells = function () {
    var i;
    var tds = [];

    if (this.browser.webkit || this.browser.msie) {
      var elements = this.getSelectionElements();
      for (i = 0; i < elements.length; i++) {
        if (elements[i].tagName == 'TD' || elements[i].tagName == 'TH') {
          tds.push(elements[i]);
        }
      }
    }

    else {
      var ranges = this.getRanges();

      for (i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        var found = false;

        // Check current container.
        if (range.startContainer.tagName == 'TD' || range.startContainer.tagName == 'TH') {
          tds.push(range.startContainer);
          found = true;
        }

        // Check child nodes.
        else {
          var child_nodes = range.startContainer.childNodes;
          var start_offset = range.startOffset;

          if (child_nodes.length > start_offset && start_offset >= 0) {
            var td = child_nodes[start_offset];
            if (td.tagName == 'TD' || td.tagName == 'TH') {
              tds.push(td);
              found = true;
            }
          }
        }

        if (found === false) {
          var $parent = $(range.startContainer).parents('td:first, th:first');

          if ($parent.length > 0) {
            tds.push($parent.get(0));
          }
        }
      }
    }

    return tds;
  };

  /**
   * Get current cell.
   */
  $.Editable.prototype.currentCell = function () {
    var cells = this.getSelectionCells();
    if (cells.length > 0) {
      return cells[0];
    }

    return null;
  };

  /**
   * Get prev cell.
   */
  $.Editable.prototype.prevCell = function () {
    var cell = this.currentCell();
    if (cell) {
      if ($(cell).prev('td').length) {
        return $(cell).prev('td').get(0);
      }

      if ($(cell).parent().prev('tr').find('td').length) {
        return $(cell).parent().prev('tr').find('td:last').get(0);
      }
    }

    return null;
  };

  /**
   * Get next cell.
   */
  $.Editable.prototype.nextCell = function () {
    var cell = this.currentCell();
    if (cell) {
      if ($(cell).next('td').length) {
        return $(cell).next('td').get(0);
      }

      if ($(cell).parent().next('tr').find('td').length) {
        return $(cell).parent().next('tr').find('td').get(0);
      }
    }

    return null;
  };

  /**
   * Get current table.
   */
  $.Editable.prototype.currentTable = function () {
    var $table = $(this.getSelectionElement());

    while ($table.get(0) != this.$element.get(0) && $table.get(0) != this.$document.find('body').get(0) && $table.get(0).tagName != 'TABLE') {
      $table = $table.parent();
    }

    if ($table.get(0) != this.$element.get(0)) {
      return $table;
    }

    return null;
  }

  $.Editable.prototype.focusOnTable = function () {
    var $table = this.currentTable();
    if ($table) {
      var $first_td = $table.find('td:first');
      this.setSelection($first_td.get(0));
    }
  }

  $.Editable.prototype.insertCell = function (action) {
    var tds = this.getSelectionCells();

    for (var i = 0; i < tds.length; i++) {
      var $td = $(tds[i]);

      if (action == 'before') {
        $td.before($td.clone().removeAttr('colspan').removeAttr('rowspan').html($.Editable.INVISIBLE_SPACE));
      }

      else if (action == 'after') {
        $td.after($td.clone().removeAttr('colspan').removeAttr('rowspan').html($.Editable.INVISIBLE_SPACE));
      }
    }

    if (action == 'before') {
      this.triggerEvent('cellInsertedBefore');
    }

    else if (action == 'after') {
      this.triggerEvent('cellInsertedAfter');
    }
  }

  $.Editable.prototype.mergeCells = function () {
    var merge = this.canMergeCells();
    if (merge) {
      var $td = $(merge.map[merge.row][merge.col]);
      $td.attr('colspan', merge.colspan);
      $td.attr('rowspan', merge.rowspan);

      for (var i = 0; i < merge.cells.length; i++) {
        var cell = merge.cells[i];
        if ($td.get(0) != cell) {
          var $cell = $(cell);
          $td.append($cell.html());
          $cell.remove();
        }
      }

      this.setSelection($td.get(0));
    }

    this.hide();

    this.triggerEvent('cellsMerged');
  }

  $.Editable.prototype.deleteCell = function () {
    var tds = this.getSelectionCells();

    for (var i = 0; i < tds.length; i++) {
      var $td = $(tds[i]);
      $td.remove();
    }

    this.focusOnTable();
    this.hide();
    this.triggerEvent('cellDeleted');
  }

  $.Editable.prototype.insertHeader = function () {
    var $table = this.currentTable();

    if ($table && $table.find(' > thead').length > 0) {
      this.triggerEvent('headerInserted');
    }
  }

  $.Editable.prototype.deleteHeader = function () {

  }

  $.Editable.prototype.insertColumn = function (action) {
    var td = this.currentCell();

    if (td) {
      var $td = $(td);
      var map = this.tableMap();
      var td_origin = this.cellOrigin($td.get(0), map);

      for (var i = 0; i < map.length; i++) {
        var map_td = map[i][td_origin.col];
        var cspan = parseInt($(map_td).attr('colspan'), 10) || 1;
        var rspan = parseInt($(map_td).attr('rowspan'), 10) || 1;

        if (action == 'before') {
          var before_td = map[i][td_origin.col - 1];
          if (before_td) {
            if (before_td == map_td) {
              $(before_td).attr('colspan', cspan + 1);
            } else if (rspan > 1) {
              $(before_td).after('<' + before_td.tagName + '>' + $.Editable.INVISIBLE_SPACE + '</' + before_td.tagName + '>');
            } else {
              $(map_td).before('<' + map_td.tagName + '>' + $.Editable.INVISIBLE_SPACE + '</' + map_td.tagName + '>');
            }
          } else {
            $(map_td).before('<' + map_td.tagName + '>' + $.Editable.INVISIBLE_SPACE + '</' + map_td.tagName + '>');
          }
        } else if (action == 'after') {
          var after_td = map[i][td_origin.col + 1];
          if (after_td) {
            if (after_td == map_td) {
              $(after_td).attr('colspan', cspan + 1);
            } else if (rspan > 1) {
              $(after_td).before('<' + after_td.tagName + '>' + $.Editable.INVISIBLE_SPACE + '</' + after_td.tagName + '>');
            } else {
              $(map_td).after('<' + map_td.tagName + '>' + $.Editable.INVISIBLE_SPACE + '</' + map_td.tagName + '>');
            }
          } else {
            $(map_td).after('<' + map_td.tagName + '>' + $.Editable.INVISIBLE_SPACE + '</' + map_td.tagName + '>');
          }
        }
      }
    }

    this.hide();

    if (action == 'before') {
      this.triggerEvent('columnInsertedBefore');
    }

    else if (action == 'after') {
      this.triggerEvent('columnInsertedAfter');
    }
  }

  $.Editable.prototype.deleteColumn = function () {
    var tds = this.getSelectionCells();

    for (var j = 0; j < tds.length; j++) {
      var $td = $(tds[j]);
      var map = this.tableMap();
      var td_origin = this.cellOrigin($td.get(0), map);

      for (var i = 0; i < map.length; i++) {
        var map_td = map[i][td_origin.col];
        var cspan = parseInt($(map_td).attr('colspan'), 10) || 1;

        if (cspan == 1) {
          $(map_td).remove();
        } else {
          $(map_td).attr('colspan', cspan - 1);
        }
      }
    }

    this.focusOnTable();
    this.hide();

    this.triggerEvent('columnDeleted');
  };

  $.Editable.prototype.insertRow = function (action) {
    var i;
    var td = this.currentCell();

    if (td) {
      var $td = $(td);
      var map = this.tableMap();
      var td_origin = this.cellOrigin($td.get(0), map);

      var cell_no = 0;
      var last_td = null;
      for (i = 0; i < map[td_origin.row].length; i++) {
        var map_td = map[td_origin.row][i];
        var rspan = parseInt($(map_td).attr('rowspan'), 10) || 1;

        if (action == 'above') {
          // First row.
          if (td_origin.row === 0) {
            cell_no++;
          }
          else {
            var above_td = map[td_origin.row - 1][i];

            // Rowspan.
            if (above_td == map_td && last_td != map_td) {
              $(map_td).attr('rowspan', rspan + 1);
            } else {
              cell_no++;
            }
          }
        } else if (action == 'below') {
          // Last row.
          if (td_origin.row == map.length - 1) {
            cell_no++;
          }
          else {
            var below_td = map[td_origin.row + 1][i];

            // Rowspan.
            if (below_td == map_td && last_td != map_td) {
              $(map_td).attr('rowspan', rspan + 1);
            } else {
              cell_no++;
            }
          }
        }

        last_td = map[td_origin.row][i];
      }

      var tr = '<tr>';
      for (i = 0; i < cell_no; i++) {
        tr += '<td>' + $.Editable.INVISIBLE_SPACE + '</td>';
      }
      tr += '</tr>';

      if (action == 'below') {
        $td.closest('tr').after(tr);
      }
      else if (action == 'above') {
        $td.closest('tr').before(tr);
      }
    }

    this.hide();

    if (action == 'below') {
      this.triggerEvent('rowInsertedBelow');
    }
    else if (action == 'above') {
      this.triggerEvent('rowInsertedAbove');
    }
  }

  $.Editable.prototype.deleteRow = function () {
    var tds = this.getSelectionCells();

    for (var j = 0; j < tds.length; j++) {
      var $td = $(tds[j]);
      var map = this.tableMap();
      var td_origin = this.cellOrigin($td.get(0), map);
      var $tr = $td.parents('tr:first');

      if (td_origin) {
        for (var i = 0; i < map[td_origin.row].length; i++) {
          var map_td = map[td_origin.row][i];
          var rspan = parseInt($(map_td).attr('rowspan'), 10) || 1;

          if (rspan == 1) {
            $(map_td).remove()
          } else {
            var map_td_origin = this.cellOrigin(map_td, map);
            $(map_td).attr('rowspan', rspan - 1);

            if (map_td_origin.row == td_origin.row) {
              var next_row = map[td_origin.row + 1];
              if (next_row) {
                if (next_row[ i - 1]) {
                  $(next_row[i - 1]).after($(map_td).clone())
                  $(map_td).remove()
                }
              }
            }
          }
        }
      }

      $tr.remove();
    }

    this.focusOnTable();
    this.hide();

    this.triggerEvent('rowDeleted');
  }

  $.Editable.prototype.splitVertical = function () {
    var tds = this.getSelectionCells();

    for (var j = 0; j < tds.length; j++) {
      var $td = $(tds[j]);
      var map = this.tableMap();
      var td_origin = this.cellOrigin($td.get(0), map);
      var cspan = parseInt($td.attr('colspan'), 10) || 1;
      var rspan = parseInt($td.attr('rowspan'), 10) || 1;

      if (rspan > 1) {
        var insert_row_rspan = Math.floor(rspan / 2);
        var insert_row = td_origin.row + (rspan - insert_row_rspan);

        var row_td = map[insert_row][td_origin.col - 1];
        if (!row_td) {
          row_td = map[insert_row][td_origin.col + cspan];
        }

        if (row_td) {
          $(row_td).before($td.clone().attr('rowspan', insert_row_rspan).html($.Editable.INVISIBLE_SPACE))
        } else {
          $td.parents('tr:first').after($('<tr>').append($td.clone().attr('rowspan', insert_row_rspan).html($.Editable.INVISIBLE_SPACE)));
        }

        $td.attr('rowspan', rspan - insert_row_rspan);

      } else {
        var $new_tr = $('<tr>').append($td.clone().html($.Editable.INVISIBLE_SPACE));

        var last_td = null;
        for (var i = 0; i < map[td_origin.row].length; i++) {
          var map_td = map[td_origin.row][i];
          var crspan = parseInt($(map_td).attr('rowspan'), 10) || 1;
          if (last_td != map_td && map_td != $td.get(0)) {
            $(map_td).attr('rowspan', crspan + 1);
          }

          last_td = map_td;
        }

        $td.parents('tr:first').after($new_tr);
      }
    }

    this.hide();

    this.triggerEvent('cellVerticalSplit');
  };

  $.Editable.prototype.splitHorizontal = function () {
    var tds = this.getSelectionCells();

    for (var j = 0; j < tds.length; j++) {
      var $td = $(tds[j]);
      var map = this.tableMap();
      var td_origin = this.cellOrigin($td.get(0), map);
      var cspan = parseInt($td.attr('colspan'), 10) || 1;

      if (cspan > 1) {
        var insert_td_cspan = Math.floor(cspan / 2);
        $td.after($td.clone().attr('colspan', insert_td_cspan).html($.Editable.INVISIBLE_SPACE));
        $td.attr('colspan', cspan - insert_td_cspan);
      } else {
        var last_td = null;
        for (var i = 0; i < map.length; i++) {
          var map_td = map[i][td_origin.col];
          var ccspan = parseInt($(map_td).attr('colspan'), 10) || 1;

          if (last_td != map_td && map_td != $td.get(0)) {
            $(map_td).attr('colspan', ccspan + 1);
          }

          last_td = map_td;
        }

        $td.after($td.clone().html($.Editable.INVISIBLE_SPACE))
      }
    }

    this.hide();

    this.triggerEvent('cellHorizontalSplit');
  };

  /**
   * Insert table.
   */
  $.Editable.prototype.insertTable = function (rows, cols) {
    var table = '<table data-last-table="true" width="100%">';
    for (var i = 0; i < rows; i++) {
      table += '<tr>';
      for (var j = 0; j < cols; j++) {
        table += '<td>' + $.Editable.INVISIBLE_SPACE + '</td>';
      }
      table += '</tr>';
    }
    table += '</table>';

    this.focus();
    var el = this.getSelectionElement();
    this.breakHTML(table, this.parents($(el), 'li').length < 0);

    var $table = this.$element.find('table[data-last-table="true"]');
    $table.removeAttr('data-last-table');
    this.setSelection($table.find('td:first').get(0));
    this.hide();

    this.triggerEvent('tableInserted');
  }

  $.Editable.prototype.deleteTable = function () {
    var $table = this.currentTable();

    if ($table) {
      $table.remove();
      this.focus();
      this.hide();
      this.triggerEvent('tableDeleted');
    }
  }

  $.Editable.prototype.cleanupTables = function () {
    this.$element.find('td[colspan="1"], th[colspan="1"]').each (function () {
      $(this).removeAttr('colspan');
    });

    this.$element.find('td[rowspan="1"], th[rowspan="1"]').each (function () {
      $(this).removeAttr('rowspan');
    });
  }

})(jQuery);
