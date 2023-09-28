import './rangefacets.scss';
import handlebars from 'handlebars';
import { FACETS_TEMPLATE, RANGE_SLIDER_TEMPLATE } from './templates';
import { setActiveRangeFacets, toggleRangeFacetFilter } from '../../actions/filters';
import { observeStoreByKey } from '../../store';
import { validateContainer } from '../../util/dom';
import { createFilterObject } from "../filters/filterstateobserver";
import { clearFieldStats, setFieldStats } from "../../actions/fieldstats";
import { roundDownToNearestTenth, roundUpToNearestTenth } from "../../util/maths";
import { isEmpty } from "../../util/objects";
import { RANGE_FACETS_TYPE } from './index';
import UiRangeSlider from "../../util/sliders";


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

    // todo: remove this helper
    handlebars.registerHelper('alterRangeFacetsResults', function (results) {
      if (results) {
        return results;
      }
    });

    if (this.conf.type === RANGE_FACETS_TYPE.SLIDER) {
      this.maxNumberOfRangeBuckets = 1;
      this.conf.styles = this.conf.styles || {
        trackColor: '#C6C6C6',
        progressColor: '#25daa5'
      };
    }

    function _hasActiveFacet() {
      var activeRangeFacets = reduxStore.getState().filters.activeRangeFacets[conf.field];
      if (activeRangeFacets) {
        return !isEmpty(activeRangeFacets);
      } else {
        return false;
      }
    }

    function _buildRanges(min, max, numberOfBuckets) {
      const minTransformed = min >= 0 ? roundDownToNearestTenth(min) : roundUpToNearestTenth(min * -1) * -1;
      const maxTransformed = max >= 0 ? roundUpToNearestTenth(max) : roundDownToNearestTenth(max * -1) * -1;
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
          this.renderClear();
          return;
        }

        if (isActive && this.conf.type === RANGE_FACETS_TYPE.SLIDER) {
          var activeSliderRangeArray = this.getActiveRangeFacets(this.conf.field)[0].split('-');
          this.reduxStore.dispatch(setFieldStats({
            [this.conf.field]: {
              min: activeSliderRangeArray[0],
              max: activeSliderRangeArray[1]
            }
          }));
        } else if (isActive) {
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

        if (this.conf.type === RANGE_FACETS_TYPE.SLIDER) {
          this.renderRangeSlider(state);
          return;
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

  setRangeSlider(activeRange) {
    this.reduxStore.dispatch(setActiveRangeFacets(
      buildRangeFacetsJson(this.conf.field, activeRange[0], activeRange[1]),
      true,
      this.conf.field
      )
    );
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
      const html = handlebars.compile(this.conf.template || FACETS_TEMPLATE)(data);
      container.innerHTML = html;
    } else {
      container.innerHTML = '';
    }
    this.handleCheckboxStates(true);
  }

  renderClear() {
    this.reduxStore.dispatch(clearFieldStats());
    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = '';
  }

  renderRangeSlider(results) {
    const _this = this;
    const container = document.getElementById(this.conf.containerId);
    const data = {
      conf: this.conf,
    };

    const activeRangeFacets = this.getActiveRangeFacets(this.conf.field);
    data.sliderConfig = Object.assign({},
      getSliderRange(results, this.conf.field),
      getSelectedSliderRange(activeRangeFacets)
    );
    container.innerHTML = handlebars.compile(this.conf.template || RANGE_SLIDER_TEMPLATE)(data);

    UiRangeSlider.init(
      this.conf.containerId,
      function (data) {
        if (data.activeRange.length) {
          _this.setRangeSlider(data.activeRange);
        }
      },
      {
        styles: {
          trackColor: this.conf.styles.trackColor,
          progressColor: this.conf.styles.progressColor
        }
      }
    );

  }

  handleCheckboxStates(attachEvent) {
    const container = document.getElementById(this.conf.containerId);
    const activeRangeFacets = this.getActiveRangeFacets(this.conf.field);
    const options = container.getElementsByTagName('input');
    for (let i = 0; i < options.length; i++) {
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

export function getSliderRange(data, field) {
  if (!data.fieldStats && !data.fieldStats[field]) {
    return {min: null, max: null};
  }

  return {
    min: data.fieldStats[field].min,
    max: data.fieldStats[field].max
  };
}

export function getSelectedSliderRange(selectedFacetsGroup) {
  let min;
  let max;

  selectedFacetsGroup.forEach(strGroup => {
    const arrayGroup = strGroup.split('-').map(Number);
    const start = arrayGroup[0];
    const end = arrayGroup[1];
    if (min === undefined || start < min) {
      min = start;
    }
    if (max === undefined || end > max) {
      max = end;
    }
  });

  return {
    start: min,
    end: max
  };
}

export function buildRangeFacetsJson(field, valueStart, valueEnd) {
  const facetKey = `${valueStart}-${valueEnd}`;
  return {
    [field]: {
      [facetKey]: {
        "gte": valueStart,
        "lt": valueEnd
      }
    }
  }
}
