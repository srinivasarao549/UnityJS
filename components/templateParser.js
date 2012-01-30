define(['lib/handlebars'], function (Handlebars) {

	var cache = {};

	//process
	function parse(source, data) {

		//compile and cache the template
		if(!cache[source]) { cache[source] = Handlebars.compile(source); }

		//parse the template
		return cache[source](data);
	}

	//attach handlebars to the parse function
	parse.Handlebars = Handlebars;

	return parse;

});