'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CallLogSchema = new Schema({
  date:{ type: Date, default: Date.now },
  customer: {type: Schema.Types.ObjectId,ref: 'Customer'}
});

module.exports = mongoose.model('CallLog', CallLogSchema);