
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
var cart = localStorage.getItem("current_cart_user:" + user_local);




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



angular.module('headerApp', []).controller('headerController', function($scope, $http, $log, $timeout, $q, $window, signInSrv) {

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


	function getAccount() {

		if ($scope.token != null) {

			var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetAccount&username=" + user_local + "&authentication_token=" + token;
			$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
				$scope.account = response.data.account;

			});

		}
	}

	function getCart() {

		if (token != null) {
			var url = "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=GetOrderById&username=" + user_local + "&authentication_token=" + token;
			url += "&id=" + cart;
			console.log(url);
			$http.get(url, {cache:true, timeout: 10000}).then(function(response) {
				$scope.header_cart = response.data.order
				for (var i = 0 ; i < $scope.header_cart.items.length ; i++) {
					$scope.header_cart_total += $scope.cart.items[i].price * $scope.cart.items[i].quantity;
				}

			})
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
			window.location.replace(window.location.href); // This keeps you were you were before loging out
		});
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
	$scope.userPreferences = null; 


	//cart stuff
	$scope.header_cart = null;
	$scope.header_cart_total = 0;  

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
		//signIn($scope.user_model,$scope.password_model);
		$scope.show_login_error = !signInSrv.signIn($scope.user_model, $scope.password_model);
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
	getCart()
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

angular.module('headerApp').service('signInSrv', function($http){
	return {

		signIn: function signIn(username, password) {

			console.log("llegue al service");
			
			if(token != null) {
				return "Ya esta logeado, cierre la sesion existente e intentelo de nuevo"; // Shouldn't be displayed anywhere
				console.log("Hay algo mal");
			}

			var url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=SignIn&username=" + username + "&password=" + password;
			$http.get(url, {cache: true, timeout: 10000}).then(function(response) {
				if(response.data.hasOwnProperty("error")){
					//$scope.show_login_error = true; // Must see how to implement this from header controller
					console.log("couldn't log in")
					return false;	
				}

				localStorage.setItem("token",response.data.authenticationToken); // Stores token in local storage
				localStorage.setItem("username",response.data.account.username); // Stores username
				currentCart = localStorage.getItem("current_cart_user:" + response.data.account.username); //Looks for cart in local storage
				
				if (currentCart == null || currentCart == "") {

					//Must look for cart in preferences
					var preferences_url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=GetPreferences&username=" + response.data.account.username;
					preferences_url += "&authentication_token=" + response.data.authenticationToken;
					console.log(preferences_url);

					$http.get(preferences_url, {cache: true, timeout: 10000}).then(function(response) {
						
						localStorage.setItem("user_preferences", response.data.preferences) //Saves preferences
						var preferences_response = JSON.parse(localStorage.getItem("user_preferences"));
						
						if (preferences_response != null && preferences_response["current_cart"] != null) {

							// There is a current cart saved in the API
							console.log("Getting cart from API...")
							localStorage.setItem("current_cart_user:" + localStorage.getItem("username") ,preferences_response["current_cart"]); // Stores the cart in local storage
						} else {

							// There wasn't a cart current cart in the API
							console.log("No cart in API, must create one and save it the API...");
							
							create_cart_url = "http://eiffel.itba.edu.ar/hci/service3/Order.groovy?method=CreateOrder&username=" + localStorage.getItem("username")
							create_cart_url += "&authentication_token=" + localStorage.getItem("token");
							console.log(create_cart_url);

							$http.get(create_cart_url, {cache: true, timeout: 10000}).then(function(response) {
								localStorage.setItem("current_cart_user:" + localStorage.getItem("username"), response.data.order.id); // Cart was created sucessfully, now must store it in API
								
								if (preferences_response == null) {
									preferences_response = {};
								}
								preferences_response["current_cart"] = response.data.order.id;
								preferences_response = JSON.stringify(preferences_response);
								console.log(preferences_response);

								localStorage.setItem("current_cart_user:" + localStorage.getItem("username") , response.data.order.id); // Stores cart in local storage

								var save_cart_url = "http://eiffel.itba.edu.ar/hci/service3/Account.groovy?method=UpdatePreferences&username=" + localStorage.getItem("username"); 
								save_cart_url += "&authentication_token=" + localStorage.getItem("token") + "&value=" + encodeURIComponent(preferences_response);
								console.log(save_cart_url);
								
								$http.get(save_cart_url, {cache: true, timeout: 10000}).then(function(response) {
									//Do nothing, don't need nothing from here
									//Maybe try to create favorites here
								});
							})// Ends creating cart
						} // Closes inner else
						localStorage.setItem("user_preferences", null);
					}); // Ends looking for cart in API
				} // Closes outer if
				else {
					console.log("Ya tenía un carrito");
				}
				var nextPage = window.location.href
				if (nextPage == "http://localhost:8000/view/html/register.html") {
					nextPage == "home.html"
				}
				window.location.replace(nextPage); 
			}); // Ends login
			return true;
		}						

	}		

})












