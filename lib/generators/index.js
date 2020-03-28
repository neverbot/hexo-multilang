const { categories_generator } = require('./categories');
const { archives_generator } = require('./archives');
const { tags_generator } = require('./tags');
const { indices_generator } = require('./indices');

exports.categories_generator = categories_generator;
exports.archives_generator = archives_generator;
exports.tags_generator = tags_generator;
exports.indices_generator = indices_generator;
