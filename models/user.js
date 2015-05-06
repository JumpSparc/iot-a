// db
var bcrypt   = require('bcrypt-nodejs');
var mongoose = require('mongoose');

// Schemas
var userSchema = mongoose.Schema({
  email: String,
  password: String,
  devices: { type : Array , default: [] },
  created_at:  { type: Date, default: Date.now } 
}); 

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// Model
module.exports = mongoose.model('User',userSchema);