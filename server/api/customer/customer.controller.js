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
      Customer.populate(customer,{path:'callLogs'},function(err,customer){
      return res.json(customer);
    });
    });
  });
};

exports.showbyname = function(req, res) {


   Customer.find({ $or: [{name:new RegExp(req.params.id, "i")},
    {UDID: new RegExp(req.params.id, "i")},
    {phone: new RegExp(req.params.id, "i")}] } ,
    function (err, customer) {
    if(err) { return handleError(res, err); }
    if(!customer) { return res.send(404); }    
    Customer.populate(customer,{path:'transactions'},function(err,customer){
      return res.json(customer);
    });
     
   });
};


exports.phone = function(req, res) {

   Customer.find({phone:new RegExp(req.params.id, "i")}, function (err, customer) {
    if(err) { return handleError(res, err); }
    if(!customer) { return res.send(404); }    
    Customer.populate(customer,{path:'transactions'},function(err,customer){
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

// Creates a new customer in the DB.
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


// Creates a new customer in the DB.
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

    if(data["User Type"]=="iOS")
    {   
      var req ={

        UDID: data["UDID"],
        name: data["$first_name"],
        timezone:data["$timezone"],
        distinct_id:data["$distinct_id"],
        email: data["$email"],
        phone: data["$phone"],
        country_code: data["$country_code"],
        city:data["$city"],
        region:data["$region"],
        info: 'info',
        blocked: false,
        last_seen:data["$last_seen"],
        Yozio_MetaData:data["Yozio MetaData"],
        Current_Language:data["Current Language"],
        last_checkin:data["$last_checkin"],
        last_checkout:data["$last_checkout"],
        ip:data["$ip"],
        Count_of_Confirmed_Bookings:data["Count of Confirmed Bookings"],
        Count_of_Online_Checkouts:data["Count of Online Checkouts"],
        User_Type:data["User Type"],
        user_ios:{
          ios_app_release: data["$ios_app_release"],
          ios_app_version: data["$ios_app_version"],
          ios_device_model: data["$ios_device_model"],
          ios_lib_version: data["$ios_lib_version"],
          ios_version: data["$ios_version"]
        }

      };
    }

  

    else
    {
      var req ={

        UDID: data["UDID"],
        name: data["$first_name"],
        timezone:data["$timezone"],
        distinct_id:data["$distinct_id"],
        email: data["$email"],
        phone: data["$phone"],
        country_code: data["$country_code"],
        city:data["$city"],
        region:data["$region"],
        info: 'info',
        blocked: false,
        last_seen:data["$last_seen"],
        Yozio_MetaData:data["Yozio MetaData"],
        Current_Language:data["Current Language"],
        last_checkin:data["$last_checkin"],
        last_checkout:data["$last_checkout"],
        ip:data["$ip"],
        Count_of_Confirmed_Bookings:data["Count of Confirmed Bookings"],
        Count_of_Online_Checkouts:data["Count of Online Checkouts"],
        User_Type:data["User Type"],
        user_android:{
        android_app_version: data["$android_app_version"],
        android_app_version_code: data["$android_app_version_code"],
        android_brand: data["$android_brand"],
        android_devices: data["$android_devices"],
        android_lib_version: data["$android_lib_version"],    
        android_manufacturer: data["$android_manufacturer"],
        android_model: data["$android_model"],
        android_os: data["$android_os"],
        android_os_version: data["$android_os_version"]
        }  
     };
    }


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
      
       var callLogReq={customer: customer._id};
        CallLog.create(callLogReq, function(err, callLog) {
          if(err) { return handleError(res, err); }
         customer.callLogs.push(callLog);
         customer.save();
          });
       customer.save();

      return console.log("done");
    });
  };
  


exports.getDataFromMixP = function(req,res) {
 
  var udid = req.param('udid');
       engage.queryEngageApi({
        where: "properties[\"UDID\"] == \"" + udid  + "\"" || ""
    }, function(queryDone) {  
        res.json(queryDone);
        var jsondata = JSON.parse(queryDone);
        // results[i].$properties[r]
         saveData(jsondata);
    //    res.end();

    });
};

var getDataFromMixPB = function(req,res) {
    var udid = req.param('udid');
    engage.queryEngageApi({
        where: "properties[\"UDID\"] == \"" + udid + "\"" || ""
    }, function(queryDone) {  
        res.json(queryDone);
        var jsondata = JSON.parse(queryDone);
        // results[i].$properties[r]
         saveData(jsondata);
    //    res.end();
    });
};

