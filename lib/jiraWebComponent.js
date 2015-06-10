
'use strict';
var conf = require('../config');
var JiraAPI = require('jira').JiraApi;
var insertCss = require('insert-css');
var fs = require('fs');
var jira = new JiraAPI(conf.protocol, conf.host, conf.port, conf.user, conf.password, conf.apiVersion);
var css = fs.readFileSync(__dirname + '/tmp/theme.css', 'utf8');

insertCss(css, { prepend: true });

module.exports = {
  configure: function(config) {
//    conf.overrides(config);
    jira = new JiraAPI();
  },

  render: function (filterId, elementId){
    jira.searchJira('filter=' + filterId, {},function(error, data) {
      //render template
      console.log(error, data);
    });

  }
};

