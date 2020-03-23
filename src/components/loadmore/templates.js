export const LOAD_MORE_TEMPLATE = `
  <div class="addsearch-loadmore">
    {{#if isLoading}}
      {{#gt totalHits 0}}
        <span>Loading more..</span>
      {{/gt}}
    {{else if hasMorePages}}
      {{#equals type "BUTTON"}}
        <button>Load more</button>
      {{/equals}}
      {{#equals type "INFINITE_SCROLL"}}
        <span class="loadmore-infinite-scroll"></span>
      {{/equals}}
    {{/if}}
  </div>
`;