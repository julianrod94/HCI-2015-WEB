
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
var cart = localStorage.getItem("cart_id:" + user_local);




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
			localStorage.removeItem("username");
			token = null;
			cart = null;
			window.location.replace(window.location.href);
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

	function updateAccount(firstName, lastName, gender, identityCard, email, birthdate){
		if(token == null){
			return "Debe estar logeao para cambiar los datos de su cuenta";
		}
		var reName = /([^0-9]){2,80}/;
		var ok1 =  reName.test(firstName);
		var ok2 =  reName.test(lastName);
		var reGender = /[FM]/;
		var ok3 =  reGender.test(gender);
		var reIdentityCard = /(((([0-9]){0,3})\.){0,2})([0-9]){0,3}/;
		var ok4 = reIdentityCard.test(identityCard);
		var ok5 = email != null;
		var reBirthdate = /(19|20)[0-9]{2}-[01][0-9]-[0-3][0-9]/;
		var ok6 = reBirthdate.test(birthdate);
		var ok7 = password == repeat;

		if(!ok1 || !ok2 || !ok3 || !ok4 || !ok5 || !ok6 || !ok7 ){
			return "datos invalidos";
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

		var jsonDatos = {
			firstName: firstName,
			lastName: lastName,
			gender: gender,
			identityCard: identityCard,
			email: email,
			birthDate: birthdate,
		}
		var url = "eiffel.itba.edu.ar/hci/service3/Account.groovy?method=UpdateAccount&username=" + $scope.user_local + "&authentication_token=" + $scope.token + "&account=" + encodeURIComponent(JSON.stringify(jsonDatos));

		$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
			if(response.hasOwnProperty("error")){
				return response.data.error.message;
			}
			return "Datos de cuenta actualizados con exito";
		})
	}

	//functionallity stuff
	$scope.parentScope = $scope;
	
	//categories stuff
	$scope.categories = [];
	$scope.brands = [];
	$scope.search_string = null;

	//login stuff
	$scope.user_model = null;
	$scope.password_model = null;
	$scope.show_login_error = false;

	//account stuff
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

	$scope.userOption = function() {
		if (token != null) {
			window.location.replace("userPage.html?id=usuario");
		}
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


	$scope.close_register_error_modal = function() {

		$scope.show_register_error = false;
		$scope.wrong_fields = [];
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


angular.module('headerApp').directive("modalShow", function () {
    return {
        restrict: "A",
        scope: {
            modalVisible: "="
        },
        link: function (scope, element, attrs) {

            //Hide or show the modal
            scope.showModal = function (visible) {
                if (visible)
                {
                    element.modal("show");
                }
                else
                {
                    element.modal("hide");
                }
            }

            //Check to see if the modal-visible attribute exists
            if (!attrs.modalVisible)
            {

                //The attribute isn't defined, show the modal by default
                scope.showModal(true);

            }
            else
            {

                //Watch for changes to the modal-visible attribute
                scope.$watch("modalVisible", function (newValue, oldValue) {
                    scope.showModal(newValue);
                });

                //Update the visible value when the dialog is closed through UI actions (Ok, cancel, etc.)
                element.bind("hide.bs.modal", function () {
                    scope.modalVisible = false;
                    if (!scope.$$phase && !scope.$root.$$phase)
                        scope.$apply();
                });

            }

        }
    };

});














