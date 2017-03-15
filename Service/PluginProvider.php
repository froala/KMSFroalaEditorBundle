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
				"align"              => [ PluginProvider::KEY_CSS => 0 ],
				"char_counter"       => [ PluginProvider::KEY_CSS => 1 ],
				"code_beautifier"    => [ PluginProvider::KEY_CSS => 0 ],
				"code_view"          => [ PluginProvider::KEY_CSS => 1 ],
				"colors"             => [ PluginProvider::KEY_CSS => 1 ],
				"draggable"          => [ PluginProvider::KEY_CSS => 1 ],
				"emoticons"          => [ PluginProvider::KEY_CSS => 1 ],
				"entities"           => [ PluginProvider::KEY_CSS => 0 ],
				"file"               => [ PluginProvider::KEY_CSS => 1 ],
				"font_family"        => [ PluginProvider::KEY_CSS => 0 ],
				"font_size"          => [ PluginProvider::KEY_CSS => 0 ],
				//				"forms"        	   => [ PluginProvider::KEY_CSS => 0 ],
				"fullscreen"         => [ PluginProvider::KEY_CSS => 1 ],
				"help"               => [ PluginProvider::KEY_CSS => 1 ],
				"image"              => [ PluginProvider::KEY_CSS => 1 ],
				"image_manager"      => [ PluginProvider::KEY_CSS => 1 ],
				"inline_style"       => [ PluginProvider::KEY_CSS => 0 ],
				"line_breaker"       => [ PluginProvider::KEY_CSS => 1 ],
				"link"               => [ PluginProvider::KEY_CSS => 0 ],
				"lists"              => [ PluginProvider::KEY_CSS => 0 ],
				"paragraph_format"   => [ PluginProvider::KEY_CSS => 0 ],
				"paragraph_style"    => [ PluginProvider::KEY_CSS => 0 ],
				"print"              => [ PluginProvider::KEY_CSS => 0 ],
				"quick_insert"       => [ PluginProvider::KEY_CSS => 1 ],
				"quote"              => [ PluginProvider::KEY_CSS => 0 ],
				"save"               => [ PluginProvider::KEY_CSS => 0 ],
				"special_characters" => [ PluginProvider::KEY_CSS => 1 ],
				"table"              => [ PluginProvider::KEY_CSS => 1 ],
				"url"                => [ PluginProvider::KEY_CSS => 0 ],
				"video"              => [ PluginProvider::KEY_CSS => 1 ],
				"word_paste"         => [ PluginProvider::KEY_CSS => 0 ]
			);

		/**
		 * @const string
		 */
		const KEY_CSS = "css";


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
			//------------------------- DECLARE ---------------------------//

			return $p_arrPlugin;
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
					$arrPlugin[] = $plugin;
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