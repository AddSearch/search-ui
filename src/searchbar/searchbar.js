'use strict';

require('./searchbar.scss');
var handlebars = require('handlebars');

/**
 * HTML template
 */
var TEMPLATE = `
  <form class="searchbar" autocomplete="off" action="?" role="search">
    <input type="search" placeholder="{{placeholder}}" autofocus="{{autofocus}}" aria-label="Search field" />
    {{#if button}}
      <button type="button">{{button}}</button>
    {{/if}}
  </form>
`;


var search = function(addSearchClient, keyword, resultsCallback) {
  addSearchClient.search(keyword, resultsCallback);
  history.pushState(null, keyword, "?search=" + keyword);
}

var getQueryParam = function(url, param) {
  var name = param.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  var results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * Add a search bar
 */
var searchbar = function(addSearchClient, resultsCallback, conf) {
  // Compile template and inject to container
  var html = handlebars.compile(conf.template || TEMPLATE)(conf);
  var container = document.getElementById(conf.containerId);
  container.innerHTML = html;

  // Event listeners to the search field
  container.getElementsByTagName('input')[0].onkeypress = function(e) {
    var keyword = e.target.value;
    // Search as you type
    if (conf.searchAsYouType === true && keyword) {
      search(addSearchClient, keyword, resultsCallback);
    }

    // Enter pressed
    if (e.keyCode === 13) {
      if (keyword && conf.searchAsYouType !== true) {
        search(addSearchClient, keyword, resultsCallback);
      }
      return false;
    }
  };

  // Event listeners to the possible search button
  if (container.getElementsByTagName('button').length > 0) {
    container.getElementsByTagName('button')[0].onclick = function (e) {
      var keyword = container.getElementsByTagName('input')[0].value;
      if (keyword) {
        search(addSearchClient, keyword, resultsCallback);
      }
    }
  }


  // Execute search onload
  var url = window.location.href;
  if (getQueryParam(url, 'search')) {
    var q = getQueryParam(url, 'search');
    container.getElementsByTagName('input')[0].value = q
    search(addSearchClient, q, resultsCallback);
  }

  window.onpopstate = function(event) {
    var q = getQueryParam(document.location, 'search');
    if (q) {
      container.getElementsByTagName('input')[0].value = q
      search(addSearchClient, q, resultsCallback);
    }
  }

};
module.exports = searchbar;