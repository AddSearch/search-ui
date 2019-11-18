export const CHECKBOXGROUP_TEMPLATE = `
  <div class="addsearch-filters-checkboxgroup">
    {{#each options}}
      <label>
        <input type="checkbox" data-filter="{{@key}}" {{#if active}}checked{{/if}}>{{label}}
      </label>
    {{/each}}
  </div>
`;