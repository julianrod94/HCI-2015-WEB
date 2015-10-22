angular.module('checkOutApp', []).controller('checkOutController', function($scope, $http, $q) {

	var showAddress = 1; 
	var showPayment = 1;

	function setShowAddress(state){
		switch(state){

			case 'select':
			$scope.showAddress = 1;
			break;
			case 'newAddress':
			$scope.showAddress = 2;
			break;
		}
		return;
	}

	function setShowPayment(state){
		switch(state){

			case 'selectPayment':
			$scope.showPayment = 1;
			break;

			case 'Cash':
			$scope.showPayment = 2;
			break;

			case 'selectCard'
			$scope.showPayment = 3;
			break;

			case 'newCard':
			$scope.showPayment = 4;
			break;
		}
		return;
	}

	function getShowPayment(){
		return $scope.showPayment;
	}

	function getShowAddress(){
		return $scope.showAddress;
	}


});