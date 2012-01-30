define(['components/util', 'components/templateParser', 'components/loop', 'modules/config'], function(u, templateParser, Loop, config) {

	//set the parser to the built in parser
	var parser = templateParser;

	//create the views loop
	var viewLoop = Loop(10);
	viewLoop.start();

	//the templates
	var templates = {};

	/**
	 * Replaces or returns the template parser
	 * @param templateParser
	 */
	function parser(templateParser) {

		//If a new parser is passed then replace the old one
		if(typeof templateParser === 'function') {

			parser = templateParser;
			return true;

		//if a invalid parser is passed return false
		} else if(templateParser) {

			return false;

		//if nothing is passed return the parser
		} else {

			return templateParser;
		}
	}

	/**
	 * Creates a view
	 * @param templateId
	 * @param data
	 * @param $parentNode
	 * @param mapCallback
	 */
	function createView(templateId, data, $parentNode, mapCallback) {

		//validate the required arguments
		if(typeof templateId !== 'string') { throw new Error('UnityJS: I couldn\'t parse a template because it had an invalid id.'); }
		if(typeof data !== 'object') { throw new Error('UnityJS: I couldn\'t parse a template because it had an invalid data object.'); }

		//set defaults and normalize
		if(typeof $parentNode === 'function') {
			mapCallback = $parentNode;
			$parentNode = false;
		}
		if(typeof $parentNode === "string") {
			$parentNode = $($parentNode);
		}

		//Create a callbacks object to store redraw callbacks
		var callbacks = [];

		//Create a empty default template
		var template = '';

		//find the template by id
		if(templates[templateId]) {
			template = templates[templateId];
		} else {
			template = $('#' + templateId).html();
		}

		//if there is no template for the given id then return false
		if(!template) { return false; }

		//create the view object
		var view = {
			"element": false,
			"redraw": draw,
			"onRedraw": registerOnDraw
		};

		//if the data object changes then redraw
		u.watch(data, draw);

		//call draw
		draw();



		/////////////
		// Methods //
		/////////////

		/**
		 * Draws/Redraws the view
		 */
		function draw() {

			//execute the map function if present
			if(mapCallback) { data = mapCallback(template, data); }

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

			//fire the callbacks
			for(var cI = 0; cI < callbacks.length; cI += 1) { callbacks[cI](); }
		}

		/**
		 * Binds a callback to fire on draw
		 */
		function registerOnDraw(callback) {
			if(typeof callback === 'function') { callbacks.push(callback); }
		}

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

			//pull in the
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
		"parser": parser,
		"create": createView,
		"fetchTemplate": fetchTemplate
	}
});