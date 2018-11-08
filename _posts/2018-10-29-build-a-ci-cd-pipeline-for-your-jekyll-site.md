---
title: "Build a CI/CD pipeline for your Jekyll site"
date: 2018-10-29 21:40 +1100
tags: jekyll ruby
header:
  image: /assets/images/2018-10-28/samuel-sianipar-1082943-unsplash.jpg
  image_description: "set of industrial pipes"
  teaser: /assets/images/2018-10-28/samuel-sianipar-1082943-unsplash.jpg
  overlay_image: /assets/images/2018-10-28/samuel-sianipar-1082943-unsplash.jpg
  overlay_filter: 0.5
  caption: >
    Photo by [Samuel Sianipar](https://unsplash.com/photos/scUBcasSvbE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
    on [Unsplash](https://unsplash.com/search/photos/pipes?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
excerpt: >
  Confidently test your Jekyll site, and bypass the Github Pages gem to publish
  the site that _you_ want to production.
---

Since [setting up my Jekyll site][Setting up a Jekyll Blog], I thought that
being disciplined enough to continue writing content regularly would be the main
blog-related problem I would be dealing with.

That is, until I ran [HTMLProofer][] over the site, and it spat out a
bunch of validation issues that showed me I had a significant amount of issues
including:

- Some of the links I had in older posts were returning [`404`][HTTP 404]
  messages, even though the links had worked when I first wrote the posts...
- The sitemap generated by [`jekyll-sitemap`][] apparently contained invalid
  [`jekyll-archives`][]-generated archive page links (eg
  <https://paulfioravanti.com/tags/jekyll/>), which I thought was strange as
  they all worked in my development environment...

It turns out that:

- I had references to code on Github that referred directly to the
  [`master` branch][Jekyll master branch] of a codebase, rather than use a
  [permalink][Jekyll permalink], which would refer to a file at the time I
  accessed it (always [use permalinks when linking to code on Github][Github
  Getting Permanent Links to Files] to avoid this headache)
- The list of [supported Jekyll plugins on Github Pages][] does not include
  `jekyll-archives` (I forgot/didn't check), so although the archive links
  worked in my local development environment, when they were added to the
  locally-generated sitemap, and then an attempt made to check their
  production-side links, they all `404`-ed.

The issues that HTMLProofer brought up raised some questions around the quality
of the site code and post content:

- Links in posts could become stale, and I would never know about it, since
  I do not ever go and manually re-check all the links in every post
- I had no process that could stop me from inadvertently deploying bad code, or
  deploying plugin code that would just be ignored by [Github Pages][], leading
  to production environments not matching what I was seeing in development
- Limitations on Github Pages plugin availability mean I could also not take
  advantage of some plugins that could help with [search engine optimisation][]
  (SEO), like those that minify your HTML/CSS/JS files

I still want to keep Github Pages as the deployment platform for my blog
(at least, for now), but it just seems really limiting, so what options do I
have?  Well, thanks to [Derek Smart][] and his post
_[Supercharge GitHub Pages with Jekyll and Travis CI][]_, I learned that I
should:

- Break free of the constricting [GitHub Pages Ruby Gem][]
- Replace it with the [Jekyll gem][Jekyll], and a list of any Jekyll plugin gems
  I please
- Create a build pipeline using [Travis CI][].
- Have Travis test my code, build the site _with_ all the plugins I want, and
  then deploy the built site directly to the `master` branch of
  [my Jekyll Github repository][]

Let's see about getting this done!

{% capture fancycrave_img %}
![Fancycrave Image](/assets/images/2018-10-28/fancycrave-252351-unsplash.jpg
"gray metal part lot")
{% endcapture %}
{% capture fancycrave_credit %}
Photo by [Fancycrave](https://unsplash.com/photos/HFG53IIJ8y0?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
on [Unsplash](https://unsplash.com/search/photos/repair?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
{% endcapture %}
<figure>
  {% include stripped_markdown.html markdown=fancycrave_img %}
  <figcaption>
    {% include stripped_markdown.html markdown=fancycrave_credit %}
  </figcaption>
</figure>

## Switch to Jekyll gem

My `Gemfile` initially looked similar to the [Github specification][Github
Pages Install Jekyll using Bundler] for Jekyll sites that get published to
Github Pages:

**`Gemfile`**

```ruby
source "https://rubygems.org"
ruby "2.5.3"

group :jekyll_plugins do
  gem "github-pages", "192"
  gem "jekyll-archives", "~> 2.1"
  gem "jekyll-include-cache", "~> 0.1"
  gem "jekyll-remote-theme", "~> 0.3"
end
```

After migrating over to the Jekyll gem, it changed over to be something like:

**`Gemfile`**

```ruby
source "https://rubygems.org"
ruby "2.5.3"

gem "jekyll", "~> 3.8"

group :jekyll_plugins do
  gem "jekyll-archives", "~> 2.1"
  gem "jekyll-include-cache", "~> 0.1"
  gem "jekyll-remote-theme", "~> 0.3"
  gem "jekyll-feed", "~> 0.11"
  gem "jekyll-gist", "~> 1.5"
  # and a bunch of other jekyll plugin gems...
end
```

In order to determine what other gem plugins I should include under the
`:jekyll_plugins` group, now that the `github-pages` gem was not bringing
them in for me, I referenced the [Github Pages gem dependencies][], as well as
the `plugins` key in my site's `_config.yml` file, and then manually added any
that I knew I was using.

> For reference, here is [my blog's Gemfile at the time of this writing][blog
Gemfile].

## Set up Travis to test and deploy site

The _Supercharge GitHub Pages with Jekyll and Travis CI_ article perfectly
describes, with appropriate detail, [how to set up Github and Travis to build
and deploy a Jekyll site][Setting up Travis CI to build and deploy the site], so
I will only repeat a summary here with links to Github and Travis documentation:

- Since Github Pages
  [publishes code pushed into the `master` branch][Configuring a publishing
  source for GitHub Pages], create a new `release` branch on your repository and
  [set it to be the default branch][Github Setting the default branch]. This
  effectively makes `release` the new `master` branch for development purposes,
  and `master` will, moving forward, only ever hold the contents of the built
  Jekyll site
- [Activate your Jekyll site on Travis][Get started with Travis CI]
- [Create a personal access token][Github Creating a personal access token] for
  use with the Jekyll site
- Copy your new personal access token into an [environment variable in the
  Travis repository settings for your Jekyll site][Travis Defining Variables in
  Repository Settings] (suggested name: `GITHUB_TOKEN`)
- Create a [`.travis.yml` configuration file][Get started with Travis CI] in the
  root of your Jekyll site to tell Travis what to do

## Build Stages

What Travis should do specifically is run all the lints and tests for the Jekyll
site. Then, if everything passes, Travis should build the site, and deploy it to
the `master` branch of the site Github repository, at which point it gets
automatically published to Github Pages.

[Travis Build Stages][] enable us to do exactly that, so let's see how to do
that in configuration:

**`.travis.yml`**

```yaml
sudo: false
dist: trusty
language: ruby
cache: bundler
rvm:
  - 2.5.3
bundler_args: --without development
env:
  global:
    - NOKOGIRI_USE_SYSTEM_LIBRARIES=true
addons:
  apt:
    packages:
      - libcurl4-openssl-dev
branches:
  only:
    - release
jobs:
  include:
    - stage: Test
      before_script:
        - npm install -g sass-lint htmllint-cli markdownlint-cli
      script:
        - JEKYLL_ENV=production bundle exec jekyll build
        - htmllint _includes/stripped_markdown.html
        - markdownlint _posts _drafts _pages README.md
        - sass-lint --verbose --no-exit
        - bundle exec htmlproofer _site --allow-hash-href --assume-extension --url-ignore "/localhost/" --http-status-ignore "999"
    - stage: Github Release
      script:
        - JEKYLL_ENV=production bundle exec jekyll build
      deploy:
        provider: pages
        local-dir: ./_site
        target-branch: master
        name: Travis Deployment Bot
        skip-cleanup: true
        github-token: $GITHUB_TOKEN
        keep-history: true
        on:
          branch: release
```

If you have [used Travis to build a Ruby project][Travis Building a Ruby
Project] before, you will no doubt recognise some of the configuration entries
listed here, so I will outline some notes only about the potentially unfamiliar
parts of this file, and why they're there:

- The `NOKOGIRI_USE_SYSTEM_LIBRARIES=true` statement and use of the
  `libcurl4-openssl-dev` library are for [using HTMLProofer on Travis][]: the
  former speeds up installation of HTMLProofer, and the latter is so checks on
  external links referenced in posts can actually be performed
- We `only` ever want to test and deploy the `release` branch, so make sure we
  ignore pushes to any other branch
- Build stages [are defined][Travis How to define Build Stages] under the `jobs`
  key, and here we have two: Test and Github Release
- All the lint checks are described in my previous blog post
  _[Setting up a Jekyll Blog][]_. Check it out for more information on what
  they are linting, so you can get a better idea of whether you should be
  changing any parameters to suit your own site's needs
- The `htmlproofer` command line interface (CLI) application has
  [lots of options][HTMLProofer CLI options], but the reasons I use certain
  options are the following:
  - `--allow-hash-href` - The build will fail on the first and last post entries
    if this isn't allowed because I have pagination "previous" and "next"
    buttons that have `href="#"`, and hence considered 'links to nowhere'
  - `--assume-extension` - Jekyll 3 supports
    [extension-less permalinks][Jekyll extension-less permalinks], and my blog
    uses them, so this flag needs to be here to prevent errors
  - `--url-ignore "/localhost/"` - I have tutorial posts that have explicit link
    references to `localhost`, so I don't want them considered "proper" external
    links that need to be validated
  - `--http-status-ignore "999"` - [LinkedIn][] doesn't seem to like crawlers,
    and hence sends back [`999` errors][What is a HTTP 999 error?], even if a
    link to them is valid
- The configuration under the `deploy` key is adapted from a [Travis example
  configuration of deploying to Github Pages][Travis Github Pages Deployment],
  and [Derek Smart's example configuration][]

> For reference, here is the [`.travis.yml` file for my own Jekyll site][] at
the time of this writing.

With Travis and Github all set up, you now have a continuous integration and
deployment pipeline that can publish a Jekyll site, free of Github's
restrictions, to Github Pages! :tada:

[blog Gemfile]: https://github.com/paulfioravanti/paulfioravanti.github.io/blob/f03a48d3492db9b4d1a94d2ad909b28667f6e41f/Gemfile
[Configuring a publishing source for GitHub Pages]: https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/
[Derek Smart]: https://mcred.io/
[Derek Smart's example configuration]: https://medium.com/@mcred/supercharge-github-pages-with-jekyll-and-travis-ci-699bc0bde075#a612
[Github Getting Permanent Links to Files]: https://help.github.com/articles/getting-permanent-links-to-files/
[Github Pages Ruby Gem]: https://github.com/github/pages-gem
[Github Setting the default branch]: https://help.github.com/articles/setting-the-default-branch/
[HTMLProofer]: https://github.com/gjtorikian/html-proofer
[HTTP 404]: https://en.wikipedia.org/wiki/HTTP_404
[Get started with Travis CI]: https://docs.travis-ci.com/user/tutorial/#to-get-started-with-travis-ci
[Github Creating a personal access token]: https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/
[Github Pages]: https://pages.github.com/
[Github Pages gem dependencies]: https://github.com/github/pages-gem/blob/8b199c139982187e0c858a82dba1580daad6ccc8/lib/github-pages/dependencies.rb
[Github Pages Install Jekyll using Bundler]: https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/#step-2-install-jekyll-using-bundler
[HTMLProofer CLI options]: https://github.com/gjtorikian/html-proofer/blob/c1ada79ab7b39c29f0a8cf18555864f8add57f22/bin/htmlproofer
[Jekyll]: https://github.com/jekyll/jekyll
[`jekyll-archives`]: https://github.com/jekyll/jekyll-archives
[`jekyll-sitemap`]: https://github.com/jekyll/jekyll-sitemap
[Jekyll extension-less permalinks]: https://jekyllrb.com/docs/permalinks/#extensionless-permalinks
[Jekyll master branch]: https://github.com/jekyll/jekyll/blob/master/README.markdown
[Jekyll permalink]: https://github.com/jekyll/jekyll/blob/fbec40589d9ecdb47977035adc4aeeef1431ae0c/README.markdown
[LinkedIn]: https://www.linkedin.com/
[my Jekyll Github repository]: https://github.com/paulfioravanti/paulfioravanti.github.io
[search engine optimisation]: https://en.wikipedia.org/wiki/Search_engine_optimization
[Setting up a Jekyll Blog]: https://paulfioravanti.com/blog/2017/11/17/setting-up-a-jekyll-blog/
[Setting up Travis CI to build and deploy the site]: https://medium.com/@mcred/supercharge-github-pages-with-jekyll-and-travis-ci-699bc0bde075#14a9
[Supercharge GitHub Pages with Jekyll and Travis CI]: https://medium.com/@mcred/supercharge-github-pages-with-jekyll-and-travis-ci-699bc0bde075
[supported Jekyll plugins on Github Pages]: https://pages.github.com/versions/
[Travis Build Stages]: https://docs.travis-ci.com/user/build-stages/
[Travis Building a Ruby Project]: https://docs.travis-ci.com/user/languages/ruby/
[Travis CI]: https://travis-ci.org/
[Travis Defining Variables in Repository Settings]: https://docs.travis-ci.com/user/environment-variables#defining-variables-in-repository-settings
[Travis Deploying to Github Releases]: https://docs.travis-ci.com/user/build-stages/deploy-github-releases/
[Travis Github Pages Deployment]: https://docs.travis-ci.com/user/deployment/pages/
[Travis How to define Build Stages]: https://docs.travis-ci.com/user/build-stages/#how-to-define-build-stages
[`.travis.yml` file for my own Jekyll site]: https://github.com/paulfioravanti/paulfioravanti.github.io/blob/706bc9ca18485577eb1635556754654ada7e79c9/.travis.yml
[using HTMLProofer on Travis]: https://github.com/gjtorikian/html-proofer/wiki/Using-HTMLProofer-From-Ruby-and-Travis
[What is a HTTP 999 error?]: https://support.archive-it.org/hc/en-us/community/posts/115011883686/comments/115005523523