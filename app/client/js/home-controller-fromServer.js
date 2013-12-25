var SERVER = window.location.origin;

var BKeeper = new BeaconKeeper();
var  socket = io.connect(SERVER);

socket.on('newBeacon', function(data) { 
	console.log('NEW BEACON:', data);
	BKeeper.newBeacon(data.beacon);
});

socket.on('newBeacons', function(data) {
	console.log('BEACON UPLOAD:', data);
	data.forEach(function(B, i) {
		console.log('NEW BEACON:', B);
		BKeeper.newBeacon(B);
	});
});

socket.on('deleteBeacon', function(data) {
	console.log('DELETING BEACON:', data);
	BKeeper.removeBeacon(data.id);
});

socket.on('addGuest', function(data) {
	console.log('ADDING GUEST', data);
	var id = data.id;
	var guest = data.guest;
	BKeeper.addGuest(id, guest);
});

socket.on('removeGuest', function(data) {
	console.log('REMOVING GUEST', data);
	var id = data.id;
	var guest = data.guest;
	BKeeper.removeGuest(id, guest);
});

socket.on('newComment', function(data) {
	console.log('NEW COMMENT', data);
	var id = data.id;
	var user = data.comment.user;
	var comment = data.comment.comment;
	var commentID = data.comment.id;
	BKeeper.addComment(id, user, comment);
});

socket.on('updateTitle', function(data) {
	console.log('UPDATING TITLE', data);
	var id = data.id;
	var title = data.title;
	BKeeper.updateTitle(id, title);
});

socket.on('updateLocation', function(data) {
	console.log('UPDATING LOCATION', data);
	var id = data.id;
	var lat = data.lat;
	var lng = data.lng;
	BKeeper.updateLocation(id, lat, lng);
});




