var moment = require("moment")
module.exports = function(config){
	var cfg = config;

	this.init = function(){

	}

	this.create = function(key, x, timestamp){
		timestamp = timestamp || moment().unix()
		return {
			key: key,
			x: x,
			timestamp: timestamp
		}
	}
	return this;
}