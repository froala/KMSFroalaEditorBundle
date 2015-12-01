/**
 * Display errors.
 * @param p_message is the message to display.
 */
function froalaDisplayError( p_message )
{
	//------------------------- DECLARE ---------------------------//

	alert( p_message );
}

/**
 * Loads a CSS file if not already included in the DOM.
 * @param p_path is the CSS file path.
 */
function loadCSS( p_path )
{
	//------------------------- DECLARE ---------------------------//

	if ( !$( "link[href=\"" + p_path + "\"]" ).length )
	{
		$( "<link href=\"" + p_path + "\" rel=\"stylesheet\">" ).appendTo( "head" );
	}
}