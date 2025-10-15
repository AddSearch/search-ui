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
    this.lastAnnouncedResults = null;

    const numberOfResultsTemplate = this.conf.template_resultcount || NUMBER_OF_RESULTS_TEMPLATE;
    const searchResultImageTemplate = this.conf.template_image || SEARCHRESULT_IMAGE_TEMPLATE;
    registerPartial('numberOfResultsTemplate', numberOfResultsTemplate);
    registerPartial('searchResultImageTemplate', searchResultImageTemplate);

    registerHelper('removeTrailingQueriesFromUrl', (url) => {
      if (url) {
        return url.replace(/\?.*$/, '');
      }
    });

    const categorySelectionFunction =
      this.conf.categorySelectionFunction || defaultCategorySelectionFunction;
    registerHelper('selectCategory', (categories) =>
      categorySelectionFunction(categories, this.conf.categoryAliases)
    );

    if (validateContainer(conf.containerId)) {
      observeStoreByKey(this.reduxStore, 'search', () => this.render());
    }
  }

  updateLiveRegion(container, data) {
    const liveRegion = container.querySelector('[role="status"]');
    if (!liveRegion) {
      return;
    }

    const hits = data.hits || [];
    const totalHits = data.total_hits || 0;
    const keyword = data.keyword;

    // Create announcement key to track what was last announced
    const announcementKey = `${totalHits}-${keyword}`;

    // Only update if the announcement content has actually changed
    if (this.lastAnnouncedResults === announcementKey) {
      return;
    }

    this.lastAnnouncedResults = announcementKey;

    // Generate appropriate announcement
    if (hits.length === 0 && keyword) {
      liveRegion.textContent = `No search results found for "${keyword}"`;
    } else if (totalHits > 0) {
      const resultText = totalHits === 1 ? 'result' : 'results';
      liveRegion.textContent = `${totalHits} ${resultText} found${keyword ? ` for "${keyword}"` : ''}`;
    } else {
      liveRegion.textContent = '';
    }
  }

  render() {
    const search = this.reduxStore.getState().search;
    const data = search.results || {};
    data.resultcount = data.hits && this.conf.showNumberOfResults !== false;
    data.keyword = search.keyword;

    // Compile HTML and inject to element if changed
    let html;
    if (data.hits && data.hits.length === 0) {
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

    // Update live region for screen reader announcements
    this.updateLiveRegion(container, data);

    if (
      this.conf.renderCompleteCallback &&
      typeof this.conf.renderCompleteCallback === 'function'
    ) {
      this.conf.renderCompleteCallback();
    }

    // Send result clicks to analytics
    const links = container.querySelectorAll('[data-analytics-click]');
    addClickTrackers(this.client, links, data);
  }
}
