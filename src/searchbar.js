'use strict';

var handlebars = require('handlebars');

/**
 * HTML template
 */
var template = `
  <div class="searchbar">
    <input placeholder="{{placeholder}}" />
  </div>
`;


/**
 * Add a search bar
 */
var searchbar = function(addSearchClient, resultsCallback, conf) {
  // Compile template and inject to container
  var html = handlebars.compile(template)(conf);
  var container = document.getElementById(conf.containerId);
  container.innerHTML = html;

  // Event listeners
  container.getElementsByTagName('input')[0].onchange = function(e) {
    addSearchClient.search(e.target.value, resultsCallback);
  };

};
module.exports = searchbar;