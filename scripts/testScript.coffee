utils = require './../app/server/utilities'
async     = require('async')
db     = require('./../app/server/adapters/db.js')
models = require './../app/server/models'
dir = './../app/server/socketHandlers/'

types = require '../app/server/fizzTypes'
check = require 'easy-types'
check.prototype.addTypes(types)
# check.addTypes(types)

postNewEvent   = require dir+'postNewEvent'
postJoinEvent  = require dir+'postJoinEvent'
postLeaveEvent = require dir+'postLeaveEvent'
postNewInvites = require dir+'postNewInvites'
postNewMessage = require dir+'postNewMessage'
connect        = require dir+'connect'
disconnect     = require dir+'disconnect'
postUpdateEvent = require dir+'postUpdateEvent'
postUpdateLocation = require dir+'postUpdateLocation'
postRequestEvents  = require dir+'postRequestEvents'
postDeleteEvent = require dir+'postDeleteEvent'

makeSocket = (user) ->
  {
    join : ()->
    handshake:
      user: user
    emit : () ->
      utils.log 'Emitting '+ arguments[0], ' data :'+JSON.stringify arguments[1]
      # console.log.apply null, arguments
  }

async.series [
  (cb) -> db.query "truncate table users, events, messages, invites", cb
  (cb) -> models.users.create "+13475346100", "Joel Simon", "ios", "PHONETOKEN", cb
  (cb) -> models.users.create "+13107102956", "Andrew Sweet", "sms", "PHONETOKEN", cb
  (cb) -> models.users.create "+19494647070", "Antonio Ono", "sms", "PHONETOKEN", cb
  (cb) -> models.users.create "+3523189733", "Russell Cullen", "sms", "PHONETOKEN", cb
 ], (err, results) ->

  return console.log("Error in creating users:", err) if err?
  
  [_,[joel,_ ], [andrew, _], [antonio, _],[russell,_]] = results

  randomPerson =
    name: 'random'
    pn: '+13475346100'

  joelSocket = makeSocket joel
  andrewSocket = makeSocket andrew

  async.series [ #create events
    (cb) -> postNewEvent { description: "JoelEvent1" }, joelSocket, cb
    # (cb) -> postNewEvent { description: "AndrewsEvent1" }, andrewSocket, cb
    ], (err, results) ->
      return console.log("Error in creating events:", err) if err?
      [e1, e2] = results;
      async.series [
        # (cb) -> postRequestEvents {eid: e1.eid}, joelSocket, cb
        #invite andrew to events
        (cb) -> postNewInvites {eid: e1.eid, inviteList: [andrew, antonio, russell] }, joelSocket, cb
        # (cb) -> postNewInvites {eid: e2.eid, inviteList: [antonio, joel] }, andrewSocket, cb

        #andrew messages event
        # (cb) -> postNewMessage { eid: e1.eid, text: "andrew says hi" }, andrewSocket, cb
        # (cb) -> postNewMessage { eid: e1.eid, text: "joel says hi" }, joelSocket, cb

        # (cb) -> models.events.delete(e2.eid, cb)

        # (cb) -> connect joelSocket, cb

        # (cb) -> postJoinEvent {eid: e1.eid}, andrewSocket, cb
        # (cb) -> postLeaveEvent {eid: e1.eid}, andrewSocket, cb
        
        # (cb) -> postUpdateEvent {eid: e1.eid, description: 'Test Event'}, andrewSocket, cb
        # (cb) -> postUpdateEvent {eid: e2.eid, description: 'Test Event'}, andrewSocket, cb

        # (cb) -> postDeleteEvent { eid: e1.eid }, andrewSocket, cb
        # (cb) -> postDeleteEvent { eid: e2.eid }, andrewSocket, cb

      ], (err, results) ->
        if (err)
          console.log "ERR:", err if err
          # process.exit(1)
        else
          console.log "All Done"
          # process.exit(0)