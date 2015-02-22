<?php

namespace KMS\FroalaEditorBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Images controller.
 */
class ImageController extends Controller
{

    //-------------------------------------------------------------//
    //--------------------------- METHODS -------------------------//
    //-------------------------------------------------------------//
    
    /**
     * Upload an image.
     */
    public function uploadAction()
    {
        $request = $this->get( "request" );
        $mediaManager = $this->get( "kms_froala_editor.media_manager" );
        $folder = $request->request->get( "folder" );
        //------------------------- DECLARE ---------------------------//
        
//         if( $request->isXmlHttpRequest() == true )
//         {
            return $mediaManager->uploadImage( $request->files, $this->get( "kernel" )->getRootDir(), $request->getBasePath(), $folder );
            
//         }
    }
    
    //-------------------------------------------------------------//
    //--------------------------- PRIVATE -------------------------//
    //-------------------------------------------------------------//
    
}
