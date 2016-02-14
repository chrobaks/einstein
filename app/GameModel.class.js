/**
 * Created by Chrobak on 11.02.2016.
 */

var GameModel = function (id, domPropertyFilter) {

	this.properties = {};
	this.domPropertyFilter = domPropertyFilter || {};

	this.domObj = (id !== '') ? document.getElementById(id) : null;

};

GameModel.prototype.addInnerHTML = function (content) {

	this.domObj.innerHTML = content;

};

GameModel.prototype.addTitle = function (title) {

	this.domObj.title = title;

};

GameModel.prototype.domObjStyle = function (prop, value) {

	if (prop === 'left' || prop === 'top') {

		value = value + 'px';

	}

	if (prop === 'backgroundImage') {

		value = 'url(' + value + ')';

	}

	this.domObj.style[prop] = value;
};

GameModel.prototype.property = function () {

	if (arguments.length) {

		if (arguments.length === 1 && typeof arguments[0] === 'string') {

			return this.findProperty(arguments[0]);

		} else if (arguments.length === 1 && typeof arguments[0] === 'object') {

			this.addProperty(arguments[0]);

		} else if (arguments.length === 2) {

			this.properties[arguments[0]] = arguments[1];

			if (this.domPropertyFilter.hasOwnProperty(arguments[0])) {

				this.domObjStyle(this.domPropertyFilter[arguments[0]],arguments[1]);

			}
		}
	}
};

GameModel.prototype.findProperty = function (prop) {

	if (prop.match(/,/g)) {

		prop = prop.split(',');

		var res = {};

		for ( var i = 0; i < prop.length; i++) {

			prop[i] = prop[i].replace(/\s/g,'');
			res[prop[i]] = this.properties[prop[i]] || null;

		}

		return res;

	} else {

		return this.properties[prop] || null;

	}

};

GameModel.prototype.filterProperties = function (props, getProps) {

	var res = {actionOk:true, props:{}};

	for ( var e in props) {

		if ( this.properties[props[e]] === null) {

			res.actionOk = false;
			res.prop = {};
			break;

		} else {

			if (getProps) {

				res.prop[props[e]] = this.properties[props[e]];

			}
		}
	}

	return res;

};

GameModel.prototype.addProperty = function (obj) {

	for ( var e in obj) {

		this.properties[e] = obj[e];

		if (this.domPropertyFilter.hasOwnProperty(e)) {

			this.domObjStyle(this.domPropertyFilter[e],obj[e]);

		}
	}
};
