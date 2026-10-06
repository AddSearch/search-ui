import assert from 'assert';
import AddSearchUI from '../../src/index';
import { AUTOCOMPLETE_TYPE } from '../../src/components/autocomplete';

const COMBOBOX_ATTRIBUTES = [
  'role',
  'aria-autocomplete',
  'aria-expanded',
  'aria-controls',
  'aria-activedescendant'
];

const KEYCODE_ARROW_DOWN = 40;
const KEYCODE_ENTER = 13;

const SUGGESTIONS_SOURCE = { type: AUTOCOMPLETE_TYPE.SUGGESTIONS };
const CUSTOM_FIELDS_SOURCE = { type: AUTOCOMPLETE_TYPE.CUSTOM_FIELDS, field: 'custom_fields.city' };
const SEARCH_SOURCE = { type: AUTOCOMPLETE_TYPE.SEARCH, jsonKey: 'hits' };

function createClient() {
  const stubs = {
    getSettings: () => ({
      paging: { page: 1, pageSize: 10, sortBy: 'relevance', sortOrder: 'desc' }
    }),
    suggestions: (keyword, callback) =>
      callback({ suggestions: [{ value: keyword + ' one' }, { value: keyword + ' two' }] }),
    autocomplete: (field, keyword, callback) =>
      callback({ autocomplete: [{ value: keyword + ' city' }] })
  };
  return new Proxy(stubs, {
    get: (target, prop) => (prop in target ? target[prop] : prop === 'then' ? undefined : () => {})
  });
}

function createUI(settings) {
  return new AddSearchUI(createClient(), settings);
}

function getInput(containerId) {
  return document.querySelector('#' + containerId + ' input');
}

function typeKeyword(field, keyword) {
  field.value = keyword;
  field.oninput({ target: field });
}

function focusField(field) {
  field.onfocus({ target: field });
}

function pressArrowDown(field) {
  field.onkeyup({ keyCode: KEYCODE_ARROW_DOWN, target: field });
}

function pressEnter(field) {
  field.onkeypress({ keyCode: KEYCODE_ENTER, target: field });
}

function assertNoComboboxAttributes(field) {
  COMBOBOX_ATTRIBUTES.forEach((attribute) =>
    assert.strictEqual(field.hasAttribute(attribute), false, attribute + ' should not be set')
  );
}

function assertCombobox(field, ariaControls) {
  assert.strictEqual(field.getAttribute('role'), 'combobox');
  assert.strictEqual(field.getAttribute('aria-autocomplete'), 'list');
  assert.strictEqual(field.getAttribute('aria-controls'), ariaControls);
}

