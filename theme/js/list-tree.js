// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt Expat

// Toggles the chevron of list items.
$(function() {
	$('.list-group-item').on('click', function() {
	$('.glyphicon', this)
		.toggleClass('glyphicon-chevron-right')
		.toggleClass('glyphicon-chevron-down');
	});
});

// @license-end
