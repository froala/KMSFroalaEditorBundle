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
            
                // Froala base path.
                ->scalarNode( "basePath" )
                    ->defaultValue( "/bundles/kmsfroalaeditor/" )
                    ->info( "URL path used to load Froala files from." )
                ->end()
                
                // Language.
                ->scalarNode( "language" )
                    ->defaultValue( "en_us" )
                    ->info( "Editor's language." )
                ->end()
                
                // Inline mode.
                ->booleanNode( "inlineMode" )
                    ->defaultFalse()
                    ->info( "Enable/disable inline mode." )
                ->end()
                
            ->end();
        
        return $treeBuilder;
    }
}
