// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt Expat
$(document).ready( function () {
	$('.faq-toc').hide();
	/* Move the \"more questions...\" paragraph */
	$more = $('.faq-toc p').detach();
	$('.faq-item').each(function() {
		/* FAQ-item, -question and -answer */
		var $item = $(this);
		var $q    = $item.find('.faq-q');
		var $a    = $item.find('.faq-a');

		/* Hide the answer */
		$a.hide();
		/* Redo the question into a hyperlink */
		var text = $q.text();
		$q2 = $('<p class=\"faq-q\"><a>' + text + '</ a></ p>')
		$q.replaceWith($q2);

		/* Toggle the answer on click */
		$q2.click(function() {
			$a.slideToggle();
		});

		$more.appendTo($item);
	});
});
// @license-end
