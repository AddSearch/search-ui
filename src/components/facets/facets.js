import './facets.scss';
import handlebars from 'handlebars';
import { FACETS_TEMPLATE } from './templates';
import { toggleFacetFilter } from '../../actions/filters';
import { search } from '../../actions/search';
import { observeStoreByKey } from '../../store';
import { validateContainer } from '../../util/dom';
import { createFilterObjectWithoutFacetGroup } from "../filters/customfilters";


export default class Facets {

  constructor(client, reduxStore, conf, baseFilters) {
    this.client = client;
    this.reduxStore = reduxStore;
    this.conf = conf;

    function _isEmpty(obj) {
      return !obj ? true : Object.keys(obj).length === 0;
    }

    var IGNORE_RENDERING_ON_REQUEST_BY = [
      'component.loadMore',
      'component.pagination',
      'component.sortby'
    ];

    if (validateContainer(conf.containerId)) {

      observeStoreByKey(this.reduxStore, 'search', (search) => {
        var activeFacets = this.reduxStore.getState().filters.activeFacets;
        if (search.loading || IGNORE_RENDERING_ON_REQUEST_BY.indexOf(search.callBy) > -1) {
          return;
        }
        if (_isEmpty(activeFacets[this.conf.field]) || !this.conf.advancedSticky) {
          this.render(search);
        } else {
          var filterObjectCustom = createFilterObjectWithoutFacetGroup(
            this.reduxStore.getState().filters, baseFilters, this.conf.field);

          if (search.callBy !== this.conf.field) {
            client.fetchCustomApi(this.conf.field, filterObjectCustom, res => {
              this.render(res, true);
            })
          }
        }
      });
    }
  }


  setFilter(value) {
    // Dispatch facet and refresh search
    this.reduxStore.dispatch(toggleFacetFilter(this.conf.field, value, true));
  }


  render(search, isStickyFacetsRenderer) {
    if (search.loading) {
      return;
    }

    const facetField = this.conf.field;
    const results = isStickyFacetsRenderer ? search : search.results;

    // Facets in search results
    let facets = [];
    if (results && results.facets && results.facets[facetField]) {
      facets = results.facets[facetField];
    }


    // Read active facets from redux state
    const activeFacets = this.getActiveFacets(facetField);


    // Sticky facets (i.e. not updating if keyword is unchanged)
    if (this.conf.sticky === true && !this.conf.advancedSticky) {
      // Keyword has changed, facets are not saved yet, or no selected facets. Show new incoming facets
      if (this.keyword !== search.keyword || !this.stickyFacets || activeFacets.length === 0) {
        this.keyword = search.keyword;
        this.stickyFacets = facets;
      }
      // Keyword not changed. Show old facets
      else {
        facets = this.stickyFacets;
      }
    }

    // Possible filtering function to remove unwanted facets
    if (this.conf.facetsFilter) {
      facets = this.conf.facetsFilter(facets);
    }


    // Render
    const data = {
      conf: this.conf,
      facets: facets
    };


    // Compile HTML and inject to element if changed
    const html = handlebars.compile(this.conf.template || FACETS_TEMPLATE)(data);
    if (this.renderedHtml === html && activeFacets === this.renderedActiveFacets) {
      return;
    }
    this.renderedActiveFacets = activeFacets;

    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;
    this.renderedHtml = html;


    // Attach events
    const options = container.getElementsByTagName('input');
    for (let i=0; i<options.length; i++) {
      let checkbox = options[i];
      checkbox.checked = activeFacets.indexOf(checkbox.value) !== -1;

      checkbox.onchange = (e) => {
        this.setFilter(e.target.value, e.target.checked);
      };
    }
  }


  getActiveFacets(facetField) {
    // Read active facets from redux state
    let activeFacets = [];
    const activeFacetState = this.reduxStore.getState().filters.activeFacets;
    if (activeFacetState[facetField]) {
      for (let value in activeFacetState[facetField]) {
        activeFacets.push(value);
      }
    }
    return activeFacets;
  }
}