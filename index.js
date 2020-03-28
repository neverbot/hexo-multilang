'use strict';

if (
  !hexo.config ||
  !hexo.config.plugins ||
  !hexo.config.plugins['hexo-multilang']
) {
  hexo.log.info(
    'hexo-multilang config not found in _config.yml.\n' +
      '      Visit https://github.com/neverbot/hexo-multilang for more information.'
  );
  return;
}

// Helpers
const helpers = require('./lib/helpers');

// mask the original url_for
const original_url_for = hexo.extend.helper.get('url_for').bind(hexo);
hexo.extend.helper.register('__hexo_multilang_url_for', original_url_for);

hexo.extend.helper.register('get_languages', helpers.get_languages);
hexo.extend.helper.register('url_for', helpers.url_for);

// Generators
const generators = require('./lib/generators');

hexo.extend.generator.register('category', generators.categories_generator);
hexo.extend.generator.register('archive', generators.archives_generator);
