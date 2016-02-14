/**
 * Created by Chrobak on 09.02.2016.
 */

function Dialog (Events, EventListener) {

	this.domObject = {
		wrapper : null,
		info : null
	};

	this.Events = Events;
	this.EventListener = EventListener;
	this.isOpen = false;

}

Dialog.prototype.init = function () {

	this.domObject.wrapper = new GameModel('infobox', {'display':'display'} );
	this.domObject.info = new GameModel('info', {'display':'display'} );

	this.setEventWatcher();
	this.setDomEvent();

};

Dialog.prototype.render = function (obj) {

	if (obj.hasOwnProperty('data')) {

		var content = '<div>' + obj.data + '</div>';


		this.domObject.info.addInnerHTML(content);

		if ( ! this.isOpen) {

			this.display();

		}

	}
};

Dialog.prototype.display = function () {

	var show = ( ! this.isOpen) ? 'block' : 'none';

	this.domObject.wrapper.property('display',show);
	this.domObject.info.property('display',show);

	this.isOpen = (show === 'block');

};

Dialog.prototype.setEventWatcher = function () {

	var namespace = this;

	this.EventListener.callback('game_info', namespace, 'render' );
	this.EventListener.callback('dialog_display', namespace, 'display' );

};

Dialog.prototype.setDomEvent = function () {

	this.Events.onClick('btnInfoCtrl', 'dialog_display');

};