/* global window */
import { WARMUP_QUERY_PREFIX } from '../index';
import { setHistory, HISTORY_PARAMETERS } from '../util/history';
import { sendSearchStats } from '../util/analytics';
import { TYPE_FREQUENTLY_BOUGHT_TOGETHER, TYPE_RELATED_ITEMS } from "../components/recommendations/recommendations";

export const FETCH_RECO_FBT = 'FETCH_RECO_FBT';
export const FETCH_RELATED_ITEMS = 'FETCH_RELATED_ITEMS';
export const CLEAR_RECOMMENDATION = 'CLEAR_RECOMMENDATION';

export function recommend(client, options) {
  return dispatch => {
    switch (options.type) {
      case TYPE_FREQUENTLY_BOUGHT_TOGETHER:
        client.recommendations(options, (res) => {
          dispatch(fetchRecoFbt(options.container, res))
        });
        break;

      case TYPE_RELATED_ITEMS:
        client.recommendations(options, (res) => {
          dispatch(fetchRelatedItems(options.container, res))
        });
        break;

      default:
        break;
    }
  };
}

export function fetchRecoFbt(container, results) {
  return {
    type: FETCH_RECO_FBT,
    container: container,
    recommendType: 'frequently-bought-together',
    results: results
  }
}

export function fetchRelatedItems(container, results) {
  return {
    type: FETCH_RELATED_ITEMS,
    container: container,
    recommendType: 'related-items',
    results: results
  }
}

export function clearRecommendation() {
  return {
    type: CLEAR_RECOMMENDATION
  }
}
