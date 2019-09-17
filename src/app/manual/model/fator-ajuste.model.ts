import { BaseEntity } from '../../shared';

export enum TipoFatorAjuste {
  'PERCENTUAL' = 'PERCENTUAL',
  'UNITARIO' = 'UNITARIO'
}
export enum ImpactoFatorAjuste {
  'INCLUSAO' = 'INCLUSAO',
  'ALTERACAO' = 'ALTERACAO',
  'EXCLUSAO' = 'EXCLUSAO',
  'CONVERSAO' = 'CONVERSAO',
  'ITENS_NAO_MENSURAVEIS' = 'ITENS_NAO_MENSURAVEIS'
}

export class FatorAjuste implements BaseEntity {

  constructor(
    public nome?: string,
    public fator?: number,
    public tipoAjuste?: TipoFatorAjuste,
    public id?: number,
    public ativo?: boolean,
    public descricao?: string,
    public codigo?: string,
    public impacto?: ImpactoFatorAjuste,
    public origem?: string,
    public artificialId?: number
  ) { }

  toJSONState(): FatorAjuste {
    return Object.assign({}, this);
  }

  copyFromJSON(json: any) {
    return new FatorAjuste(json.nome, json.fator, json.tipoAjuste
      , json.id, json.ativo, json.descricao, json.codigo, json.impacto
      , json.origem, json.artificialId);
  }

  clone(): FatorAjuste {
    return new FatorAjuste(this.nome, this.fator, this.tipoAjuste, this.id,
      this.ativo, this.descricao, this.codigo, this.impacto,
      this.origem, this.artificialId);
  }

  get fatorFormatado(): number {
    return this.fator;
  }

  set fatorFormatado(fator: number) {
    if (typeof fator === 'string') {
      fator = Number(fator);
    }
    this.fator = fator;
  }

  isPercentual(): boolean {
    return this.tipoAjuste === TipoFatorAjuste.PERCENTUAL;
  }

  isUnitario(): boolean {
    return this.tipoAjuste === TipoFatorAjuste.UNITARIO;
  }

  aplicarFator(pf: number): number {
    if (this.isUnitario()) {
      return this.fator;
    } else {
      return pf * this.fator;
    }
  }
}
