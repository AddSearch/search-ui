export function getPageNumbers(currentPage, totalPages) {

  // Validation: totalPages < 2, params missing, or currentPage larger than totalPages. Return null
  if (!totalPages || totalPages < 2 || !currentPage || currentPage > totalPages) {
    return null;
  }

  // Create the paging array with all pages
  var pageArray = [];
  for (var i=0; i<totalPages; i++) {
    pageArray.push(i+1);
  }

  // If no more than 9 pages, return all of them
  if (totalPages <= 9) {
    return pageArray;
  }

  // Over 9 pages, but current page under 7. Return pages 1-9
  if (totalPages > 9 && currentPage < 7) {
    return pageArray.slice(0, 9);
  }

  // Current page is the last, second last, or third last
  if (totalPages > 9  && currentPage >= totalPages -3) {
    return pageArray.slice(totalPages - 9);
  }

  // Current page somewhere in between
  var idx = pageArray.indexOf(currentPage);
  if (idx-4 >= 0 && idx+5 <= pageArray.length) {
    return pageArray.slice(idx - 4, idx + 5);
  }

  return null;
}