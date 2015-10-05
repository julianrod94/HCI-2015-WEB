
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



function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	    results = regex.exec(location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}


angular.module('catalogueApp', []).controller('catalogueController', function($scope) {
	var gender = getParameterByName('gender');
	var category = getParameterByName('category');
	var sub_category = getParameterByName('sub');
	var brand = getParameterByName('brand');
	var color = getParameterByName('color');
	var sizes = getParameterByName('sizes');
	var ocassion = getParameterByName('ocassion');
	var minPrice = getParameterByName('min-price');
	var maxPrice = getParameterByName('max-price');

	$scope.gender = function() {
		return gender.charAt(0).toUpperCase() + gender.slice(1);
	},

	$scope.category = function() {
		return category.charAt(0).toUpperCase() + category.slice(1);
	},

	$scope.sub_category = function() {
		return get_subcategory(gender, sub_category);
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

		return selectItemsBy(
			function(prod) {
				var flag = prod.gender == $scope.gender() && prod.category == $scope.category();
				if (flag) {
					if (sub_category != null) {
						flag &= prod.sub == $scope.sub_category();
					}
				}

				return flag;
			} );	
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
	}
})










