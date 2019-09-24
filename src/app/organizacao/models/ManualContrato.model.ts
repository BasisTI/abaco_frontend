import { JSONable, BaseEntity, MappableEntities } from '../../shared';
import { Contrato } from './contrato.model';
import { Manual } from '../../manual/model/manual.model';

export class ManualContrato implements BaseEntity, JSONable<ManualContrato> {

    constructor(
        public id?: any,
        public artificialId?: number,
        public manual?: Manual,
        public contratos?: Contrato,
        public dataInicioVigencia?: Date,
        public dataFimVigencia?: Date,
        public ativo?: boolean,
        public manualId?: number
    ) {}

    toJSONState(): ManualContrato {
        const copy: ManualContrato = Object.assign({}, this);
        copy.manualId = copy.manual.id;
        copy.manual = null;
        return copy;
    }

    copyFromJSON(json: any) {
        const manualContrato = new ManualContrato(json.id, null, null, json.contratos
            , new Date(json.dataInicioVigencia), new Date(json.dataFimVigencia), json.ativo, json.manualId);
        return manualContrato;
    }

    clone(): ManualContrato {
        return new ManualContrato(this.id, this.artificialId, this.manual,
            this.contratos, this.dataInicioVigencia, this.dataFimVigencia, this.ativo, this.manualId);
    }

}
