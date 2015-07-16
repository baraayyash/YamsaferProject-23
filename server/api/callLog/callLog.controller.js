'use strict';

var _ = require('lodash');
var CallLog = require('./callLog.model');
var Customer = require('../customer/customer.model');

// Get list of callLogs
exports.index = function(req, res) {
    CallLog.find(function(err, callLogs) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, callLogs);
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

    console.log(req.params);
    var start = req.params.start;
    var end = req.params.end;
    // console.log(Date.parse(start));
    // console.log(Date.parse(end));
    CallLog.find({
            date: {
                "$gte": new Date(start),
                "$lt": new Date(end)
            }
        },
        function(err, transaction) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(transaction);
            console.log(transaction);
        });

};

exports.searchByName = function(req, res) {

    // Filter to find by
    var filter = new RegExp(req.params.id, 'i');
    console.log(filter);
    // Mongoose query
    var query = {
        $or: [{
            name: filter
        }, {
            UDID: filter
        }, {
            phone: filter
        }]
    };

    var onQuerySuccess = function(err, cust) {
        if (err) {
            return handleError(res, err);
        }
        if (!cust) {
            return res.send(404);
        }
        var cusarray = [];
        for (var i = 0; i < cust.length; i++) {
            CallLog.find({
                customer: cust[i]._id
            }, function(err, callLog) {
                if (err) {
                    return handleError(res, err);
                }
                if (!callLog) {
                    return res.send(404);
                }
                for (var i = 0; i < callLog.length; i++) {
                    flag++;
                    cusarray.push(callLog[i].customer);
                }
                if (flag == callLog.length) {
                    startFunctionOfTenQueries(cusarray);
                }
            });
        }
    };

    Customer.find(query, onQuerySuccess);

    var startFunctionOfTenQueries = function(arrayOfCustomerID) {
            var allTenResultOfTimeLine = [];

            function uploader(i) {
                if (i < arrayOfCustomerID.length) {
                    findOneCallLogByID(arrayOfCustomerID[i], function(resulttt) {
                        allTenResultOfTimeLine.push(resulttt);
                        if (allTenResultOfTimeLine.length == arrayOfCustomerID.length) {
                            tenQueries(allTenResultOfTimeLine);
                        }
                        uploader(i + 1)
                    })
                }
            }
            uploader(0);

        }
    //send response back to requested url
    var tenQueries = function(allTenResult) {
        return res.json(allTenResult);
    }

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

// Get a single callLog
var findOneCallLogByID = function(IdSent, callback) {

    var timelineQuery = {
        count: undefined,
        lastDate: undefined,
        name: undefined,
        UDID: undefined,
        blocked: undefined

    };

    //query to find count of how many times customer called
    CallLog.count({
        customer: IdSent
    }, function(err, c) {
        if (err) {
            console.log("count err")
        }
        timelineQuery.count = c;
        sortCallLogsOfCust();
    });

    //sort call logs for customer by dat
    //Change the -1 to a 1 to find the oldest.
    var sortCallLogsOfCust = function() {
        CallLog.findOne({
            customer: IdSent
        }, {}, {
            sort: {
                'date': -1
            }
        }, function(err, post) {
            if (err) {
                console.log("error findONe");
            }
            timelineQuery.date = post.date;
            populateCustomerInfo();
        });

    }
    var populateCustomerInfo = function() {
        CallLog.findOne({
            customer: IdSent
        }, function(err, callLogForPopulate) {
            if (err) {
                return handleError(res, err);
            }
            if (!callLogForPopulate) {
                return res.send(404);
            }
            CallLog.populate(callLogForPopulate, {
                    path: 'customer'
                },
                function(err, callLogForPopulate) {
                    timelineQuery.name = callLogForPopulate.customer.name;
                    timelineQuery.blocked = callLogForPopulate.customer.blocked;
                    timelineQuery.UDID = callLogForPopulate.customer.UDID;
                    if (callLogForPopulate.customer.User_Type == "iOS") {
                        timelineQuery.user_ios = {
                            ios_app_release: callLogForPopulate.customer.user_ios.ios_app_release,
                            ios_app_version: callLogForPopulate.customer.user_ios.ios_app_version,
                            ios_device_model: callLogForPopulate.customer.user_ios.ios_device_model,
                            ios_lib_version: callLogForPopulate.customer.user_ios.ios_lib_version,
                            ios_version: callLogForPopulate.customer.user_ios.ios_version
                        }
                    } else {
                        timelineQuery.user_android = {
                            android_app_version: callLogForPopulate.customer.user_android.android_app_version,
                            android_app_version_code: callLogForPopulate.customer.user_android.android_app_version_code,
                            android_brand: callLogForPopulate.customer.user_android.android_brand,
                            android_devices: callLogForPopulate.customer.user_android.android_devices,
                            android_lib_version: callLogForPopulate.customer.user_android.android_lib_version,
                            android_manufacturer: callLogForPopulate.customer.user_android.android_manufacturer,
                            android_model: callLogForPopulate.customer.user_android.android_model,
                            android_os: callLogForPopulate.customer.user_android.android_os,
                            android_os_version: callLogForPopulate.customer.user_android.android_os_version
                        }
                    }

                    returnResultNow();
                })
        });
    }
    var returnResultNow = function() {
        callback(timelineQuery);
    }
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

        startFunctionOfTenQueries(uniqueArrOfCust);
    });

    //function has 10 arrays and call findOneCallLOgById to get data to each customer
    var startFunctionOfTenQueries = function(arrayOfCustomerID) {
            var allTenResultOfTimeLine = [];

            function uploader(i) {
                if (i < arrayOfCustomerID.length) {
                    findOneCallLogByID(arrayOfCustomerID[i], function(resulttt) {
                        allTenResultOfTimeLine.push(resulttt);
                        if (allTenResultOfTimeLine.length == arrayOfCustomerID.length) {
                            tenQueries(allTenResultOfTimeLine);
                        }
                        uploader(i + 1)
                    })
                }
            }
            uploader(0);

        }
    //send response back to requested url
    var tenQueries = function(allTenResult) {
        return res.json(allTenResult);
    }
}

