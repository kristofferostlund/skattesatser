var express = require('express');
var app = express();
var path = require('path');

var root = path.resolve();

app.use('/api/', require('./api'));
app.use(express.static(root + '/public'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  
  var port = server.address().port;
  
  console.log('App listening on port %s', host, port);
});