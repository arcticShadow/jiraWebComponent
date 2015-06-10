var conf = require('./config.json');
var _ = require('lodash');

var defaults = {
    protocol: 'http',
    host: 'jira',
    port: '80',
    apiVersion: '2.0.alpha1',
    verbose: false,
    strictSSL: false
};


module.exports = function(){
    var data = {};

    data.overrides = function (a) {
         _.assign(data, a);
    };

    _.assign(data, defaults, conf);

    return data;
};
