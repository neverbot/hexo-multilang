# hexo-multilang

![npm](https://img.shields.io/npm/dt/hexo-multilang)
![npm](https://img.shields.io/npm/dw/hexo-multilang)
[![GitHub license](https://img.shields.io/github/license/neverbot/hexo-multilang)](https://github.com/neverbot/hexo-multilang/blob/master/license.md)
![npm](https://img.shields.io/npm/v/hexo-multilang)

Multi-language plugin for [Hexo](https://github.com/hexojs/hexo)

Based in [`hexo-generator-basic-set`](https://github.com/zyzyz/hexo-generator-basic-set) and [`hexo-generator-i18n`](https://github.com/Jamling/hexo-generator-i18n).

## Installation

``` bash
$ npm install hexo-multilang
```

Remove any of these packages if they are installed:
``` bash
$ npm remove hexo-generator-archive hexo-generator-category hexo-generator-index hexo-generator-tag hexo-generator-basic-set hexo-generator-i18n
```

In Hexo the list of plugins installed will be taken from the `package.json` file, and will be loaded and executed in the order which they are found in. Any change or update to this file, locally or in a continuous integration environment, might be able to set its contents in alphabetical order, potentially changing your expected results. As the generators (`archive`, `index`, `tag`, `category`) are called by the same name in every plugin, the last plugin which uses them will have precedence.

So, until Hexo has a better way of handling the loading and execution of plugins, my recommendation is to uninstall any other plugin which includes the same generators or helpers, like the four default ones (the `npm remove` you can see above these lines), or the plugins `hexo-multilang` is based on, like `hexo-generator-basic-set` and `hexo-generator-i18n`.

## How to test the plugin in an easy way

This plugin provides functions which can help you build a multilang theme. The fastest way to see what can be achieved would be using an already compatible theme, so you could compare code and include the functionalities you would need in your own page. I've modified a version of the [Chic Theme](https://github.com/Siricee/hexo-theme-Chic) to make it compatible with `hexo-multilang`, which you can found in [hexo-chic-theme-multilang](https://github.com/neverbot/hexo-theme-chic-multilang). Take a look to its installation instructions if you want to test it in a local Hexo Blog, so you can see if this is what you are looking for.

## Config

*_config.yml*
``` yaml
plugins:
  hexo-multilang:
    languages: [en, es]  

    pagination-dir: page

    index-generator:
      per-page: 5
      order-by: -date
      index-dir: 
      default-lang: en

    archive-generator:
      per-page: 10
      order-by: -date
      archives-dir: archives
      yearly: true
      monthly: true
      daily: false

    category-generator:
      per-page: 10
      order-by: -date
      categories-dir: categories
      enable-index-page: true

    tag-generator:
      per-page: 5
      order-by: -date
      tags-dir: tags
      enable-index-page: true
```

## Post creator modified

When you create a new blog post, it will be created (base on the corresponding scaffold) in every language set in the `_config.yml` file. i.e:

```
$ hexo new 'Something something'
INFO  Posts created in: en, es
INFO  Created: /<your path>/source/_posts/es/1900/01/01/something-something.md
INFO  Created: /<your path>/source/_posts/en/1900/01/01/something-something.md
```

## Helpers included

### url_for

This plugin overwrites the original hexo `url_for` helper with a new one. By default it would prepend the needed language in the url path:  `https://domain.com/some/thing/` would be `https://domain.com/<lang>/some/thing/`.
If you need the original helper, it is saved as `__hexo_multilang_url_for`.

``` html
<a href="<%- url_for(post.path) %>"><%= post.title %></a>
```

It also accepts a second parameter with options:
``` js
url_for(path, { ignore : bool, language : string })
```
If `ignore` is present and is `true`, the `url_for` helper will behave as the original Hexo helper. This is useful to use for assets or other urls which would not be multilanguage. When you use this plugin with an already installed template, you will have to add this parameter to the links in the `<head>` of the web, like css, js, etc.

``` html
<% theme.stylesheets.forEach(url => { %>
<link rel="stylesheet" href="<%- url_for(url, { ignore: true }) %>">
<% }); %>
```

If `language` is present and is one of the languages defined as an option in the plugin configuration, the language part of the url will be forced to be this value.

## License

[MIT](https://opensource.org/licenses/MIT)
