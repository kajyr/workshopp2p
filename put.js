var levelup = require('level'),
	db = levelup('./mydb')

db.put('hello', 'world', err => {
	if (err)
		return console.log('Ooops!', err) // some kind of I/O error
	console.log('ok');
});