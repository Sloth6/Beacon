appDir = '../..'
dev = require('./args.js').dev

if dev
	module.exports = require(appDir+'/configDev.json')
else
	module.exports = require(appDir+'/config.json')
