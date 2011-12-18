define(['modules/util'], function(u) {

	function createToast(args) {

		if(typeof args === 'string') {
			args = {
				"message": args
			};
		}

		var config = u.extend({
			"message": '',
			"className": 'UnityJS-toast',
			"duration": 1000
		}, args);

		var $toastWrapper = $('<div class="UnityJS-toast-wrapper"></div>')
				.appendTo('body')
				.hide()
				.fadeIn(3000).click(function() {
					$toastWrapper.stop().fadeOut(300, function() {
						$toastWrapper.remove();
					});
				});

		$('<div class="UnityJS-toast">' + config.message + '</div>')
				.addClass(config.className)
				.appendTo($toastWrapper);

		return $toastWrapper;

	}

	function createErrorToast(error) {
		return createToast({
			"message": error,
			"className": 'UnityJS-error'
		});
	}

	return {
		"toast": {
			"create": createToast
		},
		"error": createErrorToast
	};
});