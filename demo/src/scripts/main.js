
// new component
var jiraWebComponent = require('../../../lib/jiraWebComponent.js');

// render to xyz with configuration abc
jiraWebComponent.configure({
    user: 'xxx',
    pass: 'yyy',
    host: 'localhost',
    port: 3000
});
jiraWebComponent.render('74651', '#component');
