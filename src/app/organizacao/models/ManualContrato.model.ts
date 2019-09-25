import { JSONable, BaseEntity } from '../../shared';
import { Manual } from '../../manual/model/manual.model';

export class ManualContrato implements BaseEntity, JSONable<ManualContrato> {

    constructor(
        public id?: number,
        public artificialId?: number,
        public manual?: Manual,
        public dataInicioVigencia?: Date,
        public dataFimVigencia?: Date,
        public ativo?: boolean,
        public manualId?: number
    ) { }

    toJSONState(): ManualContrato {
        const copy: ManualContrato = this.clone();
        copy.manualId = this.manual.id;
        copy.manual = null;
        return copy;
    }

    copyFromJSON(json: any) {
        const manualContrato = new ManualContrato(json.id, null, new Manual(json.manualId, json.nomeManual)
            , new Date(json.dataInicioVigencia), new Date(json.dataFimVigencia), json.ativo, json.manualId);
        return manualContrato;
    }

    clone(): ManualContrato {
        return new ManualContrato(this.id, this.artificialId, this.manual,
            this.dataInicioVigencia, this.dataFimVigencia, this.ativo, this.manualId);
    }

}
