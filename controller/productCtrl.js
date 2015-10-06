function getProduct() {

	var prodId = getParameterByName('id');
	prodId = parseInt(prodId);
	return getProductById(prodId);
}

var product_to_display = getProduct();

function getListOfProductswithSameColor() {
	
	product = product_to_display;

	if (product == null) {
		return null;
	}

	return selectItemsBy(function(prod) {

		return prod.prod_id == product.prod_id;
	})

}

var list_of_products_with_same_color = getListOfProductswithSameColor();


// Gets the specified query string parameter
function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	    results = regex.exec(location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}




angular.module('productApp', []).controller('productController', function($scope) {


	$scope.product = function() {
		return product_to_display;
	}

	$scope.product_variants = function() {
		return list_of_products_with_same_color
	}

	$scope.product_images = function() {
		var source = "../../assets/clothes/t-shirts/";
		var array = product_to_display.images;
		var result = []
		var i;
		for (i = 0 ; i < array.length ; i++) {
			result.push(source + array[i]);
		}
		return result;
	}

	$scope.createBackLink = function() {

		return "catalogue.html?filters=" + encodeURIComponent(getParameterByName('filters'));
	}
})



