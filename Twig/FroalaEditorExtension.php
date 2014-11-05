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
     * @param $p_id is the textarea ID.
     */
    public function twigRenderEditable( $p_id, $p_inlineMode )
    {
        //------------------------- DECLARE ---------------------------//
    
        return sprintf( "$( function() { $( \"#%s\" ).editable( { inlineMode : %s } ) } );", $p_id, $p_inlineMode );
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