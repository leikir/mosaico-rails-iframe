MosaicoRailsIframe::Engine.routes.draw do

  mount MosaicoRails::Engine, at: '/'

  get   '/iframe' => 'application#iframe'

end
