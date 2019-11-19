import './autocomplete.scss';
import handlebars from 'handlebars';

import { autocompleteSuggestions, autocompleteSearch, setActiveSuggestion } from '../../actions/autocomplete';
import { search } from '../../actions/search';
import { setKeyword } from '../../actions/keyword';
import { getStore, observeStoreByKey } from '../../store';
import { renderToContainer } from '../../util/dom';

const TEMPLATE = `
  <div class="addsearch-autocomplete">
    {{#gt suggestions.length 0}}
      <ul class="suggestions">
        {{#each ../suggestions}}
          <li data-keyword="{{value}}" data-index="{{@index}}" {{#equals ../../activeSuggestionIndex @index}}class="active"{{/equals}}>
            {{value}}
          </li>
        {{/each}}
      </ul>
    {{/gt}}
  </div>
`;


export default class Autocomplete {

  constructor(client, conf) {
    this.client = client;
    this.conf = conf;
    this.lastOnmouseOver = null;

    observeStoreByKey(getStore(), 'autocomplete', () => this.render());
    observeStoreByKey(getStore(), 'keyword', (v) => this.keywordChanged(v));
  }


  keywordChanged(kw) {
    // Fetch suggestions if keyword was typed, not externally set (by browser's back button)
    const keyword = kw.externallySet === false ? kw.value : null;
    console.log('Fetching new suggestions with keyword ' + kw.value);

    this.conf.sources.forEach(v => {
      const client = v.client || this.client;
      if (v.type === 'suggestions') {
        getStore().dispatch(autocompleteSuggestions(client, keyword));
      }
      else if (v.type === 'search') {
        getStore().dispatch(autocompleteSearch(client, v.jsonKey, keyword));
      }
    });
  }


  render() {
    const autocompleteState = getStore().getState().autocomplete;

    // Don't re-render while requests are pending
    if (autocompleteState.pendingRequests !== 0) {
      return;
    }

    // Hide autocomplete
    if (autocompleteState.hide === true) {
      document.getElementById(this.conf.containerId).innerHTML = '';
      return;
    }

    // Show autocomplete results (search suggestions, search results, or both)
    const { suggestions, searchResults, activeSuggestionIndex } = autocompleteState;
    const data = {
      activeSuggestionIndex,
      suggestions,
      searchResults
    };

    const container = renderToContainer(this.conf.containerId, this.conf.template || TEMPLATE, data);

    // Attach events
    const lis = container.getElementsByTagName('li');
    for (let i=0; i<lis.length; i++) {
      lis[i].onmousedown = (e) => {
        const keyword = e.target.getAttribute('data-keyword');
        getStore().dispatch(setKeyword(keyword, true));
        getStore().dispatch(search(this.client, keyword));
      };
      lis[i].onmouseover = (e) => {
        const index = parseInt(e.target.getAttribute('data-index'), 10);
        // Fire once
        if (index !== null && index !== this.lastOnmouseOver) {
          this.lastOnmouseOver = index;
          getStore().dispatch(setActiveSuggestion(index));
        }
      };
    }
  }
}