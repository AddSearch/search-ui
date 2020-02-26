export const SEARCHFIELD_TEMPLATE = `
  <form class="addsearch-searchfield" autocomplete="off" action="?" role="search">
    <!--<span class="search-icon">&#x2315;</span>-->
    <?xml version="1.0" encoding="UTF-8"?>
    <div class="search-field-wrapper">     
      <input type="search" placeholder="{{placeholder}}" aria-label="Search field" class="{{#not icon false}}icon{{/not}}" />
    </div>
    {{#if button}}
      <button type="button" aria-label="Search button" >{{button}}</button>
    {{/if}}
  </form>
`;