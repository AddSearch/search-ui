'use strict';

var searchbar = require('./searchbar');
var searchresults = require('./searchresults');


var searchui = function(client) {

  this.client = client;
  this.searchResultsConf = null;


  /**
   * Add a search bar
   */
  this.searchBar = function(conf) {
    var self = this;
    var cb = function(results) {
      self.resultsCallback(results, self)
    }

    searchbar(this.client, cb, conf);
  }


  /**
   * Add a search bar
   */
  this.searchResults = function(conf) {
    this.searchResultsConf = conf;
  }



  /**
   * Callback function when the search returns
   */
  this.resultsCallback = function(results, scope) {
    if (scope.searchResultsConf) {
      searchresults(results, scope.searchResultsConf);
    }
  }
}

module.exports = searchui;