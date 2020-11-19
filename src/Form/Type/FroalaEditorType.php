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
			    if(0 !== strpos($key, 'froala_')) {
                    continue;
                }
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
            $p_options = array_filter(
                $p_options,
                function ($key) {
                    return strpos($key, 'froala_') === 0;
                },
                ARRAY_FILTER_USE_KEY
            );

			$arrKey            = UConfiguration::getArrOption();
			$arrKeyCustom      = UConfiguration::getArrOptionCustom();
			$arrOption         = array();
			$arrPluginEnabled  = isset( $p_options [ "froala_pluginsEnabled" ] ) ? $p_options [ "froala_pluginsEnabled" ] : array();
			$arrPluginDisabled = isset( $p_options [ "froala_pluginsDisabled" ] ) ? $p_options [ "froala_pluginsDisabled" ] : array();
			$arrEvent          = isset( $p_options [ "froala_events" ] ) ? $p_options [ "froala_events" ] : array();
			$profile           = isset( $p_options [ "froala_profile" ] ) ? $p_options [ "froala_profile" ] : null;
			// ------------------------- DECLARE ---------------------------//

			if( $profile && $this->parameterBag->has( Configuration::$NODE_ROOT . '.profiles' ) )
			{

				$profiles = $this->parameterBag->get( Configuration::$NODE_ROOT . '.profiles' );

				if( array_key_exists( $profile, $profiles ) )
				{
					$profileConfig = $profiles[ $profile ];
					foreach($profileConfig as $profileKey => $profileOption) {
					    $p_options['froala_' . $profileKey] = $profileOption;
                    }
				}
				else
				{
                    throw new \InvalidArgumentException(sprintf(
                        'Unrecognized profile "%s". Available profiles are "%s".',
                        $profile,
                        implode('"", "', array_keys($profiles))
                    ));
				}

			}

			$finalOptions = [];
			foreach($p_options as $key => $value) {
			    $finalOptions[substr($key, strlen('froala_'))] = $value;
            }

			// Prepare options.
			$this->m_optionManager->prepareOptions( $finalOptions );

			// Separate Froala options from custom, to iterate properly in twig widget.
			foreach( $finalOptions as $key => $option )
			{
				if( in_array( $key, $arrKey ) )
				{
					$arrOption[ $key ] = $option;
				}
				else
				{
					if( in_array( $key, $arrKeyCustom ) )
					{
						$p_view->vars [ 'froala_' . $key ] = $option;
					}
				}
			}

			// Options.
			$p_view->vars [ "froala_arrOption" ] = $arrOption;

			// Plugins.
			$arrPlugin = $this->m_pluginProvider->obtainArrPluginToInclude( $arrPluginEnabled, //
																			$arrPluginDisabled );

			$p_view->vars [ "froala_arrOption" ][ "pluginsEnabled" ] =
				$this->m_pluginProvider->obtainArrPluginCamelized( $arrPlugin );
			$p_view->vars [ "froala_arrPluginJS" ]                   =
				$this->m_pluginProvider->obtainArrPluginJS( $arrPlugin );
			$p_view->vars [ "froala_arrPluginCSS" ]                  =
				$this->m_pluginProvider->obtainArrPluginCSS( $arrPlugin );
			$p_view->vars [ "froala_events" ]                        = $arrEvent;
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
                $optionName = 'froala_' . $option;
				// If defined in config file, set default value to form, else set option as available.
				if( $this->parameterBag->has( Configuration::$NODE_ROOT . '.' . $option ) )
				{
					$arrDefault[ $optionName ] =
						$this->parameterBag->get( Configuration::$NODE_ROOT . '.' . $option );
				}
				else
				{
					$arrDefined[] = $optionName;
				}
			}


			$arrDefined[] = 'froala_profile';
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
