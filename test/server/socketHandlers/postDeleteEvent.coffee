# should = require('should')
# assert = require('assert')
# request = require('supertest')
# async = require('async')
# # winston = require('winston')
# init = require('../../../scripts/serverInit')
# root = '../../../app/server/'
# db = require(root+'adapters/db.js')

# socketURL = 'http://localhost:9001';

# createUser = (cb) ->
#   platform = if Math.random() < .5 then 'ios' else 'android'
#   token = 'noToken'
#   pn = (''+Math.random()).slice 2,12
#   name = 'Mr Fake'
#   models.users.create pn, name, platform, token, cb

# describe 'postDeleteEvent', ()->
#   url = 'http://localhost:9001'
#   before (done) ->
#     init done

#   describe 'deletes the event', () ->
#     beforeEach (done) ->

#       # db.query "truncate table users cascade", done

#     describe 'Should return error on missing body params', () ->
#       beforeEach () ->
#         this.cloned = JSON.parse(JSON.stringify(body))
#       it 'checks for no firstName', (done) ->        
#         delete @cloned.firstName
#         request(url).post(path).send(@cloned).expect(400).end(done)
#       it 'checks for no lastName', (done) ->        
#         delete @cloned.lastName
#         request(url).post(path).send(@cloned).expect(400).end(done)
#       it 'checks for no platform', (done) ->        
#         delete @cloned.platform
#         request(url).post(path).send(@cloned).expect(400).end(done)

#     describe 'Should register a user with valid input', () ->
#       it 'registers with no error', (done) ->
#         request(url).post(path).send(body).expect(200).end(done)
#       describe 'creates user in database', () ->
#         before (done) ->
#           query = "SELECT * FROM users WHERE pn = $1"
#           db.query query, [body.pn], (err, results) =>
#             return done err if err?
#             @user = results.rows[0] 
#             done null
#         it 'has the correct name', () ->
#           (@user.name).should.equal(body.firstName+' '+body.lastName)
#         it 'has the correct pn', () ->
#           (@user.pn).should.equal(body.pn)
#         it 'has the correct platform', () ->
#           (@user.platform).should.equal(body.platform)
#         it 'has the correct token', () ->
#           (@user.phone_token).should.equal(body.phoneToken)
  
#     it 'Should return error on duplicates', (done) ->
#       request(url).post(path).send(body).expect(200).end ()-> 
#         request(url).post(path).send(body).expect(400).end(done)

#   describe 'Login', ()->
#     path = '/login'
#     before (done) =>
#       body =
#         firstName: 'Joel',
#         lastName: 'Simon',
#         platform: 'ios',
#         pn: '+13475346100',
#         phoneToken: 'myToken'
#       request(url).post('/registration').send(body).expect(200).end (err) =>
#         return done err if err?
#         db.query "SELECT * FROM users LIMIT 1", [], (err, results) =>
#           return done err if err?
#           @user = results.rows[0]
#           done null

#     it 'asdas', (done) =>
#       body = 
#         pn : @user.pn
#         phoneToken : @user.phoneToken
#         password : @user.password
#         appVersion : "0.0.0"
#       request(url).post(path).send(body).expect(200).end (err, res)-> 
#         return done err if err?
#         socket = require('socket.io-client')('http://localhost:9001')
#         socket.on 'connect', (data) ->
#           console.log 'conect', data
#           done err

#           # client1.emit('connection name', chatUser1);
#         