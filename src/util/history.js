/* global window, history */
import { WARMUP_QUERY_PREFIX } from '../index';
import { search, clearSearchResults } from '../actions/search';
import { setKeyword } from '../actions/keyword';
import { setPage } from '../actions/pagination';
import { setActiveFilters } from '../actions/filters';
import { getStore } from '../store';

export const HISTORY_PARAMETERS = {
  SEARCH: 'search',
  FILTERS: 'search_filters',
  PAGE: 'search_page'
}


export function setHistory(parameter, value) {
  // ignore warmup search query
  if (parameter === HISTORY_PARAMETERS.SEARCH &&
      value && value.indexOf(WARMUP_QUERY_PREFIX) === 0) {
    return;
  }

  const url = window.location.href;
  const params = queryParamsToObject(url);

  // If pagination parameter and page=1, don't add to URL
  if (parameter === HISTORY_PARAMETERS.PAGE && value == 1) {
    delete params[parameter];
  }
  // Add value to URL
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

  // Update history if it has changed
  if (JSON.stringify(history.state) !== JSON.stringify(params)) {
    history.pushState(params, null, stateUrl);
  }
}


export function getQueryParam(url, param) {
  const name = param.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}


export function initFromURL(client, createFilterObjectFunction) {
  // Initial load
  const url = window.location.href;
  const qs = queryParamsToObject(url);
  const store = getStore();
  handleURLParams(store, client, qs, false, createFilterObjectFunction);

  // Browser back button. Re-handle URL
  window.onpopstate = (e) => {
    const q = queryParamsToObject(window.location.href);
    handleURLParams(store, client, q, true, createFilterObjectFunction);
  }
}


function handleURLParams(store, client, qs, clearIfNoKeyword, createFilterObjectFunction) {
  if (qs[HISTORY_PARAMETERS.FILTERS]) {
    // Take active filters from URL
    const filtersJson = urlParamToJSON(qs[HISTORY_PARAMETERS.FILTERS]);
    store.dispatch(setActiveFilters(filtersJson));

    // Set the whole filter state to AddSearch Client
    const filterState = store.getState().filters;
    const filterObject = createFilterObjectFunction(filterState);
    client.setFilterObject(filterObject);
  }
  else {
    store.dispatch(setActiveFilters(null));
    client.setFilterObject(null);
  }

  if (qs[HISTORY_PARAMETERS.PAGE]) {
    store.dispatch(setPage(client, parseInt(qs[HISTORY_PARAMETERS.PAGE])));
  }
  else {
    store.dispatch(setPage(client, 1));
  }

  if (qs[HISTORY_PARAMETERS.SEARCH]) {
    store.dispatch(setKeyword(qs[HISTORY_PARAMETERS.SEARCH], true));
    store.dispatch(search(client, qs[HISTORY_PARAMETERS.SEARCH], 'top'));
  }
  else if (clearIfNoKeyword) {
    store.dispatch(setKeyword('', true));
    store.dispatch(clearSearchResults('top'));
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

  qsArr.forEach(v => {
    const kv = v.split('=');
    if (kv[0] && kv[0].length > 0) {
      obj[kv[0]] = kv[1];
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
      const value = obj[key] ? obj[key] : '';
      qs = qs + key + '=' + value;
    }
  }

  return qs;
}

/**
 * Transfer a URL parameter to a JSON object
 */
export function urlParamToJSON(urlParameter) {
  try {
    return JSON.parse(decodeURIComponent(urlParameter));
  }
  catch(error) {}
}

/**
 * Transfer JSON object to a string suitable for URL param
 */
export function jsonToUrlParam(json) {
  if (Object.keys(json).length > 0) {
    return encodeURIComponent(JSON.stringify(json));
  }
  return null;
}
