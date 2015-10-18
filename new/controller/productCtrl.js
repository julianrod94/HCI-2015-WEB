
// ************************************************************************************************************************

// Info to return safely to the catalog page 

var gender = getGender()
var category = getCategory();
var sub_category = getSubCategory();
var brand = getBrand();
var search_string = SearchString();
var display_options = displayOptions();
var page_number = pageNumber();
var products_per_page = productsPerPage();
var sorting_key = sortingKey();
var sort_order = sortOrder();
var filters = getFilters();

function getGender() {

    var aux = getParameterByName('gender');
    aux = parseInt(aux);
    return isNaN(aux) ? 0 : aux;
}

function getCategory() {

    var aux = getParameterByName('category');
    aux = parseInt(aux);
    return isNaN(aux) ? null : aux;
}

function getSubCategory() {

    var aux = getParameterByName('sub_category');
    aux = parseInt(aux);
    return isNaN(aux) ? null : aux;
}


function getBrand() {

    var aux = getParameterByName('brand');
    aux = parseInt(aux);
    return isNaN(aux) ? null : aux;
}

function SearchString() {
    return getParameterByName('search_string')
}


function displayOptions() {

    var calling_option = getParameterByName('calling_option');
    calling_option = parseInt(calling_option);

    // If url was not well typed in address bar, or calling_option wasn't well specified, null is returned
    if (isNaN(calling_option) || calling_option < 1 || calling_option > 5) {
        return null;
    }
    return calling_option;
}

function pageNumber() {

    var aux = getParameterByName('page');
    aux = parseInt(aux);
    return isNaN(aux) ? null : aux;
}


function productsPerPage() {

    var aux = getParameterByName('page_size');
    aux = parseInt(aux);
    if (isNaN(aux) || (aux != 24 && aux != 48 && aux != 96)) {
        return null;
    }
    return aux;
}

function sortingKey() {

    var aux = getParameterByName('sort_key');
    aux = parseInt(aux);
    if (isNaN(aux) || (aux != 1 && aux != 2 && aux != 3)) {
        return null;
    }
    return aux;
}

function sortOrder() {

    var aux = getParameterByName('sort_order');
    if (aux != "asc" && aux != "desc") {
        return null;
    }
    return aux;
}

function getFilters() {

    var aux = getParameterByName('prev_filters');
    aux = decodeURIComponent(aux);
    try {
        aux = JSON.parse(aux);
    } catch (err) {
        return null;
    }
    return aux;
}


// ************************************************************************************************************************

var product_id = getProduct();
var requestURL = generateRequestURL(product_id);

function getProduct() {

	var aux = getParameterByName('product_id');
	aux = parseInt(aux);
	return isNaN(aux) ? null : aux;
}

function generateRequestURL(product_id) {

	return 'http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductById&id=' + product_id;

}


// ************************************************************************************************************************

// Gets the specified query string parameter
function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	    results = regex.exec(location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// ************************************************************************************************************************


angular.module('productApp', []).controller('productController', function($scope, $http) {


	function getProductByAJAX() {

		$http.get(requestURL, {cache: true, timeout: 10000}).then(function(response) {
        	$scope.product = response.data.product;
        	getSimilars($scope.product.subcategory.id);
        	$scope.link_for_category = generateCategoryBreadcrumbLink($scope.product.category.id);
        	$scope.link_for_sub_category = generateSubCategoryBreadcrumbLink($scope.product.category.id, $scope.product.subcategory.id);
        });
	}

	function getSimilars(sub_category_id) {
		var url = 'http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetProductsBySubcategoryId&id=' + sub_category_id + "&page_size=3";
		$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
        	$scope.similars = response.data.products;
        });
	}

	function generateCategoryBreadcrumbLink(category_id) {
		return "catalogue.html?calling_option=1&gender=" + gender + "&category=" + category_id;
	}

	function generateSubCategoryBreadcrumbLink(category_id, sub_category_id) {
		return "catalogue.html?calling_option=2&gender=" + gender + "&category=" + category_id + "&sub_category=" + sub_category_id;
	}


	$scope.product = null;
	$scope.similars = null;

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

	$scope.getLinkForGenderBreadcrumb = function() {

		return "categories.html?id=" + gender;
	}

	$scope.hasGenderSpecified = function() {

		return gender != 0;
	}

	$scope.getGenderNameForBreadcrumb = function() {
        var result;
        switch(gender) {
            case 1:
                result = "Hombres";
                break;
            case 2:
                result = "Mujeres";
                break;
            case 3:
                result = "Infantiles";
                break;
            default:
                result = "Género";
        }
        return result;
	}

	$scope.link_for_category = null;

	$scope.link_for_sub_category = null;


	getProductByAJAX();
})












