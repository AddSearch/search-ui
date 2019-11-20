export const SELECTLIST_TEMPLATE = `
  <div class="addsearch-filters-selectlist">
    <select>
      {{#each options}}
        <option value="{{@key}}" {{#if active}}selected{{/if}}>{{label}}</option>
      {{/each}}
    </select>
  </div>
`;