import './pagination.scss';
import handlebars from 'handlebars';
import { getPageNumbers } from '../../util/pagination';


const TEMPLATE = `
  <div class="addsearch-pagination">    
    Pages:
    {{#each pages}}
      <div class="addsearch-pagination-page" {{#equals ../currentPage this}}data-active="true"{{/equals}}>
        {{this}}
      </div>
    {{/each}}
  </div>
`;


export default class Pagination {

  constructor(conf) {
    this.conf = conf;
  }


  render(currentPage, totalHits, pageSize) {
    const totalPages = Math.ceil(totalHits / pageSize);
    const pageArr = getPageNumbers(currentPage, totalPages);

    const data = {
      currentPage,
      pages: pageArr
    };

    const html = handlebars.compile(this.conf.template || TEMPLATE)(data);
    document.getElementById(this.conf.containerId).innerHTML = html;
  }
}