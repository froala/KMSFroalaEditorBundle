<?php

	namespace KMS\FroalaEditorBundle\Form\Type;

	use KMS\FroalaEditorBundle\DependencyInjection\Configuration;
	use KMS\FroalaEditorBundle\Service\OptionManager;
	use KMS\FroalaEditorBundle\Service\PluginProvider;
	use KMS\FroalaEditorBundle\Utility\UConfiguration;
    use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
    use Symfony\Component\Form\AbstractType;
    use Symfony\Component\Form\Extension\Core\Type\TextareaType;
    use Symfony\Component\Form\FormBuilderInterface;
	use Symfony\Component\Form\FormInterface;
	use Symfony\Component\Form\FormView;
	use Symfony\Component\OptionsResolver\OptionsResolver;

	/**
	 * Froala editor form type.
	 * Class FroalaEditorType
	 * @package KMS\FroalaEditorBundle\Form\Type
	 */
	class FroalaEditorType extends AbstractType
	{

		// -------------------------------------------------------------//
		// --------------------------- MEMBERS -------------------------//
		// -------------------------------------------------------------//

        /**
         * @var \Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface
         */
		private $parameterBag;

		/**
		 * @var \KMS\FroalaEditorBundle\Service\OptionManager
		 */
		private $m_optionManager;

		/**
		 * @var \KMS\FroalaEditorBundle\Service\PluginProvider
		 */
		private $m_pluginProvider;

		// -------------------------------------------------------------//
		// -------------------------- CONSTRUCTOR ----------------------//
		// -------------------------------------------------------------//

		public function __construct( ParameterBagInterface $parameterBag, OptionManager $p_optionManager, PluginProvider $p_pluginProvider )
		{
			// ------------------------- DECLARE ---------------------------//

			$this->parameterBag     = $parameterBag;
			$this->m_optionManager  = $p_optionManager;
			$this->m_pluginProvider = $p_pluginProvider;
		}

		// -------------------------------------------------------------//
		// --------------------------- METHODS -------------------------//
		// -------------------------------------------------------------//

		// -------------------------------------------------------------//
		// --------------------------- OVERRIDE ------------------------//
		// -------------------------------------------------------------//

		/**
		 * @param \Symfony\Component\Form\FormBuilderInterface $p_builder
		 * @param array                                        $p_options
		 */
		public function buildForm( FormBuilderInterface $p_builder, array $p_options )
		{
			// ------------------------- DECLARE ---------------------------//

			foreach( $p_options as $key => $option )
			{
				$p_builder->setAttribute( $key, $option );
			}
		}

		/**
		 * @param \Symfony\Component\Form\FormView      $p_view
		 * @param \Symfony\Component\Form\FormInterface $p_form
		 * @param array                                 $p_options
		 */
		public function buildView( FormView $p_view, FormInterface $p_form, array $p_options )
		{
			$arrKey            = UConfiguration::getArrOption();
			$arrKeyCustom      = UConfiguration::getArrOptionCustom();
			$arrOption         = array();
			$arrPluginEnabled  = isset( $p_options [ "pluginsEnabled" ] ) ? $p_options [ "pluginsEnabled" ] : array();
			$arrPluginDisabled = isset( $p_options [ "pluginsDisabled" ] ) ? $p_options [ "pluginsDisabled" ] : array();
			$arrEvent          = isset( $p_options [ "events" ] ) ? $p_options [ "events" ] : array();
			$profile           = isset( $p_options [ "profile" ] ) ? $p_options [ "profile" ] : null;
			// ------------------------- DECLARE ---------------------------//

			if( $profile && $this->parameterBag->has( Configuration::$NODE_ROOT . '.profiles' ) )
			{

				$profiles = $this->parameterBag->get( Configuration::$NODE_ROOT . '.profiles' );

				if( array_key_exists( $profile, $profiles ) )
				{
					$profileConfig = $profiles[ $profile ];
					$p_options     = array_merge( $p_options, $profileConfig );
				}
				else
				{
					throw new \Exception( 'Could not find profile "' . $profile . '", defined profiles: [' .
										  join( ',', $profiles ) . ']' );
				}

			}

			// Prepare options.
			$this->m_optionManager->prepareOptions( $p_options );

			// Separate Froala options from custom, to iterate properly in twig widget.
			foreach( $p_options as $key => $option )
			{
				if( in_array( $key, $arrKey ) )
				{
					$arrOption[ $key ] = $option;
				}
				else
				{
					if( in_array( $key, $arrKeyCustom ) )
					{
						$p_view->vars [ $key ] = $option;
					}
				}
			}

			// Options.
			$p_view->vars [ "arrOption" ] = $arrOption;

			// Plugins.
			$arrPlugin = $this->m_pluginProvider->obtainArrPluginToInclude( $arrPluginEnabled, //
																			$arrPluginDisabled );

			$p_view->vars [ "arrOption" ][ "pluginsEnabled" ] =
				$this->m_pluginProvider->obtainArrPluginCamelized( $arrPlugin );
			$p_view->vars [ "arrPluginJS" ]                   =
				$this->m_pluginProvider->obtainArrPluginJS( $arrPlugin );
			$p_view->vars [ "arrPluginCSS" ]                  =
				$this->m_pluginProvider->obtainArrPluginCSS( $arrPlugin );
			$p_view->vars [ "events" ]                        = $arrEvent;
		}

		/**
		 * @param \Symfony\Component\OptionsResolver\OptionsResolver $p_resolver
		 */
		public function configureOptions( OptionsResolver $p_resolver )
		{
			$arrDefault = array();
			$arrDefined = array();
			// ------------------------- DECLARE ---------------------------//

			foreach( UConfiguration::getArrOptionAll() as $option )
			{

				// If defined in config file, set default value to form, else set option as available.
				if( $this->parameterBag->has( Configuration::$NODE_ROOT . '.' . $option ) )
				{
					$arrDefault[ $option ] =
						$this->parameterBag->get( Configuration::$NODE_ROOT . '.' . $option );
				}
				else
				{
					$arrDefined[] = $option;
				}
			}


			$arrDefined[] = 'profile';
			$p_resolver->setDefined( $arrDefined );
			$p_resolver->setDefaults( $arrDefault );

		}

		/**
		 * @return string
		 */
		public function getParent()
		{
            return TextareaType::class;
		}

		/**
		 * @return string
		 */
		public function getBlockPrefix()
		{
			//------------------------- DECLARE ---------------------------//

			return "froala";
		}

	}
