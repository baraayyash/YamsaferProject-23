'use strict';

var _ = require('lodash');
var Salesman = require('./salesman.model');
var engage = require('../services/engage');
var Transaction = require('../transaction/transaction.model');

// Get list of salesmans
exports.index = function(req, res) {
    Salesman.find(function(err, salesmans) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(200, salesmans);
    });
};

// Get a single salesman
exports.show = function(req, res) {
    Salesman.findById(req.params.id, function(err, salesman) {
        if (err) {
            return handleError(res, err);
        }
        if (!salesman) {
            getDataFromMixP(req, res);

        }
        Salesman.populate(salesman, {
            path: 'transactions'
        }, function(err, customer) {
            return res.json(salesman);
        });
    });
};

// Creates a new salesman in the DB.
exports.create = function(req, res) {
    Salesman.create(req.body, function(err, salesman) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, salesman);
    });
};

// Updates an existing salesman in the DB.
exports.update = function(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Salesman.findById(req.params.id, function(err, salesman) {
        if (err) {
            return handleError(res, err);
        }
        if (!salesman) {
            return res.send(404);
        }
        var updated = _.merge(salesman, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, salesman);
        });
    });
};

// Deletes a salesman from the DB.
exports.destroy = function(req, res) {
    Salesman.findById(req.params.id, function(err, salesman) {
        if (err) {
            return handleError(res, err);
        }
        if (!salesman) {
            return res.send(404);
        }
        salesman.remove(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};
 var saveData = function(data, res) {
     var req = {
         name: data["$first_name"] + data["$last_name"],
         email: data["$email"]
     };

     Salesman.create(req, function(err, salesman) {
         if (err) {
             return handleError(res, err);
         }
         for (var i in data.$transactions) {
             var req = {
                 amount: data.$transactions[i].$amount,
                 time: data.$transactions[i].$time,
                 salesman: salesman._id
             };
             Transaction.create(req, function(err, transaction) {
                 if (err) {
                     return handleError(res, err);
                 }
                 salesman.transactions.push(transaction);
                 salesman.save();
             });
         }
         return console.log("done");
     });

 };
  
var getDataFromMixP = function(req, res) {
    var udid = req.params.id;
    console.log("enter " + udid);
    engage.queryEngageApi({
        where: "properties[\"$first_name\"] == \"" + "Naem" + "\"" || ""
    }, function(queryDone) {
        saveData(JSON.parse(queryDone, res));

    });
};

function handleError(res, err) {
    return res.send(500, err);
}
