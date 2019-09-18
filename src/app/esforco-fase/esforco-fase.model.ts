import { BaseEntity, JSONable } from '../shared';
import { Fase } from '../fase';

export class EsforcoFase implements BaseEntity, JSONable<EsforcoFase> {
  constructor(
    public id?: number,
    public fase?: Fase,
    public esforco?: number,
    public artificialId?: number,
  ) {

  }

  copyFromJSON(json: any) {
    return new EsforcoFase(json.id, json.fase, json.esforco, undefined);
  }

  toJSONState(): EsforcoFase {
    const copy: EsforcoFase = Object.assign({}, this);
    return copy;
  }

  get esforcoFormatado(): number {
      return this.esforco;
  }

  set esforcoFormatado(esforco: number) {
    this.esforco = esforco;
  }

  clone(): EsforcoFase {
    return new EsforcoFase(this.id, this.fase, this.esforco, this.artificialId);
  }
}
