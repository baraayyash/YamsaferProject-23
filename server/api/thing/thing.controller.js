/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Thing = require('./thing.model');
//var Mysql=require('../services/mysql');
// Get list of things
exports.index = function(req, res) {


var mysql      = require('mysql');
var connection = mysql.createConnection({
  driver    : 'mysql',
 host      : 'api-staging.yamsafer.me',
 database  :  'thewall',
 user  : 'root',
 password  : 'yamsaferCRMteam',
 charset   : 'utf8',
 collation : 'utf8_unicode_ci',
 prefix    : '',
});

connection.connect();

 var req = {
         UDID:1014 ,
         email:"faris@yamsafer.me",
         phone: "972544735168",
     };

connection.query('SELECT * from customers where phone like  "%%'+972568600919+'%%"  limit 0,10', function(err, rows, fields) {
  if (err) throw err;
 res.json(rows);
// console.log(rows);

rows.forEach(function(item) { console.log('id: '+item.id) });

});

// connection.query('SELECT DISTINCT orders.id,orders.no_show,orders.checkin_date,orders.checkout_date,orders.hotel_id,orders.hotel_name,orders.total_price,orders.created_at,orders.cancelled FROM orders INNER JOIN customers ON orders.customer_id=customers.id where udid = '+req.UDID+' or email= '+' "  ' +  req.email+'  " '+ ' or phone='+req.phone+'  limit 0,100', function(err, rows, fields) {
//   if (err) throw err;
//  // res.json(rows);
// // console.log(rows);

// rows.forEach(function(item) { console.log('id: '+item.id) });

// });


};

// Get a single thing
exports.show = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    return res.json(thing);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  Thing.create(req.body, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.json(201, thing);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Thing.findById(req.params.id, function (err, thing) {
    if (err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    var updated = _.merge(thing, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, thing);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    thing.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}