function OnInput(event) {
  filterList(event.target.value);
}

function OnPropChanged(event) {
  if (event.propertyName.toLowerCase () == "value") {
    filterList(event.srcElement.value);
  }
}

function filterList(query) {
  var elements = document.getElementsByClassName('county');
  
  mapChildren(elements, function (element) {
    if (hasQuery(mapChildElementsInnerHtml(element.parentElement), query)) {
      element.parentElement.style.display = '';
    } else {
      element.parentElement.style.display = 'none';
    }
    
  });
}

function mapChildren(elements, callback, mappedArray) {
  if (mappedArray === undefined) { mappedArray = []; }
  var i = mappedArray.length;
  if (elements.length === i) { return mappedArray; }
  
  mappedArray.push(elements[i]);
  
  if (callback !== undefined) { callback(mappedArray[i]); }
  
  return mapChildren(elements, callback, mappedArray);
}

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
  var titles;
  if (data === undefined || data.length < 1) return;
  
  var ul = document.getElementById('list-container');
  
  titles = data.shift();
  
  data = data.filter(function (element) { return element[1]; }); // Removes unwanted elements.
  data = data.map(function (element) { return element.map(function (x) { return x.toLowerCase(); }); });
  data = sort(data);
  
  addListEntries(data, titles, ul);
  console.log(ul.children.length);
}

function addListEntries(collection, titles, element) {
  var i = element.children.length;
  
  if (collection === undefined || collection.length === i) { return; }
   
  element.appendChild(createListEntry(collection[i], titles));
  
  addListEntries(collection, titles,  element);
}

function createListEntry(collection, titles) {
  return createElement('li'
    , createElement('div', collection[1], 'county').outerHTML
    + createElement('div', collection[2], 'organization').outerHTML
    + createElement('div', collection[3], 'number').outerHTML);
}

// ---- Helper methods ----

function removeChildren(element) {
  if (!element.hasChildNodes()) return element;
  
  element.removeChild(element.lastChild);
  removeChildren(element);
}
function createElement(tagName, innerHTML, className) {
  var node = document.createElement(tagName);
  node.insertAdjacentHTML('afterbegin', innerHTML);
  node.className = className;
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

function hasClass(element, className) {
  return element.className && new RegExp('(^|\\s)' + className + '(\\s|$)').test(element.className);
}

function hasQuery(argStr, query) {
  if (/[.]/.test(query)) { query = query.replace(/[.]/, '[.]'); }
  return new RegExp(query, 'i').test(argStr);
}

function mapChildElementsInnerHtml(element, mappedArr) {
  if (mappedArr === undefined) { mappedArr = []; }
  if (mappedArr.length === element.children.length) { return mappedArr; }
  
  mappedArr.push(element.children[mappedArr.length].innerHTML);
  
  return mapChildElementsInnerHtml(element, mappedArr);
}