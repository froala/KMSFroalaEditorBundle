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
        $p_container->setParameter( "kms_froala_editor.basePath",   $p_config[ "basePath" ] );
        $p_container->setParameter( "kms_froala_editor.language",   $p_config[ "language" ] );
        $p_container->setParameter( "kms_froala_editor.inlineMode", $p_config[ "inlineMode" ] );
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
