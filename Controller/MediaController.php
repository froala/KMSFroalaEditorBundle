<?php

	namespace KMS\FroalaEditorBundle\Controller;

	use KMS\FroalaEditorBundle\Service\MediaManager;
    use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
	use Symfony\Component\HttpFoundation\Request;
	use Symfony\Component\HttpFoundation\Response;
    use Symfony\Component\HttpKernel\KernelInterface;

    /**
	 * Media controller.
	 * Class MediaController
	 * @package KMS\FroalaEditorBundle\Controller
	 */
	class MediaController extends AbstractController
	{
        /**
         * @var MediaManager
         */
        protected $mediaManager;

        /**
         * @var KernelInterface
         */
        protected $kernel;

        public function __construct(MediaManager $mediaManager, KernelInterface $kernel)
        {
            $this->mediaManager = $mediaManager;
            $this->kernel = $kernel;
        }

        // -------------------------------------------------------------//
		// --------------------------- METHODS -------------------------//
		// -------------------------------------------------------------//

		/**
		 * Upload an image.
		 * @param \Symfony\Component\HttpFoundation\Request $p_request
		 * @return \Symfony\Component\HttpFoundation\JsonResponse
		 */
		public function uploadImage(Request $p_request)
		{
			$path         = $p_request->request->get( "path" );
			$folder       = $p_request->request->get( "folder" );
			$rootDir      = $this->kernel->getProjectDir();
			$publicDir    = $p_request->request->get("public_dir");
			$basePath     = $p_request->getBasePath();
			// ------------------------- DECLARE ---------------------------//

			// FIXME
//			if( $request->isXmlHttpRequest() == true )
//			{
				return $this->mediaManager->uploadImage( $p_request->files, $rootDir, $publicDir, $basePath, $folder, $path );
//			}
		}

		/**
		 * Delete an image.
		 * @param \Symfony\Component\HttpFoundation\Request $p_request
		 * @return \Symfony\Component\HttpFoundation\Response
		 */
		public function deleteImage(Request $p_request)
		{
			$imageSrc     = $p_request->request->get( "src" );
			$folder       = $p_request->request->get( "folder" );
			$rootDir      = $this->kernel->getProjectDir();
			$publicDir    = $p_request->request->get("public_dir");
			// ------------------------- DECLARE ---------------------------//

			$this->mediaManager->deleteImage( $imageSrc, $rootDir, $publicDir, $folder );

			return new Response ();
		}

		/**
		 * Load images.
		 * @param \Symfony\Component\HttpFoundation\Request $p_request
		 * @return \Symfony\Component\HttpFoundation\JsonResponse
		 */
		public function loadImages(Request $p_request)
		{
			$path         = $p_request->query->get( "path" );
			$folder       = $p_request->query->get( "folder" );
            $rootDir      = $this->kernel->getProjectDir();
			$publicDir    = $p_request->query->get("public_dir");
			$basePath     = $p_request->getBasePath();

			// ------------------------- DECLARE ---------------------------//

			return $this->mediaManager->loadImages( $rootDir, $publicDir, $basePath, $folder, $path );
		}

		/**
		 * Upload a file.
		 * @param \Symfony\Component\HttpFoundation\Request $p_request
		 * @return \Symfony\Component\HttpFoundation\JsonResponse
		 */
		public function uploadFile(Request $p_request)
		{
			$path         = $p_request->request->get( "path" );
			$folder       = $p_request->request->get( "folder" );
            $rootDir      = $this->kernel->getProjectDir();
			$publicDir    = $p_request->request->get("public_dir");
			$basePath     = $p_request->getBasePath();
			// ------------------------- DECLARE ---------------------------//

			// FIXME
//			if( $request->isXmlHttpRequest() == true )
//			{
			return $this->mediaManager->uploadFile( $p_request->files, $rootDir, $publicDir, $basePath, $folder, $path );
//			}
		}

		/**
		 * Upload a video.
		 * @param \Symfony\Component\HttpFoundation\Request $p_request
		 * @return \Symfony\Component\HttpFoundation\JsonResponse
		 */
		public function uploadVideo(Request $p_request)
		{
			$path         = $p_request->request->get( "path" );
			$folder       = $p_request->request->get( "folder" );
            $rootDir      = $this->kernel->getProjectDir();
			$publicDir    = $p_request->request->get("public_dir");
			$basePath     = $p_request->getBasePath();
			// ------------------------- DECLARE ---------------------------//

			// FIXME
//			if( $request->isXmlHttpRequest() == true )
//			{
			return $this->mediaManager->uploadVideo( $p_request->files, $rootDir, $publicDir, $basePath, $folder, $path );
//			}
		}

	}
