export const RECO_FBT_TEMPLATE = `
  <div class="addsearch-recommendations">
    {{#each es.hits.hits}}
      <div class="hit">
        <img class="main-image" src="{{fields.custom_fields.Img}}"></img>
        <h3>
          <a href="{{fields.url}}" target="_blank">{{fields.title}}</a>
        </h3>
        <div class="highlight">
          {{fields.custom_fields.Name}}
        </div>
      </div>
    {{/each}}
  </div>
`;