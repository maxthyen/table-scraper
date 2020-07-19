'use strict';
var request = require('request');
var xray = require('x-ray')();
var tabletojson = require('tabletojson').Tabletojson;

module.exports.get = function get(url) {
  return new Promise(function(resolve, reject) {
    request.get(url, function(err, response, body) {
      if (err) {
        return reject(err);
      }
      if (response.statusCode >= 400) {
        return reject(new Error('The website requested returned an error!'));
      }
      xray(body, ['table@html'])(function (conversionError, tableHtmlList) {
        if (conversionError) {
          return reject(conversionError);
        }
        resolve(tableHtmlList.map(function(table) {
          // xray returns the html inside each table tag, and tabletojson
          // expects a valid html table, so we need to re-wrap the table.
          // Returning the first element in the converted array because
          // we should only ever be parsing one table at a time within this map.
          return tabletojson.convert('<table>' + table + '</table>')[0];
        }));
      });
    })
  });
};

