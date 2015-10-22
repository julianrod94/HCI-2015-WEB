
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


//**********************************************************************************************************************************



angular.module('userPageApp', []).controller('userPageController', function($scope, $http, $q) {



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

	function getCreatingCardJSON() {
		
		return {
			number: "",
			expirationDate: "",
			securityCode: ""
		}
	}

	function getAccount() {

		if (token != null) {
			var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAccount&username=" + user_local + "&authentication_token=" + token;
			$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
				$scope.account = response.data.account;
				$scope.passwordFake = "********";
				$scope.update = getUpdatingJSON();
			});

		}
	}

	function getAllAddresses() {

		if (token != null) {

			var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAllAddresses&username=" + user_local + "&authentication_token=" + token; 
			$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
				if(!response.data.hasOwnProperty("error")) {
					if (response.data.addresses.length > 0) {
						url += "&page_size=" + response.data.total;
						$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
							$scope.allAddresses = response.data.addresses;
						})
					}
				}
			})
		}
	}

	function getAllStates() {

		var url = "http://eiffel.itba.edu.ar/hci/service3/Common.groovy?method=GetAllStates";
		$http.get(url, {cache: true, timeout: 10000}).then(function(response) {

			$scope.states = response.data.states;
		});

	}

	function getAllCreditCards() {

		if (token != null) {

			var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAllCreditCards&username=" + user_local + "&authentication_token=" + token; 
			$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
				if(!response.data.hasOwnProperty("error")) {
					if (response.data.creditCards.length > 0) {
						url += "&page_size=" + response.data.total;
						$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
							$scope.allCreditCards = response.data.creditCards;
						})
					}
				}
			})
		}
	}


	function createAddress() {

		if (token != null) {


			// Checks input
			if (!(/^.{1,80}$/).test($scope.createAddress.name)) {
				$scope.creatingAddress.error = true;
				$scope.creatingAddress.hints.push("El nombre debe ser una cadena de caracteres alfanuméricos y especiales, con una longitud de hasta 80 caracteres");
			}
			if (!(/^.{1,80}$/).test($scope.createAddress.street)) {
				$scope.creatingAddress.error = true;
				$scope.creatingAddress.hints.push("La calle debe ser una cadena de caracteres alfanuméricos y especiales, con una longitud de hasta 80 caracteres");
			}
			if (!(/^[A-Za-z0-9]{1,6}$/).test($scope.createAddress.number)) {
				$scope.creatingAddress.error = true;
				$scope.creatingAddress.hints.push("El número debe ser una cadena de caracteres alfanuméricos, con una longitud de hasta 6 caracteres");
			}
			if (!(/^[A-Za-z0-9]{0,3}$/).test($scope.createAddress.floor)) {
				$scope.creatingAddress.error = true;
				$scope.creatingAddress.hints.push("El piso debe ser una cadena de caracteres alfanuméricos, con una longitud de hasta 3 caracteres");
			}

			if (!(/^[A-Za-z0-9]{0,2}$/).test($scope.createAddress.gate)) {
				$scope.creatingAddress.error = true;
				$scope.creatingAddress.hints.push("El departamento debe ser una cadena de caracteres alfanuméricos y especiales, con una longitud de hasta 2 caracteres");
			}
			if ($scope.createAddress.province == 'C' && $scope.createAddress.city != "") {
				$scope.creatingAddress.error = true;
				$scope.creatingAddress.hints.push("No debe especificar ciudad si se encuentra en la Ciudad Autónoma de Buenos Aires");
			}
			if (!(/^[A-Za-z]{0,80}$/).test($scope.createAddress.city)) {
				$scope.creatingAddress.error = true;
				$scope.creatingAddress.hints.push("La ciudad debe ser una cadena de caracteres alfabéticos, con una longitud de hasta 80 caracteres");
			}
			if (!(/^[A-Za-z0-9]{1,10}$/).test($scope.createAddress.zipCode)) {
				$scope.creatingAddress.error = true;
				$scope.creatingAddress.hints.push("El código postal debe ser una cadena de caracteres alfanuméricos, con una longitud de hasta 10 caracteres");
			}
			if (!(/^.{1,25}$/).test($scope.createAddress.phoneNumber)) {
				$scope.creatingAddress.error = true;
				$scope.creatingAddress.hints.push("El teléfono debe ser ser una cadena de caracteres alfanuméricos y especiales, con una longitud de hasta 25 caracteres");
			}

			if($scope.creatingAddress.error) {

				$scope.creatingAddress.message = "Los datos ingresados son incorrectos";
			} else {

				// Erases optionals
				for (var key in $scope.createAddress) {
					if ($scope.createAddress[key] == "") {
						delete $scope.createAddress[String(key)];
					}
				}
				var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateAddress&username=" + user_local + "&authentication_token=" + token;
				url += "&address=" + encodeURIComponent(JSON.stringify($scope.createAddress));

				$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
					if (response.data.hasOwnProperty("error")) {
						$scope.creatingAddress.message = "Los datos ingresados son incorrectos"
						$scope.creatingAddress.hints.push(getServerErrorMessage(response.data.error.code, $scope.update.idCard));
						$scope.creatingAddress.error = true;
					} else {
						// La direccion fue agregada bien
						$scope.createAddress = getCreatingAddressJSON();
						$scope.creatingAddress.message = "La dirección se ha agregado con éxito"
						$scope.creatingAddress.hints.push("Presione la tecla \"Enter\" para continuar");
						getAllAddresses();
					}
				});
			}
			$scope.creatingAddress.show_modal = true;

		}
	}

	function updateAddress() {

		// Checks input
		if (token != null) {

			if (!(/^.{1,80}$/).test($scope.updateAddress.name)) {
				$scope.updatingAddress.error = true;
				$scope.updatingAddress.hints.push("El nombre debe ser una cadena de caracteres alfanuméricos y especiales, con una longitud de hasta 80 caracteres");
			}
			if (!(/^.{1,80}$/).test($scope.updateAddress.street)) {
				$scope.updatingAddress.error = true;
				$scope.updatingAddress.hints.push("La calle debe ser una cadena de caracteres alfanuméricos y especiales, con una longitud de hasta 80 caracteres");
			}
			if (!(/^[A-Za-z0-9]{1,6}$/).test($scope.updateAddress.number)) {
				$scope.updatingAddress.error = true;
				$scope.updatingAddress.hints.push("El número debe ser una cadena de caracteres alfanuméricos, con una longitud de hasta 6 caracteres");
			}
			if (!(/^[A-Za-z0-9]{0,3}$/).test($scope.updateAddress.floor)) {
				$scope.updatingAddress.error = true;
				$scope.updatingAddress.hints.push("El piso debe ser una cadena de caracteres alfanuméricos, con una longitud de hasta 3 caracteres");
			}

			if (!(/^[A-Za-z0-9]{0,2}$/).test($scope.updateAddress.gate)) {
				$scope.updatingAddress.error = true;
				$scope.updatingAddress.hints.push("El departamento debe ser una cadena de caracteres alfanuméricos y especiales, con una longitud de hasta 2 caracteres");
			}
			if ($scope.updateAddress.province == 'C' && $scope.updateAddress.city != "") {
				$scope.updatingAddress.error = true;
				$scope.updatingAddress.hints.push("No debe especificar ciudad si se encuentra en la Ciudad Autónoma de Buenos Aires");
			}
			if (!(/^[A-Za-z]{0,80}$/).test($scope.updateAddress.city)) {
				$scope.updatingAddress.error = true;
				$scope.updatingAddress.hints.push("La ciudad debe ser una cadena de caracteres alfabéticos, con una longitud de hasta 80 caracteres");
			}
			if (!(/^[A-Za-z0-9]{1,10}$/).test($scope.updateAddress.zipCode)) {
				$scope.updatingAddress.error = true;
				$scope.updatingAddress.hints.push("El código postal debe ser una cadena de caracteres alfanuméricos, con una longitud de hasta 10 caracteres");
			}
			if (!(/^.{1,25}$/).test($scope.updateAddress.phoneNumber)) {
				$scope.updatingAddress.error = true;
				$scope.updatingAddress.hints.push("El teléfono debe ser ser una cadena de caracteres alfanuméricos y especiales, con una longitud de hasta 25 caracteres");
			}


			if (!$scope.updatingAddress.error) {

				var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=UpdateAddress&username=" + user_local + "&authentication_token=" + token;
				url += "&address=" + encodeURIComponent(JSON.stringify($scope.updateAddress));

				$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
					if (response.data.hasOwnProperty("error")) {
						$scope.updatingAddress.message = "Los datos ingresados son incorrectos"
						$scope.updatingAddress.hints.push(getServerErrorMessage(response.data.error.code, $scope.update.idCard));
						$scope.updatingAddress.error = true;
					} else {
						// La direccion fue agregada bien
						$scope.updateAddress = {};
						$scope.updatingAddress.message = "La dirección se ha modificado con éxito"
						$scope.updatingAddress.hints.push("Presione la tecla \"Enter\" para continuar");
						getAllAddresses();
					}
				});

			} else {

				$scope.updatingAddress.message = "Los datos ingresados son incorrectos";
			}
			$scope.updatingAddress.show_modal = true;
		}
	}

	function deleteAddress() {

		if (token != null) {

			var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=DeleteAddress&username=" + user_local + "&authentication_token=" + token; 
			url += "&id=" + $scope.deletingAddress.address_id;
			console.log(url);
			$http.get(url, {cache:true, timeout: 10000}).then(function(response) {
				$scope.closeDeleteAddress();
				//windwindow.location.replace(window.location.href);
			})

		}
	}

	function createCreditCard() {

		if (token != null) {

			validateCard($scope.createCreditCard, $scope.creatingCreditCard);

			if($scope.creatingCreditCard.error) {

				$scope.creatingCreditCard.message = "Los datos ingresados son incorrectos";
			} else {

				var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateCreditCard&username=" + user_local + "&authentication_token=" + token;
				url += "&credit_card=" + encodeURIComponent(JSON.stringify($scope.createCreditCard));
				$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
					if (response.data.hasOwnProperty("error")) {
						$scope.creatingCreditCard.message = "Los datos ingresados son incorrectos"
						$scope.creatingCreditCard.hints.push(getServerErrorMessage(response.data.error.code, $scope.update.idCard));
						$scope.creatingCreditCard.error = true;
					} else {

						$scope.createCreditCard = getCreatingCardJSON();
						$scope.creatingCreditCard.message = "La tarjeta de crédito se ha agregado con éxito"
						$scope.creatingCreditCard.hints.push("Presione la tecla \"Enter\" para continuar");
						getAllCreditCards();
					}
				});
			}
			$scope.creatingCreditCard.show_modal = true;


		}
	}


	function updateCreditCard() {

		if (token != null) {

			validateCard($scope.updateCreditCard, $scope.updatingCreditCard);

			if (!$scope.updatingCreditCard.error) {

				var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=UpdateCreditCard&username=" + user_local + "&authentication_token=" + token;
				url += "&credit_card=" + encodeURIComponent(JSON.stringify($scope.updateCreditCard));
				console.log(url);
				$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
					if (response.data.hasOwnProperty("error")) {
						$scope.updatingCreditCard.message = "Los datos ingresados son incorrectos"
						$scope.updatingCreditCard.hints.push(getServerErrorMessage(response.data.error.code, $scope.update.idCard));
						$scope.updatingCreditCard.error = true;
					} else {
						$scope.updateCreditCard = {};
						$scope.updatingCreditCard.message = "La tarjeta de crédito se ha modificado con éxito"
						$scope.updatingCreditCard.hints.push("Presione la tecla \"Enter\" para continuar");
						getAllCreditCards();
					}
				});

			} else {

				$scope.updatingCreditCard.message = "Los datos ingresados son incorrectos";
			}
			$scope.updatingCreditCard.show_modal = true;
		}
	}

	function deleteCreditCard() {

		if (token != null) {

			var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=DeleteCreditCard&username=" + user_local + "&authentication_token=" + token; 
			url += "&id=" + $scope.deletingCreditCard.card_id;
			$http.get(url, {cache:true, timeout: 10000}).then(function(response) {
				$scope.closeDeleteCreditCard();
				window.location.replace(window.location.href);
			})
		}	
	}



	function getCart() {

		if (token != null) {
			var url = "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username=" + user_local + "&authentication_token=" + token;
			url += "&id=" + cart;
			console.log(url);
			$http.get(url, {cache:true, timeout: 10000}).then(function(response) {
				$scope.cart = response.data.order
				console.log($scope.cart);
			})
		}

	}
	

	// 

	$scope.loading_page = true && token != null; // Prevents loading when being in another part

	$scope.breadcrumbMessage =  whichPage;
	
	$scope.cart = null;

	$scope.account = null;
	$scope.passwordFake = null;
	$scope.allAddresses = null;
	$scope.allCreditCards = null;
	$scope.states = null;


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


	// ******************************


	// Manages creating address data
	$scope.createAddress = getCreatingAddressJSON();

	// Used for creating address
	$scope.creatingAddress = {
		show_form: false,
		show_modal: false,
		states: $scope.states,
		error: false,
		message: null,
		hints: []
	}

	// Manages updating address data
	$scope.updateAddress = {};

	// Used for updating address
	$scope.updatingAddress = {
		address_id: null,
		show_modal: false,
		states: $scope.states,
		error: false,
		message: null,
		hints: []
	}

	// Used for deleting an address
	$scope.deletingAddress = {
		address_id: null,
		show_modal: false,
		message: "¿Está seguro que desea eliminar la siguiente dirección?",
		whichAddress: null,
		relaod: false
	}


	// ******************************


	// Manages creating a credit card
	$scope.createCreditCard = getCreatingCardJSON()

	// Used for creating credit card
	$scope.creatingCreditCard = {
		show_form: false,
		show_modal: false,
		card_names:["Visa", "Master Card", "American Express", "Diners"],
		selected_card_name: null,
		error: false,
		message: null,
		hints: []
	}

	// Manages updating a credit card data
	$scope.updateCreditCard = {};

	// Used for updating credit card
	$scope.updatingCreditCard = {
		card_id: null,
		show_modal: false,
		card_names:["Visa", "Master Card", "American Express", "Diners"],
		selected_card_name: null,
		error: false,
		message: null,
		hints: []
	}

	// Used for deleting a credit card
	$scope.deletingCreditCard = {
		card_id: null,
		show_modal: false,
		message: "¿Está seguro que desea eliminar la siguiente tarjeta de crédito?",
		whichCard: null,
		relaod: false
	} 


	// ******************************



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
			var str1 = "Debe repetir la misma contraseña";
			var str2 = "La contraseña debe ser una cadena de caracteres alfanuméricos y especiales, con una longitud de entre 8 y 15 caracteres";
			$scope.updating.hint = ($scope.update.passwordNew != $scope.update.passwordRepeat) ? str1 : str2;
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

		$scope.updating = {
			show_modal: false,
			field: null,
			error: false,
			message: null,
			hint: null
		}

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

	$scope.dismissCreatingAddressMessage = function() {
		$scope.creatingAddress.show_modal = false;
		if (!$scope.creatingAddress.error) {
			window.location.replace(window.location.href);
		} else {
			$scope.creatingAddress.show_form = true;
		}
	}

	$scope.dismissUpdatingAddressMessage = function() {
		$scope.updatingAddress.show_modal = false;
		if (!$scope.updatingAddress.error) {
			window.location.replace(window.location.href);
		}
	}

	$scope.dismissCreatingCreditCardMessage = function() {
		$scope.creatingCreditCard.show_modal = false;
		if (!$scope.creatingCreditCard.error) {
			window.location.replace(window.location.href);
		} else {
			$scope.creatingCreditCard.show_form = true;
		}
	}

	$scope.dismissUpdatingCreditCardMessage = function() {
		$scope.updatingCreditCard.show_modal = false;
		if (!$scope.updatingCreditCard.error) {
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
			$scope.updating.hint = "debe ser una cadena de caracteres alfabéticos y especiales, con una longitud de hasta 80 caracteres";
			return {
				closingFunction: $scope.finishEditName,
				parameter: JSONParameter,
				error: !(/^([^0-9]){2,80}$/).test($scope.update.name)
			};

		}
		if ($scope.showEditLastName){

			$scope.updating.field = "El apellido";
			$scope.updating.hint = "debe ser una cadena de caracteres alfabéticos y especiales, con una longitud de hasta 80 caracteres";
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
				error: !(/^((19[0-9]{2})|(2[0-9]{3}))-((0[0-9])|(1[0-2]))-((0[1-9])|([1-2][0-9])|(3[01]))$/).test($scope.update.birthDate)
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
				return "El nombre debe ser una cadena de caracteres alfabéticos y especiales, con una longitud de hasta 80 caracteres";
			case 107:
				return "Apellido debe ser una cadena de caracteres alfabéticos y especiales, con una longitud de hasta 80 caracteres";
			case 108:
				return "El género debe especificar un género";
			case 109:
				return "El documento debe contener 8 dígitos (puede tener separador de miles)";
			case 110:
				return "El e-Mail debe ser una dirección de correo electrónico válida";
			case 111:
				return "La fecha de nacimiento debe ser ingresado con el siguiente formáto AAAA-MM-DD";
			case 144:
				return "La dirección en inválida"
			case 115:
				return "El nombre debe ser una cadena de caracteres alfanuméricos y especiales, con una longitud de hasta 80 caracteres";
			case 116:
				return "La calle debe ser una cadena de caracteres alfanuméricos y especiales, con una longitud de hasta 80 caracteres";
			case 117:
				return "El numero debe ser una cadena de caracteres alfanuméricos y especiales, con una longitud de hasta 6 caracteres";
			case 118:
				return "El Piso debe ser una cadena de caracteres alfanuméricos, con una longitud de hasta 3 caracteres";
			case 119:
				return "El departamento debe ser una cadena de caracteres alfanuméricos, con una longitud de hasta 2 caracteres";
			case 120:
				return "Provincia inválida";
			case 121:
				return "La ciudad debe ser una cadena de caracteres alfabéticos, con una longitud de hasta 80 caracteres";
			case 122:
				return "El código postal debe ser una cadena de caracteres alfanuméricos, con una longitud de hasta 10 caracteres";
			case 123:
				return "El teléfono debe ser ser una cadena de caracteres alfanuméricos y especiales, con una longitud de hasta 25 caracteres";
			case 134:
				return "Tarjeta de crédito inválida";
			case 135:
				return "El número es inválido";
			case 136:
				return "La fecha de expiración es inválida";
			case 137:
				return "El código de seguridad es inválido"
			case 201:
				return "Ya existe un usuario con el documento " + "\"" + dni + "\"";
			case 203:
				return "Ya existe dicha tarjeta de crédito";
			default:
				return " Algo salio mal";
		}
	}

	function validateCard(action, action_info) {

		var amexRegex = /^(34|37)[0-9]{13}$/;
		var dinersRegex = /^(36)[0-9]{14}$/;
		var masterCardRegex = /^(51|52|53)[0-9]{14}$/;
		var visaRegex = /^4([0-9]{12}|[0-9]{15})$/;

		if (amexRegex.test(action.number)) {
			action_info.selected_card_name = action_info.card_names[2]; // American Express
		
		} else if (dinersRegex.test(action.number)) {
			action_info.selected_card_name = action_info.card_names[3]; // Diners
		
		} else if (masterCardRegex.test(action.number)) {
			action_info.selected_card_name = action_info.card_names[1]; // Master Card
		
		}
		else if (visaRegex.test(action.number)) {
			action_info.selected_card_name = action_info.card_names[0]; // Visa
		
		} else {
			action_info.error = true;
			action_info.hints.push("Tarjeta de crédito invalida. Por favor, revise el número")
		}

		var expDateRegex = /^((0[1-9])|1(0|1|2))[0-9]{2}$/;
		if (!expDateRegex.test(action.expirationDate)) {
			action_info.error = true;
			action_info.hints.push("La fecha de vencimiento es inválida");
		} else {
			var actualYear = String(new Date().getFullYear()).substring(2,4);
			var actualMonth = String(new Date().getMonth() + 1);
			var actualDate = actualYear + actualMonth; // Reverse append to check efficiently if actual date is bigger than expiration date
			var expMonth = action.expirationDate.substring(0,2);
			var expYear = action.expirationDate.substring(2,4);
			var expDate = expYear + expMonth; // Reverse append to check efficiently if actual date is bigger than expiration date
			if (actualDate >= expDate) {
				action_info.error = true;
				action_info.hints.push("La fecha de vencimiento debe ser posterior a la fecha actual");
			}
		}

		var secCodeRegex = /^[0-9]{3,4}$/;
		if (!secCodeRegex.test(action.securityCode)) {
			action_info.error = true;
			action_info.hints.push("Código de seguridad inválido. Debe ser un número de 4 cifras para American Express, o de 3 cifras para el resto de las tarjetas");
		} else if (action.securityCode.length != 4 && action_info.selected_card_name == "American Express") {
			action_info.error = true;
			action_info.hints.push("Código de seguridad inválido. Debe ser un número de 4 cifras para American Express");
		} else if (action.securityCode.length != 3 && action_info.selected_card_name != "American Express" && action_info.selected_card_name != null) {
			action_info.error = true;
			action_info.hints.push("Código de seguridad inválido. Debe ser un número de 3 cifras");
		}
	}

	$scope.addAddress = function() {
		
		$scope.creatingAddress.show_form = true;
	}

	$scope.closeAddAddressForm = function() {

		$scope.creatingAddress.show_form = false;
	}

	$scope.applicateAddAddress = function() {

		$scope.creatingAddress = {
			show_form: false,
			show_modal: false,
			states: $scope.states,
			error: false,
			message: null,
			hints: []
		}
		
		createAddress()
	}

	$scope.openEditAddress = function(address_id) {

		var aux = $scope.allAddresses.find(function(elem) {
			return (elem.id == address_id);
		});
		for (var key in aux) {
			$scope.updateAddress[String(key)] = aux[key];
		}
		$scope.updatingAddress.address_id = $scope.updateAddress.id;


	}

	$scope.closeEditAddressForm = function() {
		$scope.updatingAddress.address_id = null;
		$scope.updateAddress = {};
	}

	$scope.applicateEditAddress = function() {
		var id = $scope.updatingAddress.address_id;
		$scope.updatingAddress = {
			address_id: id,
			show_modal: false,
			states: $scope.states,
			error: false,
			message: null,
			hints: []
		}
		updateAddress();
	}

	$scope.openDeleteAddress = function(address_id) {

		$scope.deletingAddress.address_id = address_id;
		$scope.deletingAddress.show_modal = true;
		$scope.deletingAddress.whichAddress = $scope.allAddresses.find(function(elem) {
			return (elem.id == address_id);
		});
	}

	$scope.closeDeleteAddress = function() {
		$scope.deletingAddress = {
			address_id: null,
			show_modal: false,
			message: "¿Está seguro que desea eliminar la siguiente dirección?",
			whichAddress: null,
			relaod: false
		}
	}

	$scope.applicateDeleteAddress = function() {

		deleteAddress();

	}


	$scope.addCreditCard = function() {
		
		$scope.creatingCreditCard.show_form = true;
	}

	$scope.closeAddCreditCardForm = function() {

		$scope.creatingCreditCard.show_form = false;
	}

	$scope.applicateAddCreditCard = function() {

		$scope.creatingCreditCard = {
			show_form: false,
			show_modal: false,
			card_names:["Visa", "Master Card", "American Express", "Diners"],
			selected_card_name: null,
			error: false,
			message: null,
			hints: []
		}
		
		$scope.closeAddCreditCardForm();
		createCreditCard();
	}

	$scope.openEditCreditCard = function(card_id) {

		var aux = $scope.allCreditCards.find(function(elem) {
			return (elem.id == card_id);
		});
		for (var key in aux) {
			$scope.updateCreditCard[String(key)] = aux[key];
		}
		$scope.updatingCreditCard.card_id = $scope.updateCreditCard.id;
	}

	$scope.closeEditCreditCard = function() {
		$scope.updatingCreditCard.card_id = null;
		$scope.updateCreditCard = {};
	}

	$scope.applicateEditCreditCard = function() {
		var id = $scope.updatingCreditCard.card_id;
		$scope.updatingCreditCard = {
			card_id: id,
			show_modal: false,
			card_names:["Visa", "Master Card", "American Express", "Diners"],
			selected_card_name: null,
			error: false,
			message: null,
			hints:[]
		}
		updateCreditCard();
	}

	$scope.openDeleteCreditCard = function(card_id) {

		$scope.deletingCreditCard.card_id = card_id;
		$scope.deletingCreditCard.show_modal = true;
		$scope.deletingCreditCard.whichCard = $scope.allCreditCards.find(function(elem) {
			return (elem.id == card_id);
		});
	}

	$scope.closeDeleteCreditCard = function() {
		$scope.deletingCreditCard = {
			card_id: null,
			show_modal: false,
			message: "¿Está seguro que desea eliminar la siguiente tarjeta de crédito?",
			whichCard: null,
			relaod: false
		}
	}

	$scope.applicateDeleteCreditCard = function() {

		deleteCreditCard();

	}


	// ************************






	$scope.getProvinceById = function(province_id) {

	 return $scope.states.find(function(elem) {

			return (elem.stateId == province_id)
		}).name;
	}

	$scope.giveMeMyBrand = function(card_number) {

		var amexRegex = /^(34|37)[0-9]{13}$/;
		var dinersRegex = /^(36)[0-9]{14}$/;
		var masterCardRegex = /^(51|52|53)[0-9]{14}$/;
		var visaRegex = /^4([0-9]{12}|[0-9]{15})$/;

		if (amexRegex.test(card_number)) {
			return "American Express";
		} else if (dinersRegex.test(card_number)) {
			return "Diners";
		
		} else if (masterCardRegex.test(card_number)) {
			return "Master Card";
		}
		else if (visaRegex.test(card_number)) {
			return "Visa";
		} 
	}

	$scope.giveMeEncodedNumber = function(card_number) {

		var l = card_number.length;
		var aux = "";
		for (var i = 0 ; i <= l - 4 ; i++) {
			aux += "X";
		}
		return aux + " - " + card_number.substring(l-4,l);
	}


	$scope.giveMeFormatedDate = function(expDate) {

		return expDate.substring(0,2) + " – " + expDate.substring(2,4);
	}


	function doAjax() {

		$scope.loading_page = true;
		return $q(function (resolve, reject) {
			resolve(ajaxCalls());
			//reject(window.location.replace(window.location.href));
		})
	}

	doAjax().then(function() {
		$scope.loading_page = false;
	})

	// Ajax requests
	function ajaxCalls() {
	
		getAccount();
		getCart();
		getAllStates();
		getAllAddresses();
		getAllCreditCards();
	}
});











