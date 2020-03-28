// ideas taken from hexo-generator-basic-set,
// which in place was a modification over the original hexo/hexo-index-category

'use strict';

const pagination = require('hexo-pagination');

function fixNavigation(posts) {
  var array = posts.toArray();
  var length = array.length;
  array.forEach(function (currPost, i) {
    currPost.prev = i == 0 ? null : array[i - 1];
    currPost.next = i == length - 1 ? null : array[i + 1];
  });
}

function indices_generator(locals) {
  const config = this.config.plugins['hexo-multilang'];
  const paginationDir = config['pagination-dir'] || 'page';
  const languages = config.languages;

  if (!config['index-generator']) {
    config['index-generator'] = {};
  }
  const perPage = config['index-generator']['per-page'] || 10;
  const orderBy = config['index-generator']['order-by'] || '-date';
  const indexDir = config['index-generator']['index-dir'] || '';
  const defaultLang = config['index-generator']['default-lang'] || '';

  // reduce for every language
  return languages.reduce(function (result, lang) {
    // path piece corresponding to the language
    let base = lang.toString() + '/';

    let posts = locals.posts.sort(orderBy);

    // filter only the posts for the current language
    posts = posts.filter(function (post) {
      return lang === (post.lang || post.language);
    });

    fixNavigation(posts);

    const data = pagination(base + indexDir, posts, {
      perPage: perPage,
      layout: ['index', 'archive'],
      format: paginationDir + '/%d/',
      data: {
        __index: true,
      },
    });

    // generate default indices without the language prefix
    if (defaultLang === lang) {
      result = result.concat(
        pagination(indexDir, posts, {
          perPage: perPage,
          layout: ['index', 'archive'],
          format: paginationDir + '/%d/',
          data: {
            __index: true,
          },
        })
      );
    }

    return result.concat(data);
  }, []);
}

exports.indices_generator = indices_generator;
