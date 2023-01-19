import './searchresults.scss';
import { SEARCHRESULTS_TEMPLATE, NO_RESULTS_TEMPLATE,SEARCHRESULT_IMAGE_TEMPLATE, NUMBER_OF_RESULTS_TEMPLATE} from './templates';
import handlebars from 'handlebars';
import { observeStoreByKey } from '../../store';
import { validateContainer } from '../../util/dom';
import { addClickTrackers } from '../../util/analytics';
import { defaultCategorySelectionFunction } from '../../util/handlebars';


export default class SearchResults {

  constructor(client, reduxStore, conf) {
    this.client = client;
    this.conf = conf;
    this.reduxStore = reduxStore;

    handlebars.registerPartial('numberOfResultsTemplate', this.conf.template_resultcount || NUMBER_OF_RESULTS_TEMPLATE);
    handlebars.registerPartial('searchResultImageTemplate', this.conf.template_image || SEARCHRESULT_IMAGE_TEMPLATE);

    handlebars.registerHelper('removeTrailingQueriesFromUrl', (url) => {
      if (url) {
        return url.replace(/\?.*$/, '')
      }
    });

    const categorySelectionFunction = this.conf.categorySelectionFunction || defaultCategorySelectionFunction;
    handlebars.registerHelper('selectCategory', (categories) => categorySelectionFunction(categories, this.conf.categoryAliases));


    if (validateContainer(conf.containerId)) {
      observeStoreByKey(this.reduxStore, 'search', () => this.render());
    }
  }


  render() {
    const search = this.reduxStore.getState().search;
    const data = search.results || {};
    data.resultcount = data.hits && this.conf.showNumberOfResults !== false;
    data.keyword = search.keyword;

    let template = this.conf.template || SEARCHRESULTS_TEMPLATE;
    if (data.hits && data.hits.length === 0) {
      template = this.conf.template_noresults || NO_RESULTS_TEMPLATE;
    }

    // Compile HTML and inject to element if changed
    let html;
    if (this.conf.precompiledTemplate && data.hits && data.hits.length === 0) {
      html = this.conf.template_noresults(data);
    } else if (this.conf.precompiledTemplate) {
      html = this.conf.precompiledTemplate(data);
    } else {
      html = handlebars.compile(template)(data);
    }
    if (this.renderedHtml === html) {
      return;
    }
    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;
    this.renderedHtml = html;

    // Send result clicks to analytics
    const links = container.querySelectorAll('[data-analytics-click]');
    addClickTrackers(this.client, links, data);
  }
}
