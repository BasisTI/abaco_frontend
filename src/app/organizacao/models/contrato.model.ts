import { ManualContrato } from './ManualContrato.model';
import { BaseEntity, JSONable, MappableEntities } from '../../shared';

export class Contrato implements BaseEntity, JSONable<Contrato> {

  private mappableManualContrato: MappableEntities<ManualContrato>;

  constructor(
    public id?: number,
    public numeroContrato?: String,
    public dataInicioVigencia?: Date,
    public dataFimVigencia?: Date,
    public ativo?: boolean,
    public diasDeGarantia?: number,
    public artificialId?: number,
    public manuaisContrato?: ManualContrato[],
  ) {
    if (manuaisContrato) {
      this.mappableManualContrato = new MappableEntities<ManualContrato>(manuaisContrato);
    } else {
      this.manuaisContrato = [];
      this.mappableManualContrato = new MappableEntities<ManualContrato>();
    }
  }

  toJSONState(): Contrato {
    const copy: Contrato = this.clone();
    copy.manuaisContrato = copy.manuaisContrato.map(mc => mc.toJSONState());
    return copy;
  }


  copyFromJSON(json: any) {
    if (json) {
      let manuaisContrato: ManualContrato[] = [];
      if (json.manuaisContrato) {
        manuaisContrato = json.manuaisContrato.map(
          mc => ManualContrato.prototype.copyFromJSON(mc)
        );
      }
      return new Contrato(json.id, json.numeroContrato, new Date(json.dataInicioVigencia),
        new Date(json.dataFimVigencia), json.ativo, json.diasDeGarantia, null, manuaisContrato);
    }
  }

  persistManualContrato(manualContrato: ManualContrato) {
    if (!manualContrato.id && !manualContrato.artificialId) {
      this.addManualContrato(manualContrato);
    } else {
      this.updateManualContrato(manualContrato);
    }
  }

  addManualContrato(manualContrato: ManualContrato) {
    this.mappableManualContrato.push(manualContrato);
    this.manuaisContrato = this.mappableManualContrato.values();
  }

  updateManualContrato(manualContrato: ManualContrato) {
    this.mappableManualContrato.update(manualContrato);
    this.manuaisContrato = this.mappableManualContrato.values();
  }

  deleteManualContrato(manualContrato: ManualContrato) {
    this.mappableManualContrato.delete(manualContrato);
    this.manuaisContrato = this.mappableManualContrato.values();
  }

  clone(): Contrato {
    return new Contrato(this.id, this.numeroContrato, this.dataInicioVigencia,
      this.dataFimVigencia, this.ativo, this.diasDeGarantia, this.artificialId, this.manuaisContrato);
  }

  dataInicioValida(): boolean {
    if (this.dataInicioVigencia != null && this.dataFimVigencia != null)
      return this.dataInicioVigencia.getTime() < this.dataFimVigencia.getTime();
  }
}
