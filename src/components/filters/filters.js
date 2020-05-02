import './filters.scss';
import {
  FILTERS_CHECKBOXGROUP_TEMPLATE,
  FILTERS_RADIOGROUP_TEMPLATE,
  FILTERS_SELECTLIST_TEMPLATE,
  FILTERS_TABS_TEMPLATE,
  FILTERS_TAGS_TEMPLATE,
  FILTERS_RANGE_TEMPLATE
} from './templates';
import { FILTER_TYPE } from './index';
import { observeStoreByKey } from '../../store';
import { toggleFilter, setRangeFilter, registerFilter, clearSelected } from '../../actions/filters';
import { renderToContainer, attachEventListeners, validateContainer } from '../../util/dom';

export const NO_FILTER_NAME = 'nofilter';

export default class Filters {

  constructor(client, reduxStore, conf) {
    this.client = client;
    this.reduxStore = reduxStore;
    this.conf = conf;
    this.activeFilter = null; // For select list and tab filters with a single selectable value

    if (validateContainer(conf.containerId)) {
      this.reduxStore.dispatch(registerFilter(this.conf));
      observeStoreByKey(this.reduxStore, 'filters', (state) => this.render(state));

      // Observe fieldStats from search results for range filters' min/max values
      if (this.conf.type === FILTER_TYPE.RANGE) {
        observeStoreByKey(this.reduxStore, 'search', (state) => this.searchResultsChanged(state));
      }
    }
  }


  searchResultsChanged(state) {
    // Re-render if fieldStats of this field change
    if (!state.loading && state.results.fieldStats[this.conf.field]) {
      this.render(this.reduxStore.getState().filters);
    }
  }


  render(state) {
    // Data is configuration object with information of activity status
    let data = Object.assign({}, this.conf);

    // Reset state
    this.activeFilter = null;

    // Update activity status of all filters
    let hasActiveFilter = false;
    for (let key in data.options) {
      if (state.activeFilters[key]) {
        data.options[key].active = true;
        this.activeFilter = key;
        hasActiveFilter = true;
      }
      else {
        data.options[key].active = false;
      }
    }

    // If not active filters, set the "nofilter" active
    if (!hasActiveFilter && data.options[NO_FILTER_NAME]) {
      data.options[NO_FILTER_NAME].active = true;
    }


    // Template
    let template = null;
    if (this.conf.type === FILTER_TYPE.TABS) {
      template = FILTERS_TABS_TEMPLATE;
    }
    else if (this.conf.type === FILTER_TYPE.TAGS) {
      template = FILTERS_TAGS_TEMPLATE;
    }
    else if (this.conf.type === FILTER_TYPE.CHECKBOX_GROUP) {
      template = FILTERS_CHECKBOXGROUP_TEMPLATE;
    }
    else if (this.conf.type === FILTER_TYPE.RADIO_GROUP) {
      template = FILTERS_RADIOGROUP_TEMPLATE;
    }
    else if (this.conf.type === FILTER_TYPE.SELECT_LIST) {
      template = FILTERS_SELECTLIST_TEMPLATE;
    }
    else if (this.conf.type === FILTER_TYPE.RANGE) {
      if (state.activeRangeFilters[this.conf.field]) {
        data.from = state.activeRangeFilters[this.conf.field].gte;
        data.to = state.activeRangeFilters[this.conf.field].lte;
      }
      const res = this.reduxStore.getState().search.results;
      if (res && res.fieldStats && res.fieldStats[this.conf.field]) {
        const { min, max } = res.fieldStats[this.conf.field];
        data.fromPlaceholder = min === 'Infinity' ? '' : min;
        data.toPlaceholder = max === '-Infinity' ? '' : max;
      }
      template = FILTERS_RANGE_TEMPLATE;
    }

    // Render and attach events to elements with data-filter attribute
    const container = renderToContainer(this.conf.containerId, this.conf.template || template, data);


    // Attach event listeners to select list
    if (this.conf.type === FILTER_TYPE.SELECT_LIST) {
      container.querySelector('select').addEventListener('change', (e) =>  this.singleActiveChangeEvent(e.target.value));
    }

    // Attach event listeners to tabs
    else if (this.conf.type === FILTER_TYPE.TABS) {
      const tabs = container.querySelectorAll('[data-filter]');

      for (let i=0; i<tabs.length; i++) {
        tabs[i].addEventListener('click', (e) =>  this.singleActiveChangeEvent(e.target.getAttribute('data-filter')));
      }
    }

    // Radio group
    else if (this.conf.type === FILTER_TYPE.RADIO_GROUP) {
      const radios = container.querySelectorAll('input');
      for (let i=0; i<radios.length; i++) {
        radios[i].addEventListener('click', (e) => this.singleActiveChangeEvent(e.target.value));
      }
    }

    // Range filter
    if (this.conf.type === FILTER_TYPE.RANGE) {
      this.attachRangeFilterEvents(container);
    }

    // Attach event listeners to other filter types
    else {
      attachEventListeners(container, 'data-filter', 'click', (filterKey) => {
        this.reduxStore.dispatch(toggleFilter(filterKey, 1));
      });
    }
  }


  attachRangeFilterEvents(container) {
    const inputs = container.querySelectorAll('input');
    for (let i=0; i<inputs.length; i++) {
      inputs[i].addEventListener('change', (e) => {
        this.rangeChangeEvent(this.conf.field,
          container.querySelector('input[name="from"]').value,
          container.querySelector('input[name="to"]').value)
      });
    }
    // Clear button
    container.querySelector('button').addEventListener('click', (e) => this.reduxStore.dispatch(setRangeFilter(this.conf.field, null, null)));
  }


  singleActiveChangeEvent(filterKey) {
    const isNoFilter = filterKey === NO_FILTER_NAME;
    const store = this.reduxStore;

    // Current filter re-activated (e.g. same tab clicked again)
    if (filterKey === this.activeFilter) {
      return;
    }

    // Remove all other filters. Refresh results if there is no next filter
    if (this.conf.clearOtherFilters === true) {
      store.dispatch(clearSelected(isNoFilter));
    }
    // Remove previous filter. Refresh results if there is no next filter
    else if (this.activeFilter) {
      store.dispatch(toggleFilter(this.activeFilter, 1, isNoFilter));
    }

    // No next filter
    if (isNoFilter) {
      this.activeFilter = null;
    }
    // Next filter. Set and refresh results
    else {
      this.activeFilter = filterKey;
      store.dispatch(toggleFilter(filterKey, 1, true));
    }
  }


  rangeChangeEvent(field, from, to) {
    const fromInt = from !== '' ? parseInt(from, 10) : null;
    const toInt = to !== '' ? parseInt(to, 10) : null;
    this.reduxStore.dispatch(setRangeFilter(field, isNaN(fromInt) ? null : fromInt, isNaN(toInt) ? null : toInt));
  }
}