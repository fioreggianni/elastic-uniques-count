module.exports = {
	tester: {
		ips: process.env.IPS,
		iterations: process.env.ITERATIONS,
		memory: process.env.MEMORY
	},
	consumer: {
		correction: process.env.CORRECTION,
		startMode: process.env.STARTMODE
	},
	factory: {
		
	},
	producer: {
		batchmax: process.env.BATCHMAX,
		batchrate: process.env.BATCHRATE
	}
}

