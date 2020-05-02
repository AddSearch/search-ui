export const FILTERS_CHECKBOXGROUP_TEMPLATE = `
  <div class="addsearch-filters-checkboxgroup">
    {{#each options}}
      <label>
        <input type="checkbox" data-filter="{{@key}}" {{#if active}}checked{{/if}}>{{label}}
      </label>
    {{/each}}
  </div>
`;


export const FILTERS_TAGS_TEMPLATE = `
  <div class="addsearch-filters-tags">
    {{#each options}}
      <button data-filter="{{@key}}" {{#if active}}class="active"{{/if}}>{{label}}</button>
    {{/each}}
  </div>
`;


export const FILTERS_TABS_TEMPLATE = `
  <div class="addsearch-filters-tabs">
    <div class="tabs">
      {{#each options}}
        <button data-filter="{{@key}}" {{#if active}}class="active"{{/if}}>{{label}}</button>
      {{/each}}
    </div>
  </div>
`;


export const FILTERS_SELECTLIST_TEMPLATE = `
  <div class="addsearch-filters-selectlist">
    <select>
      {{#each options}}
        <option value="{{@key}}" {{#if active}}selected{{/if}}>{{label}}</option>
      {{/each}}
    </select>
  </div>
`;


export const FILTERS_RADIOGROUP_TEMPLATE = `
  <div class="addsearch-filters-radiogroup">
    {{#each options}}
      <label>
        <input type="radio" name={{../containerId}} value="{{@key}}" {{#if active}}checked{{/if}}>{{label}}
      </label>
    {{/each}}
  </div>
`;


export const FILTERS_RANGE_TEMPLATE = `
  <div class="addsearch-filters-range">
    <label>{{label}}</label>
    <input type="text" name="from" value="{{from}}" placeholder="{{fromPlaceholder}}"> - <input type="text" name="to" value="{{to}}" placeholder="{{toPlaceholder}}">
    <div class="clear"><button>Clear</button></div>
  </div>
`;