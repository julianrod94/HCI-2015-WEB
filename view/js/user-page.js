
// Tabs content

$(function() {
	$('.nav-tabs a:first').tab('show');
});

$(function() {
	$('#Cart').tab('show');
});

$(function() {
	$('#WishList').tab('show');
});

$(function() {
	$('#Account').tab('show');
});


$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  e.target // newly activated tab
  e.relatedTarget // previous active tab
})