/*
  Wrappers for push, sms and socket output
*/
var 
  utils    = require('./utilities.js'),
  log      = utils.log,
  logError = utils.logError,
  config   = require('./../../config.json'),
  exports  = module.exports,
  users    = require('./users.js'),
  async    = require('async'),
  apn      = require('apn');

////////////////////////////////////////////////////////////////////////////////
//        PUSH IOS
////////////////////////////////////////////////////////////////////////////////

var options = {
  key: __dirname + '/key.pem',
  cert: __dirname + '/cert.pem',
  "gateway": "gateway.sandbox.push.apple.com",
  'address':"gateway.sandbox.push.apple.com"
}
var apnConnection = new apn.Connection(options);
var options1 = {
    "batchFeedback": true,
    "interval": 300
}
var feedback = new apn.Feedback(options1);
feedback.on("feedback", function(devices) {
  console.log(devices);
    // devices.forEach(function(item) {
    //  console.log(item);
    //     // Do something with item.device and item.time;
    // });
});

exports.pushIos = function(msg, token, hoursToExpiration) {
  if(!msg || !token) return;

  var myDevice = new apn.Device(token);
  var note = new apn.Notification();
  note.expiry = Math.floor(Date.now() / 1000) + 3600*hoursToExpiration;
  note.badge = 3;
  note.sound = "ping.aiff";
  note.alert = "Beacon Data";
  note.payload = {'messageFrom': 'Beacon'};

  apnConnection.pushNotification(note, myDevice);
}

////////////////////////////////////////////////////////////////////////////////
// TWILIO
////////////////////////////////////////////////////////////////////////////////

var twilio = require('twilio');
var client = new twilio.RestClient(config.TWILIO.SID, config.TWILIO.TOKEN);


exports.sendSms = function(to, msg) {
  client.sms.messages.create({
    to:'+'+to,
    from:'+13476255694',
    body:msg
  },
  function(error, message) {
    if (!error) {
      log('sent sms to',to);
      // console.log('Success! The SID for this SMS message is:');
      // console.log(message.sid);
       
      // console.log('Message sent on:');
      // console.log(message.dateCreated);
    } else {
      console.log('Oops! There was an error.', error);
    }
  });
}

////////////////////////////////////////////////////////////////////////////////
// SOCK.IO
////////////////////////////////////////////////////////////////////////////////
/**
 * Emit from a certain person
 * @param {Number} userId
 * @param {String} eventName
 * @param {Object} Data
 */
var io;
// exports.emit = function(userId, eventName, data, message) {

exports.emit = function(options) {
  var 
    eventName  = options.eventName,
    data       = options.data,
    message    = options.message || null,
    recipients = options.recipients;

  // Deal with a circular dependency by delaying invocation.
  if(!io) io = require('../../app.js').io;
  // Requires.
  if(!eventName) return logError ('Invalid eventName in emit:', eventName);
  if(!data) return logError ('Invalid data in emit:', data);
  if(!recipients) return logError ('Invalid recipients in emit:', recipients);
  
  log(eventName, 'emitted to', recipients.length, data);
  async.each(recipients, function(friend, callback) {
    var fid = friend.uid || friend;
    users.isConnected(fid, function(err, isCon) {
      if (isCon) {
        io.sockets.in(fid).emit(eventName, data);
      } else if (friend.pn && message) {
          exports.sendSms(friend.phoneNumber, message);
      }
    });
  });

}
