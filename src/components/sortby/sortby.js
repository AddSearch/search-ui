import './sortby.scss';
import handlebars from 'handlebars';
import { setPage } from '../../actions/pagination';
import { search } from '../../actions/search';
import { getStore } from '../../store';

const TEMPLATE = `
  <div class="addsearch-sortby">        
    <select>
      {{#each options}}
        <option>{{label}}</option>
      {{/each}}
    </select>
  </div>
`;


export default class SortBy {

  constructor(client, conf) {
    this.client = client;
    this.conf = conf;
  }


  render() {
    const html = handlebars.compile(this.conf.template || TEMPLATE)(this.conf);
    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;
  }
}