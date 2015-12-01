<?php

	namespace KMS\FroalaEditorBundle\Controller;

	use Symfony\Bundle\FrameworkBundle\Controller\Controller;
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
		 * @return \Symfony\Component\HttpFoundation\JsonResponse
		 */
		public function uploadImageAction()
		{
			$request      = $this->getRequest();
			$mediaManager = $this->get( "kms_froala_editor.media_manager" );
			$path         = $request->request->get( "path" );
			$folder       = $request->request->get( "folder" );
			$rootDir      = $this->get( "kernel" )->getRootDir();
			$basePath     = $request->getBasePath();
			// ------------------------- DECLARE ---------------------------//

			// FIXME
//			if( $request->isXmlHttpRequest() == true )
//			{
				return $mediaManager->uploadImage( $request->files, $rootDir, $basePath, $folder, $path );
//			}
		}

		/**
		 * Delete an image.
		 * @return \Symfony\Component\HttpFoundation\Response
		 */
		public function deleteImageAction()
		{
			$request      = $this->getRequest();
			$mediaManager = $this->get( "kms_froala_editor.media_manager" );
			$imageSrc     = $request->request->get( "src" );
			$folder       = $request->request->get( "folder" );
			$rootDir      = $this->get( "kernel" )->getRootDir();
			// ------------------------- DECLARE ---------------------------//

			$mediaManager->deleteImage( $imageSrc, $rootDir, $folder );

			return new Response ();
		}

		/**
		 * Load images.
		 * @return \Symfony\Component\HttpFoundation\JsonResponse
		 */
		public function loadImagesAction()
		{
			$request      = $this->getRequest();
			$mediaManager = $this->get( "kms_froala_editor.media_manager" );
			$path         = $request->query->get( "path" );
			$folder       = $request->query->get( "folder" );
			$rootDir      = $this->get( "kernel" )->getRootDir();
			$basePath     = $request->getBasePath();

			// ------------------------- DECLARE ---------------------------//

			return $mediaManager->loadImages( $rootDir, $basePath, $folder, $path );
		}

		/**
		 *
		 */
		public function uploadFileAction()
		{
			//------------------------- DECLARE ---------------------------//
		}

	}
