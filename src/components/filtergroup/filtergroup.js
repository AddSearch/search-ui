import './filtergroup.scss';
import handlebars from 'handlebars';


const TEMPLATE = `
  <div class="addsearch-filtergroup">        
    <h3>{{title}}</h3>
    {{#each options}}
      <div class="filter">
        <h3>{{label}}</h3>        
      </div>
    {{/each}}
  </div>
`;


export default class FilterGroup {

  constructor(filterGroupConf) {
    this.filterGroupConf = filterGroupConf;
  }

  render() {
    const html = handlebars.compile(this.filterGroupConf.template || TEMPLATE)(this.filterGroupConf);
    document.getElementById(this.filterGroupConf.containerId).innerHTML = html;
  }
}