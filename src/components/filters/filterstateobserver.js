import './filters.scss';
import { search } from '../../actions/search';
import { setPage } from '../../actions/pagination';
import { getStore, observeStoreByKey } from '../../store';
import { setHistory, jsonToUrlParam, HISTORY_PARAMETERS } from '../../util/history';


/**
 * Default function to map the current filter state to a filter object suitable for the AddSearch client
 */
export function createFilterObject(state) {

  let filterObject = {
    and: []
  };

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

  // Iterate active facets. Create OR filter group of active filters.
  for (let facetField in state.activeFacets) {
    let facetGroupOR = {or: []};

    for (let facetValue in state.activeFacets[facetField]) {
      const f = {};
      f['doc.' + facetField] = facetValue;
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

  constructor(client, createFilterObjectFunction) {
    this.client = client;
    this.createFilterObjectFunction = createFilterObjectFunction;

    observeStoreByKey(getStore(), 'filters', state => this.onFilterStateChange(state));
  }


  onFilterStateChange(state) {
    if (state.refreshSearch) {
      setHistory(HISTORY_PARAMETERS.FILTERS, jsonToUrlParam(state.activeFilters));
      setHistory(HISTORY_PARAMETERS.FACETS, jsonToUrlParam(state.activeFacets));

      const filterObject = this.createFilterObjectFunction(state);
      this.client.setFilterObject(filterObject);

      const keyword = getStore().getState().keyword.value;
      getStore().dispatch(setPage(this.client, 1));
      getStore().dispatch(search(this.client, keyword, null));
    }
  }
}