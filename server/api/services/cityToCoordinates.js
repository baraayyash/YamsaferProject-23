"use strict";
var _ = require('lodash');
var geocoder = require('geocoder');

//this function translates city in request and  return longitude and latitude 

exports.getLngLat = function(req, callback) {
    geocoder.geocode(req.toLowerCase(), function(err, data) {
        callback(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng);
    });
};
