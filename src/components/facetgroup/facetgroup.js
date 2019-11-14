import './facetgroup.scss';
import handlebars from 'handlebars';
import { addCustomFieldFilter, removeCustomFieldFilter } from '../../actions/filters';
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

    observeStoreByKey(getStore(), 'search', () => this.render());
  }


  setFilter(filter, active) {
    const idx = this.activeFilters.indexOf(filter);
    if (active && idx === -1) {
      this.activeFilters.push(filter);
    }
    else if (idx !== -1) {
      this.activeFilters.splice(idx, 1);
    }

    // Dispatch filter
    const field = this.conf.field.replace('custom_fields.', '');
    if (active) {
      getStore().dispatch(addCustomFieldFilter(this.client, field, filter));
    }
    else {
      getStore().dispatch(removeCustomFieldFilter(this.client, field));
    }

    // Reset paging
    getStore().dispatch(setPage(this.client, 1));

    // Refresh search
    const keyword = getStore().getState().keyword.value;
    getStore().dispatch(search(this.client, keyword));
  }


  render() {
    const results = getStore().getState().search.results;

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