'use strict';

var promises = {};
var nextPromiseId = 0;

// jQuery helper to communicate with mosaico frame
$.fn.mosaico = function(action, datas) {
  if (!datas) {
    datas = {};
  }
  datas.action = action;

  // create a promise
  var deferred = $.Deferred();

  // choose an ID for it
  var promiseId = 0 + nextPromiseId;
  nextPromiseId++;

  // store the ID in the message data so that we get it in response
  datas.promiseId = promiseId;

  // create the promise and store it in promises
  promises[promiseId] = deferred;

  // send the message
  this.get(0).contentWindow.postMessage(JSON.stringify(datas), '*');

  // return callback-only object for the promise
  return deferred.promise();
};
