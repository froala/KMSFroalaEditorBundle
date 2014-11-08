#KMSFroalaEditorBundle

[![Build Status](https://travis-ci.org/samarhxc/KMSFroalaEditorBundle.svg)](https://travis-ci.org/samarhxc/KMSFroalaEditorBundle)

[![knpbundles.com](http://knpbundles.com/samarhxc/KMSFroalaEditorBundle/badge)](http://knpbundles.com/samarhxc/KMSFroalaEditorBundle)

###Licence

This bundle provides an integration of the WYSIWYG [Froala Editor](https://editor.froala.com/) free version.
For a commercial use, please read the [Froala license agreement](https://editor.froala.com/license) and go to the [pricing page](https://editor.froala.com/pricing).


###Step 1 : Add KMSFroalaEditorBundle to your composer.json

```
{
    "require": {
       "kms/froala-editor-bundle": "0.1.*@dev"
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

###Step 3 : Install the bundle

`$ composer update`

###Step 4 : Configure the bundle (optional)

``` yaml
// app/config.yml

kms_froala_editor:

    # The Froala editor path.
    # Default: the editor version included in the bundle.
    basePath: "/yourCustomFroalaEditorPath"
    
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
    
    # More to come ...
```

###Step 5 : Add Froala to your form

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

###TODO...
* configurations
* tests
* custom file uploader
* ... any idea ?
