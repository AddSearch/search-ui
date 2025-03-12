# AddSearch Search UI Library

Use Search UI library to create fast, mobile-friendy, and cross-browser compatible search solutions
quickly and effortlessly.

![Search UI gif](https://demo.addsearch.com/search-ui-examples/components/search-ui-components.gif)

[Open the demo](https://demo.addsearch.com/search-ui-examples/components/)

| :exclamation: Starting from v0.8.0, Search UI Library will support Websites that have Content Security Policy header which restricts the use of eval() method. [See more](#support-content-security-policy) |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

## Quick example

```html
<!-- Libraries -->
<script src="https://cdn.jsdelivr.net/npm/addsearch-js-client@0.8/dist/addsearch-js-client.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/addsearch-search-ui@0.8/dist/addsearch-search-ui.min.js"></script>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/addsearch-search-ui@0.8/dist/addsearch-search-ui.min.css"
/>

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

Advanced example with many components

- [Try it out](https://demo.addsearch.com/search-ui-examples/components/)
- [View source code](https://github.com/AddSearch/search-ui/tree/master/examples/components/index.html)

See more examples

- [All examples](https://demo.addsearch.com/search-ui-examples/)
- [View source code](https://github.com/AddSearch/search-ui/tree/master/examples)

## Search UI instance and configuration

To create a Search UI instance, call the constructor `new AddSearchUI(client, conf)` with the
mandatory [AddSearchClient (v0.3.0 or newer)](https://github.com/AddSearch/js-client-library)
parameter and an optional configuration parameter:

```js
var client = new AddSearchClient('YOUR PUBLIC SITEKEY');

var conf = {
  debug: true
};

var searchui = new AddSearchUI(client, conf);
```

The configuration object can contain following values:

| Key                     | Possible values | Default value | Description                                                                                                                                               |
|-------------------------| --------------- |---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| debug                   | boolean         | false         | Log events to console and enable [Redux DevTools](https://github.com/reduxjs/redux-devtools)                                                              |
| analyticsCallback       | function        | n/a           | A function to call when an analytics event occurs. [Read more](#analytics)                                                                                |
| baseFilters             | object          | null          | A filter object that is applied to all searches under the hood. The user can't disable baseFilters                                                        |
| collectAnalytics        | boolean         | true          | Control if analytics events are collected at all                                                                                                          |
| matchAllQuery           | boolean         | false         | Execute "match all" query when the Search UI is started                                                                                                   |
| onFilterChange          | function        | n/a           | Function to call when active filters are changed (for conditional visibility)                                                                             |
| onFilteredSearchRefresh | function        | n/a           | Function to call when search results are refreshed due to changes in filters or facets                                                                    |
| searchResultsPageUrl    | String          | null          | Redirect the user to a separate search results page, instead of showing search results on the current page                                                |
| searchParameter         | String          | "search"      | Name of the search parameter which is added to the URL, by default the library adds "?search="                                                            |
| updateBrowserHistory    | boolean         | true          | Set this value to false for a second/third searchui's instance to prevent conflict in browser's URL                                                       |
| fieldForInstantRedirect | String          | n/a           | Checking if the search keyword is matching with any search result's custom field's value, then redirect users to the matched page. E.g. custom_fields.sku |
| hasAiAnswers            | String          | false         | Enable fetching AI Answers API                                                                                                                            |

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

Settings that can be passed to the `searchField` function:

| Key                              | Possible values                          | Default value                                                                                                                                 | Description                                                                                                                                                                                                                              |
|----------------------------------| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| containerId                      | String                                   | n/a                                                                                                                                           | ID of the HTML element that will act as a container for the search bar                                                                                                                                                                   |
| autofocus                        | boolean                                  | true                                                                                                                                          | Focus the input field automatically when the page is loaded                                                                                                                                                                              |
| button                           | String                                   | n/a                                                                                                                                           | Add a button to execute the search. The value of this field is the Button's label text                                                                                                                                                   |
| placeholder                      | String                                   | n/a                                                                                                                                           | Search field's placeholder text                                                                                                                                                                                                          |
| searchAsYouType                  | boolean                                  | false                                                                                                                                         | Execute search after every keystroke                                                                                                                                                                                                     |
| disableSearch                    | boolean                                  | false                                                                                                                                         | Enable only when using SegmentedSearchResults and you want to prevent SearchField from triggering additional queries                                                                                                                              |
| icon                             | boolean                                  | true                                                                                                                                          | Show search icon                                                                                                                                                                                                                         |
| ignoreAutocomplete               | boolean                                  | false                                                                                                                                         | Don't show the autocomplete component if something is typed to this field (in case you have multiple fields)                                                                                                                             |
| ignoreSearchResultsPageUrl       | boolean                                  | false                                                                                                                                         | Don't redirect the user to a search results page from this field (in case you have multiple fields)                                                                                                                                      |
| onfocusAutocompleteMatchAllQuery | boolean                                  | false                                                                                                                                         | If true, execute match all query for autocomplete box when this field is empty and focused                                                                                                                                               |
| template                         | String                                   | n/a                                                                                                                                           | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template                                                                                                                                             |
| fieldForInstantRedirect          | String                                   | n/a                                                                                                                                           | _This setting is deprecated, use it in Search UI Configuration instead_                                                                                                                                                                  |
| selectorToBind                   | String                                   | n/a                                                                                                                                           | CSS selector of the existing search input field to be used. If this setting is defined, Search UI won't be creating a search input field, instead it will bind all relating functionalities to the input field defined by this selector. |
| buttonSelector                   | String                                   | n/a                                                                                                                                           | CSS selector of the existing search button. This setting is applicable only when "selectorToBind" is defined                                                                                                                             |
| precompiledTemplate              | Handlebars precompiled template function | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/searchfield/precompile-templates/searchfield.handlebars) | Override the default template with a custom [Handlebars precompiled](https://handlebarsjs.com/installation/precompilation.html) template                                                                                                 |
| minLengthToShowResults           | integer                                  | 1                                                                                                                                             | Minimum length of the search term to show search results                                                                                                                                                                                 |

<details>
  <summary>Data structure used in searchField component</summary>

```json
{
  "autofocus": true,
  "placeholder": "Keyword..",
  "button": "Search",
  "searchAsYouType": false
}
```

</details>

### Autocomplete

Show suggested keyword, search results, or both under the search field. The default autocomplete
template supports search suggestions that must be enabled from the AddSearch Dashboard before using
the feature. Create your own template if you want to to show search results or more advanced views.

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

Settings that can be passed to the `autocomplete` function:

| Key                       | Possible values                          | Default value                                                                                                                                   | Description                                                                                                                              |
| ------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| containerId               | String                                   | n/a                                                                                                                                             | ID of the HTML element that will act as a container for the autocomplete dropdown                                                        |
| categoryAliases           | Object                                   | n/a                                                                                                                                             | A map of category aliases used by the _categorySelectionFunction_                                                                        |
| categorySelectionFunction | Function                                 | [defaultCategorySelectionFunction](https://github.com/AddSearch/search-ui/blob/master/src/util/handlebars.js)                                   | A function to select and format the _category_ information on the bottom of each search result                                           |
| hideAutomatically         | boolean                                  | true                                                                                                                                            | Hide the autocomplete dropdown when the search field is blurred                                                                          |
| onShow                    | function                                 | n/a                                                                                                                                             | A function to call when the autocomplete is shown. Called as the container as parameter                                                  |
| template                  | String                                   | n/a                                                                                                                                             | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template                                             |
| infiniteScrollElement     | object                                   | n/a                                                                                                                                             | A scrollable container with _overflow: auto;_ around the autocomplete box (for AddSearchUI.AUTOCOMPLETE_TYPE.SEARCH)                     |
| precompiledTemplate       | Handlebars precompiled template function | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/autocomplete/precompile-templates/autocomplete.handlebars) | Override the default template with a custom [Handlebars precompiled](https://handlebarsjs.com/installation/precompilation.html) template |
| sources                   | Array                                    | n/a                                                                                                                                             | Array of data sources                                                                                                                    |
| renderCompleteCallback    | function                                 | n/a                                                                                                                                             | A function to call when the autocomplete is rendered. Called as the container as parameter                                               |

The `sources` array can contain objects with the following fields:

| Key                    | Possible values                                                                                                              | Default value                                | Description                                                                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| type                   | AddSearchUI.AUTOCOMPLETE_TYPE.SUGGESTIONS, AddSearchUI.AUTOCOMPLETE_TYPE.SEARCH, AddSearchUI.AUTOCOMPLETE_TYPE.CUSTOM_FIELDS | n/a                                          | Fetch search suggestions or search results                                                                                                           |
| client                 | AddSearch JS Client instance                                                                                                 | Client passed to the AddSearchUI constructor | Use a custom client to use specific filters or different search index                                                                                |
| collectSearchAnalytics | boolean                                                                                                                      | false                                        | If enabled and the type of this source is SEARCH, save the number of searches to analytics                                                           |
| jsonKey                | String                                                                                                                       | n/a                                          | If the type is _AddSearchUI.AUTOCOMPLETE_TYPE.SEARCH_, the Handlebars template can access the results from the JSON object `searchResults.<jsonKey>` |
| field                  | String                                                                                                                       | n/a                                          | If the type is _AddSearchUI.AUTOCOMPLETE_TYPE.CUSTOM_FIELDS_, choose a custom field, then its value will be used to generate suggestion terms        |

<details>
  <summary>Data structure used in autocomplete component</summary>

```json
{
  "suggestions": [
    {
      "value": "a guide to google search appliance replacement"
    },
    {
      "value": "a guide to site search for digital agencies"
    },
    {
      "value": "adding another addsearch account"
    }
  ],
  "customFields": [
    {
      "value": "A Guide to Site Search for Digital Agencies"
    },
    {
      "value": "Account Settings"
    },
    {
      "value": "Add content to the search"
    }
  ],
  "searchResults": {
    "results": [
      {
        "id": "c2b1fd3b884d80735139c07c17f66523",
        "url": "https://www.addsearch.com/docs/account/adding-another-account/",
        "title": "Adding Another AddSearch Account - AddSearch Documentation",
        "meta_description": "AddSearch allows you to create multiple accounts linked to your existing account. Follow the instructions to set up a new account.",
        "meta_categories": null,
        "custom_fields": {
          "documentation_category": "Dashboard#f76c6f",
          "title_h2": "Instructions",
          "title": "Adding Another AddSearch Account"
        },
        "highlight": "<em>Adding</em> <em>Another</em> <em>AddSearch</em> <em>Account</em> If you <em>already</em> have <em>an</em> <em>AddSearch</em> <em>account</em>, you can create other <em>accounts</em> from the <em>AddSearch</em> dashboard that link to",
        "ts": "2020-01-22T20:24:22",
        "categories": [
          "0xwww.addsearch.com",
          "1xdocs",
          "2xaccount",
          "3xadding-another-account"
        ],
        "document_type": "html",
        "images": {
          "main": "https://d20vwa69zln1wj.cloudfront.net/82b34461f88ea8d0f6c6e26ed89d07b1/main/ff045bb11712142681288bcf9cb9e6a1-20230222.jpg",
          "main_b64": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDACgcHiMeGSgjISMtKygwPGRBPDc3PHtYXUlkkYCZlo+AjIqgtObDoKrarYqMyP/L2u71////m8H////6/+b9//j/2wBDASstLTw1PHZBQXb4pYyl+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj/wAARCABEAEQDASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAECAwQF/8QAKxAAAQQABAQFBQEAAAAAAAAAAQACAxEEITFREhNhcRQiQYGRMlJTYqFj/8QAGAEAAwEBAAAAAAAAAAAAAAAAAAECAwT/xAAgEQACAgEEAwEAAAAAAAAAAAAAAQIREgMTIVEiMWFB/9oADAMBAAIRAxEAPwCTontbZAA7pmB40o75pBkjhoa6lBZIM8/lY18OzL6AhcQCCKIvsjkvJNUaNJxRSS5NsD1N5LQMJkAZHb5ZJqNhKePtmbkP6fKOQ8kaLQ7B/bK73VL8PM3S3DoU8aEtRP8ASvlO4C4kAAWpeHf0vuqzxDymx0KlwTfa/wCCkaO+xtge4WK1rVCQZMNGyD2KECt9knSuOhrspRSSOeGjO91o8C38v8V0WHZGPKcz6qkpXyYuenVJCb5TXoppvZQtMMsA2tDnIoUuX1/ipneYS0AcVpNpDSt0iTmNeKc0HurTdrH4h95Rg+6RxEn4UskXtyNmfVCxjESnSEfKEZIW3I2Za+VMeyQcTsnZ6JkCcbyypMGhqEZbhF/sEAFncKnExGUts1V6K8HPUKEn1BDSfDGm07Rl8KdeYVE4f/Ry0ONmkwzdLBFbkuzOMGSLEjvhC0eIijHCXgEIRSKy1CgY83nGK7rUJeIAgAg9VyVbDO6I1q3ZRGfZpPSVeJ0eYdgjmHYKuOVkg8rs9vVTWpztNex8w7BIkuIJFUhVS4iOPU2dgj0CTfCAu4Lcc6zWKXEPk9eFuwVjcSXuPHQvRTZho5X+oHRS/JcG0a035IxoXVbBh4xwkNv9tUKcS95dHMSQhZGwKYlkGj3fKEJhSYnSPd9T3H3UEITCqBAJGhI7IQgYFCEIA//Z",
          "capture": "https://d20vwa69zln1wj.cloudfront.net/82b34461f88ea8d0f6c6e26ed89d07b1/capture/c2b1fd3b884d80735139c07c17f66523-20221020.jpg"
        },
        "score": 311.9153
      },
      {} ...
    ]
  }
}
```

</details>

### Search results

Actual search results.

```js
searchui.searchResults({
  containerId: 'searchresults'
});
```

Settings that can be passed to the `searchResults` function:

| Key                          | Possible values                          | Default value                                                                                                                                                 | Description                                                                                                                                                            |
| ---------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| containerId                  | String                                   | n/a                                                                                                                                                           | ID of the HTML element that will act as a container for search results                                                                                                 |
| categoryAliases              | Object                                   | n/a                                                                                                                                                           | A map of category aliases used by the _categorySelectionFunction_                                                                                                      |
| categorySelectionFunction    | Function                                 | [defaultCategorySelectionFunction](https://github.com/AddSearch/search-ui/blob/master/src/util/handlebars.js)                                                 | A function to select and format the _category_ information on the bottom of each search result                                                                         |
| template                     | String                                   | n/a                                                                                                                                                           | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template for search results                                                        |
| template_resultcount         | String                                   | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/searchresults/precompile-templates/numberOfResultsTemplate.handlebars)   | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template for "Number of results"                                                   |
| template_noresults           | String                                   | n/a                                                                                                                                                           | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template for "No search results found"                                             |
| template_image               | String                                   | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/searchresults/precompile-templates/searchResultImageTemplate.handlebars) | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template for the featured image shown with search results                          |
| precompiledTemplate          | Handlebars precompiled template function | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/searchresults/precompile-templates/searchresults.handlebars)             | Override the default template with a custom [Handlebars precompiled](https://handlebarsjs.com/installation/precompilation.html) template                               |
| precompiledTemplateNoResults | Handlebars precompiled template function | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/searchresults/precompile-templates/no_results.handlebars)                | Override the default template with a custom [Handlebars precompiled](https://handlebarsjs.com/installation/precompilation.html) template for "No search results found" |
| renderCompleteCallback       | function                                 | n/a                                                                                                                                                           | A function to call when the search results are rendered. Called as the container as parameter                                                                          |

If you are customising the default search result template, make sure your links still include the
`data-analytics-click="{{id}}"` attribute, otherwise your analytics will not report clicks or CTR
correctly.

<details>
  <summary>Data structure used in searchResults component</summary>

```json~~~~
{
  "page": 3,
  "total_hits": 338,
  "hits": [
    {
      "id": "aee487c44aff2b393aa3db218b0effcc",
      "url": "https://www.addsearch.com/docs/api/",
      "title": "REST API - Overview - AddSearch Documentation",
      "meta_description": "The AddSearch REST API provides programmatic access the search index. You can add, update and retrieve data from the index with the AddSearch Rest API.",
      "meta_categories": null,
      "custom_fields": {
          "documentation_category": "API Reference#fe0201",
          "title_h2": "Overview"
      },
      "highlight": "REST API Reference Welcome to AddSearch API reference. The AddSearch REST API provides access to request data from the index. It also allows you to update the data in the index as ",
      "ts": "2020-01-23T20:03:25",
      "categories": [
          "0xwww.addsearch.com",
          "1xdocs",
          "2xapi"
      ],
      "document_type": "html",
      "images": {
          "main": "https://d20vwa69zln1wj.cloudfront.net/82b34461f88ea8d0f6c6e26ed89d07b1/main/ff045bb11712142681288bcf9cb9e6a1-20230222.jpg",
          "main_b64": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDACgcHiMeGSgjISMtKygwPGRBPDc3PHtYXUlkkYCZlo+AjIqgtObDoKrarYqMyP/L2u71////m8H////6/+b9//j/2wBDASstLTw1PHZBQXb4pYyl+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj4+Pj/wAARCABEAEQDASIAAhEBAxEB/8QAGQAAAgMBAAAAAAAAAAAAAAAAAAECAwQF/8QAKxAAAQQABAQFBQEAAAAAAAAAAQACAxEEITFREhNhcRQiQYGRMlJTYqFj/8QAGAEAAwEBAAAAAAAAAAAAAAAAAAECAwT/xAAgEQACAgEEAwEAAAAAAAAAAAAAAQIREgMTIVEiMWFB/9oADAMBAAIRAxEAPwCTontbZAA7pmB40o75pBkjhoa6lBZIM8/lY18OzL6AhcQCCKIvsjkvJNUaNJxRSS5NsD1N5LQMJkAZHb5ZJqNhKePtmbkP6fKOQ8kaLQ7B/bK73VL8PM3S3DoU8aEtRP8ASvlO4C4kAAWpeHf0vuqzxDymx0KlwTfa/wCCkaO+xtge4WK1rVCQZMNGyD2KECt9knSuOhrspRSSOeGjO91o8C38v8V0WHZGPKcz6qkpXyYuenVJCb5TXoppvZQtMMsA2tDnIoUuX1/ipneYS0AcVpNpDSt0iTmNeKc0HurTdrH4h95Rg+6RxEn4UskXtyNmfVCxjESnSEfKEZIW3I2Za+VMeyQcTsnZ6JkCcbyypMGhqEZbhF/sEAFncKnExGUts1V6K8HPUKEn1BDSfDGm07Rl8KdeYVE4f/Ry0ONmkwzdLBFbkuzOMGSLEjvhC0eIijHCXgEIRSKy1CgY83nGK7rUJeIAgAg9VyVbDO6I1q3ZRGfZpPSVeJ0eYdgjmHYKuOVkg8rs9vVTWpztNex8w7BIkuIJFUhVS4iOPU2dgj0CTfCAu4Lcc6zWKXEPk9eFuwVjcSXuPHQvRTZho5X+oHRS/JcG0a035IxoXVbBh4xwkNv9tUKcS95dHMSQhZGwKYlkGj3fKEJhSYnSPd9T3H3UEITCqBAJGhI7IQgYFCEIA//Z",
          "capture": "https://d20vwa69zln1wj.cloudfront.net/82b34461f88ea8d0f6c6e26ed89d07b1/capture/aee487c44aff2b393aa3db218b0effcc-20220929.jpg"
      },
      "score": 49.877094
    },
    {} ...
  ],
  "keyword": "*"
}
```

</details>

### Pagination

Pagination. Typically below search results.

```js
searchui.pagination({
  containerId: 'pagination'
});
```

Settings that can be passed to the `pagination` function:

| Key                 | Possible values                          | Default value                                                                                                                               | Description                                                                                                                              |
| ------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| containerId         | String                                   | n/a                                                                                                                                         | ID of the HTML element that will act as a container for the paging                                                                       |
| template            | String                                   | n/a                                                                                                                                         | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template                                             |
| onResultsScrollTo   | "top", "no scrolling"                    | "top"                                                                                                                                       | Set a scrolling behavior when navigate to a new page of results                                                                          |
| precompiledTemplate | Handlebars precompiled template function | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/pagination/precompile-templates/pagination.handlebars) | Override the default template with a custom [Handlebars precompiled](https://handlebarsjs.com/installation/precompilation.html) template |

To change the number of results shown per page, use AddSearch JS client's
[setPaging function](https://github.com/AddSearch/js-client-library#manage-paging)

<details>
  <summary>Data structure used in pagination component</summary>

```json
{
  "currentPage": 3,
  "lastPage": 9,
  "totalPages": 34,
  "pages": [1, 2, 3, 4, 5, 6, 7, 8, 9]
}
```

</details>

### Load more results

Button to load more results or an infinite scroll implementation.

```js
searchui.loadMore({
  containerId: 'loadmore',
  type: AddSearchUI.LOAD_MORE_TYPE.BUTTON
});
```

Settings that can be passed to the `loadMore` function:

| Key                   | Possible values                                                               | Default value                                                                                                                           | Description                                                                                                                              |
| --------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| containerId           | String                                                                        | n/a                                                                                                                                     | ID of the HTML element that will act as a container for the component                                                                    |
| template              | String                                                                        | n/a                                                                                                                                     | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template                                             |
| type                  | AddSearchUI.LOAD_MORE_TYPE.BUTTON, AddSearchUI.LOAD_MORE_TYPE.INFINITE_SCROLL | n/a                                                                                                                                     | Require user clicking "More results" button or load automatically on scroll bottom                                                       |
| infiniteScrollElement | object                                                                        | n/a                                                                                                                                     | If the type is INFINITE_SCROLL, this is the scrollable element. Can be **window** or an HTML element with _overflow: auto;_              |
| precompiledTemplate   | Handlebars precompiled template function                                      | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/loadmore/precompile-templates/loadmore.handlebars) | Override the default template with a custom [Handlebars precompiled](https://handlebarsjs.com/installation/precompilation.html) template |

To change the number of results shown per page, use AddSearch JS client's
[setPaging function](https://github.com/AddSearch/js-client-library#manage-paging). The same Search
UI can have the _pagination_ component for desktop view and _loadMore_ for mobile.

<details>
  <summary>Data structure used in loadMore component</summary>

```json
{
  "type": "INFINITE_SCROLL",
  "hasMorePages": true,
  "isLoading": false,
  "totalHits": 337
}
```

</details>

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
    },
    {
      label: 'Multiple sorting parameters',
      sortBy: ['custom_fields.plan_name', 'date'],
      order: ['desc', 'desc']
    }
  ]
});
```

Settings that can be passed to the `sortBy` function:

| Key                 | Possible values                                                          | Default value                                                                                                     | Description                                                                                                                              |
| ------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| containerId         | String                                                                   | n/a                                                                                                               | ID of the HTML element that will act as a container for the paging                                                                       |
| template            | String                                                                   | n/a                                                                                                               | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template                                             |
| type                | AddSearchUI.SORTBY_TYPE.SELECT_LIST, AddSearchUI.SORTBY_TYPE.RADIO_GROUP | Select list                                                                                                       | "Sort by" menu shown as select list or as a radio button group                                                                           |
| precompiledTemplate | Handlebars precompiled template function                                 | [Default template](https://github.com/AddSearch/search-ui/tree/master/src/components/sortby/precompile-templates) | Override the default template with a custom [Handlebars precompiled](https://handlebarsjs.com/installation/precompilation.html) template |

The `options` array can contain objects with following fields:

| Key    | Possible values               | Default value | Description                                                 |
| ------ | ----------------------------- | ------------- | ----------------------------------------------------------- |
| label  | String, Array                 | n/a           | Label text to show                                          |
| sortBy | relevance, date, custom_field | n/a           | The field to sort the search results by                     |
| order  | desc, asc                     | desc          | Ascending order (a-z or 1-9) or descending order (z-a, 9-1) |

<details>
  <summary>Data structure used in sortBy component</summary>

```json
{
  "options": [
    {
      "label": "Most relevant first",
      "sortBy": "relevance",
      "order": "desc",
      "active": false
    },
    {
      "label": "Date: Newest first",
      "sortBy": "date",
      "order": "desc",
      "active": false
    },
    {
      "label": "Date: Oldest first",
      "sortBy": "date",
      "order": "asc",
      "active": false
    }
  ]
}
```

</details>

### Filters

Components to let the user filter search results by URL patterns or custom field values.

```js
searchui.filters({
  containerId: 'filters',
  type: AddSearchUI.FILTER_TYPE.CHECKBOX_GROUP,
  options: {
    appleProducts: {
      label: 'Apple products',
      filter: { 'custom_fields.brand': 'apple' }
    }
  }
});
```

Settings that can be passed to the `filters` function:

| Key                 | Possible values                                                                                                                                                                                             | Default value                                                                                                       | Description                                                                                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| containerId         | String                                                                                                                                                                                                      | n/a                                                                                                                 | ID of the HTML element that will act as a container for filters                                                                                        |
| type                | AddSearchUI.FILTER_TYPE.CHECKBOX_GROUP, AddSearchUI.FILTER_TYPE.RADIO_GROUP, AddSearchUI.FILTER_TYPE.SELECT_LIST, AddSearchUI.FILTER_TYPE.TABS, AddSearchUI.FILTER_TYPE.TAGS, AddSearchUI.FILTER_TYPE.RANGE | n/a                                                                                                                 | Component's type                                                                                                                                       |
| template            | String                                                                                                                                                                                                      | n/a                                                                                                                 | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template                                                           |
| clearOtherFilters   | boolean                                                                                                                                                                                                     | false                                                                                                               | Clear all other filters when the value of this filter changes. Works with RADIO_GROUP, SELECT_LIST, and TABS filters                                   |
| setSorting          | Object                                                                                                                                                                                                      | n/a                                                                                                                 | Set sorting when the value of this filter changes. The object must contain _field_ and _order_. Works with RADIO_GROUP, SELECT_LIST, and TABS filters. |
| precompiledTemplate | Handlebars precompiled template function                                                                                                                                                                    | [Default templates](https://github.com/AddSearch/search-ui/tree/master/src/components/filters/precompile-templates) | Override the default template with a custom [Handlebars precompiled](https://handlebarsjs.com/installation/precompilation.html) template               |
| options             | Object                                                                                                                                                                                                      | n/a                                                                                                                 | Object containing filtering options                                                                                                                    |

The _options_ object can contain multiple filtering options. If the type is _Tabs_, _Select list_,
or _Radio group_, just one of the options can be activated at any given time. If the filter type is
_Checkbox_ or _Tags_, multiple filters can be activated. The option _key_ (appleProducts in the
example above) is shared across filter components. All filters with the same _key_ are enabled and
disabled simultaneously. Because of this, you can have several filter components controlling the
same filter. For example, radio button list on desktop view and a select list on mobile.

Fields in `options`:

| Key    | Possible values | Default value | Description              |
| ------ | --------------- | ------------- | ------------------------ |
| label  | String          | n/a           | Label shown for the user |
| filter | Object          | n/a           | Filter object.           |

The `options` object is not applicable if the filter type is `AddSearchUI.FILTER_TYPE.RANGE`, but
following settings should be passed to the `filters` function:

| Key        | Possible values | Default value | Description                                                                         |
| ---------- | --------------- | ------------- | ----------------------------------------------------------------------------------- |
| label      | String          | n/a           | Label shown above range filter. For example, "Select price range"                   |
| labelShort | String          | n/a           | Short label shown in the activeFilters component. For example, "Price"              |
| validator  | String          | n/a           | Regular expression to validate the input. For example, `^[\\d]*$` for numeric field |

<details>
  <summary>Data structure used in filters component</summary>

```json
{
  "options": {
    "nofilter": {
      "label": "All results",
      "active": true
    },
    "blog": {
      "label": "Blog",
      "filter": {
        "category": "1xblog"
      },
      "active": false
    },
    "notblog": {
      "label": "Not blog",
      "filter": {
        "not": {
          "category": "1xblog"
        }
      },
      "active": false
    }
  }
}
```

</details>

### Facets

Display facets and let the user filter results by facets (i.e. dynamic property filters).

```js
searchui.facets({
  containerId: 'facets'
});
```

Before using this component, add appropriate facets to your client instance so the information is
fetched from the search index:

```js
client.addFacetField('custom_fields.brand');
```

Settings that can be passed to the `facets` function:

| Key                 | Possible values                          | Default value                                                                                                                       | Description                                                                                                                                                                    |
| ------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| containerId         | String                                   | n/a                                                                                                                                 | ID of the HTML element that will act as a container for facets                                                                                                                 |
| facetsFilter        | function                                 | n/a                                                                                                                                 | Custom JS function that receives facets in an array, removes some of them, and returns a filtered facet array                                                                  |
| field               | String                                   | n/a                                                                                                                                 | Same field that you passed to the JS client. E.g. _custom_fields.brand_                                                                                                        |
| sticky              | boolean                                  | false                                                                                                                               | Show all options even if a facet is selected. Options are reset on keyword change                                                                                              |
| advancedSticky      | boolean                                  | false                                                                                                                               | Similar to sticky, extra search queries are made to update other facet groups. Enabling this setting would use quite an amount of search query usage in your subscription plan |
| template            | String                                   | n/a                                                                                                                                 | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template                                                                                   |
| precompiledTemplate | Handlebars precompiled template function | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/facets/precompile-templates/facets.handlebars) | Override the default template with a custom [Handlebars precompiled](https://handlebarsjs.com/installation/precompilation.html) template                                       |

<details>
  <summary>Data structure used in facets component</summary>

```json
{
  "facets": [
    {
      "value": "1xabout",
      "count": 1
    },
    {
      "value": "1xan-update-on-recent-log4j-vulnerabilities",
      "count": 1
    },
    {
      "value": "1xblog",
      "count": 130
    }
  ]
}
```

</details>

### Hierarchical Facets

Display hierarchical facets and let the user filter results by facets. In addition, user can drill
down each facets and select more specific values. (i.e. dynamic property filters). By default,
hierarchical facet is sticky. Currently, this component does not support historical URL, refreshing
the page will lose the current state of the facet group.

```js
searchui.hierarchicalFacets({
  containerId: 'hierarchical-facets-container',
  fields: [
    'custom_fields.nested_facet_lvl_0',
    'custom_fields.nested_facet_lvl_1',
    'custom_fields.nested_facet_lvl_2',
    'custom_fields.nested_facet_lvl_3'
  ]
});
```

Before using this component, add appropriate hierarchical facets to your client instance so the
information is fetched from the search index:

```js
client.addHierarchicalFacetSetting([
  {
    fields: [
      'custom_fields.nested_facet_lvl_0',
      'custom_fields.nested_facet_lvl_1',
      'custom_fields.nested_facet_lvl_2',
      'custom_fields.nested_facet_lvl_3'
    ],
    sortOrder: 'COUNT_DESC_NAME_ASC'
  }
]);
```

Settings that can be passed to the `hierarchicalFacets` function:

| Key                 | Possible values                          | Default value                                                                                                                 | Description                                                                                                                              |
| ------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| containerId         | String                                   | n/a                                                                                                                           | ID of the HTML element that will act as a container for facets                                                                           |
| fields              | String                                   | n/a                                                                                                                           | Define a list of custom fields in hierarchical order (top level facet is placed first).                                                  |
| sortOrder           | String                                   | n/a                                                                                                                           | Define a sorting method: by counts of facets (COUNT_DESC_NAME_ASC) or by alphabetical order (NAME_ASC).                                  |
| template            | String                                   | n/a                                                                                                                           | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template                                             |
| precompiledTemplate | Handlebars precompiled template function | [Default template](https://github.com/AddSearch/search-ui/tree/master/src/components/hierarchicalfacets/precompile-templates) | Override the default template with a custom [Handlebars precompiled](https://handlebarsjs.com/installation/precompilation.html) template |

### Range Facets

Display range facets of a given custom field and let the user filter results by different range
buckets. By default, range facet is sticky. This feature uses extra search queries to fetch min-max
values of the custom field.

```js
client.addStatsField('custom_fields.price');
searchui.rangeFacets({
  containerId: 'rangeFacetsContainer',
  field: 'custom_fields.price',
  maxNumberOfRangeBuckets: 7
});
```

Settings that can be passed to the `rangeFacets` function:

| Key                     | Possible values                          | Default value                                                                                                                                 | Description                                                                                                                              |
| ----------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| containerId             | String                                   | n/a                                                                                                                                           | ID of the HTML element that will act as a container for facets                                                                           |
| field                   | String                                   | n/a                                                                                                                                           | A numeric custom field to use as a facet. E.g. custom_fields.price                                                                       |
| maxNumberOfRangeBuckets | integer                                  | 5                                                                                                                                             | Maximum number of buckets that will be displayed. If a bucket is empty, it will be hidden                                                |
| template                | String                                   | n/a                                                                                                                                           | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template                                             |
| precompiledTemplate     | Handlebars precompiled template function | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/rangefacets/precompile-templates/rangefacets.handlebars) | Override the default template with a custom [Handlebars precompiled](https://handlebarsjs.com/installation/precompilation.html) template |

![alt text](https://demo.addsearch.com/search-ui-examples/components/range-facets-buckets.png)

### Active filters

Show active filters and facets. Let user remove specific filters or clear everything,

```js
searchui.activeFilters({
  containerId: 'activefilters'
});
```

Settings that can be passed to the `activeFilters` function:

| Key                 | Possible values                          | Default value                                                                                                                                     | Description                                                                                                                              |
| ------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| containerId         | String                                   | n/a                                                                                                                                               | ID of the HTML element that will act as a container for active filters list                                                              |
| clearAll            | boolean                                  | true                                                                                                                                              | Show "clear all filters" button if more than one filter is active                                                                        |
| template            | String                                   | n/a                                                                                                                                               | Override the default template with a custom [Handlebars](https://handlebarsjs.com/) template                                             |
| precompiledTemplate | Handlebars precompiled template function | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/activefilters/precompile-templates/activefilters.handlebars) | Override the default template with a custom [Handlebars precompiled](https://handlebarsjs.com/installation/precompilation.html) template |

<details>
  <summary>Data structure used in activeFilters component</summary>

```json
{
  "active": [
    {
      "type": "FILTER",
      "name": "blog",
      "value": 1,
      "label": "Blog"
    },
    {
      "type": "FACET",
      "name": "category",
      "value": "2x10-strategic-considerations-for-enterprises-selecting-a-site-search-solution",
      "label": "10-strategic-considerations-for-enterprises-selecting-a-site-search-solution"
    },
    {
      "type": "HIERARCHICAL_FACET",
      "name": "custom_fields.nested_facet_lvl_1",
      "value": "background > photo",
      "label": "background > photo"
    }
  ],
  "clearAll": true
}
```

</details>

### Segmented search results

Show multiple search results lists from several indices or with different filters.

```js
searchui.segmentedSearchResults({
  containerId: 'segment1',
  client: segmentClient,
  template: segmentTemplate
});
```

Settings that can be passed to the `segmentedSearchResults` function:

| Key                 | Possible values                          | Default value | Description                                                                                                                              |
| ------------------- | ---------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| containerId         | String                                   | n/a           | ID of the HTML element that will act as a container for this component                                                                   |
| client              | AddSearch JS Client instance             | n/a           | Client with appropriate filters/settings for this segment                                                                                |
| template            | String                                   | n/a           | [Handlebars](https://handlebarsjs.com/) template for this segment                                                                        |
| precompiledTemplate | Handlebars precompiled template function | n/a           | Override the default template with a custom [Handlebars precompiled](https://handlebarsjs.com/installation/precompilation.html) template |

<details>
  <summary>Data structure used in segmentedSearchResults component</summary>

```json
{
  "all-results": {
    "page": 1,
    "total_hits": 337,
    "hits": [
      {
        "id": "c2b1fd3b884d80735139c07c17f66523",
        "url": "https://www.addsearch.com/docs/account/adding-another-account/",
        "title": "Adding Another AddSearch Account - AddSearch Documentation",
        "meta_description": "AddSearch allows you to create multiple accounts linked to your existing account. Follow the instructions to set up a new account.",
        "meta_categories": null,
        "custom_fields": {
          "documentation_category": "Dashboard#f76c6f"
        },
        "highlight": "if you have clients who need <em>an</em> <em>account</em> with <em>a</em> separate index, settings, <em>and</em> billing. Instructions To create <em>a</em> new <em>AddSearch</em> <em>account</em>, follow these",
        "ts": "2020-01-22T21:50:52",
        "categories": ["0xwww.addsearch.com", "1xdocs", "2xaccount", "3xadding-another-account"],
        "document_type": "html",
        "images": {
          "main": "https://d20vwa69zln1wj.cloudfront.net/2c32bf3eb06b30af5f8208481aea3e8b/main/76decf697e944b9a7d4d79a66e5c2b46-20220208.jpg",
          "capture": "https://d20vwa69zln1wj.cloudfront.net/2c32bf3eb06b30af5f8208481aea3e8b/capture/c2b1fd3b884d80735139c07c17f66523-20211116.jpg"
        },
        "score": 340.188
      }
    ]
  },
  "docs-results": {
    "page": 1,
    "total_hits": 145,
    "hits": [
      {
        "id": "c2b1fd3b884d80735139c07c17f66523",
        "url": "https://www.addsearch.com/docs/account/adding-another-account/",
        "title": "Adding Another AddSearch Account - AddSearch Documentation",
        "meta_description": "AddSearch allows you to create multiple accounts linked to your existing account. Follow the instructions to set up a new account.",
        "meta_categories": null,
        "custom_fields": {
          "documentation_category": "Dashboard#f76c6f"
        },
        "highlight": "if you have clients who need <em>an</em> <em>account</em> with <em>a</em> separate index, settings, <em>and</em> billing. Instructions To create <em>a</em> new <em>AddSearch</em> <em>account</em>, follow these",
        "ts": "2020-01-22T21:50:52",
        "categories": ["0xwww.addsearch.com", "1xdocs", "2xaccount", "3xadding-another-account"],
        "document_type": "html",
        "images": {
          "main": "https://d20vwa69zln1wj.cloudfront.net/2c32bf3eb06b30af5f8208481aea3e8b/main/76decf697e944b9a7d4d79a66e5c2b46-20220208.jpg",
          "capture": "https://d20vwa69zln1wj.cloudfront.net/2c32bf3eb06b30af5f8208481aea3e8b/capture/c2b1fd3b884d80735139c07c17f66523-20211116.jpg"
        },
        "score": 340.188
      }
    ]
  },
  "blog-results": {
    "page": 1,
    "total_hits": 130,
    "hits": [
      {
        "id": "c2b1fd3b884d80735139c07c17f66523",
        "url": "https://www.addsearch.com/docs/account/adding-another-account/",
        "title": "Adding Another AddSearch Account - AddSearch Documentation",
        "meta_description": "AddSearch allows you to create multiple accounts linked to your existing account. Follow the instructions to set up a new account.",
        "meta_categories": null,
        "custom_fields": {
          "documentation_category": "Dashboard#f76c6f"
        },
        "highlight": "if you have clients who need <em>an</em> <em>account</em> with <em>a</em> separate index, settings, <em>and</em> billing. Instructions To create <em>a</em> new <em>AddSearch</em> <em>account</em>, follow these",
        "ts": "2020-01-22T21:50:52",
        "categories": ["0xwww.addsearch.com", "1xdocs", "2xaccount", "3xadding-another-account"],
        "document_type": "html",
        "images": {
          "main": "https://d20vwa69zln1wj.cloudfront.net/2c32bf3eb06b30af5f8208481aea3e8b/main/76decf697e944b9a7d4d79a66e5c2b46-20220208.jpg",
          "capture": "https://d20vwa69zln1wj.cloudfront.net/2c32bf3eb06b30af5f8208481aea3e8b/capture/c2b1fd3b884d80735139c07c17f66523-20211116.jpg"
        },
        "score": 340.188
      }
    ]
  }
}
```

</details>

### Frequently bought together

Show frequently bought together items given the product ID.

```js
searchui.recommendations({
  containerId: 'recommendation-container',
  type: AddSearchUI.RECOMMENDATION_TYPE.FREQUENTLY_BOUGHT_TOGETHER,
  configurationKey: 'config1',
  getProductIdFunction: function () {
    return new URLSearchParams(window.location.search).get('prod');
  },
  ignoreFetchOnStart: false
});
```

Settings that can be passed to the `segmentedSearchResults` function:

| Key                | Possible values                                            | Default value | Description                                                                                           |
| ------------------ | ---------------------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------- |
| containerId        | String                                                     | n/a           | ID of the HTML element that will act as a container for this component                                |
| type               | AddSearchUI.RECOMMENDATION_TYPE.FREQUENTLY_BOUGHT_TOGETHER | n/a           | Type of recommendation                                                                                |
| ignoreFetchOnStart | boolean                                                    | false         | If enabled, recommendation won't be fetched unless call `searchui.fetchRecommendation(<containerId>)` |
| template           | String                                                     | n/a           | [Handlebars](https://handlebarsjs.com/) template for this segment                                     |

### Ai answers result

Area to display generated AI Answers.
To allow fetching AI Answers, you need to set "hasAiAnswers" to true in the searchui instance's configuration.

```js
searchui.aiAnswersResult({
  containerId: 'searchresults',
  mainHeadlineText: 'AI-generated answer',
  answerMaxHeight: 150,
  sourcesHeadlineText: 'Based on the following sources:',
  hasHideToggle: false
});
```

Settings that can be passed to the `aiAnswersResult` function:


| Key                          | Possible values                         | Default value                                                                                                                                   | Description                                                                                                                              |
| ---------------------------- |-------------|-------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| containerId                  | String      | n/a      | ID of the HTML element that will act as a container for search results                                                                   |
| mainHeadlineText             | String      | "Answer" | Main headline text                                                                                                                       |
| answerMaxHeight              | Integer     | 150      | Max height (in pixel) of the answer area                                                                                                 |
| sourcesHeadlineText          | String      | "Sources"| Headline text of "Sources"_                                                                                                              |
| hasHideToggle                | Boolean     | true     | Display toggle to show/hide generated answers                                          |
| precompiledTemplate          | Handlebars precompiled template function | [Default template](https://github.com/AddSearch/search-ui/blob/master/src/components/aianswersresult/precompile-templates/aianswersresult.handlebars) | Override the default template with a custom [Handlebars precompiled](https://handlebarsjs.com/installation/precompilation.html) template |


<details>
  <summary>Data structure used in aiAnswersResult component</summary>

```
{
  mainHeadlineText: 'Answer',
  subHeadlineText: 'subHeadlineText',
  answerText: 'Answer text',
  sourcesHeadlineText: 'Sources:',
  sources: [],
  aiExplanationText: 'Generated by AI, may contain errors.',
  isResultLoading: false,
  hadError: false,
  sentimentState: 'positive' | 'negative',
  showHideToggle: true,
  isHidden: false
}
```

</details>

## Support Content Security Policy

The Content Security Policy (CSP) is a protection standard that helps secure websites and
applications against various attacks, including data injection, click-jacking, and cross-site
scripting attacks. [See documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP).

It is recommended to remove unsafe-eval directive in your CSP header for better protection.

So far, Search UI Library is compiling dynamic template with
[Handlebars](https://handlebarsjs.com/), the compilation process invokes the method eval().
Therefore, we now provide ability to pre-compile your templates.
[See handlebarsjs precompiling](https://handlebarsjs.com/installation/precompilation.html). Default
templates are all precompiled for now, you can also precompile your own templates and feed them to
the `precompiledTemplate` setting which is available for each Search UI Components.

[How to use precompiled templates](#using-handlebars-pre-compiled-templates)

## General functions

### Execute search

Execute a search query with a specific keyword. Common use cases include links of most popular
keywords: Clicking the keyword executes the search.

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

Handlebars Helpers can be used to implement functionality that is not part of the Handlebars
language itself. Read more at
[handlebarsjs.js](https://handlebarsjs.com/guide/expressions.html#helpers).

```js
// This function can be called in a Handlebars template: {{toUpperCase "foo"}}
searchui.registerHandlebarsHelper('toUpperCase', function (param) {
  return param.toUpperCase();
});
```

### Register a custom Handlebars partial

Handlebars allows for template reuse through partials. Partials are normal Handlebars templates that
may be called directly by other templates. Read more at
[handlebarsjs.js](https://handlebarsjs.com/guide/partials.html#basic-partials).

```js
// This function can be called in a Handlebars template: {{toUpperCase "foo"}}
var partialTemplate = `Print this line in main template.`;
searchui.registerHandlebarsPartial('myPartial', partialTemplate);
```

```js
  // Calling the partial in main template
  {{> myPartial}}
```

### Using Handlebars pre-compiled templates

Each Search UI Library's component provided a setting to pass your own pre-compiled template.

To get started, install Handlebars npm package, which contains the precompiler:

```js
  npm install -g handlebars
```

Create a file name `example.handlebars` containing your template:

```js
<div>My example {{ contextVariable }}</div>
```

Run the precompiler on your template file:

```js
  handlebars searchfield.handlebars -f searchfield.precompiled.js
```

Or precompile the whole directory

```js
  handlebars your-dir/all-templates/> output-dir/all-precompiled-templates-srp.js -c handlebars/runtime
```

`-c` flag creates a `require` statement for Handlebars-runtime in your precompiled template file.
Please note that -c will build your templates into a CommonJS module, which is not supported in the
browser.

Use the precompiled template inside a component, for example:

```js
// Handlebars are exported within Search UI Library's module as Handlebars_runtime
// You can also install handlebars runtime package and import it
// Below code will use your precompiled template of the file name "searchfield.handlebars"

var Handlebars = AddSearchUI.Handlebars_runtime;
var precompiledTemplates = Handlebars.templates;
searchui.searchField({
  containerId: 'searchfield-container',
  precompiledTemplate: precompiledTemplates['searchfield'],
  autofocus: true,
  placeholder: 'Keyword..',
  button: 'Search',
  searchAsYouType: false
});
```

Read more at
[handlebarsjs precompiling templates](https://handlebarsjs.com/installation/precompilation.html)

See our [example](https://demo.addsearch.com/search-ui-examples/precompiledtemplates/).

Notes:

- Handlebars are exposed globally, so you can access it with `Handlebars` variable.
- All your pre-compiled templates can be accessed with `Handlebars.templates` after loading the
  template js function on your site.
- Custom helpers are registered with `Handlebars.registerHelper(helperName, helperFunction)`
- Custom partials are registered with
  `Handlebars.registerPartial(partialName, precompiledTemplates);` (Partials are pre-compiled the
  same way as templates)

## Analytics

This library sends analytics events to AddSearch Analytics Dashboard when:

- Search results are returned
- No results were found
- A result was clicked

You can add integration for third party analytics software by passing a custom _analyticsCallback_
function in AddSearchClient constructor's
[configuration object](#search-ui-instance-and-configuration). This function is called with a single
parameter containing one of the following JSON objects:

#### Search results received:

```js
{
  action: 'search',
  keyword: 'keyword',
  numberOfResults: 10, // If 0, no results were found
  processingTimeMs: 21 // Time it took to process the query and return search results (in milliseconds)
}
```

In search-as-you-type implementations the _search_ event is sent after 2,5 second delay in typing or
if a result is clicked within this debounce time.

#### Search result clicked:

```js
{
  action: 'click',
  keyword: 'keyword',
  documentId: '...', // Hit's 32-char identifier
  position: 1 // Position of the clicked result. The first result being 1
}
```

To save clicks reliably before the user's browser leaves the page, it's recommended to use the
[navigator.sendBeacon](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)
method.

## Supported web browsers

This library is tested on

- Chrome
- Firefox
- Edge
- Safari 6.1+
- Internet Explorer 11

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

Build a production bundle. The file is saved under the _dist/_ folder

```sh
npm run build
```

## Support

Feel free to send any questions, ideas, and suggestions at
[support@addsearch.com](mailto:support@addsearch.com) or visit
[addsearch.com](https://www.addsearch.com/) for more information.
