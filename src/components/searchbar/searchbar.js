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
    <input type="search" placeholder="{{placeholder}}" autofocus="{{autofocus}}" aria-label="Search field" />
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

    // Event listeners to the search field
    const self = this;
    container.getElementsByTagName('input')[0].onkeyup = function(e) {
      const keyword = e.target.value;
      if (keyword === this.keyword) {
        return;
      }
      this.keyword = keyword;

      getStore().dispatch(setKeyword(keyword));

      if (keyword.length > 0 && keyword !== this.previousSuggestionKeyword) {
        // getStore().dispatch(getSuggestions(addSearchClient, keyword));
        this.previousSuggestionKeyword = keyword;
      }

      // Search as you type
      if (self.searchBarConf.searchAsYouType === true && keyword) {
        console.log('search ' + keyword);
        getStore().dispatch(search(self.addSearchClient, keyword));
      }

      // Enter pressed
      if (e.keyCode === 13) {
        if (keyword && self.searchBarConf.searchAsYouType !== true) {
          getStore().dispatch(search(self.addSearchClient, keyword));
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
    container.getElementsByTagName('input')[0].onfocus = function(e) {
      // Warmup query if search-as-you-type
      if (e.target.value === '' && self.searchBarConf.searchAsYouType === true) {
        getStore().dispatch(search(self.addSearchClient, '_addsearch_' + Math.random()));
      }
    };

    // Event listeners to the possible search button
    if (container.getElementsByTagName('button').length > 0) {
      container.getElementsByTagName('button')[0].onclick = function (e) {
        const keyword = container.getElementsByTagName('input')[0].value;
        if (keyword) {
          getStore().dispatch(search(self.addSearchClient, keyword));
        }
      }
    }
  }
}