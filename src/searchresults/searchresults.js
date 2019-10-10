'use strict';

require('./searchresults.scss');
const handlebars = require('handlebars');

/**
 * HTML template
 */
const TEMPLATE = `
  <div class="addsearch-searchresults">    
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
const searchresults = function(results, conf) {
  const r = results;
  if (conf.showNumberOfResults === false) {
    r.resultcount = false;
  }
  else {
    r.resultcount = true;
  }
  const html = handlebars.compile(conf.template || TEMPLATE)(r);
  document.getElementById(conf.containerId).innerHTML = html;
};
module.exports = searchresults;