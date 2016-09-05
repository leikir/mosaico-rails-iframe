(function() {

  if (!Mosaico.isCompatible()) {
    alert('Update your browser!');
    return;
  }

  var strings;

  // add a plugin to get access to $root
  window.mosaicoPlugins.push(function(viewModel) {
    window.viewModel = viewModel;
  });

  // add a plugin to handle strings
  window.mosaicoPlugins.push(function(viewModel) {
    if (strings) {
      viewModel.ut = function(key, objParam) {
        var res = strings[objParam]
        if (typeof res == 'undefined') {
          res = objParam;
        }
        return res;
      }
    }
  });

  // receive commands from other (parent) window
  var rcvmessage = function(evt) {

    console.log('rcvmessage', evt);

    var data = JSON.parse(evt.data);

    switch (data.action) {

      case 'init':
        if (data.locale) {
          strings = $.ajax('rails_mosaico/lang/mosaico-' + data.locale + '.json', {type: 'GET', async: false}).responseText;
          window.mosaicoOptions.strings = $.parseJSON(strings);
        }
        if (data.metadata && data.content) {
          window.mosaicoOptions.data = JSON.stringify({
            metadata: JSON.parse(data.metadata),
            content: JSON.parse(data.content)
          });
        }
        Mosaico.init(window.mosaicoOptions, window.mosaicoPlugins);
        break;

      case 'loadContent':
        window.mosaicoOptions.data = JSON.stringify({
          metadata: JSON.parse(data.datas.metadata),
          content: JSON.parse(data.datas.metadata)
        });
        Mosaico.init(window.mosaicoOptions, window.mosaicoPlugins);
        break;

      case 'css':
        var elems = data.elems;
        var style = data.style;

        for (var i = 0; i < elems.length; i++) {
          $(elems[i]).css(style[i]);
        }
        break;

      case 'exportReq':
        window.top.postMessage(JSON.stringify({
          type: 'exportHTML',
          htmlContent: window.viewModel.exportHTML(),
          jsonContent: window.viewModel.exportJSON(),
          jsonMetadata: window.viewModel.exportMetadata()
        }), '*');
        break;

      default:
        console.info(data.action + ' is not recognized as an action');

    }
  };

  if (window.addEventListener) {
    window.addEventListener('message', rcvmessage, false);
  } else {
    window.attachEvent('onmessage', rcvmessage);
  }

})()
