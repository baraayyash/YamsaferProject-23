'use strict';

var _ = require('lodash');
var CallLog = require('./callLog.model');
var Customer = require('../customer/customer.model');
var callLogService = require('../services/callLogService');
var searchByDateM = require('../services/searchByDateService');

// Get list of callLogs
exports.index = function(req, res) {
    CallLog.find(function(err, callLogs) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, callLogs);
    });
};

//delete  all calllogs!
exports.deleteAll = function(req, res) {
    CallLog.find(function(err, callLogs) {
        if (err) {
            return handleError(res, err);
        }

        for (var i = 0; i < callLogs.length; i++) {

            CallLog.findById(callLogs[i]._id, function(err, callLog) {
                if (err) {
                    return handleError(res, err);
                }
                if (!callLogs) {}
                callLog.remove(function(err) {
                    if (err) {
                        return handleError(res, err);
                    }
                    //return res.send(204);
                });
            });
        }
        res.json("done!");

    });
};


// Get a single callLog
exports.show = function(req, res) {
    CallLog.findById(req.params.id, function(err, callLog) {
        if (err) {
            return handleError(res, err);
        }
        if (!callLog) {
            return res.send(404);
        }
        return res.json(callLog);
    });
};

exports.searchByDate = function(req, res) {
    var list = [];
    console.log(req.params);
    var start = req.params.start;
    var end = req.params.end;
    CallLog.find({
            date: {
                "$gte": new Date(start),
                "$lt": new Date(end)
            }
        },
        function(err, callLogs) {
            if (err) {
                return handleError(res, err);
            }
            startFunctionOfTenQueries(callLogs, searchByDateM, function(dataReturned) {
                res.json(dataReturned);
            });

        });

};


exports.searchByName = function(req, res) {
    var flag = 0;

    Customer.find({
            $or: [{
                name: new RegExp(req.params.id, "i")
            }, {
                UDID: new RegExp(req.params.id, "i")
            }, {
                phone: new RegExp(req.params.id, "i")
            }]
        },
        function(err, cust) {
            if (err) {
                return handleError(res, err);
            }
            if (!cust) {
                return res.send(404);
            }
            var cusarray = [];
            for (var i = 0, y = cust.length; i < y; i++) {
                CallLog.find({
                    customer: cust[i]._id
                }, function(err, callLog) {
                    if (err) {
                        return handleError(res, err);
                    }
                    if (!callLog) {
                        return res.send(404);
                    }
                    flag++;
                    if (flag == cust.length) {
                        startFunctionOfTenQueries(cusarray, callLogService, function(dataReturned) {
                            res.json(dataReturned);
                        });
                    }
                })
                cusarray.push(cust[i].id);

            }
        });
};



// Creates a new callLog in the DB.
exports.create = function(req, res) {
    CallLog.create(req.body, function(err, callLog) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, callLog);
    });
};

// Updates an existing callLog in the DB.
exports.update = function(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    CallLog.findById(req.params.id, function(err, callLog) {
        if (err) {
            return handleError(res, err);
        }
        if (!callLog) {
            return res.send(404);
        }
        var updated = _.merge(callLog, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, callLog);
        });
    });
};

// Deletes a callLog from the DB.
exports.destroy = function(req, res) {
    CallLog.findById(req.params.id, function(err, callLog) {
        if (err) {
            return handleError(res, err);
        }
        if (!callLog) {
            return res.send(404);
        }
        callLog.remove(function(err) {
            if (err) {
                return handleError(res, err);
            }
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

        var startIndex = req.param('udid') || 0;
        startFunctionOfTenQueries(uniqueArrOfCust.splice(startIndex, 10), callLogService, function(dataReturned) {
            res.json(dataReturned);
        });
    });
};


function handleError(res, err) {
    return res.send(500, err);
}

//function has 10 arrays and call findOneCallLOgById to get data to each customer
var startFunctionOfTenQueries = function(arrayOfCustomerID, service, callback) {
    var allTenResultOfTimeLine = [];

    function loopAsync(i) {
        if (i < arrayOfCustomerID.length) {
            // callLogService.findOneCallLogByID(arrayOfCustomerID[i],function(resulttt){
            // searchByDateM.findOneCallLogByID(arrayOfCustomerID[i],function(resulttt){
            service.findOneCallLogByID(arrayOfCustomerID[i], function(resulttt) {
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

// //function has 10 arrays and call findOneCallLOgById to get data to each customer
//     var searchByDateFunct = function(arrayOfCustomerID,callback) {
//             var allTenResultOfTimeLine = [];
//             function loopAsync(i) {
//                 if (i < arrayOfCustomerID.length) {
//                searchByDateM.findOneCallLogByID(arrayOfCustomerID[i],function(resulttt){
//                 allTenResultOfTimeLine.push(resulttt);
//                if (allTenResultOfTimeLine.length == arrayOfCustomerID.length) {
//                   callback(allTenResultOfTimeLine);
//                  }
//                  loopAsync(i + 1)
//                     })
//                 }
//             }
//             loopAsync(0);

//         }
