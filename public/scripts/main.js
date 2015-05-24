window.onload = function () {
  httpGet('/api/skattesatser', parseResponse);
};

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
  data = data.filter(function (element) {
    return element[1];
  });
  data = sort(data);
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

var sort = function (array) {
  var len = array.length;
  if (len < 2) { return array; }
  
  var pivot = Math.ceil(len/2);
  return merge(sort(array.slice(0, pivot)), sort(array.slice(pivot)));
};

var merge = function (left, right) {
  var result = [];
  while ((left.length > 0) && (right.length > 0)) {
    if (left[0][3] > right[0][3]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }
  
  result = result.concat(left, right);
  return result;
};