export const TAGS_TEMPLATE = `
  <div class="addsearch-filters-tags">
    {{#each options}}
      <button data-filter="{{@key}}" {{#if active}}class="active"{{/if}}>{{label}}</button>
    {{/each}}
  </div>
`;