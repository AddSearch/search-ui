import './searchbar.scss';
import handlebars from 'handlebars';
import { search } from '../../actions/search';
import { setKeyword } from '../../actions/keyword';
import { getStore } from '../../store';

/**
 * HTML template
 */
const TEMPLATE = `
  <form class="addsearch-searchbar" autocomplete="off" action="?" role="search">
    <input type="search" placeholder="{{placeholder}}" aria-label="Search field" {{#equals autofocus "true"}}autofocus{{/equals}} />
    {{#if button}}
      <button type="button" aria-label="Search button" >{{button}}</button>
    {{/if}}
  </form>
`;


export default class SearchBar {

  constructor(addSearchClient, settings, searchBarConf) {
    this.addSearchClient = addSearchClient;
    this.settings = settings;
    this.searchBarConf = searchBarConf;

    this.keyword = '';
  }


  /**
   * Add a search bar
   */
  render() {
    // Compile template and inject to container
    const html = handlebars.compile(this.searchBarConf.template || TEMPLATE)(this.searchBarConf);
    const container = document.getElementById(this.searchBarConf.containerId);
    container.innerHTML = html;
    const field = container.getElementsByTagName('input')[0];
    const store = getStore();

    // Keyword already stored in redux
    const preDefinedSearchTerm = store.getState().keyword.value;
    if (preDefinedSearchTerm) {
      this.keyword = preDefinedSearchTerm;
      field.value = preDefinedSearchTerm;
    }

    // Event listeners to the search field
    const self = this;
    field.onkeyup = function(e) {
      const keyword = e.target.value;
      if (keyword === this.keyword) {
        return;
      }

      // Store keyword
      this.keyword = keyword;
      store.dispatch(setKeyword(keyword));

      // Search as you type
      if (self.searchBarConf.searchAsYouType === true) {
        console.log('search ' + keyword);
        store.dispatch(search(self.addSearchClient, keyword));
      }

      // Enter pressed
      if (e.keyCode === 13) {
        if (self.searchBarConf.searchAsYouType !== true) {
          store.dispatch(search(self.addSearchClient, keyword));
        }
        return false;
      }
    };
    field.onkeypress = function(e) {
      // Enter pressed
      if (e.keyCode === 13) {
        return false;
      }
    };
    field.onfocus = function(e) {
      // Warmup query if search-as-you-type
      if (e.target.value === '' && self.searchBarConf.searchAsYouType === true) {
        store.dispatch(search(self.addSearchClient, '_addsearch_' + Math.random()));
      }
    };

    // Event listeners to the possible search button
    if (container.getElementsByTagName('button').length > 0) {
      container.getElementsByTagName('button')[0].onclick = function (e) {
        const keyword = store.getState().keyword.value;
        if (keyword) {
          store.dispatch(search(self.addSearchClient, keyword));
        }
      }
    }
  }
}