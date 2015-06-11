# Jira Web Component

## Usage


```js
// new component
var jiraWebComponent = require('jiraWebComponent');

// Custom Jira Config
jiraWebComponent.configure({
    user: 'xxx',
    pass: 'yyy',
    host: 'localhost', // I run this through a Proxy
    port: 3000
});
jiraWebComponent.render('74651', '#component');

```


## Package managers

### npm

```bash
$ npm install arcticShadow/jiraWebComponent
```

## API

### jiraWebComponent.configure(properties)
Takes an object of properties and merges them into the config object.

The defaults are below, you can override any/all of them.
```js
{        
    protocol: 'http',
    host: 'jira-proxy.devbox-dokku.orion.internal',
    port: '80',
    apiVersion: '2',
    verbose: false,
    strictSSL: false
}
```

### jiraWebComponent.render(filterID, selector)
filterID is a Jira filter ID.

selector is anything valid to pass to document.querySelecor. This is where your componentent will render.

## Credits

This was built by Cole Diffin

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
