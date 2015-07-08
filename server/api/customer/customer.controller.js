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
   Customer.find({name:new RegExp(req.params.id, "i")} , function (err, customer) {
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
    //console.log(data);
     //"{\"$city\":\"Ramallah\",\"$country_code\":\"PS\",\"$email\":\"developers@yamsafer.me\",\"$first_name\":\"moh\",\"$ios_app_release\":\"1.1\",\"$ios_app_version\":\"69\",\"$ios_device_model\":\"iPhone3,1\",\"$ios_lib_version\":\"2.8.1\",\"$ios_version\":\"7.1.2\",\"$last_name\":\"taweel\",\"$name\":\"moh taweel\",\"$phone\":\"+972568600919\",\"$region\":\"West Bank\",\"$timezone\":\"Asia/Hebron\",\"Check-in Date\":\"2015-07-12T02:00:00\",\"Check-out Date\":\"2015-07-15T02:00:00\",\"Current Language\":\"en\",\"UDID\":\"55726\",\"User Type\":\"iOS\",\"Yozio MetaData\":\"yozio_device_id=3340B695-8E95-4F85-BE15-79C98EF08185&timestamp=1435667107939\",\"$last_seen\":\"2015-07-01T16:14:28\",\"$distinct_id\":\"3340B695-8E95-4F85-BE15-79C98EF08185\"}"
   //"{\"$android_app_version\":\"1.0\",\"$android_app_version_code\":\"10182\",\"$android_brand\":\"htc\",\"$android_devices\":[\"APA91bFUbob1MXTB2q8Hde_COmmA2iKySIFq1R-pbwjvV6Ojt5R__WBQ05Juwl_3CEnG9tC9EOX4tVj6PMzFBsc3ubn2pRn5uM8Mrn2f6YPWNRJ3cLB-Mfqx-Mw5s3U5pZZgRSzVBc2lchA7E3MfnHKZB7nVWoJpbg\"],\"$android_lib_version\":\"4.5.3\",\"$android_manufacturer\":\"HTC\",\"$android_model\":\"HTC One_M8 dual sim\",\"$android_os\":\"Android\",\"$android_os_version\":\"5.0.2\",\"$city\":\"Ramallah\",\"$country_code\":\"PS\",\"$email\":\"azzam@yamsafer.me\",\"$first_name\":\"testbooking\",\"$ip\":\"188.225.179.138\",\"$last_checkin\":\"2015-06-23T00:00:00\",\"$last_checkout\":\"2015-06-24T00:00:00\",\"$last_name\":\"testbooking\",\"$name\":\"testbooking testbooking\",\"$phone\":\"+972598076842\",\"$region\":\"West Bank\",\"$time\":\"2015-06-21T11:06:03\",\"$timezone\":\"Asia/Hebron\",\"$transactions\":[{\"$amount\":273.05,\"$time\":\"2015-06-09T18:44:33\"},{\"$amount\":225.02,\"$time\":\"2015-06-16T15:51:00\"},{\"$amount\":198.14,\"$time\":\"2015-06-21T11:06:03\"}],\"Count of Confirmed Bookings\":3,\"Count of Online Checkouts\":3,\"Current Language\":\"en\",\"UDID\":\"23328\",\"User Type\":\"Android\",\"$last_seen\":\"2015-06-21T11:06:22\",\"$distinct_id\":\"f545feda-dbe1-4f28-bc0b-d08ac7ecbef2\"}"   

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
       // where: "properties[\"$first_name\"] == \"" + "moh" + "\"" || ""
       // where: "properties[\"UDID\"] == \"" + "55726" + "\"" || ""
       //where: "properties[\"UDID\"] == \"" + "23328" + "\"" || ""
exports.getDataFromMixP = function(req,res) {
  
  // console.log("hello");

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
    //console.log("hello");
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

exports.test = function(req,res) {
   find({"created_on": {"$gte": start, "$lt": end}})
var day = moment.unix(1318781876);
console.log(day);
};

