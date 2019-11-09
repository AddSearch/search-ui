import './sortby.scss';
import handlebars from 'handlebars';

import { sortBy } from '../../actions/sortby';
import { search } from '../../actions/search';
import { setPage } from '../../actions/pagination';
import { getStore, observeStoreByKey } from '../../store';

const TEMPLATE = `
  <div class="addsearch-sortby">        
    <select>
      {{#each options}}
        <option data-field={{sortBy}} data-order={{order}}>{{label}}</option>
      {{/each}}
    </select>
  </div>
`;


export default class SortBy {

  constructor(client, conf) {
    this.client = client;
    this.conf = conf;

    observeStoreByKey(getStore(), 'sortby', () => this.render());
  }


  onChange(select) {
    const selectedOption = select.options[select.selectedIndex];
    const field = selectedOption.getAttribute('data-field');
    const order = selectedOption.getAttribute('data-order');

    // Dispatch sortby
    getStore().dispatch(sortBy(this.client, field, order));

    // Reset paging
    getStore().dispatch(setPage(this.client, 1));

    // Refresh search
    const keyword = getStore().getState().keyword.value;
    getStore().dispatch(search(this.client, keyword));
  }


  render() {
    const data = getStore().getState().sortby;

    const html = handlebars.compile(this.conf.template || TEMPLATE)(this.conf);
    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;

    // Attach listeners
    container.querySelector('select').onchange = (e) => { this.onChange(e.target) };

    // Pre-selected option
    if (data) {
      const { field, order } = data;
      const options = container.getElementsByTagName('option');

      for (let i=0; i<options.length; i++) {
        if (options[i].getAttribute('data-field') === field &&
            options[i].getAttribute('data-order') === order) {
          container.querySelector('select').value = options[i].text;
          break;
        }
      }
    }
  }
}