# hexo-multilang

Multi-language plugin for [Hexo](https://github.com/hexojs/hexo)

## Installation

``` bash
$ npm install hexo-multilang
```

## Config

*_config.yml*
``` yaml
plugins:
  hexo-multilang:
    languages: [en, es]
```

## Helpers

### url_for
This plugin overwrites the original hexo `url_for` helper with a new one. By default it would prepend the needed language in the url path:  `https://domain.com/some/thing/` would be `https://domain.com/<lang>/some/thing/`.
If you need the original helper, it is saved as `__hexo_multilang_url_for`.

Example:
``` html
  <a class="archive-item-link" href="<%- url_for(post.path) %>"><%= post.title %></a>
```

It also accepts a second parameter with options:
``` js
  url_for(path, { ignore : bool, language : string})
```
If ignore is present and is true, the url_for helper will behave as the original Hexo helper. This is useful to use for assets or other urls which would not be multilanguage. When you use this plugin with an already installed template, you will have to add this parameter to the links in the `<head>` of the web, like css, js, etc.

Example:
``` html
<% theme.stylesheets.forEach(url => { %>
<link rel="stylesheet" href="<%- url_for(url, { ignore: true }) %>">
<% }); %>
```

If `language` is present and is one of the languages defined as an option in the plugin configuration, the language part of the url will be forced to be this value.


## License

[MIT](https://opensource.org/licenses/MIT)
