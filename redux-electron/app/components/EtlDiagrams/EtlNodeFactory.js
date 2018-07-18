import React from 'react';
import * as SRD from 'react-js-diagrams/lib/main';
import EtlNodeWidget from './EtlNodeWidget';

export default class EtlNodeFactory extends SRD.NodeWidgetFactory {
  constructor() {
    super('EtlNodeModel');
    this.WidgetFactory = React.createFactory(EtlNodeWidget);
  }

  generateReactWidget(diagramEngine, node) {
    return this.WidgetFactory({ diagramEngine, node, v: new Date() });
    // return <EtlNodeWidget node={node} diagramEngine={diagramEngine} />;
  }
}
