var options = require('commander');
var topology = require('fully-connected-topology');
var jsonStream = require('duplex-json-stream');	
var streamSet = require('stream-set');
var hashToPort = require('hash-to-port');
var register = require('register-multicast-dns');
var lookup = require('lookup-multicast-dns/global');

var toAddress = username => username + '.local:' + hashToPort(username)

options
	.option('--name [name]', 'Username')
	.option('--others <users>', 'A list', val => val.split(',').map(toAddress))
	.parse(process.argv);

process.stdin.setEncoding('utf8');

var thisHost = toAddress(options.name);	
var received = {}
var sockets = streamSet();
var swarm = topology(thisHost, options.others);
var seq = 0;
var id = Math.random();


console.log('this is:', thisHost);
register(options.name);

swarm.on('connection', (socket, peer) => {
	console.log(`${peer} is connected`);

	sockets.add(socket = jsonStream(socket));

	socket.on('data', data => {
		if (data.seq <= received[data.from])
			return;

		console.log(`${data.name} > ${data.message}`);

		received[data.from] = data.seq;
		sockets.forEach(s => s.write(data));
	});
});

process.stdin.on('data', line => {
	sockets.forEach(socket => socket.write({
		from: id,
		name: options.name,
		message: line.toString().trim(),
		seq: seq++
	}));
});