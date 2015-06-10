/*!
 * froala_editor v1.2.7 (https://www.froala.com/wysiwyg-editor)
 * License https://www.froala.com/wysiwyg-editor/terms
 * Copyright 2014-2015 Froala Labs
 */

(function ($) {
  $.Editable.DEFAULTS = $.extend($.Editable.DEFAULTS, {
    entities: '&quot;&apos;&iexcl;&cent;&pound;&curren;&yen;&brvbar;&sect;&uml;&copy;&ordf;&laquo;&not;&shy;&reg;&macr;&deg;&plusmn;&sup2;&sup3;&acute;&micro;&para;&middot;&cedil;&sup1;&ordm;&raquo;&frac14;&frac12;&frac34;&iquest;&Agrave;&Aacute;&Acirc;&Atilde;&Auml;&Aring;&AElig;&Ccedil;&Egrave;&Eacute;&Ecirc;&Euml;&Igrave;&Iacute;&Icirc;&Iuml;&ETH;&Ntilde;&Ograve;&Oacute;&Ocirc;&Otilde;&Ouml;&times;&Oslash;&Ugrave;&Uacute;&Ucirc;&Uuml;&Yacute;&THORN;&szlig;&agrave;&aacute;&acirc;&atilde;&auml;&aring;&aelig;&ccedil;&egrave;&eacute;&ecirc;&euml;&igrave;&iacute;&icirc;&iuml;&eth;&ntilde;&ograve;&oacute;&ocirc;&otilde;&ouml;&divide;&oslash;&ugrave;&uacute;&ucirc;&uuml;&yacute;&thorn;&yuml;&OElig;&oelig;&Scaron;&scaron;&Yuml;&fnof;&circ;&tilde;&Alpha;&Beta;&Gamma;&Delta;&Epsilon;&Zeta;&Eta;&Theta;&Iota;&Kappa;&Lambda;&Mu;&Nu;&Xi;&Omicron;&Pi;&Rho;&Sigma;&Tau;&Upsilon;&Phi;&Chi;&Psi;&Omega;&alpha;&beta;&gamma;&delta;&epsilon;&zeta;&eta;&theta;&iota;&kappa;&lambda;&mu;&nu;&xi;&omicron;&pi;&rho;&sigmaf;&sigma;&tau;&upsilon;&phi;&chi;&psi;&omega;&thetasym;&upsih;&piv;&ensp;&emsp;&thinsp;&zwnj;&zwj;&lrm;&rlm;&ndash;&mdash;&lsquo;&rsquo;&sbquo;&ldquo;&rdquo;&bdquo;&dagger;&Dagger;&bull;&hellip;&permil;&prime;&Prime;&lsaquo;&rsaquo;&oline;&frasl;&euro;&image;&weierp;&real;&trade;&alefsym;&larr;&uarr;&rarr;&darr;&harr;&crarr;&lArr;&uArr;&rArr;&dArr;&hArr;&forall;&part;&exist;&empty;&nabla;&isin;&notin;&ni;&prod;&sum;&minus;&lowast;&radic;&prop;&infin;&ang;&and;&or;&cap;&cup;&int;&there4;&sim;&cong;&asymp;&ne;&equiv;&le;&ge;&sub;&sup;&nsub;&sube;&supe;&oplus;&otimes;&perp;&sdot;&lceil;&rceil;&lfloor;&rfloor;&lang;&rang;&loz;&spades;&clubs;&hearts;&diams;'
  });

  $.Editable.prototype.encodeEntities = function (e, editor, html) {
    var encoded_html = '';

    // Iterate through the html.
    for (i = 0; i < html.length; i++) {
      chr = html.charAt(i);

      // Tag start.
      if (chr == '<') {
        // Tag end.
        var j = html.indexOf('>', i + 1);
        if (j !== -1) {
          // Get tag.
          var tag = html.substring(i, j + 1);
          encoded_html += tag;

          // Update i position.
          i = j;
        }
      }

      else {
        if (editor.entities_map[chr]) {
          encoded_html += editor.entities_map[chr];
        }
        else {
          encoded_html += chr;
        }
      }
    }

    return encoded_html;
  }

  $.Editable.prototype.initEntities = function () {
    // Do escape.
    var entities_text = $('<div>').html(this.options.entities).text();
    var entities_array = this.options.entities.split(';');
    this.entities_reg_exp = new RegExp(entities_text, 'g');
    this.entities_map = {};
    for (var i = 0; i < entities_text.length; i++) {
      var chr = entities_text.charAt(i);
      this.entities_map[chr] = entities_array[i] + ';';
    }

    this.$original_element.on('editable.getHTML', this.encodeEntities);
  }

  $.Editable.initializers.push($.Editable.prototype.initEntities);
})(jQuery);
