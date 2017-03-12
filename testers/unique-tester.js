var moment = require("moment")
var Consumer = require("../consumers/elastic-consumer.js")
var Factory = require("../factories/item_factory.js")
var ProgressBar = require('progress')
var config = require("../config.js")
var utils = require("../lib/utils.js")
var colors = require("colors/safe")
var defaultsDeep = require('lodash.defaultsdeep')

var defaultConfig = {
	tester: {
		ips: 256,
		keys: 150,
		iterations: 100000
	},
	consumer: {
		correction: 1
	}
}

config = defaultsDeep(config,defaultConfig)
var consumer = Consumer(config.consumer)
var factory = Factory(config.factory)

consumer.memory(config.tester.memory)

var allips = []
for (var i=0;i<config.tester.iterations; i++){
	//if (i % 25000 == 0) consumer.memory(2000 - i/100)
	var chooseAnother = utils.getRandomInt(1, 100) > 90
	if (chooseAnother || !allips.length) {
		ip = config.tester.ips > 1 ? utils.getRandomInt(1, config.tester.ips) : 1
	} else {
		var repeatThis = utils.getRandomInt(1, allips.length)
		ip = allips[repeatThis-1]
	}	

	if (allips.indexOf(ip) < 0) allips.push(ip)
	consumer.consume(ip)

}