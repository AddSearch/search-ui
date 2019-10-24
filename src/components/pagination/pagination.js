import './pagination.scss';
import handlebars from 'handlebars';
import { getPageNumbers } from '../../util/pagination';
import { setPage } from '../../actions/pagination';
import { search } from '../../actions/search';
import { getStore } from '../../store';


const TEMPLATE = `
  <div class="addsearch-pagination">    
    {{#gt currentPage 1}}
      <button data-page="previous">Previous</button>
    {{/gt}}
    {{#each pages}}
      <button data-page="{{this}}" {{#equals ../currentPage this}}data-active="true"{{/equals}}>
        {{this}}
      </button>
    {{/each}}
    {{#lt currentPage lastPage}}
      <button data-page="next">Next</button>
    {{/lt}}
  </div>
`;


export default class Pagination {

  constructor(client, conf) {
    this.client = client;
    this.conf = conf;
  }


  render(currentPage, totalHits, pageSize) {
    const totalPages = Math.ceil(totalHits / pageSize);
    const pageArr = getPageNumbers(currentPage, totalPages);

    const data = {
      currentPage,
      lastPage: pageArr ? pageArr[pageArr.length-1] : 0,
      pages: pageArr
    };

    const html = handlebars.compile(this.conf.template || TEMPLATE)(data);
    document.getElementById(this.conf.containerId).innerHTML = html;

    // Attach events
    const buttons = document.getElementById(this.conf.containerId).getElementsByTagName('button');
    for (let i=0; i<buttons.length; i++) {
      const button = buttons[i];
      button.onclick = (e) => {

        // Previous
        if (button.getAttribute('data-page') === 'previous') {
          const currentPage = getStore().getState().pagination.page;
          getStore().dispatch(setPage(this.client, currentPage - 1));
        }
        // Next
        else if (button.getAttribute('data-page') === 'next') {
          const currentPage = getStore().getState().pagination.page || 1;
          getStore().dispatch(setPage(this.client, currentPage + 1));
        }
        // Page number
        else {
          const page = parseInt(button.getAttribute('data-page'), 10);
          getStore().dispatch(setPage(this.client, page));
        }

        // Refresh keyword
        const keyword = getStore().getState().keyword.value;
        getStore().dispatch(search(this.client, keyword, 'top'));
      };
    }
  }
}