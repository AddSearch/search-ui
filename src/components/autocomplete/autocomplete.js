import './autocomplete.scss';
import handlebars from 'handlebars';

import { autocompleteSuggestions, autocompleteSearch } from '../../actions/autocomplete';
import { getStore, observeStoreByKey } from '../../store';

const TEMPLATE = `
  <div class="addsearch-autocomplete">
    {{#gt itemCount 0}}
      <div class="items">
        {{#gt ../suggestions.length 0}}
          <div class="suggestions">
          {{#each ../../suggestions}}
            <div>
             {{value}}
            </div>
          {{/each}}
          </div>
        {{/gt}}
        
        {{#gt ../searchResults.length 0}}
          <div class="searchresults">
          {{#each ../../searchResults}}
            <div>
             {{title}}
            </div>
          {{/each}}
          </div>
        {{/gt}}
      </div>
    {{/gt}}
  </div>
`;


export default class Autocomplete {

  constructor(client, conf) {
    this.client = client;
    this.conf = conf;

    observeStoreByKey(getStore(), 'autocomplete', () => this.render());
    observeStoreByKey(getStore(), 'keyword', (v) => this.keywordChanged(v));
  }


  keywordChanged(kw) {
    // Fetch suggestions if keyword was typed, not externally set (by browser's back button)
    const keyword = kw.externallySet === false ? kw.value : null;

    this.conf.sources.forEach(v => {
      if (v.type === 'suggestions') {
        getStore().dispatch(autocompleteSuggestions(v.client, kw.value));
      }
      else if (v.type === 'search') {
        getStore().dispatch(autocompleteSearch(v.client, kw.value));
      }
    });
  }


  render() {
    const suggestions = getStore().getState().autocomplete.suggestions;
    const searchResults = getStore().getState().autocomplete.searchResults;
    console.log(searchResults);

    const data = {
      itemCount: suggestions.length + searchResults.length,
      suggestions,
      searchResults
    };

    const html = handlebars.compile(this.conf.template || TEMPLATE)(data);
    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;

    // Attach events
    /*const options = container.getElementsByTagName('input');
    for (let i=0; i<options.length; i++) {
      let checkbox = options[i];
      checkbox.checked = this.activeFilters.indexOf(checkbox.value) !== -1;

      checkbox.onchange = (e) => {
        this.setFilter(e.target.value, e.target.checked);
      };
    } */
  }
}