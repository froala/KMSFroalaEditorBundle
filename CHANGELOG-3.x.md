CHANGELOG FOR 3.X
=================

3.1.0
-----

* Minimum PHP version set to 7.2
* Upgraded `doctrine/inflector` requirement from `^1.3` to `^1.4|2.0` to fix deprecations
* Added first test

3.0.3
-----

* Added support for Symfony 5.0+ and Twig 3

3.0.2
-----

* Fixed error when throwing an exception if using a profile that does not exist

3.0.1
-----

* Moved TwigBundle dependency in "require" section in composer.json

3.0.0
-----

* Removed Froala Editor frontend files
* Supports Symfony 4.3+ only
* Minimum PHP version set to 7.1.3
* Added the `froala:install` command to may be able to retrieve Froala Editor files
* Fixed deprecations for Symfony 4.3
* The form widget layout is no longer loaded using DI
* Added "attribution" config key
