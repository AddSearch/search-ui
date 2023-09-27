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

export const RANGE_SLIDER_TEMPLATE_1 = `
  <div class="addsearch-range-slider">
    <input type="range" name="pieces" id="inputPieces" addsearch-range-slider 
           value="{{sliderConfig.start}},{{sliderConfig.end}}" 
           min="{{sliderConfig.min}}" 
           max="{{sliderConfig.max}}" unit=" Eur" style="width: 250px" />
           
    <div style="display: flex; justify-content: space-between">
      <span>
        <span data-id="adds-slider-display-start"></span><span> eur</span>
      </span>
      <span>
        <span data-id="adds-slider-display-end"></span><span> eur</span>
      </span>
    </div>
   
  </div>
`;

export const RANGE_SLIDER_TEMPLATE_2 = `
<div>
  <div class="range_container" 
       data-slider-min="{{sliderConfig.min}}" 
       data-slider-max="{{sliderConfig.max}}" 
       data-slider-start="{{sliderConfig.start}}" 
       data-slider-end="{{sliderConfig.end}}">
  </div>
  
  <div style="display: flex; justify-content: space-between">
    <span>
      <span data-id="adds-slider-display-start"></span><span> eur</span>
    </span>
    <span>
      <span data-id="adds-slider-display-end"></span><span> eur</span>
    </span>
  </div>
</div>
`;
