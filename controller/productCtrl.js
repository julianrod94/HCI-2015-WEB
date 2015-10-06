
// Creates a JSON Object that contains filter names and values to filter
// Based on 'filters' query string parameter
// In case it wasn't a valid query string, returns null
function createJSONFilterObject() {

    var result = getParameterByName('filters');
    result = decodeURIComponent(result);
    try {
        result = JSON.parse(result);
    } catch (e) {
        return null;
    }
    result = eval(result);

    if (result.length == undefined) {
        return null;
    }

    var i, flag = false;
    for (i = 0 ; i < result.length & !flag ; i++) {
        var j;
        for (j = 0 ; j < getFieldsForFilters().length &!flag; j++) {
            flag = result[i].name == getFieldsForFilters()[j];
        }
    }
    if (!flag) {
        return null;
    }

    return result;

}

// Field that contains the JSON Filter Object (we create it only once)
var JSONFilters = createJSONFilterObject();

// Returns how many filters there are (used to load a proper breadcrumb)
function  getComponentsOfFilter() {
    var result = JSONFilters;
    if (result == null) {
        return 0;
    }
    return result.length;
}



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



