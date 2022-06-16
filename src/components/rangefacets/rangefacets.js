import './rangefacets.scss';
import handlebars from 'handlebars';
import { FACETS_TEMPLATE } from './templates';
import { toggleRangeFacetFilter} from '../../actions/filters';
import { observeStoreByKey } from '../../store';
import { validateContainer } from '../../util/dom';
import { createFilterObject } from "../filters/filterstateobserver";
import {setFieldStats} from "../../actions/fieldstats";
import { roundDownToNearestTenth, roundUpToNearestTenth } from "../../util/maths";


export default class RangeFacets {

  constructor(client, reduxStore, conf, baseFilters) {
    this.client = client;
    this.reduxStore = reduxStore;
    this.conf = conf;
    this.maxNumberOfRangeBuckets = this.conf.maxNumberOfRangeBuckets || 5;

    var IGNORE_RENDERING_ON_REQUEST_BY = [
      'component.loadMore',
      'component.pagination',
      'component.sortby'
    ];

    function _buildRanges(min, max, numberOfBuckets) {
      var minTransformed =  roundDownToNearestTenth(min);
      var maxTransformed = roundUpToNearestTenth(max);
      var ranges = [];
      var current = minTransformed;
      var step = Math.round((maxTransformed - minTransformed) / numberOfBuckets / 100) * 100;
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
        if (search.callBy === 'component.activeFilters') {
          this.handleCheckboxStates(true);
          return;
        }
        if (!search.started || search.loading || search.callBy === this.conf.field ||
          IGNORE_RENDERING_ON_REQUEST_BY.indexOf(search.callBy) > -1) {
          return;
        }

        const isActive = !!this.reduxStore.getState().filters.activeRangeFacets[this.conf.field];
        if (isActive) {
          const filterObjectCustom = createFilterObject(
            this.reduxStore.getState().filters,
            this.reduxStore.getState().configuration.baseFilters,
            this.conf.field
          );
          this.client.fetchCustomApi(this.conf.field, filterObjectCustom, res => {
            this.reduxStore.dispatch(setFieldStats(res.fieldStats));
          });
        } else {
          this.reduxStore.dispatch(setFieldStats(search.results.fieldStats));
        }

      });

      observeStoreByKey(this.reduxStore, 'fieldstats', (state) => {
        var fieldStats = state.fieldStats[this.conf.field];
        if (!fieldStats) {
          return;
        }
        if (!this.rangeMin || fieldStats.min < this.rangeMin) {
          this.rangeMin = fieldStats.min;
        }
        if (!this.rangeMax || fieldStats.max > this.rangeMax) {
          this.rangeMax = fieldStats.max;
        }

        var ranges = _buildRanges(this.rangeMin, this.rangeMax, this.maxNumberOfRangeBuckets);
        var rangeFacetsOptions = {
          field: this.conf.field,
          ranges: ranges
        };
        const filterObjectCustom = createFilterObject(
          this.reduxStore.getState().filters,
          this.reduxStore.getState().configuration.baseFilters,
          this.conf.field
        );

        this.client.fetchRangeFacets(rangeFacetsOptions, filterObjectCustom, res => {
          this.render(res);
        });
      });
    }
  }


  setRangeFilter(key, valueMin, valueMax) {
    // Dispatch facet and refresh search
    const values = {
      min: valueMin,
      max: valueMax
    };
    this.reduxStore.dispatch(toggleRangeFacetFilter(this.conf.field, values, key, true));
  }


  render(results) {

    const container = document.getElementById(this.conf.containerId);

    if (results) {
      // render data
      const data = {
        conf: this.conf,
        rangeFacets: results.rangeFacets[this.conf.field]
      };
      const html = handlebars.compile(this.conf.template || FACETS_TEMPLATE)(data);
      container.innerHTML = html;
      this.renderedHtml = html;
    }
    this.handleCheckboxStates(true);

  }

  handleCheckboxStates(attachEvent) {
    const container = document.getElementById(this.conf.containerId);
    const activeRangeFacets = this.getActiveRangeFacets(this.conf.field);
    const options = container.getElementsByTagName('input');
    for (let i=0; i<options.length; i++) {
      let checkbox = options[i];
      checkbox.checked = activeRangeFacets.indexOf(checkbox.value) !== -1;

      if (attachEvent) {
        checkbox.onchange = (e) => {
          this.setRangeFilter(
            e.target.value,
            e.target.getAttribute('data-value-min'),
            e.target.getAttribute('data-value-max')
          );
        };
      }
    }
  }


  getActiveRangeFacets(facetField) {
    // Read active facets from redux state
    let activeRangeFacets = [];
    const activeRangeFacetState = this.reduxStore.getState().filters.activeRangeFacets;
    if (activeRangeFacetState[facetField]) {
      for (let value in activeRangeFacetState[facetField]) {
        activeRangeFacets.push(value);
      }
    }
    return activeRangeFacets;
  }
}