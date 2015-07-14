"use strict";
var _ = require('lodash');
var CallLog = require('../callLog/callLog.model');

// Get a single callLog
exports.findOneCallLogByID = function(IdSent, callback) {
    var timelineQuery = {
        count: undefined,
        lastDate: undefined,
        name: undefined,
        UDID: undefined,
        id: undefined,
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
                    if(callLogForPopulate.customer!==null){
                    timelineQuery.name = callLogForPopulate.customer.name;
                    timelineQuery.blocked = callLogForPopulate.customer.blocked;
                    timelineQuery.id = callLogForPopulate.customer.id;
                    timelineQuery.UDID = callLogForPopulate.customer.UDID;
                    if (callLogForPopulate.customer.User_Type == "iOS") {
                        timelineQuery.user_ios = {
                            /**/
                            ios_app_release: callLogForPopulate.customer.user_ios.ios_app_release,
                            ios_app_version: callLogForPopulate.customer.user_ios.ios_app_version,
                            ios_device_model: callLogForPopulate.customer.user_ios.ios_device_model,
                            ios_lib_version: callLogForPopulate.customer.user_ios.ios_lib_version,
                            /**/
                            ios_version: callLogForPopulate.customer.user_ios.ios_version
                        }
                    } else {
                        timelineQuery.user_android = {
                            /**/
                            android_app_version: callLogForPopulate.customer.user_android.android_app_version,
                            /**/
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
                }
                            callback(timelineQuery);
                    //returnResultNow();
                })
        });
    }
};
