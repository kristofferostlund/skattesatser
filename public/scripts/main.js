function OnInput(event) {
  filterList(event.target.value);
}

function OnPropChanged(event) {
  if (event.propertyName.toLowerCase () == "value") {
    filterList(event.srcElement.value);
  }
}

window.onresize = onresizeHandler;

function filterList(query) {
  var elements = document.getElementsByClassName('county');
  
  hideInfoBox();
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

var allItems
  , hashedItems
  , infoBox
  , infoBoxWidth;

function parseResponse(data) {
  var obj = JSON.parse(data);
  var raw = obj.data;
    
  var arr = raw.split(/\n/);
  arr.shift(); // Remove first item which is unwanted
  arr = arr.map(function (element) { return element.toLowerCase().split(/[;]/); });
  
  drawInfoBox(arr.shift(), 'info-box-tbody');
  
  allItems = arr.map(function (element) { return element; }); // Copy array without binding them together
  hashedItems = arrToHash(allItems);
  
  drawObjects(arr);
}

function drawInfoBox(titles, id, table) {
  if (titles === undefined || titles.length < 1) { return; }
  if (table === undefined) { table = document.getElementById(id); }
  
  table.appendChild(createElement('tr',
  createElement('td', titles.shift(), 'info-box-td').outerHTML,
  'info-box-tr'));
  
  return drawInfoBox(titles, id, table); 
}

function insertInfoItems(items, id, table) {
  if (items === undefined || items.length < 1) { return; }
  if (table === undefined) { table = document.getElementById(id); }
  
  var i = table.children.length - items.length;
  
  insertOrUpdate(table.children[i], 1, 'td', items.shift(), 'info-box-td');
  
  return insertInfoItems(items, id, table);
}

function insertOrUpdate(parent, childPos, tag, content, className) {
  if (parent.children[childPos] === undefined) {
    parent.appendChild(createElement(tag, content, className));
  } else {
    parent.children[childPos].innerHTML = content;
  }
}

function drawObjects(data) {
  if (data === undefined || data.length < 1) return;
  
  var ul = document.getElementById('list-container');
  
  data = data.filter(function (element) { return element[1]; }); // Removes unwanted elements.
  data = data.map(function (element) { return element.map(function (x) { return x.toLowerCase(); }); });
  data = sort(data);
  
  addListEntries(data, ul);
}

function addListEntries(collection, element) {
  var i = element.children.length;
  
  if (collection === undefined || collection.length === i) { return; }
   
  element.appendChild(createListEntry(collection[i]));
  
  addListEntries(collection, element);
}

function createListEntry(collection) {
  var li = createElement('li'
  , createElement('div', collection[1], 'county').outerHTML
  + createElement('div', collection[2], 'organization').outerHTML
  + createElement('div', collection[3], 'number').outerHTML
  + createElement('div', collection[0], 'hidden').outerHTML
  , 'location-container');
  
  li.addEventListener('click', pointerEventHandler, false);
  
  return li;
}

function pointerEventHandler(event) {
  var el = getElementByClassFromPath(event, 'location-container')
    , key = getChildByClass(el, 'hidden').innerHTML
    , items = hashedItems[key];
    
  positionOrHideInfoBox(el.offsetTop + el.clientHeight, el.offsetLeft, el.clientWidth);
  
  insertInfoItems([key].concat(items), 'info-box-tbody');
}

function positionOrHideInfoBox(top, left, width) {
  if (infoBox === undefined) { infoBox = document.getElementById('info-box'); }
  
  if (infoBox.style.top == top + 'px' && infoBox.style.display == 'block') { 
    infoBox.style.display = 'none';
   } else {
     infoBox.style.display = 'block';
   }
  
  infoBox.style.top = top + 'px';
  infoBox.style.left = left + 'px';
  infoBox.style.width = width + 'px'; 
}

function hideInfoBox() {
  if (infoBox === undefined) { infoBox = document.getElementById('info-box'); }
  infoBox.style.display = 'none';
}

function onresizeHandler(event) {
  if (infoBox === undefined) { infoBox = document.getElementById('info-box'); }
  var listContainer = document.getElementById('list-container');
  
  infoBox.style.width = listContainer.clientWidth + 'px';
}

// ---- Helper methods ----


function arrToHash(arr, hash, keys) {
  if (hash === undefined) { hash = {}; }
  if (keys === undefined) { keys = []; }
  
  var i = keys.length;
  if (arr.length === i) { return hash; }
  
  keys.unshift(arr[i][0]);
  
  hash[keys[0]] = arr[i].filter(function (e) { return e !== keys[0]; });
  
  return arrToHash(arr, hash, keys);
}

function removeChildren(element) {
  if (!element.hasChildNodes()) return element;
  
  element.removeChild(element.lastChild);
  removeChildren(element);
}
function createElement(tagName, innerHTML, className) {
  var node = document.createElement(tagName);
  node.insertAdjacentHTML('afterbegin', innerHTML);
  if (className) { node.className = className; }
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

function mapElements(elements, mappedElements) {
  if (mappedElements === undefined) { mappedElements = []; }
  if (mappedElements.length === elements.length) { return mappedElements; }
  
  mappedElements.push(elements[mappedElements.length]);
  
  return mapElements(elements, mappedElements);
}

function getElementByClassFromPath(event, className, tempPath) {
  if (tempPath === undefined) { tempPath = []; }
  
  if (tempPath.length > 0 && hasClass(tempPath[0], className)) { return tempPath[0]; }
  if (tempPath.length === event.path.length) { return undefined; }
  
  tempPath.unshift(event.path[tempPath.length]);
  
  return getElementByClassFromPath(event, className, tempPath);
}

function getChildByClass(parent, className, tempChildren) {
  if (tempChildren === undefined) { tempChildren = []; }
  
  if (tempChildren.length > 0 && hasClass(tempChildren[0], className)) { return tempChildren[0]; }
  if (tempChildren.length === parent.children.length) { return undefined; }
  
  tempChildren.unshift(parent.children[tempChildren.length]);
  
  return getChildByClass(parent, className, tempChildren);
}