


// Controller for catalogue
angular.module('thumbnailApp', []).controller('thumbnailController', function($scope, $http) {


	function getProductDetailsByAJAX(prod_id, next_thing) {

		var url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductById&id=" + prod_id;
		$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
            return response.data.product.attributes;
        });
        
	}

	$scope.detailedProduct = null;
	$scope.getProductDetails = function(prod_id) {
		console.log(getProductDetailsByAJAX(prod_id));
		// console.log(asd);
		// return $scope.detailedProduct;
	}

	$scope.findSizes = function(array) {
		var i, flag = false, result = null;
		for (i = 0; i < array.length; i++) {
			if(array[i].name.includes("Talle") || array[i].name.includes("talle")) {
				flag = true;
				result = array[i]
			}
		}
		return (!flag)?"Talle unico":result;
	}

	$scope.findColors = function(array) {
		var i, flag = false, result = null;
		for (i = 0; i < array.length; i++) {
			if(array[i].id == 4) {
				flag = true;
				result = array[i]
			}
		}
		return result;
	}







})