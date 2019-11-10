import './searchbar.scss';
import handlebars from 'handlebars';
import { search } from '../../actions/search';
import { setPage } from '../../actions/pagination';
import { setKeyword } from '../../actions/keyword';
import { getStore, observeStoreByKey } from '../../store';
import { MATCH_ALL_QUERY, WARMUP_QUERY_PREFIX } from '../../index';

/**
 * HTML template
 */
const TEMPLATE = `
  <form class="addsearch-searchbar" autocomplete="off" action="?" role="search">
    <input type="search" placeholder="{{placeholder}}" aria-label="Search field" />
    {{#if button}}
      <button type="button" aria-label="Search button" >{{button}}</button>
    {{/if}}
  </form>
`;


export default class SearchBar {

  constructor(client, conf, matchAllQueryWhenSearchBarEmpty) {
    this.client = client;
    this.conf = conf;
    this.matchAllQuery = matchAllQueryWhenSearchBarEmpty;
    this.firstRenderDone = false;

    observeStoreByKey(getStore(), 'keyword', () => this.render());
  }


  search(client, keyword) {
    let kw = keyword;
    if (kw === '' && this.matchAllQuery) {
      kw = MATCH_ALL_QUERY;
    }

    const store = getStore();
    store.dispatch(setPage(client, 1));
    store.dispatch(search(client, kw));
  }


  render() {
    const store = getStore();
    const preDefinedKeyword = store.getState().keyword.value;

    const container = document.getElementById(this.conf.containerId);

    // Field already exists. Don't re-render
    if (container.querySelector('input') &&
        container.querySelector('input').value === preDefinedKeyword) {
      return;
    }

    // New field. Render
    container.innerHTML = handlebars.compile(this.conf.template || TEMPLATE)(this.conf);
    const field = container.querySelector('input');

    // Set value. Don't pass to template to get the keyboard caret position right
    if (preDefinedKeyword !== MATCH_ALL_QUERY) {
      field.value = preDefinedKeyword;
    }

    // Event listeners to the field
    field.onkeyup = (e) => {
      const keyword = e.target.value;

      // Store keyword
      store.dispatch(setKeyword(keyword));

      // Search as you type
      if (this.conf.searchAsYouType === true) {
        this.search(this.client, keyword);
      }
    };

    field.onkeypress = (e) => {
      // Enter pressed
      if (e.keyCode === 13) {
        const keyword = e.target.value;
        this.search(this.client, keyword);
        return false;
      }
    };

    field.onfocus = (e) => {
      // Warmup query if search-as-you-type
      if (e.target.value === '' && this.conf.searchAsYouType === true) {
        this.search(this.client, WARMUP_QUERY_PREFIX + Math.random());
        //store.dispatch(search(this.client, WARMUP_QUERY_PREFIX + Math.random()));
      }
    };

    // Event listeners to the possible search button
    if (container.getElementsByTagName('button').length > 0) {
      container.getElementsByTagName('button')[0].onclick = (e) => {
        const keyword = store.getState().keyword.value;
        this.search(this.client, keyword);
      }
    }

    // Autofocus when loaded first time
    if (this.conf.autofocus !== false &&
        this.firstRenderDone === false) {
      field.focus();
      this.firstRenderDone = true;
    }
  }
}