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
        
        $p_builder->setAttribute( "basePath",           $p_options[ "basePath" ] );
        $p_builder->setAttribute( "language",           $p_options[ "language" ] );
        $p_builder->setAttribute( "inlineMode",         $p_options[ "inlineMode" ] );
    }

    /**
     * {@inheritdoc}
     */
    public function buildView( FormView $p_view, FormInterface $p_form, array $p_options )
    {
     //------------------------- DECLARE ---------------------------//
     
        $p_view->vars[ "basePath" ]         = $p_options[ "basePath" ];
        $p_view->vars[ "language" ]         = $p_options[ "language" ];
        $p_view->vars[ "inlineMode" ]       = $p_options[ "inlineMode" ];
    }

    /**
     * {@inheritdoc}
     */
    public function setDefaultOptions( OptionsResolverInterface $p_resolver )
    {
        //------------------------- DECLARE ---------------------------//
        
        $p_resolver
            ->setDefaults( array(
                    "basePath"          => $this->m_container->getParameter( "kms_froala_editor.basePath" ),
                    "language"          => $this->m_container->getParameter( "kms_froala_editor.language" ),
                    "inlineMode"        => $this->m_container->getParameter( "kms_froala_editor.inlineMode" ),
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
