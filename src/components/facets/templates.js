export const FACETS_TEMPLATE = `
  <div class="addsearch-facets">
    <ul>
    {{#each facets}}
      <li data-facet="{{value}}">
        <label>
          <input type="checkbox" value="{{value}}" /><span>{{value}}</span> <em>({{count}})</em>
        </label>
      </li>
    {{/each}}
    </ul>
  </div>
`;