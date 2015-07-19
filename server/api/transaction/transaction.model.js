'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TransactionSchema = new Schema({
  Yamsafer_id:Number,
  amount: Number,
  time: Date,
  lng:Number,
  lat:Number,
  no_show:Number,
  checkin_date:Date,
  checkout_date:Date,
  Hotel:String,
  total_price:Number,
  cancelled:Number,
  nights:Number,
  customer: {type: Schema.Types.ObjectId,
  	ref: 'Customer'},
  salesman: {type: Schema.Types.ObjectId,
  	ref: 'Salesman'}
});

module.exports = mongoose.model('Transaction', TransactionSchema);
