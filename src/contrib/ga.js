(function() {
	function ToGa(options) {

	}

	ToGa.prototype = {
		receive: function() {

		}
	};

	var ga = {
		initialize: function(topic, toerr, options) {
			var gaHandler = new ToGa(options);
			toerr.subscribe(topic, gaHandler.receive, gaHandler);
		}
	};
})();