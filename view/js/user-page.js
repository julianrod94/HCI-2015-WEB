
$(document).ready(function(){

	function getParameterByName(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	        results = regex.exec(location.search);
	    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	var loadingTab = getParameterByName('id');
	var result;
	switch(loadingTab) {
	    case 'carrito':
	        result = 'Carrito';
	        break;
	    case 'favoritos':
	        result = 'Favoritos';
	        break;
	    case 'usuario':
		    result = 'Cuenta';
		    break;
	    default:
	        result = "Carrito";
    }

    $('a[href="#' + result + '"]').tab('show');
});
