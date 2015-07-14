"use strict";
var _ = require('lodash');


  var mysql      = require('mysql');

var connection = mysql.createConnection({
  driver    : 'mysql',
 host      : 'api-staging.yamsafer.me',
 database  :  'thewall',
 user  : 'root',
 password  : 'yamsaferCRMteam',
 charset   : 'utf8',
 collation : 'utf8_unicode_ci',
 prefix    : '',
});

exports.con = function(connection){
    return connection;
}

connection.connect();
