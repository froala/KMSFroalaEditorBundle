<?php

	namespace KMS\FroalaEditorBundle\Twig;

	use KMS\FroalaEditorBundle\DependencyInjection\Configuration;
	use Symfony\Component\DependencyInjection\ContainerInterface;
    use Twig\Extension\AbstractExtension;
    use Twig\TwigFunction;

    /**
	 * Class FroalaExtension
	 * @package KMS\FroalaEditorBundle\Twig\Extension
	 */
	class FroalaExtension extends AbstractExtension
	{

		//-------------------------------------------------------------//
		//--------------------------- MEMBERS -------------------------//
		//-------------------------------------------------------------//

		/**
		 * @var ContainerInterface $container Container interface
		 */
		protected $m_container;

		//-------------------------------------------------------------//
		//------------------------- CONSTRUCTOR -----------------------//
		//-------------------------------------------------------------//

		/**
		 * @param ContainerInterface $p_container
		 */
		public function __construct( ContainerInterface $p_container )
		{
			$this->m_container = $p_container;
		}

		//-------------------------------------------------------------//
		//--------------------------- METHODS -------------------------//
		//-------------------------------------------------------------//

		/**
		 * Display Froala HTML.
		 * @param string $p_html
		 * @return string
		 */
		function froalaDisplay( $p_html )
		{
			$str        = "";
			$includeCSS = $this->m_container->getParameter( Configuration::$NODE_ROOT . ".includeCSS" );
			$basePath   = $this->m_container->getParameter( Configuration::$NODE_ROOT . ".basePath" );
			//------------------------- DECLARE ---------------------------//

			if( $includeCSS )
			{
				$url = $this->m_container->get( "templating.helper.assets" )->getUrl( trim( $basePath, '/' ) . '/' .
																					  "css/froala_style.min.css" );
				$str .= "<link href=\"" . $url . "\" rel=\"stylesheet\" type=\"text/css\" />";
			}

			$str .= "<div class=\"fr-view\">" . $p_html . "</div>";

			return $str;
		}

		// -------------------------------------------------------------//
		// --------------------------- OVERRIDE ------------------------//
		// -------------------------------------------------------------//

		/**
		 * Returns a list of functions to add to the existing list.
		 * @return array An array of functions
		 */
		public function getFunctions()
		{
			return [
			    new TwigFunction('froala_display', [$this, 'froalaDisplay'], ['is_safe' => ['html']]),
            ];
		}
	}