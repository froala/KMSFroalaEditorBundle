<?php

namespace KMS\FroalaEditorBundle\Form\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Froala editor form type.
 */
class FroalaEditorType extends AbstractType
{

    //-------------------------------------------------------------//
	//--------------------------- MEMBERS -------------------------//
	//-------------------------------------------------------------//
	
    /** The container. */
    private $m_container;
	
	//-------------------------------------------------------------//
	//-------------------------- CONSTRUCTOR ----------------------//
	//-------------------------------------------------------------//
	
    public function __construct( ContainerInterface $p_container )
    {
        //------------------------- DECLARE ---------------------------//
        
        $this->m_container = $p_container;
    }
    
	//-------------------------------------------------------------//
	//--------------------------- METHODS -------------------------//
	//-------------------------------------------------------------//
	
    //-------------------------------------------------------------//
    //--------------------------- OVERRIDE ------------------------//
    //-------------------------------------------------------------//
    
    /**
     * {@inheritdoc}
     */
    public function buildForm( FormBuilderInterface $p_builder, array $p_options )
    {
        //------------------------- DECLARE ---------------------------//
        
        // Config.
        $p_builder->setAttribute( "basePath",               $p_options[ "basePath" ] );
        $p_builder->setAttribute( "language",               $p_options[ "language" ] );
        $p_builder->setAttribute( "inlineMode",             $p_options[ "inlineMode" ] );
        
        // Plugins.
        $p_builder->setAttribute( "usePluginBlockStyles",   $p_options[ "usePluginBlockStyles" ] );
        $p_builder->setAttribute( "usePluginColors",        $p_options[ "usePluginColors" ] );
        $p_builder->setAttribute( "usePluginCharCounter",   $p_options[ "usePluginCharCounter" ] );
        $p_builder->setAttribute( "usePluginFileUpload",    $p_options[ "usePluginFileUpload" ] );
        $p_builder->setAttribute( "usePluginFontFamily",    $p_options[ "usePluginFontFamily" ] );
        $p_builder->setAttribute( "usePluginFontSize",      $p_options[ "usePluginFontSize" ] );
        $p_builder->setAttribute( "usePluginLists",         $p_options[ "usePluginLists" ] );
        $p_builder->setAttribute( "usePluginMediaManager",  $p_options[ "usePluginMediaManager" ] );
        $p_builder->setAttribute( "usePluginTable",         $p_options[ "usePluginTable" ] );
        $p_builder->setAttribute( "usePluginVideo",         $p_options[ "usePluginVideo" ] );
        
        // Image upload.
        $p_builder->setAttribute( "imageUploadRoute",       $p_options[ "imageUploadRoute" ] );
        $p_builder->setAttribute( "imageUploadRouteDelete", $p_options[ "imageUploadRouteDelete" ] );
        $p_builder->setAttribute( "imageUploadFolder",      $p_options[ "imageUploadFolder" ] );
    }

    /**
     * {@inheritdoc}
     */
    public function buildView( FormView $p_view, FormInterface $p_form, array $p_options )
    {
        //------------------------- DECLARE ---------------------------//
     
        // Config.
        $p_view->vars[ "basePath" ]                     = $p_options[ "basePath" ];
        $p_view->vars[ "language" ]                     = $p_options[ "language" ];
        $p_view->vars[ "inlineMode" ]                   = $p_options[ "inlineMode" ];
        
        // Plugins.
        $p_view->vars[ "usePluginBlockStyles" ]         = $p_options[ "usePluginBlockStyles" ];
        $p_view->vars[ "usePluginColors" ]              = $p_options[ "usePluginColors" ];
        $p_view->vars[ "usePluginCharCounter" ]         = $p_options[ "usePluginCharCounter" ];
        $p_view->vars[ "usePluginFileUpload" ]          = $p_options[ "usePluginFileUpload" ];
        $p_view->vars[ "usePluginFontFamily" ]          = $p_options[ "usePluginFontFamily" ];
        $p_view->vars[ "usePluginFontSize" ]            = $p_options[ "usePluginFontSize" ];
        $p_view->vars[ "usePluginLists" ]               = $p_options[ "usePluginLists" ];
        $p_view->vars[ "usePluginMediaManager" ]        = $p_options[ "usePluginMediaManager" ];
        $p_view->vars[ "usePluginTable" ]               = $p_options[ "usePluginTable" ];
        $p_view->vars[ "usePluginVideo" ]               = $p_options[ "usePluginVideo" ];
        
        // Image upload.
        $p_view->vars[ "imageUploadRoute" ]             = $p_options[ "imageUploadRoute" ];
        $p_view->vars[ "imageUploadRouteDelete" ]       = $p_options[ "imageUploadRouteDelete" ];
        $p_view->vars[ "imageUploadFolder" ]            = $p_options[ "imageUploadFolder" ];
    }

    /**
     * {@inheritdoc}
     */
    public function setDefaultOptions( OptionsResolverInterface $p_resolver )
    {
        //------------------------- DECLARE ---------------------------//
        
        $p_resolver
            ->setDefaults( array(
                    // Config.
                    "basePath"                  => $this->m_container->getParameter( "kms_froala_editor.basePath" ),
                    "language"                  => $this->m_container->getParameter( "kms_froala_editor.language" ),
                    "inlineMode"                => $this->m_container->getParameter( "kms_froala_editor.inlineMode" ),
                    
                    // Plugins.
                    "usePluginBlockStyles"      => $this->m_container->getParameter( "kms_froala_editor.plugins.blockStyles" ),
                    "usePluginColors"           => $this->m_container->getParameter( "kms_froala_editor.plugins.colors" ),
                    "usePluginCharCounter"      => $this->m_container->getParameter( "kms_froala_editor.plugins.charCounter" ),
                    "usePluginFileUpload"       => $this->m_container->getParameter( "kms_froala_editor.plugins.fileUpload" ),
                    "usePluginFontFamily"       => $this->m_container->getParameter( "kms_froala_editor.plugins.fontFamily" ),
                    "usePluginFontSize"         => $this->m_container->getParameter( "kms_froala_editor.plugins.fontSize" ),
                    "usePluginLists"            => $this->m_container->getParameter( "kms_froala_editor.plugins.lists" ),
                    "usePluginMediaManager"     => $this->m_container->getParameter( "kms_froala_editor.plugins.mediaManager" ),
                    "usePluginTable"            => $this->m_container->getParameter( "kms_froala_editor.plugins.table" ),
                    "usePluginVideo"            => $this->m_container->getParameter( "kms_froala_editor.plugins.video" ),
                    
                    // Image upload.
                    "imageUploadRoute"          => $this->m_container->getParameter( "kms_froala_editor.imageUpload.route" ),
                    "imageUploadRouteDelete"    => $this->m_container->getParameter( "kms_froala_editor.imageUpload.routeDelete" ),
                    "imageUploadFolder"         => $this->m_container->getParameter( "kms_froala_editor.imageUpload.folder" ),
            ))
            ->addAllowedTypes( array(
                    "inlineMode"    => "bool"
            ));
    }

    /**
     * {@inheritdoc}
     */
    public function getParent()
    {
        //------------------------- DECLARE ---------------------------//

        return "textarea";
    }
    
    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        //------------------------- DECLARE ---------------------------//
        
        return "froala";
    }
}
