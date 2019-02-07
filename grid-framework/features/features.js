// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt Expat
$(document).ready( function () {
	$('div#features > div').each(function() {
		var $this = $(this);
		$this.find('.expandable').toggle();  // Hide by default
		$this.find('.expand').css('display', 'inline');
		$this.click(function() {
			$this.find('.expandable').slideToggle({start: function() {
				$this.find('.expand').toggle();
			}});
		});
	});
});
// @license-end
