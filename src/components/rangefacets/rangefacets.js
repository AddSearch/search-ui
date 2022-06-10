import './rangefacets.scss';
import handlebars from 'handlebars';
import { FACETS_TEMPLATE } from './templates';
import {toggleFacetFilter, toggleRangeFacetFilter} from '../../actions/filters';
import { observeStoreByKey } from '../../store';
import { validateContainer } from '../../util/dom';
import {createFilterObject} from "../filters/filterstateobserver";


export default class RangeFacets {

  constructor(client, reduxStore, conf, baseFilters) {
    this.client = client;
    this.reduxStore = reduxStore;
    this.conf = conf;

    function _isEmpty(obj) {
      return !obj ? true : Object.keys(obj).length === 0;
    }

    function _buildRanges(min, max, numberOfBuckets) {
      var ranges = [];
      var current = min;
      var step = Math.round((max - min) / numberOfBuckets / 100) * 100;
      for (var i = 0; i < numberOfBuckets; i++) {
        ranges.push({
          from: current,
          to: current + step
        });
        current += step;
      }
      return ranges;
    }

    if (validateContainer(conf.containerId)) {

      observeStoreByKey(this.reduxStore, 'search', (search) => {
        // this.render(search);
        if (search.started && !search.loading) {
          var fieldStats = search.results.fieldStats[this.conf.field];
          var ranges = _buildRanges(fieldStats.min, fieldStats.max, 5);
          var rangeFacetsOptions = {
            field: this.conf.field,
            ranges: ranges
          };

          // this.client.addRangeFacet(this.conf.field, ranges);

          this.client.fetchRangeFacets(rangeFacetsOptions, res => {
            this.render(res);
          });

          // var filterObjectCustom = createFilterObject(
          //   this.reduxStore.getState().filters, baseFilters, this.conf.field);
          //
          // rangeFacetClient.fetchCustomApi(this.conf.field, filterObjectCustom, res => {
          //   this.render(res);
          // })
        }
      });
    }
  }


  setRangeFilter(valueMin, valueMax) {
    // Dispatch facet and refresh search
    console.log(valueMin, valueMax);
    const values = {
      min: valueMin,
      max: valueMax
    };
    this.reduxStore.dispatch(toggleRangeFacetFilter(this.conf.field, values, true));
  }


  render(results) {

    // Render
    const data = {
      conf: this.conf,
      rangeFacets: results.rangeFacets[this.conf.field]
    };

    // Compile HTML and inject to element if changed
    const html = handlebars.compile(this.conf.template || FACETS_TEMPLATE)(data);

    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;
    this.renderedHtml = html;


    // Attach events
    const options = container.getElementsByTagName('input');
    for (let i=0; i<options.length; i++) {
      let checkbox = options[i];
      // checkbox.checked = activeFacets.indexOf(checkbox.value) !== -1;

      checkbox.onchange = (e) => {
        this.setRangeFilter(e.target.getAttribute('data-value-min'),
          e.target.getAttribute('data-value-max'));
      };
    }

  }


  getActiveFacets(facetField) {
    // Read active facets from redux state
    let activeFacets = [];
    const activeFacetState = this.reduxStore.getState().filters.activeFacets;
    if (activeFacetState[facetField]) {
      for (let value in activeFacetState[facetField]) {
        activeFacets.push(value);
      }
    }
    return activeFacets;
  }
}