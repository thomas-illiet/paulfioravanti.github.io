source "https://rubygems.org"
ruby "2.5.1"

gem "jekyll-remote-theme", "~> 0.3"

group :development do
  # Command line tool to easily handle events on file system modifications
  gem "guard", "~> 2.14"
  # Guard extension to run cli processes
  gem "guard-process", "~> 1.2"
end

group :jekyll_plugins do
  # Bootstrap dependencies for setting up and maintaining a local Jekyll
  # environment in sync with GitHub Pages
  # NOTE: Rouge 2.x does not currently support Elm syntax highlighting, and
  # that's the version that the Github Pages gem uses. When Github Pages updates
  # to Rouge 3.1.0, then all the ```haskell code markers can be changed to Elm.
  # Until then, Haskell highlighting will give close-enough results. More info:
  # https://dmitryrogozhny.com/blog/adding-elm-lexer-to-rouge
  gem "github-pages", "191"
  # A Jekyll plugin that incorporates LiveReload
  gem "hawkins", "~> 2.0"
  gem "jekyll-archives", "~> 2.1"
end
