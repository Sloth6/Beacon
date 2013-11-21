$(document).ready(function() {
	socket.emit('login', {'admin' : ''});
});

$('#publicBeacon').on('submit', function(e) {
	e.preventDefault();
	var form = this;
	var desc = form.title.value || 'My Event!';
	var host = form.host.value || 'admin'+Math.floor( Math.random() * 10000000);
	var lat, lng;

	if (tempMarker) {
		lat = tempMarker.position.lat();
		lng = tempMarker.position.lng();
	} else {
		lat = currentPosition.lat();
		lng = currentPosition.lng();
	}
	
	var B = BKeeper.newBeacon(host, desc, lat, lng, false, true);
	socket.emit('newBeacon', {
		'host':B.host, 
		'lat':B.lat, 
		'lng':B.lng, 
		'desc':B.desc, 
		'attends':B.attends,
		'marker':null,
		'title':'',
		'pub':true,
	});
});


function disbandBeacon(host, pub) {
	socket.emit('deleteBeacon', {'host':host, 'pub':pub});
}