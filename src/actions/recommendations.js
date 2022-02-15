/* global window */
import { WARMUP_QUERY_PREFIX } from '../index';
import { setHistory, HISTORY_PARAMETERS } from '../util/history';
import { sendSearchStats } from '../util/analytics';
import { TYPE_FREQUENTLY_BOUGHT_TOGETHER } from "../components/recommendations/recommendations";

export const FETCH_RECO_FBT = 'FETCH_RECO_FBT';
export const CLEAR_RECOMMENDATION = 'CLEAR_RECOMMENDATION';

export function recommend(client, options) {
  return dispatch => {
    switch (options.type) {
      case TYPE_FREQUENTLY_BOUGHT_TOGETHER:
        client.recommendations(options, (res) => {
          dispatch(fetchRecoFbt(options.container, res))
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

export function clearRecommendation() {
  return {
    type: CLEAR_RECOMMENDATION
  }
}
