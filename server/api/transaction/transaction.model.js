'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TransactionSchema = new Schema({
  amount: Number,
  time: Date,
  cityTo:String,
  lng:String,
  lat:String,
  customer: {type: Schema.Types.ObjectId,
  	ref: 'Customer'},
  salesman: {type: Schema.Types.ObjectId,
  	ref: 'Salesman'}
});

module.exports = mongoose.model('Transaction', TransactionSchema);