/* global history, window */

import { WARMUP_QUERY_PREFIX } from '../index';
import { search } from '../actions/search';
import { setKeyword } from '../actions/keyword';
import { setFilters } from '../actions/filters';
import { getStore } from '../store';

export const HISTORY_PARAMETERS = {
  SEARCH: 'search',
  FILTERS: 'filters'
}


export function setHistory(parameter, value) {
  // ignore warmup search query
  if (parameter === HISTORY_PARAMETERS.SEARCH &&
      value && value.indexOf(WARMUP_QUERY_PREFIX) === 0) {
    return;
  }

  const url = window.location.href;
  const params = queryParamsToObject(url);
  if (value !== null && value !== '') {
    params[parameter] = value;
  }
  else {
    delete params[parameter];
  }
  let stateUrl = url;
  if (url.indexOf('?') !== -1) {
    stateUrl = url.substring(0, url.indexOf('?'));
  }
  stateUrl = stateUrl + '?' + objectToQueryParams(params);
  history.pushState(null, '', stateUrl);
}


export function getQueryParam(url, param) {
  const name = param.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}


export function initFromURL(client) {
  const url = window.location.href;
  const qs = queryParamsToObject(url);
  const store = getStore();

  if (qs[HISTORY_PARAMETERS.FILTERS]) {
    store.dispatch(setFilters(client, qs[HISTORY_PARAMETERS.FILTERS]));
  }

  if (qs[HISTORY_PARAMETERS.SEARCH]) {
    store.dispatch(setKeyword(qs[HISTORY_PARAMETERS.SEARCH]));
    store.dispatch(search(client, qs[HISTORY_PARAMETERS.SEARCH]));
  }

  /*window.onpopstate = function(event) {
    const q = getQueryParam(document.location, 'search');
    if (q) {
      container.getElementsByTagName('input')[0].value = q;
      getStore().dispatch(setKeyword(q));
      getStore().dispatch(search(this.addSearchClient, q));
    }
  }*/
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
    obj[kv[0]] = kv[1];
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

