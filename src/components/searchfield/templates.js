export const SEARCHFIELD_TEMPLATE = `
<div class="addsearch-searchfield-container">
  <form class="addsearch-searchfield" autocomplete="off" action="?" role="search">
    <div class="search-field-wrapper">     
      <input type="search" placeholder="{{placeholder}}" aria-label="Search field" class="{{#not icon false}}icon{{/not}}" />
    </div>
    {{#if button}}
      <button type="button" aria-label="Search button" >{{button}}</button>
    {{/if}}
  </form>
</div>
`;