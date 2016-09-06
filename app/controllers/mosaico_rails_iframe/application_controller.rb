class MosaicoRailsIframe::ApplicationController < ActionController::Base

  # TMP 'localhost', waiting to get proper generator with back_end_url and front_end_url
  def iframe
    response.headers['X-Frame-Options'] = 'ALLOW-FROM http://localhost:4000'
    response.headers['Content-Security-Policy'] = 'frame-ancestors http://localhost:4000'
  end

end
