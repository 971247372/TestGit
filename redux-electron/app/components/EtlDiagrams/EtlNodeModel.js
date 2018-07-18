import * as SRD from 'react-js-diagrams/lib/main';
import _ from 'lodash';

export class EtlNodeInstanceFactory extends SRD.NodeModel {
  constructor() {
    super('EtlNodeModel');
  }

  getInstance() {
    return new EtlNodeModel();
  }
}

export default class EtlNodeModel extends SRD.NodeModel {
  constructor(id, name = 'Untitled', dsId, type, actions, isLoading = false) {
    super('EtlNodeModel');
    this.id = id;
    this.name = name;
    this.dsId = dsId;
    this.type = type;
    this.actions = actions;
    this.isLoading = isLoading;
  }

  deSerialize(object) {
    super.deSerialize(object);
    this.id = object.id;
    this.name = object.name;
    this.dsId = object.dsId;
    this.type = object.type;
    this.actions = object.actions;
    this.isLoading = object.isLoading;
  }

  serialize() {
    return _.merge(super.serialize(), {
      name: this.name,
      // color: this.color,
    });
  }
}

