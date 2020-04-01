import { getStore, observeStoreByKey } from '../../store';
import { renderToContainer, validateContainer } from '../../util/dom';
import { addClickTrackers } from '../../util/analytics';

export default class SegmentedResults {

  constructor(client, conf) {
    this.client = client;
    this.conf = conf;

    if (validateContainer(conf.containerId) && conf.template) {
      observeStoreByKey(getStore(), 'segmentedsearch', (data) => this.render(data));
    }
  }


  render(data) {
    // Don't re-render while API requests are pending
    if (data.pendingSegments.length !== 0) {
      return;
    }

    const container = renderToContainer(this.conf.containerId, this.conf.template, data);

    // Send result clicks to analytics
    const links = container.querySelectorAll('[data-analytics-click]');
    addClickTrackers(this.client, links, data);
  }
}