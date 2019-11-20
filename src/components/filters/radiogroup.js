export const RADIOGROUP_TEMPLATE = `
  <div class="addsearch-filters-radiogroup">
    {{#each options}}
      <label>
        <input type="radio" name={{../containerId}} value="{{@key}}" {{#if active}}checked{{/if}}>{{label}}
      </label>
    {{/each}}
  </div>
`;