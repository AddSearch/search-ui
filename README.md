# AddSearch Search UI Library

## Example
```html
<div id="searchbar"></div>
<div id="results"></div>

<script>
  // AddSearch JS client library
  var client = new AddSearchClient('YOUR PUBLIC SITEKEY');

  // Configuration
  var conf = {
    debug: true
  };

  // Search UI library
  var searchui = new AddSearchSearchUI(client, conf);

  // Add searchbar
  searchui.searchBar({
    containerId: 'searchbar',
    placeholder: 'Keyword..',
    button: 'Search'
  });

  // Add search results view
  searchui.searchResults({
    containerId: 'results'
  });
</script>
```

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