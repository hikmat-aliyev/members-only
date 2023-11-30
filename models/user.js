const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 50 },
  last_name: { type: String, required: true, maxLength: 50},
  email: { type: String, required: true, maxLength: 50},
  password: { type: String, required: true, minLength: 3}
})

UserSchema.virtual("full_name").get(function(){
  let fullName = "";
  if (this.first_name && this.last_name) {
    fullName = `${this.first_name}, ${this.last_name}`;
  }
  return fullName;
})

UserSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/user/${this._id}`;
});

module.exports = mongoose.model('User', UserSchema);
