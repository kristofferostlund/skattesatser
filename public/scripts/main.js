var url = 'http://www.skatteverket.se/download/18.d5e04db14b6fef2c864daf/1425041837699/Kommunala+skattesatser.csv';

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

httpGet('/api/skattesatser', function (data) {
  console.log(data);
});