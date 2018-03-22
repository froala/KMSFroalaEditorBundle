<?php

	namespace KMS\FroalaEditorBundle\Controller;

	use KMS\FroalaEditorBundle\Service\MediaManager;
	use Symfony\Bundle\FrameworkBundle\Controller\Controller;
	use Symfony\Component\HttpFoundation\Request;
	use Symfony\Component\HttpFoundation\Response;

	/**
	 * Media controller.
	 * Class MediaController
	 * @package KMS\FroalaEditorBundle\Controller
	 */
	class MediaController extends Controller
	{

		//-------------------------------------------------------------//
		//--------------------------- MEMBERS -------------------------//
		//-------------------------------------------------------------//

		/**
		 * @var \KMS\FroalaEditorBundle\Service\MediaManager
		 */
		private $m_mediaManager;

		//-------------------------------------------------------------//
		//------------------------- CONSTRUCTOR -----------------------//
		//-------------------------------------------------------------//

		/**
		 * Constructor.
		 * @param MediaManager $p_mediaManager
		 */
		public function __construct( MediaManager $p_mediaManager )
		{
			$this->m_mediaManager = $p_mediaManager;
		}

		// -------------------------------------------------------------//
		// --------------------------- METHODS -------------------------//
		// -------------------------------------------------------------//

		/**
		 * Upload an image.
		 * @param \Symfony\Component\HttpFoundation\Request $p_request
		 * @return \Symfony\Component\HttpFoundation\JsonResponse
		 */
		public function uploadImageAction( Request $p_request )
		{
			$path     = $p_request->request->get( "path" );
			$folder   = $p_request->request->get( "folder" );
			$rootDir  = $this->get( "kernel" )->getRootDir();
			$basePath = $p_request->getBasePath();
			// ------------------------- DECLARE ---------------------------//

			// FIXME
//			if( $request->isXmlHttpRequest() == true )
//			{
			return $this->m_mediaManager->uploadImage( $p_request->files, $rootDir, $basePath, $folder, $path );
//			}
		}

		/**
		 * Delete an image.
		 * @param \Symfony\Component\HttpFoundation\Request $p_request
		 * @return \Symfony\Component\HttpFoundation\Response
		 */
		public function deleteImageAction( Request $p_request )
		{
			$imageSrc = $p_request->request->get( "src" );
			$folder   = $p_request->request->get( "folder" );
			$rootDir  = $this->get( "kernel" )->getRootDir();
			// ------------------------- DECLARE ---------------------------//

			$this->m_mediaManager->deleteImage( $imageSrc, $rootDir, $folder );

			return new Response ();
		}

		/**
		 * Load images.
		 * @param \Symfony\Component\HttpFoundation\Request $p_request
		 * @return \Symfony\Component\HttpFoundation\JsonResponse
		 */
		public function loadImagesAction( Request $p_request )
		{
			$path     = $p_request->query->get( "path" );
			$folder   = $p_request->query->get( "folder" );
			$rootDir  = $this->get( "kernel" )->getRootDir();
			$basePath = $p_request->getBasePath();

			// ------------------------- DECLARE ---------------------------//

			return $this->m_mediaManager->loadImages( $rootDir, $basePath, $folder, $path );
		}

		/**
		 * Upload a file.
		 * @param \Symfony\Component\HttpFoundation\Request $p_request
		 * @return \Symfony\Component\HttpFoundation\JsonResponse
		 */
		public function uploadFileAction( Request $p_request )
		{
			$path     = $p_request->request->get( "path" );
			$folder   = $p_request->request->get( "folder" );
			$rootDir  = $this->get( "kernel" )->getRootDir();
			$basePath = $p_request->getBasePath();
			// ------------------------- DECLARE ---------------------------//

			// FIXME
//			if( $request->isXmlHttpRequest() == true )
//			{
			return $this->m_mediaManager->uploadFile( $p_request->files, $rootDir, $basePath, $folder, $path );
//			}
		}

		/**
		 * Upload a video.
		 * @param \Symfony\Component\HttpFoundation\Request $p_request
		 * @return \Symfony\Component\HttpFoundation\JsonResponse
		 */
		public function uploadVideoAction( Request $p_request )
		{
			$path     = $p_request->request->get( "path" );
			$folder   = $p_request->request->get( "folder" );
			$rootDir  = $this->get( "kernel" )->getRootDir();
			$basePath = $p_request->getBasePath();
			// ------------------------- DECLARE ---------------------------//

			// FIXME
//			if( $request->isXmlHttpRequest() == true )
//			{
			return $this->m_mediaManager->uploadVideo( $p_request->files, $rootDir, $basePath, $folder, $path );
//			}
		}

	}
