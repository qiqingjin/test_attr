//TCP服务
/*var net = require('net');
var server = net.createServer(function(socket){
	console.log('TCP server is builed...', 'socket is',socket);
});
var sockets = [];

server.on('connection', function(socket){
	console.log('got a new connection');

	sockets.push(socket);

	socket.on('data', function(data){
		console.log('got data:', data);

		sockets.forEach(function(otherSocket){
			if(otherSocket !== socket){
				otherSocket.write(data);
			}
		});
	});

	socket.on('close', function(){
		console.log('Connection is closing...');
		var index = sockets.indexOf(socket);
		sockets.splice(index, 1);
	});
});

server.on('error', function(err){
	console.log('Server error:', err.message);
});

server.on('close', function(){
	console.log('Server is closing...');
});
server.on('listening', function() {
    console.log('Server is listening on port', 4001);
});

server.listen(4001);
*/
var server = require('net').createServer();
var port = 4001;
server.on('listening', function() {
    console.log('Server is listening on port', port);
});
 server.on('connection', function(socket) {
    console.log('Server has a new connection');
    socket.end();
    server.close();
});
server.on('close', function() {
    console.log('Server is now closed');
});
server.on('error', function(err) {
    console.log('Error occurred:', err.message);
});
server.listen(port);