import './recommendations.scss';
import { RECO_FBT_TEMPLATE } from './templates';
import handlebars from 'handlebars';
import { observeStoreByKey } from '../../store';
import { validateContainer } from '../../util/dom';
import { clearRecommendation } from "../../actions/recommendations";

export const TYPE_FREQUENTLY_BOUGHT_TOGETHER = 'FREQUENTLY_BOUGHT_TOGETHER';
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
    const html = handlebars.compile(template)(data);
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
