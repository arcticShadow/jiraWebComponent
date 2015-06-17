'use strict';
var insertCss = require('insert-css');
var    fs = require('fs');
var    template = require('lodash').template,
    request = require('superagent'),
    bluebird = require('bluebird');

// Frontend Module - Options can be used to configure the backend calls.
module.exports = function (options){
    var jiraResultsTableTemplate,
    css,
    requestParams;

    jiraResultsTableTemplate = template(fs.readFileSync(__dirname + '/../dist/src/template.html', 'utf8'));

    css = fs.readFileSync(__dirname + '/tmp/theme.css', 'utf8');
    insertCss(css, { prepend: true });

    options = (options||{});

    requestParams = {
        host: options.host||window.location.hostname,
        port: options.port||window.location.port,
        path: options.path||'jiraSearch'
    };

    return {
        render: function(filterID, selector){
            var url = 'http://' +
                requestParams.host + ':' +
                requestParams.port + '/' +
                requestParams.path + '/' +
                filterID;

            bluebird.fromNode(function(callback) {
                request.get(url, callback);
            }).then(function(data) {

                var selectorNode = document.querySelector(selector);
                selectorNode.innerHTML = jiraResultsTableTemplate({
                    headings:[1,2,3],
                    issues: data.body.issues
                });

            });

        }
    };
};