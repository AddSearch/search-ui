# AddSearch Search UI Library

Use Search UI library to create fast, mobile-friendy, and cross-browser compatible search solutions quickly and 
effortlessly.

## Quick example
```html
<!-- Libraries -->
<script src="https://cdn.jsdelivr.net/npm/addsearch-js-client@0.2/dist/addsearch-js-client.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/addsearch-search-ui@0.2/dist/addsearch-search-ui.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/addsearch-search-ui@0.2/dist/addsearch-search-ui.min.css" />

<!-- Containers for UI components-->
<div id="searchfield-container"></div>
<div id="results-container"></div>
<div id="pagination-container"></div>

<script>
  // AddSearch JS client instance
  var client = new AddSearchClient('YOUR PUBLIC SITEKEY');

  // Search UI instance
  var searchui = new AddSearchUI(client);

  // UI components
  searchui.searchField({
    containerId: 'searchfield-container',
    placeholder: 'Keyword..',
    button: 'Search'
  });

  searchui.searchResults({
    containerId: 'results-container'
  });
  
  searchui.pagination({
    containerId: 'pagination-container'
  });
  
  // Start after all components are added
  searchui.start();
</script>
```

## Examples
Basic example
- [Try it out](https://demo.addsearch.com/search-ui-examples/basic/)
- [View source code](https://github.com/AddSearch/search-ui/tree/master/examples/basic/index.html)

Advanced example with all components
- [Try it out](https://demo.addsearch.com/search-ui-examples/components/)
- [View source code](https://github.com/AddSearch/search-ui/tree/master/examples/components/index.html)

## Search UI instance and configuration
To create a Search UI instance, call the constructor ```new AddSearchUI(client, conf)``` 
with the mandatory [AddSearchClient](https://github.com/AddSearch/js-client-library) parameter and 
an optional configuration parameter:

```js
var client = new AddSearchClient('YOUR PUBLIC SITEKEY');

var conf = {
  debug: true
};

var searchui = new AddSearchUI(client, conf);
```

The configuration object can contain following values:   

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| debug | boolean | false | Log events to console and enable [Redux DevTools](https://github.com/reduxjs/redux-devtools) |
| matchAllQuery | boolean | false | Execute "match all" query when the Search UI is started |
| onFilterChange | function | n/a | Function to call when active filters are changed (for conditional visibility) |
| reduxStore | Object | n/a | Redux store (with redux-thunk middleware) to use instead of creating a new one |
| searchResultsPageUrl | String | null | Redirect the user to a separate search results page, instead of showing search results on the current page |

After all UI components have been added to the SearchUI object, the start function must be called:

```js
  searchui.start();
```

## Components
### Search field
The search field. Can include a button to execute the search.

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
| autofocus | boolean | true | Focus the input field automatically when the page is loaded |
| button | String | n/a | Add a button to execute the search. The value of this field is the Button's label text |
| placeholder | String | n/a | Search field's placeholder text |
| searchAsYouType| boolean | false | Execute search after every keystroke |
| ignoreAutocomplete| boolean | false | Don't show the autocomplete component if something is typed to this field (in case you have multiple fields) |
| ignoreSearchResultsPageUrl | boolean | false | Don't redirect the user to a search results page from this field (in case you have multiple fields) |
| template | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/searchfield/templates.js) | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template |

### Autocomplete
Show suggested keyword, search results, or both under the search field.
The default autocomplete template supports search suggestions that must be enabled from the AddSearch Dashboard
before using the feature. Create your own template if you want to to show search results or more advanced views.

```js
  searchui.autocomplete({
    containerId: 'autocomplete',
    sources: [
      {
        type: AddSearchUI.AUTOCOMPLETE_TYPE.SUGGESTIONS
      }
    ]
  });
```

Settings that can be passed to the ```autocomplete``` function:

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| containerId | String | n/a | ID of the HTML component that will act as a container for the autocomplete dropdown |
| categoryAliases | Object | n/a | A map of category aliases used by the *categorySelectionFunction* |
| categorySelectionFunction | Function | [defaultCategorySelectionFunction](https://github.com/AddSearch/search-ui/blob/master/src/util/handlebars.js) | A function to select and format the *category* information on the bottom of each search result |
| hideAutomatically| boolean| true | Hide the autocomplete dropdown when the search field is blurred |
| onShow | function | n/a | A function to call when the autocomplete is shown. Called as the container as parameter |
| template | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/autocomplete/templates.js) | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template |
| sources| Array | n/a | Array of data sources  |

The ```sources``` array can contain objects with the following fields:

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| type | AddSearchUI.AUTOCOMPLETE_TYPE.SUGGESTIONS, AddSearchUI.AUTOCOMPLETE_TYPE.SEARCH | n/a | Fetch search suggestions or search results |
| client | AddSearch JS Client instance | Client passed to the AddSearchUI constructor | Use a custom client to use specific filters or different search index |
| jsonKey | String | n/a | If the type is *AddSearchUI.AUTOCOMPLETE_TYPE.SEARCH*, the Handlebars template can access the results from the JSON object ```searchResults.<jsonKey>``` |

### Search results
Actual search results.

```js
  searchui.searchResults({
    containerId: 'searchresults'
  });
```

Settings that can be passed to the ```searchResults``` function:

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| containerId | String | n/a | ID of the HTML component that will act as a container for search results |
| categoryAliases | Object | n/a | A map of category aliases used by the *categorySelectionFunction* |
| categorySelectionFunction | Function | [defaultCategorySelectionFunction](https://github.com/AddSearch/search-ui/blob/master/src/util/handlebars.js) | A function to select and format the *category* information on the bottom of each search result |
| template | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/searchresults/templates.js) | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template for search results |
| template_resultcount | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/searchresults/templates.js) | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template for "Number of results" |
| template_noresults | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/searchresults/templates.js) | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template for "No search results found" |

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
| template | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/pagination/templates.js) | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template |

To change the number of results shown per page, use AddSearch JS client's [setPaging function](https://github.com/AddSearch/js-client-library#manage-paging)

### Sort by
Component to change the order of search results.

```js
  searchui.sortBy({
    containerId: 'sortby',
    options: [
      {
        label: 'Sort by relevance',
        sortBy: 'relevance',
        order: 'desc'
      },
      {
        label: 'Oldest first',
        sortBy: 'date',
        order: 'asc'
      },
      {
        label: 'Most expensive first',
        sortBy: 'custom_fields.price',
        order: 'desc'
      }
    ]
  });
```

Settings that can be passed to the ```sortBy``` function:

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| containerId | String | n/a | ID of the HTML component that will act as a container for the paging|
| template | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/sortby/templates.js) | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template |
| type | AddSearchUI.SORTBY_TYPE.SELECT_LIST, AddSearchUI.SORTBY_TYPE.RADIO_GROUP | Select list | "Sort by" menu shown as select list or as a radio button group |

The ```options``` array can contain objects with following fields:

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| label | String | n/a | Label text to show |
| sortBy | relevance, date, custom_field | n/a | The field to sort the search results by |
| order | desc, asc | desc | Ascending order (a-z or 1-9) or descending order (z-a, 9-1) |

### Filters
Components to let the user filter search results by URL patterns or custom field values.

```js
  searchui.filters({
    containerId: 'filters',
    type: AddSearchUI.FILTER_TYPE.CHECKBOX_GROUP,
      options: {
        cars: {
          label: 'Apple products',
          filter: {'custom_fields.brand': 'apple'}
        }
    }
  });
```

Settings that can be passed to the ```filters``` function:

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| containerId | String | n/a | ID of the HTML component that will act as a container for filters |
| type | AddSearchUI.FILTER_TYPE.CHECKBOX_GROUP, AddSearchUI.FILTER_TYPE.RADIO_GROUP, AddSearchUI.FILTER_TYPE.SELECT_LIST, AddSearchUI.FILTER_TYPE.TABS, AddSearchUI.FILTER_TYPE.TAGS | n/a | Component's type |
| template | String | [Default templates](https://github.com/AddSearch/search-ui/blob/master/src/components/filters/templates.js) | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template |
| options | Object | n/a | Object containing filtering options |

The options object can contain multiple filtering options. If the type is *Tabs*, *Select list*, or *Radio group*, just one of the 
options can be activated at the any given time. If the filter type is *Checkbox* or *Tags*, any number of filters can be activated. 
The option key is shared across filter components, so all filters with the same key are enabled when any of the filters
with that key is clicked.

Fields in ```options```:

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| label | String | n/a | Label shown for the user |
| filter | Object | n/a | Filter object.  |

### Facets
Display facets and let the user filter results by facets (i.e. dynamic property filters).

```js
  searchui.facets({
    containerId: 'facets'
  });
```
Before using this component, add appropriate facets to your client instance so the information is fetched from the 
search index:

```js
  client.addFacetField('custom_fields.brand');
```

Settings that can be passed to the ```facets``` function:

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| containerId | String | n/a | ID of the HTML component that will act as a container for facets |
| facetsFilter | function | n/a | Custom JS function that receives facets in an array, removes some of them, and returns a filtered facet array |
| field | String | n/a | Same field that you passed to the JS client. E.g. *custom_fields.brand* |
| template | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/facets/templates.js) | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template |

### Active filters
Show active filters and facets. Let user remove specific filters or clear everything,

```js
  searchui.activeFilters({
    containerId: 'activefilters'
  });
```

Settings that can be passed to the ```activeFilters``` function:

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| containerId | String | n/a | ID of the HTML component that will act as a container for active filters list |
| clearAll | boolean | true | Show "clear all filters" button if more than one filter is active |
| template | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/activefilters/templates.js) | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template |

