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

				//copy the property
				if(typeof object[key] === 'object') {
					merged[key] = clone(object[key]);
				} else {
					merged[key] = object[key];
				}
			}
		}

		return merged;
	}

	/**
	 * Clones an object
	 * @param object
	 */
	function clone(object) {
		if(typeof object !== 'object') { return false; }

		//create the empty clone
		var cloned = typeof object.push === 'function' && [] || {};

		//loop through the object's properties
		for(var key in object) {

			//the property must not be from a prototype
			if(!object.hasOwnProperty(key)) { continue; }

			//clone sub objects
			if(typeof object[key] === 'object') {
				cloned[key] = clone(object[key]);
			} else {
				cloned[key] = object[key];
			}
		}

		return cloned;
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
	 * Takes a subject object and merges the secondary object into it.
	 * @param subjectObject
	 * @param secondaryObject
	 */
	function merge(subjectObject, secondaryObject) {

		//make sure both are objects
		if(typeof secondaryObject !== 'object' || typeof subjectObject !== 'object') { throw new Error('UnityJS: I can\'t mirror a variable because ether the mirror or the object are different types.'); }

		//copy over missing properties to the mirror
		for(var key in secondaryObject) {

			if(!secondaryObject.hasOwnProperty(key)) { continue; }

			//if the property is an object
			if(typeof secondaryObject[key] === 'object') {

				//if the subject has no object at the same key then create it
				if(typeof subjectObject[key] !== 'object') {
					if(typeof secondaryObject[key].push === 'function') {
						subjectObject[key] = [];
					} else {
						subjectObject[key] = {};
					}
				}

				//merge the sub objects
				merge(subjectObject[key], secondaryObject[key]);

			} else {
				subjectObject[key] = secondaryObject[key];
			}
		}
	}

	function reduce(subjectObject, modelObject) {

		if(typeof subjectObject !== 'object' || typeof modelObject !== 'object') {
			throw new Error("UnityJS: While trying to reduce an object I realized that the application passed me a non object. Both the subject object and the model object must be real objects for me to preform a reduce.");
		}

		//if the subject is an array
		if(typeof subjectObject.push === 'function') {
			var length = subjectObject.length;
			for(var sI = 0; sI < length; sI += 1) {

				if(typeof subjectObject[sI] === 'object' && typeof modelObject[sI] === 'object') {
					reduce(subjectObject[sI], modelObject[sI]);
				} else {
					//check to see if the model has the same value
					if(typeof modelObject[sI] === "undefined") {
						subjectObject.splice(sI, 1);
					}
				}
			}
		} else {
			//loop through the model
			for(var key in subjectObject) {
				if(subjectObject.hasOwnProperty(key)) { continue; }

				if(typeof subjectObject[key] === 'object' && typeof modelObject[key] === 'object') {
					reduce(subjectObject[key], modelObject[key]);
				} else {

					//check to see if the model has the same value
					if(modelObject[key] !== subjectObject[key]) {
						delete subjectObject[key];
					}
				}

			}
		}
	}

	/**
	 * Takes a model object and a mirror that will assume the models structure and values. This method is similar
	 * to clone accept it mutates the mirror object to resemble the model instead of producing a replacement.
	 * @param subjectObject
	 * @param modelObject
	 */
	function mirror(subjectObject, modelObject) {

		//merge the model into the subject
		merge(subjectObject, modelObject);

		//delete properties from the subject the model does not have
		reduce(subjectObject, modelObject);
	}

	/**
	 * Creates an execution counter object
	 * @param limit
	 * @param callback
	 */
	function callCounter(limit, callback) {
		var i = 0;

		return function() {
			if(i < limit - 1) {
				i += 1;
			} else if(typeof callback === 'function') {
				callback();
			}
		}
	}

	return {
		"extend": extend,
		"clone": clone,
		"compare": compare,
		"merge": merge,
		"mirror": mirror,
		"callCounter": callCounter
	}
});