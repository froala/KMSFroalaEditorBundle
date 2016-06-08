/**
 * Display errors.
 * @param p_editor is the editor.
 * @param p_error is the error object.
 */
function froalaDisplayError(  p_editor, p_error )
{
	//------------------------- DECLARE ---------------------------//

	alert( "Error " + p_error.code + " : " + p_error.message );
}