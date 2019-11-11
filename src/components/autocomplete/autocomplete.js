import './autocomplete.scss';
import handlebars from 'handlebars';

import { getSuggestions } from '../../actions/searchsuggestions';
import { getStore, observeStoreByKey } from '../../store';

const TEMPLATE = `
  <div class="addsearch-autocomplete">
    {{#gt items 0}}
      <div class="items">
      {{#each ../suggestions}}
        <div>
         {{value}}
        </div>
      {{/each}}
      </div>
    {{/gt}}
  </div>
`;


export default class Autocomplete {

  constructor(client, conf) {
    this.client = client;
    this.conf = conf;

    observeStoreByKey(getStore(), 'searchsuggestions', () => this.render());
    observeStoreByKey(getStore(), 'keyword', (v) => this.keywordChanged(v));
  }


  keywordChanged(kw) {
    // Fetch suggestions if keyword was typed. Not externally set (by browser's back button or like)
    if (kw.externallySet === false) {
      getStore().dispatch(getSuggestions(this.client, kw.value));
    }
    // Clear
    else {
      getStore().dispatch(getSuggestions(this.client, null));
    }
  }


  render() {
    const suggestions = getStore().getState().searchsuggestions.suggestions;

    console.log('new suggestions ');
    console.log(suggestions);

    const data = {
      items: suggestions.length,
      suggestions
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