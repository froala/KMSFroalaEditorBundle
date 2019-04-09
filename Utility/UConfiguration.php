<?php

	namespace KMS\FroalaEditorBundle\Utility;

	use Symfony\Component\Config\Definition\Builder\NodeBuilder;


	/**
	 * Class UConfiguration
	 * @package KMS\FroalaEditorBundle\Utility
	 */
	abstract class UConfiguration
	{

		public static $OPTIONS_BOOLEAN = array(
			"autofocus"                      => null, //
			"charCounterCount"               => null, //
			"codeBeautifier"                 => null, //
			"codeMirror"                     => null, //
			"disableRightClick"              => null, //
			"documentReady"                  => null, //
			"editInPopup"                    => null, //
			"editorClass"                    => null, //
			"emoticonsUseImage"              => null, //
			"fileUpload"                     => null, //
			"fileUseSelectedText"            => null, //
			"fontFamilySelection"            => null, //
			"fontSizeSelection"              => null, //
			"fullPage"                       => null, //
			"htmlAllowComments"              => null, //
			"htmlExecuteScripts"             => null, //
			"htmlSimpleAmpersand"            => null, //
			"htmlUntouched"                  => null, //
			"iframe"                         => null, //
			"imageAddNewLine"                => null, //
			"imageMove"                      => null, //
			"imageMultipleStyles"            => null, //
			"imagePaste"                     => null, //
			"imageResize"                    => null, //
			"imageResizeWithPercent"         => null, //
			"imageRoundPercent"              => null, //
			"imageSplitHTML"                 => null, //
			"imageTextNear"                  => null, //
			"imageUpload"                    => null, //
			"imageUploadRemoteUrls"          => null, //
			"imageOutputSize"                => null, //
			"imagePasteProcess"              => null, //
			"initOnClick"                    => null, //
			"keepFormatOnDelete"             => null, //
			"linkAlwaysBlank"                => null, //
			"linkAlwaysNoFollow"             => null, //
			"linkConvertEmailAddress"        => null, //
			"linkMultipleStyles"             => null, //
			"linkNoOpener"                   => null, //
			"linkNoReferrer"                 => null, //
			"linkText"                       => null, //
			"listAdvancedTypes"              => null, //
			"multiLine"                      => null, //
			"paragraphDefaultSelection"      => null, //
			"paragraphFormatSelection"       => null, //
			"paragraphMultipleStyles"        => null, //
			"pasteAllowLocalImages"          => null, //
			"pastePlain"                     => null, //
			"requestWithCredentials"         => null, //
			"requestWithCORS"                => null, //
			"shortcutsHint"                  => null, //
			"spellcheck"                     => null, //
			"tableCellMultipleStyles"        => null, //
			"tableMultipleStyles"            => null, //
			"tableResizer"                   => null, //
			"toolbarBottom"                  => null, //
			"toolbarContainer"               => null, //
			"toolbarInline"                  => null, //
			"toolbarSticky"                  => null, //
			"toolbarVisibleWithoutSelection" => null, //
			"tooltips"                       => null, //
			"useClasses"                     => null, //
			"videoMove"                      => null, //
			"videoResize"                    => null, //
			"videoResponsive"                => null, //
			"videoSplitHTML"                 => null, //
			"videoTextNear"                  => null, //
			"videoUpload"                    => null, //
			"wordPasteKeepFormatting "       => null, //
			"wordPasteModal"                 => null
		);

		public static $OPTIONS_BOOLEAN_CUSTOM = array(
			"includeJS"          => true, //
			"includeCSS"         => true, //
			"includeJQuery"      => true, //
			"includeFontAwesome" => true, //
			"includeCodeMirror"  => true
		);

		public static $OPTIONS_INTEGER = array(
			"charCounterMax"           => null, //
			"colorsStep"               => null, //
			"emoticonsStep"            => null, //
			"fileMaxSize"              => null, //
			"height"                   => null, //
			"heightMax"                => null, //
			"heightMin"                => null, //
			"imageDefaultWidth"        => null, //
			"imageManagerPageSize"     => null, //
			"imageManagerScrollOffset" => null, //
			"imageMaxSize"             => null, //
			"imageMinWidth"            => null, //
			"indentMargin"             => null, //
			"lineBreakerOffset"        => null, //
			"saveInterval"             => null, //
			"tabIndex"                 => null, //
			"tabSpaces"                => null, //
			"tableColorsStep"          => null, //
			"tableInsertMaxSize"       => null, //
			"tableResizerOffset"       => null, //
			"tableResizingLimit"       => null, //
			"toolbarStickyOffset"      => null, //
			"typingTimer"              => null, //
			"videoDefaultWidth"        => null, //
			"videoMaxSize"             => null, //
			"zIndex"                   => null
		);

		public static $OPTIONS_STRING = array(
			"aviaryKey"                => null, //
			"colorsDefaultTab"         => null, //
			"direction"                => null, //
			"embedlyScriptPath"        => null, //
			"enter"                    => null, //
			"entities"                 => null, //
			"fileUploadMethod"         => null, //
			"fileUploadParam"          => null, //
			"fileUploadURL"            => "kms_froala_editor_upload_file", //
			"fontSizeUnit"             => null, //
			"iconsTemplate"            => null, //
			"iframeDefaultStyle"       => null, //
			"iframeStyle"              => null, //
			"imageCORSProxy"           => null, //
			"imageDefaultAlign"        => null, //
			"imageDefaultDisplay"      => null, //
			"imageManagerDeleteMethod" => null, //
			"imageManagerDeleteURL"    => "kms_froala_editor_delete_image", //
			"imageManagerLoadMethod"   => null, //
			"imageManagerLoadURL"      => "kms_froala_editor_load_images", //
			"imageManagerPreloader"    => null, //
			"imageUploadMethod"        => null, //
			"imageUploadParam"         => null, //
			"imageUploadURL"           => "kms_froala_editor_upload_image", //
			"language"                 => null, //
			"linkAutoPrefix"           => null, //
			"placeholderText"          => null, //
			"saveMethod"               => null, //
			"saveParam"                => null, //
			"saveURL"                  => null, //
			"scaytCustomerId"          => null, //
			"scrollableContainer"      => null, //
			"tableDefaultWidth"        => null, //
			"theme"                    => null, //
			"videoDefaultAlign"        => null, //
			"videoDefaultDisplay"      => null, //
			"videoUploadMethod"        => null, //
			"videoUploadParam"         => null, //
			"videoUploadURL"           => "kms_froala_editor_upload_video", //
			"width"                    => null
		);

		public static $OPTIONS_STRING_CUSTOM = array(
			"customJS"          => null, //
			"basePath"          => "/bundles/kmsfroalaeditor/froala_editor_2.9.4", //
			"imageUploadFolder" => "/upload", //
			"imageUploadPath"   => null, //
			"fileUploadFolder"  => "/upload", //
			"fileUploadPath"    => null, //
			"serialNumber"      => null, //
			"videoUploadFolder" => "/upload", //
			"videoUploadPath"   => null,
			"publicDir"         => "/web",
		);

		public static $OPTIONS_ARRAY = array(
			"codeViewKeepActiveButtons" => array(), //
			"colorsBackground"          => array(), //
			"colorsText"                => array(), //
			"emoticonsSet"              => array(), //
			"fileAllowedTypes"          => array(), //
			"fontSize"                  => array(), //
			"htmlAllowedAttrs"          => array(), //
			"htmlAllowedEmptyTags"      => array(), //
			"htmlAllowedStyleProps"     => array(), //
			"htmlAllowedTags"           => array(), //
			"htmlIgnoreCSSProperties"   => array(), //
			"htmlDoNotWrapTags"         => array(), //
			"htmlRemoveTags"            => array(), //
			"iframeStyleFiles"          => array(), //
			"imageAllowedTypes"         => array(), //
			"imageAltButtons"           => array(), //
			"imageEditButtons"          => array(), //
			"imageInsertButtons"        => array(), //
			"imageSizeButtons"          => array(), //
			"lineBreakerTags"           => array(), //
			"linkEditButtons"           => array(), //
			"linkInsertButtons"         => array(), //
			"linkList"                  => array(), //
			"pasteAllowedStyleProps"    => array(), //
			"pasteDeniedAttrs"          => array(), //
			"pasteDeniedTags"           => array(), //
			"pluginsEnabled"            => array(), //
			"quickInsertButtons"        => array(), //
			"quickInsertTags"           => array(), //
			"shortcutsEnabled"          => array(), //
			"tableColors"               => array(), //
			"tableColorsButtons"        => array(), //
			"tableEditButtons"          => array(), //
			"tableInsertButtons"        => array(), //
			"toolbarButtons"            => array(), //
			"toolbarButtonsMD"          => array(), //
			"toolbarButtonsSM"          => array(), //
			"toolbarButtonsXS"          => array(), //
			"videoAllowedProviders"     => array(), //
			"videoAllowedTypes"         => array(), //
			"videoEditButtons"          => array(), //
			"videoInsertButtons"        => array(), //
			"videoSizeButtons"          => array(), //
			"wordAllowedStyleProps"     => array(), //
			"wordDeniedAttrs"           => array(), //
			"wordDeniedTags"            => array()
		);

		public static $OPTIONS_ARRAY_CUSTOM = array(
			"pluginsDisabled" => array(), //
			"events"          => array()
		);

		public static $OPTIONS_OBJECT = array(
			"aviaryOptions"            => array(), //
			"codeMirrorOptions"        => array(), //
			"codeBeautifierOptions"    => array(), //
			"fileUploadParams"         => array(), //
			"fileUploadToS3"           => array(), //
			"fontFamily"               => array(), //
			"helpSets"                 => array(), //
			"imageManagerDeleteParams" => array(), //
			"imageManagerLoadParams"   => array(), //
			"imageStyles"              => array(), //
			"imageUploadParams"        => array(), //
			"imageUploadToS3"          => array(), //
			"inlineStyles"             => array(), //
			"linkAttributes"           => array(), //
			"linkStyles"               => array(), //
			"paragraphFormat"          => array(), //
			"paragraphStyles"          => array(), //
			"requestHeaders"           => array(), //
			"saveParams"               => array(), //
			"scaytOptions"             => array(), //
			"tableStyles"              => array(), //
			"tableCellStyles"          => array(), //
			"videoUploadParams"        => array(), //
			"videoUploadToS3"          => array()
		);

		public static $OPTIONS_OBJECT_CUSTOM = array(
			"imageManagerDeleteURLParams" => array(), //
			"imageManagerLoadURLParams"   => array(), //
			"imageUploadURLParams"        => array(), //
			"saveURLParams"               => array(), //
			"fileUploadURLParams"         => array(), //
			"videoUploadURLParams"        => array(), //
		);

		/**
		 * @return array
		 */
		public static function getArrOptionAll()
		{
			//------------------------- DECLARE ---------------------------//

			return array_merge( self::getArrOption(), self::getArrOptionCustom() );
		}

		/**
		 * @return array
		 */
		public static function getArrOption()
		{
			//------------------------- DECLARE ---------------------------//

			return array_merge( array_merge(
									array_merge(
										array_merge(
											array_keys( UConfiguration::$OPTIONS_BOOLEAN ),
											array_keys( UConfiguration::$OPTIONS_INTEGER ) ),
										array_keys( UConfiguration::$OPTIONS_STRING ) ),
									array_keys( UConfiguration::$OPTIONS_ARRAY ) ),
								array_keys( UConfiguration::$OPTIONS_OBJECT ) );
		}

		/**
		 * @return array
		 */
		public static function getArrOptionCustom()
		{
			//------------------------- DECLARE ---------------------------//

			return array_merge( array_merge(
									array_merge(
										array_keys( UConfiguration::$OPTIONS_BOOLEAN_CUSTOM ),
										array_keys( UConfiguration::$OPTIONS_STRING_CUSTOM ) ),
									array_keys( UConfiguration::$OPTIONS_ARRAY_CUSTOM ) ),
								array_keys( UConfiguration::$OPTIONS_OBJECT_CUSTOM ) );
		}

		/**
		 * @param \Symfony\Component\Config\Definition\Builder\NodeBuilder $p_nodeBuilder
		 * @param                                                          boolean
		 */
		public static function addArrOptionBoolean( NodeBuilder $p_nodeBuilder, $addDefaultValue = true )
		{
			$array = array_merge( UConfiguration::$OPTIONS_BOOLEAN, UConfiguration::$OPTIONS_BOOLEAN_CUSTOM );
			//------------------------- DECLARE ---------------------------//

			foreach( $array as $option => $defaultValue )
			{
				$p_nodeBuilder = $p_nodeBuilder->booleanNode( $option );
				if( $addDefaultValue )
				{
					$p_nodeBuilder->defaultValue( $defaultValue );
				}

				$p_nodeBuilder = $p_nodeBuilder->end();
			}
		}

		/**
		 * @param \Symfony\Component\Config\Definition\Builder\NodeBuilder $p_nodeBuilder
		 * @param                                                          boolean
		 */
		public static function addArrOptionInteger( NodeBuilder $p_nodeBuilder, $addDefaultValue = true )
		{
			//------------------------- DECLARE ---------------------------//

			foreach( UConfiguration::$OPTIONS_INTEGER as $option => $defaultValue )
			{
				$p_nodeBuilder = $p_nodeBuilder->integerNode( $option );

				if( $addDefaultValue )
				{
					$p_nodeBuilder = $p_nodeBuilder->defaultValue( $defaultValue );
				}

				$p_nodeBuilder = $p_nodeBuilder->end();
			}
		}

		/**
		 * @param \Symfony\Component\Config\Definition\Builder\NodeBuilder $p_nodeBuilder
		 * @param                                                          boolean
		 */
		public static function addArrOptionString( NodeBuilder $p_nodeBuilder, $addDefaultValue = true )
		{
			$array = array_merge( UConfiguration::$OPTIONS_STRING, UConfiguration::$OPTIONS_STRING_CUSTOM );
			//------------------------- DECLARE ---------------------------//

			foreach( $array as $option => $defaultValue )
			{
				$p_nodeBuilder = $p_nodeBuilder->scalarNode( $option );
				if( $addDefaultValue )
				{
					$p_nodeBuilder = $p_nodeBuilder->defaultValue( $defaultValue );
				}
				$p_nodeBuilder = $p_nodeBuilder->end();
			}
		}

		/**
		 * @param \Symfony\Component\Config\Definition\Builder\NodeBuilder $p_nodeBuilder
		 * @param                                                          boolean
		 */
		public static function addArrOptionArray( NodeBuilder $p_nodeBuilder, $addDefaultValue = true )
		{
			$array = array_merge( UConfiguration::$OPTIONS_ARRAY, UConfiguration::$OPTIONS_ARRAY_CUSTOM );
			//------------------------- DECLARE ---------------------------//

			foreach( $array as $option => $defaultValue )
			{
				$p_nodeBuilder =
					$p_nodeBuilder->arrayNode( $option )->prototype( 'variable' )->end();

				if( $addDefaultValue )
				{
					$p_nodeBuilder = $p_nodeBuilder->defaultValue( $defaultValue );
				}

				$p_nodeBuilder = $p_nodeBuilder->end();
			}
		}

		/**
		 * @param \Symfony\Component\Config\Definition\Builder\NodeBuilder $p_nodeBuilder
		 * @param                                                          boolean
		 */
		public static function addArrOptionObject( NodeBuilder $p_nodeBuilder, $addDefaultValue = true )
		{
			$array = array_merge( UConfiguration::$OPTIONS_OBJECT, UConfiguration::$OPTIONS_OBJECT_CUSTOM );
			//------------------------- DECLARE ---------------------------//

			foreach( $array as $option => $defaultValue )
			{
				$p_nodeBuilder =
					$p_nodeBuilder->arrayNode( $option )->prototype( 'variable' )->end();

				if( $addDefaultValue )
				{
					$p_nodeBuilder = $p_nodeBuilder->defaultValue( $defaultValue );
				}

				$p_nodeBuilder = $p_nodeBuilder->end();
			}
		}

	}
