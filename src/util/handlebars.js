import handlebars from 'handlebars';

export function defaultCategorySelectionFunction(hit, categoryAliases) {
  const categories = hit.categories || [] ;

  let category = '';
  let position = 1;

  do {
    // categories[0] is the domain
    category = categories.length > position ? categories[position] : '';

    // Remove the index prefix (e.g. 2x)
    category = category.replace(/^[0-9]+[x]{1}/, '');
    position++;

  } while (category.length < 3 && categories.length > position);

  // Possible alias
  if (categoryAliases && categoryAliases[category]) {
    return categoryAliases[category];
  }

  return category.replace(/[-_]+/g, ' ');
}


let currencyFormatter = null;
export function registerDefaultHelpers() {
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
}

export function registerHelper(helperName, helperFunction) {
  handlebars.registerHelper(helperName, helperFunction);
}