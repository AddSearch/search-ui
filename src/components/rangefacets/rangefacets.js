import './rangefacets.scss';
import handlebars from 'handlebars';
import { FACETS_TEMPLATE } from './templates';
import { toggleRangeFacetFilter} from '../../actions/filters';
import { observeStoreByKey } from '../../store';
import { validateContainer } from '../../util/dom';
import { createFilterObject } from "../filters/filterstateobserver";
import { clearFieldStats, setFieldStats } from "../../actions/fieldstats";
import { roundDownToNearestTenth, roundUpToNearestTenth } from "../../util/maths";
import { isEmpty } from "../../util/objects";
import PRECOMPILED_RANGE_FACETS_TEMPLATE from './precompile-templates/rangefacets.handlebars';


export default class RangeFacets {

  constructor(client, reduxStore, conf) {
    this.client = client;
    this.reduxStore = reduxStore;
    this.conf = conf;
    this.maxNumberOfRangeBuckets = this.conf.maxNumberOfRangeBuckets || 5;
    this.ranges = [];

    var IGNORE_RENDERING_ON_REQUEST_BY = [
      'component.loadMore',
      'component.pagination',
      'component.sortby'
    ];

    function _hasActiveFacet() {
      var activeRangeFacets = reduxStore.getState().filters.activeRangeFacets[conf.field];
      if (activeRangeFacets) {
        return !isEmpty(activeRangeFacets);
      } else {
        return false;
      }
    }

    function _buildRanges(min, max, numberOfBuckets) {
      const minTransformed =  roundDownToNearestTenth(min);
      const maxTransformed = roundUpToNearestTenth(max);
      const ranges = [];
      let current = minTransformed;
      const step = roundUpToNearestTenth((maxTransformed - minTransformed) / numberOfBuckets);
      for (var i = 0; i < numberOfBuckets; i++) {
        ranges.push({
          from: current,
          to: current + step
        });
        current += step;
      }
      return ranges;
    }

    function _buildActiveRanges(activeRangeFacets) {
      const ranges = [];
      for (const key in activeRangeFacets) {
        ranges.push({
          from: activeRangeFacets[key].gte,
          to: activeRangeFacets[key].lt
        });
      }
      return ranges;
    }

    if (validateContainer(conf.containerId)) {

      observeStoreByKey(this.reduxStore, 'search', (search) => {
        const isActive = _hasActiveFacet();

        if (!search.started || search.loading ||
          (search.callBy === this.conf.field && isActive) ||
          IGNORE_RENDERING_ON_REQUEST_BY.indexOf(search.callBy) > -1) {
          return;
        }

        if (!search.results.hits || !search.results.hits.length) {
          this.render();
          return;
        }

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

        if (!_hasActiveFacet()) {
          this.ranges = _buildRanges(fieldStats.min, fieldStats.max, this.maxNumberOfRangeBuckets);
        } else {
          this.ranges = _buildActiveRanges(this.reduxStore.getState().filters.activeRangeFacets[this.conf.field]);
        }

        var rangeFacetsOptions = {
          field: this.conf.field,
          ranges: this.ranges
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
    this.reduxStore.dispatch(clearFieldStats());

    const container = document.getElementById(this.conf.containerId);

    if (results) {
      // render data
      const data = {
        conf: this.conf,
        rangeFacets: results.rangeFacets[this.conf.field]
      };
      let html;
      if (this.conf.precompiledTemplate) {
        html = this.conf.precompiledTemplate(data);
      } else if (this.conf.template) {
        html = handlebars.compile(this.conf.template)(data);
      } else {
        html = PRECOMPILED_RANGE_FACETS_TEMPLATE(data);
      }
      container.innerHTML = html;
    } else {
      container.innerHTML = '';
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