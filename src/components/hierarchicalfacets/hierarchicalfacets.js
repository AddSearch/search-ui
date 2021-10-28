import './hierarchicalfacets.scss';
import handlebars from 'handlebars';
import { FACETS_TEMPLATE, SUB_HIERARCHICAL_FACETS_TEMPLATE } from './templates';
import { toggleHierarchicalFacetFilter } from '../../actions/filters';
import { search } from '../../actions/search';
import { observeStoreByKey } from '../../store';
import { validateContainer } from '../../util/dom';
import {createFilterObjectWithoutFacetGroup} from "../filters/customfilters";


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

    handlebars.registerPartial('subHierarchicalFacetsTemplate',
      this.conf.template_subHierarchicalFacetsTemplate || SUB_HIERARCHICAL_FACETS_TEMPLATE);
    handlebars.registerHelper('validateOpenState', function(value) {
      return reduxStore.getState().filters.openedHierarchicalFacetGroups.indexOf(value) === -1;
    });

    // update state.filters.hierarchicalFacetConfFields
    this.reduxStore

    if (validateContainer(conf.containerId)) {

      observeStoreByKey(this.reduxStore, 'search', (search) => {
        var activeFacets = this.reduxStore.getState().filters.activeHierarchicalFacets[this.conf.containerId];
        if (search.loading || IGNORE_RENDERING_ON_REQUEST_BY.indexOf(search.callBy) > -1) {
          return;
        }
        if (_isAllEmpty(activeFacets, this.conf.fields)) {
          this.render(search);
        } else {
          var filterObjectCustom = createFilterObjectWithoutFacetGroup(
            this.reduxStore.getState().filters, baseFilters, this.conf.fields);
          
          if (this.conf.fields.indexOf(search.callBy) === -1) {
            window.console.log('+++ log 1');
            client.fetchCustomApi(this.conf.field, filterObjectCustom, res => {
              this.render(res, true);
            })
          } else {
            var container = document.getElementById(this.conf.containerId);
            this._updateCheckBoxes(container,
              this.getActiveFacets(this.conf.fields, this.conf.containerId),
              false,
              this.reduxStore.getState().filters.indeterminateHierarchicalFacets);
          }
        }
      });

      // update state.filters.hierarchicalFacetConfFields
      this.reduxStore.getState().filters.hierarchicalFacetConfFields[conf.containerId] = conf.fields;
    }
  }


  setFilter(value, field) {
    // Dispatch facet and refresh search
    this.reduxStore.dispatch(toggleHierarchicalFacetFilter(
      field, this.conf.containerId, this.conf.fields, value, true
    ));
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
    }


    // Read active facets from redux state
    const activeFacets = this.getActiveFacets(confFacetFields, this.conf.containerId);


    // Sticky facets (i.e. not updating if keyword is unchanged)
    if (this.conf.sticky === true && !this.conf.advancedSticky) {
      // Keyword has changed, facets are not saved yet, or no selected facets. Show new incoming facets
      if (this.keyword !== search.keyword || !this.stickyFacets || activeFacets.length === 0) {
        this.keyword = search.keyword;
        this.stickyFacets = facets;
      }
      // Keyword not changed. Show old facets
      else {
        facets = this.stickyFacets;
      }
    }

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
    const html = handlebars.compile(this.conf.template || FACETS_TEMPLATE)(data);
    if (this.renderedHtml === html && activeFacets === this.renderedActiveFacets) {
      return;
    }
    this.renderedActiveFacets = activeFacets;

    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;
    this.renderedHtml = html;

    this._updateCheckBoxes(container, activeFacets, true, this.reduxStore.getState().filters.indeterminateHierarchicalFacets);

    // Attach events - expansion arrows
    const arrows = container.getElementsByClassName('addsearch-facet-group-expansion-arrow');
    for (let i=0; i<arrows.length; i++) {
      arrows[i].addEventListener('click', () => {
        arrows[i].parentNode.classList.toggle('shrink');
        this._toggleFacetGroupOpenState(arrows[i].parentNode.getAttribute('data-facet'));
      });
    }
  }


  getActiveFacets(facetFields, containerId) {
    // Read active facets from redux state
    let activeFacets = [];
    const activeFacetState = this.reduxStore.getState().filters.activeHierarchicalFacets;
    facetFields.forEach(function(facetField) {
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
    for (let i=0; i<options.length; i++) {
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