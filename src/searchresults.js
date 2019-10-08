'use strict';

var handlebars = require('handlebars');

/**
 * HTML template
 */
var template = `
  <div class="searchresults">    
    {{#if resultcount}}
      <p>{{total_hits}} search results</p>
    {{/if}}
    
    {{#each hits}}
      <div class="hit">
        <h3>{{title}}</h3>
        <p>
          <img src="{{images.main}}" alt="{{title}}" width="100" height="100" />
          {{{highlight}}}..
        </p>
        
      </div>
    {{/each}}
  </div>
`;


/**
 * Add a search results list
 */
var searchresults = function(results, conf) {
  var r = results;
  if (conf.showNumberOfResults === false) {
    r.resultcount = false;
  }
  else {
    r.resultcount = true;
  }
  var html = handlebars.compile(template)(r);
  document.getElementById(conf.containerId).innerHTML = html;
};
module.exports = searchresults;