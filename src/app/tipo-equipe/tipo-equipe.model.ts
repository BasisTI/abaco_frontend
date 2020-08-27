import { User } from './../user/user.model';
import { BaseEntity } from '../shared';


export class TipoEquipe implements BaseEntity {

  constructor(
    public id?: number,
    public nome?: string,
    public nomeOrg?: string,
    public cfpsResponsavel?: User,
    public organizacoes?: BaseEntity[]
  ) {}
}
