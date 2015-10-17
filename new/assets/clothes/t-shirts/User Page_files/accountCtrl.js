

var listOfTestUsers = [

    {
        user_id: 1,
        first_name: 'Juan Marcos',
        last_name: 'Bellini',
        birth: '06/10/1991',
        user_name: 'jbellini',
        e_mail: 'juanmbellini@hotmail.com',
        password: '123456',
        addresses: [
            {
                street: 'Ada Elflein',
                number: '2598',
                floor: null,
                apartment: null,
                state: 'Buenos Aires',
                city: 'Beccar',
                zip_code: '1643',
                shipping: true,
                billing: true,
            },
            {
                street: 'Andrés Rolón',
                number: '629',
                floor: null,
                apartment: null,
                state: 'Buenos Aires',
                city: 'San Isidro',
                zip_code: '1642',
                shipping: true,
                billing: false,
            }
        ],
        telephone: '1544484848'
    },
    {
        user_id: 2,
        first_name: 'Mateo',
        last_name: 'Bellini',
        birth: '06/09/1994',
        user_name: 'mbellini',
        e_mail: 'mateobellini@hotmail.com',
        password: 'hola1234',
        addresses: [
            {
                street: 'Ada Elflein',
                number: '2598',
                floor: null,
                apartment: null,
                state: 'Buenos Aires',
                city: 'Beccar',
                zip_code: '1643',
                shipping: true,
                billing: true,
            }
        ],
        telephone: '1531741498'
    },
    {
        user_id: 3,
        first_name: 'Julian',
        last_name: 'Rodriguez Nicastro',
        birth: '20/11/1994',
        user_name: 'julrodriguez',
        e_mail: 'julrodriguez@itba.edu.ar',
        password: 'tuvieja',
        addresses: [],
        telephone: null,
    }

];

// Function to simulate login
function login(user_name, password) {

    var i;
    for (i = 0 ; i < listOfTestUsers.length; i++) {
        if (listOfTestUsers[i].user_name == user_name) {
            if (listOfTestUsers[i].password == password) {
                return listOfTestUsers[i].user_id;
            }
        }
    }
    return null;
}

// Function to simulate password change
function changePassword(user_name, password, new_password) {
    var i;
    for (i = 0 ; i < listOfTestUsers.length; i++) {
        if (listOfTestUsers[i].user_name == user_name) {
            if (listOfTestUsers[i].password == password) {
                return true;
            }
            return false;
        }
    }
    return false;
}

// Function to get user's info
get_user = function() {

    var user = getParameterByName('user_id');
    if (user == null) {
        return listOfTestUsers[0]; // Returns default user
    }
    user = parseInt(user);
    return listOfTestUsers[user];
}


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
    

});