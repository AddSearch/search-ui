import { getStore, observeStoreByKey } from '../../store';
import { renderToContainer, validateContainer } from '../../util/dom';


export default class SegmentedResults {

  constructor(client, conf) {
    this.client = client;
    this.conf = conf;

    if (validateContainer(conf.containerId) && conf.template) {
      observeStoreByKey(getStore(), 'segmentedsearch', (data) => this.render(data));
    }
  }


  render(data) {
    renderToContainer(this.conf.containerId, this.conf.template, data);
  }
}