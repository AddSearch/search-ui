export const FACETS_TEMPLATE = `
  <div class="addsearch-facets">
    <ul>
    {{#each facets}}
      <li data-facet="{{value}}">
        <label>
          <input type="checkbox" value="{{value}}" />{{value}} <em>({{count}})</em>
        </label>
      </li>
    {{/each}}
    </ul>
  </div>
`;