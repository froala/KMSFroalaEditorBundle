<?php

namespace KMS\FroalaEditorBundle\Twig;

use KMS\FroalaEditorBundle\DependencyInjection\Configuration;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class FroalaExtension extends AbstractExtension
{
    /**
     * @var ContainerInterface
     */
    protected $container;

    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('froala_display', [$this, 'froalaDisplay'], ['is_safe' => ['html']]),
        ];
    }

    /**
     * Display Froala HTML.
     */
    public function froalaDisplay(?string $html): string
    {
        $str = '';
        $includeCSS = $this->container->getParameter(Configuration::$NODE_ROOT . '.includeCSS');
        $basePath = $this->container->getParameter(Configuration::$NODE_ROOT . '.basePath');

        if ($includeCSS) {
            $url = $this->container->get('templating.helper.assets')
                ->getUrl(trim($basePath, '/') . '/' . 'css/froala_style.min.css');
            $str .= '<link href="' . $url . '" rel="stylesheet" type="text/css" />';
        }

        $str .= '<div class="fr-view">' . $html . '</div>';

        return $str;
    }
}
