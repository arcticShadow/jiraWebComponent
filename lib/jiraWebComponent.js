
'use strict';
var conf = require('../config');
var JiraAPI = require('jira').JiraApi;
var insertCss = require('insert-css');
var fs = require('fs');
var _ = require('lodash');
var jira = new JiraAPI(conf.protocol,
    conf.host,
    conf.port,
    conf.user,
    conf.password,
    conf.apiVersion,
    conf.verbose,
    conf.strictSSL);


var css = fs.readFileSync(__dirname + '/tmp/theme.css', 'utf8');
insertCss(css, { prepend: true });


module.exports = {
    configure: function(config) {
        conf.overrides(config);

        jira = new JiraAPI(conf.protocol,
            conf.host,
            conf.port,
            conf.user,
            conf.password,
            conf.apiVersion,
            conf.verbose,
            conf.strictSSL);
    },

    render: function (filterId, selector){
        jira.searchJira('filter=' + filterId, ['summary', 'key', 'issuetype'], function(error, data) {
            //render template
            console.log(error, data);
/*
            var tableData = _.map(data, function(value, index, collection){
                return row;
            });*/
            var template = _.template(fs.readFileSync(__dirname + '/../dist/src/template.html', 'utf8'));


            var selectorNode = document.querySelector(selector);
            selectorNode.innerHTML = template({
                headings:[1,2,3],
                issues: data.issues
            });
        });

    }
};

