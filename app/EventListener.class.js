/**
 * Created by Chrobak on 07.02.2016.
 */

function EventListener () {

	var events = new Array();

	this.notification = function (watcherid, args) {

		if ( events.hasOwnProperty(watcherid)) {

			events[watcherid].args = args;

		} else {

			events[watcherid] = {namespace:null, callback:null, args:args};

		}

		if (events[watcherid].namespace !== null && events[watcherid].callback !== null) {

			events[watcherid].namespace[events[watcherid].callback](args);

		}
	};

	this.callback = function (watcherid, namespace, callback) {

		if ( events.hasOwnProperty(watcherid)) {

			events[watcherid].namespace = namespace;
			events[watcherid].callback = callback;

		} else {

			events[watcherid] = {namespace:namespace, callback:callback, args:null};

		}
	};

	return this;

}
