class MosaicoRailsIframe::ApplicationController < ApplicationController

  def iframe
    unless MosaicoRailsIframe.front_end_url.nil?
      response.headers['X-Frame-Options'] = "ALLOW-FROM #{MosaicoRailsIframe.front_end_url}"
      response.headers['Content-Security-Policy'] = "frame-ancestors #{MosaicoRailsIframe.front_end_url}"
    end
  end

end
