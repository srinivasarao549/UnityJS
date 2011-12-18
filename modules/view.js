define(['components/util', 'components/templateParser', 'components/loop'], function(u, templateParser, Loop) {

	//set the parser to the built in parser
	var parser = templateParser;

	//create the views loop
	var viewLoop = Loop(10);

	//start the loop
	viewLoop.start();

	function registerNewParser(templateParser) {
		if(typeof templateParser !== 'function') { throw new Error('UnityJS: It seams you tried to replace my template parser with an invalid function. No Dice sorry.'); }
		parser = templateParser;
	}

	function watch(data, onChange) {

		if(!typeof onChange === 'function') { throw new Error('UnityJS: I tried to watch a data object for changes but the application gave me a invalid function as a handler.'); }

		//create the mirror
		var mirror = {};
		u.mirror(data, mirror);

		//register a function to compare the object to its last state every cycle
		viewLoop.register(function(){

			//if the mirror doesn't match the data object then mirror it again and fire draw
			if(!u.compare(data, mirror)) {
				u.mirror(data, mirror);
				onChange();
			}
		});
	}

	function createView(id, data, wrappingTagName, callback) {

		if(typeof id !== 'string') { throw new Error('UnityJS: I couldn\'t parse a template because it had an invalid id.'); }
		if(typeof data !== 'object') { throw new Error('UnityJS: I couldn\'t parse a template because it had an invalid data object.'); }

		wrappingTagName = wrappingTagName || 'div';

		//get the template
		var template = $('#' + id).html();

		//if a template is not on the page then assume its a file url and try to require it
		if(template) {
			
		} else {
			$.ajax({
				"url": id,
				"type": "text/plain",
				"success": function(data) {

				},
				"error": function() {

				}
			});
		}

		if(!template) { throw new Error('UnityJS: I couldn\'t parse a template because it had no markup.') }


		function parse() {

		}

		//create the view object
		var view = {
			"element": $('<' + wrappingTagName + '><' + wrappingTagName + '>')
		};

		//bind watch to all of the properties of the data object
		watch(data, draw);

		//call draw for the first time
		draw();

		/**
		 * Updates the view
		 */
		function draw() {
			view.element.html(parser(template, data));
		}

		//return the view
		return view;

	}

	return {
		"create": createView
	}
});