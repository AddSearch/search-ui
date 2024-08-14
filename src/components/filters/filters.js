import './filters.scss';
import handlebars from 'handlebars';
import { FILTER_TYPE } from './index';
import { observeStoreByKey } from '../../store';
import { toggleFilter, setRangeFilter, registerFilter, clearSelected } from '../../actions/filters';
import { sortBy } from '../../actions/sortby';
import { attachEventListeners, validateContainer } from '../../util/dom';
import PRECOMPILED_FILTERS_CHECKBOXGROUP_TEMPLATE from './precompile-templates/filters_checkboxgroup.handlebars';
import PRECOMPILED_FILTERS_RADIOGROUP_TEMPLATE from './precompile-templates/filters_radiogroup.handlebars';
import PRECOMPILED_FILTERS_TAGS_TEMPLATE from './precompile-templates/filters_tags.handlebars';
import PRECOMPILED_FILTERS_TABS_TEMPLATE from './precompile-templates/filters_tabs.handlebars';
import PRECOMPILED_FILTERS_SELECTLIST_TEMPLATE from './precompile-templates/filters_selectlist.handlebars';
import PRECOMPILED_FILTERS_RANGE_TEMPLATE from './precompile-templates/filters_range.handlebars';

export const NO_FILTER_NAME = 'nofilter';

export default class Filters {

  constructor(client, reduxStore, conf) {
    this.client = client;
    this.reduxStore = reduxStore;
    this.conf = conf;
    this.activeFilter = null; // For select list and tab filters with a single selectable value
    this.onInteractionComplete = typeof conf.onInteractionComplete === 'function' ? conf.onInteractionComplete : function() {};

    if (validateContainer(conf.containerId)) {
      this.reduxStore.dispatch(registerFilter(this.conf));
      // observeStoreByKey(this.reduxStore, 'filters', (state) => this.render(state));

      observeStoreByKey(this.reduxStore, 'filters', (state) => {
        this.render(state)
      });

      // Observe fieldStats from search results for range filters' min/max values
      if (this.conf.type === FILTER_TYPE.RANGE) {
        observeStoreByKey(this.reduxStore, 'search', (state) => this.searchResultsChanged(state));
      }
    }
  }


  searchResultsChanged(state) {
    // Re-render if fieldStats of this field change
    if (!state.loading && state.results.fieldStats && state.results.fieldStats[this.conf.field]) {
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
    if (!hasActiveFilter && data.options && data.options[NO_FILTER_NAME]) {
      data.options[NO_FILTER_NAME].active = true;
    }


    // Template
    let templateDefault = null;
    if (this.conf.type === FILTER_TYPE.TABS) {
      templateDefault = PRECOMPILED_FILTERS_TABS_TEMPLATE;
    }
    else if (this.conf.type === FILTER_TYPE.TAGS) {
      templateDefault = PRECOMPILED_FILTERS_TAGS_TEMPLATE;
    }
    else if (this.conf.type === FILTER_TYPE.CHECKBOX_GROUP) {
      templateDefault = PRECOMPILED_FILTERS_CHECKBOXGROUP_TEMPLATE;
    }
    else if (this.conf.type === FILTER_TYPE.RADIO_GROUP) {
      templateDefault = PRECOMPILED_FILTERS_RADIOGROUP_TEMPLATE;
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
      templateDefault = PRECOMPILED_FILTERS_RANGE_TEMPLATE;
    } else {
      templateDefault = PRECOMPILED_FILTERS_SELECTLIST_TEMPLATE;
    }


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
    else if (this.conf.type === FILTER_TYPE.RANGE) {
      this.attachRangeFilterEvents(container);
    }

    // Attach event listeners to other filter types
    else {
      attachEventListeners(container, 'data-filter', 'click', (filterKey) => {
        const checkboxInput = container.querySelector('input[data-filter="' + filterKey + '"]');
        const isChecked = checkboxInput ? checkboxInput.checked : null;
        this.reduxStore.dispatch(toggleFilter(filterKey, 1));
        this.onInteractionComplete(filterKey, isChecked);
      });
    }
  }


  singleActiveChangeEvent(filterKey) {
    const isNoFilter = filterKey === NO_FILTER_NAME;
    const store = this.reduxStore;

    // Current filter re-activated (e.g. same tab clicked again)
    if (filterKey === this.activeFilter) {
      return;
    }

    if (this.conf.setSorting) {
      store.dispatch(sortBy(this.client, this.conf.setSorting.field, this.conf.setSorting.order, this.reduxStore));
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
    this.onInteractionComplete(filterKey);
  }


  attachRangeFilterEvents(container) {
    const inputs = container.querySelectorAll('input');
    for (let i=0; i<inputs.length; i++) {
      inputs[i].addEventListener('change', (e) => {

        // Validate with the regex rule given in conf
        if (this.conf.validator && !(new RegExp(this.conf.validator)).test(e.target.value)) {
          e.target.setAttribute('data-valid', 'false');
        }
        // Value valid (or no validator)
        else {
          e.target.setAttribute('data-valid', 'true');
          this.rangeChangeEvent(this.conf.field,
            container.querySelector('input[name="from"]').value,
            container.querySelector('input[name="to"]').value)
        }
        this.onInteractionComplete(this.conf.field);
      });
    }
    // Clear button
    const button = container.querySelector('button');
    if (button) {
      button.addEventListener('click', (e) => this.reduxStore.dispatch(setRangeFilter(this.conf.field, null, null)));
    }
  }


  rangeChangeEvent(field, from, to) {
    const fromVal = from !== '' ? from : null;
    const toVal = to !== '' ? to : null;
    this.reduxStore.dispatch(setRangeFilter(field, fromVal, toVal));
  }
}
