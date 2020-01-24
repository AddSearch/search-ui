import './searchresults.scss';
import { SEARCHRESULTS_TEMPLATE, NO_RESULTS_TEMPLATE, NUMBER_OF_RESULTS_TEMPLATE} from './templates';
import handlebars from 'handlebars';
import { getStore, observeStoreByKey } from '../../store';
import { renderToContainer, validateContainer } from '../../util/dom';
import { defaultCategorySelectionFunction } from '../../util/handlebars';


export default class SearchResults {

  constructor(client, conf) {
    this.client = client;
    this.conf = conf;

    handlebars.registerPartial('numberOfResultsTemplate', this.conf.template_resultcount || NUMBER_OF_RESULTS_TEMPLATE);

    const categorySelectionFunction = this.conf.categorySelectionFunction || defaultCategorySelectionFunction;
    handlebars.registerHelper('selectCategory', (categories) => categorySelectionFunction(categories, this.conf.categoryAliases));

    if (validateContainer(conf.containerId)) {
      observeStoreByKey(getStore(), 'search', () => this.render());
    }
  }


  getDocumentPosition(results, docid) {
    if (results && results.hits) {
      // Calculate offset if the user is not on results page 1
      const currentPage = results.page || 1;
      const pageSize = this.client.getSettings().paging.pageSize;
      const offset = (currentPage - 1) * pageSize;

      // Find document's position in results array
      for (let i=0; i<results.hits.length; i++) {
        if (results.hits[i].id === docid) {
          return offset + (i+1);
        }
      }
    }
    return 0;
  }


  render() {
    const search = getStore().getState().search;
    const data = search.results || {};
    data.resultcount = data.hits && this.conf.showNumberOfResults !== false;
    data.keyword = search.keyword;

    let template = this.conf.template || SEARCHRESULTS_TEMPLATE;
    if (data.hits && data.hits.length === 0) {
      template = this.conf.template_noresults || NO_RESULTS_TEMPLATE;
    }

    const container = renderToContainer(this.conf.containerId, template, data);


    // Send result clicks to analytics
    const links = container.querySelectorAll('[data-analytics-click]');
    for (let i=0; i<links.length; i++) {
      links[i].addEventListener('pointerdown', (e) => {
        // Click with the second button
        if (e.button && e.buttons && e.button === e.buttons) {
          return;
        }
        const docid = e.target.getAttribute('data-analytics-click');
        const position = this.getDocumentPosition(data, docid);
        this.client.searchResultClicked(docid, position);
      });
    }
  }
}