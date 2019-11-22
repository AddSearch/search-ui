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


export function regisiterHelpers() {
  handlebars.registerHelper('equals', (arg1, arg2, options) => {
    return ((arg1+'') === (arg2+'')) ? options.fn(this) : options.inverse(this);
  });
  handlebars.registerHelper('gt', (arg1, arg2, options) => {
    return arg1 > arg2 ? options.fn(this) : options.inverse(this);
  });
  handlebars.registerHelper('lt', (arg1, arg2, options) => {
    return arg1 < arg2 ? options.fn(this) : options.inverse(this);
  });
}