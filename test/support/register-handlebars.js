const fs = require('fs');
const handlebars = require('handlebars');

require.extensions['.handlebars'] = (module, filename) => {
  module.exports = handlebars.compile(fs.readFileSync(filename, 'utf8'));
};
