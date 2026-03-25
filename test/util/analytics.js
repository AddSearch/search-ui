var assert = require('assert');
var analytics = require('../../src/util/analytics');

function withImmediateTimers(cb) {
  const originalSetTimeout = global.setTimeout;
  const originalClearTimeout = global.clearTimeout;

  global.setTimeout = (fn) => {
    fn();
    return 1;
  };
  global.clearTimeout = () => {};

  try {
    cb();
  } finally {
    global.setTimeout = originalSetTimeout;
    global.clearTimeout = originalClearTimeout;
  }
}

describe('analytics', () => {
  beforeEach(() => {
    analytics.setCollectAnalytics(true);
    analytics.setExternalAnalyticsCallback(null);
    analytics.setAnalyticsKeywordInterceptor(null);
  });

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

  describe('analyticsKeywordInterceptor', () => {
    it('should modify keyword for search analytics and callback payload', () => {
      const sentEvents = [];
      const callbackEvents = [];
      analytics.setExternalAnalyticsCallback((data) => callbackEvents.push(data));
      analytics.setAnalyticsKeywordInterceptor(({ keyword }) => `masked:${keyword.toLowerCase()}`);

      const client = {
        sendStatsEvent: (action, keyword, payload) => sentEvents.push({ action, keyword, payload })
      };

      withImmediateTimers(() => {
        analytics.sendSearchStats(client, 'My Secret Query', 12, 42);
      });

      assert.equal(sentEvents.length, 1);
      assert.equal(sentEvents[0].action, 'search');
      assert.equal(sentEvents[0].keyword, 'masked:my secret query');
      assert.equal(callbackEvents.length, 1);
      assert.equal(callbackEvents[0].keyword, 'masked:my secret query');
    });

    it('should fall back to original keyword if interceptor returns non-string', () => {
      const sentEvents = [];
      analytics.setAnalyticsKeywordInterceptor(() => null);

      const client = {
        sendStatsEvent: (action, keyword, payload) => sentEvents.push({ action, keyword, payload })
      };

      withImmediateTimers(() => {
        analytics.sendSearchStats(client, 'Original', 3, 10);
      });

      assert.equal(sentEvents.length, 1);
      assert.equal(sentEvents[0].keyword, 'Original');
    });

    it('should fall back to original keyword if interceptor throws', () => {
      const sentEvents = [];
      analytics.setAnalyticsKeywordInterceptor(() => {
        throw new Error('boom');
      });

      const client = {
        sendStatsEvent: (action, keyword, payload) => sentEvents.push({ action, keyword, payload })
      };

      withImmediateTimers(() => {
        analytics.sendSearchStats(client, 'Fallback', 4, 11);
      });

      assert.equal(sentEvents.length, 1);
      assert.equal(sentEvents[0].keyword, 'Fallback');
    });
  });
});
