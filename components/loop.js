define(function() {

	/**
	 * Creates a new loop
	 * @param interval
	 */
	function createLoop(interval, maxCycleLoss) {
		maxCycleLoss = maxCycleLoss || 10;

		if(typeof interval !== 'number') {
			throw new Error('Loop interval must be defined as a number.');
		}

		var lastTime,
			cycles = 0,
			callbacks = [],
			cleared = false;

		function loop() {
			if(cleared) { cleared = false; return; }

			var now = Date.now();
			if(!lastTime) { lastTime = now }

			//compensate for cycle loss
			if(cycles < maxCycleLoss) { cycles += (now - lastTime) / interval; }
			for(var cycle = 0; cycle < Math.floor(cycles); cycle += 1) {
				exec(now);
				cycles -= 1;
			}

			lastTime = now;

			setTimeout(loop, interval);
		}

		function exec(now) {
			for(var i = 0; i < callbacks.length; i += 1) {
				callbacks[i](now);
			}
		}

		/**
		 * Registers a callback to run every cycle
		 * @param callback
		 */
		function register(callback) {
			if(typeof callback === 'function') { callbacks.push(callback); }
		}

		/**
		 * Removes a callback
		 * @param callback
		 */
		function remove(callback) {
			var i = callbacks.indexOf(callback);
			if(i > -1) { callbacks.splice(i, 1); }
		}

		function stop() {
			cleared = true;
		}

		return {
			'register': register,
			'remove': remove,
			'stop': stop,
			'start': loop
		}
	}

	return createLoop;
});