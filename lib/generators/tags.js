// ideas taken from hexo-generator-basic-set,
// which in place was a modification over the original hexo/hexo-generator-tag
// enable-index-page fixed, wasn't working

'use strict';

const pagination = require('hexo-pagination');

function tags_generator(locals) {
  const config = this.config.plugins['hexo-multilang'];
  const paginationDir = config['pagination-dir'] || 'page';
  const languages = config.languages;

  if (!config['tag-generator']) {
    config['tag-generator'] = {};
  }
  const perPage = config['tag-generator']['per-page'] || 10;
  const orderBy = config['tag-generator']['order-by'] || '-date';
  const tagsDir = config['tag-generator']['tags-dir'] || 'tags';
  const enableIndexPage = config['tag-generator']['enable-index-page'] || true;

  // reduce for every language
  const pages = languages.reduce(function (result1, lang) {
    // path piece corresponding to the language
    let base = lang.toString() + '/';

    const returnedValue = locals.tags.reduce((result2, tag) => {
      if (!tag.length) {
        return result2;
      }

      let posts = tag.posts.sort(orderBy);

      // filter only the posts for the current language
      posts = posts.filter(function (post) {
        return lang === (post.lang || post.language);
      });

      const data = pagination(base + tagsDir + '/' + tag.slug, posts, {
        perPage: perPage,
        layout: ['tag', 'archive', 'index'],
        format: paginationDir + '/%d/',
        data: {
          tag: tag.name,
        },
      });

      return result2.concat(data);
    }, []);

    // generate tag index page, usually /tags/index.html
    if (enableIndexPage) {
      let tagDir = base + tagsDir;
      if (tagDir[tagDir.length - 1] !== '/') {
        tagDir += '/';
      }

      let info = [];

      locals.tags.forEach((tag) => {
        let values = {
          path: tag.path,
          name: tag.name,
          numPosts: tag.posts.filter(function (post) {
            return lang === (post.lang || post.language);
          }).length,
        };

        if (values.numPosts > 0) {
          info.push(values);
        }
      });

      // let posts = locals.posts.filter(function (post) {
      //   return lang === (post.lang || post.language);
      // });

      result1 = result1.concat({
        path: tagDir,
        layout: ['tag-index', 'tag', 'archive', 'index'],
        data: {
          base: tagDir,
          total: 1,
          current: 1,
          current_url: tagDir,
          prev: 0,
          prev_link: '',
          next: 0,
          next_link: '',
          info,
        },
      });
    }

    return result1.concat(returnedValue);
  }, []);

  return pages;
}

exports.tags_generator = tags_generator;
