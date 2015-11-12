// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt Expat

// Toggles the chevron of list items.
$(function() {
	$('.list-group-item').on('click', function() {
	$('.glyphicon', this)
		.toggleClass('glyphicon-chevron-right')
		.toggleClass('glyphicon-chevron-down');
	});
});

/* This file contains code related to the functioning of navigation bars. */
$("document").ready( function() {
	/* Display the caret on dropdown menues.         */
	/* Use first or we will match menu items as well */
	$(".dropdown a span").first().addClass("caret");
});

// @license-end
