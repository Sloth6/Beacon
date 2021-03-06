# onSms = require('./smsHandler.js');
models = require './models'
utils  = require './utilities'
output = require './output'
async = require 'async'
module.exports = (app, io, passport) ->
  output = require('./output')(io)
  loginOptions = 
    successRedirect: '/success'
    failureRedirect: '/fail'
    failureFlash: false

  app.get '/', (req, res) ->
    res.render 'index.jade', {}

  app.post('/login', passport.authenticate('local', loginOptions))
  
  app.get '/success', (req, res) ->
    res.send 200
  
  app.get '/fail', (req, res) ->
    res.send 401

  app.post '/join', (req, res) ->
    { key } = req.body
    models.invites.get {key}, (err, invite) ->
      return res.send 400 if err?
      eid = invite.eid
      async.series {
        accept: (cb) -> models.invites.accept invite, cb
        invited: (cb) -> models.events.getInviteList eid, cb
        guests : (cb) -> models.events.getGuestList eid, cb  
      }, (err, results) ->
        return res.send 400 if err?
        utils.log "Joined by sms", invite
        output.emit {
          eventName : 'updateGuests'
          recipients : results.invited
          data : { eid, guests: results.guests }
        }
        res.send 200

  app.post '/leave', (req, res) ->
    { key } = req.body
    models.invites.get {key}, (err, invite) ->
      return res.send 400 if err?
      eid = invite.eid
      async.series {
        unaccept: (cb) -> models.invites.unaccept invite, cb
        invited: (cb) -> models.events.getInviteList eid, cb
        guests : (cb) -> models.events.getGuestList eid, cb  
      }, (err, results) ->
        return res.send 400 if err?
        utils.log "Left by sms", invite
        output.emit {
          eventName : 'updateGuests'
          recipients : results.invited
          data : { eid, guests: results.guests }
        }
        res.send 200

  app.post '/registration', (req, res) ->
    utils.log 'On registration data', req.body
    { firstName, lastName, platform, phoneToken, pn } = req.body
    pn = utils.formatPn pn
    phoneToken = phoneToken || 'no phoneToken'
    if !firstName || !lastName || !platform || !pn
      return res.send 400, 'invalid body paramaters'
    
    name = "#{firstName} #{lastName}"
    models.users.isVerified {pn}, (err, isVerified) ->
      return res.send 400 if err?
      # checks if user does not exist
      if not isVerified?
        models.users.create pn, name, platform, phoneToken, done
      else
        console.log 'is Verified'
        #this tells us the user either failed to finish registering
        # or they are switching from sms
        models.users.reRegister pn, name, platform, phoneToken, done
        # models.users.setPlatform pn, platform, (err) ->
        #   return res.send 400 if err?
        #   models.users.newPassword {pn}, done
      
    done = (err, user, password) ->
      if err?
        utils.logError err
        return res.send 400 
      utils.log 'registration successful', 'password:'+password
      output.sendSms 'Your Fizz code:'+password, {pn, name, platform}
      res.send 200
  
  app.get '/e/:key', (req, res) ->
    key = req.params.key
    return res.send 404 if !key
    models.invites.get { key }, (err, { eid, uid, inviter, accepted }) ->
      return res.send 404 if err or not eid?
      models.users.get { uid }, (err, user) ->
        return res.send 404 if err?
        models.events.getFull eid, (err, event, messages, inviteList, guests) ->
          if err || !event
            return res.send 404
          guestList= inviteList.filter (user) -> guests.indexOf(user.uid) >= 0
          noReply  = inviteList.filter (user) -> guests.indexOf(user.uid) == -1
          creator  = inviteList.filter((user) -> user.uid == event.creator)[0]
          options = { user, accepted, event, creator, messages, noReply, guestList, key }
          res.render 'event.jade', options

  
  app.get '*', (req, res) -> res.render '404', { title: 'Page Not Found' }
