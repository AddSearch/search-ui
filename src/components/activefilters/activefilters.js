import './activefilters.scss';
import { ACTIVE_FILTERS_TEMPLATE } from './templates';
import { toggleFacetFilter, toggleFilter, clearSelected } from '../../actions/filters';
import { renderToContainer, validateContainer } from '../../util/dom';
import { observeStoreByKey } from '../../store';

const TYPE = {
  FILTER: 'FILTER',
  FACET: 'FACET'
}

export default class ActiveFilters {

  constructor(client, reduxStore, conf) {
    this.client = client;
    this.conf = conf;
    this.reduxStore = reduxStore;

    if (validateContainer(conf.containerId)) {
      observeStoreByKey(this.reduxStore, 'filters', (state) => this.render(state));
    }
  }


  getFilterLabel(filterName, allAvailableFilters) {
    for (let i=0; i<allAvailableFilters.length; i++) {
      if (allAvailableFilters[i][filterName]) {
        return allAvailableFilters[i][filterName].label;
      }
    }
  }


  render(filterState) {
    let active = [];

    // Filters
    for (let key in filterState.activeFilters) {
      active.push({
        type: TYPE.FILTER,
        name: key,
        value: filterState.activeFilters[key],
        label: this.getFilterLabel(key, filterState.allAvailableFilters)
      });
    }

    // Facets
    for (let key in filterState.activeFacets) {
      // Category and custom field facets
      if (key === 'category' || key.indexOf('custom_fields.') === 0) {
        for (var category in filterState.activeFacets[key]) {
          active.push({
            name: key,
            type: TYPE.FACET,
            value: category,
            label: category.replace(/^[0-9]+[x]{1}/, '')
          });
        }
      }
    }

    const data = {
      active,
      clearAll: this.conf.clearAll !== false
    };

    const container = renderToContainer(this.conf.containerId, this.conf.template || ACTIVE_FILTERS_TEMPLATE, data);

    // Attach events
    const elems = container.querySelectorAll('[data-type]');
    for (let i = 0; i < elems.length; i++) {
      elems[i].addEventListener('click', (e) => this.handleFilterClick(e));
    }

    const clearAll = container.querySelector('[data-clearall]');
    if (clearAll) {
      clearAll.addEventListener('click', (e) => this.reduxStore.dispatch(clearSelected(true)));
    }
  }


  handleFilterClick(e) {
    const type = e.target.getAttribute('data-type');
    const name = e.target.getAttribute('data-name');
    const value = e.target.getAttribute('data-value');

    if (type === TYPE.FILTER) {
      this.reduxStore.dispatch(toggleFilter(name, value, true));
    }
    else if (type === TYPE.FACET) {
      this.reduxStore.dispatch(toggleFacetFilter(name, value));
    }
  }
}