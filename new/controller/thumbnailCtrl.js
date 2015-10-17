


// Controller for catalogue
angular.module('thumbnailApp', []).controller('thumbnailController', function($scope, $http, $q) {


	function callAPIToGetProductById(prod_id) {

		var url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductById&id=" + prod_id;
		$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
			$scope.detailedProduct = response.data.product.attributes;
		});	
	}


	function getProductDetailsByAJAX(prod_id) {

		return $q(function(resolve, reject){
					resolve(callAPIToGetProductById(prod_id));
				})
        
	}

	$scope.detailedProduct = null;
	$scope.getProductDetails = function(prod_id) {

		var promise = getProductDetailsByAJAX(prod_id);
		promise.then(
			function() {
	 			return $scope.detailedProduct;
		 	},
		 	function() {
		 		return null;
		 	}

		);
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