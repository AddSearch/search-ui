/* global window, history */
import { WARMUP_QUERY_PREFIX, MATCH_ALL_QUERY } from '../index';
import { setKeyword } from '../actions/keyword';
import { setPage } from '../actions/pagination';
import { setActiveFilters, setActiveFacets, setActiveRangeFacets } from '../actions/filters';
import { sortBy } from '../actions/sortby';

export const HISTORY_PARAMETERS = {
  SEARCH: 'search',
  FILTERS: 'search_filters',
  FACETS: 'search_facets',
  PAGE: 'search_page',
  SORTBY: 'search_sort',
  RANGE_FACETS: 'range_facets'
};

const SET_HISTORY_DEBOUNCE_TIME = 1500;

const SESSION_STORAGE_SEARCH_PARAMETERS_KEY = 'addsearch-searchParameters';

let setHistoryDebounceTimeout = null;

/**
 * Store search parameters to session storage
 */
function storeSearchParametersToSessionStorage(searchParameters) {
  sessionStorage.setItem(SESSION_STORAGE_SEARCH_PARAMETERS_KEY, JSON.stringify(searchParameters));
}

/**
 * Get search parameters from session storage
 */
function getSearchParametersFromSessionStorage() {
  return JSON.parse(sessionStorage.getItem(SESSION_STORAGE_SEARCH_PARAMETERS_KEY)) || {};
}

// Set history right away or after a debounce delay
export function setHistory(parameter, value, debounce, store) {
  const state = store.getState();
  if (state && state.configuration && state.configuration.updateBrowserHistory === false) {
    return;
  }
  const searchPersistence = state.configuration.searchPersistence;
  // Debounce for search-as-you-type
  if (debounce) {
    if (setHistoryDebounceTimeout) {
      clearTimeout(setHistoryDebounceTimeout);
    }
    setHistoryDebounceTimeout = setTimeout(() => {
      doSetHistory(parameter, value, searchPersistence);
    }, SET_HISTORY_DEBOUNCE_TIME);
  }

  // No debounce
  else {
    doSetHistory(parameter, value, searchPersistence);
  }
}

// Set the actual history state
function doSetHistory(parameter, value, searchPersistence) {
  // ignore warmup search query
  if (
    parameter === HISTORY_PARAMETERS.SEARCH &&
    value &&
    value.indexOf(WARMUP_QUERY_PREFIX) === 0
  ) {
    return;
  }

  let url = window.location.href;
  if (url.indexOf('#') !== -1) {
    url = url.substring(0, url.indexOf('#'));
  }
  const hash = window.location.hash || '';

  const params =
    searchPersistence === 'url'
      ? queryParamsToObject(url)
      : getSearchParametersFromSessionStorage();

  // If pagination parameter and page=1, don't add to URL
  if (parameter === HISTORY_PARAMETERS.PAGE && value == 1) {
    delete params[parameter];
  }
  // If search=*, don't add to URL
  else if (parameter === HISTORY_PARAMETERS.SEARCH && value == MATCH_ALL_QUERY) {
    delete params[parameter];
  }
  // Add value to URL if an value exists and it's not empty
  else if (parameter && value !== null && value !== '') {
    params[parameter] = value;
  }
  // No value. Delete query parameter
  else if (parameter) {
    delete params[parameter];
  }

  let stateUrl = url;
  if (url.indexOf('?') !== -1) {
    stateUrl = url.substring(0, url.indexOf('?'));
  }
  if (JSON.stringify(params) !== JSON.stringify({})) {
    stateUrl = stateUrl + '?' + objectToQueryParams(params);
  }

  // Put hash back to URL
  stateUrl = stateUrl + hash;

  if (searchPersistence === 'session-storage') {
    storeSearchParametersToSessionStorage(params);
  } else {
    // Firt time called
    if (history.state === null) {
      history.replaceState(params, '', stateUrl);
    }
    // Update history if it has changed
    else if (JSON.stringify(history.state) !== JSON.stringify(params)) {
      history.pushState(params, '', stateUrl);
    }
  }
}

