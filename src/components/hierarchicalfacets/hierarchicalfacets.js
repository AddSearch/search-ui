import './hierarchicalfacets.scss';
import handlebars from 'handlebars';
import { toggleHierarchicalFacetFilter } from '../../actions/filters';
import { observeStoreByKey } from '../../store';
import { validateContainer } from '../../util/dom';
import { createFilterObject } from '../filters/filterstateobserver';
import PRECOMPILED_HIERARCHICAL_FACETS_TEMPLATE from './precompile-templates/hierarchical_facets.handlebars';
import { registerHelper, registerPartial } from '../../util/handlebars';
import SUB_HIERARCHICAL_FACETS_TEMPLATE from './precompile-templates/subHierarchicalFacetsTemplate.handlebars';

export default class HierarchicalFacets {
  constructor(client, reduxStore, conf, baseFilters) {
    this.client = client;
    this.reduxStore = reduxStore;
    this.conf = conf;

    function _isEmpty(obj) {
      return !obj ? true : Object.keys(obj).length === 0;
    }

    function _isAllEmpty(activeFacets, fields) {
      let isAllEmpty = true;
      if (!activeFacets) {
        return isAllEmpty;
      }
      fields.forEach((field) => {
        if (!_isEmpty(activeFacets[field])) {
          isAllEmpty = false;
        }
      });

      return isAllEmpty;
    }

    var IGNORE_RENDERING_ON_REQUEST_BY = [
      'component.loadMore',
      'component.pagination',
      'component.sortby'
    ];

    const subHierarchicalFacetsTemplate =
      this.conf.template_subHierarchicalFacetsTemplate || SUB_HIERARCHICAL_FACETS_TEMPLATE;
    registerPartial('subHierarchicalFacetsTemplate', subHierarchicalFacetsTemplate);

    registerHelper('isCollapsed', function (value) {
      return reduxStore.getState().filters.openedHierarchicalFacetGroups.indexOf(value) === -1;
    });

    if (validateContainer(conf.containerId)) {
      observeStoreByKey(this.reduxStore, 'search', (search) => {
        var activeFacets =
          this.reduxStore.getState().filters.activeHierarchicalFacets[this.conf.containerId];
        if (search.loading || IGNORE_RENDERING_ON_REQUEST_BY.indexOf(search.callBy) > -1) {
          return;
        }
        if (_isAllEmpty(activeFacets, this.conf.fields) || !search.results.hits.length) {
          this.render(search);
        } else {
          var filterObjectCustom = createFilterObject(
            this.reduxStore.getState().filters,
            baseFilters,
            this.conf.fields
          );

          if (this.conf.fields.indexOf(search.callBy) === -1) {
            client.fetchCustomApi(this.conf.field, filterObjectCustom, (res) => {
              this.render(res, true);
            });
          } else {
            var container = document.getElementById(this.conf.containerId);
            this._updateCheckBoxes(
              container,
              this.getActiveFacets(this.conf.fields, this.conf.containerId),
              false,
              this.reduxStore.getState().filters.indeterminateHierarchicalFacets
            );
          }
        }
      });
    }
  }

  setFilter(value, field) {
    // Dispatch facet and refresh search
    this.reduxStore.dispatch(
      toggleHierarchicalFacetFilter(field, this.conf.containerId, this.conf.fields, value, true)
    );
  }

  render(search, isStickyFacetsRenderer) {
    if (search.loading) {
      return;
    }

    const confFacetFields = this.conf.fields;
    const results = isStickyFacetsRenderer ? search : search.results;

    // Facets in search results
    let facets = [];
    if (results && results.hierarchicalFacets && results.hierarchicalFacets[confFacetFields[0]]) {
      facets = results.hierarchicalFacets[confFacetFields[0]];
      facets = facets.map((facet) => {
        facet.field = facet.field.replace('hierarchical_facet.', '');
        return facet;
      });
    }

    // Read active facets from redux state
    const activeFacets = this.getActiveFacets(confFacetFields, this.conf.containerId);

    // Possible filtering function to remove unwanted facets
    if (this.conf.facetsFilter) {
      facets = this.conf.facetsFilter(facets);
    }

    // Render
    const data = {
      conf: this.conf,
      facets: facets
    };

    // Compile HTML and inject to element if changed
    let html;
    if (this.conf.precompiledTemplate) {
      html = this.conf.precompiledTemplate(data);
    } else if (this.conf.template) {
      html = handlebars.compile(this.conf.template)(data);
    } else {
      html = PRECOMPILED_HIERARCHICAL_FACETS_TEMPLATE(data);
    }
    if (this.renderedHtml === html && activeFacets === this.renderedActiveFacets) {
      return;
    }
    this.renderedActiveFacets = activeFacets;

    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;
    this.renderedHtml = html;

    this._updateCheckBoxes(
      container,
      activeFacets,
      true,
      this.reduxStore.getState().filters.indeterminateHierarchicalFacets
    );

    // Attach events - expansion arrows
    const arrows = container.getElementsByClassName('addsearch-facet-group-expansion-arrow');
    for (let i = 0; i < arrows.length; i++) {
      arrows[i].addEventListener('click', () => {
        const facetWrap = arrows[i].parentNode.parentNode;
        facetWrap.classList.toggle('shrink');
        this._toggleFacetGroupOpenState(facetWrap.getAttribute('data-facet'));

        // Update aria-expanded state
        const isExpanded = arrows[i].getAttribute('aria-expanded') === 'true';
        arrows[i].setAttribute('aria-expanded', !isExpanded);

        // Update aria-label
        const displayValue = arrows[i].getAttribute('aria-label').replace(/^(Expand|Collapse) /, '');
        arrows[i].setAttribute('aria-label', (isExpanded ? 'Expand ' : 'Collapse ') + displayValue);
      });
    }
  }

  getActiveFacets(facetFields, containerId) {
    // Read active facets from redux state
    let activeFacets = [];
    const activeFacetState = this.reduxStore.getState().filters.activeHierarchicalFacets;
    facetFields.forEach(function (facetField) {
      if (activeFacetState[containerId] && activeFacetState[containerId][facetField]) {
        for (let value in activeFacetState[containerId][facetField]) {
          activeFacets.push(value);
        }
      }
    });
    return activeFacets;
  }

  _toggleFacetGroupOpenState(facetGroup) {
    const facetGroupOpenState = this.reduxStore.getState().filters.openedHierarchicalFacetGroups;
    const position = facetGroupOpenState.indexOf(facetGroup);
    if (position === -1) {
      facetGroupOpenState.push(facetGroup);
    } else {
      facetGroupOpenState.splice(position, 1);
    }
  }

  _updateCheckBoxes(container, activeFacets, onChangeSet, indeterminateFacets) {
    const options = container.getElementsByTagName('input');
    for (let i = 0; i < options.length; i++) {
      let checkbox = options[i];
      checkbox.checked = activeFacets.indexOf(checkbox.value) !== -1;
      checkbox.indeterminate = indeterminateFacets.indexOf(checkbox.value) > -1;

      if (onChangeSet) {
        checkbox.onchange = (e) => {
          this.setFilter(e.target.value, e.target.getAttribute('data-field'));
        };
      }
    }
  }
}
