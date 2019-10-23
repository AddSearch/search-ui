import './pagination.scss';
import handlebars from 'handlebars';


const TEMPLATE = `
  <div class="addsearch-pagination">    
    Pagination
  </div>
`;


export default class Pagination {

  constructor(conf) {
    this.conf = conf;
  }


  render() {
    const html = handlebars.compile(this.conf.template || TEMPLATE)({});
    document.getElementById(this.conf.containerId).innerHTML = html;
  }
}