export function getQueryParam(url, param) {
  const name = param.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function initFromUrlOrBrowserStorage(
  client,
  reduxStore,
  createFilterObjectFunction,
  searchFunction,
  hasMatchAllQuery,
  baseFilters
) {
  // Initial load
  const searchPersistence = reduxStore.getState().configuration.searchPersistence;
  const url = window.location.href;
  const qs =
    searchPersistence === 'url'
      ? queryParamsToObject(url)
      : getSearchParametersFromSessionStorage();

  handleURLParams(
    client,
    reduxStore,
    qs,
    createFilterObjectFunction,
    searchFunction,
    false,
    baseFilters
  );

  // Browser back button. Re-handle URL
  window.onpopstate = (e) => {
    const qs =
      searchPersistence === 'url'
        ? queryParamsToObject(window.location.href)
        : getSearchParametersFromSessionStorage();

    handleURLParams(
      client,
      reduxStore,
      qs,
      createFilterObjectFunction,
      searchFunction,
      hasMatchAllQuery,
      baseFilters
    );
  };
}

function handleURLParams(
  client,
  store,
  qs,
  createFilterObjectFunction,
  searchFunction,
  hasMatchAllQuery,
  baseFilters
) {
  let hasFacetsOrFilters = false;
  if (qs[HISTORY_PARAMETERS.FILTERS]) {
    // Take active filters from URL
    const filtersJson = urlParamToJSON(qs[HISTORY_PARAMETERS.FILTERS]);
    store.dispatch(setActiveFilters(filtersJson));
    hasFacetsOrFilters = true;
  }

  if (qs[HISTORY_PARAMETERS.FACETS]) {
    // Take active facets from URL
    const facetsJson = urlParamToJSON(qs[HISTORY_PARAMETERS.FACETS]);
    store.dispatch(setActiveFacets(facetsJson));
    hasFacetsOrFilters = true;
  }

  if (qs[HISTORY_PARAMETERS.RANGE_FACETS]) {
    const rangeFacetsJson = urlParamToJSON(qs[HISTORY_PARAMETERS.RANGE_FACETS]);
    store.dispatch(setActiveRangeFacets(rangeFacetsJson));
    hasFacetsOrFilters = true;
  }

  // Has facets or filters. Update client state
  if (hasFacetsOrFilters) {
    const filterState = store.getState().filters;
    const filterObject = createFilterObjectFunction(filterState, baseFilters);
    client.setFilterObject(filterObject);
  }
  // No facets or filters
  else {
    store.dispatch(setActiveFilters(null));
    store.dispatch(setActiveFacets(null));
    client.setFilterObject(baseFilters || null);
  }

  // Has sort method
  if (qs[HISTORY_PARAMETERS.SORTBY]) {
    // Take sort method from URL
    const sortMethod = urlParamToJSON(qs[HISTORY_PARAMETERS.SORTBY]);
    store.dispatch(sortBy(client, sortMethod.field, sortMethod.order));
  }

  if (qs[HISTORY_PARAMETERS.PAGE]) {
    store.dispatch(setPage(client, parseInt(qs[HISTORY_PARAMETERS.PAGE], 10), null, store));
  } else {
    const paging = client.getSettings().paging;
    store.dispatch(setPage(client, paging.page, null, store));
  }

  if (qs[HISTORY_PARAMETERS.SEARCH]) {
    const keyword = qs[HISTORY_PARAMETERS.SEARCH];
    store.dispatch(setKeyword(keyword, true, null, true));
    searchFunction(keyword);
  } else if (hasMatchAllQuery === true) {
    store.dispatch(setKeyword(MATCH_ALL_QUERY, true, null, true));
    searchFunction(MATCH_ALL_QUERY);
  }
}

/**
 * Pick up query parameters from an URL and return them as a JSON object
 *
 * Example: ?foo=bar&baz=x returns
 * { foo: 'bar', baz: 'x' }
 */
export function queryParamsToObject(url) {
  if (url.indexOf('?') === -1) {
    return {};
  }

  let qs = url.substring(url.indexOf('?') + 1);
  if (qs === '') {
    return {};
  }
  if (qs.indexOf('#') !== -1) {
    qs = qs.substring(0, qs.indexOf('#'));
  }

  let obj = {};
  const qsArr = qs.split('&');
  const qsArrUnrelated = qsArr.filter(
    (v) =>
      v.indexOf(HISTORY_PARAMETERS.SEARCH) === -1 &&
      v.indexOf(HISTORY_PARAMETERS.PAGE) === -1 &&
      v.indexOf(HISTORY_PARAMETERS.SORTBY) === -1 &&
      v.indexOf(HISTORY_PARAMETERS.FILTERS) === -1 &&
      v.indexOf(HISTORY_PARAMETERS.FACETS) === -1 &&
      v.indexOf(HISTORY_PARAMETERS.RANGE_FACETS) === -1
  );
  const qsArrUsedInSearch = qsArr.filter((v) => !qsArrUnrelated.includes(v));

  if (qsArrUnrelated.length) {
    obj['addsearchUnrelatedParams'] = qsArrUnrelated.join('&');
  }

  qsArrUsedInSearch.forEach((v) => {
    const kv = v.split('=');
    if (kv[0] && kv[0].length > 0) {
      let value = null;
      if (kv.length > 1) {
        value = kv[1] || '';
        value = value.replace(/\+/g, '%20');
        value = decodeURIComponent(value);
      }
      obj[kv[0]] = value;
    }
  });

  return obj;
}

/**
 * Example: { foo: 'bar', baz: 'x' } returns
 * foo=bar&baz=x
 */
export function objectToQueryParams(obj) {
  let qs = '';

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (qs !== '') {
        qs = qs + '&';
      }
      let value = '';
      if (key === 'addsearchUnrelatedParams') {
        const unrelatedParams = obj[key].split('&');
        qs = qs + unrelatedParams.join('&');
        continue;
      }
      if (obj[key] !== null && obj[key] !== undefined && key !== 'addsearchUnrelatedParams') {
        value = '=' + encodeURIComponent(obj[key]);
      }
      qs = qs + key + value;
    }
  }

  return qs;
}

