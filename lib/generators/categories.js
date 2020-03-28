// ideas taken from hexo-generator-basic-set,
// which in place was a modification over the original hexo/hexo-generator-category

'use strict';

const pagination = require('hexo-pagination');

function categories_generator(locals) {
  const config = this.config.plugins['hexo-multilang'];
  const paginationDir = config['pagination-dir'] || 'category';
  const languages = config.languages;

  if (!config['category-generator']) {
    config['category-generator'] = {};
  }
  const perPage = config['category-generator']['per-page'] || 10;
  const orderBy = config['category-generator']['order-by'] || '-date';
  const categoriesDir =
    config['category-generator']['categories-dir'] || 'categories';

  // reduce for every language
  return languages.reduce(function (result1, lang) {
    // path piece corresponding to the language
    let base = lang.toString() + '/';

    // reduce for every category
    let returnedValue = locals.categories.reduce((result2, category) => {
      if (!category.length) {
        return result2;
      }

      let posts = category.posts.sort(orderBy);

      // filter only the posts for the current language
      posts = posts.filter(function (post) {
        return lang === (post.lang || post.language);
      });

      const data = pagination(
        base + categoriesDir + '/' + category.slug,
        posts,
        {
          perPage,
          layout: ['category', 'archive', 'index'],
          format: paginationDir + '/%d/',
          data: {
            category: category.name,
          },
        }
      );

      return result2.concat(data);
    }, []);

    return result1.concat(returnedValue);
  }, []);
}

exports.categories_generator = categories_generator;
