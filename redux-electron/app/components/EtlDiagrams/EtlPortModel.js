import * as SRD from 'react-js-diagrams/lib/main';

export default class EtlPortModel extends SRD.PortModel {
  constructor({ id, name, type, label, isInput = true, isOutput = true, selected = false }) {
    super(name);
    this.id = id;
    this.in = isInput;
    this.out = isOutput;
    this.selectedout = selected;
    this.type = type;
    this.label = label || name;
  }

  deSerialize(object) {
    super.deSerialize(object);
    this.id = object.id;
    this.in = object.in;
    this.out = object.out;
    this.selected = object.selected;
    this.type = object.type;
    this.label = object.label;
  }

  serialize() {
    return {
      ...super.serialize(),
      in: this.in,
      out: this.out,
      label: this.label,
      selected: this.selected
    };
  }
}
