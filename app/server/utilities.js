var colors  = require('colors');
var fs = require('fs');
var debug = true;
var sanitize = require('validator').sanitize;
var stackTrace = require('stack-trace');

colors.setTheme({
  info: 'rainbow',
  debug: 'blue',
  error: 'red',
  data: 'grey'
});

module.exports.log = function() {
	var s = '\tInfo: ';
	var e;
	for (var i = 0; i < arguments.length; i++) {
		e = arguments[i];
		s += ((e instanceof Object) ? JSON.stringify(e) : e)+' ';
	}
	console.log(s.data);
}

module.exports.debug = function() {
	if(!debug) return;
	var s = '\tInfo: ';
	var e;
	for (var i = 0; i < arguments.length; i++) {
		e = arguments[i];
		s += ((e instanceof Object) ? JSON.stringify(e) : e)+' ';
	}
	console.log(s.debug);
}

module.exports.logError = function(err, detail) {
	var s = '\tError: '.error;// @ '+(new Date()) + '\n';
	// console.log('\tError:'.error, err);
	
	for (var i = 0; i < arguments.length; i++) {
		e = arguments[i];
		s += ((e instanceof Object) ? JSON.stringify(e) : e);
	}
  // var f = ('\t'+arguments.callee)//.replace('\n', '\n\t');
  // s += '\n'+ f;
  // console.log
  // console.trace();

	// if (detail) {
	// 	if (detail instanceof Object) detail = JSON.stringify(detail);		
	// 	s += ('\t' + err + '\n\t' + detail + '\n\n');
	// } else {
	// 	s += ('\t' + err + '\n\n');
	// }
	
  console.log(s);
 //  fs.appendFile("./err.txt", s, function(err2) {
 //    if(err2) {
 //      console.log(err2);
 //    }
	// }); 
}


module.exports.posInt = posInt;
function posInt(i) {
	return ((typeof i === 'number') && (i%1 === 0) && (i >= 0));
}
/** Verify  a beacon.
 * 
 * @param {Object} B - the beacon to insert
 * @return {Bool} - if it is a valid beacon
 */
module.exports.validate = function (b) {
	var s = JSON.stringify(b);
  if (!posInt(b.id)) {
  	console.log('1');
  	return false;
  }
  if (typeof b.host !== 'number') {
  	console.log('2');
  	return false;
  }
  if (typeof b.title !== 'string') {
  	console.log('3');
  	return false;
  }
  if (!b.lat  || typeof b.lat  !== 'number') {
  	console.log('4');
  	return false;
  }
  if (!b.lng  || typeof b.lng  !== 'number') {
  	console.log('5');
  	return false;
  }
  // if (typeof b.pub  !== 'boolean')  {
  // 	console.log('6');
  // 	return false;
  // }
  if (!(b.attends && b.attends instanceof Array)) {
  	console.log('7');
  	return false;
  }
  if (!(b.comments && b.comments instanceof Array)) {
  	console.log('8');
  	return false;
  }
  // if(sanitize(s).xss() !== s) return false;
  return true;
}

module.exports.isSubset = function(a, b) {
	if (a.length > b.length) return false;
	a.sort();
	b.sort();
	for (var i = 0; i < a.length; i++) {
		if (binaryIndexOf(b, a[i]) < 0) return false;
	}
	return true;
}
function binaryIndexOf(arr, e) {
  var minIndex = 0;
  var maxIndex = arr.length - 1;
  var currentIndex;
  var currentElement;

  while (minIndex <= maxIndex) {
    currentIndex = (minIndex + maxIndex) / 2 | 0;
    currentElement = arr[currentIndex];
    if (currentElement < e) minIndex = currentIndex + 1;
    else if (currentElement > e) maxIndex = currentIndex - 1;
    else return currentIndex;
  }

  return -1;
}