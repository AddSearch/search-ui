# AddSearch Search UI Library

With this library you can create beautiful, lightning fast, and cross-browser compatible search solutions.

## Quick start
```html
<!-- Containers -->
<div id="searchbar"></div>
<div id="results"></div>
<div id="pagination"></div>

<script>
  // AddSearch JS client instance
  var client = new AddSearchClient('YOUR PUBLIC SITEKEY');

  // Configuration
  var conf = {
    debug: true
  };

  // Search UI instance
  var searchui = new AddSearchSearchUI(client, conf);

  // Add Search UI components
  searchui.searchBar({
    containerId: 'searchbar',
    placeholder: 'Keyword..',
    button: 'Search'
  });

  searchui.searchResults({
    containerId: 'results'
  });
  
  searchui.pagination({
    containerId: 'pagination'
  });
</script>
```

## Search UI instance and configuration
To create a Search UI instance, call the constructor ```new AddSearchSearchUI(client, conf);``` 
with the mandatory [AddSearchClient](https://github.com/AddSearch/js-client-library) parameter and 
with an optional configuration parameter.

```js
var client = new AddSearchClient('YOUR PUBLIC SITEKEY');

var conf = {
  debug: true
};

// Search UI instance
var searchui = new AddSearchSearchUI(client, conf);
```

The configuration object can contain following fields and values:   

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| debug | true<br>false | false | Log events to console |

## Components

### Search bar

Input field where keyword can be typed. Can include a button to execute the search.

```js
  searchui.searchBar({
    containerId: 'searchbar',
    placeholder: 'Keyword..',
    button: 'Search'
  });
```

Settings that can be passed to the ```searchBar``` function:

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| containerId | String | n/a | ID of the HTML component that will act as a container for this search bar |
| autofocus | true<br>false | true | Should the input field be focused automatically when the page is loaded |
| button | String | n/a | Add a button to execute the search next to the search field. Button's text is the value of this setting |
| placeholder | String | n/a | Input field's placeholder text |
| searchAsYouType| true<br>false | false | Execute search after every keystroke |

## Supported web browsers
This library is tested on
- Chrome
- Firefox
- Edge
- Safari 6.1+
- Internet Explorer 10+

## Development
To modify this library, clone the repository and follow these steps:
#### Install dependencies
```sh
npm install
```

Re-compile when source files change while developing
```sh
npm run watch
```

#### Run tests
Run automated tests
```sh
npm test
```

#### Build for production
Build a production bundle. The file is saved under the *dist/* folder
```sh
npm run build
```

## Support

Feel free to send any questions, ideas and suggestions at [support@addsearch.com](support@addsearch.com).