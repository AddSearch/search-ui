import './searchresults.scss';
import handlebars from 'handlebars';
import { getStore, observeStoreByKey } from '../../store';
import { renderToContainer } from '../../util/dom';


const TEMPLATE = `
  <div class="addsearch-searchresults">    
    {{#if resultcount}}
      {{> numberOfResultsTemplate }}
    {{/if}}
    
    {{#each hits}}
      <div class="hit">
        <h3>
          <a href="{{url}}">{{title}}</a>
        </h3>
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

const TEMPLATE_NUMBER_OF_RESULTS = `
  <div class="number-of-results">{{total_hits}} search results</div>
`;


export default class SearchResults {

  constructor(conf) {
    this.conf = conf;
    observeStoreByKey(getStore(), 'search', () => this.render());

    handlebars.registerPartial('numberOfResultsTemplate', this.conf.template_resultcount || TEMPLATE_NUMBER_OF_RESULTS);
  }


  render() {
    const search = getStore().getState().search;
    const data = search.results || {};
    data.resultcount = data.hits && this.conf.showNumberOfResults !== false;
    data.keyword = search.keyword;

    let template = this.conf.template || TEMPLATE;
    if (data.hits && data.hits.length === 0) {
      template = this.conf.template_noresults || TEMPLATE_NO_RESULTS;
    }

    renderToContainer(this.conf.containerId, template, data);
  }
}