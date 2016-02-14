/**
 * Created by Chrobak on 11.02.2016.
 */
function GameController (Events, EventListener, gameResource) {

	this.View = null;

	this.Events = Events;
	this.EventListener = EventListener;

	this.gameResource = gameResource;
	this.gameStart = null;

	this.gameInfoFields = {

		gameDescription : null,
		infoCat : null,
		infoCatProp : null
	};

	this.icons = [];
	this.iconConfig = {
		itemPrefix : 'box',
		itemDir : 'items',
		boxLength : 25,
		boxWidth : 40,
		startPosX : 287,
		startPosY : 30,
		mousePosX : 0,
		mousePosY : 0,
		mousePosXL : 0,
		mousePosYL : 0,
		houseMinX : 50,
		houseMaxX : 711,
		houseMinY : 285,
		houseMaxY : 457,
		houseLeftStep : 139,
		actualId : null,
		actualX : null,
		actualY : null,
		lastZindex : 4,
		runDragDrop : false,
		categories : {
			"color"  : ["blau","weiss","rot","gruen","gelb"],
			"animal" : ["fisch","hund","vogel","pferd","katze"],
			"sport"  : ["ringen","rudern","fussball","laufen","turnen"],
			"flag"   : ["england","norwegen","daenemark","deutschland","italien"],
			"drink"  : ["kaffe","bier","wein","milch","wasser"]
		},
		domPropertyFilter : {
			'posX' : 'left',
			'posY' : 'top',
			'zIndex' : 'zIndex',
			'backgroundImage' : 'backgroundImage',
			'position' : 'position'
		},
		iconHousePositions : {
			"color"  : {posX:66,posY:360},
			"animal" : {posX:66,posY:403},
			"sport"  : {posX:110,posY:403},
			"drink"  : {posX:110,posY:360},
			"flag"   : {posX:149,posY:290}
		}
	};

	this.houses = [];
	this.houseIds = ['house1','house2','house3','house4','house5'];
	this.configHouse = {
		idPrefix : 'house',
		colorFilter : {
			'default' : {
				backgroundColor : "transparent",
				color : "#f8f8f8"
			},
			'blau' : {
				backgroundColor : "#0066FF",
				color : "#33CCFF"
			},
			'rot' : {
				backgroundColor : "#CC3333",
				color : "#FF6600"
			},
			'gruen' : {
				backgroundColor : "#00CC66",
				color : "#99FF00"
			},
			'gelb' : {
				backgroundColor : "#FFFF00",
				color : "#CCCC33"
			},
			'weiss' : {
				backgroundColor : "#ffffff",
				color : "#000000"
			}
		}
	};

}

GameController.prototype.init = function () {

	this.initHouses();
	this.initIcons();
	this.initGameInfoFields();
	this.initEvents();

	this.View = new GameView(this.gameInfoFields);

	this.setGameStatus();

};

GameController.prototype.initGameInfoFields = function () {

	this.gameInfoFields = {
		btnGameStatus : new GameModel('btnGameStatus', {} ),
		gameDescription : new GameModel('gameDescription', {} ),
		infoCat : new GameModel('infoCat', {} ),
		infoCatProp : new GameModel('infoCatProp', {} )
	};
};

GameController.prototype.initEvents = function () {

	var namespace = this;

	this.EventListener.callback('mouse_move', namespace, 'mousemove');
	this.EventListener.callback('icon_mouse_down', namespace, 'dragIcon');
	this.EventListener.callback('icon_mouse_up', namespace, 'dropIcon');
	this.EventListener.callback('game_status', namespace, 'setGameStatus');

	this.Events.onClick('btnGameStatus', 'game_status');

};

GameController.prototype.setGameStatus = function () {

	if ( this.gameStart === true) {

		this.resetGame();

	}

	this.gameStart = (this.gameStart === false);

	this.View.renderGameDescription(this.gameStart, this.gameResource);
	this.View.renderGameBtnGameStatus(this.gameStart);

};

GameController.prototype.resetGame = function () {

	for ( var iconId in this.icons) {

		this.resetIconPosition(iconId);

	}

};

GameController.prototype.initHouses = function () {

	var namespace = this;

	this.houseIds.forEach( function(id) {

		namespace['initHouseObjects'](id);

	});

};

