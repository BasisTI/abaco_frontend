import { BaseEntity } from '../shared';
import { Modulo } from '../modulo';

export class Funcionalidade implements BaseEntity {

  constructor(
    public id?: number,
    public nome?: string,
    public modulo?: Modulo,
    public funcaoDados?: BaseEntity,
    public funcaoTransacao?: BaseEntity,
  ) {}

  static toNonCircularJson(f: Funcionalidade): Funcionalidade {
    return new Funcionalidade(f.id, f.nome, undefined);
  }
}
