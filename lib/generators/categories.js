// ideas taken from hexo-generator-basic-set,
// which in place was a modification over the original hexo/hexo-generator-category
// enable-index-page added, same as in the tag generator

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
  const enableIndexPage =
    config['category-generator']['enable-index-page'] || true;

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

    // generate category index page, usually /categories/index.html
    if (enableIndexPage) {
      let categoryDir = base + categoriesDir;
      if (categoryDir[categoryDir.length - 1] !== '/') {
        categoryDir += '/';
      }

      let info = [];

      locals.categories.forEach((category) => {
        let values = {
          path: category.path,
          name: category.name,
          numPosts: category.posts.filter(function (post) {
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
        path: categoryDir,
        layout: ['category-index', 'category', 'archive', 'index'],
        data: {
          base: categoryDir,
          total: 1,
          current: 1,
          current_url: categoryDir,
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
}

exports.categories_generator = categories_generator;
