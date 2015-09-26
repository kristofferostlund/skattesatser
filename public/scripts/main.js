// ---- Variables

// Only used as to not have to get the same elements or data over and over again.
var allItems
  , hashedItems
  , infoBox
  , infoBoxWidth
  , keys;

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
  var arr = JSON.parse(data);
  
  keys = _.map(arr[0], function (val, key) { return key; });
  
  hashedItems = {};
  _.map(arr, function (item) {
    var k = item[keys[0]];
    hashedItems[k] = item; 
  });
  
  
  drawInfoBox(keys, 'info-box-tbody');
  
  drawObjects(arr, keys);
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
  if (titles === undefined || titles.length) { return; }
  if (table === undefined) { table = document.getElementById(id); }
  
  _.map(titles, function (title) {
    table.appendChild(createElement(
      'tr'
      , createElement('td', title, 'info-box-td').outerHTML
      , 'info-box-tr'));
  });
}

function insertInfoItems(items, id) {
  // if (items === undefined || items.length < 1) { return; }
  // if (table === undefined) { table = document.getElementById(id); }
  
  // var i = table.children.length - items.length;
  
  
  var table = document.getElementById(id);
  
  _.map(items, function (item, i) {
    insertOrUpdate(table, 1, 'td', item, 'info-box-td');
  });
  
  // insertOrUpdate(table.children[i], 1, 'td', items.shift(), 'info-box-td');
}

function insertOrUpdate(parent, childPos, tag, content, className) {
  
  _.map(keys, function (key, i) {
    if (parent.children[childPos + i] === undefined) {
      parent.appendChild(createElement(tag, content[key], className));
    } else {
      parent.children[childPos + i].innerHTML = content[key];
    }
  });
}

function drawObjects(data, keys) {
  if (data === undefined || data.length < 1) return;
  
  var ul = document.getElementById('list-container');
  
  // data = sort(data);
  
  addListEntries(data, keys, ul);
}

function addListEntries(collection, keys, element) {
  _.map(collection, function (item, i) {
    element.appendChild(createListEntry(item, keys));
  });
}

function createListEntry(collection, keys) {
  
  var classes = ['hidden', 'county', 'organization', 'number'];
  
  var innerHtml = _.map(keys, function (key, i) {
    return createElement('div', collection[key], classes[i]).outerHTML
  }).join('');
  
  var li = createElement('li', innerHtml, 'location-container');
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
