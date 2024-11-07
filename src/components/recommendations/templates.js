export const RECO_FBT_TEMPLATE = `
  <div class="addsearch-recommendations">
    {{#each hits}}
     <div class="hit">
        <div class="hit-top">         
          <span class="main-image" style="background-image: url(data:image/jpeg;base64,{{images.main_b64}})">
            <a href="{{url}}">
              <img src="{{images.main}}" alt="{{title}}" />
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
