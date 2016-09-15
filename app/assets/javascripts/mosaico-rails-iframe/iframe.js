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
        if (data.headers) {
          $.ajaxSetup({headers: data.headers});
        }
        if (data.locale) {
          strings = $.ajax('translations/' + data.locale + '.json', {type: 'GET', async: false}).responseText;
          window.mosaicoOptions.strings = $.parseJSON(strings);
        }
        if (data.metadata && data.content) {
          window.mosaicoOptions.data = JSON.stringify({
            metadata: JSON.parse(data.metadata),
            content: JSON.parse(data.content)
          });
        }
        Mosaico.init(window.mosaicoOptions, window.mosaicoPlugins);
        console.log('init finished, sending message');
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

  var mosaicoContentLoaded = function() {
    document.getElementById('previewFrameToggle').onclick = function() {
      var frame = $('#frame-container iframe');
      frame.ready(function() {
        frame.contents().find('#ko_footerBlock_1').remove();
      });
    }
  };

  if (window.addEventListener) {
    window.addEventListener('mosaicoContentLoaded', mosaicoContentLoaded, false);
  } else {
    window.attachEvent('mosaicoContentLoaded', mosaicoContentLoaded);
  }

  // observe

  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  var templateLoaded = false;
  var toObserve = document.body;

  // First we check when the template has loaded, then we watch its changes
  var observer = new MutationObserver(function(mutations, observer) {
    if (templateLoaded === false && mutations.length > 1) {
      toObserve = document.getElementById('main-wysiwyg-area');
      var replacedhead = document.getElementsByTagName('replacedhead')[0];
      var cpt = 0;
      if (replacedhead) {
        for (var i = 0; i < replacedhead.childNodes.length; i++) {
          if (replacedhead.childNodes[i].tagName === "STYLE") {
            cpt++;
          }
        }
      }

      if (cpt >= 1) {
        window.top.postMessage(JSON.stringify({
          type: 'wysiwygLoaded'
        }), '*');
        templateLoaded = true;
        window.dispatchEvent(new Event('mosaicoContentLoaded'));
      }
    }
  });

  observer.observe(toObserve, {
    subtree: true,
    attributes: false,
    characterData: true
  });

})()
