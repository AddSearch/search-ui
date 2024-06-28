export const ANSWER_GENERATOR_TEMPLATE = `
  {{#if generatorResponse}}
    <div class="addsearch-answer-generator">
      <div class="adds-question">{{question}}</div>
      <div class="adds-answer" data-answer="{{generatorResponse}}">
        <span class="adds-answer-text"></span>
        <span class="adds-answer-caret">|</span>
      </div>
    </div>
  {{/if}}
`;
