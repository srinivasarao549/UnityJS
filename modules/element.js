define(['modules/util', 'modules/templateParser', 'modules/loop'], function(u, templateParser, Loop) {

	//set the parser to the built in parser
	var parser = templateParser;

	//create the elements loop
	var elementLoop = Loop(10);

	//start the loop
	elementLoop.start();

	function registerNewParser(templateParser) {
		if(typeof templateParser !== 'function') { throw new Error('UnityJS: It seams you tried to replace my template parser with an invalid function. No Dice sorry.'); }
		parser = templateParser;
	}

	function createElement(id, data, wrappingTagName) {

		if(typeof id !== 'string') { throw new Error('UnityJS: I couldn\'t parse a template because it had an invalid id.'); }
		if(typeof data !== 'object') { throw new Error('UnityJS: I couldn\'t parse a template because it had an invalid data object.'); }

		wrappingTagName = wrappingTagName || 'div';

		//get the template
		var template = $('#' + id).html();

		if(!template) { throw new Error('UnityJS: I couldn\'t parse a template because it had no markup.') }

		//create the element object
		var element = {
			"element": $('<' + wrappingTagName + '><' + wrappingTagName + '>')
		};

		//bind watch to all of the properties of the data object
		watch(data, draw);

		//call draw for the first time
		draw();

		/**
		 * Updates the element
		 */
		function draw() {
			element.element.html(parser(template, data));
		}

		//return the element
		return element;

	}

	return {
		"create": createElement
	}
});