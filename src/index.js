import './index.scss';
import handlebars from 'handlebars';
import SearchBar from './components/searchbar';
import SearchResults from './components/searchresults';
import FacetGroup from './components/facetgroup';
import FilterGroup from './components/filtergroup';
import Pagination from './components/pagination';
import oa from 'es6-object-assign';
import { getStore, observeStoreByKey } from './store';
import { initFromURL } from './util/history';

// Static polyfills and helpers
oa.polyfill();
handlebars.registerHelper('equals', function(arg1, arg2, options) {
  return ((arg1+'') === (arg2+'')) ? options.fn(this) : options.inverse(this);
});
handlebars.registerHelper('gt', function(arg1, arg2, options) {
  return arg1 > arg2 ? options.fn(this) : options.inverse(this);
});
handlebars.registerHelper('lt', function(arg1, arg2, options) {
  return arg1 < arg2 ? options.fn(this) : options.inverse(this);
});


export const WARMUP_QUERY_PREFIX = '_addsearch_';

export default class SearchUI {

  constructor(client, settings){
    this.client = client;
    this.settings = settings || {};

    initFromURL(this.client);
  }


  /**
   * Add a search bar
   */
  searchBar(conf) {
    const searchbar = new SearchBar(this.client, this.settings, conf);
    searchbar.render();

    observeStoreByKey(getStore(), 'keyword',
      (s) => {
        if (s.externallySet === true) {
          this.log('Search bar: Keyword changed to ' + s.value + '. Re-rendering');
          searchbar.render(s.value);
        }
      }
    );
  }


  searchResults(conf) {
    const searchresults = new SearchResults(conf);

    observeStoreByKey(getStore(), 'search',
      (s) => {
        if (!s.loading) {
          const t = (new Date()).getTime();
          this.log('Search results: Received search results. Rendering..');
          searchresults.render(s);
          this.log('Search results: done in ' + ((new Date()).getTime() - t) + 'ms');
        }
      }
    );
  }


  facetGroup(conf) {
    if (!this.facetGroups) {
      this.facetGroups = [];
    }

    const facetGroup = new FacetGroup(this.client, conf);
    this.facetGroups.push(facetGroup);
    facetGroup.render();

    observeStoreByKey(getStore(), 'search',
      (s) => {
        if (s && s.results && s.results.facets) {
          this.facetGroups.forEach(fg => {
            fg.render(s.results.facets[fg.getFieldName()]);
          });
        }
      }
    );
  }

  filterGroup(conf) {
    const filterGroup = new FilterGroup(this.client, conf);
    filterGroup.render([]);

    observeStoreByKey(getStore(), 'filters',
      (s) => {
        const active = s.filters ? s.filters.split(',') : null;
        this.log('Filters: Active filters changed to ' + active + '. Re-rendering')
        filterGroup.render(active);
      }
    );
  }


  pagination(conf) {
    const pagination = new Pagination(this.client, conf);
    pagination.render(1, 0, 10);

    observeStoreByKey(getStore(), 'search',
      (s) => {
        if (s.loading !== true) {
          const currentPage = getStore().getState().pagination.page || 1;
          const resultCount = s.results.total_hits || 0;
          pagination.render(currentPage, resultCount, 10);
        }
      }
    );
  }


  log(msg) {
    if (this.settings.debug) {
      console.log(msg);
    }
  }
}