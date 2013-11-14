'use strict'; // PRO JS MODE HARDCORE-ish



// socket.on('news', function (data) {
//   console.log('data:', data);
// });



window.fbAsyncInit = function() {
	if (window.location.origin.match('localhost')) var id = '1413129718920861'
	else var id = '202764579903268'
	FB.init({
		appId      : id, // App ID
		channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel File
		status     : true, // check login status
		cookie     : true, // enable cookies to allow the server to access the session
		xfbml      : true  // parse XFBML
	});

	// Here we subscribe to the auth.authResponseChange JavaScript event. This event is fired
	// for any authentication related change, such as login, logout or session refresh. This means that
	// whenever someone who was previously logged out tries to log in again, the correct case below 
	// will be handled. 
	FB.Event.subscribe('auth.authResponseChange', function(response) {
		// Here we specify what we do with the response anytime this event occurs. 
		if (response.status === 'connected') {
			// The response object is returned with a status field that lets the app know the current
			// login status of the person. In this case, we're handling the situation where they 
			// have logged in to the app.
			// console.log('logged in!', response);
			login();
		} else if (response.status === 'not_authorized') {
			// In this case, the person is logged into Facebook, but not into the app, so we call
			// FB.login() to prompt them to do so. 
			// In real-life usage, you wouldn't want to immediately prompt someone to login 
			// like this, for two reasons:
			// (1) JavaScript created popup windows are blocked by most browsers unless they 
			// result from direct interaction from people using the app (such as a mouse click)
			// (2) it is a bad experience to be continually prompted to login upon page load.
			 FB.login(function(response) {
			 // handle the response
			 }, {scope: 'email,user_likes'});
		} else {
			// In this case, the person is not logged into Facebook, so we call the login() 
			// function to prompt them to do so. Note that at this stage there is no indication
			// of whether they are logged into the app. If they aren't then they'll see the Login
			// dialog right after they log in to Facebook. 
			// The same caveats as above apply to the FB.login() call here.
			 FB.login(function(response) {
			 // handle the response
			 }, {scope: 'email,user_likes'});
		}
	});
};

// Load the SDK asynchronously
(function(d){
	 var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	 if (d.getElementById(id)) {return;}
	 js = d.createElement('script'); js.id = id; js.async = true;
	 js.src = "http://connect.facebook.net/en_US/all.js";
	 ref.parentNode.insertBefore(js, ref);
}(document));


function login() {
	// console.log('Welcome!  Fetching your information.... ');
	FB.api('/me', function(response) {
		me = response;
		socket.emit('login', {id: me.id});
	});
}


function getFbData(id, callback) {
	// console.log(id);
	// console.trace();
	if (id === 'admin') return null;
	FB.api('/'+id+'?fields=picture,name', function(response) {
		// console.log(response, id);
		callback(response.picture.data.url, response.name);
		// console.log('fbData', response.picture.data.url);
	});
}






