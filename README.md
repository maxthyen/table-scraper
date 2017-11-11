![build status](https://travis-ci.org/maxthyen/table-scraper.svg)
# table-scraper
Simple utility for scraping data from html tables on a given website into a list of javascript objects.

### installation
```
npm install --save table-scraper
```

### methods

##### get(*url*)
Returns a promise that resolves to a list of tables found on the input website. HTML table rows are converted to
javascript objects

For example: suppose the website at `http://www.some-fake-url.com` consisted of the following:
```html
<html>
<head>
</head>
<body>
  <table>
    <thead>
    <tr><th>State</th><th>Capital City</th><th>Pop.<th></tr>
    </thead>
    <tbody>
    <tr><td>Minnesota</td><td>Saint Paul</td><td>3</td></tr>
    <tr><td>New York</td><td>Albany</td><td>Eight Million</td></tr>
    </tbody>
  </table>
</body>
</html>
```

The following code would result in the array displayed below:

```javascript
var scraper = require('table-scraper');
scraper
  .get('http://www.some-fake-url.com')
  .then(function(tableData) {
    /*
       tableData === 
        [ 
          [ 
            { State: 'Minnesota', 'Capital City': 'Saint Paul', 'Pop.': '3' },
            { State: 'New York', 'Capital City': 'Albany', 'Pop.': 'Eight Million' } 
          ] 
        ]
    */
  });
```

Important to note: the `tableData` returned is a ***list of lists***. So, if `some-fake-url.com`
contained three tables, the structure of the response would look like

```javascript
[
  [ /* list of data from the first table */ ],
  [ /* list of data from the second table */ ],
  [ /* list of data from the third table */ ]
]
```

If a table has NO headings (no `<th>` elements), the object keys are simply the column index:
```javascript
[
  {'0': <first column data of first row>, '1': <second column data of first row>, .... }
]
```


##### Contributing
Feedback/PRs welcome! Please include tests around any new functionality, and make sure existing tests pass:
```
npm test
```


##### Credits
The following node libraries make this utility super easy:
* [tabletojson](https://github.com/iaincollins/tabletojson)
* [x-ray](https://github.com/lapwinglabs/x-ray)
* [request](https://github.com/request/request)
