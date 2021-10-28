export const FACETS_TEMPLATE = `
  <ul class="addsearch-hierarchical-facets">
    {{#each facets}}
      {{> subHierarchicalFacetsTemplate this }}
    {{/each}}
  </div>
`;

export const SUB_HIERARCHICAL_FACETS_TEMPLATE = `
  <li data-facet="{{value}}" {{#if (validateOpenState value)}}class="shrink"{{/if}}>
    <label>
      <input type="checkbox" value="{{value}}" data-field="{{field}}" />
      <span>{{displayValue}}</span> <em>({{count}})</em>
    </label>
    {{#if children}}
      <span class="addsearch-facet-group-expansion-arrow"></span>
      <ul class="addsearch-facet-child-container">
        {{#each children}}
          {{> subHierarchicalFacetsTemplate this }}
        {{/each}}
      </ul>
    {{/if}}
  </li>
`;
