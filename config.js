'use strict';
var fs = require('fs'),
    _ = require('lodash'),
    conf,
    defaults,
    data,
    configFile;

conf = data = {};

configFile = './config.json';

defaults = {
    protocol: 'http',
    host: 'jira',
    port: '80',
    apiVersion: '2',
    verbose: false,
    strictSSL: false
};

data.overrides = function (a) {
     _.assign(data, a);
};

_.assign(data, defaults, conf);

if( fs.existsSync(configFile) ){
    data.overrides(require(configFile));
}

module.exports = data;
