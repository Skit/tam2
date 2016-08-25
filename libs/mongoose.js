var mongoose    = require('mongoose-promised');
var config      = require('./configLib');

mongoose.connectQ(config.get('mongoose:uri'));
var db = mongoose.connection;

db.on('error', function (err) {
    console.log('connection error:', err.message);
});

db.once('open', function callback () {
    console.log("Connected to DB!");
});

var Schema = mongoose.Schema;

// Schems
var Task = new Schema({
    sort: { type: String, required: true },
    name: { type: String, required: true },
    priority: { type: String, required: true },
    state: { type: String, required: true },
    deadline: { type: String, required: true },
    create: { type: Date, default: Date.now }
});

// TODO: нормально сделать валидацию
//Task.path('name').validate(function (v) {
  //  return v.length > 3 && v.length < 50;
//});

var TaskModel = mongoose.model('Task', Task);

module.exports.TaskModel = TaskModel;