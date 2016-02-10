var controller = require('./lib/app');
var http = require('http');
var onStart = function(){
	console.log('Game started in port 8080')
};
var server = http.createServer(controller);
server.listen(process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080, process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");
