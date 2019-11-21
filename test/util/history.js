import assert from 'assert';
import { getQueryParam, queryParamsToObject, objectToQueryParams } from '../../src/util/history';

describe('history', () => {

  describe('getQueryParam', () => {

    it('return null if no query parameters exist', () => {
      const url = 'https://addsearch.com/test';
      assert.equal(getQueryParam(url, 'foo'), null);
    });

    it('return empty string if query parameter exist without a value', () => {
      const url = 'https://addsearch.com/test?foo';
      assert.equal(getQueryParam(url, 'foo'), '');
    });

    it('return the query parameter value', () => {
      const url = 'https://addsearch.com/test?a=b&foo=bar&faz';
      assert.equal(getQueryParam(url, 'foo'), 'bar');
    });
  });


  describe('queryParamsToObject', () => {

    it('return an empty object if no query parameters exist', () => {
      const url = 'https://addsearch.com/test';
      assert.deepEqual(queryParamsToObject(url), {});
    });

    it('return an empty object if no query parameters exist but a question mark is in the URL', () => {
      const url = 'https://addsearch.com/test?';
      assert.deepEqual(queryParamsToObject(url), {});
    });

    it('return a single query parameter', () => {
      const url = 'https://addsearch.com/test?foo=bar';
      const expectedValue = {
        foo: 'bar'
      };
      assert.deepEqual(queryParamsToObject(url), expectedValue);
    });

    it('return a bunch of query parameter', () => {
      const url = 'https://addsearch.com/test?foo=bar&a=b&bar=b%C3%B6';
      const expectedValue = {
        foo: 'bar',
        bar: 'bö',
        a: 'b'
      };
      assert.deepEqual(queryParamsToObject(url), expectedValue);
    });
  });


  describe('objectToQueryParams', () => {

    it('return an empty string if no query parameters exist', () => {
      assert.equal(objectToQueryParams({}), '');
    });

    it('return a single query parameter', () => {
      const obj = {
        foo: 'bar'
      };
      const url = 'foo=bar';
      assert.equal(objectToQueryParams(obj), url);
    });

    it('return a bunch of query parameters', () => {
      const obj = {
        foo: 'bar',
        a: 'fö',
        z: null,
        g: ''
      };
      const url = 'foo=bar&a=f%C3%B6&z=&g=';
      assert.deepEqual(objectToQueryParams(obj), url);
    });
  })
});
