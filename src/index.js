import './index.scss';
import oa from 'es6-object-assign';

import ActiveFilters from './components/activefilters';
import Autocomplete from './components/autocomplete';
import Facets from './components/facets';
import HierarchicalFacets from './components/hierarchicalfacets';
import RangeFacets from './components/rangefacets';
import Filters from './components/filters';
import FilterStateObserver, { createFilterObject } from './components/filters/filterstateobserver';
import LoadMore from './components/loadmore';
import Pagination from './components/pagination';
import SearchField from './components/searchfield';
import SearchResults from './components/searchresults';
import Aianswersresult from './components/aianswersresult';
import SegmentedResults from './components/segmentedresults';
import SortBy from './components/sortby';
import { initRedux } from './store';
import { setExternalAnalyticsCallback, setCollectAnalytics } from './util/analytics';
import { registerDefaultHelpers, registerHelper, registerPartial } from './util/handlebars';
import { initFromUrlOrBrowserStorage, setHistory, HISTORY_PARAMETERS } from './util/history';
import { autocompleteHide } from './actions/autocomplete';
import {
  START,
  fetchSearchResultsStory,
  setSearchResultsPageUrl,
  clearSearchResults
} from './actions/search';
import { fetchAiAnswersResultStory } from './actions/aiAnswers';
import { segmentedSearch } from './actions/segmentedsearch';
import { setKeyword } from './actions/keyword';
import { sortBy } from './actions/sortby';
import { clearSelected } from './actions/filters';
import Recommendations from './components/recommendations';
import { recommend } from './actions/recommendations';
import { setHasAiAnswers, setPauseSegmentedSearch } from './actions/configuration';

export const WARMUP_QUERY_PREFIX = '_addsearch_';
export const MATCH_ALL_QUERY = '*';

// Static
oa.polyfill();
registerDefaultHelpers();

export default class AddSearchUI {
  constructor(client, settings) {
    this.client = client;
    this.segmentedSearchClients = {};
    this.recommendationsSettings = [];
    this.settings = settings || {};
    HISTORY_PARAMETERS.SEARCH = this.settings.searchParameter || HISTORY_PARAMETERS.SEARCH;
    HISTORY_PARAMETERS.FACETS = this.settings.facetsParameter || HISTORY_PARAMETERS.FACETS;
    this.shouldInitializeFromBrowserHistory = false;
    this.reduxStore = initRedux(this.settings);
  }

  start() {
    this.initFromClientSettings();

    // Feed analytics manually with the sendStatsEvent function
    this.client.setCollectAnalytics(false);
    setExternalAnalyticsCallback(this.settings.analyticsCallback);
    setCollectAnalytics(this.settings.collectAnalytics);

    this.reduxStore.dispatch(setSearchResultsPageUrl(this.settings.searchResultsPageUrl));

    // Possible custom function to create filter group with custom and/or logic
    const createFilterObjectFunction =
      this.settings && this.settings.createFilterObjectFunction
        ? this.settings.createFilterObjectFunction
        : createFilterObject;

    // Handle browser history if the user is on a results page (i,e. not just a search field on any page)
    if (this.shouldInitializeFromBrowserHistory) {
      initFromUrlOrBrowserStorage(
        this.client,
        this.reduxStore,
        createFilterObjectFunction,
        (keyword, onResultsScrollTo) => {
          this.executeSearch(
            keyword,
            onResultsScrollTo,
            false,
            null,
            this.settings.fieldForInstantRedirect
          );

          // Execute AI answers if enabled
          keyword &&
            this.reduxStore.getState().configuration.hasAiAnswers &&
            this.executeAiAnswers(keyword, false);
        },
        this.settings.matchAllQuery,
        this.settings.baseFilters
      );
    }

    // FilterStateObserver to update client's filter object when any of the filters change
    new FilterStateObserver(
      this.client,
      this.reduxStore,
      createFilterObjectFunction,
      this.settings.onFilterChange,
      this.settings.baseFilters,
      this.segmentedSearchClients,
      this.settings.onFilteredSearchRefresh
    );

    // Possible match all query on load
    if (this.settings.matchAllQuery === true) {
      this.matchAllQuery();
    }

    // fetch all recommendations
    for (var i = 0; i < this.recommendationsSettings.length; i++) {
      if (!this.recommendationsSettings[i].ignoreFetchOnStart) {
        this.fetchRecommendation(this.recommendationsSettings[i].containerId);
      }
    }

    this.reduxStore.dispatch({
      type: START
    });
  }

