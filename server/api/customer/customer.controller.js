'use strict';

var _ = require('lodash');
var Customer = require('./customer.model');
var Transaction = require('../transaction/transaction.model');
var Mixpanel = require('../services/mixpanel');
var express = require('express');
var engage = require('../services/engage');
var customerService = require('../services/customerService');
var CallLog = require('../callLog/callLog.model');
var ioOut = require('socket.io-client');
var callLogService = require('../services/callLogService');


//Get list of customers
exports.index = function(req, res) {
    Customer.find(function(err, customers) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, customers);
    });
};

// Get a single customer
exports.show = function(req, res) {
    Customer.findById(req.params.id, function(err, customer) {
        console.log(req.params.id);
        if (err) {
            return handleError(res, err);
        }
        if (!customer) {
            return res.send(404);
        }
        Customer.populate(customer, {
            path: 'transactions'
        }, function(err, customer) {
            Customer.populate(customer, {
                path: 'callLogs'
            }, function(err, customer) {
                     return res.json(customer);

            });
        });
    });
};

//search for a customer using name,phone,udid.
exports.findCustomer = function(req, res) {

    //this filter will allow to search for any data that "contains" what we want.
    var filter = new RegExp(req.params.id, "i");
    Customer.find({
            $or: [{
                name: filter
            }, {
                UDID: filter
            }, {
                phone: filter
            }]
        },
        function(err, customer) {
            if (err) {
                return handleError(res, err);
            }
            if (!customer) {
                return res.send(404);
            }
            Customer.populate(customer, {
                path: 'transactions'
            }, function(err, customer) {
                return res.json(customer);

            });

        });
};


// Creates a new customer in the DB.
exports.create = function(req, res) {
    Customer.create(req.body, function(err, customer) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, customer);
    });
};


// Updates an existing customer in the DB.
exports.update = function(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Customer.findById(req.params.id, function(err, customer) {
        if (err) {
            return handleError(res, err);
        }
        if (!customer) {
            return res.send(404);
        }
        var updated = _.merge(customer, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, customer);
        });
    });
};

// Deletes a customer from the DB.
exports.destroy = function(req, res) {
    Customer.findById(req.params.id, function(err, customer) {
        if (err) {
            return handleError(res, err);
        }
        if (!customer) {
            return res.send(404);
        }
        customer.remove(function(err) {
            if (err) {
                return handleError(res, err);
            }
            console.log(customer);
            return res.send(204);
        });
    });
};

/* this function will be called when twilio asked for customer status, it will return true or false, also it will
if the customer doesn't exist, it will call the get data from mixpanel function and then creat a new customer*/

exports.blocked = function(req, res) {
    Customer.findOne({
        UDID: req.params.id
    }, function(err, customer) {
        if (err) {
            return res.json("error");
        }
        if (!customer) {
            Mixpanel.getDataFromMixPB(req.params.id,
                function(data) {
                  customerService.createCustomer(data); //save the data to craete a new customer
                });
            return res.json("false");
        }
        if (customer) {
// the customer exists so we need to update his data
            Mixpanel.getDataFromMixPB(req.params.id,
                function(data) {
                  customerService.updateCustomer(data,customer,res); //update the customer.
                });

            //each time customer exist  update  call logs with new current Time
            var newCallLogReq = {
                customer: customer._id
            };
            CallLog.create(newCallLogReq, function(err, callLog) {
                if (err) {
                    console.log("error creatng new log ");
                    return handleError(res, err);
                }
                customer.callLogs.push(callLog);
                customer.save();
                callLogService.findOneCallLogByID(customer._id, function(resulttt){
                    //emit to server with latest callLogObject
                    var socketOut = ioOut.connect('http://localhost:9000', {
                        'force new connection': true
                    });
                    socketOut.emit('trigerEvent', resulttt);
                })

            });
            if ((customer.blocked)) {
                return res.json("true");
            } else {
                return res.json("false");
            }
        }
    });

};

// Block single customer
exports.block = function(req, res) {

    var blockinfo = {
        blocked: req.body.blocked,
    };

    console.log(blockinfo);
    Customer.findOne({
        _id: req.body.id
    }, function(err, customer) {
        if (err) {
            console.log("err");
            return handleError(res, err);
        }
        if (!customer) {
            return "does not exist";
        }
        if (customer) {
            var updated = _.merge(customer, blockinfo);
            updated.save(function(err) {
                if (err) {
                    return handleError(res, err);
                }
                return res.json("updated");
            });
        }
    });

};

function handleError(res, err) {
    return res.send(500, err);
}

//this function will be called when data from mix panel needed.
exports.getDataFromMixP = function(req, res) {
    Mixpanel.getDataFromMixP(req.param('udid'),res);
};
