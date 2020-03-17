// Don't send analytics events more often than defined here. I.e. search-as-you-type implementation should fire
// an analytics event after a pause this long occures
const SEARCH_ANALYTICS_DEBOUNCE_TIME = 2500;

/**
 * Custom function for external analytics collection
 */
let externalAnalyticsCallback = null;
export function setExternalAnalyticsCallback(cb) {
  externalAnalyticsCallback = cb;
}
function callExternalAnalyticsCallback(data) {
  if (externalAnalyticsCallback) {
    externalAnalyticsCallback(data);
  }
}

/**
 * Send info on search results to analytics
 */
let sendSearchStatsTimeout = null;
let previousKeyword = null;
let searchStatsSent = false; // If a search result is clicked within the SEARCH_ANALYTICS_DEBOUNCE_TIME, send search stats from onLinkClick
export function sendSearchStats(client, keyword, numberOfResults) {
  const action = 'search';

  if (sendSearchStatsTimeout) {
    clearTimeout(sendSearchStatsTimeout);
  }

  sendSearchStatsTimeout = setTimeout(() => {
    // Don't send if keyword not changed (i.e. filters changed)
    if (keyword !== previousKeyword) {
      client.sendStatsEvent(action, keyword, {numberOfResults});
      callExternalAnalyticsCallback({action, keyword, numberOfResults});
      previousKeyword = keyword;
      searchStatsSent = true;
    }
  }, SEARCH_ANALYTICS_DEBOUNCE_TIME);
}


/**
 * Add click trackers to search result links
 */
export function addClickTrackers(client, linkArray, searchResults) {
  if (linkArray && linkArray.length > 0) {
    for (let i=0; i<linkArray.length; i++) {

      // Enter pressed when link is active
      linkArray[i].addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
          onLinkClick(e, client, searchResults);
        }
      });

      // Link clicked with mouse / tapped on mobile
      linkArray[i].addEventListener('pointerdown', (e) => {
        // Ignore right clicks
        if (e.button && e.buttons && e.button === e.buttons) {
          return;
        }
        onLinkClick(e, client, searchResults);
      });

    }
  }
}


function onLinkClick(e, client, searchResults) {
  // Support data attributes in parent and grandparent elements
  const documentId = e.target.getAttribute('data-analytics-click') ||
    e.target.parentNode.getAttribute('data-analytics-click') ||
    e.target.parentNode.parentNode.getAttribute('data-analytics-click');
  const position = getDocumentPosition(client.getSettings().paging.pageSize, searchResults, documentId);
  const keyword = client.getSettings().keyword;

  client.sendStatsEvent('click', keyword, {documentId, position});
  callExternalAnalyticsCallback({action: 'click', keyword, documentId, position});

  // Search stats were not sent within SEARCH_ANALYTICS_DEBOUNCE_TIME
  if (searchStatsSent === false) {
    const numberOfResults = searchResults ? searchResults.total_hits : 0;
    client.sendStatsEvent('search', keyword, {numberOfResults});
    callExternalAnalyticsCallback({action: 'search', keyword, numberOfResults});
  }
}


export function getDocumentPosition(pageSize, searchResults, docid) {

  if (searchResults && searchResults.hits) {
    // Calculate offset if the user is not on results page 1
    const currentPage = searchResults.page || 1;
    const offset = (currentPage - 1) * pageSize;

    // Find document's position in results array
    for (let i=0; i<searchResults.hits.length; i++) {
      if (searchResults.hits[i].id === docid) {
        return offset + (i+1);
      }
    }
  }
  return 0;
}