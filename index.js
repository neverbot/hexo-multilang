'use strict';

if (
  !hexo.config ||
  !hexo.config.plugins ||
  !hexo.config.plugins['hexo-multilang']
) {
  hexo.log.info(
    'Plugins config not found in _config.yml.\n' +
      'Visit https://github.com/neverbot/hexo-multilang for more information.'
  );
  return;
}

// Helpers
var helpers = require('./lib/helpers');

hexo.extend.helper.register('get_languages', helpers.get_languages);
hexo.extend.helper.register('url_for', helpers.url_for);
