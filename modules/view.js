define(['components/util', 'components/templateParser', 'components/loop', 'modules/config'], function(u, templateParser, Loop, config) {

	//set the parser to the built in parser
	var parser = templateParser;

	//create the views loop
	var viewLoop = Loop(10);
	viewLoop.start();

	//the templates
	var templates = {};

	function watch(data, onChange) {

		if(!typeof onChange === 'function') { throw new Error('UnityJS: I tried to watch a data object for changes but the application gave me a invalid function as a handler.'); }

		//create the mirror
		var mirror = {};
		u.mirror(mirror, data);

		//register a function to compare the object to its last state every cycle
		viewLoop.register(function(){

			//if the mirror doesn't match the data object then mirror it again and fire draw
			if(!u.compare(data, mirror)) {
				u.mirror(mirror, data);
				onChange();
			}
		});
	}

	function registerNewParser(templateParser) {
		if(typeof templateParser !== 'function') { throw new Error('UnityJS: It seams you tried to replace my template parser with an invalid function. No Dice sorry.'); }
		parser = templateParser;
	}

	function createView(templateId, data, $parentNode) {

		if(typeof templateId !== 'string') { throw new Error('UnityJS: I couldn\'t parse a template because it had an invalid id.'); }
		if(typeof data !== 'object') { throw new Error('UnityJS: I couldn\'t parse a template because it had an invalid data object.'); }

		if(typeof $parentNode === "string") {
			$parentNode = $($parentNode);
		}

		//create the view object
		var view = {
			"element": false
		};

		//get the template
		var template = '';
		if(templates[templateId]) {
			template = templates[templateId];
		} else {
			template = $('#' + templateId).html();
		}

		//if there is no template throw an error
		if(!template) { return false; }

		/**
		 * Draws/Redraws the view
		 */
		function draw() {

			//save the html data
			view.html = parser(template, data);

			//create the new element
			var $element = $(view.html);

			//if the element is being redrawn
			if(view.element) {
				view.element.replaceWith($element);
			} else {
				if($parentNode) {
					$element.appendTo($parentNode);
				}
			}

			//save the element to the view object
			view.element = $element;
		}

		//bind watch to all of the properties of the data object
		watch(data, draw);

		//call first draw
		draw();

		//return the element in case waiting for the view to compute is not required.
		return view;
	}

	/**
	 * Fetches a template
	 */
	function fetchTemplate(id, url, callback) {

		//if a number of templates are being requested
		if(typeof id === 'object') {
			callback = url;

			var execObject = u.callCounter(id.length, callback);

			for(var i = 0; i < id.length; i += 1) {
				fetchTemplate(id[i].id, id[i].url, execObject);
			}
		} else {

			$.ajax({
				"url": config.baseUrl + url,
				"cache": false,
				"success": function(res) {

					//save the template
					templates[id] = res;
					if(typeof callback === 'function') { callback(); }
				}
			});

		}
	}

	return {
		"parser": registerNewParser,
		"create": createView,
		"fetchTemplate": fetchTemplate
	}
});