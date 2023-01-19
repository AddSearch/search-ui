/* Handlebars */

function registerHelper(helperName, helperFunction) {
  Handlebars.registerHelper(helperName, helperFunction);
}

function defaultCategorySelectionFunction(hit, categoryAliases) {
  const categories = hit.categories || [] ;

  let category = '';
  let position = 1;

  do {
    // categories[0] is the domain
    category = categories.length > position ? categories[position] : '';

    // Remove the index prefix (e.g. 2x)
    category = category.replace(/^[0-9]+[x]{1}/, '').toLowerCase();
    position++;

  } while (category.length < 3 && categories.length > position);

  // Possible alias
  if (categoryAliases && categoryAliases[category]) {
    return categoryAliases[category];
  }

  return category.replace(/[-_]+/g, ' ');
}


let currencyFormatter = null;

registerHelper('equals', (arg1, arg2, options) => {
  return ((arg1+'') === (arg2+'')) ? options.fn(this) : options.inverse(this);
});

registerHelper('not', (arg1, arg2, options) => {
  return ((arg1+'') !== (arg2+'')) ? options.fn(this) : options.inverse(this);
});

registerHelper('gt', (arg1, arg2, options) => {
  return arg1 > arg2 ? options.fn(this) : options.inverse(this);
});

registerHelper('lt', (arg1, arg2, options) => {
  return arg1 < arg2 ? options.fn(this) : options.inverse(this);
});

registerHelper('or', (arg1, arg2, options) => {
  return arg1 ||  arg2 ? options.fn(this) : options.inverse(this);
});

registerHelper('selectCategory', (categories) => {
  defaultCategorySelectionFunction(categories);
});

registerHelper('snipFacet', function(facet) {
  return facet.substring(2);
});

registerHelper('removeTrailingQueriesFromUrl', (url) => {
  if (url) {
    return url.replace(/\?.*$/, '')
  }
});

registerHelper('validateOpenState', function(value) {
  return searchui.reduxStore.getState().filters.openedHierarchicalFacetGroups.indexOf(value) === -1;
});

registerHelper('formatPrice', (price, locale, currency) => {
  if (typeof price == 'undefined' || typeof price != 'number' || !locale || !currency) {
    return '';
  }

  // Create formatter
  try {
    if (window.Intl && !currencyFormatter) {
      currencyFormatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2
      });
    }

    // Return price
    if (currencyFormatter) {
      return currencyFormatter.format(price);
    }
  }
  catch(err) {}

  return (price/100) + ' ' + currency;
});