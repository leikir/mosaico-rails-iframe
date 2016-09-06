$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "mosaico-rails-iframe/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "mosaico-rails-iframe"
  s.version     = MosaicoRailsIframe::VERSION
  s.authors     = ["leikir"]
  s.email       = ["web@leikir.io"]
  s.homepage    = ""
  s.summary     = "Summary of MosaicoRailsIframe."
  s.description = "Description of MosaicoRailsIframe."
  s.license     = "MIT"

  s.files = Dir["{app,config,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]

  s.add_dependency "mosaico-rails"

end
