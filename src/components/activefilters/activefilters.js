import './activefilters.scss';
import handlebars from 'handlebars';
import { ACTIVE_FILTERS_TEMPLATE } from './templates';
import {
  toggleFacetFilter,
  toggleFilter,
  setRangeFilter,
  clearSelected,
  toggleHierarchicalFacetFilter, toggleRangeFacetFilter
} from '../../actions/filters';
import { validateContainer } from '../../util/dom';
import { observeStoreByKey } from '../../store';

const TYPE = {
  FILTER: 'FILTER',
  RANGE_FILTER: 'RANGE_FILTER',
  FACET: 'FACET',
  RANGE_FACET: 'RANGE_FACET',
  HIERARCHICAL_FACET: 'HIERARCHICAL_FACET'
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


  emptyIfNull(val) {
    if (val === null || val === undefined) {
      return '';
    }
    return val;
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

    // Range filters
    for (let key in filterState.activeRangeFilters) {
      const rangeVal = filterState.activeRangeFilters[key];
      active.push({
        type: TYPE.RANGE_FILTER,
        name: key,
        label: this.getFilterLabel(key, filterState.allAvailableFilters) + ': ' + this.emptyIfNull(rangeVal.gte) + '-' + this.emptyIfNull(rangeVal.lte)
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

    // Hierarchical facets
    for (let container in filterState.activeHierarchicalFacets) {
      for (let field in filterState.activeHierarchicalFacets[container]) {
        for (let facetValue in filterState.activeHierarchicalFacets[container][field]) {
          active.push({
            name: field,
            type: TYPE.HIERARCHICAL_FACET,
            container: container,
            value: facetValue,
            label: facetValue
          });
        }
      }
    }

    // Range facets
    for (let field in filterState.activeRangeFacets) {
      for (let key in filterState.activeRangeFacets[field]) {
        active.push({
          name: field,
          type: TYPE.RANGE_FACET,
          value: key,
          label: key,
          rangeMin: filterState.activeRangeFacets[field][key].gte,
          rangeMax: filterState.activeRangeFacets[field][key].lte
        });
      }
    }

    const data = {
      active,
      clearAll: this.conf.clearAll !== false
    };


    // Compile HTML and inject to element if changed
    const html = handlebars.compile(this.conf.template || ACTIVE_FILTERS_TEMPLATE)(data);
    if (this.renderedHtml === html) {
      return;
    }
    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;
    this.renderedHtml = html;


    // Attach events
    const elems = container.querySelectorAll('[data-type]');
    for (let i = 0; i < elems.length; i++) {
      elems[i].addEventListener('click', (e) => this.handleFilterClick(e));
    }

    const clearAll = container.querySelector('[data-clearall]');
    if (clearAll) {
      clearAll.addEventListener('click', (e) => this.reduxStore.dispatch(clearSelected(true, true)));
    }
  }


  handleFilterClick(e) {
    const type = e.target.getAttribute('data-type');
    const name = e.target.getAttribute('data-name');
    const value = e.target.getAttribute('data-value');
    const container = e.target.getAttribute('data-container');
    const confFields = e.target.getAttribute('data-conf-fields') ? e.target.getAttribute('data-conf-fields').split(',') : [];
    const rangeMin = e.target.getAttribute('data-range-min');
    const rangeMax = e.target.getAttribute('data-range-max');

    if (type === TYPE.FILTER) {
      this.reduxStore.dispatch(toggleFilter(name, value, true));
    }
    else if (type === TYPE.RANGE_FILTER) {
      this.reduxStore.dispatch(setRangeFilter(name, null, null));
    }
    else if (type === TYPE.FACET) {
      this.reduxStore.dispatch(toggleFacetFilter(name, value));
    }
    else if (type === TYPE.HIERARCHICAL_FACET) {
      this.reduxStore.dispatch(toggleHierarchicalFacetFilter(name, container, confFields, value, true))
    }
    else if (type === TYPE.RANGE_FACET) {
      const values = {
        min: rangeMin,
        max: rangeMax
      };
      this.reduxStore.dispatch(toggleRangeFacetFilter(name, values, value, true, true))
    }
  }
}