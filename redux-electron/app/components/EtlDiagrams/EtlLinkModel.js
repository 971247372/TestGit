import * as SRD from 'react-js-diagrams/lib/main';
import _ from 'lodash';

export class EtlNodeInstanceFactory extends SRD.LinkModel {
  constructor() {
    super('default');
  }

  getInstance() {
    return new EtlLinkModel();
  }
}

export default class EtlLinkModel extends SRD.LinkModel {
  constructor(linkType) {
    super('EtlLinkModel');
  }
}

