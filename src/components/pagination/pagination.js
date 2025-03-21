import './pagination.scss';
import handlebars from 'handlebars';
import { getPageNumbers } from '../../util/pagination';
import { setPage } from '../../actions/pagination';
import { fetchSearchResultsStory } from '../../actions/search';
import { observeStoreByKey } from '../../store';
import { validateContainer } from '../../util/dom';
import PRECOMPILED_PAGINATION_TEMPLATE from './precompile-templates/pagination.handlebars';

export default class Pagination {
  constructor(client, reduxStore, conf) {
    this.client = client;
    this.conf = conf;
    this.reduxStore = reduxStore;

    if (validateContainer(conf.containerId)) {
      observeStoreByKey(this.reduxStore, 'search', () => this.render());
    }
  }

  render() {
    const state = this.reduxStore.getState();

    const currentPage = state.search.results.page || 1;
    const pageSize = this.client.getSettings().paging.pageSize;
    const totalHits = state.search.results.total_hits || 0;
    const totalPages = Math.ceil(totalHits / pageSize);
    const pageArr = getPageNumbers(currentPage, totalPages);

    const data = {
      currentPage,
      lastPage: pageArr ? pageArr[pageArr.length - 1] : 0,
      totalPages,
      pages: pageArr
    };

    // Compile HTML and inject to element if changed
    let html;
    if (this.conf.precompiledTemplate) {
      html = this.conf.precompiledTemplate(data);
    } else if (this.conf.template) {
      html = handlebars.compile(this.conf.template)(data);
    } else {
      html = PRECOMPILED_PAGINATION_TEMPLATE(data);
    }
    if (this.renderedHtml === html) {
      return;
    }
    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;
    this.renderedHtml = html;

    // Attach events
    const buttons = container.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      button.onclick = (e) => this.handleOnclick(e);
    }
  }

  handleOnclick(e) {
    const button = e.target;
    let pageToDispatch = null;

    // Previous
    if (button.getAttribute('data-page') === 'previous') {
      const currentPage = this.reduxStore.getState().pagination.page;
      pageToDispatch = currentPage - 1;
    }
    // Next
    else if (button.getAttribute('data-page') === 'next') {
      const currentPage = this.reduxStore.getState().pagination.page || 1;
      pageToDispatch = currentPage + 1;
    }
    // Page number
    else {
      pageToDispatch = parseInt(button.getAttribute('data-page'), 10);
    }

    // Dispatch the new page number
    this.reduxStore.dispatch(setPage(this.client, pageToDispatch, null, this.reduxStore));

    // Refresh search
    const keyword = this.reduxStore.getState().keyword.value;
    const onResultsScrollTo = this.conf.onResultsScrollTo || 'top';
    this.reduxStore.dispatch(
      fetchSearchResultsStory(
        this.client,
        keyword,
        onResultsScrollTo,
        null,
        null,
        this.reduxStore,
        null,
        'component.pagination'
      )
    );
  }
}
