// db
var mongoose     = require('mongoose');

// Schemas
var logSchema = mongoose.Schema({
  device_id: String,
  power: Number,
  energy: Number,
  duration: Number,
  tstamp: Number,
  created_at:  { type: Date, default: Date.now } 
}); 

// Model
module.exports = mongoose.model('Log',logSchema);