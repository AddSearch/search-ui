# AddSearch Search UI Library

## Quick start
```html
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
| debug | true, false | false | Log events to console |

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
| button | String | n/a | If a value is given, a button to execute the search is added next to the search field. Button's label is the value of this setting parameter. |
| placeholder | String | n/a | If a value is given, the value of this setting parameter is added as a placeholder text to the input field |
| autofocus | true, false | true | Should the input field be focused automatically when the page is loaded |

## Supported web browsers
The client is tested on
- Chrome
- Firefox
- Edge
- Safari 6.1+
- Internet Explorer 10+

## Development
To modify the Search UI library, clone this repository and execute following commands.
#### Install dependencies
```sh
npm install
```

#### Watch
Compile automatically when source files change
```sh
npm run watch
```

#### Run tests
```sh
npm test
```

#### Build
```sh
npm run build
```

Built bundle is saved under the *dist/* folder

## Support

Feel free to send any questions, ideas and suggestions at [support@addsearch.com](support@addsearch.com).