export const TABS_TEMPLATE = `
  <div class="addsearch-filters-tabs">
    <div class="tabs">
      {{#each options}}
        <button data-filter="{{@key}}" {{#if active}}class="active"{{/if}}>{{label}}</button>
      {{/each}}
    </div>
  </div>
`;