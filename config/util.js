'use strict';

var path = require('path');

var sortBy = (chunks) => {
  if (!chunks.length) {
    return 'none';
  }
  return (a, b) => {
    return chunks.indexOf(a.names[0]) > chunks.indexOf(b.names[0]) ? 1 : -1;
  };
};

module.exports = {
  sortBy: sortBy,
  root: path.resolve(__dirname, '../')
};
