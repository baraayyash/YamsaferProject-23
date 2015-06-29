'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var CustomerSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  country_code: String,
  info: String,
  blocked: Boolean
  
});

module.exports = mongoose.model('Customer', CustomerSchema);