#KMSFroalaEditorBundle

###Step 1 : Add KMSFroalaEditorBundle to your composer.json

```
{
    "require": {
       //TODO
    }
}
```

###Step 2 : Add the bundle to your AppKernel.php

```
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

```
$builder->add( "yourField", "froala" );
```
