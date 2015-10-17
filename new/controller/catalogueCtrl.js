
var gender = getGender()
var category = getCategory();
var sub_category = getSubCategory();
var brand = getBrand();
var search_string = SearchString();
var display_options = displayOptions(); // Tells how the catalogue must be displayed
var page_number = pageNumber();
var products_per_page = productsPerPage();
var sorting_key = sortingKey();
var sort_order = sortOrder();
var filters = getFilters();
var requestURL = generateRequestURL(gender, category, sub_category, brand, search_string, display_options, page_number, products_per_page, sorting_key, sort_order, filters)



function getGender() {

    var aux = getParameterByName('gender');
    aux = parseInt(aux);
    return isNaN(aux) ? null : aux;
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


// Generates the url to make the AJAX call
function generateRequestURL(gender, category, sub_category, brand, search_string, display_options, page_number, products_per_page, sorting_key, sort_order, filters) {

    var base_url = 'http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=';

    var filterJSON = (filters == null) ? [] : filters;

    // Adds gender filter
    switch (gender) {
        case 1:
            filterJSON.push({"id":1, "value": "Masculino"});
            filterJSON.push({"id":2, "value": "Adulto"});
            break;
        case 2:
            filterJSON.push({"id":1, "value": "Femenino"});
            filterJSON.push({"id":2, "value": "Adulto"});
            break;
        case 3:
            filterJSON.push({"id":2, "value":"Infantil"});
            filterJSON.push({"id":2, "value":"Bebe"});
            break;
        default:
            //Don't add anything (this means that a search was made, or that the page wasn't load well)
    }
    
    switch (display_options) {

        case 1:  //Display by category
            base_url += "GetProductsByCategoryId&id=" + category + "&filters=" + encodeURIComponent(JSON.stringify(filterJSON));
            break;

        case 2: //Display by subcategory
            base_url += "GetProductsBySubcategoryId&id=" + sub_category + "&filters=" + encodeURIComponent(JSON.stringify(filterJSON));
            break;

        case 3: //Display by brand
            filterJSON.push({"id": 9, "value": brand}) // Adds the brand filter
            base_url += "GetAllProducts&filters=" + encodeURIComponent(JSON.stringify(filterJSON));
            break;

        case 4: //Display by news
            filterJSON.push({"id": 6, "value": "Nuevo"}) // Adds the news filter
            base_url += "GetAllProducts&filters=" + encodeURIComponent(JSON.stringify(filterJSON));
            break;

        case 5: // Display by search result
            base_url += "GetProductsByName&name=" + search_string; + "&filters=" + encodeURIComponent(JSON.stringify(filterJSON));
            break;

        case null:  //Comes from nowhere. For example, typed down url in address bar. Has two options: if gender is not specified, get all products and
                    // if gender is specified, get all products by gender ; or just display an error message

        default: //Any other option
            base_url += "GetAllProducts"
            return base_url;
    }

    if (page_number != null) {
        base_url += "&page=" + page_number;
    }
    if (products_per_page != null) {
        base_url += "&page_size=" + products_per_page;
    }
    if (sorting_key != null) {
        base_url += "&sort_key=" + sorting_key;
    }
    if (sort_order != null) {
        base_url += "&sort_order=" + sort_order;
    }

    return base_url;

}


//**********************************************************************************************************************************



// Gets the specified query string parameter
function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	    results = regex.exec(location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}



//**********************************************************************************************************************************


//return category.charAt(0).toUpperCase() + category.slice(1);

// Controller for catalogue
angular.module('catalogueApp', []).controller('catalogueController', function($scope, $http) {


	$scope.gender = function() {
        var result;
        switch(gender) {
            case 1:
                result = {id:1, name:"Hombres"};
                break;
            case 2:
                result = {id:2, name:"Mujeres"};
                break;
            case 3:
                result = {id:3, name:"Infantiles"};
                break;
            default:
                result = null;
        }
        return result;
	}

    function getCategoryByAJAX() {

        if (category != null) {
            var url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetCategoryById&id=" + category;
            $http.get(url, {cache: true, timeout: 10000}).then(function(response) {
                 $scope.category = response.data.category;
            });
        }
    }

    function getSubCategoryByAJAX() {

        if (sub_category != null) {
            var url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetSubcategoryById&id=" + sub_category;
            $http.get(url, {cache: true, timeout: 10000}).then(function(response) {
                 $scope.sub_category = response.data.subcategory;
            });
        }
    }

    function getProductsAndFiltersByAJAX() {

        $http.get(requestURL, {cache: true, timeout: 10000}).then(function(response) {
            $scope.products = response.data.products;
            $scope.filters = response.data.filters;
        });
    }

	$scope.category = null;
    $scope.sub_category = null;
    $scope.brand = brand;
    $scope.search_string = search_string;
	$scope.products = null;
    $scope.filters = null;


    $scope.getProductLink = function(prod_id) {
        return "product.html?product_id=" + prod_id;
    }
	

    $scope.categories_link = function() {

        return "catalogue.html?calling_option=1&gender=" + gender + "&category=" + category;
    }


    $scope.breadcrumb_type = function() {

        return display_options;
    }

    getCategoryByAJAX();
    getSubCategoryByAJAX();
    getProductsAndFiltersByAJAX();
})












