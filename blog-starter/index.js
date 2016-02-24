'use strict';
var express = require('express');
var config = require('./config/config.js');
var app = express();

var host = process.env.IP || 'localhost';
var port = process.env.PORT || 4000;
var sessionSecret = process.env.SESSION_SECRET || 'e70a1e1ee4b8f662f78'

app.use('/static', express.static(__dirname + '/static'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
config(app, host, port, sessionSecret);

var server = app.listen(port, function () {
  console.log(
    'Example app listening at http://%s:%s',
    server.address().address,
    server.address().port
  );
});
