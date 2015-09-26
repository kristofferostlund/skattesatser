var request = require('request');
var iconv = require('iconv-lite');
var Promise = require('bluebird');
var _ = require('lodash');

var url = 'http://www.skatteverket.se/download/18.d5e04db14b6fef2c864daf/1425041837699/Kommunala+skattesatser.csv';

exports.skattesatser = function (req, res) {
  getSkattetabell()
    .then(parseCsv)
    .then(function (data) {
      res.status(200).json(data);
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).send('Internal error.');
    })
};

/*
Requests the table of taxes from Skatteverket.
@return {Promise} (String)
*/
function getSkattetabell() {
  return new Promise(function (resolve, reject) {
    request.get({
      uri: url,
      encoding: null
    }, function (err, res, body) {
      if (err) {
        reject(err);
      } else {
        resolve(iconv.decode(body, 'iso-8859-1'));
      }
    });
  });
}

/*
Parses the csv content from Skatteverket and returns a promise of it.
@param {String} content
@return {Promise} (Object)
*/
function parseCsv(content) {
  return new Promise(function (resolve, reject) {
    var dataArr = content.split('\n');
    
    // First item to me is unwanted.
    dataArr.shift();
    
    console.log();

    // Set the keys to the first item of dataArr, 
    // and remove it from the array. 
    var keys = dataArr.shift().split(';');
    // console.log(keys);
    var dataArrObj = [];

    _.map(dataArr, function (row) {
      var obj = {};
      var sRow = row.split(';');
      _.map(keys, function (key, i) {
        obj[key] = sRow[i];
        // if (!!sRow[i]) { obj[key] = sRow[i]; }
      });
            
      if (!_.isEqual({}, obj)) { dataArrObj.push(obj); }
    });
    
    resolve(dataArrObj);
  });
}