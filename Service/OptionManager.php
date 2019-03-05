<?php

	namespace KMS\FroalaEditorBundle\Service;

	use Symfony\Component\Routing\RouterInterface;

	/**
	 * Class ParameterManager
	 * @package KMS\FroalaEditorBundle\Service
	 */
	class OptionManager
	{

		// -------------------------------------------------------------//
		// --------------------------- MEMBERS -------------------------//
		// -------------------------------------------------------------//

		/**
		 * @var \Symfony\Component\Routing\RouterInterface
		 */
		private $m_router;

		// -------------------------------------------------------------//
		// -------------------------- CONSTRUCTOR ----------------------//
		// -------------------------------------------------------------//

		/**
		 * Constructor.
		 */
		public function __construct( RouterInterface  $p_router )
		{
			// ------------------------- DECLARE ---------------------------//

			$this->m_router = $p_router;
		}

		// -------------------------------------------------------------//
		// --------------------------- METHODS -------------------------//
		// -------------------------------------------------------------//

		/**
		 * Prepare options before building view.
		 * @param array $p_arrOption
		 */
		public function prepareOptions( array & $p_arrOption )
		{
			//------------------------- DECLARE ---------------------------//

			$this->formatOptions( $p_arrOption );
			$this->generateRoutes( $p_arrOption );
			$this->addImageCustomParams( $p_arrOption );
			$this->addFileCustomParams( $p_arrOption );
			$this->addVideoCustomParams( $p_arrOption );
		}
		// -------------------------------------------------------------//
		// --------------------------- PRIVATE -------------------------//
		// -------------------------------------------------------------//

		/**
		 * Format some options.
		 * @param array $p_arrOption
		 */
		private function formatOptions( array & $p_arrOption )
		{
			$basePath          = $p_arrOption[ "basePath" ];
			$imageUploadFolder = $p_arrOption[ "imageUploadFolder" ];
			$fileUploadFolder  = $p_arrOption[ "fileUploadFolder" ];
			$videoUploadFolder = $p_arrOption[ "videoUploadFolder" ];
			//------------------------- DECLARE ---------------------------//

			$p_arrOption [ "basePath" ]          = trim( $basePath, '/' ) . '/';
			$p_arrOption [ "imageUploadFolder" ] = trim( $imageUploadFolder, '/' ) . '/';
			$p_arrOption [ "fileUploadFolder" ]  = trim( $fileUploadFolder, '/' ) . '/';
			$p_arrOption [ "videoUploadFolder" ] = trim( $videoUploadFolder, '/' ) . '/';

			// Image folder and path.
			if( isset( $p_arrOption[ "imageUploadPath" ] ) == false || //
				$p_arrOption[ "imageUploadPath" ] == null
			)
			{
				$p_arrOption[ "imageUploadPath" ] = $p_arrOption[ "imageUploadFolder" ];
			}
			else
			{
				$p_arrOption [ "imageUploadPath" ] = trim( $p_arrOption [ "imageUploadPath" ], '/' ) . '/';
			}

			// File folder and path.
			if( isset( $p_arrOption[ "fileUploadPath" ] ) == false || //
				$p_arrOption[ "fileUploadPath" ] == null
			)
			{
				$p_arrOption[ "fileUploadPath" ] = $p_arrOption[ "fileUploadFolder" ];
			}
			else
			{
				$p_arrOption [ "fileUploadPath" ] = trim( $p_arrOption [ "fileUploadPath" ], '/' ) . '/';
			}

			// Video folder and path.
			if( isset( $p_arrOption[ "videoUploadPath" ] ) == false || //
				$p_arrOption[ "videoUploadPath" ] == null
			)
			{
				$p_arrOption[ "videoUploadPath" ] = $p_arrOption[ "videoUploadFolder" ];
			}
			else
			{
				$p_arrOption [ "videoUploadPath" ] = trim( $p_arrOption [ "videoUploadPath" ], '/' ) . '/';
			}

			// Custom JS.
			if( isset( $p_arrOption[ "customJS" ] ) )
			{
				$p_arrOption [ "customJS" ] = trim( $p_arrOption [ "customJS" ], '/' );
			}
		}

		/**
		 * Convert some route to URL.
		 * @param array $p_arrOption
		 */
		private function generateRoutes( array & $p_arrOption )
		{
			// Manage user entries, image has default values (can be set to null by user), but save and parameters has no default values.
			$imageManagerDeleteURL = isset( $p_arrOption[ "imageManagerDeleteURL" ]) ? $p_arrOption[ "imageManagerDeleteURL" ] : null;
			$imageManagerLoadURL   = isset( $p_arrOption[ "imageManagerLoadURL" ]) ? $p_arrOption[ "imageManagerLoadURL" ]: null;
			$imageUploadURL        = isset( $p_arrOption[ "imageUploadURL" ]) ? $p_arrOption[ "imageUploadURL" ] : null;
			$fileUploadURL         = isset( $p_arrOption[ "fileUploadURL" ]) ? $p_arrOption[ "fileUploadURL" ] : null;
			$videoUploadURL        = isset( $p_arrOption[ "videoUploadURL" ]) ? $p_arrOption[ "videoUploadURL" ] : null;

			$saveURL                     =
				isset( $p_arrOption[ "saveURL" ] ) ? $p_arrOption[ "saveURL" ] : null;
			$imageManagerDeleteURLParams =
				isset( $p_arrOption[ "imageManagerDeleteURLParams" ] ) ? $p_arrOption[ "imageManagerDeleteURLParams" ] : array();
			$imageManagerLoadURLParams   =
				isset( $p_arrOption[ "imageManagerLoadURLParams" ] ) ? $p_arrOption[ "imageManagerLoadURLParams" ] : array();
			$imageUploadURLParams        =
				isset( $p_arrOption[ "imageUploadURLParams" ] ) ? $p_arrOption[ "imageUploadURLParams" ] : array();
			$saveURLParams               =
				isset( $p_arrOption[ "saveURLParams" ] ) ? $p_arrOption[ "saveURLParams" ] : array();
			$fileUploadURLParams         =
				isset( $p_arrOption[ "fileUploadURLParams" ] ) ? $p_arrOption[ "fileUploadURLParams" ] : array();
			$videoUploadURLParams        =
				isset( $p_arrOption[ "videoUploadURLParams" ] ) ? $p_arrOption[ "videoUploadURLParams" ] : array();
			//------------------------- DECLARE ---------------------------//

			if( $imageManagerDeleteURL != null )
			{
				$p_arrOption[ "imageManagerDeleteURL" ] =
					$this->m_router->generate( $imageManagerDeleteURL, $imageManagerDeleteURLParams );
			}

			if( $imageManagerLoadURL != null )
			{
				$p_arrOption[ "imageManagerLoadURL" ] =
					$this->m_router->generate( $imageManagerLoadURL, $imageManagerLoadURLParams );
			}

			if( $imageUploadURL != null )
			{
				$p_arrOption[ "imageUploadURL" ] = $this->m_router->generate( $imageUploadURL, $imageUploadURLParams );
			}

			if( $saveURL != null )
			{
				$p_arrOption[ "saveURL" ] = $this->m_router->generate( $saveURL, $saveURLParams );
			}

			if( $fileUploadURL != null )
			{
				$p_arrOption[ "fileUploadURL" ] = $this->m_router->generate( $fileUploadURL, $fileUploadURLParams );
			}

			if( $videoUploadURL != null )
			{
				$p_arrOption[ "videoUploadURL" ] = $this->m_router->generate( $videoUploadURL, $videoUploadURLParams );
			}
		}

		/**
		 * Add some custom options.
		 * @param array $p_arrOption
		 */
		private function addImageCustomParams( array & $p_arrOption )
		{
			$imageUploadParams        =
				isset( $p_arrOption[ "imageUploadParams" ] ) ? $p_arrOption[ "imageUploadParams" ] : array();
			$imageManagerLoadParams   =
				isset( $p_arrOption[ "imageManagerLoadParams" ] ) ? $p_arrOption[ "imageManagerLoadParams" ] : array();
			$imageManagerDeleteParams =
				isset( $p_arrOption[ "imageManagerDeleteParams" ] ) ? $p_arrOption[ "imageManagerDeleteParams" ] : array();
			$arrCustomParams          =
				array( "folder" => $p_arrOption[ "imageUploadFolder" ], "path" => $p_arrOption[ "imageUploadPath" ], "public_dir" => $p_arrOption[ "publicDir" ] );
			//------------------------- DECLARE ---------------------------//

            //Always adding these params breaks s3 signing in some cases
            if (!array_key_exists('imageUploadToS3', $p_arrOption)) {
                $p_arrOption[ "imageUploadParams" ]        = array_merge( $imageUploadParams, $arrCustomParams );
            }
			$p_arrOption[ "imageManagerLoadParams" ]   = array_merge( $imageManagerLoadParams, $arrCustomParams );
			$p_arrOption[ "imageManagerDeleteParams" ] = array_merge( $imageManagerDeleteParams, $arrCustomParams );
		}

		/**
		 * Add some custom options.
		 * @param array $p_arrOption
		 */
		private function addFileCustomParams( array & $p_arrOption )
		{
			$fileUploadParams =
				isset( $p_arrOption[ "fileUploadParams" ] ) ? $p_arrOption[ "fileUploadParams" ] : array();
			$arrCustomParams  =
				array( "folder" => $p_arrOption[ "fileUploadFolder" ], "path" => $p_arrOption[ "fileUploadPath" ], "public_dir" => $p_arrOption[ "publicDir" ] );
			//------------------------- DECLARE ---------------------------//

			$p_arrOption[ "fileUploadParams" ] = array_merge( $fileUploadParams, $arrCustomParams );
		}

		/**
		 * Add some custom options.
		 * @param array $p_arrOption
		 */
		private function addVideoCustomParams( array & $p_arrOption )
		{
			$videoUploadParams =
				isset( $p_arrOption[ "videoUploadParams" ] ) ? $p_arrOption[ "videoUploadParams" ] : array();
			$arrCustomParams   =
				array( "folder" => $p_arrOption[ "videoUploadFolder" ], "path" => $p_arrOption[ "videoUploadPath" ], "public_dir" => $p_arrOption[ "publicDir" ] );
			//------------------------- DECLARE ---------------------------//

			$p_arrOption[ "videoUploadParams" ] = array_merge( $videoUploadParams, $arrCustomParams );
		}

	}