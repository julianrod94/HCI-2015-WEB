// Controller for catalogue
angular.module('thumbnailApp', []).controller('thumbnailController', function($scope, $http) {


	function getProductDetailsByAJAX(prod_id) {

		var url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductById&id=" + prod_id;
        $http.get(url, {cache: true, timeout: 10000}).then(function(response) {
             $scope.detailedproduct = response.data.product;
        });
	}

	$scope.detailedproduct = null;
	//detail == 1 : colors   --- detail == 2 : sizes
	$scope.getProductDetails = function(prod_id, detail) {
		getProductDetailsByAJAX(prod_id);

		var i, flag = false;
		for (i = 0 ; i < $scope.detailedproduct.attributes.length && !flag ; i++) {
			if ($scope.detailedproduct.attributes[i].id == detail) {
				flag = true;
				$scope.detailedproduct = $scope.detailedproduct.attributes[i].values;
			}
		}
		return $scope.detailedproduct;
	}
})