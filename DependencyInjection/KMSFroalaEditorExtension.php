<?php

namespace KMS\FroalaEditorBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\Loader;
use Symfony\Component\HttpKernel\DependencyInjection\ConfigurableExtension;
use KMS\EngineBundle\Utility\UDebug;

/**
 * KMS Froala extension.
 */
class KMSFroalaEditorExtension extends Extension
{
    
    //-------------------------------------------------------------//
    //--------------------------- METHODS -------------------------//
    //-------------------------------------------------------------//
    
    /**
     * Load resources.
     * @param $p_container is the container.
     */
    private function loadResources( ContainerBuilder $p_container )
    {
        //------------------------- DECLARE ---------------------------//
    
        $p_container->setParameter(
                "twig.form.resources", array_merge(
                        array( "KMSFroalaEditorBundle:Form:froala_widget.html.twig" ),
                        $p_container->getParameter( "twig.form.resources" )
                )
        );
    }
    
    /**
     * Load config.
     * @param $p_container is the container.
     */
    private function loadConfig( ContainerBuilder $p_container, $p_config )
    {
        //------------------------- DECLARE ---------------------------//
    
        $p_config[ "basePath" ] = ltrim( $p_config[ "basePath" ], '/' );
        $p_container->setParameter( "kms_froala_editor.basePath",           $p_config[ "basePath" ] );
        $p_container->setParameter( "kms_froala_editor.includeJQuery",      $p_config[ "includeJQuery" ] );
        $p_container->setParameter( "kms_froala_editor.includeFontAwesome", $p_config[ "includeFontAwesome" ] );
        $p_container->setParameter( "kms_froala_editor.language",           $p_config[ "language" ] );
        $p_container->setParameter( "kms_froala_editor.inlineMode",         $p_config[ "inlineMode" ] );
        
        // Load plugins.
        $this->loadPlugins( $p_container, $p_config );
        
        // Load image upload.
        $this->loadImageUpload( $p_container, $p_config );
        
        // Load media manager.
        $this->loadMediaManager( $p_container, $p_config );
        
        // Load auto save.
        $this->loadAutoSave( $p_container, $p_config );
    }
    
    /**
     * Load plugins.
     */
    private function loadPlugins( ContainerBuilder $p_container, $p_config )
    {
        //------------------------- DECLARE ---------------------------//
        
        $pluginsNode = $p_config[ "plugins" ];
        
        $p_container->setParameter( "kms_froala_editor.plugins.blockStyles",    $pluginsNode[ "blockStyles" ] );
        $p_container->setParameter( "kms_froala_editor.plugins.colors",         $pluginsNode[ "colors" ] );
        $p_container->setParameter( "kms_froala_editor.plugins.charCounter",    $pluginsNode[ "charCounter" ] );
        $p_container->setParameter( "kms_froala_editor.plugins.fileUpload",     $pluginsNode[ "fileUpload" ] );
        $p_container->setParameter( "kms_froala_editor.plugins.fontFamily",     $pluginsNode[ "fontFamily" ] );
        $p_container->setParameter( "kms_froala_editor.plugins.fontSize",       $pluginsNode[ "fontSize" ] );
        $p_container->setParameter( "kms_froala_editor.plugins.fullscreen",     $pluginsNode[ "fullscreen" ] );
        $p_container->setParameter( "kms_froala_editor.plugins.lists",          $pluginsNode[ "lists" ] );
        $p_container->setParameter( "kms_froala_editor.plugins.mediaManager",   $pluginsNode[ "mediaManager" ] );
        $p_container->setParameter( "kms_froala_editor.plugins.tables",         $pluginsNode[ "tables" ] );
        $p_container->setParameter( "kms_froala_editor.plugins.urls",           $pluginsNode[ "urls" ] );
        $p_container->setParameter( "kms_froala_editor.plugins.video",          $pluginsNode[ "video" ] );
    }
    
    /**
     * Load image upload.
     */
    private function loadImageUpload( ContainerBuilder $p_container, $p_config )
    {
        //------------------------- DECLARE ---------------------------//
    
        $imageUploadNode = $p_config[ "imageUpload" ];
        
        $p_container->setParameter( "kms_froala_editor.imageUpload.route",  $imageUploadNode[ "route" ] );
        $p_container->setParameter( "kms_froala_editor.imageUpload.routeDelete", $imageUploadNode[ "routeDelete" ] );
        $p_container->setParameter( "kms_froala_editor.imageUpload.folder", $imageUploadNode[ "folder" ] );
    }
    
    /**
     * Load media manager.
     */
    private function loadMediaManager( ContainerBuilder $p_container, $p_config )
    {
        //------------------------- DECLARE ---------------------------//
    
        $mediaManagerNode = $p_config[ "mediaManager" ];
    
        $p_container->setParameter( "kms_froala_editor.mediaManager.route",  $mediaManagerNode[ "route" ] );
    }
    
    /**
     * Load auto save.
     */
    private function loadAutoSave( ContainerBuilder $p_container, $p_config )
    {
        //------------------------- DECLARE ---------------------------//
    
        $autosaveNode = $p_config[ "autosave" ];
    
        $p_container->setParameter( "kms_froala_editor.autosave.active"         , $autosaveNode[ "active" ] );
        $p_container->setParameter( "kms_froala_editor.autosave.interval"       , $autosaveNode[ "interval" ] );
        $p_container->setParameter( "kms_froala_editor.autosave.route"          , $autosaveNode[ "route" ] );
        $p_container->setParameter( "kms_froala_editor.autosave.requestType"    , $autosaveNode[ "requestType" ] );
        
        if( isset( $autosaveNode[ "params" ] ) )
        {
            $array = $autosaveNode[ "params" ];
        }
        else
        {
            $array = array();
        }
        $p_container->setParameter( "kms_froala_editor.autosave.params" , $array );
        
        if( isset( $autosaveNode[ "routeParams" ] ) )
        {
            $array = $autosaveNode[ "routeParams" ];
        }
        else
        {
            $array = array();
        }
        $p_container->setParameter( "kms_froala_editor.autosave.routeParams" , $array );
    }
    
    //-------------------------------------------------------------//
    //--------------------------- OVERRIDE ------------------------//
    //-------------------------------------------------------------//
    
    /**
     * {@inheritdoc}
     */
    public function load( array $p_configs, ContainerBuilder $p_container )
    {
        $configuration = new Configuration();
        $config = $this->processConfiguration( $configuration, $p_configs );
        $loader = new Loader\YamlFileLoader( $p_container, new FileLocator( __DIR__ . "/../Resources/config" ) );
        //------------------------- DECLARE ---------------------------//
        
        $loader->load( "services.yml" );
        
        $this->loadResources( $p_container );
        $this->loadConfig( $p_container, $config );
    }
    
}
