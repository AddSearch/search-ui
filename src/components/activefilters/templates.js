export const ACTIVE_FILTERS_TEMPLATE = `
  <div class="addsearch-active-filters">        
    {{#each active}}
      <div class="item">
        <span>{{label}}</span>
        <button data-type="{{type}}" data-name="{{name}}" data-value="{{value}}" 
                {{#if container}}data-container="{{container}}"{{/if}} 
                {{#if confFields}}data-conf-fields="{{confFields}}"{{/if}} >&#215;</button>
      </div>
    {{/each}}
    {{#if clearAll}}
      {{#gt active.length 1}}
        <div class="item"><button data-clearall="true">Clear all</button></div>
      {{/gt}}
    {{/if}}
  </div>
`;