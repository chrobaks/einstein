/**
 * Created by Chrobak on 14.02.2016.
 */

function GameView (config) {

	this.view = config;

}

GameView.prototype.renderIconInfo = function (props) {

	props = props || {itemCat : '', itemName : ''};

	this.view.infoCat.addInnerHTML(props.itemCat);
	this.view.infoCatProp.addInnerHTML(props.itemName);

};

GameView.prototype.renderGameBtnGameStatus = function (gameStart) {

	var txt = (gameStart === true) ? "&gt;&gt; REFRESH &lt;&lt;" : "&gt;&gt; START &lt;&lt;";

	this.view.btnGameStatus.addInnerHTML('<div>' + txt + '</div>');

};

GameView.prototype.renderGameDescription = function (gameStart, gameResource) {

	var gameDescription = (gameStart === true) ? gameResource['tipps'] : gameResource['spielinfo'];
	var txt = '';

	for( var e in gameDescription){

		if( gameStart !== true) {

			txt += '<p><strong>' + gameDescription[e]['header'] + '</strong><br>' + gameDescription[e]['text'] + '</p>';

		} else {

			txt += '<p><strong>'+gameDescription[e]["header"]+'</strong><br><ul>' + gameDescription[e]['text'] + '</ul></p>';

		}

	}

	this.view.gameDescription.addInnerHTML(txt);

};

