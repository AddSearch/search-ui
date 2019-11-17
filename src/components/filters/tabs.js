import './filters.scss';
import handlebars from 'handlebars';

const TEMPLATE = `
  <div class="addsearch-filters-tabs">
    <div class="tabs">
      {{#each options}}
        <button {{#if active}}class="active"{{/if}}>{{label}}</button>
      {{/each}}
    </div>
  </div>
`;

export function tabs(conf) {
  const html = handlebars.compile(conf.template || TEMPLATE)(conf);
  const container = document.getElementById(conf.containerId);
  container.innerHTML = html;
}
