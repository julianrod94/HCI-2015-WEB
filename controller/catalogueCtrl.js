
function get_subcategory(gender, value) {

	if (value == null) {
		return null;
	}
	switch(gender) {
        case 'hombres':
            gender = 0;
            break;
        case 'mujeres':
            gender = 1;
            break;
        case 'infantiles':
            gender = 2;
            break;
        default:
            gender = -1;
    }
			
	var sub_categories = [ [ 
                            [
                                 {name: 'Camisas', id: "camisas"},
                                 {name: 'Pantalones', id: "pantalones"},
                                 {name: 'Remeras', id: "remeras"},
                                 {name: 'Jeans', id: "jeans"},
                                 {name: 'Bermudas y shorts', id: "bermudas"},
                                 {name: 'Trajes de baño', id: "trajes_banio"},
                                 {name: 'Abrigos', id: "abrigos"}
                            ],

                            [
                                 {name: 'Zapatillas', id: "zapatilas"},
                                 {name: 'Mocasines', id: "mocasines"},
                                 {name: 'Zapatos de vestir', id: "zapatos"},
                                 {name: 'Sandalias', id: "sandalias"},
                                 {name: 'Ojotas', id: "ojotas"},
                                 {name: 'Borcegos', id: "borcegos"},
                                 {name: 'Botas', id: "botas"}
                            ],

                            [
                                {name: 'Billeteras', id: "billeteras"},
                                {name: 'Bolsos', id: "bolsos"},
                                {name: 'Relojes', id: "relojes"},
                                {name: 'Cinturones', id: "cinturones"},
                                {name: 'Gorras', id: "gorras"},
                                {name: 'Gorros', id: "gorros"},
                                {name: 'Mochilas', id: "mochilas"}
                            ]

                        ],
                        [
                            [
                                {name: 'Remeras', id: "remeras"}, 
                                {name: 'Vestidos', id: "vestidos"}, 
                                {name: 'Camisas y blusas', id: "camisas"}, 
                                {name: 'Jeans', id: "jeans"}, 
                                {name: 'Pantalones', id: "pantalones"}, 
                                {name: 'Polleras', id: "polleras"}, 
                                {name: 'Shorts', id: "shorts"},
                                {name: 'Calzas', id: "calzas"},
                                {name: 'Bikinis', id: "bikini"},
                                {name: 'Abrigos de invierno', id: "abrigos_invierno"}, 
                                {name: 'Abrigos de verano', id: "abrigos_verano"}
                            ],
                            [
                                {name: 'Sandalias', id: "sandalias"}, 
                                {name: 'Zuecos', id: "zuecos"}, 
                                {name: 'Balerinas', id: "balerinas"}, 
                                {name: 'Zapatos', id: "zapatos"}, 
                                {name: 'Zapatillas', id: "zapatilas"}, 
                                {name: 'Ojotas', id: "ojotas"}, 
                                {name: 'Borcegos', id: "borcegos"}, 
                                {name: 'Botas', id: "botas"}
                            ],
                            [
                                {name: 'Bolsos y carteras', id: "carteras"},
                                {name: 'Bijou', id: "bijou"},
                                {name: 'Billeteras', id: "billeteras"},
                                {name: 'Cinturones', id: "cinturones"},
                                {name: 'Mochilas', id: "mochilas"},
                                {name: 'Cartucheras', id: "cartucheras"},
                                {name: 'Anteojos de sol', id: "anteojos"},
                                {name: 'Relojes', id: "relojes"}
                            ]
                        ],
                        [
                            [
                                {name: 'Remeras', id: "remeras"},
                                {name: 'Camisas', id: "camisas"},
                                {name: 'Pantalones', id: "pantalones"},
                                {name: 'Calzas', id: "calzas"},
                                {name: 'Polleras', id: "polleras"},
                                {name: 'Shorts', id: "shorts"},
                                {name: 'Trajes de baño', id: "trajes_banio"},
                                {name: 'Abrigos', id: "abrigos"}, 
                                {name: 'Pijamas', id: "pijamas"}
                            ],
                            [
                                {name: 'Zapatillas', id: "zapatillas"},
                                {name: 'Zapatos', id: "zapatos"},
                                {name: 'Ojotas', id: "ojotas"}, 
                                {name: 'Pantuflas', id: "pantuflas"}, 
                                {name: 'Sandalias', id: "sandalias"}, 
                                {name: 'Borcegos', id: "borcegos"}, 
                                {name: 'Botas', id: "botas"}
                            ],
                            [
                                {name: 'Mochilas', id: "mochilas"},
                                {name: 'Carpetas', id: "carpetas"},
                                {name: 'Cartucheras', id: "cartucheras"}
                            ]
                        ] ];

    var gender_subcategories = sub_categories[gender];

    var i;
    var flag = false;
    for (i = 0 ; i < gender_subcategories.length && !flag; i++) {
    	var j;
    	for (j = 0 ; j < gender_subcategories[i].length && !flag ; j++) {
    		if (gender_subcategories[i][j].id == value) {
    			value = gender_subcategories[i][j].name;
    			flag = true;
    		}
    	}
    } 

	return value;
}

