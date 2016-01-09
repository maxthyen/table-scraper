'use strict';
var request = require('request');
var xray = require('x-ray')();
var tabletojson = require('tabletojson');

module.exports.get = function get(url) {
  return new Promise(function(resolve, reject) {
    request.get(url, function(err, response, body) {
      if (err) {
        return reject(err);
      }
      if (response.statusCode >= 400) {
        return reject(new Error('The website requested returned an error!'));
      }
      return xray(body, ['table@html'])(function (err, tableHtmlList) {
        if (err) {
          return reject(err);
        }
        resolve(tableHtmlList.map(function(table) {
          return tabletojson.convert('<table>' + table + '</table>')[0];
        }));
      });
    })
  });
};

