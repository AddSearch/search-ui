import './filters.scss';
import { search } from '../../actions/search';
import { setPage } from '../../actions/pagination';
import { observeStoreByKey } from '../../store';
import { setHistory, jsonToUrlParam, HISTORY_PARAMETERS } from '../../util/history';
import { segmentedSearch } from "../../actions/segmentedsearch";


/**
 * Default function to map the current filter state to a filter object suitable for the AddSearch client
 */
export function createFilterObject(state, baseFilters, excludedFacetGroup) {

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
      if (facetField !== excludedFacetGroup) {
        const f = {};
        f[facetField] = facetValue;
        facetGroupOR.or.push(f);
      }
    }

    if (facetGroupOR.or.length > 0) {
      filterObject.and.push(facetGroupOR);
    }
  }

  // Iterate active hierarchical facets. Create OR filter group of active filters for every lowest level of facet field.
  for (let facetContainer in state.activeHierarchicalFacets) {
    let hierarchicalFacetGroupOR = {or: []};
    for (let facetField in state.activeHierarchicalFacets[facetContainer]) {

      for (let facetValue in state.activeHierarchicalFacets[facetContainer][facetField]) {
        if (!excludedFacetGroup || excludedFacetGroup.indexOf(facetField) === -1) {
          const f = {};
          f[facetField] = facetValue;
          hierarchicalFacetGroupOR.or.push(f);
        }
      }
    }
    if (hierarchicalFacetGroupOR.or.length > 0) {
      filterObject.and.push(hierarchicalFacetGroupOR);
    }
  }

  // Iterate active range facets. Create OR filter group of active filters.
  for (let rangeFacetField in state.activeRangeFacets) {
    let facetGroupOR = {or: []};

    for (let rangeFacetKey in state.activeRangeFacets[rangeFacetField]) {
      if (rangeFacetField !== excludedFacetGroup) {
        const rf = {
          'range': {
            [rangeFacetField]: state.activeRangeFacets[rangeFacetField][rangeFacetKey]
          }
        };
        facetGroupOR.or.push(rf);
      }
    }

    if (facetGroupOR.or.length > 0) {
      filterObject.and.push(facetGroupOR);
    }
  }

  // Filter object ready
  if (filterObject.and.length > 0) {
    return filterObject;
  }
  return {};
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
      setHistory(HISTORY_PARAMETERS.RANGE_FACETS, jsonToUrlParam(state.activeRangeFacets), null, this.reduxStore);

      const filterObject = this.createFilterObjectFunction(state, baseFilters);
      this.client.setFilterObject(filterObject);

      const keyword = this.reduxStore.getState().keyword.value;
      this.reduxStore.dispatch(setPage(this.client, 1, null, this.reduxStore));
      this.reduxStore.dispatch(search(this.client, keyword, null, null, null, this.reduxStore, null, state.targetFacetGroup));

      for (let key in this.segmentedSearchClients) {
        const segmentFilters = this.createFilterObjectFunction(state, this.segmentedSearchClients[key].originalFilters);
        this.segmentedSearchClients[key].client.setFilterObject(segmentFilters);
        this.reduxStore.dispatch(segmentedSearch(this.segmentedSearchClients[key].client, key, keyword));
      }
    } else if (state.setHistory) {
      const filterObject = this.createFilterObjectFunction(state, baseFilters);
      this.client.setFilterObject(filterObject);
      setHistory(HISTORY_PARAMETERS.RANGE_FACETS, jsonToUrlParam(state.activeRangeFacets), null, this.reduxStore);
    }


    // Custom function to control conditional visibility (e.g. show a component only when a certain filter is active)
    if (this.onFilterChange) {
      this.onFilterChange(state.activeFilters);
    }
  }
}
