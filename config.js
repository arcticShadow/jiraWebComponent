'use strict';
var conf = {};
conf = require('./config.json');
var _ = require('lodash');

var defaults = {
    protocol: 'http',
    host: 'jira',
    port: '80',
    apiVersion: '2',
    verbose: false,
    strictSSL: false
};

var data = {};

data.overrides = function (a) {
     _.assign(data, a);
};

_.assign(data, defaults, conf);



module.exports = data;
