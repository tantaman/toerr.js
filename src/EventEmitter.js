(function() {
function definition() {
	function _removeListenersNoTopic(events, cb, ctx) {
		if (!events) return;
		for (var k in events) {
			var callbacks = events[k];
			var len = callbacks.length;
			while (--len > -1) {
				var entry = callbacks[len];
				var match = !ctx || ctx == entry.context;
				if (match && (!cb || cb == entry.cb))
					callbacks.splice(len, 1);
			}
		}
	}

	var deferer;
	if (typeof(process) !== 'undefined' && typeof(process.nextTick) !== 'undefined') {
		deferer = function(cb, topic, args) {
			process.nextTick(function() { cb(topic, args); } );
		};
	} else {
		deferer = function(cb, topic, args) {
			setTimeout(function () {cb(topic, args);}, 0);
		};
	}

	function _listeners(type) {
		var events = this._events || (this._events = {});
    	return events[type] || (events[type] = []);
	}

	function _emit(topic, args) {
		if (!this._events) return;
		var subs = this._events[topic];
		if (!subs) return;
		
		var len = subs.length;
		for (var i = 0; i < len; ++i) {
			var sub = subs[len];
			try {
				sub.cb.apply(sub.context, args);
			} catch(e) {
				console.log(e.stack);
			}
		}
	}

	function _splice(args, start, end) {
		args = Array.prototype.slice.call(args);
		return args.splice(start, end);
	}

	function _indexOfSub(arr, cb, context) {
		for (var i = 0; i < arr.length; ++i) {
			if (arr[i].cb === cb && arr[i].context === context)
				return i;
		}
		
		return -1;
	}

	function EventEmitter() {
		if (!(this instanceof EventEmitter)) return new EventEmitter();	
	};

	EventEmitter.addTo = function(obj) {for (var k in EventEmitter.prototype) {obj[k] = EventEmitter.prototype[k];}};
	EventEmitter.events = EventEmitter.prototype = {
		/**
		Publish an event on the given topic
		*/
		emit: function(topic) {
			var args = arguments.length > 1 ? _splice(arguments, 1, arguments.length) : [];
			if (topic instanceof Array) {
				for (var i = 0; i < topic.length; ++i) {
					_emit.call(this, topic[i], args);
				}
			} else {
				_emit.call(this, topic, args);
			}
		},
		
		trigger: function() {
			this.emit.apply(this, arguments);
		},
		
		/**
		Publish an event on the given topic on the next iteration 
		through the event loop
		*/
		emitDeferred: function(topic) {
			var args = arguments.length > 1 ? _splice(arguments, 1, arguments.length) : [];
			_deferer(emit, topic, args);
		},

		/**
		Register a callback for the given topic.
		Optionally, a context may be provided.  The provided
		context will be used for the this argument to callback.
		*/
		on: function(topic, callback, context) {
			if (!callback)
				throw "Undefined callback provided";
			if (topic instanceof Array)
				topic = JSON.stringify(topic);
			
			var subs = _listeners.call(this, topic);
			var index = _indexOfSub.call(this, subs, callback, context);
			if (index < 0) {
				subs.push({cb: callback, context: context});
				index = subs.length - 1;
			}

			var self = this;
			return {dispose: function() {
				self.removeListener(topic, callback, context);
			}};
		},
		
		/**
		Register a callback that will be removed after
		its first notification
		*/
		once: function(topic, callback, context) {
			var holder = {sub: null};
			holder.sub = this.on(topic, function() {
				holder.sub.dispose();
				callback.apply(context, arguments);
			});
			
			return holder.sub;
		},
		
		getNumListeners: function(topic){
			var numListeners = 0;
			
			if (this._events && this._events[topic]){
				numListeners = this._events[topic].length;
			}
			
			return numListeners;
		},

		
		off: function(topic, callback, context) {
			if (topic == null) {
				_removeListenersNoTopic(this._events, callback, context);
				return;
			}

			var subs = _listeners.call(this, topic);
			
			var index = _indexOfSub.call(this, subs, callback, context);
			
		    if (0 <= index)
		      subs.splice(index, 1);
		    
		    if (subs.length == 0)
		    	delete this._events[topic];
		},
		
		removeAllListeners: function() {
			this._events = null;
		}
	};
	
	return EventEmitter;
};

if (typeof define !== 'undefined' && define.amd) {
	define(definition);
} else {
	this.EventEmitter = definition();
}
}).call(this, this);