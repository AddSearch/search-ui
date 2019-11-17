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
  state.availableFilters.forEach(filter => {
    let filterGroupOR = {or: []};

    for (let key in filter.options) {
      if (state.activeFilters[key]) {
        const f = filter.options[key].filter;
        filterGroupOR.or.push(f);
      }
    }

    if (filterGroupOR.or.length > 0) {
      filterObject.and.push(filterGroupOR);
    }
  });


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

      const filterObject = this.createFilterObjectFunction(state);
      this.client.setFilterObject(filterObject);

      const keyword = getStore().getState().keyword.value;
      getStore().dispatch(setPage(this.client, 1));
      getStore().dispatch(search(this.client, keyword, null));
    }
  }
}