<?php

namespace KMS\FroalaEditorBundle\Twig;


/**
 * Froala editor Twig extension.
 */
class FroalaEditorExtension extends \Twig_Extension
{
    
    //-------------------------------------------------------------//
    //--------------------------- MEMBERS -------------------------//
    //-------------------------------------------------------------//
    
    //-------------------------------------------------------------//
    //-------------------------- CONSTRUCTOR ----------------------//
    //-------------------------------------------------------------//

    //-------------------------------------------------------------//
    //--------------------------- METHODS -------------------------//
    //-------------------------------------------------------------//
    
    /**
     * Render the main Froala command (used to start the plugin).
     */
    public function twigRenderEditable( $p_id, $p_inlineMode, $p_language )
    {
        //------------------------- DECLARE ---------------------------//
        return sprintf( "$( function() { $( \"#%s\" ).editable( { language: \"%s\", inlineMode : %s } ) } );",
                    $p_id, //
                    $p_language, //
                    $p_inlineMode ? "true" : "false" );
    }
    
    //-------------------------------------------------------------//
    //--------------------------- OVERRIDE ------------------------//
    //-------------------------------------------------------------//
    
    /**
     * {@inheritdoc}
     */
    public function getFunctions()
    {
        $options = array( "is_safe" => array( "html" ) );
        //------------------------- DECLARE ---------------------------//
        
        return array(
                new \Twig_SimpleFunction( "froala_editable", array( $this, "twigRenderEditable" ), $options ),
        );
    }
    
    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        //------------------------- DECLARE ---------------------------//
        
        return "kms_froala_editor";
    }
    
}