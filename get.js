var levelup = require('level')
var db = levelup('./mydb')

db.get('hellp', function (err, value) {
  if (err) return console.log('Ooops!', err) // some kind of I/O error
  	console.log('ok:', value)
})