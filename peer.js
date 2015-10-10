var options = require('commander');
var topology = require('fully-connected-topology');
var jsonStream = require('duplex-json-stream');	
var streamSet = require('stream-set');
var hashToPort = require('hash-to-port');
var register = require('register-multicast-dns');
var lookup = require('lookup-multicast-dns/global');

var toAddress = function  (username) { return username + '.local:' + hashToPort(username) }

options
	.option('--name [name]', 'Username')
	.option('--others <users>', 'A list', function(val) {
		 return val.split(',').map(toAddress);
	})
	.parse(process.argv);

process.stdin.setEncoding('utf8');

var thisHost = toAddress(options.name);	
var received = {}
var sockets = streamSet();
var swarm = topology(thisHost, options.others);
var seq = 0;
var id = Math.random();


console.log('this is:', thisHost)
register(options.name)

swarm.on('connection', function(socket, peer) {
	console.log(peer, ' is connected');

	socket = jsonStream(socket);
	sockets.add(socket);

	socket.on('data', function(data) {

		if (data.seq <= received[data.from]) return;
		received[data.from] = data.seq

		console.log(data.name, '>', data.message);

		sockets.forEach(function(s) {
			s.write(data);
		})
	});
});

process.stdin.on('data', function(line) {

	sockets.forEach(function(socket) {
		socket.write({from: id, name: options.name, message: line.toString().trim(), seq: seq++})
	});

});