<?php

	namespace KMS\FroalaEditorBundle\Form\Type;

	use Symfony\Component\DependencyInjection\ContainerInterface;
	use Symfony\Component\Form\AbstractType;
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
		 * @var \Symfony\Component\DependencyInjection\ContainerInterface
		 */
		private $m_container;

		// -------------------------------------------------------------//
		// -------------------------- CONSTRUCTOR ----------------------//
		// -------------------------------------------------------------//

		/**
		 * @param \Symfony\Component\DependencyInjection\ContainerInterface $p_container
		 */
		public function __construct( ContainerInterface $p_container )
		{
			// ------------------------- DECLARE ---------------------------//

			$this->m_container = $p_container;
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

			// Config.
			$p_builder->setAttribute( "basePath", $p_options [ "basePath" ] );
			$p_builder->setAttribute( "serialNumber", $p_options [ "serialNumber" ] );
			$p_builder->setAttribute( "language", $p_options [ "language" ] );
			$p_builder->setAttribute( "includeJQuery", $p_options [ "includeJQuery" ] );
			$p_builder->setAttribute( "inlineFontAwesome", $p_options [ "includeFontAwesome" ] );

			// Options.
			$p_builder->setAttribute( "inlineMode", $p_options [ "inlineMode" ] );
			$p_builder->setAttribute( "minHeight", $p_options [ "minHeight" ] );
			$p_builder->setAttribute( "maxHeight", $p_options [ "maxHeight" ] );
			$p_builder->setAttribute( "width", $p_options [ "width" ] );
			$p_builder->setAttribute( "height", $p_options [ "height" ] );
			$p_builder->setAttribute( "plainPaste", $p_options [ "plainPaste" ] );
			$p_builder->setAttribute( "tabSpaces", $p_options [ "tabSpaces" ] );
			$p_builder->setAttribute( "multiLine", $p_options [ "multiLine" ] );
			$p_builder->setAttribute( "paragraphy", $p_options [ "paragraphy" ] );
			$p_builder->setAttribute( "placeholder", $p_options [ "placeholder" ] );
			$p_builder->setAttribute( "theme", $p_options [ "theme" ] );
			$p_builder->setAttribute( "unlinkButton", $p_options [ "unlinkButton" ] );
			$p_builder->setAttribute( "beautifyCode", $p_options [ "beautifyCode" ] );
			$p_builder->setAttribute( "buttons", $p_options [ "buttons" ] );
			$p_builder->setAttribute( "convertMailAddresses", $p_options [ "convertMailAddresses" ] );

			// Plugins.
			$p_builder->setAttribute( "usePluginBlockStyles", $p_options [ "usePluginBlockStyles" ] );
			$p_builder->setAttribute( "usePluginColors", $p_options [ "usePluginColors" ] );
			$p_builder->setAttribute( "usePluginCharCounter", $p_options [ "usePluginCharCounter" ] );
			$p_builder->setAttribute( "usePluginFileUpload", $p_options [ "usePluginFileUpload" ] );
			$p_builder->setAttribute( "usePluginFontFamily", $p_options [ "usePluginFontFamily" ] );
			$p_builder->setAttribute( "usePluginFontSize", $p_options [ "usePluginFontSize" ] );
			$p_builder->setAttribute( "usePluginFullscreen", $p_options [ "usePluginFullscreen" ] );
			$p_builder->setAttribute( "usePluginLists", $p_options [ "usePluginLists" ] );
			$p_builder->setAttribute( "usePluginMediaManager", $p_options [ "usePluginMediaManager" ] );
			$p_builder->setAttribute( "usePluginTables", $p_options [ "usePluginTables" ] );
			$p_builder->setAttribute( "usePluginUrls", $p_options [ "usePluginUrls" ] );
			$p_builder->setAttribute( "usePluginVideo", $p_options [ "usePluginVideo" ] );

			// Image upload.
			$p_builder->setAttribute( "imageUploadRoute", $p_options [ "imageUploadRoute" ] );
			$p_builder->setAttribute( "imageUploadRouteDelete", $p_options [ "imageUploadRouteDelete" ] );
			$p_builder->setAttribute( "imageUploadPath", $p_options [ "imageUploadPath" ] );
			$p_builder->setAttribute( "imageUploadFolder", $p_options [ "imageUploadFolder" ] );

			// Media manager.
			$p_builder->setAttribute( "mediaManagerRoute", $p_options [ "mediaManagerRoute" ] );

			// Autosave.
			$p_builder->setAttribute( "autosaveActive", $p_options [ "autosaveActive" ] );
			$p_builder->setAttribute( "autosaveInterval", $p_options [ "autosaveInterval" ] );
			$p_builder->setAttribute( "autosaveRoute", $p_options [ "autosaveRoute" ] );
			$p_builder->setAttribute( "autosaveRequestType", $p_options [ "autosaveRequestType" ] );
			$p_builder->setAttribute( "autosaveParams", $p_options [ "autosaveParams" ] );
			$p_builder->setAttribute( "autosaveRouteParams", $p_options [ "autosaveRouteParams" ] );
		}

		/**
		 * @param \Symfony\Component\Form\FormView      $p_view
		 * @param \Symfony\Component\Form\FormInterface $p_form
		 * @param array                                 $p_options
		 */
		public function buildView( FormView $p_view, FormInterface $p_form, array $p_options )
		{
			// ------------------------- DECLARE ---------------------------//

			// Config.
			$p_view->vars [ "basePath" ]           = $p_options [ "basePath" ];
			$p_view->vars [ "serialNumber" ]       = $p_options [ "serialNumber" ];
			$p_view->vars [ "language" ]           = $p_options [ "language" ];
			$p_view->vars [ "includeJQuery" ]      = $p_options [ "includeJQuery" ];
			$p_view->vars [ "includeFontAwesome" ] = $p_options [ "includeFontAwesome" ];

			// Options.s
			$p_view->vars [ "inlineMode" ]           = $p_options [ "inlineMode" ];
			$p_view->vars [ "minHeight" ]            = $p_options [ "minHeight" ];
			$p_view->vars [ "maxHeight" ]            = $p_options [ "maxHeight" ];
			$p_view->vars [ "width" ]                = $p_options [ "width" ];
			$p_view->vars [ "height" ]               = $p_options [ "height" ];
			$p_view->vars [ "plainPaste" ]           = $p_options [ "plainPaste" ];
			$p_view->vars [ "tabSpaces" ]            = $p_options [ "tabSpaces" ];
			$p_view->vars [ "multiLine" ]            = $p_options [ "multiLine" ];
			$p_view->vars [ "paragraphy" ]           = $p_options [ "paragraphy" ];
			$p_view->vars [ "placeholder" ]          = $p_options [ "placeholder" ];
			$p_view->vars [ "theme" ]                = $p_options [ "theme" ];
			$p_view->vars [ "unlinkButton" ]         = $p_options [ "unlinkButton" ];
			$p_view->vars [ "beautifyCode" ]         = $p_options [ "beautifyCode" ];
			$p_view->vars [ "buttons" ]              = $p_options [ "buttons" ];
			$p_view->vars [ "convertMailAddresses" ] = $p_options [ "convertMailAddresses" ];

			// Plugins.
			$p_view->vars [ "usePluginBlockStyles" ]  = $p_options [ "usePluginBlockStyles" ];
			$p_view->vars [ "usePluginColors" ]       = $p_options [ "usePluginColors" ];
			$p_view->vars [ "usePluginCharCounter" ]  = $p_options [ "usePluginCharCounter" ];
			$p_view->vars [ "usePluginFileUpload" ]   = $p_options [ "usePluginFileUpload" ];
			$p_view->vars [ "usePluginFontFamily" ]   = $p_options [ "usePluginFontFamily" ];
			$p_view->vars [ "usePluginFontSize" ]     = $p_options [ "usePluginFontSize" ];
			$p_view->vars [ "usePluginFullscreen" ]   = $p_options [ "usePluginFullscreen" ];
			$p_view->vars [ "usePluginLists" ]        = $p_options [ "usePluginLists" ];
			$p_view->vars [ "usePluginMediaManager" ] = $p_options [ "usePluginMediaManager" ];
			$p_view->vars [ "usePluginTables" ]       = $p_options [ "usePluginTables" ];
			$p_view->vars [ "usePluginUrls" ]         = $p_options [ "usePluginUrls" ];
			$p_view->vars [ "usePluginVideo" ]        = $p_options [ "usePluginVideo" ];

			// Image upload.
			$p_view->vars [ "imageUploadRoute" ]       = $p_options [ "imageUploadRoute" ];
			$p_view->vars [ "imageUploadRouteDelete" ] = $p_options [ "imageUploadRouteDelete" ];
			$p_view->vars [ "imageUploadPath" ]        = $p_options [ "imageUploadPath" ];
			$p_view->vars [ "imageUploadFolder" ]      = $p_options [ "imageUploadFolder" ];

			// Media manager.
			$p_view->vars [ "mediaManagerRoute" ] = $p_options [ "mediaManagerRoute" ];

			// Autosave.
			$p_view->vars [ "autosaveActive" ]      = $p_options [ "autosaveActive" ];
			$p_view->vars [ "autosaveInterval" ]    = $p_options [ "autosaveInterval" ];
			$p_view->vars [ "autosaveRoute" ]       = $p_options [ "autosaveRoute" ];
			$p_view->vars [ "autosaveRequestType" ] = $p_options [ "autosaveRequestType" ];
			$p_view->vars [ "autosaveParams" ]      = $p_options [ "autosaveParams" ];
			$p_view->vars [ "autosaveRouteParams" ] = $p_options [ "autosaveRouteParams" ];
		}

		/**
		 * @param \Symfony\Component\OptionsResolver\OptionsResolver $p_resolver
		 */
		public function configureOptions( OptionsResolver $p_resolver )
		{
			// ------------------------- DECLARE ---------------------------//
			$p_resolver->setDefaults( array(
										  // Config.
										  "basePath"               => $this->m_container->getParameter( "kms_froala_editor.basePath" ),
										  "serialNumber"           => $this->m_container->getParameter( "kms_froala_editor.serialNumber" ),
										  "language"               => $this->m_container->getParameter( "kms_froala_editor.language" ),
										  "includeJQuery"          => $this->m_container->getParameter( "kms_froala_editor.includeJQuery" ),
										  "includeFontAwesome"     => $this->m_container->getParameter( "kms_froala_editor.includeFontAwesome" ),

										  // Options.
										  "inlineMode"             => $this->m_container->getParameter( "kms_froala_editor.inlineMode" ),
										  "minHeight"              => $this->m_container->getParameter( "kms_froala_editor.minHeight" ),
										  "maxHeight"              => $this->m_container->getParameter( "kms_froala_editor.maxHeight" ),
										  "width"                  => $this->m_container->getParameter( "kms_froala_editor.width" ),
										  "height"                 => $this->m_container->getParameter( "kms_froala_editor.height" ),
										  "plainPaste"             => $this->m_container->getParameter( "kms_froala_editor.plainPaste" ),
										  "tabSpaces"              => $this->m_container->getParameter( "kms_froala_editor.tabSpaces" ),
										  "multiLine"              => $this->m_container->getParameter( "kms_froala_editor.multiLine" ),
										  "paragraphy"             => $this->m_container->getParameter( "kms_froala_editor.paragraphy" ),
										  "placeholder"            => $this->m_container->getParameter( "kms_froala_editor.placeholder" ),
										  "theme"                  => $this->m_container->getParameter( "kms_froala_editor.theme" ),
										  "unlinkButton"           => $this->m_container->getParameter( "kms_froala_editor.unlinkButton" ),
										  "beautifyCode"           => $this->m_container->getParameter( "kms_froala_editor.beautifyCode" ),
										  "buttons"                => $this->m_container->getParameter( "kms_froala_editor.buttons" ),
										  "convertMailAddresses"   => $this->m_container->getParameter( "kms_froala_editor.convertMailAddresses" ),

										  // Plugins.
										  "usePluginBlockStyles"   => $this->m_container->getParameter( "kms_froala_editor.plugins.blockStyles" ),
										  "usePluginColors"        => $this->m_container->getParameter( "kms_froala_editor.plugins.colors" ),
										  "usePluginCharCounter"   => $this->m_container->getParameter( "kms_froala_editor.plugins.charCounter" ),
										  "usePluginFileUpload"    => $this->m_container->getParameter( "kms_froala_editor.plugins.fileUpload" ),
										  "usePluginFontFamily"    => $this->m_container->getParameter( "kms_froala_editor.plugins.fontFamily" ),
										  "usePluginFontSize"      => $this->m_container->getParameter( "kms_froala_editor.plugins.fontSize" ),
										  "usePluginFullscreen"    => $this->m_container->getParameter( "kms_froala_editor.plugins.fullscreen" ),
										  "usePluginLists"         => $this->m_container->getParameter( "kms_froala_editor.plugins.lists" ),
										  "usePluginMediaManager"  => $this->m_container->getParameter( "kms_froala_editor.plugins.mediaManager" ),
										  "usePluginTables"        => $this->m_container->getParameter( "kms_froala_editor.plugins.tables" ),
										  "usePluginUrls"          => $this->m_container->getParameter( "kms_froala_editor.plugins.urls" ),
										  "usePluginVideo"         => $this->m_container->getParameter( "kms_froala_editor.plugins.video" ),

										  // Image upload.
										  "imageUploadRoute"       => $this->m_container->getParameter( "kms_froala_editor.imageUpload.route" ),
										  "imageUploadRouteDelete" => $this->m_container->getParameter( "kms_froala_editor.imageUpload.routeDelete" ),
										  "imageUploadPath"        => $this->m_container->getParameter( "kms_froala_editor.imageUpload.path" ),
										  "imageUploadFolder"      => $this->m_container->getParameter( "kms_froala_editor.imageUpload.folder" ),

										  // Media manager.
										  "mediaManagerRoute"      => $this->m_container->getParameter( "kms_froala_editor.mediaManager.route" ),

										  // Autosave.
										  "autosaveActive"         => $this->m_container->getParameter( "kms_froala_editor.autosave.active" ),
										  "autosaveInterval"       => $this->m_container->getParameter( "kms_froala_editor.autosave.interval" ),
										  "autosaveRoute"          => $this->m_container->getParameter( "kms_froala_editor.autosave.route" ),
										  "autosaveRouteParams"    => array(),
										  "autosaveRequestType"    => $this->m_container->getParameter( "kms_froala_editor.autosave.requestType" ),
										  "autosaveParams"         => array()
									  ) );
		}

		/**
		 * @return string
		 */
		public function getParent()
		{
			// ------------------------- DECLARE ---------------------------//
			return "textarea";
		}

		/**
		 * @return string
		 */
		public function getName()
		{
			// ------------------------- DECLARE ---------------------------//
			return "froala";
		}
	}
