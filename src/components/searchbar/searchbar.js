import './searchbar.scss';
import handlebars from 'handlebars';
import { search } from '../../actions/search';
import { setKeyword } from '../../actions/keyword';
import { getSuggestions } from '../../actions/suggestions';
import { getStore, observeStoreByKey } from '../../store';
import { getQueryParam } from '../../util/history';


/**
 * HTML template
 */
const TEMPLATE = `
  <form class="addsearch-searchbar" autocomplete="off" action="?" role="search">
    <input type="search" placeholder="{{placeholder}}" autofocus="{{autofocus}}" aria-label="Search field" />
    {{#if button}}
      <button type="button" aria-label="Search button" >{{button}}</button>
    {{/if}}
  </form>
`;


export default class SearchBar {

  constructor() {

  }


  /**
   * Add a search bar
   */
  render(addSearchClient, conf) {
    // Compile template and inject to container
    const html = handlebars.compile(conf.template || TEMPLATE)(conf);
    const container = document.getElementById(conf.containerId);
    container.innerHTML = html;

    // Event listeners to the search field
    const self = this;
    container.getElementsByTagName('input')[0].onkeyup = function(e) {
      const keyword = e.target.value;

      getStore().dispatch(setKeyword(keyword));

      if (keyword.length > 0 && keyword !== this.previousSuggestionKeyword) {
        getStore().dispatch(getSuggestions(addSearchClient, keyword));
        this.previousSuggestionKeyword = keyword;
      }

      // Search as you type
      if (conf.searchAsYouType === true && keyword) {
        getStore().dispatch(search(addSearchClient, keyword));
      }

      // Enter pressed
      if (e.keyCode === 13) {
        if (keyword && conf.searchAsYouType !== true) {
          getStore().dispatch(search(addSearchClient, keyword));
        }
        return false;
      }
    };
    container.getElementsByTagName('input')[0].onkeypress = function(e) {
      // Enter pressed
      if (e.keyCode === 13) {
        return false;
      }
    };

    // Event listeners to the possible search button
    if (container.getElementsByTagName('button').length > 0) {
      container.getElementsByTagName('button')[0].onclick = function (e) {
        const keyword = container.getElementsByTagName('input')[0].value;
        if (keyword) {
          getStore().dispatch(search(addSearchClient, keyword));
        }
      }
    }


    // Execute search onload
    const url = window.location.href;
    if (getQueryParam(url, 'search')) {
      const q = getQueryParam(url, 'search');
      container.getElementsByTagName('input')[0].value = q;
      getStore().dispatch(setKeyword(q));
      getStore().dispatch(search(addSearchClient, q));
    }

    window.onpopstate = function(event) {
      const q = getQueryParam(document.location, 'search');
      if (q) {
        container.getElementsByTagName('input')[0].value = q;
        getStore().dispatch(setKeyword(q));
        getStore().dispatch(search(addSearchClient, q));
      }
    }
  }
}