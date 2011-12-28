define(['components/util', 'modules/debug'], function(u, debug){

	/**
	 * These are the default settings for UnityJS.
	 * Be careful when editing this, or you will
	 * break UnityJS.
	 */
	var config = {
		"baseUrl": "",
		"onError": onError,
		"merge": merge,
		"templates": false
	};

	/**
	 * Default on error
	 */
	function onError(err) {
		debug.error('<h1>UnityJS Error</h1><p>UnityJS: I\'m trying my best to render this application but its throwing the following error.</p><pre>' + err + '</pre>');
		throw err;
	}

	/**
	 * Allows the config to extend itself
	 * @param args
	 */
	function merge(args) {
		if(args.merge) { delete args.merge; }
		u.merge(config, args);
	}

	return config;

});