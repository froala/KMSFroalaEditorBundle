<?php

	namespace KMS\FroalaEditorBundle\DependencyInjection;

	use KMS\FroalaEditorBundle\Utility\UConfiguration;
	use Symfony\Component\Config\Definition\Builder\NodeBuilder;
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
            $treeBuilder = new TreeBuilder(Configuration::$NODE_ROOT);
            if (method_exists($treeBuilder, 'getRootNode')) {
                $rootNode = $treeBuilder->getRootNode();
            } else {
                // BC layer for symfony/config 4.1 and older
                $rootNode = $treeBuilder->root(Configuration::$NODE_ROOT);
            }
			// ------------------------- DECLARE ---------------------------//

			// Add all available configuration nodes.
			$nodeBuilder = $rootNode->addDefaultsIfNotSet()->children();
			$this->addFroalaConfigTree( $nodeBuilder );
			// "profiles" are treated separetely as they repeat main option structures
			$profileSubTreeBuilder = $nodeBuilder
				->arrayNode( 'profiles' )
				->useAttributeAsKey( 'name' )
				->prototype( 'array' )
				->children();
			$this->addFroalaConfigTree( $profileSubTreeBuilder, false );
			$profileSubTreeBuilder->end()->end();
			$nodeBuilder->end();

			return $treeBuilder;
		}

		/**
		 * Add all options to configuration subtree
		 * @param NodeBuilder $nodeBuilder
		 */
		private function addFroalaConfigTree( & $nodeBuilder, $addDefaultValue = true )
		{

			UConfiguration::addArrOptionBoolean( $nodeBuilder, $addDefaultValue );
			UConfiguration::addArrOptionInteger( $nodeBuilder, $addDefaultValue );
			UConfiguration::addArrOptionString( $nodeBuilder, $addDefaultValue );
			UConfiguration::addArrOptionArray( $nodeBuilder, $addDefaultValue );
			UConfiguration::addArrOptionObject( $nodeBuilder, $addDefaultValue );

		}
	}
