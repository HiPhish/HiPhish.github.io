// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt Expat

var config = {
	width: 800, 
	height: 600,
	params: { enableDebugging:"0" }
	
};
config.params["disableContextMenu"] = true;
var u = new UnityObject2(config);

jQuery(function() {

	var $missingScreen = jQuery("#unityPlayer").find(".missing");
	var $brokenScreen = jQuery("#unityPlayer").find(".broken");
	$missingScreen.hide();
	$brokenScreen.hide();

	u.observeProgress(function (progress) {
		switch(progress.pluginStatus) {
			case "broken":
				$brokenScreen.find("a").click(function (e) {
					e.stopPropagation();
					e.preventDefault();
					u.installPlugin();
					return false;
				});
				$brokenScreen.show();
			break;
			case "missing":
				$missingScreen.find("a").click(function (e) {
					e.stopPropagation();
					e.preventDefault();
					u.installPlugin();
					return false;
				});
				$missingScreen.show();
			break;
			case "installed":
				$missingScreen.remove();
			break;
			case "first":
			break;
		}
	});
	u.initPlugin(jQuery("#unityPlayer")[0], "example.unity3d");
});

// @license-end

