// db
var mongoose = require('mongoose');

// Schemas
var deviceSchema = mongoose.Schema({
	name: String,
	type: String, // Dropdown (Temp, Energy, Water level etc)
	description: String,
	img: String, // device image
	graph: String, // Dropdown Line/Bar
	gmap: String,
	created_at:  { type: Date, default: Date.now } 
}); 

// Model
module.exports = mongoose.model('Device',deviceSchema);