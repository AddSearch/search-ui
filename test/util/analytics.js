var assert = require('assert');
var analytics = require('../../src/util/analytics');

describe('analytics', () => {
  describe('getDocumentPosition', () => {
    it('should return 0 if unknown', () => {
      const pageSize = 10;
      const results = {
        hits: [{ id: '1' }, { id: '2' }, { id: '3' }]
      };
      const docid = 'foo';
      const expect = 0;
      assert.equal(analytics.getDocumentPosition(pageSize, results, docid), expect);
    });

    it('first position should be 1', () => {
      const pageSize = 10;
      const results = {
        hits: [{ id: 'xx' }, { id: '2' }, { id: '3' }]
      };
      const docid = 'xx';
      const expect = 1;
      assert.equal(analytics.getDocumentPosition(pageSize, results, docid), expect);
    });

    it('should return correct position', () => {
      const pageSize = 10;
      const results = {
        hits: [{ id: '1' }, { id: '2' }, { id: '3' }]
      };
      const docid = '2';
      const expect = 2;
      assert.equal(analytics.getDocumentPosition(pageSize, results, docid), expect);
    });
  });
});
