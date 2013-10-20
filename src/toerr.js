(function() {
function definition(EventEmitter) {
	var toerr = {
		report: function(error, topic, options) {
			
		}
	};

	EventEmitter.addTo(toerr);

	return toerr;
}

if (typeof define == 'function' && define.amd) {
	define(['EventEmitter'], definition);
} else {
	toerr = definition();
}
}).call(this, this);