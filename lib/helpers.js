// ideas taken from hexo-generator-i18n
// didn't work with multi language, had to improve it

function get_languages() {
  var languages = Array.isArray(this.config.plugins['hexo-multilang'].languages)
    ? this.config.plugins['hexo-multilang'].languages.slice(0)
    : [this.config.plugins['hexo-multilang'].languages];
  var position;
  if (!Array.isArray(languages)) {
    languages = [languages];
  }
  if ((position = languages.indexOf('default') !== -1))
    languages = languages.splice(position, 1);
  return languages;
}

function url_for(path, options = {}) {
  var root = this.config.root || '';
  var lang = options.language ? options.language : this.page.lang;
  var url = this.__hexo_multilang_url_for(path);

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

  var relativeUrl = url.replace(root, '/');
  var pathLang = relativeUrl.split('/')[1];
  var languages = this.get_languages();

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
