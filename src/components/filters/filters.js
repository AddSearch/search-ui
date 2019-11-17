import './filters.scss';

import { FILTER_TYPE } from './index';
import { getStore, observeStoreByKey } from '../../store';
import { toggleFilter, registerFilter } from '../../actions/filters';
import { TAGS_TEMPLATE } from './tags';
import { CHECKBOXGROUP_TEMPLATE } from './checkboxgroup';
import { SELECTLIST_TEMPLATE } from './selectlist';
import { renderToContainer, attachEventListeners } from '../../util/dom';

export const NO_FILTER_NAME = 'nofilter';

export default class Filters {

  constructor(client, conf) {
    this.client = client;
    this.conf = conf;
    this.activeFilter = null; // For select list and tab filters with a single selectable value

    getStore().dispatch(registerFilter(this.conf));
    observeStoreByKey(getStore(), 'filters', (state) => this.render(state));
  }


  render(state) {
    // Data is configuration object with information of activity status
    let data = Object.assign({}, this.conf);

    // Update activity status of all filters
    for (let key in data.options) {
      data.options[key].active = state.activeFilters[key] ? true : false;
    }


    // Template
    let template = null;
    if (this.conf.type === FILTER_TYPE.TAGS) {
      template = TAGS_TEMPLATE;
    }
    else if (this.conf.type === FILTER_TYPE.CHECKBOX_GROUP) {
      template = CHECKBOXGROUP_TEMPLATE;
    }
    else if (this.conf.type === FILTER_TYPE.SELECT_LIST) {
      template = SELECTLIST_TEMPLATE;
    }


    // Render and attach events to elements with data-filter attribute
    const container = renderToContainer(this.conf.containerId, this.conf.template || template, data);


    // Attach event listeners to select list
    if (this.conf.type === FILTER_TYPE.SELECT_LIST) {
      container.querySelector('select').addEventListener('change', (e) => {
        const filterKey = e.target.value;
        const isNoFilter = filterKey === NO_FILTER_NAME;

        // Remove previous filter
        if (this.activeFilter) {
          getStore().dispatch(toggleFilter(this.activeFilter, 1, isNoFilter));
        }

        // Don't dispatch filter if it's nofilter (i.e. "Show all")
        if (isNoFilter) {
          this.activeFilter = null;
        }
        else {
          getStore().dispatch(toggleFilter(filterKey, 1));
          this.activeFilter = filterKey;
        }
      });
    }

    // Attach event listeners to other filter types
    else {
      attachEventListeners(container, 'data-filter', 'click', (filterKey) => {
        getStore().dispatch(toggleFilter(filterKey, 1));
      });
    }
  }
}