import './searchresults.scss';
import handlebars from 'handlebars';
import { observeStoreByKey } from '../../store';
import { validateContainer } from '../../util/dom';
import { addClickTrackers } from '../../util/analytics';
import { defaultCategorySelectionFunction } from '../../util/handlebars';
import PRECOMPILED_SEARCHRESULTS_TEMPLATE from './precompile-templates/searchresults.handlebars';
import PRECOMPILED_NO_RESULTS_TEMPLATE from './precompile-templates/no_results.handlebars';
import { registerHelper, registerPartial } from '../../util/handlebars';
import NUMBER_OF_RESULTS_TEMPLATE from './precompile-templates/numberOfResultsTemplate.handlebars';
import SEARCHRESULT_IMAGE_TEMPLATE from './precompile-templates/searchResultImageTemplate.handlebars';


export default class SearchResults {

  constructor(client, reduxStore, conf) {
    this.client = client;
    this.conf = conf;
    this.reduxStore = reduxStore;

    const numberOfResultsTemplate = this.conf.template_resultcount || NUMBER_OF_RESULTS_TEMPLATE;
    const searchResultImageTemplate = this.conf.template_image || SEARCHRESULT_IMAGE_TEMPLATE;
    registerPartial('numberOfResultsTemplate', numberOfResultsTemplate);
    registerPartial('searchResultImageTemplate', searchResultImageTemplate);

    registerHelper('removeTrailingQueriesFromUrl', (url) => {
      if (url) {
        return url.replace(/\?.*$/, '')
      }
    });

    const categorySelectionFunction = this.conf.categorySelectionFunction || defaultCategorySelectionFunction;
    registerHelper('selectCategory', (categories) => categorySelectionFunction(categories, this.conf.categoryAliases));

    if (validateContainer(conf.containerId)) {
      observeStoreByKey(this.reduxStore, 'search', () => this.render());
    }
  }


  render() {
    const search = this.reduxStore.getState().search;
    const data = search.results || {};
    data.resultcount = data.hits && this.conf.showNumberOfResults !== false;
    data.keyword = search.keyword;


    // Compile HTML and inject to element if changed
    let html;
    if (data.hits && data.hits.length === 0) {
      if (this.conf.precompiledTemplateNoResults) {
        html = this.conf.precompiledTemplateNoResults(data);
      } else if (this.conf.template_noresults) {
        html = handlebars.compile(this.conf.template_noresults)(data);
      } else {
        html = PRECOMPILED_NO_RESULTS_TEMPLATE(data);
      }
    } else {
      if (this.conf.precompiledTemplate) {
        html = this.conf.precompiledTemplate(data);
      } else if (this.conf.template) {
        html = handlebars.compile(this.conf.template)(data);
      } else {
        html = PRECOMPILED_SEARCHRESULTS_TEMPLATE(data);
      }
    }

    if (this.renderedHtml === html) {
      return;
    }
    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;
    this.renderedHtml = html;

    if (this.conf.renderCompleteCallback && typeof this.conf.renderCompleteCallback === 'function') {
      this.conf.renderCompleteCallback();
    }

    // Send result clicks to analytics
    const links = container.querySelectorAll('[data-analytics-click]');
    addClickTrackers(this.client, links, data);
  }
}
