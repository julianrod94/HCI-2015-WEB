

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}


angular.module('AccountApp', []).controller('accountController', function($scope) {

    $scope.get_user = function() {
        return get_user();
    }

    $scope.check_if_logged_in = function() {
         var user = getParameterByName('user_id');
         return user == null;
    }
    

});








