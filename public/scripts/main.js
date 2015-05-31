// ---- Variables

// Only used as to not have to get the same elements or data over and over again.
var allItems
  , hashedItems
  , infoBox
  , infoBoxWidth;

// ---- Events ----

function OnInput(event) {
  filterList(event.target.value);
}

function OnPropChanged(event) {
  if (event.propertyName.toLowerCase () == "value") {
    filterList(event.srcElement.value);
  }
}

window.onresize = onresizeHandler;

window.onload = function () {
  console.time('download');
  httpGet('/api/skattesatser', parseResponse);
};

// ---- Modify data ----

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

function parseResponse(data) {
  console.timeEnd('download');
  console.time('build');
  var obj = JSON.parse(data);
  var raw = obj.data;
    
  var arr = raw.split(/\n/);
  arr.shift(); // Remove first item which is unwanted
  arr = arr.map(function (element) { return element.toLowerCase().split(/[;]/); });
  
  drawInfoBox(arr.shift(), 'info-box-tbody');
  
  allItems = arr.map(function (element) { return element; }); // Copy array without binding them together
  hashedItems = arrToHash(allItems);
  
  drawObjects(arr);
  console.timeEnd('build');
}

// ---- Event handlers ----

function pointerEventHandler(event) {
  var el = getElementByClassFromParents(event, 'location-container')
    , key = getChildByClass(el, 'hidden').innerHTML
    , items = hashedItems[key];
    
  positionOrHideInfoBox(el.offsetTop + el.clientHeight, el.offsetLeft, el.clientWidth);
  
  insertInfoItems([key].concat(items), 'info-box-tbody');
}

function onresizeHandler(event) {
  if (infoBox === undefined) { infoBox = document.getElementById('info-box'); }
  var listContainer = document.getElementById('list-container');
  
  infoBox.style.width = listContainer.clientWidth + 'px';
}

// ---- Render elements ----

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
