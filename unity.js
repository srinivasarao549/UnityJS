(function(context, factory){

	if(typeof define == 'function' && define.amd) {
		define(factory);
	} else {
		context.UnityJS = factory();
	}

})(this, function(){

	/**
	 * Creates a unity instance
	 * @param callback
	 */
	function Unity(args, callback){

		if(typeof config === 'function') {
			callback = args;
			args = {};
		}

		//fetch require js
		if(typeof requirejs === 'undefined') {
			console.log('UnityJS: I had to fetch require.js because it was missing and I need it to load my modules.');
			loadScript((args.baseUrl|| '') + 'lib/require.js', function() {
				init();
			});
		} else {
			init();
		}

		function init() {

			//set the base url
			require.config({
				"baseUrl": args.baseUrl || '',
				"deps": ['lib/jquery'],
				"catchError": { "define": false }
			});

			//use the provided error handler
			require.onError = args.onError || function(error) {
				throw error;
			};

			//require unity's parts
			require(['modules/config', 'modules/view', 'modules/model', 'modules/debug'], function(config, view, model, debug){

				//parse the config
				config.extend(args);

				//create the api object
				var API = {
					'config': config,
					'view': view,
					'model': model,
					'debug': debug
				};

				//try running the application
				try {

					//Pass the api to the callback
					callback(API);

				} catch(error) {
					config.onError(error);
				}
			});
		}
	}


	/**
	 * Loads a script
	 * @param callback
	 */
	function loadScript(url, callback) {

		//load script
		var script = document.createElement("script");
		script.src = url;
		script.async = true;
		(document.body || document.head).appendChild(script);

		//wait for the script to load
		script.onload = script.onreadystatechange = function() {

			//make sure the script has fully loaded (because IE uses peice o' shit onreadystatechange)
			if(typeof callback === 'function' && !script.readyState || /loaded|complete/.test(script.readyState)) {
				callback();
			}
		}
	}

	return Unity;
});