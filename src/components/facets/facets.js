import './facets.scss';
import { FACETS_TEMPLATE } from './templates';
import { toggleFacetFilter } from '../../actions/filters';
import { setPage } from '../../actions/pagination';
import { search } from '../../actions/search';
import { observeStoreByKey } from '../../store';
import { renderToContainer, validateContainer } from '../../util/dom';


export default class Facets {

  constructor(client, reduxStore, conf) {
    this.client = client;
    this.reduxStore = reduxStore;
    this.conf = conf;

    if (validateContainer(conf.containerId)) {
      observeStoreByKey(this.reduxStore, 'search', (search) => this.render(search));
    }
  }


  setFilter(value, active) {
    // Dispatch filter
    this.reduxStore.dispatch(toggleFacetFilter(this.conf.field, value));

    // Reset paging
    this.reduxStore.dispatch(setPage(this.client, 1));

    // Refresh search
    const keyword = this.reduxStore.getState().keyword.value;
    this.reduxStore.dispatch(search(this.client, keyword));
  }


  render(search) {
    const facetField = this.conf.field;
    const results = search.results;

    // Facets in search results
    let facets = [];
    if (results && results.facets && results.facets[facetField]) {
      facets = results.facets[facetField];
    }

    // Possible filter
    if (this.conf.facetsFilter) {
      facets = this.conf.facetsFilter(facets);
    }

    // Read active facets from redux state
    let activeFacets = [];
    const activeFacetState = this.reduxStore.getState().filters.activeFacets;
    if (activeFacetState[facetField]) {
      for (let value in activeFacetState[facetField]) {
        activeFacets.push(value);
      }
    }

    // Render
    const data = {
      conf: this.conf,
      facets: facets
    };
    const container = renderToContainer(this.conf.containerId, this.conf.template || FACETS_TEMPLATE, data);


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
}