'use strict';

var _ = require('lodash');
var Customer = require('./customer.model');
var Transaction = require('../transaction/transaction.model');
var Mixpanel = require('../services/mixpanel');
var express = require('express');
var engage = require('../services/engage');
var CallLog = require('../callLog/callLog.model');

// ///Get list of customers
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
    Customer.populate(customer,{path:'transactions'},function(err,customer){
      return res.json(customer);
    });
  });
};

exports.showbyname = function(req, res) {
   Customer.find({name:req.params.id}, function (err, customer) {
    if(err) { return handleError(res, err); }
    if(!customer) { return res.send(404); }    
    Customer.populate(customer,{path:'transactions'},function(err,customer){
     // return res.json(customer);
    });
     Customer.populate(customer,{path:'callLogs'},function(err,customer){
      return res.json(customer);
    });
   });
};


// Creates a new customer in the DB.
exports.create = function(req, res) {
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
      console.log(customer);
      return res.send(204);
    });
  });
};

//this function to see if customer is blocked or not
exports.blocked = function(req, res) {
    Customer.findById(req.params.id, function (err, customer) {
    if(err) {
    // getDataFromMixPB(req.params.id,res);
      return res.json("false");
    }
    if(!customer) {  
      getDataFromMixPB(req.params.id,res);
    return res.json("false");
     }
    if(customer) {
      
      //each time customer exist  update  call logs with new current Time
       var newCallLogReq = {customer: customer._id};
      CallLog.create(newCallLogReq, function(err, callLog) {
     if (err) { console.log("error creatng new log ");
         return handleError(res, err);
     }
     customer.callLogs.push(callLog);
     customer.save();
     console.log("new call log added");
       });
      if((customer.blocked)){
        return res.json("true");
      }
      else{
        return res.json("false");
      }
    }
  });
       
  };

//this function to block single customer
  exports.block = function(req, res) {


     var blockinfo ={
    blocked: req.body.blocked,
     };
     console.log(blockinfo);
    Customer.findOne({_id:req.body.id}, function (err, customer) {
    if(err) { console.log("err");return handleError(res, err); }
    if(!customer) {
     return "does not exist";
     }
     if(customer) {
      //console.log("updated");
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

// saving data that got returned from mixpanel
  var saveData = function(data) {
    //console.log(data);
    var req ={
    name: data["$first_name"]+ " " +data["$last_name"],
    email: data["$email"],
    phone: data["$phone"], 
    amount: data.$transactions[0].$amount,
    info: 'info',
    blocked: false,
    country_code : data["$country_code"]
     };

        Customer.create(req, function(err, customer) {
    if(err) { return handleError(res, err); }
      //console.log("added");
      for (var i in data.$transactions) {
        var req ={
          amount: data.$transactions[i].$amount,
          time: data.$transactions[i].$time,
          customer: customer._id
                 };
          Transaction.create(req, function(err, transaction) {
          if(err) { return handleError(res, err); }
         // return res.json(201, transaction);
         customer.transactions.push(transaction);
         customer.save();
          });
       }

       var callLogReq={udid:"777",customer: customer._id};
        CallLog.create(callLogReq, function(err, callLog) {
          if(err) { return handleError(res, err); }
         customer.callLogs.push(callLog);
         customer.save();
          });
       customer.save();
      return console.log("done");
    });
  };
  
// get data from mixpanel 
exports.getDataFromMixP = function(req,res) {
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

var getDataFromMixPB = function(req,res) {
    console.log("hello");
    engage.queryEngageApi({
        where: "properties[\"$first_name\"] == \"" + "Naem" + "\"" || ""
    }, function(queryDone) {  
     //   res.json(queryDone);
        var jsondata = JSON.parse(queryDone);
        // results[i].$properties[r]
         saveData(jsondata);
    //    res.end();

    });
};