GameController.prototype.initHouseObjects = function (id) {

	this.houses[id] = {
		model : new GameModel('', {} ),
		house : new GameModel(id, {
			'color':'color',
			'backgroundColor':'backgroundColor'
		} ),
		dachtop : new GameModel('dachtop' + id, {
			'backgroundImage':'backgroundImage'
		} ),
		dachcenter : new GameModel('dachcenter' + id, {
			'backgroundImage':'backgroundImage'
		} )
	};

	this.houses[id].model.property({
		color:null,
		colorName:'default',
		animal:null,
		animalName:null,
		sport:null,
		sportName:null,
		flag:null,
		flagName:null,
		drink:null,
		drinkName:null
	});

};

GameController.prototype.initIcons = function () {

	this.iconConfig.actualY = this.iconConfig.startPosY;
	this.iconConfig.actualX = this.iconConfig.startPosX;

	for (var category in this.iconConfig.categories) {

		this.initIconObjects(category, this.iconConfig.categories[category]);

		this.iconConfig.actualY = this.iconConfig.startPosY;
		this.iconConfig.actualX += (this.iconConfig.boxWidth + 4);

	}

	this.iconConfig.lastZindex -= 1;

};

GameController.prototype.initIconObjects = function (category, catProps) {

	for (var prop in catProps) {

		var id = this.iconConfig.itemPrefix + '_' + (this.iconConfig.lastZindex-4);

		this.icons[id] = new GameModel(id, this.iconConfig.domPropertyFilter );

		this.icons[id].property({
			backgroundImage : this.iconConfig.itemDir + '/icon_' + catProps[prop] + '.gif',
			itemCat : category,
			itemName : catProps[prop],
			houseId : null,
			position : 'absolute',
			posX : this.iconConfig.actualX,
			posY : this.iconConfig.actualY,
			posStartX : this.iconConfig.actualX,
			posStartY : this.iconConfig.actualY,
			zIndex : this.iconConfig.lastZindex
		});

		this.icons[id].addTitle(category + ' / ' + catProps[prop]);

		this.iconConfig.lastZindex++;
		this.iconConfig.actualY += (this.iconConfig.boxWidth + 4);

		this.Events.onMouseDown(id, 'icon_mouse_down');
		this.Events.onMouseUp(id, 'icon_mouse_up');

	}

};

GameController.prototype.mousemove = function (event) {

	this.iconConfig.mousePosX = event.clientX;
	this.iconConfig.mousePosY = event.clientY;

	if (this.iconConfig.runDragDrop) {

		this.changeIconPosition();

	}

};

GameController.prototype.dragIcon = function (obj) {

	var props = this.icons[obj.id].property('itemCat,itemName');
	this.iconConfig.actualId = obj.id;

	// prepare icon top/left, zIndex
	this.setIconPosSpace();
	this.changeIconZindex();

	if ( ! this.gameStart) {

		this.setGameStatus();

	}

	this.View.renderIconInfo(props);

	// allow mousemove
	this.iconConfig.runDragDrop = true;

};

GameController.prototype.dropIcon = function (obj) {

	// disable mousemove
	this.iconConfig.runDragDrop = false;

	if (this.checkIconPosition()) {

		this.setIconHousePosition();

	} else{

		this.resetIconPosition(this.iconConfig.actualId);

	}

	this.View.renderIconInfo();

};

GameController.prototype.changeIconZindex = function () {

	var actualItemZindex = this.icons[this.iconConfig.actualId].property('zIndex');

	for( var e in this.icons){

		if (this.icons[e].property('zIndex') === this.iconConfig.lastZindex){

			this.icons[e].property('zIndex', actualItemZindex );

			break;

		}
	}

	this.icons[this.iconConfig.actualId].property('zIndex', this.iconConfig.lastZindex );

};

GameController.prototype.changeIconPosition = function () {

	this.icons[this.iconConfig.actualId].property({
		posX : this.iconConfig.mousePosX-this.iconConfig.mousePosXL,
		posY : this.iconConfig.mousePosY-this.iconConfig.mousePosYL
	});

};

GameController.prototype.checkIconPosition = function () {

	var props = this.icons[this.iconConfig.actualId].property('posY,posX');
	var res = true;

	if (props.posY < this.iconConfig.houseMinY || props.posY > this.iconConfig.houseMaxY) {

		res = false;
	}

	if (props.posX < this.iconConfig.houseMinX || props.posX > this.iconConfig.houseMaxX) {

		res = false;
	}

	return res;

};

GameController.prototype.checkGameStatus = function () {

	var msg = 'game_success';
	var filterProps = ['colorName','animalName','sportName','flagName','drinkName'];
	var houseProps = {};

	var res = this.checkHousePropertyFilter(filterProps);


	if (res === true) {

		filterProps = filterProps.join(',');

		for(var houseId in this.houses) {

			houseProps = this.houses[houseId].model.property(filterProps);

			if ( ! this.checkGameResult(houseId, houseProps)) {

				msg = 'found_wrong';
				break;

			}
		}

		this.EventListener.notification('game_info', {data:this.gameResource.gameInfoText[msg]});

	}

	return res;

};


