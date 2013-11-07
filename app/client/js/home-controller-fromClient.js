
$('#beacon-events').on('submit', function(e) {
	e.preventDefault();
	var form = this;
	var desc = (form.description.value) ? form.description.value : 'My Event!';
	var lat, lng;

	if (tempMarker) {
		lat = tempMarker.position.lat();
		lng = tempMarker.position.lng();
	} else {
		lat = currentPosition.lat();
		lng = currentPosition.lng();
	}

	console.log(me);
	
	if (BKeeper.getBeacon(me.id)) {
		BKeeper.removeBeacon(me.id);
	}
	var B = BKeeper.newBeacon(me.id, desc, lat, lng);
	// console.log(B);
	socket.emit('newBeacon', {
		'host':B.host, 
		'lat':B.lat, 
		'lng':B.lng, 
		'desc':B.desc, 
		'attends':B.attends,
		'marker':null,
		'title':'',
	});
});


function joinBeacon(host) {
	// console.log('Clicked!');
	// console.log(host, me.id);
	if (host != me.id && !BKeeper.getBeacon(host).hasGuest(me.id)) {
		// BKeeper.addGuest(host, me.id);
		// console.log('Joining', host, me.id);
		socket.emit('joinBeacon', {'host':host, userId:me.id});
	}
}


function disbandBeacon(host) {
	socket.emit('deleteBeacon', {'host':host});
}

function leaveBeacon(host, guest) {
	socket.emit('leaveBeacon', {'host':host, 'guest':guest});
}