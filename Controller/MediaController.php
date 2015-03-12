<?php

namespace KMS\FroalaEditorBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Media controller.
 */
class MediaController extends Controller
{

    //-------------------------------------------------------------//
    //--------------------------- METHODS -------------------------//
    //-------------------------------------------------------------//
    
    /**
     * Upload an image.
     */
    public function uploadImageAction()
    {
        $request        = $this->get( "request" );
        $mediaManager   = $this->get( "kms_froala_editor.media_manager" );
        $folder         = $request->request->get( "folder" );
        $rootDir        = $this->get( "kernel" )->getRootDir();
        $basePath       = $request->getBasePath();
        //------------------------- DECLARE ---------------------------//
        
//         if( $request->isXmlHttpRequest() == true )
//         {
            return $mediaManager->uploadImage( $request->files, $rootDir, $basePath, $folder );
            
//         }
    }
    
    /**
     * Delete an image.
     */
    public function deleteImageAction()
    {
        $request        = $this->get( "request" );
        $mediaManager   = $this->get( "kms_froala_editor.media_manager" );
        $imageSrc       = $request->request->get( "src" );
        $folder         = $request->request->get( "folder" );
        $rootDir        = $this->get( "kernel" )->getRootDir();
        //------------------------- DECLARE ---------------------------//
        
        $mediaManager->deleteImage( $imageSrc, $rootDir, $folder );
        
        return new Response();
    }
    
    /**
     * Load images.
     */
    public function loadImagesAction()
    {
        $request        = $this->get( "request" );
        $mediaManager   = $this->get( "kms_froala_editor.media_manager" );
        $folder         = $request->request->get( "folder" );
        $rootDir        = $this->get( "kernel" )->getRootDir();
        $basePath       = $request->getBasePath();
        //------------------------- DECLARE ---------------------------//
        
        return $mediaManager->loadImages( $rootDir, $basePath, $folder );
    }
    
    //-------------------------------------------------------------//
    //--------------------------- PRIVATE -------------------------//
    //-------------------------------------------------------------//
    
}
