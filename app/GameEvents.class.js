/**
 * Created by Chrobak on 12.02.2016.
 */

function GameEvents (EventListener) {

	this.onMouseDown = function (id, callback) {
		document.getElementById(id).onmousedown = function () {

			EventListener.notification(callback, this);

		};
	};

	this.onMouseUp = function (id, callback) {
		document.getElementById(id).onmouseup = function () {

			EventListener.notification(callback, this);

		};
	};

	this.onClick = function (id, callback) {
		document.getElementById(id).onclick = function () {

			EventListener.notification(callback, this);

		};
	};

	document.onmousemove = function (event) {

		event = event || window.event;

		EventListener.notification('mouse_move', event);

	};

	return this;
}
