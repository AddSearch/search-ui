/**
 * Default function to map the current filter state to a filter object suitable for the AddSearch client
 */
export function createFilterObjectWithoutFacetGroup(state, baseFilters, facetGroup) {

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
      if (facetField !== facetGroup) {
        const f = {};
        f[facetField] = encodeURIComponent(facetValue);
        facetGroupOR.or.push(f);
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