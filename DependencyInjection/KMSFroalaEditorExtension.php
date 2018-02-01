<?php

	namespace KMS\FroalaEditorBundle\DependencyInjection;

	use KMS\FroalaEditorBundle\Utility\UConfiguration;
	use Symfony\Component\Config\FileLocator;
	use Symfony\Component\DependencyInjection\ContainerBuilder;
	use Symfony\Component\DependencyInjection\Loader;
	use Symfony\Component\HttpKernel\DependencyInjection\Extension;

	/**
	 * KMS Froala extension.
	 * Class KMSFroalaEditorExtension
	 * @package KMS\FroalaEditorBundle\DependencyInjection
	 */
	class KMSFroalaEditorExtension extends Extension
	{

		// -------------------------------------------------------------//
		// --------------------------- METHODS -------------------------//
		// -------------------------------------------------------------//

		/**
		 * @param array                                                   $p_configs
		 * @param \Symfony\Component\DependencyInjection\ContainerBuilder $p_container
		 */
		public function load( array $p_configs, ContainerBuilder $p_container )
		{
			$configuration = new Configuration ();
			$arrConfig     = $this->processConfiguration( $configuration, $p_configs );
			$loader        =
				new Loader\YamlFileLoader ( $p_container, new FileLocator ( __DIR__ . "/../Resources/config" ) );
			// ------------------------- DECLARE ---------------------------//

			$loader->load( "services.yml" );

			$this->loadResources( $p_container );
			$this->loadConfig( $p_container, $arrConfig );
		}

		/**
		 * Load resources.
		 * @param \Symfony\Component\DependencyInjection\ContainerBuilder $p_container
		 */
		private function loadResources( ContainerBuilder $p_container )
		{
			// ------------------------- DECLARE ---------------------------//

			$p_container->setParameter( "twig.form.resources", array_merge( array(
																				"@KMSFroalaEditor/Form/froala_widget.html.twig"
																			),
																			$p_container->getParameter( "twig.form.resources" ) ) );
		}

		/**
		 * Load config.
		 * @param \Symfony\Component\DependencyInjection\ContainerBuilder $p_container
		 * @param array                                                   $p_arrConfig
		 */
		private function loadConfig( ContainerBuilder $p_container, array $p_arrConfig )
		{
			// ------------------------- DECLARE ---------------------------//

			// Load defined options in config file.
			foreach( UConfiguration::getArrOptionAll() as $option )
			{
				if( empty( $p_arrConfig [ $option ] ) == false || //
					$p_arrConfig [ $option ] === false || //
					$p_arrConfig [ $option ] === 0
				)
				{
					$p_container->setParameter( Configuration::$NODE_ROOT . '.' . $option, $p_arrConfig [ $option ] );
				}

			}

			$parameterProfiles = array();

			foreach( $p_arrConfig[ 'profiles' ] as $key => $profile )
			{
				$parameterProfiles[ $key ] = array();
				foreach( $profile as $optionKey => $optionValue )
				{
					if( empty( $optionValue ) == false || //
						$optionValue === false ||  //
						$optionValue === 0
					)
					{
						$parameterProfiles[ $key ][ $optionKey ] = $optionValue;
					}
				}
			}

			$p_container->setParameter( Configuration::$NODE_ROOT . '.profiles', $parameterProfiles );


		}

	}
