# KMSFroalaEditorBundle

[![Package version](https://img.shields.io/packagist/v/kms/froala-editor-bundle.svg)](https://packagist.org/packages/kms/froala-editor-bundle)
[![Downloads](https://img.shields.io/packagist/dt/kms/froala-editor-bundle.svg)](https://packagist.org/packages/kms/froala-editor-bundle)
[![PHP Version](https://img.shields.io/packagist/php-v/kms/froala-editor-bundle.svg)](https://packagist.org/packages/kms/froala-editor-bundle)
[![Licence](https://img.shields.io/packagist/l/kms/froala-editor-bundle.svg)](https://packagist.org/packages/kms/froala-editor-bundle)

## Introduction

This bundle aims to easily integrate & use the Froala editor in Symfony 4.3+/5.0+.

If you want to use it with Symfony < 4.3, see [v2 docs](https://github.com/froala/KMSFroalaEditorBundle/tree/v2).
v2.x is compatible with Symfony 2.x to 4.x, but some deprecations are not fixed and static files are integrated to the
bundle.

The changelog is available here: [CHANGELOG-3.x.md](CHANGELOG-3.x.md).

## Table of Contents

1. [Migration to Froala Editor bundle v3 from v2](#migration-to-froala-editor-bundle-v3-from-v2)
1. [Installation](#installation)
    1. [Step 1: Install the bundle using composer](#step-1-install-the-bundle-using-composer)
    1. [Step 2: Add the bundle to your bundles.php](#step-2-add-the-bundle-to-your-bundlesphp)
    1. [Step 3: Import routes](#step-3-import-routes)
    1. [Step 4: Load Twig form widget](#step-4-load-twig-form-widget)
    1. [Step 5: Configure the bundle](#step-5-configure-the-bundle)
        1. [Required](#required)
        1. [Other options](#other-options)
    1. [Step 6: Add Froala to your form](#step-6-add-froala-to-your-form)
    1. [Step 7: Install asset files](#step-7-install-asset-files)
    1. [Step 8: Display editor content](#step-8-display-editor-content)
        1. [Manually](#manually)
        1. [Using the Twig extension](#using-the-twig-extension)
    1. [Step 9: Profiles (custom configurations)](#step-9-profiles-custom-configurations)
1. [More configuration](#more-configuration)
    1. [Plugins](#plugins)
    1. [Concept: Image upload/manager](#concept-image-uploadmanager)
    1. [Concept: File upload](#concept-file-upload)
    1. [Concept: Autosave](#concept-autosave)
    1. [Webpack Encore configuration](#webpack-encore-configuration)
1. [TODO](#todo)
1. [Licence](#licence)

## Migration to Froala Editor bundle v3 from v2

The Froala Editor bundle got a major upgrade from v2 to v3. It now supports only Symfony 4.3+ and requires PHP 7.1.3+.

As the static files are no longer included (so you don't have to upgrade this bundle for each Froala release) you can
import assets the way you need (using the install command described below or eg. from your public directory).
See install steps below.

The Twig form widget is no more loaded automatically, see [step 4](#step-4-load-twig-form-widget) to see how to load it using configuration.

## Installation

### Step 1: Install the bundle using composer

```bash
composer require kms/froala-editor-bundle
```

Note: if you install the bundle using Symfony Flex & accepted the recipe, you can skip steps 2 to 4.

### Step 2: Add the bundle to your bundles.php

```php
// config/bundles.php
return [
    //..
    KMS\FroalaEditorBundle\KMSFroalaEditorBundle::class => ['all' => true],
];
```

### Step 3: Import routes

```yaml
# config\routes.yaml 
kms_froala_editor:
    resource: '@KMSFroalaEditorBundle/Resources/config/routing.yml'
    prefix:   /froalaeditor
```

### Step 4: Load Twig form widget

```yaml
# In config/packages/twig.yaml
twig:
    form_themes:
        - '@KMSFroalaEditor/Form/froala_widget.html.twig'
```

### Step 5: Configure the bundle

#### Required

First, you have to select your language, other settings are optional (see below).
If you don't have this file you can create one.

```yaml
# config\packages\config.yaml 
kms_froala_editor:
    language: 'nl'
```

### Step 6: Add Froala to your form

Just add a Froala type in your form:

```php
use KMS\FroalaEditorBundle\Form\Type\FroalaEditorType;

$builder-add( "Froalaeditor", FroalaEditorType::class,[
                'mapped' => false,  
                ]);
```

All configuration items can be overridden:

```php
$builder->add('Froalaeditor', FroalaEditorType::class, [
    "language" => "fr",
    "toolbarInline" => true,
    "tableColors" => [ "#FFFFFF", "#FF0000" ],
    "saveParams" => [ "id" => "myEditorField" ]
]);
```

### Step 7: Install asset files

To install the asset files, there is `froala:install` command that downloads the last version available of Froala Editor
and puts it by default in the `vendor/kms/froala-editor-bundle/Resources/public/froala_editor/` directory:

```bash
bin/console froala:install
```

There are a few arguments/options available:

* First (and only) argument (optional): the absolute path where the files will be put after download.
Defaults to `vendor/kms/froala-editor-bundle/Resources/public/froala_editor/`.
* Option `tag`: the version of Froala that will be installed (eg. `v3.0.1`). Defaults to `master`.
* Option `clear` (no value expected, disabled by default): Allow the command to clear a previous install if the path already exists.

After you launched the install command, you have to link assets, eg.:

```bash
bin/console assets:install --symlink public
```
>Note: Make sure the Froala editor asset files are accessible by your application

### Step 8: Display editor content

#### Manually

To preserve the look of the edited HTML outside of the editor you have to include the following CSS files:

```twig
<!-- CSS rules for styling the element inside the editor such as p, h1, h2, etc. -->
<link href="../css/froala_style.min.css" rel="stylesheet" type="text/css" />
```

Also, you should make sure that you put the edited content inside an element that has the class fr-view:

```twig
<div class="fr-view">
    {{ myContentHtml|raw }}
</div>
```
#### Other options

All Froala options ([list provided here](https://www.froala.com/wysiwyg-editor/docs/options)) are supported.
Just add the option name with your value.
If you want to keep Froala default value, don't provide anything in your config file.
For options which require an array, provide a value array.
For options which require an object, provide a key/value array.

Note that some options need some plugins (all information provided in the [Froala documentation](https://www.froala.com/wysiwyg-editor/docs/options)).

Example for each option type below:

```yaml
# config/packages/kms_froala_editor.yaml
kms_froala_editor:
    toolbarInline: true
    tableColors: [ "#FFFFFF", "#FF0000" ]
    saveParams: { "id" : "myEditorField" }
```

To provide a better integration with Symfony, some custom options are added, see the full list below: 

```yaml
# config/packages/kms_froala_editor.yaml
kms_froala_editor:
    # Froala licence number if you want to use a purchased licence.
    serialNumber: "XXXX-XXXX-XXXX"

    # Disable CodeMirror inclusion.
    includeCodeMirror: false

    # Disable Font Awesome inclusion.
    includeFontAwesome: false

    # Disable all bundle javascripts inclusion (not concerning CodeMirror).
    # Usage: if you are using Grunt or other and you want to include yourself all scripts. 
    includeJS: false

    # Disable all bundle CSS inclusion (not concerning Font Awesome nor CodeMirror).
    # Usage: if you are using Grunt or other and you want to include yourself all stylesheets. 
    includeCSS: false

    # Change the froala base path.
    # Useful eg. when you load it from your own public directory.
    # Defaults to "/bundles/kmsfroalaeditor/froala_editor"
    basePath: "/my/custom/path".

    # Custom JS file.
    # Usage: add custom plugins/buttons...
    customJS: "/custom/js/path"
```


#### Using the Twig extension

To use the Twig extension, you have to enable the PHP templating engine:

```yaml
# config/packages/kms_froala_editor.yaml
framework:
    templating:
        engines: ['twig', 'php']
```

Then, simply call the display function (note that the front CSS file is not included if the parameter includeCSS is false):

```twig
{{ froala_display(myContentHtml) }}
```

### Step 9: Profiles (custom configurations)

You can define several configuration profiles that will be reused in your forms, without repeating these configurations.

When using a profile, the root configuration options will be used & overridden:

```yaml
# config/packages/kms_froala_editor.yaml
kms_froala_editor:
    heightMax: 400
    attribution: false
    profiles:
        profile_1:
            heightMax: 500
```

```php
use KMS\FroalaEditorBundle\Form\Type\FroalaEditorType;

$builder->add('yourField', FroalaEditorType::class, [
    'profile' => 'profile_1',
]);
```

In this example, `profile_1` profile will have these configuration options set:

* `heightMax`: 500
* `attribution`: false

## More configuration

### Plugins

All [Froala plugins](https://www.froala.com/wysiwyg-editor/docs/plugins) are enabled, but if you don't need one of them, you can disable some plugins...

```yaml
# config/packages/kms_froala_editor.yaml
kms_froala_editor:
    # Disable some plugins.
    pluginsDisabled: [ "save", "fullscreen" ]
```
... or chose only plugins to enable:

```yaml
# config/packages/kms_froala_editor.yaml
kms_froala_editor:
    # Enable only some plugins.
    pluginsEnabled: [ "image", "file" ]
```

Plugins can be enabled/disabled for each Froala instance by passing the same array in the form builder.

### Concept: Image upload/manager

This bundle provides an integration of the [Froala image upload concept](https://www.froala.com/wysiwyg-editor/docs/concepts/image/upload) to store your images on your own web server (see custom options for configuration like upload folder).

If you want to use your own uploader, you can override the configuration (if you need to do that, please explain me why to improve the provided uploader).

To provide a better integration with Symfony, some custom options are added, see the full list below: 

```yaml
# config/packages/kms_froala_editor.yaml
kms_froala_editor:
    # The image upload folder in your /web directory.
    # Default: "/upload".
    imageUploadFolder: "/my/upload/folder"

    # The image upload URL base.
    # Usage: if you are using URL rewritting for your assets.
    # Default: same value as provided as folder.
    imageUploadPath: "/my/upload/path"
```

### Concept: File upload

This bundle provides an integration of the [Froala file upload concept](https://www.froala.com/wysiwyg-editor/docs/concepts/file/upload) to store your files on your own web server (see custom options for configuration like upload folder).

If you want to use your own uploader, you can override the configuration (if you need to do that, please explain me why to improve the provided uploader).

To provide a better integration with Symfony, some custom options are added, see the full list below: 

```yaml
# config/packages/kms_froala_editor.yaml
kms_froala_editor:
    # The file upload folder in your /web directory.
    # Default: "/upload".
    fileUploadFolder: "/my/upload/folder"

    # The file upload URL base.
    # Usage: if you are using URL rewritting for your assets.
    # Default: same value as provided as folder.
    fileUploadPath: "/my/upload/path"

    # Your public directory, from the root directory.
    # Default: "/public"
    publicDir: "/home"
```

### Concept: Autosave

The [Froala autosave concept](https://www.froala.com/wysiwyg-editor/docs/concepts/save/autosave) to automatically request a save action on your server is working, just enter the correct options in your configuration file:

```yaml
# config/packages/kms_froala_editor.yaml
kms_froala_editor:
    saveURL: "my_save_route"
    saveInterval: 2500
    saveParam: "content"
```

To provide a better integration with Symfony, some custom options are added, see the full list below: 

```yaml
# config/packages/kms_froala_editor.yaml
kms_froala_editor:
    # Add some parameters to your save URL.
    # Usage: if you need parameters to generate your save action route (see save explaination below).
    # Default: null.
    saveURLParams: { "id" : "myId" }
```

You can add some parameters in your save route (see custom options).

### Webpack Encore configuration

If you want to load Froala asset files using npm/yarn and Webpack Encore, here's how to do it:

```javascript
import FroalaEditor from 'froala-editor';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';

// Load your languages
import 'froala-editor/js/languages/fr.js';

// Load all plugins, or specific ones
import 'froala-editor/js/plugins.pkgd.min.js';
import 'froala-editor/css/plugins.pkgd.min.css';

window.FroalaEditor = FroalaEditor;

function froalaDisplayError(p_editor, error ) {
    alert(`Error ${error.code}: ${error.message}`);
}

window.froalaDisplayError = froalaDisplayError;
```

Now you can disable Froala bundle CSS/JS inclusion:

```yaml
# config/packages/kms_froala_editor.yaml
kms_froala_editor:
    includeJS: false
    includeCSS: false
```

Don't forget to import the generated Encore CSS/JS files in your HTML if needed.

## TODO

- Add some tests

## Licence

This bundle provides an integration of the WYSIWYG [Froala Editor](https://www.froala.com/wysiwyg-editor) commercial version.
Please read the [Froala licence agreement](https://www.froala.com/wysiwyg-editor/terms) and go to the [pricing page](https://www.froala.com/wysiwyg-editor/pricing)
if you don't have a licence.
