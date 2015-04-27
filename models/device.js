// db
var mongoose = require('mongoose');

// Schemas
var deviceSchema = mongoose.Schema({
  id: String,
  type: String, // Dropdown (Temp, Energy, Water level etc)
  name: String,
  graph: String, // Dropdown Line/Bar
  gmap: String,
  created_at:  { type: Date, default: Date.now } 
}); 

// Model
module.exports = mongoose.model('Device',logSchema);