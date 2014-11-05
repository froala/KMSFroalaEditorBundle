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
       //TODO
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

No configuration yet.

###Step 5 : Add Froala to your form

``` php
$builder->add( "yourField", "froala", array(
    "inlineMode" => true // Default value is FALSE.
) );
```

###TODO...
* configurations
* tests
* custom file uploader
* ... any idea ?
