
function getGender(result) {

   	switch (result) {
   		case 'hombre':
   			result = "Hombres";
   			break;
   		case 'mujer':
   			result = "Mujeres";
   			break;
   		case 'ninos':
   			result = "Infantiles";
   			break;
   	}
   	return result;
	}

function getCategoryPictures(result) {

  switch (result) {
      case 'hombre':
        result = ['../../assets/categories/men-clothes.png','../../assets/categories/men-shoes.png','../../assets/categories/men-accesories.png'];
        break;
      case 'mujer':
        result = ['../../assets/categories/women-clothes.png','../../assets/categories/women-shoes.png','../../assets/categories/women-accesories.png'];
        break;
      case 'ninos':
        result = ['../../assets/categories/kids-clothes.png','../../assets/categories/kids-shoes.png','../../assets/categories/kids-accesories.png'];
        break;
    }
    return result;
}

function getSubcategories(result) {

    switch(result) {
        case 'hombre':
            result = 0;
            break;
        case 'mujer':
            result = 1;
            break;
        case 'ninos':
            result = 2;
            break;
        default:
            result = -1;
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
                            ]
    ]

    return sub_categories[result];
}


function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	    results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var categories = ['Indumentaria','Calzado', 'Accesorios'];



angular.module('categoriesApp', []).controller('categoriesController', function($scope) {
	var pageId = getParameterByName('id');

    $scope.pageName = function() {
        return getGender(pageId);
    },

    $scope.categories = function() {
        return categories;
    },

     $scope.pictures = function() {
      return getCategoryPictures(pageId);
    },

    $scope.sub_categories = function() {
        return getSubcategories(pageId);
    }

})






/*
categories = [ {    name:'Indumentaria', 
                    sub-categories: ['Camizas', 'Pantalones', 'Remeras', 
                            'Jeans', 'Bermudas y Shorts',
                            'Trajes de bañp', 'Abrigos'],

}

]
*/






