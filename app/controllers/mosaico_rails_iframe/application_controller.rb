class MosaicoRailsIframe::ApplicationController < ActionController::Base

  # TMP 'localhost', waiting to get proper generator with back_end_url and front_end_url
  def iframe
    response.headers['X-Frame-Options'] = "ALLOW-FROM #{MosaicoRailsIframe.back_end_url}" unless MosaicoRailsIframe.back_end_url.nil?
    response.headers['Content-Security-Policy'] = "frame-ancestors #{MosaicoRailsIframe.front_end_url}" unless MosaicoRailsIframe.front_end_url.nil?
  end

end
