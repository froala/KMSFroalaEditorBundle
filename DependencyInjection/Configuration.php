<?php

namespace KMS\FroalaEditorBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * KMS Froala configuration.
 */
class Configuration implements ConfigurationInterface
{
    
    //-------------------------------------------------------------//
    //--------------------------- METHODS -------------------------//
    //-------------------------------------------------------------//
    
    //-------------------------------------------------------------//
    //--------------------------- OVERRIDE ------------------------//
    //-------------------------------------------------------------//
    
    /**
     * {@inheritdoc}
     */
    public function getConfigTreeBuilder()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root( "kms_froala_editor" );
        //------------------------- DECLARE ---------------------------//
        
        $rootNode
            ->children()
                ->scalarNode( "base_path" )
                ->defaultValue( "/bundles/kmsfroalaeditor/" )
                ->info( "The base URL path used to load Froala files from." )
                ->end()
                ->scalarNode( "language" )
                ->defaultValue( "en_us" )
                ->info( "Editor's language" )
                ->end()
            ->end();
        
        return $treeBuilder;
    }
}
