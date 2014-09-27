async     = require 'async'
utils     = require './../utilities.js'
models    = require './../models'

module.exports = (data, socket, output, callback) ->
  eventName = 'completeEvent'
  user = utils.getUserSession socket
  utils.log 'Recieved '+eventName, "User:"+ JSON.stringify(user), "Data:"+ JSON.stringify(data)
  eid  = data.eid

  models.events.delete eid, (err) ->
    return callback err if err?
    models.events.getInviteList eid, (err, recipients) ->
      return callback err if err?
      output.emit { eventName, recipients, data: { eid } }
      callback null