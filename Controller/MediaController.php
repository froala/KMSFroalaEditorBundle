<?php

	namespace KMS\FroalaEditorBundle\Controller;

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

		// -------------------------------------------------------------//
		// --------------------------- METHODS -------------------------//
		// -------------------------------------------------------------//

		/**
		 * Upload an image.
		 * @param \Symfony\Component\HttpFoundation\Request $p_request
		 * @return \Symfony\Component\HttpFoundation\JsonResponse
		 */
		public function uploadImageAction(Request $p_request)
		{
			$mediaManager = $this->get( "kms_froala_editor.media_manager" );
			$path         = $p_request->request->get( "path" );
			$folder       = $p_request->request->get( "folder" );
			$rootDir      = $this->get( "kernel" )->getRootDir();
			$publicDir    = $p_request->request->get("public_dir");
			$basePath     = $p_request->getBasePath();
			// ------------------------- DECLARE ---------------------------//

			// FIXME
//			if( $request->isXmlHttpRequest() == true )
//			{
				return $mediaManager->uploadImage( $p_request->files, $rootDir, $publicDir, $basePath, $folder, $path );
//			}
		}

		/**
		 * Delete an image.
		 * @param \Symfony\Component\HttpFoundation\Request $p_request
		 * @return \Symfony\Component\HttpFoundation\Response
		 */
		public function deleteImageAction(Request $p_request)
		{
			$mediaManager = $this->get( "kms_froala_editor.media_manager" );
			$imageSrc     = $p_request->request->get( "src" );
			$folder       = $p_request->request->get( "folder" );
			$rootDir      = $this->get( "kernel" )->getRootDir();
			$publicDir    = $p_request->request->get("public_dir");
			// ------------------------- DECLARE ---------------------------//

			$mediaManager->deleteImage( $imageSrc, $rootDir, $publicDir, $folder );

			return new Response ();
		}

		/**
		 * Load images.
		 * @param \Symfony\Component\HttpFoundation\Request $p_request
		 * @return \Symfony\Component\HttpFoundation\JsonResponse
		 */
		public function loadImagesAction(Request $p_request)
		{
			$mediaManager = $this->get( "kms_froala_editor.media_manager" );
			$path         = $p_request->query->get( "path" );
			$folder       = $p_request->query->get( "folder" );
			$rootDir      = $this->get( "kernel" )->getRootDir();
			$publicDir    = $p_request->query->get("public_dir");
			$basePath     = $p_request->getBasePath();

			// ------------------------- DECLARE ---------------------------//

			return $mediaManager->loadImages( $rootDir, $publicDir, $basePath, $folder, $path );
		}

		/**
		 * Upload a file.
		 * @param \Symfony\Component\HttpFoundation\Request $p_request
		 * @return \Symfony\Component\HttpFoundation\JsonResponse
		 */
		public function uploadFileAction(Request $p_request)
		{
			$mediaManager = $this->get( "kms_froala_editor.media_manager" );
			$path         = $p_request->request->get( "path" );
			$folder       = $p_request->request->get( "folder" );
			$rootDir      = $this->get( "kernel" )->getRootDir();
			$publicDir    = $p_request->request->get("public_dir");
			$basePath     = $p_request->getBasePath();
			// ------------------------- DECLARE ---------------------------//

			// FIXME
//			if( $request->isXmlHttpRequest() == true )
//			{
			return $mediaManager->uploadFile( $p_request->files, $rootDir, $publicDir, $basePath, $folder, $path );
//			}
		}

		/**
		 * Upload a video.
		 * @param \Symfony\Component\HttpFoundation\Request $p_request
		 * @return \Symfony\Component\HttpFoundation\JsonResponse
		 */
		public function uploadVideoAction(Request $p_request)
		{
			$mediaManager = $this->get( "kms_froala_editor.media_manager" );
			$path         = $p_request->request->get( "path" );
			$folder       = $p_request->request->get( "folder" );
			$rootDir      = $this->get( "kernel" )->getRootDir();
			$publicDir    = $p_request->request->get("public_dir");
			$basePath     = $p_request->getBasePath();
			// ------------------------- DECLARE ---------------------------//

			// FIXME
//			if( $request->isXmlHttpRequest() == true )
//			{
			return $mediaManager->uploadVideo( $p_request->files, $rootDir, $publicDir, $basePath, $folder, $path );
//			}
		}

	}
