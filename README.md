#KMSFroalaEditorBundle

[![knpbundles.com](http://knpbundles.com/froala/KMSFroalaEditorBundle/badge)](http://knpbundles.com/froala/KMSFroalaEditorBundle)

##Licence

This bundle provides an integration of the WYSIWYG [Froala Editor](https://editor.froala.com/) free version.
For a commercial use, please read the [Froala license agreement](https://editor.froala.com/license) and go to the [pricing page](https://editor.froala.com/pricing).

##Quick installation guide

###Step 1 : Add KMSFroalaEditorBundle to your composer.json

```
{
    "require": {
       "kms/froala-editor-bundle": "dev-master"
    }
}
```

###Step 2 : Add the bundle to your AppKernel.php

``` php
// app/AppKernel.php

public function registerBundles()
{
    $bundles = array(
        // ...
        new KMS\FroalaEditorBundle\KMSFroalaEditorBundle(),
    );
}
```

###Step 3 : Import routes

``` yaml
// app/config/routing.yml
kms_froala_editor:
    resource: "@KMSFroalaEditorBundle/Resources/config/routing.yml"
    prefix:   /froalaeditor
```

###Step 4 : Install the bundle

`$ composer update`

###Step 5 : Configure the bundle (optional)

``` yaml
// app/config.yml

kms_froala_editor:

    # The Froala editor path.
    # Default: the editor version included in the bundle.
    basePath: "/yourCustomFroalaEditorPath/"
    
    # The editor language.
    # Default: "en_us".
    # More : see Resources/public/js/langs for all languages.
    language: "nl"
    
    #######################################################################
    # See https://editor.froala.com/options to all configurations bellow. #
    #######################################################################
    
    # The inline mode.
    # Default: false.
    inlineMode: true
```

###Step 6 : Add Froala to your form

Just add a froala type in your form:

``` php
$builder->add( "yourField", "froala" );
```

All configuration items can be overridden:

``` php
$builder->add( "yourField", "froala", array(
    "language" => "fr",
    "inlineMode" => true
) );
```

##More configuration

###Plugins

All [Froala plugins](https://editor.froala.com/plugins) are enabled, but if you don't need one of them, you can disable it in the configuration, full list provided bellow:

``` yaml
// app/config.yml

kms_froala_editor:

    # Plugins.
    # Default: all plugins are enabled.
    plugins:
        blockStyles: false
        colors: false
        charCounter: false
        fileUpload: false
        fontFamily: false
        fontSize: false
        lists: false
        mediaManager: false
        table: false
        video: false
```

Plugins can be disabled for each Froala instance in the form builer too:

``` php
$builder->add( "yourField", "froala", array(
    "usePluginCharCounter" => false, 
    "usePlugin<PluginNameInConfiguration>" => false,
) );
```

###Concept: Image upload

This bundle provides an integration of the [Froala image upload concept](https://editor.froala.com/concepts/image-upload) to store your images on your own web server. Files are uploaded in the web/upload folder.

If you want to use your own uploader, or change the upload folder, you can modify the configuration:

``` yaml
// app/config.yml

kms_froala_editor:
    
    # Image uploader.
    imageUpload:
        # Default: the uploader integrated in this bundle.
        route: myCustomImageUploadRoute
        # Default: the uploader integrated in this bundle.
        routeDelete: myCustomImageDeleteRoute
        # Default: /upload (in web directory).
        folder: /myWebDirectory
```

You can also provide those data in the form builder:

``` php
$builder->add( "yourField", "froala", array(
    "imageUploadFolder" => "/myWebDirectory"
) );
```

###TODO
* auto save
* media manager
* file upload
* ... any idea ?
