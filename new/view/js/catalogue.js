// Angular modules loader
angular.element(document).ready(function() {
	angular.bootstrap(document, ['catalogueApp','headerApp','thumbnailApp']);
});


function mark(obj) {
	obj.style.border = "1px solid black";
};



// Wait for window load
	// $(window).load(function() {
	// 	// Animate loader off screen
	// 	$(".se-pre-con").fadeOut("slow");;
	// });
