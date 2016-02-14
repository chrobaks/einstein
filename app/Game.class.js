/**
 * Created by Chrobak on 12.02.2016.
 */
function Game () {

	this.Controller = null;
	this.Dialog = null;
	this.Events = null;
	this.EventListener = null;

}

Game.prototype.init = function (gameResource) {

	this.EventListener = new EventListener();
	this.Events = new GameEvents(this.EventListener);
	this.Controller = new GameController(this.Events, this.EventListener, gameResource);
	this.Dialog = new Dialog(this.Events, this.EventListener);

	this.Controller.init();
	this.Dialog.init();

};