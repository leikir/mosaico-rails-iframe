(function() {

  if (!Mosaico.isCompatible()) {
    alert('Update your browser!');
    return;
  }

  var removePreviewFooter = false;

  // add a plugin to get access to $root
  window.mosaicoPlugins.push(function(viewModel) {
    window.viewModel = viewModel;
  });

  // add a plugin to handle strings
  window.mosaicoPlugins.push(function(viewModel) {
    if (window.mosaicoOptions.strings) {
      viewModel.ut = function(category, key) {
        var categoryStrings = window.mosaicoOptions.strings[category];
        if (typeof categoryStrings == 'undefined') {
          if (window.mosaicoOptions.debug) {
            console.error("no translations found for category", category);
          }
          return key;
        }
        var result = categoryStrings[key];
        if (typeof result == 'undefined') {
          if (window.mosaicoOptions.debug) {
            console.error("no translations found for key", key, "in category", category);
          }
          return key;
        }
        return result;
      }
    }
  });

  // receive commands from other (parent) window
  var rcvmessage = function(evt) {

    console.log('rcvmessage', evt);

    var data = JSON.parse(evt.data);

    switch (data.action) {
      case 'init':
        if (data.removePreviewFooter) {
          removePreviewFooter = data.removePreviewFooter;
        }
        if (data.headers) {
          $.ajaxSetup({headers: data.headers});
        }
        if (data.locale) {
          var stringsJSON = $.ajax('translations/' + data.locale + '.json', {type: 'GET', async: false}).responseText;
          window.mosaicoOptions.strings = $.parseJSON(stringsJSON);
        }
        if (data.metadata && data.content) {
          window.mosaicoOptions.data = JSON.stringify({
            metadata: JSON.parse(data.metadata),
            content: JSON.parse(data.content)
          });
        }
        if (data.plugins) {

          for (var i in data.plugins) {
            (function(c) {
              window.mosaicoPlugins.push(function(viewModel) {
                eval(c);
              });

            })(data.plugins[i]);
          }
        }
        if (data.options) {
          $.extend(true, window.mosaicoOptions, data.options);
        }

        Mosaico.init(window.mosaicoOptions, window.mosaicoPlugins);
        break;

      case 'css':
        var elems = data.elems;
        var style = data.style;

        for (var i = 0; i < elems.length; i++) {
          $(elems[i]).css(style[i]);
        }
        break;

      case 'class':
        var elems = data.elems;
        var classes = data.class;
        var action = data.actions;

        for (var i = 0; i < elems.length; i++) {
          if (action[i] == 'add') {
            $(elems[i]).addClass(classes[i]);
          } else if (action[i] == 'remove') {
            $(elems[i]).removeClass(classes[i]);
          }
        }
        break;

      case 'exportReq':

        var html = window.viewModel.exportHTML();
        html = html.replace(/ (data-mce-style)(="[^"]*")/gm, ' style$2');
        window.top.postMessage(JSON.stringify({
          type: 'exportHTML',
          htmlContent: html,
          jsonContent: window.viewModel.exportJSON(),
          jsonMetadata: window.viewModel.exportMetadata(),
          timestamp: data.timestamp
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
      $('.mce-tinymce.mce-tinymce-inline.mce-container.mce-panel.mce-floatpanel').hide();
      var frame = $('#frame-container iframe');
      frame.ready(function() {
        if (removePreviewFooter) {
          frame.contents().find('table[id^="ko_footerBlock"]').remove();
        }
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
