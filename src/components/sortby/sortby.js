import './sortby.scss';
import handlebars from 'handlebars';
import { SORTBY_TYPE } from './index';
import { SORTBY_RADIOGROUP_TEMPLATE, SORTBY_SELECT_TEMPLATE} from './templates';
import { sortBy } from '../../actions/sortby';
import { search } from '../../actions/search';
import { setPage } from '../../actions/pagination';
import { observeStoreByKey } from '../../store';
import { validateContainer } from '../../util/dom';
import PRECOMPILED_SORTBY_RADIOGROUP_TEMPLATE from './precompile-templates/sortby_radiogroup.handlebars';
import PRECOMPILED_SORTBY_SELECT_TEMPLATE from './precompile-templates/sortby_select.handlebars';


export default class SortBy {

  constructor(client, reduxStore, conf) {
    this.client = client;
    this.conf = conf;
    this.reduxStore = reduxStore;

    if (validateContainer(conf.containerId)) {
      observeStoreByKey(this.reduxStore, 'sortby', (state) => this.render(state));
    }
  }


  onChangeSelect(select) {
    const selectedOption = select.options[select.selectedIndex];
    const field = selectedOption.getAttribute('data-field');
    const order = selectedOption.getAttribute('data-order');
    this.dispatchAndRefresh(field, order);
  }


  onChangeRadio(e) {
    const fields = e.target.getAttribute('data-field');
    const orders = e.target.getAttribute('data-order');
    this.dispatchAndRefresh(fields, orders);
  }


  dispatchAndRefresh(stringFields, stringOrders) {
    const fields = stringFields.split(',');
    const orders = stringOrders.split(',');
    // Dispatch sortby
    this.reduxStore.dispatch(sortBy(this.client, fields, orders, this.reduxStore));

    // Reset paging
    this.reduxStore.dispatch(setPage(this.client, 1, null, this.reduxStore));

    // Refresh search
    const keyword = this.reduxStore.getState().keyword.value;
    this.reduxStore.dispatch(search(this.client, keyword, null, null, null, this.reduxStore, null, 'component.sortby'));
  }


  render(sortbyState) {
    const { field, order } = sortbyState;

    // Template
    let templateDefault = null;
    if (this.conf.type === SORTBY_TYPE.RADIO_GROUP) {
      templateDefault = PRECOMPILED_SORTBY_RADIOGROUP_TEMPLATE;
    } else {
      templateDefault = PRECOMPILED_SORTBY_SELECT_TEMPLATE;
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


    // Compile HTML and inject to element if changed
    let html;
    if (this.conf.precompiledTemplate) {
      html = this.conf.precompiledTemplate(data);
    } else if (this.conf.template) {
      html = handlebars.compile(this.conf.template)(data);
    } else {
      html = templateDefault(data);
    }
    if (this.renderedHtml === html) {
      return;
    }
    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;
    this.renderedHtml = html;


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
