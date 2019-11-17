import './facetgroup.scss';
import handlebars from 'handlebars';
import { toggleFacetFilter } from '../../actions/filters';
import { setPage } from '../../actions/pagination';
import { search } from '../../actions/search';
import { getStore, observeStoreByKey } from '../../store';

const TEMPLATE = `
  <div class="addsearch-facetgroup">        
    <h3>{{conf.title}}</h3>
    <ul>
    {{#each facets}}
      <li data-facet="{{value}}">
        <label>
          <input type="checkbox" value="{{value}}" />
          {{value}} <em>({{count}})</em>
        </label>
      </li>
    {{/each}}
    </ul>
  </div>
`;


export default class FacetGroup {

  constructor(client, conf) {
    this.client = client;
    this.conf = conf;

    this.fieldName = conf.field;
    this.activeFilters = [];

    observeStoreByKey(getStore(), 'search', (search) => this.render(search));
  }


  setFilter(value, active) {
    const idx = this.activeFilters.indexOf(value);
    if (active && idx === -1) {
      this.activeFilters.push(value);
    }
    else if (idx !== -1) {
      this.activeFilters.splice(idx, 1);
    }

    // Dispatch filter
    getStore().dispatch(toggleFacetFilter(this.conf.field, value));

    // Reset paging
    getStore().dispatch(setPage(this.client, 1));

    // Refresh search
    const keyword = getStore().getState().keyword.value;
    getStore().dispatch(search(this.client, keyword));
  }


  render(search) {
    const results = search.results;

    let facets = [];
    if (results && results.facets && results.facets[this.fieldName]) {
      facets = results.facets[this.fieldName];
    }

    const data = {
      conf: this.conf,
      facets: facets
    };
    const html = handlebars.compile(this.conf.template || TEMPLATE)(data);
    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;

    // Attach events
    const options = container.getElementsByTagName('input');

    // Filter options
    for (let i=0; i<options.length; i++) {
      let checkbox = options[i];
      checkbox.checked = this.activeFilters.indexOf(checkbox.value) !== -1;

      checkbox.onchange = (e) => {
        this.setFilter(e.target.value, e.target.checked);
      };
    }
  }
}