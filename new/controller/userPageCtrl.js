
var whichPage = whereIAm(getParameterByName('id'));

function whereIAm(id) {

	switch(id) {
		case "carrito": 
			return "Carrito";
		case "favoritos":
			return "Favoritos";
		case "usuario":
			if(token == null) {
				window.location.replace("home.html"); // In case page wasn't well loaded, the system kicks you off to home page
			}
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


// var token = localStorage.getItem("token");
// var user_local = localStorage.getItem("username");
var cart = localStorage.getItem("cart_id:" + user_local);



//**********************************************************************************************************************************



angular.module('userPageApp', []).controller('userPageController', function($scope, $http) {

	

	function getAccount() {

		if (token != null) {

			var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAccount&username=" + user_local + "&authentication_token=" + token;
			$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
				$scope.account = response.data.account;
				$scope.passwordFake = "********";
				$scope.loading_page = false;
				$scope.update = {
					name: $scope.toTitleCase($scope.account.firstName),
					lastName: $scope.toTitleCase($scope.account.lastName),
					birthDate: $scope.account.birthDate,
					gender: $scope.account.gender,
					idCard: $scope.account.identityCard,
					email: $scope.account.email,
					passwordOld: null,
					passwordNew: null,
					passwordRepeat: null
				}
			});

		}
	}

	// "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username"

	$scope.loading_page = true && token != null;

	$scope.breadcrumbMessage =  whichPage;
	$scope.account = null;
	$scope.passwordFake = null;

	$scope.update = {};

	$scope.showEditName = false;
	$scope.showEditLastName = false;
	$scope.showEditBirthday = false;
	$scope.showEditGender = false;
	$scope.showEditIdCard = false;
	$scope.showEditMail = false;
	$scope.showEditPassword = false;

	$scope.tabChange = function(id) {
		
		$scope.breadcrumbMessage = whereIAm(id);
	}

	$scope.userLogged = function() {
		return token != null;
	}

	$scope.editName = function() {
		$scope.showEditName = true;
		$scope.showEditLastName = false;
		$scope.showEditBirthday = false;
		$scope.showEditGender = false;
		$scope.showEditIdCard = false;
		$scope.showEditMail = false;
		$scope.showEditPassword = false;
	}

	$scope.finishEditName = function() {
		$scope.showEditName = false;
	}


	$scope.editLastName = function() {
		$scope.showEditName = false;
		$scope.showEditLastName = true;
		$scope.showEditBirthday = false;
		$scope.showEditGender = false;
		$scope.showEditIdCard = false;
		$scope.showEditMail = false;
		$scope.showEditPassword = false;
	}

	$scope.finishEditLastName = function() {
		$scope.showEditLastName = false;
	}

	$scope.editBirthday = function() {
		$scope.showEditName = false;
		$scope.showEditLastName = false;
		$scope.showEditBirthday = true;
		$scope.showEditGender = false;
		$scope.showEditIdCard = false;
		$scope.showEditMail = false;
		$scope.showEditPassword = false;
	}

	$scope.finishEditBirthday = function() {
		$scope.showEditBirthday = false;
	}

	$scope.editGender = function() {
		$scope.showEditName = false;
		$scope.showEditLastName = false;
		$scope.showEditBirthday = false;
		$scope.showEditGender = true;
		$scope.showEditIdCard = false;
		$scope.showEditMail = false;
		$scope.showEditPassword = false;
	}

	$scope.finishEditGender = function() {
		$scope.showEditGender = false;
	}

	$scope.editIdCard = function() {
		$scope.showEditName = false;
		$scope.showEditLastName = false;
		$scope.showEditBirthday = false;
		$scope.showEditGender = false;
		$scope.showEditIdCard = true;
		$scope.showEditMail = false;
		$scope.showEditPassword = false;
	}

	$scope.finishEditIdCard = function() {
		$scope.showEditIdCard = false;
	}

	$scope.editMail = function() {
		$scope.showEditName = false;
		$scope.showEditLastName = false;
		$scope.showEditBirthday = false;
		$scope.showEditGender = false;
		$scope.showEditIdCard = false;
		$scope.showEditMail = true;
		$scope.showEditPassword = false;
	}

	$scope.finishEditMail = function() {
		$scope.showEditMail = false;
	}

	$scope.editPassword = function() {
		$scope.showEditName = false;
		$scope.showEditLastName = false;
		$scope.showEditBirthday = false;
		$scope.showEditGender = false;
		$scope.showEditIdCard = false;
		$scope.showEditMail = false;
		$scope.showEditPassword = true;
	}

	$scope.applicateEditPassword = function() {

		if ($scope.update.passwordNew == $scope.update.passwordRepeat && $scope.update.passwordNew != null && $scope.update.passwordOld != null) {

			var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=ChangePassword&username=" + user_local;
			url += "&password=" + $scope.update.passwordOld + "&new_password=" + $scope.update.passwordNew;
			console.log(url);
			$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
				// Mostrar algun mensaje
			})
		}
	}

	$scope.finishEditPassword = function() {
		$scope.showEditPassword = false;
	}



	$scope.toTitleCase = function(str) {
		if (str != null) {
		    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		}
	}





	// Ajax requests
	getAccount();
	//getCart();


});












