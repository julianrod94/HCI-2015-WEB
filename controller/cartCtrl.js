angular.module('cartApp', []).controller('cartController', function($scope) {
    $scope.firstName = "John",
    $scope.lastName = "Doe",
   

    $scope.cartLine = {
    	item : {
    		name: "Nombre del producto", 
    		brand:"Marca del producto",
    		colour:"Color del producto",
    		size:"Talle del producto",
    		price:"Precio del producto",
    		image:"Imagen del producto" 
    	},
    	quantity: "Cantidad",
    	lineTotal: "Total por linea",
    },
    $scope.total = "Some total",

     $scope.fullName = function() {
        return $scope.firstName + " " + $scope.lastName;
    }

});