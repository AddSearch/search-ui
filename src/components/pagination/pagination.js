import './pagination.scss';
import { getPageNumbers } from '../../util/pagination';
import { setPage } from '../../actions/pagination';
import { search } from '../../actions/search';
import { getStore, observeStoreByKey } from '../../store';
import { renderToContainer, validateContainer } from '../../util/dom';

const TEMPLATE = `
  <div class="addsearch-pagination">    
    {{#gt currentPage 1}}
      <button data-page="previous" aria-label="Previous page">&#171;</button>
    {{/gt}}
    {{#each pages}}
      <button data-page="{{this}}" aria-label="Go to results page {{this}}" {{#equals ../currentPage this}}data-active="true"{{/equals}}>
        {{this}}
      </button>
    {{/each}}
    {{#lt currentPage lastPage}}
      <button data-page="next" aria-label="Next page">&#187;</button>
    {{/lt}}
  </div>
`;


export default class Pagination {

  constructor(client, conf) {
    this.client = client;
    this.conf = conf;

    if (validateContainer(conf.containerId)) {
      observeStoreByKey(getStore(), 'search', () => this.render());
    }
  }


  render() {
    const state = getStore().getState();

    const currentPage = state.search.results.page || 1;
    const pageSize = this.client.getSettings().paging.pageSize;
    const totalHits = state.search.results.total_hits || 0;
    const totalPages = Math.ceil(totalHits / pageSize);
    const pageArr = getPageNumbers(currentPage, totalPages);

    const data = {
      currentPage,
      lastPage: pageArr ? pageArr[pageArr.length-1] : 0,
      pages: pageArr
    };

    const container = renderToContainer(this.conf.containerId, this.conf.template || TEMPLATE, data);

    // Attach events
    const buttons = container.getElementsByTagName('button');
    for (let i=0; i<buttons.length; i++) {
      const button = buttons[i];
      button.onclick = (e) => this.handleOnclick(e);
    }
  }


  handleOnclick(e) {
    const button = e.target;
    let pageToDispatch = null;

    // Previous
    if (button.getAttribute('data-page') === 'previous') {
      const currentPage = getStore().getState().pagination.page;
      pageToDispatch = currentPage - 1;
    }
    // Next
    else if (button.getAttribute('data-page') === 'next') {
      const currentPage = getStore().getState().pagination.page || 1;
      pageToDispatch = currentPage + 1;
    }
    // Page number
    else {
      pageToDispatch = parseInt(button.getAttribute('data-page'), 10);
    }

    // Dispatch the new page number
    getStore().dispatch(setPage(this.client, pageToDispatch));

    // Refresh search
    const keyword = getStore().getState().keyword.value;
    getStore().dispatch(search(this.client, keyword, 'top'));
  }
}