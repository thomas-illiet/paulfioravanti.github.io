# Blog

[![Build Status][Build Status image]][Build Status url]

This is the codebase for my personal blog at [`paulfioravanti.com`][].
Created with [Jekyll][].

## Install

```sh
git clone git@github.com:paulfioravanti/paulfioravanti.github.io.git
cd paulfioravanti.github.io
bundle install
```

### Development Dependencies

This app uses the following dependencies during development:

- [Sass Lint][]: make sure styling syntax conforms to
  community standards. Note that the [gem version][scss-lint] is deprecated
- [htmllint][] (via [htmllint-cli][]): make sure HTML
  syntax conforms to community standards
- [markdownlint][] (via [markdownlint-cli][]): make sure Markdown syntax
  conforms to community standards
- [HTMLProofer][]: make sure HTML rendered files are accurate and do not have
  broken links etc

Install [Node][]-based dependencies in the following way, and remember to
re-shim whatever version manager is being used for Node (I use [`asdf`][]), or
add the `bin` folder of the Node installation to the `$PATH`, otherwise
executables like `sass-lint` won't be available:

```sh
npm install -g sass-lint htmllint-cli markdownlint-cli
asdf reshim nodejs
```

HTMLProofer is a Ruby gem and so Bundler will bring it into the project.

## Usage

### Start blog server

```sh
bundle exec jekyll liveserve --drafts
```

Then, navigate to [`localhost:4000`][].

### Monitor files

This project uses [Guard][] to monitor file changes.

Start Guard with the following command:

```sh
bundle exec guard
```

## Theme

This blog currently uses the [Minimal Mistakes][] theme. Previously, it used
the [Minima][] theme, as that seemed to be the theme that worked best out of the
box with Jekyll 3.6, and was usable on [Github Pages][].

## Deployment

This blog is current deployed to [Github Pages][], but Github Pages
tend to be slow at updating their Jekyll technical stack, and they only support
a [limited set of plugins][Github Pages Supported Plugin List].

So, I'm using [Travis CI][] as both a test harness and a deployment pipeline to
bypass the limitations of the [Pages gem][], and allow Jekyll to use the latest
gems, as well as plugins not supported by Github's `safe` mode.

See my post _[Build a CI/CD pipeline for your Jekyll site][]_ for more
information about how to get a Travis-Github Pages test/deploy pipeline working.

## License

| Category |                         License                           |
|----------|-----------------------------------------------------------|
| Content  | [![License: CC-BY-4.0][license-cc-badge]][license-cc-url] |
| Code     | [![License: MIT][license-mit-badge]][license-mit-url]     |

Content in all blog posts is licensed under the
[Creative Commons Attribution 4.0 license][license-cc] (CC-BY-4.0), and all
source code in this repo, and contained within any blog posts, is licensed
under the [MIT license][license-mit].

SPDX-License-Identifier: (MIT AND CC-BY-4.0)

## Social

[![Contact][twitter-badge]][twitter-url]<br />
[![Stack Overflow][stackoverflow-badge]][stackoverflow-url]

[`asdf`]: https://github.com/asdf-vm/asdf
[Build a CI/CD pipeline for your Jekyll site]: https://paulfioravanti.com/blog/2018/10/29/build-a-ci-cd-pipeline-for-your-jekyll-site/
[Build Status image]: https://travis-ci.org/paulfioravanti/paulfioravanti.github.io.svg?branch=release
[Build Status url]: https://travis-ci.org/paulfioravanti/paulfioravanti.github.io
[Github Pages]: https://pages.github.com/
[Github Pages Supported Plugin List]: https://pages.github.com/versions/
[Guard]: https://github.com/guard/guard
[htmllint]: https://github.com/htmllint/htmllint
[htmllint-cli]: https://github.com/htmllint/htmllint-cli
[HTMLProofer]: https://github.com/gjtorikian/html-proofer
[`_includes`]: _includes
[Jekyll]: https://jekyllrb.com
[license-cc]: LICENSE-CC-BY-4.0.txt
[license-cc-badge]: https://licensebuttons.net/l/by/4.0/80x15.png
[license-cc-url]: https://creativecommons.org/licenses/by/4.0/
[license-mit]: LICENSE-MIT.txt
[license-mit-badge]: https://img.shields.io/badge/License-MIT-lightgrey.svg
[license-mit-url]: https://opensource.org/licenses/MIT
[`localhost:4000`]: http://localhost:4000/
[markdownlint]: https://github.com/DavidAnson/markdownlint
[markdownlint-cli]: https://github.com/igorshubovych/markdownlint-cli
[Minima]: https://github.com/jekyll/minima
[Minimal Mistakes]: https://github.com/mmistakes/minimal-mistakes
[Node]: https://github.com/nodejs/node
[Pages gem]: https://github.com/github/pages-gem
[`paulfioravanti.com`]: https://paulfioravanti.com
[Sass Lint]: https://github.com/sasstools/sass-lint
[scss-lint]: https://github.com/brigade/scss-lint
[stackoverflow-badge]: http://stackoverflow.com/users/flair/567863.png
[stackoverflow-url]: http://stackoverflow.com/users/567863/paul-fioravanti
[Travis CI]: https://travis-ci.org/
[twitter-badge]: https://img.shields.io/badge/contact-%40paulfioravanti-blue.svg
[twitter-url]: https://twitter.com/paulfioravanti
