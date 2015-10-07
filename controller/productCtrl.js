


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

	$scope.product_variants_links = function(id) {
		return "product.html?id=" + id;
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
	},

	$scope.get_first_picture = function(product_id) {

		var source = "../../assets/clothes/t-shirts/";
		var aux = getProductById(product_id);
		source += aux.images[0];
		return source;
	}

	$scope.createBackLinkSubCategory = function() {

		var newJSON = [{"name": 'gender', "values":[product_to_display.gender]}, {"name": 'category', "values":[product_to_display.category]}, {"name": 'sub', "values":[product_to_display.sub]}];


		return "catalogue.html?filters=" + encodeURIComponent(JSON.stringify(newJSON));
	},

	$scope.createBackLinkCategory = function() {

		var newJSON = [{"name": 'gender', "values":[product_to_display.gender]}, {"name": 'category', "values":[product_to_display.category]}];


		return "catalogue.html?filters=" + encodeURIComponent(JSON.stringify(newJSON));
	}
})



