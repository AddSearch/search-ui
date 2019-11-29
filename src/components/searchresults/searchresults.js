import './searchresults.scss';
import { SEARCHRESULTS_TEMPLATE, NO_RESULTS_TEMPLATE, NUMBER_OF_RESULTS_TEMPLATE} from './templates';
import handlebars from 'handlebars';
import { getStore, observeStoreByKey } from '../../store';
import { renderToContainer, validateContainer } from '../../util/dom';
import { defaultCategorySelectionFunction } from '../../util/handlebars';


export default class SearchResults {

  constructor(conf) {
    this.conf = conf;

    handlebars.registerPartial('numberOfResultsTemplate', this.conf.template_resultcount || NUMBER_OF_RESULTS_TEMPLATE);

    const categorySelectionFunction = this.conf.categorySelectionFunction || defaultCategorySelectionFunction;
    handlebars.registerHelper('selectCategory', (categories) => categorySelectionFunction(categories, this.conf.categoryAliases));

    if (validateContainer(conf.containerId)) {
      observeStoreByKey(getStore(), 'search', () => this.render());
    }
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

    renderToContainer(this.conf.containerId, template, data);
  }
}