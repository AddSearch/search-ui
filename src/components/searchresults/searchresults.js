import './searchresults.scss';
import handlebars from 'handlebars';


const TEMPLATE = `
  <div class="addsearch-searchresults">    
    {{#if resultcount}}
      <p>{{total_hits}} search results</p>
    {{/if}}
    
    {{#each hits}}
      <div class="hit">
        <h3>{{title}}</h3>      
        <p>
          <span class="main-image" style="background-image: url(data:image/jpeg;base64,{{images.main_b64}})">
            <img src="{{images.main}}" alt="{{title}}" />
          </span>
          {{{highlight}}}..
        </p>        
        
      </div>
    {{/each}}
  </div>
`;


const TEMPLATE_NO_RESULTS = `
  <div class="addsearch-searchresults addsearch-searchresults-no-results">    
    <h2>No search results with keyword <em>{{keyword}}</em></h2>
  </div>
`;


export default class SearchResults {

  constructor(conf) {
    this.conf = conf;
  }


  render(results) {
    const r = results.results || {};
    r.resultcount = r.hits && this.conf.showNumberOfResults !== false;
    r.keyword = results.keyword;

    let template = this.conf.template || TEMPLATE;
    if (r.hits && r.hits.length === 0) {
      template = this.conf.template_no_results || TEMPLATE_NO_RESULTS;
    }

    const html = handlebars.compile(template)(r);
    document.getElementById(this.conf.containerId).innerHTML = html;
  }
}