/**
 * Transfer a URL parameter to a JSON object
 */
export function urlParamToJSON(urlParameter) {
  try {
    return JSON.parse(urlParameter);
  } catch (error) {}
  return null;
}

/**
 * Transfer JSON object to a string suitable for URL param
 */
export function jsonToUrlParam(json) {
  if (Object.keys(json).length > 0) {
    delete json['v'];
    return JSON.stringify(json);
  }
  return null;
}

export function rangeFacetsJsonToUrlParam(json) {
  const fieldKeysList = {};
  for (let field in json) {
    if (field !== 'v') {
      fieldKeysList[field] = [];
      for (let key in json[field]) {
        fieldKeysList[field].push(key);
      }
    }
  }
  return JSON.stringify(fieldKeysList);
}

/**
 * Redirect to search results page
 */
export function redirectToSearchResultsPage(url, keyword, searchPersistence) {
  if (searchPersistence === 'session-storage') {
    storeSearchParametersToSessionStorage({ [HISTORY_PARAMETERS.SEARCH]: keyword });
    window.location.href = url;
    return;
  }

  if (url.indexOf('?') === -1) {
    window.location.href =
      url + '?' + HISTORY_PARAMETERS.SEARCH + '=' + encodeURIComponent(keyword);
  } else {
    window.location.href =
      url + '&' + HISTORY_PARAMETERS.SEARCH + '=' + encodeURIComponent(keyword);
  }
}
