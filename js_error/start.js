var fs = require("fs");
var url = require("url");

var http = require("http");

var path = require("path");

var PORT = 8000;



var server = http.createServer(function(req, res) {

    res.writeHead(200, { 'Content-type': 'text/html'});
    res.end();
});

server.listen(PORT);

console.log("Server runing at port: " + PORT + ".");