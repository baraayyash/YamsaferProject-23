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
  console.log("start");
    Salesman.findById(req.params.id, function(err, salesman) {
        if (err) {
        console.log("ee");
            return handleError(res, err);
        
        }
        if (!salesman) {
            // return res.send(404);
            getDataFromMixP(req,res);

        }
        Salesman.populate(salesman,{path:'transactions'},function(err,customer){
      return res.json(salesman);
  });
      // return res.json(salesman);
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
 var saveData = function(data,res) {
    var req ={
    name: data["$first_name"]+data["$last_name"],
    email: data["$email"]
     };
    
    //     Customer.create(req, function(err, customer) {
    // if(err) { return handleError(res, err); }
    //   //console.log("added");
    //   for (var i in data.$transactions) {
    //     var req ={
    //       amount: data.$transactions[i].$amount,
    //       time: data.$transactions[i].$time,
    //       customer: customer._id
    //              };
    //   Transaction.create(req, function(err, transaction) {
    //   if(err) { return handleError(res, err); }
    //  customer.transactions.push(transaction);
    //  customer.save();
    //   });
    //    }
    //   return console.log("done");
    // });



        Salesman.create(req, function(err, salesman) {
        if (err) {
            return handleError(res, err);
        }
                //console.log("added");
      for (var i in data.$transactions) {
        var req ={
          amount: data.$transactions[i].$amount,
          time: data.$transactions[i].$time,
          salesman: salesman._id
                 };
      Transaction.create(req, function(err, transaction) {
      if(err) { return handleError(res, err); }
     // return res.json(201, transaction);
     salesman.transactions.push(transaction);
     salesman.save();
      });
       }
      return console.log("done");
    
        //return res.json(201, salesman);
    });

  };
  

var getDataFromMixP = function(req, res) {
  //var udid = req.param('udid');
    var udid=req.params.id;
    console.log("enter "+udid);
    engage.queryEngageApi({
        where: "properties[\"$first_name\"] == \"" + "Naem" + "\"" || ""
    }, function(queryDone) {  
       // res.json(queryDone);
        // var jsondata = JSON.parse(queryDone);
        // results[i].$properties[r]
         saveData(JSON.parse(queryDone,res));
        // console.log(JSON.parse(queryDone));
        //res.end();
    });
};
function handleError(res, err) {
    return res.send(500, err);
}
