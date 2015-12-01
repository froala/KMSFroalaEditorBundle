<?php

	namespace KMS\FroalaEditorBundle\DependencyInjection;

	use KMS\FroalaEditorBundle\Utility\UConfiguration;
	use Symfony\Component\Config\Definition\Builder\TreeBuilder;
	use Symfony\Component\Config\Definition\ConfigurationInterface;

	/**
	 * KMS Froala configuration.
	 * Class Configuration
	 * @package KMS\FroalaEditorBundle\DependencyInjection
	 */
	class Configuration implements ConfigurationInterface
	{

		//-------------------------------------------------------------//
		//--------------------------- STATIC --------------------------//
		//-------------------------------------------------------------//

		/**
		 * @var string the root node name.
		 */
		public static $NODE_ROOT = "kms_froala_editor";

		// -------------------------------------------------------------//
		// --------------------------- OVERRIDE ------------------------//
		// -------------------------------------------------------------//

		/**
		 * @return \Symfony\Component\Config\Definition\Builder\TreeBuilder
		 */
		public function getConfigTreeBuilder()
		{
			$treeBuilder = new TreeBuilder ();
			$rootNode    = $treeBuilder->root( Configuration::$NODE_ROOT );
			// ------------------------- DECLARE ---------------------------//

			// Add all available configuration nodes.
			$nodeBuilder = $rootNode->addDefaultsIfNotSet()->children();
			UConfiguration::addArrOptionBoolean( $nodeBuilder );
			UConfiguration::addArrOptionInteger( $nodeBuilder );
			UConfiguration::addArrOptionString( $nodeBuilder );
			UConfiguration::addArrOptionArray( $nodeBuilder );
			UConfiguration::addArrOptionObject( $nodeBuilder );
			$nodeBuilder->end();

			return $treeBuilder;
		}
	}
