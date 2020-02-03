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
  const docid = e.target.getAttribute('data-analytics-click') ||
    e.target.parentNode.getAttribute('data-analytics-click') ||
    e.target.parentNode.parentNode.getAttribute('data-analytics-click');
  const position = getDocumentPosition(client.getSettings().paging.pageSize, searchResults, docid);
  client.searchResultClicked(docid, position);
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