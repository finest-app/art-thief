import { Miniflare, Log, LogLevel } from 'miniflare'

new Miniflare({
	modules: true,
	compatibilityDate: '2024-12-05',
	scriptPath: './dist/_worker.js',
	log: new Log(LogLevel.DEBUG),
})
