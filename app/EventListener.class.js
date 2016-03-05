/**
 * Created by Chrobak on 07.02.2016.
 */

function EventListener () {

	var events = [];



	function runCallbacks (watcherid, args) {

		var callbacks = events[watcherid].callbacks;

		for ( var i = 0; i < callbacks.length;i++) {

			var namespace = callbacks[i].namespace;
			var callback = callbacks[i].callback;

			namespace[callback](args);

		}
	}

	this.notification = function (watcherid, args) {

		if (events[watcherid].callbacks !== null && events[watcherid].callbacks.length ) {

			runCallbacks (watcherid, args);

		}
	};

	this.callback = function (watcherid, namespace, callback) {

		if ( events.hasOwnProperty(watcherid)) {

			events[watcherid].callbacks.push({
				namespace:namespace,
				callback:callback
			});


		} else {

			events[watcherid] = {
				callbacks:[
					{
						namespace:namespace,
						callback:callback
					}
				],
				args:null
			};

		}
	};

	return this;

}
