export const RECO_FBT_TEMPLATE = `
  <div class="addsearch-recommendations">
    {{#each es.hits.hits}}
      <div class="hit">
        
        <span class="main-image" style="background-image: {{getImg (lookup ../images @index)}}">
        </span>

        <h3>
          <a href="{{fields.url}}" target="_blank">{{fields.title}}</a>
        </h3>

        <div class="highlight">
          {{fields.main_content}}
        </div>
      </div>
    {{/each}}
  </div>
`;