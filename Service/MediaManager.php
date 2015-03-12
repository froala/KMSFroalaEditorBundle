<?php
 
namespace KMS\FroalaEditorBundle\Service;

use Symfony\Component\HttpFoundation\FileBag;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Finder\Finder;

/**
 * Media manager.
 */
class MediaManager
{

	//-------------------------------------------------------------//
	//--------------------------- MEMBERS -------------------------//
	//-------------------------------------------------------------//
	
    
	//-------------------------------------------------------------//
	//-------------------------- CONSTRUCTOR ----------------------//
	//-------------------------------------------------------------//
		
	public function __construct()
    {
    	//------------------------- DECLARE ---------------------------//
    }	
	
    //-------------------------------------------------------------//
    //--------------------------- METHODS -------------------------//
    //-------------------------------------------------------------//
   
    /**
     * Upload an image.
     */
    public function uploadImage( FileBag $p_file, $p_rootDir, $p_basePath, $p_folder )
    {
        $arrExtension = array( "gif", "jpeg", "jpg", "png" );
        $folder = $this->getPhysicalFolder( $p_rootDir, $p_folder );
        $response = new JsonResponse();
        //------------------------- DECLARE ---------------------------//
        
        if( $p_file == null )
        {
            $response->setData(  array( "error" =>  "No file received." ) );
            return $response;
        }
        
        $file = $p_file->get( "file" );
        
        if( $file == null )
        {
            $response->setData(  array( "error" =>  "No file received." ) );
            return $response;
        }
        
        if( $file->getSize() > UploadedFile::getMaxFilesize() )
        {
            $response->setData(  array( "error" =>  "File too big." ) );
            return $response;
        }
        
        // Cheks image type.
        $extension = $file->guessExtension();
        $mime = $file->getMimeType();
        if( (   ( $mime == "image/gif" ) || //
                ( $mime == "image/jpeg" ) || //
                ( $mime == "image/pjpeg" ) || //
                ( $mime == "image/x-png" ) || //
                ( $mime == "image/png" ) ) && //
            in_array( $extension, $arrExtension ) )
        {
            // Generates random name.
            $name = sha1( uniqid( mt_rand(), true ) ) . '.' . $file->guessExtension();

            // Save file in the folder.
            $file->move( $folder, $name );

            $response->setData(  array( "link" => $p_basePath . $p_folder . '/' . $name ) );
            return $response;
        }
        
        $response->setData(  array( "error" =>  "File not supported." ) );
        return $response;
    }   

    /**
     * Delete an image.
     */
    public function deleteImage( $p_imageSrc, $p_rootDir, $p_folder )
    {
        $folder = $this->getPhysicalFolder( $p_rootDir, $p_folder );
        $arrExploded = explode( '/', $p_imageSrc );
        //------------------------- DECLARE ---------------------------//
        
        $fileName = $arrExploded[ count( $arrExploded ) - 1 ];
        unlink( $folder . '/' . $fileName );        
    }
    
    /**
     * Load images.
     */
    public function loadImages( $p_rootDir, $p_basePath, $p_folder )
    {
        $response = new JsonResponse();
        $arrImage = array();
        $folder = $this->getPhysicalFolder( $p_rootDir, $p_folder );
        $finder = new Finder();
        //------------------------- DECLARE ---------------------------//
        
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
            $arrImage[] = $p_basePath . $p_folder . '/' . $file->getFilename();
        }
        
        $response->setData( $arrImage );
        
        return $response;
    }
    
    //-------------------------------------------------------------//
    //--------------------------- PRIVATE -------------------------//
    //-------------------------------------------------------------//
    
    /**
     * Obtain the physical folder.
     */
    private function getPhysicalFolder( $p_rootDir, $p_folder )
    {
        //------------------------- DECLARE ---------------------------//
        
        return $p_rootDir . "/../web" . $p_folder;
    }
}