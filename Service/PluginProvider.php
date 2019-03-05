<?php

	namespace KMS\FroalaEditorBundle\Service;

	use Doctrine\Common\Util\Inflector;

	/**
	 * Class PluginProvider
	 * @package KMS\FroalaEditorBundle\Service
	 */
	class PluginProvider
	{

		//-------------------------------------------------------------//
		//--------------------------- MEMBERS -------------------------//
		//-------------------------------------------------------------//

		/**
		 * Can be easier but can handle further configurations.
		 * @const array
		 */
		private static $ARR_PLUGIN_CONFIG =
			array(
				// Plugins.
				"align"              => [ PluginProvider::KEY_CSS => 0, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"char_counter"       => [ PluginProvider::KEY_CSS => 1, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"code_beautifier"    => [ PluginProvider::KEY_CSS => 0, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"code_view"          => [ PluginProvider::KEY_CSS => 1, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"colors"             => [ PluginProvider::KEY_CSS => 1, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"draggable"          => [ PluginProvider::KEY_CSS => 1, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"emoticons"          => [ PluginProvider::KEY_CSS => 1, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"entities"           => [ PluginProvider::KEY_CSS => 0, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"file"               => [ PluginProvider::KEY_CSS => 1, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"font_family"        => [ PluginProvider::KEY_CSS => 0, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"font_size"          => [ PluginProvider::KEY_CSS => 0, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				//				"forms"        	   => [ PluginProvider::KEY_CSS => 0, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"fullscreen"         => [ PluginProvider::KEY_CSS => 1, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"help"               => [ PluginProvider::KEY_CSS => 1, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"image"              => [ PluginProvider::KEY_CSS => 1, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"image_manager"      => [ PluginProvider::KEY_CSS => 1, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"inline_class"       => [ PluginProvider::KEY_CSS => 0, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"inline_style"       => [ PluginProvider::KEY_CSS => 0, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"line_breaker"       => [ PluginProvider::KEY_CSS => 1, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"line_height"        => [ PluginProvider::KEY_CSS => 0, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"link"               => [ PluginProvider::KEY_CSS => 0, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"lists"              => [ PluginProvider::KEY_CSS => 0, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"paragraph_format"   => [ PluginProvider::KEY_CSS => 0, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"paragraph_style"    => [ PluginProvider::KEY_CSS => 0, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"print"              => [ PluginProvider::KEY_CSS => 0, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"quick_insert"       => [ PluginProvider::KEY_CSS => 1, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"quote"              => [ PluginProvider::KEY_CSS => 0, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"save"               => [ PluginProvider::KEY_CSS => 0, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"special_characters" => [ PluginProvider::KEY_CSS => 1, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"table"              => [ PluginProvider::KEY_CSS => 1, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"url"                => [ PluginProvider::KEY_CSS => 0, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"video"              => [ PluginProvider::KEY_CSS => 1, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],
				"word_paste"         => [ PluginProvider::KEY_CSS => 0, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_PLUGINS ],

				// Third party.
				"embedly"            => [ PluginProvider::KEY_CSS => 1, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_THIRD_PARTY ],
				"image_aviary"       => [ PluginProvider::KEY_CSS => 0, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_THIRD_PARTY ],
				"spell_checker"      => [ PluginProvider::KEY_CSS => 1, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_THIRD_PARTY ],
				"font_awesome" 	     => [ PluginProvider::KEY_CSS => 1, PluginProvider::KEY_FOLDER => PluginProvider::VALUE_THIRD_PARTY ]

			);

		/**
		 * Can be easier but can handle further configurations.
		 * @const array
		 */
		private static $ARR_THIRD_PARTY_CONFIG =
			array();

		/**
		 * @const string
		 */
		const KEY_CSS = "css";
		/**
		 * @const string
		 */
		const KEY_FOLDER = "css";
		/**
		 * @const string
		 */
		const VALUE_PLUGINS = "plugins";
		/**
		 * @const string
		 */
		const VALUE_THIRD_PARTY = "third_party";


		//-------------------------------------------------------------//
		//------------------------- CONSTRUCTOR -----------------------//
		//-------------------------------------------------------------//

		/**
		 * Constructor.
		 */
		public function __construct()
		{
			//------------------------- DECLARE ---------------------------//
		}

		//-------------------------------------------------------------//
		//--------------------------- METHODS -------------------------//
		//-------------------------------------------------------------//

		/**
		 * @param array $p_pluginEnable
		 * @param array $p_pluginDisable
		 * @return array
		 */
		public function obtainArrPluginToInclude( $p_pluginEnable, $p_pluginDisable )
		{
			$arrPluginName = array_keys( PluginProvider::$ARR_PLUGIN_CONFIG );
			//------------------------- DECLARE ---------------------------//

			if( ! empty( $p_pluginDisable ) )
			{
				return array_diff( $arrPluginName, $p_pluginDisable );
			}
			else
			{
				if( ! empty( $p_pluginEnable ) )
				{
					return array_intersect( $arrPluginName, $p_pluginEnable );
				}
			}

			return $arrPluginName;
		}

		/**
		 * Obtains array of JS files to include (all have one).
		 * @param array $p_arrPlugin
		 * @return array
		 */
		public function obtainArrPluginJS( $p_arrPlugin )
		{
			$arrPlugin = array();
			//------------------------- DECLARE ---------------------------//

			foreach( $p_arrPlugin as $plugin )
			{
				$arrPlugin[] = $this->obtainConfiguration( $plugin, PluginProvider::KEY_FOLDER ) . "/" . $plugin;
			}

			return $arrPlugin;
		}

		/**
		 * Obtains array of CSS files to include (check in const).
		 * @param array $p_arrPlugin
		 * @return array
		 */
		public function obtainArrPluginCSS( $p_arrPlugin )
		{
			$arrPlugin = array();
			//------------------------- DECLARE ---------------------------//

			foreach( $p_arrPlugin as $plugin )
			{
				if( $this->obtainConfiguration( $plugin, PluginProvider::KEY_CSS ) == 1 )
				{
					$arrPlugin[] = $this->obtainConfiguration( $plugin, PluginProvider::KEY_FOLDER ) . "/" . $plugin;
				}
			}

			return $arrPlugin;
		}

		/**
		 * Obtains array of plugin to include (camelized).
		 * @param array $p_arrPlugin
		 * @return array
		 */
		public function obtainArrPluginCamelized( $p_arrPlugin )
		{
			$arrPlugin = array();
			//------------------------- DECLARE ---------------------------//

			foreach( $p_arrPlugin as $plugin )
			{
				$arrPlugin[] = Inflector::camelize( $plugin );
			}

			return $arrPlugin;
		}

		/**
		 * @param string $p_plugin
		 * @param string $p_key
		 * @return mixed
		 */
		private function obtainConfiguration( $p_plugin, $p_key )
		{
			//------------------------- DECLARE ---------------------------//

			return PluginProvider::$ARR_PLUGIN_CONFIG[ $p_plugin ][ $p_key ];
		}

	}