function handleError(res, err) {
    return res.send(500, err);
}

// Get a single callLog
exports.sendBackLastCallLog = function(IdSent, callback) {

    var timelineQuery = {
        count: undefined,
        lastDate: undefined,
        name: undefined,
        UDID: undefined,
        blocked: undefined

    };

    //query to find count of how many times customer called
    CallLog.count({
        customer: IdSent
    }, function(err, c) {
        if (err) {
            console.log("count err")
        }
        timelineQuery.count = c;
        sortCallLogsOfCust();
    });

    //sort call logs for customer by dat
    //Change the -1 to a 1 to find the oldest.
    var sortCallLogsOfCust = function() {
        CallLog.findOne({
            customer: IdSent
        }, {}, {
            sort: {
                'date': -1
            }
        }, function(err, post) {
            if (err) {
                console.log("error findONe");
            }
            timelineQuery.date = post.date;
            populateCustomerInfo();
        });

    }
    var populateCustomerInfo = function() {
        CallLog.findOne({
            customer: IdSent
        }, function(err, callLogForPopulate) {
            if (err) {
                return handleError(res, err);
            }
            if (!callLogForPopulate) {
                return res.send(404);
            }
            CallLog.populate(callLogForPopulate, {
                    path: 'customer'
                },
                function(err, callLogForPopulate) {
                    timelineQuery.name = callLogForPopulate.customer.name;
                    timelineQuery.blocked = callLogForPopulate.customer.blocked;
                    timelineQuery.UDID = callLogForPopulate.customer.UDID;
                    if (callLogForPopulate.customer.User_Type == "iOS") {
                        timelineQuery.user_ios = {
                            ios_app_release: callLogForPopulate.customer.user_ios.ios_app_release,
                            ios_app_version: callLogForPopulate.customer.user_ios.ios_app_version,
                            ios_device_model: callLogForPopulate.customer.user_ios.ios_device_model,
                            ios_lib_version: callLogForPopulate.customer.user_ios.ios_lib_version,
                            ios_version: callLogForPopulate.customer.user_ios.ios_version
                        }
                    } else {
                        timelineQuery.user_android = {
                            android_app_version: callLogForPopulate.customer.user_android.android_app_version,
                            android_app_version_code: callLogForPopulate.customer.user_android.android_app_version_code,
                            android_brand: callLogForPopulate.customer.user_android.android_brand,
                            android_devices: callLogForPopulate.customer.user_android.android_devices,
                            android_lib_version: callLogForPopulate.customer.user_android.android_lib_version,
                            android_manufacturer: callLogForPopulate.customer.user_android.android_manufacturer,
                            android_model: callLogForPopulate.customer.user_android.android_model,
                            android_os: callLogForPopulate.customer.user_android.android_os,
                            android_os_version: callLogForPopulate.customer.user_android.android_os_version
                        }
                    }

                    returnResultNow();
                })
        });
    }
    var returnResultNow = function() {
        callback(timelineQuery);
    }
};
