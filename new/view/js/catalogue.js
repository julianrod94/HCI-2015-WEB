// Angular modules loader
angular.element(document).ready(function() {
	angular.bootstrap(document, ['catalogueApp','cartApp','headerApp','thumbnailApp']);
});


function mark(obj) {
	obj.style.border = "1px solid black";
};