  executeSearch(
    keyword,
    onResultsScrollTo,
    searchAsYouType,
    fieldForInstantRedirect,
    fieldForInstantRedirectGlobal,
    disableSearch
  ) {
    if (!disableSearch) {
      this.reduxStore.dispatch(
        fetchSearchResultsStory(
          this.client,
          keyword,
          onResultsScrollTo,
          false,
          searchAsYouType,
          this.reduxStore,
          fieldForInstantRedirect,
          'executeSearch',
          fieldForInstantRedirectGlobal
        )
      );
    }

    if (this.reduxStore.getState().configuration.pauseSegmentedSearch) {
      return;
    }

    for (let key in this.segmentedSearchClients) {
      this.reduxStore.dispatch(
        segmentedSearch(this.segmentedSearchClients[key].client, key, keyword)
      );
    }
  }

  executeAiAnswers(keyword) {
    this.reduxStore.dispatch(fetchAiAnswersResultStory(this.client, keyword));
  }

  fetchRecommendation(containerId) {
    const recoSetting = this.recommendationsSettings.filter(
      (setting) => setting.containerId === containerId
    )[0];
    if (!recoSetting) return;
    this.reduxStore.dispatch(
      recommend(this.client, {
        container: recoSetting.containerId,
        type: recoSetting.type,
        blockId: recoSetting.blockId,
        configurationKey: recoSetting.configurationKey,
        itemId: !recoSetting.getProductIdFunction
          ? null
          : recoSetting.getProductIdFunction.call(undefined, undefined)
      })
    );
  }

  /*
   * Utils
   */

  initFromClientSettings() {
    const paging = this.client.getSettings().paging;
    const hasPageParameterInUrl = new URLSearchParams(window.location.search).has(
      HISTORY_PARAMETERS.PAGE
    );
    const hasSortByParameterInUrl = new URLSearchParams(window.location.search).has(
      HISTORY_PARAMETERS.SORTBY
    );
    const shouldUpdateSortParameterOnPageLoad =
      !hasSortByParameterInUrl && !(paging.sortBy === 'relevance' && paging.sortOrder === 'desc');

    this.reduxStore.dispatch(sortBy(this.client, paging.sortBy, paging.sortOrder));

    if (!hasPageParameterInUrl && paging.page > 1) {
      setHistory(HISTORY_PARAMETERS.PAGE, paging.page + '', null, this.reduxStore);
    }

    if (shouldUpdateSortParameterOnPageLoad) {
      setHistory(
        HISTORY_PARAMETERS.SORTBY,
        JSON.stringify({ field: paging.sortBy, order: paging.sortOrder }),
        null,
        this.reduxStore
      );
    }
  }

  matchAllQuery(onResultsScrollTo) {
    const store = this.reduxStore;
    if (store.getState().keyword.value === '') {
      store.dispatch(setKeyword(MATCH_ALL_QUERY, true));
      this.executeSearch(MATCH_ALL_QUERY, onResultsScrollTo, false);
    }
  }

  log(msg) {
    if (this.settings.debug) {
      console.log(msg);
    }
  }

  /*
   * Components
   */

