window.onload = function () {
  httpGet('/api/skattesatser', parseResponse);
};

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

function parseResponse(data) {
  var obj = JSON.parse(data);
  var raw = obj.data;
    
  var arr = raw.split(/\n/);
  arr.shift();
  arr = arr.map(function (element) {
    return element.split(/[;]/);
  });
  drawObjects(arr);
}

function drawObjects(data) {
  if (data === undefined || data.length < 1) return;
  
  var table = document.getElementById('mainTable');
  
  for (var i = 0; i < table.children.length; i++) {
    var element = table.children[i];
    removeChildren(element);
  }
  createTh(data.shift(), table.children[0]);
  fillTbody(data, table.children[1]);
}

function createTh(collection, thead) {
  if (collection === undefined || collection.length < 1) { return; };
  
  var tr = thead.firstChild
    ? thead.firstChild 
    : thead.appendChild(document.createElement('tr'));
  
  tr.appendChild(createElement('th', collection.shift()));
  
  createTh(collection, thead);  
}

function fillTbody(collection, element) {
  if (collection === undefined || collection.length < 1) { return; }
  
  createRow(collection.shift(), element.insertRow());
  
  fillTbody(collection, element);
}

function createRow(collection, element) {
  if (collection === undefined || collection.length < 1) { return; }
  
  element.appendChild(createElement('td', collection.shift()));
  
  createRow(collection, element);
}

// ---- Helper methods ----

function removeChildren(element) {
  if (!element.hasChildNodes()) return element;
  
  element.removeChild(element.lastChild);
  removeChildren(element);
}
function createElement(tagName, innerHTML) {
  var node = document.createElement(tagName);
  node.innerHTML = innerHTML;
  return node;
}