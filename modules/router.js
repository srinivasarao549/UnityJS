define(['modules/config'], function(config) {

	var routes = [];

	//bind to the hash change event
	$(window).bind('hashchange', followRoute);

	function followRoute() {

		//figure out the route to use
		if(!findRoute(location.hash.substring(1))) {
			location.hash = '/';
		}

	}

	function findRoute(targetUrl) {

		//if the has is not set then set it to root
		if(location.hash.length < 2) {
			location.hash = '/';
		}

		//get the page url
		var targetUris = urlToUris(targetUrl);
		var matchedRoute = false;
		var matchedDynamicUris = [];

		for(var rI = 0; rI < routes.length; rI += 1) {

			var route = routes[rI];
			var url = route.url;
			var uris = urlToUris(url);
			var dynamicUris = {};

			if(uris.length !== targetUris.length) { continue; }

			//check to see if the route uris match the target uris
			for(var tUI = 0; tUI < targetUris.length; tUI += 1) {

				//make sure the uri matches
				if(targetUris[tUI] !== uris[tUI] && uris[tUI].substring(0, 1) !== ':' && uris[tUI].substring(0, 1) !== '*') {
					route = false;
					break;
				}

				//if the uri is dynamic then save it to the dynamic uris array
				if(uris[tUI] && uris[tUI].substring(0, 1) === ':') {
					var key = uris[tUI].substring(1);
					dynamicUris[key] = targetUris[tUI];
				}
			}

			if(route) {
				matchedRoute = route;
				matchedDynamicUris = dynamicUris;
			}
		}

		//if there was a uri collision then continue
		if(matchedRoute) {

			//execute the routes callbacks
			for(var cI = 0; cI < matchedRoute.callbacks.length; cI += 1) {
				matchedRoute.callbacks[cI](matchedDynamicUris);
			}

			return true;
		}
		return false;
	}

	function urlToUris(url) {
		var rawUris = url.split('/');
		var uris = [];

		//loop through the uris
		for(var uI = 0; uI < rawUris.length; uI += 1) {
			if(rawUris[uI]) { uris.push(rawUris[uI]); }
		}

		return uris;
	}

	function urisToUrl(uris) {
		return uris.join('/');
	}

	function cleanUrl(url) {
		return urisToUrl(urlToUris(url));
	}

	function bindUrl(url, callback) {
		url = cleanUrl(url);

		//find a matching route
		var route = false;
		for(var rI = 0; rI < routes.length; rI += 1) {
			if(routes[rI].url === url) { route = routes[rI]; break; }
		}

		if(!route) {
			var route = {
				"url": url,
				"callbacks": [callback]
			};
			routes.push(route);
		} else {
			route.callbacks.push(callback);
		}

		function clear() {
			var cI = route.callbacks.indexOf(callback);
			if(cI) {
				route.callbacks.splice(cI, 1);
				return true;
			}
			if(!route.callbacks.length) {
				var rI = routes.indexof(route);
				routes.splice(rI, 1);
			}
			return false;
		}

		return {
			"clear": clear
		}
	}

	return {
		"bind": bindUrl,
		"update": followRoute
	}
});