describe('searchField ARIA', () => {
  beforeEach(() => {
    document.body.innerHTML =
      '<div id="searchfield"></div><div id="searchfield2"></div><div id="autocomplete"></div>';
  });

  describe('without autocomplete', () => {
    it('default template has no combobox attributes after render, focus, typing and search', () => {
      const ui = createUI();
      ui.searchField({ containerId: 'searchfield' });
      const field = getInput('searchfield');
      assertNoComboboxAttributes(field);

      focusField(field);
      typeKeyword(field, 'water');
      pressEnter(field);
      assertNoComboboxAttributes(field);
    });

    it('custom template never gets aria-expanded', () => {
      const ui = createUI({ matchAllQuery: true });
      ui.searchField({
        containerId: 'searchfield',
        searchAsYouType: false,
        template:
          '<form role="search" autocomplete="off" action="?"><input class="Searchfield__input" type="search" /></form>'
      });
      ui.searchResults({ containerId: 'autocomplete' });
      const field = getInput('searchfield');
      assert.strictEqual(field.hasAttribute('aria-expanded'), false);

      focusField(field);
      typeKeyword(field, 'water');
      pressEnter(field);
      assert.strictEqual(field.hasAttribute('aria-expanded'), false);
    });

    it('autocomplete with a missing container does not make the field a combobox', () => {
      const ui = createUI();
      ui.searchField({ containerId: 'searchfield', autofocus: false });
      ui.autocomplete({ containerId: 'missing', sources: [SUGGESTIONS_SOURCE] });
      assertNoComboboxAttributes(getInput('searchfield'));
    });

    it('autocomplete with only a search source does not make the field a combobox', () => {
      const ui = createUI();
      ui.searchField({ containerId: 'searchfield', autofocus: false });
      ui.autocomplete({ containerId: 'autocomplete', sources: [SEARCH_SOURCE] });
      const field = getInput('searchfield');
      typeKeyword(field, 'water');
      assertNoComboboxAttributes(field);
    });
  });

  describe('with autocomplete', () => {
    it('searchField created first becomes a combobox once autocomplete is attached', () => {
      const ui = createUI();
      ui.searchField({ containerId: 'searchfield', autofocus: false });
      const field = getInput('searchfield');
      assertNoComboboxAttributes(field);

      ui.autocomplete({ containerId: 'autocomplete', sources: [SUGGESTIONS_SOURCE] });
      assertCombobox(field, 'autocomplete');
      assert.strictEqual(field.getAttribute('aria-expanded'), 'false');

      typeKeyword(field, 'water');
      assert.strictEqual(field.getAttribute('aria-expanded'), 'true');

      ui.hideAutocomplete();
      assert.strictEqual(field.getAttribute('aria-expanded'), 'false');
    });

    it('searchField created after autocomplete is a combobox straight after render', () => {
      const ui = createUI();
      ui.autocomplete({ containerId: 'autocomplete', sources: [SUGGESTIONS_SOURCE] });
      ui.searchField({ containerId: 'searchfield', autofocus: false });
      const field = getInput('searchfield');
      assertCombobox(field, 'autocomplete');
      assert.strictEqual(field.getAttribute('aria-expanded'), 'false');
    });

    it('mixed suggestions and search sources make the field a combobox', () => {
      const ui = createUI();
      ui.searchField({ containerId: 'searchfield', autofocus: false });
      ui.autocomplete({
        containerId: 'autocomplete',
        sources: [SUGGESTIONS_SOURCE, SEARCH_SOURCE]
      });
      assertCombobox(getInput('searchfield'), 'autocomplete');
    });

    it('aria-controls lists every combobox autocomplete container once', () => {
      document.body.insertAdjacentHTML('beforeend', '<div id="autocomplete2"></div>');
      const ui = createUI();
      ui.searchField({ containerId: 'searchfield', autofocus: false });
      ui.autocomplete({ containerId: 'autocomplete', sources: [SUGGESTIONS_SOURCE] });
      ui.autocomplete({ containerId: 'autocomplete', sources: [SUGGESTIONS_SOURCE] });
      ui.autocomplete({ containerId: 'autocomplete2', sources: [CUSTOM_FIELDS_SOURCE] });
      assertCombobox(getInput('searchfield'), 'autocomplete autocomplete2');
    });

    it('custom searchField template without role gets role="combobox"', () => {
      const ui = createUI();
      ui.searchField({
        containerId: 'searchfield',
        autofocus: false,
        template: '<input type="search" />'
      });
      ui.autocomplete({ containerId: 'autocomplete', sources: [SUGGESTIONS_SOURCE] });
      const field = getInput('searchfield');
      assertCombobox(field, 'autocomplete');

      typeKeyword(field, 'water');
      assert.strictEqual(field.getAttribute('aria-expanded'), 'true');
    });
  });

  describe('ignoreAutocomplete', () => {
    function assertIgnoredFieldStaysPlain(createComponents) {
      const ui = createUI();
      createComponents(ui);
      const ignoredField = getInput('searchfield2');
      const otherField = getInput('searchfield');
      assertNoComboboxAttributes(ignoredField);
      assertCombobox(otherField, 'autocomplete');

      typeKeyword(otherField, 'water');
      pressArrowDown(otherField);
      focusField(ignoredField);
      typeKeyword(ignoredField, 'pump');
      pressEnter(ignoredField);
      assertNoComboboxAttributes(ignoredField);
    }

    it('field is never a combobox when created before autocomplete', () => {
      assertIgnoredFieldStaysPlain((ui) => {
        ui.searchField({ containerId: 'searchfield', autofocus: false });
        ui.searchField({ containerId: 'searchfield2', autofocus: false, ignoreAutocomplete: true });
        ui.autocomplete({ containerId: 'autocomplete', sources: [SUGGESTIONS_SOURCE] });
      });
    });

    it('field is never a combobox when created after autocomplete', () => {
      assertIgnoredFieldStaysPlain((ui) => {
        ui.autocomplete({ containerId: 'autocomplete', sources: [SUGGESTIONS_SOURCE] });
        ui.searchField({ containerId: 'searchfield', autofocus: false });
        ui.searchField({ containerId: 'searchfield2', autofocus: false, ignoreAutocomplete: true });
      });
    });
  });

  describe('selectorToBind', () => {
    beforeEach(() => {
      document.body.innerHTML =
        '<form><input type="search" class="site-search" role="searchbox" /></form><div id="autocomplete"></div>';
    });

    it('leaves the bound input untouched without autocomplete', () => {
      const ui = createUI();
      ui.searchField({ selectorToBind: '.site-search', autofocus: false });
      const field = document.querySelector('.site-search');

      focusField(field);
      typeKeyword(field, 'water');
      assert.strictEqual(field.getAttribute('role'), 'searchbox');
      COMBOBOX_ATTRIBUTES.filter((attribute) => attribute !== 'role').forEach((attribute) =>
        assert.strictEqual(field.hasAttribute(attribute), false, attribute + ' should not be set')
      );
    });

    it('updates aria-expanded when the popup opens, without an arrow key press', () => {
      const ui = createUI();
      ui.searchField({ selectorToBind: '.site-search', autofocus: false });
      ui.autocomplete({ containerId: 'autocomplete', sources: [SUGGESTIONS_SOURCE] });
      const field = document.querySelector('.site-search');
      assertCombobox(field, 'autocomplete');
      assert.strictEqual(field.getAttribute('aria-expanded'), 'false');

      typeKeyword(field, 'water');
      assert.strictEqual(field.getAttribute('aria-expanded'), 'true');
    });
  });

  describe('aria-activedescendant', () => {
    const CUSTOM_AUTOCOMPLETE_TEMPLATE =
      '<ul>{{#each suggestions}}<li data-keyword="{{value}}">{{value}}</li>{{/each}}</ul>';

    function createInOrder(ui, searchFieldFirst, autocompleteConf) {
      const createSearchField = () =>
        ui.searchField({ containerId: 'searchfield', autofocus: false });
      const createAutocomplete = () =>
        ui.autocomplete(
          Object.assign(
            { containerId: 'autocomplete', sources: [SUGGESTIONS_SOURCE] },
            autocompleteConf
          )
        );
      if (searchFieldFirst) {
        createSearchField();
        createAutocomplete();
      } else {
        createAutocomplete();
        createSearchField();
      }
    }

    [true, false].forEach((searchFieldFirst) => {
      const order = searchFieldFirst ? 'searchField first' : 'autocomplete first';

      it('points at an existing option with the default template (' + order + ')', () => {
        const ui = createUI();
        createInOrder(ui, searchFieldFirst, {});
        const field = getInput('searchfield');

        typeKeyword(field, 'water');
        pressArrowDown(field);
        const activeOptionId = field.getAttribute('aria-activedescendant');
        assert.strictEqual(activeOptionId, 'addsearch-suggestion-0');
        assert.ok(document.getElementById(activeOptionId));
      });

      it('is not set when a custom template has no option ids (' + order + ')', () => {
        const ui = createUI();
        createInOrder(ui, searchFieldFirst, { template: CUSTOM_AUTOCOMPLETE_TEMPLATE });
        const field = getInput('searchfield');

        typeKeyword(field, 'water');
        pressArrowDown(field);
        assert.strictEqual(field.getAttribute('aria-expanded'), 'true');
        assert.strictEqual(field.hasAttribute('aria-activedescendant'), false);
      });
    });
  });
});
