define(['components/util'], function(u) {

	/**
	 * Creates a model
	 * @param modelDescriptor
	 */
	function createModel(modelDescriptor) {

		//normalize the model descriptor
		if(modelDescriptor) {
			var baseModelDescriptor = normalizeModelDescriptor(modelDescriptor);
			if(baseModelDescriptor === false) { throw new Error('The model descriptor is invalid.'); }
		}

		//DATA
		var records = [];

		/**
		 * Validates the model data
		 * @param data
		 */
		function validateRecord(modelDescriptor, data) {

			//if the model has no structure return true
			if(!data) { data = modelDescriptor; modelDescriptor = baseModelDescriptor; }

			//compare the model descriptor to the data object
			var valid = true;
			for(var key in modelDescriptor) {
				if(!modelDescriptor.hasOwnProperty(key)) { continue; }

				//extract the type descriptor
				var typeDescriptor = modelDescriptor[key];

				//get the data property type
				var type = typeof data[key];

				//make sure the type is in the type descriptor
				var validType = false;
				for(var i = 0; i < typeDescriptor.length; i += 1) {

					//if the type descriptor contains a sub model descriptor validate it
					if(typeof typeDescriptor[i] === 'object') {
						if(validateRecord(typeDescriptor[i], data[key])) { validType = true; }
					} else {
						if(type === typeDescriptor[i] || typeDescriptor[i] === "*") { validType = true; }
					}
				}

				if(!validType) { valid = false; }
			}

			//make sure no extra data has been passed
			for(var key in data) {
				if(!modelDescriptor.hasOwnProperty(key)) { return false; }
			}

			return valid;
		}

		/**
		 * Normalizes and validates a model descriptor
		 */
		function normalizeModelDescriptor(modelDescriptor) {

			//generate the allowed types object
			var typeDescriptor;
			for(var key in modelDescriptor) {
				if(!modelDescriptor.hasOwnProperty(key)) { continue; }

				//if the type descriptor is a string
				if(typeof modelDescriptor[key] === 'string') {
					typeDescriptor = modelDescriptor[key].replace(/\s/g, '').split(',');

				//if the type descriptor is an array
				} else if (typeof modelDescriptor[key] === 'object' && typeof modelDescriptor[key].push === 'function') {
					typeDescriptor = modelDescriptor[key];

					//handle sub descriptors
					for(var i = 0; i < typeDescriptor.length; i += 1) {
						if(typeDescriptor[i] === 'object') {
							typeDescriptor[i] = normalizeModelDescriptor(typeDescriptor[i]);
						}
					}

				//if the model descriptor is a sub descriptor
				} else if (typeof modelDescriptor[key] === 'object') {
					typeDescriptor = [normalizeModelDescriptor(modelDescriptor[key])];
				}

				//validate the type descriptors
				if(!validateTypeDescriptor(typeDescriptor)) { return false; }

				//save the normalized typeDescriptor
				modelDescriptor[key] = typeDescriptor;
			}

			return modelDescriptor;
		}

		/**
		 * Validates a type descriptor
		 * @param typeDescriptor
		 */
		function validateTypeDescriptor(typeDescriptor) {
			var allowedTypes = ['undefined', 'boolean', 'number', 'string'];
			
			for(var i = 0; i < typeDescriptor.length; i += 1) {
				var type = typeDescriptor[i];

				if(typeof type === 'object') { return true; }

				var validType = false;
				for(var ii = 0; ii < allowedTypes.length; ii += 1) {
					if(type === '*') { validType = true; break; }
					if(type === allowedTypes[ii]) { validType = true; }
				}
				if(!validType) { return false; }
			}

			return true;
		}

		/**
		 * adds a record to the model
		 * @param data
		 */
		function addRecord(data) {

			//if the data is an array then self execute on each item
			if(typeof data === 'object' && typeof data.push === 'function') {
				var addResults = [];
				for(var i = 0; i < data.length; i += 1) { addResults.push(addRecord(data[i])); }
				return addResults;
			}

			//make sure the data conforms to the model descriptor
			if(validateRecord(data)) {

				//push the data into the records array
				records.push(data);

				//return the index
				return records.indexOf(data);
			} else {
				return -1;
			}
		}
		
		/**
		 * Preforms a deep analysis on a record to see if it matches a query object
		 * @param queryObject
		 * @param data
		 */
		function compareAgainstQuery(queryObject, record) {
			for(var key in queryObject) {
				var property = record[key];
				var regex = queryObject[key];

				//in the case of loose models make sure the record has the property we're looking for
				if(typeof property === 'undefined') {
					matched = false;
					break;
				}

				//if the property is an object and so is the query regex
				if(typeof property === 'object' && typeof regex === 'object') {
					if(!compareAgainstQuery(regex, property)) { return false; }
				} else if(!property.match(regex)) { return false; }
			}

			return true;
		}

		function getRecordIndexes(queryObject) {
			if(typeof queryObject !== 'object') { return false; }
			var results = [];

			//loop through the records
			for(var i = 0; i < records.length; i += 1) {
				var record = records[i];

				//loop through the query keys
				if(compareAgainstQuery(queryObject, record)) {
					results.push(i);
				}
			}
			
			return results;
		}

		/**
		 * Finds a record or records matching a query object
		 * @param queryObject
		 */
		function getRecords(queryObject) {

			//USING INDEX
			if(typeof queryObject === 'number' && typeof records[queryObject] !== 'undefined') {
				return records[queryObject];
			}

			//USING PROPERTY SEARCH
			else if(typeof queryObject === 'object') {

				//Create an object to add matched records to
				var indexes = getRecordIndexes(queryObject);
				var matchedRecords = [];

				//fetch each record
				for(var i = 0; i < indexes.length; i += 1) {
					matchedRecords.push(records[indexes[i]]);
				}
				
				return matchedRecords;
			}

			//ALL RECORDS
			else if(!queryObject) {
				return records;
			}

			return [];
		}

		/**
		 * Deletes a record or records matching a query object
		 */
		function removeRecord(queryObject) {
			var indexes = getRecordIndexes(queryObject);

			//delete each record
			for(var i = 0; i < indexes.length; i += 1) {
				delete records[indexes[i]];
			}

			//return the deleted indexes
			return indexes;
		}

		/**
		 * Sets the sync url for REST or accepts a callback to handle syncing
		 * @param method
		 */
		function syncModel(method, updateInterval) {

			//Handle like a REST api
			if(typeof method === 'string') {
				syncREST(method, updateInterval);
			} else if(typeof method === 'function') {

				var timer = setInterval(function() {
					method();
				}, updateInterval);

				return {
					"clear": clear
				}

			}

			function clear() {
				if(timer) { clearInterval(timer); timer = false; }
			}
		}

		/**
		 * Sync the model via REST
		 * @param url
		 */
		function syncREST(url, updateInterval) {



		}

		//return the model api
		return {
			'add': addRecord,
			'remove': removeRecord,
			'get': getRecords,
			'getIndexes': getRecordIndexes,
			'validate': validateRecord,
			'sync': syncModel
		}
	}

	return {
		"create": createModel,
		"sync": function(){}
	}
});