function createJSONFilterObject() {

    var result = getParameterByName('filters');
    result = decodeURIComponent(result);
    try {
        result = JSON.parse(result);  // Gets an array of objects with a name propery 
                                    //and a value property which is an array of values to filter
    } catch (e) {
        return null;
    }
    result = eval(result);
    return result;

}

var JSONFilters = createJSONFilterObject();

function  getComponentsOfFilter() {
    var result = JSONFilters;
    if (result == null) {
        return 0;
    }
    return result.length;
}

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

function createFunctionToQuery() {

    return function(prod) {
        var condition = createCodeForQuery();
        return eval(condition);
    }
}



function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	    results = regex.exec(location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}


angular.module('catalogueApp', []).controller('catalogueController', function($scope) {
	var brand = getParameterByName('brand');
	var color = getParameterByName('color');
	var sizes = getParameterByName('sizes');
	var ocassion = getParameterByName('ocassion');
	var minPrice = getParameterByName('min-price');
	var maxPrice = getParameterByName('max-price');

	$scope.gender = function() {
		
        var i, flag = false, result = null;
        for (i = 0 ; i < JSONFilters.length && !flag ; i++) {
            if (JSONFilters[i].name == 'gender') {
                flag = true;
                if (JSONFilters[i].values.length == 1) {
                    result = JSONFilters[i].values[0];
                }
            }
        }
        return result;
	},

	$scope.category = function() {
		//return category.charAt(0).toUpperCase() + category.slice(1);
        var i, flag = false, result = null;
        for (i = 0 ; i < JSONFilters.length && !flag ; i++) {
            if (JSONFilters[i].name == 'category') {
                flag = true;
                if (JSONFilters[i].values.length == 1) {
                    result = JSONFilters[i].values[0];
                }
            }
        }
        return result;

	},

	$scope.sub_category = function() {
		var i, flag = false, result = null;
        for (i = 0 ; i < JSONFilters.length && !flag ; i++) {
            if (JSONFilters[i].name == 'sub') {
                flag = true;
                if (JSONFilters[i].values.length == 1) {
                    result = JSONFilters[i].values[0];
                }
            }
        }
        return result;
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

		/*return selectItemsBy(
			function(prod) {
				var flag = prod.gender == $scope.gender() && prod.category == $scope.category();
				if (flag) {
					if (sub_category != null) {
						flag &= prod.sub == $scope.sub_category();
					}
				}

				return flag;
			} );	*/
        return selectItemsBy(createFunctionToQuery());
	},

	$scope.reloadFilters = function() {

		return getFieldsForFilters();
	},



	$scope.filters = function() {

		return ['Géneros', 'Categorias', 'Sub-Categorias', 'Marcas', 'Colores', 'Talles', 'Ocasiones', 'Precio'];
	},

	$scope.getAll = function(field) {

		return getAll(field);
	},

	$scope.transformFilter = function(filter) {


		return $scope.reloadFilters()[$scope.filters.indexOf(filter)];
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












