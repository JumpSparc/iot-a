// db
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// Schemas
var logSchema = new Schema({
  id: String,
  power: Number,
  energy: Number,
  duration: Number,
  tstamp: Number,
  created_at:  { type: Date, default: Date.now } 
}); 

// Model
var Log = mongoose.model('Logs',logSchema);
module.exports = Log;