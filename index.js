'use strict';

const { magenta } = require('chalk');
const tildify = require('tildify');

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

// mask the original url_for, it will be used _inside_ this plugin
const original_url_for = hexo.extend.helper.get('url_for').bind(hexo);
hexo.extend.helper.register('__hexo_multilang_url_for', original_url_for);

hexo.extend.helper.register('get_languages', helpers.get_languages);
hexo.extend.helper.register('url_for', helpers.url_for);

// Generators
const generators = require('./lib/generators');

hexo.extend.generator.register('category', generators.categories_generator);
hexo.extend.generator.register('archive', generators.archives_generator);
hexo.extend.generator.register('tag', generators.tags_generator);
hexo.extend.generator.register('index', generators.indices_generator);

// Creators

// mask the original post creator
const _original_post_creator = hexo.post.create.bind(hexo.post);

hexo.post.create = async (data, replace) => {
  if (!Array.isArray(hexo.config.plugins['hexo-multilang'].languages)) {
    hexo.log.info(
      'hexo-multilang languages not found in _config.yml.\n' +
        '      Visit https://github.com/neverbot/hexo-multilang for more information.'
    );
    return;
  }

  let results = [];

  for (let lang of hexo.config.plugins['hexo-multilang'].languages) {
    data['language'] = lang;
    let res = await _original_post_creator(data, replace);
    results.push(res);
  }

  hexo.log.info(
    'Posts created in: %s',
    magenta(hexo.config.plugins['hexo-multilang'].languages.join(', '))
  );

  for (let i in results) {
    if (i != 0) hexo.log.info('Created: %s', magenta(tildify(results[i].path)));
  }

  return results[0];
};
