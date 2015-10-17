
var gender = getGender()
var comes_from = comesFrom()
var display_options = displayOptions(comes_from, gender);
var page_number = pageNumber();
var products_per_page = productsPerPage();
var sorting_key = sortingKey();
var filters = getFilters();
var requestURL = generateRequestURL(gender, comes_from, display_options, page_number, sorting_key, filters);



function getGender() {

    var aux = getParameterByName('gender');
    aux = parseInt(aux);
    return isNaN(aux) ? null : aux;
}

function comesFrom() {

    var aux = getParameterByName('comes_from');
    aux = parseInt(aux);
    return isNaN(aux) ? null : aux;
}


function displayOptions(comes_from_id, gender_id) {

    // Checks if gender is specified (if not, error code will be returned)
    if (gender_id == null) {
        return 0;
    }

    var calling_option = getParameterByName('calling_option');
    calling_option = parseInt(calling_option);

    // If url was not well typed in address bar, or calling_option wasn't well specified, error code will be returned
    if (isNaN(calling_option) || calling_option < 1 || calling_option > 5) {
        return 0;
    }
    return calling_option;
}

function pageNumber() {

    var aux = getParameterByName('page');
    aux = parseInt(aux);
    return isNaN(aux) ? 1 : aux;

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

    var aux = getParameterByName('sort');
    aux = parseInt(aux);
    if (isNaN(aux) || (aux != 1 && aux != 2 && aux != 3)) {
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



function generateRequestURL(gender, comes_from, display_options, page_number, sorting_key, filters) {

    var base_url = 'http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=';
    
    switch (comes_from) {

        case 1: //Comes from categories page (Has two options: get products by category or get products by sub-category )
            switch(gender) {
                case 1: //Men

                case 2: //Women

                case 3: //Kids

                default: //Whatever
            }



        case 2: //Comes from header dropdown  (Has three options: get products by category, get products by brand or get products by new releases)




        case 3: //Comes from searchbar (Has one option: get products by name)




        case null:  //Comes from nowhere. For example, typed down url in address bar. Has two options: if gender is not specified, get all products and
                    // if gender is specified, get all products by gender ; or just display an error message

        default: //Any other option


    }




}




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

    if (result == null || result.length == undefined) {
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

// Creates a boolean expression to use as a query
function createCodeForQuery() {
    var result = getParameterByName('filters');
    result = decodeURIComponent(result);
    result = JSON.parse(result);  // Gets an array of objects with a name propery 
                                    //and a value property which is an array of values to filter
    if (result == '') {
        return '';
    }
    result = eval(result);
    var i;
    var prod = 'prod';
    var code = '';

    for (i = 0 ; i < result.length ; i++) {
        var aux = prod + '.' + result[i].name;
        var j;
        for (j = 0 ; j < result[i].values.length ; j++) {
            if (j == 0) {
                code += '(';
            }
            code = code + '(' + aux + '==' + '\'' + result[i].values[j] + '\'' + ')';
            if (j + 1 < result[i].values.length) {
                code += '||';
            } else {
                code += ')';
            }
        }
        if (i + 1 < result.length) {
            code += '&&';
        }
    }
    return code;
}

// Creates the function that has boolean expression
function createFunctionToQuery() {

    return function(prod) {
        var condition = createCodeForQuery();
        return eval(condition);
    }
}


// Gets the specified query string parameter
function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	    results = regex.exec(location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Function that returns breadcrumbs filter values (gender, category and sub_category)
function getBreadcrumbValue(filter_name) {

    var i, flag = false, result = null;
        for (i = 0 ; i < JSONFilters.length && !flag ; i++) {
            if (JSONFilters[i].name == filter_name) {
                flag = true;
                if (JSONFilters[i].values.length == 1) {
                    result = JSONFilters[i].values[0];
                }
            }
        }
    return result;

}

// Controller for catalogue
angular.module('catalogueApp', []).controller('catalogueController', function($scope) {
	var brand = getParameterByName('brand');
	var color = getParameterByName('color');
	var sizes = getParameterByName('sizes');
	var ocassion = getParameterByName('ocassion');
	var minPrice = getParameterByName('min-price');
	var maxPrice = getParameterByName('max-price');

	$scope.gender = function() {
        return getBreadcrumbValue('gender');
	},

	$scope.category = function() {
		//return category.charAt(0).toUpperCase() + category.slice(1);
        return getBreadcrumbValue('category');

	},

	$scope.sub_category = function() {
		return getBreadcrumbValue('sub');
	},

	$scope.corruptedQueryString = function() {

		return (gender == null || category == null || sub_category == null); // These are the three parameters that must be completed
	},

	$scope.fullCatalogue = function() {

		return selectItemsBy(
			function(prod) {
				return true;
			});
	},

	$scope.products = function() {

        return selectItemsBy(createFunctionToQuery()); // Returns a list of products based on the query string filter parameter
	},

	$scope.reloadFilters = function() {

		return getFieldsForFilters(); // Returns filters used to query
	},

    $scope.transformFilter = function(filter) {

        return $scope.reloadFilters()[$scope.filters.indexOf(filter)];
    },

    $scope.getProductLink = function(id) {
        return "product.html?id=" + id; //+"&filters=" + encodeURIComponent(JSON.stringify(JSONFilters));
    }


    // FiltersUI methods
	$scope.filters = function() {

		return ['Géneros', 'Categorias', 'Sub-Categorias', 'Marcas', 'Colores', 'Talles', 'Ocasiones', 'Precio']; // Returns filters names
	},

	$scope.getAll = function(field) {

		return getAll(field); // Returns filters values
	},

	

    $scope.categories_link = function(gend, cat) {

        var str = '[{"name":"gender", "values":["' + gend + '"]}, {"name":"category", "values":["' + cat + '"]}]';
        str = JSON.stringify(str);
        str = encodeURIComponent(str);
        return "catalogue.html?filters=" + str;
      
    },

    $scope.sub_categories_link = function(gend, cat, sub) {


        var str = '[{"name":"gender", "values":["' + gend + '"]}, {"name":"category", "values":["' + cat + '"]}, {"name":"sub", "values":["' + sub + '"]}]';
        str = JSON.stringify(str);
        str = encodeURIComponent(str);
        return "catalogue.html?filters=" + str;
      
    }, 

    $scope.how_many_filters = function() {

        return getComponentsOfFilter();
    }
})












