

angular.module('registerApp', []).controller('registerController', function($scope, $http, $log, $timeout, $q, $window) {


	function signIn(username, password){

		if(token != null) {
			return; // Shouldn't get here, but in case...
		}

		var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=SignIn&username=" + username + "&password=" + password;

		$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
			if(response.data.hasOwnProperty("error")){
				$scope.show_login_error = true;
				return response.data.error.message;	
			}
			$scope.token = response.data.authenticationToken;
			localStorage.setItem("token",$scope.token);
			localStorage.setItem("username",response.data.account.username);
			if (cart == null) {
				createCart(response.data.account.username, $scope.token);
			}
			window.location.replace("home.html"); 
		});
	}

	function createCart(user_name, token) {

		url = "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=CreateOrder&username=" + user_name + "&authentication_token=" + token;
		console.log(url);
		// Creates a cart
		$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
			localStorage.setItem("cart_id:" + user_name, response.data.order.id);
			$scope.cart = response.data.order.id;		
		});
	}


	function createAccount(username, password, repeat, firstName, lastName, gender, identityCard, email, birthdate, terms){

		var reUser = /([a-zA-Z0-9]){6,15}/;
		var ok1 = reUser.test(username);
		var rePass = /.{6,15}/;
		var ok2 = rePass.test(password);
		var reName = /([^0-9]){2,80}/;
		var ok3 =  reName.test(firstName);
		var ok4 =  reName.test(lastName);
		var reGender = /[FM]/;
		var ok5 =  reGender.test(gender);
		var reIdentityCard = /(((([0-9]){0,3})\.){0,2})([0-9]){0,3}/;
		var ok6 = reIdentityCard.test(identityCard);
		var ok7 = email != null;
		var reBirthdate = /(19|20)[0-9]{2}-[01][0-9]-[0-3][0-9]/;
		var ok8 = reBirthdate.test(birthdate);
		var ok9 = password == repeat;
		var ok10 = terms;

		if(!ok1 || !ok2 || !ok3 || !ok4 || !ok5 || !ok6 || !ok7 || !ok8 || !ok9 || !ok10){

			if (!ok1) {
				$scope.wrong_fields.push({name: "Usuario", info:"Debe ser una cadena de caracteres alfanuméricos, con una longitud de entre 6 y 15 caracteres"});
			}
			if (!ok2) {
				$scope.wrong_fields.push({name: "Contraseña", info:"Debe ser una cadena de caracteres alfanuméricos y especiales, con una longitud de entre 8 y 15 caracteres"});
			}
			if (!ok3) {
				$scope.wrong_fields.push({name: "Nombre", info:"Debe ser una cadena de caracteres alfabéticos y especiales, con una longitud de entre 8 y 15 caracteres"});
			}
			if (!ok4) {
				$scope.wrong_fields.push({name: "Apellido", info:"Debe ser una cadena de caracteres alfabéticos y especiales, con una longitud de entre 8 y 15 caracteres"});
			}
			if (!ok5) {
				$scope.wrong_fields.push({name: "Género", info:"Debe especificar un género"});
			}
			if (!ok6) {
				$scope.wrong_fields.push({name: "Documento", info:"Debe ingresar con el siguiente formato: XX.XXX.XXX"});
			}
			if (!ok7) {
				$scope.wrong_fields.push({name: "e-Mail", info:"Debe ingresar una dirección de correo electrónico válida"});
			}
			if (!ok8) {
				$scope.wrong_fields.push({name: "Fecha de nacimiento", info:"Debe ingresar con el siguiente formáto AAAA-MM-DD"});
			}
			if (!ok9) {
				$scope.wrong_fields.push({name: "Repetir contraseña", info:"Las contraseñas no coinciden"});
			}

			if (!ok10) {
				$scope.wrong_fields.push({name: "Términos y condiciones", info:"Debe aceptar los términos y condiciones"});
			}

			$scope.show_register_error = true;
			return;
		}
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //Enero es 0!
		var yyyy = today.getFullYear();
		var year = parseInt(birthdate.substring(0,4),10);  	//Prevents octal base
		var month = parseInt(birthdate.substring(5,7),10);  //Prevents octal base
		var day = parseInt(birthdate.substring(8,10),10);	//Prevents octal base
		if(year-16 > yyyy){
			$scope.wrong_fields.push({name: "Fecha de nacimiento", info:"Año inválido"});
			$scope.show_register_error = true;
			return;
		}
		if(month>12 || month < 1){
			$scope.wrong_fields.push({name: "Fecha de nacimiento", info:"Mes inválido"});
			$scope.show_register_error = true;
			return;
		}
		if(day > 31 || day < 1){
			$scope.wrong_fields.push({name: "Fecha de nacimiento", info:"Día inválido"});
			$scope.show_register_error = true;
			return;
		}
		if(year-16 == yyyy){
			if(!month <= mm){
				if(!day <= dd){
					$scope.wrong_fields.push({name: "Fecha de nacimiento", info:"Debe ser mayor de edad"});
					$scope.show_register_error = true;
					return;
				}
			}
		}

		var jsonFilt = {
			username: username,
			password: password,
			firstName: firstName,
			lastName: lastName,
			gender: gender,
			identityCard: identityCard,
			email: email,
			birthDate: birthdate,
		}

		var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=CreateAccount&account=" + encodeURIComponent(JSON.stringify(jsonFilt));
		console.log(url);
		$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
			if(response.data.hasOwnProperty("error")){

				console.log("I'm here");
					$scope.wrong_fields.push(getErrorFromServer(response.data.error.code, username, identityCard));
					$scope.show_register_error = true;

				return;
			}	
			signIn(username, password); //ya lo logeo de entrada
			return;
		})
	}

	function getErrorFromServer(error, username, identity_card) {

		console.log("I'm here 2");

		switch (error) {
			case 104:
				return {name: "Usuario", info:"Debe ser una cadena de caracteres alfanuméricos, con una longitud de entre 6 y 15 caracteres"};
			case 105:
				return {name: "Contraseña", info:"Debe ser una cadena de caracteres alfanuméricos y especiales, con una longitud de entre 8 y 15 caracteres"};
			case 106:
				return {name: "Nombre", info:"Debe ser una cadena de caracteres alfabéticos y especiales, con una longitud de entre 8 y 15 caracteres"};
			case 107:
				return {name: "Apellido", info:"Debe ser una cadena de caracteres alfabéticos y especiales, con una longitud de entre 8 y 15 caracteres"};
			case 108:
				return {name: "Género", info:"Debe especificar un género"};
			case 109:
				return {name: "Documento", info:"Debe ingresar con el siguiente formato: XX.XXX.XXX"};
			case 110:
				return {name: "e-Mail", info:"Debe ingresar una dirección de correo electrónico válida"};
			case 111:
				return {name: "Fecha de nacimiento", info:"Debe ingresar con el siguiente formáto AAAA-MM-DD"};
			case 200:
				return {name: "Usuario", info: "Ya existe un usuario con el nombre " + "\"" + username + "\""};
			case 201:
				return {name: "Documento", info: "Ya existe un usuario con el documento " + "\"" + identity_card + "\""};
			default:
				return {name: "", info:"Algo salio mal"};
		}

	}

	$scope.parentScope = $scope;
	$scope.goUpBoolean = false;


	$scope.show_register_error = false;
	$scope.wrong_fields = [];
	$scope.registerFields = {
		name:"",
		last_name:"",
		birthday:"",
		username:"",
		email:"",
		password:"",
		repeat:"",
		gender:"M",
		identity_card:"",
		terms:false
	}

	$scope.register = function() {

		console.log($scope.registerFields);
		var username = $scope.registerFields.username;
		var password = $scope.registerFields.password;
		var repeat = $scope.registerFields.repeat;
		var name = $scope.registerFields.name;
		var last_name = $scope.registerFields.last_name;
		var gender = $scope.registerFields.gender;
		var email = $scope.registerFields.email;
		var identity_card = $scope.registerFields.identity_card;
		var birthday = $scope.registerFields.birthday;
		var terms = $scope.registerFields.terms;



		createAccount(username, password, repeat, name, last_name, gender, identity_card, email, birthday, terms);

	}

	$scope.close_register_error_modal = function() {

		$scope.show_register_error = false;
		$scope.wrong_fields = [];
	}

	$scope.eraseFields = function() {

		$scope.registerFields.name = "";
		$scope.registerFields.last_name = "";
		$scope.registerFields.birthday = "";
		$scope.registerFields.username = "";
		$scope.registerFields.email = "";
		$scope.registerFields.password = "";
		$scope.registerFields.repeat = "";
		$scope.registerFields.gender = "M";
		$scope.registerFields.identity_card = "";
		$scope.registerFields.terms = false;

	}

	$scope.goUp = function() {
		$scope.goUpBoolean = !$scope.goUpBoolean;
	}

});





