(function() {
function definition(EventEmitter) {
	var toerr = {};
	EventEmitter.addTo(toerr);
	toerr.report = toerror.emit;
	return toerr;
}

if (typeof define == 'function' && define.amd) {
	define(['EventEmitter'], definition);
} else {
	toerr = definition();
}
}).call(this, this);