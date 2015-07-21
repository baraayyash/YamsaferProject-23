var _ = require('lodash');
var Customer = require('../customer/customer.model');
var Transaction = require('../transaction/transaction.model');
var CallLog = require('../callLog/callLog.model');
var cityToCoor = require('../services/cityToCoordinates');


var mysql = require('mysql');
var connection = mysql.createConnection({
    driver: 'mysql',
    host: 'api-staging.yamsafer.me',
    database: 'thewall',
    user: 'root',
    password: 'yamsaferCRMteam',
    charset: 'utf8',
    collation: 'utf8_unicode_ci',
    prefix: '',
});
connection.connect();


//saving data that returned from MixPanel
exports.createCustomer = function(data) {

    var req = {
        UDID: data.UDID,
        name: data.$first_name + " "  + data.$last_name ,
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
        cityLng: undefined,
        cityLat: undefined

    };

    if (data["User Type"] == "iOS") {
        req.user_ios = {
            ios_app_release: data.$ios_app_release,
            ios_app_version: data.$ios_app_version,
            ios_device_model: data.$ios_device_model,
            ios_lib_version: data.$ios_lib_version,
            ios_version: data.$ios_version
        };
    } else {
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
            return console.log(err);
        }

        // fetching data from Yamsafer

        var req = {
            UDID: 1014,
            email: "faris@yamsafer.me",
            phone: "972544735168",
        };

        connection.query('SELECT DISTINCT orders.id,orders.no_show,orders.checkin_date,orders.checkout_date,orders.hotel_id,orders.hotel_name,orders.total_price,orders.created_at,orders.cancelled FROM orders INNER JOIN customers ON orders.customer_id=customers.id where udid = ' + req.UDID + ' or phone  like "%%'+req.phone+'%%"  limit 0,100', function(err, rows, fields) {
            if (err) throw err;

            rows.forEach(function(item) {

                connection.query('SELECT * from properties where id=' + item.hotel_id + '  limit 0,10', function(err, rows, fields) {
                    if (err) throw err;

                    var req = {
                        Yamsafer_id: item.id,
                        amount: item.total_price,
                        time: item.created_at,
                        lat: rows[0].latitude,
                        lng: rows[0].longitude,
                        no_show: item.no_show,
                        checkin_date: item.checkin_date,
                        checkout_date: item.checkout_date,
                        Hotel: item.hotel_name,
                        cancelled: item.cancelled,
                        customer: customer._id
                    };

                    Transaction.create(req, function(err, transaction) {
                        if (err) {
                            return console.log(err);
                        }
                        customer.transactions.push(transaction);
                        customer.save();
                    });

                });
            });
        });

        //new call log for the customer
        var callLogReq = {
            customer: customer._id
        };
        CallLog.create(callLogReq, function(err, callLog) {
            if (err) {
                console.log(err);
            }
            customer.callLogs.push(callLog);
            customer.save();
        });
        cityToCoor.getLngLat(data.$country_code, function(lng, lat) {
            customer.cityLng = lng;
            customer.cityLat = lat;
            customer.save();
        });

        customer.save();

    });

};


// update the customer
exports.updateCustomer = function(data, customer) {

    var req = {

        UDID: data.UDID,
        name: data.$first_name+" " +data.$last_name,
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
        cityLng: undefined,
        cityLat: undefined

    };

    if (data["User Type"] == "iOS") {
        req.user_ios = {
            ios_app_release: data.$ios_app_release,
            ios_app_version: data.$ios_app_version,
            ios_device_model: data.$ios_device_model,
            ios_lib_version: data.$ios_lib_version,
            ios_version: data.$ios_version
        };
    } else {
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

    Customer.findById(customer._id, function(err, customer) {
        if (err) {
            return console.log(err);
        }
        if (!customer) {
            return console.log(404);
        }
        var updated = _.merge(customer, req);
        updated.save(function(err) {
            if (err) {
                return console.log(err);
            }


            // fetching data from Yamsafer

            var req = {
                UDID: 1014,
                email: "faris@yamsafer.me",
                phone: "972544735168",
            };

            connection.query('SELECT DISTINCT orders.id,orders.no_show,orders.checkin_date,orders.checkout_date,orders.hotel_id,orders.hotel_name,orders.total_price,orders.created_at,orders.cancelled FROM orders INNER JOIN customers ON orders.customer_id=customers.id where udid = ' + req.UDID + ' or phone  like "%%'+req.phone+'%%" limit 0,100', function(err, rows, fields) {
                if (err) throw err;

                rows.forEach(function(item) {

                    Transaction.findOne({
                        Yamsafer_id: item.id
                    },
                    function(err, transaction) {
                        if (err) {
                            return console.log(err);
                        }
                        if (!transaction) {

                            connection.query('SELECT * from properties where id=' + item.hotel_id + '  limit 0,10', function(err, rows, fields) {
                                if (err) throw err;

                                var req = {
                                    Yamsafer_id: item.id,
                                    amount: item.total_price,
                                    time: item.created_at,
                                    lat: rows[0].latitude,
                                    lng: rows[0].longitude,
                                    no_show: item.no_show,
                                    checkin_date: item.checkin_date,
                                    checkout_date: item.checkout_date,
                                    Hotel: item.hotel_name,
                                    cancelled: item.cancelled,
                                    customer: customer._id
                                };

                                Transaction.create(req, function(err, transaction) {
                                    if (err) {
                                        return console.log(err);
                                    }
                                    customer.transactions.push(transaction);
                                    customer.save();
                                });

                            });
                        }
                    });
                });
            });
        });

    });
};


function handleError(res, err) {
    return res.send(500, err);
}
