// ideas taken from hexo-generator-basic-set,
// which in place was a modification over the original hexo/hexo-archive-category

'use strict';

const pagination = require('hexo-pagination');

const fmtNum = (num) => {
  return num < 10 ? '0' + num : num;
};

function archives_generator(locals) {
  const config = this.config.plugins['hexo-multilang'];
  const paginationDir = config['pagination-dir'] || 'page';
  const languages = config.languages;

  if (!config['archive-generator']) {
    config['archive-generator'] = {};
  }
  const perPage = config['archive-generator']['per-page'] || 10;
  const orderBy = config['archive-generator']['order-by'] || '-date';
  let archivesDir = config['archive-generator']['archives-dir'] || '';

  const yearly = config['archive-generator'].yearly || true;
  const monthly = config['archive-generator'].monthly || true;
  const daily = config['archive-generator'].daily || false;

  const Query = this.model('Post').Query;
  const allPosts = locals.posts.sort(orderBy);

  let result = [];

  if (!allPosts.length) {
    return;
  }

  if (archivesDir && archivesDir[archivesDir.length - 1] !== '/') {
    archivesDir += '/';
  }

  function generate(path, posts, options) {
    options = options || {};
    options.archive = true;

    result = result.concat(
      pagination(path, posts, {
        perPage: perPage,
        layout: ['archive', 'index'],
        format: paginationDir + '/%d/',
        data: options,
      })
    );
  }

  languages.forEach(function (lang) {
    let base = lang.toString() + '/' + archivesDir;
    let filteredPosts = allPosts.filter(function (post) {
      return lang === (post.lang || post.language);
    });

    generate(base, filteredPosts);

    if (!yearly) {
      return result;
    }

    let posts = {};

    // organize posts by date
    filteredPosts.forEach((post) => {
      const date = post.date;
      const year = date.year();
      const month = date.month() + 1; // month is started from 0

      if (!Object.prototype.hasOwnProperty.call(posts, year)) {
        // 13 arrays. The first array is for posts in this year
        // and the other arrays is for posts in this month
        posts[year] = [[], [], [], [], [], [], [], [], [], [], [], [], []];
      }

      posts[year][0].push(post);
      posts[year][month].push(post);

      // daily
      if (daily) {
        const day = date.date();
        if (!Object.prototype.hasOwnProperty.call(posts[year][month], 'day')) {
          posts[year][month].day = {};
        }

        (
          posts[year][month].day[day] || (posts[year][month].day[day] = [])
        ).push(post);
      }
    });

    const years = Object.keys(posts);
    let year, data, month, monthData, url;

    // yearly
    for (let i = 0, len = years.length; i < len; i++) {
      year = +years[i];
      data = posts[year];
      url = base + year + '/';
      if (!data[0].length) {
        continue;
      }

      generate(url, new Query(data[0]), { year: year });

      if (!monthly && !daily) {
        continue;
      }

      // monthly
      for (month = 1; month <= 12; month++) {
        monthData = data[month];
        if (!monthData.length) {
          continue;
        }

        if (monthly) {
          generate(url + fmtNum(month) + '/', new Query(monthData), {
            year: year,
            month: month,
          });
        }

        if (!daily) {
          continue;
        }

        // daily
        for (let day = 1; day <= 31; day++) {
          const dayData = monthData.day[day];
          if (!dayData || !dayData.length) {
            continue;
          }

          generate(
            url + fmtNum(month) + '/' + fmtNum(day) + '/',
            new Query(dayData),
            {
              year: year,
              month: month,
              day: day,
            }
          );
        }
      }
    }
  });

  return result;
}

exports.archives_generator = archives_generator;
