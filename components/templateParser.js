define(['lib/handlebars'], function (Handlebars) {

	var cache = {};

	//process
	function parse(source, data) {

		//compile and cache the template
		if(!cache[source]) { cache[source] = Handlebars.compile(source); }

		//parse the template
		return cache[source](data);
	}

	return parse;

});