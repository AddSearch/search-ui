import './filtergroup.scss';
import handlebars from 'handlebars';
import { setFilters } from '../../actions/filters';
import { search } from '../../actions/search';
import { getStore } from '../../store';

const TEMPLATE = `
  <div class="addsearch-filtergroup">        
    <h3>{{title}}</h3>
    <ul>
    {{#each options}}
      <li data-filter="{{filter}}">
        {{label}}
      </li>
    {{/each}}
    </ul>
  </div>
`;


export default class FilterGroup {

  constructor(client, conf) {
    this.client = client;
    this.conf = conf;

    this.activeFilters = [];
  }


  setFilter(filter, active) {
    const idx = this.activeFilters.indexOf(filter);
    if (active && idx === -1) {
      this.activeFilters.push(filter);
    }
    else if (idx !== -1) {
      this.activeFilters.splice(idx, 1);
    }

    // Dispatch filter string
    getStore().dispatch(setFilters(this.client, this.activeFilters.join()));

    // Refresh search
    const keyword = getStore().getState().keyword.value;
    if (keyword && keyword !== '') {
      getStore().dispatch(search(this.client, keyword));
    }
  }


  render(activeFiltersArray) {
    const html = handlebars.compile(this.conf.template || TEMPLATE)(this.conf);
    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;

    const options = container.getElementsByTagName('li');
    const self = this;

    // Filter options
    for (let i=0; i<options.length; i++) {
      let option = options[i];

      // Set the current active status
      if (activeFiltersArray.indexOf(option.getAttribute('data-filter')) !== -1) {
        option.setAttribute('data-active', 'true');
      }

      // Attach onclick
      option.onclick = (e) => {
        const wasActive = e.target.getAttribute('data-active') === 'true';
        e.target.setAttribute('data-active', !wasActive + '');
        self.setFilter(option.getAttribute('data-filter'), !wasActive);
      };
    }
  }
}