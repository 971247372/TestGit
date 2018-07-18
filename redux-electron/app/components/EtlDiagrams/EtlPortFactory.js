import * as SRD from 'react-js-diagrams/lib/main';
import EtlPortModel from './EtlPortModel';

export default class DiamondPortFactory extends SRD.AbstractInstanceFactory {
  constructor() {
    super('EtlPortModel');
  }

  getInstance() {
    return new EtlPortModel({ label: 'unknown', name: 'unknown', isInput: true, isOutput: true });
  }
}
