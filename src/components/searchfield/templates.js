export const SEARCHFIELD_TEMPLATE = `
  <form class="addsearch-searchfield" autocomplete="off" action="?" role="search">
    <!--<span class="search-icon">&#x2315;</span>-->
    <?xml version="1.0" encoding="UTF-8"?>
    <div class="search-field-wrapper">
      <svg class="search-icon" width="20px" height="16px" viewBox="0 0 20 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <title>AddSearch</title>
          <desc></desc>
          <defs></defs>
          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Desktop-HD-Copy-11" transform="translate(-406.000000, -106.000000)" fill="#F5363B">
                  <g id="Group-9" transform="translate(390.000000, 93.000000)">
                      <g id="Page-1" transform="translate(16.000000, 13.000000)">
                          <g id="Group">
                              <path d="M9.88235294,6.07058824 C9.88235294,3.81176471 11.7176471,1.97647059 13.9764706,1.97647059 C16.2352941,1.97647059 18.0705882,3.81176471 18.0705882,6.07058824 C18.0705882,8.32941176 16.2352941,10.1647059 13.9764706,10.1647059 C11.7176471,10.1176471 9.88235294,8.28235294 9.88235294,6.07058824 M19.9058824,6.07058824 C19.9058824,2.77647059 17.2235294,0.0941176471 13.9294118,0.0941176471 C10.6823529,0.0941176471 8,2.77647059 8,6.07058824 C8,9.36470588 10.6823529,12.0470588 13.9764706,12.0470588 C14.5411765,12.0470588 15.0588235,11.9529412 15.5294118,11.8117647 L17.3176471,15.7647059 L19.0117647,14.9647059 L17.2235294,11.0117647 C18.8705882,9.92941176 19.9058824,8.14117647 19.9058824,6.07058824" id="Fill-1"></path>
                              <polygon id="Fill-11" points="4 2.96470588 2.11764706 2.96470588 2.11764706 5.12941176 0 5.12941176 0 6.96470588 2.11764706 6.96470588 2.11764706 9.12941176 4 9.12941176 4 6.96470588 6.11764706 6.96470588 6.11764706 5.12941176 4 5.12941176"></polygon>
                          </g>
                      </g>
                  </g>
              </g>
          </g>
      </svg>
      <input type="search" placeholder="{{placeholder}}" aria-label="Search field" />
    </div>
    {{#if button}}
      <button type="button" aria-label="Search button" >{{button}}</button>
    {{/if}}
  </form>
`;