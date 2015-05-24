var request = require('request');
var iconv = require('iconv-lite');

var url = 'http://www.skatteverket.se/download/18.d5e04db14b6fef2c864daf/1425041837699/Kommunala+skattesatser.csv';

exports.skattesatser = function (req, res) {
  getSkattetabell(function (data) {
    res.status(200).json({ data: data });
  });
};

function getSkattetabell(callback) {
  request.get({
    uri: url,
    encoding: null
  }, function (err, res, body) {
      callback(iconv.decode(body, 'iso-8859-1'))
  });
}