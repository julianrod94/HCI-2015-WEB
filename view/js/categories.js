// Angular modules loader
angular.element(document).ready(function() {
	angular.bootstrap(document, ['categoriesApp']);
});


/*
$(document).ready(function(){

				//console.log($("a.categories").attr('id'))
				var str = '[{"name":"gender", "values":["' + getGender(getParameterByName('id')) + '"]}, {"name":"category", "values":["' + $("a.categories").attr('id') + '"]}]';
				str = JSON.stringify(str);
				str = encodeURIComponent(str);
				str = "catalogue.html?filters=";
   				$("a.categories").attr('href', str + encodeURIComponent(JSON.stringify('[{"name":"gender", "values":["' + getGender(getParameterByName('id')) + '"]}, {"name":"category", "values":["' + $(this).attr('id') + '"]}]')));

   				str = '[{"name":"gender", "values":["' + getGender(getParameterByName('id')) + '"]}, {"name":"category", "values":["' + $("a.categories").attr('id') + '"]}, {"name":"sub", "values":["' + $(this).attr('id') + '"]}]';
				str = JSON.stringify(str);
				str = encodeURIComponent(str);
				str = "catalogue.html?filters=";
   				$("a.sub_categories").attr('href', str);
			});
/*
$(document).ready(function(){

				//console.log($("a.categories").attr('id'))

				str = '[{"name":"gender", "values":["' + getGender(getParameterByName('id')) + '"]}, {"name":"category", "values":["' + $("a.categories").attr('id') + '"]}, {"name":"sub", "values":["' + $("a.categories").attr('id') + '"]}]';
				str = JSON.stringify(str);
				str = encodeURIComponent(str);
				str = "catalogue.html?filters=" + str;
   				$("a.sub_categories").attr('href', str);
			});


			*/