"use strict";
var _ = require('lodash');
var CallLog = require('../callLog/callLog.model');
var Customer = require('../customer/customer.model');
// this function create an object that will be shown on timeline
exports.findOneCallLogByID = function(obj, callback) {
    var timelineQuery = {
        lastDate: undefined,
        name: undefined,
        UDID: undefined,
        id: undefined,
        phone:undefined,
        email:undefined,
        country_code:undefined,
        blocked: undefined

    };
    
             timelineQuery.date=obj.date;
                CallLog.populate(obj, {
                    path: 'customer'
                },
                function(err, callLogForPopulate) {
                    if(callLogForPopulate!==null&&callLogForPopulate.customer!==null){
                    timelineQuery.name = callLogForPopulate.customer.name;
                    timelineQuery.blocked = callLogForPopulate.customer.blocked;
                    timelineQuery.id = callLogForPopulate.customer.id;
                    timelineQuery.UDID = callLogForPopulate.customer.UDID;
                    timelineQuery.phone = callLogForPopulate.customer.phone;
                    timelineQuery.email = callLogForPopulate.customer.email;
                    timelineQuery.country_code = callLogForPopulate.customer.country_code;

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
                 });

    
};
