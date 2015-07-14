'use strict';

var _ = require('lodash');
var CallLog = require('./callLog.model');
var Customer = require('../customer/customer.model');
var callLogService = require('../services/callLogService');

// Get list of callLogs
exports.index = function(req, res) {
  CallLog.find(function (err, callLogs) {
    if(err) { return handleError(res, err); }
    return res.json(200, callLogs);
  });
};

// Get a single callLog
exports.show = function(req, res) {
  CallLog.findById(req.params.id, function (err, callLog) {
    if(err) { return handleError(res, err); }
    if(!callLog) { return res.send(404); }
    return res.json(callLog);
  });
};

exports.searchByDate = function(req,res) {

  console.log(req.params);
  var start = req.params.start;
  var end = req.params.end;
   // console.log(Date.parse(start));
   // console.log(Date.parse(end));
  CallLog.find({date: {"$gte": new Date(start), "$lt": new Date(end)} },
    function (err, transaction) {
    if(err) { return handleError(res, err); }
    return res.json(transaction);
    console.log(transaction);
  });

};

exports.searchByName = function(req,res) {

    var flag=0;
  
   Customer.find({ $or: [{name:new RegExp(req.params.id, "i")},
    {UDID: new RegExp(req.params.id, "i")},
    {phone: new RegExp(req.params.id, "i")}] } ,
    function (err, cust) {
    if(err) { return handleError(res, err); }
    if(!cust) { return res.send(404); }   
       var cusarray=[];
       for(var i=0;i<cust.length;i++){
    CallLog.find({customer:cust[i]._id}, function (err, callLog) {
    if(err) { return handleError(res, err); }
    if(!callLog) { return res.send(404); }
    for(var i =0;i<callLog.length;i++){
        flag++;
        cusarray.push(callLog[i].customer);
    }
    if(flag==callLog.length){
    startFunctionOfTenQueries(cusarray,function(dataReturned){
      res.json(dataReturned);
      });
    }
  });
}   
});
};


// Creates a new callLog in the DB.
exports.create = function(req, res) {
  CallLog.create(req.body, function(err, callLog) {
    if(err) { return handleError(res, err); }
    return res.json(201, callLog);
  });
};

// Updates an existing callLog in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  CallLog.findById(req.params.id, function (err, callLog) {
    if (err) { return handleError(res, err); }
    if(!callLog) { return res.send(404); }
    var updated = _.merge(callLog, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, callLog);
    });
  });
};

// Deletes a callLog from the DB.
exports.destroy = function(req, res) {
  CallLog.findById(req.params.id, function (err, callLog) {
    if(err) { return handleError(res, err); }
    if(!callLog) { return res.send(404); }
    callLog.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.timeline = function(req, res) {
    
    //array of 10 last users to display on timeline
    var arrOfId = [];
    /*
      we need to find last 10 DIFFERENT persons called
      so at first i call sort function by date
      second i call ArrNoDupe to remove duplicate user for example
      if we have user1 called 5 times we only want to display once and 
      count of call 5 times 
    */
    CallLog.find({}).sort('-date').exec(function(err, docs) {

        var arrOfCust = [];
        for (var j = 0, m = docs.length; j < m; j++) {
            arrOfCust.push(docs[j].customer);
        }

        function ArrNoDupe(a) {
                var temp = {};
                for (var i = 0; i < a.length; i++)
                    temp[a[i]] = true;
                var r = [];
                for (var k in temp)
                    r.push(k);
                return r;
            }
            //array with no duplicates
        var uniqueArrOfCust = ArrNoDupe(arrOfCust);

        // startFunctionOfTenQueries(uniqueArrOfCust);
   startFunctionOfTenQueries(uniqueArrOfCust,function(dataReturned){
      res.json(dataReturned);
    });
  });
};

   
function handleError(res, err) {
  return res.send(500, err);
}

    //function has 10 arrays and call findOneCallLOgById to get data to each customer
    var startFunctionOfTenQueries = function(arrayOfCustomerID,callback) {
            var allTenResultOfTimeLine = [];

            function loopAsync(i) {
                if (i < arrayOfCustomerID.length) {
                callLogService.findOneCallLogByID(arrayOfCustomerID[i],function(resulttt){
                allTenResultOfTimeLine.push(resulttt);
               if (allTenResultOfTimeLine.length == arrayOfCustomerID.length) {
                  callback(allTenResultOfTimeLine);
                 }
                 loopAsync(i + 1)
                    })
                }
            }
            loopAsync(0);

        }


