/**
 * Display errors.
 * @param p_editor is the editor.
 * @param error is the error object.
 */
function froalaDisplayError(p_editor, error ) {
	alert(`Error ${error.code}: ${error.message}`);
}
