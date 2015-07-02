'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SalesmanSchema = new Schema({
  name: String,
  email: String,
  transactions: [{type: Schema.Types.ObjectId, ref: 'Transaction'}]
});

module.exports = mongoose.model('Salesman', SalesmanSchema);