import './sortby.scss';

import { SORTBY_TYPE } from './index';
import { sortBy } from '../../actions/sortby';
import { search } from '../../actions/search';
import { setPage } from '../../actions/pagination';
import { getStore, observeStoreByKey } from '../../store';
import { renderToContainer, validateContainer } from '../../util/dom';

const TEMPLATE_SELECT = `
  <div class="addsearch-sortby">        
    <select>
      {{#each options}}
        <option data-field={{sortBy}} data-order={{order}}>{{label}}</option>
      {{/each}}
    </select>
  </div>
`;

export const TEMPLATE_RADIOGROUP = `
  <div class="addsearch-sortby-radiogroup">
    {{#each options}}
      <label>
        <input type="radio" name={{../containerId}} data-field={{sortBy}} data-order={{order}} value="" {{#if active}}checked{{/if}}>{{label}}
      </label>
    {{/each}}
  </div>
`;



export default class SortBy {

  constructor(client, conf) {
    this.client = client;
    this.conf = conf;

    if (validateContainer(conf.containerId)) {
      observeStoreByKey(getStore(), 'sortby', (state) => this.render(state));
    }
  }


  onChangeSelect(select) {
    const selectedOption = select.options[select.selectedIndex];
    const field = selectedOption.getAttribute('data-field');
    const order = selectedOption.getAttribute('data-order');
    this.dispatchAndRefresh(field, order);
  }


  onChangeRadio(e) {
    const field = e.target.getAttribute('data-field');
    const order = e.target.getAttribute('data-order');
    this.dispatchAndRefresh(field, order);
  }


  dispatchAndRefresh(field, order) {
    // Dispatch sortby
    getStore().dispatch(sortBy(this.client, field, order));

    // Reset paging
    getStore().dispatch(setPage(this.client, 1));

    // Refresh search
    const keyword = getStore().getState().keyword.value;
    getStore().dispatch(search(this.client, keyword));
  }


  render(sortbyState) {
    const { field, order } = sortbyState;

    // Template
    let template = null;
    if (this.conf.template) {
      template = this.conf.template;
    }
    else if (this.conf.type === SORTBY_TYPE.RADIO_GROUP) {
      template = TEMPLATE_RADIOGROUP;
    }
    else {
      template = TEMPLATE_SELECT;
    }

    // Data
    let data = Object.assign({}, this.conf);
    data.options.forEach(option => {
      if (option.sortBy === field && option.order === order) {
        option.active = true;
      }
      else {
        option.active = false;
      }
    });


    const container = renderToContainer(this.conf.containerId, template, data);

    // Attach listeners
    if (this.conf.type === SORTBY_TYPE.RADIO_GROUP) {
      const radioButtons = container.querySelectorAll('input');
      for (let i=0; i<radioButtons.length; i++) {
        radioButtons[i].onclick = (e) => this.onChangeRadio(e);
      }
    }

    else {
      container.querySelector('select').onchange = (e) => this.onChangeSelect(e.target);

      // Pre-selected option
      if (sortbyState) {
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
}