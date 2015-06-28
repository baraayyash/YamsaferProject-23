'use strict';

var _ = require('lodash');
var Customer = require('./customer.model');
var Mixpanel = require('../services/mixpanel');
var express = require('express');
var engage = require('../services/engage');

// Get list of customers
exports.index = function(req, res) {
  Customer.find(function (err, customers) {
    if(err) { return handleError(res, err); }
    return res.json(200, customers);
  });
};

// Get a single customer
exports.show = function(req, res) {
  Customer.findById(req.params.id, function (err, customer) {
    if(err) { return handleError(res, err); }
    if(!customer) { return res.send(404); }
    return res.json(customer);
  });
};


exports.showbyname = function(req, res) {
  console.log(req.params.id);
  Customer.findOne({name:req.params.id}, function (err, customer) {
    if(err) { return handleError(res, err); }
    if(!customer) { return res.send(404); }
    return res.json(customer);
  });
};


// Creates a new customer in the DB.
exports.create = function(req, res) {
  // console.log(req.body);
  // var req ={ country_code : 'ps', name: 'testhere' };
  // console.log(req);
  Customer.create(req.body, function(err, customer) {
    if(err) { return handleError(res, err); }
    return res.json(201, customer);
    });
};

// Updates an existing customer in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Customer.findById(req.params.id, function (err, customer) {
    if (err) { return handleError(res, err); }
    if(!customer) { return res.send(404); }
    var updated = _.merge(customer, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, customer);
    });
  });
};

// Deletes a customer from the DB.
exports.destroy = function(req, res) {
  Customer.findById(req.params.id, function (err, customer) {
    if(err) { return handleError(res, err); }
    if(!customer) { return res.send(404); }
    customer.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};




exports.blocked = function(req, res) {


   
    Customer.findOne({_id:req.params.id}, function (err, customer) {
    if(err) { return handleError(res, err); }

    if(!customer) {
      Customer.create(req, function(err, customer) {
    if(err) { return handleError(res, err); }
      return console.log("added");
    });
     }

     if(customer) {
      if((customer.blocked)){
        return res.json("true");
        // return console.log("blocked");
      }
      else{

        return res.json("false");
        // return console.log("not  blocked");
       
      }
     }
  });
       
    };


  exports.block = function(req, res) {

     var blockinfo ={
    blocked: req.param('blocked'),
     };
   
    Customer.findOne({_id:req.param('id')}, function (err, customer) {
    if(err) { return handleError(res, err); }

    if(!customer) {
      Customer.create(req, function(err, customer) {
    if(err) { return handleError(res, err); }
      return console.log("added");
    });
     }

     if(customer) {
       var updated = _.merge(customer, blockinfo);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json("updated done");
    });
     }
  });
       
    };



function handleError(res, err) {
  return res.send(500, err);
}


  var saveData = function(data) {

    //console.log(data);
    var req ={
      
   // name: data["$first_name"],
    name: "heloo new",
    email: data["$email"],
    phone: data["$phone"], 
    amount: data.$transactions[0].$amount,
    info: 'info',
    blocked: false,
    country_code : data["$country_code"]
     };
    
    //console.log(req);

  Customer.findOne({name:req.name}, function (err, customer) {
    if(err) { return handleError(res, err); }

    if(!customer) {
      Customer.create(req, function(err, customer) {
    if(err) { return handleError(res, err); }
      return console.log("added");
    });
     }

     if(customer) {
      return console.log("exist");
     }
  });
  };

exports.getDataFromMixP = function(req, res) {

  var udid = req.param('udid');
    engage.queryEngageApi({
        where: "properties[\"$first_name\"] == \"" + udid + "\"" || ""
    }, function(queryDone) {  
        res.json(queryDone);
        var jsondata = JSON.parse(queryDone);
        // results[i].$properties[r]
         saveData(jsondata);
        res.end();
    });

};


