var levelup = require('level')
var db = levelup('./mydb')

db.put('hellp', 'world', function (err) {
  if (err) return console.log('Ooops!', err) // some kind of I/O error
  	console.log('ok')
})