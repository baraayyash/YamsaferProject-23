'use strict';

var _ = require('lodash');
var Message = require('./message.model');
//var Mixpan-el = require('../services/mixpanel');
var express = require('express');
var engage = require('../services/engage');

// Get list of messages
exports.index = function(req, res) {

    
    var udid = req.param('udid');
    engage.queryEngageApi({
        where: "properties[\"$first_name\"] == \"" + udid + "\"" || ""
    }, function(queryDone) {  
        res.json(queryDone);
        res.end();
    });
};

// Get a single message
exports.show = function(req, res) {
    Message.findById(req.params.id, function(err, message) {
        if (err) {
            return handleError(res, err);
        }
        if (!message) {
            return res.send(404);
        }
        return res.json(message);
    });
};

// Creates a new message in the DB.
exports.create = function(req, res) {
    Message.create(req.body, function(err, message) {
        if (err) {
            return handleError(res, err);
        }
        return res.json(201, message);
    });
};

// Updates an existing message in the DB.
exports.update = function(req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Message.findById(req.params.id, function(err, message) {
        if (err) {
            return handleError(res, err);
        }
        if (!message) {
            return res.send(404);
        }
        var updated = _.merge(message, req.body);
        updated.save(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, message);
        });
    });
};

// Deletes a message from the DB.
exports.destroy = function(req, res) {
    Message.findById(req.params.id, function(err, message) {
        if (err) {
            return handleError(res, err);
        }
        if (!message) {
            return res.send(404);
        }
        message.remove(function(err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

function handleError(res, err) {
    return res.send(500, err);
}
