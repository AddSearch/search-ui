export const ANSWER_GENERATOR_TEMPLATE = `
  {{#if generatorResponse}}
    <div class="addsearch-answer-generator">
      <div class="adds-question">{{question}}</div>
      <div class="adds-answer" data-answer="{{generatorResponse}}">
        <span class="adds-answer-text"></span>
        <span class="adds-answer-caret">|</span>
      </div>
      
      {{#if relatedResults}}
        <div class="adds-related-results hidden">
          <div class="adds-header">Related Results (in development)</div>
          <div class="adds-hits-wrapper">
            {{#each relatedResults}}
              <div class="adds-hit">
                <span class="adds-image-wrapper" {{#if images.main}} style="background-image: url(data:image/jpeg;base64,{{images.main_b64}})"{{/if}}>
                  {{#if images.main}}<img src="{{images.main}}"{{/if}} alt="{{title}}" />
                </span>
                <div class="adds-content-wrapper">
                  <div class="adds-title">{{title}}</div>
                  <div class="adds-description">{{meta_description}}</div>
                  <a href="{{url}}" target="_blank">{{url}}</a>
                </div>
              </div>
            {{/each}}
          </div>
        </div>
      {{/if}}
      
    </div>
  {{/if}}
`;
