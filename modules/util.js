define(function() {

	/**
	 * Merges any number of passed objects into a single object.
	 * If any objects passed are arrays the merged object will be
	 * an array too.
	 */
	function extend() {

		//grab the args
		var args = Array.prototype.slice.call(arguments);

		//look for arrays
		var merged = {};
		for(var aI = 0; aI < args.length; aI += 1) {
			var object = args[aI];

			//if we find an array then the merged object will be an array
			if(typeof object.push === 'function') {
				merged = [];
				break;
			}
		}

		//add the data to the merged object
		for(var aI = 0; aI < args.length; aI += 1) {
			var object = args[aI];

			if(typeof object !== 'object') { continue; }

			//loop through the object's properties
			for(var key in object) {

				//the property must not be from a prototype
				if(!object.hasOwnProperty(key)) { continue; }

				//save the property to the merged object
				merged[key] = object[key];
			}
		}

		return merged;
	}

	/**
	 * Compares to variables or objects and returns true if they are the same. if they are not it will return false
	 * @param a
	 * @param b
	 */
	function compare(a, b) {

		//compare if both a and b are strings or numbers
		if(typeof a === typeof b) {
			if(typeof a === 'string' || typeof a === 'number')  {
				return a === b;
			}

		//if the types are different return false
		} else {
			return false;
		}

		//we fell through so we know we are now comparing two objects

		//redraw bool
		var equivalent = true;

		//check for additions or modifications
		for(var key in a) {
			if(!a.hasOwnProperty(key)) { continue; }
			if(!compare(a[key], b[key])) {
				equivalent = false;
			}
		}

		//check for deletions
		for(var key in b) {
			if(!b.hasOwnProperty(key)) { continue; }
			if(!compare(a[key], b[key])) {
				equivalent = false;
			}
		}

		return equivalent;
	}

	/**
	 * Takes a model object and a mirror that will assume the models structure and values. This method is similar
	 * to clone accept it mutates the mirror object to resemble the model instead of producing a replacement.
	 * @param modelObject
	 * @param mirrorObject
	 */
	function mirror(modelObject, mirrorObject) {

		//make sure both are objects
		if(typeof mirrorObject !== 'object' || typeof modelObject !== 'object') { throw new Error('UnityJS: I can\'t mirror a variable because ether the mirror or the object are different types.'); }

		//copy over missing properties to the mirror
		for(var key in modelObject) {

			if(!modelObject.hasOwnProperty(key)) { continue; }

			//if the property is an object
			if(typeof modelObject[key] === 'object') {

				//if the mirror has no object at the same key then create it
				if(typeof mirrorObject[key] !== 'object') {
					if(typeof modelObject[key].push === 'function') {
						mirrorObject[key] = [];
					} else {
						mirrorObject[key] = {};
					}
				}

				//mirror the objects
				mirror(modelObject[key], mirrorObject[key]);

			} else {
				mirrorObject[key] = modelObject[key];
			}
		}

		//delete properties the object does not have
		for(var key in mirrorObject) {
			if(!mirrorObject.hasOwnProperty(key)) { continue; }
			if(!modelObject.hasOwnProperty(key)) { delete mirrorObject[key]; }
		}
	}

	return {
		"extend": extend,
		"compare": compare,
		"mirror": mirror
	}
});