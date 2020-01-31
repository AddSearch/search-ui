/**
 * Add click trackers to search result links
 */
export function addClickTrackers(client, linkArray, searchResultArray) {
  if (linkArray && linkArray.length > 0) {
    for (let i=0; i<linkArray.length; i++) {

      // Enter pressed when link is active
      linkArray[i].addEventListener('keyup', (e) => {
        if (e.keyCode === 13) {
          onLinkClick(e, client, searchResultArray);
        }
      });

      // Link clicked with mouse / tapped on mobile
      linkArray[i].addEventListener('pointerdown', (e) => {
        // Ignore right clicks
        if (e.button && e.buttons && e.button === e.buttons) {
          return;
        }
        onLinkClick(e, client, searchResultArray);
      });

    }
  }
}


function onLinkClick(e, client, searchResultData) {
  const docid = e.target.getAttribute('data-analytics-click');
  const position = getDocumentPosition(client.getSettings().paging.pageSize, searchResultData, docid);
  client.searchResultClicked(docid, position);
}


export function getDocumentPosition(pageSize, results, docid) {
  if (results && results.hits) {
    // Calculate offset if the user is not on results page 1
    const currentPage = results.page || 1;
    const offset = (currentPage - 1) * pageSize;

    // Find document's position in results array
    for (let i=0; i<results.hits.length; i++) {
      if (results.hits[i].id === docid) {
        return offset + (i+1);
      }
    }
  }
  return 0;
}