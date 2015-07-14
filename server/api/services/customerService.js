var _ = require('lodash');
var Customer = require('../customer/customer.model');
var Transaction = require('../transaction/transaction.model');
var CallLog = require('../callLog/callLog.model');
var cityToCoor=require('./cityToCoordinates');

//saving data that returned from MixPanel
exports.createCustomer = function(data) {

    var req = {
        UDID: data.UDID,
        name: data.$first_name,
        timezone: data.$timezone,
        distinct_id: data.$distinct_id,
        email: data.$email,
        phone: data.$phone,
        country_code: data.$country_code,
        city: data.$cit,
        region: data.$region,
        info: 'info',
        blocked: false,
        last_seen: data.$last_seen,
        Yozio_MetaData: data["Yozio MetaDat"],
        Current_Language: data["Current Language"],
        last_checkin: data["$last_checkin"],
        last_checkout: data["$last_checkout"],
        ip: data.$ip,
        Count_of_Confirmed_Bookings: data["Count of Confirmed Bookings"],
        Count_of_Online_Checkouts: data["Count of Online Checkouts"],
        User_Type: data["User Type"],
        cityLng:undefined,
        cityLat:undefined

    };

    if (data["User Type"] == "iOS") {
        req.user_ios = {
            ios_app_release: data.$ios_app_release,
            ios_app_version: data.$ios_app_version,
            ios_device_model: data.$ios_device_model,
            ios_lib_version: data.$ios_lib_version,
            ios_version: data.$ios_version
        };
    }
    else {
        req.user_android = {
            android_app_version: data.$android_app_version,
            android_app_version_code: data.$android_app_version_code,
            android_brand: data.$android_brand,
            android_devices: data.$android_devices,
            android_lib_version: data.$android_lib_version,
            android_manufacturer: data.$android_manufacturer,
            android_model: data.$android_model,
            android_os: data.$android_os,
            android_os_version: data.$android_os_version
        };
    }

//create the customer with his transaction
    Customer.create(req, function(err, customer) {
        if (err) {
            return handleError(res, err);
        }

        for (var i in data.$transactions) {
            var req = {
                amount: data.$transactions[i].$amount,
                time: data.$transactions[i].$time,
                customer: customer._id
            };
            Transaction.create(req, function(err, transaction) {
                if (err) {
                    return handleError(res, err);
                }
                customer.transactions.push(transaction);
                customer.save();
            });
        }
//new call log for the customer
        var callLogReq = {
            customer: customer._id
        };
        CallLog.create(callLogReq, function(err, callLog) {
            if (err) {
                return handleError(res, err);
            }
            customer.callLogs.push(callLog);
            customer.save();
        });
         cityToCoor.getLngLat(data.$country_code,function (lng,lat){
              customer.cityLng=lng;
              customer.cityLat=lat;
            customer.save();
                });
    
        customer.save();

    });

};