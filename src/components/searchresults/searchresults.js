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
        <div class="highlight">
          <span class="main-image" style="background-image: url(data:image/jpeg;base64,{{images.main_b64}})">
            <img src="{{images.main}}" alt="{{title}}" />
          </span>
          {{{highlight}}}..
        </div>
        <div class="category">
          {{selectCategory this}}
        </div>
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


function selectCategoryHelper(hit) {
  const categories = hit.categories;
  let category = categories && categories.length > 1 ? categories[1] : '';
  category = category.replace(/^[0-9]+[x]{1}/, '');
  return category;
}


export default class SearchResults {

  constructor(conf) {
    this.conf = conf;
    observeStoreByKey(getStore(), 'search', () => this.render());

    handlebars.registerPartial('numberOfResultsTemplate', this.conf.template_resultcount || TEMPLATE_NUMBER_OF_RESULTS);

    const categoryHelperFunction = this.conf.categorySelectionFunction || selectCategoryHelper;
    handlebars.registerHelper('selectCategory', (categories) => categoryHelperFunction(categories));
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