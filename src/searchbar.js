'use strict';

var handlebars = require('handlebars');

/**
 * HTML template
 */
var TEMPLATE = `
  <form class="searchbar" action="?" role="search">
    <input placeholder="{{placeholder}}" autofocus="{{autofocus}}" aria-label="Search field" />
    {{#if button}}
      <button type="button">{{button}}</button>
    {{/if}}
  </form>
`;


/**
 * Add a search bar
 */
var searchbar = function(addSearchClient, resultsCallback, conf) {
  // Compile template and inject to container
  var html = handlebars.compile(conf.template || TEMPLATE)(conf);
  var container = document.getElementById(conf.containerId);
  container.innerHTML = html;

  // Event listeners
  container.getElementsByTagName('input')[0].onkeypress = function(e) {
    // Search as you type
    if (conf.searchAsYouType === true) {
      addSearchClient.search(e.target.value, resultsCallback);
    }

    // Enter pressed
    if (e.keyCode === 13) {
      addSearchClient.search(e.target.value, resultsCallback);
      return false;
    }
  };

  // Event listeners
  container.getElementsByTagName('button')[0].onclick = function(e) {
    addSearchClient.search(container.getElementsByTagName('input')[0].value, resultsCallback);
  };

};
module.exports = searchbar;