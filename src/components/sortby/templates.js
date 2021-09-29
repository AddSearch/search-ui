export const SORTBY_SELECT_TEMPLATE = `
  <div class="addsearch-sortby">        
    <select>
      {{#each options}}
        <option data-field={{sortBy}} data-order={{order}} {{#if active}}selected="selected"{{/if}}>{{label}}</option>
      {{/each}}
    </select>
  </div>
`;

export const SORTBY_RADIOGROUP_TEMPLATE = `
  <div class="addsearch-sortby-radiogroup">
    {{#each options}}
      <label>
        <input type="radio" name={{../containerId}} data-field={{sortBy}} data-order={{order}} value="" {{#if active}}checked{{/if}}>{{label}}
      </label>
    {{/each}}
  </div>
`;