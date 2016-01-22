var levelup = require('level'),
	db = levelup('./mydb')

db.get('hello', (err, value) => {
	if (err)
		return console.log('Ooops!', err) // some kind of I/O error
	console.log('ok:', value)
})