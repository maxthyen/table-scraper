describe('table-scraper', function() {
  'use strict';

  var fs = require('fs');
  var expect = require('chai').expect;
  var nock = require('nock');
  var scraper = require('../index');

  var singleTablePage;
  var multipleTablePage;
  var duplicateHeaders;
  var fakeUrl;
  var tableData;

  before(function() {
    singleTablePage = fs.readFileSync(__dirname + '/singleTablePage.html', 'utf8');
    multipleTablePage = fs.readFileSync(__dirname + '/multiTablePage.html', 'utf8');
    duplicateHeaders = fs.readFileSync(__dirname + '/duplicateHeaders.html', 'utf8');
    fakeUrl = 'https://www.url.com';
  });

  beforeEach(function() {
    // Matches the fake data found in the mock html pages
    tableData = [
      {State: 'Minnesota', 'Capitol City': 'Saint Paul', 'Pop.': '3'},
      {State: 'New York', 'Capitol City': 'Albany', 'Pop.': 'Eight Million'}
    ];
    nock(fakeUrl).get('/single').reply(200, singleTablePage);
    nock(fakeUrl).get('/multi').reply(200, multipleTablePage);
    nock(fakeUrl).get('/duplicate').reply(200, duplicateHeaders);
    nock(fakeUrl).get('/404').reply(404);
  });

  it('can scrape a page with a single table', function(done) {
    scraper
        .get(fakeUrl + '/single')
        .then(function(response) {
          expect(response).to.deep.equal([tableData]);
          done();
        })
        .catch(function(err) { done(err); });
  });

  it('can scrape a page with multiple tables', function(done) {
    scraper
        .get(fakeUrl + '/multi')
        .then(function(response) {
          expect(response).to.deep.equal([
            tableData,
            tableData,
            // no headers for this table; default to indices
            [
              {'0': 'a', '1': 'b', '2': 'c'},
              {'0': '1', '1': '2', '2': '3'}
            ]
          ]);
          done();
        })
        .catch(function(err) { done(err); });
  });

  it('can handle duplicate headers', function(done) {
    scraper
        .get(fakeUrl + '/duplicate')
        .then(function(response) {
          expect(response).to.deep.equal([
            [
              {currency: 'usd/btc', x: '123', x_2: '800'},
              {currency: 'usd/eth', x: '100', x_2: '1.5'},
            ],
          ]);
          done();
        })
        .catch(function(err) { done(err); });
  });

  it('fails gracefully', function(done) {
    scraper
        .get(fakeUrl + '/404')
        .then(function(response) {
          // the .get should've returned an error, should not get into this block
          done(new Error('should have thrown an error!'));
        })
        .catch(function(err) {
          expect(err.message).to.equal('The website requested returned an error!');
          done();
        })
        // second catch block necessary to catch any errors from previous block
        .catch(function(err) {
          // should never reach here
          done(new Error(err));
        });
  });
});
