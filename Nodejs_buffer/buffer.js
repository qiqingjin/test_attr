fs = require('fs');

var start = new Date();

fs.readFile('people.mp3', function(err, data){
	fs.writeFile('copy.mp3', data, function(e){
		if(e){
			console.log(e);
		}
	});
	var base64 = data.toString('base64');
	var buffer = new Buffer(base64, 'base64');
	/*console.log('base64:' + base64);
	console.log('buffer:' + buffer);*/
	console.log(buffer == data);
});

var runTime = new Date() - start;
console.log('run time is:'+runTime);