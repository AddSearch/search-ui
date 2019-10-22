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
  }


  setFilters(container) {
    const options = container.getElementsByTagName('li');
    let filterString = '';
    for (let i=0; i<options.length; i++) {
      let o = options[i];
      if (o.getAttribute('data-active') === 'true') {
        filterString = o.getAttribute('data-filter');
      }
    }
    console.log('Filter string ' + filterString);
    getStore().dispatch(setFilters(this.client, filterString));
    const keyword = getStore().getState().keyword.value;
    if (keyword && keyword !== '') {
      getStore().dispatch(search(this.client, keyword));
    }
  }


  render() {
    const html = handlebars.compile(this.conf.template || TEMPLATE)(this.conf);
    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;

    const options = container.getElementsByTagName('li');
    const self = this;
    for (let i=0; i<options.length; i++) {
      let o = options[i];
      o.onclick = (e) => {
        if (o.getAttribute('data-active') === 'true') {
          o.setAttribute('data-active', 'false');
          self.setFilters(container);
        }
        else {
          o.setAttribute('data-active', 'true');
          self.setFilters(container);
        }
      };
    }
  }
}