## General functions
### Execute search
Execute a search query with a specific keyword. Common use cases include links of most popular keywords:
Clicking the keyword executes the search.
```js
  searchui.search(keyword);
```

### Clear search
Clear the keyword and enabled filters.
```js
  searchui.clear();
```

### Hide autocomplete
Hide the autocomplete component. For example, a "close" button inside the autocomplete modal would
call this function.
```js
  searchui.hideAutocomplete();
```

### Register a custom Handlebars helper
Handlebars Helpers can be used to implement functionality that is not part of the Handlebars language itself.
Read more at [handlebarsjs.js](https://handlebarsjs.com/guide/expressions.html#helpers).
```js
  // This function can be called in a Handlebars template: {{toUpperCase "foo"}}
  searchui.registerHandlebarsHelper('toUpperCase', function(param) {
    return param.toUpperCase();
  });
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

#### Code
Re-compile when source files change while developing
```sh
npm run watch
```

#### Run tests
Run automated tests
```sh
npm test
```
Run automatically when tests change
```sh
npm run test -- --watch
```

#### Build for production
Build a production bundle. The file is saved under the *dist/* folder
```sh
npm run build
```

## Support
Feel free to send any questions, ideas, and suggestions at [support@addsearch.com](mailto:support@addsearch.com) or 
visit [addsearch.com](https://www.addsearch.com/) for more information.