'use strict';

var _ = require('lodash');
var Transaction = require('./transaction.model');
var Customer = require('../customer/customer.model');

exports.index = function(req, res) {
  Transaction.find(function (err, transactions) {
    if(err) { return handleError(res, err); }
    return res.json(200, transactions);
  });
};

// Get a single transaction
exports.show = function(req, res) {
  Transaction.findById(req.params.id, function (err, transaction) {
    if(err) { return handleError(res, err); }
    if(!transaction) { return res.send(404); }
    Transaction.populate(transaction,{path:'customer'},
      function(err,transaction){
          return res.json(transaction);
      })
  });
};

// Creates a new transaction in the DB.
exports.create = function(req, res) {
  Transaction.create(req.body, function(err, transaction) {
    if(err) { return handleError(res, err); }
    return res.json(201, transaction);
  });
};

// Updates an existing transaction in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Transaction.findById(req.params.id, function (err, transaction) {
    if (err) { return handleError(res, err); }
    if(!transaction) { return res.send(404); }
    var updated = _.merge(transaction, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, transaction);
    });
  });
};

// Deletes a transaction from the DB.
exports.destroy = function(req, res) {
  Transaction.findById(req.params.id, function (err, transaction) {
    if(err) { return handleError(res, err); }
    if(!transaction) { return res.send(404); }
    transaction.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.searchByDate = function(req,res) {

  Transaction.find({time: {"$gte": new Date(2015, 1, 14), "$lt": new Date(2017, 7, 14)} },
    function (err, transaction) {
    if(err) { return handleError(res, err); }
    return res.json(transaction);
    console.log(transaction);
  });
};



function handleError(res, err) {
  return res.send(500, err);
}