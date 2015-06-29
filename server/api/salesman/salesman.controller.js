'use strict';

var _ = require('lodash');
var Salesman = require('./salesman.model');

// Get list of salesmans
exports.index = function(req, res) {
  Salesman.find(function (err, salesmans) {
    if(err) { return handleError(res, err); }
    return res.json(200, salesmans);
  });
};

// Get a single salesman
exports.show = function(req, res) {
  Salesman.findById(req.params.id, function (err, salesman) {
    if(err) { return handleError(res, err); }
    if(!salesman) { return res.send(404); }
    return res.json(salesman);
  });
};

// Creates a new salesman in the DB.
exports.create = function(req, res) {
  Salesman.create(req.body, function(err, salesman) {
    if(err) { return handleError(res, err); }
    return res.json(201, salesman);
  });
};

// Updates an existing salesman in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Salesman.findById(req.params.id, function (err, salesman) {
    if (err) { return handleError(res, err); }
    if(!salesman) { return res.send(404); }
    var updated = _.merge(salesman, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, salesman);
    });
  });
};

// Deletes a salesman from the DB.
exports.destroy = function(req, res) {
  Salesman.findById(req.params.id, function (err, salesman) {
    if(err) { return handleError(res, err); }
    if(!salesman) { return res.send(404); }
    salesman.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}