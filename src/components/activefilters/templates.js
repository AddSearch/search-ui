const ACTIVE_FILTERS_TEMPLATE = `
  <div class="addsearch-active-filters">        
    {{#each active}}
      <div class="item">{{label}} <button data-type="{{type}}" data-name="{{name}}" data-value="{{value}}">&#215;</button></div>
    {{/each}}
    {{#if clearAll}}
      {{#gt active.length 1}}
        <div class="item"><button data-clearall="true">Clear all</button></div>
      {{/gt}}
    {{/if}}
  </div>
`;