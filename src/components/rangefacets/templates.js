export const FACETS_TEMPLATE = `
  <div class="addsearch-facets">
    <ul>
    {{#each rangeFacets}}
      <li data-facet="{{value}}" {{#unless count}}style="display: none"{{/unless}}>
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

export const RANGE_SLIDER_TEMPLATE = `
<div class="addsearch-range-slider">
  <div class="adds-range-slider-container" 
       data-slider-min="{{sliderConfig.min}}" 
       data-slider-max="{{sliderConfig.max}}" 
       data-slider-start="{{sliderConfig.start}}" 
       data-slider-end="{{sliderConfig.end}}">
  </div>
  
  <div class="adds-range-slider-display">
    <span>
      <span data-id="adds-slider-display-start"></span><span></span>
    </span>
    <span>
      <span data-id="adds-slider-display-end"></span><span></span>
    </span>
  </div>
</div>
`;
