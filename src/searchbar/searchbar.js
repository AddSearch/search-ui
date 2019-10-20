import './searchbar.scss';
import handlebars from 'handlebars';
import { setKeyword, search } from '../actions';
import { getStore } from '../index';


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

  search(addSearchClient, keyword, resultsCallback) {
    console.log('SEARCH function');
    addSearchClient.search(keyword, resultsCallback);
    history.pushState(null, keyword, "?search=" + keyword);
  }

  getQueryParam(url, param) {
    const name = param.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  /**
   * Add a search bar
   */
  render(addSearchClient, resultsCallback, conf) {
    // Compile template and inject to container
    const html = handlebars.compile(conf.template || TEMPLATE)(conf);
    const container = document.getElementById(conf.containerId);
    container.innerHTML = html;

    // Event listeners to the search field
    const self = this;
    container.getElementsByTagName('input')[0].onkeyup = function(e) {
      const keyword = e.target.value;

      getStore().dispatch(setKeyword(keyword));

      // Search as you type
      if (conf.searchAsYouType === true && keyword) {
        self.search(addSearchClient, keyword, resultsCallback);
      }

      // Enter pressed
      if (e.keyCode === 13) {
        if (keyword && conf.searchAsYouType !== true) {
          self.search(addSearchClient, keyword, resultsCallback);
        }
        return false;
      }
    };

    // Event listeners to the possible search button
    if (container.getElementsByTagName('button').length > 0) {
      container.getElementsByTagName('button')[0].onclick = function (e) {
        const keyword = container.getElementsByTagName('input')[0].value;
        if (keyword) {
          self.search(addSearchClient, keyword, resultsCallback);
          getStore().dispatch(search(addSearchClient, keyword));
        }
      }
    }


    // Execute search onload
    const url = window.location.href;
    if (this.getQueryParam(url, 'search')) {
      const q = this.getQueryParam(url, 'search');
      container.getElementsByTagName('input')[0].value = q
      self.search(addSearchClient, q, resultsCallback);
    }

    window.onpopstate = function(event) {
      const q = this.getQueryParam(document.location, 'search');
      if (q) {
        container.getElementsByTagName('input')[0].value = q
        self.search(addSearchClient, q, resultsCallback);
      }
    }

  }
}
//module.exports = searchbar;