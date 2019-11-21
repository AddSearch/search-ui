# AddSearch Search UI Library

With the AddSearch Search UI library you can create beautiful, lightning fast, and cross-browser compatible 
search solutions quickly and effortlessly.

## Quick example
```html
<!-- Containers -->
<div id="searchfield"></div>
<div id="results"></div>
<div id="pagination"></div>

<script>
  // AddSearch JS client instance
  var client = new AddSearchClient('YOUR PUBLIC SITEKEY');

  // Search UI instance
  var searchui = new AddSearchUI(client);

  // Add Search UI components
  searchui.searchField({
    containerId: 'searchfield',
    placeholder: 'Keyword..',
    button: 'Search'
  });

  searchui.searchResults({
    containerId: 'results'
  });
  
  searchui.pagination({
    containerId: 'pagination'
  });
  
  searchui.start();
</script>
```

## Search UI instance and configuration
To create a Search UI instance, call the constructor ```new AddSearchUI(client, conf)``` 
with the mandatory [AddSearchClient](https://github.com/AddSearch/js-client-library) parameter and 
with an optional configuration parameter:

```js
var client = new AddSearchClient('YOUR PUBLIC SITEKEY');

var conf = {
  debug: true
};

// Search UI instance
var searchui = new AddSearchUI(client, conf);
```

The configuration object can contain following values:   

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| debug | true<br>false | false | Log events to console |
| matchAllQuery | true<br>false | false | Execute "match all" query when the Search UI is loaded |
| searchResultsPageUrl | String | null | Instead of searching on this page, redirect the user to a separate search results page |

After all components are added to the SearchUI object, the start function must be called:

```js
  searchui.start();
```

## Components
### Search field
Input field where keyword can be typed. Can include a button to execute the search.

```js
  searchui.searchField({
    containerId: 'searchfield',
    placeholder: 'Keyword..',
    button: 'Search'
  });
```

Settings that can be passed to the ```searchField``` function:

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| containerId | String | n/a | ID of the HTML component that will act as a container for the search bar |
| autofocus | true<br>false | true | Focus the input field automatically when the page is loaded |
| button | String | n/a | Add a button to execute the search. Button's label is the value of this setting |
| placeholder | String | n/a | Input field's placeholder text |
| searchAsYouType| true<br>false | false | Execute search after every keystroke |
| template | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/searchfield/searchfield.js) | Use a custom [Handlebars](https://handlebarsjs.com/) template |

### Autocomplete dropdown
Show suggested keyword, direct hits, or both under the search field as the keyword is being typed.
The default autocomplete template supports search suggestions. Create your own template to show search results.
Search suggestions need to be enabled from the AddSearch Dashboard before they are shown.

```js
  searchui.autocomplete({
    containerId: 'autocomplete',
    sources: [
      {
        type: 'suggestions'
      }
    ]
  });
```

Settings that can be passed to the ```autocomplete``` function:

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| containerId | String | n/a | ID of the HTML component that will act as a container for autocomplete results |
| template | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/autocomplete/autocomplete.js) | Use a custom [Handlebars](https://handlebarsjs.com/) template |
| hideAutomatically| boolean| true | Hide the autocomplete component when the search field is blurred |
| sources| Array | n/a | Array of data sources  |

The ```sources``` array can contain objects with following fields:

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| type | suggestions, search | n/a | Fetch search suggestions or search results |
| client | AddSearch JS Client instance | Client passed to the AddSearchUI constructor | Use a custom client to use specific filters or even different search index |
| jsonKey | String | n/a | If type is *search* results are appended to a JSON object ```searchResults.<jsonKey>``` before passed to the Handlebars template |

### Search results
The list of search results.

```js
  searchui.searchResults({
    containerId: 'searchresults'
  });
```

Settings that can be passed to the ```searchResults``` function:

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| containerId | String | n/a | ID of the HTML component that will act as a container for search results |
| template | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/searchresults/searchresults.js#L5) | Use a custom [Handlebars](https://handlebarsjs.com/) template |

### Pagination
Pagination. Typically below search results.

```js
  searchui.pagination({
    containerId: 'pagination'
  });
```

Settings that can be passed to the ```pagination``` function:

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| containerId | String | n/a | ID of the HTML component that will act as a container for the paging|
| template | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/pagination/pagination.js#L9) | Use a custom [Handlebars](https://handlebarsjs.com/) template |

## General functions
### Execute search
Execute a search query with a defined keyword. Common use cases include links of most popular keywords.
Clicking the link executes the search.
```js
  searchui.search(keyword);
```

### Hide autocomplete
Hide the autocomplete component. For example, a "close" button inside the autocomplete window would
call this function.
```js
  searchui.hideAutocomplete();
```

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