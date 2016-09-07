class MosaicoRailsIframe::InstallGenerator < Rails::Generators::Base
  
  source_root File.expand_path('../templates', __FILE__)

  def create_initializer_file
    copy_file("mosaico_rails_iframe.rb", "config/initializers/mosaico_rails_iframe.rb")
  end
end
