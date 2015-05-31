function mapChildren(elements, callback, mappedArray) {
  if (mappedArray === undefined) { mappedArray = []; }
  var i = mappedArray.length;
  if (elements.length === i) { return mappedArray; }
  
  mappedArray.push(elements[i]);
  
  if (callback !== undefined) { callback(mappedArray[i]); }
  
  return mapChildren(elements, callback, mappedArray);
}

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

function getElementByClassFromParents(event, className, element) {
  if (element === undefined) { element = event.srcElement || event.target; }
  if (element.className === className) { return element; } 
  
  element = element.parentNode;
  
  return getElementByClassFromParents(event, className, element);
}

function getChildByClass(parent, className, tempChildren) {
  if (tempChildren === undefined) { tempChildren = []; }
  
  if (tempChildren.length > 0 && hasClass(tempChildren[0], className)) { return tempChildren[0]; }
  if (tempChildren.length === parent.children.length) { return undefined; }
  
  tempChildren.unshift(parent.children[tempChildren.length]);
  
  return getChildByClass(parent, className, tempChildren);
}