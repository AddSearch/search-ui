var assert = require('assert');
var paging = require('../../src/util/pagination');


describe('pagination', () => {
  describe('getPageNumbers', () => {

    it('should return null if less than 2 pages', () => {
      const currentPage = 1;
      const totalPages = 1;
      const expect = null;
      assert.equal(paging.getPageNumbers(currentPage, totalPages), expect);
    });

    it('should return null if currentPage > totalPages', () => {
      const currentPage = 10;
      const totalPages = 1;
      const expect = null;
      assert.equal(paging.getPageNumbers(currentPage, totalPages), expect);
    });

    it('should return pages 1-2 if 2 pages', () => {
      const currentPage = 1;
      const totalPages = 2;
      const expect = [1,2];
      assert.deepEqual(paging.getPageNumbers(currentPage, totalPages), expect);
    });

    it('should return pages 1-5 if 5 pages', () => {
      const currentPage = 1;
      const totalPages = 5;
      const expect = [1,2,3,4,5];
      assert.deepEqual(paging.getPageNumbers(currentPage, totalPages), expect);
    });

    it('should return pages 1-9 if 9 pages', () => {
      const currentPage = 9;
      const totalPages = 9;
      const expect = [1,2,3,4,5,6,7,8,9];
      assert.deepEqual(paging.getPageNumbers(currentPage, totalPages), expect);
    });

    it('should return pages 1-9 if 15 pages and current page 6', () => {
      const currentPage = 6;
      const totalPages = 15;
      const expect = [1,2,3,4,5,6,7,8,9];
      assert.deepEqual(paging.getPageNumbers(currentPage, totalPages), expect);
    });

    it('should return pages 3-11 if 15 pages and current page 7', () => {
      const currentPage = 7;
      const totalPages = 15;
      const expect = [3,4,5,6,7,8,9,10,11];
      assert.deepEqual(paging.getPageNumbers(currentPage, totalPages), expect);
    });

    it('should return pages 3-11 if 11 pages and current page 7', () => {
      const currentPage = 7;
      const totalPages = 11;
      const expect = [3,4,5,6,7,8,9,10,11];
      assert.deepEqual(paging.getPageNumbers(currentPage, totalPages), expect);
    });

    it('should return pages 7-15 if 15 pages and current page 14', () => {
      const currentPage = 14;
      const totalPages = 15;
      const expect = [7,8,9,10,11,12,13,14,15];
      assert.deepEqual(paging.getPageNumbers(currentPage, totalPages), expect);
    });

    it('should return pages 7-15 if 15 pages and current page 11-15', () => {
      const totalPages = 15;
      const expect = [7,8,9,10,11,12,13,14,15];

      var currentPage = 15;
      assert.deepEqual(paging.getPageNumbers(currentPage, totalPages), expect);
      currentPage = 14;
      assert.deepEqual(paging.getPageNumbers(currentPage, totalPages), expect);
      currentPage = 13;
      assert.deepEqual(paging.getPageNumbers(currentPage, totalPages), expect);
      currentPage = 12;
      assert.deepEqual(paging.getPageNumbers(currentPage, totalPages), expect);
      currentPage = 11;
      assert.deepEqual(paging.getPageNumbers(currentPage, totalPages), expect);
    });

    it('should return pages 7-15 if 15 pages and current page 15', () => {
      const currentPage = 15;
      const totalPages = 15;
      const expect = [7,8,9,10,11,12,13,14,15];
      assert.deepEqual(paging.getPageNumbers(currentPage, totalPages), expect);
    });

    it('should return pages 96-104 if 5000 pages and current page 100', () => {
      const currentPage = 100;
      const totalPages = 5000;
      const expect = [96,97,98,99,100,101,102,103,104];
      assert.deepEqual(paging.getPageNumbers(currentPage, totalPages), expect);
    });

    it('should return pages 4991-4999 if 5000 pages and current page 4999', () => {
      const currentPage = 4999;
      const totalPages = 5000;
      const expect = [4992,4993,4994,4995,4996,4997,4998,4999,5000];
      assert.deepEqual(paging.getPageNumbers(currentPage, totalPages), expect);
    });

    it('should return pages 1-9 if 5000 pages and current page 1', () => {
      const currentPage = 1;
      const totalPages = 5000;
      const expect = [1,2,3,4,5,6,7,8,9];
      assert.deepEqual(paging.getPageNumbers(currentPage, totalPages), expect);
    });

  });
});
