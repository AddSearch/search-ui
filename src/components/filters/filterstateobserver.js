import './filters.scss';
import { search } from '../../actions/search';
import { setPage } from '../../actions/pagination';
import { observeStoreByKey } from '../../store';
import { setHistory, jsonToUrlParam, HISTORY_PARAMETERS } from '../../util/history';
import { segmentedSearch } from "../../actions/segmentedsearch";


/**
 * Default function to map the current filter state to a filter object suitable for the AddSearch client
 */
export function createFilterObject(state, baseFilters) {

  let filterObject = {
    and: []
  };

  // Possible default filters that can't be disabled by the user
  if (baseFilters) {
    filterObject.and.push(baseFilters);
  }

  // Iterate available filters. Create OR filter group of active filters.
  // Use one filter per unique filter key (so multiple filters with the same key is possible in UI)
  let consumedFilterKeys = {};
  state.allAvailableFilters.forEach(filterGroup => {
    let filterGroupOR = {or: []};

    for (let key in filterGroup) {
      if (state.activeFilters[key] && !consumedFilterKeys[key]) {
        filterGroupOR.or.push(filterGroup[key].filter);
        consumedFilterKeys[key] = true;
      }
    }

    if (filterGroupOR.or.length > 0) {
      filterObject.and.push(filterGroupOR);
    }
  });

  // Range filters
  for (let key in state.activeRangeFilters) {
    filterObject.and.push({'range': {[key]: Object.assign({}, state.activeRangeFilters[key])}});
  }

  // Iterate active facets. Create OR filter group of active filters.
  for (let facetField in state.activeFacets) {
    let facetGroupOR = {or: []};

    for (let facetValue in state.activeFacets[facetField]) {
      const f = {};
      f[facetField] = facetValue;
      facetGroupOR.or.push(f);
    }

    if (facetGroupOR.or.length > 0) {
      filterObject.and.push(facetGroupOR);
    }
  }

  // Filter object ready
  if (filterObject.and.length > 0) {
    return filterObject;
  }
  return null;
}


/**
 * Observer
 */
export default class FilterStateObserver {

  constructor(client, reduxStore, createFilterObjectFunction, onFilterChange, baseFilters, segmentedSearchClients) {
    this.client = client;
    this.reduxStore = reduxStore;
    this.createFilterObjectFunction = createFilterObjectFunction;
    this.onFilterChange = onFilterChange;
    this.segmentedSearchClients = segmentedSearchClients;

    observeStoreByKey(this.reduxStore, 'filters', state => this.onFilterStateChange(state, baseFilters));
  }


  onFilterStateChange(state, baseFilters) {
    if (state.refreshSearch) {
      setHistory(HISTORY_PARAMETERS.FILTERS, jsonToUrlParam(state.activeFilters), null, this.reduxStore);
      setHistory(HISTORY_PARAMETERS.FACETS, jsonToUrlParam(state.activeFacets), null, this.reduxStore);

      const filterObject = this.createFilterObjectFunction(state, baseFilters);
      this.client.setFilterObject(filterObject);

      const keyword = this.reduxStore.getState().keyword.value;
      this.reduxStore.dispatch(setPage(this.client, 1, null, this.reduxStore));
      this.reduxStore.dispatch(search(this.client, keyword, null, null, null, this.reduxStore, null, state.targetFacetGroup));

      for (let key in this.segmentedSearchClients) {
        this.segmentedSearchClients[key].setFilterObject(filterObject);
        this.reduxStore.dispatch(segmentedSearch(this.segmentedSearchClients[key], key, keyword));
      }
    }

    // Custom function to control conditional visibility (e.g. show a component only when a certain filter is active)
    if (this.onFilterChange) {
      this.onFilterChange(state.activeFilters);
    }
  }
}
