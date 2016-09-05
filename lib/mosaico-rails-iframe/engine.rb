module MosaicoRailsIframe
  class Engine < ::Rails::Engine
    isolate_namespace MosaicoRailsIframe

    initializer "mosaico-rails-iframe.assets.precompile" do |app|
      app.config.assets.precompile += %w(
        mosaico-rails-iframe/iframe.js
      )
    end

    initializer "mosaico-rails-iframe.rails_mosaico" do |app|
      RailsMosaico.auto_init = false
    end

  end
end
