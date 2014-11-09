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
                
                // Plugins.
                ->arrayNode( "plugins" )
                    ->addDefaultsIfNotSet()
                    ->children()
                        ->booleanNode( "blockStyles" )
                            ->defaultTrue()
                            ->info( "Use plugin : Block Style." )
                        ->end()
                        ->booleanNode( "colors" )
                            ->defaultTrue()
                            ->info( "Use plugin : Colors." )
                        ->end()
                        ->booleanNode( "charCounter" )
                            ->defaultTrue()
                            ->info( "Use plugin : Char counter." )
                        ->end()
                        ->booleanNode( "fileUpload" )
                            ->defaultTrue()
                            ->info( "Use plugin : File upload." )
                        ->end()
                        ->booleanNode( "fontFamily" )
                            ->defaultTrue()
                            ->info( "Use plugin : Font family." )
                        ->end()
                        ->booleanNode( "fontSize" )
                            ->defaultTrue()
                            ->info( "Use plugin : Font size." )
                        ->end()
                        ->booleanNode( "lists" )
                            ->defaultTrue()
                            ->info( "Use plugin : Lists." )
                        ->end()
                        ->booleanNode( "mediaManager" )
                            ->defaultTrue()
                            ->info( "Use plugin : Media manager." )
                        ->end()
                        ->booleanNode( "table" )
                            ->defaultTrue()
                            ->info( "Use plugin : Table." )
                        ->end()
                        ->booleanNode( "video" )
                            ->defaultTrue()
                            ->info( "Use plugin : Video." )
                        ->end()
                    ->end()
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
