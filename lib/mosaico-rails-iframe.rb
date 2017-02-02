require "mosaico-rails-iframe/engine"
require "mosaico-rails"

module MosaicoRailsIframe
  mattr_accessor :front_end_url

  self.front_end_url = nil
end