  searchField(conf) {
    if (conf.fieldForInstantRedirect) {
      console.log(
        'WARNING: searchField setting "fieldForInstantRedirect" is deprecated. Use it ' +
          'in Search UI configuration object instead.'
      );
    }

    const onSearch = (
      keyword,
      onResultsScrollTo,
      searchAsYouType,
      fieldForInstantRedirect,
      fieldForInstantRedirectGlobal,
      disableSearch
    ) => {
      this.executeSearch(
        keyword,
        onResultsScrollTo,
        searchAsYouType,
        fieldForInstantRedirect,
        fieldForInstantRedirectGlobal,
        disableSearch
      );

      // Do not fetch AI answers for warmup queries.
      !keyword.startsWith(WARMUP_QUERY_PREFIX) &&
        this.reduxStore.getState().configuration.hasAiAnswers &&
        !searchAsYouType && // TODO revisit whether AI answers should be executed on search as you type
        this.executeAiAnswers(keyword, searchAsYouType);
    };

    const SearchFieldInstance = new SearchField(
      this.client,
      this.reduxStore,
      conf,
      this.settings.matchAllQuery === true,
      onSearch
    );

    return SearchFieldInstance;
  }

  autocomplete(conf) {
    new Autocomplete(this.client, this.reduxStore, this.settings.hasAiAnswers, conf);
  }

  aiAnswersResult(conf) {
    this.shouldInitializeFromBrowserHistory = true;

    new Aianswersresult(this.client, this.reduxStore, conf);
  }

  searchResults(conf) {
    this.shouldInitializeFromBrowserHistory = true;

    new SearchResults(this.client, this.reduxStore, conf);
  }

  segmentedSearchResults(conf) {
    if (!conf.client) {
      console.log('WARNING: segmentedResults component must have a client instance');
      return;
    }
    this.shouldInitializeFromBrowserHistory = true;

    this.segmentedSearchClients[conf.containerId] = {};
    this.segmentedSearchClients[conf.containerId].client = conf.client;
    this.segmentedSearchClients[conf.containerId].originalFilters = Object.assign(
      {},
      conf.client.getSettings().filterObject
    );
    new SegmentedResults(conf.client, this.reduxStore, conf);
  }

  facets(conf) {
    new Facets(this.client, this.reduxStore, conf, this.settings.baseFilters);
  }

  hierarchicalFacets(conf) {
    new HierarchicalFacets(this.client, this.reduxStore, conf, this.settings.baseFilters);
  }

  rangeFacets(conf) {
    new RangeFacets(this.client, this.reduxStore, conf, this.settings.baseFilters);
  }

  filters(conf) {
    new Filters(this.client, this.reduxStore, conf);
  }

  sortBy(conf) {
    new SortBy(this.client, this.reduxStore, conf);
  }

  pagination(conf) {
    new Pagination(this.client, this.reduxStore, conf);
  }

  loadMore(conf) {
    new LoadMore(this.client, this.reduxStore, conf);
  }

  activeFilters(conf) {
    new ActiveFilters(this.client, this.reduxStore, conf);
  }

  recommendations(conf) {
    new Recommendations(this.client, this.reduxStore, conf, this.recommendationsSettings);
  }

  /*
   * Public functions
   */

  search(keyword) {
    this.reduxStore.dispatch(setKeyword(keyword, true));
    this.executeSearch(keyword, null, false);

    if (this.reduxStore.getState().configuration.hasAiAnswers) {
      this.executeAiAnswers(keyword);
    }
  }

  hideAutocomplete() {
    this.reduxStore.dispatch(autocompleteHide());
  }

  clear() {
    const store = this.reduxStore;
    store.dispatch(setKeyword('', true));
    store.dispatch(clearSelected(true));

    if (this.settings.matchAllQuery === true) {
      this.matchAllQuery('top');
    } else {
      store.dispatch(clearSearchResults('top'));
    }
  }

  enableAiAnswers(shouldEnable) {
    this.reduxStore.dispatch(setHasAiAnswers(shouldEnable));
  }

  setCollectAnalytics(collect) {
    setCollectAnalytics(collect);
  }

  pauseSegmentedSearch(pause) {
    this.reduxStore.dispatch(setPauseSegmentedSearch(pause));
  }

  registerHandlebarsHelper(helperName, helperFunction) {
    registerHelper(helperName, helperFunction);
  }

  registerHandlebarsPartial(partialName, partialTemplate) {
    registerPartial(partialName, partialTemplate);
  }
}
