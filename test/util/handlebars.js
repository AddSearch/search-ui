import assert from 'assert';
import { defaultCategorySelectionFunction } from '../../src/util/handlebars';

describe('handlebars', () => {
  describe('defaultCategorySelectionFunction', () => {
    it('return empty String if no categories', () => {
      const hit = {};
      const expect = '';
      assert.equal(defaultCategorySelectionFunction(hit), expect);
    });

    it('return empty string if just one category', () => {
      const hit = {
        categories: ['foo']
      };
      const expect = '';
      assert.equal(defaultCategorySelectionFunction(hit), expect);
    });

    it('return category', () => {
      const hit = {
        categories: ['foo', 'bar']
      };
      const expect = 'bar';
      assert.equal(defaultCategorySelectionFunction(hit), expect);
    });

    it('return category and remove index prefix', () => {
      const hit = {
        categories: ['0xfoo', '1xbaz']
      };
      const expect = 'baz';
      assert.equal(defaultCategorySelectionFunction(hit), expect);
    });

    it('return category even if short', () => {
      const hit = {
        categories: ['0xfoo', '1xb']
      };
      const expect = 'b';
      assert.equal(defaultCategorySelectionFunction(hit), expect);
    });

    it('return longer category if the first one is short', () => {
      const hit = {
        categories: ['0xfoo', '1xb', '2xbar']
      };
      const expect = 'bar';
      assert.equal(defaultCategorySelectionFunction(hit), expect);
    });

    it('return longer category if first few ones are short', () => {
      const hit = {
        categories: ['0xfoo', '1xb', '2xa', '3xr', '4xcat', '5xbar']
      };
      const expect = 'cat';
      assert.equal(defaultCategorySelectionFunction(hit), expect);
    });

    it('replace special characters with space', () => {
      const hit = {
        categories: ['0xfoo', '1xfoo-bar_baz--_ok']
      };
      const expect = 'foo bar baz ok';
      assert.equal(defaultCategorySelectionFunction(hit), expect);
    });

    it('return category alias', () => {
      const hit = {
        categories: ['0xfoo', '1xfoo-bar']
      };
      const aliases = {
        'foo-bar': 'baz'
      };
      const expect = 'baz';
      assert.equal(defaultCategorySelectionFunction(hit, aliases), expect);
    });
  });
});
