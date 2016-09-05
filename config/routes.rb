MosaicoRailsIframe::Engine.routes.draw do

  mount RailsMosaico::Engine, at: '/'

  get   '/iframe' => 'application#iframe'

end
