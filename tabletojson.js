var cheerio = require('cheerio');

function convert(html) {
  var jsonResponse = [];
  var $ = cheerio.load(html);

  $('table').each(function(i, table) {
    var tableAsJson = [];
    // Get column headings
    var columnHeadings = [];
    var alreadySeen = {};
    $(table).find('tr').each(function(i, row) {
      $(row).find('th').each(function(j, cell) {
        var value = $(cell).text().trim(); 
        var seen = alreadySeen[value];
        if (seen) {
          suffix = ++alreadySeen[value];
          columnHeadings[j] = value + '_' + suffix;
        } else {
          columnHeadings[j] = value;
          alreadySeen[value] = 1;
        }
      });
    });

    // Fetch each row
    $(table).find('tr').each(function(i, row) {
      var rowAsJson = {};
      $(row).find('td').each(function(j, cell) {
        if (columnHeadings[j]) {
          rowAsJson[ columnHeadings[j] ] = $(cell).text().trim();
        } else {
          rowAsJson[j] = $(cell).text().trim();
        }
      });
      
      // Skip blank rows
      if (JSON.stringify(rowAsJson) != '{}')
        tableAsJson.push(rowAsJson);
    });
    
    // Add the table to the response
    if (tableAsJson.length != 0)
      jsonResponse.push(tableAsJson);
  });
  return jsonResponse;
}
exports.convert = convert;
