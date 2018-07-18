import React from 'react';
import * as SRD from 'react-js-diagrams/lib/main';
import EtlLinkWidget from './EtlLinkWidget';

export default class EtlLinkFactory extends SRD.LinkWidgetFactory {
  constructor() {
    super('default');
    this.WidgetFactory = React.createFactory(EtlLinkWidget);
  }

  generateReactWidget(diagramEngine, link) {
    return this.WidgetFactory({ diagramEngine, link });
    // return <EtlLinkWidget link={link} diagramEngine={diagramEngine} />;
  }
}
