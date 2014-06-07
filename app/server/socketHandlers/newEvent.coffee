events = require './../events'
async  = require 'async'
SocketHandler = require './SocketHandler'
utils     = require('./../utilities.js')
logError = utils.logError
getUserSession = utils.getUserSession

module.exports = (data, socket, cb) ->
    user       = getUserSession(socket)
    text       = data.text;
    console.log "NEW EVENT CALLED. Text: #{text}"
    events.add user, text, (err, eid) =>
      return logError(err) if err
      async.parallel {
        event: (cb) -> events.get(eid, cb)
        messages: (cb) -> events.getMoreMessages(eid, 0, cb)
      },
      (err, result) ->
        messages = result.messages;
        evnt = result.event;
        data = {};
        data[eid] = [{
          eid : evnt.eid
          creator : user.uid
          creationTime : evnt.creationTime
          messages : messages
          invites : [user]
          guests : [user.uid]
          clusters : []
        }]
        console.log('Emitting from newEvent:', JSON.stringify(data))
        if cb
          cb err, eid
        if (socket.emit)
          socket.emit 'newEvents', data