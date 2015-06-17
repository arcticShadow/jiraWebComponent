'use strict';
var conf = require('../config');
var JiraAPI = require('jira').JiraApi;
var bluebird = require('bluebird');
var jira = new JiraAPI(conf.protocol,
    conf.host,
    conf.port,
    conf.user,
    conf.password,
    conf.apiVersion,
    conf.verbose,
    conf.strictSSL);

module.exports = function(options){
    var filterParam = (options||{}).filterParam || 'filterID';

    conf.user = options.user||conf.user;
    conf.password = options.password||conf.password;
    conf.host = options.host||conf.host;
    conf.port = options.user||conf.port;

    return function(req, res, next) {
        bluebird.fromNode(function(callback){
            jira.searchJira('filter=' + req.params[filterParam], ['summary', 'key', 'issuetype'], function(er,data){
                callback(er, data);
            });
        }).then(function(data){
            res.send(data);
        }).error(function (e) {
            res.send('something went wrong - Check the terminal log: ' + e.message);
            next();
        });


    };
};