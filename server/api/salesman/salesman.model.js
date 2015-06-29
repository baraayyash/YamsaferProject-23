'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SalesmanSchema = new Schema({
  name: String,
  email: String
});

module.exports = mongoose.model('Salesman', SalesmanSchema);