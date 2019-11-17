import handlebars from 'handlebars';

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