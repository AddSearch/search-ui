import './recommendations.scss';
import { RECO_FBT_TEMPLATE } from './templates';
import handlebars from 'handlebars';
import { observeStoreByKey } from '../../store';
import { validateContainer } from '../../util/dom';
import { clearRecommendation } from "../../actions/recommendations";
import { RECOMMENDATION_TYPE } from "./index";
import PRECOMPILED_PAGINATION_TEMPLATE from "../pagination/precompile-templates/pagination.handlebars";

export const TYPE_FREQUENTLY_BOUGHT_TOGETHER = RECOMMENDATION_TYPE.FREQUENTLY_BOUGHT_TOGETHER;
export const TYPE_RELATED_ITEMS = RECOMMENDATION_TYPE.RELATED_ITEMS;
export default class Recommendations {

  constructor(client, reduxStore, conf, recommendationSettings) {
    this.client = client;
    this.conf = conf;
    this.reduxStore = reduxStore;
    recommendationSettings.push(conf);

    if (validateContainer(conf.containerId)) {
      observeStoreByKey(this.reduxStore, 'recommendation', (res) => {
        if (res.container === conf.containerId) {
          this.render(res);
        }
      });
    }
  }

  render(state) {
    const data = state.results || {};
    let template = this.conf.template || RECO_FBT_TEMPLATE;

    // Compile HTML and inject to element if changed
    let html;
    if (this.conf.precompiledTemplate) {
      html = this.conf.precompiledTemplate(data);
    } else {
      template = this.conf.template || RECO_FBT_TEMPLATE
      html = handlebars.compile(template)(data);
    }

    if (this.renderedHtml === html) {
      return;
    }
    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;
    this.renderedHtml = html;

    // Clear recommendation state
    this.reduxStore.dispatch(clearRecommendation());
  }
}
