var moment = require("moment")
var sha1 = require('sha1')
var utils = require("../lib/utils.js")
var lo = require('lodash/array')

module.exports = function(config){
	var cfg = config

	var state = {
		last: 0,
		processed: 0,
		memory: {
			max: 0,
			used: 0
		},
		mode: config.startMode,
		exact: {
			storage: {},
			unitSize: 4,
			last: 0
		},
		approximated: {
			workspace: [],
			seeds: [],
			units: 0,
			groups: 0,
			minR: 0,
			unitSize: 4,
			last: 0
		}
	}

	this.canAllocate = function(size){
		return state.memory.used + size <= state.memory.max
	}

	function log(b, n){
		return Math.log(n) / Math.log(b)
	}

	this.fallback = function(){
		var uniques = this.uniques()
		state.exact.last = uniques;
		state.mode = "approximated"
		state.approximated.minR = Math.floor(log(2, uniques))
		if (!cfg.demo) delete state.exact.storage
		this.memory(state.memory.max)
	}

	this.consume = function(item){
		if (state.mode == "exact") {
			if (!state.exact.storage[item]) {
				if (this.canAllocate(state.exact.unitSize)) {
					state.exact.storage[item] = 1
					state.memory.used += state.exact.unitSize
				} else {
					this.fallback()
				}
			}
		}

		if (state.mode == "approximated") {		
			if (cfg.demo) state.exact.storage[item] = 1
			for (var k=1; k<=state.approximated.units; k++){
				var h = utils.hashToBits(item, state.approximated.seeds[k])
				var tz = utils.countTrailingZeroes(h)
				state.approximated.workspace[k] = Math.max(state.approximated.workspace[k], tz)
			}
		}
		state.processed += 1
		return this
	}

	this.exactUniques = function(){
		if (state.mode == "exact" || cfg.demo) return Object.keys(state.exact.storage).length
		throw("I don't know anymore this")
	}

	this.uniques = function(){
		if (state.mode == "exact") return exactUniques()
		if (!state.approximated.units) return 0
		var estimates = []
		for (var k=1;k<=state.approximated.units;k++){
			var r = state.approximated.workspace[k]
			estimates.push(Math.floor(Math.pow(2, r) * cfg.correction))
		}
		var chunks = lo.chunk(estimates, Math.ceil(estimates.length / state.approximated.groups))
		var total = 0
		for (var ch=0;ch<chunks.length;ch++)
			total += utils.median(estimates)
		return Math.max(state.exact.last, Math.floor(total/chunks.length))
	}

	this.accuracy = function(){
		return Math.round(this.uniques() / exactUniques(),4)
	}

	this.memory = function(maxMemory){
		if (maxMemory == null) return state.memory.used
		if (state.mode == "exact") {
			if (maxMemory < state.memory.used) fallback()
			else state.memory.max = maxMemory
		} else if (state.mode == "approximated") {
			var maxUnits = Math.min(Math.floor(maxMemory/state.approximated.unitSize), 500)
			if (maxUnits > state.approximated.units) {
				if (state.approximated.units > 0){
					state.approximated.minR = Math.floor(log(2, this.uniques()))-1
				}
				for (var k=1;k<maxUnits;k++){
					if (!state.approximated.workspace[k]) {
						state.approximated.workspace[k] = state.approximated.minR
						state.approximated.seeds[k] = Math.random()*10000
					}
				}
			} else {
				for (var k=maxUnits;k<state.approximated.units;k++) {
					delete state.approximated.workspace[k]
					delete state.approximated.seeds[k]
				}
			}
			state.approximated.units = maxUnits
			state.approximated.groups = Math.ceil(maxUnits / 10)
			state.memory.used = state.approximated.units * state.approximated.unitSize
			state.memory.max = maxMemory
			state.approximated.minR = Math.floor(log(2, this.uniques()))-1
		}
		return this
	}

	return this
}
