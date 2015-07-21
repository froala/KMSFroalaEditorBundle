<?php

	namespace KMS\FroalaEditorBundle\Service;

	use Symfony\Component\Finder\Finder;
	use Symfony\Component\HttpFoundation\File\UploadedFile;
	use Symfony\Component\HttpFoundation\FileBag;
	use Symfony\Component\HttpFoundation\JsonResponse;

	/**
	 * Manages media.
	 * Class MediaManager
	 * @package KMS\FroalaEditorBundle\Service
	 */
	class MediaManager
	{

		// -------------------------------------------------------------//
		// --------------------------- MEMBERS -------------------------//
		// -------------------------------------------------------------//

		// -------------------------------------------------------------//
		// -------------------------- CONSTRUCTOR ----------------------//
		// -------------------------------------------------------------//

		/**
		 * Constructor.
		 */
		public function __construct()
		{
			// ------------------------- DECLARE ---------------------------//
		}

		// -------------------------------------------------------------//
		// --------------------------- METHODS -------------------------//
		// -------------------------------------------------------------//

		/**
		 * Upload an image.
		 * @param \Symfony\Component\HttpFoundation\FileBag $p_file
		 * @param string                                    $p_rootDir
		 * @param string                                    $p_basePath
		 * @param string                                    $p_folder
		 * @param string                                    $p_path
		 * @return \Symfony\Component\HttpFoundation\JsonResponse
		 * @throws \Exception
		 */
		public function uploadImage( FileBag $p_file, $p_rootDir, $p_basePath, $p_folder, $p_path )
		{
			$arrExtension = array(
				"gif",
				"jpeg",
				"jpg",
				"png"
			);
			$folder       = $this->obtainFolder( $p_rootDir, $p_folder );
			$path         = $this->obtainPath( $p_basePath, $p_path );
			$response     = new JsonResponse ();
			// ------------------------- DECLARE ---------------------------//

			if( $p_file == null )
			{
				$response->setData( array(
										"error" => "No file received."
									) );

				return $response;
			}

			$file = $p_file->get( "file" );

			if( $file == null )
			{
				$response->setData( array(
										"error" => "No file received."
									) );

				return $response;
			}

			if( $file->getSize() > UploadedFile::getMaxFilesize() )
			{
				$response->setData( array(
										"error" => "File too big."
									) );

				return $response;
			}

			// Cheks image type.
			$extension = $file->guessExtension();
			$mime      = $file->getMimeType();
			if( ( ( $mime == "image/gif" ) || //
				  ( $mime == "image/jpeg" ) || //
				  ( $mime == "image/pjpeg" ) || //
				  ( $mime == "image/x-png" ) || //
				  ( $mime == "image/png" ) ) && //
				in_array( $extension, $arrExtension )
			)
			{
				// Generates random name.
				$name = sha1( uniqid( mt_rand(), true ) ) . '.' . $file->guessExtension();

				// Save file in the folder.
				$file->move( $folder, $name );

				$response->setData( array(
										"link" => $path . '/' . $name
									) );

				return $response;
			}

			$response->setData( array(
									"error" => "File not supported."
								) );

			return $response;
		}

		/**
		 * Delete an image.
		 * @param string $p_imageSrc
		 * @param string $p_rootDir
		 * @param string $p_folder
		 */
		public function deleteImage( $p_imageSrc, $p_rootDir, $p_folder )
		{
			$folder      = $this->obtainFolder( $p_rootDir, $p_folder );
			$arrExploded = explode( '/', $p_imageSrc );
			// ------------------------- DECLARE ---------------------------//

			$fileName = $arrExploded [ count( $arrExploded ) - 1 ];
			unlink( $folder . '/' . $fileName );
		}

		/**
		 * Load images.
		 * @param string $p_rootDir
		 * @param string $p_basePath
		 * @param string $p_folder
		 * @param string $p_path
		 * @return \Symfony\Component\HttpFoundation\JsonResponse
		 * @throws \Exception
		 */
		public function loadImages( $p_rootDir, $p_basePath, $p_folder, $p_path )
		{
			$response = new JsonResponse ();
			$arrImage = array();
			$folder   = $this->obtainFolder( $p_rootDir, $p_folder );
			$path     = $this->obtainPath( $p_basePath, $p_path );
			$finder   = new Finder ();
			// ------------------------- DECLARE ---------------------------//

			// TODO: check that.
			$arrTypes = array(
				"image/gif",
				"image/jpeg",
				"image/pjpeg",
				"image/jpeg",
				"image/pjpeg",
				"image/png",
				"image/x-png"
			);

			$finder->files()->in( $folder );

			foreach( $finder as $file )
			{
				$arrImage [] = $path . '/' . $file->getFilename();
			}

			$response->setData( $arrImage );

			return $response;
		}

		// -------------------------------------------------------------//
		// --------------------------- PRIVATE -------------------------//
		// -------------------------------------------------------------//

		/**
		 * Obtain the physical folder.
		 * @param string $p_rootDir
		 * @param string $p_folder
		 * @return string
		 */
		private function obtainFolder( $p_rootDir, $p_folder )
		{
			// ------------------------- DECLARE ---------------------------//

			return $p_rootDir . "/../web" . $p_folder;
		}

		/**
		 * Obtain the path.
		 * @param string $p_basePath
		 * @param string $p_path
		 * @return string
		 */
		private function obtainPath( $p_basePath, $p_path )
		{
			// ------------------------- DECLARE ---------------------------//
			return $p_basePath . $p_path;
		}
	}