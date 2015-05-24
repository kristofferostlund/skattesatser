function httpGetUnChaced(url, callback) {
  url +=
    (url.indexOf('?') ? '?' : '&')
    + (10000 * Math.random());
    
    httpGet(url, callback);
}

function httpGet(url, callback) {
  var httpReq = new XMLHttpRequest();
  httpReq.open('GET', url, true);
  
  httpReq.onload = function (e) {
    if (httpReq.readyState === 4) {
      if (httpReq.status === 200) {
        if (callback === undefined || callback === null) { return };
        callback(httpReq.responseText);
      } else {
        if (callback === undefined || callback === null) { return };
        callback(httpReq.statusText);
      }
    }
  };
  httpReq.onerror = function (e) {
    if (callback === undefined || callback === null) { return };
        callback(httpReq.statusText);
  };
  httpReq.send(null);
}