// jQuery script to hook up the main gallery script
$(document).ready(function() {
	$('.gallery').magnificPopup({
		delegate: 'a',
		type: 'image',
		key: 'screenshots',
		mainClass: 'mfp-with-zoom',
		gallery: {
			enabled:true,
		},
		zoom: {
			enabled: true,
			duration: 200,
			easing: 'ease-in-out',
			opener: function(openerElement) {
				return openerElement.is('img') ? openerElement : openerElement.find('img');
			}
		}
	});
})