GameController.prototype.checkHousePropertyFilter = function (filterProps) {

	var res = true;

	for ( var houseid in this.houses) {

		var filterRes = this.houses[houseid].model.filterProperties(filterProps, false);

		if ( ! filterRes.actionOk) {

			res = false;
			break;

		}
	}

	return res;

};

GameController.prototype.checkGameResult = function (houseid, props) {

	var res = true;

	for ( var value in props) {

		if ( ! this.filterGameResult(houseid, props[value] )) {

			res = false;
			break;
		}
	}

	return res;

};

GameController.prototype.filterGameResult = function (houseid, needle) {

	var res = false;

	for ( var value in this.gameResource["quizResult"][houseid]) {

		if ( this.gameResource["quizResult"][houseid][value] === needle) {

			res = true;
			break;
		}
	}

	return res;

};

GameController.prototype.getIconNewHouseProperty  = function (props) {

	var result = {posX:0,posY:0,houseId:null};
	var c = 1;
	var leftstep = 0;
	var newpos = this.iconConfig.iconHousePositions[props.itemCat];

	while(c <= this.houseIds.length) {

		if ((this.iconConfig.houseMinX + ( this.iconConfig.houseLeftStep * c)) > props.posX) {

			if (c > 1) { leftstep = this.iconConfig.houseLeftStep * (c - 1); }

			if (props.houseId !== this.configHouse.idPrefix + c) {

				result.houseId = this.configHouse.idPrefix + c;

			}

			c = this.iconConfig.houselength + 1;

		} else {
			c++;
		}

	}

	result.posX = newpos.posX + leftstep;
	result.posY = newpos.posY;

	return result;

};

GameController.prototype.resetIconPosition = function (id) {

	var props = this.icons[id].property('posStartX,posStartY,houseId,itemCat');

	this.icons[id].property({
		posX : props.posStartX,
		posY : props.posStartY,
		houseId : null
	});

	if (props.houseId !== null) {

		this.setHouseProperty(props.houseId, null, props.itemCat);

	}
};

GameController.prototype.setHouseProperty = function (houseId, iconId, cat) {

	var iconItemName = (cat === 'color') ? 'default' : null;

	if (iconId !== null) {

		iconItemName = this.icons[iconId].property('itemName');

	}

	this.houses[houseId].model.property(cat, iconId);
	this.houses[houseId].model.property(cat + 'Name', iconItemName);

	if (cat === 'color') {

		this.setHouseColor(houseId, iconItemName);
	}
};

GameController.prototype.setHouseColor = function (houseId, color) {

	this.houses[houseId].house.property(this.configHouse.colorFilter[color]);
	this.houses[houseId].dachtop.property('backgroundImage', 'image/dachtop_' + color + '.gif');
	this.houses[houseId].dachcenter.property('backgroundImage', 'image/dachcenter_' + color + '.gif');

};

GameController.prototype.setIconPosSpace = function () {

	var props = this.icons[this.iconConfig.actualId].property('posY,posX');

	this.iconConfig.mousePosXL = this.iconConfig.mousePosX - props.posX;
	this.iconConfig.mousePosYL = this.iconConfig.mousePosY - props.posY;

};

GameController.prototype.setIconHousePosition  = function () {

	var icon = this.icons[this.iconConfig.actualId];
	var iconProp = icon.property('itemCat,houseId,posX');
	var iconNewProp = this.getIconNewHouseProperty(iconProp);

	// reset old house if exist
	if (iconProp.houseId !== null && iconNewProp.houseId !== null && iconProp.houseId !== iconNewProp.houseId) {

		this.setHouseProperty(iconProp.houseId, null, iconProp.itemCat);

	}

	// run if icon change house
	if (iconNewProp.houseId !== null) {

		var newHouseCatIconId = this.houses[iconNewProp.houseId].model.property(iconProp.itemCat);

		if (newHouseCatIconId !== this.iconConfig.actualId && newHouseCatIconId !== null) {

			this.resetIconPosition(newHouseCatIconId);

		}

		this.setHouseProperty(iconNewProp.houseId, this.iconConfig.actualId, iconProp.itemCat);

	} else {

		iconNewProp.houseId = iconProp.houseId;

	}

	// set icon new house property
	icon.property(iconNewProp);

	if (this.checkGameStatus()) {

		this.setGameStatus();

	}

};



