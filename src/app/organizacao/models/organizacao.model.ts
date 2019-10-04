import { BaseEntity, MappableEntities, JSONable } from '../../shared';
import { Contrato } from '../';

export class Organizacao implements BaseEntity, JSONable<Organizacao> {

  private mappableContracts: MappableEntities<Contrato>;

  constructor(
    public id?: number,
    public sigla?: string,
    public nome?: string,
    public cnpj?: string,
    public logoId?: number,
    public ativo?: boolean,
    public numeroOcorrencia?: string,
    public contratos?: Contrato[],
    public sistemas?: BaseEntity[],
  ) {
    if (contratos) {
      this.mappableContracts = new MappableEntities<Contrato>(contratos);
    } else {
      this.contratos = [];
      this.mappableContracts = new MappableEntities<Contrato>();
    }
  }

  toJSONState(): Organizacao {
    const copy: Organizacao = this.clone();
    copy.contratos = copy.contratos.map(contrato => contrato.toJSONState());
    return copy;
  }

  copyFromJSON(json: any) {
    const contratos: Contrato[] = json.contratos ? json.contratos.map(c =>  Contrato.prototype.copyFromJSON(c)) : [];
    const newOrganizacao = new Organizacao(json.id, json.sigla, json.nome,
      json.cnpj, json.logoId, json.ativo, json.numeroOcorrencia, contratos);
    return newOrganizacao;
  }

  persistContrato(contrato: Contrato) {
    if (!contrato.id && !contrato.artificialId) {
      this.addContrato(contrato);
    } else {
      this.updateContrato(contrato);
    }
  }

  addContrato(contrato: Contrato) {
    this.mappableContracts.push(contrato);
    this.contratos = this.mappableContracts.values();
  }

  updateContrato(contrato: Contrato) {
    this.mappableContracts.update(contrato);
    this.contratos = this.mappableContracts.values();
  }

  deleteContrato(contrato: Contrato) {
    this.mappableContracts.delete(contrato);
    this.contratos = this.mappableContracts.values();
  }

  clone() {
    return new Organizacao(this.id, this.sigla, this.nome, this.cnpj, this.logoId
      , this.ativo, this.numeroOcorrencia, this.contratos);
  }

}
