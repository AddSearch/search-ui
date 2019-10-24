import './pagination.scss';
import handlebars from 'handlebars';
import { getPageNumbers } from '../../util/pagination';
import { setPage } from '../../actions/pagination';
import { search } from '../../actions/search';
import { getStore } from '../../store';


const TEMPLATE = `
  <div class="addsearch-pagination">    
    {{#gt currentPage 1}}<button>Previous</button>{{/gt}}
    {{#each pages}}
      <button {{#equals ../currentPage this}}data-active="true"{{/equals}}>
        {{this}}
      </button>
    {{/each}}
    {{#lt currentPage lastPage}}<button>Next</button>{{/lt}}
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
        const page = parseInt(e.target.textContent, 10);
        getStore().dispatch(setPage(this.client, page));
        const keyword = getStore().getState().keyword.value;
        getStore().dispatch(search(this.client, keyword, 'top'));
      };
    }
  }
}