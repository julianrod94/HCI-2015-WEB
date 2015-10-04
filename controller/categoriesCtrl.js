
function getSex(result) {

   	
   	switch (result) {
   		case 'hombre':
   			result = "HOMBRE";
   			break;
   		case 'mujer':
   			result = "MUJER";
   			break;
   		case 'ninos':
   			result = "NIÑOS";
   			break;
   	}
   	return result;
	}


function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	    results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}



angular.element(document).ready(function() {
	angular.bootstrap(document, ['categoriesApp']);
});

angular.module('categoriesApp', []).controller('categoriesController', function($scope) {
	var pageId = getParameterByName('id');
    $scope.sex = getSex(pageId),
    $scope.categoriesImages = "Doe",

    $scope.pageName = function() {
    	return $scope.sex;
    }


})

