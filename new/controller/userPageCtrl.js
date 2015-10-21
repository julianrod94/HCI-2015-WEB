
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



	function getUpdatingJSON() {

		return {
			name: $scope.toTitleCase($scope.account.firstName),
			lastName: $scope.toTitleCase($scope.account.lastName),
			birthDate: $scope.account.birthDate,
			gender: $scope.account.gender,
			idCard: $scope.account.identityCard,
			email: $scope.account.email,
			passwordOld: null,
			passwordNew: null,
			passwordRepeat: null
		};
	}

	function getCreatingAddressJSON() {

		return {
			name: "",
			street: "",
			number: "",
			floor: "",
			gate: "",
			province: 'C',
			city: "",
			zipCode: "",
			phoneNumber: ""
		}
	}

	function getAccount() {

		if (token != null) {
			$scope.loading_page = true;
			var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAccount&username=" + user_local + "&authentication_token=" + token;
			$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
				$scope.account = response.data.account;
				$scope.passwordFake = "********";
				$scope.loading_page = false;
				$scope.update = getUpdatingJSON();
			});

		}
	}

	function getAllStates() {

		$scope.loading_page = true;
		var url = "http://eiffel.itba.edu.ar/hci/service3/Common.groovy?method=GetAllStates";
		$http.get(url, {cache: true, timeout: 10000}).then(function(response) {

			$scope.creatingAddress.states = response.data.states;
			$scope.loading_page = false;
		});

	}


	function createAddress() {

		if (token != null) {

			for (var key in $scope.createAddress) {
				if ($scope.createAddress[key] == "") {
					delete $scope.createAddress[String(key)];
				}
			}

			$scope.loading_page = true;
			var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateAddress&username=" + user_local + "&authentication_token=" + token;
			url += "&address=" + encodeURIComponent(JSON.stringify($scope.createAddress));
			console.log(url);
			console.log($scope.createAddress);
			$scope.loading_page = false;
			// $http.get(url, {cache: true, timeout: 10000}).then(function(response) {
			// 	$scope.account = response.data.account;
			// 	$scope.passwordFake = "********";
			// 	$scope.loading_page = false;
			// 	$scope.update = getUpdatingJSON();
			// });

		}
	}

	// "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username"

	$scope.loading_page = true && token != null; // Prevents loading when being in another part

	$scope.breadcrumbMessage =  whichPage;
	$scope.account = null;
	$scope.passwordFake = null;

	// Manages update data
	$scope.update = {};

	// Decide if an editing form is showed
	$scope.showEditName = false;
	$scope.showEditLastName = false;
	$scope.showEditBirthday = false;
	$scope.showEditGender = false;
	$scope.showEditIdCard = false;
	$scope.showEditMail = false;
	$scope.showEditPassword = false;

	// Used for updating account
	$scope.updating = {
		show_modal: false,
		field: null,
		error: false,
		message: null,
		hint: null
	}

	// Manages creating address data
	$scope.createAddress = getCreatingAddressJSON();

	// Used for creating address
	$scope.creatingAddress = {
		show_form: false,
		states:[],
		error: false
	}

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
		$scope.update = getUpdatingJSON();
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
		$scope.update = getUpdatingJSON();
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
		$scope.update = getUpdatingJSON();
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
		$scope.update = getUpdatingJSON();
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
		$scope.update = getUpdatingJSON();
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
		$scope.update = getUpdatingJSON();
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


		var flag = $scope.update.passwordNew != null;
		flag = flag && $scope.update.passwordOld != null;

		if (!flag) {
			return;
		}

		flag = flag && $scope.update.passwordNew == $scope.update.passwordRepeat;
		flag = flag && (/^.{6,15}$/).test($scope.update.passwordNew);

		if (flag) {

			var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=ChangePassword&username=" + user_local;
			url += "&password=" + $scope.update.passwordOld + "&new_password=" + $scope.update.passwordNew;
			console.log(url);
			$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
				if (response.data.hasOwnProperty("error")) {

					$scope.updating.message = "Los datos ingresados son incorrectos";
					$scope.updating.hint = "Contraseña inválida";
					$scope.updating.error = true;
				} else {
					$scope.updating.message = "La contraseña se ha modificado con exito";
					$scope.updating.hint = "Presione la tecla \"Enter\" para continuar";
					getAccount();
					$scope.finishEditPassword();
				}
			})
			
		} else {

			$scope.updating.message = "Los datos ingresados son incorrectos";	
			$scope.updating.hint = ($scope.update.passwordNew != $scope.update.passwordRepeat) ? "Debe repetir la misma contraseña" : "La contraseña debe ser una cadena de caracteres alfanuméricos y especiales, con una longitud de entre 8 y 15 caracteres";
			$scope.updating.error = true;
		}
		$scope.updating.show_modal = true;
	}

	$scope.finishEditPassword = function() {
		$scope.showEditPassword = false;
		$scope.update = getUpdatingJSON();
	}



	$scope.toTitleCase = function(str) {
		if (str != null) {
		    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		}
	}

	$scope.applicateEdit = function() {

		var aux = whichOneChanged();
		
		if (aux != null) {
			if (!aux.error) {
			
				var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=UpdateAccount&username=" + user_local;
				url += "&authentication_token=" + token + "&account=" + encodeURIComponent(JSON.stringify(aux.parameter));
				$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
					if (response.data.hasOwnProperty("error")) {
						$scope.updating.message = "Los datos ingresados son incorrectos";
						$scope.updating.hint = getServerErrorMessage(response.data.error.code, $scope.update.idCard);
						$scope.updating.error = true;
					} else {
						$scope.updating.message = $scope.updating.field + " se ha modificado con exito";
						$scope.updating.hint = "Presione la tecla \"Enter\" para continuar";
						getAccount(); 
						aux.closingFunction();
						
					}
				})

			} else {
				$scope.updating.message = "Los datos ingresados son incorrectos";
				$scope.updating.hint = $scope.updating.field + " " + $scope.updating.hint;
				$scope.updating.error = true;
			}
			$scope.updating.show_modal = true;
			
		}
		
	}

	$scope.dismissMessage = function() {
		$scope.updating.show_modal = false;
		if(!$scope.updating.error) {
			window.location.replace(window.location.href);
		}
	}

	function whichOneChanged() {

		var JSONParameter = {

			firstName: $scope.update.name,
			lastName: $scope.update.lastName,
			birthDate: $scope.update.birthDate,
			gender: $scope.update.gender,
			identityCard: $scope.update.idCard,
			email: $scope.update.email
		};

		if ($scope.showEditName) {

			$scope.updating.field = "El nombre";
			$scope.updating.hint = "debe ser una cadena de caracteres alfabéticos y especiales, con una longitud de entre 8 y 15 caracteres";
			return {
				closingFunction: $scope.finishEditName,
				parameter: JSONParameter,
				error: !(/^([^0-9]){2,80}$/).test($scope.update.name)
			};

		}
		if ($scope.showEditLastName){

			$scope.updating.field = "El apellido";
			$scope.updating.hint = "debe ser una cadena de caracteres alfabéticos y especiales, con una longitud de entre 8 y 15 caracteres";
			return {
				closingFunction: $scope.finishEditLastName,
				parameter: JSONParameter,
				error: !(/^([^0-9]){2,80}$/).test($scope.update.lastName)
			};
		}
		if ($scope.showEditBirthday){

			$scope.updating.field = "La fecha de nacimiento";
			$scope.updating.hint = "se debe ingresar con el siguiente formáto AAAA-MM-DD";
			return {
				closingFunction: $scope.finishEditBirthday,
				parameter: JSONParameter,
				error: !(/^((19[0-9]{2})|(2[0-9]{3}))-((0[0-9])|(1[0-2]))-(([0-2][0-9])|(3[01]))$/).test($scope.update.birthDate)
			};
		}
		if ($scope.showEditGender){
			
			$scope.updating.field = "El género";
			$scope.updating.hint = "debe ser especificado";
			return {
				closingFunction: $scope.finishEditGender,
				parameter: JSONParameter,
				error: !(/^[FM]$/).test($scope.update.gender)
			};
		}
		if ($scope.showEditIdCard){

			$scope.updating.field = "El documento";
			$scope.updating.hint = "debe contener 8 dígitos (puede tener separador de miles)";
			return {
				closingFunction: $scope.finishEditIdCard,
				parameter: JSONParameter,
				error: !(/(^[0-9]{2}\.[0-9]{3}\.[0-9]{3}$)|(^[0-9]{8}$)/).test($scope.update.idCard)
			};
		}
		if ($scope.showEditMail){

			$scope.updating.field = "El e-Mail";
			$scope.updating.hint = "debe ser una dirección de correo electrónico válida";
			return {
				closingFunction: $scope.finishEditMail,
				parameter: JSONParameter,
				error: $scope.update.email == null
			};
		}

	}

	function getServerErrorMessage(errorCode, dni) {

		switch(errorCode) {

			case 106:
				return "El nombre debe ser una cadena de caracteres alfabéticos y especiales, con una longitud de entre 8 y 15 caracteres";
			case 107:
				return "Apellido debe ser una cadena de caracteres alfabéticos y especiales, con una longitud de entre 8 y 15 caracteres";
			case 108:
				return "El género debe especificar un género";
			case 109:
				return "El documento debe contener 8 dígitos (puede tener separador de miles)";
			case 110:
				return "El e-Mail debe ser una dirección de correo electrónico válida";
			case 111:
				return "La fecha de nacimiento debe ser ingresado con el siguiente formáto AAAA-MM-DD";
			case 201:
				return "Ya existe un usuario con el documento " + "\"" + dni + "\"";
			default:
				return " Algo salio mal";
		}
	}

	$scope.addAddress = function() {
		getAllStates();
		$scope.creatingAddress.show_form = true;
	}

	$scope.closeAddAddressForm = function() {

		$scope.creatingAddress.show_form = false;
	}

	$scope.applicateAddAddress = function() {
		createAddress()
		$scope.closeAddAddressForm();
	}



	// Ajax requests
	getAccount();
	//getCart();


});











