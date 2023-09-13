"use strict"
module.exports = require("./src/index.js").default;
module.exports.AUTOCOMPLETE_TYPE = require("./src/components/autocomplete/index.js").AUTOCOMPLETE_TYPE;
module.exports.FILTER_TYPE = require("./src/components/filters/index.js").FILTER_TYPE;
module.exports.SORTBY_TYPE = require("./src/components/sortby/index.js").SORTBY_TYPE;
module.exports.LOAD_MORE_TYPE = require("./src/components/loadmore/index.js").LOAD_MORE_TYPE;
module.exports.RECOMMENDATION_TYPE = require("./src/components/recommendations/index.js").RECOMMENDATION_TYPE;

if (typeof window !== 'undefined' && typeof window.Handlebars === 'undefined') {
  window.Handlebars = require('handlebars/runtime');
}
