export const SEARCHRESULTS_TEMPLATE = `
  <div class="addsearch-searchresults">    
    {{#if resultcount}}
      {{> numberOfResultsTemplate }}
    {{/if}}
    
    {{#each hits}}
      <div class="hit">
        <h3>
          <a href="{{url}}" data-analytics-click="{{id}}">{{title}}</a>
        </h3>
        <div class="highlight">
          <span class="main-image" style="background-image: url(data:image/jpeg;base64,{{images.main_b64}})">
            <img src="{{images.main}}" alt="{{title}}" />
          </span>
          {{{highlight}}}..
        </div>
        <div class="category">
          {{selectCategory this}}
        </div>
      </div>
    {{/each}}
  </div>
`;


export const NUMBER_OF_RESULTS_TEMPLATE = `
  <div class="number-of-results">
    {{#gt page 1}}Page {{../page}} of {{/gt}}
    {{total_hits}} search results
  </div>
`;


export const NO_RESULTS_TEMPLATE = `
  <div class="addsearch-searchresults addsearch-searchresults-no-results">
    <h2>No search results with keyword <em>{{keyword}}</em></h2>
  </div>
`;