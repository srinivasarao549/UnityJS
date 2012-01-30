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

		//make sure the unity base is set
		args.UnityUrl = args.UnityUrl || 'UnityJS/';

		//fetch require js
		if(typeof requirejs === 'undefined') {
			loadScript(args.UnityUrl + 'lib/require.js', function() {
				init();
			});
		} else {
			init();
		}

		/**
		 * Creates a Unity instance
		 */
		function init() {

			//set the base url
			require.config({
				"baseUrl": args.UnityUrl,
				"catchError": { "define": false }
			});

			//use the provided error handler
			require.onError = args.onError || function(error) {
				throw error;
			};

			//require unity's parts
			require(['modules/config', 'modules/router', 'modules/view', 'modules/model', 'modules/debug'], function(config, router, view, model, debug){

				//parse the config
				config.merge(args);

				//load templates
				if(config.templates) {
					view.fetchTemplate(config.templates, buildApi);
				} else {
					buildApi();
				}


				function buildApi() {

					//create the api object
					var API = {
						'config': config,
						'router': router,
						'view': view,
						'model': model,
						'debug': debug
					};

					if(config.debug) {

						//Pass the api to the callback
						callback(API);

					} else {

						//try running the application
						try {

							//Pass the api to the callback
							callback(API);

						} catch(error) {
							config.onError(error);
						}
					}
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