
var gender = getGender();

function getGender() {

    var aux = getParameterByName('id');
    aux = parseInt(aux);
    return isNaN(aux) ? 0 : aux;
}


function getFilters(result) {

    switch (result) {
        case 1:
            result = JSON.stringify([{"id":2, "value":"Adulto"},{"id":1, "value":"Masculino"}]);
            break;
        case 2:
            result = JSON.stringify([{"id":2, "value":"Adulto"},{"id":1, "value":"Femenino"}]);
            break;
        case 3:
            result = [{"id":2, "values":["Infantil", "Bebe"]},{"id":1, "values":["Masculino","Femenino"]}];
            break;
    }
    return result;


}

function getCategoryPictures(result) {

  switch (result) {
      case 'hombres':
        result = ['../../assets/categories/men-clothes.png','../../assets/categories/men-shoes.png','../../assets/categories/men-accesories.png'];
        break;
      case 'mujeres':
        result = ['../../assets/categories/women-clothes.png','../../assets/categories/women-shoes.png','../../assets/categories/women-accesories.png'];
        break;
      case 'infantiles':
        result = ['../../assets/categories/kids-clothes.png','../../assets/categories/kids-shoes.png','../../assets/categories/kids-accesories.png'];
        break;
    }
    return result;
}




function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	    results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


// **************************************************************************************************************************************************************************************

angular.module('categoriesApp', []).controller('categoriesController', function($scope, $http, $log, $timeout, $q) {
	var pageId = parseInt(getParameterByName('id'));

    function getAllCategories() {

        var url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllCategories&filters=" + encodeURIComponent(getFilters(pageId));
        $http.get(url, {cache: true, timeout: 10000}).then(function(response) {
             $scope.categories = response.data.categories;
             // var i;
             // for (i = 0 ; i < $scope.categories.length ; i++) {
             //    getAllSubCategories($scope.categories[i].id);
             // }
             completeList($scope.categories).then(
             console.log($scope.subcategories)
             );
        });
    }

    function iteration(array){
        var i;
        for (i = 0 ; i < array.length ; i++) {
            getAllSubCategories(array[i].id);
        }
    }

    function completeList(array) {

      return $q(function(resolve, reject) {
          resolve(iteration(array));
      })
    }


    function getAllSubCategories(category_id) {
        var url = "http://eiffel.itba.edu.ar/hci/service3/Catalog.groovy?method=GetAllSubcategories&id=" + category_id + "&filters=" + encodeURIComponent(getFilters(pageId));
        console.log(url);
        $http.get(url, {cache: true, timeout: 10000}).then(function(response) {
             $scope.subcategories.push({id:category_id, values: response.data.subcategories});
        });
    }

    function generateLink(gender_id, category_id, subcategory_id) {
        return null;
    }

    $scope.categories = null;
    $scope.subcategories = [];


    $scope.gender = function() {
        var result;
        switch(gender) {
            case 1:
                result = "Hombres";
                break;
            case 2:
                result = "Mujeres";
                break;
            case 3:
                result = "Infantiles";
                break;
            default:
                result = "Seleccione Género";
        }
        return result;
  }

    

     $scope.pictures = function() {
      return getCategoryPictures(pageId);
    },

    

    $scope.categories_link = function(gender, cat) {

      var str = '[{"name":"gender", "values":["' + gender + '"]}, {"name":"category", "values":["' + cat + '"]}]';
      str = JSON.stringify(str);
      str = encodeURIComponent(str);
      return "catalogue.html?filters=" + str;
      
    },

    $scope.sub_categories_link = function(gender, cat, sub) {

      var str = '[{"name":"gender", "values":["' + gender + '"]}, {"name":"category", "values":["' + cat + '"]}, {"name":"sub", "values":["' + sub + '"]}]';
      str = JSON.stringify(str);
      str = encodeURIComponent(str);
      return "catalogue.html?filters=" + str;
      
    }

    $scope.hasGenderSpecified = function() {

        return gender != 0;
    }

     getAllCategories();
})







