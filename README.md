# KMSFroalaEditorBundle

[![Packagist](https://img.shields.io/packagist/v/kms/froala-editor-bundle.svg)](https://packagist.org/packages/kms/froala-editor-bundle)
[![Packagist](https://img.shields.io/packagist/dt/kms/froala-editor-bundle.svg)](https://packagist.org/packages/kms/froala-editor-bundle)
[![Packagist](https://img.shields.io/packagist/l/kms/froala-editor-bundle.svg)](https://packagist.org/packages/kms/froala-editor-bundle)

## Symfony 3 & 4 update

This bundle is now compatible with Symfony 2, 3 and 4 on the same branch (dev-master).

## Migration to Froala Editor v2

Froala released a new version of its editor, this update is the opportunity to redo the major part of this bundle.
To migrate from v1 to v2, you have to update your configuration file. Then, read [display editor content chapter](https://github.com/froala/KMSFroalaEditorBundle#step-7--display-editor-content). Just follow instructions bellow, it's easier and faster than before.

## Installation

#### Step 1 : Add KMSFroalaEditorBundle to your composer.json (according to your needed version)

```
{
  "require": {
    "kms/froala-editor-bundle": "dev-master"
  }
}
```

#### Step 2 : Add the bundle to your bundles.php

``` php
// config/bundles.php

return [
    //..
    //..
    KMS\FroalaEditorBundle\KMSFroalaEditorBundle::class => ['all' => true],
];
```

#### Step 3 : Import routes

``` yaml
// config/routes.yaml
kms_froala_editor:
  resource: "@KMSFroalaEditorBundle/Resources/config/routing.yml"
  prefix:   /froalaeditor
```

#### Step 4 : Install the bundle

`$ composer update`

#### Step 5 : Configure the bundle

#### Required

Firstly, you have to select your language, other settings are optionals (see below).

``` yaml
// config/packages/config.yaml
// if file doesn't exist, create one at path config/packages/config.yaml

kms_froala_editor:

  language: "nl"
   
```

#### Optionals

All Froala options ([list provided here](https://editor.froala.com/options)) are supported.
Just add the option name with your value.
If you want to keep the Froala default value, don't provide anything in your config file.
For options wich require an array, provide an value array.
For options wich require an object, provide an key/value array.

Note that some options needs some plugins (all information provided in the [Froala documentation](https://editor.froala.com/options)).

Example for each option types bellow:

``` yaml
// config/packages/config.yaml

kms_froala_editor:

  toolbarInline: true
  tableColors: [ "#FFFFFF", "#FF0000" ]
  saveParams: { "id" : "myEditorField" }
   
```

To provide a better integration with Symfony, some custom options are added, see the full list bellow: 

``` yaml
// config/packages/config.yaml

kms_froala_editor:
    
  # Froala license number if you want to use a purchased license.
  serialNumber: "XXXX-XXXX-XXXX"
  
  # Disable JQuery inclusion.
  includeJQuery: false
  
  # Disable CodeMirror inclusion.
  includeCodeMirror: false
  
   # Disable Font Awesome inclusion.
  includeFontAwesome: false
  
  # Disable all bundle javascripts inclusion (not concerning JQuery nor CodeMirror).
  # Usage: if you are using Grunt or other and you want to include yourself all scripts. 
  includeJS: false
  
  # Disable all bundle CSS inclusion (not concerning Font Awesome nor CodeMirror).
  # Usage: if you are using Grunt or other and you want to include yourself all stylesheets. 
  includeCSS: false
  
  # Change the froala base path.
  # Usage: let me know, I don't think it's usefull.
  basePath: "/my/custom/path".
  
  # Custom JS file.
  # Usage: add custom plugins/buttons...
  customJS: "/custom/js/path"
```

#### Step 6 : Add Froala to your form

Just add a froala type in your form:

``` php
use KMS\FroalaEditorBundle\Form\Type\FroalaEditorType; // Symfony 4
//..
$builder->add( "yourField", "froala" ); // Symfony 2
$builder->add( "yourField", FroalaEditorType::class ); // Symfony 3 & 4
```

All configuration items can be overridden:

``` php
$builder->add( "yourField", "froala", array(
    "language" => "fr",
    "toolbarInline" => true,
    "tableColors" => [ "#FFFFFF", "#FF0000" ],
    "saveParams" => [ "id" => "myEditorField" ]
) );
```

#### Step 7 : Display editor content

##### - Manually

To preserve the look of the edited HTML outside of the editor you have to include the following CSS files:

``` twig
<!-- CSS rules for styling the element inside the editor such as p, h1, h2, etc. -->
<link href="../css/froala_style.min.css" rel="stylesheet" type="text/css" />
```

Also, you should make sure that you put the edited content inside an element that has the class fr-view:

``` twig
<div class="fr-view">
  {{ myContentHtml | raw }}
</div>
```

##### - Using the Twig extension

To use the Twig extension, you have to enable the PHP templating engine:

``` yaml
// app/config.yml

framework:
  templating:
    engines: ['twig', 'php']
```

Then, simply call the display function (note that the front CSS file is not included if the parameter includeCSS is false ):

``` twig
{{ froala_display( myContentHtml ) }}
```

## More configuration

#### Plugins

All [Froala plugins](https://editor.froala.com/plugins) are enabled, but if you don't need one of them, you can disable some plugins...

``` yaml
// app/config.yml

kms_froala_editor:
  # Disable some plugins.
  pluginsDisabled: [ "save", "fullscreen" ]
```
... or chose only plugins to enable:

``` yaml
// app/config.yml

kms_froala_editor:
  # Disable some plugins.
  pluginsEnabled: [ "image", "file" ]
```

Plugins can be enabled/disabled for each Froala instance by passing the same array in the form builer.

#### Concept: Image upload/manager

This bundle provides an integration of the [Froala image upload concept](https://editor.froala.com/concepts/image-upload) to store your images on your own web server (see custom options for configuration like upload folder).

If you want to use your own uploader, you can override the configuration (if you need to do that, please explain me why to improve the provided uploader).

To provide a better integration with Symfony, some custom options are added, see the full list bellow: 

``` yaml
// app/config.yml

kms_froala_editor:
  # The image upload folder in your /web directory.
  # Default: "/upload".
  imageUploadFolder: "/my/upload/folder"
  
  # The image upload URL base.
  # Usage: if you are using URL rewritting for your assets.
  # Default: same value as provided as folder.
  imageUploadPath: "/my/upload/path"
```

#### Concept: File upload

This bundle provides an integration of the [Froala file upload concept](https://editor.froala.com/concepts/file-upload) to store your files on your own web server (see custom options for configuration like upload folder).

If you want to use your own uploader, you can override the configuration (if you need to do that, please explain me why to improve the provided uploader).

To provide a better integration with Symfony, some custom options are added, see the full list bellow: 

``` yaml
// app/config.yml

kms_froala_editor:
  # The file upload folder in your /web directory.
  # Default: "/upload".
  fileUploadFolder: "/my/upload/folder"
  
  # The file upload URL base.
  # Usage: if you are using URL rewritting for your assets.
  # Default: same value as provided as folder.
  fileUploadPath: "/my/upload/path"
  
  # Your public directory, from the root directory.
  # Default: "/web"
  publicDir: "/public"
```

#### Concept: Autosave

The [Froala autosave concept](https://www.froala.com/wysiwyg-editor/docs/concepts/autosave) to automatically request a save action on your server is working, just enter the correct options in your configuration file:

``` yaml
// app/config.yml

kms_froala_editor:
  saveURL: "my_save_route"
  saveInterval: 2500
  saveParam: "content"
```

To provide a better integration with Symfony, some custom options are added, see the full list bellow: 

``` yaml
// app/config.yml

kms_froala_editor:
  # Add some parameters to your save URL.
  # Usage: if you need parameters to generate your save action route (see save explaination below).
  # Default: null.
  saveURLParams: { "id" : "myId" }
```

You can add some parameters in your save route (see custom options).

## TODO
- Add some tests

## License

This bundle provides an integration of the WYSIWYG [Froala Editor](https://editor.froala.com/) free version.
For a commercial use, please read the [Froala license agreement](https://editor.froala.com/license) and go to the [pricing page](https://editor.froala.com/pricing).
