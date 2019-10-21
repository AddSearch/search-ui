/* global history, window */

export function setUrl(keyword) {
  const url = window.location.href;
  let stateUrl = '?search=' + keyword;
  if (url && url.indexOf('?') !== -1) {
    stateUrl = url.substring(url.indexOf('?')) + '&search=' + keyword;
  }
  history.pushState(null, 'Search: ' + keyword, stateUrl);
}

export function getQueryParam(url, param) {
  const name = param.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
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

  const qs = url.substring(url.indexOf('?') + 1);
  if (qs === '') {
    return {};
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

