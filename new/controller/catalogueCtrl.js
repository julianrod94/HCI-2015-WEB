
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

    return getParameterByName('brand');
    // aux = parseInt(aux);
    // return isNaN(aux) ? null : aux;
}

function SearchString() {
    return getParameterByName('search_string')
}


function displayOptions() {

    var calling_option = getParameterByName('calling_option');
    calling_option = parseInt(calling_option);

    // If url was not well typed in address bar, or calling_option wasn't well specified, null is returned
    if (isNaN(calling_option) || calling_option < 1 || calling_option > 6) {
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
        return 24;
    }
    return aux;
}

function sortingKey() {

    var aux = getParameterByName('sort_key');
    if(aux != "nombre" && aux != "precio" && aux != "marca") {
        return "nombre";
    }
    return aux;
}

function sortOrder() {

    var aux = getParameterByName('sort_order');
    if (aux != "asc" && aux != "desc") {
        return "asc";
    }
    return aux;
}

function getFilters() {

    var aux = getParameterByName('prev_filters');
    aux = decodeURIComponent(aux);
    try {
        aux = JSON.parse(aux);
    } catch (err) {
        return [];
    }
    return (aux==null)?[]:aux;
}


// Generates the url to make the AJAX call
function generateRequestURL(gender, category, sub_category, brand, search_string, display_options, page_number, products_per_page, sorting_key, sort_order, filters) {

    var base_url = 'http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=';

    var filterJSON = [];

    var i;
    for (i = 0 ; i < filters.length ; i++) {
        if (filters[i].hasOwnProperty("real_id")) { // It's a size filter
            filterJSON[i] = {id: filters[i].real_id, value: filters[i].value};
        } else {
            filterJSON[i] = filters[i];
        }
    }

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
            //filterJSON.push({"id":2, "value":"Bebe"});
            break;
        case 4:
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
            base_url += "GetProductsByName&name=" + search_string + "&filters=" + encodeURIComponent(JSON.stringify(filterJSON));
            break;

        case 6: // Display sale
            filterJSON.push({"id": 5, "value": "Oferta"}) // Adds the news filter
            base_url += "GetAllProducts&filters=" + encodeURIComponent(JSON.stringify(filterJSON));
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

function getFilterUrl() {
    var link = "catalogue.html?dummy=1"

    if (gender != null) {
        link += '&gender=' + gender;
    }
    if (category != null) {
        link += '&category=' + category;
    }
    if (sub_category != null) {
        link += '&sub_category=' + sub_category;
    }
    if (brand != null){
        link += '&brand=' + brand;
    }
    if (search_string != null ) {
        link += '&search_string=' + search_string;
    }
    if (display_options != null) {
        link += '&calling_option=' + display_options;
    }
    if (page_number != null) {
        link += '&page=' + page_number;
    }
    if (products_per_page != null) {
        link += '&page_size=' + products_per_page;
    }
    if (sorting_key != null) {
        link += '&sort_key=' + sorting_key;
    }
    if (sort_order != null) {
        link += '&sort_order=' + sort_order;
    }
    if (filters != null) {
        link += '&prev_filters=' + encodeURIComponent(JSON.stringify(filters));
    }

    return link;
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
angular.module('catalogueApp', []).controller('catalogueController', function($scope, $http, $q) {


	$scope.gender = function() {
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
            case 4:
                result = "Bebes"
                break;
            default:
                result = "Género";
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
            //$scope.brands_filter = getSelectedItems(9);
        });
    }

    function getAllCategoriesByAJAX() {

        if (gender != 0) {

            var auxFilter = [];

            // Adds gender filter
            switch (gender) {
                case 1:
                    auxFilter.push({"id":1, "value": "Masculino"});
                    auxFilter.push({"id":2, "value": "Adulto"});
                    break;
                case 2:
                    auxFilter.push({"id":1, "value": "Femenino"});
                    auxFilter.push({"id":2, "value": "Adulto"});
                    break;
                case 3:
                    auxFilter.push({"id":2, "value":"Infantil"});
                    break;
                case 4:
                    auxFilter.push({"id":2, "value":"Bebe"});
                    break;
                default:
                    //Don't add anything (this means that a search was made, or that the page wasn't load well)
            }

            var url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllCategories&filters=" + encodeURIComponent(JSON.stringify(auxFilter));
            $http.get(url, {cache: true, timeout: 10000}).then(function(response) {
                 $scope.categories = response.data.categories;
                 completeList($scope.categories).then();
            });
        }
    }

    function iteration(array){
        var i;
        for (i = 0 ; i < array.length ; i++) {
            getAllSubCategoriesByAJAX(array[i].id);
        }
    }

    function completeList(array) {

      return $q(function(resolve, reject) {
          resolve(iteration(array));
      })
    }


    function getAllSubCategoriesByAJAX(category_id) {

        if (gender != 0) {

            var auxFilter = [];

            // Adds gender filter
            switch (gender) {
                case 1:
                    auxFilter.push({"id":1, "value": "Masculino"});
                    auxFilter.push({"id":2, "value": "Adulto"});
                    break;
                case 2:
                    auxFilter.push({"id":1, "value": "Femenino"});
                    auxFilter.push({"id":2, "value": "Adulto"});
                    break;
                case 3:
                    auxFilter.push({"id":2, "value":"Infantil"});
                    break;
                case 4:
                    auxFilter.push({"id":2, "value":"Bebe"});
                    break;
                default:
                    //Don't add anything (this means that a search was made, or that the page wasn't load well)
            }

            var url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllSubcategories&id=" + category_id + "&filters=" + encodeURIComponent(JSON.stringify(auxFilter));
            $http.get(url, {cache: true, timeout: 10000}).then(function(response) {
                 $scope.subcategories.push({id:category_id, values: response.data.subcategories});
            });
        }
    }

    $scope.parentScope = $scope;



    $scope.gender_filter = gender;
    $scope.category_filter = category;
    $scope.sub_category_filter = sub_category;
    $scope.brands_filter = getFilterFromPrev(9);
    $scope.colors_filter = getFilterFromPrev(4);
    $scope.occasion_filter = getFilterFromPrev(3);
    $scope.size_filter = getFilterFromPrev(-1);


	$scope.category = null;
    $scope.sub_category = null;
    $scope.brand = brand;
    $scope.search_string = search_string;
	$scope.products = null;
    $scope.filters = null;
    $scope.applicated_filters = filters;

    $scope.page_size = products_per_page;
    $scope.page_number = page_number;
    $scope.sorting_key = sorting_key;
    $scope.sorting_order = sort_order;

    // For filters
    $scope.categories = null;
    $scope.subcategories = [];


    $scope.getProductLink = function(prod_id) {
        var link = "product.html?product_id=" + prod_id;

        if (gender != null) {
            link += '&gender=' + gender;
        }
        if (category != null) {
            link += '&category=' + category;
        }
        if (sub_category != null) {
            link += '&sub_category=' + sub_category;
        }
        if (brand != null){
            link += '&brand=' + brand;
        }
        if (search_string != null ) {
            link += '&search_string=' + search_string;
        }
        if (display_options != null) {
            link += '&calling_option=' + display_options;
        }
        if (page_number != null) {
            link += '&page=' + page_number;
        }
        if (products_per_page != null) {
            link += '&page_size=' + products_per_page;
        }
        if (sorting_key != null) {
            link += '&sort_key=' + sorting_key;
        }
        if (sort_order != null) {
            link += '&sort_order=' + sort_order;
        }
        if (filters != null) {
            link += '&prev_filters=' + encodeURIComponent(JSON.stringify(filters));
        }

        return link;
    }
	
    $scope.gender_link = function() {

        return "categories.html?id=" + gender;
    }

    $scope.categories_link = function() {

        return "catalogue.html?calling_option=1&gender=" + gender + "&category=" + category;
    }


    $scope.breadcrumb_type = function() {

        return display_options;
    }

    $scope.hasGenderSpecified = function() {

        return gender != 0;
    }

    $scope.showNoProductsMessage = function() {

        return $scope.products == null || $scope.products.length < 1
    }

    $scope.sectionChanged = function(gender_id) {

        gender = gender_id;
        var url = getFilterUrl();
        applicate_filter(url);
    }

    $scope.categoryChanged = function(category_id) {

        category = category_id;
        var url = getFilterUrl();
        applicate_filter(url);
    }

    $scope.subCategoryChanged = function(category_id, sub_category_id) {
        category = category_id;
        sub_category = sub_category_id;
        display_options = 2;
        var url = getFilterUrl();
        applicate_filter(url);

    }

    $scope.brandChanged = function(brand) {

        var brandFilters = filters.find(function(elem) { return elem.id==9});

        if (brandFilters == null) { // if brands filter wasn't applicated
            filters.push({id:9, name:"Marca", value:brand})
        } else {
            brandFilters.value = brand;
        }
        var url = getFilterUrl();
        applicate_filter(url);

    }

    $scope.colorChanged = function(color) {

        var colorFilters = filters.find(function(elem) { return elem.id==4});

        if (colorFilters == null) { // if color filter wasn't applicated
            filters.push({id:4, name:"Color", value:color})
        } else {
            colorFilters.value = color;
        }
        var url = getFilterUrl();
        applicate_filter(url);
    }

    $scope.ocassionChanged = function(occasion) {

        var ocassionFilters = filters.find(function(elem) { return elem.id==3});

        if (ocassionFilters == null) { // if color filter wasn't applicated
            filters.push({id:3, name:"Ocasion", value:occasion})
        } else {
            colorFilters.value = occasion;
        }
        var url = getFilterUrl();
        applicate_filter(url);
    }

    $scope.sizeChanged = function(size, filter_id) {

        var sizeFilters = filters.find(function(elem) { return elem.id==-1});

        if (sizeFilters == null) { // if size filter wasn't applicated
            filters.push({id:-1, name:"Talle", value:size, real_id: filter_id})
        } else {
            sizeFilters.value = size;
        }
        var url = getFilterUrl();
        applicate_filter(url);

    }

    $scope.pageSizeChanged = function() {
        products_per_page = $scope.page_size;
        var url = getFilterUrl();
        applicate_filter(url);
    }

    $scope.sortKeyChanged = function() {
        sorting_key = $scope.sorting_key;
        var url = getFilterUrl();
        applicate_filter(url);
    }

    $scope.sortOrderChanged = function() {
        sort_order = $scope.sorting_order;
        var url = getFilterUrl();
        applicate_filter(url);
    }

    $scope.removeFilter = function(filter_id) {

        var i, flag = false;;
        for (i = 0 ; i < filters.length &!flag; i++) {
            if (filters[i].id == filter_id) {
                filters.splice(i,1);
                flag = true;
            }
        }

        var url = getFilterUrl();
        applicate_filter(url);
    }


    function getFilterFromPrev(attr_id) {

        var aux = filters.find(function(elem) { return elem.id==attr_id})
        return (aux != null) ? aux.value.replace(/\s+/g, "").toLowerCase() : null;
    }

    function applicate_filter(new_url) {
        window.location.replace(new_url);
    }

    getCategoryByAJAX();
    getSubCategoryByAJAX();
    getProductsAndFiltersByAJAX();
    getAllCategoriesByAJAX()
})

angular.module('catalogueApp').filter("removeSpaces", function() {
    return function(text) {
        var str = text.replace(/\s+/g,'').toLowerCase();
        return str;
    }
})












