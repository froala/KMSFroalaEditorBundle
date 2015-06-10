<?php
namespace KMS\FroalaEditorBundle\DependencyInjection;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * KMS Froala configuration.
 */
class Configuration implements ConfigurationInterface
{
    
    // -------------------------------------------------------------//
    // --------------------------- METHODS -------------------------//
    // -------------------------------------------------------------//
    
    // -------------------------------------------------------------//
    // --------------------------- OVERRIDE ------------------------//
    // -------------------------------------------------------------//
    
    /**
     *
     * @ERROR!!!
     *
     */
    public function getConfigTreeBuilder ()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root("kms_froala_editor");
        // ------------------------- DECLARE ---------------------------//
        
        $rootNode->children()
            ->
        // Froala base path.
        scalarNode("basePath")
            ->defaultValue("/bundles/kmsfroalaeditor/")
            ->info("URL path used to load Froala files from.")
            ->end()
            ->
        // Serial number.
        scalarNode("serialNumber")
            ->defaultNull()
            ->info("Serial number to use a purchased Froala license.")
            ->end()
            ->
        // Language.
        scalarNode("language")
            ->defaultValue("en_us")
            ->info("Editor's language.")
            ->end()
            ->
        // JQuery inclusion.
        booleanNode("includeJQuery")
            ->defaultTrue()
            ->info("Include JQuery lib.")
            ->end()
            ->
        // Font Awesome inclusion.
        booleanNode("includeFontAwesome")
            ->defaultTrue()
            ->info("Include Font Awesome lib.")
            ->end()
            ->
        // Inline mode.
        booleanNode("inlineMode")
            ->defaultNull()
            ->info("Enable/disable inline mode.")
            ->end()
            ->
        // Min height.
        integerNode("minHeight")
            ->defaultNull()
            ->info("Min height.")
            ->end()
            ->
        // Max height.
        integerNode("maxHeight")
            ->defaultNull()
            ->info("Max height.")
            ->end()
            ->
        // Width.
        integerNode("width")
            ->defaultNull()
            ->info("Width.")
            ->end()
            ->
        // Height.
        integerNode("height")
            ->defaultNull()
            ->info("Height.")
            ->end()
            ->
        // Plain paste.
        booleanNode("plainPaste")
            ->defaultNull()
            ->info(
                "Removes text formatting when pasting content into the editor.")
            ->end()
            ->
        // Tab spaces.
        booleanNode("tabSpaces")
            ->defaultNull()
            ->info("When TAB key is hit, the editor will add 4 spaces.")
            ->end()
            ->
        // Multiline.
        booleanNode("multiLine")
            ->defaultNull()
            ->info("Allow new line to be inserted when ENTER key is hit.")
            ->end()
            ->
        // Paragraphy.
        booleanNode("paragraphy")
            ->defaultNull()
            ->info("Use paragraphs for new line.")
            ->end()
            ->
        // Placeholder.
        scalarNode("placeholder")
            ->defaultNull()
            ->info("The placeholder used when the editor body is empty.")
            ->end()
            ->
        // Theme.
        scalarNode("theme")
            ->defaultNull()
            ->info(
                "Specify the theme name to use in the editor. The theme should be included as CSS.")
            ->end()
            ->
        // Unlink button.
        booleanNode("unlinkButton")
            ->defaultNull()
            ->info(
                "Shows 'Unlink' button in the link edit popup when the option is set to true.")
            ->end()
            ->
        // Beautify code.
        booleanNode("beautifyCode")
            ->defaultNull()
            ->info("Format the source code in HTML view for a better reading.")
            ->end()
            ->
        // Buttons.
        arrayNode("buttons")
            ->info("The list of buttons that appear in the editor toolbar.")
            ->end()
            ->
        // Convert mail addresses.
        booleanNode("convertMailAddresses")
            ->defaultNull()
            ->info(
                "Email addresses inserted as link are converted to mailto: links.")
            ->end()
            ->
        // Plugins.
        arrayNode("plugins")
            ->addDefaultsIfNotSet()
            ->children()
            ->booleanNode("blockStyles")
            ->defaultTrue()
            ->info("Use plugin : Block Style.")
            ->end()
            ->booleanNode("colors")
            ->defaultTrue()
            ->info("Use plugin : Colors.")
            ->end()
            ->booleanNode("charCounter")
            ->defaultTrue()
            ->info("Use plugin : Char counter.")
            ->end()
            ->booleanNode("fileUpload")
            ->defaultTrue()
            ->info("Use plugin : File upload.")
            ->end()
            ->booleanNode("fontFamily")
            ->defaultTrue()
            ->info("Use plugin : Font family.")
            ->end()
            ->booleanNode("fontSize")
            ->defaultTrue()
            ->info("Use plugin : Font size.")
            ->end()
            ->booleanNode("fullscreen")
            ->defaultTrue()
            ->info("Use plugin : Fullscreen.")
            ->end()
            ->booleanNode("lists")
            ->defaultTrue()
            ->info("Use plugin : Lists.")
            ->end()
            ->booleanNode("mediaManager")
            ->defaultTrue()
            ->info("Use plugin : Media manager.")
            ->end()
            ->booleanNode("tables")
            ->defaultTrue()
            ->info("Use plugin : Tables.")
            ->end()
            ->booleanNode("urls")
            ->defaultTrue()
            ->info("Use plugin : URLs.")
            ->end()
            ->booleanNode("video")
            ->defaultTrue()
            ->info("Use plugin : Video.")
            ->end()
            ->end()
            ->end()
            ->
        // Media manager.
        arrayNode("imageUpload")
            ->addDefaultsIfNotSet()
            ->children()
            ->scalarNode("route")
            ->defaultValue("kms_froala_editor_upload_image")
            ->info("Image upload route.")
            ->end()
            ->scalarNode("routeDelete")
            ->defaultValue("kms_froala_editor_delete_image")
            ->info("Image delete route.")
            ->end()
            ->scalarNode("folder")
            ->defaultValue("/upload")
            ->info("Image physical folder from web directory.")
            ->end()
            ->scalarNode("path")
            ->defaultNull()
            ->info("Image path from base path (default same as folder).")
            ->end()
            ->end()
            ->end()
            ->
        // Media manager.
        arrayNode("mediaManager")
            ->addDefaultsIfNotSet()
            ->children()
            ->scalarNode("route")
            ->defaultValue("kms_froala_editor_load_images")
            ->info("Media manager route.")
            ->end()
            ->end()
            ->end()
            ->
        // Auto save.
        arrayNode("autosave")
            ->addDefaultsIfNotSet()
            ->children()
            ->booleanNode("active")
            ->defaultFalse()
            ->info("Enable/disable autosave.")
            ->end()
            ->integerNode("interval")
            ->defaultValue("10000")
            ->info("Autosave interval delay.")
            ->end()
            ->scalarNode("route")
            ->defaultValue("")
            ->info("Autosave route.")
            ->end()
            ->scalarNode("requestType")
            ->defaultValue("POST")
            ->info("Autosave route.")
            ->end()
            ->arrayNode("params")
            ->info("The array of custom parameters posted with editor data.")
            ->end()
            ->arrayNode("routeParams")
            ->info(
                "The array of custom parameters passed to Symfony to generate the autosave route.")
            ->end()
            ->end()
            ->end()
            ->end();
        
        return $treeBuilder;
    }
}
