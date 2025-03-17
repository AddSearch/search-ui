import handlebars from 'handlebars';
import { observeStoreByKey } from '../../store';
import { validateContainer } from '../../util/dom';
import { addClickTrackers } from '../../util/analytics';

export default class SegmentedResults {
  constructor(client, reduxStore, conf) {
    this.client = client;
    this.reduxStore = reduxStore;
    this.conf = conf;

    if (validateContainer(conf.containerId) && (conf.template || conf.precompiledTemplate)) {
      observeStoreByKey(this.reduxStore, 'segmentedsearch', (data) => this.render(data));
    }
    this.client.setCollectAnalytics(false);
  }

  render(data) {
    // Don't re-render while API requests are pending
    if (data.pendingSegments.length !== 0) {
      return;
    }

    // Compile HTML and inject to element if changed
    let html;
    if (this.conf.precompiledTemplate) {
      html = this.conf.precompiledTemplate(data);
    } else {
      html = handlebars.compile(this.conf.template)(data);
    }
    if (this.renderedHtml === html) {
      return;
    }
    const container = document.getElementById(this.conf.containerId);
    container.innerHTML = html;
    this.renderedHtml = html;

    // Send result clicks to analytics
    const links = container.querySelectorAll('[data-analytics-click]');
    addClickTrackers(this.client, links, data[this.conf.containerId]);
  }
}
