// ideas taken from hexo-generator-i18n
// didn't work well for me, had to improve it

'use strict';

function get_languages() {
  let languages = Array.isArray(this.config.plugins['hexo-multilang'].languages)
    ? this.config.plugins['hexo-multilang'].languages.slice(0)
    : [this.config.plugins['hexo-multilang'].languages];
  let position;
  if (!Array.isArray(languages)) {
    languages = [languages];
  }
  if ((position = languages.indexOf('default') !== -1))
    languages = languages.splice(position, 1);
  return languages;
}

function url_for(path, options = {}) {
  let root = this.config.root || '';
  let lang = options.language
    ? options.language
    : this.page.lang
    ? this.page.lang
    : this.page.language;
  let url = this.__hexo_multilang_url_for(path);

  // ignore multilang transformation, useful for assets, etc
  if (options.ignore) {
    return url;
  }

  if (url === '#' || url.startsWith('//')) {
    return url;
  }

  if (!url.startsWith('/')) {
    return url;
    // url = '/' + url;
  }

  let relativeUrl = url.replace(root, '/');
  let pathLang = relativeUrl.split('/')[1];
  let languages = this.get_languages();

  if (languages.indexOf(pathLang) !== -1) {
    return url;
  }

  if (lang) {
    url = root + lang + relativeUrl;
  }

  return url;
}

exports.get_languages = get_languages;
exports.url_for = url_for;
