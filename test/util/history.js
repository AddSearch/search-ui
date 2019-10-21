import { expect, assert } from 'chai';
import { getQueryParam, queryParamsToObject, objectToQueryParams } from '../../src/util/history';

describe('getQueryParam', () => {

  it('return null if no query parameters exist', () => {
    const url = 'https://addsearch.com/test';
    expect(getQueryParam(url, 'foo')).to.eql(null);
  });

  it('return empty string if query parameter exist without a value', () => {
    const url = 'https://addsearch.com/test?foo';
    expect(getQueryParam(url, 'foo')).to.eql('');
  });

  it('return the query parameter value', () => {
    const url = 'https://addsearch.com/test?a=b&foo=bar&faz';
    expect(getQueryParam(url, 'foo')).to.eql('bar');
  });
});


describe('queryParamsToObject', () => {

  it('return an empty object if no query parameters exist', () => {
    const url = 'https://addsearch.com/test';
    expect(queryParamsToObject(url)).to.eql({});
  });

  it('return an empty object if no query parameters exist but a question mark is in the URL', () => {
    const url = 'https://addsearch.com/test?';
    expect(queryParamsToObject(url)).to.eql({});
  });

  it('return a single query parameter', () => {
    const url = 'https://addsearch.com/test?foo=bar';
    const expectedValue = {
      foo: 'bar'
    };
    expect(queryParamsToObject(url)).to.deep.equal(expectedValue);
  });

  it('return a bunch of query parameter', () => {
    const url = 'https://addsearch.com/test?foo=bar&a=b&pää=böö';
    const expectedValue = {
      foo: 'bar',
      pää: 'böö',
      a: 'b'
    };
    expect(queryParamsToObject(url)).to.deep.equal(expectedValue);
  });
});


describe('objectToQueryParams', () => {

  it('return an empty string if no query parameters exist', () => {
    expect(objectToQueryParams({})).to.eql('');
  });

  it('return a single query parameter', () => {
    const obj = {
      foo: 'bar'
    };
    const url = 'foo=bar';
    expect(objectToQueryParams(obj)).to.deep.equal(url);
  });

  it('return a bunch of query parameters', () => {
    const obj = {
      foo: 'bar',
      a: 'föö',
      z: null,
      g: ''
    };
    const url = 'foo=bar&a=föö&z=&g=';
    expect(objectToQueryParams(obj)).to.deep.equal(url);
  });
});
