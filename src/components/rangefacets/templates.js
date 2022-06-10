export const FACETS_TEMPLATE = `
  <div class="addsearch-facets">
    <ul>
    {{#each rangeFacets}}
      <li data-facet="{{value}}">
        <label>
          <input type="checkbox" value="{{key}}" 
          data-value-min="{{from}}" 
          data-value-max="{{to}}" />
          <span>{{from}}-{{to}}</span> <em>({{count}})</em>
        </label>
      </li>
    {{/each}}
    </ul>
  </div>
`;