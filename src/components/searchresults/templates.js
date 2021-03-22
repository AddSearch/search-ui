//   If you are customising the default search result template, make sure your links still include the data-analytics-click="{{id}}" attribute,
//   otherwise your analytics will not report clicks or CTR correctly.
export const SEARCHRESULTS_TEMPLATE = `
  <div class="addsearch-searchresults">    
    {{#if resultcount}}
      {{> numberOfResultsTemplate }}
    {{/if}}
    
    {{#each hits}}
      <div class="hit{{#equals type "PROMOTED"}} promoted{{/equals}}">
        <h3>
          <a href="{{url}}" data-analytics-click="{{id}}">{{#if title}} {{title}} {{else}} {{removeTrailingQueriesFromUrl url}} {{/if}}</a>
        </h3>
        <div class="highlight">
          {{> searchResultImageTemplate}}
          {{{highlight}}}{{#not type "PROMOTED"}}&#8230;{{/not}}
        </div>
        {{#gt categories.length 1}}
          <div class="category">
            {{selectCategory ..}}
          </div>
        {{/gt}}
      </div>
    {{/each}}
  </div>
`;


export const SEARCHRESULT_IMAGE_TEMPLATE = `
  <span class="main-image {{document_type}} {{#unless images.main}}noimage{{/unless}}"{{#if images.main}} style="background-image: url(data:image/jpeg;base64,{{images.main_b64}})"{{/if}}>
    {{#if images.main}}<img src="{{images.main}}" alt="{{title}}" />
    {{else if style.image_url}}<img src="{{style.image_url}}" alt="{{title}}" />{{/if}}    
  </span>
`;


export const NUMBER_OF_RESULTS_TEMPLATE = `
  <div class="number-of-results">
    {{#gt page 1}}Page {{../page}} of {{/gt}}
    {{total_hits}}{{#equals total_hits 10000}}+{{/equals}} results
  </div>
`;


export const NO_RESULTS_TEMPLATE = `
  <div class="addsearch-searchresults addsearch-searchresults-no-results">
    <h2>No search results with keyword <em>{{keyword}}</em></h2>
  </div>
`;
