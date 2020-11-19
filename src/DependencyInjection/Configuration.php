<?php

namespace KMS\FroalaEditorBundle\DependencyInjection;

use KMS\FroalaEditorBundle\Utility\UConfiguration;
use Symfony\Component\Config\Definition\Builder\NodeBuilder;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

class Configuration implements ConfigurationInterface
{
    public static $NODE_ROOT = 'kms_froala_editor';

    public function getConfigTreeBuilder(): TreeBuilder
    {
        $treeBuilder = new TreeBuilder(self::$NODE_ROOT);
        $rootNode = $treeBuilder->getRootNode();

        // Add all available configuration nodes.
        $nodeBuilder = $rootNode->addDefaultsIfNotSet()->children();
        $this->addFroalaConfigTree($nodeBuilder);

        // "profiles" are treated separately as they repeat main option structures
        $profileSubTreeBuilder = $nodeBuilder
            ->arrayNode('profiles')
            ->useAttributeAsKey('name')
            ->prototype('array')
            ->children();
        $this->addFroalaConfigTree($profileSubTreeBuilder, false);
        $profileSubTreeBuilder->end()->end();
        $nodeBuilder->end();

        return $treeBuilder;
    }

    /**
     * Add all options to configuration subtree.
     */
    private function addFroalaConfigTree(NodeBuilder $nodeBuilder, bool $addDefaultValue = true): void
    {
        UConfiguration::addArrOptionBoolean($nodeBuilder, $addDefaultValue);
        UConfiguration::addArrOptionInteger($nodeBuilder, $addDefaultValue);
        UConfiguration::addArrOptionString($nodeBuilder, $addDefaultValue);
        UConfiguration::addArrOptionArray($nodeBuilder, $addDefaultValue);
        UConfiguration::addArrOptionObject($nodeBuilder, $addDefaultValue);
    }
}
