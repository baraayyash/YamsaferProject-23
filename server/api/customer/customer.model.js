'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var CustomerSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  amount: String,
  info: String,
  blocked: Boolean,
  country_code: String
});

module.exports = mongoose.model('Customer', CustomerSchema);