module.exports = {
	tester: {
		ips: process.env.IPS,
		iterations: process.env.ITERATIONS,
		memory: process.env.MEMORY
	},
	consumer: {
		correction: process.env.CORRECTION,
		startMode: process.env.STARTMODE,
		demo: process.env.DEMO
	}
}

