# AddSearch Search UI Library

With the AddSearch Search UI library you can create lightning fast and cross-browser compatible 
search solutions quickly and effortlessly.

## Quick example
```html
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
  
  // Must be called after all components are added
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
| debug | true<br>false | false | Log events to console and enable Redux DevTools |
| matchAllQuery | true<br>false | false | Execute "match all" query when the Search UI is started |
| reduxStore | Object | n/a | Redux store (with redux-thunk middleware) to use instead of creating a new store |
| searchResultsPageUrl | String | null | Redirect the user to a separate search results page with this URL instead of showing search results on this page |

After all UI components have been added to the SearchUI object, the start function must be called:

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
| template | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/searchfield/templates.js) | Custom [Handlebars](https://handlebarsjs.com/) template |

### Autocomplete
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
| template | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/autocomplete/templates.js) | Custom [Handlebars](https://handlebarsjs.com/) template |
| hideAutomatically| boolean| true | Hide the autocomplete component when the search field is blurred |
| categorySelectionFunction | Function | [defaultCategorySelectionFunction](https://github.com/AddSearch/search-ui/blob/master/src/util/handlebars.js) | A function to select and format the *category* information on the bottom of each search result |
| categoryAliases | Object | n/a | A map of category aliases used by *categorySelectionFunction* |
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
| template | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/searchresults/templates.js) | Custom [Handlebars](https://handlebarsjs.com/) template for search results |
| template_resultcount | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/searchresults/templates.js) | Custom [Handlebars](https://handlebarsjs.com/) template for "Number of results" |
| template_noresults | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/searchresults/templates.js) | Custom [Handlebars](https://handlebarsjs.com/) template for "No search results found" |
| categorySelectionFunction | Function | [defaultCategorySelectionFunction](https://github.com/AddSearch/search-ui/blob/master/src/util/handlebars.js) | A function to select and format the *category* information on the bottom of each search result |
| categoryAliases | Object | n/a | A map of category aliases used by *categorySelectionFunction* |

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
| template | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/pagination/templates.js) | Custom [Handlebars](https://handlebarsjs.com/) template |

### Sort by
Component for the user to decide the order of search results.

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
| template | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/sortby/templates.js) | Custom [Handlebars](https://handlebarsjs.com/) template |
| type | AddSearchUI.SORTBY_TYPE.RADIO_GROUP, AddSearchUI.SORTBY_TYPE.SELECT_LIST | Select list | "Sort by" menu in a select list or in a group of radio buttons |

The ```options``` array can contain objects with following fields:

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| label | String | n/a | Text to show in the sort by menu |
| sortBy | relevance, date, custom_field | n/a | Sort by this field |
| order | desc, asc | desc | Ascending order (a-z or 1-9) or descending order (z-a, 9-1) |

### Filters
Let the user filter search results by URL patterns or custom field values.

```js
  searchui.filters({
    containerId: 'activefilters',
    type: AddSearchUI.FILTER_TYPE.CHECKBOX_GROUP,
      options: {
        cars: {
          label: 'Cars',
          filter: {"doc.custom_fields.category": "cars"}
        }
    }
  });
```

Settings that can be passed to the ```filters``` function:

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| containerId | String | n/a | ID of the HTML component that will act as a container for filters |
| type | AddSearchUI.FILTER_TYPE.CHECKBOX_GROUP, AddSearchUI.FILTER_TYPE.RADIO_GROUP, AddSearchUI.FILTER_TYPE.SELECT_LIST, AddSearchUI.FILTER_TYPE.TABS, AddSearchUI.FILTER_TYPE.TAGS | n/a | Filter component's type |
| template | String | [Default templates](https://github.com/AddSearch/search-ui/blob/master/src/components/filters/templates.js) | Custom [Handlebars](https://handlebarsjs.com/) template |
| options | Object | n/a | Object containing filtering options |

The options object can contain multple filtering options. In *Tabs* and *Radio group* filters just one of the 
options can be activated. In other filter types any number of options can be activated. The option key
is shared across filter components, so all filters with the same key are enabled when any of the filters
is clicked.

Fields in ```options```:

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| label | String | n/a | Label shown for the user |
| filter | json | n/a | Filter object.  |

### Facets
Show facets and let the user filter results by facets.

```js
  searchui.facets({
    containerId: 'activefilters'
  });
```
Before using this component, add appropriate facet fields to your client instance:

```js
  client.addFacetField('custom_fields.brand');
```

Settings that can be passed to the ```facets``` function:

| Key | Possible values | Default value | Description |
| --- | --- | --- | --- |
| containerId | String | n/a | ID of the HTML component that will act as a container for facets |
| facetsFilter | function | n/a | Custom JS function that receives possible facet values in an array, removes some values, and returns a filtered array |
| field | Facet field | n/a | Same field that you passed to the JS client. E.g. *custom_fields.brand* |
| template | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/facets/templates.js) | Custom [Handlebars](https://handlebarsjs.com/) template |

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
| clearAll | true, false | true | Show "clear all filters" button if more than one filter is active |
| template | String | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/activefilters/templates.js) | Custom [Handlebars](https://handlebarsjs.com/) template |

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

Feel free to send any questions, ideas and suggestions at [support@addsearch.com](support@addsearch.com).