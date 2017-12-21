import { BaseEntity } from '../shared';


export class Organizacao implements BaseEntity {

  constructor(
    public id?: number,
    public sigla?: string,
    public nome?: string,
    public cnpj?: string,
    public ativo?: boolean,
    public numeroOcorrencia?: string,
    public contracts?: BaseEntity[],
    public sistemas?: BaseEntity[],
  ) {}

  addContrato(contrato: BaseEntity) {
    if(!this.contracts)
      this.contracts = [];
    this.contracts.push(contrato);
  }

}