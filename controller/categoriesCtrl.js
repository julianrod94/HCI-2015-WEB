
function getSex(result) {

   	switch (result) {
   		case 'hombre':
   			result = "Hombres";
   			break;
   		case 'mujer':
   			result = "Mujeres";
   			break;
   		case 'ninos':
   			result = "Niños";
   			break;
   	}
   	return result;
	}

function getCategoryPictures(result) {

  switch (result) {
      case 'hombre':
        result = ['../../assets/categories/men-clothes.png','../../assets/categories/men-shoes.png','../../assets/categories/men-accesories.png'];
        break;
      case 'mujer':
        result = ['../../assets/categories/women-clothes.png','../../assets/categories/women-shoes.png','../../assets/categories/women-accesories.png'];
        break;
      case 'ninos':
        result = ['../../assets/categories/kids-clothes.png','../../assets/categories/kids-shoes.png','../../assets/categories/kids-accesories.png'];
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



angular.module('categoriesApp', []).controller('categoriesController', function($scope) {
	var pageId = getParameterByName('id');
    $scope.sex = getSex(pageId),
    $scope.categoriesImages = getCategoryPictures(pageId),

    $scope.pageName = function() {
    	return $scope.sex;
    },

    $scope.pictures = function() {
      return $scope.categoriesImages;
    }


})

