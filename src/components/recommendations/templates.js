export const RECO_FBT_TEMPLATE = `
  <div class="addsearch-recommendations">
    {{#each hits}}
     <div class="hit">
        <div class="hit-top">         
          <span class="main-image" style="background-image: url(data:image/jpeg;base64,{{custom_fields.image_link_b64}})">
            <a href="{{url}}">
              <img src="https://d20vwa69zln1wj.cloudfront.net/2c32bf3eb06b30af5f8208481aea3e8b/main/fce0634d20f8a0446e7a7314d2900786-20120101.jpg" alt="{{title}}" />
            </a>            
          </span>     
          <h3>
            <a href="{{url}}">{{title}}</a>
          </h3>
        </div>
        <div class="hit-bottom">
         <div class="highlight-content">
            {{{highlight}}}
          </div>        
          
        </div>
      </div>
    {{/each}}
  </div>
`;