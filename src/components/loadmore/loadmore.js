import './loadmore.scss';
import { LOAD_MORE_TEMPLATE } from './templates';
import { LOAD_MORE_TYPE } from './index';
import { setPage } from '../../actions/pagination';
import { search } from '../../actions/search';
import { getStore, observeStoreByKey } from '../../store';
import { renderToContainer, validateContainer } from '../../util/dom';


export default class LoadMore {

  constructor(client, conf) {
    this.client = client;
    this.conf = conf;

    if (validateContainer(conf.containerId)) {
      observeStoreByKey(getStore(), 'search', (searchState) => this.render(searchState));
    }

    if (conf.type === LOAD_MORE_TYPE.INFINITE_SCROLL) {
      this.conf.scrollableElement.addEventListener('scroll', () => this.onScroll());
    }
  }


  render(searchState) {

    const currentPage = searchState.results.page || 1;
    const pageSize = this.client.getSettings().paging.pageSize;
    const totalHits = searchState.results.total_hits || 0;
    const totalPages = Math.ceil(totalHits / pageSize);

    const data = {
      type: this.conf.type,
      hasMorePages: (currentPage < totalPages),
      isLoading: searchState.loading,
      totalHits
    };

    const container = renderToContainer(this.conf.containerId, this.conf.template || LOAD_MORE_TEMPLATE, data);

    // Attach click event
    if (this.conf.type === LOAD_MORE_TYPE.BUTTON) {
      const button = container.querySelector('button');
      if (button) {
        button.onclick = (e) => this.loadMore();
      }
    }

    // If infinite scroll in a scrollable HTML element, scroll top when keyword changes
    else if (this.conf.type === LOAD_MORE_TYPE.INFINITE_SCROLL &&
             this.conf.scrollableElement.tagName &&
             searchState.results.page === 1) {
      this.conf.scrollableElement.scrollTop = 0;
    }
  }


  loadMore() {
    const currentPage = getStore().getState().pagination.page || 1;
    const pageToDispatch = currentPage + 1;

    // Dispatch the new page number
    getStore().dispatch(setPage(this.client, pageToDispatch, false));

    // Fetch more results
    const keyword = getStore().getState().keyword.value;
    getStore().dispatch(search(this.client, keyword, null, true));
  }


  onScroll() {

    const isLoading = getStore().getState().search.loading;
    const scrollElement = document.querySelector('#' + this.conf.containerId + ' .loadmore-infinite-scroll');
    if (!isLoading && scrollElement) {
      const infiniteScrollTop = scrollElement.getBoundingClientRect().top;
      let viewportHeight = window.innerHeight;
      // Scrollable HTML element
      if (this.conf.scrollableElement.tagName) {
        viewportHeight = this.conf.scrollableElement.getBoundingClientRect().height;
      }

      if (infiniteScrollTop > 0 && infiniteScrollTop < viewportHeight) {
        this.loadMore();
      }
    }
  }
}