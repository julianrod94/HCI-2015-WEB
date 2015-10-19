
function getSection(result) {

    switch (result) {
        case 1:
            result = JSON.stringify([{"id":2, "value":"Adulto"},{"id":1, "value":"Masculino"}]);
            break;
        case 2:
            result = JSON.stringify([{"id":2, "value":"Adulto"},{"id":1, "value":"Femenino"}]);
            break;
        case 3:
            //result = [{"id":2, "values":["Infantil", "Bebe"]},{"id":1, "values":["Masculino","Femenino"]}];
            result = JSON.stringify([{"id":2, "value": "Infantil"}]);   //, {"id":2, "value": "Bebe"}]);
            break;
        case 4:
	        result = JSON.stringify([{"id":2, "value": "Bebe"}]);
            break;

    }
    return result;
}

//User stuff
//**********************************************************************************************************************************


var token = localStorage.getItem("token");
var user_local = localStorage.getItem("username");
var carrito = localStorage.getItem("carrito" + user_local);
var favoritos = localStorage.getItem("favoritos" + user_local);



//**********************************************************************************************************************************



//**********************************************************************************************************************************



// Gets the specified query string parameter
function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	    results = regex.exec(location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}



//**********************************************************************************************************************************



angular.module('headerApp', []).controller('headerController', function($scope, $http, $log, $timeout, $q, $window) {

	function getAllCategories(gender_id) {

        var url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllCategories&filters=" + encodeURIComponent(getSection(gender_id));
        $http.get(url, {cache: true, timeout: 10000}).then(function(response) {
             $scope.categories.push({id:gender_id, categories:response.data.categories});
        });
    }


    function getBrands(gender_id) {

    	var url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllProducts&filters=" + encodeURIComponent(getSection(gender_id));
    	$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
             $scope.brands.push({id:gender_id, brands:response.data.filters.filter(function(elem) {return elem.id == 9})});
        });
    }


    function signIn(username, password){

		if(token != null) {
			return "Ya esta logeado, cierre la sesion existente e intentelo de nuevo";
		}

		var url = "http://eiffel.itb	 a.edu.ar/hci/service3/Account.groovy?method=SignIn&username=" + username + "&password=" + password;

		$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
			if(response.data.hasOwnProperty("error")){
				return response.data.error.message;	
			}
			$scope.token = response.data.authenticationToken;
			$scope.user_local = response.data.account.username;
			localStorage.setItem("token",$scope.token);
			localStorage.setItem("username",response.data.account.username);
			$scope.carrito = localStorage.getItem("carrito" + user_local);
			$scope.favoritos = localStorage.getItem("favoritos" + user_local);
			window.location.replace(window.location.href); 
		});
	}

	function getAccount() {

    	if ($scope.token != null) {

    		var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAccount&username=" + user_local + "&authentication_token=" + token;
    		$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
				$scope.account = response.data.account;
			});

    	}
    }

	function signOut(){
		if(token == null){
			return;
		}
		var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=SignOut&username=" + user_local + "&authentication_token=" + token;
		$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
			localStorage.removeItem("token");
			token = null;
			$scope.carrito = null;
			$scope.favoritos = null;

		});
	}


	function createAccount(username, password, repeat, firstName, lastName, gender, identityCard, email, birthdate){

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

		if(!ok1 || !ok2 || !ok3 || !ok4 || !ok5 || !ok6 || !ok7 || !ok8 || !ok9){
			console.log(ok1);
			console.log(ok2);
			console.log(ok3);
			console.log(ok4);
			console.log(ok5);
			console.log(ok6);
			console.log(ok7);
			console.log(ok8);
			console.log(ok9);
			return "Caracteres invalidos";
		}
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //Enero es 0!
		var yyyy = today.getFullYear();
		var year = parseInt(birthdate.substring(0,3));
		var month = parseInt(birthdate.substring(5,6));
		var day = parseInt(birthdate.substring(8,9));
		if(year-16 > yyyy){
			return "Año invalido";
		}
		if(month>12){
			return "mes invalido";
		}
		if(day > 31){
			return "dia invalido";
		}
		if(year-16 == yyyy){
			if(!month <= mm){
				if(!day <= dd){
					return "Tiene que ser mayor de 16 años";
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
			if(response.hasOwnProperty("error")){
				return response.data.error.message;
			}	
			signIn(username, password); //ya lo logeo de entrada
			url = "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=CreateOrder&username=" + username + "&authentication_token=" + $scope.token;
			$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
				localStorage.setItem("carrito" + username, response.order.id);
				$scope.carrito = response.order.id;
			}
			$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
				localStorage.setItem("favoritos" + username, response.order.id);
				$scope.favoritos = response.order.id;
			}
			return "bienvenido firstName";
		})
	}


    $scope.categories = [];
    $scope.brands = [];
    $scope.search_string = null;

    $scope.parentScope = $scope;

    $scope.user_model = null;
    $scope.password_model = null;
    $scope.registerFields = {
    	name:null,
    	last_name:null,
    	birthday:null,
    	username:null,
    	email:null,
    	password:null,
    	repeat:null,
    	gender:null,
    	identity_card:null,
    	terms:false
    }

	$scope.token = token;
	$scope.account = null;   

    $scope.getBrandLink = function(gender_id, brand) {

    	return "catalogue.html?calling_option=3&gender=" + gender_id + "&brand=" + brand;
    }

    $scope.getCategoriesLink = function(gender_id, category_id) {

    	return "catalogue.html?calling_option=1&gender=" + gender_id + "&category=" + category_id;
    }

    $scope.getNewsLink = function(gender_id) {

    	return "catalogue.html?calling_option=4&gender=" + gender_id;
    }

    $scope.getSearchLink = function() {
    	return "catalogue.html?calling_option=5&search_string=" + $scope.search_string;
    }

    $scope.getSaleLink = function(gender_id) {

    	return "catalogue.html?calling_option=6&gender=" + gender_id;
    }

    $scope.makeSearch = function() {
    	if ($scope.search_string != null) {
	    	$window.location.href = "catalogue.html?calling_option=5&search_string=" + $scope.search_string;
	    }
    }

    $scope.userLogged = function() {
    	return token != null;
    }

    $scope.userMessage = function() {

    	if (token != null) {
    		return "Hola, " + $scope.account.firstName + "!";
    	}
    	return "Ingresar"
    }

    $scope.login = function() {
    	signIn($scope.user_model,$scope.password_model);
    }

    $scope.logout = function() {
    	signOut();
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
    	
    	createAccount(username, password, repeat, name, last_name, gender, identity_card, email, birthday);

    }


    getAllCategories(1);
    getAllCategories(2);
    getAllCategories(3);
    getAllCategories(4);
    getBrands(1);
    getBrands(2);
    getBrands(3);
    getBrands(4);

    getAccount();
});

angular.module('headerApp').directive('ngEnter', function() {
	return function(scope, element, attrs) {
	    element.bind("keydown keypress", function(event) {
	        if(event.which === 13) {
	            scope.$apply(function(){
	                scope.$eval(attrs.ngEnter);
	            });

	            event.preventDefault();
	        }
	    });
	};
});
















