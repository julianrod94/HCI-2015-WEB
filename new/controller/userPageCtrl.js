
var whichPage = whereIAm(getParameterByName('id'));

function whereIAm(id) {

	switch(id) {
		case "carrito": 
			return "Carrito";
		case "favoritos":
			return "Favoritos";
		case "usuario":
			return "Cuenta"
		default:
			window.location.replace("home.html"); // In case page wasn't well loaded, the system kicks you off to home page
			return;
	}
}


// ***************************************************************************************************************

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// ***************************************************************************************************************


//User stuff
//**********************************************************************************************************************************


var token = localStorage.getItem("token");
var user_local = localStorage.getItem("username");
var cart = localStorage.getItem("cart_id:" + user_local);



//**********************************************************************************************************************************



angular.module('userPageApp', []).controller('userPageController', function($scope, $http) {

	

	function getAccount() {

		if ($scope.token != null) {

			var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAccount&username=" + user_local + "&authentication_token=" + token;
			$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
				$scope.account = response.data.account;

			});

		}
	}

	￼//"http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username"


	$scope.breadcrumbMessage =  whichPage;
	$scope.account = null;

	$scope.tabChange = function(id) {
		console.log("entre con" + id);
		$scope.breadcrumbMessage = whereIAm(id);
	}

	$scope.userLogged = function() {
		return token != null;
	}








	// Ajax requests
	getAccount();
	getCart();


});












